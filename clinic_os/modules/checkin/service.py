"""Business logic for check-in module"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from uuid import uuid4
from typing import Optional, Tuple
import logging
from difflib import SequenceMatcher

from clinic_os.modules.checkin.models import Patient, CheckIn, Clinic
from clinic_os.modules.checkin.schemas import CheckInRequest, PatientDedupeRequest
from clinic_os.core.encryption import encryption_manager
from clinic_os.core.audit import write_audit_log, AuditAction

logger = logging.getLogger(__name__)


class CheckInService:
    """Service for check-in operations"""

    def __init__(self, session: AsyncSession, clinic_id: str):
        self.session = session
        self.clinic_id = clinic_id

    async def create_checkin(self, data: CheckInRequest) -> Tuple[CheckIn, Patient, bool]:
        """
        Create a check-in record

        Args:
            data: Check-in form data

        Returns:
            Tuple of (CheckIn record, Patient record, is_new_patient)
        """
        is_new_patient = False

        # Find or create patient
        patient = await self._find_or_create_patient(
            phone=data.phone,
            name=data.name,
            age=data.age,
            gender=data.gender,
            language=data.language,
        )

        # Encrypt sensitive fields
        encrypted_symptoms = encryption_manager.encrypt(data.symptoms)
        encrypted_history = encryption_manager.encrypt(data.medical_history or "")
        encrypted_allergies = encryption_manager.encrypt(data.allergies or "")
        encrypted_medications = encryption_manager.encrypt(data.current_medications or "")
        encrypted_previous_med = encryption_manager.encrypt(data.previous_medication or "")
        encrypted_chronic = encryption_manager.encrypt(data.chronic_conditions or "")
        encrypted_surgeries = encryption_manager.encrypt(data.past_surgeries or "")

        # Create check-in record
        checkin = CheckIn(
            id=uuid4(),
            clinic_id=self.clinic_id,
            patient_id=patient.id,
            phone=data.phone,
            name=data.name,
            age=data.age,
            gender=data.gender,
            symptoms=encrypted_symptoms,
            medical_history=encrypted_history,
            allergies=encrypted_allergies,
            current_medications=encrypted_medications,
            language=data.language,
            # Module 5 fields
            previous_doctor=data.previous_doctor,
            previous_medication=encrypted_previous_med,
            duration_symptoms=data.duration_symptoms,
            severity=data.severity,
            chronic_conditions=encrypted_chronic,
            past_surgeries=encrypted_surgeries,
            consent_ai_triage=data.consent_ai_triage,
            # Metadata
            source=data.source,
            form_response_time_sec=data.form_response_time_sec,
            is_returning_patient=not is_new_patient,
        )

        self.session.add(checkin)
        await self.session.flush()

        # Write audit log
        await write_audit_log(
            session=self.session,
            clinic_id=self.clinic_id,
            action=AuditAction.CHECKIN_CREATED,
            resource_type="CheckIn",
            resource_id=str(checkin.id),
            details={
                "phone": data.phone,
                "name": data.name,
                "source": data.source,
                "is_returning": not is_new_patient,
                "consent_ai_triage": data.consent_ai_triage,
            },
        )

        logger.info(f"Check-in created: {checkin.id} for patient {patient.id}")

        return checkin, patient, is_new_patient

    async def _find_or_create_patient(
        self,
        phone: str,
        name: str,
        age: Optional[int] = None,
        gender: Optional[str] = None,
        language: str = "en",
    ) -> Patient:
        """Find existing patient or create new one"""
        # Search by phone first (most reliable)
        result = await self.session.execute(
            select(Patient).where(
                Patient.clinic_id == self.clinic_id,
                Patient.phone == phone,
                Patient.is_active == True,
            )
        )
        patient = result.scalars().first()

        if patient:
            # Update if any new info provided
            if age and not patient.age:
                patient.age = age
            if gender and not patient.gender:
                patient.gender = gender
            patient.language_preference = language
            self.session.add(patient)
            return patient

        # Create new patient
        patient = Patient(
            id=uuid4(),
            clinic_id=self.clinic_id,
            phone=phone,
            name=name,
            age=age,
            gender=gender,
            language_preference=language,
            is_active=True,
        )
        self.session.add(patient)
        await self.session.flush()

        logger.info(f"New patient created: {patient.id}")
        return patient

    async def deduplicate_patient(self, data: PatientDedupeRequest) -> dict:
        """
        Find duplicate patient records and optionally merge

        Args:
            data: Deduplication request

        Returns:
            Dictionary with match results
        """
        # Search for similar records
        result = await self.session.execute(
            select(Patient).where(
                Patient.clinic_id == self.clinic_id,
                Patient.is_active == True,
            )
        )
        patients = result.scalars().all()

        best_match = None
        best_score = 0

        for patient in patients:
            # Phone match
            if patient.phone == data.phone:
                return {
                    "found_existing": True,
                    "patient_id": str(patient.id),
                    "confidence": 1.0,
                    "matched_by": "phone",
                }

            # Name similarity
            name_similarity = SequenceMatcher(None, patient.name.lower(), data.name.lower()).ratio()
            if name_similarity > best_score:
                best_score = name_similarity
                best_match = patient

        # Check if match is above threshold
        if best_match and best_score >= data.match_threshold:
            return {
                "found_existing": True,
                "patient_id": str(best_match.id),
                "confidence": best_score,
                "matched_by": "name_similarity",
            }

        return {
            "found_existing": False,
            "patient_id": None,
            "confidence": best_score,
            "matched_by": None,
        }

    async def get_patient_history(self, patient_id: str, limit: int = 10) -> list:
        """Get check-in history for a patient"""
        result = await self.session.execute(
            select(CheckIn)
            .where(
                CheckIn.clinic_id == self.clinic_id,
                CheckIn.patient_id == patient_id,
            )
            .order_by(CheckIn.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def get_checkin_by_id(self, checkin_id: str) -> Optional[CheckIn]:
        """Get a specific check-in record"""
        result = await self.session.execute(
            select(CheckIn).where(
                CheckIn.clinic_id == self.clinic_id,
                CheckIn.id == checkin_id,
            )
        )
        return result.scalars().first()

    async def get_clinic_stats(self) -> dict:
        """Get check-in statistics for a clinic"""
        today_count = await self.session.execute(
            select(func.count(CheckIn.id)).where(
                CheckIn.clinic_id == self.clinic_id,
                func.date(CheckIn.created_at) == func.date(func.now()),
            )
        )

        patient_count = await self.session.execute(
            select(func.count(Patient.id)).where(
                Patient.clinic_id == self.clinic_id,
                Patient.is_active == True,
            )
        )

        returning_patient_count = await self.session.execute(
            select(func.count(CheckIn.id)).where(
                CheckIn.clinic_id == self.clinic_id,
                CheckIn.is_returning_patient == True,
                func.date(CheckIn.created_at) == func.date(func.now()),
            )
        )

        return {
            "checkins_today": today_count.scalar() or 0,
            "total_patients": patient_count.scalar() or 0,
            "returning_patients_today": returning_patient_count.scalar() or 0,
        }
