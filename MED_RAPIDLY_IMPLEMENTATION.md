# Med Rapidly - Implementation Plan

## Executive Summary
Med Rapidly is a digital reception system for hospitals and clinics that replaces paper registers with a digital queue system running on patients' phones. Key features include QR-based intake, real-time queue tracking, digital prescriptions, and a voice reception agent.

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with TypeScript, App Router
- **Backend**: Next.js API routes + PostgreSQL
- **Real-time**: WebSocket + Postgres Change Events
- **Database**: PostgreSQL with isolation policies
- **Voice Agent**: Claude API for voice processing
- **Storage**: S3 or similar for PDF prescriptions
- **Authentication**: JWT with server-side sessions

### Key Architectural Principles
1. **One QR per hospital** - Single token encodes hospital intake form
2. **Server-first rendering** - Data fetching on server, interactive elements hydrate as client components
3. **Database-enforced security** - Data isolation at DB level, not just application
4. **Real-time updates** - WebSocket subscriptions to Postgres changes
5. **Single transaction integrity** - Critical operations (booking, queue advancing) use database transactions

---

## Database Schema

### Core Tables

#### 1. Hospitals
```sql
CREATE TABLE hospitals (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  letterhead_html TEXT,
  opening_hours JSONB,
  daily_token_cap INT DEFAULT 500,
  booking_window_days INT DEFAULT 7,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  status TEXT DEFAULT 'active' -- active, suspended
);
```

#### 2. Intake Links (QR Codes)
```sql
CREATE TABLE intake_links (
  id UUID PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id),
  token VARCHAR(24) UNIQUE NOT NULL, -- gen_random_bytes(12) encoded
  created_at TIMESTAMP DEFAULT NOW(),
  regenerated_at TIMESTAMP,
  regenerated_by UUID
);
```

#### 3. Departments
```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id) NOT NULL,
  name TEXT NOT NULL,
  short_code VARCHAR(5) NOT NULL, -- ORT, GEN, PED, etc
  display_order INT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(hospital_id, short_code)
);
```

#### 4. Users (Doctors, Admin, Reception)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL, -- doctor, hospital_admin, reception, super_admin
  qualification TEXT,
  registration_number TEXT,
  specialisation TEXT,
  signature_image_url TEXT,
  consultation_fee DECIMAL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  status TEXT DEFAULT 'active' -- active, inactive, on_leave
);
```

#### 5. Doctor Availability
```sql
CREATE TABLE doctor_availability (
  id UUID PRIMARY KEY,
  doctor_id UUID REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  department_id UUID REFERENCES departments(id),
  room_number TEXT,
  daily_limit INT DEFAULT 20,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(doctor_id, date)
);
```

#### 6. Patients
```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  age INT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(hospital_id, phone)
);
```

#### 7. Appointments (Queue Items)
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id) NOT NULL,
  patient_id UUID REFERENCES patients(id) NOT NULL,
  doctor_id UUID REFERENCES users(id) NOT NULL,
  appt_date DATE NOT NULL,
  appt_token VARCHAR(10) NOT NULL, -- YYYYMMDDNN format
  queue_number INT NOT NULL, -- Per doctor per date
  queue_prefix VARCHAR(5) NOT NULL, -- Department short code
  status TEXT DEFAULT 'waiting', -- waiting, in_consult, done, no_show, cancelled
  priority_flag BOOLEAN DEFAULT false,
  complaint TEXT,
  previous_doctor TEXT,
  previous_medicines TEXT,
  other_details TEXT,
  consent_given BOOLEAN NOT NULL,
  source TEXT DEFAULT 'qr', -- qr, voice, reception, walk_in
  created_at TIMESTAMP DEFAULT NOW(),
  called_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  UNIQUE(hospital_id, appt_token)
);

CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appt_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
```

#### 8. Queue Counters
```sql
CREATE TABLE queue_counters (
  id UUID PRIMARY KEY,
  doctor_id UUID REFERENCES users(id) NOT NULL,
  counter_date DATE NOT NULL,
  next_number INT DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(doctor_id, counter_date)
);
```

#### 9. Token Counters (Hospital Daily)
```sql
CREATE TABLE token_counters (
  id UUID PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id) NOT NULL,
  counter_date DATE NOT NULL,
  next_number INT DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(hospital_id, counter_date)
);
```

#### 10. Consultations
```sql
CREATE TABLE consultations (
  id UUID PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) NOT NULL,
  symptoms TEXT,
  vitals JSONB, -- {bp, temp, pulse, oxygen, weight, etc}
  diagnosis TEXT NOT NULL,
  advice TEXT,
  follow_up_date DATE,
  private_notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  signed_at TIMESTAMP,
  locked_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours')
);
```

#### 11. Prescriptions (Medicines)
```sql
CREATE TABLE prescription_items (
  id UUID PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id) NOT NULL,
  medicine_name TEXT NOT NULL,
  dosage TEXT,
  duration TEXT,
  frequency TEXT,
  instructions TEXT
);
```

#### 12. Prescription PDFs
```sql
CREATE TABLE prescription_pdfs (
  id UUID PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id) NOT NULL,
  pdf_url TEXT NOT NULL,
  pdf_hash VARCHAR(64), -- SHA-256 for tamper detection
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 13. Prescription Access (OTP for download)
```sql
CREATE TABLE prescription_access (
  id UUID PRIMARY KEY,
  pdf_id UUID REFERENCES prescription_pdfs(id),
  patient_phone TEXT NOT NULL,
  otp_code VARCHAR(6),
  otp_expires_at TIMESTAMP,
  accessed_at TIMESTAMP,
  accessed_from TEXT
);
```

#### 14. Voice Calls (Agent Transcripts)
```sql
CREATE TABLE voice_calls (
  id UUID PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id) NOT NULL,
  caller_phone TEXT NOT NULL,
  call_date TIMESTAMP DEFAULT NOW(),
  duration_seconds INT,
  transcript TEXT,
  language_detected TEXT,
  outcome TEXT, -- completed, transferred, failed
  appointment_created_id UUID REFERENCES appointments(id),
  is_recorded BOOLEAN DEFAULT false
);
```

#### 15. Audit Trail
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Frontend Route Structure

```
app/
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx (landing)
│   ├── features/
│   │   └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   └── terms/
│       └── page.tsx
│
├── (auth)/
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   └── set-password/
│       └── page.tsx
│
├── a/
│   ├── [token]/
│   │   ├── page.tsx (patient intake form)
│   │   └── success/
│   │       └── page.tsx
│
├── track/
│   └── page.tsx (queue position tracking)
│
├── rx/
│   └── page.tsx (prescription download)
│
├── display/
│   └── [token]/
│       └── page.tsx (waiting room board)
│
└── app/
    ├── layout.tsx (protected layout)
    ├── page.tsx (dashboard)
    ├── queue/
    │   ├── page.tsx (today's queue)
    │   └── [id]/
    │       └── page.tsx (consultation screen)
    ├── history/
    │   └── page.tsx (patient search)
    ├── patients/
    │   └── [id]/
    │       └── page.tsx (patient timeline)
    ├── kiosk/
    │   └── page.tsx (QR code display)
    ├── departments/
    │   └── page.tsx (hospital admin)
    ├── calls/
    │   └── page.tsx (voice agent transcripts)
    ├── templates/
    │   └── page.tsx (prescription templates)
    ├── team/
    │   └── page.tsx (doctor management)
    └── settings/
        └── page.tsx (hospital config)
```

---

## API Endpoints (Server Actions & Route Handlers)

### Patient Intake
- `POST /api/appointments/intake` - Create appointment from QR scan
- `GET /api/hospitals/[token]` - Get hospital info by intake token
- `GET /api/doctors/available/[token]` - Get available doctors for date

### Queue Tracking
- `GET /api/appointments/track/[token]` - Track appointment status
- `GET /api/queue/live/[doctorId]` - Live queue for display boards

### Prescriptions
- `POST /api/prescriptions/request-otp` - Request OTP for prescription download
- `GET /api/prescriptions/download/[pdfId]` - Download prescription with OTP
- `POST /api/prescriptions/verify-otp` - Verify OTP code

### Doctor Consultation
- `GET /api/consultations/[appointmentId]` - Get consultation data
- `POST /api/consultations/save` - Save consultation
- `POST /api/prescriptions/generate-pdf` - Generate prescription PDF
- `POST /api/appointments/call-next` - Advance queue

### Voice Agent
- `POST /api/voice/webhook` - Receive voice call
- `POST /api/voice/transcribe` - Transcribe speech
- `POST /api/voice/create-appointment` - Create appointment from voice

### Admin
- `POST /api/hospitals/create` - Create new hospital
- `POST /api/users/invite` - Invite doctor/admin
- `POST /api/departments/manage` - Manage departments
- `GET /api/analytics/[hospitalId]` - Get hospital analytics

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [x] Set up Next.js 15 project with TypeScript
- [ ] Create PostgreSQL database schema
- [ ] Implement authentication (JWT + sessions)
- [ ] Create database client utilities
- [ ] Set up environment configuration

### Phase 2: Patient Intake & Tracking (Weeks 3-4)
- [ ] Build intake form page (`/a/[token]`)
- [ ] Implement queue tracking page (`/track`)
- [ ] Create waiting room display (`/display/[token]`)
- [ ] Set up real-time WebSocket updates
- [ ] Implement queue number generation

### Phase 3: Doctor Dashboard (Weeks 5-6)
- [ ] Build doctor dashboard
- [ ] Implement queue management
- [ ] Create consultation screen
- [ ] Build medicine autocomplete
- [ ] Implement prescription templates

### Phase 4: Prescription & History (Weeks 7-8)
- [ ] Build prescription PDF generation
- [ ] Implement prescription download with OTP
- [ ] Create patient history search
- [ ] Build patient timeline view
- [ ] Implement audit logging

### Phase 5: Hospital Admin (Weeks 9-10)
- [ ] Build department management
- [ ] Implement team/doctor management
- [ ] Create analytics dashboards
- [ ] Build hospital configuration
- [ ] Implement call transcripts

### Phase 6: Voice Agent (Weeks 11-12)
- [ ] Integrate Claude API for voice processing
- [ ] Implement speech transcription
- [ ] Build conversation flow logic
- [ ] Create appointment booking from voice
- [ ] Set up call recording and logging

### Phase 7: Polish & Deploy (Weeks 13-16)
- [ ] Testing and bug fixes
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deployment to production
- [ ] Monitoring and observability

---

## Key Features Implementation Details

### 1. Real-Time Queue Updates
Using PostgreSQL LISTEN/NOTIFY with WebSocket:
```typescript
// Subscribe to appointment changes for a doctor
db.subscribe(`appointments:doctor:${doctorId}`, (change) => {
  // Broadcast to all connected clients for that doctor
  broadcastToDoctor(doctorId, change);
});
```

### 2. Atomic Queue Advancement
```sql
BEGIN TRANSACTION;
  UPDATE appointments SET status = 'done' WHERE id = current_id;
  UPDATE appointments SET status = 'in_consult' WHERE id = next_id;
  -- Notify all listeners
  NOTIFY appointments_change;
COMMIT;
```

### 3. Voice Agent Flow
```
1. Speech input → Transcription
2. Determine intent (book, check status, transfer)
3. Call appropriate function (get_departments, create_appointment, etc)
4. Generate response text
5. Text to speech output
6. Log transcript
```

### 4. Prescription Security
- PDF stored at random path in private S3 bucket
- SHA-256 hash for tamper detection
- One-time code (OTP) required for download
- Download logs all access
- Delivery via email/WhatsApp

---

## Data Security & Isolation

### Row-Level Security (RLS) Policies
```sql
-- Patients visible only to their doctor and hospital admins
CREATE POLICY patient_isolation ON appointments
  USING (
    doctor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() 
      AND role = 'hospital_admin'
      AND hospital_id = appointments.hospital_id
    )
  );
```

### Database Enforcement
- Data isolation at SQL level, not application level
- Strict hospital-level data segregation
- Per-doctor patient visibility restrictions
- Immutable consultation records after 24 hours

---

## Testing Strategy
- Unit tests for critical functions (queue numbering, token generation)
- Integration tests for appointment lifecycle
- E2E tests for patient intake and doctor workflow
- Voice agent conversation testing
- Load testing for real-time features

---

## Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] S3/Storage configured
- [ ] Voice API keys set up
- [ ] Email/WhatsApp providers configured
- [ ] Monitoring and logging enabled
- [ ] Backup strategy implemented
- [ ] HIPAA compliance verified
