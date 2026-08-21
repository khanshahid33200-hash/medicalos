import { useState, useEffect } from 'react'
import { QrCode, Copy, Download } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'

// Simple QR code generator using qr-code-styling or a free API
// For now, using a QR code API service
const generateQRCode = (text: string): string => {
  const encoded = encodeURIComponent(text)
  // Using qr-server.com free API
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encoded}`
}

export default function QRKiosk() {
  const [qrUrl, setQrUrl] = useState('')
  const [checkInUrl, setCheckInUrl] = useState('')
  const [displayMode, setDisplayMode] = useState<'fullscreen' | 'tablet' | 'settings'>('fullscreen')
  const [clinicName, setClinicName] = useState('ABC Clinic')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Generate check-in URL - can be customized per clinic
    const baseUrl = window.location.origin
    const clinicId = localStorage.getItem('clinicId') || 'clinic-001'
    const url = `${baseUrl}/checkin?clinic=${clinicId}`
    setCheckInUrl(url)

    // Generate QR code for this URL
    const qr = generateQRCode(url)
    setQrUrl(qr)
  }, [])

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(checkInUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = 'clinic-checkin-qr.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrintQR = () => {
    const printWindow = window.open('', '', 'height=500,width=500')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Check-in QR Code - ${clinicName}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
                background: white;
                margin: 0;
                padding: 40px;
              }
              h1 { margin-bottom: 30px; font-size: 24px; }
              img { max-width: 500px; height: auto; }
              p { margin-top: 20px; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <h1>Check-in QR Code</h1>
            <p>${clinicName}</p>
            <img src="${qrUrl}" alt="Check-in QR Code" />
            <p>Scan this QR code to check in</p>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (displayMode === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        {/* Fullscreen QR Display */}
        <div className="text-center">
          {/* Header */}
          <div className="text-white mb-12">
            <h1 className="text-5xl font-bold mb-2">{clinicName}</h1>
            <p className="text-2xl opacity-90">Patient Check-in</p>
          </div>

          {/* QR Code Display */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center">
              <QrCode size={60} className="text-primary-600 mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-6">Scan to Check In</p>
              <img src={qrUrl} alt="Check-in QR Code" className="w-96 h-96 shadow-lg rounded-lg" />
            </div>
          </div>

          {/* Instructions */}
          <div className="text-white mt-12 max-w-md mx-auto">
            <p className="text-xl font-semibold mb-3">📱 How to Check In:</p>
            <ol className="text-left space-y-2 text-lg">
              <li>1️⃣ Open your phone's camera app</li>
              <li>2️⃣ Point at the QR code above</li>
              <li>3️⃣ Tap the link that appears</li>
              <li>4️⃣ Fill out the check-in form</li>
            </ol>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setDisplayMode('settings')}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <QrCode size={32} className="text-primary-600" />
              QR Code Kiosk
            </h1>
            <p className="text-gray-600 mt-1">Display QR code for patient check-in</p>
          </div>
          <Button variant="primary" onClick={() => setDisplayMode('fullscreen')}>
            Display in Kiosk Mode
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Code Display */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <h2 className="text-lg font-semibold">QR Code</h2>
            </CardHeader>
            <CardContent className="py-6 text-center">
              <img src={qrUrl} alt="Check-in QR Code" className="w-full max-w-xs mx-auto shadow-lg rounded-lg" />
              <p className="text-sm text-gray-600 mt-4">Scan to access check-in form</p>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card className="lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h2 className="text-lg font-semibold">Configuration</h2>
            </CardHeader>
            <CardContent className="py-6 space-y-6">
              {/* Clinic Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Check-in URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={checkInUrl}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <Button
                    variant="secondary"
                    onClick={handleCopyUrl}
                    title={copied ? 'Copied!' : 'Copy URL'}
                  >
                    <Copy size={18} />
                  </Button>
                </div>
                {copied && <p className="text-sm text-green-600 mt-1">✓ Copied to clipboard!</p>}
              </div>

              {/* Display Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Display Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setDisplayMode('fullscreen')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      (displayMode as string) === 'fullscreen'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    Fullscreen
                  </button>
                  <button
                    onClick={() => setDisplayMode('tablet')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      displayMode === 'tablet'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    Tablet
                  </button>
                  <button
                    onClick={() => setDisplayMode('settings')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      displayMode === 'settings'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    Settings
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-900 mb-2">Features:</p>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>✓ Large fullscreen QR code display</li>
                  <li>✓ Mobile-responsive check-in form</li>
                  <li>✓ Real-time queue number assignment</li>
                  <li>✓ Support multiple clinics</li>
                  <li>✓ Customizable clinic name</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardHeader className="bg-gray-100">
            <h3 className="font-semibold text-gray-900">Export & Print</h3>
          </CardHeader>
          <CardContent className="py-6">
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary" onClick={handleDownloadQR}>
                <Download size={18} />
                Download QR Code
              </Button>
              <Button variant="secondary" onClick={handlePrintQR}>
                🖨️ Print QR Code
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = checkInUrl
                  link.target = '_blank'
                  link.click()
                }}
              >
                🔗 Open Check-in Form
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Print the QR code and display it in your clinic waiting area, or use fullscreen mode on a tablet/monitor.
            </p>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader className="bg-green-100">
            <h3 className="font-semibold text-green-900">How It Works</h3>
          </CardHeader>
          <CardContent className="py-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Display QR Code</p>
                  <p className="text-gray-600 text-sm">
                    Use fullscreen mode on clinic monitor/tablet or print and post in waiting area
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Patient Scans QR</p>
                  <p className="text-gray-600 text-sm">
                    Patient uses their phone camera to scan the QR code
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Fill Check-in Form</p>
                  <p className="text-gray-600 text-sm">
                    Patient's phone opens check-in form with symptoms and medical info
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Get Queue Number</p>
                  <p className="text-gray-600 text-sm">
                    Patient receives queue number and can track wait time in real-time
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Preview */}
        <Card>
          <CardHeader className="bg-purple-100">
            <h3 className="font-semibold text-purple-900">Mobile Preview</h3>
          </CardHeader>
          <CardContent className="py-6">
            <div className="max-w-sm mx-auto bg-white border-8 border-gray-800 rounded-3xl shadow-lg">
              <div className="bg-gray-900 text-white text-center py-1 text-xs font-semibold">
                iPhone 12
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-primary-600 text-white p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">Patient Check-in</p>
                  <p className="text-sm opacity-90">Please provide your information</p>
                </div>
                <div className="space-y-3">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <textarea
                    placeholder="Symptoms"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <button className="w-full bg-primary-600 text-white py-2 rounded font-medium text-sm">
                    Submit Check-in
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
