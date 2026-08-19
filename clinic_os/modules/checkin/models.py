"""SQLAlchemy models for check-in module"""

from sqlalchemy import Column, String, UUID, DateTime, Text, JSONB, Boolean, Enum as SQLEnum, Integer
from sqlalchemy.sql import func
from datetime import datetime
import uuid

from clinic_os.database import Base


class Clinic(Base):
    """Clinic entity"""
    __tablename__ = "clinics"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    timezone = Column(String(50), default="UTC")
    language = Column(String(20), default="en")
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class Patient(Base):
    """Patient entity"""
    __tablename__ = "patients"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID, nullable=False)  # RLS filter
    phone = Column(String(20), nullable=False)
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)  # M/F/Other
    email = Column(String(255), nullable=True)
    medical_history = Column(Text, nullable=True)  # Encrypted
    allergies = Column(Text, nullable=True)  # Encrypted
    emergency_contact = Column(String(20), nullable=True)
    language_preference = Column(String(20), default="en")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class CheckIn(Base):
    """Check-in form submission"""
    __tablename__ = "check_ins"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID, nullable=False)  # RLS filter
    patient_id = Column(UUID, nullable=True)
    phone = Column(String(20), nullable=False)
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    symptoms = Column(Text, nullable=False)  # Encrypted
    medical_history = Column(Text, nullable=True)  # Encrypted
    allergies = Column(Text, nullable=True)  # Encrypted
    current_medications = Column(Text, nullable=True)  # Encrypted
    language = Column(String(20), default="en")

    # Module 5: AI Triage fields
    previous_doctor = Column(String(255), nullable=True)
    previous_medication = Column(Text, nullable=True)  # Encrypted
    duration_symptoms = Column(String(100), nullable=True)
    severity = Column(String(20), nullable=True)  # mild, moderate, severe
    chronic_conditions = Column(Text, nullable=True)  # Encrypted
    past_surgeries = Column(Text, nullable=True)  # Encrypted
    consent_ai_triage = Column(Boolean, default=False)

    # Form metadata
    source = Column(String(20), default="whatsapp")  # whatsapp, sms, web, paper
    form_response_time_sec = Column(Integer, nullable=True)
    is_returning_patient = Column(Boolean, default=False)
    ocr_confidence = Column(Integer, nullable=True)  # For paper records
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class CheckInForm(Base):
    """Dynamic check-in form configuration"""
    __tablename__ = "check_in_forms"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID, nullable=False)  # RLS filter
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    fields = Column(JSONB, nullable=False)  # Field definitions
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class AuditLog(Base):
    """Audit trail for compliance"""
    __tablename__ = "audit_logs"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID, nullable=False)  # RLS filter
    action = Column(String(50), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(255), nullable=False)
    user_id = Column(UUID, nullable=True)
    details = Column(JSONB, nullable=True)
    status = Column(String(20), default="success")  # success, failure
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
