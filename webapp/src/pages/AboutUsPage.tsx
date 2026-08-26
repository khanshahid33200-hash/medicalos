import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  ShieldCheck,
  Award,
  Clock,
  HeartPulse,
  ArrowRight
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'

export default function AboutUsPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-blue-50/30 to-slate-50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-xs font-extrabold uppercase tracking-widest">
            <HeartPulse size={14} className="text-blue-600" /> About Clinic OS
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-recoleta max-w-4xl mx-auto">
            Transforming Indian OPD Care Through <span className="text-blue-600">Smart Technology</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto font-medium leading-relaxed">
            Clinic OS was built with a single mission: to eliminate 2-hour hospital reception waiting times and provide doctors with an ultra-fast, 100% digital OPD clinical workspace.
          </p>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-4xl font-black text-blue-600 font-recoleta">4,500+</p>
              <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Active Doctors</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black text-blue-600 font-recoleta">1.2M+</p>
              <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Patients Served</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black text-blue-600 font-recoleta">85%</p>
              <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Reduced Wait Times</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black text-blue-600 font-recoleta">99.9%</p>
              <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Cloud Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="px-3.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-xs font-extrabold uppercase tracking-widest">
              Our Foundational Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-recoleta">
              Why We Built Clinic OS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              In traditional Indian clinics and hospital OPDs, patients spend 90% of their visit waiting in crowded reception corridors and only 10% interacting with their physician.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Clinic OS replaces manual paper token slips and messy handwriting with an intelligent QR-code self-reception system, automated audio queue calling, and lightning-fast EMR prescription writing.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md shadow-blue-600/30 transition flex items-center gap-2"
              >
                Schedule Executive Briefing <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-slate-900 font-recoleta">Core Operating Values</h3>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Zero Patient Wait Times</h4>
                  <p className="text-xs text-slate-500 font-medium">Empower patients to track their live queue on their mobile phone while resting comfortably.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Bank-Grade Data Security</h4>
                  <p className="text-xs text-slate-500 font-medium">128-bit AES end-to-end encryption with strict multi-tenant doctor data isolation.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">ABDM & Niti Aayog Compliance</h4>
                  <p className="text-xs text-slate-500 font-medium">Fully certified under Ayushman Bharat Digital Mission (ABDM) Milestone-3 standards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance Badges */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 text-center">
          <h2 className="text-2xl font-black text-slate-900 font-recoleta">Certified & Compliant Healthcare Infrastructure</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
              <ShieldCheck size={32} className="text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">ISO 27001 Information Security</h3>
              <p className="text-xs text-slate-600 font-medium">Verified data management protocols protecting patient medical privacy.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
              <Award size={32} className="text-blue-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">ABDM M3 Digital Health Stack</h3>
              <p className="text-xs text-slate-600 font-medium">Seamless integration with ABHA Health Accounts and National Health Registry.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
              <Users size={32} className="text-indigo-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">HIPAA Compliant Cloud</h3>
              <p className="text-xs text-slate-600 font-medium">Strict role-based access control protecting clinical records across hospitals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl font-black font-recoleta">Partner With Clinic OS</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-medium">
            Whether you run a single OPD clinic or a multi-specialty hospital chain, Clinic OS scales effortlessly with your facility.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-blue-600/30 transition"
            >
              Contact Our Healthcare Team
            </button>
            <Link
              to="/pricing"
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full border border-slate-700 transition"
            >
              View Pricing Tiers
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} planName="Clinic OS Partner Briefing" planPrice="Free Consultation" />
    </div>
  )
}
