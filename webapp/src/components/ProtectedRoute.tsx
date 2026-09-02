import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'hospital_admin' | 'doctor' | 'super_admin'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { currentUser, userRole, doctorProfile, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 font-medium text-xs">Authenticating Credentials...</p>
        </div>
      </div>
    )
  }

  // User MUST be authenticated
  if (!currentUser && !doctorProfile) {
    return <Navigate to="/login" replace />
  }

  // requiredRole was previously accepted but never actually checked here —
  // meaning ANY authenticated user (a doctor included) could open a
  // hospital-admin dashboard route just by knowing its URL, since nothing
  // server-side-adjacent in the route itself verified role. This is the
  // real access-control boundary; Supabase RLS separately enforces data
  // access regardless of what the UI shows, but the UI itself must not
  // hand a doctor the hospital-admin screen at all.
  if (requiredRole && userRole !== requiredRole) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          portalDenied: true,
          message: `This account is registered as a ${userRole === 'hospital_admin' ? 'Hospital Administration' : userRole === 'doctor' ? 'Doctor' : userRole} account and cannot access this portal.`,
          from: location.pathname,
        }}
      />
    )
  }

  return <>{children}</>
}
