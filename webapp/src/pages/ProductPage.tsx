import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode,
  FileText,
  Volume2,
  Smartphone,
  BarChart2,
  Building2,
  CheckCircle,
  Zap,
  ArrowRight,
  Shield
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'
import { useSEO } from '../hooks/useSEO'

export default function ProductPage() {
  useSEO({
    title: 'Product Tour - Smart OPD Queue & EMR Modules',
    description: 'Explore MedTech Fixaters product modules: QR patient intake, 30-second AI voice EMR, live audio queue callouts, and WhatsApp digital Rx delivery.',
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [activeModule, setActiveModule] = useState<'qr' | 'rx' | 'audio' | 'whatsapp' | 'analytics' | 'multitenant'>('qr')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50/30 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold tracking-wide">
            <Shield size={14} className="text-emerald-700" />
            <span>CLINIC OS CORE PRODUCT SUITE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto">
            The Complete OPD Operating System Built for <span className="text-emerald-700">Modern Healthcare</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Eliminate long patient waiting lines, generate digital EMR prescriptions in under 30 seconds, and run a 100% paperless clinic reception.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs tracking-wider rounded-full shadow-lg shadow-emerald-950/20 transition flex items-center gap-2"
            >
              <span>Request Live Product Demo</span> <ArrowRight size={16} />
            </button>
            <Link
              to="/checkin"
              className="px-8 py-3.5 bg-white text-slate-800 hover:text-emerald-800 font-extrabold text-xs tracking-wider rounded-full shadow-sm border border-slate-200 hover:border-slate-300 transition flex items-center gap-2"
            >
              <QrCode size={16} className="text-emerald-700" /> Test Public Kiosk Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Module Overview Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">6 Powerful Modules in 1 Unified System</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
            Designed specifically for Indian clinics, OPD centers, polyclinics, and multi-specialty hospital chains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Module 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition text-left">
            <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-emerald-800/20">
              <QrCode size={28} className="text-emerald-200" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">1. Contactless QR Reception</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Patients scan a unique hospital entrance QR code on their smartphone camera, select their doctor, and receive a live digital queue token instantly.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Zero paper token slips</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Instant patient symptom capture</li>
            </ul>
          </div>

          {/* Module 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition text-left">
            <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-emerald-800/20">
              <FileText size={28} className="text-emerald-200" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">2. &lt; 30-Second EMR Prescription</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Doctors write diagnosis, clinical notes, patient vitals, and prescribed medicines (1-0-1 dosage) with one-click print or WhatsApp delivery.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Printable prescription header card</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Complete patient medical history</li>
            </ul>
          </div>

          {/* Module 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition text-left">
            <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-emerald-800/20">
              <Volume2 size={28} className="text-emerald-200" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">3. Live Audio Queue Announcer</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              When a doctor clicks "Call Next Patient", waiting room TV screens automatically play loud voice callouts announcing token numbers and room numbers.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Eliminates reception shouting</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Real-time 2-second queue sync</li>
            </ul>
          </div>

          {/* Module 4 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition text-left">
            <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-emerald-800/20">
              <Smartphone size={28} className="text-emerald-200" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">4. WhatsApp Receipts & Alerts</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Sends automated consultation fee receipts, live queue status updates, and digital e-Prescriptions directly to the patient's WhatsApp.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Direct WhatsApp API integration</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Automated follow-up reminders</li>
            </ul>
          </div>

          {/* Module 5 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition text-left">
            <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-emerald-800/20">
              <BarChart2 size={28} className="text-emerald-200" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">5. OPD Revenue & Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Track daily consultation revenue, average patient wait time per doctor, peak OPD hours, and monthly department growth.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Real-time OPD revenue charts</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Exportable CSV & PDF reports</li>
            </ul>
          </div>

          {/* Module 6 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition text-left">
            <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-emerald-800/20">
              <Building2 size={28} className="text-emerald-200" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">6. Multi-Hospital Seat Cloud</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Hospital owners can manage multiple hospital branches, control doctor seat limits, issue login credentials, and suspend/reactivate profiles in seconds.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Master Admin Console</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Multi-tenant data security</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Architecture Breakdown */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold tracking-wide">
              LIVE PRODUCT DEMONSTRATION
            </span>
            <h2 className="text-3xl font-black text-slate-900">Explore How Clinic OS Operates</h2>
          </div>

          {/* Module Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveModule('qr')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                activeModule === 'qr' ? 'bg-emerald-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <QrCode size={16} /> QR Reception
            </button>
            <button
              onClick={() => setActiveModule('rx')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                activeModule === 'rx' ? 'bg-emerald-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText size={16} /> Doctor Rx EMR
            </button>
            <button
              onClick={() => setActiveModule('audio')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                activeModule === 'audio' ? 'bg-emerald-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Volume2 size={16} /> Audio Announcer
            </button>
            <button
              onClick={() => setActiveModule('whatsapp')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                activeModule === 'whatsapp' ? 'bg-emerald-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Smartphone size={16} /> WhatsApp Alerts
            </button>
          </div>

          {/* Tab Content Cards */}
          <div className="bg-slate-950 text-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-800">
            {activeModule === 'qr' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">MODULE 01 / RECEPTION KIOSK</span>
                  <h3 className="text-3xl font-black text-white">Smart QR Reception & Entrance Posters</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mount an A4 Entrance Poster or Tablet Kiosk at your clinic reception. Patients scan the QR code using any smartphone camera.
                  </p>
                  <div className="space-y-2 text-xs text-slate-200 font-medium">
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> Resolves hospital identity securely via unique QR token</p>
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> Calculates independent queue numbers for each registered doctor</p>
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> Displays live estimated wait time on patient phone</p>
                  </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-800 text-white rounded-xl flex items-center justify-center mx-auto font-bold">
                    <QrCode size={24} />
                  </div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">Hospital Entrance QR</p>
                  <p className="text-xs text-slate-400 font-mono">https://clinicos.site/book/tok_hosp-001</p>
                  <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                    Live Active Station
                  </span>
                </div>
              </div>
            )}

            {activeModule === 'rx' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">MODULE 02 / CLINICAL EMR</span>
                  <h3 className="text-3xl font-black text-white">Rapid Doctor Prescription Engine</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Write clean, legible prescriptions during patient consultations. Includes chief symptoms, vitals, diagnosis, and dosage tables.
                  </p>
                  <div className="space-y-2 text-xs text-slate-200 font-medium">
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> One-click Rx card printing layout</p>
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> Digital EMR timeline stores all historical visits</p>
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> Multi-tenant isolation guarantees private patient data</p>
                  </div>
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

            {activeModule === 'audio' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">MODULE 03 / WAITING ROOM AUDIO</span>
                  <h3 className="text-3xl font-black text-white">Live Voice Callouts & TV Display Board</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Connect any Smart TV or monitor in your waiting hall. When a doctor clicks "Call Next", the system plays an automated audio announcement.
                  </p>
                  <div className="space-y-2 text-xs text-slate-200 font-medium">
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> "Token #15 - Please proceed to Room 102 for Dr. Sharma"</p>
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> Eliminates chaotic reception announcements</p>
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> Automatic fallback to visual display board</p>
                  </div>
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

            {activeModule === 'whatsapp' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">MODULE 04 / PATIENT ENGAGEMENT</span>
                  <h3 className="text-3xl font-black text-white">Automated WhatsApp Messaging</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Keep patients informed every step of the way. Send digital receipts, consultation links, token status, and e-Prescriptions directly via WhatsApp.
                  </p>
                  <div className="space-y-2 text-xs text-slate-200 font-medium">
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> Instant PDF prescription download link</p>
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> Digital payment receipts & OPD bills</p>
                    <p className="flex items-center gap-2"><Zap size={14} className="text-emerald-400" /> High 98% patient open rate</p>
                  </div>
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

      {/* CTA Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black">Transform Your Hospital Reception Today</h2>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto font-medium leading-relaxed">
            Join 4,500+ doctors across India who have eliminated OPD reception queues and digitalized patient care with Clinic OS.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3.5 bg-white text-emerald-950 font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg hover:bg-slate-100 transition"
            >
              Get Started with Clinic OS
            </button>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-full border border-emerald-700 transition"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} planName="Clinic OS Enterprise" planPrice="Custom Quote" />
    </div>
  )
}
