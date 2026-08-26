import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  Headphones,
  Zap,
  User,
  Star,
  ShieldCheck,
  ArrowRight,
  Play,
  QrCode,
  FileText,
  BarChart2,
  Building2,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  Volume2,
  Smartphone,
  Lock,
  Clock
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'
import { useSEO } from '../hooks/useSEO'

export default function LandingPage() {
  useSEO({
    title: 'MedTech Fixaters - Smart OPD & EMR System for Indian Clinics',
    description: 'Transform paper OPDs into digital smart clinics. 30-second AI EMR prescriptions, QR reception check-in, live audio token callouts, and WhatsApp digital Rx.',
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'checkin' | 'audio' | 'emr' | 'whatsapp'>('checkin')
  
  // Interactive ROI Calculator State
  const [dailyPatients, setDailyPatients] = useState<number>(45)
  const [customFee, setCustomFee] = useState<number>(500)

  // Dynamic Calculations based on user custom fee & patients
  const hoursSavedPerMonth = Math.round((dailyPatients * 4 * 30) / 60)
  const monthlyRevenue = dailyPatients * customFee * 30
  const revenueLossPrevented = Math.round(monthlyRevenue * 0.15)

  const faqs = [
    {
      q: 'How does the contactless QR reception kiosk work?',
      a: 'Patients scan an entrance QR poster using their mobile phone camera, select their doctor, and instantly receive a live queue token number. They can track estimated wait times on their phone without standing in line or writing on paper registers.'
    },
    {
      q: 'Can multiple doctors use MedTech Fixaters in a polyclinic or hospital?',
      a: 'Yes! MedTech Fixaters supports multi-doctor and multi-hospital seat management. Each doctor gets an independent, isolated queue and private EMR workspace while the hospital admin has full oversight.'
    },
    {
      q: 'Is MedTech Fixaters compliant with ABDM and medical data security standards?',
      a: 'Absolutely. MedTech Fixaters is built in compliance with ABDM Milestone-3, HIPAA, and ISO 27001 data encryption standards with 256-bit AES database encryption.'
    },
    {
      q: 'Do patients need to download any mobile app?',
      a: 'No app download is required. The patient intake portal runs directly inside any mobile web browser on Chrome, Safari, or Samsung Internet.'
    },
    {
      q: 'How long does it take to onboard our hospital or clinic?',
      a: 'Initial account activation takes under 5 minutes. You can print your entrance QR poster immediately and invite doctors to set up their consultation schedules.'
    }
  ]

  const specialties = [
    { title: 'General Medicine & OPD', count: '1,200+ Clinics', desc: 'Rapid intake of daily walk-ins, fever cases, and chronic disease consultations.' },
    { title: 'Cardiology & Heart Care', count: '450+ Hospitals', desc: 'Vitals tracking (BP, Pulse, SpO2) integrated with long-term cardiac EMR records.' },
    { title: 'Pediatrics & Child Care', count: '680+ Clinics', desc: 'Growth chart timelines, vaccination schedules, and parent WhatsApp reminders.' },
    { title: 'Orthopedics & Sports Med', count: '520+ OPDs', desc: 'X-Ray diagnostic ordering, physical therapy follow-ups, and surgery scheduling.' },
    { title: 'Dermatology & Cosmetology', count: '890+ Clinics', desc: 'Visual skin assessment notes, procedural consent tracking, and prescription printouts.' },
    { title: 'Gynecology & Obstetrics', count: '760+ Hospitals', desc: 'ANC trimester tracking, ultrasound diagnosis reporting, and prenatal care notes.' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">
      <PublicHeader />

      {/* 1. HERO SECTION (FINVORA DESIGN MATCH) */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 bg-gradient-to-b from-emerald-50/30 via-white to-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold tracking-wide">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>BANK-GRADE SECURITY • ABDM M3 COMPLIANT</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                The complete <span className="text-emerald-700">OPD management</span> platform for modern clinics.
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
                Eliminate long patient waiting lines, generate digital EMR prescriptions in under 30 seconds, and run a 100% paperless clinic reception.
              </p>

              {/* User Avatars & Counter */}
              <div className="flex items-center gap-4 pt-1">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-slate-800 text-white font-bold text-xs flex items-center justify-center">DR</div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">MK</div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-indigo-800 text-white font-bold text-xs flex items-center justify-center">SK</div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-teal-800 text-white font-bold text-xs flex items-center justify-center">RK</div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-white bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">+</div>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">4,500+ Registered Doctors</p>
                  <p className="text-xs font-bold text-slate-500">Over 1.2M OPD Patients Served</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-7 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs tracking-wider rounded-full shadow-lg shadow-emerald-950/20 transition flex items-center gap-2 group"
                >
                  <span>Get Started Now</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>

                <Link
                  to="/checkin"
                  className="px-6 py-3.5 bg-white text-slate-800 hover:text-emerald-800 font-extrabold text-xs tracking-wider rounded-full border border-slate-200 hover:border-slate-300 shadow-sm transition flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <Play size={12} className="text-slate-800 fill-slate-800 ml-0.5" />
                  </div>
                  <span>Test Kiosk Demo</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Finvora Style App Preview Card Mockup */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -right-6 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl -z-10" />

                {/* Main Floating Smartphone / Kiosk Card */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">OPD QUEUE #12 ACTIVE</span>
                  </div>

                  <div className="bg-emerald-950 text-white p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-xs text-emerald-300 font-mono">
                      <span>Total OPD Consultations</span>
                      <span className="text-emerald-400 font-bold">+18.5% Today</span>
                    </div>
                    <p className="text-3xl font-black tracking-tight">₹ 14,800 / Daily Revenue</p>
                    <div className="flex gap-2 pt-1">
                      <span className="px-3 py-1 bg-emerald-800/80 text-white text-[11px] font-bold rounded-lg">
                        14 Waiting
                      </span>
                      <span className="px-3 py-1 bg-emerald-600/60 text-white text-[11px] font-bold rounded-lg">
                        2 With Doctor
                      </span>
                    </div>
                  </div>

                  {/* Active Patient Roster Item */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Ramesh Kumar (Token #12)</p>
                        <p className="text-[11px] text-slate-500 font-medium">Dr. Rahul Sharma • Cardiology</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-lg">
                      Called
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: "Your trusted partner in healthcare." + 4 PILL CARDS (FINVORA DESIGN MATCH) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Your <span className="text-emerald-700">trusted partner</span> in healthcare.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md text-left">
            We combine innovative technology with medical industry best practices to deliver a secure and seamless OPD experience for everyone.
          </p>
        </div>

        {/* 4 Feature Pill Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4 text-left">
            <div className="w-12 h-12 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-emerald-800/20">
              <Lock size={24} className="text-emerald-200" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Bank-grade Security</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Your clinical records and patient data are protected with advanced 256-bit AES encryption.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4 text-left">
            <div className="w-12 h-12 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-emerald-800/20">
              <CheckCircle size={24} className="text-emerald-200" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Transparent & Reliable</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              100% transparent OPD operations and real-time patient queue updates across devices.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4 text-left">
            <div className="w-12 h-12 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-emerald-800/20">
              <Headphones size={24} className="text-emerald-200" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">24/7 Priority Support</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Dedicated support from healthcare IT specialists whenever your reception needs assistance.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4 text-left">
            <div className="w-12 h-12 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-emerald-800/20">
              <Zap size={24} className="text-emerald-200" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Fast & Paperless</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Write digital EMR prescriptions in under 30 seconds with zero paper token waste.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE STEP-BY-STEP WORKFLOW VISUALIZER (NEW DETAILED SECTION) */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold tracking-wide">
              HOW MEDTECH FIXATERS WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">End-to-End Digital OPD Journey</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
              From entrance QR scan to instant WhatsApp prescription delivery in 4 effortless steps.
            </p>
          </div>

          {/* Workflow Tabs */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveWorkflowTab('checkin')}
              className={`px-5 py-3 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                activeWorkflowTab === 'checkin' ? 'bg-emerald-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <QrCode size={16} /> Step 1: Contactless QR Check-in
            </button>
            <button
              onClick={() => setActiveWorkflowTab('audio')}
              className={`px-5 py-3 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                activeWorkflowTab === 'audio' ? 'bg-emerald-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Volume2 size={16} /> Step 2: Live Waiting Room Callouts
            </button>
            <button
              onClick={() => setActiveWorkflowTab('emr')}
              className={`px-5 py-3 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                activeWorkflowTab === 'emr' ? 'bg-emerald-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText size={16} /> Step 3: Rapid EMR Consultation
            </button>
            <button
              onClick={() => setActiveWorkflowTab('whatsapp')}
              className={`px-5 py-3 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                activeWorkflowTab === 'whatsapp' ? 'bg-emerald-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Smartphone size={16} /> Step 4: WhatsApp Rx Delivery
            </button>
          </div>

          {/* Workflow Content Container */}
          <div className="bg-slate-950 text-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-800">
            {activeWorkflowTab === 'checkin' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">STEP 01 / PATIENT RECEPTION</span>
                  <h3 className="text-3xl font-black text-white">No Waiting Lines • Direct Mobile Intake</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Patients open their smartphone camera and scan your hospital entrance QR code. The system identifies your hospital automatically from a secure QR token, lists your active doctors, and issues a live digital token number.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-200 font-medium pt-2">
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Patient fills name, phone number, and primary symptoms</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> System assigns independent token numbers per doctor</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Patient tracks estimated wait time live on their browser</li>
                  </ul>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-800 text-white rounded-xl flex items-center justify-center mx-auto font-bold">
                    <QrCode size={24} />
                  </div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">Hospital Entrance QR Poster</p>
                  <p className="text-xs text-slate-400 font-mono">https://clinicos.site/book/tok_hosp-001</p>
                  <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                    Live Active Station
                  </span>
                </div>
              </div>
            )}

            {activeWorkflowTab === 'audio' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">STEP 02 / QUEUE ANNOUNCER</span>
                  <h3 className="text-3xl font-black text-white">Smart Audio Callouts for Waiting Rooms</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    When the doctor clicks "Call Next Patient" inside their consultation console, waiting room TV screens automatically play loud automated voice announcements in clear audio.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-200 font-medium pt-2">
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> "Token #15 - Please proceed to Room 102 for Dr. Sharma"</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Eliminates chaotic reception announcements and shouting</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Visual TV display board keeps patients informed</li>
                  </ul>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-800 text-white rounded-xl flex items-center justify-center mx-auto font-bold animate-bounce">
                    <Volume2 size={24} />
                  </div>
                  <p className="text-lg font-black text-white uppercase tracking-wider">NOW CALLING TOKEN #15</p>
                  <p className="text-xs text-emerald-400 font-semibold">Dr. Rahul Sharma • Room 102</p>
                </div>
              </div>
            )}

            {activeWorkflowTab === 'emr' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">STEP 03 / DOCTOR CONSULTATION</span>
                  <h3 className="text-3xl font-black text-white">Rx Prescriptions Written in &lt; 30 Seconds</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Doctors review patient symptoms captured during QR check-in, record clinical notes, vitals (BP, Pulse, Weight), select prescribed medicines with 1-0-1 dosage, and generate clean printouts.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-200 font-medium pt-2">
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Professional printable prescription header card</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Complete historical visits timeline</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Multi-tenant isolation guarantees private patient data</li>
                  </ul>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-3 font-mono text-xs text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-emerald-400 font-bold">DR. RAHUL SHARMA (CARDIOLOGY)</span>
                    <span className="text-emerald-400">Rx Card #1024</span>
                  </div>
                  <p>Patient: Ramesh Kumar (Age 45)</p>
                  <p>Vitals: BP 120/80 • Pulse 74 • Weight 72kg</p>
                  <p className="text-emerald-400 font-bold">Diagnosis: Essential Hypertension</p>
                  <p>Rx: Telmisartan 40mg (1-0-0) After Meal</p>
                </div>
              </div>
            )}

            {activeWorkflowTab === 'whatsapp' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">STEP 04 / PATIENT ENGAGEMENT</span>
                  <h3 className="text-3xl font-black text-white">Automated WhatsApp Receipts & E-Prescriptions</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Keep patients engaged after their visit. Send digital consultation fee receipts, live queue status links, and PDF prescriptions straight to their WhatsApp.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-200 font-medium pt-2">
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Instant PDF prescription download link</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Digital payment receipts & OPD fee bills</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> High 98% patient open rate</li>
                  </ul>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-3 font-sans text-xs">
                  <div className="bg-emerald-950/80 border border-emerald-500/30 p-4 rounded-xl text-emerald-200 space-y-1">
                    <p className="font-bold flex items-center gap-2"><Smartphone size={16} className="text-emerald-400" /> WhatsApp Message Sent to +91 98765 43210</p>
                    <p className="text-[11px] text-slate-300">"Dear Ramesh, your OPD Token #15 at Metro Care Hospital is confirmed. Click to track live queue: https://clinicos.site/track"</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. COMPARISON TABLE: TRADITIONAL VS MEDTECH FIXATERS (NEW DETAILED SECTION) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold tracking-wide">
            PLATFORM COMPARISON
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why Top Clinics Upgrade to MedTech Fixaters</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
            See how MedTech Fixaters transforms daily OPD operations compared to traditional paper registers.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden text-left">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider">Feature / Capability</th>
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-rose-300 bg-slate-950">Traditional Paper Reception</th>
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950">MedTech Fixaters Smart OPD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr>
                  <td className="p-4 font-bold text-slate-900">Patient Check-in Method</td>
                  <td className="p-4 text-slate-500 bg-slate-50/50">Manual pen & paper registration book</td>
                  <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">Contactless Smartphone QR Scan</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Average Patient Wait Time</td>
                  <td className="p-4 text-slate-500 bg-slate-50/50">60 - 90 Minutes standing in line</td>
                  <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">&lt; 15 Minutes with live mobile updates</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Waiting Room Calling System</td>
                  <td className="p-4 text-slate-500 bg-slate-50/50">Reception shouting out patient names</td>
                  <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">Automated Voice Callouts & TV Board</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Prescription Generation</td>
                  <td className="p-4 text-slate-500 bg-slate-50/50">Handwritten paper pads (unclear writing)</td>
                  <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">Digital EMR Rx generated in &lt; 30 seconds</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Patient Records History</td>
                  <td className="p-4 text-slate-500 bg-slate-50/50">Physical paper folders prone to loss</td>
                  <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">256-bit Encrypted Cloud EMR Timeline</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Compliance & Security</td>
                  <td className="p-4 text-slate-500 bg-slate-50/50">Zero data encryption or compliance</td>
                  <td className="p-4 text-emerald-800 bg-emerald-50/30 font-bold">ABDM M3 & ISO 27001 Certified</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ROI CALCULATOR WIDGET (NEW DETAILED SECTION) */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold tracking-wide">
              CLINIC TIME & REVENUE CALCULATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Calculate Your Monthly OPD Savings</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
              See how much time your clinic staff saves every month by switching to MedTech Fixaters.
            </p>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              {/* Input 1: Daily Patients */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                  <label className="uppercase tracking-wider">1. Daily Average OPD Patients:</label>
                  <span className="text-base font-black text-emerald-400 font-mono">{dailyPatients} Patients / Day</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={dailyPatients}
                  onChange={(e) => setDailyPatients(parseInt(e.target.value) || 10)}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>10 Patients</span>
                  <span>150 Patients</span>
                  <span>300+ Patients</span>
                </div>
              </div>

              {/* Input 2: Custom Consultation Fee */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                  <label className="uppercase tracking-wider">2. Consultation Fee per Patient (₹):</label>
                  <span className="text-base font-black text-emerald-400 font-mono">₹ {customFee.toLocaleString('en-IN')} / Visit</span>
                </div>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  value={customFee}
                  onChange={(e) => setCustomFee(Math.max(50, parseInt(e.target.value) || 50))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-extrabold text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-bold">Quick Presets:</span>
                  {[300, 500, 800, 1200, 1500].map((fee) => (
                    <button
                      key={fee}
                      onClick={() => setCustomFee(fee)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition font-mono ${
                        customFee === fee
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      ₹{fee}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3 Calculated Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2 text-left">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <TrendingUp size={18} /> <span>Monthly OPD Revenue</span>
                </div>
                <p className="text-3xl font-black text-white font-mono">₹ {monthlyRevenue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-400 font-medium">Based on {dailyPatients} patients/day at ₹{customFee}/visit.</p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2 text-left">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <ShieldCheck size={18} /> <span>Prevented Revenue Leakage</span>
                </div>
                <p className="text-3xl font-black text-emerald-400 font-mono">₹ {revenueLossPrevented.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-400 font-medium">15% saved from unrecorded fees & walk-aways.</p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2 text-left">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Clock size={18} /> <span>Staff Hours Saved</span>
                </div>
                <p className="text-3xl font-black text-white font-mono">{hoursSavedPerMonth} Hours / Mo</p>
                <p className="text-xs text-slate-400 font-medium">Replaces paper register work and reception entry.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SPECIALTIES SUPPORTED (NEW DETAILED SECTION) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold tracking-wide">
            TAILORED FOR ALL MEDICAL SPECIALTIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Custom EMR Templates for Every Specialty</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
            Whether you run a single-physician clinic or a multi-specialty hospital, MedTech Fixaters adapts to your clinical workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((spec) => (
            <div key={spec.title} className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 text-left hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-slate-900">{spec.title}</h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-200">
                  {spec.count}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{spec.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. NUMBERED BENTO GRID (01, 02 DARK CARD, 03) (FINVORA DESIGN MATCH) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-left flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-3xl font-black text-slate-900 font-mono">01.</span>
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-bold">
                <User size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Expertise at Every Step</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Get professional setup insights and personalized onboarding guidance for your clinic reception.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-emerald-700 text-xs font-bold">
              <TrendingUp size={16} /> <span>+85% Faster Reception Processing</span>
            </div>
          </div>

          <div className="bg-emerald-950 text-white p-8 rounded-3xl shadow-xl space-y-6 text-left flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-3xl font-black text-white font-mono">02.</span>
              <div className="w-10 h-10 bg-emerald-800 text-white rounded-xl flex items-center justify-center font-bold">
                <Star size={20} className="text-emerald-300 fill-emerald-300" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">Industry Best Practices</h3>
              <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                We follow the highest healthcare guidelines to ensure the safety and growth of your medical practice.
              </p>
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-300 hover:text-white transition pt-2">
              <span>Learn More</span> <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6 text-left flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-3xl font-black text-slate-900 font-mono">03.</span>
              <div className="w-10 h-10 bg-emerald-200/60 text-emerald-800 rounded-xl flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Protected by ABDM Standards</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Your medical files and prescriptions are encrypted following national digital health guidelines.
              </p>
            </div>
            <span className="inline-block px-3 py-1 bg-white text-emerald-800 font-bold text-[11px] rounded-full border border-emerald-200">
              ABDM M3 Certified
            </span>
          </div>
        </div>
      </section>

      {/* 8. LIVE DASHBOARD SHOWCASE & "Trusted platform anytime & anywhere." (FINVORA MATCH) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 bg-slate-950 text-white p-8 rounded-3xl shadow-2xl border border-slate-800 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">LIVE OPD MANAGEMENT OVERVIEW</span>
              <span className="text-xs bg-slate-900 px-3 py-1 rounded-full text-slate-300 font-mono">Real-time</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-mono">Total Patients Today</p>
              <p className="text-3xl font-black text-white">1,480 Patients</p>
              <p className="text-xs font-bold text-emerald-400">+12.5% increase</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-slate-900 rounded-xl flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900 text-emerald-300 flex items-center justify-center font-bold">
                    <QrCode size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white">QR Reception Intake</p>
                    <p className="text-[11px] text-slate-400">Kiosk Station #1</p>
                  </div>
                </div>
                <span className="text-emerald-400 font-mono font-bold">Active</span>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Digital Rx EMR</p>
                    <p className="text-[11px] text-slate-400">Dr. Rahul Sharma</p>
                  </div>
                </div>
                <span className="text-indigo-400 font-mono font-bold">Synced</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
              Trusted platform <br />
              <span className="text-emerald-700">anytime & anywhere.</span>
            </h2>

            <div className="flex items-center gap-2 text-amber-500 text-sm font-bold">
              <span>★★★★★</span>
              <span className="text-slate-900 font-black text-xs">4.9 / 5</span>
              <span className="text-slate-500 text-xs font-normal">from 15K+ Doctor Reviews</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              MedTech Fixaters is a secure and innovative healthcare ecosystem built to help you digitize patient records, reduce waiting times, and grow your practice.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0" />
                <span>Encrypted & Secure</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Zap size={16} className="text-emerald-700 flex-shrink-0" />
                <span>Zero Wait Time</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Building2 size={16} className="text-emerald-700 flex-shrink-0" />
                <span>Multi-Hospital</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setModalOpen(true)}
                className="px-7 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs tracking-wider rounded-full shadow-lg shadow-emerald-950/20 transition flex items-center gap-2 group"
              >
                <span>Start Digitizing Now</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <Link
                to="/contact"
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition flex items-center gap-2"
              >
                <HelpCircle size={15} />
                <span>Ask a question ?</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM HORIZONTAL FEATURE PILL BAR */}
      <section className="bg-white border-y border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-700 font-bold text-xs">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-emerald-700" />
              <span>Secure EMR Vault</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <QrCode size={16} className="text-emerald-700" />
              <span>Instant QR Tokens</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <BarChart2 size={16} className="text-emerald-700" />
              <span>Real-time OPD Analytics</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Building2 size={16} className="text-emerald-700" />
              <span>Multi-Hospital Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-8 space-y-8 text-left">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 font-medium">Everything you need to know about MedTech Fixaters</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`transition-transform ${activeFaq === idx ? 'rotate-180 text-emerald-700' : 'text-slate-400'}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} planName="MedTech Fixaters Enterprise" planPrice="Free Consultation" />
    </div>
  )
}
