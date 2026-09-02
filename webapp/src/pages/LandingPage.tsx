import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode, RefreshCw, UserCheck, Users, BarChart3,
  Building2, Calendar, Smile, ShieldCheck, FileText,
  Clock, Stethoscope, ArrowRight, Play, CheckCircle2,
  MapPin, HeartPulse, ChevronRight, X, Phone, Mail,
  Volume2, Check, Sparkles, Send, Activity, Settings,
  Search, Filter, Plus, Printer, UserPlus, Download,
  TrendingUp, AlertCircle, Eye, SlidersHorizontal, Lock,
  ChevronDown, Star, Shield, Database, Cpu, Smartphone,
  Layers, CheckCircle, Network, ArrowUpRight, Award, Zap
} from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import PublicHeader from '../components/PublicHeader'

/**
 * Scroll-linked kinetic-type headline: words brighten from faint to full
 * ink progressively as the section scrolls through the viewport, rather
 * than a one-shot fade-in — each word's opacity is mapped to its own
 * slice of the section's scroll progress.
 */
function KineticSentence({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.25'] })
  const words = text.split(' ')
  return (
    <p
      ref={ref}
      className="font-display flex flex-wrap gap-x-3 gap-y-1 text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#131A2E] tracking-tight leading-[1.25]"
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
  const opacity = useTransform(progress, [start, end], [0.16, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
    </motion.span>
  )
}

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 26 } },
}

/** Counts up from 0 to `value` once, the moment it first mounts. Respects
 * prefers-reduced-motion by just showing the final value immediately. */
function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    let raf: number
    const start = performance.now()
    const duration = 1100
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <span className={className}>{display}</span>
}

/**
 * "Queue Number 13 → 12 → ..." demo the brief asks for — shows what the
 * QR flow's live queue actually looks like from the patient's side,
 * ticking down once when it scrolls into view (not on an endless loop —
 * this is a fixed demo of one real state transition, not ambient noise).
 */
const PINNED_STEPS = [
  { icon: <QrCode size={40} />, title: 'Scan the hospital QR', desc: 'Any smartphone camera, no app required — the standee is the entire interface.' },
  { icon: <Calendar size={40} />, title: 'Pick a date', desc: "Today's OPD queue, or a future date — the same flow either way." },
  { icon: <Building2 size={40} />, title: 'Choose a department', desc: 'Only departments this hospital actually runs are shown.' },
  { icon: <UserCheck size={40} />, title: 'Select an available doctor', desc: 'Only doctors on duty for that date and department appear.' },
  { icon: <RefreshCw size={40} />, title: 'Get a live queue token', desc: 'One real appointment row, atomically numbered — no collisions.' },
]

/**
 * Apple-product-page pinned scroll sequence: the section reserves
 * steps.length * 100vh of scroll distance; its content stays pinned
 * (position: sticky) for that whole distance while the active step
 * advances with scroll position, instead of each step independently
 * fading in as it crosses the viewport (the pattern used elsewhere on
 * this page). Proof of concept for one section before deciding whether
 * to use it more broadly.
 */
function PinnedQRSequence() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const idx = Math.min(PINNED_STEPS.length - 1, Math.floor(v * PINNED_STEPS.length))
      setActive(idx)
    })
  }, [scrollYProgress])

  return (
    <section ref={containerRef} style={{ height: `${PINNED_STEPS.length * 100}vh` }} className="relative bg-white">
      <div className="sticky top-0 h-screen flex items-center px-6 overflow-hidden">
        <div className="max-w-[1360px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: big crossfading icon + title for the active step */}
          <div className="lg:col-span-6 relative h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute inset-0 flex flex-col items-start justify-center gap-4"
              >
                <div className="w-20 h-20 rounded-[20px] flex items-center justify-center" style={{ backgroundColor: '#E8E8E8', color: '#0080E6' }}>
                  {PINNED_STEPS[active].icon}
                </div>
                <h3 className="font-habit-display font-medium text-3xl sm:text-4xl" style={{ color: '#000000' }}>
                  {PINNED_STEPS[active].title}
                </h3>
                <p className="text-[18px] max-w-md" style={{ color: '#494D4D' }}>
                  {PINNED_STEPS[active].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: scrubbing step list — active step full-ink and scaled
              up, others fade to faint-text, Apple-style "you are here" list */}
          <div className="lg:col-span-6 space-y-1">
            {PINNED_STEPS.map((step, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: i === active ? 1 : 0.35,
                  scale: i === active ? 1 : 0.97,
                  x: i === active ? 8 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 py-3"
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium shrink-0 font-mono"
                  style={{
                    backgroundColor: i === active ? '#0080E6' : '#E8E8E8',
                    color: i === active ? '#F7F7F7' : '#494D4D',
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-[18px] font-normal" style={{ color: i === active ? '#000000' : '#B8B8B8' }}>
                  {step.title}
                </span>
              </motion.div>
            ))}
            <p className="text-[14px] pt-4" style={{ color: '#B8B8B8' }}>
              Scroll to advance ↓
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function LiveQueueDemo() {
  const [tokensAhead, setTokensAhead] = useState(4)
  const hasRun = useRef(false)

  const startCountdown = () => {
    if (hasRun.current) return
    hasRun.current = true
    let count = 4
    const interval = setInterval(() => {
      count -= 1
      setTokensAhead(Math.max(0, count))
      if (count <= 0) clearInterval(interval)
    }, 1100)
  }

  return (
    <motion.div
      onViewportEnter={startCountdown}
      viewport={{ once: true, amount: 0.5 }}
      className="w-full max-w-[220px] p-4 bg-white rounded-2xl border border-slate-200 shadow-lg text-center space-y-2">
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Your Live Queue</span>
      <div className="flex items-center justify-center gap-2">
        <QrCode size={16} className="text-[#4361EE]" />
        <motion.span
          key={tokensAhead}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-[#18233D] font-mono"
        >
          Token 13
        </motion.span>
      </div>
      <p className="text-[10px] text-[#5E687B]">
        <motion.span key={`n-${tokensAhead}`} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="font-bold text-emerald-600">
          {tokensAhead}
        </motion.span>{' '}
        patients ahead of you
      </p>
    </motion.div>
  )
}

interface PatientRow {
  id: string
  time: string
  name: string
  token: string
  gender: string
  age: number
  status: 'Now' | 'Next' | 'Waiting' | 'Completed'
  color: string
  vitals: string
  complaint: string
  phone: string
}

export default function LandingPage() {
  useSEO({
    title: 'Med Rapidly — Smart OPD Management for Modern Hospitals | MedTech Fixaters',
    description: 'Med Rapidly by MedTech Fixaters helps hospitals manage appointments, live queues, doctors and patients efficiently with QR based smart system.',
  })

  // Pause the hero's ambient CSS animations (blobs, floating accent
  // cards, CTA glow) once it scrolls out of view. They're continuous
  // `animation: ... infinite` loops that never unmount, so left running
  // they keep compositing indefinitely for the rest of the page's life —
  // wasted GPU/battery on a section the visitor can no longer see.
  const heroRef = useRef<HTMLElement>(null)
  const [heroVisible, setHeroVisible] = useState(true)
  useEffect(() => {
    const el = heroRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // ─── ONBOARDING MODAL STATE ────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false)
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    hospital_name: '',
    city: '',
    plan: 'Hospital Pro',
  })
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  // ─── HERO REAL DASHBOARD SIMULATOR STATE ───────────────────
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Appointments' | 'Live Queue' | 'Doctors' | 'Patients' | 'Reports' | 'Settings'>('Dashboard')
  const [selectedDept, setSelectedDept] = useState<'Cardiology' | 'Orthopaedics' | 'Pediatrics'>('Cardiology')
  
  // Dynamic Real-time Counters
  const [stats, setStats] = useState({
    appointments: 256,
    patients: 132,
    completed: 98,
    noShows: 14
  })

  const [currentServingIndex, setCurrentServingIndex] = useState(0)
  const [simToast, setSimToast] = useState<string | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('p1')

  // Patient database by department
  const [deptQueues, setDeptQueues] = useState<Record<string, PatientRow[]>>({
    Cardiology: [
      { id: 'p1', time: '09:00 AM', name: 'Ravi Kumar', token: 'C-012', gender: 'Male', age: 48, status: 'Now', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', vitals: 'BP 125/82 • Pulse 74 bpm', complaint: 'Chest tightness & fatigue', phone: '+91 98765 11001' },
      { id: 'p2', time: '09:30 AM', name: 'Neha Singh', token: 'C-013', gender: 'Female', age: 34, status: 'Next', color: 'bg-blue-100 text-blue-800 border-blue-300', vitals: 'BP 118/76 • Pulse 68 bpm', complaint: 'Routine ECG follow-up', phone: '+91 98765 11002' },
      { id: 'p3', time: '10:00 AM', name: 'Mohd. Ali', token: 'C-014', gender: 'Male', age: 52, status: 'Waiting', color: 'bg-amber-100 text-amber-800 border-amber-300', vitals: 'BP 130/85 • Pulse 80 bpm', complaint: 'Post-angioplasty check', phone: '+91 98765 11003' },
      { id: 'p4', time: '10:30 AM', name: 'Sunita Devi', token: 'C-015', gender: 'Female', age: 61, status: 'Waiting', color: 'bg-amber-100 text-amber-800 border-amber-300', vitals: 'BP 122/80 • Pulse 72 bpm', complaint: 'Palpitations review', phone: '+91 98765 11004' },
      { id: 'p4b', time: '11:00 AM', name: 'Kishore Patel', token: 'C-016', gender: 'Male', age: 45, status: 'Waiting', color: 'bg-amber-100 text-amber-800 border-amber-300', vitals: 'BP 128/84 • Pulse 76 bpm', complaint: 'Shortness of breath', phone: '+91 98765 11005' },
    ],
    Orthopaedics: [
      { id: 'p5', time: '09:15 AM', name: 'Vikram Mehta', token: 'ORT-007', gender: 'Male', age: 41, status: 'Now', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', vitals: 'SpO2 99% • Normal gait', complaint: 'Right knee acute pain', phone: '+91 98765 22001' },
      { id: 'p6', time: '09:45 AM', name: 'Ananya Sharma', token: 'ORT-008', gender: 'Female', age: 29, status: 'Next', color: 'bg-blue-100 text-blue-800 border-blue-300', vitals: 'SpO2 98% • Normal', complaint: 'Lumbar spine MRI review', phone: '+91 98765 22002' },
      { id: 'p7', time: '10:15 AM', name: 'Harish Patel', token: 'ORT-009', gender: 'Male', age: 55, status: 'Waiting', color: 'bg-amber-100 text-amber-800 border-amber-300', vitals: 'SpO2 99% • Normal', complaint: 'Fracture cast removal', phone: '+91 98765 22003' },
    ],
    Pediatrics: [
      { id: 'p8', time: '09:00 AM', name: 'Baby Aarav', token: 'PED-015', gender: 'Male', age: 2, status: 'Now', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', vitals: 'Temp 98.6°F • Wt 11.2kg', complaint: 'Vaccination dose 3 MMR', phone: '+91 98765 33001' },
      { id: 'p9', time: '09:30 AM', name: 'Zoya Khan', token: 'PED-016', gender: 'Female', age: 4, status: 'Next', color: 'bg-blue-100 text-blue-800 border-blue-300', vitals: 'Temp 99.1°F • Wt 14.5kg', complaint: 'Seasonal cough & fever', phone: '+91 98765 33002' },
      { id: 'p10', time: '10:00 AM', name: 'Rohan Joshi', token: 'PED-017', gender: 'Male', age: 6, status: 'Waiting', color: 'bg-amber-100 text-amber-800 border-amber-300', vitals: 'Temp 98.4°F • Wt 18.0kg', complaint: 'General growth checkup', phone: '+91 98765 33003' },
    ]
  })

  // Doctor roster data
  const [doctorsList, setDoctorsList] = useState([
    { id: 'd1', name: 'Dr. Amit Sharma', dept: 'Cardiology', room: 'Room 101', fee: '₹700', active: true, served: 24, limit: 45 },
    { id: 'd2', name: 'Dr. Ashok Verma', dept: 'Orthopaedics', room: 'Room 104', fee: '₹650', active: true, served: 18, limit: 40 },
    { id: 'd3', name: 'Dr. Priya Sen', dept: 'Pediatrics', room: 'Room 108', fee: '₹600', active: true, served: 31, limit: 50 },
    { id: 'd4', name: 'Dr. Rajesh Nair', dept: 'Neurology', room: 'Room 201', fee: '₹900', active: false, served: 0, limit: 30 },
  ])

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Doctor Availability Section Filter State
  const [availDept, setAvailDept] = useState<string>('Cardiology')
  const [availDate, setAvailDate] = useState<string>('Today')

  const currentPatients = deptQueues[selectedDept] || []
  const activeServing = currentPatients[currentServingIndex] || currentPatients[0]
  const nextServing = currentPatients[currentServingIndex + 1]
  const waitingCount = Math.max(0, currentPatients.length - (currentServingIndex + 1))

  // Call Next Patient
  const handleCallNextPatient = () => {
    if (currentServingIndex < currentPatients.length - 1) {
      const nextIdx = currentServingIndex + 1
      setCurrentServingIndex(nextIdx)
      
      const updatedList = currentPatients.map((p, idx) => {
        if (idx === nextIdx) return { ...p, status: 'Now' as const, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
        if (idx === nextIdx + 1) return { ...p, status: 'Next' as const, color: 'bg-blue-100 text-blue-800 border-blue-300' }
        if (idx < nextIdx) return { ...p, status: 'Completed' as const, color: 'bg-slate-100 text-slate-500 border-slate-200' }
        return p
      })

      setDeptQueues({ ...deptQueues, [selectedDept]: updatedList })
      setSelectedPatientId(updatedList[nextIdx].id)
      
      setSimToast(`📢 Calling Token ${updatedList[nextIdx].token} (${updatedList[nextIdx].name}) to Room 101!`)
      setTimeout(() => setSimToast(null), 3200)
    } else {
      setSimToast('All queue patients for this session have been completed!')
      setTimeout(() => setSimToast(null), 2500)
    }
  }

  // Complete Consultation & Send WhatsApp Rx
  const handleCompleteRx = () => {
    setStats(prev => ({ ...prev, completed: prev.completed + 1 }))
    setSimToast(`✅ WhatsApp Rx & Invoice dispatched to ${activeServing?.name || 'Patient'}!`)
    setTimeout(() => setSimToast(null), 3200)
  }

  const handleToggleDoctorDuty = (docId: string) => {
    setDoctorsList(prev => prev.map(d => d.id === docId ? { ...d, active: !d.active } : d))
    setSimToast('Doctor duty status updated live across all OPD kiosks!')
    setTimeout(() => setSimToast(null), 2500)
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLeadSubmitted(true)
    setTimeout(() => {
      setModalOpen(false)
      setLeadSubmitted(false)
      setLeadForm({ name: '', phone: '', email: '', hospital_name: '', city: '', plan: 'Hospital Pro' })
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-white antialiased selection:bg-[#0080E6] selection:text-white" style={{ color: '#131515', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      {/* ─── NAVIGATION BAR (shared, animated on scroll) ─────── */}
      <PublicHeader />

      {/* ─── HERO SECTION ───────────────────────────────────── */}
      <section
        id="home"
        ref={heroRef}
        className={`relative pt-14 lg:pt-16 pb-20 px-6 max-w-[1360px] mx-auto overflow-hidden ${heroVisible ? '' : 'hero-anims-paused'}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: HEADLINE, DESCRIPTION & ACTIONS
              Habitline token spec (structure/type/shape), recolored to
              #0080E6 — sampled from the actual logo — as the sole action
              color instead of the reference's green: flat colors only
              (no gradients), pill geometry (rounded 50px) on every
              button, chips at rounded-full with a surface-muted #E8E8E8
              fill, Poppins/500 for display type. */}
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 space-y-6 text-left pt-2"
          >
            <motion.div
              variants={heroItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[14px] font-normal"
              style={{ backgroundColor: '#E8E8E8', color: '#131515' }}
            >
              <Sparkles size={12} />
              <span>Digital Hospital Operating System</span>
            </motion.div>

            <motion.h1
              variants={heroItem}
              className="font-habit-display font-medium tracking-tight leading-[1]"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)', color: '#000000' }}
            >
              Your hospital.
              <br />
              Connected <span style={{ color: '#0080E6' }}>digitally.</span>
            </motion.h1>

            <motion.p variants={heroItem} className="text-[18px] font-normal leading-[1.4] max-w-lg" style={{ color: '#494D4D' }}>
              One platform for hospital administration, doctor dashboards, and QR-based patient appointments — live, isolated per hospital, built for modern OPDs.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={heroItem} className="flex flex-wrap items-center gap-3 pt-1">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 text-[15px] font-medium rounded-[50px] transition-shadow"
                style={{ backgroundColor: '#0080E6', color: '#F7F7F7', boxShadow: 'rgba(0, 128, 230, 0.5) 0px 10px 15px 0px' }}
              >
                Get Started Free
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setModalOpen(true)}
                className="px-5 py-2.5 text-[15px] font-medium rounded-[50px] flex items-center gap-2"
                style={{ backgroundColor: '#E8E8E8', color: '#131515' }}
              >
                <Play size={12} fill="#131515" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* 4 Feature Chips Row */}
            <motion.div variants={heroItem} className="pt-2 flex flex-wrap items-center gap-2.5">
              {[
                { icon: <QrCode size={13} />, label: 'QR Based Booking' },
                { icon: <RefreshCw size={13} />, label: 'Live Queue' },
                { icon: <Building2 size={13} />, label: 'OPD Management' },
                { icon: <ShieldCheck size={13} />, label: 'Secure & Reliable' },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className="px-3.5 py-1.5 rounded-full text-[14px] font-normal flex items-center gap-1.5"
                  style={{ backgroundColor: '#E8E8E8', color: '#131515' }}
                >
                  {chip.icon} {chip.label}
                </span>
              ))}
            </motion.div>

            {/* Interactive Simulator Tip Card */}
            <motion.div variants={heroItem} className="p-4 rounded-[20px] text-[14px] space-y-1" style={{ backgroundColor: '#F7F7F7', boxShadow: 'rgba(19, 21, 21, 0.05) 0px 8px 20px 0px' }}>
              <span className="font-medium flex items-center gap-1.5" style={{ color: '#0080E6' }}>
                <Sparkles size={14} /> Live Interactive Simulator
              </span>
              <p style={{ color: '#494D4D' }}>
                Click on any sidebar button (<strong style={{ color: '#131515' }}>Live Queue, Appointments, Doctors, Patients, Reports, Settings</strong>) to test real-time OPD hospital controls.
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: REAL DASHBOARD SIMULATOR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.35 }}
            className="lg:col-span-7 relative"
          >
            {/* Floating accent cards — nod to the connected-ecosystem feel
                without touching the working simulator's internal state */}
            <div className="animate-float-card-up hidden xl:flex absolute -top-6 -left-8 z-20 items-center gap-2 px-3.5 py-2.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <QrCode size={16} />
              </div>
              <div className="leading-tight">
                <span className="block text-[10px] font-bold text-slate-800">Queue #13</span>
                <span className="block text-[9px] text-slate-400">Just booked via QR</span>
              </div>
            </div>
            <div className="animate-float-card-down hidden xl:flex absolute -bottom-5 -right-6 z-20 items-center gap-2 px-3.5 py-2.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#4361EE] flex items-center justify-center">
                <Activity size={16} />
              </div>
              <div className="leading-tight">
                <span className="block text-[10px] font-bold text-slate-800">Dr. Mehta</span>
                <span className="block text-[9px] text-slate-400">In consultation</span>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-[#E6E9F0] shadow-2xl shadow-slate-300/60 p-4 sm:p-5 relative overflow-hidden transition-all min-h-[460px]">
              <AnimatePresence>
                {simToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                    className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-[#18233D] text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl border border-indigo-500/30 flex items-center gap-2"
                  >
                    <Sparkles size={14} className="text-amber-400" />
                    <span>{simToast}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mockup Header Bar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img src="/assets/brand-icon.png" alt="Logo" className="w-6 h-6 object-contain" />
                  <div>
                    <span className="font-bold text-xs text-[#18233D] block leading-tight">City Care Multi-Specialty Hospital</span>
                    <span className="text-[9px] text-[#5E687B]">Live OPD Telemetry Node</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {(['Cardiology', 'Orthopaedics', 'Pediatrics'] as const).map(dept => (
                    <button
                      key={dept}
                      onClick={() => {
                        setSelectedDept(dept)
                        setCurrentServingIndex(0)
                        setSimToast(`Switched to ${dept} OPD Station`)
                        setTimeout(() => setSimToast(null), 2000)
                      }}
                      className={`relative px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                        selectedDept === dept ? 'text-[#4361EE]' : 'text-[#5E687B] hover:text-[#18233D]'
                      }`}
                    >
                      {selectedDept === dept && (
                        <motion.span
                          layoutId="dept-pill"
                          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                          className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                        />
                      )}
                      {dept}
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#5E687B]">
                  <span className="flex items-center gap-1 font-semibold text-[10px]"><Calendar size={11} /> May 31, 2026</span>
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-[#4361EE] flex items-center justify-center font-bold text-[10px]">
                    👨‍⚕️
                  </div>
                </div>
              </div>

              {/* Mockup Body Grid */}
              <div className="grid grid-cols-12 gap-3 pt-3">
                {/* Left Interactive Sidebar */}
                <div className="col-span-12 sm:col-span-3 space-y-1 text-[11px] font-semibold text-[#5E687B] border-r border-slate-100 pr-2">
                  {[
                    { key: 'Dashboard', icon: <Building2 size={13} /> },
                    { key: 'Appointments', icon: <Calendar size={13} /> },
                    { key: 'Live Queue', icon: <RefreshCw size={13} /> },
                    { key: 'Doctors', icon: <UserCheck size={13} /> },
                    { key: 'Patients', icon: <Users size={13} /> },
                    { key: 'Reports', icon: <BarChart3 size={13} /> },
                    { key: 'Settings', icon: <Settings size={13} /> },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key as any)
                        setSimToast(`Opened ${tab.key} View`)
                        setTimeout(() => setSimToast(null), 1500)
                      }}
                      className={`relative w-full text-left px-2.5 py-2 rounded-xl transition flex items-center gap-2 ${
                        activeTab === tab.key ? 'text-[#4361EE] font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      {activeTab === tab.key && (
                        <motion.span
                          layoutId="sidebar-pill"
                          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                          className="absolute inset-0 bg-indigo-50 rounded-xl shadow-sm -z-10"
                        />
                      )}
                      {tab.icon}
                      <span>{tab.key}</span>
                      {activeTab === tab.key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4361EE]" />}
                    </button>
                  ))}

                  <div className="pt-3 px-1 hidden sm:block">
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-left space-y-1">
                      <span className="text-[9px] font-bold text-emerald-800 uppercase block">OPD Kiosk Node</span>
                      <span className="text-[10px] text-emerald-950 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Room 101 Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Main Dashboard Area: DYNAMIC VIEWS */}
                <div className="col-span-12 sm:col-span-9 space-y-3">
                  {/* VIEW 1: DASHBOARD */}
                  {activeTab === 'Dashboard' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold text-[#5E687B] uppercase tracking-wider">
                          Today's Telemetry & OPD Control
                        </div>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ● Live Realtime Sync
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { val: stats.appointments, label: 'Appointments', color: 'text-[#4361EE]' },
                          { val: stats.patients, label: 'Patients', color: 'text-amber-600' },
                          { val: stats.completed, label: 'Completed', color: 'text-emerald-600' },
                          { val: stats.noShows, label: 'No Shows', color: 'text-rose-600' },
                        ].map((st, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-slate-50/80 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all rounded-xl border border-slate-100 text-center"
                          >
                            <AnimatedCounter value={st.val} className={`text-base font-black ${st.color} block font-mono`} />
                            <span className="text-[9px] text-[#5E687B] font-semibold">{st.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#5E687B]">Live OPD Queue</span>
                            <span className="text-[9px] text-[#4361EE] font-bold">{selectedDept}</span>
                          </div>

                          <div>
                            <span className="text-[11px] font-black text-[#18233D] block">
                              {selectedDept === 'Cardiology' ? 'Dr. Amit Sharma' : selectedDept === 'Orthopaedics' ? 'Dr. Ashok Verma' : 'Dr. Priya Sen'}
                            </span>
                            <span className="text-[9px] text-[#5E687B]">Room 101 • General OPD</span>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-sm space-y-1">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Now In Consultation</span>
                            <div className="flex items-baseline justify-between">
                              <span className="text-xl font-black text-[#4361EE] font-mono tracking-tight">
                                {activeServing ? activeServing.token : 'C-012'}
                              </span>
                              <span className="text-[10px] font-bold text-[#18233D]">
                                {activeServing ? activeServing.name : 'Ravi Kumar'}
                              </span>
                            </div>
                            <p className="text-[8px] text-slate-500 font-mono pt-0.5">
                              {activeServing?.vitals}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                            <button
                              onClick={handleCallNextPatient}
                              className="w-full py-1.5 bg-[#4361EE] hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition flex items-center justify-center gap-1 active:scale-95"
                            >
                              <Volume2 size={12} />
                              <span>Call Next</span>
                            </button>

                            <button
                              onClick={handleCompleteRx}
                              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition flex items-center justify-center gap-1 active:scale-95"
                            >
                              <Send size={11} />
                              <span>Send Rx</span>
                            </button>
                          </div>

                          <div className="text-[9px] text-slate-500 flex items-center justify-between pt-0.5">
                            <span>Next: <strong className="text-slate-800">{nextServing ? nextServing.token : 'None'}</strong></span>
                            <span><strong className="text-emerald-700">{waitingCount}</strong> Waiting</span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-left space-y-1.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-[#5E687B]">Today's Appointments</span>
                            <span className="text-[8px] text-slate-400 font-medium">Click to Inspect</span>
                          </div>

                          <div className="space-y-1 max-h-[160px] overflow-y-auto">
                            {currentPatients.map((apt) => (
                              <div
                                key={apt.id}
                                onClick={() => setSelectedPatientId(apt.id)}
                                className={`flex items-center justify-between text-[9px] p-1.5 rounded-lg cursor-pointer transition ${
                                  selectedPatientId === apt.id
                                    ? 'bg-white border border-indigo-200 shadow-sm'
                                    : 'hover:bg-white/60'
                                }`}
                              >
                                <span className="text-slate-500 font-mono text-[8px]">{apt.time}</span>
                                <div className="truncate max-w-[75px]">
                                  <span className="font-bold text-[#18233D] block truncate">{apt.name}</span>
                                  <span className="text-[8px] text-slate-400 font-mono">{apt.token}</span>
                                </div>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${apt.color}`}>
                                  {apt.status}
                                </span>
                              </div>
                            ))}
                          </div>

                          {selectedPatientId && (
                            <div className="p-1.5 bg-indigo-50/70 rounded-lg border border-indigo-100 text-[8px] text-[#18233D]">
                              <span className="font-bold text-[#4361EE]">Complaint: </span>
                              {currentPatients.find(p => p.id === selectedPatientId)?.complaint}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: APPOINTMENTS */}
                  {activeTab === 'Appointments' && (
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-[#18233D]">OPD Appointment Schedule</h4>
                          <span className="text-[9px] text-[#5E687B]">Real-time patient check-in roster</span>
                        </div>
                        <button
                          onClick={() => setModalOpen(true)}
                          className="px-2.5 py-1 bg-[#4361EE] text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <Plus size={11} /> New Booking
                        </button>
                      </div>

                      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-[9px]">
                          <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[8px] border-b border-slate-200">
                            <tr>
                              <th className="p-2">Token</th>
                              <th className="p-2">Patient</th>
                              <th className="p-2">Doctor</th>
                              <th className="p-2">Time</th>
                              <th className="p-2">Status</th>
                              <th className="p-2 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/60 font-medium">
                            {currentPatients.map(p => (
                              <tr key={p.id} className="hover:bg-white transition">
                                <td className="p-2 font-mono font-bold text-[#4361EE]">{p.token}</td>
                                <td className="p-2 font-bold text-[#18233D]">{p.name} ({p.age}y)</td>
                                <td className="p-2 text-slate-600">{selectedDept}</td>
                                <td className="p-2 font-mono text-slate-500">{p.time}</td>
                                <td className="p-2">
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${p.color}`}>
                                    {p.status}
                                  </span>
                                </td>
                                <td className="p-2 text-right">
                                  <button
                                    onClick={() => {
                                      setSimToast(`Printed OPD Slip for ${p.name} (${p.token})`)
                                      setTimeout(() => setSimToast(null), 2500)
                                    }}
                                    className="p-1 hover:bg-slate-200 rounded text-slate-600"
                                    title="Print Token Slip"
                                  >
                                    <Printer size={11} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* VIEW 3: LIVE QUEUE */}
                  {activeTab === 'Live Queue' && (
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-[#18233D]">OPD Room Calling Display</h4>
                          <span className="text-[9px] text-[#5E687B]">Live visual buzzer & queue broadcast</span>
                        </div>
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-bold rounded-full border border-rose-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          Live TV Mode
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { room: 'Room 101', doc: 'Dr. Amit Sharma', dept: 'Cardiology', now: activeServing.token, next: nextServing ? nextServing.token : 'C-014', color: 'border-[#4361EE] text-[#4361EE]' },
                          { room: 'Room 104', doc: 'Dr. Ashok Verma', dept: 'Orthopaedics', now: 'ORT-007', next: 'ORT-008', color: 'border-emerald-500 text-emerald-600' },
                          { room: 'Room 108', doc: 'Dr. Priya Sen', dept: 'Pediatrics', now: 'PED-015', next: 'PED-016', color: 'border-amber-500 text-amber-600' },
                        ].map((rm, i) => (
                          <div key={i} className={`p-3 bg-white rounded-xl border-2 ${rm.color} shadow-sm space-y-1 text-center`}>
                            <span className="text-[9px] font-bold text-slate-400 block">{rm.room} • {rm.dept}</span>
                            <span className="text-[10px] font-bold text-slate-900 truncate block">{rm.doc}</span>
                            <div className="py-2 bg-slate-50 rounded-lg">
                              <span className="text-[8px] text-slate-400 uppercase block font-bold">Now Calling</span>
                              <span className="text-2xl font-black font-mono block tracking-tight">{rm.now}</span>
                            </div>
                            <span className="text-[8px] text-slate-500 block">Next: <strong>{rm.next}</strong></span>
                          </div>
                        ))}
                      </div>

                      <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[#4361EE] flex items-center gap-1">
                          <Volume2 size={13} /> Automated Voice Announcement:
                        </span>
                        <span className="font-mono text-slate-700">"Token {activeServing.token}, Please Proceed to Room 101"</span>
                      </div>
                    </div>
                  )}

                  {/* VIEW 4: DOCTORS */}
                  {activeTab === 'Doctors' && (
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-[#18233D]">Doctor Roster & OPD Duty</h4>
                          <span className="text-[9px] text-[#5E687B]">Toggle availability & consultation limits</span>
                        </div>
                        <button
                          onClick={() => setModalOpen(true)}
                          className="px-2.5 py-1 bg-[#4361EE] text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <UserPlus size={11} /> Add Doctor
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {doctorsList.map((doc) => (
                          <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="font-bold text-xs text-[#18233D] block">{doc.name}</span>
                                <span className="text-[9px] text-[#4361EE] font-semibold">{doc.dept} • {doc.room}</span>
                              </div>
                              <button
                                onClick={() => handleToggleDoctorDuty(doc.id)}
                                className={`px-2 py-0.5 rounded-full text-[8px] font-bold transition ${
                                  doc.active
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {doc.active ? '● In OPD' : '○ On Break'}
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-[9px] text-slate-600 pt-1 border-t border-slate-200/60">
                              <span>Fee: <strong>{doc.fee}</strong></span>
                              <span>Served: <strong>{doc.served}/{doc.limit}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VIEW 5: PATIENTS */}
                  {activeTab === 'Patients' && (
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-[#18233D]">Patient EMR Directory</h4>
                          <span className="text-[9px] text-[#5E687B]">Medical records & prescription history</span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search name/UHID..."
                            className="px-2.5 py-1 text-[9px] bg-slate-100 border border-slate-200 rounded-lg w-28"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {currentPatients.map((pt) => (
                          <div key={pt.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[9px]">
                            <div className="space-y-0.5">
                              <span className="font-bold text-[#18233D] block">{pt.name} ({pt.gender}, {pt.age}y)</span>
                              <span className="text-[8px] text-slate-500 font-mono">{pt.phone} • {pt.complaint}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#4361EE]">{pt.vitals.split('•')[0]}</span>
                              <button
                                onClick={() => {
                                  setSimToast(`Dispatched EMR Summary to ${pt.name}`)
                                  setTimeout(() => setSimToast(null), 2500)
                                }}
                                className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-[#4361EE] font-bold rounded-lg text-[8px]"
                              >
                                View Rx
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VIEW 6: REPORTS */}
                  {activeTab === 'Reports' && (
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-[#18233D]">OPD Analytics & Performance</h4>
                          <span className="text-[9px] text-[#5E687B]">Doctor turnaround time & patient footfall</span>
                        </div>
                        <button
                          onClick={() => {
                            setSimToast('Downloaded Today OPD Summary PDF')
                            setTimeout(() => setSimToast(null), 2500)
                          }}
                          className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[9px] font-bold rounded-lg flex items-center gap-1"
                        >
                          <Download size={11} /> Export PDF
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                          <span className="text-[8px] text-indigo-700 font-bold uppercase block">Avg Wait Time</span>
                          <span className="text-lg font-black text-[#4361EE] font-mono">11.4 mins</span>
                        </div>
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                          <span className="text-[8px] text-emerald-700 font-bold uppercase block">Consultation Rate</span>
                          <span className="text-lg font-black text-emerald-700 font-mono">94.2%</span>
                        </div>
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                          <span className="text-[8px] text-amber-700 font-bold uppercase block">Peak Footfall</span>
                          <span className="text-lg font-black text-amber-700 font-mono">10:30 AM</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[9px] space-y-1">
                        <span className="font-bold text-slate-700 block">Department Footfall Breakdown:</span>
                        <div className="space-y-1 pt-1">
                          <div>
                            <div className="flex justify-between text-[8px] font-semibold text-slate-500 mb-0.5">
                              <span>Cardiology (112 patients)</span>
                              <span>44%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#4361EE] h-full w-[44%]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[8px] font-semibold text-slate-500 mb-0.5">
                              <span>Orthopaedics (82 patients)</span>
                              <span>32%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full w-[32%]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW 7: SETTINGS */}
                  {activeTab === 'Settings' && (
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-[#18233D]">Hospital OPD System Configuration</h4>
                          <span className="text-[9px] text-[#5E687B]">Facility parameters, QR tokens & WhatsApp gateway</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-bold rounded border border-emerald-200">
                          Enterprise Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[9px]">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <span className="font-bold text-[#18233D] block">Facility Identity</span>
                          <p className="text-slate-600">City Care Multi-Specialty Hospital</p>
                          <p className="text-slate-400 font-mono text-[8px]">Lic: MED-REG-2026-HQ • Mumbai</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <span className="font-bold text-[#18233D] block">Public QR Standee</span>
                          <p className="text-[#4361EE] font-mono text-[8px]">/book/QR-CITYCARE</p>
                          <button
                            onClick={() => {
                              setSimToast('Copied Hospital Booking Standee Link!')
                              setTimeout(() => setSimToast(null), 2500)
                            }}
                            className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 font-bold rounded text-[8px]"
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[9px] text-slate-700 flex items-center justify-between">
                        <span>WhatsApp Automation Webhook:</span>
                        <strong className="text-emerald-700">Connected & Verified</strong>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── KINETIC MANIFESTO ─────────────────────────────────
          Words brighten progressively as this scrolls through the
          viewport (see KineticSentence above) — the section's own scroll
          progress drives each word's opacity, not a one-shot trigger. */}
      <section className="py-24 sm:py-32 px-6 bg-white border-t border-[#E6E9F0]">
        <div className="max-w-4xl mx-auto">
          <KineticSentence text="Every hospital, every doctor, every patient appointment — connected on one platform, isolated by design, live the moment it happens." />
        </div>
      </section>

      {/* ─── SECTION 2: EVERYTHING YOU NEED TO RUN YOUR HOSPITAL ──── */}
      <section id="features" className="py-16 bg-white border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1360px] mx-auto space-y-10 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-[#18233D] tracking-tight">
              Everything you need to run your hospital smoothly
            </h2>
            <p className="text-xs sm:text-sm text-[#5E687B]">
              Med Rapidly is a complete OPD management system designed for hospitals of all sizes.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center"
          >
            {[
              { title: 'QR Based Booking', desc: 'Patients scan QR & book appointments instantly.', icon: <QrCode size={22} className="text-[#4361EE]" />, bg: 'bg-indigo-50' },
              { title: 'Live Queue Management', desc: 'Real-time queue updates for better patient experience.', icon: <RefreshCw size={22} className="text-emerald-600" />, bg: 'bg-emerald-50' },
              { title: 'Doctor Dashboard', desc: 'Doctors get their own smart dashboard & queue.', icon: <UserCheck size={22} className="text-amber-600" />, bg: 'bg-amber-50' },
              { title: 'Patient Management', desc: 'Manage patient history, records and prescriptions.', icon: <Users size={22} className="text-blue-600" />, bg: 'bg-blue-50' },
              { title: 'Reports & Analytics', desc: 'Get detailed insights and improve hospital performance.', icon: <BarChart3 size={22} className="text-rose-600" />, bg: 'bg-rose-50' },
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } }}
                whileHover={{ y: -6 }}
                className="bg-white p-6 rounded-2xl border border-[#E6E9F0] shadow-sm hover:shadow-xl hover:border-indigo-200 transition-shadow text-center space-y-3"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center ${feat.bg}`}
                >
                  {feat.icon}
                </motion.div>
                <h3 className="text-sm font-black text-[#18233D]">{feat.title}</h3>
                <p className="text-xs text-[#5E687B] leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── NEW SECTION 1: PLATFORM ARCHITECTURE SECTION ──── */}
      <section id="architecture" className="py-24 bg-gradient-to-b from-[#FCFCFE] via-[#F3F6FD] to-[#FCFCFE] px-6 relative overflow-hidden">
        <div className="max-w-[1360px] mx-auto space-y-16 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              One Connected Healthcare Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Everything Connected. Nothing Fragmented.
            </h2>
            <p className="text-sm text-[#5E687B] leading-relaxed">
              From hospital administration to doctors and patients, MedTech Fixaters connects every part of the OPD workflow in one secure digital platform.
            </p>
          </div>

          {/* Central Platform Glassmorphism Network Map */}
          <div className="relative max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-500/10">
            {/* Glowing lines background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(67,97,238,0.12)_0,transparent_70%)] pointer-events-none" />

            {/* Top Node: Platform Admin */}
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-100 shadow-md flex items-center gap-3 max-w-xs text-left hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#18233D]">Platform Admin</h4>
                  <p className="text-[10px] text-[#5E687B]">Master security & hospital provisioning</p>
                </div>
              </div>
            </div>

            {/* Middle Row: Hospital Node <-> CENTRAL PLATFORM <-> Doctors Node */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left Node: Hospital */}
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-100 shadow-md flex items-center gap-3 text-left hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4361EE] flex items-center justify-center font-bold shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#18233D]">Hospital Admin</h4>
                  <p className="text-[10px] text-[#5E687B]">Facility OPD, rosters & counters</p>
                </div>
              </div>

              {/* CENTER HUB: MEDTECH FIXATERS */}
              <div className="p-6 rounded-3xl bg-gradient-to-tr from-[#4361EE] to-[#5D4CC8] text-white shadow-2xl shadow-indigo-500/40 text-center space-y-2 border-2 border-white/40 transform hover:scale-105 transition-all">
                <img src="/assets/brand-icon.png" alt="Logo" className="w-10 h-10 object-contain mx-auto brightness-200" />
                <h3 className="text-base font-black tracking-tight">MedTech Fixaters</h3>
                <p className="text-[10px] text-indigo-100 font-medium">Real-Time Clinical Telemetry & EMR Engine</p>
                <span className="inline-block px-2.5 py-0.5 bg-white/20 text-white rounded-full text-[9px] font-bold">
                  Zero-Latency Data Mesh
                </span>
              </div>

              {/* Right Node: Doctors */}
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-100 shadow-md flex items-center gap-3 text-left hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#18233D]">Doctors</h4>
                  <p className="text-[10px] text-[#5E687B]">Live queue & 30s prescription pad</p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Patients <-> QR System */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mt-8">
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-100 shadow-md flex items-center gap-3 text-left hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#18233D]">Patients</h4>
                  <p className="text-[10px] text-[#5E687B]">Self-service booking & live tracking</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-100 shadow-md flex items-center gap-3 text-left hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">
                  <QrCode size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#18233D]">Smart QR System</h4>
                  <p className="text-[10px] text-[#5E687B]">Facility isolated scan-to-book tokens</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEW SECTION 2: LIVE QUEUE EXPERIENCE SECTION ──── */}
      <section id="live-queue-exp" className="py-24 bg-white px-6">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Real-Time Queue Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#18233D] tracking-tight leading-tight">
              Your Queue. Live. <br />
              <span className="text-[#4361EE]">Accurate.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5E687B] leading-relaxed">
              Patients see their exact live position and turnaround estimate on their smartphones, while doctors manage consultations without physical crowded hallway chaos.
            </p>

            {/* 3 Floating Glass Stats Cards */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-md text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#18233D] block font-mono">12</span>
                <span className="text-[10px] font-bold text-[#5E687B]">Patients Waiting</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-200 shadow-md text-center bg-indigo-50/40">
                <span className="text-2xl sm:text-3xl font-black text-[#4361EE] block font-mono">C-013</span>
                <span className="text-[10px] font-bold text-[#4361EE]">Your Current Token</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-md text-center">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 block font-mono">03</span>
                <span className="text-[10px] font-bold text-emerald-700">Patients Ahead</span>
              </div>
            </div>
          </div>

          {/* Right Mobile Phone Queue Stream Mockup */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="w-[300px] bg-slate-900 p-3 rounded-[38px] shadow-2xl shadow-indigo-500/20 border-4 border-slate-800 space-y-3">
              {/* Dynamic Island */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />

              <div className="bg-[#F8FAFC] rounded-[28px] p-4 text-center space-y-3">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] font-bold text-[#4361EE] uppercase tracking-wider block">City Care Hospital</span>
                  <h4 className="text-xs font-black text-slate-900">Dr. Amit Sharma • Room 101</h4>
                </div>

                {/* Main Live Token Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#4361EE] to-[#5D4CC8] text-white space-y-1 shadow-lg shadow-indigo-500/30">
                  <span className="text-[9px] text-indigo-100 uppercase tracking-wider font-semibold block">Your Token</span>
                  <span className="text-3xl font-black font-mono block tracking-tight">C-013</span>
                  <span className="text-[10px] font-bold text-emerald-300 block">● Live Position #4</span>
                </div>

                {/* Stats & Turnaround */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex justify-between text-xs">
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 font-bold block">Ahead of You</span>
                    <strong className="text-slate-800 text-sm font-mono">3 Patients</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-bold block">Estimated Wait</span>
                    <strong className="text-[#4361EE] text-sm font-mono">~18 mins</strong>
                  </div>
                </div>

                {/* Floating Notification Snippet */}
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-left flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <p className="text-[9px] text-emerald-900 font-medium">
                    Dr. Amit completed a patient. Position updated: <strong>5 → 4</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEW SECTION 3: SMART QR BOOKING SECTION ───────── */}
      <section id="qr-booking" className="py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white px-6">
        <div className="max-w-[1360px] mx-auto bg-white/70 backdrop-blur-xl rounded-3xl border border-white shadow-2xl p-8 sm:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Realistic Acrylic QR Standee Mockup + live queue demo */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              className="lg:col-span-5 flex flex-col items-center gap-5"
            >
              <div className="w-64 bg-gradient-to-b from-white to-slate-50 p-5 rounded-2xl border-2 border-slate-200 shadow-2xl text-center space-y-3 relative overflow-hidden">
                <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto" />
                <div className="flex items-center justify-center gap-2">
                  <img src="/assets/brand-icon.png" alt="Logo" className="w-5 h-5 object-contain" />
                  <span className="font-bold text-xs text-[#18233D]">Hospital OPD Digital Intake</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Dedicated Hospital QR</span>
                  <h4 className="text-sm font-black text-[#18233D]">Scan for Live Digital Token</h4>
                </div>

                {/* Scannable QR Graphic with a passing scan-line */}
                <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-xl border border-slate-200 shadow-inner flex items-center justify-center relative overflow-hidden">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://medrapidly.com/book/QR-METROCARE"
                    alt="Scan Hospital QR"
                    className="w-full h-full object-contain"
                  />
                  <div className="animate-qr-scan absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent" />
                </div>

                <div className="text-[10px] text-[#4361EE] font-bold bg-indigo-50 py-1 px-2 rounded-lg border border-indigo-100">
                  Powered by Medtech Fixaters
                </div>
              </div>

              {/* Live queue ticking demo — "13 → 12 → 11..." the brief asks
                  for, showing what the QR flow actually produces */}
              <LiveQueueDemo />
            </motion.div>

            {/* Right: 5-Step Vertical Flow, connected by a scroll-drawn line */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                className="space-y-2"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  QR-Based Appointment Booking
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
                  One Scan. Direct Access.
                </h2>
                <p className="text-sm text-[#5E687B]">
                  Every hospital receives its own unique cryptographic QR code for patient appointment booking and automated triage.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
                className="relative space-y-3 pt-2"
              >
                {/* Connecting line, drawn top-to-bottom behind the steps */}
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-indigo-200 via-indigo-200 to-transparent -z-0" />
                {[
                  { step: '01', title: 'Scan Hospital QR', desc: 'Patient scans the physical clinic standee with any smartphone camera.' },
                  { step: '02', title: 'Select Appointment Date', desc: 'Choose today for immediate OPD queue, or book an upcoming date.' },
                  { step: '03', title: 'Choose Department', desc: 'General OPD, Cardiology, Orthopaedics, Pediatrics, and more.' },
                  { step: '04', title: 'Select Available Doctor', desc: 'System displays only doctors active and on duty for that date.' },
                  { step: '05', title: 'Receive Live Queue Token', desc: 'Permanent token number generated with zero duplicate collisions.' },
                ].map((st, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } }}
                    className="relative flex items-start gap-4 p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:-translate-y-0.5 transition-all"
                  >
                    <span className="w-8 h-8 rounded-full bg-indigo-50 text-[#4361EE] font-black text-xs flex items-center justify-center shrink-0 border border-indigo-100 font-mono">
                      {st.step}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-[#18233D]">{st.title}</h4>
                      <p className="text-[11px] text-[#5E687B]">{st.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROOF OF CONCEPT: PINNED SCROLL SEQUENCE ──────────
          Apple-product-page pattern: the section holds extra scroll
          height (steps.length * 100vh); its content pins via
          position:sticky and scrubs through steps as the user scrolls,
          rather than each step fading in independently. One section only
          — see how this feels before it's used elsewhere. */}
      <PinnedQRSequence />

      {/* ─── NEW SECTION 4: THREE SECURE WORKSPACES ─────────── */}
      <section id="workspaces" className="py-24 bg-white px-6">
        <div className="max-w-[1360px] mx-auto space-y-14 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Right Access. Right Person.
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              One Platform. Three Secure Workspaces.
            </h2>
            <p className="text-sm text-[#5E687B]">
              Role-based consoles tailored specifically for administrative control, hospital operations, and doctor consultation workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* 1. Platform Admin */}
            <div className="p-8 rounded-3xl bg-white border border-purple-100 shadow-xl shadow-purple-500/5 hover:-translate-y-1 transition space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">Root Authority</span>
                <h3 className="text-xl font-black text-[#18233D]">Platform Admin</h3>
              </div>
              <ul className="space-y-2 text-xs text-[#5E687B] font-medium">
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Provision & Onboard Hospitals</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Account Suspend / Ban / Delete</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Platform Multi-Tenant Telemetry</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Global Security Policies</li>
              </ul>
              <Link to="/mrshahidbabu" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800">
                Explore Admin Node <ArrowRight size={13} />
              </Link>
            </div>

            {/* 2. Hospital Administration */}
            <div className="p-8 rounded-3xl bg-white border border-blue-100 shadow-xl shadow-blue-500/5 hover:-translate-y-1 transition space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#4361EE] flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#4361EE] uppercase tracking-widest block">Facility Operations</span>
                <h3 className="text-xl font-black text-[#18233D]">Hospital Administration</h3>
              </div>
              <ul className="space-y-2 text-xs text-[#5E687B] font-medium">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#4361EE]" /> Manage Doctor Roster & Limits</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#4361EE]" /> Download & Print QR Standees</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#4361EE]" /> Live OPD Footfall Analytics</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#4361EE]" /> Counter Reception & Cashier Sync</li>
              </ul>
              <Link to="/hospitaladmin" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4361EE] hover:text-indigo-800">
                Explore Hospital Console <ArrowRight size={13} />
              </Link>
            </div>

            {/* 3. Doctor Workspace */}
            <div className="p-8 rounded-3xl bg-white border border-teal-100 shadow-xl shadow-teal-500/5 hover:-translate-y-1 transition space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Stethoscope size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block">Clinical Console</span>
                <h3 className="text-xl font-black text-[#18233D]">Doctor Dashboard</h3>
              </div>
              <ul className="space-y-2 text-xs text-[#5E687B] font-medium">
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-600" /> One-Click Audio/Visual Patient Caller</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-600" /> 30-Second Prescription Pad</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-600" /> WhatsApp E-Prescription Delivery</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-teal-600" /> Patient Medical History & Vitals</li>
              </ul>
              <Link to="/doctor" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-800">
                Explore Doctor Portal <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEW SECTION 5: DOCTOR AVAILABILITY SECTION ─────── */}
      <section id="doctor-availability" className="py-24 bg-slate-50/70 border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1360px] mx-auto space-y-12 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Smart Doctor Availability
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Show the Right Doctor at the Right Time.
            </h2>
            <p className="text-sm text-[#5E687B]">
              Patients see only doctors who belong to the selected hospital and are actively on duty for the appointment date.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 max-w-4xl mx-auto text-left space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Date:</span>
                {['Today', 'Tomorrow', 'Saturday, Jun 2'].map(d => (
                  <button
                    key={d}
                    onClick={() => setAvailDate(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      availDate === d ? 'bg-[#4361EE] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Department:</span>
                {['Cardiology', 'Orthopaedics', 'Pediatrics'].map(dep => (
                  <button
                    key={dep}
                    onClick={() => setAvailDept(dep)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      availDept === dep ? 'bg-indigo-50 text-[#4361EE] border border-indigo-200' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {dep}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Dr. Amit Sharma', spec: 'Interventional Cardiology', room: 'Room 101', status: 'Available', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { name: 'Dr. Neha Singh', spec: 'Clinical Cardiology', room: 'Room 102', status: 'Available', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { name: 'Dr. Rahul Verma', spec: 'Pediatric Cardiology', room: 'Room 105', status: 'Unavailable (Off Duty)', color: 'text-slate-500 bg-slate-100 border-slate-200 opacity-60' },
              ].map((doc, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-[#18233D]">{doc.name}</h4>
                      <span className="text-[10px] text-slate-500 block">{doc.spec}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${doc.color}`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-mono">
                    {doc.room} • OPD Slot: 09:00 AM - 01:00 PM
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEW SECTION 6: HOSPITAL DATA ISOLATION (DARK NAVY) ── */}
      <section id="data-isolation" className="py-24 bg-[#111827] text-white px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(67,97,238,0.2)_0,transparent_60%)] pointer-events-none" />

        <div className="max-w-[1360px] mx-auto space-y-16 text-center relative z-10">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
              Independent. Secure. Isolated.
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Every Hospital Works in Its Own Secure Space.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Hospital data stays strictly separated through database-level row security (RLS), multi-tenant cryptographic isolation, and zero-cross-facility leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            {[
              { id: 'H1', name: 'City Care Hospital', city: 'Mumbai', token: 'UUID-H1-NODE' },
              { id: 'H2', name: 'Sunrise Hospital', city: 'Pune', token: 'UUID-H2-NODE' },
              { id: 'H3', name: 'Life Plus Hospital', city: 'Delhi', token: 'UUID-H3-NODE' },
            ].map((h, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600/60 text-white font-bold text-xs flex items-center justify-center">
                    {h.id}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/60">
                    <Lock size={10} /> Encrypted RLS
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white">{h.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{h.city} • {h.token}</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-slate-300">
                  <div className="flex justify-between text-[11px]"><span>Doctors:</span> <strong className="text-white font-mono">Isolated</strong></div>
                  <div className="flex justify-between text-[11px]"><span>Patients:</span> <strong className="text-white font-mono">Isolated</strong></div>
                  <div className="flex justify-between text-[11px]"><span>Queue Stream:</span> <strong className="text-white font-mono">Isolated</strong></div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-indigo-400" />
            <span>Cryptographically Verified Multi-Hospital Architecture</span>
          </div>
        </div>
      </section>

      {/* ─── NEW SECTION 7: PLATFORM SECURITY ───────────────── */}
      <section id="security" className="py-24 bg-white px-6">
        <div className="max-w-[1360px] mx-auto space-y-14 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Security Built Into Every Layer
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Healthcare Data Deserves Better Protection.
            </h2>
            <p className="text-sm text-[#5E687B]">
              Engineered with medical privacy in mind, from multi-factor role authentication to immutable clinical audit logs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { title: 'Authentication', desc: 'Secure two-layer auth token verification with periodic heartbeat access checks.', icon: <Lock size={22} className="text-[#4361EE]" /> },
              { title: 'Data Isolation', desc: 'Each hospital strictly accesses only its own data with zero cross-tenant visibility.', icon: <Database size={22} className="text-purple-600" /> },
              { title: 'Role-Based Access', desc: 'Fine-grained permissions for platform admins, hospital managers, and doctors.', icon: <UserCheck size={22} className="text-teal-600" /> },
              { title: 'Secure Cloud Mesh', desc: 'AES-256 encrypted database architecture with advisory transaction locking.', icon: <ShieldCheck size={22} className="text-emerald-600" /> },
            ].map((sec, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  {sec.icon}
                </div>
                <h4 className="text-sm font-black text-[#18233D]">{sec.title}</h4>
                <p className="text-xs text-[#5E687B] leading-relaxed">{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW SECTION 8: PLATFORM NUMBERS ────────────────── */}
      <section className="py-16 bg-gradient-to-r from-[#4361EE] to-[#5D4CC8] text-white px-6 shadow-lg">
        <div className="max-w-[1360px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl font-black font-mono block">100+</span>
            <span className="text-xs sm:text-sm text-indigo-100 font-bold uppercase tracking-wider">Hospitals Active</span>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-4xl sm:text-5xl font-black font-mono block">10,000+</span>
            <span className="text-xs sm:text-sm text-indigo-100 font-bold uppercase tracking-wider">Appointments Managed</span>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-4xl sm:text-5xl font-black font-mono block">500+</span>
            <span className="text-xs sm:text-sm text-indigo-100 font-bold uppercase tracking-wider">Healthcare Specialists</span>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-4xl sm:text-5xl font-black font-mono block">99.9%</span>
            <span className="text-xs sm:text-sm text-indigo-100 font-bold uppercase tracking-wider">Platform Availability</span>
          </div>
        </div>
      </section>

      {/* ─── NEW SECTION 9: TESTIMONIALS CAROUSEL ───────────── */}
      <section className="py-24 bg-[#FCFCFE] border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1360px] mx-auto space-y-14 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Built for People Who Run Healthcare
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Loved by Hospitals. Trusted by Doctors.
            </h2>
            <p className="text-sm text-[#5E687B]">
              Discover why leading multi-specialty hospitals and clinics rely on MedTech Fixaters to run high-speed OPDs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                name: 'Dr. Amit Sharma',
                role: 'Head of Cardiology',
                hosp: 'City Care Multi-Specialty Hospital',
                quote: 'The live queue system has completely transformed our morning OPD. Patients wait peacefully in the cafeteria rather than crowding outside Room 101.',
                rating: 5,
              },
              {
                name: 'Dr. Neha Singh',
                role: 'Medical Director',
                hosp: 'Sunrise Hospital, Pune',
                quote: 'We cut average patient check-in time from 14 minutes down to 30 seconds with the QR standee. Doctors love the one-click WhatsApp prescription dispatch.',
                rating: 5,
              },
              {
                name: 'Dr. Rajesh Verma',
                role: 'Chief of Surgery',
                hosp: 'Life Plus Hospital, Delhi',
                quote: 'Data isolation and doctor duty management are seamless. We handle over 400 outpatients every day with zero duplicate token errors.',
                rating: 5,
              },
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-[#E6E9F0] shadow-sm hover:shadow-md transition space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={16} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#18233D] leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-black text-[#18233D]">{t.name}</h4>
                  <span className="text-[10px] text-[#4361EE] font-bold block">{t.role}</span>
                  <span className="text-[9px] text-slate-400 block">{t.hosp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW SECTION 10: FAQ ACCORDION SECTION ──────────── */}
      <section id="faq" className="py-24 bg-white border-t border-[#E6E9F0] px-6">
        <div className="max-w-[1360px] mx-auto space-y-12 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4361EE] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18233D] tracking-tight">
              Everything You Need to Know.
            </h2>
            <p className="text-sm text-[#5E687B]">
              Quick answers regarding hospital QR deployment, live queue stream, data privacy, and doctor consoles.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 text-left">
            {[
              {
                q: 'How does the hospital QR system work?',
                a: 'Each hospital receives its own dedicated cryptographic QR code. Patients scan the QR code at the reception or entrance using their phone camera, select an appointment date and doctor, and immediately receive a permanent token with live queue tracking.'
              },
              {
                q: 'Can each hospital have its own doctors?',
                a: 'Yes, absolutely. Doctors belong strictly to their assigned hospital. When patients scan Hospital H1 QR, they only see H1 active doctors. Hospital H2 doctors never appear on Hospital H1 queues.'
              },
              {
                q: 'Does each doctor have a separate queue?',
                a: 'Yes. Each doctor maintains an independent sequential queue. If Dr. Amit has 15 patients and Dr. Ashok has 8 patients, their token numbers and live queue positions advance independently without interference.'
              },
              {
                q: 'How is patient medical data protected?',
                a: 'All records are protected using PostgreSQL Row-Level Security (RLS) and cryptographic tokens. Hospital H1 cannot access or view Hospital H2 patient history, and patient tracking tokens allow live queue viewing without exposing sensitive medical charts.'
              },
              {
                q: 'Can hospital administrators manage doctor accounts?',
                a: 'Yes. Hospital Admins can add doctors, set OPD consultation fees and daily patient limits, toggle on/off duty status, and temporarily suspend or block doctor accounts from the Hospital Admin portal.'
              },
              {
                q: 'Does the platform work on mobile devices?',
                a: 'Yes. Med Rapidly is fully responsive and optimized for smartphones, tablets, TV display boards, and desktop computers with zero installation needed.'
              },
              {
                q: 'Can hospitals block doctor access?',
                a: 'Yes. Hospital administrators have instant authority to block or suspend a doctor account. A blocked doctor is barred from accessing the consultation dashboard or modifying prescriptions.'
              },
            ].map((faq, i) => (
              <div key={i} className="border border-[#E6E9F0] rounded-2xl overflow-hidden bg-[#FCFCFE]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#18233D] hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${openFaq === i ? 'rotate-180 text-[#4361EE]' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs text-[#5E687B] leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ──────────────────────────────── */}
      <section id="pricing" className="py-20 px-6 max-w-[1360px] mx-auto">
        <div className="bg-gradient-to-r from-[#3A57E8] to-[#5046E5] rounded-3xl p-8 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-500/25 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Modernize Your OPD?
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Bring appointments, doctors, patients, and live queues into one connected digital platform. Deploy in under 15 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-[#3A57E8] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
            >
              Get Started Free →
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs rounded-xl transition"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ─── PREMIUM FOOTER ─────────────────────────────────── */}
      <footer id="contact" className="bg-[#18233D] text-slate-400 py-16 px-6 text-xs border-t border-slate-800">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/assets/brand-icon.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-white">Med Rapidly</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Smart Healthcare. Connected Digitally. MedTech Fixaters transforms hospital OPDs into high-speed digital machines with QR check-in, live queue streams, and automated WhatsApp prescriptions.
            </p>
          </div>

          <div>
            <span className="font-bold text-white uppercase text-[10px] tracking-wider block mb-3">Product</span>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white transition">Overview</a></li>
              <li><Link to="/hospitaladmin" className="hover:text-white transition">Hospital Platform</Link></li>
              <li><Link to="/doctor" className="hover:text-white transition">Doctor Platform</Link></li>
              <li><Link to="/track" className="hover:text-white transition">Patient Booking & Queue</Link></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white uppercase text-[10px] tracking-wider block mb-3">Solutions</span>
            <ul className="space-y-2 text-xs">
              <li><a href="#workspaces" className="hover:text-white transition">For Hospitals</a></li>
              <li><a href="#workspaces" className="hover:text-white transition">For Doctors</a></li>
              <li><a href="#data-isolation" className="hover:text-white transition">For Healthcare Networks</a></li>
              <li><Link to="/mrshahidbabu" className="hover:text-white transition">Platform Admin</Link></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white uppercase text-[10px] tracking-wider block mb-3">Resources & Legal</span>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><a href="mailto:support@medtechfixaters.com" className="hover:text-white transition">Support: support@medtechfixaters.com</a></li>
              <li><span className="text-slate-500 font-mono">+91 98765 43210</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 MedTech Fixaters. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-slate-400">ISO 27001 & HIPAA Compliant Healthcare Architecture</span>
          </div>
        </div>
      </footer>

      {/* ─── LEAD / ONBOARDING MODAL ───────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
              <X size={18} />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#4361EE] uppercase tracking-wider">Hospital Onboarding</span>
              <h3 className="text-xl font-black text-[#18233D]">Start Free Hospital Trial</h3>
              <p className="text-xs text-[#5E687B]">Get your hospital QR code and live OPD queue running in minutes.</p>
            </div>

            {leadSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Request Submitted!</h4>
                <p className="text-xs text-emerald-700">Our medical deployment specialist will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#18233D] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#18233D] block mb-1">Hospital / Clinic Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.hospital_name}
                    onChange={e => setLeadForm({ ...leadForm, hospital_name: e.target.value })}
                    placeholder="e.g. City Care Multi-Specialty Hospital"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#18233D] block mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#18233D] block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={leadForm.city}
                      onChange={e => setLeadForm({ ...leadForm, city: e.target.value })}
                      placeholder="e.g. Mumbai"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-[#E6E9F0] rounded-xl font-semibold text-[#18233D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#4361EE] to-[#5D4CC8] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/25 mt-2"
                >
                  Deploy Hospital OPD Node →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
