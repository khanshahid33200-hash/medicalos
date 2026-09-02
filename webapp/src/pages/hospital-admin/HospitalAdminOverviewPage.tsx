import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, MessageSquare, Send, ArrowUpRight, Trash2 } from 'lucide-react'
import HospitalAdminHeader from '../../components/HospitalAdminHeader'
import { useAuth } from '../../context/AuthContext'
import { useSEO } from '../../hooks/useSEO'

interface DoctorItem {
  id: string
  name: string
  email: string
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

import { getDoctorRealStats, getQueueForDoctor } from '../../utils/doctorStore'

export default function HospitalAdminOverviewPage() {
  useSEO({
    title: 'Overview Page - Hospital Admin Dashboard',
    description: 'Hospital administration executive overview page.',
  })

  const { registerUserInSupabase, doctorProfile } = useAuth()
  const currentHospId = doctorProfile?.hospital_id || ''

  const [notice, setNotice] = useState<string | null>(null)
  const [hospitalDoctors, setHospitalDoctors] = useState<DoctorItem[]>(() => {
    try {
      const saved = localStorage.getItem(`clinicos_hospital_doctors_${currentHospId}`)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  })

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

  const [selectedChatDoctor, setSelectedChatDoctor] = useState<string>('')
  const [chatInputText, setChatInputText] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('clinicos_chat_messages')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  })

  useEffect(() => {
    if (!currentHospId) return
    try {
      // Hospital-scoped key ONLY — writing the unscoped global key here was
      // one of the cross-hospital leak paths.
      localStorage.setItem(`clinicos_hospital_doctors_${currentHospId}`, JSON.stringify(hospitalDoctors))
    } catch (e) {}
  }, [hospitalDoctors, currentHospId])

  useEffect(() => {
    try {
      localStorage.setItem('clinicos_chat_messages', JSON.stringify(chatMessages))
    } catch (e) {}
  }, [chatMessages])

  const handleOnboardDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentHospId) {
      alert('No hospital linked to this admin account — cannot onboard a doctor.')
      return
    }
    setIsRegisteringDoctor(true)
    const docId = `doc-${Date.now().toString().slice(-4)}`

    try {
      // hospital_id was previously omitted — see HospitalAdminDoctorsPage.tsx
      // for the same fix and rationale.
      await registerUserInSupabase(doctorForm.email, doctorForm.password, {
        role: 'doctor',
        name: doctorForm.name,
        hospital_id: currentHospId,
        dept: doctorForm.dept,
        fee: Number(doctorForm.fee) || 500,
        limit: Number(doctorForm.limit) || 25,
      })
    } catch (err: any) {}

    const newDoc: DoctorItem = {
      id: docId,
      name: doctorForm.name,
      email: doctorForm.email,
      dept: doctorForm.dept,
      specialization: doctorForm.specialization,
      fee: Number(doctorForm.fee) || 500,
      limit: Number(doctorForm.limit) || 25,
      status: 'active',
    }

    setHospitalDoctors([...hospitalDoctors, newDoc])
    setShowDoctorModal(false)
    setIsRegisteringDoctor(false)
    setNotice(`Doctor "${newDoc.name}" onboarded!`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleDeleteDoctor = (docId: string, docName: string) => {
    if (!window.confirm(`Remove doctor "${docName}"?`)) return
    setHospitalDoctors(hospitalDoctors.filter((d) => d.id !== docId))
  }

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

    setChatMessages([...chatMessages, newMsg])
    setChatInputText('')
  }

  const currentChatDoctorObj = hospitalDoctors.find((d) => d.id === selectedChatDoctor) || hospitalDoctors[0]
  const currentDocMessages = chatMessages.filter((m) => m.doctorId === selectedChatDoctor)
  const totalRevenue = hospitalDoctors.reduce((acc, d) => acc + getDoctorRealStats(d.id, d.fee).revenue, 0)

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 font-sans p-4 sm:p-6">
      {notice && (
        <div className="max-w-7xl mx-auto mb-4 bg-[#00875A] text-white px-4 py-3 rounded-2xl text-xs font-bold text-center">
          {notice}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <HospitalAdminHeader onOpenOnboardModal={() => setShowDoctorModal(true)} />

        {/* Overview Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Active Doctor Profile */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-5 text-left">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=500"
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <p className="font-extrabold text-base">{currentChatDoctorObj?.name}</p>
                  <p className="text-xs text-emerald-400 font-medium">{currentChatDoctorObj?.dept}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-slate-400 font-bold uppercase">Specialization:</p>
                <p className="font-bold text-slate-800">{currentChatDoctorObj?.specialization}</p>
                <p className="text-slate-400 font-bold uppercase pt-2">Login Email:</p>
                <p className="font-mono text-emerald-700">{currentChatDoctorObj?.email}</p>
                <p className="text-slate-400 font-bold uppercase pt-2">Fee:</p>
                <p className="font-mono font-black text-slate-900 text-sm">₹{currentChatDoctorObj?.fee} / Patient</p>
              </div>
            </div>
          </div>

          {/* Clinical Activity & Revenue Table */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Today's OPD Activity</h3>
                  <p className="text-xs text-slate-400 font-medium">Real-time consultation summary</p>
                </div>
                <Link to="/hospitaladmin/queues" className="text-xs font-bold text-emerald-700 hover:underline">
                  View Live Queues →
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Doctors</p>
                  <p className="text-xl font-black text-slate-900 font-mono mt-0.5">{hospitalDoctors.length} Active</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Consulting</p>
                  <p className="text-xl font-black text-emerald-700 font-mono mt-0.5">
                    {hospitalDoctors.reduce((acc, doc) => acc + getQueueForDoctor(doc.id).filter((q) => q.status === 'With Doctor').length, 0)} In-Room
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Waiting</p>
                  <p className="text-xl font-black text-amber-600 font-mono mt-0.5">
                    {hospitalDoctors.reduce((acc, doc) => acc + getQueueForDoctor(doc.id).filter((q) => q.status === 'Waiting').length, 0)} Patients
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Doctor OPD Revenue Breakdown</h3>
                  <p className="text-xs text-slate-400 font-medium">Calculated OPD collection</p>
                </div>
                <Link to="/hospitaladmin/doctors" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-bold border-b border-slate-100">
                      <th className="pb-3 font-semibold">Doctor Name</th>
                      <th className="pb-3 font-semibold">Dept</th>
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
                        <td className="py-3 text-right font-mono font-black text-emerald-700">₹{getDoctorRealStats(doc.id, doc.fee).revenue.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to="/hospitaladmin/messages"
                              onClick={() => setSelectedChatDoctor(doc.id)}
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
                              title="Send Message"
                            >
                              <MessageSquare size={13} />
                            </Link>
                            <button
                              onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                              className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                              title="Delete Doctor"
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
                <span className="text-xs font-extrabold text-slate-900">Total Revenue:</span>
                <span className="text-xl font-black text-slate-900 font-mono">₹{totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Doctor Chat Box */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4 text-left flex flex-col justify-between min-h-[420px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Quick Doctor Chat</h3>
                    <p className="text-[11px] text-slate-400">Direct message panel</p>
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
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs ${
                        msg.sender === 'admin' ? 'bg-[#d8edd6] text-slate-900' : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[9px] text-slate-400 font-mono block text-right pt-0.5">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2 border-t border-slate-100">
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium outline-none"
                />
                <button type="submit" className="w-9 h-9 rounded-full bg-[#00875A] text-white flex items-center justify-center">
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Onboard Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Onboard Doctor</h3>
              <button onClick={() => setShowDoctorModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleOnboardDoctor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  placeholder="Dr. Anish Kapoor"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Login Email *</label>
                  <input
                    type="email"
                    required
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    placeholder="doctor@hospital.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={doctorForm.dept}
                    onChange={(e) => setDoctorForm({ ...doctorForm, dept: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fee (₹)</label>
                  <input
                    type="number"
                    value={doctorForm.fee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, fee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowDoctorModal(false)} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">Cancel</button>
                <button type="submit" disabled={isRegisteringDoctor} className="px-6 py-2.5 bg-[#00875A] text-white font-extrabold text-xs rounded-xl shadow-md">Onboard & Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
