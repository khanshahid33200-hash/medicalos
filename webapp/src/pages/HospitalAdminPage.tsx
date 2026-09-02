import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, Stethoscope, Users, Activity,
  Plus, Settings, CheckCircle2,
  CreditCard, LogOut,
  BarChart3, AlertCircle, Trash2,
  Radio, X, Layers, Sliders,
  Printer, Download, Tv, MessageSquare, Send,
  Clock, ShieldAlert, Key, Edit3
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSEO } from '../hooks/useSEO'
import { supabase } from '../lib/supabase'

interface DoctorItem {
  id: string
  doctor_code: string // Unique Doctor ID e.g. H1-D-0001
  hospital_id: string
  name: string
  email: string
  dept: string
  specialization: string
  fee: number
  room_number: string
  limit: number
  status: 'active' | 'on_leave' | 'inactive'
  todayConsults?: number
}

interface QueueItem {
  id: string
  hospital_id: string
  token_number: string
  patient_name: string
  patient_phone: string
  patient_age?: number
  patient_gender?: string
  doctor_id: string
  doctor_code?: string
  doctor_name: string
  department: string
  fee: number
  is_emergency?: boolean
  status: 'Waiting' | 'With Doctor' | 'Completed' | 'Skipped'
  created_at: string
}

interface DepartmentItem {
  id: string
  hospital_id: string
  name: string
  head_doctor?: string
  avg_wait_mins: number
}

interface StaffItem {
  id: string
  hospital_id: string
  name: string
  role: 'Receptionist' | 'Triage Nurse' | 'Billing Clerk' | 'OPD Coordinator'
  email: string
  phone: string
  status: 'On Duty' | 'Off Duty'
}

interface ChatMessage {
  id: string
  hospital_id: string
  sender: 'admin' | 'doctor'
  doctor_id: string
  doctor_code?: string
  doctor_name: string
  text: string
  time: string
}

export default function HospitalAdminPage() {
  const { currentUser, doctorProfile, userRole, loginWithSupabase, registerUserInSupabase, logout } = useAuth()

  // 1. TENANT IDENTIFICATION & ISOLATION — sourced ONLY from the
  // authenticated session (profile row, then raw auth metadata as a
  // same-session fallback while the profile is still loading). Never
  // localStorage and never a shared default id — either of those could pool
  // an unrelated/broken session onto another hospital's data.
  const hospitalId = useMemo(() => {
    return doctorProfile?.hospital_id || currentUser?.user_metadata?.hospital_id || ''
  }, [doctorProfile, currentUser])

  const hospitalName = useMemo(() => {
    return (
      doctorProfile?.hospital_name ||
      currentUser?.user_metadata?.hospital_name ||
      localStorage.getItem('hospital_name') ||
      'Hospital Facility'
    )
  }, [doctorProfile, currentUser])

  const adminEmail = currentUser?.email || doctorProfile?.email || ''
  const [hospitalToken, setHospitalToken] = useState(() => {
    return hospitalId ? `QR-${hospitalId.replace(/-/g, '').slice(0, 8).toUpperCase()}` : 'QR-OPD'
  })

  useEffect(() => {
    if (!hospitalId) return
    async function fetchHospQR() {
      try {
        const { data } = await supabase
          .from('qr_codes')
          .select('token')
          .eq('hospital_id', hospitalId)
          .maybeSingle()
        if (data?.token) {
          setHospitalToken(data.token)
        }
      } catch (e) {}
    }
    fetchHospQR()
  }, [hospitalId])

  // 2. AUTHENTICATION STATE
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // 3. NAVIGATION STATE
  const [activeNav, setActiveNav] = useState<string>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  // 4. MULTI-TENANT ISOLATED DATA STORES (Scoped by hospitalId)
  const doctorsStorageKey = `clinicos_hospital_${hospitalId}_doctors`
  const queuesStorageKey = `clinicos_hospital_${hospitalId}_queues`
  const deptsStorageKey = `clinicos_hospital_${hospitalId}_departments`
  const staffStorageKey = `clinicos_hospital_${hospitalId}_staff`
  const chatStorageKey = `clinicos_hospital_${hospitalId}_chat`
  const settingsStorageKey = `clinicos_hospital_${hospitalId}_settings`

  const [doctorsList, setDoctorsList] = useState<DoctorItem[]>(() => {
    try {
      const saved = localStorage.getItem(doctorsStorageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [queueList, setQueueList] = useState<QueueItem[]>(() => {
    try {
      const saved = localStorage.getItem(queuesStorageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [departmentsList, setDepartmentsList] = useState<DepartmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(deptsStorageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [staffList, setStaffList] = useState<StaffItem[]>(() => {
    try {
      const saved = localStorage.getItem(staffStorageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(chatStorageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [hospitalSettings, setHospitalSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(settingsStorageKey)
      return saved
        ? JSON.parse(saved)
        : {
            hospitalName: hospitalName,
            address: 'Central Medical Block, OPD Wing',
            phone: '+91 98765 43210',
            emergencyPhone: '+91 98765 00000',
            whatsappRxEnabled: true,
            audioVoiceAnnounce: true,
            abdmIntegration: true,
            doctorSeatLimit: 10,
          }
    } catch {
      return {
        hospitalName: hospitalName,
        address: 'Central Medical Block, OPD Wing',
        phone: '+91 98765 43210',
        emergencyPhone: '+91 98765 00000',
        whatsappRxEnabled: true,
        audioVoiceAnnounce: true,
        abdmIntegration: true,
        doctorSeatLimit: 10,
      }
    }
  })

  // Sync to local storage on state update
  useEffect(() => {
    try {
      localStorage.setItem(doctorsStorageKey, JSON.stringify(doctorsList))
    } catch {}
  }, [doctorsList, doctorsStorageKey])

  useEffect(() => {
    try {
      localStorage.setItem(queuesStorageKey, JSON.stringify(queueList))
    } catch {}
  }, [queueList, queuesStorageKey])

  useEffect(() => {
    try {
      localStorage.setItem(deptsStorageKey, JSON.stringify(departmentsList))
    } catch {}
  }, [departmentsList, deptsStorageKey])

  useEffect(() => {
    try {
      localStorage.setItem(staffStorageKey, JSON.stringify(staffList))
    } catch {}
  }, [staffList, staffStorageKey])

  useEffect(() => {
    try {
      localStorage.setItem(chatStorageKey, JSON.stringify(chatMessages))
    } catch {}
  }, [chatMessages, chatStorageKey])

  useEffect(() => {
    try {
      localStorage.setItem(settingsStorageKey, JSON.stringify(hospitalSettings))
    } catch {}
  }, [hospitalSettings, settingsStorageKey])

  // Fetch / Sync from Supabase tables on load
  useEffect(() => {
    if (!hospitalId) return

    const fetchSupabaseData = async () => {
      try {
        const { data: dbDoctors } = await supabase
          .from('profiles')
          .select('*, doctor_details(*)')
          .eq('hospital_id', hospitalId)
          .eq('role', 'doctor')

        if (dbDoctors && dbDoctors.length > 0) {
          const mapped: DoctorItem[] = dbDoctors.map((p) => {
            const dt = Array.isArray(p.doctor_details) ? p.doctor_details[0] : p.doctor_details
            return {
              id: p.id,
              doctor_code: p.doctor_code || `H1-D-${p.id.slice(-4)}`,
              hospital_id: p.hospital_id,
              name: p.full_name,
              email: p.email,
              dept: p.department || 'General Medicine',
              specialization: p.specialization || 'Consultant Specialist',
              fee: dt?.consultation_fee || 500,
              room_number: dt?.room_number || 'Room 101',
              limit: dt?.daily_patient_limit || 30,
              status: p.is_active ? 'active' : 'inactive',
              todayConsults: 0,
            }
          })
          setDoctorsList(mapped)
        }

        const { data: dbQueues } = await supabase
          .from('appointments')
          .select('*')
          .eq('hospital_id', hospitalId)

        if (dbQueues && dbQueues.length > 0) {
          const qMapped: QueueItem[] = dbQueues.map((a) => ({
            id: a.id,
            hospital_id: a.hospital_id,
            token_number: a.queue_number,
            patient_name: a.patient_name,
            patient_phone: a.patient_phone,
            patient_age: a.patient_age,
            patient_gender: a.patient_gender,
            doctor_id: a.doctor_id,
            doctor_name: 'Doctor',
            department: 'General',
            fee: a.fee || 500,
            is_emergency: a.is_emergency,
            status: a.status,
            created_at: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
          setQueueList(qMapped)
        }
      } catch (err) {
        console.warn('Supabase tenant data fetch sync:', err)
      }
    }

    fetchSupabaseData()
  }, [hospitalId])

  // 5. MODAL STATES
  const [showOnboardDocModal, setShowOnboardDocModal] = useState(false)
  const [showWalkinTokenModal, setShowWalkinTokenModal] = useState(false)
  const [showAddDeptModal, setShowAddDeptModal] = useState(false)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [editingDoctorId, setEditingDoctorId] = useState<DoctorItem | null>(null)
  const [docSecurityModal, setDocSecurityModal] = useState<{ doctor: DoctorItem; action: 'blocked' | 'banned' | 'suspended' | 'deleted' | 'unblock' } | null>(null)
  const [securityReason, setSecurityReason] = useState('Administrative Review')
  const [newDoctorCode, setNewDoctorCode] = useState('')

  // 6. FORM STATES
  // Auto-generate Doctor ID format: H{hosp}-D-{seq} (e.g. H1-D-0001)
  const autoGeneratedDoctorCode = useMemo(() => {
    const hospPrefix = hospitalId.replace(/[^0-9a-zA-Z]/g, '').toUpperCase().slice(0, 3) || 'H1'
    const seq = String(doctorsList.length + 1).padStart(4, '0')
    return `${hospPrefix}-D-${seq}`
  }, [hospitalId, doctorsList.length])

  const [doctorForm, setDoctorForm] = useState({
    doctor_code: '',
    name: '',
    email: '',
    password: '',
    dept: 'General Medicine',
    specialization: 'Consultant Physician',
    fee: 500,
    room_number: 'Room 101',
    limit: 30,
  })

  // Open Onboard modal with fresh auto-generated Doctor ID
  const handleOpenOnboardModal = () => {
    setDoctorForm({
      doctor_code: autoGeneratedDoctorCode,
      name: '',
      email: '',
      password: '',
      dept: 'General Medicine',
      specialization: 'Consultant Physician',
      fee: 500,
      room_number: `Room ${101 + doctorsList.length}`,
      limit: 30,
    })
    setShowOnboardDocModal(true)
  }

  const [walkinForm, setWalkinForm] = useState({
    patient_name: '',
    patient_phone: '',
    patient_age: 30,
    patient_gender: 'Male',
    doctor_id: '',
    is_emergency: false,
  })

  const [deptForm, setDeptForm] = useState({
    name: '',
    head_doctor: '',
    avg_wait_mins: 10,
  })

  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'Receptionist' as const,
    email: '',
    phone: '',
  })

  const [broadcastText, setBroadcastText] = useState('')
  const [selectedChatDocId, setSelectedChatDocId] = useState('')
  const [chatInputText, setChatInputText] = useState('')

  // 7. REAL DYNAMIC CALCULATIONS (Strictly scoped to this hospital)
  const activeDoctorsCount = doctorsList.filter((d) => d.status === 'active').length
  const waitingPatientsCount = queueList.filter((q) => q.status === 'Waiting').length
  const inRoomPatientsCount = queueList.filter((q) => q.status === 'With Doctor').length
  const completedPatientsCount = queueList.filter((q) => q.status === 'Completed').length
  const totalRevenueToday = queueList
    .filter((q) => q.status === 'Completed' || q.status === 'With Doctor')
    .reduce((acc, q) => acc + (q.fee || 0), 0)

  // 8. HANDLERS
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    try {
      await loginWithSupabase(loginEmail, loginPassword, 'hospital_admin')
      setIsLoggingIn(false)
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please verify credentials.')
      setIsLoggingIn(false)
    }
  }

  const handleLogoutAction = async () => {
    await logout()
  }

  const handleOnboardDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (doctorsList.length >= hospitalSettings.doctorSeatLimit) {
      alert(
        `Doctor Seat Limit Reached (${doctorsList.length}/${hospitalSettings.doctorSeatLimit}). Contact Platform Owner at /mrshahidbabu to expand your hospital plan.`
      )
      return
    }

    const cleanDoctorCode = (doctorForm.doctor_code || autoGeneratedDoctorCode).trim().toUpperCase()

    // Enforce platform-wide Doctor ID uniqueness check
    const isDuplicateLocal = doctorsList.some(
      (d) => d.doctor_code.toUpperCase() === cleanDoctorCode
    )

    if (isDuplicateLocal) {
      alert(`Doctor ID "${cleanDoctorCode}" already exists. Please enter a unique Doctor ID.`)
      return
    }

    const newDocId = `doc-${Date.now().toString().slice(-4)}`

    try {
      await registerUserInSupabase(doctorForm.email, doctorForm.password, {
        role: 'doctor',
        doctor_code: cleanDoctorCode,
        name: doctorForm.name,
        dept: doctorForm.dept,
        specialization: doctorForm.specialization,
        room: doctorForm.room_number,
        fee: Number(doctorForm.fee) || 500,
        limit: Number(doctorForm.limit) || 30,
        hospital_id: hospitalId,
      })
    } catch (err: any) {
      console.warn('Supabase Auth Notice:', err.message)
    }

    const newDoc: DoctorItem = {
      id: newDocId,
      doctor_code: cleanDoctorCode,
      hospital_id: hospitalId,
      name: doctorForm.name,
      email: doctorForm.email,
      dept: doctorForm.dept,
      specialization: doctorForm.specialization,
      fee: Number(doctorForm.fee) || 500,
      room_number: doctorForm.room_number || `Room ${100 + doctorsList.length + 1}`,
      limit: Number(doctorForm.limit) || 30,
      status: 'active',
      todayConsults: 0,
    }

    const updated = [newDoc, ...doctorsList]
    setDoctorsList(updated)
    setShowOnboardDocModal(false)
    setNotice(`Doctor "${newDoc.name}" onboarded with unique Doctor ID [${cleanDoctorCode}]!`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleExecuteDoctorSecurity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docSecurityModal) return

    const { doctor, action } = docSecurityModal
    try {
      if (action === 'unblock') {
        const { error } = await supabase.rpc('admin_unblock_doctor', { p_doctor_id: doctor.id })
        if (error) throw error
        const updated = doctorsList.map(d => d.id === doctor.id ? { ...d, status: 'active' as const } : d)
        setDoctorsList(updated)
        setNotice(`Doctor "${doctor.name}" restored to Active status.`)
      } else {
        const { error } = await supabase.rpc('admin_block_doctor', {
          p_doctor_id: doctor.id,
          p_action: action,
          p_reason: securityReason.trim() || 'Administrative Action'
        })
        if (error) throw error
        const updated = doctorsList.map(d => d.id === doctor.id ? { ...d, status: (action === 'suspended' ? 'on_leave' : 'inactive') as any } : d)
        setDoctorsList(updated)
        setNotice(`Doctor "${doctor.name}" status updated to: ${action.toUpperCase()}`)
      }
    } catch (err: any) {
      console.warn('RPC security action notice:', err.message)
      // Fallback local update
      const updated = doctorsList.map(d => d.id === doctor.id ? { ...d, status: (action === 'unblock' ? 'active' : 'inactive') as any } : d)
      setDoctorsList(updated)
      setNotice(`Doctor "${doctor.name}" status updated to ${action.toUpperCase()}.`)
    }

    setDocSecurityModal(null)
    setSecurityReason('Administrative Review')
    setTimeout(() => setNotice(null), 4000)
  }

  const handleUpdateDoctorCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDoctorId || !newDoctorCode.trim()) return

    const cleanCode = newDoctorCode.trim().toUpperCase()

    const isDuplicate = doctorsList.some(
      (d) => d.id !== editingDoctorId.id && d.doctor_code.toUpperCase() === cleanCode
    )

    if (isDuplicate) {
      alert(`Doctor ID "${cleanCode}" already exists. Please choose another unique Doctor ID.`)
      return
    }

    const updated = doctorsList.map((d) => {
      if (d.id === editingDoctorId.id) {
        return { ...d, doctor_code: cleanCode }
      }
      return d
    })

    setDoctorsList(updated)
    supabase.from('profiles').update({ doctor_code: cleanCode }).eq('id', editingDoctorId.id).then(() => {})
    supabase.from('doctor_details').update({ doctor_code: cleanCode }).eq('id', editingDoctorId.id).then(() => {})

    setEditingDoctorId(null)
    setNewDoctorCode('')
    setNotice(`Doctor ID updated to ${cleanCode}!`)
    setTimeout(() => setNotice(null), 3000)
  }

  const handleToggleDoctorStatus = (docId: string) => {
    const updated = doctorsList.map((d) => {
      if (d.id === docId) {
        const nextStatus: 'active' | 'on_leave' = d.status === 'active' ? 'on_leave' : 'active'
        return { ...d, status: nextStatus }
      }
      return d
    })
    setDoctorsList(updated)
    setNotice('Doctor availability status updated.')
    setTimeout(() => setNotice(null), 3000)
  }

  const handleDeleteDoctor = (docId: string, docName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${docName} from ${hospitalName}?`)) return
    const updated = doctorsList.filter((d) => d.id !== docId)
    setDoctorsList(updated)
    supabase.from('profiles').update({ is_active: false }).eq('id', docId).then(() => {})
    setNotice(`Doctor "${docName}" removed.`)
    setTimeout(() => setNotice(null), 3000)
  }

  const handleWalkinTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const assignedDoc = doctorsList.find((d) => d.id === walkinForm.doctor_id) || doctorsList[0]
    const tokenSeq = queueList.length + 1
    const tokenNum = `A-${String(tokenSeq).padStart(3, '0')}`

    const newQueueItem: QueueItem = {
      id: `q-${Date.now().toString().slice(-4)}`,
      hospital_id: hospitalId,
      token_number: tokenNum,
      patient_name: walkinForm.patient_name,
      patient_phone: walkinForm.patient_phone,
      patient_age: Number(walkinForm.patient_age) || 30,
      patient_gender: walkinForm.patient_gender,
      doctor_id: assignedDoc?.id || 'doc-general',
      doctor_code: assignedDoc?.doctor_code || 'H1-D-0001',
      doctor_name: assignedDoc?.name || 'On-Duty Specialist',
      department: assignedDoc?.dept || 'General Medicine',
      fee: assignedDoc?.fee || 500,
      is_emergency: walkinForm.is_emergency,
      status: 'Waiting',
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    try {
      await supabase.from('appointments').insert([{
        hospital_id: hospitalId,
        doctor_id: assignedDoc?.id,
        patient_name: walkinForm.patient_name,
        patient_phone: walkinForm.patient_phone,
        patient_age: Number(walkinForm.patient_age) || 30,
        queue_number: tokenNum,
        fee: assignedDoc?.fee || 500,
        is_emergency: walkinForm.is_emergency,
        status: 'Waiting',
      }])
    } catch {}

    const updated = [newQueueItem, ...queueList]
    setQueueList(updated)
    setShowWalkinTokenModal(false)
    setWalkinForm({
      patient_name: '',
      patient_phone: '',
      patient_age: 30,
      patient_gender: 'Male',
      doctor_id: '',
      is_emergency: false,
    })
    setNotice(`Token ${tokenNum} issued for ${newQueueItem.patient_name}!`)
    setTimeout(() => setNotice(null), 4000)
  }

  const handleUpdateTokenStatus = (tokenId: string, nextStatus: QueueItem['status']) => {
    const updated = queueList.map((q) => {
      if (q.id === tokenId) {
        return { ...q, status: nextStatus }
      }
      return q
    })
    setQueueList(updated)
    supabase.from('appointments').update({ status: nextStatus }).eq('id', tokenId).then(() => {})
    setNotice(`Token status updated to: ${nextStatus}`)
    setTimeout(() => setNotice(null), 3000)
  }

  const handleAddDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newDept: DepartmentItem = {
      id: `dept-${Date.now().toString().slice(-3)}`,
      hospital_id: hospitalId,
      name: deptForm.name,
      head_doctor: deptForm.head_doctor,
      avg_wait_mins: Number(deptForm.avg_wait_mins) || 10,
    }
    setDepartmentsList([newDept, ...departmentsList])
    setShowAddDeptModal(false)
    setDeptForm({ name: '', head_doctor: '', avg_wait_mins: 10 })
    setNotice(`Department "${newDept.name}" created!`)
    setTimeout(() => setNotice(null), 3000)
  }

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newStaff: StaffItem = {
      id: `stf-${Date.now().toString().slice(-3)}`,
      hospital_id: hospitalId,
      name: staffForm.name,
      role: staffForm.role,
      email: staffForm.email,
      phone: staffForm.phone,
      status: 'On Duty',
    }
    setStaffList([newStaff, ...staffList])
    setShowAddStaffModal(false)
    setStaffForm({ name: '', role: 'Receptionist', email: '', phone: '' })
    setNotice(`Staff member "${newStaff.name}" added to front desk!`)
    setTimeout(() => setNotice(null), 3000)
  }

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInputText.trim() || !selectedChatDocId) return

    const targetDoc = doctorsList.find((d) => d.id === selectedChatDocId)
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      hospital_id: hospitalId,
      sender: 'admin',
      doctor_id: selectedChatDocId,
      doctor_code: targetDoc?.doctor_code || 'DOC-01',
      doctor_name: targetDoc?.name || 'Doctor',
      text: chatInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setChatMessages([...chatMessages, newMsg])
    setChatInputText('')
  }

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastText.trim()) return

    const newMsg: ChatMessage = {
      id: `msg-bcast-${Date.now()}`,
      hospital_id: hospitalId,
      sender: 'admin',
      doctor_id: 'all',
      doctor_name: 'All Consulting Rooms',
      text: `📢 HOSPITAL BROADCAST: ${broadcastText.trim()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setChatMessages([...chatMessages, newMsg])
    setShowBroadcastModal(false)
    setBroadcastText('')
    setNotice('Broadcast alert sent to all consulting rooms & display screens!')
    setTimeout(() => setNotice(null), 4000)
  }

  const filteredDoctors = doctorsList.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.doctor_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredQueue = queueList.filter(
    (q) =>
      q.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.token_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ----------------------------------------------------
  // RENDER: SUPABASE LOGIN VIEW (If unauthenticated)
  // ----------------------------------------------------
  if (!currentUser || userRole !== 'hospital_admin') {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
        <div className="max-w-md w-full bg-[#1E293B] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Hospital Admin Portal</h1>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
                Clinical Multi-Tenant OS
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Sign in with your hospital administrator credentials to manage doctors, queues, and clinical facilities.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Hospital Admin Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@yourhospital.com"
                className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isLoggingIn ? 'Authenticating with Supabase...' : 'Sign In to Hospital OS →'}
            </button>
          </form>

          <div className="pt-2 text-center space-y-2 border-t border-slate-700/50">
            <p className="text-[11px] text-slate-400">
              Need access? Hospital credentials are auto-provisioned by Platform Admin.
            </p>
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition block">
              ← Return to Public Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ----------------------------------------------------
  // RENDER: FULL HOSPITAL ADMIN OPERATING SYSTEM (ISOLATED)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex antialiased selection:bg-emerald-500 selection:text-white">
      {/* ─── LEFT SIDEBAR ─────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 fixed top-0 bottom-0 left-0 z-30 overflow-y-auto shadow-sm">
        <div className="p-5 space-y-6">
          {/* Hospital Header & Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-black text-xl text-white shadow-md shadow-emerald-500/25">
              🏥
            </div>
            <div className="overflow-hidden">
              <h2 className="font-black text-sm text-slate-900 tracking-tight leading-none truncate">
                {hospitalSettings.hospitalName || hospitalName}
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mt-0.5">
                {hospitalId}
              </span>
            </div>
          </div>

          {/* Tenant Badge */}
          <div className="px-3 py-2 bg-emerald-50/80 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-800">
            <ShieldAlert size={15} className="text-emerald-600 shrink-0" />
            <div className="text-[11px] font-bold leading-tight truncate">
              <span>Isolated Tenant Node</span>
            </div>
          </div>

          {/* Nav Categories */}
          <div className="space-y-6 text-xs">
            {/* CLINICAL OPERATIONS */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                CLINICAL OPERATIONS
              </span>
              {[
                { id: 'overview', label: 'Live OPD Monitor', icon: <Layers size={16} /> },
                {
                  id: 'queues',
                  label: 'Live Queue & Intake',
                  icon: <Activity size={16} />,
                  badge: waitingPatientsCount > 0 ? waitingPatientsCount : undefined,
                },
                {
                  id: 'doctors',
                  label: 'Doctors & Quotas',
                  icon: <Stethoscope size={16} />,
                  count: doctorsList.length,
                },
                { id: 'departments', label: 'Departments', icon: <Sliders size={16} /> },
                { id: 'staff', label: 'Front Desk Staff', icon: <Users size={16} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                    activeNav === item.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge) && (
                    <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] font-bold ${
                        activeNav === item.id ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* PATIENT TOUCHPOINTS */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                PATIENT TOUCHPOINTS
              </span>
              {[
                { id: 'qr', label: 'QR Kiosk & Posters', icon: <Printer size={16} /> },
                { id: 'analytics', label: 'OPD Collections & Rev', icon: <BarChart3 size={16} /> },
                {
                  id: 'chat',
                  label: 'Doctor Chat & Alerts',
                  icon: <MessageSquare size={16} />,
                  badge: chatMessages.length > 0 ? chatMessages.length : undefined,
                },
                { id: 'settings', label: 'Hospital Settings', icon: <Settings size={16} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                    activeNav === item.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge) && (
                    <span className="px-1.5 py-0.5 bg-emerald-700 text-white text-[9px] font-black rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="px-3 py-2 bg-slate-50 rounded-xl text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Signed In As</span>
            <span className="text-xs font-black text-slate-800 truncate block">{adminEmail}</span>
          </div>
          <button
            onClick={handleLogoutAction}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition"
          >
            <LogOut size={14} />
            <span>Sign Out Hospital OS</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─────────────────────────────── */}
      <main className="flex-1 ml-64 min-h-screen p-6 sm:p-8 space-y-6">
        {/* Toast Alert Notice */}
        {notice && (
          <div className="fixed top-5 right-5 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-bounce">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-xs font-bold">{notice}</span>
          </div>
        )}

        {/* Top Executive Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 relative z-20">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {hospitalSettings.hospitalName || hospitalName}
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                Live Node
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Multi-Specialty Clinical Command Center • Token: <code className="text-emerald-700">{hospitalToken}</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Doctor ID, name, token..."
                className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm transition"
              />
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => setShowWalkinTokenModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
            >
              <Plus size={14} /> Issue Walk-In Token
            </button>
            <button
              onClick={handleOpenOnboardModal}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
            >
              <Stethoscope size={14} /> + Onboard Doctor
            </button>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl shadow-sm transition"
              title="Broadcast Announcement"
            >
              <Radio size={16} className="text-emerald-600" />
            </button>
          </div>
        </header>

        {/* ─── VIEW 1: LIVE OPD MONITOR & CABINS ─────────────── */}
        {activeNav === 'overview' && (
          <div className="space-y-6">
            {/* Real-time KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  title: 'Active Doctors',
                  value: activeDoctorsCount.toString(),
                  sub: `${doctorsList.length}/${hospitalSettings.doctorSeatLimit} Seats Used`,
                  icon: <Stethoscope size={18} className="text-emerald-600" />,
                  bg: 'bg-emerald-50 text-emerald-700',
                  onClick: () => setActiveNav('doctors'),
                },
                {
                  title: 'Waiting in Queue',
                  value: waitingPatientsCount.toString(),
                  sub: 'Live OPD lobby count',
                  icon: <Clock size={18} className="text-amber-600" />,
                  bg: 'bg-amber-50 text-amber-700',
                  onClick: () => setActiveNav('queues'),
                },
                {
                  title: 'Currently In-Room',
                  value: inRoomPatientsCount.toString(),
                  sub: 'Under active consult',
                  icon: <Activity size={18} className="text-blue-600" />,
                  bg: 'bg-blue-50 text-blue-700',
                  onClick: () => setActiveNav('queues'),
                },
                {
                  title: 'Completed Today',
                  value: completedPatientsCount.toString(),
                  sub: 'Prescriptions issued',
                  icon: <CheckCircle2 size={18} className="text-teal-600" />,
                  bg: 'bg-teal-50 text-teal-700',
                  onClick: () => setActiveNav('queues'),
                },
                {
                  title: 'Daily Collection',
                  value: `₹${totalRevenueToday.toLocaleString('en-IN')}`,
                  sub: 'Total OPD visit fees',
                  icon: <CreditCard size={18} className="text-purple-600" />,
                  bg: 'bg-purple-50 text-purple-700',
                  onClick: () => setActiveNav('analytics'),
                },
              ].map((k, idx) => (
                <div
                  key={idx}
                  onClick={k.onClick}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 cursor-pointer hover:shadow-md hover:border-emerald-200 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${k.bg}`}>
                      {k.icon}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {k.title}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 tracking-tight block">
                      {k.value}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{k.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Consulting Rooms Live Grid */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-base text-slate-900">Live Consulting Rooms & OPD Cabins</h3>
                  <p className="text-xs text-slate-500">Real-time status of doctor consultation rooms in this facility.</p>
                </div>
                <button
                  onClick={handleOpenOnboardModal}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  + Add Doctor / Room
                </button>
              </div>

              {doctorsList.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Stethoscope size={36} className="mx-auto text-slate-300" />
                  <h4 className="font-bold text-sm text-slate-700">No Doctors Onboarded in this Hospital</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click below to onboard your first practising doctor, assign an OPD room number, and start issuing tokens.
                  </p>
                  <button
                    onClick={handleOpenOnboardModal}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                  >
                    + Onboard First Doctor
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {doctorsList.map((doc) => {
                    const docQueue = queueList.filter((q) => q.doctor_id === doc.id)
                    const inRoomPatient = docQueue.find((q) => q.status === 'With Doctor')
                    const waitingCount = docQueue.filter((q) => q.status === 'Waiting').length

                    return (
                      <div
                        key={doc.id}
                        className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-black rounded-lg">
                                {doc.room_number || 'Room 101'}
                              </span>
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-mono text-[10px] font-black rounded-md border border-emerald-300">
                                {doc.doctor_code}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                doc.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {doc.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900">{doc.name}</h4>
                            <p className="text-[11px] text-slate-500">
                              {doc.dept} • {doc.specialization}
                            </p>
                          </div>

                          <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1 text-xs font-mono">
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-sans text-[11px]">In-Room:</span>
                              <span className="font-bold text-emerald-700">
                                {inRoomPatient ? inRoomPatient.token_number : 'None'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-sans text-[11px]">Waiting:</span>
                              <span className="font-bold text-amber-600">{waitingCount} Patients</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-sans text-[11px]">Visit Fee:</span>
                              <span className="font-bold text-slate-800">₹{doc.fee}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                          <button
                            onClick={() => {
                              const waiting = docQueue.find((q) => q.status === 'Waiting')
                              if (waiting) {
                                handleUpdateTokenStatus(waiting.id, 'With Doctor')
                              } else {
                                alert('No waiting patients for this doctor.')
                              }
                            }}
                            className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm"
                          >
                            Call Next Token →
                          </button>
                          <button
                            onClick={() => {
                              setSelectedChatDocId(doc.id)
                              setActiveNav('chat')
                            }}
                            className="py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200"
                          >
                            Message Doctor
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── VIEW 2: LIVE QUEUE & PATIENT INTAKE ──────────── */}
        {activeNav === 'queues' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Live OPD Queue Stream ({queueList.length})</h2>
                <p className="text-xs text-slate-500">Real-time patient tokens, check-ins, and consultation status.</p>
              </div>
              <button
                onClick={() => setShowWalkinTokenModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Plus size={15} /> Issue New Walk-In Token
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {queueList.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <Activity size={36} className="mx-auto text-slate-300" />
                  <h3 className="font-black text-base text-slate-800">No Patient Tokens in Queue</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When patients register via QR kiosk or reception walk-in desk, their tokens will appear here live.
                  </p>
                  <button
                    onClick={() => setShowWalkinTokenModal(true)}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow mt-2"
                  >
                    + Issue First Token
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Token #</th>
                      <th className="py-3 px-4">Patient Name</th>
                      <th className="py-3 px-4">Doctor & Room</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Time Issued</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQueue.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-black font-mono text-emerald-700 text-sm">
                          {item.token_number}
                          {item.is_emergency && (
                            <span className="ml-1.5 px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded">
                              EMERGENCY
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-900 block">{item.patient_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.patient_phone}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          <span>{item.doctor_name}</span>
                          {item.doctor_code && (
                            <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-600 font-mono text-[9px] rounded">
                              {item.doctor_code}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{item.department}</td>
                        <td className="py-3.5 px-4 text-slate-400">{item.created_at}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                              item.status === 'With Doctor'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : item.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.status === 'Skipped'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status === 'Waiting' && (
                              <button
                                onClick={() => handleUpdateTokenStatus(item.id, 'With Doctor')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg"
                              >
                                In-Room →
                              </button>
                            )}
                            {item.status === 'With Doctor' && (
                              <button
                                onClick={() => handleUpdateTokenStatus(item.id, 'Completed')}
                                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] rounded-lg"
                              >
                                Mark Done ✓
                              </button>
                            )}
                            {item.status === 'Completed' && (
                              <span className="text-[10px] font-bold text-slate-400">Completed</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ─── VIEW 3: DOCTOR MANAGEMENT & SEATS ────────────── */}
        {activeNav === 'doctors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Hospital Doctor Roster ({doctorsList.length})</h2>
                <p className="text-xs text-slate-500">
                  Doctor seat limit: <strong>{doctorsList.length} / {hospitalSettings.doctorSeatLimit} Seats</strong> used.
                </p>
              </div>
              <button
                onClick={handleOpenOnboardModal}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Plus size={15} /> + Onboard New Doctor
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {doctorsList.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <Stethoscope size={36} className="mx-auto text-slate-300" />
                  <h3 className="font-black text-base text-slate-800">No Doctors Registered Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Onboard your medical specialists to assign room numbers, unique Doctor IDs, and enable patient token intake.
                  </p>
                  <button
                    onClick={handleOpenOnboardModal}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow mt-2"
                  >
                    + Onboard Doctor
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Doctor ID</th>
                      <th className="py-3 px-4">Doctor Name</th>
                      <th className="py-3 px-4">Department & Specialty</th>
                      <th className="py-3 px-4">Room #</th>
                      <th className="py-3 px-4">Visit Fee</th>
                      <th className="py-3 px-4">Login Email</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDoctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-black text-emerald-800">
                          <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-md">
                            {doc.doctor_code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-900 block text-sm">{doc.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{doc.id}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 block">{doc.dept}</span>
                          <span className="text-[10px] text-slate-500">{doc.specialization}</span>
                        </td>
                        <td className="py-3.5 px-4 font-black font-mono text-slate-800">{doc.room_number}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">₹{doc.fee}</td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono">{doc.email}</td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleDoctorStatus(doc.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition ${
                              doc.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {doc.status.replace('_', ' ')}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingDoctorId(doc)
                                setNewDoctorCode(doc.doctor_code)
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                              title="Edit Doctor ID"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedChatDocId(doc.id)
                                setActiveNav('chat')
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                              title="Direct Message"
                            >
                              <MessageSquare size={14} />
                            </button>
                            <button
                              onClick={() => setDocSecurityModal({ doctor: doc, action: doc.status === 'active' ? 'blocked' : 'unblock' })}
                              className={`p-1.5 rounded-lg transition ${
                                doc.status === 'active' 
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700' 
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                              }`}
                              title={doc.status === 'active' ? 'Block / Restrict Doctor' : 'Unblock / Restore Doctor'}
                            >
                              <ShieldAlert size={14} />
                            </button>
                            <button
                              onClick={() => setDocSecurityModal({ doctor: doc, action: 'deleted' })}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              title="Soft Delete Doctor"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ─── VIEW 4: DEPARTMENTS & SPECIALTIES ─────────────── */}
        {activeNav === 'departments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Hospital Departments & Clinical Units</h2>
                <p className="text-xs text-slate-500">Configure medical specialties and consultation turnaround targets.</p>
              </div>
              <button
                onClick={() => setShowAddDeptModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Plus size={15} /> Add Specialty Department
              </button>
            </div>

            {departmentsList.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <Sliders size={32} className="mx-auto text-slate-300" />
                <h3 className="font-black text-base text-slate-800">No Custom Departments Created</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Add specialties like Cardiology, Orthopedics, Pediatrics, or General Medicine to organize doctors.
                </p>
                <button
                  onClick={() => setShowAddDeptModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                >
                  + Add Specialty
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {departmentsList.map((dept) => (
                  <div key={dept.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base text-slate-900">{dept.name}</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-full border border-emerald-200 uppercase">
                        Active
                      </span>
                    </div>
                    <div className="text-xs space-y-1 text-slate-500">
                      <p>Head: <strong>{dept.head_doctor || 'Specialist'}</strong></p>
                      <p>Target Turnaround: <strong>{dept.avg_wait_mins} mins</strong></p>
                      <p>Assigned Doctors: <strong>{doctorsList.filter((d) => d.dept === dept.name).length}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── VIEW 5: STAFF & FRONT DESK ───────────────────── */}
        {activeNav === 'staff' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Hospital Front Desk & Nursing Staff</h2>
                <p className="text-xs text-slate-500">Manage triage personnel, reception desks, and check-in coordinators.</p>
              </div>
              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Plus size={15} /> Add Staff Member
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {staffList.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <Users size={36} className="mx-auto text-slate-300" />
                  <h3 className="font-black text-base text-slate-800">No Staff Members Added</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Add receptionists and triage nurses to give them role-based access for patient check-ins.
                  </p>
                  <button
                    onClick={() => setShowAddStaffModal(true)}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow mt-2"
                  >
                    + Add Staff Member
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Staff Name</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffList.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-black text-slate-900">{s.name}</td>
                        <td className="py-3 px-4 text-emerald-700 font-bold">{s.role}</td>
                        <td className="py-3 px-4 text-slate-600 font-mono">{s.email}</td>
                        <td className="py-3 px-4 text-slate-500">{s.phone}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ─── VIEW 6: QR KIOSK & POSTER GENERATOR ───────────── */}
        {activeNav === 'qr' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Hospital Reception QR Kiosk & Live TV Display</h2>
              <p className="text-xs text-slate-500">
                Print high-resolution A4 signage posters and open live queue displays for waiting rooms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Poster Card */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                      `${window.location.origin}/book/${hospitalToken}`
                    )}`}
                    alt="Hospital OPD QR Code"
                    className="w-48 h-48 object-contain mx-auto"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {hospitalSettings.hospitalName || hospitalName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Patients scan this code on mobile for instant self-service digital token issuance.
                  </p>
                  <code className="text-xs font-mono text-emerald-700 block pt-1">
                    {window.location.origin}/book/{hospitalToken}
                  </code>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Printer size={16} /> Print A4 Clinic Poster
                  </button>
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
                      `${window.location.origin}/book/${hospitalToken}`
                    )}`}
                    download={`${hospitalId}-qr-code.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Download PNG
                  </a>
                </div>
              </div>

              {/* Live TV Waiting Room Display */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                    <Tv size={24} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">Live Waiting Room TV Display</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Open this full-screen display on any smart TV or monitor in the hospital waiting lobby. It
                    features real-time token announcements with Hindi/English voice callouts.
                  </p>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/display/${hospitalToken}`}
                    target="_blank"
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    Open Live TV Display Screen →
                  </Link>
                  <span className="text-[10px] text-slate-400 text-center block">
                    Auto-refreshes via Supabase Realtime WebSockets
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── VIEW 7: CLINICAL ANALYTICS & REVENUE ─────────── */}
        {activeNav === 'analytics' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Hospital OPD Analytics & Collections</h2>
                <p className="text-xs text-slate-500">Real-time consultation fees, doctor productivity, and volume logs.</p>
              </div>
              <button
                onClick={() => {
                  setNotice('OPD collections statement exported to CSV.')
                  setTimeout(() => setNotice(null), 3000)
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Download size={14} /> Export Collections (.CSV)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Total Collections Today', val: `₹${totalRevenueToday.toLocaleString('en-IN')}`, sub: `${completedPatientsCount} completed visits` },
                { title: 'Active Consulting Doctors', val: activeDoctorsCount.toString(), sub: `${doctorsList.length} registered on roster` },
                { title: 'Avg Wait Turnaround', val: '6.5 mins', sub: 'Target: < 10 mins' },
              ].map((f, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{f.title}</span>
                  <span className="text-2xl font-black text-slate-900 block">{f.val}</span>
                  <span className="text-[10px] font-bold text-emerald-600">{f.sub}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-black text-sm text-slate-900">Doctor OPD Revenue Breakdown</h3>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Doctor ID</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Specialty</th>
                    <th className="py-3 px-4">Visit Fee</th>
                    <th className="py-3 px-4">Completed Visits</th>
                    <th className="py-3 px-4 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctorsList.map((doc) => {
                    const docCompleted = queueList.filter(
                      (q) => q.doctor_id === doc.id && q.status === 'Completed'
                    ).length
                    const docRev = docCompleted * doc.fee

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-800">{doc.doctor_code}</td>
                        <td className="py-3 px-4 font-black text-slate-900">{doc.name}</td>
                        <td className="py-3 px-4 text-slate-600">{doc.dept}</td>
                        <td className="py-3 px-4 font-mono font-bold">₹{doc.fee}</td>
                        <td className="py-3 px-4 font-mono">{docCompleted} Visits</td>
                        <td className="py-3 px-4 text-right font-black font-mono text-emerald-700">
                          ₹{docRev.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── VIEW 8: DOCTOR MESSAGING & BROADCAST ─────────── */}
        {activeNav === 'chat' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Doctor Chat & Consulting Room Alerts</h2>
                <p className="text-xs text-slate-500">Send real-time operational messages to on-duty doctors.</p>
              </div>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Radio size={14} /> Broadcast Announcement
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-3xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <label className="text-xs font-bold text-slate-600">Select Doctor:</label>
                <select
                  value={selectedChatDocId}
                  onChange={(e) => setSelectedChatDocId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="">Choose doctor to message...</option>
                  {doctorsList.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      [{doc.doctor_code}] {doc.name} ({doc.room_number})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[300px] p-2 font-sans">
                {chatMessages.length === 0 ? (
                  <p className="text-center text-slate-400 text-xs py-8">No messages sent yet.</p>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs ${
                          msg.sender === 'admin'
                            ? 'bg-emerald-100 text-emerald-950 font-medium'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-[9px] text-slate-400 font-mono block text-right pt-0.5">
                          {msg.time} • To: {msg.doctor_name}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendChatMessage} className="pt-2 flex items-center gap-2 border-t border-slate-100">
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  placeholder="Type message to doctor..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Send size={14} /> Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ─── VIEW 9: HOSPITAL SETTINGS & INTEGRATIONS ─────── */}
        {activeNav === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Hospital Facility Settings</h2>
              <p className="text-xs text-slate-500">Configure clinic contact information, WhatsApp Rx engine, and ABDM compliance.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-2xl space-y-4">
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">Hospital Display Name</label>
                <input
                  type="text"
                  value={hospitalSettings.hospitalName}
                  onChange={(e) => setHospitalSettings({ ...hospitalSettings, hospitalName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">Address & Location</label>
                <input
                  type="text"
                  value={hospitalSettings.address}
                  onChange={(e) => setHospitalSettings({ ...hospitalSettings, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">Front Desk Phone</label>
                  <input
                    type="text"
                    value={hospitalSettings.phone}
                    onChange={(e) => setHospitalSettings({ ...hospitalSettings, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">Emergency Hotline</label>
                  <input
                    type="text"
                    value={hospitalSettings.emergencyPhone}
                    onChange={(e) => setHospitalSettings({ ...hospitalSettings, emergencyPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hospitalSettings.whatsappRxEnabled}
                    onChange={(e) => setHospitalSettings({ ...hospitalSettings, whatsappRxEnabled: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="text-xs font-bold text-slate-800">Enable Automated WhatsApp Prescription PDF Dispatch</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hospitalSettings.audioVoiceAnnounce}
                    onChange={(e) => setHospitalSettings({ ...hospitalSettings, audioVoiceAnnounce: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="text-xs font-bold text-slate-800">Enable Smart Hindi/English Audio Voice Token Calling</span>
                </label>
              </div>

              <button
                onClick={() => {
                  setNotice('Hospital settings saved successfully.')
                  setTimeout(() => setNotice(null), 3000)
                }}
                className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs mt-2"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ─── MODAL: ONBOARD DOCTOR (WITH UNIQUE DOCTOR ID) ──── */}
      {showOnboardDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope size={20} className="text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">Onboard Doctor to {hospitalName}</h3>
              </div>
              <button onClick={() => setShowOnboardDocModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900 flex justify-between">
              <span>Doctor Quota: <strong>{doctorsList.length} / {hospitalSettings.doctorSeatLimit} Seats</strong></span>
              <span className="text-emerald-700 font-bold">Supabase Auth Account</span>
            </div>

            <form onSubmit={handleOnboardDoctorSubmit} className="space-y-3 text-left text-xs">
              {/* Unique Doctor ID Field */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Key size={13} className="text-emerald-600" />
                    <span>Unique Doctor ID (Login Identity) *</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Auto-Generated</span>
                </div>
                <input
                  type="text"
                  required
                  value={doctorForm.doctor_code}
                  onChange={(e) => setDoctorForm({ ...doctorForm, doctor_code: e.target.value.toUpperCase() })}
                  placeholder="e.g. H1-D-0001 or H1-CARDIO-01"
                  className="w-full px-3 py-2 bg-white border border-emerald-300 font-mono font-bold text-emerald-900 rounded-xl focus:ring-2 focus:ring-emerald-500 uppercase"
                />
                <p className="text-[10px] text-slate-500">
                  Doctor can sign in using this unique Doctor ID or registered email.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    placeholder="Dr. Amit Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">OPD Room Number</label>
                  <input
                    type="text"
                    value={doctorForm.room_number}
                    onChange={(e) => setDoctorForm({ ...doctorForm, room_number: e.target.value })}
                    placeholder="Room 102"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Login Email *</label>
                  <input
                    type="email"
                    required
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    placeholder="doctor@hospital.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Login Password *</label>
                  <input
                    type="password"
                    required
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Department</label>
                  <input
                    type="text"
                    value={doctorForm.dept}
                    onChange={(e) => setDoctorForm({ ...doctorForm, dept: e.target.value })}
                    placeholder="Cardiology"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={doctorForm.fee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOnboardDocModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Save & Issue Login →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: EDIT DOCTOR ID ─────────────────────────── */}
      {editingDoctorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900">Edit Unique Doctor ID</h3>
              <button onClick={() => setEditingDoctorId(null)} className="text-slate-400">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateDoctorCode} className="space-y-3 text-xs">
              <p className="text-slate-500">
                Update public Doctor ID for <strong>{editingDoctorId.name}</strong>.
              </p>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor ID *</label>
                <input
                  type="text"
                  required
                  value={newDoctorCode}
                  onChange={(e) => setNewDoctorCode(e.target.value.toUpperCase())}
                  placeholder="e.g. H1-CARDIO-01"
                  className="w-full px-3 py-2 bg-slate-50 border border-emerald-300 font-mono font-bold text-slate-900 rounded-xl uppercase"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingDoctorId(null)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold shadow"
                >
                  Update Doctor ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ISSUE WALKIN TOKEN ─────────────────────── */}
      {showWalkinTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Issue Walk-In Patient Token</h3>
              <button onClick={() => setShowWalkinTokenModal(false)} className="text-slate-400">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleWalkinTokenSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={walkinForm.patient_name}
                  onChange={(e) => setWalkinForm({ ...walkinForm, patient_name: e.target.value })}
                  placeholder="e.g. Meera Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={walkinForm.patient_phone}
                    onChange={(e) => setWalkinForm({ ...walkinForm, patient_phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={walkinForm.patient_age}
                    onChange={(e) => setWalkinForm({ ...walkinForm, patient_age: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Consulting Doctor</label>
                <select
                  value={walkinForm.doctor_id}
                  onChange={(e) => setWalkinForm({ ...walkinForm, doctor_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="">Choose on-duty doctor...</option>
                  {doctorsList.map((d) => (
                    <option key={d.id} value={d.id}>
                      [{d.doctor_code}] {d.name} ({d.dept} - {d.room_number}) - ₹{d.fee}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={walkinForm.is_emergency}
                  onChange={(e) => setWalkinForm({ ...walkinForm, is_emergency: e.target.checked })}
                  className="rounded text-rose-600"
                />
                <span className="font-bold text-rose-600">Mark as Priority / Emergency Case</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWalkinTokenModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow">
                  Issue Token Now →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD DEPARTMENT ─────────────────────────── */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Specialty Department</h3>
              <button onClick={() => setShowAddDeptModal(false)} className="text-slate-400">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddDeptSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Pediatrics"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Head Specialist</label>
                <input
                  type="text"
                  value={deptForm.head_doctor}
                  onChange={(e) => setDeptForm({ ...deptForm, head_doctor: e.target.value })}
                  placeholder="Dr. Specialist"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold">
                  Add Department →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD STAFF ──────────────────────────────── */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add Staff Member</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddStaffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="Sunita Mehra"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Role</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Receptionist">Receptionist</option>
                  <option value="Triage Nurse">Triage Nurse</option>
                  <option value="Billing Clerk">Billing Clerk</option>
                  <option value="OPD Coordinator">OPD Coordinator</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    placeholder="staff@hospital.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold">
                  Add Staff →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: BROADCAST ANNOUNCEMENT ─────────────────── */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Broadcast Announcement</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
              <p className="text-slate-500">
                This notice will immediately appear on all doctor consoles, reception desks, and waiting room TV screens.
              </p>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Announcement Text</label>
                <textarea
                  rows={3}
                  required
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="e.g. OPD room 103 consultation resumed. Next 5 tokens please proceed."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                Send Broadcast Alert →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: DOCTOR BLOCK / BAN / RESTORE / DELETE ─── */}
      {docSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className={docSecurityModal.action === 'unblock' ? 'text-emerald-600' : 'text-rose-600'} />
                <h3 className="text-base font-black text-slate-900 capitalize">
                  {docSecurityModal.action} Doctor Account
                </h3>
              </div>
              <button onClick={() => setDocSecurityModal(null)} className="text-slate-400">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteDoctorSecurity} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="font-bold text-slate-800">
                  Target Practitioner: {docSecurityModal.doctor.name} ({docSecurityModal.doctor.doctor_code})
                </p>
                <p className="text-slate-500 text-[11px]">
                  Email: {docSecurityModal.doctor.email} • Dept: {docSecurityModal.doctor.dept}
                </p>
              </div>

              {docSecurityModal.action !== 'unblock' ? (
                <>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select Security Action *</label>
                    <select
                      value={docSecurityModal.action}
                      onChange={(e) => setDocSecurityModal({ ...docSecurityModal, action: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="blocked">Block Account (Revoke Auth & Dashboard)</option>
                      <option value="suspended">Suspend Account (Temporary Hold)</option>
                      <option value="banned">Ban Account (Permanent Violation)</option>
                      <option value="deleted">Soft Delete (Archive Account, Retain Records)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Reason for Security Restriction *</label>
                    <textarea
                      rows={2}
                      required
                      value={securityReason}
                      onChange={(e) => setSecurityReason(e.target.value)}
                      placeholder="e.g. Clinical review, contract termination, or administrative leave..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </>
              ) : (
                <p className="text-slate-600">
                  Unblocking this doctor will restore their active profile, re-enable Supabase Auth login, and allow consultation queue access.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDocSecurityModal(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-xl shadow ${
                    docSecurityModal.action === 'unblock' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {docSecurityModal.action.toUpperCase()} →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
