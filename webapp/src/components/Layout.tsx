import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  History as HistoryIcon,
  LogOut,
  Menu,
  X,
  QrCode,
  Building2,
  User,
  DollarSign
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface LayoutProps {
  children: ReactNode
  userRole?: string
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { doctorProfile, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/queue', label: 'Live Queue', icon: Users },
    { path: '/payments', label: 'Payments & Fees', icon: DollarSign },
    { path: '/qr-kiosk', label: 'QR Kiosk', icon: QrCode },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/history', label: 'History', icon: HistoryIcon },
    { path: '/profile', label: 'Doctor Profile', icon: User },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 selection:bg-blue-600 selection:text-white font-sans text-slate-800">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0 shadow-2xl border-r border-slate-800`}
      >
        <div className="flex flex-col h-full">
          {/* Official White Background Logo Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-white">
            <Link to="/" className="flex items-center gap-2">
              <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-10 object-contain" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-150 ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={19} className={active ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Doctor Profile Footer */}
          <div className="border-t border-slate-800 p-4 bg-slate-950/60">
            <div className="flex items-center justify-between gap-2">
              <Link to="/profile" className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-90 transition">
                <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 font-extrabold text-sm flex-shrink-0">
                  {doctorProfile?.name ? doctorProfile.name.charAt(4) || 'D' : 'D'}
                </div>
                <div className="text-xs min-w-0 flex-1">
                  <p className="font-extrabold text-white truncate">{doctorProfile?.name || 'Dr. Authorized Doctor'}</p>
                  <p className="text-blue-400 text-[11px] truncate font-medium">Edit Profile →</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl transition flex-shrink-0"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Docon Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" />
              <span className="font-extrabold text-slate-900 text-sm">
                {doctorProfile?.hospital_name || 'Metro Care General Hospital'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs px-3 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full border border-blue-100">
                {doctorProfile?.department_name || 'Cardiology'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link to="/profile" className="flex items-center gap-1.5 font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Doctor Profile
            </Link>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
