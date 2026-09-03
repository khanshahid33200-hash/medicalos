import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode, RefreshCw, Smartphone, Stethoscope,
  CheckCircle2, ArrowRight, MessageSquare, Clock,
  Sparkles, ShieldCheck, HeartPulse, Building2
} from 'lucide-react'
import { motion } from 'framer-motion'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'
import { useSEO } from '../hooks/useSEO'

export default function HowItWorksPage() {
  useSEO({
    title: 'How It Works — Smart QR Outpatient Workflow | Med Rapidly',
    description: 'Learn step-by-step how Med Rapidly automates hospital check-in, real-time live queue progression, and digital prescription dispatch.',
  })

  const [modalOpen, setModalOpen] = useState(false)

  const steps = [
    {
      num: '01',
      title: 'Patient Scans QR Standee at Reception',
      desc: 'Point any smartphone camera at the durable acrylic standee. In under 10 seconds, the lightweight web app opens with zero download.',
      points: ['No App Store or Play Store installation required', 'Automatic return-patient recognition by phone number', 'Select date, department, and on-duty physician']
    },
    {
      num: '02',
      title: 'Instant Atomic Queue Token Assigned',
      desc: 'Our backend transaction locking assigns a permanent, sequential token number (e.g. C-012) guaranteed against race conditions.',
      points: ['Unique sequential token issued instantly', 'SMS & WhatsApp confirmation sent immediately', 'Printed thermal slip ready for offline patients']
    },
    {
      num: '03',
      title: 'Live Waiting Lounge Telemetry',
      desc: 'Patients monitor live queue countdowns in real-time. Wait comfortably in the cafeteria or hospital garden without corridor shouting.',
      points: ['Live countdown ticks on patient mobile browser', 'Corridor TV display board synchronization', 'Automated nudge when 2 patients remain ahead']
    },
    {
      num: '04',
      title: 'Doctor Consultation & 30-Sec Digital Rx',
      desc: 'Doctor clicks one button to announce the patient via voice audio. Prescribes formulary medications in 30 seconds and auto-dispatches PDF.',
      points: ['Corridor voice speaker text-to-speech callout', 'Structured clinical medication order sets', 'Prescription PDF delivered to patient WhatsApp instantly']
    }
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#5B4DF5] selection:text-white">
      <PublicHeader />

      {/* Hero Header with Lavender Cloud Backdrop */}
      <section className="relative pt-36 sm:pt-44 pb-20 px-6 bg-gradient-to-b from-[#E9EDFF] via-[#F4F5FF] to-white text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-white/90 border border-indigo-100 text-xs font-extrabold text-[#5B4DF5] inline-block shadow-2xs">
            The Patient Journey
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-[-0.035em] text-slate-900 leading-tight">
            How Med Rapidly Works.<br />Simple. Seamless. Fast.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
            From the entrance gate to the pharmacy counter, eliminate bottlenecks with 4 synchronized digital steps.
          </p>
        </div>
      </section>

      {/* 4 Steps Section */}
      <section className="py-16 sm:py-24 px-6 max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((st, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-3xl font-black text-[#5B4DF5] font-mono block">
                  {st.num}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{st.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">{st.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                {st.points.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 size={15} className="text-[#5B4DF5] shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Card */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-[#5B4DF5] text-white p-8 sm:p-14 rounded-[36px] text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to deploy at your facility?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto font-medium">
            Get acrylic QR standees shipped to your hospital within 48 hours.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3.5 rounded-full bg-white text-[#5B4DF5] font-bold text-xs sm:text-sm shadow-md hover:bg-slate-50 transition"
            >
              Order QR Standees
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
