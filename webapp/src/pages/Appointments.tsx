import { useState, useEffect } from 'react'
import { Plus, X, Calendar, Clock, Ticket, Receipt, CheckCircle, XCircle } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent } from '../components/Card'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { getAppointmentsForDoctor, saveAppointmentsForDoctor, AppointmentItem } from '../utils/doctorStore'

export default function Appointments() {
  const { doctorProfile } = useAuth()
  const doctorId = doctorProfile?.doctor_id || 'doc-001'
  const doctorName = doctorProfile?.name || 'Dr. Authorized Doctor'

  const [filterTab, setFilterTab] = useState<'todays' | 'upcoming' | 'completed' | 'cancelled'>('todays')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    patient_name: '',
    phone: '',
    appointment_date: '',
    department: doctorProfile?.department_name || 'Cardiology',
    reason_for_visit: '',
  })

  const [appointmentsList, setAppointmentsList] = useState<AppointmentItem[]>([])

  const reloadAppointments = () => {
    if (doctorId) {
      const storeAppointments = getAppointmentsForDoctor(doctorId)
      setAppointmentsList(storeAppointments)
    }
  }

  useEffect(() => {
    reloadAppointments()

    // 1. BroadcastChannel Listener
    let channel: BroadcastChannel | null = null
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('clinic_os_queue_channel')
        channel.onmessage = (event) => {
          if (event.data?.type === 'QUEUE_UPDATED') {
            reloadAppointments()
          }
        }
      } catch (e) {
        // ignore
      }
    }

    // 2. Custom Window Event Listener
    const handleCustomUpdate = () => reloadAppointments()
    window.addEventListener('clinic_os_queue_updated', handleCustomUpdate)
    window.addEventListener('storage', handleCustomUpdate)

    // 3. 2-Second Polling
    const pollInterval = setInterval(() => {
      reloadAppointments()
    }, 2000)

    return () => {
      if (channel) channel.close()
      window.removeEventListener('clinic_os_queue_updated', handleCustomUpdate)
      window.removeEventListener('storage', handleCustomUpdate)
      clearInterval(pollInterval)
    }
  }, [doctorId])

  const filteredAppointments = appointmentsList.filter((apt) => {
    if (filterTab === 'todays') return apt.status === 'Scheduled'
    if (filterTab === 'upcoming') return apt.status === 'Scheduled'
    if (filterTab === 'completed') return apt.status === 'Completed'
    if (filterTab === 'cancelled') return apt.status === 'Cancelled'
    return true
  })

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    const nextTokenNum = `Token ${String(appointmentsList.length + 1).padStart(3, '0')}`
    const nextReceiptNum = `RCP-${Date.now().toString().substring(5)}`

    const newApt: AppointmentItem = {
      id: `apt-${Date.now()}`,
      doctor_id: doctorId,
      token_number: nextTokenNum,
      receipt_number: nextReceiptNum,
      patient_name: bookingForm.patient_name,
      phone: bookingForm.phone,
      appointment_date: bookingForm.appointment_date || 'Today',
      appointment_time: '11:00 AM',
      department: bookingForm.department,
      status: 'Scheduled',
    }

    const updated = [newApt, ...appointmentsList]
    setAppointmentsList(updated)
    saveAppointmentsForDoctor(doctorId, updated)
    setShowBookingModal(false)
    setBookingForm({
      patient_name: '',
      phone: '',
      appointment_date: '',
      department: doctorProfile?.department_name || 'Cardiology',
      reason_for_visit: '',
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Appointments Management for {doctorName}</h1>
            <p className="text-gray-600 text-sm mt-1">
              View and filter patient appointments by Token Number, Receipt Reference, and Status
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowBookingModal(true)} className="shadow-lg shadow-blue-600/20">
            <Plus size={20} />
            New Appointment
          </Button>
        </div>

        {/* 4 Tabs: Today's, Upcoming, Completed, Cancelled */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {[
            { id: 'todays', label: "Today's Appointments", count: appointmentsList.filter(a => a.status === 'Scheduled').length },
            { id: 'upcoming', label: 'Upcoming', count: appointmentsList.filter(a => a.status === 'Scheduled').length },
            { id: 'completed', label: 'Completed', count: appointmentsList.filter(a => a.status === 'Completed').length },
            { id: 'cancelled', label: 'Cancelled', count: appointmentsList.filter(a => a.status === 'Cancelled').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filterTab === tab.id ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar size={40} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-600 font-medium">No appointments found for {doctorName}.</p>
                <p className="text-xs text-gray-400 mt-1">Book an appointment or share your doctor QR code for patient check-in.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((apt) => (
              <Card key={apt.id} className="hover:shadow-md transition border border-gray-200">
                <div className="px-6 py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Patient Info & Token / Receipt */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg border border-blue-100 flex-shrink-0">
                        {apt.patient_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-base">{apt.patient_name}</h3>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-200">
                            <Ticket size={12} /> {apt.token_number}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 text-gray-700 font-mono text-xs rounded-lg border border-gray-200">
                            <Receipt size={12} /> {apt.receipt_number}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                          <span>Phone: {apt.phone}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock size={13} /> {apt.appointment_date} ({apt.appointment_time})</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-3">
                      {apt.status === 'Scheduled' && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-full border border-blue-200 flex items-center gap-1">
                          <Clock size={13} /> Scheduled
                        </span>
                      )}
                      {apt.status === 'Completed' && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 font-semibold text-xs rounded-full border border-green-200 flex items-center gap-1">
                          <CheckCircle size={13} /> Completed
                        </span>
                      )}
                      {apt.status === 'Cancelled' && (
                        <span className="px-3 py-1 bg-red-50 text-red-700 font-semibold text-xs rounded-full border border-red-200 flex items-center gap-1">
                          <XCircle size={13} /> Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
                <h2 className="text-lg font-bold">Book Appointment for {doctorName}</h2>
                <button onClick={() => setShowBookingModal(false)} className="p-1 hover:bg-blue-700 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Patient Name *</label>
                  <input
                    type="text"
                    name="patient_name"
                    value={bookingForm.patient_name}
                    onChange={handleBookingChange}
                    placeholder="Enter full patient name"
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleBookingChange}
                    placeholder="+91-9876543210"
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={bookingForm.department}
                    readOnly
                    className="w-full px-3.5 py-2.5 border border-gray-300 bg-gray-50 rounded-xl text-sm font-semibold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Appointment Date / Time</label>
                  <input
                    type="text"
                    name="appointment_date"
                    value={bookingForm.appointment_date}
                    onChange={handleBookingChange}
                    placeholder="e.g. Tomorrow at 10:30 AM"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowBookingModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Generate Token
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
