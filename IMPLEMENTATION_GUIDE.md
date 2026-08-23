# Med Rapidly v3.3 - Implementation Guide

## 📋 Overview

Med Rapidly is a digital reception system for hospitals and clinics that replaces paper registers with a real-time digital queue. This guide covers the complete implementation from local development through production deployment.

## ✅ What's Implemented

### Phase 1: Core Infrastructure (Complete)
- ✅ FastAPI application structure
- ✅ PostgreSQL database schema with RLS support
- ✅ Field-level encryption for PHI
- ✅ JWT authentication framework
- ✅ Audit logging system
- ✅ Alembic database migrations

### Phase 2: Check-in Module (In Progress)
- ✅ Patient model & deduplication logic
- ✅ Check-in form submission API
- ✅ Medical history encryption
- ✅ OCR for paper records (Tesseract integration)
- ✅ Patient history lookup
- ✅ Clinic statistics endpoint
- ⏳ Twilio/WhatsApp webhook handler
- ⏳ SMS command parsing
- ⏳ Dynamic form configuration

### Phase 3: Integration Points (Not Yet Implemented)
- Queue entry creation (triggers Module 5)
- AI triage brief generation (async, Claude API)
- WhatsApp/SMS notifications with queue number

---

## 🚀 Getting Started

### Step 1: Environment Setup

```bash
# Navigate to project directory
cd "D:\clinical os"

# Copy and configure environment
cp .env.example .env

# Edit .env with your credentials:
# - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
# - ANTHROPIC_API_KEY
# - DATABASE_URL (if using external Postgres)
# - REDIS_URL (if using external Redis)
```

### Step 2: Start Services

**Option A: Docker Compose (Recommended)**
```bash
docker-compose up -d
```

**Option B: Local Script**
```bash
# Windows
.\run_local.bat

# Linux/Mac
./run_local.sh
```

### Step 3: Initialize Database

```bash
# Run migrations
docker-compose exec backend alembic upgrade head

# Or if running locally
alembic upgrade head
```

### Step 4: Verify Setup

```bash
# Health check
curl http://localhost:8000/health

# API documentation
open http://localhost:8000/docs
```

---

## 🔌 API Endpoints (Module 1)

### Submit Check-in
**POST** `/api/v1/checkins/`

```json
{
  "phone": "+91-98765-43210",
  "name": "John Doe",
  "age": 35,
  "gender": "M",
  "symptoms": "Fever and cough for 2 days",
  "medical_history": "Hypertension",
  "allergies": "Penicillin",
  "current_medications": "Lisinopril",
  "language": "en",
  "severity": "moderate",
  "consent_ai_triage": true,
  "source": "whatsapp",
  "form_response_time_sec": 120
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "patient_id": "987f6543-e21b-12d3-a456-426614174999",
  "is_returning_patient": false,
  "message": "Check-in successful. Welcome! You will receive a queue number shortly.",
  "queue_number": null,
  "estimated_wait_minutes": null
}
```

### Get Patient History
**GET** `/api/v1/checkins/patient/{patient_id}/history?limit=10`

### Patient Deduplication
**POST** `/api/v1/checkins/dedupe`

```json
{
  "phone": "+91-98765-43210",
  "name": "John Doe",
  "email": "john@example.com",
  "match_threshold": 0.85
}
```

### Get Clinic Statistics
**GET** `/api/v1/checkins/stats`

---

## 🔐 Security Considerations

### Encryption
- All sensitive fields are encrypted with Fernet (field-level encryption)
- Encrypted fields: symptoms, medical_history, allergies, medications, chronic_conditions, surgeries
- Keys rotated quarterly per compliance requirements

### Multi-Tenancy
- Every table has `clinic_id` column
- RLS (Row Level Security) enforced at PostgreSQL layer via `auth.user_clinic_id()` session variable
- A query bug cannot leak data across clinics

### Audit Logging
All check-in actions written to `audit_logs`:
- Check-in created
- AI triage brief generated
- Patient history accessed
- Data exported/deleted

---

## 🧪 Testing

### Unit Tests
```bash
pytest tests/unit/test_checkin.py -v
```

### Integration Tests (with DB)
```bash
pytest tests/integration/test_checkin_full.py -v
```

### Load Testing (WebSocket ready for Module 5)
```bash
k6 run tests/load/checkin_burst.js
```

---

## 📊 Database Schema

### patients table
- `id` (UUID) - Primary key
- `clinic_id` (UUID) - Multi-tenant isolation
- `phone` (String) - Indexed, primary lookup
- `name` (String) - Patient name
- `age` (Integer) - Age
- `gender` (String) - M/F/Other
- `email` (String) - Contact email
- `medical_history` (Text, encrypted) - PHI
- `allergies` (Text, encrypted) - PHI
- `language_preference` (String) - Localization
- `is_active` (Boolean) - Soft delete support
- `created_at`, `updated_at` (DateTime)

### check_ins table
- `id` (UUID) - Primary key
- `clinic_id` (UUID) - Multi-tenant isolation
- `patient_id` (UUID) - Foreign key
- `phone` (String) - Contact number
- `name` (String) - Name as submitted
- `symptoms` (Text, encrypted) - PHI
- `medical_history` (Text, encrypted) - PHI
- `allergies` (Text, encrypted) - PHI
- `current_medications` (Text, encrypted) - PHI
- **Module 5 fields:**
  - `previous_doctor` (String)
  - `previous_medication` (Text, encrypted)
  - `duration_symptoms` (String)
  - `severity` (Enum: mild/moderate/severe)
  - `chronic_conditions` (Text, encrypted)
  - `past_surgeries` (Text, encrypted)
  - `consent_ai_triage` (Boolean)
- `source` (String) - whatsapp/sms/web/paper
- `form_response_time_sec` (Integer)
- `is_returning_patient` (Boolean)
- `ocr_confidence` (Integer) - For paper records
- `created_at`, `updated_at` (DateTime)

### audit_logs table
- `id` (UUID)
- `clinic_id` (UUID)
- `action` (String) - CHECKIN_CREATED, etc.
- `resource_type` (String) - CheckIn, Patient, etc.
- `resource_id` (String)
- `user_id` (UUID, nullable)
- `details` (JSONB) - Context data
- `status` (String) - success/failure
- `timestamp` (DateTime)

---

## 🔄 Data Flow (Module 1)

```
1. Patient scans QR code or clicks WhatsApp link
                    ↓
2. Twilio webhook receives message
                    ↓
3. Parse message → extract form or route to handler
                    ↓
4. POST /api/v1/checkins/ with intake data
                    ↓
5. CheckInService.create_checkin()
   a. Deduplicate patient (phone match)
   b. Create/update Patient record
   c. Encrypt sensitive fields
   d. Create CheckIn record
   e. Write audit log
                    ↓
6. Return CheckInResponse with patient info
                    ↓
7. [TODO] Trigger queue entry creation (Module 5)
                    ↓
8. [TODO] Trigger AI triage brief generation (async)
                    ↓
9. [TODO] Send WhatsApp/SMS confirmation with queue number
```

---

## 🛠️ Next Steps (Roadmap)

### Immediate (This Sprint)
- [ ] Implement Twilio webhook handler at `/checkins/webhook/twilio`
- [ ] Parse WhatsApp message content into check-in form
- [ ] SMS command parsing (e.g., "CHECKIN FEVER COUGH")
- [ ] Dynamic form configuration endpoint
- [ ] Paper record OCR workflow with confidence scoring

### Short Term (Next Sprint)
- [ ] Integrate with Module 5 (queue entry creation)
- [ ] Integrate with Module 5 (AI triage brief async job)
- [ ] WhatsApp/SMS notification with queue number
- [ ] Patient tracker live page
- [ ] Real-time queue updates via WebSocket

### Medium Term (Phase 2)
- [ ] Module 2: Appointment booking
- [ ] Module 3: Report delivery
- [ ] Module 4: Follow-ups & recalls
- [ ] Complete Module 5: AI queue & triage
- [ ] Lab system integration

### Compliance & Scale
- [ ] HIPAA certification & BAA with Anthropic
- [ ] GDPR compliance audit
- [ ] PDPA compliance (Singapore)
- [ ] Load testing at 1000 concurrent check-ins
- [ ] Celery migration for job scaling

---

## 🐛 Troubleshooting

### "CHECKIN_CREATED but queue_number is null"
This is expected in current version. Queue entry creation is in Module 5 (not yet implemented). The check-in is successfully recorded; queue assignment will come next.

### "Encryption key error"
Ensure `ENCRYPTION_KEY` in .env is a valid Fernet key. Generate one:
```python
from cryptography.fernet import Fernet
print(Fernet.generate_key().decode())
```

### "Database connection refused"
Check that PostgreSQL is running:
```bash
docker-compose ps  # Should show 'postgres' in running state
# Or
psql postgresql://clinic_user:clinic_pass@localhost:5432/clinic_os
```

### "Tesseract not found"
For OCR to work, install Tesseract:
- **Ubuntu:** `sudo apt-get install tesseract-ocr`
- **macOS:** `brew install tesseract`
- **Windows:** Download from https://github.com/UB-Mannheim/tesseract/wiki

---

## 📖 Code Examples

### Create a Check-in (Python)
```python
import httpx
import asyncio

async def submit_checkin():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/v1/checkins/",
            json={
                "phone": "+91-9876543210",
                "name": "Raj Kumar",
                "age": 42,
                "gender": "M",
                "symptoms": "Severe headache and body pain",
                "medical_history": "Diabetes",
                "allergies": "Aspirin",
                "severity": "moderate",
                "consent_ai_triage": True,
            },
            headers={"clinic_id": "my-clinic-id"}
        )
        print(response.json())

asyncio.run(submit_checkin())
```

### Access Check-in in Service Layer
```python
from clinic_os.modules.checkin.service import CheckInService
from sqlalchemy.ext.asyncio import AsyncSession

async def my_function(db: AsyncSession, clinic_id: str):
    service = CheckInService(db, clinic_id)
    
    # Create check-in
    checkin, patient, is_new = await service.create_checkin(data)
    
    # Get history
    history = await service.get_patient_history(patient.id, limit=10)
    
    # Check stats
    stats = await service.get_clinic_stats()
```

### Verify Encryption
```python
from clinic_os.core.encryption import encryption_manager

plaintext = "Sensitive medical data"
encrypted = encryption_manager.encrypt(plaintext)
decrypted = encryption_manager.decrypt(encrypted)
print(encrypted)  # Looks like: gAAAAABl...
print(decrypted)  # Sensitive medical data
```

---

## 📞 Support & Questions

- **Documentation:** See README.md for overview
- **API Docs:** http://localhost:8000/docs (running server)
- **Issues:** Open a GitHub issue with logs and steps to reproduce

---

**Module 1 Implementation Status: 60% Complete**
- Infrastructure: ✅ Done
- Core logic: ✅ Done
- API endpoints: ✅ Done
- Twilio integration: ⏳ In progress
- Module 5 integration: ⏳ Blocked (Module 5 not ready)
