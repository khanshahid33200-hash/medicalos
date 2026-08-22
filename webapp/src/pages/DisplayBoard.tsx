import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Volume2 } from 'lucide-react'

export default function DisplayBoard() {
  const { token } = useParams()

  const [departments, setDepartments] = useState([
    {
      dept_name: 'ORTHOPAEDICS',
      dept_code: 'ORT',
      doctor_name: 'Dr. Ashok Verma',
      room: 'Room 4',
      now_serving: 'ORT-04',
      next_number: 'ORT-05',
      waiting_count: 3
    },
    {
      dept_name: 'GENERAL OPD',
      dept_code: 'GEN',
      doctor_name: 'Dr. Sunita Rao',
      room: 'Room 1',
      now_serving: 'GEN-18',
      next_number: 'GEN-19',
      waiting_count: 11
    },
    {
      dept_name: 'PAEDIATRICS',
      dept_code: 'PED',
      doctor_name: 'Dr. Imran Qureshi',
      room: 'Room 7',
      now_serving: 'PED-18',
      next_number: 'Fully Booked',
      waiting_count: 0
    },
    {
      dept_name: 'ENT',
      dept_code: 'ENT',
      doctor_name: 'Dr. Rajiv Menon',
      room: 'Room 3',
      now_serving: 'ENT-08',
      next_number: 'ENT-09',
      waiting_count: 2
    }
  ])

  useEffect(() => {
    // 2-second live simulation update
    const interval = setInterval(() => {
      setDepartments((prev) => [...prev])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top TV Header Bar */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-10 object-contain bg-white px-3 py-1 rounded-xl" />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white font-recoleta">CITY CARE HOSPITAL</h1>
            <p className="text-xs text-blue-400 font-mono">OPD Waiting Room Display Board ({token || 'Main Entrance'})</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Live Realtime Feed
          </span>
          <span className="flex items-center gap-1.5 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
            <Volume2 size={16} /> Audio Announcer Active
          </span>
        </div>
      </header>

      {/* Main Grid: 1 Tile Per Active Doctor (Specification 3.10) */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-auto py-6">
        {departments.map((dept) => (
          <div
            key={dept.dept_code}
            className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl flex flex-col justify-between"
          >
            <div className="border-b border-slate-800 pb-4 space-y-1">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-mono text-xs font-extrabold rounded-lg border border-blue-500/30">
                {dept.dept_name}
              </span>
              <h2 className="text-xl font-black text-white font-recoleta mt-2">{dept.doctor_name}</h2>
              <p className="text-xs font-bold text-slate-400">{dept.room}</p>
            </div>

            {/* Now Serving (Enormous font as specified in 4.5) */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-blue-500/30 text-center space-y-1">
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">NOW SERVING</p>
              <p className="text-5xl font-black text-emerald-400 font-mono tracking-tight">{dept.now_serving}</p>
            </div>

            {/* Next Number */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">NEXT PATIENT</p>
              <p className="text-2xl font-black text-blue-400 font-mono">{dept.next_number}</p>
              <p className="text-[10px] text-slate-500 font-medium">{dept.waiting_count} in corridor queue</p>
            </div>
          </div>
        ))}
      </main>

      {/* Footer ticker */}
      <footer className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
        <p>💡 Please approach your doctor's consultation room when your token is called.</p>
        <p>Press F11 for Fullscreen Mode • Clinic OS v3.3</p>
      </footer>
    </div>
  )
}
