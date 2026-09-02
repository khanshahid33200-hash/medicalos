import { useState } from 'react'
import {
  Phone, Mail, MapPin, CheckCircle2, Send,
  Clock, ShieldCheck, Building2, Stethoscope,
  Activity, ArrowRight, MessageSquare, ChevronDown, Check
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import { useSEO } from '../hooks/useSEO'

export default function ContactPage() {
  useSEO({
    title: 'Contact Hospital Deployment Team & 24/7 Clinical Support — Med Rapidly',
    description: 'Connect with MedTech Fixaters healthcare specialists for hospital QR deployment, live queue demonstrations, custom HIS integrations, or emergency support.',
  })

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    hospital: '',
    city: '',
    bedCount: '50-100 Beds',
    numDoctors: '5-10 Doctors',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm({
        name: '',
        email: '',
        phone: '',
        hospital: '',
        city: '',
        bedCount: '50-100 Beds',
        numDoctors: '5-10 Doctors',
        message: ''
      })
    }, 3500)
  }

  const officeLocations = [
    {
      city: 'Mumbai Headquarters',
      role: 'Corporate Headquarters & Core Engineering Hub',
      address: 'MedTech Fixaters Healthcare Systems, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051',
      phone: '+91 98765 43210',
      email: 'mumbai@medtechfixaters.com'
    },
    {
      city: 'Delhi NCR Regional Center',
      role: 'North India Hospital Deployment & Field Pilots',
      address: 'Connaught Place & Cyber City Healthcare Corridors, New Delhi 110001',
      phone: '+91 98765 43211',
      email: 'delhi@medtechfixaters.com'
    },
    {
      city: 'Bengaluru Clinical Tech Hub',
      role: 'Cloud Telemetry & Real-Time Engineering Lab',
      address: 'Koramangala 4th Block, Bengaluru, Karnataka 560034',
      phone: '+91 98765 43212',
      email: 'bengaluru@medtechfixaters.com'
    },
    {
      city: 'Pune Medical Operations Hub',
      role: 'Clinical Onboarding & Doctor Training Academy',
      address: 'Shivajinagar Healthcare District, Pune, Maharashtra 411005',
      phone: '+91 98765 43213',
      email: 'pune@medtechfixaters.com'
    }
  ]

  const contactFaqs = [
    {
      q: 'How fast will someone contact us after submitting the inquiry?',
      a: 'A dedicated clinical deployment engineer will call and email you within 2 business hours. For emergency live OPD hospital support, our telephone hotline operates 24 hours a day, 7 days a week.'
    },
    {
      q: 'Can you provide an in-person demonstration at our hospital facility?',
      a: 'Yes! We regularly conduct on-site clinical demonstrations for hospital superintendents, heads of departments, and administrative boards in Mumbai, Delhi NCR, Pune, Bengaluru, and surrounding medical hubs.'
    },
    {
      q: 'Can we pilot the system in a single department before rolling it out facility-wide?',
      a: 'Yes, this is very common. Many hospitals begin by piloting Med Rapidly in their busiest morning department (such as Pediatrics or Cardiology). Once doctors and receptionists experience the calm waiting room, it is effortlessly expanded to other OPD wings.'
    },
    {
      q: 'Do you ship physical acrylic QR standees and TV display boxes to our hospital?',
      a: 'Yes. Upon activating your hospital trial, we can ship a complimentary starter pack of durable, UV-printed acrylic QR standees customized with your hospital logo and branding directly to your facility.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#FCFCFE] text-[#18233D] font-sans antialiased selection:bg-[#4361EE] selection:text-white">
      <PublicHeader />

      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-b from-white via-indigo-50/25 to-white px-6 border-b border-[#E6E9F0]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            Dedicated Clinical Support
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#18233D] tracking-tight leading-tight">
            Connect With Our Hospital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-[#5D4CC8]">
              Deployment Specialists
            </span>
          </h1>
          <p className="text-base text-[#5E687B] max-w-2xl mx-auto leading-relaxed">
            Whether you want to launch a 15-minute hospital pilot, integrate with custom HIS software, or request on-site clinical training, we are here to support you.
          </p>

          {/* Real-Time Telemetry Status Bar */}
          <div className="pt-6 max-w-xl mx-auto p-3 bg-white rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-2 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              All OPD Telemetry Nodes Operational
            </span>
            <span className="text-slate-400 font-mono text-[11px]">99.98% System Uptime</span>
          </div>
        </div>
      </section>

      {/* Main Form & Contact Channels */}
      <section className="py-24 max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* Left Column: Direct Helplines */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#4361EE] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Direct Touchpoints
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#18233D] tracking-tight mt-1">
                Reach Us Directly
              </h2>
              <p className="text-xs text-[#5E687B] mt-1 leading-relaxed">
                Connect directly with our specialized teams depending on your hospital requirements.
              </p>
            </div>

            <div className="space-y-3.5 text-xs font-bold text-[#18233D]">
              <div className="p-4 bg-white rounded-2xl border border-[#E6E9F0] shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#4361EE] font-black uppercase text-[10px] tracking-wider">Hospital Deployment & Sales</span>
                  <span className="text-slate-400 text-[10px] font-normal">Mon - Sat (8am - 9pm)</span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-sm font-mono font-bold">
                  <Phone size={15} className="text-[#4361EE]" />
                  <span>+91 98765 43210</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Inquiries for new hospital onboarding, custom acrylic standees, and software demonstrations.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E6E9F0] shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-rose-600 font-black uppercase text-[10px] tracking-wider">24/7 Clinical Emergency Support</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[9px]">Live 24 Hours</span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-sm font-mono font-bold text-rose-600">
                  <Phone size={15} className="text-rose-600" />
                  <span>+91 98765 43299</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Dedicated hotline for active hospital OPDs experiencing technical or queue stream disruptions.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E6E9F0] shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-purple-600 font-black uppercase text-[10px] tracking-wider">Enterprise & HIS Integrations</span>
                  <span className="text-slate-400 text-[10px] font-normal">Enterprise Team</span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-sm font-mono font-bold">
                  <Mail size={15} className="text-purple-600" />
                  <span>enterprise@medtechfixaters.com</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Custom HL7 / FHIR integrations, on-premise cloud instances, and hospital chain architecture.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E6E9F0] shadow-2xl">
            {submitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 size={44} className="text-emerald-600 mx-auto" />
                <h3 className="text-xl font-black text-emerald-900">Hospital Request Submitted!</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                  Thank you. A senior clinical deployment specialist has received your inquiry and will contact you via phone and email within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-black text-[#18233D]">Request Hospital Deployment Consultation</h3>
                  <p className="text-slate-500 text-[11px]">Tell us about your outpatient setup to tailor your onboarding plan.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#18233D] block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Dr. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#18233D] block mb-1">Mobile Phone (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#18233D] block mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="doctor@hospital.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#18233D] block mb-1">Hospital / Clinic Name *</label>
                    <input
                      type="text"
                      required
                      value={form.hospital}
                      onChange={e => setForm({ ...form, hospital: e.target.value })}
                      placeholder="City Care Multi-Specialty Hospital"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-[#18233D] block mb-1">City / Region *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Mumbai"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#18233D] block mb-1">Bed Capacity</label>
                    <select
                      value={form.bedCount}
                      onChange={e => setForm({ ...form, bedCount: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                    >
                      <option>Under 25 Beds (Clinic)</option>
                      <option>25 - 50 Beds</option>
                      <option>50 - 100 Beds</option>
                      <option>100 - 300 Beds</option>
                      <option>300+ Beds (Tertiary)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#18233D] block mb-1">Active OPD Doctors</label>
                    <select
                      value={form.numDoctors}
                      onChange={e => setForm({ ...form, numDoctors: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                    >
                      <option>1 - 2 Doctors</option>
                      <option>3 - 5 Doctors</option>
                      <option>5 - 10 Doctors</option>
                      <option>10 - 25 Doctors</option>
                      <option>25+ Doctors</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#18233D] block mb-1">Specific Requirements or Questions</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your current OPD volume, existing software, or timeline for deployment..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#4361EE] to-[#5D4CC8] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-0.5"
                >
                  Submit Hospital Onboarding Request →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Regional Support Hubs */}
      <section className="py-24 bg-white border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1240px] mx-auto space-y-14 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Regional Presence
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Hospital Operations & Training Centers
            </h2>
            <p className="text-sm text-[#5E687B]">
              Our deployment specialists are stationed in key medical corridors across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {officeLocations.map((loc, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#FCFCFE] border border-[#E6E9F0] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#4361EE]" />
                  <h3 className="text-lg font-black text-[#18233D]">{loc.city}</h3>
                </div>
                <span className="text-xs font-bold text-[#4361EE] block">{loc.role}</span>
                <p className="text-xs text-[#5E687B] leading-relaxed">{loc.address}</p>
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-mono font-bold text-[#18233D]">
                  <span>Phone: {loc.phone}</span>
                  <span>Email: {loc.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-[#FCFCFE] border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1000px] mx-auto space-y-12 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Inquiry FAQs
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Frequently Asked Support Questions
            </h2>
          </div>

          <div className="space-y-3 text-left">
            {contactFaqs.map((faq, i) => (
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

      <PublicFooter />
    </div>
  )
}
