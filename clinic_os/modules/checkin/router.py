"""FastAPI routes for check-in module"""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4
import logging
from typing import Optional

from clinic_os.database import get_db
from clinic_os.modules.checkin.schemas import (
    CheckInRequest,
    CheckInResponse,
    PatientDedupeRequest,
    PatientDedupeResponse,
)
from clinic_os.modules.checkin.service import CheckInService

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=CheckInResponse)
async def submit_checkin(
    clinic_id: str,
    data: CheckInRequest,
    idempotency_key: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    """
    Submit a patient check-in form

    This endpoint handles check-in submissions from:
    - WhatsApp forms (via Twilio webhook)
    - SMS commands
    - Web forms
    - Paper records (OCR'd)

    Query parameter: clinic_id (required for public endpoint)
    """
    try:
        if not clinic_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="clinic_id is required",
            )

        service = CheckInService(db, clinic_id)
        checkin, patient, is_new = await service.create_checkin(data)
        await db.commit()

        # TODO: Trigger queue entry creation (Module 5)
        # TODO: Trigger AI triage brief generation (Module 5, async)
        # TODO: Send WhatsApp/SMS confirmation with queue number

        return CheckInResponse(
            id=str(checkin.id),
            patient_id=str(patient.id),
            is_returning_patient=not is_new,
            message=f"Check-in successful. {'Welcome back' if not is_new else 'Welcome'}! You will receive a queue number shortly.",
            queue_number=None,  # Will be set after queue entry creation
            estimated_wait_minutes=None,
        )

    except Exception as e:
        logger.error(f"Check-in submission failed: {str(e)}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process check-in",
        )


@router.get("/{checkin_id}", response_model=dict)
async def get_checkin(
    clinic_id: str,
    checkin_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific check-in record"""
    try:
        service = CheckInService(db, clinic_id)
        checkin = await service.get_checkin_by_id(checkin_id)

        if not checkin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Check-in not found",
            )

        return {
            "id": str(checkin.id),
            "patient_id": str(checkin.patient_id),
            "name": checkin.name,
            "phone": checkin.phone,
            "symptoms": checkin.symptoms,  # Encrypted in DB
            "created_at": checkin.created_at,
            "source": checkin.source,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retrieve check-in: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve check-in",
        )


@router.post("/dedupe", response_model=PatientDedupeResponse)
async def deduplicate_patient(
    clinic_id: str,
    data: PatientDedupeRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Check for duplicate patient records before check-in

    This helps avoid creating duplicate patient profiles.
    """
    try:
        service = CheckInService(db, clinic_id)
        result = await service.deduplicate_patient(data)
        return PatientDedupeResponse(**result)

    except Exception as e:
        logger.error(f"Deduplication failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check for duplicates",
        )


@router.get("/patient/{patient_id}/history")
async def get_patient_history(
    clinic_id: str,
    patient_id: str,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    """Get check-in history for a specific patient"""
    try:
        service = CheckInService(db, clinic_id)
        history = await service.get_patient_history(patient_id, limit)

        return {
            "patient_id": patient_id,
            "total_checkins": len(history),
            "history": [
                {
                    "id": str(h.id),
                    "created_at": h.created_at,
                    "symptoms": h.symptoms,  # Encrypted
                    "source": h.source,
                }
                for h in history
            ],
        }

    except Exception as e:
        logger.error(f"Failed to retrieve history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve check-in history",
        )


@router.get("/stats")
async def get_clinic_stats(
    clinic_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get check-in statistics for a clinic"""
    try:
        service = CheckInService(db, clinic_id)
        stats = await service.get_clinic_stats()
        return {"clinic_id": clinic_id, **stats}

    except Exception as e:
        logger.error(f"Failed to retrieve stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve statistics",
        )


# Webhook endpoints for Twilio/WhatsApp
@router.post("/webhook/twilio")
async def twilio_webhook(
    clinic_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Webhook endpoint for Twilio/WhatsApp inbound messages

    This receives form submissions from patients via WhatsApp.
    """
    # TODO: Verify Twilio signature
    # TODO: Parse WhatsApp message
    # TODO: Route to appropriate handler (check-in form, SMS command, etc.)
    pass
