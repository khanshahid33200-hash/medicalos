import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users, Activity, Bell,
  Settings, ChevronDown, CheckCircle2,
  Calendar, LogOut, ChevronRight,
  AlertCircle,
  X, UserCheck, Stethoscope, Layers, Phone,
  Clock, Volume2, FileText, CheckCircle,
  Star, Upload,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../hooks/useSEO'

interface ClinicalQueuePatient {
  id: string
  token_number: number
  patient_name: string
  phone: string
  age: number
  gender: string
  chief_complaint: string
  status: 'Now Consulting' | 'Next' | 'Waiting' | 'Completed'
  wait_time: string
  time: string
  doctor_id: string
  vitals: { bp: string; pulse: string; temp: string; spo2: string }
  allergies: string
  lastVisit: string
}

export default function Dashboard() {
  useSEO({
    title: 'Doctor Clinical Workspace — Med Rapidly',
    description: 'Smart Clinical OPD Doctor Dashboard, Queue Manager & 30-Second Prescription Engine.',
  })

  const navigate = useNavigate()
  const { doctorProfile, logout } = useAuth()

  // Doctor & Hospital Identity
  const doctorId = doctorProfile?.doctor_id || localStorage.getItem('doctor_id') || 'doc-001'
  const doctorCode = doctorProfile?.doctor_code || localStorage.getItem('doctor_code') || 'H1-D-0001'
  const doctorName = doctorProfile?.name || 'Dr. Amit Sharma'
  const doctorSpecialty = doctorProfile?.specialization || 'Cardiologist'
  const doctorDegree = 'MBBS, MD (Cardiology)'
  const [doctorStatus, setDoctorStatus] = useState<'Available' | 'In Session' | 'On Break' | 'Off Duty'>('Available')

  const [selectedHospital, setSelectedHospital] = useState('City Care Hospital')
  const [hospitalLocation, setHospitalLocation] = useState('Mumbai, Maharashtra')

  // Live Hospital Clock
  const [currentTime, setCurrentTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Navigation State
  const [activeNav, setActiveNav] = useState<string>('dashboard')
  const [notice, setNotice] = useState<string | null>(null)

  // Top Bar Dropdowns
  const [showHospitalMenu, setShowHospitalMenu] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('May 31, 2025')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Modals & Drawers
  const [showRxModal, setShowRxModal] = useState(false)
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false)
  const [showCertModal, setShowCertModal] = useState(false)
  const [showLabModal, setShowLabModal] = useState(false)
  const [showFollowUpModal, setShowFollowUpModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Patient Card Active Tab
  const [patientCardTab, setPatientCardTab] = useState<'Details' | 'History' | 'Prescriptions' | 'Reports'>('Details')

  // Live Queue State (Matching Screenshot)
  const initialQueue: ClinicalQueuePatient[] = [
    {
      id: 'q-1',
      token_number: 12,
      patient_name: 'Ravi Kumar',
      phone: '+91 98201 44521',
      age: 32,
      gender: 'Male',
      chief_complaint: 'Chest pain and fatigue since 2 days',
      status: 'Now Consulting',
      wait_time: '—',
      time: '10:15 AM',
      doctor_id: doctorId,
      vitals: { bp: '120/80', pulse: '78', temp: '98.4', spo2: '98%' },
      allergies: 'None',
      lastVisit: 'May 20, 2025'
    },
    {
      id: 'q-2',
      token_number: 13,
      patient_name: 'Neha Singh',
      phone: '+91 98230 11928',
      age: 28,
      gender: 'Female',
      chief_complaint: 'Acidity, headache and mild nausea',
      status: 'Next',
      wait_time: '5 min',
      time: '10:30 AM',
      doctor_id: doctorId,
      vitals: { bp: '110/70', pulse: '74', temp: '98.6', spo2: '99%' },
      allergies: 'Penicillin',
      lastVisit: 'Apr 12, 2025'
    },
    {
      id: 'q-3',
      token_number: 14,
      patient_name: 'Mohd. Ali',
      phone: '+91 98450 77319',
      age: 45,
      gender: 'Male',
      chief_complaint: 'Hypertension follow-up and breathlessness',
      status: 'Waiting',
      wait_time: '18 min',
      time: '10:45 AM',
      doctor_id: doctorId,
      vitals: { bp: '140/90', pulse: '84', temp: '98.2', spo2: '97%' },
      allergies: 'None',
      lastVisit: 'May 10, 2025'
    },
    {
      id: 'q-4',
      token_number: 15,
      patient_name: 'Sunita Devi',
      phone: '+91 94150 99281',
      age: 34,
      gender: 'Female',
      chief_complaint: 'Palpitations during exertion',
      status: 'Waiting',
      wait_time: '28 min',
      time: '11:00 AM',
      doctor_id: doctorId,
      vitals: { bp: '124/82', pulse: '88', temp: '98.5', spo2: '98%' },
      allergies: 'Sulfa Drugs',
      lastVisit: 'First Visit'
    },
    {
      id: 'q-5',
      token_number: 16,
      patient_name: 'Vikas Patel',
      phone: '+91 94140 33812',
      age: 50,
      gender: 'Male',
      chief_complaint: 'Post-stent routine 6-month checkup',
      status: 'Waiting',
      wait_time: '35 min',
      time: '11:15 AM',
      doctor_id: doctorId,
      vitals: { bp: '130/85', pulse: '76', temp: '98.4', spo2: '99%' },
      allergies: 'None',
      lastVisit: 'Nov 18, 2024'
    }
  ]

  const [queueList, setQueueList] = useState<ClinicalQueuePatient[]>(() => {
    try {
      const saved = localStorage.getItem(`clinicos_queue_patients_${doctorId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.length ? parsed : initialQueue
      }
      return initialQueue
    } catch {
      return initialQueue
    }
  })

  // Upcoming Appointments State
  const appointmentsList = [
    { time: '11:30 AM', name: 'Arjun Mehta', type: 'Follow up', status: 'Confirmed' },
    { time: '12:00 PM', name: 'Pooja Gupta', type: 'New Patient', status: 'Confirmed' },
    { time: '12:30 PM', name: 'Sanjay Verma', type: 'Follow up', status: 'Confirmed' },
    { time: '01:00 PM', name: 'Anita Desai', type: 'Consultation', status: 'Confirmed' },
    { time: '01:30 PM', name: 'Rajesh Nair', type: 'ECG Review', status: 'Confirmed' },
  ]

  // Current Patient in Consultation
  const currentPatient = queueList.find(q => q.status === 'Now Consulting') || queueList[0]
  const nextPatient = queueList.find(q => q.status === 'Next' || q.status === 'Waiting') || queueList[1]

  // Prescription Form State
  const [rxForm, setRxForm] = useState({
    diagnosis: 'Acute Coronary Syndrome - Mild Angina',
    medicines: [
      { name: 'Tab. Atorvastatin 20mg', dosage: '0-0-1 (Night)', duration: '30 Days', instruction: 'After Dinner' },
      { name: 'Tab. Aspirin 75mg', dosage: '1-0-0 (Morning)', duration: '30 Days', instruction: 'After Breakfast' },
      { name: 'Tab. Metoprolol 25mg', dosage: '1-0-1 (Twice Daily)', duration: '15 Days', instruction: 'Before Meals' }
    ],
    labTests: 'Lipid Profile, 12-Lead ECG, Serum Creatinine',
    advice: 'Low sodium diet, brisk walking 20 mins, avoid strenuous physical strain.',
    followUp: '7 Days'
  })

  // Audio TTS Announcement Callout
  const handleCallNextPatient = (patient?: ClinicalQueuePatient) => {
    const target = patient || nextPatient
    if (!target) return

    // Speech Synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const text = `Token number ${target.token_number}, ${target.patient_name}, please proceed to room number 3, Doctor Amit Sharma.`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }

    // Move current in_consultation to completed, target to in_consultation
    const updated: ClinicalQueuePatient[] = queueList.map(q => {
      if (q.id === currentPatient?.id && q.id !== target.id) {
        return { ...q, status: 'Completed' as const }
      }
      if (q.id === target.id) {
        return { ...q, status: 'Now Consulting' as const, wait_time: '—' }
      }
      return q
    })

    setQueueList(updated)
    localStorage.setItem(`clinicos_queue_patients_${doctorId}`, JSON.stringify(updated))
    setNotice(`📢 Calling Token CC-0${target.token_number} (${target.patient_name})`)
    setTimeout(() => {
      setNotice(null)
    }, 4000)
  }

  // Complete Consultation & Send WhatsApp Rx
  const handleFinishConsultation = () => {
    if (!currentPatient) return

    const updated: ClinicalQueuePatient[] = queueList.map(q => {
      if (q.id === currentPatient.id) {
        return { ...q, status: 'Completed' as const }
      }
      return q
    })

    setQueueList(updated)
    localStorage.setItem(`clinicos_queue_patients_${doctorId}`, JSON.stringify(updated))
    setShowRxModal(false)
    setNotice(`Prescription generated & WhatsApp dispatched to ${currentPatient.patient_name} (${currentPatient.phone})!`)
    setTimeout(() => setNotice(null), 4500)
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-slate-900 font-sans flex antialiased selection:bg-indigo-500 selection:text-white">

      {/* ─── LEFT SIDEBAR ─────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 fixed top-0 bottom-0 left-0 z-30 overflow-y-auto shadow-sm">
        <div className="p-5 space-y-5">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-black text-xl text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <h2 className="font-black text-base text-slate-900 tracking-tight leading-none">Med Rapidly</h2>
              <span className="text-[11px] font-semibold text-slate-400">Doctor Dashboard</span>
            </div>
          </Link>

          {/* Doctor Profile Mini Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80"
              alt={doctorName}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-black text-xs text-slate-900 truncate leading-tight">{doctorName}</h4>
              </div>
              <span className="inline-block px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono text-[9px] font-black rounded my-0.5">
                {doctorCode}
              </span>
              <p className="text-[10px] font-bold text-slate-500 truncate">{doctorSpecialty}</p>
              <div className="mt-1">
                <button
                  onClick={() => setDoctorStatus(doctorStatus === 'Available' ? 'In Session' : doctorStatus === 'In Session' ? 'On Break' : 'Available')}
                  className="px-2 py-0.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-full text-[9px] font-black uppercase tracking-wider transition"
                >
                  {doctorStatus}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Layers size={16} /> },
              { id: 'queue', label: "Today's Queue", icon: <Calendar size={16} /> },
              { id: 'appointments', label: 'Appointments', icon: <Clock size={16} /> },
              { id: 'patients', label: 'Patients', icon: <Users size={16} /> },
              { id: 'consultations', label: 'Consultations', icon: <Stethoscope size={16} /> },
              { id: 'prescriptions', label: 'Prescriptions', icon: <FileText size={16} /> },
              { id: 'templates', label: 'Templates', icon: <FileText size={16} /> },
              { id: 'follow-ups', label: 'Follow Ups', icon: <CheckCircle size={16} /> },
              { id: 'reports', label: 'Reports', icon: <Activity size={16} /> },
              { id: 'profile', label: 'Profile', icon: <UserCheck size={16} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id)
                  if (item.id === 'queue') navigate('/queue')
                  if (item.id === 'appointments') navigate('/appointments')
                  if (item.id === 'reports') navigate('/reports')
                  if (item.id === 'profile') navigate('/profile')
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                  activeNav === item.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Need Help Card & Logout */}
        <div className="p-4 space-y-3">
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-700">
              <AlertCircle size={14} className="shrink-0" />
              <span className="text-xs font-black">Need Help?</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">Contact hospital admin or support team.</p>
            <button
              onClick={() => setShowSupportModal(true)}
              className="w-full py-1.5 bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-indigo-200 rounded-xl text-[11px] font-bold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>🎧 Get Support</span>
            </button>
          </div>

          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────────────── */}
      <main className="flex-1 ml-64 min-h-screen p-6 sm:p-8 space-y-6">

        {/* Toast Notification */}
        {notice && (
          <div className="fixed top-5 right-5 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-bounce">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-xs font-bold">{notice}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 relative z-20">
          {/* Hospital Branch Selector */}
          <div className="relative">
            <button
              onClick={() => setShowHospitalMenu(!showHospitalMenu)}
              className="flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                🏥
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-xs text-slate-900">{selectedHospital}</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{hospitalLocation}</span>
              </div>
            </button>

            {showHospitalMenu && (
              <div className="absolute left-0 top-14 w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 text-xs space-y-1 z-50">
                {['City Care Hospital (Mumbai)', 'Life Line Hospital (Pune)', 'Sunrise Hospital (Bengaluru)'].map(h => (
                  <button
                    key={h}
                    onClick={() => {
                      setSelectedHospital(h.split(' (')[0])
                      setHospitalLocation(h.split(' (')[1].replace(')', ''))
                      setShowHospitalMenu(false)
                      setNotice(`Switched active branch to ${h}`)
                      setTimeout(() => setNotice(null), 3000)
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-bold text-slate-700 block"
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Header: Date Filter, Notifications, Doctor Profile */}
          <div className="flex items-center gap-3">
            {/* Date Selector */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm hover:border-indigo-300 transition"
              >
                <Calendar size={14} className="text-slate-400" />
                <span>{selectedDate}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {showDatePicker && (
                <div className="absolute right-0 top-11 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 text-xs space-y-1 z-50">
                  {['May 31, 2025', 'June 1, 2025', 'June 2, 2025'].map(d => (
                    <button
                      key={d}
                      onClick={() => {
                        setSelectedDate(d)
                        setShowDatePicker(false)
                        setNotice(`Filtered queue date to ${d}`)
                        setTimeout(() => setNotice(null), 2500)
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-bold text-slate-700 block"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm transition"
              >
                <Bell size={16} />
              </button>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white pointer-events-none">
                3
              </span>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 text-xs space-y-2 z-50">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="font-black text-slate-900">OPD Notifications (3)</span>
                    <button onClick={() => setShowNotifications(false)} className="text-[10px] text-slate-400">Close</button>
                  </div>
                  {[
                    { t: 'Patient CC-013 Arrived', d: 'Neha Singh is waiting in reception.', c: 'bg-indigo-500' },
                    { t: 'Lab Report Ready', d: 'ECG Review uploaded for Rajesh Nair.', c: 'bg-emerald-500' },
                    { t: 'Emergency Token CC-020', d: 'Cardio triage priority assigned.', c: 'bg-rose-500' },
                  ].map((item, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-xl flex items-start gap-2">
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${item.c}`} />
                      <div>
                        <p className="font-bold text-slate-800 text-[11px]">{item.t}</p>
                        <p className="text-[10px] text-slate-500">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 pl-2 border-l border-slate-200 hover:opacity-80 transition"
              >
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80"
                  alt={doctorName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black text-slate-800 leading-none">{doctorName}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 text-xs space-y-1 z-50">
                  <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2">
                    <UserCheck size={14} /> My Profile
                  </button>
                  <button onClick={() => { setShowSettingsModal(true); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2">
                    <Settings size={14} /> OPD Settings
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 font-bold text-rose-600 flex items-center gap-2">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─── TOP 4 METRIC KPI CARDS ───────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Total Patients',
              value: '28',
              sub: 'Today',
              badge: '↑ 12% vs yesterday',
              badgeColor: 'text-emerald-600',
              icon: <Users size={20} className="text-indigo-600" />,
              iconBg: 'bg-indigo-50 text-indigo-600'
            },
            {
              title: 'Completed',
              value: '16',
              sub: 'Today',
              badge: '↑ 14% vs yesterday',
              badgeColor: 'text-emerald-600',
              icon: <Clock size={20} className="text-blue-600" />,
              iconBg: 'bg-blue-50 text-blue-600'
            },
            {
              title: 'Avg. Consultation Time',
              value: '18 mins',
              sub: 'Today',
              badge: '↓ 4% vs yesterday',
              badgeColor: 'text-rose-600',
              icon: <Activity size={20} className="text-amber-600" />,
              iconBg: 'bg-amber-50 text-amber-600'
            },
            {
              title: 'Patient Rating',
              value: '4.8 / 5',
              sub: 'Based on 86 reviews',
              badge: '↑ 0.2 vs last month',
              badgeColor: 'text-emerald-600',
              icon: <Star size={20} className="text-emerald-600 fill-emerald-600" />,
              iconBg: 'bg-emerald-50 text-emerald-600'
            },
          ].map((card, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</span>
                  <span className="text-xs font-semibold text-slate-400">{card.sub}</span>
                </div>
                <span className={`text-[10px] font-bold ${card.badgeColor} block`}>{card.badge}</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </section>

        {/* ─── MIDDLE WORKSPACE (QUEUE + APPOINTMENTS + RIGHT SIDEBAR) ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT 2 COLUMNS (Today's Queue & Upcoming Appointments) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Upper Split: Queue Table (left) & Upcoming Appointments (right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Today's Queue (7 cols) */}
              <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm text-slate-900">Today's Queue</h3>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full flex items-center gap-1 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live
                      </span>
                    </div>
                    <button onClick={() => navigate('/queue')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                      View Full Queue
                    </button>
                  </div>

                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                          <th className="pb-2 font-bold">#</th>
                          <th className="pb-2 font-bold">Token</th>
                          <th className="pb-2 font-bold">Patient Name</th>
                          <th className="pb-2 font-bold">Age / Gender</th>
                          <th className="pb-2 font-bold">Status</th>
                          <th className="pb-2 font-bold text-right">Wait Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-xs">
                        {queueList.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 font-black text-indigo-600">CC-0{item.token_number}</td>
                            <td className="py-2.5 font-extrabold text-slate-800">{item.patient_name}</td>
                            <td className="py-2.5 text-slate-500">{item.age} / {item.gender}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 text-[9px] font-black rounded-full capitalize ${
                                item.status === 'Now Consulting'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : item.status === 'Next'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-right text-slate-400 font-semibold">{item.wait_time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-indigo-600" /> Total Waiting: 4 Patients
                  </span>
                </div>
              </div>

              {/* Upcoming Appointments (5 cols) */}
              <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-black text-sm text-slate-900">Upcoming Appointments</h3>
                    <button onClick={() => navigate('/appointments')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                      View Calendar
                    </button>
                  </div>

                  <div className="space-y-2 mt-3">
                    {appointmentsList.map((apt, idx) => (
                      <div key={idx} className="p-2 rounded-xl hover:bg-slate-50 transition flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-indigo-600 text-[11px]">{apt.time}</span>
                          <div>
                            <span className="font-extrabold text-slate-800 block leading-tight">{apt.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{apt.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span>Confirmed</span>
                          <ChevronRight size={10} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Lower Split: Quick Actions & Today's Summary */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Quick Actions (7 cols) */}
              <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-black text-sm text-slate-900">Quick Actions</h3>
                <div className="grid grid-cols-4 gap-3 pt-1">
                  {[
                    { label: 'New Consultation', icon: '+', bg: 'bg-indigo-50 text-indigo-600', action: () => setShowRxModal(true) },
                    { label: 'Prescription', icon: 'Rx', bg: 'bg-emerald-50 text-emerald-600', action: () => setShowRxModal(true) },
                    { label: 'Medical Certificate', icon: '🛡️', bg: 'bg-blue-50 text-blue-600', action: () => setShowCertModal(true) },
                    { label: 'Lab Test Advice', icon: '🧪', bg: 'bg-amber-50 text-amber-600', action: () => setShowLabModal(true) },
                    { label: 'Follow Up', icon: '📅', bg: 'bg-rose-50 text-rose-600', action: () => setShowFollowUpModal(true) },
                    { label: 'Patient Notes', icon: '📝', bg: 'bg-orange-50 text-orange-600', action: () => setShowNotesModal(true) },
                    { label: 'Upload Report', icon: '⬆️', bg: 'bg-violet-50 text-violet-600', action: () => setShowUploadModal(true) },
                    { label: 'Templates', icon: '📄', bg: 'bg-sky-50 text-sky-600', action: () => setShowTemplatesModal(true) },
                  ].map((act, i) => (
                    <button
                      key={i}
                      onClick={act.action}
                      className="p-3 bg-slate-50/70 hover:bg-slate-100 border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition group"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${act.bg} group-hover:scale-110 transition-transform`}>
                        {act.icon}
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">{act.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Today's Summary (5 cols) */}
              <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-black text-sm text-slate-900">Today's Summary</h3>
                  <button onClick={() => navigate('/reports')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                    View Reports →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center pt-2">
                  {/* Donut */}
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10B981" strokeWidth="4" strokeDasharray="57 43" strokeDashoffset="0" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#F59E0B" strokeWidth="4" strokeDasharray="32 68" strokeDashoffset="-57" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#EF4444" strokeWidth="4" strokeDasharray="7 93" strokeDashoffset="-89" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-base font-black text-slate-900">28</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Total</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-slate-700"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed</span>
                      <span className="text-slate-900">16 (57%)</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-slate-700"><span className="w-2 h-2 rounded-full bg-amber-500" /> Waiting</span>
                      <span className="text-slate-900">9 (32%)</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-slate-700"><span className="w-2 h-2 rounded-full bg-rose-500" /> No Show</span>
                      <span className="text-slate-900">2 (7%)</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-slate-700"><span className="w-2 h-2 rounded-full bg-slate-300" /> Cancelled</span>
                      <span className="text-slate-900">1 (4%)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR (Current Queue & Current Patient Card) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Current Queue Top Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
              {/* Header Gradient Blue */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-100">Current Queue</span>
              </div>

              <div className="p-5 pt-0 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Now Consulting</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tight block">CC-0{currentPatient?.token_number || 12}</span>
                  <h4 className="font-extrabold text-base text-slate-800 mt-1">{currentPatient?.patient_name || 'Ravi Kumar'}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{currentPatient?.age || 32} Yrs, {currentPatient?.gender || 'Male'} • {currentPatient?.chief_complaint || 'Chest pain, fatigue'}</p>
                </div>

                <button
                  onClick={() => setShowPatientDetailsModal(true)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
                >
                  View Patient Details
                </button>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Next Patient</span>
                  <span className="text-lg font-black text-slate-800 block">CC-0{nextPatient?.token_number || 13}</span>
                  <p className="text-xs font-extrabold text-slate-700">{nextPatient?.patient_name || 'Neha Singh'}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{nextPatient?.age || 28} Yrs, {nextPatient?.gender || 'Female'} • {nextPatient?.chief_complaint || 'Acidity, headache'}</p>
                </div>

                {/* Big Action Button: Call Next Patient */}
                <button
                  onClick={() => handleCallNextPatient()}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <Volume2 size={16} />
                  <span>Call Next Patient</span>
                </button>
              </div>
            </div>

            {/* Current Patient Detailed Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">Current Patient</h4>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-black text-[10px] rounded-full border border-emerald-200">
                  Consultation
                </span>
              </div>

              {/* Patient Header */}
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt={currentPatient?.patient_name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h4 className="font-black text-sm text-slate-900 leading-tight">{currentPatient?.patient_name || 'Ravi Kumar'}</h4>
                  <p className="text-xs text-slate-500">{currentPatient?.age || 32} Yrs, {currentPatient?.gender || 'Male'}</p>
                  <span className="text-[10px] font-black text-indigo-600"># CC-0{currentPatient?.token_number || 12}</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 text-xs font-bold">
                {(['Details', 'History', 'Prescriptions', 'Reports'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPatientCardTab(tab)}
                    className={`pb-2 transition ${
                      patientCardTab === tab
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Chief Complaint */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Chief Complaint</span>
                <p className="text-xs font-bold text-slate-800">{currentPatient?.chief_complaint || 'Chest pain and fatigue since 2 days'}</p>
              </div>

              {/* 4 Vital Chips */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'BP', val: '120/80', unit: 'mmHg' },
                  { label: 'Pulse', val: '78', unit: 'bpm' },
                  { label: 'Temp', val: '98.4', unit: '°F' },
                  { label: 'SpO2', val: '98%', unit: '' },
                ].map((v, i) => (
                  <div key={i} className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 block">{v.label}</span>
                    <span className="text-xs font-black text-slate-900 block">{v.val}</span>
                    {v.unit && <span className="text-[8px] text-slate-400 block">{v.unit}</span>}
                  </div>
                ))}
              </div>

              {/* Allergies & Last Visit */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Allergies</span>
                  <span className="font-extrabold text-slate-800">{currentPatient?.allergies || 'None'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Last Visit</span>
                  <span className="font-extrabold text-slate-800">{currentPatient?.lastVisit || 'May 20, 2025'}</span>
                </div>
              </div>

              {/* Big Action: Start Consultation */}
              <button
                onClick={() => setShowRxModal(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition"
              >
                <Stethoscope size={16} />
                <span>Start Consultation</span>
              </button>
            </div>

          </div>

        </section>

        {/* ─── BOTTOM 3 INFO CARDS ──────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Reminder */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <h4 className="font-black text-xs text-slate-900">Reminder</h4>
              <p className="text-xs text-slate-600 mt-0.5">You have 3 follow-ups due tomorrow.</p>
              <button onClick={() => setShowFollowUpModal(true)} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 mt-1.5 block">
                View Follow Ups →
              </button>
            </div>
          </div>

          {/* Today's Tip */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-black text-lg">
              “
            </div>
            <div>
              <h4 className="font-black text-xs text-slate-900">Today's Tip</h4>
              <p className="text-xs text-slate-600 mt-0.5">Stay calm and take one patient at a time.</p>
            </div>
          </div>

          {/* Hospital Time */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <h4 className="font-black text-xs text-slate-900">Hospital Time</h4>
              <span className="text-lg font-black text-slate-900 block mt-0.5">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', weekday: 'long' })}
              </span>
            </div>
          </div>

        </section>

      </main>

      {/* ─── 30-SECOND PRESCRIPTION BUILDER MODAL ─────────── */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" />
                <div>
                  <h3 className="text-lg font-black text-slate-900">Digital Consultation & Rx</h3>
                  <span className="text-xs font-semibold text-slate-500">Patient: <strong>{currentPatient?.patient_name}</strong> (CC-0{currentPatient?.token_number})</span>
                </div>
              </div>
              <button onClick={() => setShowRxModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Diagnosis */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Clinical Diagnosis</label>
                <input
                  type="text"
                  value={rxForm.diagnosis}
                  onChange={e => setRxForm(p => ({ ...p, diagnosis: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              {/* Medicines List */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Rx Medications (Formulary Auto-complete)</label>
                <div className="space-y-2">
                  {rxForm.medicines.map((med, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <span className="font-black text-slate-900">{med.name}</span>
                      <span className="text-slate-500">{med.dosage} • {med.duration}</span>
                      <span className="text-indigo-600 font-bold">{med.instruction}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Tests & Advice */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Lab Diagnostic Tests</label>
                  <input
                    type="text"
                    value={rxForm.labTests}
                    onChange={e => setRxForm(p => ({ ...p, labTests: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Follow Up In</label>
                  <input
                    type="text"
                    value={rxForm.followUp}
                    onChange={e => setRxForm(p => ({ ...p, followUp: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Diet & Lifestyle Advice</label>
                <textarea
                  rows={2}
                  value={rxForm.advice}
                  onChange={e => setRxForm(p => ({ ...p, advice: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              {/* Finish & WhatsApp Dispatch */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                  <Phone size={12} className="text-emerald-600" /> WhatsApp PDF will be auto-delivered to {currentPatient?.phone}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRxModal(false)}
                    className="px-4 py-2.5 bg-slate-100 font-bold rounded-xl text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishConsultation}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20"
                  >
                    Save & WhatsApp Rx →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MEDICAL CERTIFICATE MODAL ───────────────────── */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Issue Medical Certificate</h3>
              <button onClick={() => setShowCertModal(false)} className="text-slate-400"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <p className="text-slate-600">Generating digital signed medical certificate for <strong>{currentPatient?.patient_name}</strong>.</p>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Recommended Rest Duration</label>
                <input type="text" defaultValue="3 Days (Bed Rest Recommended)" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <button
                onClick={() => {
                  setShowCertModal(false)
                  setNotice('Medical certificate generated and sent to patient.')
                  setTimeout(() => setNotice(null), 3000)
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
              >
                Sign & Issue Certificate →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── LAB TEST ADVICE MODAL ───────────────────────── */}
      {showLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Lab Diagnostic Requisition</h3>
              <button onClick={() => setShowLabModal(false)} className="text-slate-400"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Lab Investigations</label>
                <input type="text" defaultValue="Complete Blood Count, Fasting Blood Sugar, HbA1c, Lipid Profile" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <button
                onClick={() => {
                  setShowLabModal(false)
                  setNotice('Lab requisition order routed to in-house pathology.')
                  setTimeout(() => setNotice(null), 3000)
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
              >
                Dispatch to Lab →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FOLLOW UP SCHEDULING MODAL ──────────────────── */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Schedule Follow-up Visit</h3>
              <button onClick={() => setShowFollowUpModal(false)} className="text-slate-400"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Date</label>
                <input type="date" defaultValue="2025-06-07" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                <input type="text" defaultValue="11:30 AM" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <button
                onClick={() => {
                  setShowFollowUpModal(false)
                  setNotice('Follow-up appointment booked & reminder scheduled.')
                  setTimeout(() => setNotice(null), 3000)
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
              >
                Confirm Follow-up Slot →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PATIENT NOTES MODAL ─────────────────────────── */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Confidential Clinical Notes</h3>
              <button onClick={() => setShowNotesModal(false)} className="text-slate-400"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <textarea rows={4} defaultValue="Patient reports mild family history of early IHD. Advised lifestyle modifications and periodic lipid profile monitoring." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              <button
                onClick={() => {
                  setShowNotesModal(false)
                  setNotice('Clinical notes saved to patient history.')
                  setTimeout(() => setNotice(null), 3000)
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
              >
                Save Notes →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── UPLOAD REPORT MODAL ─────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Upload Diagnostic File</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400"><X size={16} /></button>
            </div>
            <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
              <Upload size={24} className="mx-auto text-indigo-600" />
              <p className="text-xs font-bold text-slate-700">Drag & drop ECG/X-Ray/Lab PDF</p>
              <p className="text-[10px] text-slate-400">PDF, PNG, JPG up to 25MB</p>
            </div>
            <button
              onClick={() => {
                setShowUploadModal(false)
                setNotice('Diagnostic report attached to patient record.')
                setTimeout(() => setNotice(null), 3000)
              }}
              className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs"
            >
              Upload & Attach Report →
            </button>
          </div>
        </div>
      )}

      {/* ─── TEMPLATES MODAL ─────────────────────────────── */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Prescription Templates</h3>
              <button onClick={() => setShowTemplatesModal(false)} className="text-slate-400"><X size={16} /></button>
            </div>
            <div className="space-y-2 text-xs">
              {['Hypertension Standard Protocol', 'Type 2 Diabetes Regimen', 'Post-MI Secondary Prevention', 'Upper Respiratory Infection'].map(t => (
                <div key={t} className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer" onClick={() => { setShowTemplatesModal(false); setNotice(`Template "${t}" applied!`); setTimeout(() => setNotice(null), 3000); }}>
                  <span className="font-bold text-slate-800">{t}</span>
                  <span className="text-indigo-600 font-bold text-[10px]">Use Template →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── SUPPORT MODAL ───────────────────────────────── */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Hospital Tech Support</h3>
              <button onClick={() => setShowSupportModal(false)} className="text-slate-400"><X size={16} /></button>
            </div>
            <p className="text-xs text-slate-600">Need assistance with OPD queue, WhatsApp delivery or TV Displays?</p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block">Hospital Admin Desk</span>
                <span className="text-indigo-600 font-black">+91 98201 44521 (Ext: 104)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block">Med Rapidly Tech Desk</span>
                <span className="text-emerald-600 font-black">support@medrapidly.com</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SETTINGS MODAL ──────────────────────────────── */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">OPD Consultation Rules</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Max Daily Token Capacity</label>
                <input type="number" defaultValue="45" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Default Consultation Fee (₹)</label>
                <input type="number" defaultValue="800" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Voice Audio Announcement Language</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
                  <option>English + Hindi (Default)</option>
                  <option>English Only</option>
                  <option>Hindi Only</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setShowSettingsModal(false)
                  setNotice('OPD settings saved.')
                  setTimeout(() => setNotice(null), 3000)
                }}
                className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl"
              >
                Save Settings →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PATIENT DETAILS MODAL ───────────────────────── */}
      {showPatientDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Patient Complete Profile: {currentPatient?.patient_name}</h3>
              <button onClick={() => setShowPatientDetailsModal(false)} className="text-slate-400"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Contact Phone</span>
                  <span className="font-extrabold text-slate-800">{currentPatient?.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">ABHA Health ID</span>
                  <span className="font-extrabold text-indigo-600">91-8842-1192-3341</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Medical History</span>
                <p className="text-slate-700 mt-1">Hypertension diagnosed in 2021. Non-smoker. No prior surgical interventions.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
