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
import HowItWorksPage from './pages/HowItWorksPage'
import ArchitecturePage from './pages/ArchitecturePage'
import PricingPage from './pages/PricingPage'
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
import AccountBlockedPage from './pages/AccountBlockedPage'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Checkin from './pages/Checkin'
import Queue from './pages/Queue'
import Reports from './pages/Reports'
import QRKiosk from './pages/QRKiosk'
import History from './pages/History'
import DoctorProfile from './pages/DoctorProfile'
import OwnerAdmin from './pages/OwnerAdmin'
import HospitalAdminPage from './pages/HospitalAdminPage'
import HospitalAdminOverviewPage from './pages/hospital-admin/HospitalAdminOverviewPage'
import HospitalAdminQueuesPage from './pages/hospital-admin/HospitalAdminQueuesPage'
import HospitalAdminDoctorsPage from './pages/hospital-admin/HospitalAdminDoctorsPage'
import HospitalAdminMessagesPage from './pages/hospital-admin/HospitalAdminMessagesPage'
import HospitalAdminQRPage from './pages/hospital-admin/HospitalAdminQRPage'

// Medtech Fixaters Hospital Dashboard Pages (design.md)
import HospitalDashboardHome from './pages/hospitaldashboard/HospitalDashboardHome'
import HospitalAppointmentsPage from './pages/hospitaldashboard/HospitalAppointmentsPage'
import HospitalLiveQueuePage from './pages/hospitaldashboard/HospitalLiveQueuePage'
import HospitalPatientsPage from './pages/hospitaldashboard/HospitalPatientsPage'
import HospitalDoctorsPage from './pages/hospitaldashboard/HospitalDoctorsPage'
import HospitalDepartmentsPage from './pages/hospitaldashboard/HospitalDepartmentsPage'
import HospitalReportsPage from './pages/hospitaldashboard/HospitalReportsPage'
import HospitalAnalyticsPage from './pages/hospitaldashboard/HospitalAnalyticsPage'
import HospitalNotificationsPage from './pages/hospitaldashboard/HospitalNotificationsPage'
import HospitalSettingsPage from './pages/hospitaldashboard/HospitalSettingsPage'
import HospitalUsersRolesPage from './pages/hospitaldashboard/HospitalUsersRolesPage'
import HospitalQRManagementPage from './pages/hospitaldashboard/HospitalQRManagementPage'

// Components
import CookieBanner from './components/CookieBanner'
import ScrollToTop from './components/ScrollToTop'

function App() {
  useEffect(() => {
    // Only set a clinic id on the legacy API client once a real login has
    // populated it — no shared fallback id, which used to pool every
    // logged-out/broken session onto one hospital's data.
    const hospitalId = localStorage.getItem('hospital_id')
    if (hospitalId) apiClient.setClinicId(hospitalId)

    apiClient.healthCheck().catch(() => {
      console.warn('Backend server running locally')
    })
  }, [])

  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Marketing & Legal Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/platform" element={<ArchitecturePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutUsPage />} />
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

        {/* Sign In Portals & Access Control */}
        <Route path="/account-blocked" element={<AccountBlockedPage />} />
        <Route path="/doctor" element={<Login />} />
        <Route path="/doctor/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hospitaladminmedtech" element={<HospitalAdminPage />} />
        <Route path="/login/hospitaladminmedtech" element={<HospitalAdminPage />} />
        <Route path="/login/hospitaladmin009" element={<HospitalAdminPage />} />
        <Route path="/hospitaladmin009" element={<HospitalAdminPage />} />
        <Route path="/hospitaladmin" element={<HospitalAdminPage />} />
        <Route path="/hospitaladmin/*" element={<HospitalAdminPage />} />

        {/* Secret Platform Owner Control Portal */}
        <Route path="/mrshahidbabu" element={<OwnerAdmin />} />
        <Route path="/MRSHAHIDBABU" element={<OwnerAdmin />} />

        {/* Medtech Fixaters Hospital Administration Dashboard (design.md) */}
        <Route path="/hospitaldashboard" element={<HospitalDashboardHome />} />
        <Route path="/hospitaldashboard/dashboard" element={<HospitalDashboardHome />} />
        <Route path="/hospitaldashboard/appointments" element={<HospitalAppointmentsPage />} />
        <Route path="/hospitaldashboard/live-queue" element={<HospitalLiveQueuePage />} />
        <Route path="/hospitaldashboard/patients" element={<HospitalPatientsPage />} />
        <Route path="/hospitaldashboard/doctors" element={<HospitalDoctorsPage />} />
        <Route path="/hospitaldashboard/departments" element={<HospitalDepartmentsPage />} />
        <Route path="/hospitaldashboard/reports" element={<HospitalReportsPage />} />
        <Route path="/hospitaldashboard/analytics" element={<HospitalAnalyticsPage />} />
        <Route path="/hospitaldashboard/notifications" element={<HospitalNotificationsPage />} />
        <Route path="/hospitaldashboard/settings" element={<HospitalSettingsPage />} />
        <Route path="/hospitaldashboard/settings/hospital-profile" element={<HospitalSettingsPage />} />
        <Route path="/hospitaldashboard/users-roles" element={<HospitalUsersRolesPage />} />
        <Route path="/hospitaldashboard/qr" element={<HospitalQRManagementPage />} />

        {/* Seamless Legacy Hospital Admin Routes */}
        <Route path="/hospitaladmin-dashboard" element={<HospitalDashboardHome />} />
        <Route path="/hospitaladmin/overview" element={<HospitalDashboardHome />} />
        <Route path="/hospitaladmin/queues" element={<HospitalLiveQueuePage />} />
        <Route path="/hospitaladmin/doctors" element={<HospitalDoctorsPage />} />
        <Route path="/hospitaladmin/messages" element={<HospitalNotificationsPage />} />
        <Route path="/hospitaladmin/qr" element={<HospitalQRManagementPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="dashboard" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/queue"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="queue" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="appointments" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="patients" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultations"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="consultations" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="prescriptions" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="templates" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/follow-ups"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="follow-ups" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="reports" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="profile" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="settings" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="reports" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="patients" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qr-kiosk"
          element={
            <ProtectedRoute>
              <Dashboard initialTab="queue" />
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
