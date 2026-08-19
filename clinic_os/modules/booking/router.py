"""FastAPI routes for booking module"""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import logging
from typing import Optional

from clinic_os.database import get_db
from clinic_os.modules.booking.schemas import (
    AppointmentBookRequest,
    AppointmentResponse,
    AppointmentConfirmRequest,
    AppointmentRescheduleRequest,
    AppointmentCancelRequest,
    AvailableSlotsRequest,
    AvailableSlotResponse,
    ClinicCapacityRequest,
    AppointmentListResponse,
)
from clinic_os.modules.booking.service import BookingService

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=AppointmentResponse)
async def book_appointment(
    data: AppointmentBookRequest,
    clinic_id: Optional[str] = Header("clinic-001"),
    db: AsyncSession = Depends(get_db),
):
    """
    Book an appointment for a patient

    Available slots can be retrieved from GET /appointments/available-slots
    """
    try:
        if not clinic_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="clinic_id is required",
            )

        service = BookingService(db, clinic_id)
        appointment = await service.book_appointment(data)
        await db.commit()

        return AppointmentResponse(
            id=str(appointment.id),
            patient_id=str(appointment.patient_id),
            doctor_id=str(appointment.doctor_id),
            appointment_date=appointment.appointment_date,
            status=appointment.status.value,
            is_confirmed=appointment.is_confirmed,
            queue_number=appointment.queue_number,
            reminder_24h_scheduled=not appointment.reminder_sent_24h,
            reminder_1h_scheduled=not appointment.reminder_sent_1h,
        )

    except ValueError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Failed to book appointment: {str(e)}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to book appointment",
        )


@router.get("/", response_model=AppointmentListResponse)
async def list_appointments(
    patient_id: Optional[str] = None,
    status: Optional[str] = None,
    clinic_id: Optional[str] = Header("clinic-001"),
    db: AsyncSession = Depends(get_db),
):
    """List appointments for a clinic or patient"""
    try:
        service = BookingService(db, clinic_id)

        appointments = await service.list_appointments(patient_id, status)
        stats = await service.get_appointment_stats()

        return AppointmentListResponse(
            total=stats["total_appointments"],
            upcoming=stats["upcoming_appointments"],
            completed=stats["completed_appointments"],
            no_shows=stats["no_show_appointments"],
            appointments=[
                AppointmentResponse(
                    id=str(a.id),
                    patient_id=str(a.patient_id),
                    doctor_id=str(a.doctor_id),
                    appointment_date=a.appointment_date,
                    status=a.status.value,
                    is_confirmed=a.is_confirmed,
                    queue_number=a.queue_number,
                )
                for a in appointments
            ],
        )

    except Exception as e:
        logger.error(f"Failed to list appointments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve appointments",
        )


@router.get("/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: str,
    clinic_id: Optional[str] = Header("clinic-001"),
    db: AsyncSession = Depends(get_db),
):
    """Get specific appointment"""
    try:
        service = BookingService(db, clinic_id)
        appointment = await service.get_appointment(appointment_id)

        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found",
            )

        return AppointmentResponse(
            id=str(appointment.id),
            patient_id=str(appointment.patient_id),
            doctor_id=str(appointment.doctor_id),
            appointment_date=appointment.appointment_date,
            status=appointment.status.value,
            is_confirmed=appointment.is_confirmed,
            queue_number=appointment.queue_number,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retrieve appointment: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve appointment",
        )


@router.post("/{appointment_id}/confirm", response_model=AppointmentResponse)
async def confirm_appointment(
    appointment_id: str,
    data: AppointmentConfirmRequest,
    clinic_id: Optional[str] = Header("clinic-001"),
    db: AsyncSession = Depends(get_db),
):
    """Confirm appointment attendance"""
    try:
        service = BookingService(db, clinic_id)
        appointment = await service.confirm_appointment(appointment_id)
        await db.commit()

        return AppointmentResponse(
            id=str(appointment.id),
            patient_id=str(appointment.patient_id),
            doctor_id=str(appointment.doctor_id),
            appointment_date=appointment.appointment_date,
            status=appointment.status.value,
            is_confirmed=appointment.is_confirmed,
        )

    except ValueError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Failed to confirm appointment: {str(e)}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to confirm appointment",
        )


@router.put("/{appointment_id}/reschedule", response_model=AppointmentResponse)
async def reschedule_appointment(
    appointment_id: str,
    data: AppointmentRescheduleRequest,
    clinic_id: Optional[str] = Header("clinic-001"),
    db: AsyncSession = Depends(get_db),
):
    """Reschedule appointment to new date/time"""
    try:
        service = BookingService(db, clinic_id)
        appointment = await service.reschedule_appointment(appointment_id, data.new_appointment_date)
        await db.commit()

        return AppointmentResponse(
            id=str(appointment.id),
            patient_id=str(appointment.patient_id),
            doctor_id=str(appointment.doctor_id),
            appointment_date=appointment.appointment_date,
            status=appointment.status.value,
            is_confirmed=appointment.is_confirmed,
        )

    except ValueError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Failed to reschedule appointment: {str(e)}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reschedule appointment",
        )


@router.delete("/{appointment_id}", response_model=dict)
async def cancel_appointment(
    appointment_id: str,
    data: AppointmentCancelRequest,
    clinic_id: Optional[str] = Header("clinic-001"),
    db: AsyncSession = Depends(get_db),
):
    """Cancel appointment"""
    try:
        service = BookingService(db, clinic_id)
        appointment = await service.cancel_appointment(appointment_id, data.reason)
        await db.commit()

        return {
            "message": "Appointment cancelled successfully",
            "appointment_id": str(appointment.id),
            "status": appointment.status.value,
        }

    except ValueError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Failed to cancel appointment: {str(e)}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel appointment",
        )


@router.post("/available-slots", response_model=list)
async def get_available_slots(
    data: AvailableSlotsRequest,
    clinic_id: Optional[str] = Header("clinic-001"),
    db: AsyncSession = Depends(get_db),
):
    """Get available appointment slots for a doctor"""
    try:
        service = BookingService(db, clinic_id)

        slots = await service.get_available_slots(
            doctor_id=data.doctor_id,
            date_from=datetime.combine(data.date_from, datetime.min.time()),
            date_to=datetime.combine(data.date_to, datetime.max.time()),
        )

        return [
            AvailableSlotResponse(
                slot_time=slot,
                duration_minutes=15,
                is_available=True,
            ).model_dump()
            for slot in slots
        ]

    except Exception as e:
        logger.error(f"Failed to retrieve available slots: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve available slots",
        )


@router.get("/stats", response_model=dict)
async def get_appointment_stats(
    clinic_id: Optional[str] = Header("clinic-001"),
    db: AsyncSession = Depends(get_db),
):
    """Get appointment statistics for clinic"""
    try:
        service = BookingService(db, clinic_id)
        stats = await service.get_appointment_stats()

        return {
            "clinic_id": clinic_id,
            **stats,
        }

    except Exception as e:
        logger.error(f"Failed to retrieve stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve statistics",
        )
