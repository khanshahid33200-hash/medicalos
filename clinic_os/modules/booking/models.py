"""SQLAlchemy models for booking module"""

from sqlalchemy import Column, String, UUID, DateTime, Text, JSON, Boolean, Integer, Time, Float, Enum as SQLEnum
from sqlalchemy.sql import func
from datetime import datetime, date
import uuid
from enum import Enum

from clinic_os.database import Base


class AppointmentStatus(str, Enum):
    """Appointment status"""
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    NO_SHOW = "no_show"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"


class ReminderStatus(str, Enum):
    """Reminder delivery status"""
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    BOUNCED = "bounced"


class ClinicHours(Base):
    """Clinic operating hours"""
    __tablename__ = "clinic_hours"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID, nullable=False)  # RLS filter
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    opening_time = Column(Time, nullable=False)
    closing_time = Column(Time, nullable=False)
    lunch_start = Column(Time, nullable=True)
    lunch_end = Column(Time, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class ClinicCapacity(Base):
    """Clinic appointment capacity settings"""
    __tablename__ = "clinic_capacity"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID, nullable=False)  # RLS filter
    doctor_id = Column(UUID, nullable=True)  # If null, applies to all doctors
    department = Column(String(100), nullable=True)  # e.g., "General", "Pediatrics"
    slots_per_hour = Column(Integer, default=4)  # 4 patients per hour = 15 min slots
    appointment_duration_minutes = Column(Integer, default=15)
    max_advance_booking_days = Column(Integer, default=30)  # Book up to 30 days ahead
    min_advance_booking_hours = Column(Integer, default=1)  # Book at least 1 hour ahead
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class Appointment(Base):
    """Patient appointment"""
    __tablename__ = "appointments"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID, nullable=False)  # RLS filter
    patient_id = Column(UUID, nullable=False)
    doctor_id = Column(UUID, nullable=False)
    department = Column(String(100), nullable=True)

    appointment_date = Column(DateTime, nullable=False)  # Date + time of appointment
    status = Column(SQLEnum(AppointmentStatus), default=AppointmentStatus.SCHEDULED)

    # Notes and metadata
    reason_for_visit = Column(Text, nullable=True)  # What patient is coming for
    notes = Column(Text, nullable=True)  # Internal notes

    # Confirmation tracking
    is_confirmed = Column(Boolean, default=False)  # Patient confirmed attendance
    confirmed_at = Column(DateTime, nullable=True)
    confirmation_method = Column(String(20), default="sms")  # sms, whatsapp, call

    # Outcome tracking
    consultation_start_time = Column(DateTime, nullable=True)
    consultation_end_time = Column(DateTime, nullable=True)
    actual_duration_minutes = Column(Integer, nullable=True)

    # Cancellation/Rescheduling
    cancelled_at = Column(DateTime, nullable=True)
    cancellation_reason = Column(String(255), nullable=True)
    rescheduled_to_appointment_id = Column(UUID, nullable=True)  # If rescheduled

    # Module 5 integration
    queue_number = Column(String(20), nullable=True)  # "12" or "12-R" from queue
    queue_entry_id = Column(UUID, nullable=True)  # Reference to queue_entries table

    # Metadata
    source = Column(String(20), default="booking")  # booking, checkin, manual, sms
    reminder_sent_24h = Column(Boolean, default=False)
    reminder_sent_1h = Column(Boolean, default=False)
    no_show_recovery_sent = Column(Boolean, default=False)

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class AppointmentReminder(Base):
    """Appointment reminder delivery tracking"""
    __tablename__ = "appointment_reminders"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID, nullable=False)  # RLS filter
    appointment_id = Column(UUID, nullable=False)
    patient_id = Column(UUID, nullable=False)

    reminder_type = Column(String(20), nullable=False)  # "24h", "1h", "no_show_recovery"
    scheduled_time = Column(DateTime, nullable=False)  # When reminder should go out
    sent_time = Column(DateTime, nullable=True)  # When reminder actually sent
    status = Column(SQLEnum(ReminderStatus), default=ReminderStatus.PENDING)

    # Message details
    message_template = Column(String(50), nullable=True)  # Template ID used
    message_body = Column(Text, nullable=True)  # Rendered message sent
    delivery_method = Column(String(20), default="whatsapp")  # sms, whatsapp, email

    # Tracking
    patient_phone = Column(String(20), nullable=False)  # Snapshot at send time
    external_id = Column(String(100), nullable=True)  # Twilio SID, etc.
    error_message = Column(Text, nullable=True)  # If failed
    retry_count = Column(Integer, default=0)

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class AppointmentSlot(Base):
    """Available appointment slot (computed/cached)"""
    __tablename__ = "appointment_slots"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID, nullable=False)  # RLS filter
    doctor_id = Column(UUID, nullable=False)
    department = Column(String(100), nullable=True)

    slot_time = Column(DateTime, nullable=False)  # Start time of slot
    duration_minutes = Column(Integer, default=15)
    is_available = Column(Boolean, default=True)
    booked_by_patient_id = Column(UUID, nullable=True)  # If booked
    booked_appointment_id = Column(UUID, nullable=True)  # Reference to appointment

    # Sync with appointment_date
    # When an appointment is created, corresponding slot.is_available = False

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
