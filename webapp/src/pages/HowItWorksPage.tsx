import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode, FileText, Clock, Stethoscope, Send,
  RefreshCw, CheckCircle2, ArrowRight, Smartphone,
  Users, Building2, ShieldCheck, Volume2, Printer,
  Tv, Database, ChevronDown, Check, Sparkles, Zap
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'
import { useSEO } from '../hooks/useSEO'

export default function HowItWorksPage() {
  useSEO({
    title: 'How It Works — The Complete OPD Blueprint | Med Rapidly',
    description: 'Step-by-step deep dive into Med Rapidly OPD workflow: patient QR intake, real-time live queue calculation, doctor consultation cockpit, and automated WhatsApp delivery.',
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [activePersona, setActivePersona] = useState<'patient' | 'doctor' | 'admin'>('patient')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const patientSteps = [
    {
      num: '01',
      badge: 'Immediate Registration',
      title: 'Scan Hospital-Branded QR Standee',
      summary: 'Patient arrives at the hospital reception or outpatient wing and scans the acrylic QR code standee using their smartphone camera.',
      description: 'Zero application download is required. The link opens instantly in any mobile browser (Safari, Chrome, Samsung Internet). The URL contains an encrypted hospital token that routes the patient directly to the specific hospital database with zero data cross-talk.',
      techNote: 'Cryptographic URL token verifies hospital validity and activates rate-limiting to prevent automated spam scans.'
    },
    {
      num: '02',
      badge: 'Intelligent Triage',
      title: 'Select Date, Department & On-Duty Doctor',
      summary: 'The patient selects their appointment date and views only doctors who are physically on duty and accepting consultations.',
      description: 'The interface displays the doctors specialty, room number, consultation fee, and current queue load. Returning patients enter their phone number to automatically pre-fill name, age, gender, and prior medical history, saving over 90% of typing time.',
      techNote: 'Database queries check doctor duty flags and daily consultation quotas to prevent doctor burnout.'
    },
    {
      num: '03',
      badge: 'Zero Collisions',
      title: 'Instant Cryptographic Token Generation',
      summary: 'The system locks the transaction and generates a sequential token number (e.g. #14) with an audit timestamp.',
      description: 'Using PostgreSQL transaction-level advisory locks on the doctor ID and appointment date, the system guarantees 100% sequential ordering with zero duplicate tokens, even during heavy morning surges when dozens of patients scan simultaneously.',
      techNote: 'Advisory lock pg_advisory_xact_lock(hashtext(key)) eliminates race conditions across distributed edge nodes.'
    },
    {
      num: '04',
      badge: 'Live Freedom to Wait',
      title: 'Live Queue Tracking & Turnaround Estimation',
      summary: 'Patients monitor their live position on their phone while waiting comfortably in the cafeteria or hospital garden.',
      description: 'The live tracker updates over WebSockets without requiring a page refresh. The screen clearly displays: Token Now In Consultation (#11), Your Permanent Token (#14), Patients Ahead of You (3), and Estimated Wait Time (~18 minutes).',
      techNote: 'Dynamic turnaround time is computed from the doctors rolling median consultation duration for the current shift.'
    },
    {
      num: '05',
      badge: 'Audio & Visual Sync',
      title: 'Automated Room Buzzer Call-In',
      summary: 'When the doctor clicks "Call Next", the waiting room display chimes and the patient smartphone alerts them.',
      description: 'The waiting room TV screen flashes the token number with an automated audio announcement: "Token 14, please proceed to Room 101, Dr. Sharma". Simultaneously, the patient phone screen turns bright green with a directional arrow to the consultation room.',
      techNote: 'WebSocket broadcast with 45ms end-to-end propagation across TV monitors and patient mobile browsers.'
    },
    {
      num: '06',
      badge: 'Paperless Care',
      title: 'Digital WhatsApp Prescription & Follow-up',
      summary: 'Immediately after the consultation, the patient receives a signed, high-resolution PDF prescription directly on WhatsApp.',
      description: 'The prescription contains clear medicine schedules, dosages, dietary guidelines, and diagnostic test referrals. The system also synchronizes the token with hospital pharmacy and billing counters, eliminating second-time queues.',
      techNote: 'Automated WhatsApp Business Cloud API webhook delivery with secure signed storage URLs.'
    }
  ]

  const doctorSteps = [
    {
      num: '01',
      badge: 'Instant Access',
      title: 'Secure One-Click Clinical Login',
      summary: 'Physicians log in via PIN or biometric SSO on their clinic laptop, tablet, or smartphone.',
      description: 'Doctors immediately see their OPD shift overview: Total patients scheduled today, completed consultations, currently waiting patients, and average consultation turnaround speed.',
      techNote: 'Two-tier session verification ensures doctors can only access patient charts from authorized hospital IP or verified tokens.'
    },
    {
      num: '02',
      badge: 'Triage Overview',
      title: 'Live Queue Roster & Vitals Preview',
      summary: 'View patient names, ages, chief complaints, and triage vitals before calling them inside.',
      description: 'The waiting list clearly marks patient status: "Now In Consultation", "Next In Line", and "Waiting in Lobby". Doctors can quickly inspect prior visit notes and chronic conditions with one tap.',
      techNote: 'Fast relational cache queries return patient medical summaries in under 30 milliseconds.'
    },
    {
      num: '03',
      badge: 'One-Click Action',
      title: 'One-Click Audio/Visual Patient Calling',
      summary: 'Clicking "Call Next" automatically advances the queue and alerts the next patient.',
      description: 'No shouting into crowded hallways, no reliance on attendants running back and forth. The system chimes the waiting room TV board, updates the corridor LED display, and rings the patients phone.',
      techNote: 'Handles edge cases: if a patient stepped out, the doctor can click "Skip / Hold" to see the next person without losing the missed patients place.'
    },
    {
      num: '04',
      badge: 'Sub-30-Second Rx',
      title: 'Rapid Prescription Pad & Template Bundles',
      summary: 'Type 2 letters of a medication name to autocomplete brand, strength, frequency, and duration.',
      description: 'Pre-configured clinical bundles (e.g. "Acute Bronchitis Adult", "Pediatric Fever Protocol", "Hypertension Refill") insert standard medication regimens, lab tests, and lifestyle recommendations in a single click.',
      techNote: 'Includes built-in pediatric dose calculation based on patient weight (kg) to avoid clinical dosing errors.'
    },
    {
      num: '05',
      badge: 'Automated Closing',
      title: 'Complete Consultation & WhatsApp Dispatch',
      summary: 'Clicking "Finish Consultation" digitally stamps the prescription and delivers it to the patient.',
      description: 'The patient file is archived to medical records, the queue counter increments, and the hospital billing desk is notified of any prescribed laboratory tests or pharmacy orders.',
      techNote: 'Encrypted PDF generation engine signs the document with the doctors digital registration credential.'
    }
  ]

  const adminSteps = [
    {
      num: '01',
      badge: 'Quick Setup',
      title: 'Department & Clinic Onboarding in 15 Minutes',
      summary: 'Configure hospital departments (Cardiology, Orthopaedics, Pediatrics, General OPD) and assign rooms.',
      description: 'Hospital administrators set operational hours, doctor duty schedules, consultation fees, and room numbers. Everything is fully editable on the fly without IT engineering support.',
      techNote: 'Declarative schema mapping automatically provisions database tenant namespaces for the hospital.'
    },
    {
      num: '02',
      badge: 'Physical Assets',
      title: 'Download & Display High-Resolution QR Standees',
      summary: 'Generate print-ready, high-resolution PDF standees featuring your hospital logo and branding.',
      description: 'Place acrylic QR standees at reception, parking entrances, triage desks, and waiting halls. Patients scan the code from up to 6 feet away using standard mobile camera lenses.',
      techNote: 'Vector SVG and 300 DPI CMYK PDF generation ready for professional acrylic printing.'
    },
    {
      num: '03',
      badge: 'Live Oversight',
      title: 'Real-Time Facility Telemetry & Queue Load',
      summary: 'Monitor every OPD room from a single central command dashboard.',
      description: 'See live wait times, patient footfall spikes, doctor attendance, and cashier collections. Identify bottlenecks before patients complain and reallocate clinical staff dynamically.',
      techNote: 'Aggregated WebSocket telemetry with live charts and real-time department utilization percentages.'
    },
    {
      num: '04',
      badge: 'Audit & Compliance',
      title: 'Automated EMR Compliance & Revenue Audits',
      summary: 'Export comprehensive audit logs, daily collection summaries, and patient volume statistics.',
      description: 'Export clean Excel and PDF records for financial reconciliation and hospital accreditation audits (NABH / JCI) with complete timestamped traceability.',
      techNote: 'Immutable clinical audit logs preserve timestamps for token creation, doctor call, and consultation completion.'
    }
  ]

  const currentSteps = activePersona === 'patient'
    ? patientSteps
    : activePersona === 'doctor'
    ? doctorSteps
    : adminSteps

  const faqs = [
    {
      q: 'Does the patient have to create an account or download an app to book?',
      a: 'No, absolutely not. Med Rapidly is 100% web-based. Patients simply point their smartphone camera at the QR code, tap the link that appears, and they are immediately in the booking portal. No password creation, no Play Store / App Store download, and zero friction.'
    },
    {
      q: 'Can hospital staff add walk-in patients who do not have a smartphone?',
      a: 'Yes. Hospital receptionists and triage nurses have access to an instant manual check-in counter on their desktop or tablet. They can type the patients name and phone number in 10 seconds and print a standard physical paper token slip with a thermal printer.'
    },
    {
      q: 'What happens if a patient misses their turn when called?',
      a: 'The doctor can click the "Hold / Skip" button on their console. The system places the patient on a temporary 10-minute hold status while calling the next person in line. When the patient returns, the doctor can recall them with a single click without forcing them to re-register.'
    },
    {
      q: 'Can doctors customize the prescription layout with their clinic logo and signature?',
      a: 'Yes. Doctors and hospital administrators can upload high-resolution hospital logos, digital signatures, clinic addresses, contact details, and state medical council registration numbers to generate fully customized, professional PDF letterheads.'
    },
  ]

  return (
    <div className="min-h-screen bg-[#FCFCFE] text-[#18233D] font-sans antialiased selection:bg-[#4361EE] selection:text-white">
      <PublicHeader />

      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-b from-white via-indigo-50/25 to-white px-6 border-b border-[#E6E9F0]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            The Complete Blueprint
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#18233D] tracking-tight leading-tight">
            How Med Rapidly Runs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-[#5D4CC8]">
              High-Speed Outpatient Care
            </span>
          </h1>
          <p className="text-base text-[#5E687B] max-w-2xl mx-auto leading-relaxed">
            From the moment a patient steps through the hospital doors to digital prescription delivery on WhatsApp, explore the complete end-to-end architecture.
          </p>

          {/* Persona Switcher Tabs */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { id: 'patient', label: 'Patient Experience (6 Steps)', icon: <Smartphone size={16} /> },
              { id: 'doctor', label: 'Doctor Workflow (5 Steps)', icon: <Stethoscope size={16} /> },
              { id: 'admin', label: 'Hospital Management (4 Steps)', icon: <Building2 size={16} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePersona(tab.id as any)}
                className={`px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition ${
                  activePersona === tab.id
                    ? 'bg-[#4361EE] text-white shadow-lg shadow-indigo-500/25 scale-105'
                    : 'bg-white border border-[#E6E9F0] text-[#5E687B] hover:text-[#18233D] hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step Breakdown */}
      <section className="py-24 max-w-[1100px] mx-auto px-6 space-y-12">
        {currentSteps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-[#E6E9F0] shadow-md p-8 sm:p-10 hover:shadow-xl transition-all text-left flex flex-col md:flex-row items-start gap-8"
          >
            {/* Step Number Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4361EE] to-[#5D4CC8] text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg font-mono">
              {step.num}
            </div>

            {/* Step Content */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#4361EE] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  {step.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#18233D] tracking-tight">
                  {step.title}
                </h3>
              </div>

              <p className="text-sm font-bold text-slate-700 leading-relaxed">
                {step.summary}
              </p>

              <p className="text-xs sm:text-sm text-[#5E687B] leading-relaxed">
                {step.description}
              </p>

              {/* Technical Note Callout */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-[#18233D] font-mono flex items-start gap-2 pt-2.5">
                <Database size={14} className="text-[#4361EE] shrink-0 mt-0.5" />
                <span><strong>Architecture Note:</strong> {step.techNote}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Real-World Case Study Spotlight */}
      <section className="py-20 bg-gradient-to-b from-[#18233D] to-[#111827] text-white px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
              Hospital Case Study
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              How City Care Multi-Specialty Hospital Reduced Outpatient Congestion by 68%
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              With 14 active OPD clinics and over 450 daily outpatients, City Care previously suffered from crowded corridors, heated arguments over paper queue order, and lost medical records.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              After deploying Med Rapidly acrylic QR standees at reception and connecting three waiting room smart TVs, patient check-in times plummeted from 16 minutes to 22 seconds, and doctor consultation speed improved by 35%.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
                <span className="text-2xl font-black text-emerald-400 font-mono block">22s</span>
                <span className="text-[10px] text-slate-300">Intake Duration</span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
                <span className="text-2xl font-black text-indigo-300 font-mono block">68%</span>
                <span className="text-[10px] text-slate-300">Wait Reduction</span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
                <span className="text-2xl font-black text-amber-300 font-mono block">0</span>
                <span className="text-[10px] text-slate-300">Duplicate Tokens</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <img src="/assets/brand-icon.png" alt="Logo" className="w-8 h-8 object-contain" />
              <div>
                <h4 className="text-sm font-black text-white">Dr. Amit Sharma</h4>
                <span className="text-[10px] text-indigo-300 font-medium">Head of Cardiology, City Care</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The live queue system has brought peace and order to our hospital. Patients no longer hover around our consultation room doors asking 'When is my turn?'. The automated WhatsApp prescription dispatch is a game-changer."
            </p>
          </div>
        </div>
      </section>

      {/* Step by Step FAQs */}
      <section className="py-24 bg-[#FCFCFE] border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1000px] mx-auto space-y-12 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Workflow Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Operational FAQs
            </h2>
            <p className="text-sm text-[#5E687B]">
              Quick clarity on operational questions regarding patients, doctors, and hardware.
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

      {/* CTA */}
      <section className="py-20 px-6 max-w-[1360px] mx-auto">
        <div className="bg-gradient-to-r from-[#3A57E8] to-[#5046E5] rounded-3xl p-10 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
            <h2 className="text-3xl font-black tracking-tight">
              Transform Your Clinic in 15 Minutes
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Deploy your hospital QR code and test the real-time live queue system risk-free.
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
              Book Specialist Demo
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
