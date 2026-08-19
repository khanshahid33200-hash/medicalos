"""Integration tests for complete check-in flow"""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from clinic_os.modules.checkin.service import CheckInService
from clinic_os.modules.checkin.schemas import CheckInRequest
from clinic_os.core.audit import write_audit_log, AuditAction


class TestCheckInCompleteFlow:
    """Test complete check-in workflow integration"""

    @pytest.mark.asyncio
    async def test_new_patient_complete_flow(self, db_session: AsyncSession, clinic_id: str):
        """Test complete flow for new patient"""
        service = CheckInService(db_session, clinic_id)

        # Step 1: Submit check-in
        checkin_data = CheckInRequest(
            phone="+91-9876543210",
            name="New Patient",
            age=35,
            gender="M",
            symptoms="Fever for 3 days",
            medical_history="No known medical conditions",
            allergies="None",
            current_medications="None",
            severity="moderate",
            consent_ai_triage=True,
            source="whatsapp",
        )

        checkin, patient, is_new = await service.create_checkin(checkin_data)
        await db_session.flush()

        # Step 2: Verify patient created
        assert is_new == True
        assert patient.phone == "+91-9876543210"
        assert patient.is_active == True

        # Step 3: Verify check-in stored
        assert checkin.patient_id == patient.id
        assert checkin.clinic_id == clinic_id
        assert checkin.consent_ai_triage == True

        # Step 4: Write audit log
        await write_audit_log(
            session=db_session,
            clinic_id=clinic_id,
            action=AuditAction.CHECKIN_CREATED,
            resource_type="CheckIn",
            resource_id=str(checkin.id),
            details={"source": "whatsapp"},
        )
        await db_session.flush()

        # Step 5: Retrieve and verify
        retrieved_checkin = await service.get_checkin_by_id(str(checkin.id))
        assert retrieved_checkin is not None
        assert retrieved_checkin.id == checkin.id

        await db_session.commit()

    @pytest.mark.asyncio
    async def test_returning_patient_flow(self, db_session: AsyncSession, clinic_id: str):
        """Test flow for returning patient"""
        service = CheckInService(db_session, clinic_id)

        # Step 1: First check-in (new patient)
        first_checkin_data = CheckInRequest(
            phone="+91-9876543210",
            name="Test Patient",
            age=40,
            symptoms="Headache",
            consent_ai_triage=True,
            source="whatsapp",
        )

        first_checkin, patient, is_new_1 = await service.create_checkin(first_checkin_data)
        await db_session.flush()

        assert is_new_1 == True

        # Step 2: Second check-in (returning)
        second_checkin_data = CheckInRequest(
            phone="+91-9876543210",  # Same phone
            name="Test Patient",
            age=41,  # Age can change
            symptoms="Follow-up visit",
            consent_ai_triage=True,
            source="sms",
        )

        second_checkin, patient_2, is_new_2 = await service.create_checkin(second_checkin_data)
        await db_session.flush()

        assert is_new_2 == False
        assert patient.id == patient_2.id  # Same patient

        # Step 3: Get history
        history = await service.get_patient_history(str(patient.id), limit=10)

        assert len(history) == 2
        assert history[0].id == second_checkin.id  # Most recent first

        await db_session.commit()

    @pytest.mark.asyncio
    async def test_multi_clinic_isolation(self, db_session: AsyncSession):
        """Test that clinics cannot see each other's data"""
        clinic1_id = "clinic-1"
        clinic2_id = "clinic-2"

        # Create check-in for clinic 1
        service1 = CheckInService(db_session, clinic1_id)
        checkin_data = CheckInRequest(
            phone="+91-9876543210",
            name="Patient 1",
            symptoms="Clinic 1 symptoms",
            consent_ai_triage=True,
        )

        checkin1, patient1, _ = await service1.create_checkin(checkin_data)
        await db_session.flush()

        # Try to retrieve from clinic 2
        service2 = CheckInService(db_session, clinic2_id)

        # In a multi-tenant system with proper RLS, clinic2 should not see clinic1's data
        # This test documents the expected isolation behavior
        stats1 = await service1.get_clinic_stats()
        stats2 = await service2.get_clinic_stats()

        # Clinic 1 should have 1 check-in
        assert stats1["checkins_today"] >= 1
        # Clinic 2 should have 0 check-ins (different clinic)
        assert stats2["checkins_today"] == 0

        await db_session.commit()

    @pytest.mark.asyncio
    async def test_encryption_persists_across_retrieval(self, db_session: AsyncSession, clinic_id: str):
        """Test that encrypted data survives storage and retrieval"""
        service = CheckInService(db_session, clinic_id)

        sensitive_data = CheckInRequest(
            phone="+91-9876543210",
            name="Test Patient",
            symptoms="Sensitive symptom information",
            medical_history="Type 2 Diabetes",
            allergies="Penicillin, Aspirin",
            current_medications="Metformin 500mg, Lisinopril 10mg",
            consent_ai_triage=True,
        )

        # Create and store
        checkin, _, _ = await service.create_checkin(sensitive_data)
        await db_session.commit()

        # Retrieve fresh from DB
        retrieved = await service.get_checkin_by_id(str(checkin.id))

        # Verify sensitive data is encrypted in DB but decrypts correctly
        from clinic_os.core.encryption import encryption_manager

        assert encryption_manager.decrypt(retrieved.symptoms) == sensitive_data.symptoms
        assert encryption_manager.decrypt(retrieved.medical_history) == sensitive_data.medical_history
        assert encryption_manager.decrypt(retrieved.allergies) == sensitive_data.allergies
        assert encryption_manager.decrypt(retrieved.current_medications) == sensitive_data.current_medications

    @pytest.mark.asyncio
    async def test_audit_trail_completeness(self, db_session: AsyncSession, clinic_id: str):
        """Test that audit logs capture all actions"""
        from clinic_os.modules.checkin.models import AuditLog
        from sqlalchemy import select

        service = CheckInService(db_session, clinic_id)

        # Create check-in
        checkin_data = CheckInRequest(
            phone="+91-9876543210",
            name="Test Patient",
            symptoms="Test symptoms",
            consent_ai_triage=True,
        )

        checkin, _, _ = await service.create_checkin(checkin_data)
        await db_session.flush()

        # Verify audit log was created
        result = await db_session.execute(
            select(AuditLog).where(
                AuditLog.clinic_id == clinic_id,
                AuditLog.action == "CHECKIN_CREATED",
            )
        )
        audit_entries = result.scalars().all()

        assert len(audit_entries) > 0
        assert audit_entries[-1].resource_type == "CheckIn"
        assert audit_entries[-1].resource_id == str(checkin.id)

        await db_session.commit()
