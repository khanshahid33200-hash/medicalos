"""Unit tests for check-in service"""

import pytest
from uuid import uuid4
from sqlalchemy.ext.asyncio import AsyncSession

from clinic_os.modules.checkin.service import CheckInService
from clinic_os.modules.checkin.models import Patient, CheckIn
from clinic_os.modules.checkin.schemas import CheckInRequest, PatientDedupeRequest
from clinic_os.core.encryption import encryption_manager


class TestCheckInService:
    """Test check-in service business logic"""

    @pytest.mark.asyncio
    async def test_create_checkin_new_patient(self, db_session: AsyncSession, clinic_id: str, sample_checkin_data: dict):
        """Test creating check-in for new patient"""
        service = CheckInService(db_session, clinic_id)
        checkin_request = CheckInRequest(**sample_checkin_data)

        checkin, patient, is_new = await service.create_checkin(checkin_request)

        assert checkin is not None
        assert patient is not None
        assert is_new == True  # New patient
        assert patient.phone == sample_checkin_data["phone"]
        assert patient.name == sample_checkin_data["name"]
        assert patient.is_active == True
        await db_session.commit()

    @pytest.mark.asyncio
    async def test_create_checkin_returning_patient(self, db_session: AsyncSession, clinic_id: str, sample_checkin_data: dict):
        """Test creating check-in for returning patient"""
        service = CheckInService(db_session, clinic_id)
        checkin_request = CheckInRequest(**sample_checkin_data)

        # First check-in
        checkin1, patient1, is_new1 = await service.create_checkin(checkin_request)
        await db_session.flush()

        # Second check-in with same phone
        checkin2, patient2, is_new2 = await service.create_checkin(checkin_request)

        assert is_new1 == True
        assert is_new2 == False  # Should be returning patient
        assert patient1.id == patient2.id  # Same patient
        await db_session.commit()

    @pytest.mark.asyncio
    async def test_checkin_data_encryption(self, db_session: AsyncSession, clinic_id: str, sample_checkin_data: dict):
        """Test that sensitive fields are encrypted"""
        service = CheckInService(db_session, clinic_id)
        checkin_request = CheckInRequest(**sample_checkin_data)

        checkin, _, _ = await service.create_checkin(checkin_request)
        await db_session.commit()

        # Verify encrypted fields are not plaintext in DB
        assert checkin.symptoms != sample_checkin_data["symptoms"]
        assert checkin.medical_history != sample_checkin_data["medical_history"]
        assert checkin.allergies != sample_checkin_data["allergies"]

        # But should decrypt correctly
        decrypted_symptoms = encryption_manager.decrypt(checkin.symptoms)
        assert decrypted_symptoms == sample_checkin_data["symptoms"]

    @pytest.mark.asyncio
    async def test_patient_deduplication_by_phone(self, db_session: AsyncSession, clinic_id: str):
        """Test patient deduplication by phone number"""
        service = CheckInService(db_session, clinic_id)

        # Create initial patient
        await service._find_or_create_patient(
            phone="+91-9876543210",
            name="John Doe",
            age=30,
            gender="M",
            language="en"
        )
        await db_session.flush()

        # Deduplicate with same phone, different name
        dedupe_request = PatientDedupeRequest(
            phone="+91-9876543210",
            name="Jane Doe",
            match_threshold=0.8
        )
        result = await service.deduplicate_patient(dedupe_request)

        assert result["found_existing"] == True
        assert result["confidence"] == 1.0  # Perfect phone match
        assert result["matched_by"] == "phone"
        await db_session.commit()

    @pytest.mark.asyncio
    async def test_patient_deduplication_by_name(self, db_session: AsyncSession, clinic_id: str):
        """Test patient deduplication by name similarity"""
        service = CheckInService(db_session, clinic_id)

        # Create initial patient
        await service._find_or_create_patient(
            phone="+91-1111111111",
            name="Raj Kumar Singh",
            age=40,
        )
        await db_session.flush()

        # Deduplicate with similar name, different phone
        dedupe_request = PatientDedupeRequest(
            phone="+91-2222222222",
            name="Raj Kumar",  # Similar name
            match_threshold=0.7
        )
        result = await service.deduplicate_patient(dedupe_request)

        assert result["found_existing"] == True
        assert result["matched_by"] == "name_similarity"
        assert result["confidence"] > 0.7
        await db_session.commit()

    @pytest.mark.asyncio
    async def test_patient_deduplication_not_found(self, db_session: AsyncSession, clinic_id: str):
        """Test deduplication when no match exists"""
        service = CheckInService(db_session, clinic_id)

        dedupe_request = PatientDedupeRequest(
            phone="+91-9999999999",
            name="Unique Name XYZ",
            match_threshold=0.85
        )
        result = await service.deduplicate_patient(dedupe_request)

        assert result["found_existing"] == False
        assert result["patient_id"] is None

    @pytest.mark.asyncio
    async def test_get_patient_history(self, db_session: AsyncSession, clinic_id: str, sample_checkin_data: dict):
        """Test retrieving patient check-in history"""
        service = CheckInService(db_session, clinic_id)
        checkin_request = CheckInRequest(**sample_checkin_data)

        # Create multiple check-ins
        checkin1, patient, _ = await service.create_checkin(checkin_request)
        await db_session.flush()

        # Modify data for second check-in
        sample_checkin_data["symptoms"] = "Different symptoms"
        checkin_request2 = CheckInRequest(**sample_checkin_data)
        checkin2, _, _ = await service.create_checkin(checkin_request2)
        await db_session.flush()

        # Get history
        history = await service.get_patient_history(str(patient.id), limit=10)

        assert len(history) >= 2
        assert history[0].id == checkin2.id  # Most recent first
        await db_session.commit()

    @pytest.mark.asyncio
    async def test_get_checkin_by_id(self, db_session: AsyncSession, clinic_id: str, sample_checkin_data: dict):
        """Test retrieving specific check-in"""
        service = CheckInService(db_session, clinic_id)
        checkin_request = CheckInRequest(**sample_checkin_data)

        checkin, _, _ = await service.create_checkin(checkin_request)
        await db_session.flush()

        retrieved = await service.get_checkin_by_id(str(checkin.id))

        assert retrieved is not None
        assert retrieved.id == checkin.id
        assert retrieved.name == sample_checkin_data["name"]
        await db_session.commit()

    @pytest.mark.asyncio
    async def test_get_clinic_stats(self, db_session: AsyncSession, clinic_id: str, sample_checkin_data: dict):
        """Test clinic statistics"""
        service = CheckInService(db_session, clinic_id)

        # Create check-ins
        for i in range(3):
            sample_checkin_data["phone"] = f"+91-{9876543210 + i}"
            checkin_request = CheckInRequest(**sample_checkin_data)
            await service.create_checkin(checkin_request)
        await db_session.flush()

        stats = await service.get_clinic_stats()

        assert stats["total_patients"] == 3
        assert stats["checkins_today"] == 3
        await db_session.commit()

    @pytest.mark.asyncio
    async def test_checkin_consent_tracking(self, db_session: AsyncSession, clinic_id: str, sample_checkin_data: dict):
        """Test AI triage consent is stored"""
        service = CheckInService(db_session, clinic_id)

        sample_checkin_data["consent_ai_triage"] = True
        checkin_request = CheckInRequest(**sample_checkin_data)
        checkin, _, _ = await service.create_checkin(checkin_request)
        await db_session.commit()

        assert checkin.consent_ai_triage == True

    @pytest.mark.asyncio
    async def test_checkin_module5_fields(self, db_session: AsyncSession, clinic_id: str, sample_checkin_data: dict):
        """Test Module 5 (AI triage) fields are captured"""
        service = CheckInService(db_session, clinic_id)
        checkin_request = CheckInRequest(**sample_checkin_data)

        checkin, _, _ = await service.create_checkin(checkin_request)
        await db_session.commit()

        # Verify Module 5 fields are stored
        assert checkin.previous_doctor == sample_checkin_data["previous_doctor"]
        assert checkin.duration_symptoms == sample_checkin_data["duration_symptoms"]
        assert checkin.severity == sample_checkin_data["severity"]
        assert checkin.consent_ai_triage == sample_checkin_data["consent_ai_triage"]

    @pytest.mark.asyncio
    async def test_checkin_source_tracking(self, db_session: AsyncSession, clinic_id: str, sample_checkin_data: dict):
        """Test check-in source is tracked"""
        service = CheckInService(db_session, clinic_id)

        # Test different sources
        for source in ["whatsapp", "sms", "web", "paper"]:
            sample_checkin_data["source"] = source
            sample_checkin_data["phone"] = f"+91-{9876543210 + hash(source) % 1000}"
            checkin_request = CheckInRequest(**sample_checkin_data)

            checkin, _, _ = await service.create_checkin(checkin_request)

            assert checkin.source == source
        await db_session.commit()

    @pytest.mark.asyncio
    async def test_checkin_validates_required_fields(self, db_session: AsyncSession, clinic_id: str):
        """Test that required fields are validated"""
        service = CheckInService(db_session, clinic_id)

        # Missing required field (symptoms)
        invalid_data = {
            "phone": "+91-9876543210",
            "name": "Test",
            "symptoms": "",  # Required, empty
        }

        # Pydantic should validate this at schema level
        with pytest.raises(Exception):
            CheckInRequest(**invalid_data)
