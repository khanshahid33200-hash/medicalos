import { useState } from 'react'
import { Plus, ChevronRight, X } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'
import { useAppointments, useBookAppointment } from '../hooks/useApi'
import { formatDistanceToNow } from 'date-fns'

export default function Appointments() {
  const [filter, setFilter] = useState<'upcoming' | 'completed' | 'all'>('upcoming')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    patient_id: '',
    doctor_id: 'doctor-001',
    appointment_date: '',
    department: 'General',
    reason_for_visit: '',
    confirmation_method: 'whatsapp',
  })

  const { data, isLoading, error } = useAppointments({ status: filter === 'all' ? undefined : filter })
  const { mutate: bookAppointment, isLoading: isBooking } = useBookAppointment()

  const appointments = data?.data?.appointments || []

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    bookAppointment(bookingForm, {
      onSuccess: () => {
        setShowBookingModal(false)
        setBookingForm({
          patient_id: '',
          doctor_id: 'doctor-001',
          appointment_date: '',
          department: 'General',
          reason_for_visit: '',
          confirmation_method: 'whatsapp',
        })
      },
    })
  }

  return (
    <Layout userRole="doctor">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-2">Manage all patient appointments</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowBookingModal(true)}>
            <Plus size={20} />
            New Appointment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['upcoming', 'completed', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
                <p className="text-gray-600 mt-2">Loading appointments...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-red-600">Error loading appointments</p>
              </CardContent>
            </Card>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">No appointments found</p>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment: any) => (
              <Card key={appointment.id} className="hover">
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-600">P</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Patient ID: {appointment.patient_id}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.appointment_date).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                appointment.status === 'scheduled'
                                  ? 'bg-blue-100 text-blue-700'
                                  : appointment.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Confirmed</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {appointment.is_confirmed ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronRight className="text-gray-400" size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader className="flex items-center justify-between bg-primary-600 text-white">
                <h2 className="text-xl font-bold">New Appointment</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-1 hover:bg-primary-700 rounded"
                >
                  <X size={20} />
                </button>
              </CardHeader>
              <CardContent className="py-6">
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient ID *
                    </label>
                    <input
                      type="text"
                      name="patient_id"
                      value={bookingForm.patient_id}
                      onChange={handleBookingChange}
                      placeholder="Enter patient ID"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor *
                    </label>
                    <select
                      name="doctor_id"
                      value={bookingForm.doctor_id}
                      onChange={handleBookingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="doctor-001">Dr. Smith</option>
                      <option value="doctor-002">Dr. Johnson</option>
                      <option value="doctor-003">Dr. Patel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={bookingForm.department}
                      onChange={handleBookingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="General">General</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Cardiology">Cardiology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="appointment_date"
                      value={bookingForm.appointment_date}
                      onChange={handleBookingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Visit
                    </label>
                    <textarea
                      name="reason_for_visit"
                      value={bookingForm.reason_for_visit}
                      onChange={handleBookingChange}
                      placeholder="Brief reason for consultation"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmation Method
                    </label>
                    <select
                      name="confirmation_method"
                      value={bookingForm.confirmation_method}
                      onChange={handleBookingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="call">Call</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isBooking}
                      className="flex-1"
                    >
                      {isBooking ? 'Booking...' : 'Book Appointment'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}
