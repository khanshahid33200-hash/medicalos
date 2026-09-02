import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  AlertCircle, Stethoscope, Building2, Lock, Mail,
  Eye, EyeOff, ArrowRight, ShieldCheck, Zap,
  CheckCircle2, Sparkles, PhoneCall
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../hooks/useSEO'

export default function Login() {
  useSEO({
    title: 'Sign In — Clinical OS by MedTech Fixaters',
    description: 'Secure Doctor and Hospital Administrator sign-in portal for MedTech Fixaters Clinical OS.',
  })

  const navigate = useNavigate()
  const { loginWithSupabase } = useAuth()

  const [selectedRole, setSelectedRole] = useState<'doctor' | 'hospital_admin'>('doctor')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = password.trim()

    if (!cleanEmail || !cleanPass) {
      setIsLoading(false)
      setError('Please enter your registered email address and password.')
      return
    }

    try {
      const res = await loginWithSupabase(cleanEmail, cleanPass, selectedRole)
      const actualRole = res?.role || selectedRole
      if (actualRole === 'hospital_admin') {
        navigate('/hospitaldashboard/dashboard')
      } else if (actualRole === 'super_admin') {
        navigate('/mrshahidbabu')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] relative z-10">
        
        {/* ─── LEFT BRANDING & VALUE PANEL (lg: 5 cols) ─── */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1f18] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Mesh */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-emerald-400 text-lg">
                  ⚡
                </div>
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight block">MedTech Fixaters</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Clinical Operating System
                </span>
              </div>
            </Link>

            {/* Main Pitch */}
            <div className="space-y-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[11px] font-bold">
                <Sparkles size={13} />
                <span>Next-Gen Healthcare OS</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                High-Speed OPD, Smart Queue & EMR Console.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign in to manage patient consultations, issue 30-second digital prescriptions, and monitor live tokens.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              {[
                { icon: <Zap size={15} className="text-emerald-400" />, title: '30-Second Prescription EMR', sub: 'Instant drug auto-complete & dosing.' },
                { icon: <ShieldCheck size={15} className="text-teal-400" />, title: 'Zero-Leakage Multi-Tenant RLS', sub: 'Database-level PostgreSQL isolation.' },
                { icon: <CheckCircle2 size={15} className="text-emerald-400" />, title: 'Smart QR Kiosk & WhatsApp Rx', sub: 'Automated patient check-in delivery.' },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="p-1.5 bg-white/5 rounded-xl shrink-0 mt-0.5">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{feat.title}</h4>
                    <p className="text-[11px] text-slate-400">{feat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Security Trust Badges */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
            <span className="font-semibold flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-400" /> ABDM & HIPAA Ready
            </span>
            <span className="font-mono">256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* ─── RIGHT AUTHENTICATION FORM (lg: 7 cols) ─── */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white text-left space-y-6">
          
          {/* Top Bar: Return Link & Role Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Role Switcher Pill */}
            <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200/80 inline-flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                  selectedRole === 'doctor'
                    ? 'bg-white text-emerald-700 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Stethoscope size={15} />
                <span>Doctor Portal</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('hospital_admin')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                  selectedRole === 'hospital_admin'
                    ? 'bg-white text-emerald-700 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Building2 size={15} />
                <span>Hospital Admin</span>
              </button>
            </div>

            <Link
              to="/"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition flex items-center gap-1 self-end sm:self-auto"
            >
              <span>Back to Home</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Header Title */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {selectedRole === 'doctor' ? 'Doctor Clinical Sign In' : 'Hospital Admin Portal'}
            </h1>
            <p className="text-xs text-slate-500">
              {selectedRole === 'doctor'
                ? 'Enter your assigned practitioner email to open today’s OPD consult queue.'
                : 'Access hospital doctor seats, live lobby display, and reception settings.'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
              <AlertCircle size={17} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier (Doctor ID or Email) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{selectedRole === 'doctor' ? 'Doctor ID or Email' : 'Hospital Admin Email'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {selectedRole === 'doctor' ? 'e.g. H1-D-0001' : 'Supabase Auth'}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'doctor' ? 'Doctor ID (e.g. H1-D-0001) or Email' : 'admin@hospital.com'}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-600">Keep me logged in on this clinical workstation</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating with Supabase...</span>
              ) : (
                <>
                  <span>
                    {selectedRole === 'doctor' ? 'Sign In to Doctor Console' : 'Sign In to Hospital Admin'}
                  </span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Bottom Security Info & Support */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <div className="flex items-center gap-3">
                <Link to="/privacy" className="hover:text-slate-700 transition">Privacy Policy</Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-slate-700 transition">Terms of Service</Link>
              </div>
              <div className="text-[11px]">
                Need credentials?{' '}
                <a href="mailto:support@medtechfixaters.com" className="font-bold text-emerald-600 hover:underline">
                  Contact Super Admin
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL: FORGOT PASSWORD RECOVERY ─── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <PhoneCall size={16} />
                </div>
                <h3 className="font-black text-base text-slate-900">Credential Recovery</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Clinical practitioner accounts and hospital admin credentials are cryptographically secured by Supabase Auth and provisioned by your facility or platform super administrator.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                <strong className="text-slate-800 block">How to reset your password:</strong>
                <p>1. Contact your Hospital Administrator to trigger a password reset.</p>
                <p>2. For Master Hospital Admin access, request a key renewal from Super Admin at <code>/mrshahidbabu</code>.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
              >
                Understood, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
