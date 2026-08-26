import { Printer, Download } from 'lucide-react'
import HospitalAdminHeader from '../../components/HospitalAdminHeader'
import { useAuth } from '../../context/AuthContext'
import { useSEO } from '../../hooks/useSEO'

export default function HospitalAdminQRPage() {
  useSEO({
    title: 'QR Kiosk Page - Hospital Admin Dashboard',
    description: 'Print and download OPD reception QR kiosk posters.',
  })

  const { doctorProfile } = useAuth()
  const hospitalName = doctorProfile?.hospital_name || localStorage.getItem('hospital_name') || 'Hospital Facility'

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 font-sans p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <HospitalAdminHeader />

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6 text-left">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Reception QR Kiosk Page</h1>
              <p className="text-xs text-slate-500 font-medium">Generate, print signage, and download PNG for OPD check-in</p>
            </div>
            <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
              Token: tok_hosp-001
            </span>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center space-y-6 shadow-xs">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent('https://medtechfixaters.com/a/tok_hosp-001')}`}
                alt="Hospital OPD QR Code"
                className="w-48 h-48 object-contain mx-auto"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">{hospitalName} OPD Kiosk Signage</h3>
              <p className="text-xs text-slate-500 font-medium">Scan QR to issue digital queue token on patient mobile</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="py-3 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Printer size={16} /> Print Poster
              </button>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent('https://medtechfixaters.com/a/tok_hosp-001')}`}
                download="hospital-opd-qr.png"
                target="_blank"
                rel="noreferrer"
                className="py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download PNG
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
