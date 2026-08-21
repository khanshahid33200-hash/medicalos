import { useState } from 'react'
import {
  Search,
  Calendar,
  User,
  FileText,
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'

interface PatientRecord {
  id: string
  name: string
  phone: string
  age: number
  gender: string
  receipt_number: string
  token_number: string
  history_appointments: any[]
  history_queue: any[]
  history_reports: any[]
  history_consultations: any[]
}

export default function History() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'patients' | 'reports'>('appointments')

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null)

  // Sample Multi-Tenant History Datasets
  const appointmentHistory = [
    {
      id: 'apt-101',
      token_number: 'Token 001',
      receipt_number: 'RCP-2026-0819',
      patient_name: 'Rahul Sharma',
      patient_phone: '+91-9876543210',
      appointment_date: '2026-08-20 10:00 AM',
      doctor: 'Dr. Rahul Sharma',
      department: 'Cardiology',
      status: 'completed',
    },
    {
      id: 'apt-102',
      token_number: 'Token 002',
      receipt_number: 'RCP-2026-0820',
      patient_name: 'Amit Khan',
      patient_phone: '+91-9876543211',
      appointment_date: '2026-08-20 10:30 AM',
      doctor: 'Dr. Rahul Sharma',
      department: 'Cardiology',
      status: 'completed',
    },
    {
      id: 'apt-103',
      token_number: 'Token 003',
      receipt_number: 'RCP-2026-0821',
      patient_name: 'Priya Sharma',
      patient_phone: '+91-9876543212',
      appointment_date: '2026-08-20 11:00 AM',
      doctor: 'Dr. Rahul Sharma',
      department: 'Cardiology',
      status: 'cancelled',
    },
    {
      id: 'apt-104',
      token_number: 'Token 004',
      receipt_number: 'RCP-2026-0822',
      patient_name: 'Vikram Singh',
      patient_phone: '+91-9876543213',
      appointment_date: '2026-08-19 03:00 PM',
      doctor: 'Dr. Rahul Sharma',
      department: 'Cardiology',
      status: 'completed',
    },
  ]

  const samplePatients: PatientRecord[] = [
    {
      id: 'pat-001',
      name: 'Rahul Sharma',
      phone: '+91-9876543210',
      age: 42,
      gender: 'M',
      receipt_number: 'RCP-2026-0819',
      token_number: 'Token 001',
      history_appointments: [
        { date: '2026-08-20', type: 'Consultation', status: 'Completed', doctor: 'Dr. Rahul Sharma' },
        { date: '2026-06-15', type: 'Follow-up', status: 'Completed', doctor: 'Dr. Sarah Jenkins' },
      ],
      history_queue: [
        { date: '2026-08-20', token: 'Token 001', entry_time: '09:45 AM', consult_start: '10:05 AM', consult_end: '10:20 AM', status: 'Completed' },
      ],
      history_reports: [
        { id: 'REP-881', title: 'ECG Cardiac Rhythm Analysis', date: '2026-08-20', status: 'Final' },
        { id: 'REP-652', title: 'Lipid Profile Panel', date: '2026-06-15', status: 'Archived' },
      ],
      history_consultations: [
        { date: '2026-08-20', notes: 'Patient reported mild chest tightness. Prescribed Atorvastatin 10mg daily. ECG normal.', doctor: 'Dr. Rahul Sharma' }
      ]
    },
    {
      id: 'pat-002',
      name: 'Amit Khan',
      phone: '+91-9876543211',
      age: 38,
      gender: 'M',
      receipt_number: 'RCP-2026-0820',
      token_number: 'Token 002',
      history_appointments: [
        { date: '2026-08-20', type: 'Routine Checkup', status: 'Completed', doctor: 'Dr. Rahul Sharma' }
      ],
      history_queue: [
        { date: '2026-08-20', token: 'Token 002', entry_time: '10:10 AM', consult_start: '10:25 AM', consult_end: '10:40 AM', status: 'Completed' }
      ],
      history_reports: [
        { id: 'REP-882', title: 'Blood Pressure & HbA1c Panel', date: '2026-08-20', status: 'Final' }
      ],
      history_consultations: [
        { date: '2026-08-20', notes: 'Blood pressure 120/80 mmHg. Lifestyle and dietary recommendations provided.', doctor: 'Dr. Rahul Sharma' }
      ]
    }
  ]

  const reportHistory = [
    {
      id: 'REP-881',
      receipt_number: 'RCP-2026-0819',
      patient_name: 'Rahul Sharma',
      report_date: '2026-08-20',
      doctor: 'Dr. Rahul Sharma',
      report_type: 'ECG Analysis',
      status: 'Final Report'
    },
    {
      id: 'REP-882',
      receipt_number: 'RCP-2026-0820',
      patient_name: 'Amit Khan',
      report_date: '2026-08-20',
      doctor: 'Dr. Rahul Sharma',
      report_type: 'Blood Panel',
      status: 'Final Report'
    },
    {
      id: 'REP-652',
      receipt_number: 'RCP-2026-0615',
      patient_name: 'Rahul Sharma',
      report_date: '2026-06-15',
      doctor: 'Dr. Sarah Jenkins',
      report_type: 'Lipid Profile',
      status: 'Archived'
    }
  ]

  // Filtered Datasets
  const filteredAppointments = appointmentHistory.filter((item) => {
    const matchSearch =
      item.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.token_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || item.status === statusFilter
    return matchSearch && matchStatus
  })

  const filteredPatients = samplePatients.filter((pat) => {
    return (
      pat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pat.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pat.token_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pat.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const filteredReports = reportHistory.filter((rep) => {
    return (
      rep.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.report_type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Clinical History Archive</h1>
            <p className="text-gray-600 text-sm mt-1">
              Multi-tenant search for Appointment, Patient, and Medical Report History
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
            <span>Patient History</span>
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
            <span>Reports History</span>
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={
                activeTab === 'appointments'
                  ? 'Search by Patient Name, Receipt #, Token #, or Date...'
                  : activeTab === 'patients'
                  ? 'Search by Patient Name, Receipt #, Token #, or Patient ID...'
                  : 'Search by Patient Name, Receipt #, Report ID, or Type...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Token & Receipt</th>
                      <th className="px-6 py-3">Patient Name</th>
                      <th className="px-6 py-3">Appointment Date</th>
                      <th className="px-6 py-3">Doctor / Dept</th>
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
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-semibold">{item.doctor}</p>
                          <p className="text-xs text-gray-500">{item.department}</p>
                        </td>
                        <td className="px-6 py-4">
                          {item.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                              <CheckCircle size={14} /> Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-full border border-red-200">
                              <XCircle size={14} /> Cancelled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: PATIENT HISTORY */}
        {activeTab === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient List */}
            <Card className="lg:col-span-1">
              <CardHeader title="Patient Search Results" />
              <CardContent className="p-0">
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
                        <p className="font-bold text-gray-900">{pat.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{pat.receipt_number} • {pat.token_number}</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Patient History 5-Stage Drill-Down */}
            <div className="lg:col-span-2">
              {selectedPatient ? (
                <div className="space-y-6">
                  {/* 1. Patient Profile */}
                  <Card>
                    <CardHeader title="1. Patient Profile" />
                    <CardContent className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Full Name</p>
                          <p className="font-bold text-base text-gray-900">{selectedPatient.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="font-semibold text-gray-800">{selectedPatient.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Age & Gender</p>
                          <p className="font-semibold text-gray-800">{selectedPatient.age} yrs • {selectedPatient.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Token / Receipt Reference</p>
                          <p className="font-semibold text-blue-600">{selectedPatient.token_number} • {selectedPatient.receipt_number}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 2. Previous Appointments */}
                  <Card>
                    <CardHeader title="2. Previous Appointments" />
                    <CardContent className="space-y-3">
                      {selectedPatient.history_appointments.map((apt, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex justify-between items-center">
                          <div>
                            <p className="font-bold text-gray-900">{apt.type}</p>
                            <p className="text-gray-500">{apt.date} • {apt.doctor}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 font-semibold rounded">{apt.status}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* 3. Queue History */}
                  <Card>
                    <CardHeader title="3. Queue History" />
                    <CardContent className="space-y-3">
                      {selectedPatient.history_queue.map((q, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex justify-between items-center">
                          <div>
                            <p className="font-bold text-gray-900">{q.token} • {q.date}</p>
                            <p className="text-gray-500">Wait: Entry {q.entry_time} → Start {q.consult_start} → Finish {q.consult_end}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded">{q.status}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* 4. Medical Reports */}
                  <Card>
                    <CardHeader title="4. Medical Reports" />
                    <CardContent className="space-y-3">
                      {selectedPatient.history_reports.map((rep, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex justify-between items-center">
                          <div>
                            <p className="font-bold text-gray-900">{rep.title}</p>
                            <p className="text-gray-500">Date: {rep.date} • ID: {rep.id}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-semibold rounded">{rep.status}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* 5. Consultation History */}
                  <Card>
                    <CardHeader title="5. Consultation History & Doctor Notes" />
                    <CardContent className="space-y-3">
                      {selectedPatient.history_consultations.map((c, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                          <p className="font-bold text-gray-900">{c.date} • {c.doctor}</p>
                          <p className="text-gray-600 mt-1 italic">"{c.notes}"</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
                  <User size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="font-semibold text-lg">Select a Patient to view complete 5-stage history</p>
                  <p className="text-xs text-gray-400 mt-1">Profile → Appointments → Queue → Reports → Consultation History</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS HISTORY */}
        {activeTab === 'reports' && (
          <Card>
            <CardHeader title={`Reports Archive (${filteredReports.length})`} />
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Report ID & Receipt</th>
                      <th className="px-6 py-3">Patient Name</th>
                      <th className="px-6 py-3">Report Type</th>
                      <th className="px-6 py-3">Report Date</th>
                      <th className="px-6 py-3">Doctor</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-medium">
                    {filteredReports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <span className="font-bold text-blue-600">{rep.id}</span>
                          <p className="text-xs text-gray-400 font-mono">{rep.receipt_number}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">{rep.patient_name}</td>
                        <td className="px-6 py-4 text-gray-700">{rep.report_type}</td>
                        <td className="px-6 py-4 text-gray-600">{rep.report_date}</td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">{rep.doctor}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-semibold text-xs rounded-full border border-purple-100">
                            {rep.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
