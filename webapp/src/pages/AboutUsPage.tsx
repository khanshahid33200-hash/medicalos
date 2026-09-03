import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award, ShieldCheck, HeartPulse, Building2, ArrowRight,
  Users, Stethoscope, Clock, CheckCircle2, Sparkles,
  MapPin, Check, Globe, Shield, Star
} from 'lucide-react'
import { motion } from 'framer-motion'
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
      icon: <Clock size={24} className="text-[#5B4DF5]" />,
    },
    {
      title: 'Doctor-First Clinical Ergonomics',
      desc: 'Physicians should spend 90% of consultation time looking at their patients, not typing into clumsy software. We obsess over sub-30-second prescription flows and zero unnecessary clicks.',
      icon: <Stethoscope size={24} className="text-emerald-600" />,
    },
    {
      title: 'Cryptographic Multi-Hospital Data Privacy',
      desc: 'Health records belong strictly to the patient and their consulting hospital. We engineer database-native Row-Level Security (RLS) so that cross-facility data leakage is physically impossible.',
      icon: <ShieldCheck size={24} className="text-purple-600" />,
    },
    {
      title: 'Accessible to Every Tier of Healthcare',
      desc: 'Modern clinical technology should not be limited to high-end corporate chains. Our platform runs effortlessly in tier-2 and tier-3 towns on everyday mobile phones and smart TVs without IT maintenance.',
      icon: <HeartPulse size={24} className="text-rose-600" />,
    }
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#5B4DF5] selection:text-white">
      <PublicHeader />

      {/* Hero Header with Lavender Cloud Backdrop */}
      <section className="relative pt-36 sm:pt-44 pb-20 px-6 bg-gradient-to-b from-[#E9EDFF] via-[#F4F5FF] to-white text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-white/90 border border-indigo-100 text-xs font-extrabold text-[#5B4DF5] inline-block shadow-2xs">
            Our Purpose & Vision
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-[-0.035em] text-slate-900 leading-tight">
            Building the Digital Backbone<br />of Indian Healthcare.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
            MedTech Fixaters engineers intelligent outpatient operating systems that bridge doctors, hospitals, and patients with zero friction.
          </p>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-16 sm:py-24 px-6 max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreValues.map((val, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-2">
                {val.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{val.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Card */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-[#5B4DF5] text-white p-8 sm:p-14 rounded-[36px] text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
            Join the Healthcare Revolution
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto font-medium">
            Modernize your outpatient operations with the fastest-growing clinical operating system in India.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3.5 rounded-full bg-white text-[#5B4DF5] font-bold text-xs sm:text-sm shadow-md hover:bg-slate-50 transition"
            >
              Partner With Us
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
