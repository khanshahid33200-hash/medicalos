import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  Mail,
  UserCheck,
  UserX,
  X
} from 'lucide-react'
import HospitalDashboardLayout from '../../components/hospitaldashboard/HospitalDashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface HospitalUser {
  id: string
  name: string
  email: string
  role: 'Hospital Administrator' | 'OPD Coordinator' | 'Receptionist' | 'Billing Staff'
  status: 'active' | 'inactive'
  lastLogin: string
}

export default function HospitalUsersRolesPage() {
  const { doctorProfile } = useAuth()
  const currentHospId = doctorProfile?.hospital_id || localStorage.getItem('hospital_id') || ''

  const [searchTerm, setSearchTerm] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const [users, setUsers] = useState<HospitalUser[]>([])

  useEffect(() => {
    async function loadUsers() {
      if (!currentHospId) return
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('hospital_id', currentHospId)

        if (data && data.length > 0) {
            const mapped: HospitalUser[] = data.map(u => ({
              id: u.id,
              name: u.full_name || 'Hospital Staff',
              email: u.email || 'staff@hospital.com',
              role: (u.role === 'admin' || u.role === 'hospital_admin' ? 'Hospital Administrator' : u.role === 'doctor' ? 'Hospital Administrator' : 'OPD Coordinator') as any,
              status: u.is_active ? 'active' : 'inactive',
              lastLogin: 'Active recently'
            }))
            setUsers(mapped)
          } else {
            setUsers([])
          }
      } catch (e) {
        setUsers([])
      }
    }
    loadUsers()
  }, [currentHospId])

  const [newInvite, setNewInvite] = useState({
    name: '',
    email: '',
    role: 'OPD Coordinator' as HospitalUser['role']
  })

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    const user: HospitalUser = {
      id: `u-${Date.now()}`,
      name: newInvite.name,
      email: newInvite.email,
      role: newInvite.role,
      status: 'active',
      lastLogin: 'Never (Invited)'
    }
    setUsers([...users, user])
    setShowInviteModal(false)
    setNewInvite({ name: '', email: '', role: 'OPD Coordinator' })
    setNotice(`✓ Invitation sent to ${user.email}!`)
    setTimeout(() => setNotice(null), 4000)
  }

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const next = u.status === 'active' ? 'inactive' : 'active'
        setNotice(`✓ User ${u.name} marked ${next.toUpperCase()}`)
        return { ...u, status: next }
      }
      return u
    }))
    setTimeout(() => setNotice(null), 3000)
  }

  return (
    <HospitalDashboardLayout pageTitle="Users & Roles">
      {notice && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff members by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition"
          >
            <Plus size={15} />
            <span>Invite Team Member</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60">
                <tr>
                  <th className="py-3.5 px-5">Staff Member</th>
                  <th className="py-3.5 px-4">System Role</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-5">
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[11px] text-slate-400 block">{u.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/50">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{u.lastLogin}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      {u.role !== 'Hospital Administrator' && (
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                            u.status === 'active'
                              ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200'
                          }`}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Invite Hospital Staff</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={newInvite.name}
                  onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="staff@hospital.com"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Assignment</label>
                <select
                  value={newInvite.role}
                  onChange={(e) => setNewInvite({ ...newInvite, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option>OPD Coordinator</option>
                  <option>Receptionist</option>
                  <option>Billing Staff</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Send Official Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </HospitalDashboardLayout>
  )
}
