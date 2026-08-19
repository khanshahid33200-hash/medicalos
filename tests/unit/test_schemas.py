"""Unit tests for Pydantic schemas and validation"""

import pytest
from clinic_os.modules.checkin.schemas import CheckInRequest, PatientDedupeRequest


class TestCheckInRequestValidation:
    """Test check-in request validation"""

    def test_valid_checkin_request(self):
        """Test creating valid check-in request"""
        data = {
            "phone": "+91-9876543210",
            "name": "Test Patient",
            "symptoms": "Fever and cough",
            "age": 30,
            "gender": "M",
        }

        request = CheckInRequest(**data)

        assert request.phone == data["phone"]
        assert request.name == data["name"]
        assert request.symptoms == data["symptoms"]

    def test_phone_validation_valid_formats(self):
        """Test phone validation accepts valid formats"""
        valid_phones = [
            "+91-9876543210",
            "+1-2025551234",
            "9876543210",
            "+44 20 7946 0958",
            "(555) 123-4567",
        ]

        for phone in valid_phones:
            request = CheckInRequest(
                phone=phone,
                name="Test",
                symptoms="Test symptoms",
            )
            assert request.phone == phone

    def test_phone_validation_invalid_formats(self):
        """Test phone validation rejects invalid formats"""
        invalid_phones = [
            "abc123def",  # Letters only
            "9876@43210",  # Invalid chars
            "!@#$%",  # Special chars
        ]

        for phone in invalid_phones:
            with pytest.raises(ValueError):
                CheckInRequest(
                    phone=phone,
                    name="Test",
                    symptoms="Test symptoms",
                )

    def test_phone_min_length(self):
        """Test phone minimum length validation"""
        with pytest.raises(ValueError):
            CheckInRequest(
                phone="123",  # Too short
                name="Test",
                symptoms="Test symptoms",
            )

    def test_phone_max_length(self):
        """Test phone maximum length validation"""
        with pytest.raises(ValueError):
            CheckInRequest(
                phone="+1234567890123456789012345",  # Too long
                name="Test",
                symptoms="Test symptoms",
            )

    def test_name_required(self):
        """Test name is required"""
        with pytest.raises(ValueError):
            CheckInRequest(
                phone="+91-9876543210",
                name="",  # Empty name not allowed
                symptoms="Test symptoms",
            )

    def test_symptoms_required(self):
        """Test symptoms is required"""
        with pytest.raises(ValueError):
            CheckInRequest(
                phone="+91-9876543210",
                name="Test Patient",
                symptoms="",  # Empty symptoms not allowed
            )

    def test_age_validation_range(self):
        """Test age validation"""
        # Valid age
        request = CheckInRequest(
            phone="+91-9876543210",
            name="Test",
            age=30,
            symptoms="Test",
        )
        assert request.age == 30

        # Age too high
        with pytest.raises(ValueError):
            CheckInRequest(
                phone="+91-9876543210",
                name="Test",
                age=150,
                symptoms="Test",
            )

        # Negative age
        with pytest.raises(ValueError):
            CheckInRequest(
                phone="+91-9876543210",
                name="Test",
                age=-5,
                symptoms="Test",
            )

    def test_gender_optional(self):
        """Test gender is optional"""
        request = CheckInRequest(
            phone="+91-9876543210",
            name="Test",
            symptoms="Test",
            # No gender provided
        )
        assert request.gender is None

    def test_severity_enum_validation(self):
        """Test severity must be one of enum values"""
        valid_severities = ["mild", "moderate", "severe"]

        for severity in valid_severities:
            request = CheckInRequest(
                phone="+91-9876543210",
                name="Test",
                symptoms="Test",
                severity=severity,
            )
            assert request.severity == severity

        with pytest.raises(ValueError):
            CheckInRequest(
                phone="+91-9876543210",
                name="Test",
                symptoms="Test",
                severity="critical",  # Invalid
            )

    def test_source_enum_validation(self):
        """Test source must be one of enum values"""
        valid_sources = ["whatsapp", "sms", "web", "paper"]

        for source in valid_sources:
            request = CheckInRequest(
                phone="+91-9876543210",
                name="Test",
                symptoms="Test",
                source=source,
            )
            assert request.source == source

    def test_consent_ai_triage_default(self):
        """Test consent_ai_triage defaults to False"""
        request = CheckInRequest(
            phone="+91-9876543210",
            name="Test",
            symptoms="Test",
            # No consent provided
        )
        assert request.consent_ai_triage == False

    def test_all_optional_fields(self):
        """Test request with only required fields"""
        request = CheckInRequest(
            phone="+91-9876543210",
            name="Test Patient",
            symptoms="Symptoms here",
        )

        assert request.phone == "+91-9876543210"
        assert request.name == "Test Patient"
        assert request.symptoms == "Symptoms here"
        assert request.age is None
        assert request.gender is None
        assert request.medical_history is None
        assert request.allergies is None
        assert request.current_medications is None
        assert request.language == "en"  # Default
        assert request.consent_ai_triage == False  # Default
        assert request.source == "whatsapp"  # Default


class TestPatientDedupeRequestValidation:
    """Test patient deduplication request validation"""

    def test_valid_dedupe_request(self):
        """Test creating valid dedupe request"""
        request = PatientDedupeRequest(
            phone="+91-9876543210",
            name="Test Patient",
        )

        assert request.phone == "+91-9876543210"
        assert request.name == "Test Patient"

    def test_dedupe_threshold_default(self):
        """Test deduplication threshold default"""
        request = PatientDedupeRequest(
            phone="+91-9876543210",
            name="Test",
        )

        assert request.match_threshold == 0.85

    def test_dedupe_threshold_custom(self):
        """Test custom deduplication threshold"""
        request = PatientDedupeRequest(
            phone="+91-9876543210",
            name="Test",
            match_threshold=0.95,
        )

        assert request.match_threshold == 0.95

    def test_dedupe_threshold_range(self):
        """Test deduplication threshold must be 0-1"""
        with pytest.raises(ValueError):
            PatientDedupeRequest(
                phone="+91-9876543210",
                name="Test",
                match_threshold=1.5,  # Invalid
            )

        with pytest.raises(ValueError):
            PatientDedupeRequest(
                phone="+91-9876543210",
                name="Test",
                match_threshold=-0.1,  # Invalid
            )

    def test_dedupe_email_optional(self):
        """Test email is optional in dedupe request"""
        request = PatientDedupeRequest(
            phone="+91-9876543210",
            name="Test",
            # No email
        )

        assert request.email is None
