"""Unit tests for booking service"""

import pytest
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from clinic_os.modules.booking.service import BookingService
from clinic_os.modules.booking.models import (
    ClinicHours, ClinicCapacity, Appointment, AppointmentStatus
)
from clinic_os.modules.booking.schemas import AppointmentBookRequest


class TestBookingService:
    """Test appointment booking service"""

    @pytest.mark.asyncio
    async def test_book_appointment_success(self, db_session: AsyncSession, clinic_id: str):
        """Test successful appointment booking"""
        service = BookingService(db_session, clinic_id)

        # Setup clinic hours and capacity
        hours = ClinicHours(
            clinic_id=clinic_id,
            day_of_week=0,  # Monday
            opening_time="09:00",
            closing_time="18:00",
        )
        db_session.add(hours)

        capacity = ClinicCapacity(
            clinic_id=clinic_id,
            slots_per_hour=4,
            appointment_duration_minutes=15,
        )
        db_session.add(capacity)
        await db_session.flush()

        # Book appointment for tomorrow
        doctor_id = "doctor-123"
        tomorrow = datetime.utcnow().replace(hour=10, minute=0, second=0, microsecond=0) + timedelta(days=1)

        booking_request = AppointmentBookRequest(
            patient_id="patient-123",
            doctor_id=doctor_id,
            appointment_date=tomorrow,
            reason_for_visit="Check-up",
        )

        appointment = await service.book_appointment(booking_request)
        await db_session.commit()

        assert appointment is not None
        assert appointment.status == AppointmentStatus.SCHEDULED
        assert appointment.patient_id == "patient-123"
        assert appointment.doctor_id == doctor_id

    @pytest.mark.asyncio
    async def test_book_appointment_past_date(self, db_session: AsyncSession, clinic_id: str):
        """Test that bookings in the past are rejected"""
        service = BookingService(db_session, clinic_id)

        past_time = datetime.utcnow() - timedelta(hours=1)

        booking_request = AppointmentBookRequest(
            patient_id="patient-123",
            doctor_id="doctor-123",
            appointment_date=past_time,
        )

        with pytest.raises(ValueError):
            await service.book_appointment(booking_request)

    @pytest.mark.asyncio
    async def test_confirm_appointment(self, db_session: AsyncSession, clinic_id: str):
        """Test confirming appointment attendance"""
        service = BookingService(db_session, clinic_id)

        # Create an appointment
        tomorrow = datetime.utcnow() + timedelta(days=1)
        booking_request = AppointmentBookRequest(
            patient_id="patient-123",
            doctor_id="doctor-123",
            appointment_date=tomorrow,
        )

        # Need to setup clinic data first
        capacity = ClinicCapacity(clinic_id=clinic_id)
        db_session.add(capacity)
        await db_session.flush()

        appointment = await service.book_appointment(booking_request)
        await db_session.commit()

        # Confirm the appointment
        confirmed = await service.confirm_appointment(str(appointment.id))

        assert confirmed.is_confirmed == True
        assert confirmed.confirmed_at is not None

    @pytest.mark.asyncio
    async def test_reschedule_appointment(self, db_session: AsyncSession, clinic_id: str):
        """Test rescheduling appointment"""
        service = BookingService(db_session, clinic_id)

        # Setup
        capacity = ClinicCapacity(clinic_id=clinic_id)
        db_session.add(capacity)
        await db_session.flush()

        # Create appointment
        tomorrow = datetime.utcnow() + timedelta(days=1)
        booking_request = AppointmentBookRequest(
            patient_id="patient-123",
            doctor_id="doctor-123",
            appointment_date=tomorrow,
        )

        appointment = await service.book_appointment(booking_request)
        original_date = appointment.appointment_date
        await db_session.commit()

        # Reschedule to different date
        new_date = tomorrow + timedelta(days=1)
        rescheduled = await service.reschedule_appointment(str(appointment.id), new_date)

        assert rescheduled.appointment_date == new_date
        assert rescheduled.appointment_date != original_date

    @pytest.mark.asyncio
    async def test_cancel_appointment(self, db_session: AsyncSession, clinic_id: str):
        """Test cancelling appointment"""
        service = BookingService(db_session, clinic_id)

        # Setup
        capacity = ClinicCapacity(clinic_id=clinic_id)
        db_session.add(capacity)
        await db_session.flush()

        # Create appointment
        tomorrow = datetime.utcnow() + timedelta(days=1)
        booking_request = AppointmentBookRequest(
            patient_id="patient-123",
            doctor_id="doctor-123",
            appointment_date=tomorrow,
        )

        appointment = await service.book_appointment(booking_request)
        await db_session.commit()

        # Cancel
        cancelled = await service.cancel_appointment(str(appointment.id), "Patient requested")

        assert cancelled.status == AppointmentStatus.CANCELLED
        assert cancelled.cancellation_reason == "Patient requested"

    @pytest.mark.asyncio
    async def test_get_appointment_stats(self, db_session: AsyncSession, clinic_id: str):
        """Test appointment statistics"""
        service = BookingService(db_session, clinic_id)

        stats = await service.get_appointment_stats()

        assert "total_appointments" in stats
        assert "upcoming_appointments" in stats
        assert "completed_appointments" in stats
        assert "no_show_appointments" in stats

    @pytest.mark.asyncio
    async def test_get_available_slots(self, db_session: AsyncSession, clinic_id: str):
        """Test getting available appointment slots"""
        service = BookingService(db_session, clinic_id)

        # Setup clinic hours
        hours = ClinicHours(
            clinic_id=clinic_id,
            day_of_week=0,  # Monday
            opening_time="09:00",
            closing_time="10:00",  # 1 hour = 4 slots
        )
        db_session.add(hours)

        capacity = ClinicCapacity(
            clinic_id=clinic_id,
            slots_per_hour=4,
            appointment_duration_minutes=15,
        )
        db_session.add(capacity)
        await db_session.flush()

        # Get slots for next Monday
        now = datetime.utcnow()
        days_until_monday = (0 - now.weekday()) % 7
        if days_until_monday == 0:
            days_until_monday = 7

        next_monday = now + timedelta(days=days_until_monday)

        slots = await service.get_available_slots(
            doctor_id="doctor-123",
            date_from=next_monday,
            date_to=next_monday + timedelta(hours=1),
        )

        # Should have 4 slots in a 1-hour period
        assert len(slots) > 0

    @pytest.mark.asyncio
    async def test_list_appointments(self, db_session: AsyncSession, clinic_id: str):
        """Test listing appointments"""
        service = BookingService(db_session, clinic_id)

        appointments = await service.list_appointments()

        assert isinstance(appointments, list)

    @pytest.mark.asyncio
    async def test_appointment_confirms_before_date(self, db_session: AsyncSession, clinic_id: str):
        """Test that appointment date must be in future"""
        service = BookingService(db_session, clinic_id)

        # Try to book appointment 1 day ago
        past_date = datetime.utcnow() - timedelta(days=1)

        with pytest.raises(ValueError):
            AppointmentBookRequest(
                patient_id="patient-123",
                doctor_id="doctor-123",
                appointment_date=past_date,
            )

    @pytest.mark.asyncio
    async def test_advance_booking_constraints(self, db_session: AsyncSession, clinic_id: str):
        """Test advance booking time constraints"""
        service = BookingService(db_session, clinic_id)

        # Setup capacity with 1 hour minimum advance
        capacity = ClinicCapacity(
            clinic_id=clinic_id,
            min_advance_booking_hours=1,
            max_advance_booking_days=30,
        )
        db_session.add(capacity)
        await db_session.flush()

        # Try to book within 1 hour
        soon = datetime.utcnow() + timedelta(minutes=30)

        booking_request = AppointmentBookRequest(
            patient_id="patient-123",
            doctor_id="doctor-123",
            appointment_date=soon,
        )

        with pytest.raises(ValueError):
            await service.book_appointment(booking_request)
