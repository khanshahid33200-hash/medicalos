import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle, ShieldCheck, Smile } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
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
      // Strict Firebase Authentication Sign-in (No demo fallback)
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid doctor email or password. Please verify your Firebase Authentication credentials.')
      } else {
        setError(err.message || 'Firebase authentication or doctor verification failed.')
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
          <div className="w-9 h-9 bg-blue-600 rounded-full text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
            <Smile size={22} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            docon <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Doctor Portal</span>
          </span>
        </Link>
        <Link to="/" className="text-xs font-bold text-blue-600 hover:text-blue-700">
          ← Back to Docon Product Page
        </Link>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/80">
          <div className="text-center mb-8 space-y-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold border border-blue-100 shadow-sm">
              <Smile size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doctor & Staff Sign In</h1>
            <p className="text-xs text-slate-500 font-medium">Access your Docon EMR Workspace & Live Patient Queue</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 flex gap-3 items-start">
              <AlertCircle className="text-rose-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-rose-700 text-xs font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <Mail size={14} className="inline mr-1.5 text-blue-600" /> Doctor Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@clinic.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
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
                  <span>Verifying Docon Credentials...</span>
                </>
              ) : (
                <span>Sign In to Docon Workspace</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Docon 128-bit Encrypted Doctor Authentication</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-[11px] text-slate-400 py-2">
        © 2026 Docon Technologies. All rights reserved.
      </div>
    </div>
  )
}
