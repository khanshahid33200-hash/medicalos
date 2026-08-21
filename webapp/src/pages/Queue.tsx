import { useState } from 'react'
import {
  Play,
  CheckCircle,
  SkipForward,
  RotateCcw,
  Volume2,
  Ticket,
  UserCheck
} from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'

interface QueueItem {
  id: string
  token_number: string
  patient_name: string
  phone: string
  status: 'Waiting' | 'With Doctor' | 'Completed' | 'Skipped'
  check_in_time: string
}

export default function Queue() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([
    {
      id: 'q-001',
      token_number: 'Token 001',
      patient_name: 'Rahul Sharma',
      phone: '+91-9876543210',
      status: 'With Doctor',
      check_in_time: '09:45 AM',
    },
    {
      id: 'q-002',
      token_number: 'Token 002',
      patient_name: 'Amit Khan',
      phone: '+91-9876543211',
      status: 'Waiting',
      check_in_time: '10:05 AM',
    },
    {
      id: 'q-003',
      token_number: 'Token 003',
      patient_name: 'Priya Sharma',
      phone: '+91-9876543212',
      status: 'Waiting',
      check_in_time: '10:15 AM',
    },
    {
      id: 'q-004',
      token_number: 'Token 004',
      patient_name: 'Vikram Singh',
      phone: '+91-9876543213',
      status: 'Waiting',
      check_in_time: '10:25 AM',
    },
    {
      id: 'q-005',
      token_number: 'Token 005',
      patient_name: 'Suresh Patel',
      phone: '+91-9876543216',
      status: 'Skipped',
      check_in_time: '09:30 AM',
    },
  ])

  const [announcedToken, setAnnouncedToken] = useState<string | null>('Token 001')

  const activeDoctorPatient = queueItems.find((q) => q.status === 'With Doctor')
  const waitingPatients = queueItems.filter((q) => q.status === 'Waiting')

  // Action 1: Call Next Patient
  const handleCallNext = () => {
    if (waitingPatients.length === 0) return
    const nextPatient = waitingPatients[0]

    // Set previous 'With Doctor' to Completed or keep
    setQueueItems((prev) =>
      prev.map((item) => {
        if (item.id === nextPatient.id) return { ...item, status: 'With Doctor' }
        if (item.status === 'With Doctor') return { ...item, status: 'Completed' }
        return item
      })
    )
    setAnnouncedToken(nextPatient.token_number)
  }

  // Action 2: Start Consultation
  const handleStartConsultation = (id: string) => {
    setQueueItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'With Doctor' } : item))
    )
  }

  // Action 3: Complete Consultation
  const handleCompleteConsultation = (id: string) => {
    setQueueItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Completed' } : item))
    )
  }

  // Action 4: Skip Patient
  const handleSkip = (id: string) => {
    setQueueItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Skipped' } : item))
    )
  }

  // Action 5: Recall Patient
  const handleRecall = (id: string) => {
    const itemToRecall = queueItems.find((q) => q.id === id)
    if (itemToRecall) {
      setAnnouncedToken(itemToRecall.token_number)
    }
    setQueueItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Waiting' } : item))
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Live Department Queue</h1>
            <p className="text-gray-600 text-sm mt-1">
              Real-time patient queue for Cardiology & OPD
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleCallNext}
              disabled={waitingPatients.length === 0}
              className="shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Volume2 size={20} />
              Call Next Patient
            </Button>
          </div>
        </div>

        {/* Announcer Alert */}
        {announcedToken && (
          <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between border border-blue-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold">
                📢
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-blue-200 tracking-wider">Audio Announcement</p>
                <p className="font-bold text-lg">{announcedToken} — Called to Doctor Consultation Room 1</p>
              </div>
            </div>
            <button
              onClick={() => setAnnouncedToken(null)}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Currently With Doctor Banner */}
        {activeDoctorPatient && (
          <Card className="border-2 border-emerald-500 bg-emerald-50/50">
            <CardHeader className="bg-emerald-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck size={22} />
                  <h2 className="text-xl font-bold">Patient Currently With Doctor</h2>
                </div>
                <span className="text-2xl font-black bg-white/20 px-3 py-1 rounded-xl">
                  {activeDoctorPatient.token_number}
                </span>
              </div>
            </CardHeader>
            <CardContent className="py-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{activeDoctorPatient.patient_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Phone: {activeDoctorPatient.phone} • Check-in: {activeDoctorPatient.check_in_time}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="success" size="md" onClick={() => handleCompleteConsultation(activeDoctorPatient.id)}>
                    <CheckCircle size={16} /> Complete Consultation
                  </Button>
                  <Button variant="secondary" size="md" onClick={() => handleSkip(activeDoctorPatient.id)}>
                    <SkipForward size={16} /> Skip Patient
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Queue Table */}
        <Card>
          <CardHeader title={`Live Queue Table (${queueItems.length} Records)`} />
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                  <tr>
                    <th className="px-6 py-3.5">Token Number</th>
                    <th className="px-6 py-3.5">Patient Name</th>
                    <th className="px-6 py-3.5">Check-In Time</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Doctor Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium">
                  {queueItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl border border-blue-200">
                          <Ticket size={14} /> {item.token_number}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-bold text-base">
                        {item.patient_name}
                        <p className="text-xs text-gray-400 font-normal">{item.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.check_in_time}</td>
                      <td className="px-6 py-4">
                        {item.status === 'With Doctor' && (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300">
                            With Doctor
                          </span>
                        )}
                        {item.status === 'Waiting' && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full border border-amber-300">
                            Waiting
                          </span>
                        )}
                        {item.status === 'Completed' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 font-bold text-xs rounded-full border border-gray-300">
                            Completed
                          </span>
                        )}
                        {item.status === 'Skipped' && (
                          <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold text-xs rounded-full border border-rose-300">
                            Skipped
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'Waiting' && (
                            <>
                              <button
                                onClick={() => handleStartConsultation(item.id)}
                                title="Start Consultation"
                                className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <Play size={12} /> Start
                              </button>
                              <button
                                onClick={() => handleSkip(item.id)}
                                title="Skip Patient"
                                className="px-2.5 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <SkipForward size={12} /> Skip
                              </button>
                            </>
                          )}
                          {item.status === 'With Doctor' && (
                            <button
                              onClick={() => handleCompleteConsultation(item.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <CheckCircle size={12} /> Complete
                            </button>
                          )}
                          {(item.status === 'Skipped' || item.status === 'Completed') && (
                            <button
                              onClick={() => handleRecall(item.id)}
                              title="Recall Patient"
                              className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <RotateCcw size={12} /> Recall
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
