import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award, ShieldCheck, HeartPulse, Building2, ArrowRight,
  Users, Stethoscope, Clock, CheckCircle2, Sparkles,
  MapPin, Check, Globe, Shield, Star
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'
import { useSEO } from '../hooks/useSEO'

export default function AboutUsPage() {
  useSEO({
    title: 'About Us — MedTech Fixaters & Med Rapidly Clinical Systems',
    description: 'Learn about MedTech Fixaters: our founding story, clinical mission, core values, medical advisory board, and vision to digitize outpatient healthcare across India.',
  })

  const [modalOpen, setModalOpen] = useState(false)

  const coreValues = [
    {
      title: 'Respecting Patient Time as Medicine',
      desc: 'Waiting four hours in an overcrowded hallway makes sick patients sicker. We believe patient dignity begins with transparent, accurate live queue tracking that liberates families from the waiting room bench.',
      icon: <Clock size={24} className="text-[#4361EE]" />,
      bg: 'bg-indigo-50'
    },
    {
      title: 'Doctor-First Clinical Ergonomics',
      desc: 'Physicians should spend 90% of consultation time looking at their patients, not typing into clumsy software. We obsess over sub-30-second prescription flows and zero unnecessary clicks.',
      icon: <Stethoscope size={24} className="text-emerald-600" />,
      bg: 'bg-emerald-50'
    },
    {
      title: 'Cryptographic Multi-Hospital Data Privacy',
      desc: 'Health records belong strictly to the patient and their consulting hospital. We engineer database-native Row-Level Security (RLS) so that cross-facility data leakage is physically impossible.',
      icon: <ShieldCheck size={24} className="text-purple-600" />,
      bg: 'bg-purple-50'
    },
    {
      title: 'Accessible to Every Tier of Healthcare',
      desc: 'Modern clinical technology should not be limited to high-end corporate chains. Our platform runs effortlessly in tier-2 and tier-3 towns on everyday mobile phones and smart TVs without IT maintenance.',
      icon: <HeartPulse size={24} className="text-rose-600" />,
      bg: 'bg-rose-50'
    }
  ]

  const milestones = [
    {
      year: '2024',
      title: 'The Spark & First Hospital Pilot',
      desc: 'Developed in direct collaboration with outpatient cardiologists and pediatricians in Mumbai to solve corridor overcrowding. First prototype deployed at City Care Clinic.'
    },
    {
      year: '2025',
      title: 'Live Queue & WhatsApp Engine Launch',
      desc: 'Pioneered zero-polling WebSocket queue telemetry and direct WhatsApp PDF prescription delivery. Expanded across 35 multi-specialty hospitals in Western India.'
    },
    {
      year: '2026',
      title: '100+ Hospitals & Multi-Tenant Architecture',
      desc: 'Achieved ISO 27001 certification and Ayushman Bharat Digital Mission (ABDM) interoperability. Over 10,000 monthly outpatients processed with 99.98% platform uptime.'
    }
  ]

  const team = [
    {
      name: 'Dr. Amit Sharma, MD',
      role: 'Chief Medical Advisor',
      spec: 'Consultant Interventional Cardiologist',
      bio: 'Over 18 years of clinical hospital practice. Led the design of the doctor consultation cockpit and rapid prescription templates to match real clinical ergonomics.'
    },
    {
      name: 'Shahid Khan',
      role: 'Lead Healthcare Architect & Founder',
      spec: 'MedTech Fixaters Systems',
      bio: 'Experienced software systems engineer dedicated to building resilient real-time clinical operating systems with zero data leakage and sub-second queue synchronization.'
    },
    {
      name: 'Dr. Neha Singh, MBBS, MHA',
      role: 'Director of Clinical Operations',
      spec: 'Hospital Administration Specialist',
      bio: 'Former medical superintendent at top tertiary care centers. Specializes in OPD turnaround time optimization, staff triage training, and NABH compliance.'
    },
    {
      name: 'Dr. Rajesh Verma, MS',
      role: 'Surgical & OPD Review Board',
      spec: 'Head of Surgical Outpatients',
      bio: 'Passionate advocate for eliminating paper medical charts and ensuring seamless coordination between outpatient consulting rooms, billing, and pathology labs.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#FCFCFE] text-[#18233D] font-sans antialiased selection:bg-[#4361EE] selection:text-white">
      <PublicHeader />

      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-b from-white via-indigo-50/25 to-white px-6 border-b border-[#E6E9F0]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            About MedTech Fixaters
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#18233D] tracking-tight leading-tight">
            Building the Digital Backbone for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-[#5D4CC8]">
              Calm, Modern Healthcare
            </span>
          </h1>
          <p className="text-base text-[#5E687B] max-w-2xl mx-auto leading-relaxed">
            We are practicing physicians, healthcare technologists, and software engineers on a mission to eliminate waiting room chaos and paper friction across India and beyond.
          </p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-24 max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-black uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Our Origin Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Why We Built Med Rapidly
            </h2>
            <p className="text-sm text-[#5E687B] leading-relaxed">
              Every single day, across thousands of outpatient clinics in India, millions of patients spend hours sitting on hard metal benches clutching torn paper tokens. Families have no way of knowing when their number will be called, forcing them to remain trapped in stuffy, germ-filled waiting halls.
            </p>
            <p className="text-sm text-[#5E687B] leading-relaxed">
              Meanwhile, inside the consultation room, doctors are overwhelmed by manual paper slips, lost medical history files, and confusing interruptions from patients checking on their turn. Existing hospital software was built for corporate billing accountants — not for the doctor sitting across from a sick patient.
            </p>
            <p className="text-sm text-[#5E687B] leading-relaxed">
              MedTech Fixaters was born to fix this broken system. By uniting contactless QR intake, live smartphone queue tracking, and 30-second digital prescription dispatch, we created a system that respects both patient time and doctor sanity.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-[#E6E9F0] shadow-xl space-y-6 text-center">
            <img src="/assets/brand-icon.png" alt="MedTech Fixaters" className="w-16 h-16 mx-auto object-contain" />
            <div>
              <h3 className="text-xl font-black text-[#18233D]">MedTech Fixaters Systems</h3>
              <span className="text-xs text-[#5E687B]">Smart Clinical Operating Systems</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-left">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-2xl font-black text-[#4361EE] font-mono block">100+</span>
                <span className="text-[11px] font-bold text-slate-500 block">Hospitals Deployed</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-2xl font-black text-emerald-600 font-mono block">10,000+</span>
                <span className="text-[11px] font-bold text-slate-500 block">Monthly Consults</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-2xl font-black text-amber-600 font-mono block">68%</span>
                <span className="text-[11px] font-bold text-slate-500 block">Wait Time Saved</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-2xl font-black text-purple-600 font-mono block">99.9%</span>
                <span className="text-[11px] font-bold text-slate-500 block">System Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1200px] mx-auto space-y-14 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Our Core Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Principles That Guide Every Feature
            </h2>
            <p className="text-sm text-[#5E687B]">
              We believe healthcare software should feel invisible, effortless, and protective of patient dignity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {coreValues.map((v, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#FCFCFE] border border-[#E6E9F0] shadow-sm hover:shadow-md transition space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center`}>
                  {v.icon}
                </div>
                <h3 className="text-xl font-black text-[#18233D]">{v.title}</h3>
                <p className="text-xs sm:text-sm text-[#5E687B] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline of Milestones */}
      <section className="py-24 bg-[#FCFCFE] border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1000px] mx-auto space-y-14 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Milestones Along the Way
            </h2>
            <p className="text-sm text-[#5E687B]">
              From an initial idea sketched in a hospital cafeteria to powering 100+ outpatient facilities.
            </p>
          </div>

          <div className="space-y-6 text-left">
            {milestones.map((m, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-[#E6E9F0] shadow-sm flex flex-col md:flex-row items-start gap-6">
                <span className="text-3xl font-black font-mono text-[#4361EE] shrink-0 w-24">
                  {m.year}
                </span>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-lg font-black text-[#18233D]">{m.title}</h3>
                  <p className="text-xs sm:text-sm text-[#5E687B] leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Medical Advisory Board */}
      <section className="py-24 bg-white border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1200px] mx-auto space-y-14 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Clinical & Technical Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Guided by Practicing Clinicians
            </h2>
            <p className="text-sm text-[#5E687B]">
              Our leadership combines clinical medicine with high-reliability distributed systems engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {team.map((member, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#FCFCFE] border border-[#E6E9F0] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#18233D]">{member.name}</h3>
                    <span className="text-xs font-bold text-[#4361EE] block">{member.role}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {member.spec}
                  </span>
                </div>
                <p className="text-xs text-[#5E687B] leading-relaxed pt-2 border-t border-slate-100">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Accreditations */}
      <section className="py-16 bg-slate-50 border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-around gap-6 text-center text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2"><ShieldCheck size={20} className="text-[#4361EE]" /> ISO 27001 Certified Security</div>
          <div className="flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-600" /> HIPAA Compliant Architecture</div>
          <div className="flex items-center gap-2"><ShieldCheck size={20} className="text-purple-600" /> Ayushman Bharat (ABDM) Ready</div>
          <div className="flex items-center gap-2"><ShieldCheck size={20} className="text-amber-600" /> 256-Bit SSL/TLS Encryption</div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 max-w-[1360px] mx-auto">
        <div className="bg-gradient-to-r from-[#3A57E8] to-[#5046E5] rounded-3xl p-10 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
            <h2 className="text-3xl font-black tracking-tight">
              Partner With Us to Modernize Your Hospital
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Join leading multi-specialty hospitals and medical practices delivering calm, modern outpatient care.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-[#3A57E8] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              Get Started Free →
            </button>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs rounded-xl transition"
            >
              Contact Our Medical Team
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
