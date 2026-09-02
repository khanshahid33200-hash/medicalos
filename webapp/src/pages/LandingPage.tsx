import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode, Users, Clock, Stethoscope, ArrowRight, CheckCircle2,
  Phone, Volume2, Check, Sparkles, Send, Activity, Settings,
  Calendar, Star, ChevronDown, ChevronUp, Plus, ShieldCheck,
  Building2, MessageSquare, Zap, Eye, RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'

/**
 * Scroll-linked kinetic-type headline: words brighten from faint (0.15) to full
 * ink (1.0) progressively as the section scrolls through the viewport.
 */
function KineticSentence({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.25'] })
  const words = text.split(' ')
  return (
    <p
      ref={ref}
      className="flex flex-wrap gap-x-2 sm:gap-x-3.5 gap-y-1.5 text-2xl sm:text-4xl lg:text-[40px] font-black text-[#131515] tracking-tight leading-[1.25]"
    >
      {words.map((word, i) => (
        <KineticWord key={i} word={word} index={i} total={words.length} progress={scrollYProgress} />
      ))}
    </p>
  )
}

function KineticWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total
  const end = start + 1 / total
  const opacity = useTransform(progress, [start, end], [0.18, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
    </motion.span>
  )
}

/** Animated number counter */
function AnimatedCounter({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf: number
    const start = performance.now()
    const duration = 1200
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  return <span ref={ref} className={className}>{display.toLocaleString()}{suffix}</span>
}

export default function LandingPage() {
  useSEO({
    title: 'Med Rapidly — Smart Hospital & Clinical Operating System',
    description: 'A calmer, faster way to run hospital OPDs. Zero app download QR check-ins, real-time live tokens, voice calling, and 30-second digital prescriptions.',
  })

  const [demoModalOpen, setDemoModalOpen] = useState(false)

  // Interactive Bento Feature 1: Flexible Streak / Queue Rules
  const [rules, setRules] = useState({
    emergencyBypass: true,
    walkInFastTrack: true,
    seniorCitizenPriority: true,
    doctorPauseMode: false,
    whatsappNudge: true,
  })

  // Role Switcher Tab
  const [activeRole, setActiveRole] = useState<'doctors' | 'admins' | 'patients' | 'reception'>('doctors')

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Demo Voice Audio Test
  const [audioPlayed, setAudioPlayed] = useState(false)
  const handlePlayVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const text = 'Token number 12, Ravi Kumar, please proceed to room number 3, Doctor Amit Sharma.'
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
      setAudioPlayed(true)
      setTimeout(() => setAudioPlayed(false), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#131515] font-sans antialiased selection:bg-[#131515] selection:text-white">
      {/* Floating Dynamic Island Header */}
      <PublicHeader />

      {/* ─── 1. HERO SECTION (MATCHING FRAMER REFERENCE) ────────────────────── */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-6 max-w-5xl mx-auto text-center">
        {/* Top Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e8e8e8] shadow-xs text-xs font-semibold text-[#131515] mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#ff4c00] animate-pulse" />
          <span>New • A calmer way to run hospital OPDs</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-tight text-[#131515] leading-[1.08] max-w-4xl mx-auto"
        >
          Your hospital.{' '}
          <span className="text-[#494d4d]/60 block sm:inline">Connected digitally.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm sm:text-base text-[#494d4d] max-w-2xl mx-auto font-medium leading-relaxed"
        >
          You see the right patients at the right time so your OPD never feels crowded. Real-time token tracking, automated WhatsApp updates, and 30-second digital prescriptions.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDemoModalOpen(true)}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#131515] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Start tracking for free</span>
            <ArrowRight size={15} />
          </motion.button>

          <Link
            to="/how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-[#e8e8e8] text-[#131515] text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Watch 60s Demo</span>
          </Link>
        </motion.div>

        {/* Social Proof Sub-strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#494d4d]"
        >
          <div className="flex items-center gap-1 text-amber-500">
            {'★'.repeat(5)}
            <span className="text-[#131515] font-bold ml-1">4.8</span>
            <span className="text-slate-400 font-normal">(based on 180+ hospital reviews)</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-slate-500 font-medium">Used by hospitals to streamline daily patient queues</span>
        </motion.div>

        {/* Chip Cloud / Hashtags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          {[
            '#SuperSpeciality',
            '#Cardiology',
            '#WalkInQueues',
            '#SmartStandees',
            '#30SecRx',
            '#WhatsAppDispatch',
            '#ZeroAppDownload',
            '#MultiDoctorOPD'
          ].map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-white/70 border border-[#e8e8e8] text-[11px] font-semibold text-[#494d4d]"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* ─── HERO INTERACTIVE SHOWCASE CARDS ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 text-left"
        >
          {/* Card 1: Live Patient Token */}
          <div className="bg-white p-5 rounded-3xl border border-[#e8e8e8] shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Now Consulting
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">Room 3</span>
            </div>

            <div>
              <span className="font-mono text-2xl font-black text-indigo-600 block">CC-012</span>
              <h4 className="font-extrabold text-sm text-[#131515] mt-0.5">Ravi Kumar</h4>
              <p className="text-xs text-[#494d4d] font-medium">32 Yrs • Male • Chest discomfort</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Wait time: ~0 mins</span>
              <span className="text-indigo-600 font-bold">10:15 AM</span>
            </div>
          </div>

          {/* Card 2: 30-Second Prescription Builder */}
          <div className="bg-white p-5 rounded-3xl border border-[#e8e8e8] shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Digital Rx
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">30 Seconds</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Medications:</span>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-[#131515] flex items-center justify-between">
                <span>Tab. Atorvastatin 20mg</span>
                <span className="text-[10px] text-slate-500">0-0-1</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-[#131515] flex items-center justify-between">
                <span>Tab. Aspirin 75mg</span>
                <span className="text-[10px] text-slate-500">1-0-0</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
              <span className="flex items-center gap-1"><Check size={13} /> WhatsApp Dispatch Ready</span>
            </div>
          </div>

          {/* Card 3: Voice Call Announcement */}
          <div className="bg-white p-5 rounded-3xl border border-[#e8e8e8] shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#ff4c00] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Voice Callout
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">Web Audio TTS</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-[#131515] font-medium leading-snug">
              “Token CC-012, Ravi Kumar, please proceed to Room 3.”
            </div>

            <button
              onClick={handlePlayVoice}
              className="w-full py-2.5 rounded-xl bg-[#131515] hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Volume2 size={14} className={audioPlayed ? 'animate-bounce text-emerald-400' : ''} />
              <span>{audioPlayed ? 'Announcing Now...' : 'Test Voice Call'}</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* ─── 2. KINETIC SCROLL REVEAL ─────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-6 max-w-4xl mx-auto border-t border-[#e8e8e8]">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
          Habits with structure
        </span>
        <KineticSentence
          text="Build steady, reliable OPD workflows with a layout that keeps your mornings, evenings, and doctor consultations simple to follow."
        />
        <p className="mt-6 text-sm sm:text-base text-[#494d4d] max-w-2xl font-normal leading-relaxed">
          Med Rapidly brings clarity to daily hospital routines with clean tokens, realistic queue progression, and guidance that adapts to every patient rush.
        </p>
      </section>

      {/* ─── 3. BENTO GRID FEATURES ("A LAYOUT THAT KEEPS YOUR DAY CLEAR") ── */}
      <section id="features" className="py-16 sm:py-24 px-6 max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            What's inside
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#131515] tracking-tight">
            A layout that keeps your day clear.
          </h2>
          <p className="text-sm text-[#494d4d] font-medium">
            Everything your medical team needs to eliminate waiting lines, coordinate staff, and serve patients without stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: Flexible Streak / Queue Rules (7 cols) */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e8e8e8] shadow-xs space-y-6 text-left">
            <div>
              <span className="text-xs font-bold text-indigo-600 block uppercase tracking-wider">Feature 01</span>
              <h3 className="text-xl sm:text-2xl font-black text-[#131515] tracking-tight mt-1">
                Flexible Queue Rules
              </h3>
              <p className="text-xs sm:text-sm text-[#494d4d] font-normal mt-2 leading-relaxed">
                Traditional hospital queues are too rigid. Miss one call and your token is cancelled. Med Rapidly adapts dynamically.
              </p>
            </div>

            {/* Interactive Toggle Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { key: 'emergencyBypass', label: 'Emergency Bypass Active', desc: 'Prioritizes urgent casualty tokens' },
                { key: 'walkInFastTrack', label: 'Walk-In Allowance', desc: 'Auto-integrates manual reception tokens' },
                { key: 'seniorCitizenPriority', label: 'Senior Citizen Priority', desc: 'Fast tracks elderly patients over 65' },
                { key: 'doctorPauseMode', label: 'Doctor Pause Mode', desc: 'Halts timer during sterile procedures' },
              ].map(item => {
                const active = (rules as any)[item.key]
                return (
                  <button
                    key={item.key}
                    onClick={() => setRules({ ...rules, [item.key]: !active })}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-start justify-between gap-2 ${
                      active ? 'bg-[#f7f7f7] border-slate-300' : 'bg-white border-slate-200 opacity-60'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-xs text-[#131515]">{item.label}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      active ? 'bg-[#131515] text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {active ? '✓' : ''}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Card 2: Smart Daily OPD Timeline (5 cols) */}
          <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e8e8e8] shadow-xs space-y-4 text-left flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 block uppercase tracking-wider">Feature 02</span>
              <h3 className="text-xl sm:text-2xl font-black text-[#131515] tracking-tight mt-1">
                Smart Daily Planner
              </h3>
              <p className="text-xs text-[#494d4d] font-normal mt-1 leading-relaxed">
                A simple view that shows only the tokens that match your current consultation window.
              </p>
            </div>

            {/* Simulated Live List */}
            <div className="space-y-2 text-xs">
              {[
                { time: '09:00 AM', name: 'Ramesh Gupta', status: 'Completed', color: 'text-slate-400' },
                { time: '10:15 AM', name: 'Ravi Kumar', status: 'Now Consulting', color: 'text-emerald-700 font-bold' },
                { time: '10:45 AM', name: 'Neha Singh', status: 'Next Patient', color: 'text-indigo-600 font-bold' },
                { time: '11:15 AM', name: 'Mohd. Ali', status: 'Waiting (18m)', color: 'text-amber-600' },
              ].map((row, i) => (
                <div key={i} className="p-2.5 bg-[#f7f7f7] rounded-xl flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-500">{row.time}</span>
                  <span className="font-bold text-[#131515]">{row.name}</span>
                  <span className={`text-[10px] ${row.color}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Routine Stacks & Templates (5 cols) */}
          <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e8e8e8] shadow-xs space-y-4 text-left">
            <div>
              <span className="text-xs font-bold text-blue-600 block uppercase tracking-wider">Feature 03</span>
              <h3 className="text-xl sm:text-2xl font-black text-[#131515] tracking-tight mt-1">
                Clinical Routine Stacks
              </h3>
              <p className="text-xs text-[#494d4d] font-normal mt-1 leading-relaxed">
                Group diagnoses, formulary medications, and lifestyle advice into 1-click clinical stacks.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { title: 'Viral Flu & Pyrexia Stack', meds: 'Paracetamol + Levocetirizine' },
                { title: 'Essential Hypertension Protocol', meds: 'Telmisartan + Amlodipine' },
                { title: 'Acute Gastritis & GERD', meds: 'Pantoprazole + Domperidone' },
              ].map((stack, i) => (
                <div key={i} className="p-3 bg-[#f7f7f7] rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-extrabold text-[#131515]">{stack.title}</h5>
                    <span className="text-[10px] text-slate-500 font-medium">{stack.meds}</span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600">⚡ 1-Click</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Gentle WhatsApp Reminders (7 cols) */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e8e8e8] shadow-xs space-y-4 text-left flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#ff4c00] block uppercase tracking-wider">Feature 04</span>
              <h3 className="text-xl sm:text-2xl font-black text-[#131515] tracking-tight mt-1">
                Gentle Reminders
              </h3>
              <p className="text-xs sm:text-sm text-[#494d4d] font-normal mt-1 leading-relaxed">
                Short, calm nudges that help patients arrive at the consultation door right on time without crowding hallways.
              </p>
            </div>

            {/* Simulated WhatsApp Bubble */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2 max-w-lg">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>💬 Hospital WhatsApp Notification</span>
                <span className="text-[10px] text-emerald-600">10:10 AM</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                “Hello Ravi, your Token CC-012 is next in line (Room 3, Dr. Amit Sharma). Please proceed to the OPD waiting lounge now.”
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-full">
                  I'm on my way ✓
                </span>
                <span className="px-3 py-1 bg-white border border-emerald-200 text-slate-600 text-[10px] font-bold rounded-full">
                  Need 5 mins
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. ADAPTED FOR EVERY ROLE (INTERACTIVE ROLE SWITCHER) ────────── */}
      <section id="use-cases" className="py-16 sm:py-24 px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Use cases
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#131515] tracking-tight">
            Adapted for the way you live and work.
          </h2>
          <p className="text-sm text-[#494d4d] font-medium">
            Designed for everyone inside the clinical workflow — from busy consulting physicians to first-time patients.
          </p>
        </div>

        {/* Role Pill Switcher */}
        <div className="inline-flex p-1.5 rounded-full bg-white border border-[#e8e8e8] shadow-xs gap-1">
          {[
            { id: 'doctors', label: 'Consultant Doctors' },
            { id: 'admins', label: 'Hospital Admins' },
            { id: 'patients', label: 'Patients' },
            { id: 'reception', label: 'Reception & Counters' },
          ].map(role => {
            const active = activeRole === role.id
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id as any)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  active ? 'text-white' : 'text-slate-600 hover:text-black'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeRolePill"
                    className="absolute inset-0 bg-[#131515] rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{role.label}</span>
              </button>
            )
          })}
        </div>

        {/* Role Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-white p-8 rounded-[36px] border border-[#e8e8e8] shadow-sm max-w-3xl mx-auto text-left space-y-4"
          >
            {activeRole === 'doctors' && (
              <div>
                <span className="text-xs font-bold text-indigo-600 block uppercase">Doctor Workspace</span>
                <h3 className="text-2xl font-black text-[#131515] mt-1">Zero paperwork. Rapid 30-sec digital prescriptions.</h3>
                <p className="text-sm text-[#494d4d] mt-2 leading-relaxed">
                  Call the next patient with single-tap voice TTS. Review previous visit vitals, pick formulary medications, and auto-dispatch digital letterheads directly to the patient's phone.
                </p>
                <div className="pt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">📢 Web Voice Audio Callouts</span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">⚡ 1-Click Clinical Templates</span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">📱 WhatsApp Auto-Send</span>
                </div>
              </div>
            )}

            {activeRole === 'admins' && (
              <div>
                <span className="text-xs font-bold text-emerald-600 block uppercase">Hospital Ops Console</span>
                <h3 className="text-2xl font-black text-[#131515] mt-1">Real-time department balancing & verified collections.</h3>
                <p className="text-sm text-[#494d4d] mt-2 leading-relaxed">
                  Monitor patient queues across all department rooms live. Route walk-ins dynamically when a physician runs behind schedule. Track authentic consultation revenue with zero data falsification.
                </p>
                <div className="pt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">📊 Real Doctor Analytics</span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">🏢 Multi-Department Router</span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">📺 TV Board Integration</span>
                </div>
              </div>
            )}

            {activeRole === 'patients' && (
              <div>
                <span className="text-xs font-bold text-blue-600 block uppercase">Patient Convenience</span>
                <h3 className="text-2xl font-black text-[#131515] mt-1">Zero app downloads. Scan standee and wait anywhere.</h3>
                <p className="text-sm text-[#494d4d] mt-2 leading-relaxed">
                  Patients scan the reception acrylic standee with standard phone camera. An atomic queue token is issued in 10 seconds. Live countdown ticks right on their phone browser.
                </p>
                <div className="pt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">📷 Instant Camera Check-In</span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">⏳ Live Mobile Wait-Timer</span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">📄 PDF Prescription in WhatsApp</span>
                </div>
              </div>
            )}

            {activeRole === 'reception' && (
              <div>
                <span className="text-xs font-bold text-amber-600 block uppercase">Reception & Kiosk</span>
                <h3 className="text-2xl font-black text-[#131515] mt-1">Eliminate counter shouting & crowded physical queues.</h3>
                <p className="text-sm text-[#494d4d] mt-2 leading-relaxed">
                  Issue manual walk-in tokens with 3 clicks for elderly patients. The reception counter status updates instantly across doctors' screens and TV display boards.
                </p>
                <div className="pt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">⚡ 3-Click Walk-In Token</span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">🖨️ Thermal Slip Print Ready</span>
                  <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold">🔒 Multi-Counter Load Sync</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ─── 5. NUMBERS & SOCIAL PROOF ("REAL HABITS, REAL NUMBERS") ──────── */}
      <section id="metrics" className="py-20 sm:py-28 px-6 max-w-6xl mx-auto border-t border-[#e8e8e8] text-center space-y-12">
        <div className="space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Metrics
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#131515] tracking-tight">
            Real OPDs, real numbers.
          </h2>
          <p className="text-sm text-[#494d4d] font-medium">
            How hospitals across India transformed crowded chaos into automated calm.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {[
            { label: 'Check-ins logged last month', val: 62000, suffix: '+', sub: 'Across active hospital branches' },
            { label: 'Average Rx creation time', val: 30, suffix: ' sec', sub: 'Faster than handwritten paper' },
            { label: 'Wait time reduction', val: 64, suffix: '%', sub: 'Patients wait in lounges, not lines' },
            { label: 'Hospital departments onboarded', val: 120, suffix: '+', sub: 'Super-speciality & multi-bed clinics' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-[#e8e8e8] shadow-xs space-y-2">
              <span className="text-3xl sm:text-4xl font-black text-[#131515] tracking-tight block">
                <AnimatedCounter value={item.val} suffix={item.suffix} />
              </span>
              <h5 className="font-extrabold text-xs text-[#131515] leading-tight">{item.label}</h5>
              <p className="text-[11px] text-slate-400 font-medium">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. SMART ASSIST / AI SECTION ─────────────────────────────────── */}
      <section id="smart-assist" className="py-16 sm:py-24 px-6 max-w-5xl mx-auto text-center space-y-10">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Smart Assist
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#131515] tracking-tight">
            AI suggestions that adjust to your day.
          </h2>
          <p className="text-sm text-[#494d4d] font-medium">
            Med Rapidly learns patient arrival rhythms and offers small, useful suggestions that keep clinic flow optimal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {[
            {
              title: 'Suggests the best time to call next patient',
              desc: 'Calculates true examination durations and alerts doctors when queue wait times begin to creep up.',
              badge: 'Pacing Engine'
            },
            {
              title: 'Highlights drug allergy flags instantly',
              desc: 'Cross-checks patient past medical records and flags Penicillin or Sulfa contraindications in red.',
              badge: 'Patient Safety'
            },
            {
              title: 'Reorders tokens when emergencies arrive',
              desc: 'Smoothly prioritizes critical casualty arrivals without resetting the entire waiting room queue.',
              badge: 'Dynamic Routing'
            },
            {
              title: 'Automates evening follow-up WhatsApp dispatches',
              desc: 'Dispatches scheduled return visit reminders to patients 24 hours prior to their appointment.',
              badge: 'Follow-Up Assist'
            },
          ].map((sug, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-[#e8e8e8] shadow-xs space-y-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider inline-block">
                {sug.badge}
              </span>
              <h4 className="font-extrabold text-sm text-[#131515] mt-1">{sug.title}</h4>
              <p className="text-xs text-[#494d4d] leading-relaxed font-normal">{sug.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. REVIEWS & TESTIMONIALS ────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-6 max-w-6xl mx-auto border-t border-[#e8e8e8] text-center space-y-12">
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Social proof
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#131515] tracking-tight">
            Trusted by medical professionals.
          </h2>
          <div className="flex items-center justify-center gap-1 text-amber-500 pt-1">
            {'★'.repeat(5)}
            <span className="text-xs font-bold text-[#131515] ml-1">4.8 / 5.0 (Trusted by 1,580+ doctors)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {[
            {
              quote: 'Med Rapidly made our morning cardiology OPD manageable again. We see 40+ patients without hallway shouting.',
              name: 'Dr. Amit Sharma',
              role: 'Consultant Cardiologist',
              clinic: 'Metro Care Heart Hospital'
            },
            {
              quote: 'The 30-second digital prescription builder alone saved me 1.5 hours of handwriting every single day.',
              name: 'Dr. Aisha Khan',
              role: 'Senior Physician & Diabetologist',
              clinic: 'Apex Life Sciences'
            },
            {
              quote: 'Patients love scanning the acrylic standee. Zero app download complaints. Our reception queue dropped by 70%.',
              name: 'Dr. Rajesh Nair',
              role: 'Medical Superintendent',
              clinic: 'Nair Multispeciality Hospital'
            },
          ].map((rev, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-[#e8e8e8] shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-[#131515] font-medium leading-relaxed italic">
                "{rev.quote}"
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-[#131515] font-black text-xs flex items-center justify-center">
                  {rev.name.charAt(4) || 'D'}
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-[#131515]">{rev.name}</h5>
                  <p className="text-[10px] text-slate-400 font-medium">{rev.role} • {rev.clinic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. INTERACTIVE FAQ ACCORDION ─────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-6 max-w-4xl mx-auto space-y-8 text-center">
        <div className="space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Common questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#131515] tracking-tight">
            Frequently asked questions.
          </h2>
          <p className="text-sm text-[#494d4d] font-medium">
            Everything you need to know about setting up Med Rapidly in your clinic.
          </p>
        </div>

        <div className="space-y-3 text-left">
          {[
            {
              q: 'Do patients need to download an app from Play Store or App Store?',
              a: 'No. Patients simply point their default phone camera at the counter acrylic standee QR. The token is generated instantly in their browser with zero app download or password creation.'
            },
            {
              q: 'Does this replace our existing hospital EHR or billing software?',
              a: 'Med Rapidly operates seamlessly either as a standalone OPD reception operating system, or integrates alongside your existing hospital billing/HIS via clean webhooks and API endpoints.'
            },
            {
              q: 'How does the voice announcement feature work?',
              a: 'The doctor console uses the standard Web Speech synthesis API. Connect your computer to any Bluetooth or reception speaker, and token callouts announce clearly in natural voice.'
            },
            {
              q: 'Can elderly patients without smartphones still get a token?',
              a: 'Yes. Receptionists have a 3-click manual walk-in intake button that issues a printed or verbal token into the exact same synchronized live digital queue.'
            },
            {
              q: 'Is patient clinical health data secure and compliant?',
              a: 'Yes. All telemetry and health records are secured with 256-bit TLS encryption in transit and AES-256 at rest, following strict HIPAA and ISO 27001 healthcare data standards.'
            },
          ].map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#e8e8e8] shadow-xs overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-xs sm:text-sm text-[#131515]"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs text-[#494d4d] leading-relaxed font-normal"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── 9. BOTTOM CONVERSION CTA CARD (MATCHING FRAMER STYLE) ───────── */}
      <section className="py-16 sm:py-24 px-6 max-w-5xl mx-auto">
        <div className="bg-[#131515] text-white p-8 sm:p-14 rounded-[40px] text-center space-y-6 relative overflow-hidden shadow-2xl">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider inline-block">
            Get Started Today
          </span>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
            Build better hospital habits with less effort.
          </h2>

          <p className="text-xs sm:text-sm text-[#b8b8b8] max-w-lg mx-auto font-normal leading-relaxed">
            Eliminate waiting room chaos, speed up doctor consultations, and give your patients a modern digital experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setDemoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#131515] font-bold text-xs sm:text-sm shadow-md transition"
            >
              Start Free Trial for Your Hospital
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
            >
              Doctor Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />

      {/* Book Demo Contact Modal */}
      <ContactModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  )
}
