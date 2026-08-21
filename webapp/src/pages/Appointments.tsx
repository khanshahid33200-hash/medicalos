import { useState } from 'react'
import { Plus, X, Calendar, Clock, Ticket, Receipt, CheckCircle, XCircle } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent } from '../components/Card'
import Button from '../components/Button'

export default function Appointments() {
  const [filterTab, setFilterTab] = useState<'todays' | 'upcoming' | 'completed' | 'cancelled'>('todays')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    patient_name: '',
    phone: '',
    appointment_date: '',
    department: 'Cardiology',
    reason_for_visit: '',
    confirmation_method: 'whatsapp',
  })

  // Sample Appointments dataset matching user requirement
  const [appointmentsList, setAppointmentsList] = useState([
    {
      id: 'apt-001',
      token_number: 'Token 001',
      receipt_number: 'RCP-2026-0819',
      patient_name: 'Rahul Sharma',
      phone: '+91-9876543210',
      appointment_time: '10:00 AM Today',
      category: 'todays',
      status: 'scheduled',
      is_confirmed: true,
    },
    {
      id: 'apt-002',
      token_number: 'Token 002',
      receipt_number: 'RCP-2026-0820',
      patient_name: 'Amit Khan',
      phone: '+91-9876543211',
      appointment_time: '10:30 AM Today',
      category: 'todays',
      status: 'scheduled',
      is_confirmed: true,
    },
    {
      id: 'apt-003',
      token_number: 'Token 003',
      receipt_number: 'RCP-2026-0821',
      patient_name: 'Priya Sharma',
      phone: '+91-9876543212',
      appointment_time: '11:00 AM Today',
      category: 'todays',
      status: 'scheduled',
      is_confirmed: false,
    },
    {
      id: 'apt-004',
      token_number: 'Token 004',
      receipt_number: 'RCP-2026-0822',
      patient_name: 'Vikram Singh',
      phone: '+91-9876543213',
      appointment_time: '2026-08-21 02:00 PM',
      category: 'upcoming',
      status: 'scheduled',
      is_confirmed: true,
    },
    {
      id: 'apt-005',
      token_number: 'Token 005',
      receipt_number: 'RCP-2026-0818',
      patient_name: 'Ananya Verma',
      phone: '+91-9876543214',
      appointment_time: '2026-08-19 04:30 PM',
      category: 'completed',
      status: 'completed',
      is_confirmed: true,
    },
    {
      id: 'apt-006',
      token_number: 'Token 006',
      receipt_number: 'RCP-2026-0817',
      patient_name: 'Deepak Kumar',
      phone: '+91-9876543215',
      appointment_time: '2026-08-19 01:00 PM',
      category: 'cancelled',
      status: 'cancelled',
      is_confirmed: false,
    },
  ])

  const filteredAppointments = appointmentsList.filter((apt) => apt.category === filterTab)

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    const nextTokenNum = `Token 00${appointmentsList.length + 1}`
    const nextReceiptNum = `RCP-2026-08${20 + appointmentsList.length}`
    const newApt = {
      id: `apt-00${appointmentsList.length + 1}`,
      token_number: nextTokenNum,
      receipt_number: nextReceiptNum,
      patient_name: bookingForm.patient_name,
      phone: bookingForm.phone,
      appointment_time: bookingForm.appointment_date || '11:30 AM Today',
      category: 'todays' as const,
      status: 'scheduled',
      is_confirmed: true,
    }
    setAppointmentsList([newApt, ...appointmentsList])
    setShowBookingModal(false)
    setBookingForm({
      patient_name: '',
      phone: '',
      appointment_date: '',
      department: 'Cardiology',
      reason_for_visit: '',
      confirmation_method: 'whatsapp',
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Appointments Management</h1>
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
            { id: 'todays', label: "Today's Appointments", count: appointmentsList.filter(a => a.category === 'todays').length },
            { id: 'upcoming', label: 'Upcoming', count: appointmentsList.filter(a => a.category === 'upcoming').length },
            { id: 'completed', label: 'Completed', count: appointmentsList.filter(a => a.category === 'completed').length },
            { id: 'cancelled', label: 'Cancelled', count: appointmentsList.filter(a => a.category === 'cancelled').length },
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
                <p className="text-gray-600 font-medium">No appointments found in this category.</p>
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
                          <span className="flex items-center gap-1"><Clock size={13} /> {apt.appointment_time}</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-3">
                      {apt.status === 'scheduled' && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-full border border-blue-200 flex items-center gap-1">
                          <Clock size={13} /> Scheduled
                        </span>
                      )}
                      {apt.status === 'completed' && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 font-semibold text-xs rounded-full border border-green-200 flex items-center gap-1">
                          <CheckCircle size={13} /> Completed
                        </span>
                      )}
                      {apt.status === 'cancelled' && (
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
                <h2 className="text-lg font-bold">Book New Patient Appointment</h2>
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
                  <select
                    name="department"
                    value={bookingForm.department}
                    onChange={handleBookingChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General OPD">General OPD</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Appointment Time</label>
                  <input
                    type="text"
                    name="appointment_date"
                    value={bookingForm.appointment_date}
                    onChange={handleBookingChange}
                    placeholder="e.g. 11:30 AM Today"
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
