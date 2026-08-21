import { useState, useEffect } from 'react'
import { QrCode, Copy, Download, Stethoscope, Building2, ExternalLink } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

const generateQRCode = (text: string): string => {
  const encoded = encodeURIComponent(text)
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encoded}`
}

export default function QRKiosk() {
  const { doctorProfile } = useAuth()
  const [qrUrl, setQrUrl] = useState('')
  const [checkInUrl, setCheckInUrl] = useState('')
  const [displayMode, setDisplayMode] = useState<'fullscreen' | 'tablet' | 'settings'>('fullscreen')
  const [copied, setCopied] = useState(false)

  const doctorName = doctorProfile?.name || 'Dr. Rahul Sharma'
  const doctorId = doctorProfile?.doctor_id || 'doc-001'
  const hospitalName = doctorProfile?.hospital_name || 'Metro Care General Hospital'
  const departmentName = doctorProfile?.department_name || 'Cardiology'

  useEffect(() => {
    // Generate doctor-specific check-in URL for patient QR scanning
    const baseUrl = window.location.origin
    const url = `${baseUrl}/checkin?doctor_id=${encodeURIComponent(doctorId)}&doctor_name=${encodeURIComponent(doctorName)}&department=${encodeURIComponent(departmentName)}&hospital_name=${encodeURIComponent(hospitalName)}`
    setCheckInUrl(url)

    // Generate QR code image
    const qr = generateQRCode(url)
    setQrUrl(qr)
  }, [doctorId, doctorName, departmentName, hospitalName])

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(checkInUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `checkin-qr-${doctorId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (displayMode === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex items-center justify-center p-6 z-50">
        <div className="text-center max-w-xl w-full">
          {/* Header */}
          <div className="text-white mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-300 flex items-center justify-center gap-1.5 mb-2">
              <Building2 size={16} /> {hospitalName}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">Patient Check-in</h1>
            <div className="inline-flex items-center gap-2 bg-blue-500/30 text-blue-100 px-4 py-1.5 rounded-full font-semibold text-sm border border-blue-400/30">
              <Stethoscope size={16} /> {doctorName} • {departmentName}
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex flex-col items-center">
              <QrCode size={50} className="text-blue-600 mb-3" />
              <p className="text-gray-900 text-xl font-bold mb-4">Scan QR to Fill Check-in Form</p>
              <img src={qrUrl} alt="Check-in QR Code" className="w-80 h-80 shadow-md rounded-2xl border border-gray-100" />
              <p className="text-xs text-gray-500 mt-4 font-mono truncate max-w-xs">{checkInUrl}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-white mt-8 space-y-2 text-sm bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <p className="font-bold text-base text-blue-200">📱 How to Check In:</p>
            <div className="grid grid-cols-2 gap-2 text-left text-xs font-medium text-slate-200">
              <p>1️⃣ Scan QR with phone camera</p>
              <p>2️⃣ Open patient form link</p>
              <p>3️⃣ Enter your name & symptoms</p>
              <p>4️⃣ Receive live Queue Token</p>
            </div>
          </div>

          <button
            onClick={() => setDisplayMode('settings')}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition border border-white/20"
          >
            ⚙️
          </button>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">QR Kiosk Generator</h1>
            <p className="text-gray-600 text-sm mt-1">
              Display or print doctor-specific QR code for patient self-check-in
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setDisplayMode('fullscreen')} className="shadow-lg shadow-blue-600/30">
            Open Kiosk Display Mode
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Display */}
          <Card className="lg:col-span-1 border border-gray-200">
            <CardHeader title="Live QR Code" />
            <CardContent className="py-6 text-center space-y-4">
              <img src={qrUrl} alt="Check-in QR Code" className="w-full max-w-xs mx-auto shadow-md rounded-2xl border border-gray-200" />
              <div className="bg-blue-50 text-blue-900 p-3 rounded-xl text-xs font-semibold border border-blue-100">
                Directly opens patient form for {doctorName}
              </div>
            </CardContent>
          </Card>

          {/* Configuration & Links */}
          <Card className="lg:col-span-2 border border-gray-200">
            <CardHeader title="Kiosk URL Configuration" />
            <CardContent className="py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Doctor & Hospital</label>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-semibold text-gray-800">
                  {doctorName} ({departmentName}) • {hospitalName}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Patient Check-in URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={checkInUrl}
                    readOnly
                    className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-xs font-mono text-gray-700"
                  />
                  <Button variant="secondary" onClick={handleCopyUrl}>
                    <Copy size={16} />
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => window.open(checkInUrl, '_blank')}
                  >
                    <ExternalLink size={16} />
                  </Button>
                </div>
                {copied && <p className="text-xs font-semibold text-emerald-600 mt-1">✓ Copied to clipboard!</p>}
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3 flex-wrap">
                <Button variant="primary" onClick={handleDownloadQR}>
                  <Download size={16} /> Download QR PNG
                </Button>
                <Button variant="secondary" onClick={() => setDisplayMode('fullscreen')}>
                  📺 Fullscreen Kiosk Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
