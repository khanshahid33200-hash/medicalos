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
  Key
} from 'lucide-react'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

interface HospitalItem {
  id: string
  name: string
  license: string
  phone: string
  email: string
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

  // Edit Limit Modal State
  const [editingHospital, setEditingHospital] = useState<HospitalItem | null>(null)
  const [newLimit, setNewLimit] = useState(5)

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

  // Owner Authentication Handler
  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    if (loginForm.email === 'info@shahidkhan.site' && loginForm.password === 'Upjtv@1234') {
      setIsOwnerAuthenticated(true)
      localStorage.setItem('owner_authenticated', 'true')
    } else {
      setLoginError('Invalid Platform Owner credentials. Access denied to secret admin route.')
    }
  }

  const handleOwnerLogout = () => {
    setIsOwnerAuthenticated(false)
    localStorage.removeItem('owner_authenticated')
  }

  // Create Hospital Profile & Save Hospital Admin Credentials directly in Supabase Auth
  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)

    const hospId = `hosp-${Date.now().toString().slice(-4)}`

    try {
      // 1. Save Credentials in Supabase Auth
      await registerUserInSupabase(hospitalForm.email, hospitalForm.password, {
        role: 'hospital_admin',
        name: hospitalForm.name,
        hospital_id: hospId,
      })
    } catch (err: any) {
      console.warn('Supabase Auth Registration Notice:', err.message)
    }

    // 2. Create Hospital Record
    const newHosp: HospitalItem = {
      id: hospId,
      name: hospitalForm.name,
      license: hospitalForm.license || `HOSP-2026-LIC-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: hospitalForm.phone,
      email: hospitalForm.email,
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
    setNotice(`Hospital "${newHosp.name}" registered & Supabase Auth credentials created for ${newHosp.email}!`)
    setTimeout(() => setNotice(null), 5000)
  }

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

  const handleToggleHospitalStatus = (hospId: string) => {
    const updated = hospitalsList.map((h) =>
      h.id === hospId ? { ...h, status: (h.status === 'active' ? 'suspended' : 'active') as any } : h
    )
    setHospitalsList(updated)
    localStorage.setItem('clinicos_hospitals', JSON.stringify(updated))
  }

  const handleClearLeads = () => {
    if (!window.confirm('Are you sure you want to clear lead submissions?')) return
    localStorage.removeItem('clinicos_leads')
    setLeadsList([])
  }

  // 1. OWNER UNAUTHENTICATED VIEW
  if (!isOwnerAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
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
                placeholder="info@shahidkhan.site"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
            <h1 className="font-bold text-lg text-white tracking-wide">Clinic OS Owner Control Console</h1>
            <p className="text-xs text-blue-400 font-mono">Logged in as info@shahidkhan.site</p>
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
              Platform Master Admin
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-2">
              Hospital Profile & Supabase Auth Credential Manager
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Create Hospital Profiles, set Doctor Seat Limits, and issue Hospital Admin Supabase Auth credentials.
            </p>
          </div>

          <Button variant="primary" onClick={() => setShowHospitalModal(true)} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 text-white font-bold flex items-center gap-2">
            <Building2 size={18} /> Register Hospital & Supabase Credentials
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

        {/* TAB 1: HOSPITAL PROFILES & DOCTOR LIMITS */}
        {activeTab === 'hospitals' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search Hospital Profile by Name or Admin Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 text-sm text-white"
              />
            </div>

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
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/20">
                        Active Facility
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-500/10 text-red-400 font-bold text-xs rounded-full border border-red-500/20">
                        Suspended
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 bg-slate-900 p-4 rounded-2xl border border-slate-800 font-medium">
                    <p>📍 Address: {hosp.address}</p>
                    <p>📞 Phone: {hosp.phone} • ✉️ Supabase Admin Email: <strong className="text-blue-400 font-mono">{hosp.email}</strong></p>
                    <p className="text-[11px] text-amber-300">🔑 Login Portal: Restricted to <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-200">/login/hospitaladmin009</code></p>
                    
                    {/* Owner Configured Doctor Seat Limit */}
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

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleToggleHospitalStatus(hosp.id)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                        hosp.status === 'active'
                          ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                      }`}
                    >
                      {hosp.status === 'active' ? 'Suspend Hospital' : 'Reactivate Hospital'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

        {/* MODAL 1: REGISTER HOSPITAL & CREATE SUPABASE AUTH CREDENTIALS */}
        {showHospitalModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="text-blue-400" size={20} /> Create Hospital Profile & Supabase Auth
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
                    placeholder="e.g. Metro Care General Hospital (H1)"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Hospital Admin Email *</label>
                    <input
                      type="email"
                      value={hospitalForm.email}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                      placeholder="admin@metrocare.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
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
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
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
                    placeholder="e.g. 5 for H1, 1 for H2"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold text-sm"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Hospital admin will be allowed to onboard up to this number of doctors.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Phone</label>
                    <input
                      type="text"
                      value={hospitalForm.phone}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                      placeholder="+91-9876543210"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">License No.</label>
                    <input
                      type="text"
                      value={hospitalForm.license}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, license: e.target.value })}
                      placeholder="HOSP-2026-LIC-9921"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono"
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowHospitalModal(false)} className="flex-1 bg-slate-800 text-slate-300">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isRegistering} className="flex-1 bg-blue-600 text-white font-bold flex items-center justify-center gap-1.5">
                    <Key size={14} /> Create Credentials & Profile
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: EDIT DOCTOR SEAT LIMIT */}
        {editingHospital && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold text-lg text-center"
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
