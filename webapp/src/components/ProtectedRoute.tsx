import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'hospital_admin' | 'doctor' | 'super_admin'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { currentUser, doctorProfile, isLoading } = useAuth()

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
    if (requiredRole === 'hospital_admin') {
      return <Navigate to="/hospitaladminmedtech" replace />
    }
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
