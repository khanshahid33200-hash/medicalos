import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import apiClient from './api/client'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Checkin from './pages/Checkin'
import Queue from './pages/Queue'
import Reports from './pages/Reports'
import QRKiosk from './pages/QRKiosk'

function App() {
  useEffect(() => {
    // Set clinic ID from local storage or environment
    const clinicId = localStorage.getItem('clinicId') || 'clinic-001'
    apiClient.setClinicId(clinicId)

    // Check API health
    apiClient.healthCheck().catch(() => {
      console.warn('API health check failed - running in offline mode')
    })
  }, [])

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/checkin" element={<Checkin />} />
      <Route path="/queue" element={<Queue />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/qr-kiosk" element={<QRKiosk />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
