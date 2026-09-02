import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check, ShieldCheck, HelpCircle, ArrowRight,
  Calculator, Sparkles, Building2, Stethoscope,
  ChevronDown, Zap, Award, QrCode, Tv, Phone
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'
import { useSEO } from '../hooks/useSEO'

export default function PricingPage() {
  useSEO({
    title: 'Transparent Pricing & ROI Calculator — Med Rapidly by MedTech Fixaters',
    description: 'Simple, transparent pricing for hospitals and clinics. Calculate your clinic time and cost savings with our ROI tool. Start with a 14-day free trial.',
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Interactive ROI Calculator State
  const [numDoctors, setNumDoctors] = useState(4)
  const [dailyPatientsPerDoctor, setDailyPatientsPerDoctor] = useState(30)

  const totalMonthlyPatients = numDoctors * dailyPatientsPerDoctor * 26
  const hoursSavedPerMonth = Math.round((totalMonthlyPatients * 12) / 60)
  const costPerPatient = billingCycle === 'annual'
    ? (numDoctors <= 1 ? (1999 / totalMonthlyPatients).toFixed(2) : (4999 / totalMonthlyPatients).toFixed(2))
    : (numDoctors <= 1 ? (2499 / totalMonthlyPatients).toFixed(2) : (5999 / totalMonthlyPatients).toFixed(2))

  const plans = [
    {
      name: 'Starter Clinic',
      badge: 'Single Practitioner',
      tagline: 'Ideal for independent doctors, solo clinics, and specialty OPD practices.',
      monthlyPrice: '₹2,499',
      annualPrice: '₹1,999',
      period: '/ month billed annually',
      summary: 'Everything a solo physician needs to eliminate paper check-ins and run an automated queue.',
      features: [
        '1 Active Doctor Consultation Console',
        'Unlimited Patient QR Scans',
        'Real-Time Live Queue Smartphone Tracking',
        'Up to 800 Completed Consultations / month',
        '30-Second Prescription Pad with Auto-fill',
        'Automated WhatsApp Rx Delivery (PDF)',
        '1 Waiting Room TV Display Board URL',
        'Standard Email & Chat Support (9am - 8pm)'
      ],
      cta: 'Start 14-Day Free Trial',
      highlighted: false,
    },
    {
      name: 'Hospital Pro',
      badge: 'Most Popular for Hospitals',
      tagline: 'Built for multi-specialty hospitals, polyclinics, and nursing homes.',
      monthlyPrice: '₹5,999',
      annualPrice: '₹4,999',
      period: '/ month billed annually',
      summary: 'Complete multi-counter coordination, reception desk sync, and executive OPD analytics.',
      features: [
        'Up to 10 Simultaneous Active Doctor Consoles',
        'Multi-Department Triage (Cardiology, Ortho, Ped, etc.)',
        'Reception & Cashier Counter Multi-Logins',
        'Unlimited Monthly Patient Consultations',
        'Unlimited TV Queue Display Boards with Audio Chimes',
        'WhatsApp Automated Revisit Follow-up Reminders',
        'Custom Hospital Letterhead & Doctor Digital Signatures',
        'Full OPD Analytics & Doctor Turnaround Time Reports',
        'Thermal Token Slip Printing Support',
        'Priority Phone & WhatsApp Support (8am - 10pm)'
      ],
      cta: 'Start Hospital Pro Trial',
      highlighted: true,
    },
    {
      name: 'Healthcare Enterprise',
      badge: 'Chains & Medical Centers',
      tagline: 'For hospital networks, healthcare chains, and tertiary care institutions.',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      period: 'tailored deployment',
      summary: 'Dedicated cloud infrastructure, custom HIS integration, and 99.95% enterprise SLA.',
      features: [
        'Unlimited Doctors, OPD Rooms & Departments',
        'Multi-Branch Consolidated Hospital Dashboard',
        'Custom HIS / EMR / PACS Database Integrations',
        'Dedicated Private Cloud Sandbox & Custom Domain',
        'Ayushman Bharat Digital Mission (ABDM) Integration',
        'Role-Based Granular Access Permissions',
        'Guaranteed 99.95% Uptime SLA with Financial Backing',
        'Dedicated Technical Account Manager & 24/7 On-Call Support',
        'Custom Staff Training & On-Site Onboarding'
      ],
      cta: 'Contact Enterprise Sales',
      highlighted: false,
    }
  ]

  const featureMatrix = [
    {
      category: 'Patient Check-in & Intake',
      rows: [
        { name: 'Branded QR Standee Web Portal', starter: 'Included', pro: 'Included', enterprise: 'Included' },
        { name: 'Zero App Install Required', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { name: 'Returning Patient Phone Lookup', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { name: 'Manual Reception Counter Intake', starter: 'Yes', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Thermal Slip Printer Support', starter: '—', pro: 'Included', enterprise: 'Included' },
      ]
    },
    {
      category: 'Live Queue & Waiting Room Telemetry',
      rows: [
        { name: 'Live Position on Mobile Phone', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { name: 'TV Display Board Streams', starter: '1 Screen', pro: 'Unlimited Screens', enterprise: 'Unlimited Screens' },
        { name: 'Automated Room Voice Announcements', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { name: 'Estimated Turnaround Calculation', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { name: 'Doctor Hold / Skip / Recall', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
      ]
    },
    {
      category: 'Clinical EMR & Doctor Tools',
      rows: [
        { name: 'Simultaneous Doctor Consoles', starter: '1 Doctor', pro: 'Up to 10 Doctors', enterprise: 'Unlimited Doctors' },
        { name: '30-Second Prescription Pad', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { name: 'Medication Autocomplete Database', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { name: 'Pediatric Weight-Based Dosage Calculator', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { name: 'Pre-configured Clinical Bundles', starter: 'Standard', pro: 'Custom Bundles', enterprise: 'Custom Bundles' },
        { name: 'Digital Doctor Stamp & Signature', starter: 'Standard', pro: 'Custom High-Res', enterprise: 'Custom High-Res' },
      ]
    },
    {
      category: 'WhatsApp & Patient Communication',
      rows: [
        { name: 'Instant Signed PDF Prescription Delivery', starter: 'Included', pro: 'Included', enterprise: 'Included' },
        { name: 'Automated 48h Revisit Reminders', starter: '—', pro: 'Included', enterprise: 'Included' },
        { name: 'Pharmacy & Diagnostic Lab Sync', starter: '—', pro: 'Included', enterprise: 'Included' },
      ]
    },
    {
      category: 'Infrastructure, Security & Support',
      rows: [
        { name: 'PostgreSQL Row-Level Security (RLS)', starter: 'Yes', pro: 'Yes', enterprise: 'Yes' },
        { name: 'Multi-Tenant Data Sandbox', starter: 'Yes', pro: 'Yes', enterprise: 'Dedicated Private' },
        { name: 'Data Export (PDF / Excel)', starter: 'Monthly', pro: 'Instant Daily', enterprise: 'Real-time API' },
        { name: 'Custom Domain (e.g. opd.yourhospital.com)', starter: '—', pro: '—', enterprise: 'Included' },
        { name: 'Technical Support', starter: 'Email & Chat', pro: 'Priority Phone', enterprise: 'Dedicated Manager' },
      ]
    }
  ]

  const faqs = [
    {
      q: 'Is there any long-term contract or setup fee?',
      a: 'No. There are zero setup fees and zero hidden hardware lock-ins. You can subscribe month-to-month or choose annual billing to save 20%. You can cancel or upgrade your plan anytime from your dashboard.'
    },
    {
      q: 'How does the 14-day free trial work?',
      a: 'When you create an account, you receive instant, full access to the Hospital Pro plan for 14 days without entering a credit card. You can generate QR standees, connect doctor consoles, and run real queues. After 14 days, you can choose the plan that best fits your facility.'
    },
    {
      q: 'Do we have to buy expensive proprietary hardware or tablets?',
      a: 'No. Med Rapidly is engineered to run on hardware you already own. Any standard smartphone, tablet, laptop, or desktop computer can access the system. Any standard smart TV or HDMI monitor with a browser can act as a waiting room display board.'
    },
    {
      q: 'Are WhatsApp messages included in the subscription price?',
      a: 'Yes! Standard WhatsApp delivery for prescriptions, queue tracking links, and doctor call alerts are completely covered within your subscription package with no additional per-message charge up to your plan limits.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards, debit cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and direct corporate NEFT/RTGS bank transfers for hospital accounts.'
    },
    {
      q: 'Can we add more doctors to our plan later as our hospital expands?',
      a: 'Yes, absolutely. You can easily add additional doctor licenses to your Hospital Pro plan with a single click, or transition smoothly to the Healthcare Enterprise tier.'
    },
  ]

  return (
    <div className="min-h-screen bg-[#FCFCFE] text-[#18233D] font-sans antialiased selection:bg-[#4361EE] selection:text-white">
      <PublicHeader />

      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-b from-white via-indigo-50/25 to-white px-6 border-b border-[#E6E9F0]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            Simple, Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#18233D] tracking-tight leading-tight">
            Invest in Calm Waiting Rooms & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-[#5D4CC8]">
              High-Velocity Clinical Care
            </span>
          </h1>
          <p className="text-base text-[#5E687B] max-w-2xl mx-auto leading-relaxed">
            Transparent plans for single doctors and large multi-specialty hospitals. Zero setup fees. 14-day risk-free trial.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-6 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-[#18233D]' : 'text-slate-400'}`}>
              Monthly Billed
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-7 bg-[#4361EE] rounded-full p-1 transition-colors relative shadow-inner"
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                  billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-[#18233D]' : 'text-slate-400'}`}>
              Annual Billed <span className="text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 max-w-[1360px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`p-8 sm:p-10 rounded-3xl border text-left flex flex-col justify-between transition-all ${
                p.highlighted
                  ? 'bg-white border-2 border-[#4361EE] shadow-2xl shadow-indigo-500/15 relative transform md:-translate-y-2'
                  : 'bg-white border-[#E6E9F0] shadow-sm hover:shadow-xl'
              }`}
            >
              {p.highlighted && (
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#4361EE] to-[#5D4CC8] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                  {p.badge}
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-[#4361EE] uppercase tracking-wider block">{p.badge}</span>
                  <h3 className="text-2xl font-black text-[#18233D]">{p.name}</h3>
                  <p className="text-xs text-[#5E687B] mt-1.5 leading-relaxed">{p.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1.5 border-y border-slate-100 py-4">
                  <span className="text-4xl sm:text-5xl font-black text-[#18233D] font-mono">
                    {billingCycle === 'annual' ? p.annualPrice : p.monthlyPrice}
                  </span>
                  <span className="text-xs text-[#5E687B] font-semibold">{p.period}</span>
                </div>

                <p className="text-xs font-bold text-slate-700">{p.summary}</p>

                <ul className="space-y-3 text-xs text-[#18233D] font-bold pt-2">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} />
                      </div>
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition mt-8 shadow-sm ${
                  p.highlighted
                    ? 'bg-gradient-to-r from-[#4361EE] to-[#5D4CC8] text-white shadow-lg shadow-indigo-500/25 hover:opacity-95'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#18233D]'
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Clinic ROI Calculator */}
      <section className="py-20 bg-white border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1100px] mx-auto bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 p-8 sm:p-12 rounded-3xl border border-indigo-100 shadow-xl space-y-8 text-left">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Interactive ROI Calculator
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#18233D]">
              Calculate Your Facility's Monthly Time & Cost Savings
            </h2>
            <p className="text-xs sm:text-sm text-[#5E687B]">
              See how quickly Med Rapidly pays for itself by eliminating manual reception paper slips and reducing turnaround time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#18233D]">
                  <span>Number of Active Doctors in Hospital:</span>
                  <strong className="text-[#4361EE] text-base font-mono">{numDoctors} Doctors</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={numDoctors}
                  onChange={e => setNumDoctors(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4361EE]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#18233D]">
                  <span>Average Daily Patients Per Doctor:</span>
                  <strong className="text-emerald-700 text-base font-mono">{dailyPatientsPerDoctor} Patients</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={dailyPatientsPerDoctor}
                  onChange={e => setDailyPatientsPerDoctor(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>

            {/* Right Metrics Display */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold block">Monthly Patients</span>
                <span className="text-2xl sm:text-3xl font-black text-[#18233D] font-mono block">
                  {totalMonthlyPatients.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">Consultations managed</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-indigo-200 shadow-sm text-center space-y-1 bg-indigo-50/30">
                <span className="text-xs text-[#4361EE] font-bold block">Staff Hours Saved</span>
                <span className="text-2xl sm:text-3xl font-black text-[#4361EE] font-mono block">
                  {hoursSavedPerMonth} hrs
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">~{Math.round(hoursSavedPerMonth / 8)} workdays / mo</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold block">Software Cost</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono block">
                  ₹{costPerPatient}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">Per patient consultation</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold block">Patient Satisfaction</span>
                <span className="text-2xl sm:text-3xl font-black text-purple-600 font-mono block">
                  4.9 / 5
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">Average patient rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full 25+ Row Feature Matrix */}
      <section className="py-24 bg-[#FCFCFE] border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1200px] mx-auto space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Complete Feature Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Compare All Plan Capabilities Side by Side
            </h2>
            <p className="text-sm text-[#5E687B]">
              Every feature, specification, and limit detailed across all three tiers.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6E9F0] shadow-xl overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100/90 border-b border-[#E6E9F0] text-slate-700 font-black uppercase tracking-wider text-[10px]">
                    <th className="p-4 sm:p-5 w-2/5">Feature Category</th>
                    <th className="p-4 sm:p-5 text-center w-1/5">Starter Clinic</th>
                    <th className="p-4 sm:p-5 text-center w-1/5 text-[#4361EE] bg-indigo-50/60">Hospital Pro</th>
                    <th className="p-4 sm:p-5 text-center w-1/5">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featureMatrix.map((cat, cIdx) => (
                    <tbody key={cIdx}>
                      <tr className="bg-slate-50 border-y border-slate-200">
                        <td colSpan={4} className="p-3.5 font-black text-slate-800 uppercase tracking-widest text-[10px]">
                          {cat.category}
                        </td>
                      </tr>
                      {cat.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/80 transition border-b border-slate-100">
                          <td className="p-4 font-bold text-[#18233D]">{row.name}</td>
                          <td className="p-4 text-center font-semibold text-slate-600">{row.starter}</td>
                          <td className="p-4 text-center font-bold text-[#4361EE] bg-indigo-50/20">{row.pro}</td>
                          <td className="p-4 text-center font-semibold text-slate-800">{row.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="py-24 bg-white border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1000px] mx-auto space-y-12 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Frequently Asked Pricing Questions
            </h2>
            <p className="text-sm text-[#5E687B]">
              Straightforward answers about billing, hardware, and deployment.
            </p>
          </div>

          <div className="space-y-3 text-left">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#E6E9F0] rounded-2xl overflow-hidden bg-[#FCFCFE]">
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
              Start Your 14-Day Free Hospital Trial
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              No credit card required. Download your hospital QR standees and start live queues today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-[#3A57E8] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              Get Started Free →
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs rounded-xl transition"
            >
              Talk to Sales Specialist
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
