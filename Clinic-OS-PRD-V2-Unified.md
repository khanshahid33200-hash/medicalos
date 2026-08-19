# CLINIC OS — PRODUCT REQUIREMENTS DOCUMENT (V2)
**Unified platform spec: Check-in, Booking, Report Delivery, Follow-ups + AI-Assisted Queue & Triage**

Build Date: August 2026
Target Launch: Month 1 (India) + Month 2 (US/UK/SG) — Module 5 targeted for Phase 2
Primary Tech: Python FastAPI (backend) + Node.js (middleware) + React (dashboard) + Claude API (AI triage)
Compliance Tier: HIPAA (US) + GDPR (UK/EU) + PDPA (Singapore) + India light
Team: 1 Full-stack developer + 1 DevOps (can be contract)

This V2 document is the original V1 PRD (Modules 1–4, unchanged and still authoritative for their schemas/endpoints) plus a new **Module 5: AI-Assisted Queue & Triage**, with the cross-cutting sections (architecture, integrations, compliance, cost, phasing) updated so the whole platform reads as one coherent build spec.

---

## 1. EXECUTIVE SUMMARY

**What Clinic OS does:** A patient workflow automation platform that removes the typing bottleneck from clinics. Patients check themselves in via WhatsApp QR code (India) or SMS/WhatsApp (US/UK/SG), an AI model pre-reads their symptoms and history to brief the doctor before the patient is even called in, data flows automatically between departments, and the doctor approves reports with one tap — which immediately lands on the patient's phone. Patients also get a live, real-time queue number so they know exactly when they'll be seen.

**V2 Scope (5 modules):**
1. Patient check-in (QR → WhatsApp form, regional language support)
2. Appointment booking & scheduling (calendar + SMS/WhatsApp confirmation)
3. Report delivery (doctor approval UI → WhatsApp/SMS send)
4. Auto follow-ups & recalls (scheduled messaging based on rules)
5. **AI-assisted queue & triage** *(new)* — live queue number, AI-generated triage brief for the doctor, one-tap patient status control (done / reschedule / requeue)

**Success metrics for V2** (original 7 + 4 new):
- Zero manual form re-entry by patients (100% WhatsApp-first)
- Report delivery to patient within 60 minutes of doctor approval
- 25–30% no-show recovery via auto-recall
- Clinic onboarding + go-live in 14 days (configuration only, no code changes)
- **AI triage brief generated within 15 seconds of check-in submission**
- **Live queue position updates reach the patient's tracker within 5 seconds of any status change**
- **30–50% reduction in doctor's per-patient intake/history-taking time**
- **< 1 front-desk "where is my turn" interruption per patient (down from ~4–5 typical)**

**Why this tech stack (unchanged, extended):**
- Python FastAPI: fast REST + WebSocket APIs, built-in validation, scales horizontally
- PostgreSQL (Supabase): strong ACID compliance + row-level security (multi-tenant HIPAA requirement)
- Twilio/WhatsApp Cloud API: proven healthcare compliance, handles regional SMS/WhatsApp
- **Claude API (new):** structured JSON-mode calls for the triage brief; chosen over a bespoke model because it needs zero training data and ships in Phase 2, not Phase 6
- n8n (or custom Python) for workflows: check-in → AI brief → queue → booking → report → follow-up automation

---

## 2. ARCHITECTURE OVERVIEW (updated)

```
┌─────────────────────────────────────────────────────────────────┐
│                         PATIENT DEVICES                          │
│              (WhatsApp / SMS → Clinic's number)                  │
└──────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│               MESSAGE GATEWAY (Twilio/WhatsApp Cloud)            │
│  - Inbound QR scan → form link      - Outbound report delivery   │
│  - Inbound SMS commands             - Outbound follow-ups/recalls│
│  - Outbound queue no. + live tracker link + "you're next" nudge  │
└──────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│              CLINIC OS BACKEND (Python FastAPI + PostgreSQL)     │
│                                                                    │
│ ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐       │
│ │ Check-in       │ │ Booking        │ │ Report Module     │       │
│ │ Module (M1)    │ │ Module (M2)    │ │ (M3)               │       │
│ └───────────────┘ └────────────────┘ └──────────────────┘       │
│                                                                    │
│ ┌────────────────────┐  ┌─────────────────────────────────────┐ │
│ │ Follow-up Engine    │  │ Module 5: AI Triage + Live Queue    │ │
│ │ (M4)                │  │ - Claude API triage brief            │ │
│ │                     │  │ - Queue state machine + WS broadcast │ │
│ │                     │  │ - Doctor action controls              │ │
│ └────────────────────┘  └─────────────────────────────────────┘ │
│                                                                    │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Admin/Doctor Dashboard (React) — includes live queue view,   │ │
│ │ AI brief panel, and patient-facing public live tracker page  │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ MULTI-TENANT DATA LAYER (Supabase PostgreSQL w/ RLS)          │ │
│ │ - Clinic-isolated tables (Row Level Security)                 │ │
│ │ - Patient data (encrypted at-rest, HIPAA compliant)            │ │
│ │ - Audit logs (all actions traceable, incl. AI brief access)   │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────┬─────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬─────────────────┐
        ▼               ▼               ▼                 ▼
    [Twilio]      [WhatsApp Cloud]  [n8n workflows]   [Claude API]
    (SMS send)    (WhatsApp send)   (follow-ups,      (triage brief
                                     AI orchestration)  generation)
```

**Key principle (unchanged):** Everything flows through the message gateway. Clinic staff never handle patient data directly in forms — the patient types once (on WhatsApp), the system distributes to all downstream systems, and now also triggers an AI read of that same data before the doctor ever opens the file.

---

## 3. MODULES 1–4 (recap — full schema/endpoints as originally specified)

These are unchanged from the approved V1 PRD. Summarized here so this document is a complete build reference; see full CREATE TABLE statements and endpoint lists in the original V1 spec if needed.

| Module | Purpose | Key tables | Key endpoints |
|---|---|---|---|
| **M1 — Check-in** | QR → WhatsApp form, OCR for paper records, dedupe returning patients | `clinics`, `patients`, `check_ins`, `check_in_forms` | `POST /clinics/{id}/qr-codes`, `POST /checkins/webhook`, `GET /checkins/{id}`, `POST /patients/dedupe` |
| **M2 — Booking** | Auto-assign appointment slot, reminders, no-show recovery | `appointments`, `clinic_hours`, `clinic_capacity`, `appointment_reminders` | `POST /appointments`, `GET /appointments`, `PUT /appointments/{id}`, `POST /appointments/{id}/no-show-recovery` |
| **M3 — Report Delivery** | Doctor approves report, PDF generated, sent via WhatsApp/SMS, delivery tracked | `reports`, `report_deliveries`, `audit_logs` | `GET /reports/queue`, `PUT /reports/{id}/approve`, `POST /reports/{id}/send`, `POST /reports/webhook` |
| **M4 — Follow-ups & Recalls** | Rule-based scheduled messaging, opt-out tracking, seasonal campaigns | `follow_up_rules`, `scheduled_reminders`, `patient_consent`, `campaigns` | `POST /follow-up-rules`, `GET /scheduled-reminders`, `POST /patient-consent`, `POST /campaigns` |

**Integration point for Module 5:** `check_ins` (from M1) is extended with the additional intake fields the queue/triage flow needs (previous doctor, symptom duration, severity, chronic conditions — see §4.3), rather than duplicating patient data into a separate table. `reports` (M3) and `follow_up_rules` (M4) are unaffected but a doctor's "reschedule" action in M5 can optionally fire an M2 booking call and an M4 follow-up rule.

---

## 4. MODULE 5: AI-ASSISTED QUEUE & TRIAGE *(new)*

### 4.1 User flow

**Patient side**
1. Patient completes the existing M1 check-in form (Name, Age, Symptoms, Medical History, Allergies, Language) — now extended with a few optional fields: previous doctor consulted, previous medication/diagnosis if known, symptom duration, self-rated severity.
2. On submit, in addition to the existing M1 flow, the system:
   - Assigns a **queue number** for the selected doctor/department for that day
   - Sends the patient a WhatsApp + on-screen confirmation with queue number, doctor, estimated wait, and a link to the **live queue tracker page**
   - Triggers async AI triage brief generation (does not block the patient's confirmation)
3. Patient can reopen the live tracker anytime; gets a WhatsApp "you're next" nudge ~2 patients before their turn.

**AI side**
1. n8n workflow picks up the completed check-in and calls the Claude API with the structured intake data.
2. AI returns a structured JSON triage brief: chief-complaint summary, ranked differential considerations (clearly labeled "AI-suggested, not a diagnosis"), red-flag/urgency signals, suggested questions for the doctor, and relevant history flags (drug allergies, interacting medications, prior diagnoses).
3. Brief is attached to the patient's queue entry, **visible to doctor/clinical staff only — never shown to the patient.** This keeps the AI output as clinician decision support, not a patient-facing diagnosis, which matters both for anxiety and liability.
4. If urgency signals are detected, the queue entry is visually flagged. **Reprioritization is always a human (doctor/front-desk) decision** — the AI flags, it never reorders the queue itself.
5. If Claude API is unavailable, the queue and notifications continue unaffected; the brief is marked "AI unavailable — manual review" rather than blocking the flow.

**Doctor side**
1. Doctor dashboard (React, same shell as M3's approval UI) shows a live queue list per doctor/department: queue number, patient name, wait time so far, urgency flag, "View brief" button — updated in real time via WebSocket.
2. Doctor opens the brief, sees patient-submitted intake next to the AI summary, calls the patient in.
3. After the consult, doctor marks the queue entry:
   - **Done for today** — removed from active queue; all later queue numbers shift down instantly for everyone still waiting.
   - **Reschedule** — moved off today's queue; can optionally trigger an M2 booking flow for a new slot.
   - **Needs review again** — re-queued at the **back** of today's list (shown as e.g. "12-R" for traceability), not left at its original slot.
4. Doctor can add consult notes, prescription reference, and follow-up instructions before closing — these become part of the patient's history, so a returning patient's next AI brief is richer.

### 4.2 Queue logic (state machine)

`waiting → in_consultation → done | rescheduled | requeued | no_show`

- Each doctor/department runs its own independent, sequential daily queue.
- Live position: `patients_ahead = count(status='waiting' AND queue_no < this.queue_no)`, recalculated and broadcast on every status change via WebSocket (Redis pub/sub fan-out for multi-instance deployments).
- `requeued` patients get a new position at the end of the current waiting list — the number is reused with a suffix, not the original slot, so other waiting patients' numbers stay trustworthy.
- Front desk can manually reorder, mark absent/no-show, or register a walk-in without a phone via a shared desk tablet.

### 4.3 Technical requirements

| Component | Requirement | Tech Stack |
|---|---|---|
| Extended intake fields | Previous doctor, previous medication, symptom duration, severity, chronic conditions, consent checkbox for AI processing | Extends M1's `check_ins` table (Pydantic model update) |
| Queue number generator | Sequential per doctor per day, resettable per clinic config | FastAPI route + DB sequence per `(clinic_id, doctor_id, date)` |
| AI triage orchestration | Trigger Claude API call async after check-in webhook fires | n8n workflow node calling Claude API, JSON output mode |
| AI brief storage | Structured brief attached to queue entry, doctor-only visibility | Encrypted JSONB column, RLS-scoped to clinic + role |
| Live queue broadcast | Push position updates to patient tracker + doctor dashboard | FastAPI WebSocket endpoint + Redis pub/sub |
| Doctor action controls | One-tap done/reschedule/requeue | React component, `PUT /queue/{id}/action` |
| Urgency flagging | Visual flag on doctor dashboard when AI detects red-flag signals | Enum field on brief, never surfaced to patient UI |
| "You're next" nudge | WhatsApp send when ~2 patients ahead | Triggered from the same status-change event that drives WebSocket broadcast |
| AI outage fallback | Queue/notifications unaffected if Claude API fails | Try/except around AI call, brief marked `ai_unavailable=true` |

### 4.4 Database schema

**Extend `check_ins` (M1) with additional intake fields:**

```sql
ALTER TABLE check_ins ADD COLUMN previous_doctor TEXT;
ALTER TABLE check_ins ADD COLUMN previous_medication TEXT;
ALTER TABLE check_ins ADD COLUMN duration_symptoms TEXT;
ALTER TABLE check_ins ADD COLUMN severity ENUM ('mild', 'moderate', 'severe');
ALTER TABLE check_ins ADD COLUMN chronic_conditions TEXT;
ALTER TABLE check_ins ADD COLUMN past_surgeries TEXT;
ALTER TABLE check_ins ADD COLUMN consent_ai_triage BOOLEAN DEFAULT FALSE;
```

**New tables:**

```sql
CREATE TABLE queue_entries (
    id UUID PRIMARY KEY,
    clinic_id UUID REFERENCES clinics(id),
    patient_id UUID REFERENCES patients(id),
    check_in_id UUID REFERENCES check_ins(id),
    doctor_id UUID REFERENCES staff(id),
    department TEXT,
    queue_no TEXT,                -- e.g. "12" or "12-R" for requeued
    queue_date DATE,
    status ENUM ('waiting', 'in_consultation', 'done', 'rescheduled', 'requeued', 'no_show'),
    urgency_flag ENUM ('none', 'low', 'high') DEFAULT 'none',
    called_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP
);

CREATE TABLE ai_triage_briefs (
    id UUID PRIMARY KEY,
    queue_entry_id UUID REFERENCES queue_entries(id),
    check_in_id UUID REFERENCES check_ins(id),
    summary_text TEXT,
    differential_considerations JSONB,   -- ranked list, AI-labeled, doctor-only
    urgency_flag ENUM ('none', 'low', 'high'),
    suggested_questions JSONB,
    history_flags JSONB,                  -- allergy conflicts, drug interactions, prior dx
    model_used TEXT,
    ai_unavailable BOOLEAN DEFAULT FALSE,
    generated_at TIMESTAMP
);

CREATE TABLE doctor_queue_actions (
    id UUID PRIMARY KEY,
    queue_entry_id UUID REFERENCES queue_entries(id),
    doctor_id UUID REFERENCES staff(id),
    action ENUM ('done', 'reschedule', 'requeue'),
    notes TEXT,
    prescription_ref TEXT,
    follow_up_instructions TEXT,
    created_at TIMESTAMP
);
```

Row Level Security follows the same pattern as M1–M4 (`clinic_id = auth.user_clinic_id()`), with an additional policy so `ai_triage_briefs` is only readable by roles `doctor` and `admin` — never `patient` or unauthenticated tracker requests.

### 4.5 API endpoints

- `POST /api/v1/queue/{clinic_id}/entries` — create queue entry (auto-called by the check-in webhook, M1)
- `GET /api/v1/queue/{clinic_id}/tracker/{queue_no}` — **public, unauthenticated** live position lookup for the patient tracker page
- `WS /api/v1/queue/{clinic_id}/stream` — WebSocket channel for live queue + doctor dashboard updates
- `POST /api/v1/ai-briefs/generate` — internal endpoint, invoked by the n8n workflow after check-in
- `GET /api/v1/ai-briefs/{check_in_id}` — retrieve brief (doctor/admin auth required)
- `POST /api/v1/queue/{entry_id}/call` — doctor calls patient in, triggers WhatsApp "please proceed" message
- `PUT /api/v1/queue/{entry_id}/action` — doctor marks done / reschedule / requeue
- `POST /api/v1/queue/{clinic_id}/walk-in` — front-desk manual entry (no patient phone available)

### 4.6 Compliance notes

- **Consent is mandatory** before AI processing (`consent_ai_triage`) — clear language that an AI model assists in generating a note for the doctor, not diagnosing the patient.
- The AI brief is never rendered in any patient-facing view, including the public tracker endpoint — enforced at the RLS layer, not just the UI layer, so a misconfigured frontend can't leak it.
- Every AI brief output carries a stored disclaimer field: *"AI-generated triage support — not a diagnosis. For clinician review only."*
- Brief generation and every doctor view of a brief is written to the existing `audit_logs` table (same immutable table used by M3), so AI-assisted decisions are traceable in the same compliance audit as report approvals.
- Retention follows the same clinic-configurable policy as other PHI (§6 below).

---

## 5. INTEGRATION POINTS (updated)

### 5.1 Messaging Gateway — unchanged
Twilio (SMS US/UK, WhatsApp India/SG) remains the sole messaging integration; see original V1 spec for the `send_sms` / `send_whatsapp` helper functions. Module 5 reuses these unchanged for queue confirmations, "you're next" nudges, and call-in messages.

### 5.2 AI Triage — Claude API *(new)*

```python
# clinic_os/integrations/claude_triage.py
import anthropic

client = anthropic.Anthropic(api_key=env('ANTHROPIC_API_KEY'))

TRIAGE_SYSTEM_PROMPT = """You are a clinical triage support assistant for a
clinic front desk. You are given a patient's self-reported intake data.
Produce a structured JSON brief for the treating doctor only — this is
decision support, never a diagnosis, and must never be shown to the patient.
Flag urgency conservatively; when in doubt, flag it as at least 'low' and
let the clinician decide."""

def generate_triage_brief(check_in_data: dict) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        system=TRIAGE_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": json.dumps(check_in_data)}],
    )
    # Parsed into: summary_text, differential_considerations,
    # urgency_flag, suggested_questions, history_flags
    return parse_structured_brief(response)
```

Called from the n8n workflow (or directly from the FastAPI check-in webhook handler) immediately after a check-in with `consent_ai_triage = true` is saved. Wrapped in try/except so a Claude API failure never blocks queue assignment or patient notification — it only marks the brief `ai_unavailable`.

**Cost:** ≈ $0.008–0.01 per triage brief (short structured input/output). At 50–100 check-ins/day per clinic, this adds roughly **$15–30/month per clinic** — small relative to the existing Twilio spend.

### 5.3 Optional Lab System Integration — unchanged
Deferred to Phase 3 per original V1 plan; not affected by Module 5.

---

## 6. COMPLIANCE & SECURITY (updated)

Original V1 requirements (HIPAA/GDPR/PDPA/India) all remain in force and apply equally to the new tables. Additions specific to AI triage:

- **HIPAA (US):** AI brief access logged in `audit_logs` identically to report access; Claude API calls must run under a Business Associate Agreement with Anthropic before any real PHI is sent in production — flag this as a launch blocker for the US market specifically.
- **GDPR (UK/EU):** AI-generated brief is included in a patient's data export/deletion request scope, even though the patient never sees it directly.
- **PDPA (Singapore):** Same cross-border restriction as other PHI — Claude API calls should use a data-residency-appropriate endpoint/region if required for SG clinics.
- **India (light):** Treat AI brief content with the same PII-encryption standard as `check_ins.encrypted_medical_history`.
- **Universal rule regardless of jurisdiction:** the AI brief is clinician decision support only. It is never delivered to the patient, and product copy/consent language must not imply the AI diagnosed them.

---

## 7. DEPLOYMENT & INFRASTRUCTURE (updated)

| Component | Service | Cost/Month | Notes |
|---|---|---|---|
| Backend API | AWS EC2 t3.small or Heroku $7 tier | $5–20 | Auto-scale 2–4 instances behind ALB; now also serves WebSocket connections |
| Database | Supabase (Postgres) | $25–100 | Adds 3 new tables + RLS policies for Module 5 |
| Storage | AWS S3 | $1–5 | Unchanged |
| Message Queue | Redis (AWS ElastiCache) | $15–30 | Now also backs WebSocket pub/sub fan-out for live queue, in addition to M4's scheduler/retry logic |
| **AI Triage** | Claude API | **$15–30/clinic** | New — see §5.2 |
| Monitoring | DataDog (free tier) or New Relic | $0–50 | Unchanged |
| **Total** | | **~$70–235/clinic** | Scales with usage |

Deployment steps and production checklist from the original V1 spec are unchanged; add one item: **WebSocket support verified through the load balancer/reverse proxy** (sticky sessions or Redis-backed pub/sub, since a naive ALB round-robin will break long-lived WebSocket connections across instances).

---

## 8. TECH STACK SUMMARY (updated)

**Frontend:** React 18, Tailwind CSS, React Query, WebSocket (now used for both M3's report queue *and* M5's live queue tracker/dashboard)

**Backend:** Python 3.10+, FastAPI, SQLAlchemy 2.0, Pydantic, APScheduler/Celery, python-jose (JWT)

**AI:** **Claude API (Anthropic), JSON output mode** *(new)*

**Database:** PostgreSQL 14+ (Supabase), Redis (caching, scheduler queue, **and now WebSocket pub/sub**)

**DevOps:** Docker + Docker Compose, GitHub Actions, AWS ECS or Heroku, Terraform (optional)

**External Services:** Twilio (SMS + WhatsApp), Supabase (Postgres + Auth), AWS S3, **Anthropic Claude API**

---

## 9. PROJECT PHASES & TIMELINE (updated)

**Phase 1: MVP (Weeks 1–4)** — unchanged
Modules: Check-in + Booking + Report Delivery
Estimated effort: 280–320 hours

**Phase 2: Polish (Weeks 5–8)** — expanded
Modules: Auto Follow-ups + Recalls **+ Module 5: AI-Assisted Queue & Triage**
Rationale for bundling: Module 5 builds directly on M1's check-in data and M3's approval-dashboard UI patterns, both already shipped by end of Phase 1, so the marginal build cost is lower than starting a new module from scratch.
Deliverables:
- Admin dashboard complete (clinic setup, staff management)
- Seasonal campaign builder
- Patient portal (optional, read-only)
- **Live queue tracker + doctor triage dashboard**
- **Claude API triage brief pipeline**
Estimated effort: 160–200 hours (M4) + **90–120 hours (M5)**

**Phase 3: Scale (Month 3+)** — unchanged
Modules: Lab integrations, advanced AI diagnosis features (e.g., drug-interaction cross-checking, returning-patient history trend summaries), compliance certifications
Effort: Varies, ongoing

---

## 10. SUCCESS METRICS (V2 Target — merged)

| Metric | Target | Measurement |
|---|---|---|
| Patient check-in time | < 90 sec | Average from `form_response_time_sec` |
| Report delivery time | < 60 min from approval | `reports.approved_at` → `report_deliveries.sent_at` |
| No-show recovery rate | 25–30% | Count reschedules from recovery message |
| Doctor approval queue | < 10 min wait | Live dashboard latency test |
| Clinic onboarding time | ≤ 14 days | First clinic to first patient |
| System uptime | > 99.5% | CloudWatch/DataDog alerts |
| HIPAA compliance score | 100% | Audit log review, penetration test pass |
| **AI brief generation time** | **< 15 sec** | `ai_triage_briefs.generated_at` − `check_ins.timestamp` |
| **Live queue update latency** | **< 5 sec** | WebSocket broadcast timestamp vs. status-change event |
| **Doctor intake time reduction** | **30–50%** | Time-in-consult comparison, pre/post rollout |
| **Front-desk interruptions per patient** | **< 1** | Front-desk staff log / spot survey |

---

## 11. COST BREAKDOWN (6-MONTH ESTIMATE, updated)

| Item | Monthly | 6-Month |
|---|---|---|
| Backend hosting (AWS/Heroku) | $15 | $90 |
| Database (Supabase) | $50 | $300 |
| Twilio (SMS + WhatsApp) | $500/clinic | $3,000 (avg 3 clinics) |
| Storage (S3) | $5 | $30 |
| **Claude API (Module 5)** | **$15–30/clinic** | **$270–540 (avg 3 clinics)** |
| Monitoring (DataDog) | $15 | $90 |
| Domain + SSL | $2 | $12 |
| Developer time (Phase 1, 320 hrs @ $50/hr) | — | $16,000 |
| **Developer time (Module 5, 90–120 hrs @ $50/hr)** | — | **$4,500–6,000** |
| DevOps + security review (40 hrs) | — | $2,000 |
| **Total** | **~$610–730/clinic** | **~$26,300–29,000 total** |

Per-clinic recurring cost rises modestly from the original ~$600–700/month to **~$615–730/month**, driven almost entirely by Claude API usage rather than infrastructure.

---

## 12. DEVELOPER HANDOFF CHECKLIST (updated)

Original V1 checklist items all apply unchanged. Add:
- [ ] `ANTHROPIC_API_KEY` set in `.env`, BAA confirmed before any real PHI is sent (US clinics)
- [ ] WebSocket endpoint verified to survive load-balancer failover / multi-instance deploys
- [ ] RLS policy confirmed: `ai_triage_briefs` unreadable by `patient` role and by the unauthenticated tracker endpoint
- [ ] AI-outage fallback tested (kill the Claude API call, confirm queue/notifications still complete)
- [ ] Load test the live queue WebSocket channel at expected concurrent-patient volume, not just the REST endpoints

---

## 13. OPEN QUESTIONS

From the original V1 spec (still open):
1. React dashboard: build in-house or stub for now?
2. Supabase-hosted vs. self-hosted Postgres?
3. Existing Twilio account or create new?
4. Monorepo or separate backend/frontend repos?
5. GitHub Actions or GitLab CI?
6. JWT or OAuth (Google/Microsoft) for staff auth?
7. Seed script vs. manual setup for initial clinic data?

New, specific to Module 5:
8. Should the AI brief flag suspected drug interactions in detail, or keep v1 scope to symptom/differential only?
9. Hard cap on free-text symptom length to control AI token cost, or unlimited?
10. Confirmed: urgency-flagged patients are **never** auto-reprioritized by the system — doctor/front-desk decision only. Any objection to this as a hard rule?
11. Is front-desk kiosk mode (for patients without smartphones) needed at Module 5 launch, or can it wait for a fast-follow — depends on what share of target clinics see walk-ins without phones.
