import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Stethoscope,
  UserPlus,
  MessageSquare,
  Send,
  Trash2,
  CheckCheck,
  ArrowUpRight,
  Download,
  Printer,
  CheckCircle2,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../hooks/useSEO'

interface DoctorItem {
  id: string
  name: string
  email: string
  password?: string
  dept: string
  specialization: string
  fee: number
  limit: number
  status: 'active' | 'inactive'
}

interface ChatMessage {
  id: string
  sender: 'admin' | 'doctor'
  doctorId: string
  text: string
  time: string
  status: 'sent' | 'delivered' | 'read'
}

export default function HospitalAdminPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { doctorProfile, registerUserInSupabase, logout } = useAuth()

  const [notice, setNotice] = useState<string | null>(null)

  // Determine sub-page tab from URL path
  const getTabFromPath = (): 'overview' | 'queues' | 'doctors' | 'messages' | 'qr' => {
    const path = location.pathname.toLowerCase()
    if (path.includes('/queues')) return 'queues'
    if (path.includes('/doctors')) return 'doctors'
    if (path.includes('/messages')) return 'messages'
    if (path.includes('/qr')) return 'qr'
    return 'overview'
  }

  const activeTab = getTabFromPath()

  useSEO({
    title: `${activeTab.toUpperCase()} - Hospital Admin Portal`,
    description: 'Manage doctor licenses, live OPD queues, revenue breakdown, and QR kiosks.',
  })

  const hospitalId = doctorProfile?.hospital_id || localStorage.getItem('hospital_id') || 'hosp-001'
  const hospitalName = doctorProfile?.hospital_name || localStorage.getItem('hospital_name') || 'Hospital Facility'
  const adminEmail = doctorProfile?.email || 'admin@hospital.com'

  // Hospital Doctor Roster
  const [doctorSeatLimit] = useState(5)
  const [hospitalDoctors, setHospitalDoctors] = useState<DoctorItem[]>(() => {
    try {
      const saved = localStorage.getItem('clinicos_hospital_doctors')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return [
      {
        id: 'doc-001',
        name: 'Dr. Rahul Sharma',
        email: 'doctor@shahidkhan.site',
        password: 'Shahideeba@19019',
        dept: 'General Medicine',
        specialization: 'Senior Physician',
        fee: 500,
        limit: 35,
        status: 'active',
      },
      {
        id: 'doc-002',
        name: 'Dr. Shahid Khan',
        email: 'drshahid@medtech.com',
        password: 'Shahideeba@19019',
        dept: 'Cardiology',
        specialization: 'Consultant Specialist',
        fee: 800,
        limit: 25,
        status: 'active',
      },
    ]
  })

  // Doctor Onboarding Modal State
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [isRegisteringDoctor, setIsRegisteringDoctor] = useState(false)
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    password: '',
    dept: 'General Medicine',
    specialization: 'Consultant Physician',
    fee: 500,
    limit: 25,
  })

  // In-Built Chat System State
  const [selectedChatDoctor, setSelectedChatDoctor] = useState<string>('doc-001')
  const [chatInputText, setChatInputText] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('clinicos_chat_messages')
      if (saved) return JSON.parse(saved)
    } catch (e) {}

    return [
      {
        id: 'msg-1',
        sender: 'doctor',
        doctorId: 'doc-001',
        text: 'Good morning Admin. OPD queue is active for today.',
        time: '10:15 AM',
        status: 'read',
      },
      {
        id: 'msg-2',
        sender: 'admin',
        doctorId: 'doc-001',
        text: 'Hello Dr. Rahul! Patient #104 has arrived in Room 2.',
        time: '10:16 AM',
        status: 'read',
      },
    ]
  })

  // Save Doctor List & Chat Messages on Change
  useEffect(() => {
    try {
      localStorage.setItem('clinicos_hospital_doctors', JSON.stringify(hospitalDoctors))
    } catch (e) {}
  }, [hospitalDoctors])

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

  // Handle Doctor Onboarding
  const handleOnboardDoctor = async (e: React.FormEvent) => {
    e.preventDefault()

    if (hospitalDoctors.length >= doctorSeatLimit) {
      alert(`Doctor Seat Limit Reached (${hospitalDoctors.length}/${doctorSeatLimit}). Please contact Platform Owner at /mrshahidbabu to request more doctor seats.`)
      return
    }

    setIsRegisteringDoctor(true)
    const docId = `doc-${Date.now().toString().slice(-4)}`

    try {
      await registerUserInSupabase(doctorForm.email, doctorForm.password, {
        role: 'doctor',
        name: doctorForm.name,
        dept: doctorForm.dept,
        hospital_id: hospitalId,
      })
    } catch (err: any) {
      console.warn('Supabase Notice:', err.message)
    }

    const newDoc: DoctorItem = {
      id: docId,
      name: doctorForm.name,
      email: doctorForm.email,
      password: doctorForm.password,
      dept: doctorForm.dept,
      specialization: doctorForm.specialization,
      fee: Number(doctorForm.fee) || 500,
      limit: Number(doctorForm.limit) || 25,
      status: 'active',
    }

    const updated = [...hospitalDoctors, newDoc]
    setHospitalDoctors(updated)
    setShowDoctorModal(false)
    setIsRegisteringDoctor(false)
    setDoctorForm({
      name: '',
      email: '',
      password: '',
      dept: 'General Medicine',
      specialization: 'Consultant Physician',
      fee: 500,
      limit: 25,
    })
    setNotice(`Doctor "${newDoc.name}" successfully onboarded! Credentials saved.`)
    setTimeout(() => setNotice(null), 5000)
  }

  // Handle Doctor Removal
  const handleDeleteDoctor = (docId: string, docName: string) => {
    if (!window.confirm(`Are you sure you want to remove doctor "${docName}" from the hospital roster?`)) {
      return
    }
    const updated = hospitalDoctors.filter((d) => d.id !== docId)
    setHospitalDoctors(updated)
    setNotice(`Doctor "${docName}" removed from facility roster.`)
    setTimeout(() => setNotice(null), 4000)
  }

  // Handle In-Built Chat Send
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!chatInputText.trim()) return

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      doctorId: selectedChatDoctor,
      text: chatInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    }

    setChatMessages((prev) => [...prev, newMsg])
    setChatInputText('')

    // Simulate instant doctor reply
    setTimeout(() => {
      const doc = hospitalDoctors.find((d) => d.id === selectedChatDoctor)
      const docMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'doctor',
        doctorId: selectedChatDoctor,
        text: `Understood, Admin. Update acknowledged by ${doc?.name || 'Doctor'}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      }
      setChatMessages((prev) => [...prev, docMsg])
    }, 1200)
  }

  const currentChatDoctorObj = hospitalDoctors.find((d) => d.id === selectedChatDoctor) || hospitalDoctors[0]
  const currentDocMessages = chatMessages.filter((m) => m.doctorId === selectedChatDoctor)
  const totalFacilityRevenue = hospitalDoctors.reduce((acc, d) => acc + (d.fee * 15), 0)

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 font-sans selection:bg-emerald-600 selection:text-white p-4 sm:p-6">
      {/* Notice Notification Banner */}
      {notice && (
        <div className="max-w-7xl mx-auto mb-4 bg-[#00875A] text-white px-4 py-3 rounded-2xl text-xs font-bold text-center flex items-center justify-between shadow-md">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} /> {notice}
          </span>
          <button onClick={() => setNotice(null)} className="text-white hover:opacity-80 font-bold">✕</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP MEDLINK EXECUTIVE HEADER BAR */}
        <header className="bg-white rounded-3xl p-4 sm:px-6 shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="MedTech Fixaters Logo" className="h-9 object-contain" />
            <div className="flex flex-col text-left">
              <span className="font-black text-lg text-slate-900 tracking-tight leading-none">{hospitalName}</span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-widest uppercase mt-0.5">Admin: {adminEmail}</span>
            </div>
          </div>

          {/* Navigation Pill Tabs - Route Pages */}
          <div className="bg-slate-100/80 p-1.5 rounded-full flex items-center gap-1 border border-slate-200/50 self-center">
            <button
              onClick={() => navigate('/hospitaladmin/overview')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => navigate('/hospitaladmin/queues')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'queues' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Live Queues
            </button>
            <button
              onClick={() => navigate('/hospitaladmin/doctors')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'doctors' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Doctors & Revenue ({hospitalDoctors.length})
            </button>
            <button
              onClick={() => navigate('/hospitaladmin/messages')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'messages' ? 'bg-[#00875A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              In-built Chat
            </button>
            <button
              onClick={() => navigate('/hospitaladmin/qr')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'qr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              QR Kiosk
            </button>
          </div>

          {/* Action & Logout Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowDoctorModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-full shadow-sm flex items-center gap-1.5"
            >
              <UserPlus size={15} /> + Onboard Doctor
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

        {/* TAB 1: OVERVIEW BENTO GRID */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* COLUMN 1: DOCTOR HERO PROFILE CARD (3 COLS) */}
            <div className="md:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-5 text-left">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=500"
                    alt="Active Doctor Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                    <p className="font-extrabold text-base tracking-tight">{currentChatDoctorObj?.name || 'Dr. Rahul Sharma'}</p>
                    <p className="text-xs text-emerald-400 font-medium">{currentChatDoctorObj?.dept || 'General Medicine'}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <p className="text-slate-400 font-bold uppercase">Specialization:</p>
                  <p className="font-bold text-slate-800">{currentChatDoctorObj?.specialization || 'Senior Physician'}</p>
                  <p className="text-slate-400 font-bold uppercase pt-2">Email Credentials:</p>
                  <p className="font-mono text-emerald-700">{currentChatDoctorObj?.email}</p>
                  <p className="text-slate-400 font-bold uppercase pt-2">Consultation Fee:</p>
                  <p className="font-mono font-black text-slate-900 text-sm">₹{currentChatDoctorObj?.fee || 500} / Visit</p>
                </div>
              </div>
            </div>

            {/* COLUMN 2: REVENUE & LIVE QUEUES (5 COLS) */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Today's OPD Activity</h3>
                    <p className="text-xs text-slate-400 font-medium">Real-time consultation metrics</p>
                  </div>
                  <button onClick={() => navigate('/hospitaladmin/queues')} className="text-xs font-bold text-emerald-700 hover:underline">
                    View Live Queues
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Capacity</p>
                    <p className="text-xl font-black text-slate-900 font-mono mt-0.5">{hospitalDoctors.length}/{doctorSeatLimit} Seats</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Consulting</p>
                    <p className="text-xl font-black text-emerald-700 font-mono mt-0.5">14 Active</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Waiting</p>
                    <p className="text-xl font-black text-amber-600 font-mono mt-0.5">18 Queue</p>
                  </div>
                </div>
              </div>

              {/* DOCTOR REVENUE BREAKDOWN TABLE */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Doctor Revenue Breakdown</h3>
                    <p className="text-xs text-slate-400 font-medium">Daily consultations revenue</p>
                  </div>
                  <button onClick={() => navigate('/hospitaladmin/doctors')} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <ArrowUpRight size={16} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 font-bold border-b border-slate-100">
                        <th className="pb-3 font-semibold">Doctor Name</th>
                        <th className="pb-3 font-semibold">Department</th>
                        <th className="pb-3 font-semibold text-center">Fee</th>
                        <th className="pb-3 font-semibold text-right">Revenue</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {hospitalDoctors.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 font-extrabold text-slate-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                              <Stethoscope size={14} />
                            </div>
                            <span>{doc.name}</span>
                          </td>
                          <td className="py-3 text-slate-500 font-medium">{doc.dept}</td>
                          <td className="py-3 text-center font-mono font-bold text-slate-700">₹{doc.fee}</td>
                          <td className="py-3 text-right font-mono font-black text-emerald-700">
                            ₹{(doc.fee * 15).toLocaleString()}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedChatDoctor(doc.id)
                                  navigate('/hospitaladmin/messages')
                                }}
                                className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
                                title="Send Message"
                              >
                                <MessageSquare size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                                className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                                title="Remove Doctor"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">Total OPD Revenue:</span>
                  <span className="text-xl font-black text-slate-900 font-mono">₹{totalFacilityRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* COLUMN 3: IN-BUILT CHAT SYSTEM (4 COLS) */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4 text-left flex flex-col justify-between min-h-[420px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">In-built Chat</h3>
                      <p className="text-[11px] text-slate-400">Direct message doctor</p>
                    </div>
                  </div>

                  <select
                    value={selectedChatDoctor}
                    onChange={(e) => setSelectedChatDoctor(e.target.value)}
                    className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    {hospitalDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[260px] p-2 font-sans">
                  {currentDocMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'admin'
                            ? 'bg-[#d8edd6] text-slate-900 rounded-tr-xs shadow-xs font-medium'
                            : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className={`flex items-center gap-1 justify-end pt-1 text-[9px] font-mono ${msg.sender === 'admin' ? 'text-emerald-800' : 'text-slate-400'}`}>
                          <span>{msg.time}</span>
                          {msg.sender === 'admin' && <CheckCheck size={12} className="text-emerald-700" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder="Type a message to doctor..."
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

        {/* TAB 2: LIVE QUEUES */}
        {activeTab === 'queues' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-6 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Live OPD Queue Tracker</h2>
                <p className="text-xs text-slate-500">Real-time doctor waiting room monitor</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-bold">
                Live Status
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hospitalDoctors.map((doc) => (
                <div key={doc.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                        <Stethoscope size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{doc.dept}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase">
                      Active In-Room
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200">
                      <p className="text-slate-400 text-[10px] uppercase font-sans">In-Room</p>
                      <p className="text-base font-bold text-emerald-700">Patient #104</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-200">
                      <p className="text-slate-400 text-[10px] uppercase font-sans">Waiting</p>
                      <p className="text-base font-bold text-amber-600">8 Patients</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-200">
                      <p className="text-slate-400 text-[10px] uppercase font-sans">Completed</p>
                      <p className="text-base font-bold text-slate-900">18 Done</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DOCTORS & REVENUE */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Doctor Roster & Revenue Management</h2>
                <p className="text-xs text-slate-500">Onboard doctors, view seat limits ({hospitalDoctors.length}/{doctorSeatLimit}), and track revenue</p>
              </div>
              <button
                onClick={() => setShowDoctorModal(true)}
                className="px-5 py-2.5 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs rounded-2xl shadow-sm flex items-center gap-2"
              >
                <UserPlus size={16} /> + Onboard New Doctor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitalDoctors.map((doc) => (
                <div key={doc.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest">{doc.id}</span>
                        <h3 className="text-base font-black text-slate-900">{doc.name}</h3>
                      </div>
                      <span className="px-3 py-1 text-[10px] font-extrabold rounded-full uppercase bg-emerald-100 text-emerald-800">
                        {doc.status}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-mono">
                      <p><span className="text-slate-400">Dept:</span> <strong className="text-slate-800">{doc.dept}</strong></p>
                      <p><span className="text-slate-400">Email:</span> <strong className="text-emerald-700">{doc.email}</strong></p>
                      {doc.password && <p><span className="text-slate-400">Password:</span> <strong className="text-amber-700">{doc.password}</strong></p>}
                      <p><span className="text-slate-400">Consultation Fee:</span> <strong className="text-slate-900">₹{doc.fee}</strong></p>
                      <p><span className="text-slate-400">Est. Daily Revenue:</span> <strong className="text-emerald-700">₹{(doc.fee * 15).toLocaleString()}</strong></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setSelectedChatDoctor(doc.id)
                        navigate('/hospitaladmin/messages')
                      }}
                      className="py-2 bg-white hover:bg-slate-100 text-emerald-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1"
                    >
                      <MessageSquare size={14} /> Send Message
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                      className="py-2 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: IN-BUILT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Hospital In-built Chat Panel</h2>
                <p className="text-xs text-slate-500">Send direct real-time instructions to practising doctors</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">Select Doctor:</label>
                <select
                  value={selectedChatDoctor}
                  onChange={(e) => setSelectedChatDoctor(e.target.value)}
                  className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                >
                  {hospitalDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.name} ({doc.dept})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 max-w-3xl mx-auto min-h-[350px] flex flex-col justify-between">
              <div className="space-y-3 overflow-y-auto max-h-[320px] p-2 font-sans">
                {currentDocMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-5 py-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'admin'
                          ? 'bg-[#d8edd6] text-slate-900 rounded-tr-xs shadow-xs font-medium'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`flex items-center gap-1 justify-end pt-1 text-[9px] font-mono ${msg.sender === 'admin' ? 'text-emerald-800' : 'text-slate-400'}`}>
                        <span>{msg.time}</span>
                        {msg.sender === 'admin' && <CheckCheck size={12} className="text-emerald-700" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  placeholder={`Write a message to ${currentChatDoctorObj?.name}...`}
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

        {/* TAB 5: QR KIOSK */}
        {activeTab === 'qr' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Hospital Reception QR Kiosk</h2>
                <p className="text-xs text-slate-500">Generate, print and download OPD self check-in QR poster</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
                Token: tok_hosp-001
              </span>
            </div>

            <div className="max-w-md mx-auto bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent('https://medtechfixaters.com/a/tok_hosp-001')}`}
                  alt="Hospital OPD QR Code"
                  className="w-48 h-48 object-contain mx-auto"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{hospitalName} OPD Reception Kiosk</h3>
                <p className="text-xs text-slate-500">Patients scan this QR code to get instant digital token & queue number</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="py-3 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Printer size={16} /> Print Signage Poster
                </button>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent('https://medtechfixaters.com/a/tok_hosp-001')}`}
                  download="hospital-opd-qr.png"
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Download PNG
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DOCTOR ONBOARDING MODAL */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Onboard Practising Doctor</h3>
                <p className="text-xs text-slate-500">Save credentials directly to Supabase Auth & Hospital Roster</p>
              </div>
              <button onClick={() => setShowDoctorModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
              <span>Doctor Capacity: <strong>{hospitalDoctors.length}/{doctorSeatLimit} Seats Used</strong></span>
              <span className="text-emerald-700 font-mono text-[11px] font-bold">Seat Limit Enforced</span>
            </div>

            <form onSubmit={handleOnboardDoctor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  placeholder="e.g. Dr. Anish Kapoor"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Login Email *</label>
                  <input
                    type="email"
                    required
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    placeholder="doctor@hospital.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Login Password *</label>
                  <input
                    type="password"
                    required
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    value={doctorForm.dept}
                    onChange={(e) => setDoctorForm({ ...doctorForm, dept: e.target.value })}
                    placeholder="Cardiology"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={doctorForm.fee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, fee: Number(e.target.value) })}
                    placeholder="500"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegisteringDoctor}
                  className="px-6 py-2.5 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs rounded-xl shadow-md"
                >
                  {isRegisteringDoctor ? 'Saving Credentials...' : 'Onboard Doctor & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
