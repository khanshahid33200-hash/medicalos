# ⚡ Clinic OS - Quick Start Guide

**Build Date:** August 19, 2025  
**Current Status:** Foundation complete, Module 1 (60% ready)  
**Next Step:** Twilio webhook integration

---

## 🚀 5-Minute Setup

### Windows
```cmd
# Navigate to project
cd "D:\clinical os"

# Copy environment
copy .env.example .env

# Run startup script
run_local.bat
```

### macOS / Linux
```bash
cd "D:\clinical os"
cp .env.example .env
./run_local.sh
```

**That's it!** The script will:
- ✅ Create Python virtual environment
- ✅ Install dependencies
- ✅ Start PostgreSQL & Redis (Docker)
- ✅ Run database migrations
- ✅ Start FastAPI server on port 8000

---

## 🔍 Verify Installation

Open your browser:
- **API Docs:** http://localhost:8000/docs
- **Alternative Docs:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

---

## 📝 Test API (Copy & Paste)

### 1. Submit Check-in
```bash
curl -X POST http://localhost:8000/api/v1/checkins/ \
  -H "Content-Type: application/json" \
  -H "clinic_id: clinic-001" \
  -d '{
    "phone": "+91-9876543210",
    "name": "Raj Kumar",
    "age": 42,
    "gender": "M",
    "symptoms": "Fever and body ache for 2 days",
    "medical_history": "Diabetes",
    "allergies": "Aspirin",
    "current_medications": "Metformin 500mg",
    "language": "en",
    "severity": "moderate",
    "consent_ai_triage": true,
    "source": "whatsapp"
  }'
```

**Expected Response:**
```json
{
  "id": "123e4567-...",
  "patient_id": "987f6543-...",
  "is_returning_patient": false,
  "message": "Check-in successful. Welcome! You will receive a queue number shortly.",
  "queue_number": null,
  "estimated_wait_minutes": null
}
```

### 2. Get Clinic Stats
```bash
curl http://localhost:8000/api/v1/checkins/stats \
  -H "clinic_id: clinic-001"
```

### 3. Get Patient History
```bash
curl http://localhost:8000/api/v1/checkins/patient/{patient_id}/history \
  -H "clinic_id: clinic-001"
```

---

## 📂 Project Structure at a Glance

```
clinic_os/
├── main.py                    # FastAPI app (port 8000)
├── config.py                  # Environment settings
├── database.py                # PostgreSQL connection
│
├── core/
│   ├── security.py           # JWT auth
│   ├── encryption.py         # Fernet for PHI
│   └── audit.py              # Compliance logging
│
├── modules/
│   ├── checkin/              # ✅ Patient check-in (60%)
│   ├── booking/              # 📋 Appointment booking (stub)
│   ├── reports/              # 🗂️ Report delivery (stub)
│   ├── followups/            # 🔄 Auto follow-ups (stub)
│   └── queue_triage/         # 🤖 AI queue & triage (stub)
│
├── integrations/
│   ├── twilio_client.py      # SMS/WhatsApp
│   └── claude_client.py      # AI triage
│
└── migrations/               # Database schema
    └── versions/
        └── 001_initial_schema.py
```

---

## 🔐 Security Built-In

✅ **Field-level encryption** — Medical history, allergies, medications encrypted at rest  
✅ **Multi-tenancy** — Each clinic's data isolated at database layer (RLS)  
✅ **Audit logging** — Every action tracked for compliance  
✅ **JWT authentication** — Secure staff access  
✅ **Input validation** — Pydantic schemas prevent bad data  

---

## 🧪 Run Tests (When Ready)

```bash
# Unit tests
pytest tests/unit/ -v

# Integration tests (requires DB)
pytest tests/integration/ -v

# All tests with coverage
pytest --cov=clinic_os tests/
```

---

## 📊 Current Build Status

| Component | Status | % Complete |
|-----------|--------|-----------|
| **Foundation** | ✅ Complete | 100% |
| Module 1: Check-in | 🔄 In progress | 60% |
| Module 2: Booking | ✅ Stub ready | 0% |
| Module 3: Reports | ✅ Stub ready | 0% |
| Module 4: Follow-ups | ✅ Stub ready | 0% |
| Module 5: AI Queue | ✅ Stub ready | 0% |
| Docker setup | ✅ Complete | 100% |
| Database | ✅ Complete | 100% |
| **Total Build** | 🔄 In progress | **30%** |

---

## 🎯 Next Development Task (1-2 Days)

**Goal:** Complete Module 1 by implementing Twilio webhook

```python
# clinic_os/modules/checkin/router.py

@router.post("/webhook/twilio")
async def twilio_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Handle inbound WhatsApp/SMS from Twilio
    
    TODO:
    1. Verify Twilio signature
    2. Parse WhatsApp message
    3. Extract clinic ID from webhook context
    4. Route to check-in form or SMS command handler
    5. Return Twilio response
    """
    pass
```

---

## 📞 Common Commands

```bash
# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Restart everything
docker-compose restart

# Access database shell
docker-compose exec postgres psql -U clinic_user -d clinic_os

# Run migrations
docker-compose exec backend alembic upgrade head

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "description"
```

---

## 🔑 Key Credentials (Development Only)

**Database:**
- Host: localhost
- Port: 5432
- User: clinic_user
- Password: clinic_pass
- Database: clinic_os

**Redis:**
- Host: localhost
- Port: 6379

**Clinic ID (for testing):**
- Use any string like: `clinic-001`, `test-clinic`, etc.

⚠️ **CHANGE ALL CREDENTIALS IN PRODUCTION!**

---

## 🐛 Troubleshooting

**Port 8000 already in use?**
```bash
# Find what's using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Database connection failed?**
```bash
# Check if Docker services are running
docker-compose ps

# Restart services
docker-compose restart postgres redis
```

**Encryption key error?**
Generate a new Fernet key:
```python
from cryptography.fernet import Fernet
key = Fernet.generate_key()
print(key.decode())  # Copy this to ENCRYPTION_KEY in .env
```

---

## 📖 Full Documentation

- **README.md** — Overview & architecture
- **IMPLEMENTATION_GUIDE.md** — Detailed Module 1 spec
- **BUILD_STATUS.md** — Full progress report
- **Clinic-OS-PRD-V2-Unified.md** — Product requirements
- **backend.md** — Backend engineering spec

---

## 🚀 Ready to Code?

1. ✅ Environment running? (Check http://localhost:8000/docs)
2. ✅ Test check-in working? (Run curl test above)
3. ✅ Understand Module 1 flow? (Read IMPLEMENTATION_GUIDE.md)
4. 🎯 **Next:** Implement Twilio webhook at `/checkins/webhook/twilio`

---

## 💬 Questions?

Check the docs or open an issue:
- GitHub: https://github.com/khanshahid33200-hash/medicalos
- Docs: See markdown files in project root

---

**Happy coding! 🏥💻**
