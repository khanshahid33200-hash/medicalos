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
            hospital_name: session.user.user_metadata?.hospital_name || 'Metro Care General Hospital',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            department_id: 'dept-cardio-01',
            department_name: session.user.user_metadata?.department || 'Cardiology',
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

  // Login Query directly to Supabase Auth
  const loginWithSupabase = async (email: string, pass: string, expectedRole?: 'hospital_admin' | 'doctor') => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!data.user) {
        throw new Error('Supabase Auth failed. Invalid credentials.')
      }

      const role = data.user.user_metadata?.role || expectedRole || 'doctor'
      
      // Role enforcement: Hospital admin can only log in at /login/hospitaladmin009
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
        hospital_name: data.user.user_metadata?.hospital_name || 'Metro Care General Hospital',
        name: data.user.user_metadata?.full_name || email.split('@')[0],
        email: email,
        department_id: 'dept-cardio-01',
        department_name: data.user.user_metadata?.department || 'Cardiology',
        specialization: 'Consultant Specialist',
        role: role,
        status: 'active',
      }
      setDoctorProfile(profile)
      setIsLoading(false)
      return data
    } catch (err: any) {
      setIsLoading(false)
      throw err
    }
  }

  // Register User Credentials in Supabase Auth (Platform Owner or Hospital Admin)
  const registerUserInSupabase = async (
    email: string,
    pass: string,
    metadata: { role: string; name: string; hospital_id?: string; dept?: string }
  ) => {
    const { data, error: regError } = await supabase.auth.signUp({
      email,
      password: pass,
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
      throw new Error(regError.message)
    }
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
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
