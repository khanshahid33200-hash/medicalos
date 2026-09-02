import { useState, useEffect } from 'react'
import {
  Search,
  Calendar,
  User,
  FileText,
  ChevronRight,
  Filter,
  CheckCircle
} from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { getDoctorAppointments, type DoctorAppointment } from '../lib/doctorAppointments'

// Both tabs on this page (Appointment History, Scanned Patient History,
// Reports Archive) used to read two separate, unsynchronized localStorage
// buckets (doctorStore's queue vs. appointments) that were themselves
// disconnected from real bookings. Now both derive from the same live
// Supabase query — the full (no date filter) appointment history for this
// doctor — mapped to the field names this page's JSX already expects.
function mapAppointmentToHistoryItem(appt: DoctorAppointment) {
  return {
    id: appt.id,
    patient_name: appt.patient?.name || 'Unnamed Patient',
    phone: appt.patient?.phone || '',
    age: appt.patient?.age ?? undefined,
    gender: appt.patient?.gender ?? undefined,
    token_number: String(appt.token_number ?? ''),
    receipt_number: appt.id.slice(0, 8).toUpperCase(),
    department: '—',
    appointment_date: appt.appointment_date,
    status: appt.status,
    symptoms: appt.symptoms || '',
    severity: '—',
    check_in_time: appt.created_at ? new Date(appt.created_at).toLocaleString() : '',
  }
}

export default function History() {
  const { doctorProfile } = useAuth()
  const doctorId = doctorProfile?.doctor_id || ''
  const doctorName = doctorProfile?.name || 'Dr. Authorized Doctor'

  const [activeTab, setActiveTab] = useState<'appointments' | 'patients' | 'reports'>('appointments')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [historyList, setHistoryList] = useState<ReturnType<typeof mapAppointmentToHistoryItem>[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)

  useEffect(() => {
    if (!doctorId) return
    getDoctorAppointments(doctorId).then(appointments => {
      setHistoryList(appointments.map(mapAppointmentToHistoryItem))
    })
  }, [doctorId])

  const filteredAppointments = historyList.filter((item) => {
    const matchSearch =
      item.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.token_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase()
    return matchSearch && matchStatus
  })

  const filteredPatients = historyList.filter((pat) => {
    return (
      pat.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pat.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pat.token_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <HistoryIcon size={30} className="text-blue-600" /> Clinical History for {doctorName}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Search Scanned Patients, Appointments, and Consultation History
            </p>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-gray-200 gap-8">
          <button
            onClick={() => { setActiveTab('appointments'); setSelectedPatient(null); }}
            className={`pb-3 font-semibold text-sm transition flex items-center gap-2 border-b-2 ${
              activeTab === 'appointments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar size={18} />
            <span>Appointment History</span>
          </button>

          <button
            onClick={() => { setActiveTab('patients'); setSelectedPatient(null); }}
            className={`pb-3 font-semibold text-sm transition flex items-center gap-2 border-b-2 ${
              activeTab === 'patients'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User size={18} />
            <span>Scanned Patient History</span>
          </button>

          <button
            onClick={() => { setActiveTab('reports'); setSelectedPatient(null); }}
            className={`pb-3 font-semibold text-sm transition flex items-center gap-2 border-b-2 ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText size={18} />
            <span>Reports Archive</span>
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Patient Name, Phone Number, or Token Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {activeTab === 'appointments' && (
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: APPOINTMENT HISTORY */}
        {activeTab === 'appointments' && (
          <Card>
            <CardHeader title={`Appointment History (${filteredAppointments.length})`} />
            <CardContent className="p-0">
              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Calendar size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="font-semibold">No appointment history for {doctorName}.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                      <tr>
                        <th className="px-6 py-3">Token & Receipt</th>
                        <th className="px-6 py-3">Patient Name</th>
                        <th className="px-6 py-3">Appointment Date</th>
                        <th className="px-6 py-3">Department</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      {filteredAppointments.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-md border border-blue-100 mr-2">
                              {item.token_number}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">{item.receipt_number}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-semibold">{item.patient_name}</td>
                          <td className="px-6 py-4 text-gray-600">{item.appointment_date}</td>
                          <td className="px-6 py-4 text-gray-900 font-semibold">{item.department}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                              <CheckCircle size={14} /> {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 2: SCANNED PATIENT HISTORY */}
        {activeTab === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader title="Scanned Patient Queue" />
              <CardContent className="p-0">
                {filteredPatients.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">No scanned patients found for {doctorName}.</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredPatients.map((pat) => (
                      <button
                        key={pat.id}
                        onClick={() => setSelectedPatient(pat)}
                        className={`w-full text-left p-4 hover:bg-blue-50/50 transition flex items-center justify-between ${
                          selectedPatient?.id === pat.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div>
                          <p className="font-bold text-gray-900">{pat.patient_name}</p>
                          <p className="text-xs text-gray-500 font-mono">{pat.token_number} • {pat.phone}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              {selectedPatient ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader title="Patient Profile & Check-in Info" />
                    <CardContent className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Full Name</p>
                          <p className="font-bold text-base text-gray-900">{selectedPatient.patient_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="font-semibold text-gray-800">{selectedPatient.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Age & Gender</p>
                          <p className="font-semibold text-gray-800">{selectedPatient.age || 30} yrs • {selectedPatient.gender || 'M'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Queue Token</p>
                          <p className="font-semibold text-blue-600">{selectedPatient.token_number}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader title="Reported Symptoms & Notes" />
                    <CardContent className="space-y-3 text-xs">
                      <p className="font-bold text-gray-900">Symptoms: {selectedPatient.symptoms || 'General OPD Visit'}</p>
                      <p className="text-gray-600">Severity: {selectedPatient.severity || 'Moderate'}</p>
                      <p className="text-gray-500">Check-in Time: {selectedPatient.check_in_time}</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
                  <User size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="font-semibold text-lg">Select a Patient to view check-in details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS ARCHIVE */}
        {activeTab === 'reports' && (
          <Card>
            <CardHeader title={`Scanned Reports Archive (${historyList.length})`} />
            <CardContent className="p-0">
              {historyList.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No reports archive yet for {doctorName}.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                      <tr>
                        <th className="px-6 py-3">Token</th>
                        <th className="px-6 py-3">Patient Name</th>
                        <th className="px-6 py-3">Symptoms</th>
                        <th className="px-6 py-3">Check-in Time</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      {historyList.map((q) => (
                        <tr key={q.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-bold text-blue-600">{q.token_number}</td>
                          <td className="px-6 py-4 text-gray-900 font-semibold">{q.patient_name}</td>
                          <td className="px-6 py-4 text-gray-700">{q.symptoms || 'Routine Visit'}</td>
                          <td className="px-6 py-4 text-gray-600">{q.check_in_time}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-semibold text-xs rounded-full border border-purple-100">
                              {q.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}

function HistoryIcon(props: any) {
  return <FileText {...props} />
}
