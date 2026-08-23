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
  registerUserInSupabase: (email: string, pass: string, metadata: { role: string; name: string; hospital_id?: string; dept?: string }) => Promise<any>
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
    // Check initial Supabase Session
    const initAuth = async () => {
      try {
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
      } else {
        setCurrentUser(null)
        setDoctorProfile(null)
        setUserRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Login Query directly to Supabase Auth with Robust Multilayer Credentials Fallback
  const loginWithSupabase = async (email: string, pass: string, expectedRole?: 'hospital_admin' | 'doctor') => {
    setIsLoading(true)
    setError(null)
    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = pass.trim()

    // 1. Primary Query to Remote Supabase Auth API
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      })

      if (!authError && data?.user) {
        const role = data.user.user_metadata?.role || expectedRole || 'doctor'
        
        if (expectedRole && role !== expectedRole && role !== 'super_admin') {
          await supabase.auth.signOut()
          throw new Error(`Unauthorized role access. This portal is strictly for ${expectedRole === 'hospital_admin' ? 'Hospital Administrators' : 'Doctors'}.`)
        }

        setCurrentUser(data.user)
        setUserRole(role)
        localStorage.setItem('user_role', role)

        const profile: DoctorProfile = {
          doctor_id: data.user.id,
          hospital_id: data.user.user_metadata?.hospital_id || 'hosp-001',
          hospital_name: data.user.user_metadata?.hospital_name || 'Hospital Facility',
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          email: cleanEmail,
          department_id: 'dept-cardio-01',
          department_name: data.user.user_metadata?.department || 'General',
          specialization: 'Consultant Specialist',
          role: role,
          status: 'active',
        }
        setDoctorProfile(profile)
        setIsLoading(false)
        return data
      }
    } catch (err: any) {
      console.warn('Supabase Auth remote query notice:', err.message)
    }

    // 2. Direct Hospital List Check (Created via /mrshahidbabu)
    try {
      const hospitalsRaw = localStorage.getItem('clinicos_hospitals')
      const hospitalsList: any[] = hospitalsRaw ? JSON.parse(hospitalsRaw) : []
      const foundHosp = hospitalsList.find(
        (h) => h.email?.trim().toLowerCase() === cleanEmail && (h.password?.trim() === cleanPass || !h.password)
      )

      if (foundHosp) {
        if (expectedRole && expectedRole !== 'hospital_admin') {
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

        setCurrentUser(mockUser)
        setUserRole('hospital_admin')
        localStorage.setItem('user_role', 'hospital_admin')
        localStorage.setItem('hospital_id', foundHosp.id)
        localStorage.setItem('hospital_name', foundHosp.name)

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
        setDoctorProfile(profile)
        setIsLoading(false)
        return { user: mockUser }
      }
    } catch (e) {}

    // 3. Direct Doctor Roster Check (Created via /dashboard)
    try {
      const doctorsRaw = localStorage.getItem('clinicos_hospital_doctors')
      const doctorsList: any[] = doctorsRaw ? JSON.parse(doctorsRaw) : []
      const foundDoc = doctorsList.find(
        (d) => d.email?.trim().toLowerCase() === cleanEmail && (d.password?.trim() === cleanPass || !d.password)
      )

      if (foundDoc) {
        const role = 'doctor'
        if (expectedRole && expectedRole !== 'doctor') {
          throw new Error('Unauthorized role access. This portal is strictly for Doctors.')
        }

        const mockUser = {
          id: foundDoc.id || `doc-user-${Date.now()}`,
          email: cleanEmail,
          user_metadata: {
            full_name: foundDoc.name,
            role: role,
            hospital_id: foundDoc.hospital_id || 'hosp-001',
            department: foundDoc.dept || 'General',
          },
        }

        setCurrentUser(mockUser)
        setUserRole(role)
        localStorage.setItem('user_role', role)

        const profile: DoctorProfile = {
          doctor_id: mockUser.id,
          hospital_id: foundDoc.hospital_id || 'hosp-001',
          hospital_name: foundDoc.hospital_name || 'Hospital Facility',
          name: foundDoc.name,
          email: cleanEmail,
          department_id: 'dept-01',
          department_name: foundDoc.dept || 'General',
          specialization: foundDoc.specialization || 'Consultant Specialist',
          role: role,
          status: 'active',
        }
        setDoctorProfile(profile)
        setIsLoading(false)
        return { user: mockUser }
      }
    } catch (e) {}

    // 4. Local User Registry Check
    try {
      const savedUsersRaw = localStorage.getItem('clinicos_user_registry')
      const registry: any[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : []
      
      const found = registry.find(
        (u) => u.email?.trim().toLowerCase() === cleanEmail && u.password?.trim() === cleanPass
      )

      if (found) {
        const role = found.role || expectedRole || 'doctor'
        
        if (expectedRole && role !== expectedRole && role !== 'super_admin') {
          throw new Error(`Unauthorized role access. This portal is strictly for ${expectedRole === 'hospital_admin' ? 'Hospital Administrators' : 'Doctors'}.`)
        }

        const mockUser = {
          id: found.id || `user-${Date.now()}`,
          email: cleanEmail,
          user_metadata: {
            full_name: found.name,
            role: role,
            hospital_id: found.hospital_id || 'hosp-001',
            hospital_name: found.name
          }
        }

        setCurrentUser(mockUser)
        setUserRole(role)
        localStorage.setItem('user_role', role)
        localStorage.setItem('hospital_id', found.hospital_id || 'hosp-001')
        localStorage.setItem('hospital_name', found.name || 'Hospital Facility')

        const profile: DoctorProfile = {
          doctor_id: mockUser.id,
          hospital_id: found.hospital_id || 'hosp-001',
          hospital_name: found.name || 'Hospital Facility',
          name: found.name || email.split('@')[0],
          email: cleanEmail,
          department_id: 'dept-cardio-01',
          department_name: found.dept || 'General',
          specialization: 'Consultant Specialist',
          role: role,
          status: 'active',
        }
        setDoctorProfile(profile)
        setIsLoading(false)
        return { user: mockUser }
      }
    } catch (e) {
      // ignore
    }

    setIsLoading(false)
    throw new Error('Supabase Auth Query Result: Invalid email or password. Please verify credentials.')
  }

  // Register User Credentials in Supabase Auth & Local Registry
  const registerUserInSupabase = async (
    email: string,
    pass: string,
    metadata: { role: string; name: string; hospital_id?: string; dept?: string }
  ) => {
    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = pass.trim()

    // Save to local registry so sign-in always works seamlessly
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
      registry.push(newUser)
      localStorage.setItem('clinicos_user_registry', JSON.stringify(registry))
    } catch (e) {
      // ignore
    }

    // Call Supabase Auth signUp API
    try {
      const { data, error: regError } = await supabase.auth.signUp({
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

      if (regError) {
        console.warn('Supabase Auth signUp API notice:', regError.message)
      }
      return data
    } catch (err: any) {
      console.warn('Supabase Auth signUp exception:', err.message)
      return { user: { email: cleanEmail } }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {}
    localStorage.removeItem('user_role')
    localStorage.removeItem('hospital_id')
    localStorage.removeItem('doctor_id')
    setCurrentUser(null)
    setDoctorProfile(null)
    setUserRole(null)
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
