import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex items-center justify-center p-4">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl mx-auto">
            <span className="text-5xl">🏥</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Clinic OS</h1>
          <p className="text-blue-200 text-lg font-medium">
            Multi-Hospital Doctor Portal & Workspace
          </p>
          <div className="mt-8 space-y-3 text-left bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm text-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-400 flex-shrink-0" size={20} />
              <p>Strict Firebase Authentication Identity Layer</p>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-400 flex-shrink-0" size={20} />
              <p>Supabase Multi-Tenant Doctor Isolation</p>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-blue-400 flex-shrink-0" size={20} />
              <p>Isolated Doctor Queue & Patient History</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Strict Doctor Login Form */}
      <div className="w-full lg:w-1/2 max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Doctor Sign In</h2>
            <p className="text-sm text-gray-500 mt-1">Authenticate via Firebase Doctor Account</p>
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

            {/* Remember Me */}
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
                  <span>Verifying Firebase Doctor Auth...</span>
                </>
              ) : (
                <span>Sign In via Firebase Auth</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
