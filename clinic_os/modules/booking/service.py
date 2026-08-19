"""Business logic for appointment booking"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, or_, func
from uuid import uuid4
from datetime import datetime, timedelta, time
from typing import Optional, List, Tuple
import logging

from clinic_os.modules.booking.models import (
    ClinicHours, ClinicCapacity, Appointment, AppointmentReminder,
    AppointmentSlot, AppointmentStatus, ReminderStatus
)
from clinic_os.modules.booking.schemas import (
    AppointmentBookRequest, ClinicCapacityRequest
)
from clinic_os.core.audit import write_audit_log, AuditAction
from clinic_os.integrations.twilio_client import twilio_client

logger = logging.getLogger(__name__)


class BookingService:
    """Service for appointment booking and scheduling"""

    def __init__(self, session: AsyncSession, clinic_id: str):
        self.session = session
        self.clinic_id = clinic_id

    async def book_appointment(self, data: AppointmentBookRequest) -> Appointment:
        """
        Book an appointment for a patient

        Args:
            data: Appointment booking request

        Returns:
            Created Appointment record
        """
        # Validate appointment is not in past
        if data.appointment_date <= datetime.utcnow():
            raise ValueError("Appointment must be in the future")

        # Check if slot is available
        is_available = await self._check_slot_availability(
            doctor_id=data.doctor_id,
            appointment_time=data.appointment_date
        )

        if not is_available:
            raise ValueError("Selected time slot is not available")

        # Check capacity constraints
        await self._validate_booking_constraints(
            doctor_id=data.doctor_id,
            appointment_date=data.appointment_date
        )

        # Create appointment
        appointment = Appointment(
            id=uuid4(),
            clinic_id=self.clinic_id,
            patient_id=uuid4() if not data.patient_id else data.patient_id,
            doctor_id=uuid4() if not data.doctor_id else data.doctor_id,
            department=data.department,
            appointment_date=data.appointment_date,
            status=AppointmentStatus.SCHEDULED,
            reason_for_visit=data.reason_for_visit,
            notes=data.notes,
            confirmation_method=data.confirmation_method,
            source="booking",
        )

        self.session.add(appointment)
        await self.session.flush()

        # Mark slot as booked
        await self._mark_slot_booked(appointment.id, data.doctor_id, data.appointment_date)

        # Schedule reminders (24h and 1h before)
        await self._schedule_reminders(appointment)

        # Send confirmation message
        await self._send_booking_confirmation(appointment, data.patient_id)

        # Audit log
        await write_audit_log(
            session=self.session,
            clinic_id=self.clinic_id,
            action=AuditAction.APPOINTMENT_CREATED,
            resource_type="Appointment",
            resource_id=str(appointment.id),
            details={
                "patient_id": data.patient_id,
                "doctor_id": data.doctor_id,
                "appointment_date": data.appointment_date.isoformat(),
                "department": data.department,
            },
        )

        logger.info(f"Appointment created: {appointment.id} for patient {data.patient_id}")
        return appointment

    async def confirm_appointment(self, appointment_id: str) -> Appointment:
        """Confirm patient attendance for appointment"""
        result = await self.session.execute(
            select(Appointment).where(
                Appointment.clinic_id == self.clinic_id,
                Appointment.id == appointment_id,
            )
        )
        appointment = result.scalars().first()

        if not appointment:
            raise ValueError("Appointment not found")

        appointment.is_confirmed = True
        appointment.confirmed_at = datetime.utcnow()
        self.session.add(appointment)
        await self.session.flush()

        await write_audit_log(
            session=self.session,
            clinic_id=self.clinic_id,
            action=AuditAction.APPOINTMENT_UPDATED,
            resource_type="Appointment",
            resource_id=str(appointment.id),
            details={"action": "confirmed"},
        )

        return appointment

    async def reschedule_appointment(self, appointment_id: str, new_date: datetime) -> Appointment:
        """Reschedule appointment to new date/time"""
        if new_date <= datetime.utcnow():
            raise ValueError("New appointment must be in the future")

        result = await self.session.execute(
            select(Appointment).where(
                Appointment.clinic_id == self.clinic_id,
                Appointment.id == appointment_id,
            )
        )
        appointment = result.scalars().first()

        if not appointment:
            raise ValueError("Appointment not found")

        # Check if new slot is available
        is_available = await self._check_slot_availability(
            doctor_id=str(appointment.doctor_id),
            appointment_time=new_date
        )

        if not is_available:
            raise ValueError("Selected time slot is not available")

        # Update appointment
        old_date = appointment.appointment_date
        appointment.appointment_date = new_date
        appointment.status = AppointmentStatus.SCHEDULED
        self.session.add(appointment)
        await self.session.flush()

        # Update reminders
        await self._reschedule_reminders(appointment)

        await write_audit_log(
            session=self.session,
            clinic_id=self.clinic_id,
            action=AuditAction.APPOINTMENT_UPDATED,
            resource_type="Appointment",
            resource_id=str(appointment.id),
            details={
                "action": "rescheduled",
                "old_date": old_date.isoformat(),
                "new_date": new_date.isoformat(),
            },
        )

        return appointment

    async def cancel_appointment(self, appointment_id: str, reason: Optional[str] = None) -> Appointment:
        """Cancel appointment"""
        result = await self.session.execute(
            select(Appointment).where(
                Appointment.clinic_id == self.clinic_id,
                Appointment.id == appointment_id,
            )
        )
        appointment = result.scalars().first()

        if not appointment:
            raise ValueError("Appointment not found")

        appointment.status = AppointmentStatus.CANCELLED
        appointment.cancelled_at = datetime.utcnow()
        appointment.cancellation_reason = reason
        self.session.add(appointment)
        await self.session.flush()

        # Mark slot as available again
        await self._mark_slot_available(str(appointment.doctor_id), appointment.appointment_date)

        await write_audit_log(
            session=self.session,
            clinic_id=self.clinic_id,
            action=AuditAction.APPOINTMENT_UPDATED,
            resource_type="Appointment",
            resource_id=str(appointment.id),
            details={"action": "cancelled", "reason": reason},
        )

        return appointment

    async def get_available_slots(
        self,
        doctor_id: str,
        date_from: datetime,
        date_to: datetime,
    ) -> List[datetime]:
        """Get available appointment slots for a doctor"""
        slots = []

        # Get clinic hours
        result = await self.session.execute(
            select(ClinicHours).where(
                ClinicHours.clinic_id == self.clinic_id,
                ClinicHours.is_active == True,
            )
        )
        clinic_hours = {h.day_of_week: h for h in result.scalars().all()}

        # Get capacity settings
        result = await self.session.execute(
            select(ClinicCapacity).where(
                ClinicCapacity.clinic_id == self.clinic_id,
                or_(
                    ClinicCapacity.doctor_id == doctor_id,
                    ClinicCapacity.doctor_id == None,
                )
            )
        )
        capacity_settings = result.scalars().first()
        if not capacity_settings:
            capacity_settings = ClinicCapacity(
                clinic_id=self.clinic_id,
                doctor_id=doctor_id,
                slots_per_hour=4,
                appointment_duration_minutes=15,
            )

        # Get booked appointments
        result = await self.session.execute(
            select(Appointment).where(
                Appointment.clinic_id == self.clinic_id,
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_date.between(date_from, date_to),
                Appointment.status != AppointmentStatus.CANCELLED,
            )
        )
        booked_times = {a.appointment_date for a in result.scalars().all()}

        # Generate available slots
        current = date_from
        duration = timedelta(minutes=capacity_settings.appointment_duration_minutes)

        while current < date_to:
            # Skip if not within clinic hours
            day_of_week = current.weekday()
            if day_of_week not in clinic_hours:
                current += timedelta(days=1)
                continue

            hours = clinic_hours[day_of_week]
            slot_start = datetime.combine(
                current.date(),
                hours.opening_time
            )
            slot_end = datetime.combine(
                current.date(),
                hours.closing_time
            )

            # Generate slots for this day
            slot_time = slot_start
            while slot_time < slot_end:
                # Skip lunch break
                if hours.lunch_start and hours.lunch_end:
                    lunch_start = datetime.combine(current.date(), hours.lunch_start)
                    lunch_end = datetime.combine(current.date(), hours.lunch_end)
                    if lunch_start <= slot_time < lunch_end:
                        slot_time += timedelta(minutes=capacity_settings.appointment_duration_minutes)
                        continue

                # Check if slot is available
                if slot_time not in booked_times:
                    slots.append(slot_time)

                slot_time += timedelta(minutes=capacity_settings.appointment_duration_minutes)

            current += timedelta(days=1)

        return slots

    async def get_appointment(self, appointment_id: str) -> Optional[Appointment]:
        """Get appointment by ID"""
        result = await self.session.execute(
            select(Appointment).where(
                Appointment.clinic_id == self.clinic_id,
                Appointment.id == appointment_id,
            )
        )
        return result.scalars().first()

    async def list_appointments(self, patient_id: Optional[str] = None, status: Optional[str] = None) -> List[Appointment]:
        """List appointments with optional filters"""
        query = select(Appointment).where(
            Appointment.clinic_id == self.clinic_id,
        )

        if patient_id:
            query = query.where(Appointment.patient_id == patient_id)

        if status:
            query = query.where(Appointment.status == status)

        query = query.order_by(Appointment.appointment_date.desc())

        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_appointment_stats(self) -> dict:
        """Get appointment statistics for clinic"""
        total = await self.session.execute(
            select(func.count(Appointment.id)).where(
                Appointment.clinic_id == self.clinic_id,
            )
        )

        upcoming = await self.session.execute(
            select(func.count(Appointment.id)).where(
                Appointment.clinic_id == self.clinic_id,
                Appointment.appointment_date > func.now(),
                Appointment.status != AppointmentStatus.CANCELLED,
            )
        )

        completed = await self.session.execute(
            select(func.count(Appointment.id)).where(
                Appointment.clinic_id == self.clinic_id,
                Appointment.status == AppointmentStatus.COMPLETED,
            )
        )

        no_shows = await self.session.execute(
            select(func.count(Appointment.id)).where(
                Appointment.clinic_id == self.clinic_id,
                Appointment.status == AppointmentStatus.NO_SHOW,
            )
        )

        return {
            "total_appointments": total.scalar() or 0,
            "upcoming_appointments": upcoming.scalar() or 0,
            "completed_appointments": completed.scalar() or 0,
            "no_show_appointments": no_shows.scalar() or 0,
        }

    # Private helper methods

    async def _check_slot_availability(self, doctor_id: str, appointment_time: datetime) -> bool:
        """Check if time slot is available"""
        result = await self.session.execute(
            select(Appointment).where(
                Appointment.clinic_id == self.clinic_id,
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_date == appointment_time,
                Appointment.status != AppointmentStatus.CANCELLED,
            )
        )
        return result.scalars().first() is None

    async def _validate_booking_constraints(self, doctor_id: str, appointment_date: datetime) -> bool:
        """Validate booking constraints (advance booking rules)"""
        result = await self.session.execute(
            select(ClinicCapacity).where(
                ClinicCapacity.clinic_id == self.clinic_id,
                or_(
                    ClinicCapacity.doctor_id == doctor_id,
                    ClinicCapacity.doctor_id == None,
                )
            )
        )
        capacity = result.scalars().first()

        if capacity:
            now = datetime.utcnow()

            # Check minimum advance booking
            min_advance = timedelta(hours=capacity.min_advance_booking_hours)
            if appointment_date < now + min_advance:
                raise ValueError(
                    f"Must book at least {capacity.min_advance_booking_hours} hours in advance"
                )

            # Check maximum advance booking
            max_advance = timedelta(days=capacity.max_advance_booking_days)
            if appointment_date > now + max_advance:
                raise ValueError(
                    f"Can only book up to {capacity.max_advance_booking_days} days in advance"
                )

        return True

    async def _mark_slot_booked(self, appointment_id: str, doctor_id: str, appointment_time: datetime) -> None:
        """Mark appointment slot as booked"""
        slot = AppointmentSlot(
            id=uuid4(),
            clinic_id=self.clinic_id,
            doctor_id=doctor_id,
            slot_time=appointment_time,
            is_available=False,
            booked_appointment_id=appointment_id,
        )
        self.session.add(slot)
        await self.session.flush()

    async def _mark_slot_available(self, doctor_id: str, appointment_time: datetime) -> None:
        """Mark appointment slot as available again"""
        result = await self.session.execute(
            select(AppointmentSlot).where(
                AppointmentSlot.clinic_id == self.clinic_id,
                AppointmentSlot.doctor_id == doctor_id,
                AppointmentSlot.slot_time == appointment_time,
            )
        )
        slot = result.scalars().first()
        if slot:
            slot.is_available = True
            self.session.add(slot)

    async def _schedule_reminders(self, appointment: Appointment) -> None:
        """Schedule appointment reminders"""
        # 24 hours before
        reminder_24h = AppointmentReminder(
            id=uuid4(),
            clinic_id=self.clinic_id,
            appointment_id=str(appointment.id),
            patient_id=str(appointment.patient_id),
            reminder_type="24h",
            scheduled_time=appointment.appointment_date - timedelta(hours=24),
            status=ReminderStatus.PENDING,
            delivery_method=appointment.confirmation_method,
            patient_phone="",  # Will be filled by scheduler
        )
        self.session.add(reminder_24h)

        # 1 hour before
        reminder_1h = AppointmentReminder(
            id=uuid4(),
            clinic_id=self.clinic_id,
            appointment_id=str(appointment.id),
            patient_id=str(appointment.patient_id),
            reminder_type="1h",
            scheduled_time=appointment.appointment_date - timedelta(hours=1),
            status=ReminderStatus.PENDING,
            delivery_method=appointment.confirmation_method,
            patient_phone="",  # Will be filled by scheduler
        )
        self.session.add(reminder_1h)

        await self.session.flush()

    async def _reschedule_reminders(self, appointment: Appointment) -> None:
        """Reschedule reminders for rescheduled appointment"""
        # Delete old reminders
        result = await self.session.execute(
            select(AppointmentReminder).where(
                AppointmentReminder.clinic_id == self.clinic_id,
                AppointmentReminder.appointment_id == str(appointment.id),
                AppointmentReminder.status == ReminderStatus.PENDING,
            )
        )
        for reminder in result.scalars().all():
            await self.session.delete(reminder)

        # Create new reminders
        await self._schedule_reminders(appointment)

    async def _send_booking_confirmation(self, appointment: Appointment, patient_id: str) -> None:
        """Send booking confirmation to patient"""
        # TODO: Fetch patient phone from patients table
        # TODO: Format confirmation message
        # TODO: Send via Twilio (SMS/WhatsApp)
        logger.info(f"Booking confirmation should be sent for appointment {appointment.id}")
