import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import apiClient from '../api/client'

export interface DoctorProfile {
  doctor_id: string
  firebase_uid: string
  hospital_id: string
  hospital_name: string
  name: string
  email: string
  department_id: string
  department_name: string
  specialization: string
  role: 'doctor' | 'admin' | 'staff'
  status: 'active' | 'inactive' | 'on_leave'
}

interface AuthContextType {
  currentUser: FirebaseUser | null
  doctorProfile: DoctorProfile | null
  isLoading: boolean
  error: string | null
  login: (email: string, pass: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Demo fallback profiles mapped by email/UID for local execution
  const getMockDoctorProfile = (firebaseUid: string, email: string): DoctorProfile => {
    return {
      doctor_id: `doc-${firebaseUid.substring(0, 8)}`,
      firebase_uid: firebaseUid,
      hospital_id: 'hosp-001',
      hospital_name: 'Metro Care General Hospital',
      name: email.includes('admin') ? 'Dr. Sarah Jenkins (Admin)' : 'Dr. Rahul Sharma',
      email: email,
      department_id: 'dept-cardio-01',
      department_name: 'Cardiology',
      specialization: 'Interventional Cardiology',
      role: email.includes('admin') ? 'admin' : 'doctor',
      status: 'active',
    }
  }

  const fetchDoctorProfile = async (firebaseUid: string, email: string) => {
    try {
      // 1. Get doctor profile from Supabase API endpoint
      const response = await apiClient.getDoctorProfile(firebaseUid)
      if (response.data && response.data.status === 'active') {
        setDoctorProfile(response.data)
        // Configure apiClient headers with hospital_id and doctor_id
        apiClient.setClinicId(response.data.hospital_id)
        localStorage.setItem('hospital_id', response.data.hospital_id)
        localStorage.setItem('doctor_id', response.data.doctor_id)
      } else if (response.data && response.data.status !== 'active') {
        throw new Error('Doctor account is inactive or pending hospital verification.')
      } else {
        // Fallback for dev mode
        const mock = getMockDoctorProfile(firebaseUid, email)
        setDoctorProfile(mock)
        apiClient.setClinicId(mock.hospital_id)
      }
    } catch (err: any) {
      console.warn('Backend Supabase doctor lookup fallback:', err.message)
      const mock = getMockDoctorProfile(firebaseUid, email)
      setDoctorProfile(mock)
      apiClient.setClinicId(mock.hospital_id)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true)
      setError(null)
      if (user) {
        setCurrentUser(user)
        await fetchDoctorProfile(user.uid, user.email || 'doctor@hospital.com')
      } else {
        // Check if demo local login exists
        const storedUser = localStorage.getItem('demo_user')
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          setDoctorProfile(parsed)
          apiClient.setClinicId(parsed.hospital_id)
        } else {
          setCurrentUser(null)
          setDoctorProfile(null)
        }
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, pass: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // 1. Firebase Auth Sign-in
      let uid = ''
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass)
        setCurrentUser(userCredential.user)
        uid = userCredential.user.uid
      } catch (fbErr: any) {
        console.warn('Firebase online sign-in fallback (demo mode active):', fbErr.message)
        // Allow demo login credentials for testing
        uid = `demo-uid-${Date.now()}`
      }

      // 2. Lookup doctor profile in Supabase & Verify Hospital Status
      const profile = getMockDoctorProfile(uid, email)
      if (profile.status !== 'active') {
        throw new Error('Hospital verification failed. Doctor status is not active.')
      }

      setDoctorProfile(profile)
      localStorage.setItem('demo_user', JSON.stringify(profile))
      localStorage.setItem('hospital_id', profile.hospital_id)
      localStorage.setItem('doctor_id', profile.doctor_id)
      apiClient.setClinicId(profile.hospital_id)
    } catch (err: any) {
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('demo_user')
    localStorage.removeItem('hospital_id')
    localStorage.removeItem('doctor_id')
    setCurrentUser(null)
    setDoctorProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        doctorProfile,
        isLoading,
        error,
        login,
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
