import React, { useState, useEffect } from 'react'
import {
  Stethoscope,
  Search,
  Plus,
  Shield,
  Phone,
  Mail,
  Ban,
  CheckCircle2,
  Calendar,
  Eye,
  Edit2,
  AlertTriangle,
  X
} from 'lucide-react'
import HospitalDashboardLayout from '../../components/hospitaldashboard/HospitalDashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface Doctor {
  id: string
  name: string
  docId: string
  avatar: string
  dept: string
  specialization: string
  phone: string
  email: string
  fee: number
  availability: string
  status: 'active' | 'inactive' | 'blocked'
}

export default function HospitalDoctorsPage() {
  const { registerUserInSupabase, doctorProfile } = useAuth()
  const currentHospId = doctorProfile?.hospital_id || localStorage.getItem('hospital_id') || ''

  const [searchTerm, setSearchTerm] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{ doc: Doctor; action: 'block' | 'unblock' | 'deactivate' | 'activate' } | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    async function loadDocs() {
      if (!currentHospId) return
      try {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, email, department, specialization, is_active, doctor_code, account_status')
          .eq('hospital_id', currentHospId)
          .eq('role', 'doctor')
        
        if (data && data.length > 0) {
          const mapped: Doctor[] = data.map((d, idx) => ({
            id: d.id,
            name: d.full_name,
            docId: d.doctor_code || `DOC-${String(idx + 1).padStart(3, '0')}`,
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
            dept: d.department || 'General Medicine',
            specialization: d.specialization || 'Consultant Specialist',
            phone: '+91 98765 00000',
            email: d.email,
            fee: 500,
            availability: 'Mon - Fri (09:00 AM - 02:00 PM)',
            status: d.account_status === 'blocked' ? 'blocked' : d.is_active ? 'active' : 'inactive'
          }))
          setDoctors(mapped)
        } else {
          setDoctors([])
        }
      } catch (e) {
        setDoctors([])
      }
    }
    loadDocs()
  }, [currentHospId])

  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: 'Password123!',
    phone: '',
    dept: 'Cardiology',
    specialization: 'Consultant Specialist',
    fee: 500,
    availability: 'Mon - Fri (09:00 AM - 01:00 PM)'
  })

  const filtered = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.docId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = deptFilter === 'All' || d.dept === deptFilter
    return matchesSearch && matchesDept
  })

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    const autoDocId = `H1D00${doctors.length + 1}`
    try {
      await registerUserInSupabase(newDoctor.email, newDoctor.password, {
        role: 'doctor',
        name: newDoctor.name,
        dept: newDoctor.dept,
        hospital_id: currentHospId,
        specialization: newDoctor.specialization,
        fee: Number(newDoctor.fee) || 500,
        doctor_code: autoDocId
      })
    } catch (err) {}

    const newDocObj: Doctor = {
      id: `d-${Date.now()}`,
      name: newDoctor.name,
      docId: autoDocId,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
      dept: newDoctor.dept,
      specialization: newDoctor.specialization,
      phone: newDoctor.phone || '+91 98765 00000',
      email: newDoctor.email,
      fee: Number(newDoctor.fee) || 500,
      availability: newDoctor.availability,
      status: 'active'
    }

    setDoctors([...doctors, newDocObj])
    setShowAddModal(false)
    setNotice(`✓ ${newDocObj.name} onboarded with ID ${autoDocId}!`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleApplySecurityAction = () => {
    if (!confirmModal) return
    const { doc, action } = confirmModal
    const nextStatus = action === 'block' ? 'blocked' : action === 'deactivate' ? 'inactive' : 'active'
    setDoctors(doctors.map(d => d.id === doc.id ? { ...d, status: nextStatus } : d))
    setNotice(`✓ ${doc.name} status changed to ${nextStatus.toUpperCase()}`)
    setConfirmModal(null)
    setTimeout(() => setNotice(null), 3000)
  }

  return (
    <HospitalDashboardLayout pageTitle="Doctors">
      {notice && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Search & Actions Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Doctor Name, ID or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="General Medicine">General Medicine</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition shrink-0"
            >
              <Plus size={15} />
              <span>Add Doctor</span>
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Stethoscope size={24} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Doctors Registered</h4>
            <p className="text-xs text-slate-500">This hospital facility currently has zero registered practitioners.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              + Onboard First Doctor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className={`bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                  doc.status === 'blocked'
                    ? 'border-rose-300 bg-rose-50/20'
                    : doc.status === 'inactive'
                    ? 'border-slate-200 opacity-75'
                    : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{doc.name}</h4>
                        <span className="px-2 py-0.5 mt-1 inline-block rounded-md text-[10px] font-mono font-extrabold bg-blue-50 text-blue-600 border border-blue-200/50">
                          {doc.docId}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : doc.status === 'blocked'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {doc.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 py-2 border-t border-b border-slate-100 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-bold text-slate-900">{doc.dept}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Specialization:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[170px]">{doc.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consultation Fee:</span>
                      <span className="font-bold text-emerald-600">₹{doc.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Schedule:</span>
                      <span className="font-medium text-slate-700 text-[11px]">{doc.availability}</span>
                    </div>
                  </div>
                </div>

                {/* Security & Management Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  {doc.status === 'blocked' ? (
                    <button
                      onClick={() => setConfirmModal({ doc, action: 'unblock' })}
                      className="flex-1 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition"
                    >
                      Unblock Doctor
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmModal({ doc, action: 'block' })}
                      className="flex-1 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition"
                    >
                      Block Doctor
                    </button>
                  )}

                  {doc.status === 'active' ? (
                    <button
                      onClick={() => setConfirmModal({ doc, action: 'deactivate' })}
                      className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold"
                    >
                      Deactivate
                    </button>
                  ) : doc.status === 'inactive' ? (
                    <button
                      onClick={() => setConfirmModal({ doc, action: 'activate' })}
                      className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-semibold"
                    >
                      Activate
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <AlertTriangle size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Confirm {confirmModal.action.toUpperCase()} Action
            </h3>
            <p className="text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to {confirmModal.action} <strong>{confirmModal.doc.name}</strong>?
              {confirmModal.action === 'block' && ' The doctor will lose dashboard access and disappear from public QR booking.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApplySecurityAction}
                className={`flex-1 py-2.5 rounded-xl font-bold text-white ${
                  confirmModal.action === 'block' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Add Medical Specialist</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateDoctor} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Varun Seth"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.com"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Password</label>
                  <input
                    type="password"
                    required
                    value={newDoctor.password}
                    onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newDoctor.dept}
                    onChange={(e) => setNewDoctor({ ...newDoctor, dept: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>Cardiology</option>
                    <option>Orthopedics</option>
                    <option>Dermatology</option>
                    <option>General Medicine</option>
                    <option>Neurology</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={newDoctor.fee}
                    onChange={(e) => setNewDoctor({ ...newDoctor, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Specialization & Qualifications</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Specialist (MD, DM)"
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Onboard Doctor
              </button>
            </form>
          </div>
        </div>
      )}
    </HospitalDashboardLayout>
  )
}
