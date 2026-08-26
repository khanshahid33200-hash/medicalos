import { useState } from 'react'
import { Stethoscope, CheckCircle2 } from 'lucide-react'
import HospitalAdminHeader from '../../components/HospitalAdminHeader'
import { useSEO } from '../../hooks/useSEO'

interface DoctorItem {
  id: string
  name: string
  email: string
  dept: string
  specialization: string
  fee: number
  limit: number
  status: 'active' | 'inactive'
}

export default function HospitalAdminQueuesPage() {
  useSEO({
    title: 'Live OPD Queues Page - Hospital Admin Dashboard',
    description: 'Monitor real-time waiting room queues across all hospital doctors.',
  })

  const [hospitalDoctors] = useState<DoctorItem[]>(() => {
    try {
      const saved = localStorage.getItem('clinicos_hospital_doctors')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  })

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 font-sans p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <HospitalAdminHeader />

        {/* Live OPD Queues Page Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Live OPD Queue Tracker Page</h1>
              <p className="text-xs text-slate-500 font-medium">Real-time doctor waiting room monitors across facility</p>
            </div>
            <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 flex items-center gap-1.5 w-fit">
              <CheckCircle2 size={15} /> Real-Time Monitor Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitalDoctors.map((doc) => (
              <div key={doc.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shadow-xs">
                      <Stethoscope size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{doc.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{doc.dept} • {doc.specialization}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase">
                    Active In-Room
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono pt-2">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-slate-400 text-[10px] uppercase font-sans font-bold">Currently Consulting</p>
                    <p className="text-base font-black text-emerald-700 mt-1">Patient #104</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-slate-400 text-[10px] uppercase font-sans font-bold">Waiting Room</p>
                    <p className="text-base font-black text-amber-600 mt-1">8 Waiting</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-slate-400 text-[10px] uppercase font-sans font-bold">Completed Today</p>
                    <p className="text-base font-black text-slate-900 mt-1">18 Patients</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
