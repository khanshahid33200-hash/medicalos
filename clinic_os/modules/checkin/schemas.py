"""Pydantic schemas for check-in requests/responses"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime


class CheckInRequest(BaseModel):
    """Check-in form submission"""
    phone: str = Field(..., min_length=7, max_length=20)
    name: str = Field(..., min_length=1, max_length=255)
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[str] = None
    symptoms: str = Field(..., min_length=1)
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    current_medications: Optional[str] = None
    language: str = Field(default="en", max_length=20)

    # Module 5 fields
    previous_doctor: Optional[str] = None
    previous_medication: Optional[str] = None
    duration_symptoms: Optional[str] = None  # e.g., "2 days", "1 week"
    severity: Optional[str] = Field(None, pattern="^(mild|moderate|severe)$")
    chronic_conditions: Optional[str] = None
    past_surgeries: Optional[str] = None
    consent_ai_triage: bool = Field(default=False)

    # Metadata
    source: str = Field(default="whatsapp", pattern="^(whatsapp|sms|web|paper)$")
    form_response_time_sec: Optional[int] = None

    @validator("phone")
    def validate_phone(cls, v):
        """Validate phone format"""
        if not v.replace("+", "").replace("-", "").replace(" ", "").isdigit():
            raise ValueError("Phone must contain only digits, +, - and spaces")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "phone": "+91-98765-43210",
                "name": "John Doe",
                "age": 35,
                "gender": "M",
                "symptoms": "Fever and cough for 2 days",
                "medical_history": "Hypertension",
                "allergies": "Penicillin",
                "current_medications": "Lisinopril",
                "language": "en",
                "severity": "moderate",
                "consent_ai_triage": True,
            }
        }


class CheckInResponse(BaseModel):
    """Check-in submission response"""
    id: str
    patient_id: Optional[str] = None
    is_returning_patient: bool
    message: str
    queue_number: Optional[str] = None
    estimated_wait_minutes: Optional[int] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "patient_id": "987f6543-e21b-12d3-a456-426614174999",
                "is_returning_patient": False,
                "message": "Check-in successful. Your queue number is 12.",
                "queue_number": "12",
                "estimated_wait_minutes": 15,
            }
        }


class PatientResponse(BaseModel):
    """Patient information (filtered for privacy)"""
    id: str
    name: str
    phone: str
    age: Optional[int]
    gender: Optional[str]
    language_preference: str
    is_active: bool

    class Config:
        from_attributes = True


class CheckInHistoryItem(BaseModel):
    """Single check-in history entry"""
    id: str
    created_at: datetime
    symptoms: str
    source: str
    is_returning_patient: bool

    class Config:
        from_attributes = True


class PatientDedupeRequest(BaseModel):
    """Request to deduplicate patient records"""
    phone: str
    name: str
    email: Optional[str] = None
    match_threshold: float = Field(default=0.85, ge=0, le=1)


class PatientDedupeResponse(BaseModel):
    """Deduplication response"""
    found_existing: bool
    patient_id: Optional[str] = None
    confidence: float
    merged: bool = False
