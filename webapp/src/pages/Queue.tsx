import { useState, useEffect } from 'react'
import { Users, Clock, CheckCircle, Phone, X, AlertCircle } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'

interface QueueEntry {
  id: string
  queue_number: string
  patient_name: string
  phone: string // masked for privacy
  severity: 'mild' | 'moderate' | 'severe'
  check_in_time: string
  status: 'waiting' | 'in_progress' | 'completed'
  estimated_wait_minutes: number
}

export default function Queue() {
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([])
  const [currentlyServing, setCurrentlyServing] = useState<QueueEntry | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Mock data - in production this would come from the API via WebSocket
  useEffect(() => {
    const mockQueue: QueueEntry[] = [
      {
        id: '1',
        queue_number: '12',
        patient_name: 'Patient 12',
        phone: '****5432',
        severity: 'moderate',
        check_in_time: new Date(Date.now() - 15 * 60000).toISOString(),
        status: 'in_progress',
        estimated_wait_minutes: 0,
      },
      {
        id: '2',
        queue_number: '13',
        patient_name: 'Patient 13',
        phone: '****9876',
        severity: 'mild',
        check_in_time: new Date(Date.now() - 8 * 60000).toISOString(),
        status: 'waiting',
        estimated_wait_minutes: 5,
      },
      {
        id: '3',
        queue_number: '14',
        patient_name: 'Patient 14',
        phone: '****5678',
        severity: 'moderate',
        check_in_time: new Date(Date.now() - 3 * 60000).toISOString(),
        status: 'waiting',
        estimated_wait_minutes: 12,
      },
      {
        id: '4',
        queue_number: '15',
        patient_name: 'Patient 15',
        phone: '****1234',
        severity: 'severe',
        check_in_time: new Date().toISOString(),
        status: 'waiting',
        estimated_wait_minutes: 18,
      },
    ]

    setCurrentlyServing(mockQueue[0])
    setQueueEntries(mockQueue.slice(1))
  }, [])

  // Auto-refresh queue every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // In production, this would fetch from the API
      setQueueEntries((prev) =>
        prev.map((entry) => ({
          ...entry,
          estimated_wait_minutes: Math.max(0, entry.estimated_wait_minutes - 1),
        }))
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleCallNext = () => {
    if (queueEntries.length === 0) return

    const next = queueEntries[0]
    setCurrentlyServing(next)
    setQueueEntries((prev) => prev.slice(1))

    // In production, send notification to patient
    console.log(`Calling patient ${next.queue_number}`)
  }

  const handleComplete = () => {
    if (!currentlyServing) return

    // In production, this would update the appointment status
    console.log(`Completed consultation with patient ${currentlyServing.queue_number}`)
    handleCallNext()
  }

  const handleNoShow = () => {
    if (!currentlyServing) return

    // In production, this would mark as no-show
    console.log(`Patient ${currentlyServing.queue_number} marked as no-show`)
    handleCallNext()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'severe':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getWaitTimeColor = (minutes: number) => {
    if (minutes <= 5) return 'text-green-600'
    if (minutes <= 15) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Layout userRole="doctor">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Queue</h1>
            <p className="text-gray-600 mt-2">Manage today's patient queue and consultations</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-300">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Auto-refresh (30s)</span>
          </label>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-primary-600">
                {currentlyServing ? 1 : 0}
              </div>
              <p className="text-sm text-gray-600 mt-2">Currently Serving</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-yellow-600">{queueEntries.length}</div>
              <p className="text-sm text-gray-600 mt-2">Waiting in Queue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-green-600">
                {queueEntries.length > 0 ? queueEntries[0].estimated_wait_minutes : 0}
              </div>
              <p className="text-sm text-gray-600 mt-2">Next Wait Time (min)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-blue-600">
                {currentlyServing ? queueEntries.length + 1 : queueEntries.length}
              </div>
              <p className="text-sm text-gray-600 mt-2">Total in Queue</p>
            </CardContent>
          </Card>
        </div>

        {/* Currently Serving */}
        {currentlyServing ? (
          <Card className="border-2 border-green-300 bg-green-50">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle size={24} />
                  <h2 className="text-2xl font-bold">Currently Serving</h2>
                </div>
                <span className="text-4xl font-bold">{currentlyServing.queue_number}</span>
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Patient</p>
                  <p className="text-lg font-semibold text-gray-900">{currentlyServing.patient_name}</p>
                  <p className="text-sm text-gray-600 mt-2">Phone: {currentlyServing.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Check-in Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(currentlyServing.check_in_time).toLocaleTimeString()}
                  </p>
                  <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(currentlyServing.severity)}`}>
                    {currentlyServing.severity.charAt(0).toUpperCase() + currentlyServing.severity.slice(1)} Priority
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="success" size="lg" onClick={handleComplete} className="flex-1">
                  <CheckCircle size={20} />
                  Mark Consultation Complete
                </Button>
                <Button variant="danger" size="lg" onClick={handleNoShow} className="flex-1">
                  <AlertCircle size={20} />
                  Mark as No-Show
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-yellow-300 bg-yellow-50">
            <CardContent className="text-center py-8">
              <Clock className="mx-auto text-yellow-600 mb-3" size={40} />
              <p className="text-lg font-semibold text-yellow-900">No patients currently being served</p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleCallNext}
                disabled={queueEntries.length === 0}
                className="mt-4"
              >
                Call Next Patient
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Queue List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              <Users size={20} className="inline mr-2" />
              Waiting Queue
            </h3>
            {queueEntries.length > 0 && (
              <Button variant="primary" onClick={handleCallNext}>
                Call Next Patient
              </Button>
            )}
          </div>

          {queueEntries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="mx-auto text-gray-400 mb-3" size={40} />
                <p className="text-gray-600">No patients waiting</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {queueEntries.map((entry, index) => (
                <Card key={entry.id} className="hover">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 font-bold text-lg">
                          {entry.queue_number}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            Position {index + 1} • {entry.patient_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Checked in {formatTime(new Date(entry.check_in_time))}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(entry.severity)}`}>
                          {entry.severity.charAt(0).toUpperCase() + entry.severity.slice(1)}
                        </div>
                        <div className={`text-center ${getWaitTimeColor(entry.estimated_wait_minutes)}`}>
                          <Clock size={20} className="inline mb-1" />
                          <p className="font-semibold">{entry.estimated_wait_minutes} min</p>
                          <p className="text-xs text-gray-600">est. wait</p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <Card className="bg-gray-50">
          <CardContent className="py-4">
            <p className="font-semibold text-gray-900 mb-3">Severity Levels</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-700">Mild - General issues</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-700">Moderate - Needs attention</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-700">Severe - Priority care</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  return date.toLocaleTimeString()
}
