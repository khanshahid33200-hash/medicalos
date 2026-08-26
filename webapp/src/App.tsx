import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import apiClient from './api/client'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import ProductPage from './pages/ProductPage'
import AboutUsPage from './pages/AboutUsPage'
import FeaturesPage from './pages/FeaturesPage'
import PricingPage from './pages/PricingPage'
import ContactPage from './pages/ContactPage'
import IntakePage from './pages/IntakePage'
import TrackPage from './pages/TrackPage'
import RxPage from './pages/RxPage'
import DisplayBoard from './pages/DisplayBoard'
import PaymentsPage from './pages/PaymentsPage'
import Login from './pages/Login'
import HospitalAdminLogin from './pages/HospitalAdminLogin'
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
        {/* Public Main Website Pages (Separate Dedicated Pages) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Public Patient Self-Service Workflows (No Login Required) */}
        <Route path="/a/:token" element={<IntakePage />} />
        <Route path="/book/:token" element={<IntakePage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/rx" element={<RxPage />} />
        <Route path="/display/:token" element={<DisplayBoard />} />
        <Route path="/checkin" element={<Checkin />} />

        {/* Sign In Portals */}
        <Route path="/doctor" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/hospitaladmin009" element={<HospitalAdminLogin />} />
        <Route path="/hospitaladmin009" element={<HospitalAdminLogin />} />

        {/* Secret Platform Owner Control Portal */}
        <Route path="/mrshahidbabu" element={<OwnerAdmin />} />

        {/* Protected Doctor & Hospital Admin Dashboard Routes */}
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
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
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
