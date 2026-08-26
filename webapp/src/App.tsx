import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import apiClient from './api/client'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import ProductPage from './pages/ProductPage'
import AboutUsPage from './pages/AboutUsPage'
import FeaturesPage from './pages/FeaturesPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import RefundPolicyPage from './pages/RefundPolicyPage'
import ThankYouPage from './pages/ThankYouPage'
import NotFoundPage from './pages/NotFoundPage'

// Self-Service & Sign In
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
import HospitalAdminOverviewPage from './pages/hospital-admin/HospitalAdminOverviewPage'
import HospitalAdminQueuesPage from './pages/hospital-admin/HospitalAdminQueuesPage'
import HospitalAdminDoctorsPage from './pages/hospital-admin/HospitalAdminDoctorsPage'
import HospitalAdminMessagesPage from './pages/hospital-admin/HospitalAdminMessagesPage'
import HospitalAdminQRPage from './pages/hospital-admin/HospitalAdminQRPage'

// Components
import CookieBanner from './components/CookieBanner'

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
        {/* Public Marketing & Legal Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />

        {/* Public Patient Self-Service Workflows */}
        <Route path="/a/:token" element={<IntakePage />} />
        <Route path="/book/:token" element={<IntakePage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/rx" element={<RxPage />} />
        <Route path="/display/:token" element={<DisplayBoard />} />
        <Route path="/checkin" element={<Checkin />} />

        {/* Sign In Portals */}
        <Route path="/doctor" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hospitaladminmedtech" element={<HospitalAdminLogin />} />
        <Route path="/login/hospitaladminmedtech" element={<HospitalAdminLogin />} />
        <Route path="/login/hospitaladmin009" element={<HospitalAdminLogin />} />
        <Route path="/hospitaladmin009" element={<HospitalAdminLogin />} />

        {/* Secret Platform Owner Control Portal */}
        <Route path="/mrshahidbabu" element={<OwnerAdmin />} />

        {/* Protected Doctor & Hospital Admin Separate Page Routes */}
        <Route
          path="/hospitaladmin-dashboard"
          element={
            <ProtectedRoute requiredRole="hospital_admin">
              <HospitalAdminOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospitaladmin/overview"
          element={
            <ProtectedRoute requiredRole="hospital_admin">
              <HospitalAdminOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospitaladmin/queues"
          element={
            <ProtectedRoute requiredRole="hospital_admin">
              <HospitalAdminQueuesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospitaladmin/doctors"
          element={
            <ProtectedRoute requiredRole="hospital_admin">
              <HospitalAdminDoctorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospitaladmin/messages"
          element={
            <ProtectedRoute requiredRole="hospital_admin">
              <HospitalAdminMessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospitaladmin/qr"
          element={
            <ProtectedRoute requiredRole="hospital_admin">
              <HospitalAdminQRPage />
            </ProtectedRoute>
          }
        />
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

        {/* Custom 404 Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Cookie Consent Banner */}
      <CookieBanner />
    </AuthProvider>
  )
}

export default App
