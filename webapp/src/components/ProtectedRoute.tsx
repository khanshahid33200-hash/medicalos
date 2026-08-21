import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, doctorProfile, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying Doctor Credentials...</p>
        </div>
      </div>
    )
  }

  // Doctor MUST be authenticated and profile MUST be active
  if (!currentUser && !doctorProfile) {
    return <Navigate to="/login" replace />
  }

  if (doctorProfile && doctorProfile.status !== 'active') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hospital Verification Required</h2>
          <p className="text-gray-600 text-sm mb-6">
            Your doctor account status is currently <strong>{doctorProfile.status}</strong>. Please contact your hospital administrator for verification.
          </p>
          <a
            href="/login"
            className="inline-block bg-red-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-red-700 transition"
          >
            Return to Login
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
