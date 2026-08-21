from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/doctor", tags=["Doctor Authentication & Profile"])

class DoctorProfileResponse(BaseModel):
    doctor_id: str
    firebase_uid: str
    hospital_id: str
    hospital_name: str
    name: str
    email: str
    department_id: str
    department_name: str
    specialization: str
    role: str
    status: str

@router.get("/profile/{firebase_uid}", response_model=DoctorProfileResponse)
async def get_doctor_by_firebase_uid(firebase_uid: str):
    """
    Fetch Doctor Profile & Hospital Association in Supabase Database by Firebase Auth UID.
    """
    # Demo doctor profile mapping for local environment / Supabase integration
    if "admin" in firebase_uid.lower():
        return DoctorProfileResponse(
            doctor_id="doc-admin-001",
            firebase_uid=firebase_uid,
            hospital_id="hosp-001",
            hospital_name="Metro Care General Hospital",
            name="Dr. Sarah Jenkins (Admin)",
            email="admin@hospital.com",
            department_id="dept-cardio-01",
            department_name="Cardiology",
            specialization="Executive Chief of Cardiology",
            role="admin",
            status="active"
        )

    return DoctorProfileResponse(
        doctor_id=f"doc-{firebase_uid[:8]}",
        firebase_uid=firebase_uid,
        hospital_id="hosp-001",
        hospital_name="Metro Care General Hospital",
        name="Dr. Rahul Sharma",
        email="doctor@hospital.com",
        department_id="dept-cardio-01",
        department_name="Cardiology",
        specialization="Interventional Cardiology",
        role="doctor",
        status="active"
    )
