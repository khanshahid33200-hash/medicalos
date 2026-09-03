import DoctorDashboardSimulator from '../components/DoctorDashboardSimulator'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode, RefreshCw, UserCheck, Users, BarChart3,
  ShieldCheck, FileText, Stethoscope, Smartphone,
  CheckCircle2, ArrowRight, MessageSquare, Clock, Zap,
  Search, SlidersHorizontal, Check, ChevronDown, Award,
  Sparkles, HeartPulse, Building2, Lock, Volume2, Printer,
  Eye, Activity, Shield, Layers, Plus, ArrowUpRight,
  Database, Cpu, CheckCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'
import { useSEO } from '../hooks/useSEO'

export default function FeaturesPage() {
  useSEO({
    title: 'Platform Features — MedTech Fixaters | Everything Your Hospital Needs',
    description: 'Explore MedTech Fixaters in depth: Connected hospital administration, separate doctor dashboards, QR appointments, live queue management, and isolated multi-tenant security.',
  })

  const [modalOpen, setModalOpen] = useState(false)

  // Interactive State for Card 4: Live Queue Management (13 -> 12 -> 11)
  const [queueNum, setQueueNum] = useState(13)
  const [patientsAhead, setPatientsAhead] = useState(12)

  const advanceQueue = () => {
    if (queueNum > 1) {
      setQueueNum(prev => prev - 1)
      setPatientsAhead(prev => Math.max(0, prev - 1))
    } else {
      setQueueNum(13)
      setPatientsAhead(12)
    }
  }

  // Interactive State for Card 5: Doctor Activity cycle
  // Available -> Called -> In Consultation -> Available
  const [doctorStatus, setDoctorStatus] = useState<'In Consultation' | 'Available' | 'Called'>('In Consultation')
  const cycleDoctorStatus = () => {
    setDoctorStatus(prev => {
      if (prev === 'In Consultation') return 'Available'
      if (prev === 'Available') return 'Called'
      return 'In Consultation'
    })
  }

  // Interactive State for Card 6: Patient Records Tabs
  const [patientRecordTab, setPatientRecordTab] = useState<'Profile' | 'History' | 'Appointments' | 'Prescriptions'>('Profile')

  // Interactive State for Card 3: QR Booking Steps (Scan -> Department -> Doctor -> Book)
  const [qrStep, setQrStep] = useState<number>(0)
  const qrStepsList = [
    { title: 'Scan QR', desc: 'Patient points camera at hospital acrylic standee', icon: <QrCode size={18} /> },
    { title: 'Select Department', desc: 'Cardiology, Orthopedics, Pediatrics, General Medicine', icon: <Building2 size={18} /> },
    { title: 'Choose Doctor', desc: 'Browse available consultants and real-time waiting count', icon: <Stethoscope size={18} /> },
    { title: 'Book Appointment', desc: 'Instant live token issued directly to mobile screen', icon: <CheckCircle2 size={18} /> },
  ]

  // Interactive State for Workflow Section (Steps 01 to 05)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0)
  const workflowSteps = [
    {
      step: '01',
      title: 'Hospital Setup',
      desc: 'Create the hospital profile and configure departments, rooms, and branding settings in under 5 minutes.',
      tag: 'Rapid Onboarding',
      preview: {
        header: 'Hospital Registration & Department Config',
        items: ['City Care Multispeciality Hospital', 'License: MED-REG-2026-WB', '4 OPD Wings Configured']
      }
    },
    {
      step: '02',
      title: 'Add Doctors',
      desc: 'Create secure doctor accounts, assign consultation rooms, and configure OPD operational hours.',
      tag: 'Role Security',
      preview: {
        header: 'Doctor Access Provisioning',
        items: ['Dr. Amit Sharma (Cardiology Room 101)', 'Dr. Rahul Verma (Orthopedics Room 102)', 'Dr. Priya Patel (Pediatrics Room 103)']
      }
    },
    {
      step: '03',
      title: 'Share Your QR',
      desc: 'Display high-durability acrylic QR standees at reception, entrance gates, and outpatient waiting areas.',
      tag: 'Zero App Barrier',
      preview: {
        header: 'Acrylic Standee Dispatch',
        items: ['Unique Hospital Facility QR Generated', 'Ready for Printing or Standee Dispatch', 'Operates with any smartphone camera']
      }
    },
    {
      step: '04',
      title: 'Patients Book',
      desc: 'Patients scan the QR code with any phone camera, pick their consulting doctor, and receive a live digital token.',
      tag: '10-Second Flow',
      preview: {
        header: 'Patient Mobile Booking Encounter',
        items: ['Patient: Ravi Kumar (Mob: 98765-XXXXX)', 'Selected: Dr. Amit Sharma (Cardiology)', 'Issued: Live Token #C-014']
      }
    },
    {
      step: '05',
      title: 'Manage Everything Live',
      desc: 'Appointments and queue activity appear simultaneously on doctor desks, administration screens, and patient phones.',
      tag: 'Real-Time Sync',
      preview: {
        header: 'Command Center Live Telemetry',
        items: ['Doctor Console Synced via WebSockets', 'Corridor TV Displays Next Token Calling', 'WhatsApp PDF Dispatched Upon Completion']
      }
    }
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#5B4DF5] selection:text-white">
      <PublicHeader />

      {/* ═════════════════════════════════════════════════════════════════════
          1. HERO SECTION: ANIMATED PRODUCT ECOSYSTEM
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-32 px-6 overflow-hidden bg-gradient-to-b from-[#E9EDFF] via-[#F4F5FF] to-white text-center">
        {/* Soft Dreamy Gradient Backdrop */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-r from-indigo-200/40 via-purple-200/50 to-blue-200/40 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-5">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-3.5 py-1.5 rounded-full bg-white/90 border border-indigo-100 text-xs font-extrabold text-[#5B4DF5] inline-block shadow-2xs"
          >
            Connected Healthcare Architecture
          </motion.span>

          {/* Heading: "Everything Your Hospital Needs. In One Platform." (Staggered Words) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-[-0.035em] text-slate-900 leading-[1.08]"
          >
            Everything Your Hospital Needs.<br />
            <span className="text-[#5B4DF5]">In One Platform.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            MedTech Fixaters connects hospital administration, doctors, patients, appointments, and live queues through one secure digital system.
          </motion.p>
        </div>

        {/* ─── LARGE ANIMATED PRODUCT ECOSYSTEM VISUAL ───────────────────── */}
        <div className="mt-16 max-w-5xl mx-auto relative">
          {/* Animated Connecting Lines (SVG Mesh) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none -z-1 hidden lg:block opacity-60">
            <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#5B4DF5" strokeWidth="1.5" strokeDasharray="6 6" className="animate-pulse" />
            <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#5B4DF5" strokeWidth="1.5" strokeDasharray="6 6" className="animate-pulse" />
            <line x1="15%" y1="80%" x2="50%" y2="50%" stroke="#5B4DF5" strokeWidth="1.5" strokeDasharray="6 6" className="animate-pulse" />
            <line x1="85%" y1="80%" x2="50%" y2="50%" stroke="#5B4DF5" strokeWidth="1.5" strokeDasharray="6 6" className="animate-pulse" />
          </svg>

          {/* Orbiting Glass Card 1: Doctor Dashboard (Top Left) */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex items-center gap-3 absolute -top-8 -left-6 z-20 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-indigo-100 shadow-xl text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#5B4DF5] flex items-center justify-center shrink-0">
              <Stethoscope size={18} />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase text-[#5B4DF5] tracking-wider block">Doctor Dashboard</span>
              <span className="text-xs font-bold text-slate-900">Dr. Amit Sharma • Room 101</span>
            </div>
          </motion.div>

          {/* Orbiting Glass Card 2: Live Queue Status (Top Right) */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden lg:flex items-center gap-3 absolute -top-8 -right-6 z-20 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-indigo-100 shadow-xl text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <RefreshCw size={18} className="animate-spin" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase text-emerald-600 tracking-wider block">Live Queue Status</span>
              <span className="text-xs font-bold text-slate-900">Serving Token #C-012</span>
            </div>
          </motion.div>

          {/* Orbiting Glass Card 3: QR Appointment Card (Bottom Left) */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="hidden lg:flex items-center gap-3 absolute -bottom-6 -left-6 z-20 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-indigo-100 shadow-xl text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <QrCode size={18} />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase text-blue-600 tracking-wider block">QR Appointment Card</span>
              <span className="text-xs font-bold text-slate-900">Instant Camera Scan</span>
            </div>
          </motion.div>

          {/* Orbiting Glass Card 4: Patient Mobile Interface (Bottom Right) */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="hidden lg:flex items-center gap-3 absolute -bottom-6 -right-6 z-20 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-indigo-100 shadow-xl text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Smartphone size={18} />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase text-purple-600 tracking-wider block">Patient Mobile Interface</span>
              <span className="text-xs font-bold text-slate-900">Zero-App Token Tracker</span>
            </div>
          </motion.div>

          {/* Central Main Hospital Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_30px_90px_-20px_rgba(91,77,245,0.2)] p-6 sm:p-8 text-left space-y-6 relative z-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#5B4DF5] text-white flex items-center justify-center">
                  <HeartPulse size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">MedTech Fixaters Hospital Command Center</h4>
                  <span className="text-[10px] text-slate-400 font-medium">Enterprise OPD Management Hub</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-600">Real-Time WebSocket Mesh Active</span>
              </div>
            </div>

            {/* Metric Preview Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Outpatients</span>
                <span className="text-2xl font-black text-slate-900 font-mono block">105</span>
                <span className="text-[10px] text-emerald-600 font-bold">↗ Live Registered</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Active Doctors</span>
                <span className="text-2xl font-black text-slate-900 font-mono block">12</span>
                <span className="text-[10px] text-blue-600 font-bold">● In Consultation</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Appointments</span>
                <span className="text-2xl font-black text-slate-900 font-mono block">84</span>
                <span className="text-[10px] text-[#5B4DF5] font-bold">QR & Online Direct</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Live Queue</span>
                <span className="text-2xl font-black text-slate-900 font-mono block">18</span>
                <span className="text-[10px] text-amber-600 font-bold">Waiting in Lounge</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      
      {/* ═════════════════════════════════════════════════════════════════════
          LIVE INTERACTIVE DOCTOR DASHBOARD SIMULATOR
      ═════════════════════════════════════════════════════════════════════ */}
      <section id="simulator" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#f7f8fc] text-slate-900 text-center relative overflow-hidden border-b border-slate-200/80">
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-[#5B4DF5]">
            <Sparkles size={13} />
            <span>LIVE INTERACTIVE SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Explore the Live Doctor Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-medium">
            Interact with live token queues, upcoming appointment schedules, quick clinical actions, and real-time patient vitals.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <DoctorDashboardSimulator />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2. CORE FEATURES (6 DEDICATED CARDS WITH RICH VISUALS)
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-6 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-extrabold text-[#5B4DF5] inline-block">
            Modular Clinical Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-[-0.035em] text-slate-900 leading-tight">
            Built for Every Part of Hospital Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            From patient appointments to live doctor activity, every feature works together inside one connected system.
          </p>
        </div>

        {/* 6 Core Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ── CARD 1: Hospital Administration ── */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#5B4DF5] uppercase tracking-wider">Card 01</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Hospital Administration</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Manage doctors, patients, appointments, records, prescriptions, and daily hospital operations from one dashboard.
              </p>
            </div>

            {/* Visual: Desktop Dashboard Preview with upward stats */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-xs font-bold text-slate-700">Hospital Operations Overview</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live Synced</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold block">Total Patients</span>
                  <span className="text-lg font-black text-slate-900 font-mono">105 ↗</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold block">Active Doctors</span>
                  <span className="text-lg font-black text-slate-900 font-mono">12 On Duty</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold block">Today's Appointments</span>
                  <span className="text-lg font-black text-slate-900 font-mono">84 Scheduled</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold block">Live Queue</span>
                  <span className="text-lg font-black text-[#5B4DF5] font-mono">18 Waiting</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── CARD 2: Separate Doctor Dashboards ── */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#5B4DF5] uppercase tracking-wider">Card 02</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Separate Doctor Dashboards</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Every doctor receives a secure personal dashboard with access to assigned patients, appointments, consultations, and prescriptions.
              </p>
            </div>

            {/* Visual: Three Floating Doctor Profile Cards with Isolated Paths */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Cryptographically Isolated Access</span>
              <div className="space-y-2.5">
                {[
                  { id: 'Doctor D1', name: 'Dr. Amit Sharma', dept: 'Cardiology', path: '→ Dashboard #1 Only' },
                  { id: 'Doctor D2', name: 'Dr. Rahul Verma', dept: 'Orthopedics', path: '→ Dashboard #2 Only' },
                  { id: 'Doctor D3', name: 'Dr. Priya Patel', dept: 'Pediatrics', path: '→ Dashboard #3 Only' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#5B4DF5] font-black text-xs flex items-center justify-center">
                        D{idx + 1}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block leading-tight">{doc.name}</span>
                        <span className="text-[10px] text-slate-400">{doc.dept}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#5B4DF5] border border-indigo-100">
                      {doc.path}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── CARD 3: Smart QR Appointments ── */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#5B4DF5] uppercase tracking-wider">Card 03</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Smart QR Appointments</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Each hospital receives a unique QR code. Patients scan, select a department and doctor, then book an appointment directly.
              </p>
            </div>

            {/* Visual: QR Card on left + Mobile Screen on right + Interactive 4 steps */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">4-Step Contactless Patient Flow</span>
                <span className="text-[10px] text-[#5B4DF5] font-bold">Step {qrStep + 1} of 4</span>
              </div>

              {/* Step indicator buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {qrStepsList.map((st, i) => (
                  <button
                    key={i}
                    onClick={() => setQrStep(i)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                      qrStep === i ? 'bg-[#5B4DF5] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span>{st.title}</span>
                  </button>
                ))}
              </div>

              {/* Active step display */}
              <div className="p-4 bg-white rounded-xl border border-indigo-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#5B4DF5] flex items-center justify-center shrink-0">
                  {qrStepsList[qrStep].icon}
                </div>
                <div>
                  <h5 className="font-black text-xs text-slate-900">{qrStepsList[qrStep].title}</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">{qrStepsList[qrStep].desc}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── CARD 4: Live Queue Management ── */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#5B4DF5] uppercase tracking-wider">Card 04</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Queue Management</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Patients receive a live queue number. The queue updates automatically as consultations are completed.
              </p>
            </div>

            {/* Visual: Live Queue Number with interactive advance */}
            <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-purple-50/60 rounded-2xl border border-indigo-100/80 space-y-4 text-center">
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider block">Your Queue Number</span>
              <motion.div
                key={queueNum}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-black font-mono text-[#5B4DF5] tracking-tight"
              >
                {queueNum}
              </motion.div>
              <div className="p-2.5 bg-white rounded-xl border border-indigo-100 text-xs font-bold text-slate-700">
                <span>{patientsAhead} Patients Ahead in Lounge</span>
              </div>

              <button
                onClick={advanceQueue}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#5B4DF5] text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 mx-auto"
              >
                <RefreshCw size={13} />
                <span>Simulate Doctor Completing Consultation (Advances 13 → 12 → 11)</span>
              </button>
            </div>
          </motion.div>

          {/* ── CARD 5: Live Doctor Activity ── */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#5B4DF5] uppercase tracking-wider">Card 05</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Doctor Activity</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Hospital administrators track doctor availability, active consultations, appointments, and waiting patients in real time.
              </p>
            </div>

            {/* Visual: Doctor Activity Card with cycle button */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-xs font-bold text-slate-700">Live Doctor Telemetry</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                  doctorStatus === 'In Consultation' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  doctorStatus === 'Called' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {doctorStatus}
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900 text-sm">Doctor D1 (Dr. Amit Sharma)</span>
                  <span className="font-mono text-[10px] text-slate-400">Cardiology Desk</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Current Patient:</span>
                  <span className="font-bold text-slate-900">Patient P24 (Ananya Sen)</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100 text-[11px]">
                  <span>12 Appointments Done</span>
                  <span className="font-mono font-bold text-indigo-600">4 Waiting</span>
                </div>
              </div>

              <button
                onClick={cycleDoctorStatus}
                className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition"
              >
                Click to Cycle: {doctorStatus} → Next Status
              </button>
            </div>
          </motion.div>

          {/* ── CARD 6: Patient Records and History ── */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#5B4DF5] uppercase tracking-wider">Card 06</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Patient Records and History</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Keep patient profiles, appointment history, consultation records, and prescriptions organized in one place.
              </p>
            </div>

            {/* Visual: Tabbed Patient Profile Interface */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              {/* Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-xl border border-slate-200">
                {(['Profile', 'History', 'Appointments', 'Prescriptions'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPatientRecordTab(tab)}
                    className={`py-1 text-[10px] font-bold rounded-lg transition ${
                      patientRecordTab === tab ? 'bg-[#5B4DF5] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5 min-h-[90px] flex flex-col justify-center">
                {patientRecordTab === 'Profile' && (
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Ravi Kumar (Male, 48)</span>
                      <span className="text-[#5B4DF5]">Blood: O+</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Contact: +91 98765-43210 • Emergency: Brother</p>
                  </div>
                )}
                {patientRecordTab === 'History' && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Chronic Conditions</span>
                    <p className="text-[11px] text-slate-700 font-medium">Type 2 Diabetes (5 yrs), Mild Hypertension</p>
                  </div>
                )}
                {patientRecordTab === 'Appointments' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-800">Cardiology Followup</span>
                      <span className="text-emerald-600">Today 10:15 AM</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Dr. Amit Sharma • Room 101</p>
                  </div>
                )}
                {patientRecordTab === 'Prescriptions' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-800">
                      <span>Tab Telmisartan 40mg</span>
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[9px]">WhatsApp Dispatched ✓</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Dispensed digitally via Med Rapidly Cloud</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          3. SECURITY SECTION: "Your Hospital Data Stays Within Your Hospital"
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-6 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-extrabold text-[#5B4DF5] inline-block shadow-2xs">
              Cryptographic Multi-Tenant Isolation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-[-0.035em] text-slate-900 leading-tight">
              Your Hospital Data Stays Within Your Hospital
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Every hospital operates with isolated data access. Hospital administrators view authorized hospital-wide information, while doctors access only their assigned data.
            </p>
          </div>

          {/* Visual: Two Secure Digital Spaces (Hospital H1 vs Hospital H2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Hospital H1 Sandbox */}
            <div className="p-7 rounded-3xl bg-white border-2 border-indigo-200/80 shadow-md space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-indigo-50 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#5B4DF5]" />
                  <span className="font-extrabold text-sm text-slate-900">Hospital H1 (Metro Healthcare)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[#5B4DF5] text-[10px] font-bold">
                  RLS Tenant #H1
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800">├── Doctors</span>
                  <span className="font-mono text-slate-500">Dr. Sharma, Dr. Mehta</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800">├── Patients</span>
                  <span className="font-mono text-slate-500">1,240 Hospital H1 Patients</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800">└── Appointments</span>
                  <span className="font-mono text-slate-500">Isolated H1 Queue Tokens</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
                <Lock size={12} />
                <span>Zero Cross-Facility Leakage Guaranteed</span>
              </div>
            </div>

            {/* Hospital H2 Sandbox */}
            <div className="p-7 rounded-3xl bg-white border-2 border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-purple-600" />
                  <span className="font-extrabold text-sm text-slate-900">Hospital H2 (Apex Clinic)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                  RLS Tenant #H2
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800">├── Doctors</span>
                  <span className="font-mono text-slate-500">Dr. Khan, Dr. Gupta</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800">├── Patients</span>
                  <span className="font-mono text-slate-500">890 Hospital H2 Patients</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800">└── Appointments</span>
                  <span className="font-mono text-slate-500">Isolated H2 Queue Tokens</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] font-bold text-purple-600 flex items-center gap-1.5">
                <Lock size={12} />
                <span>Encrypted at Rest (AES-256) & Transit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          4. PRODUCT WORKFLOW SECTION: "One Connected Workflow"
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-6 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-extrabold text-[#5B4DF5] inline-block">
            End-to-End Patient Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-[-0.035em] text-slate-900 leading-tight">
            One Connected Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Every part of the platform works together to create a smoother patient and hospital experience.
          </p>
        </div>

        {/* 5 Step Connected Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Steps list (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {workflowSteps.map((wf, idx) => (
              <div
                key={idx}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  activeWorkflowStep === idx
                    ? 'bg-white border-indigo-200 shadow-md space-y-2'
                    : 'bg-white/60 border-slate-200/80 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-colors ${
                      activeWorkflowStep === idx ? 'bg-[#5B4DF5] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {wf.step}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900">{wf.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {wf.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-500 pl-11 leading-relaxed font-normal">{wf.desc}</p>
              </div>
            ))}
          </div>

          {/* Live Updating Preview Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#E9EDFF] to-[#F4F5FF] p-6 rounded-3xl border border-indigo-100 shadow-xl space-y-4 sticky top-28">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <span className="text-[10px] font-extrabold uppercase text-[#5B4DF5] tracking-wider">Live Workflow Telemetry</span>
              <span className="font-mono text-xs font-bold text-slate-500">Stage {activeWorkflowStep + 1} / 5</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h5 className="font-black text-xs text-slate-900">{workflowSteps[activeWorkflowStep].preview.header}</h5>
              <div className="space-y-2 text-xs">
                {workflowSteps[activeWorkflowStep].preview.items.map((it, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-slate-700">
                    <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                    <span>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5. ADVANCED FEATURES SECTION (PREMIUM BENTO GRID)
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-6 max-w-6xl mx-auto space-y-16 border-t border-slate-100">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-extrabold text-[#5B4DF5] inline-block">
            Enterprise Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-[-0.035em] text-slate-900 leading-tight">
            More Control. Better Patient Flow.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Engineered with surgical attention to clinical throughput, multi-tenant security, and real-time efficiency.
          </p>
        </div>

        {/* 6 Bento Grid Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: 'Real-Time Updates',
              desc: 'Appointments and doctor activity update instantaneously across authorized dashboards via low-latency WebSockets.',
              icon: <Zap size={22} className="text-[#5B4DF5]" />,
              badge: 'Zero Polling'
            },
            {
              title: 'Department Management',
              desc: 'Organize doctors, consultation rooms, waiting zones, and specializations cleanly by clinical department.',
              icon: <Building2 size={22} className="text-blue-600" />,
              badge: 'Multi-OPD'
            },
            {
              title: 'Appointment History',
              desc: 'Access complete audit-trailed appointment records, timestamps, and consultation logs for authorized users.',
              icon: <Clock size={22} className="text-emerald-600" />,
              badge: 'Audit Log'
            },
            {
              title: 'Prescription Management',
              desc: 'Doctors create structured, digital prescriptions in under 30 seconds with automatic WhatsApp PDF delivery.',
              icon: <FileText size={22} className="text-purple-600" />,
              badge: 'Paperless'
            },
            {
              title: 'Role-Based Access',
              desc: 'Strict isolation ensuring Platform Admins, Hospital Administrators, and Doctors see only permitted records.',
              icon: <ShieldCheck size={22} className="text-rose-600" />,
              badge: 'Row-Level Security'
            },
            {
              title: 'Secure Authentication',
              desc: 'Separate enterprise login portals protect access across the platform with cryptographic session tokens.',
              icon: <Lock size={22} className="text-amber-600" />,
              badge: 'Encrypted'
            },
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {feat.badge}
                  </span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900">{feat.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          6. FINAL CTA: "Ready to Digitize Your Hospital?"
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="bg-[#5B4DF5] text-white p-8 sm:p-14 rounded-[36px] text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle floating background shapes */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

          <span className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider inline-block">
            Start Your Digital Transformation
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to Digitize Your Hospital?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto font-medium">
            Bring appointments, doctors, patients, QR booking, and live queues into one connected platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#5B4DF5] font-bold text-xs sm:text-sm shadow-md hover:bg-slate-50 transition"
            >
              Get Started
            </button>
            <Link
              to="/product"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs sm:text-sm transition"
            >
              Explore the Platform
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
