import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import apiClient from './api/client'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import FeaturesPage from './pages/FeaturesPage'
import PricingPage from './pages/PricingPage'
import ContactPage from './pages/ContactPage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Checkin from './pages/Checkin'
import Queue from './pages/Queue'
import Reports from './pages/Reports'
import QRKiosk from './pages/QRKiosk'
import History from './pages/History'
import DoctorProfile from './pages/DoctorProfile'
import OwnerAdmin from './pages/OwnerAdmin'

function App() {
  useEffect(() => {
    const hospitalId = localStorage.getItem('hospital_id') || 'hosp-001'
    apiClient.setClinicId(hospitalId)

    apiClient.healthCheck().catch(() => {
      console.warn('Backend server running locally')
    })
  }, [])

  return (
    <AuthProvider>
      <Routes>
        {/* Public Clinic OS SaaS Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Doctor & Hospital Sign In Portal (Hidden link /doctor) */}
        <Route path="/doctor" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkin" element={<Checkin />} />

        {/* Secret Platform Owner Control Portal */}
        <Route path="/mrshahidbabu" element={<OwnerAdmin />} />

        {/* Protected Doctor Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/queue"
          element={
            <ProtectedRoute>
              <Queue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qr-kiosk"
          element={
            <ProtectedRoute>
              <QRKiosk />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
