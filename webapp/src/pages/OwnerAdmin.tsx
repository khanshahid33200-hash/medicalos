import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  ShieldCheck,
  Search,
  Crown,
  LogOut,
  AlertCircle,
  Inbox,
  Key,
  Trash2,
  Edit,
  RotateCcw,
  CheckCircle,
  Plus,
  ArrowRight,
  Users,
  Activity,
  Bell,
  Calendar,
  CreditCard,
  ArrowUpRight,
  Sliders,
  Settings,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface HospitalItem {
  id: string
  name: string
  license: string
  phone: string
  email: string
  password?: string
  intake_token?: string
  address: string
  doctor_limit: number
  doctor_count: number
  status: 'active' | 'suspended'
}

interface LeadItem {
  id?: string
  name?: string
  phone?: string
  email?: string
  clinic_name?: string
  city?: string
  speciality?: string
  plan?: string
  message?: string
  timestamp?: string
}

export default function OwnerAdmin() {
  const { registerUserInSupabase } = useAuth()
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [loginError, setLoginError] = useState('')

  const [activeTab, setActiveTab] = useState<'dashboard' | 'hospitals' | 'leads' | 'analytics'>('dashboard')
  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'annually'>('annually')
  const [notice, setNotice] = useState<string | null>(null)

  // Hospital State
  const [hospitalsList, setHospitalsList] = useState<HospitalItem[]>(() => {
    try {
      const saved = localStorage.getItem('clinicos_hospitals')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  const [leadsList, setLeadsList] = useState<LeadItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // Modal States
  const [showHospitalModal, setShowHospitalModal] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    license: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    doctor_limit: 5,
  })

  const [editingProfileHospital, setEditingProfileHospital] = useState<HospitalItem | null>(null)
  const [profileForm, setProfileForm] = useState({
    name: '',
    license: '',
    phone: '',
    email: '',
    address: '',
    doctor_limit: 5,
  })

  const [resettingHospital, setResettingHospital] = useState<HospitalItem | null>(null)
  const [newPasswordForm, setNewPasswordForm] = useState('')

  useEffect(() => {
    const ownerAuth = localStorage.getItem('owner_authenticated')
    if (ownerAuth === 'true') {
      setIsOwnerAuthenticated(true)
    }
    fetchLeads()
  }, [])

  const fetchLeads = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('clinicos_leads') || '[]')
      setLeadsList(saved)
    } catch (e) {
      setLeadsList([])
    }
  }

  // Owner Auth Handler
  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    const emailInput = loginForm.email.trim().toLowerCase()
    const passwordInput = loginForm.password.trim()

    try {
      if (
        (emailInput === 'shahidbcsm@gmail.com' && passwordInput === 'Shahideeba@19019') ||
        (emailInput === 'info@shahidkhan.site' && passwordInput === 'Upjtv@1234')
      ) {
        setIsOwnerAuthenticated(true)
        localStorage.setItem('owner_authenticated', 'true')
      } else {
        setLoginError('Invalid Platform Owner credentials. Access denied.')
      }
    } catch (err: any) {
      setLoginError(err.message || 'Validation failed.')
    }
  }

  const handleOwnerLogout = () => {
    setIsOwnerAuthenticated(false)
    localStorage.removeItem('owner_authenticated')
  }

  // Hospital Actions
  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)

    const hospId = `hosp-${Date.now().toString().slice(-4)}`

    try {
      await registerUserInSupabase(hospitalForm.email, hospitalForm.password, {
        role: 'hospital_admin',
        name: hospitalForm.name,
        hospital_id: hospId,
      })
    } catch (err: any) {
      console.warn('Supabase Notice:', err.message)
    }

    const newHosp: HospitalItem = {
      id: hospId,
      name: hospitalForm.name,
      license: hospitalForm.license || `HOSP-2026-LIC-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: hospitalForm.phone,
      email: hospitalForm.email,
      password: hospitalForm.password.trim(),
      intake_token: `tok_${hospId}`,
      address: hospitalForm.address,
      doctor_limit: Number(hospitalForm.doctor_limit) || 5,
      doctor_count: 0,
      status: 'active',
    }

    const updated = [...hospitalsList, newHosp]
    setHospitalsList(updated)
    localStorage.setItem('clinicos_hospitals', JSON.stringify(updated))

    setShowHospitalModal(false)
    setIsRegistering(false)
    setHospitalForm({ name: '', license: '', phone: '', email: '', password: '', address: '', doctor_limit: 5 })
    setNotice(`Hospital "${newHosp.name}" created & credentials issued for ${newHosp.email}!`)
    setTimeout(() => setNotice(null), 5000)
  }

  const handleToggleHospitalStatus = (hospId: string) => {
    const updated = hospitalsList.map((h) =>
      h.id === hospId ? { ...h, status: (h.status === 'active' ? 'suspended' : 'active') as any } : h
    )
    setHospitalsList(updated)
    localStorage.setItem('clinicos_hospitals', JSON.stringify(updated))

    const target = updated.find((h) => h.id === hospId)
    setNotice(`Hospital "${target?.name}" status updated to ${target?.status?.toUpperCase()}.`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleDeleteHospital = (hospId: string, hospName: string) => {
    if (!window.confirm(`PERMANENT DELETION WARNING:\n\nAre you sure you want to permanently delete hospital "${hospName}" (${hospId})?\nThis action cannot be undone.`)) {
      return
    }

    const updated = hospitalsList.filter((h) => h.id !== hospId)
    setHospitalsList(updated)
    localStorage.setItem('clinicos_hospitals', JSON.stringify(updated))

    setNotice(`Hospital "${hospName}" permanently deleted.`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleSaveProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProfileHospital) return

    const updated = hospitalsList.map((h) => {
      if (h.id === editingProfileHospital.id) {
        return {
          ...h,
          name: profileForm.name,
          license: profileForm.license,
          phone: profileForm.phone,
          email: profileForm.email,
          address: profileForm.address,
          doctor_limit: Number(profileForm.doctor_limit) || 5,
        }
      }
      return h
    })

    setHospitalsList(updated)
    localStorage.setItem('clinicos_hospitals', JSON.stringify(updated))
    setEditingProfileHospital(null)
    setNotice(`Hospital profile for "${profileForm.name}" updated successfully!`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resettingHospital || !newPasswordForm.trim()) return

    const cleanPass = newPasswordForm.trim()

    const updated = hospitalsList.map((h) =>
      h.id === resettingHospital.id ? { ...h, password: cleanPass } : h
    )
    setHospitalsList(updated)
    localStorage.setItem('clinicos_hospitals', JSON.stringify(updated))

    try {
      await registerUserInSupabase(resettingHospital.email, cleanPass, {
        role: 'hospital_admin',
        name: resettingHospital.name,
        hospital_id: resettingHospital.id,
      })
    } catch (e) {}

    setResettingHospital(null)
    setNewPasswordForm('')
    setNotice(`Password reset for ${resettingHospital.name} (${resettingHospital.email})!`)
    setTimeout(() => setNotice(null), 5000)
  }

  const handleClearLeads = () => {
    if (!window.confirm('Are you sure you want to clear lead submissions?')) return
    localStorage.removeItem('clinicos_leads')
    setLeadsList([])
  }

  // 1. UNAUTHENTICATED LOCK SCREEN
  if (!isOwnerAuthenticated) {
    return (
      <div className="min-h-screen bg-[#18362b] flex items-center justify-center p-4 sm:p-6 font-sans text-slate-100 selection:bg-emerald-600 selection:text-white relative overflow-hidden">
        {/* Background Radial Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-700/10 rounded-full blur-3xl pointer-events-none" />

        {/* Main Split Container Card */}
        <div className="max-w-5xl w-full bg-[#122a21] rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/40 grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          {/* LEFT PANEL: White Curved Section */}
          <div className="md:col-span-6 bg-white text-slate-900 p-8 sm:p-12 flex flex-col justify-between items-center text-center relative md:rounded-r-[90px] shadow-lg z-10">
            {/* Top Logo */}
            <div className="w-full flex justify-between items-center">
              <Link to="/" className="flex items-center gap-3">
                <img src="/assets/logo.png" alt="MedTech Fixaters Logo" className="h-10 object-contain" />
                <div className="flex flex-col text-left">
                  <span className="font-black text-lg text-slate-900 tracking-tight leading-none">MedTech Fixaters</span>
                  <span className="text-[10px] font-bold text-emerald-700 tracking-widest uppercase mt-0.5">Platform Owner Root</span>
                </div>
              </Link>
            </div>

            {/* Center Graphic */}
            <div className="my-auto py-8 space-y-4 max-w-xs mx-auto">
              <div className="w-32 h-32 bg-amber-50 rounded-full border-4 border-amber-100 flex items-center justify-center mx-auto shadow-inner text-amber-600">
                <Crown size={60} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Master Platform Owner</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Multi-tenant master administration, credential issuance, and platform governance console.
                </p>
              </div>
            </div>

            {/* Left Footer */}
            <div className="w-full text-center text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-4">
              <p>© 2026 MedTech Fixaters. Restricted Owner Interface.</p>
            </div>
          </div>

          {/* RIGHT PANEL: Dark Forest Form */}
          <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-between text-left space-y-6 bg-[#122a21]">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-amber-950/80 text-amber-300 border border-amber-700/50 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Crown size={12} /> Owner Route
              </span>

              <Link to="/" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1">
                <span>Home</span> <ArrowRight size={14} />
              </Link>
            </div>

            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Owner Login</h1>
              <p className="text-xs text-emerald-300/80 font-mono">
                Route: <code className="text-emerald-400 font-bold">/mrshahidbabu</code>
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleOwnerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">Owner Email</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="shahidbcsm@gmail.com"
                  className="w-full px-5 py-3 bg-[#1a382e] border border-emerald-900/60 rounded-full text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-[#3b7c77] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">Owner Password</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-5 py-3 bg-[#1a382e] border border-emerald-900/60 rounded-full text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-[#3b7c77] outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#3b7c77] hover:bg-[#2f6661] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-teal-950/40 transition flex items-center justify-center gap-2 mt-2"
              >
                <Key size={16} /> Authenticate Platform Owner
              </button>
            </form>

            {/* Bottom Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 border-t border-emerald-900/40">
              <span className="text-[10px]">Restricted Platform Owner Portal</span>
              <span className="text-[10px]">shahidbcsm@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Filter Hospitals by search term
  const filteredHospitals = hospitalsList.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalDoctorSeats = hospitalsList.reduce((acc, h) => acc + h.doctor_limit, 0)

  // 2. AUTHENTICATED "QUIXOTIC" EXECUTIVE DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 font-sans selection:bg-emerald-600 selection:text-white p-4 sm:p-6">
      {/* Notice Banner */}
      {notice && (
        <div className="max-w-7xl mx-auto mb-4 bg-[#00875A] text-white px-4 py-3 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md">
          <CheckCircle size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Container Wrapper */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP FLOATING HEADER BAR */}
        <header className="bg-white rounded-3xl p-4 sm:px-6 shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="MedTech Fixaters Logo" className="h-9 object-contain" />
          </Link>

          {/* Center Navigation Pill Tabs */}
          <div className="bg-slate-100/80 p-1.5 rounded-full flex items-center gap-1 border border-slate-200/50 self-center">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'hospitals'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Hospitals ({hospitalsList.length})
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'leads'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Inbound Leads ({leadsList.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Platform Metrics
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowHospitalModal(true)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
              title="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition relative"
              title="Notifications"
            >
              <Bell size={18} />
              {leadsList.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center ring-2 ring-emerald-600/30">
                SK
              </div>
              <button onClick={handleOwnerLogout} className="text-slate-400 hover:text-rose-600 transition" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* GREETING & ACTION HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back, <span className="text-slate-500 font-normal">Platform Owner</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Picker Pill */}
            <div className="bg-white px-4 py-2.5 rounded-full border border-slate-200/80 shadow-sm flex items-center gap-2 text-xs font-extrabold text-slate-700">
              <Calendar size={15} className="text-slate-500" />
              <span>29 Jun, 2026 - 29 August, 2026</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setShowHospitalModal(true)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-full shadow-md transition flex items-center gap-2"
            >
              <Plus size={16} /> Add New Facility
            </button>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT AREA WITH SIDEBAR RAIL */}
        <div className="flex gap-6 items-start">
          {/* LEFT ICON SIDEBAR RAIL (QUIXOTIC MATCH) */}
          <aside className="hidden lg:flex flex-col justify-between w-16 bg-white rounded-3xl p-3 shadow-sm border border-slate-200/60 min-h-[620px]">
            <div className="space-y-4 text-center">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition mx-auto ${
                  activeTab === 'dashboard' ? 'bg-[#00875A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Sliders size={20} />
              </button>

              <button
                onClick={() => setActiveTab('hospitals')}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition mx-auto ${
                  activeTab === 'hospitals' ? 'bg-[#00875A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Building2 size={20} />
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition mx-auto ${
                  activeTab === 'leads' ? 'bg-[#00875A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Inbox size={20} />
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition mx-auto ${
                  activeTab === 'analytics' ? 'bg-[#00875A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Activity size={20} />
              </button>
            </div>

            <div className="space-y-4 text-center">
              <button onClick={() => setShowHospitalModal(true)} className="w-10 h-10 rounded-2xl text-slate-500 hover:bg-slate-100 flex items-center justify-center mx-auto">
                <Settings size={20} />
              </button>
              <button onClick={handleOwnerLogout} className="w-10 h-10 rounded-2xl text-slate-500 hover:bg-slate-100 flex items-center justify-center mx-auto">
                <LogOut size={20} />
              </button>
            </div>
          </aside>

          {/* RIGHT MAIN BENTO GRID */}
          <div className="flex-1 space-y-6">
            {activeTab === 'dashboard' && (
              <>
                {/* TOP BENTO ROW */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  {/* CARD 1: VISA / LICENSE EMERALD CREDIT CARD (4 COLS) */}
                  <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-5 text-left flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Hospital Licenses & Seats</p>
                        <p className="text-[11px] text-slate-400 font-medium">Total active allocated capacity</p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <ArrowUpRight size={16} />
                      </button>
                    </div>

                    {/* Deep Emerald Credit Card */}
                    <div className="bg-gradient-to-br from-[#006e49] via-[#00875A] to-[#005c3d] text-white rounded-3xl p-6 shadow-lg shadow-emerald-800/20 space-y-4 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="font-black tracking-wider text-sm">MEDTECH FIXATERS</span>
                        <CreditCard size={22} className="opacity-80" />
                      </div>
                      <div className="pt-2">
                        <p className="text-[11px] font-mono opacity-80 uppercase tracking-widest">Active Doctor Seats</p>
                        <p className="text-3xl font-black font-mono tracking-tight">{totalDoctorSeats} Seats</p>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-mono opacity-90 pt-2 border-t border-white/20">
                        <span>{hospitalsList.length} Facilities</span>
                        <span>ABDM M3 COMPLIANT</span>
                      </div>
                    </div>

                    {/* Facility Count Summary */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase">Registered Facilities</p>
                        <p className="text-2xl font-black text-slate-900">{hospitalsList.length} Hospitals</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full flex items-center gap-1">
                        <ShieldCheck size={12} /> {hospitalsList.filter(h => h.status === 'active').length} Active
                      </span>
                    </div>
                  </div>

                  {/* CARD 2: ENGAGEMENT RATE & BAR CHART (5 COLS) */}
                  <div className="md:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-5 text-left flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                          <Activity size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Hospital Engagement Rate</p>
                          <p className="text-[11px] text-slate-400 font-medium">Real-time facility status</p>
                        </div>
                      </div>

                      {/* Monthly / Annually Pill Toggle */}
                      <div className="bg-slate-100 p-1 rounded-full flex items-center text-[11px] font-bold">
                        <button
                          onClick={() => setChartPeriod('monthly')}
                          className={`px-3 py-1 rounded-full transition ${chartPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setChartPeriod('annually')}
                          className={`px-3 py-1 rounded-full transition ${chartPeriod === 'annually' ? 'bg-[#00875A] text-white shadow-xs' : 'text-slate-500'}`}
                        >
                          Annually
                        </button>
                      </div>
                    </div>

                    {/* Simulated Bar Chart */}
                    <div className="pt-4 space-y-2">
                      <div className="flex justify-end pr-8">
                        <span className="px-2.5 py-1 bg-emerald-800 text-white font-extrabold text-[10px] rounded-full shadow-sm">
                          {hospitalsList.filter(h => h.status === 'active').length} Active Facilities
                        </span>
                      </div>
                      <div className="h-36 flex items-end justify-between gap-3 px-2">
                        <div className="w-full bg-emerald-100 hover:bg-emerald-200 rounded-2xl h-[50%] transition group relative" />
                        <div className="w-full bg-emerald-200 hover:bg-emerald-300 rounded-2xl h-[70%] transition group relative" />
                        <div className="w-full bg-emerald-200 hover:bg-emerald-300 rounded-2xl h-[60%] transition group relative" />
                        <div className="w-full bg-[#00875A] hover:bg-[#007043] rounded-2xl h-[95%] transition shadow-md group relative" />
                        <div className="w-full bg-emerald-200 hover:bg-emerald-300 rounded-2xl h-[75%] transition group relative" />
                        <div className="w-full bg-emerald-200 hover:bg-emerald-300 rounded-2xl h-[85%] transition group relative" />
                      </div>
                      <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400 px-2 pt-2">
                        <span>JAN</span>
                        <span>FEB</span>
                        <span>MAR</span>
                        <span>APR</span>
                        <span>MAY</span>
                        <span>JUN</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: TOTAL BALANCE / OPD CAPACITY GRAPH (3 COLS) */}
                  <div className="md:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-5 text-left flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Total OPD Capacity</p>
                        <p className="text-[11px] text-slate-400 font-medium">Monthly seat capacity</p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <ArrowUpRight size={16} />
                      </button>
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase">Monthly Seat Capacity</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight font-mono">{totalDoctorSeats * 30} Visits</p>
                    </div>

                    {/* Wave Line SVG */}
                    <div className="py-2">
                      <svg viewBox="0 0 200 50" className="w-full h-14 text-emerald-600 stroke-current fill-none stroke-[3]">
                        <path d="M0,35 Q30,10 60,30 T120,15 T180,35 T200,20" />
                      </svg>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setShowHospitalModal(true)}
                        className="py-2.5 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-[11px] rounded-2xl shadow-sm transition"
                      >
                        + Add Hospital
                      </button>
                      <button
                        onClick={() => setActiveTab('analytics')}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] rounded-2xl transition"
                      >
                        Reports
                      </button>
                    </div>
                  </div>
                </div>

                {/* BOTTOM BENTO ROW */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  {/* CARD 4: REGISTERED FACILITIES HISTORY TABLE (8 COLS) */}
                  <div className="md:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">Registered Facilities History</h3>
                        <p className="text-xs text-slate-400 font-medium">Recent hospital credential records</p>
                      </div>
                      <button onClick={() => setActiveTab('hospitals')} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <ArrowUpRight size={16} />
                      </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-400 font-bold border-b border-slate-100">
                            <th className="pb-3 font-semibold">Hospital Name</th>
                            <th className="pb-3 font-semibold">Admin Credentials</th>
                            <th className="pb-3 font-semibold">Status</th>
                            <th className="pb-3 font-semibold text-center">Seats</th>
                            <th className="pb-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {hospitalsList.slice(0, 5).map((h) => (
                            <tr key={h.id} className="hover:bg-slate-50 transition">
                              <td className="py-3 font-extrabold text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                                  <Building2 size={16} />
                                </div>
                                <div>
                                  <p>{h.name}</p>
                                  <p className="text-[10px] font-mono text-slate-400 font-normal">{h.id}</p>
                                </div>
                              </td>
                              <td className="py-3 font-mono text-slate-600">{h.email}</td>
                              <td className="py-3">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                                  <span className={`w-2 h-2 rounded-full ${h.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                  <span>{h.status === 'active' ? 'Active' : 'Suspended'}</span>
                                </span>
                              </td>
                              <td className="py-3 text-center font-mono font-bold text-slate-900">{h.doctor_limit}</td>
                              <td className="py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingProfileHospital(h)
                                      setProfileForm({
                                        name: h.name,
                                        license: h.license,
                                        phone: h.phone,
                                        email: h.email,
                                        address: h.address,
                                        doctor_limit: h.doctor_limit,
                                      })
                                    }}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                                    title="Edit Profile"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setResettingHospital(h)
                                      setNewPasswordForm(h.password || '')
                                    }}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-amber-600 rounded-lg transition"
                                    title="Reset Password"
                                  >
                                    <Key size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleHospitalStatus(h.id)}
                                    className={`p-1.5 rounded-lg transition ${
                                      h.status === 'active'
                                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    }`}
                                    title={h.status === 'active' ? 'Suspend' : 'Activate'}
                                  >
                                    <RotateCcw size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteHospital(h.id, h.name)}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                    title="Delete Facility"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* CARD 5: ALLOCATED DOCTOR SEATS & PLATFORM ROOT (4 COLS) */}
                  <div className="md:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-3 text-left">
                      <div className="flex items-center gap-2 text-slate-600">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold">
                          <Users size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Allocated Doctor Seats</p>
                          <p className="text-[11px] text-slate-400 font-medium">Total platform seat capacity</p>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <p className="text-3xl font-black text-slate-900 font-mono">{totalDoctorSeats} Seats</p>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[11px] rounded-full">
                          {hospitalsList.length} Facilities
                        </span>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">Platform Owner Root</p>
                          <p className="text-[11px] text-slate-400 font-mono">shahidbcsm@gmail.com</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-sm">
                          ROOT
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* HOSPITALS TAB */}
            {activeTab === 'hospitals' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Hospital Facilities Management</h2>
                    <p className="text-xs text-slate-500">Manage credentials, doctor seat limits, and status</p>
                  </div>
                  <div className="relative max-w-sm w-full">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search facility name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHospitals.map((hosp) => (
                    <div key={hosp.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest">{hosp.id}</span>
                            <h3 className="text-base font-black text-slate-900">{hosp.name}</h3>
                          </div>
                          <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full uppercase ${hosp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {hosp.status}
                          </span>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-mono">
                          <p><span className="text-slate-400">License:</span> <strong className="text-slate-800">{hosp.license}</strong></p>
                          <p><span className="text-slate-400">Admin Email:</span> <strong className="text-emerald-700">{hosp.email}</strong></p>
                          {hosp.password && <p><span className="text-slate-400">Admin Pass:</span> <strong className="text-amber-700">{hosp.password}</strong></p>}
                          <p><span className="text-slate-400">Doctor Limit:</span> <strong className="text-slate-800">{hosp.doctor_limit} Seats</strong></p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => {
                            setEditingProfileHospital(hosp)
                            setProfileForm({
                              name: hosp.name,
                              license: hosp.license,
                              phone: hosp.phone,
                              email: hosp.email,
                              address: hosp.address,
                              doctor_limit: hosp.doctor_limit,
                            })
                          }}
                          className="py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition"
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={() => {
                            setResettingHospital(hosp)
                            setNewPasswordForm(hosp.password || '')
                          }}
                          className="py-2 bg-white hover:bg-slate-100 text-amber-700 font-bold text-xs rounded-xl border border-slate-200 transition"
                        >
                          Reset Pass
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEADS TAB */}
            {activeTab === 'leads' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Website Inbound Leads</h2>
                    <p className="text-xs text-slate-500">Contact form submissions from main website</p>
                  </div>
                  {leadsList.length > 0 && (
                    <button onClick={handleClearLeads} className="px-4 py-2 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl border border-rose-200">
                      Clear All Leads
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {leadsList.map((lead, idx) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-bold text-slate-900">{lead.name || 'Unnamed Lead'}</h3>
                        <span className="text-[10px] font-mono text-slate-400">{lead.timestamp}</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 text-xs font-mono">
                        <p><span className="text-slate-400">Phone:</span> <strong className="text-emerald-700">{lead.phone}</strong></p>
                        {lead.email && <p><span className="text-slate-400">Email:</span> {lead.email}</p>}
                        {lead.clinic_name && <p><span className="text-slate-400">Clinic:</span> {lead.clinic_name}</p>}
                        {lead.message && <p className="text-slate-600 italic pt-1 border-t border-slate-100">"{lead.message}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 space-y-6 text-left">
                <h2 className="text-xl font-black text-slate-900">Platform Growth & Analytics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2">
                    <Building2 size={24} className="text-emerald-700" />
                    <p className="text-3xl font-black text-slate-900">{hospitalsList.length}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">Registered Facilities</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2">
                    <Users size={24} className="text-emerald-700" />
                    <p className="text-3xl font-black text-slate-900">{totalDoctorSeats}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">Allocated Doctor Seats</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2">
                    <Inbox size={24} className="text-emerald-700" />
                    <p className="text-3xl font-black text-slate-900">{leadsList.length}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">Inbound Leads</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE HOSPITAL MODAL */}
      {showHospitalModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Issue New Hospital Credentials</h3>
              <button onClick={() => setShowHospitalModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateHospital} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  value={hospitalForm.name}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                  placeholder="e.g. City Care Multispecialty Hospital"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Hospital Admin Email *</label>
                  <input
                    type="email"
                    required
                    value={hospitalForm.email}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                    placeholder="hadmin@cityhospital.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Admin Password *</label>
                  <input
                    type="text"
                    required
                    value={hospitalForm.password}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, password: e.target.value })}
                    placeholder="HospAdminPass@123"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Helpline</label>
                  <input
                    type="text"
                    value={hospitalForm.phone}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Doctor Seat Limit</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={hospitalForm.doctor_limit}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, doctor_limit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Address / Location</label>
                <input
                  type="text"
                  value={hospitalForm.address}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                  placeholder="e.g. Park Street, Kolkata - 700016"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowHospitalModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="px-6 py-2.5 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs rounded-xl shadow-md"
                >
                  {isRegistering ? 'Issuing Credentials...' : 'Create & Issue Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editingProfileHospital && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Update Hospital Profile</h3>
              <button onClick={() => setEditingProfileHospital(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Admin Email *</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Doctor Seat Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={profileForm.doctor_limit}
                    onChange={(e) => setProfileForm({ ...profileForm, doctor_limit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProfileHospital(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs rounded-xl shadow-md"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resettingHospital && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">Reset Hospital Admin Password</h3>
              <button onClick={() => setResettingHospital(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <p className="text-xs text-slate-600 font-mono">
              Facility: <strong className="text-slate-900">{resettingHospital.name}</strong> ({resettingHospital.email})
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">New Admin Password *</label>
                <input
                  type="text"
                  required
                  value={newPasswordForm}
                  onChange={(e) => setNewPasswordForm(e.target.value)}
                  placeholder="NewAdminPass@123"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResettingHospital(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs rounded-xl shadow-md"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
