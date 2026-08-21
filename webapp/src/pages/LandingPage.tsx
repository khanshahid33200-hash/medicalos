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
  Check
} from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. SaaS Top Bar */}
      <div className="bg-slate-950 text-slate-400 text-xs py-2 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 font-bold rounded-full border border-blue-500/30 text-[11px]">
              NEW RELEASE v2.4
            </span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              Introducing Smart QR Reception Kiosk & Isolated Doctor Queue Management
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/doctor"
              className="text-slate-300 hover:text-white font-bold flex items-center gap-1.5 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg border border-blue-500/30 transition"
              title="Doctor & Hospital Staff Login"
            >
              <Lock size={12} />
              <span>Doctor Sign In (/doctor)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. SaaS Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition">
              CO
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1">
                Clinic<span className="text-blue-500">OS</span>
              </span>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                Smart Reception Platform
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition">Product Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#benefits" className="hover:text-white transition">Benefits</a>
            <a href="#pricing" className="hover:text-white transition">Pricing Plans</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          {/* SaaS Header Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/doctor"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <Lock size={15} className="text-blue-400" />
              <span>Doctor Login</span>
            </Link>

            <Link
              to="/checkin"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <span>Try Reception Demo</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-xl"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-300">Product Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-300">How It Works</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-300">Pricing</a>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/doctor"
                className="w-full text-center py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
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

      {/* 3. Hero Section (Product Pitch) */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          {/* Product Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 text-xs font-extrabold uppercase tracking-widest rounded-full border border-blue-500/20 shadow-inner">
            <Sparkles size={14} /> #1 Reception Queue OS for Hospitals & Clinics
          </div>

          {/* Main SaaS Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto text-white">
            The Smart Reception & Patient Queue OS for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Modern Hospitals & Doctors
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
            Eliminate reception desk chaos, reduce patient wait times by 70%, and automate QR check-ins, live token queues, and digital prescriptions. Zero hardware required.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/doctor"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base rounded-2xl shadow-2xl shadow-blue-600/40 transition flex items-center justify-center gap-2 group"
            >
              <Lock size={18} />
              <span>Doctor & Hospital Login (/doctor)</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/checkin"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-base rounded-2xl border border-slate-700 shadow-lg transition flex items-center justify-center gap-2"
            >
              <QrCode size={18} className="text-blue-400" />
              <span>Test Patient QR Kiosk</span>
            </Link>
          </div>

          {/* Value Highlights */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-xs font-semibold text-slate-400 border-t border-slate-800/80 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>Instant QR Check-in</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>Live Doctor Queue & Audio Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>Digital Prescription Workspace</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>Runs on iPad, Laptop & Phones</span>
            </div>
          </div>

          {/* Product UI Mockup */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl shadow-blue-900/30 group">
              <img
                src="/assets/saas_dashboard.jpg"
                alt="Clinic OS SaaS Software Dashboard"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-8 justify-between">
                <div>
                  <p className="text-lg font-bold text-white">Live Reception Desk & Doctor Dashboard</p>
                  <p className="text-xs text-slate-300">Seamless real-time sync across reception and consultation rooms.</p>
                </div>
                <Link to="/doctor" className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg">
                  Launch Doctor App
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Modules / Core Features */}
      <section id="features" className="py-24 bg-slate-950 relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Built for Reception Desks & Doctors</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Everything Your Hospital Needs to Automate Reception
            </h2>
            <p className="text-slate-400 text-base font-normal">
              Clinic OS replaces manual paper forms and noisy waiting rooms with intelligent digital QR check-in & token management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition space-y-4 group">
              <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition">
                <QrCode size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">1. QR Check-in Kiosk</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Patients scan a unique doctor or department QR code at the reception desk using their own smartphone. No apps required. They fill in details & get a live queue token.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-300 pt-2">
                <li className="flex items-center gap-2">✓ Auto-generates Token Number (Token 001)</li>
                <li className="flex items-center gap-2">✓ Collects symptoms, age, and phone number</li>
                <li className="flex items-center gap-2">✓ Pre-selects doctor automatically</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition space-y-4 group">
              <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">2. Live Queue & Audio Callout</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Receptionists & doctors see live waiting room queue boards updating in real time (under 2 seconds). Call next patient with one click and automated audio announcements.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-300 pt-2">
                <li className="flex items-center gap-2">✓ Instant multi-tab & cross-device sync</li>
                <li className="flex items-center gap-2">✓ Start consultation, skip, or recall patients</li>
                <li className="flex items-center gap-2">✓ Doctor-isolated queue privacy</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition space-y-4 group">
              <div className="w-14 h-14 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">3. Digital Rx & Prescription</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Doctors write patient vitals, diagnosis, chief complaints, examination notes, and dynamic prescribed medicines. Print or save digital prescription receipts instantly.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-300 pt-2">
                <li className="flex items-center gap-2">✓ Dynamic medicine dosage & frequency table</li>
                <li className="flex items-center gap-2">✓ Printable hospital prescription receipts</li>
                <li className="flex items-center gap-2">✓ Complete clinical history archive</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works at Reception */}
      <section id="how-it-works" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="text-center space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Simple 3-Step Setup</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              How Clinic OS Works at Reception
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-blue-600/30">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Display QR Code Standee</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Place the generated QR code standee at the hospital entrance or reception desk. Each doctor gets a unique QR code.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-indigo-600/30">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Patient Scans & Submits Form</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Patient scans with mobile camera, fills basic details in 15 seconds, and receives their live Queue Token on screen.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-emerald-600/30">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Doctor Calls Token & Consults</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Doctor sees patient details on their dashboard, calls the token, writes prescription, and completes consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Plans */}
      <section id="pricing" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="text-center space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Transparent Subscription Pricing</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Choose the Plan for Your Clinic or Hospital
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clinic Starter</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$29</span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Perfect for single-doctor private clinics wanting QR reception check-in.</p>
                <ul className="text-xs space-y-3 text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> 1 Doctor Profile</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Unique Doctor QR Code</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Live Token Queue</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Digital Prescription Writer</li>
                </ul>
              </div>
              <Link to="/doctor" className="w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition">
                Start Free Trial
              </Link>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="bg-gradient-to-b from-blue-900/60 to-slate-900 p-8 rounded-3xl border-2 border-blue-500 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-blue-900/40">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-md">
                MOST POPULAR FOR HOSPITALS
              </div>
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold text-blue-300 uppercase tracking-widest">Hospital Reception Pro</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$99</span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-blue-200 leading-relaxed">Ideal for multi-specialty hospitals with multiple doctors & reception desks.</p>
                <ul className="text-xs space-y-3 text-slate-200 pt-4 border-t border-blue-500/30">
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Up to 20 Doctor Profiles</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Multi-Department Reception Kiosk</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Audio Announcement System</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Super Admin Control Console</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Full Patient History & Analytics</li>
                </ul>
              </div>
              <Link to="/doctor" className="w-full text-center py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition">
                Get Started Now
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hospital Network</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">Custom</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">For large hospital chains & healthcare groups requiring custom SLA & integrations.</p>
                <ul className="text-xs space-y-3 text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Unlimited Doctors & Receptionists</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Dedicated Firebase & Database</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Custom EMR / HIS Integration</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> 24/7 Dedicated Account Manager</li>
                </ul>
              </div>
              <a href="mailto:info@shahidkhan.site" className="w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition">
                Contact Enterprise Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom SaaS CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-3xl font-black">Ready to Upgrade Your Hospital Reception?</h3>
            <p className="text-blue-200 text-sm font-medium">Log in to your doctor workspace or test the public reception kiosk demo.</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              to="/doctor"
              className="px-6 py-3.5 bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-sm rounded-xl shadow-xl transition flex items-center gap-2"
            >
              <Lock size={16} />
              <span>Doctor Login (/doctor)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. SaaS Footer */}
      <footer className="bg-slate-950 text-slate-500 py-16 text-xs border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg text-white flex items-center justify-center font-bold text-sm">
                CO
              </div>
              <span className="text-lg font-bold text-white tracking-wide">Clinic OS</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The premier SaaS Operating System for modern hospital reception desks, doctor queues, and digital prescriptions.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Product Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#features" className="hover:text-white transition">QR Reception Kiosk</a></li>
              <li><a href="#features" className="hover:text-white transition">Live Queue & Audio Announcer</a></li>
              <li><a href="#features" className="hover:text-white transition">Digital Prescription Workspace</a></li>
              <li><Link to="/mrshahidbabu" className="hover:text-white transition">Owner Control Panel (/mrshahidbabu)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Portals & Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/doctor" className="hover:text-blue-400 font-bold transition">Doctor & Staff Login (/doctor)</Link></li>
              <li><Link to="/checkin" className="hover:text-white transition">Patient QR Check-in Kiosk</Link></li>
              <li><Link to="/mrshahidbabu" className="hover:text-white transition">Super Admin Console</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Contact Sales</h4>
            <p className="text-slate-300">✉️ Email: info@shahidkhan.site</p>
            <p className="text-slate-300 mt-1">📞 Sales Hotline: +1 (555) 123-4567</p>
            <p className="text-slate-400 mt-3 text-[11px]">Designed & Engineered for Healthcare Facilities Worldwide.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Clinic OS Technologies Inc. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link to="/doctor" className="text-blue-400 hover:underline font-bold flex items-center gap-1">
              <Lock size={12} /> Doctor Sign In Portal (/doctor)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
