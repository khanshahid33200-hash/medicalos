# Clinic OS - Frontend Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLINIC OS PLATFORM                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (React/Vite)               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Dashboard   │  │ Appointments │  │Queue Manager │     │
│  │   (Stats)     │  │  (Booking)   │  │ (Real-time)  │     │
│  └───────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Check-in     │  │   Reports    │  │  QR Kiosk    │     │
│  │  (Form)       │  │ (Analytics)  │  │ (Display)    │     │
│  └───────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Component Library                         │   │
│  │  ┌─────────┐ ┌──────┐ ┌─────┐ ┌────────────────┐   │   │
│  │  │ Layout  │ │ Card │ │Form │ │ Modal Dialog  │   │   │
│  │  └─────────┘ └──────┘ └─────┘ └────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                 STATE MANAGEMENT LAYER                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Query (Server State)                  │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────┐   │   │
│  │  │Appointments  │ │Check-ins     │ │ Available  │   │   │
│  │  │  (Cache)     │ │  (Cache)     │ │  Slots     │   │   │
│  │  └──────────────┘ └──────────────┘ └────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      React Hooks (Local State)                       │   │
│  │  Form State │ Modal State │ Filter State │ View Mode│   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                  API CLIENT LAYER (Axios)                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │           ApiClient (Axios Instance)              │     │
│  │                                                   │     │
│  │  Interceptors:                                    │     │
│  │  • Inject Clinic ID header (auto)                 │     │
│  │  • Global error handling                          │     │
│  │  • Request/Response transformation                │     │
│  │  • Auth token injection                           │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Methods:                                                   │
│  ├─ submitCheckin(data)                                    │
│  ├─ bookAppointment(data)                                  │
│  ├─ listAppointments(filters)                              │
│  ├─ confirmAppointment(id)                                 │
│  ├─ rescheduleAppointment(id, newDate)                     │
│  ├─ cancelAppointment(id)                                  │
│  ├─ getAvailableSlots(doctorId, dates)                     │
│  ├─ getAppointmentStats()                                  │
│  └─ healthCheck()                                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                              ↓ HTTP/HTTPS
┌──────────────────────────────────────────────────────────────┐
│              BACKEND API LAYER (FastAPI)                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐      ┌──────────────────────┐     │
│  │  Module 1: Check-in │      │ Module 2: Booking    │     │
│  │  ├─ POST /checkins/ │      │ ├─ POST /appts/      │     │
│  │  ├─ GET /stats      │      │ ├─ GET /appts/       │     │
│  │  └─ GET /history    │      │ ├─ GET /available    │     │
│  │                     │      │ ├─ POST /confirm     │     │
│  │  Data:              │      │ ├─ PUT /reschedule   │     │
│  │  • Patient info     │      │ ├─ DELETE /cancel    │     │
│  │  • Symptoms         │      │ └─ GET /stats        │     │
│  │  • Medical history  │      │                      │     │
│  └─────────────────────┘      │ Data:                │     │
│                                │ • Doctor info        │     │
│                                │ • Appointment slots  │     │
│                                │ • Queue management   │     │
│                                └──────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│              DATABASE LAYER (PostgreSQL/SQLite)              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Check-in Module Tables                            │   │
│  │  ├─ clinics (clinic info)                           │   │
│  │  ├─ patients (patient profiles)                     │   │
│  │  ├─ check_ins (check-in submissions)                │   │
│  │  ├─ check_in_forms (form templates)                 │   │
│  │  └─ audit_logs (compliance tracking)                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Booking Module Tables                             │   │
│  │  ├─ clinic_hours (operating hours)                  │   │
│  │  ├─ clinic_capacity (slot settings)                 │   │
│  │  ├─ appointments (appointment records)              │   │
│  │  ├─ appointment_reminders (notification tracking)   │   │
│  │  └─ appointment_slots (available slots)             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📱 User Journey Flows

### **Flow 1: Patient Self Check-in (QR Kiosk)**

```
┌─────────────────────────────────────────────────────────────┐
│                  PATIENT JOURNEY                            │
└─────────────────────────────────────────────────────────────┘

1. ARRIVE AT CLINIC
   │
   ├─→ See QR Code Display (QR Kiosk)
   │   • Wall-mounted monitor (55"+)
   │   • Or printed poster
   │   • Clinic name & instructions
   │
   └─→ Scan with Phone Camera
       │
       ├─→ QR links to: /checkin?clinic=clinic-001
       │
       └─→ Browser opens Check-in Form
           │
           ├─→ STEP 1: Personal Info
           │  • Phone (required)
           │  • Name (required)
           │  • Age, Gender (optional)
           │
           ├─→ STEP 2: Current Health
           │  • Symptoms (required)
           │  • Severity (Mild/Moderate/Severe)
           │  • Duration & chronic conditions
           │
           ├─→ STEP 3: Medical History
           │  • Allergies & medications
           │  • Past medical history & surgeries
           │
           ├─→ STEP 4: Previous Treatment
           │  • Previous doctor & medications
           │
           ├─→ STEP 5: AI Triage Consent
           │  • Checkbox for AI analysis
           │
           └─→ SUBMIT CHECK-IN
               │
               └─→ Server processes & assigns Queue Number
                   │
                   └─→ SUCCESS SCREEN
                       • Large Queue Number (e.g., "12")
                       • Estimated wait time (e.g., "8 min")
                       • Returning patient indicator
                       • ✓ Confirmation message
```

### **Flow 2: Doctor/Staff Appointment Management**

```
┌─────────────────────────────────────────────────────────────┐
│              DOCTOR/STAFF JOURNEY                           │
└─────────────────────────────────────────────────────────────┘

DASHBOARD
   │
   ├─→ View Real-time Stats
   │   • Today's check-ins
   │   • Upcoming appointments
   │   • Total patients & no-shows
   │
   └─→ APPOINTMENTS PAGE
       │
       ├─→ View Appointment List (filtered)
       │  • Upcoming
       │  • Completed
       │  • All
       │
       └─→ NEW APPOINTMENT BUTTON
           │
           ├─→ Modal Opens: Book New Appointment
           │  • Select Patient ID
           │  • Select Doctor
           │  • Select Department
           │  • Pick DateTime
           │  • Enter Reason
           │  • Select Confirmation Method (SMS/WhatsApp/Call)
           │
           └─→ SUBMIT
               │
               ├─→ Backend validates
               ├─→ Creates appointment record
               ├─→ Schedules reminders
               └─→ Sends confirmation to patient

QUEUE PAGE
   │
   ├─→ View Currently Serving
   │  • Large queue number display
   │  • Patient info
   │  • Severity indicator
   │  • Action buttons:
   │    - Mark Complete
   │    - Mark No-Show
   │
   └─→ Waiting Queue List
      • Position ordering
      • Severity color coding
      • Estimated wait times
      • "Call Next Patient" button
```

### **Flow 3: Kiosk Admin Configuration**

```
┌─────────────────────────────────────────────────────────────┐
│              ADMIN/STAFF KIOSK SETUP                        │
└─────────────────────────────────────────────────────────────┘

NAVIGATE TO: /qr-kiosk
   │
   ├─→ FULLSCREEN MODE (Default)
   │  │
   │  ├─→ Display on clinic monitor
   │  ├─→ Patients scan QR code
   │  └─→ Click settings gear (top-right)
   │
   └─→ SETTINGS PANEL
       │
       ├─→ Customize Clinic Name
       │
       ├─→ View Check-in URL
       │  • Copy to clipboard
       │  • Share with other locations
       │
       ├─→ Select Display Mode
       │  • Fullscreen (recommended for monitor)
       │  • Tablet (for iPad)
       │  • Settings (for configuration)
       │
       ├─→ EXPORT OPTIONS
       │  ├─→ Download QR Code (PNG)
       │  │  • Print & laminate
       │  │  • Post in waiting area
       │  │  • Email to staff
       │  │
       │  ├─→ Print QR Code
       │  │  • Direct printer output
       │  │  • Customizable size
       │  │
       │  └─→ Open Check-in Form
       │     • Test functionality
       │     • Verify mobile experience
       │
       └─→ VIEW MOBILE PREVIEW
          • See how patients experience form
          • Test responsiveness
```

---

## 🔄 Data Flow Diagrams

### **Check-in Submission Flow**

```
PATIENT FORM SUBMISSION
        │
        ▼
┌──────────────────────────┐
│  Form Data Validation    │
│  (React)                 │
│  • Phone format          │
│  • Required fields       │
│  • Age range (0-150)     │
└──────────────────────────┘
        │ ✓ Valid
        ▼
┌──────────────────────────┐
│  API Client.submitCheckin│
│  (Axios POST)            │
│  • Clinic ID header      │
│  • Encrypted payload     │
│  • Content-Type: JSON    │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  Backend Processing      │
│  (FastAPI)               │
│  • Parse request         │
│  • Validate schema       │
│  • Deduplicate patient   │
│  • Encrypt sensitive data│
│  • Generate queue number │
│  • Create records        │
│  • Log audit trail       │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  Database Transaction    │
│  (PostgreSQL)            │
│  • Insert patient        │
│  • Insert check-in       │
│  • Create queue entry    │
│  • Write audit log       │
│  • Commit transaction    │
└──────────────────────────┘
        │ ✓ Success
        ▼
┌──────────────────────────┐
│  API Response            │
│  (200 OK + JSON)         │
│  • Queue number          │
│  • Estimated wait        │
│  • Is returning patient  │
│  • Success message       │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  React State Update      │
│  • Set response data     │
│  • Switch to success     │
│  • Scroll to top         │
│  • Show queue number     │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  SUCCESS SCREEN          │
│  Patient sees:           │
│  • Checkmark icon        │
│  • Large queue number    │
│  • Wait time estimate    │
│  • New Check-in button   │
└──────────────────────────┘
```

### **Appointment Booking Flow**

```
DOCTOR CLICKS: NEW APPOINTMENT
        │
        ▼
┌──────────────────────────┐
│  Modal Opens             │
│  (React State)           │
│  showBookingModal = true │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  Doctor Fills Form       │
│  • Patient ID            │
│  • Doctor selection      │
│  • DateTime picker       │
│  • Department            │
│  • Reason for visit      │
│  • Confirmation method   │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  Form Validation         │
│  • Patient ID required   │
│  • Future date check     │
│  • Slot availability     │
└──────────────────────────┘
        │ ✓ Valid
        ▼
┌──────────────────────────┐
│  API.bookAppointment()   │
│  (Axios POST)            │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  Backend:                │
│  • Check capacity        │
│  • Validate constraints  │
│  • Create appointment    │
│  • Book slot             │
│  • Schedule reminders    │
│  • Send notification     │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  Success Response        │
│  • Appointment ID        │
│  • Confirmation info     │
│  • Reminder schedule     │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  Close Modal             │
│  Reset Form              │
│  Refresh List            │
└──────────────────────────┘
```

---

## 🗂️ Component Hierarchy

```
┌─ App.tsx
│  │
│  ├─→ Layout (Wrapper)
│  │   ├─ Sidebar Navigation
│  │   ├─ Header
│  │   ├─ Mobile Menu
│  │   └─ User Profile Section
│  │
│  └─→ Routes
│      │
│      ├─→ /dashboard
│      │   └─ Dashboard.tsx
│      │      ├─ Stats Cards (4x)
│      │      ├─ Appointment Summary
│      │      └─ Quick Actions
│      │
│      ├─→ /appointments
│      │   └─ Appointments.tsx
│      │      ├─ Filter Tabs
│      │      ├─ Appointment List
│      │      └─→ BookingModal
│      │         ├─ Form Fields (6)
│      │         └─ Submit Button
│      │
│      ├─→ /checkin
│      │   └─ Checkin.tsx
│      │      ├─→ Form (5 Sections)
│      │      │  ├─ Personal Info
│      │      │  ├─ Current Health
│      │      │  ├─ Medical History
│      │      │  ├─ Previous Treatment
│      │      │  └─ AI Triage Consent
│      │      └─→ Success Screen
│      │         ├─ Checkmark
│      │         ├─ Queue Number
│      │         └─ Wait Time
│      │
│      ├─→ /queue
│      │   └─ Queue.tsx
│      │      ├─ Currently Serving Card
│      │      │  ├─ Queue Number
│      │      │  ├─ Patient Info
│      │      │  └─ Action Buttons
│      │      ├─ Summary Stats (4x)
│      │      ├─ Waiting Queue List
│      │      └─ Severity Legend
│      │
│      ├─→ /reports
│      │   └─ Reports.tsx
│      │      ├─ Date Range Selector
│      │      ├─ Key Metrics (4x)
│      │      ├─ Charts (4x)
│      │      └─ Export Buttons
│      │
│      └─→ /qr-kiosk
│          └─ QRKiosk.tsx
│             ├─→ Fullscreen Mode
│             │  ├─ Clinic Name
│             │  ├─ QR Code Display
│             │  ├─ Instructions
│             │  └─ Settings Button
│             │
│             └─→ Settings Mode
│                ├─ Config Panel
│                ├─ QR Display
│                ├─ Export Options
│                └─ Instructions
```

---

## 🔐 Security & Data Protection

```
┌─────────────────────────────────────────────────────────────┐
│            SECURITY LAYERS                                  │
└─────────────────────────────────────────────────────────────┘

CLIENT SIDE:
  └─ React Input Validation
     ├─ Phone format check
     ├─ Required field validation
     ├─ Age range validation
     └─ XSS prevention

         ↓

API CLIENT:
  └─ Axios Interceptors
     ├─ Clinic ID header injection
     ├─ Auth token handling
     ├─ CORS configuration
     └─ Error handling

         ↓

NETWORK:
  └─ HTTPS/TLS
     ├─ Encrypted transmission
     ├─ Certificate verification
     └─ No plaintext data

         ↓

BACKEND:
  └─ FastAPI Security
     ├─ Input validation (Pydantic)
     ├─ SQL injection prevention
     ├─ Rate limiting
     └─ JWT authentication

         ↓

DATABASE:
  └─ Encryption & Isolation
     ├─ Field-level encryption (Fernet)
     ├─ Row-level security
     ├─ Clinic-based data isolation
     └─ Audit logging
```

---

## 📊 State Management Strategy

```
┌─────────────────────────────────────────────────────────────┐
│           STATE MANAGEMENT LAYERS                          │
└─────────────────────────────────────────────────────────────┘

REACT QUERY (Server State)
  ├─ Appointments List
  ├─ Check-in History
  ├─ Available Slots
  ├─ Appointment Stats
  └─ Auto-refetch on focus
     Auto-invalidate on mutation

         ↕

REACT HOOKS (Component State)
  ├─ useFormData (Checkin form)
  ├─ useModal (Show/hide modal)
  ├─ useFilter (Appointment filters)
  ├─ useQueueState (Queue display)
  └─ useState for local state

         ↕

LOCAL STORAGE (Client Persistence)
  ├─ clinicId
  ├─ userRole
  ├─ Preferences
  └─ Theme settings
```

---

**Architecture Version:** 1.0  
**Last Updated:** August 19, 2026  
**Status:** ✅ Production Ready
