import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

export interface DoctorProfile {
  doctor_id: string
  hospital_id: string
  hospital_name: string
  name: string
  email: string
  department_id: string
  department_name: string
  specialization: string
  role: 'doctor' | 'hospital_admin' | 'super_admin'
  status: 'active' | 'inactive' | 'on_leave'
}

interface AuthContextType {
  currentUser: any | null
  doctorProfile: DoctorProfile | null
  userRole: 'hospital_admin' | 'doctor' | 'super_admin' | null
  isLoading: boolean
  error: string | null
  loginWithSupabase: (email: string, pass: string, expectedRole?: 'hospital_admin' | 'doctor') => Promise<any>
  registerUserInSupabase: (
    email: string,
    pass: string,
    metadata: { role: string; name: string; hospital_id?: string; dept?: string; fee?: number; limit?: number }
  ) => Promise<any>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [userRole, setUserRole] = useState<'hospital_admin' | 'doctor' | 'super_admin' | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check initial Supabase Session or Saved Fast Session
    const initAuth = async () => {
      try {
        const cachedUser = localStorage.getItem('clinicos_cached_user')
        const cachedRole = localStorage.getItem('user_role') as any
        const cachedProfile = localStorage.getItem('clinicos_cached_profile')

        if (cachedUser && cachedRole && cachedProfile) {
          setCurrentUser(JSON.parse(cachedUser))
          setUserRole(cachedRole)
          setDoctorProfile(JSON.parse(cachedProfile))
          setIsLoading(false)
          return
        }

        const { data: { session } } = await supabase.auth.getSession()
        if (session && session.user) {
          setCurrentUser(session.user)
          const role = session.user.user_metadata?.role || (localStorage.getItem('user_role') as any) || 'doctor'
          setUserRole(role)
          
          setDoctorProfile({
            doctor_id: session.user.id,
            hospital_id: session.user.user_metadata?.hospital_id || 'hosp-001',
            hospital_name: session.user.user_metadata?.hospital_name || 'Hospital Facility',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            department_id: 'dept-cardio-01',
            department_name: session.user.user_metadata?.department || 'General',
            specialization: 'Consultant Specialist',
            role: role,
            status: 'active',
          })
        }
      } catch (e) {
        console.warn('Supabase Auth init:', e)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user)
        const role = session.user.user_metadata?.role || (localStorage.getItem('user_role') as any) || 'doctor'
        setUserRole(role)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // BLAZING FAST LOGIN WITH INSTANT EVALUATION & 1S SUPABASE TIMEOUT
  const loginWithSupabase = async (email: string, pass: string, expectedRole?: 'hospital_admin' | 'doctor') => {
    setIsLoading(true)
    setError(null)
    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = pass.trim()

    // 1. INSTANT CHECK: Local Storage & Supabase Registries (Instant response)

    // Check Hospital Admin local registry
    try {
      const hospitalsRaw = localStorage.getItem('clinicos_hospitals')
      const hospitalsList: any[] = hospitalsRaw ? JSON.parse(hospitalsRaw) : []
      const foundHosp = hospitalsList.find(
        (h) => h.email?.trim().toLowerCase() === cleanEmail && (h.password?.trim() === cleanPass || !h.password)
      )

      if (foundHosp) {
        if (expectedRole && expectedRole !== 'hospital_admin') {
          setIsLoading(false)
          throw new Error('Unauthorized role access. This portal is strictly for Hospital Administrators.')
        }

        const mockUser = {
          id: foundHosp.id || `hosp-user-${Date.now()}`,
          email: cleanEmail,
          user_metadata: {
            full_name: foundHosp.name,
            role: 'hospital_admin',
            hospital_id: foundHosp.id,
            hospital_name: foundHosp.name,
          },
        }

        const profile: DoctorProfile = {
          doctor_id: mockUser.id,
          hospital_id: foundHosp.id,
          hospital_name: foundHosp.name,
          name: foundHosp.name,
          email: cleanEmail,
          department_id: 'dept-admin-01',
          department_name: 'Hospital Administration',
          specialization: 'Chief Administrator',
          role: 'hospital_admin',
          status: 'active',
        }

        setCurrentUser(mockUser)
        setUserRole('hospital_admin')
        setDoctorProfile(profile)
        localStorage.setItem('user_role', 'hospital_admin')
        localStorage.setItem('hospital_id', foundHosp.id)
        localStorage.setItem('hospital_name', foundHosp.name)
        localStorage.setItem('clinicos_cached_user', JSON.stringify(mockUser))
        localStorage.setItem('clinicos_cached_profile', JSON.stringify(profile))
        setIsLoading(false)
        return { user: mockUser }
      }
    } catch (e) {}

    // Check Doctor local roster
    try {
      const doctorsRaw = localStorage.getItem('clinicos_hospital_doctors')
      const doctorsList: any[] = doctorsRaw ? JSON.parse(doctorsRaw) : []
      const foundDoc = doctorsList.find(
        (d) => d.email?.trim().toLowerCase() === cleanEmail && (d.password?.trim() === cleanPass || !d.password)
      )

      if (foundDoc) {
        if (expectedRole && expectedRole !== 'doctor') {
          setIsLoading(false)
          throw new Error('Unauthorized role access. This portal is strictly for Doctors.')
        }

        const mockUser = {
          id: foundDoc.id || `doc-user-${Date.now()}`,
          email: cleanEmail,
          user_metadata: {
            full_name: foundDoc.name,
            role: 'doctor',
            hospital_id: foundDoc.hospital_id || 'hosp-001',
            department: foundDoc.dept || 'General',
          },
        }

        const profile: DoctorProfile = {
          doctor_id: mockUser.id,
          hospital_id: foundDoc.hospital_id || 'hosp-001',
          hospital_name: foundDoc.hospital_name || 'Hospital Facility',
          name: foundDoc.name,
          email: cleanEmail,
          department_id: 'dept-01',
          department_name: foundDoc.dept || 'General',
          specialization: foundDoc.specialization || 'Consultant Specialist',
          role: 'doctor',
          status: 'active',
        }

        setCurrentUser(mockUser)
        setUserRole('doctor')
        setDoctorProfile(profile)
        localStorage.setItem('user_role', 'doctor')
        localStorage.setItem('hospital_id', foundDoc.hospital_id || 'hosp-001')
        localStorage.setItem('clinicos_cached_user', JSON.stringify(mockUser))
        localStorage.setItem('clinicos_cached_profile', JSON.stringify(profile))
        setIsLoading(false)
        return { user: mockUser }
      }
    } catch (e) {}

    // Check Saved User Registry
    try {
      const savedUsersRaw = localStorage.getItem('clinicos_user_registry')
      const registry: any[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : []
      const found = registry.find(
        (u) => u.email?.trim().toLowerCase() === cleanEmail && u.password?.trim() === cleanPass
      )

      if (found) {
        const role = found.role || expectedRole || 'doctor'
        if (expectedRole && role !== expectedRole && role !== 'super_admin') {
          setIsLoading(false)
          throw new Error(`Unauthorized role access. This portal is strictly for ${expectedRole === 'hospital_admin' ? 'Hospital Administrators' : 'Doctors'}.`)
        }

        const mockUser = {
          id: found.id || `user-${Date.now()}`,
          email: cleanEmail,
          user_metadata: {
            full_name: found.name,
            role: role,
            hospital_id: found.hospital_id || 'hosp-001',
            hospital_name: found.name,
          },
        }

        const profile: DoctorProfile = {
          doctor_id: mockUser.id,
          hospital_id: found.hospital_id || 'hosp-001',
          hospital_name: found.name || 'Hospital Facility',
          name: found.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          department_id: 'dept-cardio-01',
          department_name: found.dept || 'General',
          specialization: 'Consultant Specialist',
          role: role,
          status: 'active',
        }

        setCurrentUser(mockUser)
        setUserRole(role)
        setDoctorProfile(profile)
        localStorage.setItem('user_role', role)
        localStorage.setItem('hospital_id', found.hospital_id || 'hosp-001')
        localStorage.setItem('clinicos_cached_user', JSON.stringify(mockUser))
        localStorage.setItem('clinicos_cached_profile', JSON.stringify(profile))
        setIsLoading(false)
        return { user: mockUser }
      }
    } catch (e) {}

    // 2. REMOTE SUPABASE AUTH WITH 1.2 SECOND FAST TIMEOUT RACE
    try {
      const supabaseLoginPromise = supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      })

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase Auth network query timeout')), 1200)
      )

      const { data, error: authError }: any = await Promise.race([supabaseLoginPromise, timeoutPromise])

      if (!authError && data?.user) {
        const role = data.user.user_metadata?.role || expectedRole || 'doctor'
        if (expectedRole && role !== expectedRole && role !== 'super_admin') {
          await supabase.auth.signOut()
          setIsLoading(false)
          throw new Error(`Unauthorized role access. This portal is strictly for ${expectedRole === 'hospital_admin' ? 'Hospital Administrators' : 'Doctors'}.`)
        }

        const profile: DoctorProfile = {
          doctor_id: data.user.id,
          hospital_id: data.user.user_metadata?.hospital_id || 'hosp-001',
          hospital_name: data.user.user_metadata?.hospital_name || 'Hospital Facility',
          name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          email: cleanEmail,
          department_id: 'dept-cardio-01',
          department_name: data.user.user_metadata?.department || 'General',
          specialization: 'Consultant Specialist',
          role: role,
          status: 'active',
        }

        setCurrentUser(data.user)
        setUserRole(role)
        setDoctorProfile(profile)
        localStorage.setItem('user_role', role)
        localStorage.setItem('clinicos_cached_user', JSON.stringify(data.user))
        localStorage.setItem('clinicos_cached_profile', JSON.stringify(profile))
        setIsLoading(false)
        return data
      }
    } catch (err: any) {
      console.warn('Supabase Auth remote notice:', err.message)
    }

    setIsLoading(false)
    throw new Error('Invalid email or password. Please verify your credentials or click a demo account button.')
  }

  // Register User Credentials in Supabase Auth & Supabase Database Tables
  const registerUserInSupabase = async (
    email: string,
    pass: string,
    metadata: { role: string; name: string; hospital_id?: string; dept?: string; fee?: number; limit?: number }
  ) => {
    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = pass.trim()

    // 1. Save to local registry backup
    try {
      const savedUsersRaw = localStorage.getItem('clinicos_user_registry')
      const registry: any[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : []
      const newUser = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        password: cleanPass,
        name: metadata.name,
        role: metadata.role,
        hospital_id: metadata.hospital_id || 'hosp-001',
        dept: metadata.dept || 'General',
        timestamp: new Date().toISOString()
      }
      const existingIdx = registry.findIndex((u) => u.email?.trim().toLowerCase() === cleanEmail)
      if (existingIdx >= 0) {
        registry[existingIdx] = { ...registry[existingIdx], ...newUser }
      } else {
        registry.push(newUser)
      }
      localStorage.setItem('clinicos_user_registry', JSON.stringify(registry))
    } catch (e) {}

    // 2. Save directly to Supabase Database Tables (doctors & clinicos_user_registry)
    try {
      await supabase.from('doctors').upsert([
        {
          email: cleanEmail,
          password_hash: cleanPass,
          name: metadata.name,
          role: metadata.role,
          hospital_id: metadata.hospital_id || 'hosp-001',
          department: metadata.dept || 'General',
          fee: metadata.fee || 500,
          daily_limit: metadata.limit || 25,
          created_at: new Date().toISOString(),
        },
      ], { onConflict: 'email' })
    } catch (dbErr: any) {
      console.warn('Supabase Database doctors table notice:', dbErr.message)
    }

    try {
      await supabase.from('clinicos_user_registry').upsert([
        {
          email: cleanEmail,
          password: cleanPass,
          name: metadata.name,
          role: metadata.role,
          hospital_id: metadata.hospital_id || 'hosp-001',
          department: metadata.dept || 'General',
          created_at: new Date().toISOString(),
        },
      ], { onConflict: 'email' })
    } catch (dbErr: any) {
      console.warn('Supabase Database user registry table notice:', dbErr.message)
    }

    // 3. Call Supabase Auth signUp API
    try {
      await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: {
          data: {
            full_name: metadata.name,
            role: metadata.role,
            hospital_id: metadata.hospital_id || 'hosp-001',
            department: metadata.dept || 'General',
          },
        },
      })
    } catch (authErr: any) {
      console.warn('Supabase Auth signUp notice:', authErr.message)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {}
    setCurrentUser(null)
    setDoctorProfile(null)
    setUserRole(null)
    localStorage.removeItem('user_role')
    localStorage.removeItem('clinicos_cached_user')
    localStorage.removeItem('clinicos_cached_profile')
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        doctorProfile,
        userRole,
        isLoading,
        error,
        loginWithSupabase,
        registerUserInSupabase,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
