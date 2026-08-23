# Med Rapidly v3.3

## Digital Reception System for Hospitals and Clinics

Med Rapidly is a comprehensive digital queue management system that replaces paper registers and waiting room chaos with a real-time, patient-centric experience.

### 🎯 Key Features

- **One QR Code Per Hospital** - Single entrance code that routes patients by department
- **Live Queue Tracking** - Real-time position updates on patient's phone
- **Automatic Queue Management** - Doctor-independent numbering per department
- **Digital Prescriptions** - Instant PDF generation with doctor signature
- **Voice Reception Agent** - AI assistant for phone-based appointments (Hindi & English)
- **Hospital Admin Dashboard** - Full visibility across all departments and doctors
- **Doctor Dashboard** - Personalized queue view with patient history
- **Analytics** - Real-time metrics on wait times, diagnoses, and performance

### 📋 Tech Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes with server actions
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: WebSocket with Postgres LISTEN/NOTIFY
- **Authentication**: JWT + Server-side sessions
- **Voice**: Claude API for voice reception agent
- **Storage**: AWS S3 for PDF prescriptions

### 🚀 Getting Started

#### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

#### Installation

1. **Clone and setup**
```bash
cd med-rapidly
npm install
```

2. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your database and API keys
```

3. **Create database**
```bash
createdb med_rapidly
```

4. **Run migrations**
```bash
npm run db:push
```

5. **Generate database client**
```bash
npm run db:generate
```

6. **Start development server**
```bash
npm run dev
```

Visit http://localhost:3000

### 📚 API Documentation

#### Patient Intake
- `POST /api/appointments/intake` - Book appointment via QR scan
- `GET /api/doctors/available/[token]?date=today` - Get available doctors
- `POST /api/appointments/track` - Track appointment status

#### Prescriptions
- `POST /api/prescriptions/request-otp` - Request OTP for download
- `POST /api/prescriptions/verify-otp` - Verify OTP and list prescriptions
- `POST /api/prescriptions/download/[pdfId]` - Download prescription PDF

#### Queue Management
- `POST /api/appointments/call-next` - Advance queue (doctor only)
- `GET /api/queue/live/[doctorId]` - Live queue feed

#### Hospital Admin
- `POST /api/hospitals/create` - Create new hospital
- `POST /api/departments/manage` - Manage departments
- `POST /api/users/invite` - Invite doctor or admin

### 🗂️ Project Structure

```
app/
├── (marketing)/          # Public marketing pages
│   ├── page.tsx         # Landing page
│   ├── features/
│   ├── pricing/
│   └── contact/
├── (auth)/              # Authentication pages
│   ├── login/
│   ├── forgot-password/
│   └── set-password/
├── a/[token]/          # Patient intake form
├── track/              # Queue tracking
├── rx/                 # Prescription download
├── display/[token]/    # Waiting room display
├── app/               # Protected clinical app
│   ├── queue/
│   ├── dashboard/
│   ├── consultations/
│   ├── patients/
│   ├── team/         # Hospital admin
│   └── analytics/
└── api/               # API routes and server actions
    ├── appointments/
    ├── prescriptions/
    ├── doctors/
    └── auth/

lib/
├── db/               # Database schema and client
├── auth.ts           # Authentication utilities
└── api-client.ts     # API client helpers
```

### 🔐 Security Features

- **Row-Level Security** - Database-enforced data isolation
- **Hospital Segregation** - Strict multi-tenant isolation
- **Doctor Privacy** - Doctors only see their own patients
- **Prescription Security** - OTP-protected download, tamper detection via SHA-256
- **Audit Logging** - All actions logged with user, timestamp, and IP
- **Password Hashing** - bcrypt with 10 rounds
- **JWT Authentication** - Secure token-based sessions

### 🔄 Real-Time Features

The system uses PostgreSQL's LISTEN/NOTIFY with WebSocket to keep all screens in sync:

- Doctor's queue list updates instantly when patient is called
- Waiting room display updates in real-time
- Patient tracking page refreshes without polling
- Reception and doctor screens stay synchronized

### 📱 Patient Experience

1. **Scan QR at entrance** → Opens intake form on phone
2. **Choose date and doctor** → See real-time availability
3. **Fill brief form** → Name, age, phone, symptoms
4. **Get token and queue number** → Receive via SMS/WhatsApp
5. **Track position live** → No need to stay at reception
6. **When called to doctor** → Doctor has full history on screen
7. **Get digital Rx** → PDF prescription downloads instantly
8. **Retrieve anytime** → Download again using phone + OTP

### 👨‍⚕️ Doctor Experience

1. **Dashboard** - Queue status, patient history, analytics
2. **Queue screen** - Live list with call next button
3. **Consultation screen** - Patient details, history, prescription form
4. **Templates** - Save and apply common protocols
5. **Prescriptions** - Generate PDF instantly with signature
6. **Analytics** - Personal and hospital-wide stats

### 🏥 Hospital Admin Features

- Create and manage departments
- Assign doctors to departments
- Set daily patient limits per doctor
- Override availability or limits
- View combined analytics across all doctors
- Configure voice reception agent
- Review call transcripts
- Manage team members
- Audit trail access

### 📊 Analytics Dashboard

Real-time metrics including:
- Patients seen today/this week/this month
- Average consultation time per doctor
- Peak hours heatmap
- Top diagnoses
- No-show rates
- Revenue metrics (if configured)
- Department-wise breakdown

### 🗣️ Voice Reception Agent

An AI voice agent that:
- Answers hospital phone line
- Speaks in Hindi or English (follows caller's language)
- Tells caller available doctors and dates
- Takes patient details
- Books appointments
- Reads back token number
- Sends confirmation SMS/WhatsApp
- Transfers to human agent if needed

### 🗄️ Database Schema

15 tables covering:
- Hospitals and departments
- Users (doctors, admin, reception)
- Patients and appointments
- Consultations and prescriptions
- Voice call transcripts
- Audit logs
- Counters for queue numbers and tokens

All with proper indexes for performance and foreign key constraints for integrity.

### 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### 📝 Database Migrations

Migrations are managed with Drizzle:

```bash
# Push schema to database
npm run db:push

# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate
```

### 🚢 Deployment

Recommended for:
- **Vercel** - Zero-config Next.js deployment
- **Railway** - PostgreSQL + Next.js hosting
- **Render** - Full-stack deployment platform
- **AWS EC2** - Custom VPS deployment

### 📞 Support

For issues, feature requests, or documentation:
- Email: support@medrapidly.com
- Docs: https://medrapidly.com/docs
- GitHub Issues: [link to repo]

### 📄 License

Proprietary - © 2026 Med Rapidly Inc.

### 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Submit pull request with test coverage

---

Built with ❤️ for better healthcare delivery
