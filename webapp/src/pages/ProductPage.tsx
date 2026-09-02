import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode, FileText, Volume2, Smartphone,
  BarChart2, Building2, CheckCircle, Zap,
  ArrowRight, Shield, Stethoscope, MessageSquare,
  RefreshCw, Check, Sparkles
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'
import { useSEO } from '../hooks/useSEO'

export default function ProductPage() {
  useSEO({
    title: 'Product Tour — Core Clinical & OPD Operating Modules | Med Rapidly',
    description: 'Explore Med Rapidly modules: Contactless QR check-in, real-time live queue telemetry, 30-second prescription creator, automated WhatsApp delivery, and hospital analytics.',
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [activeModule, setActiveModule] = useState<'qr' | 'rx' | 'audio' | 'whatsapp' | 'analytics' | 'multitenant'>('qr')

  const modules = {
    qr: {
      title: 'Contactless Smart QR Reception',
      tagline: 'Self-service patient intake with 22-second registration time',
      paragraphs: [
        'Patients scan a durable, high-contrast QR code placed at your reception entrance or outpatient triage desk. There is zero app download required — the intake interface opens immediately in their default mobile browser.',
        'Patients select their visit date, choose an available doctor from real-time duty rosters, and enter their chief symptoms. Returning patients are recognized instantly by their phone number, auto-populating their chronic health history, prior medications, and known allergies.'
      ],
      features: ['Multilingual language support (Hindi, Marathi, Gujarati, English)', 'Sequential token assignment with PostgreSQL advisory lock', 'Auto-fills returning patient medical charts in 3 seconds', 'Thermal paper slip printing option for non-smartphone patients']
    },
    rx: {
      title: '30-Second Doctor Prescription Pad',
      tagline: 'Designed for physician ergonomics with auto-completing pharmacopeia',
      paragraphs: [
        'Built with practicing clinicians, the doctor cockpit presents the waiting roster on the left and active patient vitals on the right. Doctors can call the next patient, review complaint history, and prescribe medications without cognitive overload.',
        'Type just two letters of a medication brand or salt name to autocomplete standard strengths, routes, and frequencies (e.g. 1-0-1 after food for 5 days). Includes built-in pediatric drop calculators based on body weight in kilograms.'
      ],
      features: ['Auto-completing generic & brand pharmacopeia', 'Weight-based pediatric dosage calculation engine', 'Pre-configured clinical bundles for rapid entry', 'Digital doctor signature and medical council registration stamp']
    },
    audio: {
      title: 'Live Audio & TV Waiting Room Broadcaster',
      tagline: 'Synchronized visual and voice announcements across all waiting zones',
      paragraphs: [
        'Connect any standard smart TV, Google TV, or computer monitor with an HDMI connection to act as an automated queue display board. Med Rapidly streams live updates over low-latency WebSockets with zero page refresh.',
        'When a doctor clicks "Call Next", the room buzzer chimes and an automated voice announces: "Token 14, please proceed to Room 101, Dr. Sharma". Patients hear their call even from the hospital cafeteria or garden.'
      ],
      features: ['Runs in any standard TV web browser without dedicated hardware', 'Natural voice audio announcement in English and regional languages', 'Simultaneous multi-doctor and multi-room calling', 'Dynamic turnaround countdown for waiting patients']
    },
    whatsapp: {
      title: 'Automated WhatsApp Rx & Invoicing Engine',
      tagline: 'Instant digital delivery straight to patient smartphones',
      paragraphs: [
        'Paper prescriptions tear, fade, and get lost. Med Rapidly dispatches a tamper-proof, high-resolution PDF document directly to the patient WhatsApp before they exit the consultation room.',
        'The document contains the official hospital letterhead, doctor registration details, medication table, lab test requisitions, and scheduled follow-up revisit dates. Revisit reminder notifications are automated 48 hours in advance.'
      ],
      features: ['Official WhatsApp Business Cloud API integration', 'Clean, high-resolution PDF document with hospital branding', 'Direct integration with hospital pharmacy and lab billing desks', 'Automated chronic disease follow-up reminders']
    },
    analytics: {
      title: 'Executive OPD Analytics & Footfall Curves',
      tagline: 'Pinpoint waiting bottlenecks and measure physician consultation pace',
      paragraphs: [
        'Gain complete operational visibility into your outpatient department. Track patient arrival curves, peak waiting room congestion hours, doctor turnaround velocity, and no-show rates.',
        'Export clean, timestamped audit logs for hospital management meetings, financial cashier reconciliation, and national healthcare accreditation standards (NABH / JCI).'
      ],
      features: ['Live patient footfall heatmaps and peak arrival curves', 'Doctor turnaround time (TAT) and consultation pace metrics', 'Cashier counter collection tracking and billing logs', 'One-click export to PDF, Excel, and hospital HIS databases']
    },
    multitenant: {
      title: 'Multi-Hospital Data Partitioning (RLS)',
      tagline: 'Database-enforced isolation ensuring zero cross-facility data leakage',
      paragraphs: [
        'Healthcare security requires strict data partitioning. Med Rapidly enforces tenant isolation at the PostgreSQL database kernel layer using Row-Level Security (RLS) policies.',
        'Hospital H1 cannot query or inspect Hospital H2 patient records under any circumstances. All patient tracking tokens are non-guessable cryptographic strings, preventing sequential token scraping.'
      ],
      features: ['PostgreSQL Row-Level Security (RLS) native policies', 'Two-layer authentication with token status heartbeats', 'Non-guessable cryptographic URLs for live patient tracking', 'Full HIPAA, ISO 27001, and Ayushman Bharat (ABDM) compliance']
    }
  }

  const activeData = modules[activeModule]

  return (
    <div className="min-h-screen bg-[#FCFCFE] text-[#18233D] font-sans antialiased selection:bg-[#4361EE] selection:text-white">
      <PublicHeader />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-white via-indigo-50/25 to-white px-6 border-b border-[#E6E9F0]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            Clinical Module Tour
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#18233D] tracking-tight leading-tight">
            The Complete Digital Suite Built for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-[#5D4CC8]">
              High-Velocity Healthcare
            </span>
          </h1>
          <p className="text-base text-[#5E687B] max-w-2xl mx-auto leading-relaxed">
            Eliminate long patient waiting lines, generate digital prescriptions in under 30 seconds, and run a 100% paperless outpatient clinic.
          </p>

          <div className="pt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-[#4361EE] to-[#5D4CC8] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center gap-2"
            >
              <span>Schedule Live Module Demo</span>
              <ArrowRight size={14} />
            </button>
            <Link
              to="/features"
              className="px-8 py-4 bg-white hover:bg-slate-50 border border-[#E6E9F0] text-[#18233D] font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition"
            >
              View Feature Matrix
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Module Explorer */}
      <section className="py-24 max-w-[1240px] mx-auto px-6 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Interactive Product Tour
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
            Explore Core Operating Modules
          </h2>
          <p className="text-sm text-[#5E687B]">Click each module below to inspect its clinical capabilities.</p>
        </div>

        {/* Module Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {[
            { id: 'qr', label: 'Smart QR Intake', icon: <QrCode size={15} /> },
            { id: 'rx', label: '30s Rx Pad', icon: <Stethoscope size={15} /> },
            { id: 'audio', label: 'TV & Voice Calling', icon: <Volume2 size={15} /> },
            { id: 'whatsapp', label: 'WhatsApp Dispatch', icon: <MessageSquare size={15} /> },
            { id: 'analytics', label: 'OPD Analytics', icon: <BarChart2 size={15} /> },
            { id: 'multitenant', label: 'Data Security (RLS)', icon: <Shield size={15} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeModule === tab.id
                  ? 'bg-[#4361EE] text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white border border-[#E6E9F0] text-[#5E687B] hover:text-[#18233D] hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active Module Details Card */}
        <div className="bg-white rounded-3xl border border-[#E6E9F0] shadow-2xl p-8 sm:p-12 text-left space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {activeData.tagline}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#18233D] tracking-tight">
              {activeData.title}
            </h3>
          </div>

          <div className="space-y-4 text-sm text-[#5E687B] leading-relaxed">
            {activeData.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-black uppercase tracking-wider text-[#18233D] block mb-3">
              Included Capabilities
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-[#18233D]">
              {activeData.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 max-w-[1360px] mx-auto">
        <div className="bg-gradient-to-r from-[#3A57E8] to-[#5046E5] rounded-3xl p-10 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
            <h2 className="text-3xl font-black tracking-tight">
              Experience the Complete Clinic OS
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Deploy your hospital QR code and test the live queue system in under 15 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-[#3A57E8] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              Start 14-Day Free Trial →
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs rounded-xl transition"
            >
              Request Custom Demo
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
