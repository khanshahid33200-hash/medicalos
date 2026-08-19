"""Pydantic schemas for booking requests/responses"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime, date, time


class ClinicHoursRequest(BaseModel):
    """Clinic operating hours"""
    day_of_week: int = Field(..., ge=0, le=6)  # 0=Monday, 6=Sunday
    opening_time: str  # "09:00"
    closing_time: str  # "18:00"
    lunch_start: Optional[str] = None
    lunch_end: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "day_of_week": 0,
                "opening_time": "09:00",
                "closing_time": "18:00",
                "lunch_start": "13:00",
                "lunch_end": "14:00",
            }
        }


class ClinicCapacityRequest(BaseModel):
    """Clinic appointment capacity settings"""
    doctor_id: Optional[str] = None
    department: Optional[str] = None
    slots_per_hour: int = Field(default=4, ge=1, le=12)
    appointment_duration_minutes: int = Field(default=15, ge=5, le=120)
    max_advance_booking_days: int = Field(default=30, ge=1, le=365)
    min_advance_booking_hours: int = Field(default=1, ge=0, le=24)

    class Config:
        json_schema_extra = {
            "example": {
                "department": "General",
                "slots_per_hour": 4,
                "appointment_duration_minutes": 15,
                "max_advance_booking_days": 30,
                "min_advance_booking_hours": 1,
            }
        }


class AppointmentBookRequest(BaseModel):
    """Request to book an appointment"""
    patient_id: str
    doctor_id: str
    appointment_date: datetime = Field(..., description="Appointment date and time")
    department: Optional[str] = None
    reason_for_visit: Optional[str] = None
    notes: Optional[str] = None
    confirmation_method: str = Field(default="whatsapp", pattern="^(sms|whatsapp|call)$")

    @validator("appointment_date")
    def validate_future_date(cls, v):
        """Ensure appointment is in the future"""
        if v <= datetime.utcnow():
            raise ValueError("Appointment must be in the future")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "patient_id": "123e4567-e89b-12d3-a456-426614174000",
                "doctor_id": "987f6543-e21b-12d3-a456-426614174999",
                "appointment_date": "2025-09-01T10:00:00",
                "department": "General",
                "reason_for_visit": "Fever and cough",
                "confirmation_method": "whatsapp",
            }
        }


class AppointmentResponse(BaseModel):
    """Appointment response"""
    id: str
    patient_id: str
    doctor_id: str
    appointment_date: datetime
    status: str
    is_confirmed: bool
    queue_number: Optional[str] = None
    reminder_24h_scheduled: bool = False
    reminder_1h_scheduled: bool = False

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "patient_id": "patient-123",
                "doctor_id": "doctor-456",
                "appointment_date": "2025-09-01T10:00:00",
                "status": "scheduled",
                "is_confirmed": False,
                "queue_number": "12",
                "reminder_24h_scheduled": True,
                "reminder_1h_scheduled": False,
            }
        }


class AppointmentConfirmRequest(BaseModel):
    """Confirm appointment attendance"""
    confirmation_method: str = Field(default="sms", pattern="^(sms|whatsapp|call)$")
    notes: Optional[str] = None


class AppointmentRescheduleRequest(BaseModel):
    """Reschedule appointment to new date/time"""
    new_appointment_date: datetime = Field(..., description="New appointment date and time")
    reason: Optional[str] = None

    @validator("new_appointment_date")
    def validate_future_date(cls, v):
        """Ensure new appointment is in the future"""
        if v <= datetime.utcnow():
            raise ValueError("Appointment must be in the future")
        return v


class AppointmentCancelRequest(BaseModel):
    """Cancel appointment"""
    reason: Optional[str] = None
    send_notification: bool = Field(default=True)


class AvailableSlotResponse(BaseModel):
    """Available appointment slot"""
    slot_time: datetime
    duration_minutes: int
    is_available: bool

    class Config:
        from_attributes = True


class AvailableSlotsRequest(BaseModel):
    """Request available slots for a doctor"""
    doctor_id: str
    date_from: date
    date_to: date
    department: Optional[str] = None

    @validator("date_to")
    def validate_date_range(cls, v, values):
        """Ensure date_to is after date_from"""
        if "date_from" in values and v < values["date_from"]:
            raise ValueError("date_to must be after date_from")
        return v


class AppointmentListResponse(BaseModel):
    """List of appointments"""
    total: int
    upcoming: int
    completed: int
    no_shows: int
    appointments: List[AppointmentResponse]

    class Config:
        json_schema_extra = {
            "example": {
                "total": 25,
                "upcoming": 8,
                "completed": 15,
                "no_shows": 2,
                "appointments": [
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "patient_id": "patient-123",
                        "doctor_id": "doctor-456",
                        "appointment_date": "2025-09-01T10:00:00",
                        "status": "scheduled",
                        "is_confirmed": True,
                    }
                ],
            }
        }
