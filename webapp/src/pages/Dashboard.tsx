import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import {
  MessageSquare,
  Send,
  CheckCheck,
  ArrowUpRight,
  LogOut,
  FileText,
  CheckCircle2,
  Volume2,
  Users,
  SkipForward,
  CheckCircle,
  Settings,
  Edit3
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../hooks/useSEO'
import {
  getQueueForDoctor,
  updateQueueStatusForDoctor,
  getAppointmentsForDoctor,
  QueueItem
} from '../utils/doctorStore'

interface ChatMessage {
  id: string
  sender: 'admin' | 'doctor'
  doctorId: string
  text: string
  time: string
  status: 'sent' | 'delivered' | 'read'
}

export default function Dashboard() {
  useSEO({
    title: 'Doctor Clinical Workspace - MedTech Fixaters',
    description: 'Doctor clinical OPD queue callouts, patient history, and in-built chat system.',
  })

  const navigate = useNavigate()
  const { doctorProfile, logout } = useAuth()

  const [userRole, setUserRole] = useState<'hospital_admin' | 'doctor'>('doctor')
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'patients' | 'chat'>('overview')
  const [notice, setNotice] = useState<string | null>(null)
  const [announcedToken, setAnnouncedToken] = useState<string | null>(null)

  const doctorId = doctorProfile?.doctor_id || 'doc-001'
  const doctorName = doctorProfile?.name || 'Dr. Rahul Sharma'
  const hospitalName = doctorProfile?.hospital_name || localStorage.getItem('hospital_name') || 'Metro Care Multispecialty Hospital'
  const departmentName = doctorProfile?.department_name || 'General Medicine'
  const specialization = doctorProfile?.specialization || 'Senior Consultant Physician'

  const [queueList, setQueueList] = useState<QueueItem[]>([])
  const [aptList, setAptList] = useState<any[]>([])

  // Doctor OPD Rules & Profile Settings State
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [opdSettings, setOpdSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(`clinicos_doctor_settings_${doctorId}`)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return {
      name: doctorName,
      specialization: specialization,
      fee: 500,
      dailyPatientLimit: 25,
      checkinStartTime: '09:00 AM',
      appointmentCutoffTime: '05:00 PM',
      defaultFollowupDays: '7 Days',
    }
  })

  // In-Built Doctor Chat System State
  const [chatInputText, setChatInputText] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('clinicos_chat_messages')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  })

  const reloadData = () => {
    if (doctorId) {
      setQueueList(getQueueForDoctor(doctorId))
      setAptList(getAppointmentsForDoctor(doctorId))
    }
  }

  useEffect(() => {
    const role = localStorage.getItem('user_role')
    if (role === 'hospital_admin') {
      setUserRole('hospital_admin')
    } else {
      setUserRole('doctor')
    }
    reloadData()

    const pollInterval = setInterval(() => {
      reloadData()
    }, 2000)

    return () => clearInterval(pollInterval)
  }, [doctorId])

  // Save chat messages
  useEffect(() => {
    try {
      localStorage.setItem('clinicos_chat_messages', JSON.stringify(chatMessages))
    } catch (e) {}
  }, [chatMessages])

  // Handle Logout
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Handle Save Doctor Profile & OPD Settings
  const handleSaveOpdSettings = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      localStorage.setItem(`clinicos_doctor_settings_${doctorId}`, JSON.stringify(opdSettings))
      
      // Update cached profile
      const cachedProfileRaw = localStorage.getItem('clinicos_cached_profile')
      if (cachedProfileRaw) {
        const cached = JSON.parse(cachedProfileRaw)
        cached.name = opdSettings.name
        cached.specialization = opdSettings.specialization
        localStorage.setItem('clinicos_cached_profile', JSON.stringify(cached))
      }

      // Sync into doctor roster
      const rosterRaw = localStorage.getItem('clinicos_hospital_doctors')
      if (rosterRaw) {
        const roster: any[] = JSON.parse(rosterRaw)
        const updatedRoster = roster.map((d) => {
          if (d.id === doctorId || d.email === doctorProfile?.email) {
            return {
              ...d,
              name: opdSettings.name,
              specialization: opdSettings.specialization,
              fee: opdSettings.fee,
              limit: opdSettings.dailyPatientLimit,
              checkinStartTime: opdSettings.checkinStartTime,
              appointmentCutoffTime: opdSettings.appointmentCutoffTime,
              defaultFollowupDays: opdSettings.defaultFollowupDays,
            }
          }
          return d
        })
        localStorage.setItem('clinicos_hospital_doctors', JSON.stringify(updatedRoster))
      }
    } catch (err) {}

    setShowSettingsModal(false)
    setNotice(`✓ OPD Settings & Profile Updated! Fee: ₹${opdSettings.fee}, Daily Limit: ${opdSettings.dailyPatientLimit}, Cutoff: ${opdSettings.appointmentCutoffTime}, Follow-up: ${opdSettings.defaultFollowupDays}.`)
    setTimeout(() => setNotice(null), 5000)
  }

  // Trigger Web Speech Audio Voice Callout Announcement
  const playVoiceCallout = (tokenNum: string, patientName?: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
        const textToSpeak = `Token Number ${tokenNum.replace('Token ', '')}. ${patientName || 'Patient'}, please proceed to ${opdSettings.name || doctorName}'s consultation room.`
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.rate = 0.9
        utterance.pitch = 1.0
        utterance.lang = 'en-IN'
        window.speechSynthesis.speak(utterance)
      } catch (e) {}
    }
  }

  // Action: Call Next Patient in OPD Queue
  const handleCallNext = () => {
    const waitingList = queueList.filter((q) => q.status === 'Waiting')
    if (waitingList.length === 0) {
      setNotice('No patients currently waiting in the OPD queue.')
      setTimeout(() => setNotice(null), 3000)
      return
    }

    const nextPatient = waitingList[0]
    const updated = queueList.map((item) => {
      if (item.id === nextPatient.id) return { ...item, status: 'With Doctor' as const }
      if (item.status === 'With Doctor') return { ...item, status: 'Completed' as const }
      return item
    })

    setQueueList(updated)
    updateQueueStatusForDoctor(doctorId, nextPatient.id, 'With Doctor')
    setAnnouncedToken(nextPatient.token_number)
    playVoiceCallout(nextPatient.token_number, nextPatient.patient_name)
    setNotice(`🔊 Called Token ${nextPatient.token_number} (${nextPatient.patient_name}) into Consultation Room.`)
    setTimeout(() => setNotice(null), 4000)
  }

  // Action: Mark Active Patient as Completed
  const handleMarkCompleted = (patientId: string) => {
    const updated = updateQueueStatusForDoctor(doctorId, patientId, 'Completed')
    setQueueList(updated)
    setNotice(`✓ Consultation completed for active patient.`)
    setTimeout(() => setNotice(null), 3000)
  }

  // Action: Skip Active Patient
  const handleSkipPatient = (patientId: string) => {
    const updated = updateQueueStatusForDoctor(doctorId, patientId, 'Skipped')
    setQueueList(updated)
    setNotice(`⏭️ Patient marked as skipped.`)
    setTimeout(() => setNotice(null), 3000)
  }

  // Action: Recall Skipped or Completed Patient
  const handleRecallPatient = (patientId: string) => {
    const updated = updateQueueStatusForDoctor(doctorId, patientId, 'Waiting')
    setQueueList(updated)
    const target = updated.find((q) => q.id === patientId)
    if (target) {
      setAnnouncedToken(target.token_number)
      playVoiceCallout(target.token_number, target.patient_name)
      setNotice(`🔊 Recalled Token ${target.token_number} back to Waiting Room.`)
      setTimeout(() => setNotice(null), 4000)
    }
  }

  // Handle Send Chat Message to Admin
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!chatInputText.trim()) return

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'doctor',
      doctorId: doctorId,
      text: chatInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    }

    setChatMessages((prev) => [...prev, newMsg])
    setChatInputText('')

    // Simulate auto admin reply
    setTimeout(() => {
      const adminMsg: ChatMessage = {
        id: `msg-admin-${Date.now()}`,
        sender: 'admin',
        doctorId: doctorId,
        text: `Acknowledged, ${opdSettings.name || doctorName}. Reception has been updated.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      }
      setChatMessages((prev) => [...prev, adminMsg])
    }, 1400)
  }

  // Redirect Hospital Admin to dedicated sub-pages
  if (userRole === 'hospital_admin') {
    return <Navigate to="/hospitaladmin/overview" replace />
  }

  const currentDocMessages = chatMessages.filter((m) => m.doctorId === doctorId || m.doctorId === 'doc-001')
  const activePatient = queueList.find((q) => q.status === 'With Doctor')
  const waitingPatients = queueList.filter((q) => q.status === 'Waiting')
  const completedPatients = queueList.filter((q) => q.status === 'Completed')
  const skippedPatients = queueList.filter((q) => q.status === 'Skipped')

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 font-sans selection:bg-emerald-600 selection:text-white p-4 sm:p-6">
      {notice && (
        <div className="max-w-7xl mx-auto mb-4 bg-[#00875A] text-white px-4 py-3 rounded-2xl text-xs font-bold text-center flex items-center justify-between shadow-md">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} /> {notice}
          </span>
          <button onClick={() => setNotice(null)} className="text-white font-bold">✕</button>
        </div>
      )}

      {/* ANNOUNCER AUDIO VOICE BANNER */}
      {announcedToken && (
        <div className="max-w-7xl mx-auto mb-4 bg-slate-900 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
              <Volume2 size={20} className="animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Live Voice Announcement</p>
              <p className="font-bold text-sm sm:text-base">{announcedToken} — Called to Consultation Room ({opdSettings.name || doctorName})</p>
            </div>
          </div>
          <button onClick={() => setAnnouncedToken(null)} className="text-xs font-bold text-slate-400 hover:text-white">Dismiss</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP MEDLINK FLOATING HEADER BAR */}
        <header className="bg-white rounded-3xl p-4 sm:px-6 shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <img src="/assets/logo.png" alt="MedTech Fixaters Logo" className="h-9 object-contain" />
            <div className="flex flex-col">
              <span className="font-black text-lg text-slate-900 tracking-tight leading-none">{opdSettings.name || doctorName}</span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-widest uppercase mt-0.5">{departmentName} • {hospitalName}</span>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="bg-slate-100/80 p-1.5 rounded-full flex items-center gap-1 border border-slate-200/50 self-center overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'overview' ? 'bg-[#00875A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'queue' ? 'bg-[#00875A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Volume2 size={13} /> Live OPD Queue & Callouts ({waitingPatients.length})
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'patients' ? 'bg-[#00875A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'chat' ? 'bg-[#00875A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              In-built Chat
            </button>
            <button
              onClick={() => navigate('/rx')}
              className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 transition whitespace-nowrap"
            >
              E-Prescriptions (/rx)
            </button>
          </div>

          {/* Action & Settings Buttons */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition flex items-center gap-1.5"
              title="OPD Schedule & Profile Settings"
            >
              <Settings size={14} /> OPD Settings
            </button>
            <button
              onClick={handleCallNext}
              className="px-4 py-2 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs rounded-full shadow-sm flex items-center gap-1.5"
            >
              <Volume2 size={15} /> 🔊 Call Next
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full transition"
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* TAB 1: OVERVIEW 3-COLUMN BENTO GRID */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* COLUMN 1: DOCTOR HERO PROFILE CARD (3 COLS) */}
            <div className="md:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-5 text-left">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=500"
                    alt={opdSettings.name || doctorName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                    <p className="font-extrabold text-base tracking-tight">{opdSettings.name || doctorName}</p>
                    <p className="text-xs text-emerald-400 font-medium">{opdSettings.specialization || specialization}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Consultation Fee</p>
                    <p className="text-sm font-black text-slate-900">₹{opdSettings.fee}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Allowed Today</p>
                    <p className="text-sm font-black text-emerald-700">{opdSettings.dailyPatientLimit} Patients</p>
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 space-y-1.5 text-xs">
                  <p className="font-bold text-slate-900 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Check-in Start:</span>
                    <strong className="text-emerald-800 font-mono">{opdSettings.checkinStartTime}</strong>
                  </p>
                  <p className="font-bold text-slate-900 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Booking Cutoff:</span>
                    <strong className="text-amber-800 font-mono">{opdSettings.appointmentCutoffTime}</strong>
                  </p>
                  <p className="font-bold text-slate-900 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Default Follow-up:</span>
                    <strong className="text-slate-800 font-mono">{opdSettings.defaultFollowupDays}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Edit3 size={14} /> Update OPD Rules & Profile
                </button>
              </div>
            </div>

            {/* COLUMN 2: LIVE OPD QUEUE & CALLOUT WIDGET (5 COLS) */}
            <div className="md:col-span-5 space-y-6">
              {/* TOP CARD: OPD QUEUE CALLOUT CONTROLLER WIDGET */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">OPD Queue Callouts Control</h3>
                    <p className="text-xs text-slate-400 font-medium">Appointments allowed till: <strong className="text-amber-700 font-mono">{opdSettings.appointmentCutoffTime}</strong></p>
                  </div>
                  <button onClick={() => setActiveTab('queue')} className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                    <Volume2 size={13} /> Full Callouts Tab →
                  </button>
                </div>

                {/* Active Patient In-Room Box */}
                {activePatient ? (
                  <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-emerald-700 text-white rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                        {activePatient.token_number}
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                        With Doctor
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">{activePatient.patient_name}</h4>
                      <p className="text-xs text-slate-600 font-medium">{activePatient.phone} {activePatient.symptoms ? `• ${activePatient.symptoms}` : ''}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => handleMarkCompleted(activePatient.id)}
                        className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                      >
                        <CheckCircle size={14} /> Complete
                      </button>
                      <button
                        onClick={() => playVoiceCallout(activePatient.token_number, activePatient.patient_name)}
                        className="py-2 bg-white hover:bg-slate-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center justify-center gap-1"
                      >
                        <Volume2 size={14} /> Re-Announce
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
                    <p className="text-xs font-bold text-slate-500">No Patient Currently In-Room</p>
                    <button
                      onClick={handleCallNext}
                      disabled={waitingPatients.length === 0}
                      className="px-5 py-2.5 bg-[#00875A] hover:bg-[#007043] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 mx-auto"
                    >
                      <Volume2 size={16} /> 🔊 Call Next Waiting Patient ({waitingPatients.length}/{opdSettings.dailyPatientLimit})
                    </button>
                  </div>
                )}
              </div>

              {/* BOTTOM CARD: APPOINTMENT HISTORY TABLE */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Today's Appointment History</h3>
                    <p className="text-xs text-slate-400 font-medium">Recent patient check-ins</p>
                  </div>
                  <button onClick={() => setActiveTab('patients')} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <ArrowUpRight size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  {(aptList.length > 0 ? aptList : [
                    { id: '#ID65784354A1', patient_name: 'Rohan Mehta', time: '10:00 AM', type: 'Consultation' },
                    { id: '#ID65784354A2', patient_name: 'Priya Sharma', time: '10:15 AM', type: 'Check-up' },
                    { id: '#ID65784354A3', patient_name: 'Anil Kumar', time: '10:30 AM', type: 'Follow-up' },
                  ]).map((apt, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-[10px]">{idx + 1}</span>
                        <div>
                          <p className="font-bold text-slate-900">{apt.patient_name || apt.name}</p>
                          <p className="text-[10px] text-slate-400">{apt.id || `#APT-00${idx + 1}`} • {apt.time || '10:00 AM'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate('/rx')} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-bold flex items-center gap-1">
                          <FileText size={12} /> Rx
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 3: IN-BUILT REAL-TIME CHAT SYSTEM (4 COLS) */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4 text-left flex flex-col justify-between min-h-[420px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">Hospital Admin Chat</h3>
                      <p className="text-[11px] text-slate-400">Direct message console</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200">
                    Online
                  </span>
                </div>

                {/* Message Bubble Thread Area */}
                <div className="space-y-3 overflow-y-auto max-h-[260px] p-2 font-sans">
                  {currentDocMessages.length > 0 ? (
                    currentDocMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'doctor'
                              ? 'bg-[#d8edd6] text-slate-900 rounded-tr-xs shadow-xs font-medium'
                              : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div className={`flex items-center gap-1 justify-end pt-1 text-[9px] font-mono ${msg.sender === 'doctor' ? 'text-emerald-800' : 'text-slate-400'}`}>
                            <span>{msg.time}</span>
                            {msg.sender === 'doctor' && <CheckCheck size={12} className="text-emerald-700" />}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-8 font-medium">No previous messages. Start a conversation with Hospital Admin below.</p>
                  )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder="Type message to Admin..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-full bg-[#00875A] hover:bg-[#007043] text-white flex items-center justify-center transition flex-shrink-0 shadow-sm"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MERGED LIVE OPD QUEUE & CALLOUTS TAB */}
        {activeTab === 'queue' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Volume2 className="text-emerald-700" size={26} /> Live OPD Patient Callout Controller
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Cutoff: <strong className="text-amber-800 font-mono">{opdSettings.appointmentCutoffTime}</strong> • Limit: <strong className="text-emerald-800 font-mono">{opdSettings.dailyPatientLimit} Max Today</strong>
                </p>
              </div>
              <button
                onClick={handleCallNext}
                disabled={waitingPatients.length === 0}
                className="px-6 py-3 bg-[#00875A] hover:bg-[#007043] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center gap-2"
              >
                <Volume2 size={18} /> 🔊 Call Next Waiting Patient ({waitingPatients.length})
              </button>
            </div>

            {/* ACTIVE IN-ROOM PATIENT CALLOUT HERO */}
            {activePatient ? (
              <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-mono font-black text-sm rounded-xl">
                      {activePatient.token_number}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">Currently In Consultation Room</span>
                      <h3 className="text-2xl font-black">{activePatient.patient_name}</h3>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold uppercase self-start">
                    Active Session
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-slate-400 text-[10px] block">Contact</span>
                    <strong className="text-white">{activePatient.phone || 'N/A'}</strong>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-slate-400 text-[10px] block">Check-in Time</span>
                    <strong className="text-emerald-400">{activePatient.check_in_time}</strong>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-slate-400 text-[10px] block">Symptoms</span>
                    <strong className="text-white">{activePatient.symptoms || 'General Checkup'}</strong>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-slate-400 text-[10px] block">Severity</span>
                    <strong className="text-amber-400 uppercase">{activePatient.severity || 'Moderate'}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleMarkCompleted(activePatient.id)}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle size={16} /> Complete Consultation
                  </button>
                  <button
                    onClick={() => playVoiceCallout(activePatient.token_number, activePatient.patient_name)}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-white/20"
                  >
                    <Volume2 size={16} /> 🔊 Voice Announcement
                  </button>
                  <button
                    onClick={() => handleSkipPatient(activePatient.id)}
                    className="px-5 py-2.5 bg-white/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-white/20"
                  >
                    <SkipForward size={16} /> Skip Patient
                  </button>
                  <button
                    onClick={() => navigate('/rx')}
                    className="px-5 py-2.5 bg-white text-emerald-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm ml-auto"
                  >
                    <FileText size={16} /> Write E-Prescription (/rx)
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-black">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">No Active Consultation Session</h3>
                  <p className="text-xs text-slate-500">Click below to call the next patient from the OPD waiting room.</p>
                </div>
                <button
                  onClick={handleCallNext}
                  disabled={waitingPatients.length === 0}
                  className="px-6 py-3 bg-[#00875A] hover:bg-[#007043] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md inline-flex items-center gap-2"
                >
                  <Volume2 size={18} /> 🔊 Call Next Patient ({waitingPatients.length} Waiting)
                </button>
              </div>
            )}

            {/* WAITING ROOM PATIENTS ROSTER */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-black text-slate-900">Waiting Room Patients ({waitingPatients.length})</h3>
              {waitingPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {waitingPatients.map((patient) => (
                    <div key={patient.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-mono font-bold text-xs rounded-lg">
                          {patient.token_number}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{patient.check_in_time}</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{patient.patient_name}</h4>
                        <p className="text-xs text-slate-500 font-mono">{patient.phone} {patient.symptoms ? `• ${patient.symptoms}` : ''}</p>
                      </div>
                      <button
                        onClick={() => {
                          updateQueueStatusForDoctor(doctorId, patient.id, 'With Doctor')
                          setQueueList(getQueueForDoctor(doctorId))
                          setAnnouncedToken(patient.token_number)
                          playVoiceCallout(patient.token_number, patient.patient_name)
                        }}
                        className="w-full py-2 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1"
                      >
                        <Volume2 size={14} /> Call Out This Patient
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No patients waiting in queue right now.</p>
              )}
            </div>

            {/* SKIPPED & COMPLETED PATIENTS ROSTER */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-base font-black text-slate-900">Completed ({completedPatients.length}) & Skipped Patients ({skippedPatients.length})</h3>
              {[...completedPatients, ...skippedPatients].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...completedPatients, ...skippedPatients].map((patient) => (
                    <div key={patient.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{patient.token_number} - {patient.patient_name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${patient.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {patient.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRecallPatient(patient.id)}
                        className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-xl border border-slate-200 transition"
                      >
                        🔊 Recall Back to Queue
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No completed or skipped patients yet today.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: APPOINTMENTS */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Patient Appointments</h2>
                <p className="text-xs text-slate-500 font-medium">Scheduled OPD visits and medical records</p>
              </div>
              <button onClick={() => navigate('/rx')} className="px-5 py-2.5 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs rounded-2xl shadow-sm">
                + New Prescription (/rx)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100">
                    <th className="pb-3">Token #</th>
                    <th className="pb-3">Patient Name</th>
                    <th className="pb-3">Visit Time</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium font-mono">
                  {(aptList.length > 0 ? aptList : [
                    { id: '#ID65784354A1', patient_name: 'Rohan Mehta', time: '10:00 AM', type: 'Consultation' },
                    { id: '#ID65784354A2', patient_name: 'Priya Sharma', time: '10:15 AM', type: 'Check-up' },
                    { id: '#ID65784354A3', patient_name: 'Anil Kumar', time: '10:30 AM', type: 'Follow-up' },
                  ]).map((apt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 font-bold text-slate-900">{apt.id || `#APT-00${idx + 1}`}</td>
                      <td className="py-3 font-bold text-emerald-800">{apt.patient_name || apt.name || 'Patient'}</td>
                      <td className="py-3 text-slate-600">{apt.time || '10:00 AM'}</td>
                      <td className="py-3"><span className="px-2.5 py-1 bg-slate-100 rounded-full font-bold text-slate-700">{apt.type || 'Consultation'}</span></td>
                      <td className="py-3 text-right">
                        <button onClick={() => navigate('/rx')} className="px-3 py-1.5 bg-[#00875A] text-white font-bold rounded-xl text-[11px]">
                          Write Rx
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: IN-BUILT DOCTOR CHAT PANEL */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Admin Chat System</h2>
                <p className="text-xs text-slate-500 font-medium">Direct real-time messaging with Hospital Administrator</p>
              </div>
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                Connected: {hospitalName} Admin
              </span>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 max-w-3xl mx-auto min-h-[400px] flex flex-col justify-between shadow-xs">
              <div className="space-y-3 overflow-y-auto max-h-[340px] p-2 font-sans">
                {currentDocMessages.length > 0 ? (
                  currentDocMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-5 py-3 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'doctor'
                            ? 'bg-[#d8edd6] text-slate-900 rounded-tr-xs shadow-xs font-medium'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className={`flex items-center gap-1 justify-end pt-1 text-[9px] font-mono ${msg.sender === 'doctor' ? 'text-emerald-800' : 'text-slate-400'}`}>
                          <span>{msg.time}</span>
                          {msg.sender === 'doctor' && <CheckCheck size={12} className="text-emerald-700" />}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8 font-medium">No previous messages. Start a conversation with Hospital Admin below.</p>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  placeholder="Type message to Hospital Admin..."
                  className="flex-1 px-4 py-2 bg-transparent text-xs font-medium outline-none"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[#00875A] hover:bg-[#007043] text-white flex items-center justify-center transition flex-shrink-0 shadow-sm"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* DOCTOR PROFILE & OPD SCHEDULE SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Settings className="text-emerald-700" size={20} /> Doctor OPD Rules & Profile Settings
                </h3>
                <p className="text-xs text-slate-500 font-medium">Configure your consultation fee, daily capacity & timing rules</p>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveOpdSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  value={opdSettings.name}
                  onChange={(e) => setOpdSettings({ ...opdSettings, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialization</label>
                <input
                  type="text"
                  required
                  value={opdSettings.specialization}
                  onChange={(e) => setOpdSettings({ ...opdSettings, specialization: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={opdSettings.fee}
                    onChange={(e) => setOpdSettings({ ...opdSettings, fee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Patients Allowed Today</label>
                  <input
                    type="number"
                    required
                    value={opdSettings.dailyPatientLimit}
                    onChange={(e) => setOpdSettings({ ...opdSettings, dailyPatientLimit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">OPD Check-in Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="09:00 AM"
                    value={opdSettings.checkinStartTime}
                    onChange={(e) => setOpdSettings({ ...opdSettings, checkinStartTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Appointments Allowed Till...</label>
                  <input
                    type="text"
                    required
                    placeholder="05:00 PM"
                    value={opdSettings.appointmentCutoffTime}
                    onChange={(e) => setOpdSettings({ ...opdSettings, appointmentCutoffTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono text-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Default Patient Follow-up</label>
                <select
                  value={opdSettings.defaultFollowupDays}
                  onChange={(e) => setOpdSettings({ ...opdSettings, defaultFollowupDays: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="3 Days">Follow-up after 3 Days</option>
                  <option value="5 Days">Follow-up after 5 Days</option>
                  <option value="7 Days">Follow-up after 7 Days</option>
                  <option value="10 Days">Follow-up after 10 Days</option>
                  <option value="14 Days">Follow-up after 14 Days</option>
                  <option value="30 Days">Follow-up after 30 Days</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowSettingsModal(false)} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#00875A] text-white font-extrabold text-xs rounded-xl shadow-md">
                  Save Settings & Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
