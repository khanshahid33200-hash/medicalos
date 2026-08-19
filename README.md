# Clinic OS - Patient Workflow Automation Platform

A comprehensive, HIPAA-compliant patient workflow automation platform for clinics. Clinic OS removes the typing bottleneck through WhatsApp/SMS intake forms, AI-assisted triage, live queue management, automatic report delivery, and intelligent follow-ups.

## 🎯 Features

### Module 1: Patient Check-in (✅ In Development)
- WhatsApp QR code → dynamic intake forms
- SMS-based check-in for patients without WhatsApp
- Automatic patient deduplication & history lookup
- OCR for paper record digitization
- Encrypted sensitive data at rest
- Multi-language support

### Module 2: Appointment Booking (📋 Coming Soon)
- Dynamic appointment scheduling
- SMS/WhatsApp reminders (24h, 1h before)
- No-show recovery workflows
- Clinic capacity & availability management

### Module 3: Report Delivery (🗂️ Coming Soon)
- Doctor approval UI for test reports
- Automated PDF generation
- WhatsApp/SMS delivery to patients
- Delivery tracking & retry logic
- Patient receipt confirmation

### Module 4: Follow-ups & Recalls (🔄 Coming Soon)
- Rule-based automated follow-up scheduling
- Seasonal campaign support
- Patient opt-out tracking
- Compliance audit trail

### Module 5: AI-Assisted Queue & Triage (🤖 Coming Soon)
- Real-time live queue position tracker
- Claude API-powered triage brief generation
- Doctor decision support (not diagnosis)
- WebSocket-based live updates
- Urgency flagging & visual alerts
- One-tap patient status management

---

## 🏗️ Architecture

```
Patient Devices (WhatsApp/SMS)
    ↓
Message Gateway (Twilio/WhatsApp Cloud)
    ↓
FastAPI Backend (Clinic OS)
    ├── Check-in Module
    ├── Booking Module
    ├── Reports Module
    ├── Follow-ups Module
    ├── Queue & Triage Module
    └── Audit Trail
    ↓
PostgreSQL (Supabase) + Redis
    ↓
Twilio, Claude API, n8n Workflows
```

**Key Principles:**
- ✅ Multi-tenant by construction (RLS enforced at DB layer)
- ✅ Everything encrypted at rest (PHI-sensitive fields)
- ✅ Comprehensive audit logging for compliance
- ✅ External service failures don't block core flows
- ✅ Async processing for AI, PDFs, reminders

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.10+ (for local development)
- PostgreSQL 14+ (handled by Docker)
- Redis (handled by Docker)

### Option 1: Local Development with Docker

```bash
# Clone the repository
git clone https://github.com/khanshahid33200-hash/medicalos.git
cd medicalos

# Copy environment file
cp .env.example .env

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# Access the API
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Python Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Set DATABASE_URL and REDIS_URL in .env
# Start PostgreSQL and Redis (or update .env to point to your instances)

# Run migrations
alembic upgrade head

# Start the server
uvicorn clinic_os.main:app --reload --port 8000
```

---

## 📚 API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

### Module 1: Check-in API Examples

**Submit Check-in**
```bash
curl -X POST http://localhost:8000/api/v1/checkins/ \
  -H "Content-Type: application/json" \
  -d '{
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
    "source": "whatsapp"
  }' \
  -H "clinic_id: your-clinic-id"
```

**Check Patient History**
```bash
curl http://localhost:8000/api/v1/checkins/patient/{patient_id}/history \
  -H "clinic_id: your-clinic-id"
```

**Get Clinic Stats**
```bash
curl http://localhost:8000/api/v1/checkins/stats \
  -H "clinic_id: your-clinic-id"
```

---

## 🔐 Security & Compliance

- **HIPAA (US):** Audit logging, field-level encryption, business associate agreements
- **GDPR (UK/EU):** Data export/deletion scope includes AI briefs
- **PDPA (Singapore):** Cross-border restrictions, data residency controls
- **India:** PII encryption standard for medical history
- **Authentication:** JWT for staff, signed tokens for public endpoints
- **Row-Level Security:** Multi-tenant isolation enforced at PostgreSQL layer
- **Audit Trail:** Every action logged with user, timestamp, and details

---

## 🛠️ Configuration

All configuration is managed via environment variables (loaded in `clinic_os/config.py`):

```bash
# Core
ENV=development
DEBUG=false
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/clinic_os

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-fernet-key

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890

# Claude API (for AI triage)
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MODEL=claude-sonnet-4-6

# Tesseract (for OCR)
TESSERACT_PATH=/usr/bin/tesseract
```

See `.env.example` for all options.

---

## 📁 Project Structure

```
clinic_os/
├── main.py                    # FastAPI app entry point
├── config.py                  # Pydantic Settings
├── database.py                # SQLAlchemy & session management
├── core/                      # Shared utilities
│   ├── security.py           # Auth & JWT
│   ├── encryption.py         # Field-level encryption
│   └── audit.py              # Compliance logging
├── modules/
│   ├── checkin/              # Module 1
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── service.py
│   │   ├── router.py
│   │   └── ocr.py
│   ├── booking/              # Module 2 (stub)
│   ├── reports/              # Module 3 (stub)
│   ├── followups/            # Module 4 (stub)
│   └── queue_triage/         # Module 5 (stub)
├── integrations/
│   ├── twilio_client.py      # SMS/WhatsApp
│   └── claude_client.py      # AI triage
├── workers/                  # Background jobs
│   └── (APScheduler / Celery tasks)
├── migrations/               # Alembic database migrations
└── tests/                    # Unit & integration tests
```

---

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=clinic_os tests/

# Run specific test file
pytest tests/unit/test_checkin.py

# Run integration tests (requires DB)
pytest tests/integration/
```

---

## 📦 Deployment

### Docker Compose (Local/Development)
```bash
docker-compose up -d
docker-compose logs -f backend
docker-compose down
```

### AWS ECS / Heroku (Production)
See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Database setup (Supabase or AWS RDS)
- Load balancer & WebSocket support
- Environment configuration
- Monitoring & alerting
- Zero-downtime deploys

### GitHub Actions CI/CD
Automated pipeline in `.github/workflows/`:
1. Lint (black, flake8, isort)
2. Unit tests (pytest)
3. Integration tests (with ephemeral DB)
4. Build Docker image
5. Push to registry
6. Deploy to staging
7. OWASP ZAP security scan
8. Manual promote to production

---

## 🔄 Workflow Integration (n8n)

Clinic OS works with n8n for:
- **Check-in → AI Triage:** Async brief generation on form submission
- **Booking → Reminders:** Scheduled SMS/WhatsApp 24h and 1h before
- **Queue → Follow-ups:** Triggered on status changes
- **Custom Campaigns:** Seasonal/rule-based messaging

See `n8n-workflows/` for template configurations.

---

## 📊 Monitoring & Observability

- **Structured JSON logging** with `clinic_id`, `request_id`, `module` tags
- **DataDog/New Relic integration** for APM, error tracking
- **Database query logging** (slow query alerts)
- **Audit logs queryable** for compliance investigations
- **Health checks** for all external dependencies

```bash
# View logs
docker-compose logs -f backend

# Check API health
curl http://localhost:8000/health
```

---

## ❓ FAQ

**Q: How is patient data protected?**  
A: Field-level encryption for sensitive data (symptoms, allergies, medical history), all-at-rest encryption via Fernet, RLS at database layer, and comprehensive audit logging.

**Q: Does AI brief ever reach the patient?**  
A: No. The brief is clinician decision support only, stored with `role != 'patient'` RLS policy, never shown in any patient-facing UI.

**Q: What happens if Claude API fails?**  
A: Queue and check-in flows continue unaffected. The brief is marked `ai_unavailable=true` so the doctor sees "manual review recommended."

**Q: Can a clinic have multiple doctors?**  
A: Yes. Each doctor gets their own queue per specialty/department, and queue positions are updated in real-time via WebSocket.

**Q: How does patient deduplication work?**  
A: Primary match on phone number, secondary match on name similarity (>85% threshold). Configurable per clinic.

---

## 📝 Development Roadmap

- [x] Module 1: Check-in automation
- [ ] Module 2: Appointment booking
- [ ] Module 3: Report delivery
- [ ] Module 4: Follow-ups & recalls
- [ ] Module 5: AI-assisted queue & triage
- [ ] Lab integration (Phase 3)
- [ ] Advanced AI features (drug interactions, trend analysis)
- [ ] HIPAA certification
- [ ] GDPR compliance audit

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 📞 Support

- **Documentation:** https://clinic-os-docs.example.com
- **Issues & Bugs:** https://github.com/khanshahid33200-hash/medicalos/issues
- **Security:** security@clinic-os.example.com
- **Email:** support@clinic-os.example.com

---

## 🙏 Acknowledgments

Built with:
- **FastAPI** — modern async Python web framework
- **PostgreSQL** — reliable relational database
- **Twilio** — SMS/WhatsApp integration
- **Claude API** — AI-powered triage
- **Supabase** — hosted PostgreSQL + auth
- **Redis** — real-time pub/sub & caching
- **Alembic** — database migrations

---

**Made with ❤️ for clinics and patients** | Version 1.0.0
