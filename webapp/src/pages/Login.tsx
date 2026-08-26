import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertCircle, Stethoscope, Key, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../hooks/useSEO'

export default function Login() {
  useSEO({
    title: 'Doctor Portal Login - MedTech Fixaters',
    description: 'Sign in to your doctor clinical dashboard to manage OPD patient queues and generate 30-second EMR prescriptions.',
  })

  const navigate = useNavigate()
  const { loginWithSupabase } = useAuth()

  const [selectedRole, setSelectedRole] = useState<'doctor' | 'hospital_admin'>('doctor')
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

    if (selectedRole === 'hospital_admin') {
      setIsLoading(false)
      navigate('/hospitaladminmedtech')
      return
    }

    const cleanEmail = formData.email.trim().toLowerCase()
    const cleanPass = formData.password.trim()

    try {
      await loginWithSupabase(cleanEmail, cleanPass, 'doctor')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid Doctor email or password. Please verify credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoFill = (email: string, pass: string) => {
    setFormData({ email, password: pass })
  }

  return (
    <div className="min-h-screen bg-[#18362b] flex items-center justify-center p-4 sm:p-6 font-sans text-slate-100 selection:bg-emerald-600 selection:text-white relative overflow-hidden">
      {/* Background Decorative Subtle Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Container Card */}
      <div className="max-w-5xl w-full bg-[#122a21] rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/40 grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* LEFT PANEL: White Curved Branding Graphic Section */}
        <div className="md:col-span-6 bg-white text-slate-900 p-8 sm:p-12 flex flex-col justify-between items-center text-center relative md:rounded-r-[90px] shadow-lg z-10">
          {/* Top Logo */}
          <div className="w-full flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="MedTech Fixaters Logo" className="h-10 object-contain" />
              <div className="flex flex-col text-left">
                <span className="font-black text-lg text-slate-900 tracking-tight leading-none">MedTech Fixaters</span>
                <span className="text-[10px] font-bold text-emerald-700 tracking-widest uppercase mt-0.5">Clinical OS</span>
              </div>
            </Link>
          </div>

          {/* Center Medical Tree / Stethoscope Vector Graphic */}
          <div className="my-auto py-8 space-y-4 max-w-xs mx-auto">
            <div className="w-32 h-32 bg-emerald-50 rounded-full border-4 border-emerald-100 flex items-center justify-center mx-auto shadow-inner text-[#00875A]">
              <Stethoscope size={64} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Smart OPD & EMR System</h2>
              <p className="text-xs text-slate-500 font-medium">
                High-speed digital prescription writing & queue management for Indian healthcare practices.
              </p>
            </div>
          </div>

          {/* Left Footer */}
          <div className="w-full text-center text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-4">
            <p>© 2026 MedTech Fixaters. ABDM & HIPAA Compliant.</p>
          </div>
        </div>

        {/* RIGHT PANEL: Dark Forest Green Login Form */}
        <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-between text-left space-y-6 bg-[#122a21]">
          {/* Top Navigation & Role Toggle */}
          <div className="flex items-center justify-between">
            <div className="p-1 bg-[#1a382e] rounded-full border border-emerald-900/60 flex items-center text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`px-4 py-1.5 rounded-full transition ${
                  selectedRole === 'doctor' ? 'bg-[#3b7c77] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('hospital_admin')
                  navigate('/hospitaladminmedtech')
                }}
                className={`px-4 py-1.5 rounded-full transition ${
                  selectedRole === 'hospital_admin' ? 'bg-[#3b7c77] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hospital Admin
              </button>
            </div>

            <Link to="/" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1">
              <span>Home</span> <ArrowRight size={14} />
            </Link>
          </div>

          {/* Login Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Login</h1>
            <p className="text-xs text-emerald-300/80 font-medium">
              Enter your clinical doctor credentials to access OPD queue
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">Username / Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-5 py-3 bg-[#1a382e] border border-emerald-900/60 rounded-full text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-[#3b7c77] outline-none transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
                <Link to="/contact" className="text-[11px] text-emerald-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-5 py-3 bg-[#1a382e] border border-emerald-900/60 rounded-full text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-[#3b7c77] outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#3b7c77] hover:bg-[#2f6661] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-teal-950/40 transition flex items-center justify-center gap-2 mt-2"
            >
              <Key size={16} /> {isLoading ? 'Authenticating...' : 'Login to Doctor Console'}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-2 border-t border-emerald-900/40 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('doctor@shahidkhan.site', 'Shahideeba@19019')}
                className="px-3 py-2 bg-[#1a382e] hover:bg-emerald-900/40 text-emerald-300 rounded-xl text-[11px] font-mono text-left border border-emerald-800/40"
              >
                <strong>Dr. Rahul Sharma</strong>
                <span className="block text-[10px] opacity-70">General Medicine</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('drshahid@medtech.com', 'Shahideeba@19019')}
                className="px-3 py-2 bg-[#1a382e] hover:bg-emerald-900/40 text-emerald-300 rounded-xl text-[11px] font-mono text-left border border-emerald-800/40"
              >
                <strong>Dr. Shahid Khan</strong>
                <span className="block text-[10px] opacity-70">Cardiology Specialist</span>
              </button>
            </div>
          </div>

          {/* Bottom Footer links */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 border-t border-emerald-900/40">
            <Link to="/terms" className="hover:text-emerald-300 underline">
              Terms & Services
            </Link>
            <span className="text-[10px]">
              Have a problem? <a href="mailto:shahidbcsm@gmail.com" className="text-emerald-400 hover:underline">Contact Support</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
