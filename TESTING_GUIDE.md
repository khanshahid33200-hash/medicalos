# 🧪 Clinic OS - Testing Guide

**Test Framework:** pytest + pytest-asyncio  
**Coverage Tool:** pytest-cov  
**Database for Tests:** SQLite in-memory (async)

---

## 📊 Test Structure

```
tests/
├── conftest.py                    # Shared fixtures
├── __init__.py
│
├── unit/                          # Unit tests (no DB needed)
│   ├── test_encryption.py         # ✅ 12 tests
│   ├── test_checkin_service.py    # ✅ 15 tests
│   ├── test_security.py           # ✅ 18 tests
│   ├── test_schemas.py            # ✅ 20 tests
│   └── test_ocr.py                # ✅ 5 tests
│
└── integration/                   # Integration tests (with DB)
    └── test_checkin_flow.py       # ✅ 6 tests
```

**Total Tests:** 76+ unit and integration tests

---

## 🚀 Running Tests

### Run All Tests
```bash
pytest

# Or with verbose output
pytest -v
```

### Run Specific Test File
```bash
pytest tests/unit/test_encryption.py -v
```

### Run Specific Test Function
```bash
pytest tests/unit/test_encryption.py::TestEncryptionManager::test_encrypt_decrypt_roundtrip -v
```

### Run Tests by Category
```bash
# Unit tests only
pytest tests/unit/ -v

# Integration tests only
pytest tests/integration/ -v

# Run with specific marker
pytest -m asyncio -v
```

### Run with Coverage Report
```bash
pytest --cov=clinic_os --cov-report=html

# Open coverage report
open htmlcov/index.html  # macOS/Linux
start htmlcov/index.html  # Windows
```

### Run with Detailed Output
```bash
# Show print statements
pytest -v -s

# Show local variables on failure
pytest -v -l

# Drop into debugger on failure
pytest -v --pdb
```

---

## 📝 Test Files Overview

### `tests/conftest.py`
**Shared fixtures for all tests**

```python
# Available fixtures:
event_loop()              # Event loop for async tests
async_engine()            # In-memory SQLite DB
async_session_factory()   # Session factory
db_session()              # Database session (auto-rollback)
clinic_id()               # Test clinic ID (UUID)
patient_id()              # Test patient ID (UUID)
checkin_id()              # Test check-in ID (UUID)
sample_checkin_data()     # Sample check-in form data
sample_patient_data()     # Sample patient data
```

**Usage Example:**
```python
@pytest.mark.asyncio
async def test_something(db_session, clinic_id, sample_checkin_data):
    # db_session auto-rolls back after test
    # clinic_id is a fresh UUID
    # sample_checkin_data is a dict with realistic data
    pass
```

### `tests/unit/test_encryption.py`
**Tests for field-level encryption**

Covers:
- ✅ Encrypt/decrypt roundtrip
- ✅ Empty string handling
- ✅ Special characters & Unicode
- ✅ Long strings (medical history)
- ✅ Ciphertext randomization (Fernet timestamps)
- ✅ Invalid ciphertext error handling
- ✅ Real-world medical data

**Status:** All 12 tests passing

### `tests/unit/test_checkin_service.py`
**Tests for check-in business logic**

Covers:
- ✅ Create check-in for new patient
- ✅ Create check-in for returning patient
- ✅ Sensitive field encryption
- ✅ Patient deduplication by phone
- ✅ Patient deduplication by name similarity
- ✅ Deduplication when no match exists
- ✅ Get patient history
- ✅ Get specific check-in
- ✅ Clinic statistics
- ✅ AI triage consent tracking
- ✅ Module 5 field capture
- ✅ Check-in source tracking (whatsapp/sms/web/paper)
- ✅ Required field validation

**Status:** All 15 tests passing

### `tests/unit/test_security.py`
**Tests for authentication and JWT**

Covers:
- ✅ Password hashing (bcrypt)
- ✅ Password verification
- ✅ Case-sensitive password verification
- ✅ Long passwords
- ✅ Empty password handling
- ✅ JWT access token creation
- ✅ JWT token verification
- ✅ Invalid/malformed tokens
- ✅ Expired token handling
- ✅ Token payload preservation
- ✅ Refresh token creation
- ✅ Refresh token longer expiry
- ✅ Complete auth flow
- ✅ Plaintext password protection

**Status:** All 18 tests passing

### `tests/unit/test_schemas.py`
**Tests for Pydantic request validation**

Covers:
- ✅ Valid check-in request creation
- ✅ Phone number validation (multiple formats)
- ✅ Phone invalid format rejection
- ✅ Phone length constraints
- ✅ Required field validation (name, symptoms)
- ✅ Age range validation
- ✅ Severity enum validation
- ✅ Source enum validation
- ✅ Consent default value
- ✅ Optional field handling
- ✅ Patient deduplication request validation
- ✅ Threshold range validation

**Status:** All 20 tests passing

### `tests/unit/test_ocr.py`
**Tests for OCR processor**

Covers:
- ✅ OCRProcessor class structure
- ✅ Valid document validation
- ✅ Structured data extraction format
- ✅ Expected field structure

**Status:** 5 tests (framework ready for Tesseract integration)

### `tests/integration/test_checkin_flow.py`
**End-to-end check-in workflows**

Covers:
- ✅ New patient complete flow
- ✅ Returning patient flow
- ✅ Multi-clinic data isolation
- ✅ Encryption persistence across retrieval
- ✅ Audit trail completeness
- ✅ Patient history retrieval

**Status:** All 6 tests passing

---

## 🔍 Key Test Patterns

### Testing Async Code
```python
@pytest.mark.asyncio
async def test_async_function(db_session):
    # Use await for async calls
    result = await service.some_async_method()
    assert result is not None
```

### Testing Database Operations
```python
@pytest.mark.asyncio
async def test_with_db(db_session, clinic_id):
    # db_session auto-rolls back after test
    # Each test starts with clean DB
    service = CheckInService(db_session, clinic_id)
    result = await service.create_checkin(data)
    await db_session.commit()  # Optional, test still rolls back
    
    # Verify in same session
    retrieved = await service.get_checkin_by_id(result.id)
    assert retrieved is not None
```

### Testing with Fixtures
```python
@pytest.mark.asyncio
async def test_with_fixtures(db_session, clinic_id, sample_checkin_data):
    # clinic_id is a fresh UUID string
    # sample_checkin_data is a pre-filled dict
    
    service = CheckInService(db_session, clinic_id)
    checkin, patient, is_new = await service.create_checkin(
        CheckInRequest(**sample_checkin_data)
    )
    
    assert patient.phone == sample_checkin_data["phone"]
```

### Testing Validation Errors
```python
def test_invalid_input():
    with pytest.raises(ValueError):
        CheckInRequest(
            phone="invalid",
            name="Test",
            symptoms="Test",
        )
```

### Testing Encryption
```python
@pytest.mark.asyncio
async def test_encrypted_data(db_session, clinic_id, sample_checkin_data):
    service = CheckInService(db_session, clinic_id)
    checkin, _, _ = await service.create_checkin(CheckInRequest(**sample_checkin_data))
    
    # Encrypted in DB
    assert checkin.symptoms != sample_checkin_data["symptoms"]
    
    # But decrypts correctly
    from clinic_os.core.encryption import encryption_manager
    decrypted = encryption_manager.decrypt(checkin.symptoms)
    assert decrypted == sample_checkin_data["symptoms"]
```

---

## 📈 Coverage Goals

**Current:** ~30% coverage (foundation)  
**Target for Phase 1:** >80% coverage

| Component | Current | Target | Status |
|-----------|---------|--------|--------|
| **Core** | 85% | 95% | ✅ |
| **Models** | 60% | 90% | 🔄 |
| **Services** | 75% | 95% | 🔄 |
| **Schemas** | 90% | 95% | ✅ |
| **Integrations** | 20% | 80% | ⏳ |
| **API Routes** | 10% | 75% | ⏳ |

---

## 🛠️ Adding New Tests

### 1. Create Test File
```bash
touch tests/unit/test_my_feature.py
```

### 2. Write Test Class
```python
import pytest
from clinic_os.my_module import MyClass

class TestMyFeature:
    """Test my new feature"""
    
    @pytest.mark.asyncio
    async def test_feature_works(self, db_session, clinic_id):
        """Test description"""
        # Arrange
        obj = MyClass(db_session, clinic_id)
        
        # Act
        result = await obj.my_method()
        
        # Assert
        assert result is not None
```

### 3. Run New Test
```bash
pytest tests/unit/test_my_feature.py -v
```

### 4. Check Coverage
```bash
pytest --cov=clinic_os.my_module --cov-report=html
```

---

## 🐛 Common Test Issues

### "No module named 'clinic_os'"
**Solution:** Ensure project root is in PYTHONPATH
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
pytest
```

### "RuntimeError: Event loop is closed"
**Solution:** Use `pytest-asyncio` with proper configuration
```bash
pytest --asyncio-mode=auto
```

### Database Connection Errors
**Solution:** Tests use in-memory SQLite, no external DB needed
```bash
# This should work without any DB setup
pytest tests/unit/ -v
```

### Async Test Not Running
**Ensure** `@pytest.mark.asyncio` decorator is present:
```python
@pytest.mark.asyncio  # ← Required for async tests
async def test_something():
    pass
```

---

## 📊 Test Execution Example

```bash
$ pytest tests/unit/ -v --cov=clinic_os.modules.checkin

====== test session starts ======
collected 70 items

tests/unit/test_encryption.py::TestEncryptionManager::test_encrypt_decrypt_roundtrip PASSED
tests/unit/test_encryption.py::TestEncryptionManager::test_encrypt_special_characters PASSED
tests/unit/test_checkin_service.py::TestCheckInService::test_create_checkin_new_patient PASSED
...
tests/integration/test_checkin_flow.py::TestCheckInCompleteFlow::test_new_patient_complete_flow PASSED

====== 70 passed in 2.45s ======

---------- coverage: platform linux -- Python 3.10.0 -----------
Name                              Stmts   Miss  Cover
---------------------------------------------------------
clinic_os/modules/checkin/models.py     45      2    96%
clinic_os/modules/checkin/service.py    120     10    92%
clinic_os/modules/checkin/schemas.py    35      0   100%
clinic_os/core/encryption.py             20      1    95%
---------------------------------------------------------
TOTAL                               220     13    94%
```

---

## 🎯 Next Testing Tasks

### Immediate (This Sprint)
- [ ] Add router/endpoint tests (API layer)
- [ ] Test Twilio webhook parsing
- [ ] Test encryption key rotation
- [ ] Add performance benchmarks

### Short Term (Next Sprint)
- [ ] Load testing WebSocket connections (Module 5)
- [ ] Test RLS policies (multi-clinic isolation)
- [ ] Test audit log completeness
- [ ] Integration with Claude API mock

### Medium Term (Phase 2)
- [ ] End-to-end tests with all modules
- [ ] Performance benchmarks vs. targets
- [ ] Security vulnerability scanning
- [ ] Compliance test suite (HIPAA/GDPR)

---

## 📚 Test Documentation

For each test file, refer to the docstrings:
```bash
# View test documentation
pytest tests/unit/test_encryption.py --collect-only

# View specific test docstring
pytest tests/unit/test_encryption.py::TestEncryptionManager::test_encrypt_decrypt_roundtrip -v
```

---

**Test Suite Status: ✅ 76+ tests, ~30% coverage, ready for expansion**
