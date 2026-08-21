import { useState, useEffect } from 'react'
import { FileText, Calendar, TrendingUp, Users, Building2, Download } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { getQueueForDoctor } from '../utils/doctorStore'

export default function Reports() {
  const { doctorProfile } = useAuth()
  const doctorId = doctorProfile?.doctor_id || 'doc-001'
  const doctorName = doctorProfile?.name || 'Dr. Authorized Doctor'
  const departmentName = doctorProfile?.department_name || 'Cardiology'

  const [queueList, setQueueList] = useState<any[]>([])

  useEffect(() => {
    if (doctorId) {
      setQueueList(getQueueForDoctor(doctorId))
    }
  }, [doctorId])

  const completedCount = queueList.filter((q) => q.status === 'Completed').length
  const waitingCount = queueList.filter((q) => q.status === 'Waiting').length
  const totalCheckins = queueList.length

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileText className="text-blue-600" size={30} /> Clinical Reports for {doctorName}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Department of {departmentName} • Dynamic Scanned Patient Analytics
            </p>
          </div>
          <Button variant="primary" size="lg" className="shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Download size={18} /> Download Clinical Summary
          </Button>
        </div>

        {/* Dynamic Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Total Patient Check-ins</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{totalCheckins}</p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">Scanned via Doctor QR Code</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Users size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Completed Consultations</p>
                  <p className="text-3xl font-black text-emerald-600 mt-2">{completedCount}</p>
                  <p className="text-xs text-emerald-700 mt-1 font-medium">Consulted by {doctorName}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <TrendingUp size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Currently Waiting Patients</p>
                  <p className="text-3xl font-black text-amber-600 mt-2">{waitingCount}</p>
                  <p className="text-xs text-amber-700 mt-1 font-medium">In waiting room</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Calendar size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Patient Records Table */}
        <Card className="border border-gray-200">
          <CardHeader title={`Scanned Patient Check-in Archive (${queueList.length} Records)`} />
          <CardContent className="p-0">
            {queueList.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto border border-blue-100">
                  <Building2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No Patient Reports Yet</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  When patients check in via <strong>{doctorName}</strong>'s QR code, their symptom reports will be generated here automatically.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                      <th className="px-6 py-3.5">Token Number</th>
                      <th className="px-6 py-3.5">Patient Name & Phone</th>
                      <th className="px-6 py-3.5">Reported Symptoms</th>
                      <th className="px-6 py-3.5">Severity</th>
                      <th className="px-6 py-3.5">Check-in Time</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-medium">
                    {queueList.map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-blue-700">{q.token_number}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {q.patient_name}
                          <p className="text-xs text-gray-400 font-normal">{q.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-700">{q.symptoms || 'Routine Checkup'}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                            {q.severity || 'Moderate'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{q.check_in_time}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
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
      </div>
    </Layout>
  )
}
