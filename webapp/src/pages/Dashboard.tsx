import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Calendar, Building2, Stethoscope, Clock, ShieldCheck, DollarSign, PhoneCall } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import { getQueueForDoctor, getAppointmentsForDoctor } from '../utils/doctorStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { doctorProfile } = useAuth()

  const [userRole, setUserRole] = useState<'hospital_admin' | 'doctor'>('doctor')

  const doctorId = doctorProfile?.doctor_id || 'doc-001'
  const doctorName = doctorProfile?.name || 'Dr. Authorized Doctor'
  const hospitalName = doctorProfile?.hospital_name || 'City Care Hospital'
  const departmentName = doctorProfile?.department_name || 'Cardiology'

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

  const totalCheckins = queueList.length
  const scheduledApts = aptList.filter((a) => a.status === 'Scheduled').length
  const completedConsultations = queueList.filter((q) => q.status === 'Completed').length
  const waitingCount = queueList.filter((q) => q.status === 'Waiting').length

  // HOSPITAL ADMIN DASHBOARD VIEW
  if (userRole === 'hospital_admin') {
    return (
      <Layout font-sans>
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-400/30">
                Hospital Administration Dashboard
              </span>
              <h1 className="text-3xl sm:text-4xl font-black font-recoleta tracking-tight">
                {hospitalName} Control Center
              </h1>
              <p className="text-blue-200 text-xs font-medium">
                Manage Doctors, Departments, Patient Queues, Razorpay Collections, and Voice Reception Agent
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => navigate('/mrshahidbabu')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">
                + Register Doctor
              </Button>
              <Button variant="secondary" onClick={() => navigate('/payments')} className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
                Payment Refunds
              </Button>
            </div>
          </div>

          {/* Hospital-Wide Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition">
              <CardContent className="flex items-start justify-between pt-6">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Today's Revenue</p>
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
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Doctors</p>
                  <p className="text-3xl font-black text-slate-900 font-mono mt-1">5 Doctors</p>
                  <p className="text-[11px] text-slate-400 font-medium">Across 5 Departments</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                  <Stethoscope size={24} />
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
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Voice Calls Handled</p>
                  <p className="text-3xl font-black text-purple-600 font-mono mt-1">127 Calls</p>
                  <p className="text-[11px] text-slate-400 font-medium">Hindi & English AI Agent</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
                  <PhoneCall size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hospital Management Console Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="border border-slate-200 rounded-3xl shadow-md">
                <CardHeader title="Hospital Management Modules" />
                <CardContent className="space-y-4 pt-4">
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Doctor Roster & Availability</p>
                      <p className="text-xs text-slate-600">Onboard doctors, set consultation fees, daily limits & leave days</p>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => navigate('/mrshahidbabu')}>
                      Manage Team
                    </Button>
                  </div>

                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Collections & Razorpay Refunds</p>
                      <p className="text-xs text-slate-600">View daily revenue, check transaction logs, and issue refunds</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => navigate('/payments')}>
                      Payments Console
                    </Button>
                  </div>

                  <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Entrance Single QR Poster Generator</p>
                      <p className="text-xs text-slate-600">Download PNG & SVG hospital entrance poster for OPD check-in</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => navigate('/qr-kiosk')}>
                      QR Poster
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-slate-200 rounded-3xl shadow-md">
              <CardHeader title="Hospital Quick Actions" />
              <CardContent className="py-6 space-y-3">
                <button
                  onClick={() => navigate('/queue')}
                  className="w-full px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold text-xs transition shadow-md shadow-blue-500/20 text-left flex items-center justify-between"
                >
                  <span>🏥 Monitor Live OPD Queue</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigate('/display/demo')}
                  className="w-full px-4 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold text-xs transition text-left flex items-center justify-between"
                >
                  <span>📺 Launch TV Display Board</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => navigate('/reports')}
                  className="w-full px-4 py-3 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl font-bold text-xs transition text-left flex items-center justify-between"
                >
                  <span>📊 Export Revenue & Reports</span>
                  <span>→</span>
                </button>
              </CardContent>
            </Card>
          </div>
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
