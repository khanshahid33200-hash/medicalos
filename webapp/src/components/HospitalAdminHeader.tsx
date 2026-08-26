import { useNavigate, useLocation } from 'react-router-dom'
import { UserPlus, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  onOpenOnboardModal?: () => void
}

export default function HospitalAdminHeader({ onOpenOnboardModal }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { doctorProfile, logout } = useAuth()

  const hospitalName = doctorProfile?.hospital_name || localStorage.getItem('hospital_name') || 'Hospital Facility'
  const adminEmail = doctorProfile?.email || 'admin@hospital.com'

  const currentPath = location.pathname.toLowerCase()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-white rounded-3xl p-4 sm:px-6 shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Brand & Hospital Info */}
      <div className="flex items-center gap-3 text-left">
        <img src="/assets/logo.png" alt="MedTech Fixaters Logo" className="h-9 object-contain" />
        <div className="flex flex-col">
          <span className="font-black text-lg text-slate-900 tracking-tight leading-none">{hospitalName}</span>
          <span className="text-[10px] font-bold text-emerald-700 tracking-widest uppercase mt-0.5">Admin: {adminEmail}</span>
        </div>
      </div>

      {/* Navigation Tabs (Distinct Page Routes) */}
      <div className="bg-slate-100/80 p-1.5 rounded-full flex items-center gap-1 border border-slate-200/50 self-center overflow-x-auto max-w-full">
        <button
          onClick={() => navigate('/hospitaladmin/overview')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentPath.includes('/overview') || currentPath === '/hospitaladmin-dashboard'
              ? 'bg-[#00875A] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Overview Page
        </button>
        <button
          onClick={() => navigate('/hospitaladmin/queues')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentPath.includes('/queues')
              ? 'bg-[#00875A] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Live Queues Page
        </button>
        <button
          onClick={() => navigate('/hospitaladmin/doctors')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentPath.includes('/doctors')
              ? 'bg-[#00875A] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Doctors & Revenue Page
        </button>
        <button
          onClick={() => navigate('/hospitaladmin/messages')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentPath.includes('/messages')
              ? 'bg-[#00875A] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          In-built Chat Page
        </button>
        <button
          onClick={() => navigate('/hospitaladmin/qr')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
            currentPath.includes('/qr')
              ? 'bg-[#00875A] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          QR Kiosk Page
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {onOpenOnboardModal && (
          <button
            onClick={onOpenOnboardModal}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-full shadow-sm flex items-center gap-1.5"
          >
            <UserPlus size={15} /> + Onboard Doctor
          </button>
        )}
        <button
          onClick={handleLogout}
          className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full transition"
          title="Log Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
