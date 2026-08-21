import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  FileText,
  Lock,
  Menu,
  X,
  Check,
  Phone,
  ShieldCheck,
  Stethoscope,
  Building2,
  Award,
  Star
} from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileNumber, setMobileNumber] = useState('')
  const [clinicName, setClinicName] = useState('')
  const [leadSuccess, setLeadSuccess] = useState(false)

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobileNumber) return

    // Save lead to local storage / state
    try {
      const existingLeads = JSON.parse(localStorage.getItem('clinic_os_enrollment_leads') || '[]')
      existingLeads.push({
        mobile: mobileNumber,
        clinic: clinicName || 'General Clinic/Doctor',
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('clinic_os_enrollment_leads', JSON.stringify(existingLeads))
    } catch (err) {
      // ignore
    }

    setLeadSuccess(true)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. Top Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">Make Your Clinic Digitalized</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400">India's Leading EMR & Smart Clinic Reception Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-white transition">
              <Phone size={12} className="text-cyan-400" />
              <span>Talk to Specialist: <strong>+91 98765 43210</strong></span>
            </a>
            <Link
              to="/doctor"
              className="text-cyan-300 hover:text-white font-bold flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs rounded-lg border border-cyan-500/30 transition"
              title="Doctor & Hospital Staff Login"
            >
              <Lock size={12} />
              <span>Doctor Login (/doctor)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Header Navigation (DocOn Inspired) */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 rounded-xl text-white flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition">
              CO
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1">
                Clinic<span className="text-cyan-400">OS</span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Digital Clinic & EMR Platform
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#hero" className="hover:text-cyan-400 transition">Digitalize Clinic</a>
            <a href="#features" className="hover:text-cyan-400 transition">EMR & Rx Features</a>
            <a href="#reception" className="hover:text-cyan-400 transition">QR Reception Kiosk</a>
            <a href="#testimonials" className="hover:text-cyan-400 transition">Doctor Reviews</a>
            <a href="#pricing" className="hover:text-cyan-400 transition">Pricing</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/doctor"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <Lock size={14} className="text-cyan-400" />
              <span>Doctor Sign In</span>
            </Link>
            <a
              href="#enroll"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition flex items-center gap-2"
            >
              <span>Enroll Clinic Free</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-xl"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-300">Features</a>
            <a href="#reception" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-300">QR Reception Kiosk</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-300">Pricing</a>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/doctor"
                className="w-full text-center py-3 bg-cyan-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Lock size={16} /> Doctor Login (/doctor)
              </Link>
              <Link
                to="/checkin"
                className="w-full text-center py-3 bg-slate-800 text-slate-200 font-bold rounded-xl"
              >
                Test Patient Check-in Kiosk
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. Hero Section with Doctor Enrollment Box (DocOn Style) */}
      <section id="hero" className="relative pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-500/10 text-cyan-400 text-xs font-extrabold uppercase tracking-widest rounded-full border border-cyan-500/30">
                <Sparkles size={14} /> #1 EMR & Digital Clinic Software
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Make Your Clinic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  Digitalized in Minutes.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium max-w-xl">
                India's simplest EMR & smart reception platform. Automate patient QR check-ins, manage live queue tokens, write Rx in 30 seconds, and eliminate waiting room chaos.
              </p>

              {/* Doctor / Hospital Lead Enrollment Card */}
              <div id="enroll" className="bg-slate-800/90 border-2 border-cyan-500/40 p-6 rounded-3xl shadow-2xl space-y-4 max-w-xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <Stethoscope className="text-cyan-400" size={20} /> Enroll Doctor / Clinic Today
                  </h3>
                  <span className="text-[11px] font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                    Free 14-Day Trial
                  </span>
                </div>

                {leadSuccess ? (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 text-center space-y-2">
                    <CheckCircle size={36} className="text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-white text-base">Enrollment Request Received!</h4>
                    <p className="text-xs text-slate-300">
                      Our clinic digitalization expert will call you shortly at <strong>+91-{mobileNumber}</strong>. You can also sign in directly below:
                    </p>
                    <Link
                      to="/doctor"
                      className="inline-block mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                    >
                      Go to Doctor Login Portal (/doctor) →
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleEnrollSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Doctor / Hospital Mobile No. *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">+91</span>
                          <input
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="9876543210"
                            required
                            maxLength={10}
                            className="w-full pl-12 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-cyan-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Clinic / Hospital Name
                        </label>
                        <input
                          type="text"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          placeholder="e.g. Metro Medicare Clinic"
                          className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-cyan-500/25 transition flex items-center justify-center gap-2"
                    >
                      <span>Digitalize My Clinic Now</span>
                      <ArrowRight size={18} />
                    </button>
                    <p className="text-[11px] text-slate-400 text-center">
                      🔒 No credit card required. Setup takes under 60 seconds.
                    </p>
                  </form>
                )}
              </div>

              {/* Stat Pillars */}
              <div className="pt-4 flex flex-wrap items-center gap-8 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-cyan-400" />
                  <span>4,000+ Doctors Enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span>100% HIPAA Compliant EMR</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-indigo-400" />
                  <span>50+ Cities in India</span>
                </div>
              </div>
            </div>

            {/* Right Product Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl shadow-cyan-900/30 group">
                <img
                  src="/assets/saas_dashboard.jpg"
                  alt="Clinic OS EMR Software Interface"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-white">Smart Reception Desk & EMR</p>
                    <p className="text-slate-400">Instant QR check-in & digital Rx</p>
                  </div>
                  <Link to="/doctor" className="px-3.5 py-1.5 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition">
                    Doctor Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Value Pillars (Why Doctors Love Clinic OS) */}
      <section id="features" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <p className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">Designed for Modern Doctors</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Powerful Features to Digitalize Your Practice
            </h2>
            <p className="text-slate-400 text-sm">
              Everything required to run a high-efficiency clinic: from reception QR tokens to digital prescriptions and clinical history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition space-y-4">
              <div className="w-14 h-14 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center font-bold">
                <QrCode size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">Contactless Reception QR Kiosk</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Place doctor QR code at reception. Patients scan on their phone, fill details in 15s, and receive token (e.g. Token 001). Zero waiting room arguments.
              </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition space-y-4">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center font-bold">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">Rx Writing in Under 30 Seconds</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Write vitals, symptoms, diagnosis, and custom medicine dosages (1-0-1). Print branded hospital prescription cards or save digitally.
              </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center font-bold">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">Live Patient Queue & Audio Call</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Real-time queue sync (under 2s). Click "Call Next Patient" to trigger automated audio announcements in the waiting room.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Doctor Reviews & Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">Doctor Feedback</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trusted by 4,000+ Doctors & Hospitals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Dr. Rajesh Sharma', spec: 'Cardiologist, Delhi', text: 'Clinic OS completely digitalized our reception desk. Patients scan the QR code and my queue updates instantly. Outstanding software!', rating: 5 },
              { name: 'Dr. Ananya Roy', spec: 'Pediatrician, Kolkata', text: 'Prescription writing takes under 30 seconds now. The digital Rx printout looks super professional with hospital branding.', rating: 5 },
              { name: 'Dr. Vikram Patel', spec: 'Orthopedic Surgeon, Mumbai', text: 'No hardware needed. Runs directly on my iPad and our reception desk laptop. Highly recommended for every clinic!', rating: 5 },
            ].map((rev, i) => (
              <div key={i} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">"{rev.text}"</p>
                <div>
                  <p className="font-extrabold text-white text-sm">{rev.name}</p>
                  <p className="text-[11px] text-cyan-400 font-medium">{rev.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="text-center space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">Affordable Clinic Plans</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Simple Plans for Every Doctor & Hospital
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Solo Doctor Clinic</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹1,999</span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-slate-400">Essential digital EMR & reception QR kiosk for single-doctor clinics.</p>
                <ul className="text-xs space-y-2.5 text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> 1 Doctor Account</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Doctor QR Standee</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Digital Prescription Writer</li>
                </ul>
              </div>
              <a href="#enroll" className="w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition">
                Digitalize Clinic
              </a>
            </div>

            <div className="bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-900 p-8 rounded-3xl border-2 border-cyan-500 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-cyan-900/40">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-md">
                POPULAR FOR HOSPITALS
              </div>
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Hospital Reception Pro</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹6,999</span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-cyan-200">Complete reception desk & queue management for multi-specialty hospitals.</p>
                <ul className="text-xs space-y-2.5 text-slate-200 pt-4 border-t border-cyan-500/30">
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Up to 20 Doctor Accounts</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Multi-Department Reception Kiosk</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Waiting Room Audio Announcer</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Platform Owner Admin Console</li>
                </ul>
              </div>
              <a href="#enroll" className="w-full text-center py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/30 transition">
                Digitalize Hospital Now
              </a>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enterprise Network</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">Custom</span>
                </div>
                <p className="text-xs text-slate-400">For multi-location hospital chains requiring custom HIS/EMR integrations.</p>
                <ul className="text-xs space-y-2.5 text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Unlimited Doctor Accounts</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Dedicated Database & Cloud</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Dedicated 24/7 Account Support</li>
                </ul>
              </div>
              <a href="mailto:info@shahidkhan.site" className="w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-slate-950 text-slate-500 py-16 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg text-white flex items-center justify-center font-bold text-sm">
                CO
              </div>
              <span className="text-lg font-bold text-white tracking-wide">Clinic OS</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              India's leading EMR and smart clinic reception software for doctors, polyclinics, and multispecialty hospitals.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Product Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#features" className="hover:text-white transition">Digital Reception Kiosk</a></li>
              <li><a href="#features" className="hover:text-white transition">Rx Writing Workspace</a></li>
              <li><a href="#features" className="hover:text-white transition">Waiting Room Queue Board</a></li>
              <li><Link to="/mrshahidbabu" className="hover:text-white transition">Owner Control Panel (/mrshahidbabu)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Doctor & Hospital Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/doctor" className="hover:text-cyan-400 font-bold transition">Doctor Login (/doctor)</Link></li>
              <li><Link to="/checkin" className="hover:text-white transition">Patient Check-in Demo</Link></li>
              <li><a href="#enroll" className="hover:text-white transition">Enroll Clinic Mobile No.</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Doctor Support</h4>
            <p className="text-slate-300">✉️ Email: info@shahidkhan.site</p>
            <p className="text-slate-300 mt-1">📞 Doctor Helpline: +91 98765 43210</p>
            <p className="text-slate-400 mt-3 text-[11px]">Empowering Doctors. Digitalizing Clinics.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Clinic OS Software Platform. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link to="/doctor" className="text-cyan-400 hover:underline font-bold flex items-center gap-1">
              <Lock size={12} /> Doctor Sign In Portal (/doctor)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
