# DESIGN.MD

## PROJECT

Build a complete Hospital Administration Dashboard for the Medtech Fixaters platform.

Use the provided reference image as the primary visual reference.

Reproduce the same visual direction:
- Clean light theme.
- Premium healthcare technology interface.
- White background.
- Soft blue accents.
- Subtle purple and green status colors.
- Rounded cards.
- Thin borders.
- Soft shadows.
- Spacious layout.
- Professional data dashboard.
- Modern product interface.

Do not create a static dashboard mockup.
Build a fully functional multi-page Hospital Administration application.

Every sidebar item must work.
Every button must work.
Every card action must work.
Every route must have a dedicated page.
All data must respect the logged-in hospital identity.

## APPLICATION ROUTE

Hospital dashboard base route:
`/hospitaldashboard`

Use nested routes:
- `/hospitaldashboard/dashboard`
- `/hospitaldashboard/appointments`
- `/hospitaldashboard/live-queue`
- `/hospitaldashboard/patients`
- `/hospitaldashboard/doctors`
- `/hospitaldashboard/departments`
- `/hospitaldashboard/reports`
- `/hospitaldashboard/analytics`
- `/hospitaldashboard/notifications`
- `/hospitaldashboard/settings`
- `/hospitaldashboard/users-roles`
- `/hospitaldashboard/qr`

After successful Hospital Administration login, redirect users to:
`/hospitaldashboard/dashboard`

## VISUAL IDENTITY

Brand name: **Medtech Fixaters**

The Hospital Administration must support a custom hospital identity.
Each hospital administrator must upload and manage:
- Hospital Name
- Hospital Logo
- Hospital Cover Image, optional
- Hospital Address
- City
- State
- Country
- Phone Number
- Email
- Website, optional
- Hospital Registration Number, optional

Do not hardcode City Care Hospital as permanent product data. Use City Care Hospital only as demo data.

The uploaded hospital logo should appear in:
- Sidebar hospital profile card.
- Top navigation area when appropriate.
- QR design.
- Hospital profile page.
- Downloaded QR materials.
- Patient appointment page.

The uploaded hospital name should appear in:
- Sidebar.
- QR code design.
- Patient booking page.
- Hospital profile.
- Appointment communications.
- Reports.
- Dashboard greeting.

Store uploaded branding securely and associate every asset with the current `hospital_id`.

## LAYOUT

Use a fixed desktop application layout.
Structure:
1. Left Sidebar (approximately 250px, white, thin border, soft blue active glow)
2. Top Header (current page title, compact date selector, notification counter, admin avatar dropdown)
3. Main Content Area
4. Responsive Tablet & Mobile Layouts

### SIDEBAR NAVIGATION
Active navigation buttons:
- Dashboard (`/hospitaldashboard/dashboard`)
- Appointments (`/hospitaldashboard/appointments`)
- Live Queue (`/hospitaldashboard/live-queue`)
- Patients (`/hospitaldashboard/patients`)
- Doctors (`/hospitaldashboard/doctors`)
- Departments (`/hospitaldashboard/departments`)
- Reports (`/hospitaldashboard/reports`)
- Analytics (`/hospitaldashboard/analytics`)
- Notifications (`/hospitaldashboard/notifications`)
- Settings (`/hospitaldashboard/settings`)
- Users and Roles (`/hospitaldashboard/users-roles`)
- QR Management (`/hospitaldashboard/qr`)

### SIDEBAR HOSPITAL PROFILE CARD
Bottom of sidebar: Hospital logo, hospital name, role ("Hospital Administration").
Clicking opens `/hospitaldashboard/settings/hospital-profile`.

## PAGES SPECIFICATION

### 1. DASHBOARD (`/hospitaldashboard/dashboard`)
- 5 Summary KPI cards with trends: Total Appointments, Patients Today, Patients Waiting, Completed Today, No Shows.
- Appointments Overview: Line chart with date range selector (Today, This Week, This Month, Last Month, Custom) showing Scheduled, Completed, Cancelled, No Shows.
- Live Queue Overview: Primary department/doctor active queue with token counter, plus other active departments summary list and "View All Queues" action.
- Today's Appointments: Schedule list with status pills (Now, Next, Waiting, Upcoming, Completed, Cancelled, No Show).
- Department-Wise Appointments table.
- Recent Appointments table with patient avatars.
- Appointment Sources donut chart (QR Booking, Walk-in, Website, Other).
- 6 Quick Action buttons (Add Appointment, Add Patient, Add Doctor, Manage Doctors, Manage Departments, Reports).

### 2. APPOINTMENTS (`/hospitaldashboard/appointments`)
Search, date filter, department filter, doctor filter, status filter, source filter. Table view with actions (View, Edit, Cancel, Mark No Show, Print). "New Appointment" modal/workflow.

### 3. LIVE QUEUE (`/hospitaldashboard/live-queue`)
Live queues grouped by department & doctor with real-time token tracking, waiting count, avg waiting time, and real-time animations.

### 4. PATIENTS (`/hospitaldashboard/patients`)
Patient registry table (Number, Name, Age, Gender, Mobile, Last Visit, Assigned Doctor, Status) with actions and "New Patient" modal.

### 5. DOCTORS (`/hospitaldashboard/doctors`)
Doctor directory cards/table with auto-generated Doctor IDs, specialization, availability, and account status management (Activate, Deactivate, Block, Unblock, Add Doctor).

### 6. DEPARTMENTS (`/hospitaldashboard/departments`)
Departments list (Name, Code, Active Doctors, Today's Appointments, Status) with Add/Edit/Deactivate.

### 7. REPORTS (`/hospitaldashboard/reports`)
Appointments, Patient, Doctor Activity, Department, and Queue Performance reports with date filters and CSV/PDF export.

### 8. ANALYTICS (`/hospitaldashboard/analytics`)
Detailed analytics charts (Growth, Department Performance, Doctor Workload, Peak Hours, Queue Wait Time, Completion Rate).

### 9. NOTIFICATIONS (`/hospitaldashboard/notifications`)
Notification list categorized by All, Unread, System, Appointments, Doctors, Queue.

### 10. SETTINGS (`/hospitaldashboard/settings`)
Tabs: Hospital Profile, Branding, Account, Security, Notifications, QR Settings.

### 11. USERS & ROLES (`/hospitaldashboard/users-roles`)
Hospital-level staff and admin user management with role assignment and invitation flow.

### 12. QR MANAGEMENT (`/hospitaldashboard/qr`)
Custom printable hospital QR code card with branding, token generation, download (PNG/PDF), link copying, and direct connection to `/book/:token` patient booking workflow.
