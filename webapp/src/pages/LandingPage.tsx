import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Stethoscope,
  Phone,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Heart,
  Brain,
  Activity,
  UserCheck,
  Star,
  Lock,
  ArrowRight,
  Menu,
  X,
  Sparkles
} from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Top Announcement / Emergency Bar */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-4 text-xs font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-200 font-semibold">Your Health. Our Mission.</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">Next-Gen Intelligent Queue & Patient Care Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="tel:+15551234567" className="flex items-center gap-1.5 hover:text-white transition">
              <Phone size={13} className="text-blue-400" />
              <span>Emergency Care 24/7: <strong>+1 (555) 123-4567</strong></span>
            </a>
            {/* Hidden / Discreet Doctor Portal Link */}
            <Link
              to="/doctor"
              className="flex items-center gap-1 text-slate-400 hover:text-blue-400 font-medium px-2 py-0.5 rounded hover:bg-slate-800 transition text-xs"
              title="Doctor & Hospital Staff Sign In"
            >
              <Lock size={12} />
              <span>Doctor Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition">
              CO
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                MediLife <span className="text-blue-600">Multispecialty</span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                Clinic OS Healthcare Network
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#home" className="text-blue-600 hover:text-blue-700 transition">Home</a>
            <a href="#specialties" className="hover:text-blue-600 transition">Services & Specialties</a>
            <a href="#about" className="hover:text-blue-600 transition">About Us</a>
            <a href="#doctors" className="hover:text-blue-600 transition">Doctors</a>
            <a href="#testimonials" className="hover:text-blue-600 transition">Patient Stories</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact Us</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/checkin"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition hover:shadow-blue-600/40 flex items-center gap-2"
            >
              <span>Instant Patient Check-in</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-700">Home</a>
            <a href="#specialties" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-700">Services</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-700">About Us</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-700">Contact Us</a>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/checkin"
                className="w-full text-center py-3 bg-blue-600 text-white font-bold rounded-xl"
              >
                Instant Patient Check-in
              </Link>
              <Link
                to="/doctor"
                className="w-full text-center py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <Lock size={14} /> Doctor & Staff Login (/doctor)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. Hero Section */}
      <section id="home" className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-100/80 text-blue-700 text-xs font-extrabold uppercase tracking-widest rounded-full border border-blue-200">
                <Sparkles size={14} /> Welcome to MediLife Multispecialty Hospital
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Expert Care. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                  Every Time.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
                Compassionate care. Advanced medical technology. Instant QR token queueing for shorter wait times and better patient outcomes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/checkin"
                  className="px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 group"
                >
                  <span>Book Patient Check-in</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </Link>
                <a
                  href="#specialties"
                  className="px-7 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-base rounded-2xl border border-slate-300 shadow-sm transition flex items-center justify-center gap-2"
                >
                  <span>Our Specialties</span>
                  <ChevronRight size={18} />
                </a>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 border-t border-slate-200 flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  <span>NABH Accredited</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Award size={18} className="text-blue-500" />
                  <span>Top Rated Medical Care</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/assets/hero_building.jpg"
                  alt="MediLife Multispecialty Hospital Building"
                  className="w-full h-[400px] sm:h-[480px] object-cover hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold text-lg">
                      24/7
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">Emergency & Trauma Unit</p>
                      <p className="text-xs text-slate-500 font-medium">Instant doctor triage & QR Queue token</p>
                    </div>
                  </div>
                  <Link to="/checkin" className="px-4 py-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 transition">
                    Check-in Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {[
              { title: '24/7 Emergency Care', desc: 'Round-the-clock emergency services for critical care.', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Expert Doctors', desc: 'Highly experienced specialists across all major fields.', icon: Stethoscope, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { title: 'Advanced Technology', desc: 'State-of-the-art QR Queue & digital triage tech.', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { title: 'Patient First Approach', desc: 'Personalized care with compassion and commitment.', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((feat, idx) => {
              const IconComp = feat.icon
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
                  <div className={`w-12 h-12 ${feat.bg} ${feat.color} rounded-xl flex items-center justify-center font-bold`}>
                    <IconComp size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Our Specialties Section */}
      <section id="specialties" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Our Specialties</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                Comprehensive Care for Every Need
              </h2>
            </div>
            <a href="#contact" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>View All Medical Departments</span>
              <ChevronRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Cardiology', desc: 'Advanced care for heart conditions, ECG, and angioplasty.', icon: Heart, color: 'text-rose-500' },
              { name: 'Neurology', desc: 'Expert management of brain, spine, and nerve disorders.', icon: Brain, color: 'text-indigo-500' },
              { name: 'Orthopedics', desc: 'Joint replacement, spine care, and sports injury treatment.', icon: Activity, color: 'text-blue-500' },
              { name: "Women's Health", desc: 'Complete care for women at every stage of life and maternity.', icon: UserCheck, color: 'text-pink-500' },
              { name: 'Pediatrics', desc: 'Compassionate care for infants, children, and adolescents.', icon: Sparkles, color: 'text-amber-500' },
              { name: 'Oncology', desc: 'Advanced cancer care and personalized chemotherapy treatment.', icon: ShieldCheck, color: 'text-emerald-500' },
            ].map((spec, idx) => {
              const IconComponent = spec.icon
              return (
                <div key={idx} className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 hover:bg-white hover:shadow-xl hover:border-blue-200 transition duration-300 space-y-4 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition">
                    <IconComponent className={spec.color} size={24} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{spec.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{spec.desc}</p>
                  <Link to="/checkin" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    <span>Book Check-in</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. About Section: Healing Hands. Caring Hearts */}
      <section id="about" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Medical Team Photo */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl">
                <img
                  src="/assets/medical_team.jpg"
                  alt="MediLife Medical Specialists"
                  className="w-full h-[420px] object-cover"
                />
              </div>
            </div>

            {/* Right Copy & Stats */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-extrabold uppercase tracking-widest text-blue-400">About MediLife Hospital</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Healing Hands. Caring Hearts.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                At MediLife Hospital, we are committed to providing world-class healthcare with a patient-first approach. Our experienced medical team, combined with digital QR check-in technology, ensures minimal waiting times and superior treatment outcomes.
              </p>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-3xl font-black text-blue-400">20+</p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Years Excellence</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-emerald-400">150+</p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Expert Doctors</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-amber-400">50+</p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Departments</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-purple-400">25,000+</p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Happy Patients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Patient Stories</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Thousands of Patients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah J.', text: 'The doctors and staff were extremely caring. Scanned the QR code on my phone and received my token in 10 seconds!', rating: 5 },
              { name: 'David R.', text: 'World-class facilities and excellent care. I highly recommend MediLife Hospital to everyone.', rating: 5 },
              { name: 'Priya S.', text: 'From diagnosis to recovery, the entire team was supportive and professional. Outstanding QR check-in experience.', rating: 5 },
            ].map((testi, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{testi.text}"</p>
                <p className="font-extrabold text-slate-900 text-sm">— {testi.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black">Ready to Check-in with Doctor?</h3>
            <p className="text-blue-100 text-sm mt-1 font-medium">Scan QR or submit patient details online for instant queue token.</p>
          </div>
          <Link
            to="/checkin"
            className="px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm rounded-xl shadow-lg transition flex items-center gap-2 flex-shrink-0"
          >
            <span>Book Patient Check-in Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 8. Footer */}
      <footer id="contact" className="bg-slate-950 text-slate-400 py-16 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg text-white flex items-center justify-center font-bold text-sm">
                CO
              </div>
              <span className="text-lg font-bold text-white tracking-wide">MediLife Multispecialty</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Delivering exceptional healthcare with compassion, advanced AI triage, and instant QR queueing.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-white transition">Home</a></li>
              <li><a href="#specialties" className="hover:text-white transition">Services & Specialties</a></li>
              <li><a href="#about" className="hover:text-white transition">About Us</a></li>
              <li><Link to="/checkin" className="hover:text-white transition">Patient Check-in</Link></li>
              <li><Link to="/doctor" className="hover:text-white transition">Doctor Login (/doctor)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Medical Services</h4>
            <ul className="space-y-2">
              <li><span>Emergency Care 24/7</span></li>
              <li><span>Cardiology & Heart Care</span></li>
              <li><span>Neurology & Brain Surgery</span></li>
              <li><span>Orthopedics & Joint Surgery</span></li>
              <li><span>Oncology & Cancer Center</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Contact Info</h4>
            <p className="text-slate-300">📍 123 Health Street, Wellness City</p>
            <p className="text-slate-300 mt-2">📞 Emergency Care: +1 (555) 123-4567</p>
            <p className="text-slate-300 mt-1">✉️ Email: info@shahidkhan.site</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MediLife Multispecialty Hospital. All Rights Reserved. Powered by Clinic OS.</p>
          <div className="flex gap-4">
            <Link to="/doctor" className="text-slate-500 hover:text-blue-400 transition flex items-center gap-1">
              <Lock size={12} /> Doctor Sign In Portal (/doctor)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
