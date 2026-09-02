import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode, RefreshCw, UserCheck, Users, BarChart3,
  ShieldCheck, FileText, Stethoscope, Smartphone,
  CheckCircle2, ArrowRight, MessageSquare, Clock, Zap,
  Search, SlidersHorizontal, Check, ChevronDown, Award,
  Sparkles, HeartPulse, Building2, Lock, Volume2, Printer
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'
import { useSEO } from '../hooks/useSEO'

export default function FeaturesPage() {
  useSEO({
    title: 'Platform Features — Complete Clinical & OPD Suite | Med Rapidly',
    description: 'Explore Med Rapidly features in depth: Smart QR check-in, real-time live queue telemetry, 30-second prescription creator, automated WhatsApp delivery, multi-counter sync, and PostgreSQL RLS security.',
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'patient' | 'doctor' | 'admin'>('all')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const featurePillars = [
    {
      category: 'patient',
      icon: <QrCode size={26} className="text-[#4361EE]" />,
      bg: 'bg-indigo-50',
      badge: 'Zero Waiting Room Friction',
      title: 'Contactless Smart QR Reception & Digital Triage',
      summary: 'Patients scan a durable, hospital-branded acrylic QR standee to register on their phone in under 25 seconds with zero app installation.',
      paragraphs: [
        'Traditional outpatient check-ins force patients to queue at crowded reception desks, fill out torn paper forms with shared pens, and shout personal details across glass partitions. Med Rapidly replaces this physical friction with instant mobile registration.',
        'When patients scan the hospital QR code, our lightweight web application loads instantly on iOS and Android. Patients select their appointment date, choose an available on-duty doctor, and input their chief symptoms. Returning patients are recognized instantly by their phone number, auto-filling medical background and allergies.',
        'The backend applies PostgreSQL transaction advisory locks to guarantee that every patient receives a sequential, tamper-proof token number without duplicate race conditions, even if 20 patients scan simultaneously.'
      ],
      highlights: [
        'Multilingual interface (Hindi, Marathi, Gujarati, English)',
        'Zero app download required — operates smoothly in any mobile browser',
        'Automatic returning patient profile & chronic medical history lookup',
        'Physical paper slip printing option for elderly or offline patients'
      ]
    },
    {
      category: 'patient',
      icon: <RefreshCw size={26} className="text-emerald-600" />,
      bg: 'bg-emerald-50',
      badge: 'Zero Polling • Instant Latency',
      title: 'Real-Time Live Queue Telemetry Stream',
      summary: 'Eliminate corridor chaos with a persistent live queue stream that gives patients their exact position and live turnaround estimate.',
      paragraphs: [
        'Waiting without knowing when you will be seen creates anxiety, frustration, and hallway crowding. Med Rapidly broadcasts live consultation state updates directly to patients smartphones over secure WebSockets.',
        'The patient screen continuously shows their permanent token (e.g. #14), current token in consultation (e.g. #11), exact patients ahead (3), and estimated wait time based on the doctors real average consultation speed today.',
        'Patients are empowered to wait comfortably in the hospital garden or cafeteria rather than blocking doctor clinic doorways. When their turn is next, their smartphone vibrates and buzzes with an automated alert.'
      ],
      highlights: [
        'Dynamic live position recalculation as consultations finish',
        'Audio buzzer broadcast synchronized with reception TV display boards',
        'Estimated wait time calculated from doctors live consultation pace',
        'Smart no-show handling: doctor can hold, skip, or recall missed patients'
      ]
    },
    {
      category: 'doctor',
      icon: <Stethoscope size={26} className="text-amber-600" />,
      bg: 'bg-amber-50',
      badge: 'Designed for Clinical Ergonomics',
      title: 'Doctor Consultation Cockpit & 30-Second Rx Pad',
      summary: 'A clean, distraction-free clinical console allowing physicians to call patients, review vitals, and generate clean prescriptions in seconds.',
      paragraphs: [
        'Most traditional Hospital Information Systems (HIS) are built for billing administrators, forcing doctors to click through 15 confusing tabs just to prescribe an antibiotic. Med Rapidly was designed in direct collaboration with practicing physicians.',
        'The doctor cockpit presents the waiting roster on the left and active patient vitals on the right. With a single click of the "Call Next" button, the waiting room buzzer sounds and TV display boards update.',
        'Our smart prescription pad features auto-completing brand and generic medicines, standard dosage frequencies (1-0-1 after food), pediatric weight-based drop calculators, and saved template bundles for common OPD complaints.'
      ],
      highlights: [
        'One-click patient caller with audio chime & TV screen sync',
        'Smart medication database with brand, generic, strength, and frequency',
        'Pediatric dosage calculator based on weight (kg) and age',
        'Pre-configured prescription templates for fast common diagnoses'
      ]
    },
    {
      category: 'doctor',
      icon: <MessageSquare size={26} className="text-teal-600" />,
      bg: 'bg-teal-50',
      badge: 'Paperless & Instant',
      title: 'Automated WhatsApp Delivery & Follow-Up Reminders',
      summary: 'Instantly send clean, signed PDF e-prescriptions and diagnostic lab orders straight to the patient WhatsApp as soon as consultation concludes.',
      paragraphs: [
        'Paper prescriptions get lost, crumpled, and torn, making follow-up visits difficult and preventing accurate pharmacy dispensing. Med Rapidly dispatches a tamper-proof PDF prescription directly to the patient WhatsApp before they even exit the clinic room.',
        'The generated document features the hospital logo, doctors medical council registration number, digital signature stamp, diagnosis, medication schedule, dietary precautions, and scheduled follow-up revisit date.',
        'Our system automatically schedules gentle WhatsApp revisit reminders 48 hours prior to the recommended follow-up date, drastically improving chronic disease treatment adherence.'
      ],
      highlights: [
        'Automated WhatsApp webhook delivery with high-resolution PDF',
        'Official hospital letterhead with doctor MCI/NMC registration number',
        'Direct pharmacy and pathology lab internal routing',
        'Automated follow-up revisit reminders to boost patient retention'
      ]
    },
    {
      category: 'admin',
      icon: <BarChart3 size={26} className="text-rose-600" />,
      bg: 'bg-rose-50',
      badge: 'Executive Hospital Telemetry',
      title: 'Comprehensive OPD Analytics & Performance Metrics',
      summary: 'Empower medical superintendents and hospital administrators with live telemetry, doctor consultation velocity, and revenue reporting.',
      paragraphs: [
        'Without real-time data, hospital executives have no visibility into OPD bottleneck points: Which doctors are running behind schedule? What is the peak patient arrival hour? How many patients left without being seen?',
        'Med Rapidly tracks every event timestamp — scan time, token creation, wait start, consultation start, and prescription dispatch. This generates executive dashboards that pinpoint exact bottlenecks and patient throughput curves.',
        'Generate one-click reports for daily outpatient footfall, department revenue breakdowns, consultation fee collections, and doctor performance audits for hospital management meetings.'
      ],
      highlights: [
        'Live patient arrival heatmaps and peak hour congestion curves',
        'Doctor turnaround time (TAT) and consultation pace metrics',
        'Cashier & counter reconciliation with digital payment logs',
        'One-click export to PDF, Excel, and hospital HIS accounting databases'
      ]
    },
    {
      category: 'admin',
      icon: <ShieldCheck size={26} className="text-purple-600" />,
      bg: 'bg-purple-50',
      badge: 'Bank-Grade Security',
      title: 'PostgreSQL Row-Level Security (RLS) & Tenant Isolation',
      summary: 'Guaranteed multi-tenant database isolation ensuring that each hospital operates in its own encrypted cryptographic sandbox.',
      paragraphs: [
        'Healthcare data requires the highest level of regulatory compliance and data segregation. Med Rapidly is engineered with database-native PostgreSQL Row-Level Security (RLS), where every single query is scoped to the tenant hospital ID.',
        'Even in the theoretical event of an API bug, the database engine itself rejects any request attempting to query patient records, prescriptions, or doctor schedules belonging to another hospital facility.',
        'All patient tracking tokens are non-guessable cryptographic strings. Patients can view their live queue position without exposing full medical histories or names of other patients waiting in the room.'
      ],
      highlights: [
        'PostgreSQL Row-Level Security (RLS) enforcing strict tenant partitioning',
        'Encrypted patient tokens preventing sequential token scraping',
        'Two-layer role authentication with periodic status heartbeats',
        'Full ISO 27001, HIPAA, and Ayushman Bharat Digital Mission (ABDM) compliance'
      ]
    }
  ]

  const filteredPillars = activeTab === 'all'
    ? featurePillars
    : featurePillars.filter(p => p.category === activeTab)

  const comparisonRows = [
    { feature: 'Patient Check-in Time', traditional: '12 – 18 minutes in queue', medrapidly: '22 seconds via Smart QR' },
    { feature: 'Waiting Room Experience', traditional: 'Chaotic corridors & door crowds', medrapidly: 'Calm waiting with live phone tracker' },
    { feature: 'Token Duplication / Collisions', traditional: 'Frequent duplicate paper slips', medrapidly: '0% error rate with database advisory locks' },
    { feature: 'Prescription Writing Speed', traditional: '3 – 5 mins manual handwriting', medrapidly: 'Under 30 seconds via smart templates' },
    { feature: 'Prescription Delivery', traditional: 'Easily lost physical paper', medrapidly: 'Instant WhatsApp signed PDF document' },
    { feature: 'Waiting Room TV Display', traditional: 'Expensive proprietary hardware', medrapidly: 'Runs on any smart TV or browser in 1 click' },
    { feature: 'Doctor Roster Management', traditional: 'Whiteboards & confusing phone calls', medrapidly: 'Real-time toggle with patient limits' },
    { feature: 'Multi-Department Coordination', traditional: 'Siloed paper files & lost charts', medrapidly: 'Unified digital OPD patient directory' },
    { feature: 'Data Privacy & Tenant Separation', traditional: 'Vulnerable shared binders', medrapidly: 'PostgreSQL RLS cryptographic isolation' },
  ]

  const faqs = [
    {
      q: 'Can our hospital use our own existing smart TVs for the live queue display?',
      a: 'Yes, absolutely. Med Rapidly TV display board runs in any standard web browser on Android TV, Google TV, Apple TV, Firestick, or PC connected to an HDMI screen. Simply navigate to your hospital display URL (/display/TOKEN) and it immediately starts streaming live tokens with automated voice announcements.'
    },
    {
      q: 'What happens if an elderly patient does not have a smartphone?',
      a: 'We have full hybrid support. Receptionists or nursing staff can book appointments on their computer or tablet in under 10 seconds and print a physical paper token slip with the token number, doctor name, and room assignment.'
    },
    {
      q: 'Does each doctor have their own separate queue and room assignment?',
      a: 'Yes. Each doctor maintains an independent queue. When Dr. Sharma calls token #12 to Room 101, Dr. Verma can simultaneously call token #8 to Room 104 without any interference or token overlap.'
    },
    {
      q: 'Is patient medical data stored securely and compliant with regulations?',
      a: 'Yes. Med Rapidly implements PostgreSQL Row-Level Security (RLS) at the database layer. All data in transit is encrypted with TLS 1.3, and at rest with AES-256. Hospital data is completely isolated, preventing any cross-tenant data leakage.'
    },
    {
      q: 'How fast can our hospital deploy and start using Med Rapidly?',
      a: 'Most multi-specialty hospitals go live within 15 to 30 minutes. You add your hospital details, configure departments and doctor duty schedules, download your high-resolution QR standees, and you are ready to receive patients.'
    },
  ]

  return (
    <div className="min-h-screen bg-[#FCFCFE] text-[#18233D] font-sans antialiased selection:bg-[#4361EE] selection:text-white">
      <PublicHeader />

      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-b from-white via-indigo-50/25 to-white px-6 border-b border-[#E6E9F0]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            Comprehensive Platform Features
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#18233D] tracking-tight leading-tight">
            The Complete Digital Nervous System for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-[#5D4CC8]">
              Modern Hospital OPDs
            </span>
          </h1>
          <p className="text-base text-[#5E687B] max-w-2xl mx-auto leading-relaxed">
            Eliminate reception logjams, crowded waiting rooms, and unreadable handwritten prescriptions. Explore every feature engineered into Med Rapidly.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="text-2xl font-black text-[#4361EE] font-mono block">22s</span>
              <span className="text-[11px] font-bold text-slate-500">Average Check-in</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="text-2xl font-black text-emerald-600 font-mono block">68%</span>
              <span className="text-[11px] font-bold text-slate-500">Wait Time Reduction</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="text-2xl font-black text-amber-600 font-mono block">30s</span>
              <span className="text-[11px] font-bold text-slate-500">Digital Prescription</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="text-2xl font-black text-purple-600 font-mono block">100%</span>
              <span className="text-[11px] font-bold text-slate-500">Tenant Isolation</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Capabilities' },
              { id: 'patient', label: 'Patient & Live Queue' },
              { id: 'doctor', label: 'Doctor & Prescription' },
              { id: 'admin', label: 'Hospital Administration & Security' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-[#4361EE] text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white border border-[#E6E9F0] text-[#5E687B] hover:text-[#18233D] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Long-Form Feature Pillars */}
      <section className="py-24 max-w-[1360px] mx-auto px-6 space-y-20">
        {filteredPillars.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-[#E6E9F0] shadow-xl p-8 sm:p-12 transition-all hover:shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Details */}
              <div className="lg:col-span-8 space-y-5 text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center shrink-0`}>
                    {f.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#4361EE] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {f.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#18233D] tracking-tight mt-1">
                      {f.title}
                    </h2>
                  </div>
                </div>

                <p className="text-base font-bold text-slate-700 leading-relaxed">
                  {f.summary}
                </p>

                <div className="space-y-3 text-sm text-[#5E687B] leading-relaxed">
                  {f.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Right Feature Highlights Card */}
              <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4 text-left">
                <span className="text-xs font-black uppercase tracking-wider text-[#18233D] block border-b border-slate-200 pb-2">
                  Key Technical Capabilities
                </span>
                <ul className="space-y-3 text-xs font-bold text-[#18233D]">
                  {f.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full py-2.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-[#4361EE] font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <span>Request Live Demo of Feature</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-24 bg-white border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1100px] mx-auto space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              The Clear Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Manual Paper OPD vs. Med Rapidly Smart Platform
            </h2>
            <p className="text-sm text-[#5E687B]">
              A side-by-side comparison of everyday outpatient operations before and after implementing Med Rapidly.
            </p>
          </div>

          <div className="bg-[#FCFCFE] rounded-3xl border border-[#E6E9F0] shadow-xl overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-[#E6E9F0] text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4 sm:p-5">Clinical OPD Workflow</th>
                    <th className="p-4 sm:p-5 text-rose-800 bg-rose-50/50">Traditional Paper Setup</th>
                    <th className="p-4 sm:p-5 text-indigo-900 bg-indigo-50/80">Med Rapidly Smart OS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E9F0]">
                  {comparisonRows.map((r, i) => (
                    <tr key={i} className="hover:bg-white transition">
                      <td className="p-4 sm:p-5 font-bold text-[#18233D]">{r.feature}</td>
                      <td className="p-4 sm:p-5 text-rose-700 bg-rose-50/20 font-medium">✕ {r.traditional}</td>
                      <td className="p-4 sm:p-5 text-emerald-800 bg-indigo-50/20 font-bold">✓ {r.medrapidly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#FCFCFE] border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1000px] mx-auto space-y-12 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Clinical & Technical FAQs
            </h2>
            <p className="text-sm text-[#5E687B]">
              Detailed answers about hospital integration, hardware compatibility, and clinical security.
            </p>
          </div>

          <div className="space-y-3 text-left">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#E6E9F0] rounded-2xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 flex items-center justify-between text-left font-bold text-sm text-[#18233D] hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${openFaq === i ? 'rotate-180 text-[#4361EE]' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5E687B] leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 max-w-[1360px] mx-auto">
        <div className="bg-gradient-to-r from-[#3A57E8] to-[#5046E5] rounded-3xl p-10 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
            <h2 className="text-3xl font-black tracking-tight">
              Ready to Upgrade Your Outpatient Facility?
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Experience the difference Med Rapidly makes in waiting room calm, doctor efficiency, and patient satisfaction.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-[#3A57E8] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              Start Free 14-Day Trial →
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs rounded-xl transition"
            >
              Schedule Live Demo
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
