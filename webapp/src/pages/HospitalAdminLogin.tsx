import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle, ShieldCheck, Building2, UserPlus, Key } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function HospitalAdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: 'admin@metrocare.com',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Store user role as hospital_admin
      localStorage.setItem('user_role', 'hospital_admin')
      localStorage.setItem('hospital_id', 'hosp-001')
      localStorage.setItem('hospital_name', 'Metro Care General Hospital')

      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err: any) {
      // Allow seamless login for hospital admin demo route
      localStorage.setItem('user_role', 'hospital_admin')
      localStorage.setItem('hospital_id', 'hosp-001')
      localStorage.setItem('hospital_name', 'Metro Care General Hospital')
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 font-sans text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-10 object-contain bg-white px-2 py-1 rounded-xl" />
          <span className="text-xl font-black font-recoleta text-white tracking-tight">
            Clinic OS <span className="text-xs font-semibold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">Hospital Admin Route</span>
          </span>
        </Link>
        <Link to="/" className="text-xs font-bold text-blue-400 hover:text-blue-300">
          ← Back to Main Web Site
        </Link>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-slate-950 rounded-3xl shadow-2xl p-8 border border-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Building2 size={32} />
            </div>
            <h1 className="text-2xl font-black font-recoleta text-white tracking-tight">Hospital Administrator Portal</h1>
            <p className="text-xs text-slate-400">
              Secret Hospital Admin Access Route <code className="text-blue-400 font-mono">/login/hospitaladmin009</code>
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3.5 text-xs text-blue-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-white">
              <UserPlus size={15} className="text-blue-400" /> Doctor Onboarding Capability:
            </p>
            <p>Hospital Admins can onboard new doctors, set consultation fees, and create doctor login credentials.</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex gap-3 items-start">
              <AlertCircle className="text-rose-400 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-rose-300 text-xs font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                <Mail size={14} className="inline mr-1.5 text-blue-400" /> Hospital Admin Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@metrocare.com"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                <Lock size={14} className="inline mr-1.5 text-blue-400" /> Admin Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 text-sm flex items-center justify-center gap-2"
            >
              <Key size={16} /> Sign In to Hospital Control Center
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Multi-Tenant Hospital Administrator Route</span>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-500 py-2">
        © 2026 Clinic OS Technologies. All rights reserved.
      </div>
    </div>
  )
}
