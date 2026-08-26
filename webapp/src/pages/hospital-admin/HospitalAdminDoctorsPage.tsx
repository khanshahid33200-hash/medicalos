import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, MessageSquare, Trash2, Edit3, Key, CheckCircle2 } from 'lucide-react'
import HospitalAdminHeader from '../../components/HospitalAdminHeader'
import { useAuth } from '../../context/AuthContext'
import { useSEO } from '../../hooks/useSEO'

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

export default function HospitalAdminDoctorsPage() {
  useSEO({
    title: 'Doctors & Revenue Page - Hospital Admin Dashboard',
    description: 'Onboard doctors, edit doctor profiles, change login passwords, and manage seat limits.',
  })

  const navigate = useNavigate()
  const { registerUserInSupabase } = useAuth()

  const [notice, setNotice] = useState<string | null>(null)
  const [doctorSeatLimit] = useState(5)
  const [hospitalDoctors, setHospitalDoctors] = useState<DoctorItem[]>(() => {
    try {
      const saved = localStorage.getItem('clinicos_hospital_doctors')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  })

  // Onboarding Modal State
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

  // Edit Profile & Password Reset Modal State
  const [editingDoctor, setEditingDoctor] = useState<DoctorItem | null>(null)
  const [isUpdatingDoctor, setIsUpdatingDoctor] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    dept: '',
    specialization: '',
    fee: 500,
    limit: 25,
  })

  useEffect(() => {
    try {
      localStorage.setItem('clinicos_hospital_doctors', JSON.stringify(hospitalDoctors))
    } catch (e) {}
  }, [hospitalDoctors])

  const handleOnboardDoctor = async (e: React.FormEvent) => {
    e.preventDefault()

    if (hospitalDoctors.length >= doctorSeatLimit) {
      alert(`Doctor Seat Limit Reached (${hospitalDoctors.length}/${doctorSeatLimit}). Upgrade seats at /mrshahidbabu.`)
      return
    }

    setIsRegisteringDoctor(true)
    const docId = `doc-${Date.now().toString().slice(-4)}`

    try {
      await registerUserInSupabase(doctorForm.email, doctorForm.password, {
        role: 'doctor',
        name: doctorForm.name,
        dept: doctorForm.dept,
        fee: Number(doctorForm.fee) || 500,
        limit: Number(doctorForm.limit) || 25,
      })
    } catch (err: any) {}

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

    setHospitalDoctors([...hospitalDoctors, newDoc])
    setShowDoctorModal(false)
    setIsRegisteringDoctor(false)
    setNotice(`Doctor "${newDoc.name}" onboarded & credentials saved!`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleOpenEditModal = (doc: DoctorItem) => {
    setEditingDoctor(doc)
    setEditForm({
      name: doc.name,
      email: doc.email,
      password: doc.password || '',
      dept: doc.dept,
      specialization: doc.specialization,
      fee: doc.fee,
      limit: doc.limit,
    })
  }

  const handleSaveEditedDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDoctor) return
    setIsUpdatingDoctor(true)

    // Update in hospitalDoctors roster
    const updated = hospitalDoctors.map((doc) => {
      if (doc.id === editingDoctor.id) {
        return {
          ...doc,
          name: editForm.name,
          dept: editForm.dept,
          specialization: editForm.specialization,
          fee: Number(editForm.fee) || 500,
          limit: Number(editForm.limit) || 25,
          password: editForm.password ? editForm.password : doc.password,
        }
      }
      return doc
    })

    setHospitalDoctors(updated)
    localStorage.setItem('clinicos_hospital_doctors', JSON.stringify(updated))

    // Save to local registry
    try {
      const registryRaw = localStorage.getItem('clinicos_user_registry')
      const registry: any[] = registryRaw ? JSON.parse(registryRaw) : []
      const updatedRegistry = registry.map((u) => {
        if (u.email?.trim().toLowerCase() === editingDoctor.email.trim().toLowerCase()) {
          return {
            ...u,
            name: editForm.name,
            dept: editForm.dept,
            password: editForm.password ? editForm.password : u.password,
          }
        }
        return u
      })
      localStorage.setItem('clinicos_user_registry', JSON.stringify(updatedRegistry))
    } catch (e) {}

    // Save to Supabase Auth if password changed
    if (editForm.password) {
      try {
        await registerUserInSupabase(editingDoctor.email, editForm.password, {
          role: 'doctor',
          name: editForm.name,
          dept: editForm.dept,
        })
      } catch (e) {}
    }

    setIsUpdatingDoctor(false)
    setEditingDoctor(null)
    setNotice(`✓ Updated profile & password for ${editForm.name}! New login credentials active.`)
    setTimeout(() => setNotice(null), 5000)
  }

  const handleDeleteDoctor = (docId: string, docName: string) => {
    if (!window.confirm(`Are you sure you want to remove doctor "${docName}" from the roster?`)) return
    setHospitalDoctors(hospitalDoctors.filter((d) => d.id !== docId))
    setNotice(`Doctor "${docName}" removed.`)
    setTimeout(() => setNotice(null), 4000)
  }

  const totalFacilityRevenue = hospitalDoctors.reduce((acc, d) => acc + (d.fee * 15), 0)

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 font-sans p-4 sm:p-6">
      {notice && (
        <div className="max-w-7xl mx-auto mb-4 bg-[#00875A] text-white px-4 py-3 rounded-2xl text-xs font-bold text-center flex items-center justify-between shadow-md">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} /> {notice}
          </span>
          <button onClick={() => setNotice(null)} className="text-white font-bold">✕</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <HospitalAdminHeader onOpenOnboardModal={() => setShowDoctorModal(true)} />

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doctor Roster, Edit Profiles & Password Reset</h1>
              <p className="text-xs text-slate-500 font-medium">Capacity: {hospitalDoctors.length}/{doctorSeatLimit} Seats Used • Total OPD Revenue: ₹{totalFacilityRevenue.toLocaleString()}</p>
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
                    <p><span className="text-slate-400 font-sans">Dept:</span> <strong className="text-slate-800">{doc.dept}</strong></p>
                    <p><span className="text-slate-400 font-sans">Specialty:</span> <strong className="text-slate-700">{doc.specialization}</strong></p>
                    <p><span className="text-slate-400 font-sans">Login Email:</span> <strong className="text-emerald-700">{doc.email}</strong></p>
                    <p><span className="text-slate-400 font-sans">Login Password:</span> <strong className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{doc.password || '••••••••'}</strong></p>
                    <p><span className="text-slate-400 font-sans">Fee:</span> <strong className="text-slate-900">₹{doc.fee}</strong></p>
                    <p><span className="text-slate-400 font-sans">Daily Limit:</span> <strong className="text-slate-800">{doc.limit} Patients</strong></p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => handleOpenEditModal(doc)}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5"
                  >
                    <Edit3 size={14} /> Edit Profile & Change Password
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate('/hospitaladmin/messages')}
                      className="py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1"
                    >
                      <MessageSquare size={13} /> Chat
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                      className="py-2 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDIT DOCTOR PROFILE & RESET PASSWORD MODAL */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="text-emerald-700" size={20} /> Update Doctor Profile & Password
                </h3>
                <p className="text-xs text-slate-500 font-medium">Edit details for {editingDoctor.email}</p>
              </div>
              <button onClick={() => setEditingDoctor(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEditedDoctor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={editForm.dept}
                    onChange={(e) => setEditForm({ ...editForm, dept: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={editForm.specialization}
                    onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <label className="block text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                  <Key size={15} /> Update Login Password
                </label>
                <input
                  type="text"
                  placeholder="Enter new password to change..."
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-amber-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <p className="text-[11px] text-amber-800 font-medium">
                  Doctors use this password along with their email (<strong>{editingDoctor.email}</strong>) to log in.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={editForm.fee}
                    onChange={(e) => setEditForm({ ...editForm, fee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Daily Patient Limit</label>
                  <input
                    type="number"
                    required
                    value={editForm.limit}
                    onChange={(e) => setEditForm({ ...editForm, limit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setEditingDoctor(null)} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdatingDoctor} className="px-6 py-2.5 bg-[#00875A] text-white font-extrabold text-xs rounded-xl shadow-md">
                  {isUpdatingDoctor ? 'Updating...' : 'Save Profile & Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ONBOARD NEW DOCTOR MODAL */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Onboard Practising Doctor</h3>
              <button onClick={() => setShowDoctorModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleOnboardDoctor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Full Name *</label>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Initial Password *</label>
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
                <button type="submit" disabled={isRegisteringDoctor} className="px-6 py-2.5 bg-[#00875A] text-white font-extrabold text-xs rounded-xl shadow-md">Onboard Doctor & Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
