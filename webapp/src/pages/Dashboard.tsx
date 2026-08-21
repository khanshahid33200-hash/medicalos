import { Users, Calendar, AlertCircle } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import { useAppointmentStats, useCheckinStats } from '../hooks/useApi'

export default function Dashboard() {
  const appointmentStats = useAppointmentStats()
  const checkinStats = useCheckinStats()

  const stats = appointmentStats.data?.data || {
    total_appointments: 0,
    upcoming_appointments: 0,
    completed_appointments: 0,
    no_show_appointments: 0,
  }

  const checkinData = checkinStats.data?.data || {
    checkins_today: 0,
    total_patients: 0,
    returning_patients_today: 0,
  }

  return (
    <Layout userRole="doctor">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening at your clinic.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Today's Check-ins</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{checkinData.checkins_today}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="hover">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcoming_appointments}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="hover">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{checkinData.total_patients}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="hover">
            <CardContent className="flex items-start justify-between pt-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">No-shows</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.no_show_appointments}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader title="Appointment Summary" />
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Upcoming</p>
                      <p className="text-sm text-gray-600">Appointments to conduct today</p>
                    </div>
                    <p className="text-2xl font-bold text-primary-600">{stats.upcoming_appointments}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Completed</p>
                      <p className="text-sm text-gray-600">Appointments this month</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{stats.completed_appointments}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Total</p>
                      <p className="text-sm text-gray-600">All appointments</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-600">{stats.total_appointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-medium transition">
                  View Queue
                </button>
                <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition">
                  New Appointment
                </button>
                <button className="w-full px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition">
                  Check Reports
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
