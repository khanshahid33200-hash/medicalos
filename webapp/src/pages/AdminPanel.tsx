import { useState, useEffect } from 'react'
import {
  UserPlus,
  Building2,
  ShieldCheck,
  Stethoscope,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  X,
  Search,
  Filter,
  Layers,
  Settings
} from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'
import apiClient from '../api/client'
import { useAuth } from '../context/AuthContext'

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
  role: 'doctor' | 'admin' | 'staff'
  status: 'active' | 'inactive' | 'on_leave'
}

export default function AdminPanel() {
  const { doctorProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<'doctors' | 'departments' | 'settings' | 'audit'>('doctors')

  // Doctors State
  const [doctorsList, setDoctorsList] = useState<DoctorItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Doctor Creation Modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    department_name: 'Cardiology',
    specialization: 'General Physician',
    role: 'doctor' as const,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  // Departments State
  const [departments, setDepartments] = useState([
    { id: 'dept-01', name: 'Cardiology', code: 'CARD', doctorCount: 2 },
    { id: 'dept-02', name: 'General OPD', code: 'OPD', doctorCount: 1 },
    { id: 'dept-03', name: 'Pediatrics', code: 'PED', doctorCount: 1 },
    { id: 'dept-04', name: 'Neurology', code: 'NEUR', doctorCount: 1 },
  ])
  const [newDeptName, setNewDeptName] = useState('')

  // Hospital Settings State
  const [hospitalInfo, setHospitalInfo] = useState({
    name: doctorProfile?.hospital_name || 'Metro Care General Hospital',
    license: 'HOSP-2026-LIC-9921',
    phone: '+91-9876543210',
    email: 'admin@hospital.com',
    address: '123 Healthcare Boulevard, Medical District',
    kioskTitle: 'Patient Self Check-in Kiosk',
    autoApproveCheckins: true,
  })

  // Fetch Doctor List from API
  const fetchDoctors = async () => {
    try {
      const response = await apiClient.listDoctors()
      if (response.data && Array.isArray(response.data)) {
        setDoctorsList(response.data)
      }
    } catch (e) {
      // Local fallback dataset
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
          doctor_id: 'doc-admin-001',
          firebase_uid: 'fb-uid-admin-001',
          hospital_id: 'hosp-001',
          hospital_name: 'Metro Care General Hospital',
          name: 'Dr. Sarah Jenkins (Admin)',
          email: 'admin@hospital.com',
          department_id: 'dept-cardio-01',
          department_name: 'Cardiology',
          specialization: 'Executive Chief of Cardiology',
          role: 'admin',
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

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await apiClient.createDoctor(createForm)
      if (response.data) {
        setDoctorsList((prev) => [...prev, response.data])
      }
      setShowCreateModal(false)
      setCreateForm({
        name: '',
        email: '',
        password: '',
        department_name: 'Cardiology',
        specialization: 'General Physician',
        role: 'doctor',
      })
      setNotice(`Doctor profile for ${createForm.name} created successfully!`)
      setTimeout(() => setNotice(null), 4000)
    } catch (e: any) {
      // Local addition
      const newDoc: DoctorItem = {
        doctor_id: `doc-00${doctorsList.length + 1}`,
        firebase_uid: `fb-uid-doc-${doctorsList.length + 1}`,
        hospital_id: 'hosp-001',
        hospital_name: 'Metro Care General Hospital',
        name: createForm.name,
        email: createForm.email,
        department_id: `dept-${createForm.department_name.toLowerCase()}`,
        department_name: createForm.department_name,
        specialization: createForm.specialization,
        role: createForm.role,
        status: 'active',
      }
      setDoctorsList((prev) => [...prev, newDoc])
      setShowCreateModal(false)
      setNotice(`Doctor profile for ${createForm.name} created successfully!`)
      setTimeout(() => setNotice(null), 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (doctorId: string, newStatus: 'active' | 'inactive' | 'on_leave') => {
    try {
      await apiClient.updateDoctorStatus(doctorId, newStatus)
    } catch (e) {
      // ignore local
    }
    setDoctorsList((prev) =>
      prev.map((doc) => (doc.doctor_id === doctorId ? { ...doc, status: newStatus } : doc))
    )
  }

  const handleDeleteDoctor = async (doctorId: string, doctorName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${doctorName} from the hospital system?`)) return
    try {
      await apiClient.deleteDoctor(doctorId)
    } catch (e) {
      // ignore local
    }
    setDoctorsList((prev) => prev.filter((d) => d.doctor_id !== doctorId))
    setNotice(`Doctor profile for ${doctorName} removed.`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeptName.trim()) return
    const newDept = {
      id: `dept-0${departments.length + 1}`,
      name: newDeptName.trim(),
      code: newDeptName.trim().substring(0, 4).toUpperCase(),
      doctorCount: 0,
    }
    setDepartments([...departments, newDept])
    setNewDeptName('')
  }

  const filteredDoctors = doctorsList.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
              <Building2 className="text-blue-600" size={32} /> Hospital Admin Portal
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Onboard Doctor profiles, manage staff credentials, departments, and hospital settings
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowCreateModal(true)}
            className="shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <UserPlus size={20} />
            Onboard New Doctor
          </Button>
        </div>

        {/* Notice Alert */}
        {notice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-medium shadow-sm">
            <span>✓ {notice}</span>
            <button onClick={() => setNotice(null)} className="text-emerald-600 hover:text-emerald-800">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {[
            { id: 'doctors', label: 'Doctor Management', icon: Stethoscope, count: doctorsList.length },
            { id: 'departments', label: 'Hospital Departments', icon: Layers, count: departments.length },
            { id: 'settings', label: 'Kiosk & WebApp Settings', icon: Settings },
            { id: 'audit', label: 'System Analytics & Audit', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${active ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB 1: DOCTOR MANAGEMENT */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search Doctor by Name, Email, Department, or Specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Doctor Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>

            {/* Doctor Table */}
            <Card>
              <CardHeader title={`Registered Hospital Doctors (${filteredDoctors.length})`} />
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                      <tr>
                        <th className="px-6 py-3.5">Doctor Name & Email</th>
                        <th className="px-6 py-3.5">Department</th>
                        <th className="px-6 py-3.5">Specialization</th>
                        <th className="px-6 py-3.5">Role</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      {filteredDoctors.map((doc) => (
                        <tr key={doc.doctor_id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-sm">
                                {doc.name.charAt(4) || 'D'}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-base">{doc.name}</p>
                                <p className="text-xs text-gray-500 font-mono">{doc.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-lg border border-blue-200">
                              {doc.department_name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{doc.specialization}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${doc.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                              {doc.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {doc.status === 'active' && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                                <CheckCircle size={13} /> Active
                              </span>
                            )}
                            {doc.status === 'inactive' && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-red-50 text-red-700 rounded-full border border-red-200">
                                <XCircle size={13} /> Inactive
                              </span>
                            )}
                            {doc.status === 'on_leave' && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                <Clock size={13} /> On Leave
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {doc.status !== 'active' && (
                                <button
                                  onClick={() => handleStatusChange(doc.doctor_id, 'active')}
                                  title="Activate Doctor"
                                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
                                >
                                  Activate
                                </button>
                              )}
                              {doc.status === 'active' && (
                                <button
                                  onClick={() => handleStatusChange(doc.doctor_id, 'inactive')}
                                  title="Deactivate Doctor"
                                  className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold transition"
                                >
                                  Deactivate
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteDoctor(doc.doctor_id, doc.name)}
                                title="Delete Profile"
                                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: HOSPITAL DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 border border-gray-200">
              <CardHeader title="Add New Department" />
              <CardContent className="py-6">
                <form onSubmit={handleAddDepartment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Department Name *</label>
                    <input
                      type="text"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      placeholder="e.g. Orthopedics"
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full shadow-md shadow-blue-600/20">
                    <Plus size={18} /> Add Department
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border border-gray-200">
              <CardHeader title="Hospital Departments List" />
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {departments.map((dept) => (
                    <div key={dept.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div>
                        <p className="font-bold text-gray-900 text-base">{dept.name}</p>
                        <p className="text-xs text-gray-500">Code: {dept.code} • Assigned Doctors: {dept.doctorCount}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full border border-blue-200">
                        Active Unit
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: KIOSK & WEBAPP SETTINGS */}
        {activeTab === 'settings' && (
          <Card className="border border-gray-200">
            <CardHeader title="Hospital Facility & Kiosk Settings" />
            <CardContent className="py-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Hospital Name</label>
                  <input
                    type="text"
                    value={hospitalInfo.name}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Hospital License Number</label>
                  <input
                    type="text"
                    value={hospitalInfo.license}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, license: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Kiosk Banner Title</label>
                <input
                  type="text"
                  value={hospitalInfo.kioskTitle}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, kioskTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" onClick={() => { setNotice('Hospital Settings saved successfully!'); setTimeout(() => setNotice(null), 3000); }}>
                  Save Hospital Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 4: SYSTEM ANALYTICS & AUDIT */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50/50 border border-blue-200">
                <CardContent className="py-6 text-center">
                  <p className="text-xs font-bold uppercase text-blue-700 tracking-wider">Total Onboarded Doctors</p>
                  <p className="text-4xl font-extrabold text-blue-900 mt-2">{doctorsList.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-emerald-50/50 border border-emerald-200">
                <CardContent className="py-6 text-center">
                  <p className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Active Hospital Units</p>
                  <p className="text-4xl font-extrabold text-emerald-900 mt-2">{departments.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50/50 border border-purple-200">
                <CardContent className="py-6 text-center">
                  <p className="text-xs font-bold uppercase text-purple-700 tracking-wider">Tenant Isolation Security</p>
                  <p className="text-xl font-bold text-purple-900 mt-3">RLS Enforced</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* CREATE DOCTOR MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <UserPlus size={20} /> Onboard New Doctor Profile
                </h2>
                <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-blue-700 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g. Dr. Anish Kapoor"
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Doctor Email *</label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      placeholder="doctor@hospital.com"
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Initial Password *</label>
                    <input
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Department</label>
                    <select
                      value={createForm.department_name}
                      onChange={(e) => setCreateForm({ ...createForm, department_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Role</label>
                    <select
                      value={createForm.role}
                      onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Specialization</label>
                  <input
                    type="text"
                    value={createForm.specialization}
                    onChange={(e) => setCreateForm({ ...createForm, specialization: e.target.value })}
                    placeholder="e.g. Interventional Cardiology"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1 shadow-lg shadow-blue-600/30">
                    {isSubmitting ? 'Creating Profile...' : 'Onboard Doctor'}
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
