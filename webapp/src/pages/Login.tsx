import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle, ShieldCheck, Stethoscope, Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Login Mode: 'doctor' or 'hospital'
  const [loginMode, setLoginMode] = useState<'doctor' | 'hospital'>('doctor')
  const [formData, setFormData] = useState({
    email: '',
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
      // Store selected mode for dashboard view
      localStorage.setItem('user_role', loginMode === 'hospital' ? 'hospital_admin' : 'doctor')
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(`Invalid ${loginMode === 'hospital' ? 'Hospital Admin' : 'Doctor'} email or password.`)
      } else {
        setError(err.message || 'Authentication failed. Please verify credentials.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Top Header Logo */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-10 object-contain" />
          <span className="text-xl font-black font-recoleta text-slate-900 tracking-tight">
            Clinic OS <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Sign In Portal</span>
          </span>
        </Link>
        <Link to="/" className="text-xs font-bold text-blue-600 hover:text-blue-700">
          ← Back to Clinic OS Home
        </Link>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/80 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black font-recoleta text-slate-900 tracking-tight">Sign In to Platform</h1>
            <p className="text-xs text-slate-500 font-medium">Select your login portal mode to access your workspace</p>
          </div>

          {/* Role Selector: Login as Doctor vs Login as Hospital */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setLoginMode('doctor')}
              className={`py-3 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 ${
                loginMode === 'doctor'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope size={16} /> Login as Doctor
            </button>

            <button
              type="button"
              onClick={() => setLoginMode('hospital')}
              className={`py-3 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 ${
                loginMode === 'hospital'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 size={16} /> Login as Hospital
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 items-start">
              <AlertCircle className="text-rose-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-rose-700 text-xs font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <Mail size={14} className="inline mr-1.5 text-blue-600" />
                {loginMode === 'hospital' ? 'Hospital Admin Email *' : 'Doctor Email Address *'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={loginMode === 'hospital' ? 'admin@citycarehospital.com' : 'doctor@hospital.com'}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <Lock size={14} className="inline mr-1.5 text-blue-600" /> Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none transition"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 disabled:bg-slate-400 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>
                  {loginMode === 'hospital' ? 'Sign In as Hospital Administrator' : 'Sign In as Practising Doctor'}
                </span>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Clinic OS Encrypted Authentication Protocol</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-[11px] text-slate-400 py-2">
        © 2026 Clinic OS Technologies. All rights reserved.
      </div>
    </div>
  )
}
