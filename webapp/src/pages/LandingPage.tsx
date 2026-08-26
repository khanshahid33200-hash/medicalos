import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ArrowRight,
  CheckCircle,
  FileText,
  Users,
  Building2,
  Lock as LockIcon,
  Award,
  Calendar,
  FlaskConical,
  BarChart2,
  Star,
  MessageSquare
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'

export default function LandingPage() {
  const [phoneInput, setPhoneInput] = useState('')
  const [heroSuccess, setHeroSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'engagement' | 'ehealth' | 'appointments' | 'medicines' | 'reports'>('engagement')

  // Lead Form State (Bottom Form)
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    speciality: '',
    city: ''
  })
  const [leadFormSubmitted, setLeadFormSubmitted] = useState(false)

  const handleHeroEnroll = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneInput) return

    try {
      const existing = JSON.parse(localStorage.getItem('clinicos_leads') || '[]')
      existing.push({ phone: phoneInput, timestamp: new Date().toISOString() })
      localStorage.setItem('clinicos_leads', JSON.stringify(existing))
    } catch (e) {
      // ignore
    }

    setHeroSuccess(true)
  }

  const handleLeadFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadForm.phone || !leadForm.name) return

    try {
      const existing = JSON.parse(localStorage.getItem('clinicos_leads') || '[]')
      existing.push({ ...leadForm, timestamp: new Date().toISOString() })
      localStorage.setItem('clinicos_leads', JSON.stringify(existing))
    } catch (e) {
      // ignore
    }

    setLeadFormSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <PublicHeader />

      {/* 2. Hero Section */}
      <section id="product" className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 bg-gradient-to-b from-blue-50/40 via-white to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text & Lead Form */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-recoleta">
                Your one stop <br />
                <span className="text-blue-600">digital Clinic OS.</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium max-w-md">
                Transform your clinic & hospital reception with our user-friendly EMR interface to provide better patient care.
              </p>

              {/* Mobile Lead Box (+91 Enter your Phone Number Enroll Now) */}
              <div id="enroll" className="pt-2 max-w-md">
                {heroSuccess ? (
                  <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-emerald-900 space-y-2">
                    <p className="font-extrabold text-sm flex items-center gap-1.5">
                      <CheckCircle className="text-emerald-600" size={18} /> Request Submitted Successfully!
                    </p>
                    <p className="text-xs text-emerald-700">
                      Our Clinic OS digitalization team will contact you at <strong>+91-{phoneInput}</strong>.
                    </p>
                    <Link to="/doctor" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow">
                      Log in to Doctor Workspace (/doctor) →
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleHeroEnroll} className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-2">
                    <div className="px-3 py-2 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl border border-slate-200">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="Enter your Phone Number"
                      maxLength={10}
                      required
                      className="flex-1 py-2 px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex-shrink-0"
                    >
                      Enroll Now
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Hero Doctor Photo */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg">
                <div className="absolute -inset-4 bg-blue-100/60 rounded-full blur-2xl -z-10" />
                <div className="rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-white">
                  <img
                    src="/assets/docon_doctor.jpg"
                    alt="Clinic OS Doctor Consultation"
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5 Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mt-20 pt-10 border-t border-slate-100 text-center">
            <div className="space-y-1">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                <Users size={20} />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">4,500+</p>
              <p className="text-xs font-semibold text-slate-500">Active Doctors</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                <Building2 size={20} />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">12M+</p>
              <p className="text-xs font-semibold text-slate-500">Happy Patients</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                <FileText size={20} />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">25M+</p>
              <p className="text-xs font-semibold text-slate-500">Digital Prescriptions</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                <Building2 size={20} />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">100+</p>
              <p className="text-xs font-semibold text-slate-500">Cities Served</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                <Award size={20} />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">20+</p>
              <p className="text-xs font-semibold text-slate-500">Specialities</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <ChevronDown size={28} className="text-blue-500 animate-bounce mx-auto" />
          </div>
        </div>
      </section>

      {/* 3. Section: Manage your medical records, easily */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-recoleta">
              Manage your <span className="text-blue-600">medical records,</span> easily
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 hover:shadow-xl transition space-y-4 text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto font-bold shadow-lg shadow-blue-500/20">
                📋
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">No more paperwork</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                With a tap of a button, you can go through your patient's records.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 hover:shadow-xl transition space-y-4 text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto font-bold shadow-lg shadow-blue-500/20">
                📝
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Stay organised</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Maintain a timeline of your patients' health history at ease.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 hover:shadow-xl transition space-y-4 text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto font-bold shadow-lg shadow-blue-500/20">
                📱
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Access notes</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Share data with your patients on your terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Simplified clinic management (5 Interactive Tabs) */}
      <section className="py-20 bg-slate-50/80 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-recoleta">
              Simplified <span className="text-blue-600">clinic management</span>
            </h2>
          </div>

          {/* 5 Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'engagement', label: 'Patient Engagement', icon: Users },
              { id: 'ehealth', label: 'E-health Information', icon: FileText },
              { id: 'appointments', label: 'Telehealth & Appointment', icon: Calendar },
              { id: 'medicines', label: 'Medicines & Lab Tests', icon: FlaskConical },
              { id: 'reports', label: 'Reports & Analytics', icon: BarChart2 },
            ].map((tab) => {
              const TabIcon = tab.icon
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <TabIcon size={16} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Dynamic Tab Content Showcase */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl max-w-4xl mx-auto">
            {activeTab === 'engagement' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <h3 className="text-2xl font-extrabold text-slate-900">Patient Engagement</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Increase patient retention by effectively using various tools that improve patient experience and outcomes. Continue to take care of them, even after consultation!
                  </p>
                  <Link to="/checkin" className="inline-flex items-center gap-1.5 font-bold text-xs text-blue-600 hover:text-blue-700">
                    <span>Explore the new Clinic OS feature</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">😊</div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Patient Feedback & QR Token</p>
                      <p className="text-[11px] text-slate-500">Automated WhatsApp & QR Receipt Sync</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ehealth' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <h3 className="text-2xl font-extrabold text-slate-900">Electronic Health Records (EMR)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Our technology enables doctors to maintain patient records more efficiently and effectively, encouraging them to deliver better patient care.
                  </p>
                  <Link to="/doctor" className="inline-flex items-center gap-1.5 font-bold text-xs text-blue-600 hover:text-blue-700">
                    <span>Explore the new Clinic OS feature</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <p className="font-bold text-slate-900 text-xs">Digital Rx & Timeline History</p>
                  <p className="text-[11px] text-slate-500">100% paperless medical record storage.</p>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <h3 className="text-2xl font-extrabold text-slate-900">Telehealth & Appointment Queue</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    With planned appointments, you can easily manage your queue and consult patients remotely from anywhere and on any device.
                  </p>
                  <Link to="/doctor" className="inline-flex items-center gap-1.5 font-bold text-xs text-blue-600 hover:text-blue-700">
                    <span>Explore the new Clinic OS feature</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <p className="font-bold text-slate-900 text-xs">Live Audio Announcement System</p>
                  <p className="text-[11px] text-slate-500">Call tokens with one click on screen.</p>
                </div>
              </div>
            )}

            {activeTab === 'medicines' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <h3 className="text-2xl font-extrabold text-slate-900">Home Service of Medicines & Lab Tests</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Our partners enable doctors to provide additional services like e-pharmacy and e-diagnostic services at discounted prices.
                  </p>
                  <Link to="/doctor" className="inline-flex items-center gap-1.5 font-bold text-xs text-blue-600 hover:text-blue-700">
                    <span>Explore the new Clinic OS feature</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <p className="font-bold text-slate-900 text-xs">E-Pharmacy & Lab Partnerships</p>
                  <p className="text-[11px] text-slate-500">Integrated lab test orders & medicines.</p>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <h3 className="text-2xl font-extrabold text-slate-900">Reports & Analytics</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Our advanced tools can help you understand your practice better and generate actionable clinical insights.
                  </p>
                  <Link to="/doctor" className="inline-flex items-center gap-1.5 font-bold text-xs text-blue-600 hover:text-blue-700">
                    <span>Explore the new Clinic OS feature</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <p className="font-bold text-slate-900 text-xs">Doctor Practice Analytics</p>
                  <p className="text-[11px] text-slate-500">Track daily consultations & patient flow.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Section: Your data is in safe hands (Security & Compliance) */}
      <section id="security" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-recoleta">
              Your data is in <span className="text-blue-600">safe hands</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Health should never come at the expense of privacy. With Clinic OS, you decide what you want to share. We use the latest encryption technologies and comply with the NDHM Act 2018.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl flex-shrink-0">
                <Award size={24} />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-extrabold text-slate-900 text-base">ABDM compliant</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clinic OS is ABDM milestone-3 compliant. Authorised healthcare workers can view patient's medical history with the consent of the patient.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl flex-shrink-0">
                <LockIcon size={24} />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-extrabold text-slate-900 text-base">End-to-end Encryption</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multiple backups are done with 128-bit advanced encryption standards (AES) to protect your sensitive data.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl flex-shrink-0">
                <FileText size={24} />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-extrabold text-slate-900 text-base">Adherence to Guidelines</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clinic OS complies with the guidelines for tele-consultation, issued by Niti Aayog in 2020.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl flex-shrink-0">
                <MessageSquare size={24} />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-extrabold text-slate-900 text-base">If In Doubt, Reach Out</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Have any queries? Our team will be more than happy to answer! Reach out to us at <strong>info@shahidkhan.site</strong> or <strong>080 6823 6823</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section: Working with Clinic OS is simple (3 Steps) */}
      <section id="how-it-works" className="py-20 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-12">
          <div className="space-y-2">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Start Your Journey</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-recoleta">
              Working with <span className="text-blue-600">Clinic OS is simple</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-3 text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto font-black text-xl shadow-lg shadow-blue-500/30">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Add Patients</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter patient details using the reception module, QR kiosk, or directly from the EMR.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-3 text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto font-black text-xl shadow-lg shadow-blue-500/30">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Generate Prescription</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consult your patient and generate the prescription within a few seconds.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-3 text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto font-black text-xl shadow-lg shadow-blue-500/30">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Share Rx</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients can view the prescription or e-Rx on the Clinic OS patient app or on the web portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section: Why use Clinic OS & Doctor Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-4 text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight font-recoleta">
                Why use <br /><span className="text-blue-600">Clinic OS?</span>
              </h2>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <p className="text-4xl font-black text-blue-600">1M+</p>
                <p className="text-xs font-semibold text-slate-600 mt-2">Monthly Rx generated by doctors using Clinic OS</p>
              </div>
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <p className="text-4xl font-black text-blue-600">1.5x</p>
                <p className="text-xs font-semibold text-slate-600 mt-2">Increase in doctor's efficiency using Clinic OS</p>
              </div>
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <p className="text-4xl font-black text-blue-600">2x</p>
                <p className="text-xs font-semibold text-slate-600 mt-2">Follow ups increased after using Clinic OS</p>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200 max-w-4xl mx-auto text-left space-y-4">
            <div className="flex gap-1 text-amber-400">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
            </div>
            <p className="text-lg font-medium text-slate-800 italic leading-relaxed">
              "Fabulous initiative! I started using Clinic OS after struggling with other desktop based software for my clinic. Now with Clinic OS I conduct my OPD faster than when I was writing or typing. Clinic OS is improving itself faster with new features that are being added."
            </p>
            <p className="font-extrabold text-slate-900 text-sm">
              Dr. Sushila Kataria | <span className="text-blue-600 font-semibold">Internal Medicine, Gurgaon</span>
            </p>
          </div>
        </div>
      </section>

      {/* 8. Lead Enrollment Form */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-recoleta">
              Achieve your <span className="text-blue-600">best performance</span> with us
            </h2>
            <p className="text-xs text-slate-600 max-w-xl mx-auto font-medium">
              Let us know a little about yourself, and we'll reach out to schedule an inside look at how we can partner together to drive your success.
            </p>
          </div>

          {leadFormSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-300 p-8 rounded-3xl text-emerald-900 space-y-3 max-w-xl mx-auto">
              <CheckCircle size={48} className="text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold">Thank You for Reaching Out!</h3>
              <p className="text-xs text-emerald-700">
                We have received your details. Our clinic consultant will call you at <strong>+91-{leadForm.phone}</strong>.
              </p>
              <Link to="/doctor" className="inline-block mt-3 px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow">
                Log in to Doctor Portal (/doctor)
              </Link>
            </div>
          ) : (
            <form onSubmit={handleLeadFormSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Dr. Full Name"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter your Phone Number</label>
                  <input
                    type="tel"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="9876543210"
                    maxLength={10}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter your Speciality</label>
                  <input
                    type="text"
                    value={leadForm.speciality}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, speciality: e.target.value }))}
                    placeholder="e.g. Cardiology, Pediatrics"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter your City</label>
                  <input
                    type="text"
                    value={leadForm.city}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g. Mumbai, Delhi, Kolkata"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                By submitting your information, you agree to our <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Use</a>.
              </p>

              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
              >
                Submit Request
              </button>
            </form>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
