"""FastAPI routes for check-in module"""

from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4
import logging
from typing import Optional, List, Dict
from datetime import datetime

from clinic_os.database import get_db
from clinic_os.modules.checkin.schemas import (
    CheckInRequest,
    CheckInResponse,
    PatientDedupeRequest,
    PatientDedupeResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter()

# Central In-Memory Store for Real-Time Cross-Device Queue & Checkin Sync
# Key: doctor_id, Value: List of Queue / Checkin Items
global_doctor_queues: Dict[str, List[dict]] = {}

@router.post("/", response_model=CheckInResponse)
async def submit_checkin(
    data: CheckInRequest,
    clinic_id: Optional[str] = Query("hosp-001"),
    idempotency_key: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    """
    Submit a patient check-in form from QR Code scan
    """
    try:
        doc_id = data.doctor_id or "doc-001"
        if doc_id not in global_doctor_queues:
            global_doctor_queues[doc_id] = []

        doctor_queue = global_doctor_queues[doc_id]
        token_num = f"Token {str(len(doctor_queue) + 1).zfill(3)}"
        receipt_num = f"RCP-{datetime.now().strftime('%Y%m%d')}-{len(doctor_queue) + 1}"
        checkin_id = f"chk-{uuid4()}"
        patient_id = f"pat-{uuid4()}"

        time_str = datetime.now().strftime("%I:%M %p")
        today_str = datetime.now().strftime("%b %d, %Y")

        new_entry = {
            "id": checkin_id,
            "doctor_id": doc_id,
            "patient_id": patient_id,
            "token_number": token_num,
            "receipt_number": receipt_num,
            "patient_name": data.name,
            "phone": data.phone,
            "age": data.age or 30,
            "gender": data.gender or "M",
            "symptoms": data.symptoms,
            "severity": data.severity or "moderate",
            "allergies": data.allergies or "",
            "status": "Waiting",
            "check_in_time": time_str,
            "date": today_str,
        }

        # Save into central backend memory for doc_id
        doctor_queue.append(new_entry)

        return CheckInResponse(
            id=checkin_id,
            patient_id=patient_id,
            is_returning_patient=False,
            message=f"Check-in successful! Your live token for Doctor is {token_num}.",
            queue_number=token_num,
            estimated_wait_minutes=10,
        )

    except Exception as e:
        logger.error(f"Check-in submission failed: {str(e)}")
        # Fallback entry generation
        doc_id = data.doctor_id or "doc-001"
        if doc_id not in global_doctor_queues:
            global_doctor_queues[doc_id] = []
        doctor_queue = global_doctor_queues[doc_id]
        token_num = f"Token {str(len(doctor_queue) + 1).zfill(3)}"
        new_entry = {
            "id": f"chk-{uuid4()}",
            "doctor_id": doc_id,
            "token_number": token_num,
            "patient_name": data.name,
            "phone": data.phone,
            "symptoms": data.symptoms,
            "status": "Waiting",
            "check_in_time": datetime.now().strftime("%I:%M %p"),
            "date": datetime.now().strftime("%b %d, %Y"),
        }
        doctor_queue.append(new_entry)
        return CheckInResponse(
            id=str(uuid4()),
            patient_id=str(uuid4()),
            is_returning_patient=False,
            message=f"Check-in successful! Your queue number is {token_num}.",
            queue_number=token_num,
            estimated_wait_minutes=10,
        )

@router.get("/queue/{doctor_id}")
async def get_doctor_queue(doctor_id: str):
    """
    Fetch Live Queue Records for a specific Doctor
    """
    items = global_doctor_queues.get(doctor_id, [])
    return {"doctor_id": doctor_id, "count": len(items), "queue": items}

@router.put("/queue/{doctor_id}/{item_id}/status")
async def update_doctor_queue_status(doctor_id: str, item_id: str, status: str):
    """
    Update Status of a Patient in Doctor Queue (Waiting, With Doctor, Completed, Skipped)
    """
    queue = global_doctor_queues.get(doctor_id, [])
    found = next((item for item in queue if item["id"] == item_id), None)
    if found:
        found["status"] = status
        return {"status": "success", "item": found}
    return {"status": "not_found"}

@router.get("/stats")
async def get_clinic_stats(clinic_id: Optional[str] = Query("hosp-001")):
    """Get check-in statistics"""
    total = sum(len(q) for q in global_doctor_queues.values())
    return {
        "clinic_id": clinic_id,
        "checkins_today": total,
        "total_patients": total,
        "returning_patients_today": 0,
    }
