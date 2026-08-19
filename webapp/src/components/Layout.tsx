import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
  userRole?: 'admin' | 'doctor' | 'staff' | 'patient'
}

export default function Layout({ children, userRole = 'doctor' }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const getNavItems = () => {
    const common = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/appointments', label: 'Appointments', icon: Calendar },
    ]

    if (userRole === 'admin') {
      return [
        ...common,
        { path: '/staff', label: 'Staff Management', icon: Users },
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }

    if (userRole === 'doctor') {
      return [
        ...common,
        { path: '/queue', label: 'Queue', icon: Users },
        { path: '/reports', label: 'Reports', icon: FileText },
      ]
    }

    if (userRole === 'patient') {
      return [
        { path: '/check-in', label: 'Check-in', icon: Users },
        { path: '/my-appointments', label: 'My Appointments', icon: Calendar },
        { path: '/queue-tracker', label: 'Queue Tracker', icon: LayoutDashboard },
      ]
    }

    return common
  }

  const navItems = getNavItems()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded text-white flex items-center justify-center font-bold">
                CO
              </div>
              <h1 className="font-bold text-lg">Clinic OS</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-600">D</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Dr. Smith</p>
                  <p className="text-gray-500">{userRole}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <LogOut size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1 hover:bg-gray-100 rounded"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Clinic OS</h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
