import React, { useState, useEffect } from 'react'
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Users,
  Calendar,
  Edit2,
  Trash2,
  ShieldCheck,
  X
} from 'lucide-react'
import HospitalDashboardLayout from '../../components/hospitaldashboard/HospitalDashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface Department {
  id: string
  name: string
  code: string
  doctorsCount: number
  appointmentsToday: number
  headDoctor: string
  status: 'active' | 'inactive'
}

export default function HospitalDepartmentsPage() {
  const { doctorProfile } = useAuth()
  const currentHospId = doctorProfile?.hospital_id || localStorage.getItem('hospital_id') || ''

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const [departments, setDepartments] = useState<Department[]>([])

  useEffect(() => {
    async function loadDepts() {
      if (!currentHospId) return
      try {
        const { data } = await supabase
          .from('departments')
          .select('*')
          .eq('hospital_id', currentHospId)
        if (data && data.length > 0) {
          const mapped: Department[] = data.map(d => ({
            id: d.id,
            name: d.name,
            code: d.code || d.name.slice(0, 4).toUpperCase(),
            doctorsCount: 0,
            appointmentsToday: 0,
            headDoctor: 'Consultant in Charge',
            status: d.is_active ? 'active' : 'inactive'
          }))
          setDepartments(mapped)
        } else {
          setDepartments([])
        }
      } catch (e) {
        setDepartments([])
      }
    }
    loadDepts()
  }, [currentHospId])

  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    headDoctor: ''
  })

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault()
    const d: Department = {
      id: `dept-${Date.now()}`,
      name: newDept.name,
      code: newDept.code.toUpperCase(),
      doctorsCount: 1,
      appointmentsToday: 0,
      headDoctor: newDept.headDoctor || 'Consultant in Charge',
      status: 'active'
    }
    setDepartments([...departments, d])
    setShowAddModal(false)
    setNewDept({ name: '', code: '', headDoctor: '' })
    setNotice(`✓ Department ${d.name} (${d.code}) created successfully!`)
    setTimeout(() => setNotice(null), 4000)
  }

  const toggleStatus = (id: string) => {
    setDepartments(departments.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'active' ? 'inactive' : 'active'
        setNotice(`✓ Department ${d.name} marked ${nextStatus.toUpperCase()}`)
        return { ...d, status: nextStatus }
      }
      return d
    }))
    setTimeout(() => setNotice(null), 3000)
  }

  return (
    <HospitalDashboardLayout pageTitle="Departments">
      {notice && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Departments by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition"
          >
            <Plus size={15} />
            <span>Add Department</span>
          </button>
        </div>

        {/* Departments Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Building2 size={24} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Departments Configured</h4>
            <p className="text-xs text-slate-500">This hospital currently has no active clinical departments.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              + Add First Department
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((dept) => (
              <div
                key={dept.id}
                className={`bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                  dept.status === 'inactive' ? 'border-slate-200 opacity-70' : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base leading-tight">{dept.name}</h4>
                        <span className="text-[11px] font-mono font-bold text-slate-400 block">{dept.code}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        dept.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {dept.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4 py-3 border-t border-b border-slate-100 text-center">
                    <div className="border-r border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Doctors</span>
                      <span className="text-lg font-black text-slate-900">{dept.doctorsCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Appts Today</span>
                      <span className="text-lg font-black text-blue-600">{dept.appointmentsToday}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    <span className="text-slate-400">Head:</span> <strong className="text-slate-800">{dept.headDoctor}</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleStatus(dept.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      dept.status === 'active'
                        ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200'
                    }`}
                  >
                    {dept.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Add New Department</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateDept} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ophthalmology"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department Code</label>
                  <input
                    type="text"
                    required
                    placeholder="OPHTH"
                    value={newDept.code}
                    onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Head of Dept</label>
                  <input
                    type="text"
                    placeholder="Dr. Name"
                    value={newDept.headDoctor}
                    onChange={(e) => setNewDept({ ...newDept, headDoctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Create Department
              </button>
            </form>
          </div>
        </div>
      )}
    </HospitalDashboardLayout>
  )
}
