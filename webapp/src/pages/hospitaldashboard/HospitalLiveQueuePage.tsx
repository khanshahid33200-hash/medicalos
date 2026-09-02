import React, { useState, useEffect } from 'react'
import {
  Layers,
  Shield,
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  RefreshCw,
  PhoneCall,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import HospitalDashboardLayout from '../../components/hospitaldashboard/HospitalDashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface QueueItem {
  id: string
  department: string
  doctor: string
  room: string
  currentToken: string
  currentPatient: string
  nextPatient: string
  waitingCount: number
  avgWaitMins: number
  status: 'active' | 'break' | 'completed'
  queueList: { token: string; patient: string; waitTime: string; status: 'serving' | 'next' | 'waiting' }[]
}

export default function HospitalLiveQueuePage() {
  const { doctorProfile } = useAuth()
  const currentHospId = doctorProfile?.hospital_id || localStorage.getItem('hospital_id') || ''

  const [refreshing, setRefreshing] = useState(false)
  const [selectedQueue, setSelectedQueue] = useState<QueueItem | null>(null)
  const [queues, setQueues] = useState<QueueItem[]>([])

  useEffect(() => {
    async function loadQueues() {
      if (!currentHospId) return
      try {
        // Query doctors for this hospital
        const { data: docs } = await supabase
          .from('profiles')
          .select('id, full_name, department')
          .eq('hospital_id', currentHospId)
          .eq('role', 'doctor')
          .eq('is_active', true)

        if (!docs || docs.length === 0) {
          setQueues([])
          return
        }

        // Query waiting appointments for this hospital
        const { data: appts } = await supabase
          .from('appointments')
          .select('id, doctor_id, token_number, status, patient:patients(name)')
          .eq('hospital_id', currentHospId)
          .in('status', ['pending', 'waiting'])
          .order('token_number', { ascending: true })

        const waitingList = appts || []
        if (waitingList.length === 0) {
          // Zero active queues as per Rule 7
          setQueues([])
          return
        }

        // Group appointments by doctor
        const activeDocQueues: QueueItem[] = []
        docs.forEach((d, i) => {
          const docAppts = waitingList.filter(a => a.doctor_id === d.id)
          if (docAppts.length > 0) {
            const current = docAppts[0]
            const next = docAppts[1]
            activeDocQueues.push({
              id: `q-${d.id}`,
              department: d.department || 'General OPD',
              doctor: d.full_name,
              room: `OPD Room ${101 + i}`,
              currentToken: `T-${String(current.token_number || 1).padStart(3, '0')}`,
              currentPatient: (current as any).patient?.name || 'Patient',
              nextPatient: next ? `${(next as any).patient?.name || 'Patient'} (T-${String(next.token_number).padStart(3, '0')})` : 'None',
              waitingCount: docAppts.length,
              avgWaitMins: docAppts.length * 10,
              status: 'active',
              queueList: docAppts.map((a: any, idx: number) => ({
                token: `T-${String(a.token_number).padStart(3, '0')}`,
                patient: a.patient?.name || 'Patient',
                waitTime: `${idx * 10} min`,
                status: idx === 0 ? 'serving' : idx === 1 ? 'next' : 'waiting'
              }))
            })
          }
        })
        setQueues(activeDocQueues)
      } catch (e) {
        setQueues([])
      }
    }
    loadQueues()
  }, [currentHospId])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 600)
  }

  return (
    <HospitalDashboardLayout pageTitle="Live Queue">
      <div className="space-y-6">
        {/* Top Header Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Real-Time Hospital Token Engine</h3>
              <p className="text-xs text-slate-400">Synchronized live across consultation rooms & reception monitors</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-blue-600' : ''} />
            <span>Refresh Queues</span>
          </button>
        </div>

        {/* Queues Grid */}
        {queues.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Layers size={24} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Active Live Queues</h4>
            <p className="text-xs text-slate-500">There are currently no active patient queues running for this hospital.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {queues.map((q) => (
              <div
                key={q.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Department Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Shield size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{q.department}</h4>
                        <p className="text-xs text-slate-400">{q.doctor} • {q.room}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                      Live Active
                    </span>
                  </div>

                  {/* Token Counter Spotlight */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Now Serving Token</span>
                      <span className="text-3xl font-black text-slate-900 tracking-tight">{q.currentToken}</span>
                      <span className="text-xs text-slate-600 font-semibold block mt-0.5">{q.currentPatient}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Wait Time</span>
                      <span className="text-lg font-bold text-blue-600">{q.avgWaitMins} mins</span>
                      <span className="text-xs text-slate-400 block">{q.waitingCount} in line</span>
                    </div>
                  </div>

                  {/* Next In Line */}
                  <div className="flex items-center justify-between text-xs text-slate-600 py-1.5 px-2 bg-slate-100/60 rounded-xl">
                    <span>Next Patient:</span>
                    <span className="font-bold text-slate-900">{q.nextPatient}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Total in queue: {q.queueList.length}</span>
                  <button
                    onClick={() => setSelectedQueue(q)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>View Live Lineup</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Queue Lineup Modal */}
      {selectedQueue && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedQueue.department} Queue</h3>
                <p className="text-slate-400">{selectedQueue.doctor} • {selectedQueue.room}</p>
              </div>
              <button onClick={() => setSelectedQueue(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-2.5 my-4">
              {selectedQueue.queueList.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    item.status === 'serving'
                      ? 'bg-emerald-50/80 border-emerald-200'
                      : item.status === 'next'
                      ? 'bg-blue-50/80 border-blue-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-extrabold text-slate-900 shadow-sm">
                      {item.token}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{item.patient}</p>
                      <p className="text-[10px] text-slate-400">Wait: {item.waitTime}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'serving'
                        ? 'bg-emerald-600 text-white'
                        : item.status === 'next'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedQueue(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </HospitalDashboardLayout>
  )
}
