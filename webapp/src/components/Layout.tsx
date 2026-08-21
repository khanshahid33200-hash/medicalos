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
  Building2
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
    { path: '/qr-kiosk', label: 'QR Kiosk', icon: QrCode },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/history', label: 'History', icon: HistoryIcon },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0 shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Hospital Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                CO
              </div>
              <div>
                <h1 className="font-bold text-base tracking-wide text-white">Clinic OS</h1>
                <p className="text-xs text-blue-400 font-medium truncate max-w-[140px]">
                  {doctorProfile?.hospital_name || 'General Hospital'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-slate-800 rounded text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={19} className={active ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Doctor Profile Footer */}
          <div className="border-t border-slate-800 p-4 bg-slate-950/50">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">
                  {doctorProfile?.name ? doctorProfile.name.charAt(4) || 'D' : 'D'}
                </div>
                <div className="text-xs min-w-0 flex-1">
                  <p className="font-semibold text-white truncate">{doctorProfile?.name || 'Dr. Authorized Doctor'}</p>
                  <p className="text-slate-400 truncate">{doctorProfile?.department_name || 'Cardiology'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition flex-shrink-0"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" />
              <span className="font-semibold text-gray-800 text-sm">
                {doctorProfile?.hospital_name || 'Metro Care General Hospital'}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs px-2.5 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-full border border-blue-100">
                {doctorProfile?.department_name || 'Cardiology'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Doctor Verified
            </span>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
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
