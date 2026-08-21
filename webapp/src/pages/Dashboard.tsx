import { useNavigate } from 'react-router-dom'
import { Users, Calendar, Building2, Stethoscope, Clock, ShieldCheck } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'

export default function Dashboard() {
  const navigate = useNavigate()
  const { doctorProfile } = useAuth()

  const doctorName = doctorProfile?.name || 'Dr. Authorized Doctor'
  const hospitalName = doctorProfile?.hospital_name || 'Metro Care General Hospital'
  const departmentName = doctorProfile?.department_name || 'Cardiology'

  return (
    <Layout>
      <div className="space-y-6">
        {/* Authenticated Doctor Welcome Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-widest">
              <Building2 size={16} /> {hospitalName}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {doctorName}!
            </h1>
            <p className="text-blue-200 text-sm flex items-center gap-2">
              <Stethoscope size={16} className="text-blue-400" />
              <span>Assigned Department: <strong>{departmentName}</strong></span>
              <span className="text-blue-400">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck size={14} /> Firebase Authenticated
              </span>
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/queue')}
            className="bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 text-white font-bold"
          >
            Open Live Queue
          </Button>
        </div>

        {/* Doctor-Specific Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-gray-200 hover:shadow-md transition">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Today's Queue Check-ins</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">4 Patients</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                <Users size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Scheduled Appointments</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">3 Today</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <Calendar size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Completed Consultations</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">1 Patient</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
                <Users size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Est. Next Wait Time</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">10 mins</p>
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
            <Card className="border border-gray-200">
              <CardHeader title={`Active Workspace for ${doctorName}`} />
              <CardContent className="space-y-4 pt-4">
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Live Department Queue</p>
                    <p className="text-xs text-gray-600">Call next patient, start consultations, or skip</p>
                  </div>
                  <Button variant="primary" size="md" onClick={() => navigate('/queue')}>
                    Launch Queue
                  </Button>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Appointments Hub</p>
                    <p className="text-xs text-gray-600">Manage Today's, Upcoming, and Completed appointments</p>
                  </div>
                  <Button variant="secondary" size="md" onClick={() => navigate('/appointments')}>
                    Appointments
                  </Button>
                </div>

                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Clinical History Archive</p>
                    <p className="text-xs text-gray-600">Deep-dive patient profile, queue history, & reports</p>
                  </div>
                  <Button variant="secondary" size="md" onClick={() => navigate('/history')}>
                    Patient History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-200">
            <CardHeader title="Doctor Shortcuts" />
            <CardContent className="py-6 space-y-3">
              <button
                onClick={() => navigate('/qr-kiosk')}
                className="w-full px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold text-sm transition shadow-md shadow-blue-500/20 text-left flex items-center justify-between"
              >
                <span>📱 Generate Doctor QR Kiosk</span>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="w-full px-4 py-3 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-xl font-bold text-sm transition text-left flex items-center justify-between"
              >
                <span>📄 View Patient Reports</span>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate('/appointments')}
                className="w-full px-4 py-3 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-xl font-bold text-sm transition text-left flex items-center justify-between"
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
