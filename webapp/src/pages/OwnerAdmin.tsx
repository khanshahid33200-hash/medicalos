import { useState, useEffect } from 'react'
import {
  Building2,
  UserPlus,
  ShieldCheck,
  Stethoscope,
  Trash2,
  CheckCircle,
  XCircle,
  Lock,
  Mail,
  Search,
  Layers,
  Crown,
  LogOut,
  AlertCircle
} from 'lucide-react'
import Button from '../components/Button'
import apiClient from '../api/client'

interface HospitalItem {
  id: string
  name: string
  license: string
  phone: string
  email: string
  address: string
  doctor_count: number
  status: 'active' | 'suspended'
}

interface DoctorItem {
  doctor_id: string
  firebase_uid: string
  hospital_id: string
  hospital_name: string
  name: string
  email: string
  department_id: string
  department_name: string
  specialization: string
  role: 'doctor' | 'admin'
  status: 'active' | 'inactive' | 'on_leave'
}

export default function OwnerAdmin() {
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [loginError, setLoginError] = useState('')

  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors' | 'analytics'>('hospitals')
  const [notice, setNotice] = useState<string | null>(null)

  // Hospital State
  const [hospitalsList, setHospitalsList] = useState<HospitalItem[]>([
    {
      id: 'hosp-001',
      name: 'Metro Care General Hospital',
      license: 'HOSP-2026-LIC-9921',
      phone: '+91-9876543210',
      email: 'contact@metrocare.com',
      address: '123 Healthcare Boulevard, Medical District',
      doctor_count: 3,
      status: 'active',
    },
    {
      id: 'hosp-002',
      name: 'City Heart & Cardiac Specialty Clinic',
      license: 'HOSP-2026-LIC-4410',
      phone: '+91-9876543211',
      email: 'info@cityheartclinic.com',
      address: '45 Cardiac Street, Central Plaza',
      doctor_count: 2,
      status: 'active',
    },
  ])

  // Doctor State
  const [doctorsList, setDoctorsList] = useState<DoctorItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals State
  const [showHospitalModal, setShowHospitalModal] = useState(false)
  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    license: '',
    phone: '',
    email: '',
    address: '',
  })

  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    password: '',
    hospital_id: 'hosp-001',
    department_name: 'Cardiology',
    specialization: 'General Physician',
    role: 'doctor' as const,
  })

  useEffect(() => {
    // Check if owner session exists in localStorage
    const ownerAuth = localStorage.getItem('owner_authenticated')
    if (ownerAuth === 'true') {
      setIsOwnerAuthenticated(true)
    }
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.listDoctors()
      if (response.data && Array.isArray(response.data)) {
        setDoctorsList(response.data)
      }
    } catch (e) {
      setDoctorsList([
        {
          doctor_id: 'doc-001',
          firebase_uid: 'fb-uid-doc-001',
          hospital_id: 'hosp-001',
          hospital_name: 'Metro Care General Hospital',
          name: 'Dr. Rahul Sharma',
          email: 'doctor@hospital.com',
          department_id: 'dept-cardio-01',
          department_name: 'Cardiology',
          specialization: 'Interventional Cardiology',
          role: 'doctor',
          status: 'active',
        },
        {
          doctor_id: 'doc-002',
          firebase_uid: 'fb-uid-doc-002',
          hospital_id: 'hosp-001',
          hospital_name: 'Metro Care General Hospital',
          name: 'Dr. Vikram Seth',
          email: 'vikram@hospital.com',
          department_id: 'dept-opd-02',
          department_name: 'General OPD',
          specialization: 'Internal Medicine',
          role: 'doctor',
          status: 'active',
        },
      ])
    }
  }

  // Owner Authentication Handler
  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    if (loginForm.email === 'info@shahidkhan.site' && loginForm.password === 'Upjtv@1234') {
      setIsOwnerAuthenticated(true)
      localStorage.setItem('owner_authenticated', 'true')
    } else {
      setLoginError('Invalid Platform Owner credentials. Access denied to secret admin route.')
    }
  }

  const handleOwnerLogout = () => {
    setIsOwnerAuthenticated(false)
    localStorage.removeItem('owner_authenticated')
  }

  // Create Hospital Handler
  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault()
    const newHosp: HospitalItem = {
      id: `hosp-00${hospitalsList.length + 1}`,
      name: hospitalForm.name,
      license: hospitalForm.license || `HOSP-2026-LIC-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: hospitalForm.phone,
      email: hospitalForm.email,
      address: hospitalForm.address,
      doctor_count: 0,
      status: 'active',
    }
    setHospitalsList([...hospitalsList, newHosp])
    setShowHospitalModal(false)
    setHospitalForm({ name: '', license: '', phone: '', email: '', address: '' })
    setNotice(`Hospital "${newHosp.name}" registered successfully!`)
    setTimeout(() => setNotice(null), 4000)
  }

  // Create Doctor Handler
  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedHosp = hospitalsList.find((h) => h.id === doctorForm.hospital_id)
    const hospitalName = selectedHosp ? selectedHosp.name : 'Metro Care General Hospital'

    try {
      const response = await apiClient.createDoctor({
        ...doctorForm,
        hospital_id: doctorForm.hospital_id,
      })
      if (response.data) {
        setDoctorsList((prev) => [...prev, response.data])
      }
    } catch (e) {
      const newDoc: DoctorItem = {
        doctor_id: `doc-00${doctorsList.length + 1}`,
        firebase_uid: `fb-uid-doc-${doctorsList.length + 1}`,
        hospital_id: doctorForm.hospital_id,
        hospital_name: hospitalName,
        name: doctorForm.name,
        email: doctorForm.email,
        department_id: `dept-${doctorForm.department_name.toLowerCase()}`,
        department_name: doctorForm.department_name,
        specialization: doctorForm.specialization,
        role: doctorForm.role,
        status: 'active',
      }
      setDoctorsList((prev) => [...prev, newDoc])
    }

    // Update doctor count in hospital list
    setHospitalsList((prev) =>
      prev.map((h) => (h.id === doctorForm.hospital_id ? { ...h, doctor_count: h.doctor_count + 1 } : h))
    )

    setShowDoctorModal(false)
    setDoctorForm({
      name: '',
      email: '',
      password: '',
      hospital_id: 'hosp-001',
      department_name: 'Cardiology',
      specialization: 'General Physician',
      role: 'doctor',
    })
    setNotice(`Doctor profile for ${doctorForm.name} onboarded successfully!`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleStatusChange = async (doctorId: string, newStatus: 'active' | 'inactive' | 'on_leave') => {
    try {
      await apiClient.updateDoctorStatus(doctorId, newStatus)
    } catch (e) {
      // ignore
    }
    setDoctorsList((prev) =>
      prev.map((doc) => (doc.doctor_id === doctorId ? { ...doc, status: newStatus } : doc))
    )
  }

  const handleDeleteDoctor = async (doctorId: string, doctorName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${doctorName} from the platform?`)) return
    try {
      await apiClient.deleteDoctor(doctorId)
    } catch (e) {
      // ignore
    }
    setDoctorsList((prev) => prev.filter((d) => d.doctor_id !== doctorId))
    setNotice(`Doctor profile for ${doctorName} deleted.`)
    setTimeout(() => setNotice(null), 4000)
  }

  // 1. OWNER UNAUTHENTICATED VIEW
  if (!isOwnerAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown size={36} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Platform Owner Admin Portal</h1>
            <p className="text-xs text-slate-400">
              Restricted secret route <code className="text-blue-400 font-mono">/mrshahidbabu</code> for Website Owner
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex items-center gap-3 text-red-400 text-xs font-semibold">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleOwnerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                <Mail size={14} className="inline mr-1 text-blue-400" /> Owner Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="info@shahidkhan.site"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                <Lock size={14} className="inline mr-1 text-blue-400" /> Secret Key / Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} /> Authenticate as Owner
            </button>
          </form>
        </div>
      </div>
    )
  }

  // 2. OWNER AUTHENTICATED ADMIN DASHBOARD
  const filteredDoctors = doctorsList.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-12">
      {/* Top Navbar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
            <Crown size={22} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide">Clinic OS Owner Control Console</h1>
            <p className="text-xs text-blue-400 font-mono">Logged in as info@shahidkhan.site</p>
          </div>
        </div>

        <button
          onClick={handleOwnerLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-700"
        >
          <LogOut size={16} /> Sign Out Owner
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-950 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-400/30">
              Platform Master Admin
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-2">
              Website & Multi-Hospital Management
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Register Hospitals, Onboard Doctors, set passwords, and manage multi-tenant access across the platform.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setShowHospitalModal(true)} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 text-white font-bold flex items-center gap-2">
              <Building2 size={18} /> Register Hospital
            </Button>
            <Button variant="success" onClick={() => setShowDoctorModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2">
              <UserPlus size={18} /> Onboard Doctor
            </Button>
          </div>
        </div>

        {/* Notice Alert */}
        {notice && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-medium">
            <span>✓ {notice}</span>
            <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Console Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'hospitals', label: 'Registered Hospitals', icon: Building2, count: hospitalsList.length },
            { id: 'doctors', label: 'Doctor Profiles', icon: Stethoscope, count: doctorsList.length },
            { id: 'analytics', label: 'Platform System Stats', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2.5 ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${active ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB 1: REGISTERED HOSPITALS */}
        {activeTab === 'hospitals' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hospitalsList.map((hosp) => (
                <div key={hosp.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-blue-500/40 transition shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 font-mono text-xs font-bold rounded-lg border border-blue-500/20">
                        {hosp.id}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">{hosp.name}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">License: {hosp.license}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/20">
                      Active Facility
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900 p-3.5 rounded-2xl border border-slate-800 font-medium">
                    <p>📍 Address: {hosp.address}</p>
                    <p>📞 Phone: {hosp.phone} • ✉️ Email: {hosp.email}</p>
                    <p>🩺 Registered Doctors: <strong className="text-blue-400 font-bold">{hosp.doctor_count} Doctors</strong></p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setDoctorForm((prev) => ({ ...prev, hospital_id: hosp.id }))
                        setShowDoctorModal(true)
                      }}
                      className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold"
                    >
                      + Onboard Doctor to {hosp.name.split(' ')[0]}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: DOCTOR PROFILES */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="Search Doctor by Name, Email, or Hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 text-sm text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-white"
              >
                <option value="all">All Doctor Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Doctor & Email</th>
                    <th className="px-6 py-4">Assigned Hospital</th>
                    <th className="px-6 py-4">Department & Specialization</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Owner Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.doctor_id} className="hover:bg-slate-900/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm">
                            {doc.name.charAt(4) || 'D'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-base">{doc.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{doc.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-200">{doc.hospital_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-blue-400">{doc.department_name}</p>
                        <p className="text-xs text-slate-400">{doc.specialization}</p>
                      </td>
                      <td className="px-6 py-4">
                        {doc.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                            <CheckCircle size={13} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
                            <XCircle size={13} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {doc.status !== 'active' ? (
                            <button
                              onClick={() => handleStatusChange(doc.doctor_id, 'active')}
                              className="px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-bold transition"
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(doc.doctor_id, 'inactive')}
                              className="px-3 py-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg text-xs font-bold transition"
                            >
                              Deactivate
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteDoctor(doc.doctor_id, doc.name)}
                            className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PLATFORM SYSTEM STATS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Hospitals</p>
              <p className="text-5xl font-black text-blue-400">{hospitalsList.length}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Onboarded Doctors</p>
              <p className="text-5xl font-black text-emerald-400">{doctorsList.length}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform Isolation</p>
              <p className="text-xl font-bold text-purple-400 mt-4">Super Admin Key Verified</p>
            </div>
          </div>
        )}

        {/* MODAL 1: REGISTER HOSPITAL */}
        {showHospitalModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="text-blue-400" size={20} /> Register New Hospital
                </h3>
                <button onClick={() => setShowHospitalModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateHospital} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Hospital Name *</label>
                  <input
                    type="text"
                    value={hospitalForm.name}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                    placeholder="e.g. Apollo Multi-Specialty Hospital"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">License Number</label>
                  <input
                    type="text"
                    value={hospitalForm.license}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, license: e.target.value })}
                    placeholder="HOSP-2026-LIC-9921"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Phone</label>
                    <input
                      type="text"
                      value={hospitalForm.phone}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                      placeholder="+91-9876543210"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      value={hospitalForm.email}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                      placeholder="info@hospital.com"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Address</label>
                  <input
                    type="text"
                    value={hospitalForm.address}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                    placeholder="Hospital address..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowHospitalModal(false)} className="flex-1 bg-slate-800 text-slate-300">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 bg-blue-600 text-white font-bold">
                    Register Facility
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ONBOARD DOCTOR */}
        {showDoctorModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl p-6 space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <UserPlus className="text-emerald-400" size={20} /> Onboard Doctor Profile
                </h3>
                <button onClick={() => setShowDoctorModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Assigned Hospital *</label>
                  <select
                    value={doctorForm.hospital_id}
                    onChange={(e) => setDoctorForm({ ...doctorForm, hospital_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-semibold"
                  >
                    {hospitalsList.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    placeholder="e.g. Dr. Anish Kapoor"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Doctor Email *</label>
                    <input
                      type="email"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                      placeholder="doctor@hospital.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Password *</label>
                    <input
                      type="password"
                      value={doctorForm.password}
                      onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Department</label>
                    <input
                      type="text"
                      value={doctorForm.department_name}
                      onChange={(e) => setDoctorForm({ ...doctorForm, department_name: e.target.value })}
                      placeholder="Cardiology"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Specialization</label>
                    <input
                      type="text"
                      value={doctorForm.specialization}
                      onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                      placeholder="Interventional Cardiology"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowDoctorModal(false)} className="flex-1 bg-slate-800 text-slate-300">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 bg-emerald-600 text-white font-bold">
                    Create & Onboard Doctor
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
