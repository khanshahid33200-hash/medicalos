import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Clock, Search } from 'lucide-react'
import { Card } from '../components/Card'

export default function TrackPage() {
  const [searchParams] = useSearchParams()

  const [tokenInput, setTokenInput] = useState(searchParams.get('token') || '2026082230')
  const [phoneInput, setPhoneInput] = useState(searchParams.get('phone') || '9876543210')
  const [activeTracking, setActiveTracking] = useState<any>({
    token_number: '2026082230',
    queue_code: 'ORT-07',
    doctor_name: 'Dr. Ashok Verma',
    department: 'Orthopaedics',
    room: 'Room 4',
    now_serving: 'ORT-04',
    patients_ahead: 3,
    estimated_wait: 26,
    hospital: 'City Care Hospital'
  })

  const handleSearchTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenInput || !phoneInput) return

    setActiveTracking({
      token_number: tokenInput,
      queue_code: 'ORT-07',
      doctor_name: 'Dr. Ashok Verma',
      department: 'Orthopaedics',
      room: 'Room 4',
      now_serving: 'ORT-04',
      patients_ahead: 3,
      estimated_wait: 26,
      hospital: 'City Care Hospital'
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      <header className="max-w-xl mx-auto text-center space-y-2 mb-6">
        <Link to="/">
          <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-10 mx-auto object-contain" />
        </Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-recoleta">Live Queue Position Tracker</h1>
        <p className="text-xs text-slate-500 font-medium">Track your place in line live without waiting in crowded OPD corridors</p>
      </header>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearchTrack} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-md space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Visit Token Number *</label>
              <input
                type="text"
                required
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. 2026082230"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Mobile Phone *</label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center gap-1.5"
          >
            <Search size={14} /> Track Queue Position
          </button>
        </form>

        {/* Active Queue Status Display (Specification 3.5) */}
        {activeTracking && (
          <Card className="rounded-3xl border-2 border-blue-600 bg-white shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{activeTracking.hospital}</p>
                <h2 className="text-xl font-black text-slate-900 font-recoleta">{activeTracking.doctor_name}</h2>
                <p className="text-xs text-blue-600 font-bold">{activeTracking.department} • {activeTracking.room}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200">
                ● Live OPD Queue
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Your Queue Code</p>
                <p className="text-4xl font-black text-blue-600 font-mono mt-1">{activeTracking.queue_code}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Now Serving</p>
                <p className="text-4xl font-black text-emerald-600 font-mono mt-1">{activeTracking.now_serving}</p>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-2xl text-center space-y-2">
              <div className="flex items-center justify-center gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patients Ahead of You</p>
                  <p className="text-3xl font-black text-slate-900">{activeTracking.patients_ahead} Patients</p>
                </div>
                <div className="h-10 w-px bg-blue-200" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Wait Time</p>
                  <p className="text-3xl font-black text-blue-600 flex items-center justify-center gap-1">
                    <Clock size={20} /> ~{activeTracking.estimated_wait} mins
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 font-medium">
              💡 You will receive an SMS / WhatsApp alert when 2 patients remain ahead.
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
