"""Scheduled jobs for appointment reminders and no-show recovery"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.future import select
from datetime import datetime, timedelta
import logging

from clinic_os.modules.booking.models import (
    Appointment, AppointmentReminder, AppointmentStatus, ReminderStatus
)
from clinic_os.config import settings
from clinic_os.integrations.twilio_client import twilio_client

logger = logging.getLogger(__name__)


class AppointmentReminderJob:
    """Job for sending appointment reminders"""

    def __init__(self):
        self.engine = create_async_engine(
            settings.database_url,
            echo=False,
            pool_pre_ping=True,
        )
        self.SessionLocal = async_sessionmaker(self.engine, class_=AsyncSession, expire_on_commit=False)

    async def send_pending_reminders(self):
        """Send pending appointment reminders"""
        async with self.SessionLocal() as session:
            try:
                # Find pending reminders that are due
                now = datetime.utcnow()
                result = await session.execute(
                    select(AppointmentReminder).where(
                        AppointmentReminder.status == ReminderStatus.PENDING,
                        AppointmentReminder.scheduled_time <= now,
                    )
                )
                pending_reminders = result.scalars().all()

                logger.info(f"Processing {len(pending_reminders)} pending reminders")

                for reminder in pending_reminders:
                    await self._send_reminder(session, reminder)

                await session.commit()

            except Exception as e:
                logger.error(f"Error in send_pending_reminders: {str(e)}")
                await session.rollback()
                raise

    async def _send_reminder(self, session: AsyncSession, reminder: AppointmentReminder):
        """Send individual reminder"""
        try:
            # Get appointment details
            result = await session.execute(
                select(Appointment).where(Appointment.id == reminder.appointment_id)
            )
            appointment = result.scalars().first()

            if not appointment:
                logger.warning(f"Appointment not found for reminder {reminder.id}")
                reminder.status = ReminderStatus.FAILED
                reminder.error_message = "Appointment not found"
                session.add(reminder)
                return

            # TODO: Fetch patient phone from patients table
            patient_phone = reminder.patient_phone

            # Format reminder message
            if reminder.reminder_type == "24h":
                message = f"Reminder: You have an appointment tomorrow at {appointment.appointment_date.strftime('%H:%M')}. Please confirm or reschedule."
            elif reminder.reminder_type == "1h":
                message = f"Your appointment is in 1 hour at {appointment.appointment_date.strftime('%H:%M')}. Please proceed to the clinic."
            else:
                message = "Appointment reminder"

            reminder.message_body = message

            # Send via Twilio
            if reminder.delivery_method == "whatsapp":
                msg_sid = await twilio_client.send_whatsapp(patient_phone, message)
            else:
                msg_sid = await twilio_client.send_sms(patient_phone, message)

            if msg_sid:
                reminder.status = ReminderStatus.SENT
                reminder.sent_time = datetime.utcnow()
                reminder.external_id = msg_sid
                logger.info(f"Reminder {reminder.id} sent successfully (SID: {msg_sid})")
            else:
                reminder.status = ReminderStatus.FAILED
                reminder.error_message = "Failed to send via Twilio"
                reminder.retry_count = (reminder.retry_count or 0) + 1
                logger.error(f"Failed to send reminder {reminder.id}")

            session.add(reminder)

        except Exception as e:
            logger.error(f"Error sending reminder {reminder.id}: {str(e)}")
            reminder.status = ReminderStatus.FAILED
            reminder.error_message = str(e)
            reminder.retry_count = (reminder.retry_count or 0) + 1
            session.add(reminder)


class NoShowRecoveryJob:
    """Job for no-show detection and recovery messaging"""

    def __init__(self):
        self.engine = create_async_engine(
            settings.database_url,
            echo=False,
            pool_pre_ping=True,
        )
        self.SessionLocal = async_sessionmaker(self.engine, class_=AsyncSession, expire_on_commit=False)

    async def check_and_recover_no_shows(self):
        """Check for no-shows and send recovery messages"""
        async with self.SessionLocal() as session:
            try:
                # Find appointments that should have happened but patient hasn't checked in
                now = datetime.utcnow()
                past_time = now - timedelta(minutes=15)  # 15 minutes past appointment time

                result = await session.execute(
                    select(Appointment).where(
                        Appointment.status == AppointmentStatus.SCHEDULED,
                        Appointment.appointment_date < past_time,
                        Appointment.no_show_recovery_sent == False,
                    )
                )
                potential_no_shows = result.scalars().all()

                logger.info(f"Checking {len(potential_no_shows)} potential no-shows")

                for appointment in potential_no_shows:
                    await self._send_recovery_message(session, appointment)

                await session.commit()

            except Exception as e:
                logger.error(f"Error in check_and_recover_no_shows: {str(e)}")
                await session.rollback()
                raise

    async def _send_recovery_message(self, session: AsyncSession, appointment: Appointment):
        """Send no-show recovery message"""
        try:
            # Mark as no-show
            appointment.status = AppointmentStatus.NO_SHOW
            appointment.no_show_recovery_sent = True

            # TODO: Fetch patient phone from patients table
            patient_phone = ""

            # Send recovery message
            recovery_message = (
                "We noticed you missed your appointment. "
                "Please let us know if you'd like to reschedule. "
                "Reply with 'RESCHEDULE' or contact us."
            )

            if appointment.confirmation_method == "whatsapp":
                msg_sid = await twilio_client.send_whatsapp(patient_phone, recovery_message)
            else:
                msg_sid = await twilio_client.send_sms(patient_phone, recovery_message)

            if msg_sid:
                logger.info(f"No-show recovery message sent for appointment {appointment.id}")
            else:
                logger.error(f"Failed to send no-show recovery message for appointment {appointment.id}")

            session.add(appointment)

        except Exception as e:
            logger.error(f"Error sending recovery message for appointment {appointment.id}: {str(e)}")
            session.add(appointment)


# Job instances
reminder_job = AppointmentReminderJob()
no_show_job = NoShowRecoveryJob()
