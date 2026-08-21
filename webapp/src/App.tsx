import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import apiClient from './api/client'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Checkin from './pages/Checkin'
import Queue from './pages/Queue'
import Reports from './pages/Reports'
import QRKiosk from './pages/QRKiosk'
import History from './pages/History'
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
        {/* Unprotected Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/checkin" element={<Checkin />} />

        {/* Secret Platform Owner Portal */}
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
