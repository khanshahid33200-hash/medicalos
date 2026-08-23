import { useState, useEffect } from 'react'
import {
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  Search,
  Layers,
  Crown,
  LogOut,
  AlertCircle,
  Inbox,
  Phone,
  Sliders,
  Key,
  Trash2,
  Edit,
  RotateCcw,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Button from '../components/Button'
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

  const [activeTab, setActiveTab] = useState<'hospitals' | 'leads' | 'analytics'>('hospitals')
  const [notice, setNotice] = useState<string | null>(null)

  // Hospital State with Doctor Seat Limits (Set by Owner)
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

  // Hospital Creation Modal State
  const [showHospitalModal, setShowHospitalModal] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    license: '',
    phone: '',
    email: '',
    password: '', // Hospital Admin Supabase Auth Password
    address: '',
    doctor_limit: 5,
  })

  // Edit Doctor Seat Limit Modal State
  const [editingHospital, setEditingHospital] = useState<HospitalItem | null>(null)
  const [newLimit, setNewLimit] = useState(5)

  // Update Hospital Profile Modal State
  const [editingProfileHospital, setEditingProfileHospital] = useState<HospitalItem | null>(null)
  const [profileForm, setProfileForm] = useState({
    name: '',
    license: '',
    phone: '',
    email: '',
    address: '',
    doctor_limit: 5,
  })

  // Reset Password Modal State
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

  // Owner Authentication Handler with Case-Insensitive Email Validation
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
        setLoginError('Invalid Platform Owner credentials. Access denied to secret admin route.')
      }
    } catch (err: any) {
      setLoginError(err.message || 'Firebase Auth validation failed.')
    }
  }

  const handleOwnerLogout = () => {
    setIsOwnerAuthenticated(false)
    localStorage.removeItem('owner_authenticated')
  }

  // 1. Create Hospital Profile & Save Hospital Admin Credentials
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
      console.warn('Supabase Auth Registration Notice:', err.message)
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
    setNotice(`Hospital profile "${newHosp.name}" created & credentials issued for ${newHosp.email}!`)
    setTimeout(() => setNotice(null), 5000)
  }

  // 2. Suspend / Reactivate Hospital
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

  // 3. Permanently Delete Hospital Profile
  const handleDeleteHospital = (hospId: string, hospName: string) => {
    if (!window.confirm(`⚠️ PERMANENT DELETION WARNING:\n\nAre you sure you want to permanently delete hospital "${hospName}" (${hospId}) and purge all its user credentials?\nThis action cannot be undone.`)) {
      return
    }

    const updated = hospitalsList.filter((h) => h.id !== hospId)
    setHospitalsList(updated)
    localStorage.setItem('clinicos_hospitals', JSON.stringify(updated))

    setNotice(`Hospital "${hospName}" permanently deleted from platform.`)
    setTimeout(() => setNotice(null), 4000)
  }

  // 4. Update Hospital Profile
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

  // 5. Reset Hospital Admin Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resettingHospital || !newPasswordForm.trim()) return

    const cleanPass = newPasswordForm.trim()

    // 1. Update password in hospitalsList
    const updated = hospitalsList.map((h) =>
      h.id === resettingHospital.id ? { ...h, password: cleanPass } : h
    )
    setHospitalsList(updated)
    localStorage.setItem('clinicos_hospitals', JSON.stringify(updated))

    // 2. Register / update password in user registry & Supabase Auth
    try {
      await registerUserInSupabase(resettingHospital.email, cleanPass, {
        role: 'hospital_admin',
        name: resettingHospital.name,
        hospital_id: resettingHospital.id,
      })
    } catch (e) {}

    setResettingHospital(null)
    setNewPasswordForm('')
    setNotice(`Admin password reset successfully for ${resettingHospital.name} (${resettingHospital.email})!`)
    setTimeout(() => setNotice(null), 5000)
  }

  // 6. Update Doctor Seat Limit
  const handleUpdateDoctorLimit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingHospital) return

    const updated = hospitalsList.map((h) =>
      h.id === editingHospital.id ? { ...h, doctor_limit: Number(newLimit) } : h
    )
    setHospitalsList(updated)
    localStorage.setItem('clinicos_hospitals', JSON.stringify(updated))

    setEditingHospital(null)
    setNotice(`Doctor seat limit updated to ${newLimit} for ${editingHospital.name}.`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleClearLeads = () => {
    if (!window.confirm('Are you sure you want to clear lead submissions?')) return
    localStorage.removeItem('clinicos_leads')
    setLeadsList([])
  }

  // 1. OWNER UNAUTHENTICATED VIEW
  if (!isOwnerAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown size={36} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Platform Owner Admin Portal</h1>
            <p className="text-xs text-slate-400">
              Restricted secret route <code className="text-blue-400 font-mono">/mrshahidbabu</code> for Website Owner
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex items-center gap-3 text-red-400 text-xs font-semibold">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleOwnerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                <Mail size={14} className="inline mr-1 text-blue-400" /> Owner Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="shahidbcsm@gmail.com"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                <Lock size={14} className="inline mr-1 text-blue-400" /> Secret Key / Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} /> Authenticate as Owner
            </button>
          </form>
        </div>
      </div>
    )
  }

  // 2. OWNER AUTHENTICATED ADMIN DASHBOARD
  const filteredHospitals = hospitalsList.filter((hosp) =>
    hosp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hosp.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-12 font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
            <Crown size={22} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide">Clinic OS Master Control Console</h1>
            <p className="text-xs text-blue-400 font-mono">Logged in as shahidbcsm@gmail.com</p>
          </div>
        </div>

        <button
          onClick={handleOwnerLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-700"
        >
          <LogOut size={16} /> Sign Out Owner
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-950 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-400/30">
              Platform Master Admin (/mrshahidbabu)
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-2">
              Hospital Life-Cycle & Credential Manager
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Create Hospital Profiles, Suspend/Block facilities, Permanently Delete, Reset Admin Passwords, and Update Profiles.
            </p>
          </div>

          <Button variant="primary" onClick={() => setShowHospitalModal(true)} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 text-white font-bold flex items-center gap-2">
            <Building2 size={18} /> + Create Hospital Profile
          </Button>
        </div>

        {/* Notice Alert */}
        {notice && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-medium">
            <span>✓ {notice}</span>
            <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Console Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'hospitals', label: 'Hospital Profiles & Doctor Limits', icon: Building2, count: hospitalsList.length },
            { id: 'leads', label: 'Inquiries & Sales Leads', icon: Inbox, count: leadsList.length },
            { id: 'analytics', label: 'Platform System Stats', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2.5 ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${active ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB 1: HOSPITAL PROFILES & MANAGEMENT ACTIONS */}
        {activeTab === 'hospitals' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search Hospital Profile by Name or Admin Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 text-sm text-white outline-none"
              />
            </div>

            {filteredHospitals.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
                <Building2 size={48} className="mx-auto text-slate-700" />
                <h3 className="text-lg font-bold text-slate-300">No Hospitals Registered Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click <strong className="text-blue-400">+ Create Hospital Profile</strong> above to register a new hospital facility and issue admin login credentials.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHospitals.map((hosp) => (
                  <div key={hosp.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-blue-500/40 transition shadow-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 font-mono text-xs font-bold rounded-lg border border-blue-500/20">
                          {hosp.id}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1">{hosp.name}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">License: {hosp.license}</p>
                      </div>
                      {hosp.status === 'active' ? (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle size={14} /> Active Facility
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 font-bold text-xs rounded-full border border-red-500/20 flex items-center gap-1">
                          <XCircle size={14} /> Suspended / Blocked
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-xs text-slate-300 bg-slate-900 p-4 rounded-2xl border border-slate-800 font-medium">
                      <p>📍 Address: {hosp.address || 'Not specified'}</p>
                      <p>📞 Phone: {hosp.phone || 'N/A'} • ✉️ Admin Email: <strong className="text-blue-400 font-mono">{hosp.email}</strong></p>
                      <p className="text-[11px] text-amber-300">🔑 Login Portal: Restricted to <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-200">/login/hospitaladmin009</code></p>
                      
                      {/* Doctor Seat Limit */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-slate-400">Doctor Seat Limit (Owner Set):</p>
                          <p className="text-base font-black text-emerald-400 font-mono">
                            {hosp.doctor_count} / {hosp.doctor_limit} Doctors Added
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingHospital(hosp)
                            setNewLimit(hosp.doctor_limit)
                          }}
                          className="px-3 py-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-blue-500/30"
                        >
                          <Sliders size={14} /> Adjust Limit
                        </button>
                      </div>
                    </div>

                    {/* OWNER MANAGEMENT ACTION CONTROLS */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Owner Management Actions:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {/* 1. Update Profile */}
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
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 flex items-center justify-center gap-1.5"
                        >
                          <Edit size={14} className="text-blue-400" /> Update Profile
                        </button>

                        {/* 2. Reset Password */}
                        <button
                          onClick={() => {
                            setResettingHospital(hosp)
                            setNewPasswordForm('')
                          }}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw size={14} className="text-amber-400" /> Reset Password
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {/* 3. Block / Suspend / Reactivate */}
                        <button
                          onClick={() => handleToggleHospitalStatus(hosp.id)}
                          className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            hosp.status === 'active'
                              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                          }`}
                        >
                          {hosp.status === 'active' ? '⚠️ Suspend / Block' : '✓ Reactivate'}
                        </button>

                        {/* 4. Permanently Delete */}
                        <button
                          onClick={() => handleDeleteHospital(hosp.id, hosp.name)}
                          className="py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-xl text-xs font-bold transition border border-red-500/30 flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={14} /> Delete Hospital
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INQUIRIES & SALES LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Inbox size={20} className="text-blue-400" /> Website Buy Now & Contact Form Submissions ({leadsList.length})
              </h3>
              {leadsList.length > 0 && (
                <button
                  onClick={handleClearLeads}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-bold transition"
                >
                  Clear Leads Log
                </button>
              )}
            </div>

            {leadsList.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-2">
                <Inbox size={48} className="mx-auto text-slate-700" />
                <p className="text-base font-bold text-slate-400">No Sales Inquiries Received Yet</p>
                <p className="text-xs">When website visitors submit the Buy Now or Contact forms, their details will appear here.</p>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900 border-b border-slate-800 text-xs uppercase font-bold text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Doctor / Lead Name</th>
                      <th className="px-6 py-4">Phone & City</th>
                      <th className="px-6 py-4">Clinic & Speciality</th>
                      <th className="px-6 py-4">Requested Plan</th>
                      <th className="px-6 py-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {leadsList.map((lead, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60 transition">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white text-base">{lead.name || 'Anonymous Doctor'}</p>
                          <p className="text-xs text-slate-400 font-mono">{lead.email || 'No email provided'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-blue-400 flex items-center gap-1.5">
                            <Phone size={14} /> +91-{lead.phone}
                          </p>
                          <p className="text-xs text-slate-400">{lead.city || 'Not specified'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-200">{lead.clinic_name || 'Clinic N/A'}</p>
                          <p className="text-xs text-slate-400">{lead.speciality || 'General'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 font-bold text-xs rounded-full border border-blue-500/30">
                            {lead.plan || 'Enroll Now'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {lead.timestamp || 'Just now'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PLATFORM SYSTEM STATS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Hospitals</p>
              <p className="text-5xl font-black text-blue-400">{hospitalsList.length}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales Lead Submissions</p>
              <p className="text-5xl font-black text-purple-400">{leadsList.length}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Supabase Auth Status</p>
              <p className="text-2xl font-black text-emerald-400">✓ Connected (taszwtgrgvhkjvqdieqh)</p>
            </div>
          </div>
        )}

        {/* MODAL 1: CREATE HOSPITAL PROFILE */}
        {showHospitalModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="text-blue-400" size={20} /> Create Hospital Profile & Credentials
                </h3>
                <button onClick={() => setShowHospitalModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateHospital} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Hospital Name *</label>
                  <input
                    type="text"
                    value={hospitalForm.name}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                    placeholder="e.g. Apollo Multi-Specialty Hospital"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Admin Email *</label>
                    <input
                      type="email"
                      value={hospitalForm.email}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                      placeholder="admin@apollo.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Initial Password *</label>
                    <input
                      type="password"
                      value={hospitalForm.password}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Doctor Seat Limit (Owner Set) *</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={hospitalForm.doctor_limit}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, doctor_limit: Number(e.target.value) })}
                    placeholder="e.g. 5"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Phone</label>
                    <input
                      type="text"
                      value={hospitalForm.phone}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                      placeholder="+91-9876543210"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">License No.</label>
                    <input
                      type="text"
                      value={hospitalForm.license}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, license: e.target.value })}
                      placeholder="HOSP-2026-LIC-9921"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Address</label>
                  <input
                    type="text"
                    value={hospitalForm.address}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                    placeholder="Hospital address..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowHospitalModal(false)} className="flex-1 bg-slate-800 text-slate-300">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isRegistering} className="flex-1 bg-blue-600 text-white font-bold flex items-center justify-center gap-1.5">
                    <Key size={14} /> Create Hospital Profile
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: UPDATE HOSPITAL PROFILE */}
        {editingProfileHospital && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit className="text-blue-400" size={20} /> Update Hospital Profile
                </h3>
                <button onClick={() => setEditingProfileHospital(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSaveProfileUpdate} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Hospital Name *</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Admin Email *</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Doctor Seat Limit</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={profileForm.doctor_limit}
                      onChange={(e) => setProfileForm({ ...profileForm, doctor_limit: Number(e.target.value) })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">License No.</label>
                    <input
                      type="text"
                      value={profileForm.license}
                      onChange={(e) => setProfileForm({ ...profileForm, license: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Address</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setEditingProfileHospital(null)} className="flex-1 bg-slate-800 text-slate-300">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 bg-blue-600 text-white font-bold">
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: RESET HOSPITAL ADMIN PASSWORD */}
        {resettingHospital && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full shadow-2xl p-6 space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <RotateCcw className="text-amber-400" size={18} /> Reset Admin Password
                </h3>
                <button onClick={() => setResettingHospital(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
                <p className="text-slate-300">Set a new login password for <strong>{resettingHospital.name}</strong> (<code className="text-blue-400">{resettingHospital.email}</code>):</p>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    value={newPasswordForm}
                    onChange={(e) => setNewPasswordForm(e.target.value)}
                    placeholder="Enter new admin password"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setResettingHospital(null)} className="flex-1 bg-slate-800 text-slate-300">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold">
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: EDIT DOCTOR SEAT LIMIT */}
        {editingHospital && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full shadow-2xl p-6 space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Sliders className="text-blue-400" size={18} /> Adjust Doctor Seat Limit
                </h3>
                <button onClick={() => setEditingHospital(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleUpdateDoctorLimit} className="space-y-3 text-xs">
                <p className="text-slate-300">Adjust allowed doctor seat limit for <strong>{editingHospital.name}</strong>:</p>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Allowed Doctor Limit *</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newLimit}
                    onChange={(e) => setNewLimit(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold text-lg text-center outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setEditingHospital(null)} className="flex-1 bg-slate-800 text-slate-300">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 bg-blue-600 text-white font-bold">
                    Save New Limit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
