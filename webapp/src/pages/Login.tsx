import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: 'doctor@hospital.com',
    password: 'password123',
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
      // 1. Authenticate with Firebase Auth
      // 2. Obtain Firebase UID
      // 3. Query Doctor Profile in Supabase (doctors.firebase_uid)
      // 4. Verify Hospital Status & Redirect to Protected Dashboard
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Firebase authentication or doctor verification failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex items-center justify-center p-4">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl mx-auto">
            <span className="text-5xl">🏥</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Clinic OS</h1>
          <p className="text-blue-200 text-lg font-medium">
            Multi-Hospital Doctor Workflow Platform
          </p>
          <div className="mt-8 space-y-3 text-left bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm text-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-400 flex-shrink-0" size={20} />
              <p>Firebase Authentication Identity Layer</p>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-400 flex-shrink-0" size={20} />
              <p>Supabase Multi-Tenant Database Isolation</p>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-400 flex-shrink-0" size={20} />
              <p>Live Queue & Multi-Hospital Patient Records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Doctor Login Form */}
      <div className="w-full lg:w-1/2 max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Doctor Sign In</h2>
            <p className="text-sm text-gray-500 mt-1">Authenticate via Firebase & Supabase Portal</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2 text-blue-600" />
                Doctor Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@hospital.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Lock size={16} className="inline mr-2 text-blue-600" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 font-medium">Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition duration-150 shadow-lg shadow-blue-500/30 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Doctor Credentials...</span>
                </>
              ) : (
                <span>Sign In as Doctor</span>
              )}
            </button>
          </form>

          {/* Preset Demo Logins */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wider mb-3">
              Quick Doctor Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFormData({ email: 'doctor@hospital.com', password: 'password123' })}
                className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-left font-medium transition"
              >

                🏥 Dr. Rahul (Doctor)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: 'admin@hospital.com', password: 'password123' })}
                className="p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-left font-medium transition"
              >
                ⭐ Dr. Sarah (Admin)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
