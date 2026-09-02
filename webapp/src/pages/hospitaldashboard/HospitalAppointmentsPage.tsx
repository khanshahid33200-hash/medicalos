import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Printer,
  XCircle,
  CheckCircle2,
  Clock,
  Eye,
  User,
  Shield,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import HospitalDashboardLayout from '../../components/hospitaldashboard/HospitalDashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface Appointment {
  id: string
  patient: string
  ageGender: string
  phone: string
  department: string
  doctor: string
  date: string
  time: string
  token: string
  source: 'QR Booking' | 'Walk-in' | 'Website' | 'Other'
  status: 'Scheduled' | 'Waiting' | 'Completed' | 'Cancelled' | 'No Show'
}

export default function HospitalAppointmentsPage() {
  const { doctorProfile } = useAuth()
  const currentHospId = doctorProfile?.hospital_id || localStorage.getItem('hospital_id') || ''

  const [searchTerm, setSearchTerm] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const [registeredDoctors, setRegisteredDoctors] = useState<{ id: string; name: string; dept: string }[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    async function loadData() {
      if (!currentHospId) return
      try {
        // Load doctors
        const { data: docs } = await supabase
          .from('profiles')
          .select('id, full_name, department')
          .eq('hospital_id', currentHospId)
          .eq('role', 'doctor')
          .eq('is_active', true)
        if (docs && docs.length > 0) {
          setRegisteredDoctors(docs.map(d => ({ id: d.id, name: d.full_name, dept: d.department || 'General OPD' })))
        } else {
          setRegisteredDoctors([])
        }

        // Load appointments
        const { data: appts } = await supabase
          .from('appointments')
          .select('*, patient:patients(*), doctor:profiles(*)')
          .eq('hospital_id', currentHospId)
          .order('created_at', { ascending: false })

        if (appts && appts.length > 0) {
          const mapped: Appointment[] = appts.map((a: any) => ({
            id: 'APT-' + a.id.slice(0, 4).toUpperCase(),
            patient: a.patient?.name || 'Walk-in Patient',
            ageGender: `${a.patient?.age || '30'} / ${a.patient?.gender?.[0] || 'M'}`,
            phone: a.patient?.phone || '+91 98765 00000',
            department: a.doctor?.department || 'General OPD',
            doctor: a.doctor?.full_name || 'Dr. On Duty',
            date: a.appointment_date || 'Today',
            time: '09:00 AM',
            token: a.token_number ? `T-${String(a.token_number).padStart(3, '0')}` : 'T-001',
            source: 'QR Booking',
            status: a.status === 'completed' ? 'Completed' : a.status === 'cancelled' ? 'Cancelled' : 'Waiting'
          }))
          setAppointments(mapped)
        } else {
          setAppointments([])
        }
      } catch (e) {
        setAppointments([])
      }
    }
    loadData()
  }, [currentHospId])

  const [newForm, setNewForm] = useState({
    patient: '',
    ageGender: '30 / M',
    phone: '',
    department: 'Cardiology',
    doctor: '',
    time: '02:00 PM',
    source: 'Walk-in' as const
  })

  const filtered = appointments.filter(a => {
    const matchesSearch = a.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.token.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = deptFilter === 'All' || a.department === deptFilter
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter
    const matchesSource = sourceFilter === 'All' || a.source === sourceFilter
    return matchesSearch && matchesDept && matchesStatus && matchesSource
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const tokenLetter = newForm.department[0].toUpperCase()
    const newA: Appointment = {
      id: `APT-${Math.floor(8000 + Math.random() * 1900)}`,
      patient: newForm.patient,
      ageGender: newForm.ageGender,
      phone: newForm.phone || '+91 98765 00000',
      department: newForm.department,
      doctor: newForm.doctor,
      date: 'May 31, 2025',
      time: newForm.time,
      token: `${tokenLetter}-0${Math.floor(10 + Math.random() * 20)}`,
      source: newForm.source,
      status: 'Scheduled'
    }
    setAppointments([newA, ...appointments])
    setShowAddModal(false)
    setNotice(`✓ Appointment ${newA.id} scheduled for ${newA.patient}!`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleUpdateStatus = (id: string, nextStatus: Appointment['status']) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: nextStatus } : a))
    setNotice(`Status updated to ${nextStatus}`)
    setTimeout(() => setNotice(null), 3000)
  }

  return (
    <HospitalDashboardLayout pageTitle="Appointments">
      {notice && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Patient, Token or Appointment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Filters & Action */}
          <div className="flex flex-wrap items-center gap-2.5">
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Waiting">Waiting</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No Show">No Show</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Sources</option>
              <option value="QR Booking">QR Booking</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Website">Website</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition"
            >
              <Plus size={15} />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        {/* Appointments Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60">
                <tr>
                  <th className="py-3.5 px-5">Appt ID & Token</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Department & Doctor</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-medium">
                      No appointments registered for this hospital facility.
                    </td>
                  </tr>
                ) : (
                  filtered.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-5">
                      <div className="font-bold text-slate-900">{appt.id}</div>
                      <span className="inline-block px-2 py-0.5 mt-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200/50">
                        {appt.token}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{appt.patient}</div>
                      <div className="text-[11px] text-slate-400">{appt.ageGender} • {appt.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{appt.department}</div>
                      <div className="text-[11px] text-slate-400">{appt.doctor}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{appt.time}</div>
                      <div className="text-[11px] text-slate-400">{appt.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {appt.source}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          appt.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : appt.status === 'Waiting'
                            ? 'bg-amber-100 text-amber-700'
                            : appt.status === 'Cancelled'
                            ? 'bg-orange-100 text-orange-700'
                            : appt.status === 'No Show'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedAppt(appt)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>
                        {appt.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Mark Completed"
                          >
                            <CheckCircle2 size={13} />
                          </button>
                        )}
                        {appt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'Cancelled')}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                            title="Cancel"
                          >
                            <XCircle size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filtered.length} of {appointments.length} appointments</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-50">
                <ChevronLeft size={14} />
              </button>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800">1</span>
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Appointment Details</h3>
                <span className="text-blue-600 font-bold">{selectedAppt.id}</span>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="p-1 text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <span className="text-slate-400 font-medium block">Patient Name</span>
                <span className="font-bold text-slate-900 text-sm">{selectedAppt.patient}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Live Token</span>
                <span className="font-extrabold text-blue-600 text-sm">{selectedAppt.token}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Doctor & Department</span>
                <span className="font-bold text-slate-900">{selectedAppt.doctor}</span>
                <span className="text-slate-500 block text-[11px]">{selectedAppt.department}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Time & Date</span>
                <span className="font-bold text-slate-900">{selectedAppt.time}</span>
                <span className="text-slate-500 block text-[11px]">{selectedAppt.date}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Intake Source</span>
                <span className="font-semibold text-slate-800">{selectedAppt.source}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Current Status</span>
                <span className="font-bold text-emerald-600">{selectedAppt.status}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
              >
                <Printer size={14} />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => setSelectedAppt(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Schedule Appointment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={newForm.patient}
                  onChange={(e) => setNewForm({ ...newForm, patient: e.target.value })}
                  placeholder="e.g. Ramesh Verma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age & Gender</label>
                  <input
                    type="text"
                    value={newForm.ageGender}
                    onChange={(e) => setNewForm({ ...newForm, ageGender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newForm.department}
                    onChange={(e) => setNewForm({ ...newForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>Cardiology</option>
                    <option>Orthopedics</option>
                    <option>Dermatology</option>
                    <option>General Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Doctor</label>
                  <select
                    value={newForm.doctor}
                    onChange={(e) => setNewForm({ ...newForm, doctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {registeredDoctors.length === 0 ? (
                      <option value="">No doctors registered</option>
                    ) : (
                      registeredDoctors.map(d => (
                        <option key={d.id} value={d.name}>{d.name} ({d.dept})</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </HospitalDashboardLayout>
  )
}
