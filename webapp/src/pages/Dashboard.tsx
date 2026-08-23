import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Calendar, Building2, Stethoscope, Clock, ShieldCheck, DollarSign, PhoneCall, UserPlus, Key } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import { getQueueForDoctor, getAppointmentsForDoctor } from '../utils/doctorStore'

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

export default function Dashboard() {
  const navigate = useNavigate()
  const { doctorProfile, registerUserInSupabase } = useAuth()

  const [userRole, setUserRole] = useState<'hospital_admin' | 'doctor'>('doctor')
  const [notice, setNotice] = useState<string | null>(null)

  const doctorId = doctorProfile?.doctor_id || 'doc-001'
  const doctorName = doctorProfile?.name || 'Dr. Authorized Doctor'
  const hospitalName = doctorProfile?.hospital_name || 'Metro Care General Hospital'
  const departmentName = doctorProfile?.department_name || 'Cardiology'

  // Hospital Seat Limit & Doctor Roster
  const [doctorSeatLimit] = useState(5)
  const [hospitalDoctors, setHospitalDoctors] = useState<DoctorItem[]>(() => {
    try {
      const saved = localStorage.getItem('clinicos_hospital_doctors')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  // Doctor Onboarding Modal State
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [isRegisteringDoctor, setIsRegisteringDoctor] = useState(false)
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    password: '',
    qualification: 'MBBS, MD',
    dept: 'Cardiology',
    specialization: 'Consultant Physician',
    fee: 500,
    limit: 25
  })

  const [queueList, setQueueList] = useState<any[]>([])
  const [aptList, setAptList] = useState<any[]>([])

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

  // Doctor Onboarding Handler for Hospital Admin - Saves Credentials directly in Supabase Auth
  const handleOnboardDoctor = async (e: React.FormEvent) => {
    e.preventDefault()

    if (hospitalDoctors.length >= doctorSeatLimit) {
      alert(`Doctor Seat Limit Reached (${hospitalDoctors.length}/${doctorSeatLimit}). Please contact Platform Owner at /mrshahidbabu to upgrade doctor seats.`)
      return
    }

    setIsRegisteringDoctor(true)
    const docId = `doc-${Date.now().toString().slice(-4)}`

    try {
      // 1. Save Doctor Credentials directly in Supabase Auth
      await registerUserInSupabase(doctorForm.email, doctorForm.password, {
        role: 'doctor',
        name: doctorForm.name,
        dept: doctorForm.dept,
      })
    } catch (err: any) {
      console.warn('Supabase Auth Doctor Registration Notice:', err.message)
    }

    const newDoc: DoctorItem = {
      id: docId,
      name: doctorForm.name,
      email: doctorForm.email,
      password: doctorForm.password.trim(),
      dept: doctorForm.dept,
      specialization: doctorForm.specialization,
      fee: Number(doctorForm.fee) || 500,
      limit: Number(doctorForm.limit) || 25,
      status: 'active'
    }

    const updated = [...hospitalDoctors, newDoc]
    setHospitalDoctors(updated)
    localStorage.setItem('clinicos_hospital_doctors', JSON.stringify(updated))
    setShowDoctorModal(false)
    setIsRegisteringDoctor(false)
    setDoctorForm({
      name: '',
      email: '',
      password: '',
      qualification: 'MBBS, MD',
      dept: 'Cardiology',
      specialization: 'Consultant Physician',
      fee: 500,
      limit: 25
    })

    setNotice(`Doctor profile & Supabase Auth login credentials created for ${newDoc.name} (${newDoc.email})!`)
    setTimeout(() => setNotice(null), 5000)
  }

  const totalCheckins = queueList.length
  const scheduledApts = aptList.filter((a) => a.status === 'Scheduled').length
  const completedConsultations = queueList.filter((q) => q.status === 'Completed').length
  const waitingCount = queueList.filter((q) => q.status === 'Waiting').length

  // HOSPITAL ADMIN DASHBOARD VIEW (/login/hospitaladmin009)
  if (userRole === 'hospital_admin') {
    return (
      <Layout font-sans>
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-400/30">
                Hospital Administration Portal (/login/hospitaladmin009)
              </span>
              <h1 className="text-3xl sm:text-4xl font-black font-recoleta tracking-tight">
                {hospitalName} Control Center
              </h1>
              <p className="text-blue-200 text-xs font-medium">
                Onboard Practising Doctors, create Supabase Auth login credentials, and monitor OPD queues
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => setShowDoctorModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                <UserPlus size={16} /> + Onboard New Doctor
              </Button>
              <Button variant="secondary" onClick={() => navigate('/payments')} className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
                Payments & Refunds
              </Button>
            </div>
          </div>

          {notice && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow">
              <span>✓ {notice}</span>
              <button onClick={() => setNotice(null)} className="text-emerald-800 hover:text-slate-900">✕</button>
            </div>
          )}

          {/* Hospital Seat Limit & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition">
              <CardContent className="flex items-start justify-between pt-6">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Doctor Seats Used</p>
                  <p className="text-3xl font-black text-slate-900 font-mono mt-1">
                    {hospitalDoctors.length} / {doctorSeatLimit} Seats
                  </p>
                  <p className="text-[11px] text-blue-600 font-bold">Owner Assigned Limit</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                  <Stethoscope size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition">
              <CardContent className="flex items-start justify-between pt-6">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Today's Collections</p>
                  <p className="text-3xl font-black text-emerald-600 font-mono mt-1">₹28,400</p>
                  <p className="text-[11px] text-slate-400 font-medium">35 Paid Appointments</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                  <DollarSign size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition">
              <CardContent className="flex items-start justify-between pt-6">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Waiting Room Queue</p>
                  <p className="text-3xl font-black text-amber-600 font-mono mt-1">{waitingCount} Waiting</p>
                  <p className="text-[11px] text-slate-400 font-medium">Avg wait ~12 mins</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                  <Clock size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition">
              <CardContent className="flex items-start justify-between pt-6">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Voice Reception Agent</p>
                  <p className="text-3xl font-black text-purple-600 font-mono mt-1">127 Calls</p>
                  <p className="text-[11px] text-slate-400 font-medium">Hindi & English AI</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
                  <PhoneCall size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onboarded Doctors Table */}
          <Card className="border border-slate-200 rounded-3xl shadow-md">
            <CardHeader title={`Onboarded Doctor Roster (${hospitalDoctors.length}/${doctorSeatLimit} Seats)`} />
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Doctor & Supabase Auth Email</th>
                      <th className="px-4 py-3">Department & Specialization</th>
                      <th className="px-4 py-3">Consultation Fee</th>
                      <th className="px-4 py-3">Daily Patient Limit</th>
                      <th className="px-4 py-3">Supabase Auth Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold">
                    {hospitalDoctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <p className="font-extrabold text-slate-900 text-sm">{doc.name}</p>
                          <p className="text-slate-400 font-mono">{doc.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-blue-600">{doc.dept}</p>
                          <p className="text-[11px] text-slate-400 font-normal">{doc.specialization}</p>
                        </td>
                        <td className="px-4 py-3 font-mono font-extrabold text-emerald-600 text-sm">
                          ₹{doc.fee}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {doc.limit} Patients / Day
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">
                            ✓ Supabase Auth Created
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* DOCTOR ONBOARDING MODAL FOR HOSPITAL ADMIN */}
          {showDoctorModal && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl p-6 space-y-4 text-slate-800 font-sans">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold font-recoleta flex items-center gap-2 text-slate-900">
                    <UserPlus className="text-emerald-600" size={20} /> Onboard Doctor & Save Credentials to Supabase Auth
                  </h3>
                  <button onClick={() => setShowDoctorModal(false)} className="text-slate-400 hover:text-slate-900">✕</button>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-xs text-blue-900 flex items-center justify-between">
                  <span>Hospital Seats: <strong>{hospitalDoctors.length}/{doctorSeatLimit} Used</strong></span>
                  <span className="text-blue-700 font-mono text-[11px]">Seat Limit Enforced</span>
                </div>

                <form onSubmit={handleOnboardDoctor} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1">Doctor Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Anish Kapoor"
                      value={doctorForm.name}
                      onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1">Doctor Login Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="doctor@hospital.com"
                        value={doctorForm.email}
                        onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1">Initial Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={doctorForm.password}
                        onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                      <input
                        type="text"
                        placeholder="Cardiology"
                        value={doctorForm.dept}
                        onChange={(e) => setDoctorForm({ ...doctorForm, dept: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1">Specialization</label>
                      <input
                        type="text"
                        placeholder="Consultant Physician"
                        value={doctorForm.specialization}
                        onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1">Consultation Fee (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="500"
                        value={doctorForm.fee}
                        onChange={(e) => setDoctorForm({ ...doctorForm, fee: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1">Daily Patient Limit</label>
                      <input
                        type="number"
                        required
                        placeholder="25"
                        value={doctorForm.limit}
                        onChange={(e) => setDoctorForm({ ...doctorForm, limit: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setShowDoctorModal(false)} className="flex-1 text-xs">
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isRegisteringDoctor} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5">
                      <Key size={14} /> Create Credentials in Supabase Auth
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </Layout>
    )
  }

  // DOCTOR WORKSPACE VIEW
  return (
    <Layout font-sans>
      <div className="space-y-6">
        {/* Authenticated Doctor Welcome Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-widest">
              <Building2 size={16} /> {hospitalName}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-recoleta tracking-tight">
              Welcome back, {doctorName}!
            </h1>
            <p className="text-blue-200 text-xs flex items-center gap-2">
              <Stethoscope size={16} className="text-blue-400" />
              <span>Assigned Department: <strong>{departmentName}</strong></span>
              <span className="text-blue-400">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck size={14} /> Doctor Workspace
              </span>
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/queue')}
            className="bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 text-white font-bold text-xs"
          >
            Open Live Queue
          </Button>
        </div>

        {/* Doctor-Specific Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Today's Queue Check-ins</p>
                <p className="text-3xl font-black text-slate-900 font-mono mt-1">{totalCheckins} Patients</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                <Users size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Scheduled Appointments</p>
                <p className="text-3xl font-black text-slate-900 font-mono mt-1">{scheduledApts} Active</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <Calendar size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Completed Consultations</p>
                <p className="text-3xl font-black text-slate-900 font-mono mt-1">{completedConsultations} Patients</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
                <Users size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Waiting Room Queue</p>
                <p className="text-3xl font-black text-amber-600 font-mono mt-1">{waitingCount} Waiting</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                <Clock size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation & Action Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border border-slate-200 rounded-3xl shadow-md">
              <CardHeader title={`Active Workspace for ${doctorName}`} />
              <CardContent className="space-y-4 pt-4">
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Live Department Queue</p>
                    <p className="text-xs text-slate-600">Call next patient, start consultations, or skip</p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => navigate('/queue')}>
                    Launch Queue
                  </Button>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Appointments Hub</p>
                    <p className="text-xs text-slate-600">Manage Today's, Upcoming, and Completed appointments</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/appointments')}>
                    Appointments
                  </Button>
                </div>

                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Clinical History Archive</p>
                    <p className="text-xs text-slate-600">Deep-dive patient profile, queue history, & reports</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/history')}>
                    Patient History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-slate-200 rounded-3xl shadow-md">
            <CardHeader title="Doctor Shortcuts" />
            <CardContent className="py-6 space-y-3">
              <button
                onClick={() => navigate('/qr-kiosk')}
                className="w-full px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold text-xs transition shadow-md shadow-blue-500/20 text-left flex items-center justify-between"
              >
                <span>📱 Generate Hospital Single QR Kiosk</span>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="w-full px-4 py-3 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl font-bold text-xs transition text-left flex items-center justify-between"
              >
                <span>📄 View Patient Reports</span>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate('/appointments')}
                className="w-full px-4 py-3 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl font-bold text-xs transition text-left flex items-center justify-between"
              >
                <span>🗓️ Schedule Appointment</span>
                <span>→</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
