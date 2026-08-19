# Clinic OS — Backend Engineering Spec

**Companion to:** Clinic OS PRD (V2) and design.md
**Scope:** Backend architecture, project structure, API conventions, data layer, integrations, and operational concerns for Modules 1–5.
**Stack:** Python 3.10+ · FastAPI · SQLAlchemy 2.0 · Pydantic v2 · PostgreSQL (Supabase) · Redis · Twilio · Claude API · n8n

---

## 1. Architecture Principles

1. **Everything flows through the message gateway.** Patients never touch clinic staff's tools directly — WhatsApp/SMS in, structured data out. The backend's job is to be the reliable pipe between "patient typed something on WhatsApp" and "every downstream system (queue, AI, doctor dashboard, booking, follow-ups) has it within seconds."
2. **Multi-tenant by default, isolated by construction.** Every table carries `clinic_id`. Row Level Security enforces isolation at the database layer, not just in application code — a bug in a query should not be able to leak one clinic's patients into another's view.
3. **External services fail; the core flow doesn't.** Twilio, Claude API, and OCR are all wrapped so that an outage degrades gracefully (queue keeps running without an AI brief, a message queues for retry) rather than blocking check-in, booking, or the queue.
4. **Async where it matters, sync where it's simpler.** Patient-facing latency (check-in submit, queue tracker reads) stays fast and synchronous. AI brief generation, PDF rendering, and follow-up scheduling are pushed to background workers so they never sit in the request/response path.
5. **One audit trail, not five.** Every module writes to the same `audit_logs` table. A compliance review or an incident investigation should never require cross-referencing five different logging systems.

---

## 2. Project Structure

```
clinic_os/
├── main.py                      # FastAPI app instantiation, router mounting, startup/shutdown hooks
├── config.py                    # Pydantic Settings — all env vars typed and validated at boot
├── deps.py                      # Shared FastAPI dependencies (auth, db session, clinic scoping)
│
├── modules/
│   ├── checkin/                 # M1
│   │   ├── router.py
│   │   ├── schemas.py           # Pydantic request/response models
│   │   ├── service.py           # Business logic
│   │   ├── models.py            # SQLAlchemy models
│   │   └── ocr.py               # Tesseract wrapper for paper records
│   │
│   ├── booking/                 # M2
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── service.py
│   │   ├── models.py
│   │   └── scheduler_jobs.py    # 24h/1h reminder jobs, no-show recovery
│   │
│   ├── reports/                 # M3
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── service.py
│   │   ├── models.py
│   │   ├── pdf.py                # ReportLab patient-friendly PDF generation
│   │   └── signing.py            # Digital signature / non-repudiation
│   │
│   ├── followups/               # M4
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── service.py
│   │   ├── models.py
│   │   └── scheduler_jobs.py
│   │
│   └── queue_triage/             # M5
│       ├── router.py
│       ├── schemas.py
│       ├── service.py
│       ├── models.py
│       ├── state_machine.py      # waiting → in_consultation → done|rescheduled|requeued
│       ├── websocket.py          # live queue broadcast
│       └── ai_brief.py           # Claude API triage orchestration
│
├── integrations/
│   ├── twilio_client.py          # send_sms / send_whatsapp, shared across M1–M5
│   ├── claude_client.py          # generate_triage_brief, shared by M5
│   ├── supabase_client.py        # Postgres session + Supabase auth bridge
│   └── redis_client.py           # pub/sub for WebSocket fan-out, job queue backing
│
├── core/
│   ├── security.py                # JWT issue/verify, role checks
│   ├── encryption.py              # Fernet field-level encryption for PHI columns
│   ├── audit.py                   # write_audit_log(), used by every module
│   ├── rls.py                     # helper to set/verify clinic_id context per request
│   └── exceptions.py              # shared exception → HTTP response mapping
│
├── workers/
│   ├── celery_app.py              # or APScheduler entrypoint, per §7
│   ├── ai_brief_worker.py
│   ├── pdf_render_worker.py
│   ├── reminder_worker.py
│   └── followup_worker.py
│
├── migrations/                    # Alembic
├── tests/
│   ├── unit/
│   ├── integration/
│   └── load/                      # k6/Locust scripts for queue WebSocket + check-in burst
│
├── docker-compose.yml
├── Dockerfile
├── alembic.ini
├── .env.example
└── requirements.txt
```

**Why module-per-folder rather than layer-per-folder (all routers together, all models together):** each module maps 1:1 to a PRD section and a team can hand off/own a module end-to-end without touching four different top-level folders. `core/` and `integrations/` hold only what's genuinely shared.

---

## 3. Request Lifecycle & Multi-Tenancy

Every authenticated request passes through the same dependency chain:

```python
# deps.py
async def get_current_clinic_context(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> ClinicContext:
    payload = verify_jwt(token)                       # core/security.py
    await set_rls_clinic_id(db, payload["clinic_id"])  # core/rls.py — sets Postgres session var
    return ClinicContext(
        clinic_id=payload["clinic_id"],
        user_id=payload["sub"],
        role=payload["role"],                          # 'doctor' | 'admin' | 'front_desk'
    )
```

`set_rls_clinic_id` sets a Postgres session-local variable (`SET LOCAL app.clinic_id = ...`) that every RLS policy reads via `auth.user_clinic_id()`. This means **a query that forgets a `WHERE clinic_id = ...` clause still can't leak data** — the database refuses the row, not just the application layer. This is the single most important correctness property in a multi-tenant healthcare system and it is enforced at the layer that can't be accidentally skipped in a rushed PR.

Two request classes bypass this:
- **Public, unauthenticated endpoints** (the patient's live queue tracker, the WhatsApp inbound webhook) — these scope by a signed token or clinic-specific webhook path instead, never by a JWT.
- **Internal service-to-service calls** (n8n → `/ai-briefs/generate`) — authenticated via a service API key scoped to a single clinic, verified in `core/security.py` separately from the patient/staff JWT flow.

---

## 4. API Design Conventions

- **Versioned, resource-based:** `/api/v1/{resource}` throughout — matches the PRD's existing endpoint list exactly, no restyling.
- **Pydantic schemas own validation, not manual checks in route handlers.** A route handler's job is: validate (Pydantic does this), authorize (dependency does this), delegate to `service.py`, return. Business logic never lives in `router.py`.
- **Idempotency on all patient-facing writes.** Check-in submission, queue entry creation, and report delivery triggers all accept an `Idempotency-Key` header — a patient's flaky mobile connection retrying a form POST must never create two queue numbers.
- **Errors are structured, never bare strings:**
  ```json
  { "error": { "code": "QUEUE_ENTRY_NOT_FOUND", "message": "...", "request_id": "..." } }
  ```
  `request_id` ties every error back to a specific log line and audit entry — critical when a doctor reports "the app broke" and support needs to reconstruct exactly what happened.
- **Public vs. internal vs. staff endpoints are visually distinguishable in the router tree** (`/public/*`, `/internal/*`, default = staff-authenticated) so a reviewer can tell at a glance whether an endpoint needs the RLS context or not.

---

## 5. Data Layer

Full schemas for all 5 modules are defined in the PRD (§3 recap + §4.4 for Module 5). Backend-specific notes not covered there:

**Connection strategy:** SQLAlchemy 2.0 async engine, connection pool sized per Supabase's connection limits (`pool_size=10, max_overflow=5` as a starting point per backend instance — tune against Supabase's plan-tier connection cap before scaling instance count).

**Encryption boundary:** Field-level encryption (`core/encryption.py`, Fernet) applies to exactly the columns the PRD marks as PHI-sensitive — `check_ins.encrypted_medical_history`, `ai_triage_briefs.differential_considerations`, `reports.raw_report`. Everything else (names, queue numbers, appointment times) stays in plaintext columns because encrypting non-sensitive operational data only adds query complexity without a compliance benefit — RLS already isolates it by clinic.

**Migrations:** Alembic, one migration per module change, never hand-edited in production. Every migration that touches a PHI-adjacent table gets an explicit RLS policy check in the migration's `upgrade()` — a new table without a `clinic_isolation` policy is a review-blocking bug, not a follow-up ticket.

---

## 6. Real-Time Layer (Module 5)

The live queue is the one place the backend genuinely needs push, not poll.

```
Doctor marks patient "done"
        │
        ▼
PUT /api/v1/queue/{entry_id}/action
        │
        ▼
queue_triage/service.py: update status, recompute positions for all 'waiting' entries
        │
        ▼
Redis PUBLISH clinic:{clinic_id}:queue  {payload}
        │
        ├──────────────► WebSocket connections on Doctor Dashboard (this instance + others)
        └──────────────► WebSocket connections on Patient Live Tracker
```

**Why Redis pub/sub and not just an in-process WebSocket manager:** the backend runs 2–4 instances behind a load balancer (per the PRD's deployment spec). A patient's tracker connection might be held by instance A while the doctor who just updated the queue is talking to instance B. Redis pub/sub is the fan-out layer that makes "any instance can publish, every instance's connected clients hear it" work without sticky sessions being a hard requirement — though sticky sessions or a WebSocket-aware load balancer are still recommended for connection stability, per the PRD's production checklist.

**Fallback for clients that can't hold a WebSocket** (older devices, restrictive networks): the same `GET /api/v1/queue/{clinic_id}/tracker/{queue_no}` endpoint from the PRD works as a plain polling fallback — the frontend attempts WebSocket first, falls back to 5-second polling automatically.

---

## 7. Background Jobs

| Job | Trigger | Worker |
|---|---|---|
| AI triage brief generation | Check-in webhook (async, non-blocking) | `ai_brief_worker.py` |
| Report PDF rendering | Doctor approval | `pdf_render_worker.py` |
| 24h / 1h appointment reminders | Scheduled scan (every 5 min) | `reminder_worker.py` |
| No-show recovery message | Scheduled scan for missed appointment_time | `reminder_worker.py` |
| Follow-up rule evaluation | Daily scan for due `scheduled_reminders` | `followup_worker.py` |
| Campaign sends | Scheduled per `campaigns.start_date` | `followup_worker.py` |

**Scheduler choice:** APScheduler is sufficient for Phase 1–2 volume (a handful of clinics, low job concurrency) and keeps the deployment to a single extra process rather than standing up a full Celery + broker cluster. **Revisit at the point a clinic count makes single-process job scheduling a bottleneck** (rough signal: >20 clinics or >5,000 scheduled reminders/day) — migrate to Celery + Redis-as-broker at that point, reusing the same Redis instance already running for pub/sub.

Every worker wraps its external call (Claude API, Twilio, PDF render) in a retry-with-backoff (3 attempts, exponential) and writes a terminal failure to `audit_logs` with enough context to manually reprocess — a failed AI brief or failed WhatsApp send should never silently disappear.

---

## 8. Third-Party Integration Boundaries

Each integration lives behind a single client module so the rest of the codebase never imports `twilio` or `anthropic` directly — this makes it possible to swap providers (e.g., AWS SNS fallback per the PRD) without touching module business logic.

```python
# integrations/claude_client.py
class TriageBriefUnavailable(Exception):
    """Raised when Claude API fails; callers must handle gracefully, never propagate as a 500."""

async def generate_triage_brief(check_in_data: dict) -> TriageBrief:
    try:
        response = await client.messages.create(...)
        return parse_structured_brief(response)
    except (anthropic.APIError, anthropic.APIConnectionError):
        raise TriageBriefUnavailable()
```

Callers (`queue_triage/service.py`) catch `TriageBriefUnavailable` and write a brief row with `ai_unavailable=true` rather than letting the exception bubble — this is the code-level enforcement of the PRD's "AI outage never blocks the queue" requirement.

Same pattern for `twilio_client.py`: a failed send is queued for retry, never raised back to the patient-facing request that triggered it (the patient already has their queue number and on-screen confirmation regardless of whether the WhatsApp message lands on the first attempt).

---

## 9. Security

- **Auth:** JWT (python-jose) for staff (doctor/admin/front-desk roles), short-lived access token + refresh token pair. Patient-facing surfaces (check-in form, live tracker) are intentionally unauthenticated by design — a patient shouldn't need an account to check in — and are instead scoped by unguessable tokens (signed check-in link, queue tracker URL).
- **Secrets:** all API keys (`ANTHROPIC_API_KEY`, `TWILIO_AUTH_TOKEN`, DB credentials) load via `config.py`'s Pydantic Settings from environment, never committed, never logged — `core/security.py` includes a log-scrubbing filter that redacts anything matching known secret patterns before it hits any log sink.
- **Rate limiting:** applied at the gateway/proxy level on all public endpoints (check-in webhook, live tracker) to prevent a single bad actor from spamming queue entries or hammering the tracker endpoint.
- **RLS as the primary isolation boundary**, per §3 — application-layer clinic checks are a defense-in-depth second layer, not the only layer.
- **AI brief visibility** is enforced at the RLS policy level (role != 'patient'), not just hidden in the frontend — per the PRD's explicit requirement that this can't be leaked by a frontend bug.

---

## 10. Testing Strategy

| Layer | Tool | Focus |
|---|---|---|
| Unit | pytest | Service-layer business logic in isolation — queue state machine transitions, requeue numbering, brief-unavailable fallback paths |
| Integration | pytest + test Postgres container | RLS policies actually isolate clinics (write a test that tries to leak, assert it fails), full check-in → queue → AI brief pipeline |
| Contract | pytest | Twilio/Claude client wrappers against recorded fixtures, so external API changes are caught without hitting real services in CI |
| Load | k6 / Locust | Check-in burst (simulating a busy morning), WebSocket connection volume on the live queue channel — this is the one area the PRD flags as easy to under-test since REST load tests don't exercise it |
| Security | OWASP ZAP (per PRD's production checklist) | Run against staging before every production deploy |

**Priority order for a small team:** unit tests on the queue state machine and RLS integration tests come first — those two are where a bug becomes either a patient-safety issue (wrong queue order) or a compliance issue (data leak across clinics). Load testing the WebSocket layer comes before the first real multi-doctor clinic goes live, not after.

---

## 11. Environment & Configuration

```bash
# .env.example
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://...
JWT_SECRET=...
ENCRYPTION_KEY=...              # rotated quarterly per PRD §9

TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
TWILIO_WHATSAPP_NUMBER=...

ANTHROPIC_API_KEY=...
CLAUDE_MODEL=claude-sonnet-4-6

N8N_WEBHOOK_SECRET=...          # verifies internal calls from n8n workflows

ENV=development                 # development | staging | production
LOG_LEVEL=INFO
```

`config.py` validates all of these at process startup via Pydantic Settings — a missing or malformed env var fails the boot immediately with a clear error, rather than surfacing as a mysterious 500 on the first request that happens to need it.

---

## 12. Deployment & CI/CD

Matches the PRD's infrastructure section exactly:

- **Containerized:** Docker + Docker Compose locally, same images to AWS ECS or Heroku in production.
- **CI (GitHub Actions):** lint → unit tests → integration tests (spin up ephemeral Postgres + Redis) → build image → push → deploy to staging → OWASP ZAP scan → manual promote to production.
- **Migrations run as a release step**, not on application boot — `alembic upgrade head` runs once per deploy, before the new app version starts receiving traffic, so a bad migration fails the deploy rather than partially applying against live traffic.
- **Zero-downtime WebSocket deploys:** because Module 5 holds long-lived connections, deploys drain existing WebSocket connections gracefully (respond to a shutdown signal by broadcasting a "reconnect" message to clients, who fall back to polling for the few seconds until the new instance is up) rather than hard-killing them.

---

## 13. Observability

- **Structured logging** (JSON) throughout, tagged with `clinic_id`, `request_id`, and `module` on every line — a support engineer investigating one clinic's issue can filter to exactly their traffic.
- **DataDog/New Relic** (per PRD) tracks: API latency by endpoint, WebSocket connection count and message throughput, background job success/failure rates, and Claude API / Twilio call latency separately from internal processing time — so a slow AI brief can be attributed to Anthropic's API rather than misdiagnosed as a backend bug.
- **Audit log is queryable, not just archival** — `core/audit.py` writes in a shape that supports "show me every action on patient X" and "show me every AI brief this doctor viewed today" without a data warehouse, since these are the two questions a compliance audit actually asks.

---

## 14. Open Engineering Questions

1. Celery vs. staying on APScheduler longer than the §7 threshold — worth revisiting once real clinic-count data exists rather than guessing now.
2. Should the WebSocket layer use raw FastAPI WebSockets + Redis pub/sub (as specified here) or a managed service (e.g., Supabase Realtime, which the PRD's original stack already includes for Postgres change-data-capture)? Supabase Realtime could remove the need for a custom Redis pub/sub layer entirely — worth a short spike before Module 5 build starts.
3. Connection pool sizing against Supabase's actual plan-tier limits needs a real number once the hosting tier is chosen (§5) — the `pool_size=10` above is a placeholder, not a measured value.
