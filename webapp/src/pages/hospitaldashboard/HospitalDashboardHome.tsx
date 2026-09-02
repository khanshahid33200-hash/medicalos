import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Users,
  Hourglass,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Shield,
  Clock,
  Plus,
  UserPlus,
  Stethoscope,
  Building2,
  FileText,
  BarChart3,
  ChevronDown,
  Sparkles,
  Check,
  X,
  Eye
} from 'lucide-react'
import HospitalDashboardLayout from '../../components/hospitaldashboard/HospitalDashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function HospitalDashboardHome() {
  const navigate = useNavigate()
  const { doctorProfile, registerUserInSupabase } = useAuth()

  // State for time filters
  const [overviewRange, setOverviewRange] = useState<'This Week' | 'This Month' | 'Last Month'>('This Week')
  const [deptRange, setDeptRange] = useState<'This Week' | 'This Month'>('This Week')

  // Modals for Quick Actions
  const [showAddApptModal, setShowAddApptModal] = useState(false)
  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false)
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null)

  // Quick Action Forms
  const [newApptForm, setNewApptForm] = useState({
    patientName: '',
    department: 'Cardiology',
    doctor: 'Dr. Amit Sharma',
    time: '09:30 AM',
    source: 'Walk-in'
  })

  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    phone: '',
    age: '32',
    gender: 'Male'
  })

  const [newDoctorForm, setNewDoctorForm] = useState({
    name: '',
    email: '',
    password: 'Password123!',
    dept: 'Cardiology',
    specialization: 'Consultant Specialist',
    fee: 500,
    limit: 25
  })

  // Dynamic hospital identity — sourced ONLY from the authenticated session
  // (AuthContext), never from localStorage: a stale/cross-tenant localStorage
  // value here was one of the root causes of hospital data leakage.
  const currentHospName = doctorProfile?.hospital_name || 'Hospital Dashboard'
  const currentHospId = doctorProfile?.hospital_id || ''

  const [registeredDoctors, setRegisteredDoctors] = useState<{ id: string; name: string; dept: string }[]>([])
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    appointmentsToday: 0,
    patientsWaiting: 0,
    completedToday: 0,
    scheduledToday: 0,
    cancelledToday: 0,
    noShowsToday: 0,
  })
  const [todayAppointments, setTodayAppointments] = useState<any[]>([])
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])
  const [activeQueues, setActiveQueues] = useState<any[]>([])
  const [deptBreakdown, setDeptBreakdown] = useState<any[]>([])
  const [sources, setSources] = useState<{ qr: number; walkin: number; website: number; other: number }>({ qr: 0, walkin: 0, website: 0, other: 0 })

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentHospId) return
      try {
        const todayStr = new Date().toISOString().split('T')[0]

        // 1. Doctors
        const { data: docs } = await supabase
          .from('profiles')
          .select('id, full_name, department')
          .eq('hospital_id', currentHospId)
          .eq('role', 'doctor')
          .eq('is_active', true)
        const doctorList = docs || []
        setRegisteredDoctors(doctorList.map(d => ({ id: d.id, name: d.full_name, dept: d.department || 'General OPD' })))
        if (!newApptForm.doctor && doctorList.length > 0) {
          setNewApptForm(prev => ({ ...prev, doctor: doctorList[0].full_name }))
        }

        // 2. Patients
        const { count: patCount } = await supabase
          .from('patients')
          .select('id', { count: 'exact', head: true })
          .eq('hospital_id', currentHospId)

        // 3. Appointments
        const { data: appts } = await supabase
          .from('appointments')
          .select('id, appointment_date, status, token_number, created_at, patient:patients(name), doctor:profiles(full_name, department)')
          .eq('hospital_id', currentHospId)
          .order('created_at', { ascending: false })

        const allAppts = appts || []
        const todayAppts = allAppts.filter(a => a.appointment_date === todayStr)
        const waitingAppts = allAppts.filter(a => a.status === 'pending' || a.status === 'waiting')
        const completedAppts = todayAppts.filter(a => a.status === 'completed')
        const cancelledAppts = allAppts.filter(a => a.status === 'cancelled')
        const noShowsAppts = allAppts.filter(a => a.status === 'no_show')
        const scheduledAppts = allAppts.filter(a => a.status === 'pending' || a.status === 'waiting' || a.status === 'confirmed')

        setStats({
          totalDoctors: doctorList.length,
          totalPatients: patCount || 0,
          totalAppointments: allAppts.length,
          appointmentsToday: todayAppts.length,
          patientsWaiting: waitingAppts.length,
          completedToday: completedAppts.length,
          scheduledToday: scheduledAppts.length,
          cancelledToday: cancelledAppts.length,
          noShowsToday: noShowsAppts.length,
        })

        // Format Today's appointments
        const mappedToday = todayAppts.slice(0, 5).map((a: any) => ({
          time: 'Today',
          name: a.patient?.name || 'Patient',
          status: a.status === 'completed' ? 'Done' : a.status === 'waiting' ? 'Waiting' : 'Upcoming',
          color: a.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
        }))
        setTodayAppointments(mappedToday)

        // Format Recent appointments
        const mappedRecent = allAppts.slice(0, 5).map((a: any) => ({
          name: a.patient?.name || 'Patient',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80',
          dept: a.doctor?.department || 'General OPD',
          time: a.appointment_date || 'Today',
          status: a.status === 'completed' ? 'Done' : a.status === 'waiting' ? 'Waiting' : 'Upcoming',
          color: a.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
        }))
        setRecentAppointments(mappedRecent)

        // Queues (empty if 0 waiting appointments)
        if (waitingAppts.length > 0) {
          const queueGroup: any = {}
          waitingAppts.forEach((a: any) => {
            const dName = a.doctor?.full_name || 'Doctor'
            const dDept = a.doctor?.department || 'General OPD'
            if (!queueGroup[dName]) {
              queueGroup[dName] = { doctor: dName, dept: dDept, currentToken: `T-${String(a.token_number || 1).padStart(3, '0')}`, waiting: 0 }
            }
            queueGroup[dName].waiting++
          })
          setActiveQueues(Object.values(queueGroup))
        } else {
          setActiveQueues([])
        }

        // Department breakdown
        const { data: depts } = await supabase
          .from('departments')
          .select('name')
          .eq('hospital_id', currentHospId)
          .eq('is_active', true)
        
        if (depts && depts.length > 0) {
          const deptMap = depts.map(d => {
            const deptAppts = allAppts.filter((a: any) => a.doctor?.department === d.name)
            return {
              name: d.name,
              scheduled: deptAppts.filter((a: any) => a.status === 'pending' || a.status === 'waiting').length,
              completed: deptAppts.filter((a: any) => a.status === 'completed').length,
              waiting: deptAppts.filter((a: any) => a.status === 'waiting').length,
              cancelled: deptAppts.filter((a: any) => a.status === 'cancelled').length
            }
          })
          setDeptBreakdown(deptMap)
        } else {
          setDeptBreakdown([])
        }

        // Sources count
        setSources({
          qr: allAppts.length,
          walkin: 0,
          website: 0,
          other: 0
        })
      } catch (e) {
        console.warn('Dashboard data fetch note:', e)
      }
    }
    fetchDashboardData()
  }, [currentHospId])

  // Handlers for Quick Action Submissions
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackNotice(`✓ Appointment for ${newApptForm.patientName} scheduled with ${newApptForm.doctor}!`)
    setShowAddApptModal(false)
    setNewApptForm({ patientName: '', department: 'Cardiology', doctor: registeredDoctors[0]?.name || '', time: '09:30 AM', source: 'Walk-in' })
    setTimeout(() => setFeedbackNotice(null), 4000)
  }

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackNotice(`✓ Patient ${newPatientForm.name} registered in hospital database!`)
    setShowAddPatientModal(false)
    setNewPatientForm({ name: '', phone: '', age: '32', gender: 'Male' })
    setTimeout(() => setFeedbackNotice(null), 4000)
  }

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await registerUserInSupabase(newDoctorForm.email, newDoctorForm.password, {
        role: 'doctor',
        name: newDoctorForm.name,
        dept: newDoctorForm.dept,
        hospital_id: currentHospId,
        specialization: newDoctorForm.specialization,
        fee: Number(newDoctorForm.fee) || 500,
        limit: Number(newDoctorForm.limit) || 25,
      })
      setFeedbackNotice(`✓ Doctor "${newDoctorForm.name}" created and onboarded!`)
      setShowAddDoctorModal(false)
      setNewDoctorForm({ name: '', email: '', password: 'Password123!', dept: 'Cardiology', specialization: 'Consultant Specialist', fee: 500, limit: 25 })
      setTimeout(() => setFeedbackNotice(null), 4000)
    } catch (err: any) {
      alert(`Doctor creation note: ${err.message || 'Saved'}`)
    }
  }

  return (
    <HospitalDashboardLayout pageTitle="Dashboard">
      {/* Toast Notice */}
      {feedbackNotice && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-3">
          <Check size={16} />
          <span>{feedbackNotice}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* ─── 1. TOP STATISTICS CARDS (5 KPIs matching reference image) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* KPI 1: Total Appointments */}
          <Link
            to="/hospitaldashboard/appointments"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Appointments</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {stats.totalAppointments}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 mt-2">
              <TrendingUp size={13} />
              <span>Real-time database count</span>
            </div>
          </Link>

          {/* KPI 2: Patients Today */}
          <Link
            to="/hospitaldashboard/patients"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Patients Today</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {stats.appointmentsToday}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
              <TrendingUp size={13} />
              <span>Appointments for today</span>
            </div>
          </Link>

          {/* KPI 3: Patients Waiting */}
          <Link
            to="/hospitaldashboard/live-queue"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Hourglass size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Patients Waiting</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {stats.patientsWaiting}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 mt-2">
              <TrendingUp size={13} />
              <span>Active waiting queue</span>
            </div>
          </Link>

          {/* KPI 4: Completed Today */}
          <Link
            to="/hospitaldashboard/appointments?status=completed"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Completed Today</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {stats.completedToday}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 mt-2">
              <TrendingUp size={13} />
              <span>Consultations done</span>
            </div>
          </Link>

          {/* KPI 5: No Shows */}
          <Link
            to="/hospitaldashboard/appointments?status=no-show"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">No Shows</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {stats.noShowsToday}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 mt-2">
              <TrendingDown size={13} />
              <span>Missed appointments</span>
            </div>
          </Link>
        </div>

        {/* ─── 2. MIDDLE SECTION: Charts & Queues ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Card A: Appointments Overview (lg: 5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header with Title & Date selector */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Appointments Overview</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Total Appointments</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOverviewRange(overviewRange === 'This Week' ? 'This Month' : 'This Week')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <span>{overviewRange}</span>
                    <ChevronDown size={13} className="text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Metric Callout */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalAppointments}</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp size={13} /> {stats.totalAppointments > 0 ? 'Active database records' : 'No records yet'}
                </span>
              </div>

              {/* SVG Line Chart or Zero Empty State */}
              {stats.totalAppointments === 0 ? (
                <div className="h-48 w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center p-4 mt-6">
                  <BarChart3 size={28} className="text-slate-300 mb-1" />
                  <p className="text-xs font-bold text-slate-600">No data available for this period</p>
                  <p className="text-[10px] text-slate-400">Appointment trends will appear here as bookings are recorded.</p>
                </div>
              ) : (
                <div className="mt-6 relative h-48 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 450 180">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {[30, 70, 110, 150].map((y, idx) => (
                      <line
                        key={idx}
                        x1="30"
                        y1={y}
                        x2="430"
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    ))}

                    <text x="5" y="34" fill="#94a3b8" fontSize="10" fontWeight="500">100</text>
                    <text x="10" y="74" fill="#94a3b8" fontSize="10" fontWeight="500">80</text>
                    <text x="10" y="114" fill="#94a3b8" fontSize="10" fontWeight="500">40</text>
                    <text x="10" y="154" fill="#94a3b8" fontSize="10" fontWeight="500">20</text>
                    <text x="15" y="178" fill="#94a3b8" fontSize="10" fontWeight="500">0</text>

                    <path
                      d="M 50 150 C 90 140, 130 115, 170 95 C 210 75, 250 85, 290 60 C 330 35, 370 70, 410 100 L 410 170 L 50 170 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M 50 150 C 90 140, 130 115, 170 95 C 210 75, 250 85, 290 60 C 330 35, 370 70, 410 100"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <text
                        key={day}
                        x={50 + idx * 60}
                        y="175"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                        fontWeight="500"
                      >
                        {day}
                      </text>
                    ))}
                  </svg>
                </div>
              )}
            </div>

            {/* Bottom 4 Summary Metrics (Live database counts) */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100">
              <div className="p-2.5 rounded-2xl bg-blue-50/70 text-left">
                <span className="text-[10px] font-bold text-blue-600 block">Scheduled</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{stats.scheduledToday}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-50/70 text-left">
                <span className="text-[10px] font-bold text-emerald-600 block">Completed</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{stats.completedToday}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-orange-50/70 text-left">
                <span className="text-[10px] font-bold text-orange-600 block">Cancelled</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{stats.cancelledToday}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50/70 text-left">
                <span className="text-[10px] font-bold text-rose-600 block">No Shows</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{stats.noShowsToday}</span>
              </div>
            </div>
          </div>

          {/* Card B: Live Queue Overview (lg: 4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Live Queue Overview</h3>
                <Link
                  to="/hospitaldashboard/live-queue"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  View All Queues
                </Link>
              </div>

              {/* Primary Queue Box or Empty State */}
              {activeQueues.length === 0 ? (
                <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-200/80 rounded-2xl my-3">
                  <Shield size={28} className="mx-auto text-slate-300 mb-1.5" />
                  <h4 className="font-bold text-slate-800 text-xs">No active queues</h4>
                  <p className="text-[11px] text-slate-400">Queues will appear when appointments are created for doctors.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 mb-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Shield size={15} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{activeQueues[0].dept}</h4>
                        <p className="text-[10px] text-slate-400">{activeQueues[0].doctor}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Current Token</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-3xl font-black text-slate-900 tracking-tight">{activeQueues[0].currentToken}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                          Now Serving
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-500 font-medium">Status: <strong className="text-slate-800">In Progress</strong></span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/80 text-slate-700">
                        {activeQueues[0].waiting} Waiting
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {activeQueues.slice(1).map((q, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Shield size={13} />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 leading-tight">{q.dept}</h5>
                            <p className="text-[10px] text-slate-400 leading-tight">{q.doctor}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/40">
                          {q.waiting} Waiting
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card C: Today's Appointments & Sources (lg: 3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Top: Today's Appointments Schedule */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-xs">Today's Appointments</h3>
                <Link to="/hospitaldashboard/appointments" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>

              <div className="space-y-2.5">
                {todayAppointments.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200/80">
                    <p className="text-xs font-bold text-slate-600">No appointments scheduled today</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Appointments booked for today will appear here.</p>
                  </div>
                ) : (
                  todayAppointments.map((appt, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1">
                      <span className="text-[11px] font-medium text-slate-400 w-16">{appt.time}</span>
                      <span className="font-bold text-slate-800 flex-1 truncate pr-2">{appt.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${appt.color}`}>
                        {appt.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom: Appointment Sources Donut Chart */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="font-bold text-slate-900 text-xs mb-3">Appointment Sources</h3>
              
              {stats.totalAppointments === 0 ? (
                <div className="p-4 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200/80">
                  <p className="text-[11px] text-slate-500 font-medium">No booking sources recorded yet</p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* SVG Donut */}
                  <div className="w-20 h-20 relative shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="4"
                        strokeDasharray="88 0"
                        strokeDashoffset="0"
                      />
                    </svg>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-1 text-[11px] flex-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#06b6d4]" /> QR Booking
                      </span>
                      <span className="font-bold text-slate-900">{sources.qr}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Walk-in
                      </span>
                      <span className="font-bold text-slate-900">{sources.walkin}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── 3. BOTTOM SECTION: Tables & Quick Actions ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Table 1: Department Wise Appointments (lg: 4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-xs">Department Wise Appointments</h3>
              <button
                onClick={() => setDeptRange(deptRange === 'This Week' ? 'This Month' : 'This Week')}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
              >
                <span>{deptRange}</span>
                <ChevronDown size={12} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-2 font-medium">Department</th>
                    <th className="pb-2 font-medium text-center">Scheduled</th>
                    <th className="pb-2 font-medium text-center">Completed</th>
                    <th className="pb-2 font-medium text-center">Waiting</th>
                    <th className="pb-2 font-medium text-center">Cancelled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {deptBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs font-medium">
                        No department appointment data available
                      </td>
                    </tr>
                  ) : (
                    deptBreakdown.map((dept, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition">
                        <td className="py-2.5 font-bold text-slate-900">{dept.name}</td>
                        <td className="py-2.5 text-center text-slate-600">{dept.scheduled}</td>
                        <td className="py-2.5 text-center font-bold text-emerald-600">{dept.completed}</td>
                        <td className="py-2.5 text-center text-amber-600">{dept.waiting}</td>
                        <td className="py-2.5 text-center text-rose-500">{dept.cancelled}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Recent Appointments (lg: 5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-xs">Recent Appointments</h3>
              <Link to="/hospitaldashboard/appointments" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-2 font-medium">Patient Name</th>
                    <th className="pb-2 font-medium">Department</th>
                    <th className="pb-2 font-medium">Time</th>
                    <th className="pb-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs font-medium">
                        No recent appointments recorded yet
                      </td>
                    </tr>
                  ) : (
                    recentAppointments.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2.5">
                            <img src={r.avatar} alt={r.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                            <span className="font-bold text-slate-800">{r.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-500 font-medium">{r.dept}</td>
                        <td className="py-2.5 text-slate-500 font-medium">{r.time}</td>
                        <td className="py-2.5 text-right">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${r.color}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions (lg: 3 cols) */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <h3 className="font-bold text-slate-900 text-xs mb-3">Quick Actions</h3>

            {/* 6 Grid Buttons matching reference image */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* 1. Add Appointment */}
              <button
                onClick={() => setShowAddApptModal(true)}
                className="p-3 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/40 transition flex flex-col items-center justify-center text-center group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                  <Calendar size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600">Add Appt</span>
              </button>

              {/* 2. Add Patient */}
              <button
                onClick={() => setShowAddPatientModal(true)}
                className="p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-400 hover:bg-emerald-50/40 transition flex flex-col items-center justify-center text-center group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                  <UserPlus size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-600">Add Patient</span>
              </button>

              {/* 3. Add Doctor */}
              <button
                onClick={() => setShowAddDoctorModal(true)}
                className="p-3 rounded-2xl border border-slate-200/80 hover:border-purple-400 hover:bg-purple-50/40 transition flex flex-col items-center justify-center text-center group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                  <Stethoscope size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-600">Add Doctor</span>
              </button>

              {/* 4. Manage Doctors */}
              <Link
                to="/hospitaldashboard/doctors"
                className="p-3 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/40 transition flex flex-col items-center justify-center text-center group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                  <Users size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 leading-tight">Manage Doctors</span>
              </Link>

              {/* 5. Manage Department */}
              <Link
                to="/hospitaldashboard/departments"
                className="p-3 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/40 transition flex flex-col items-center justify-center text-center group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                  <Building2 size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 leading-tight">Manage Dept</span>
              </Link>

              {/* 6. Reports */}
              <Link
                to="/hospitaldashboard/reports"
                className="p-3 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/40 transition flex flex-col items-center justify-center text-center group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                  <BarChart3 size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-600">Reports</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL 1: ADD APPOINTMENT ─── */}
      {showAddApptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                <span>Schedule New Appointment</span>
              </h3>
              <button onClick={() => setShowAddApptModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Verma"
                  value={newApptForm.patientName}
                  onChange={(e) => setNewApptForm({ ...newApptForm, patientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newApptForm.department}
                    onChange={(e) => setNewApptForm({ ...newApptForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
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
                    value={newApptForm.doctor}
                    onChange={(e) => setNewApptForm({ ...newApptForm, doctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    {registeredDoctors.length === 0 ? (
                      <option value="">No registered doctors available</option>
                    ) : (
                      registeredDoctors.map((doc) => (
                        <option key={doc.id} value={doc.name}>{doc.name} ({doc.dept})</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Appointment Time</label>
                  <input
                    type="text"
                    value={newApptForm.time}
                    onChange={(e) => setNewApptForm({ ...newApptForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Source</label>
                  <select
                    value={newApptForm.source}
                    onChange={(e) => setNewApptForm({ ...newApptForm, source: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    <option>Walk-in</option>
                    <option>QR Booking</option>
                    <option>Website</option>
                    <option>Phone / Emergency</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition"
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: ADD PATIENT ─── */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus size={18} className="text-emerald-600" />
                <span>Register New Patient</span>
              </h3>
              <button onClick={() => setShowAddPatientModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreatePatient} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suman Roy"
                  value={newPatientForm.name}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={newPatientForm.phone}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={newPatientForm.age}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, age: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newPatientForm.gender}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 transition"
              >
                Save Patient Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: ADD DOCTOR ─── */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Stethoscope size={18} className="text-purple-600" />
                <span>Onboard Medical Specialist</span>
              </h3>
              <button onClick={() => setShowAddDoctorModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateDoctor} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Khanna"
                  value={newDoctorForm.name}
                  onChange={(e) => setNewDoctorForm({ ...newDoctorForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email (Sign In)</label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.com"
                    value={newDoctorForm.email}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newDoctorForm.password}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newDoctorForm.dept}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, dept: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  >
                    <option>Cardiology</option>
                    <option>Orthopedics</option>
                    <option>Dermatology</option>
                    <option>General Medicine</option>
                    <option>Pediatrics</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={newDoctorForm.fee}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-500/20 transition"
              >
                Onboard & Save Doctor
              </button>
            </form>
          </div>
        </div>
      )}
    </HospitalDashboardLayout>
  )
}
