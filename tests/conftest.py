"""Pytest configuration and shared fixtures"""

import pytest
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from uuid import uuid4

from clinic_os.database import Base
from clinic_os.config import settings


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def async_engine():
    """Create in-memory SQLite database for testing"""
    # Use SQLite for testing (async support)
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        echo=False,
        future=True,
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    await engine.dispose()


@pytest.fixture
async def async_session_factory(async_engine):
    """Create session factory for tests"""
    async_session = async_sessionmaker(
        async_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    return async_session


@pytest.fixture
async def db_session(async_session_factory):
    """Get database session for tests"""
    async with async_session_factory() as session:
        yield session
        await session.rollback()


@pytest.fixture
def clinic_id():
    """Generate test clinic ID"""
    return str(uuid4())


@pytest.fixture
def patient_id():
    """Generate test patient ID"""
    return str(uuid4())


@pytest.fixture
def checkin_id():
    """Generate test check-in ID"""
    return str(uuid4())


@pytest.fixture
def sample_checkin_data():
    """Sample check-in form data"""
    return {
        "phone": "+91-9876543210",
        "name": "Raj Kumar",
        "age": 42,
        "gender": "M",
        "symptoms": "Fever and body ache for 2 days",
        "medical_history": "Diabetes Type 2",
        "allergies": "Penicillin",
        "current_medications": "Metformin 500mg",
        "language": "en",
        "previous_doctor": "Dr. Smith",
        "duration_symptoms": "2 days",
        "severity": "moderate",
        "chronic_conditions": "Hypertension",
        "past_surgeries": "Appendectomy 2015",
        "consent_ai_triage": True,
        "source": "whatsapp",
        "form_response_time_sec": 120,
    }


@pytest.fixture
def sample_patient_data():
    """Sample patient data"""
    return {
        "phone": "+91-9876543210",
        "name": "John Doe",
        "age": 35,
        "gender": "M",
        "email": "john@example.com",
        "language_preference": "en",
    }
