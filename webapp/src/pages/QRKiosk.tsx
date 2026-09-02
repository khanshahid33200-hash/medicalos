import { useState, useEffect } from 'react'
import { Copy, Download, Building2, ExternalLink, Printer, ShieldAlert } from 'lucide-react'
import Layout from '../components/Layout'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

const generateQRCode = (text: string): string => {
  const encoded = encodeURIComponent(text)
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encoded}`
}

import { supabase } from '../lib/supabase'

export default function QRKiosk() {
  const { doctorProfile } = useAuth()
  // Sourced ONLY from the authenticated session — never localStorage. This
  // used to be able to resolve to a stale/other-hospital id on a shared
  // device, which meant the "hospital" QR could point at the wrong tenant.
  const hospitalName = doctorProfile?.hospital_name || 'Hospital Portal'
  const hospitalId = doctorProfile?.hospital_id || ''

  const [intakeToken, setIntakeToken] = useState('')
  const [intakeUrl, setIntakeUrl] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [displayMode, setDisplayMode] = useState<'kiosk' | 'fullscreen' | 'poster'>('kiosk')
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    if (!hospitalId) return
    async function fetchToken() {
      try {
        const { data } = await supabase
          .from('qr_codes')
          .select('token')
          .eq('hospital_id', hospitalId)
          .maybeSingle()
        if (data?.token) {
          setIntakeToken(data.token)
        }
      } catch (e) {}
    }
    fetchToken()
  }, [hospitalId])

  useEffect(() => {
    if (!intakeToken) return
    const baseUrl = window.location.origin
    const url = `${baseUrl}/book/${intakeToken}`
    setIntakeUrl(url)
    setQrUrl(generateQRCode(url))
  }, [intakeToken])

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(intakeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = (format: 'png' | 'svg') => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `hospital-entrance-qr-${hospitalName.toLowerCase().replace(/\s+/g, '-')}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRegenerateToken = async () => {
    if (!hospitalId) return
    if (!window.confirm('Are you sure you want to regenerate the hospital QR token? The old poster QR code will immediately be invalidated!')) return

    // Previously this generated a predictable token
    // (`tok_<hospitalId>_<4-digit-random>`) purely client-side and never
    // persisted it — the "regenerate" was cosmetic and the real qr_codes row
    // was untouched. Now it calls the server, which mints a cryptographically
    // random token and updates the actual qr_codes row for this hospital.
    setRegenerating(true)
    try {
      const { data, error } = await supabase.functions.invoke('admin-ops', {
        body: { action: 'regenerate_qr_token', payload: { hospital_id: hospitalId } },
      })
      if (error || !data?.success) {
        alert(`Could not regenerate the QR token: ${error?.message || data?.error || 'Unknown error'}`)
        return
      }
      setIntakeToken(data.qr.token)
      alert('Hospital Single QR Token regenerated. Please print and mount the new poster at the entrance.')
    } catch (e: any) {
      alert(`Could not regenerate the QR token: ${e.message || e}`)
    } finally {
      setRegenerating(false)
    }
  }

  // Fullscreen Reception Tablet Kiosk Mode
  if (displayMode === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 z-50 font-sans selection:bg-blue-600 selection:text-white">
        <div className="text-center max-w-xl w-full space-y-6">
          <div className="text-white space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3.5 py-1.5 rounded-full border border-blue-400/30">
              <Building2 size={14} className="inline mr-1" /> Hospital Entrance Self Check-in
            </span>
            <h1 className="text-4xl font-black font-recoleta text-white">{hospitalName}</h1>
            <p className="text-xs text-slate-400 font-medium">Scan with smartphone camera to book appointment & join queue</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-white/20">
            <div className="flex flex-col items-center">
              <p className="text-slate-900 text-lg font-black uppercase tracking-wider mb-3">SCAN TO BOOK APPOINTMENT</p>
              <img src={qrUrl} alt="Hospital Entrance Single QR Code" className="w-80 h-80 shadow-md rounded-2xl border border-slate-100" />
              <p className="text-[11px] text-slate-500 mt-4 font-mono truncate max-w-xs">{intakeUrl}</p>
            </div>
          </div>

          <div className="text-white text-xs bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
            <p className="font-extrabold text-blue-400">No App Needed • Direct Browser Booking</p>
            <p className="text-slate-400">Works on all smartphone cameras. Live queue position updates automatically.</p>
          </div>

          <button
            onClick={() => setDisplayMode('kiosk')}
            aria-label="Settings"
            className="absolute top-6 right-6 bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-full transition border border-slate-800"
          >
            Settings
          </button>
        </div>
      </div>
    )
  }

  // Printable A4 Entrance Poster Mode
  if (displayMode === 'poster') {
    return (
      <div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center font-sans">
        <div className="bg-white max-w-lg w-full p-12 rounded-3xl shadow-2xl border-4 border-slate-900 text-center space-y-6">
          <div className="space-y-2">
            <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-14 mx-auto object-contain" />
            <h1 className="text-3xl font-black text-slate-900 font-recoleta">{hospitalName}</h1>
            <p className="text-sm font-bold text-blue-700 uppercase tracking-widest">Digital Reception System</p>
          </div>

          <div className="border-4 border-slate-900 p-6 rounded-3xl bg-slate-50 space-y-3">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">SCAN TO JOIN QUEUE</h2>
            <img src={qrUrl} alt="Entrance Poster QR" className="w-72 h-72 mx-auto border-2 border-slate-900 rounded-2xl" />
            <p className="text-xs font-mono font-bold text-slate-700">{intakeUrl}</p>
          </div>

          <div className="space-y-1 text-xs text-slate-600 font-bold">
            <p>1. Open Phone Camera & Scan QR Code</p>
            <p>2. Select Registered Doctor at {hospitalName}</p>
            <p>3. Pay Fee & Track Live Queue Number</p>
          </div>

          <div className="no-print flex gap-3 justify-center pt-4">
            <Button variant="primary" onClick={() => window.print()}>
              <Printer size={16} /> Print A4 Entrance Poster
            </Button>
            <Button variant="secondary" onClick={() => setDisplayMode('kiosk')}>
              Back to Console
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-recoleta text-slate-900">Hospital QR Code Kiosk</h1>
            <p className="text-xs text-slate-500 mt-1">
              Unique entrance QR code for {hospitalName} (`/book/${intakeToken}`)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setDisplayMode('poster')}>
              <Printer size={16} /> A4 Entrance Poster
            </Button>
            <Button variant="primary" onClick={() => setDisplayMode('fullscreen')} className="shadow-lg shadow-blue-600/30">
              Fullscreen Kiosk Mode
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Hospital Specific QR Code */}
          <Card className="lg:col-span-1 border border-slate-200 rounded-3xl shadow-md">
            <CardHeader title="Hospital Specific QR Code" />
            <CardContent className="py-6 text-center space-y-4">
              <img src={qrUrl} alt="Hospital Entrance QR Code" className="w-full max-w-xs mx-auto shadow-md rounded-2xl border border-slate-200" />
              <div className="bg-blue-50 text-blue-900 p-3 rounded-2xl text-xs font-semibold border border-blue-100">
                Shows ONLY registered doctors belonging to {hospitalName}
              </div>
            </CardContent>
          </Card>

          {/* Configuration & Printing Guide */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-slate-200 rounded-3xl shadow-md">
              <CardHeader title="Hospital Intake URL Configuration" />
              <CardContent className="py-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Facility Name</label>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-extrabold text-slate-900">
                    {hospitalName}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Entrance Single QR URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={intakeUrl}
                      readOnly
                      className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-2xl bg-slate-50 text-xs font-mono font-bold text-slate-800"
                    />
                    <Button variant="secondary" onClick={handleCopyUrl}>
                      <Copy size={16} />
                    </Button>
                    <Button variant="primary" onClick={() => window.open(intakeUrl, '_blank')}>
                      <ExternalLink size={16} />
                    </Button>
                  </div>
                  {copied && <p className="text-xs font-semibold text-emerald-600 mt-1">✓ Copied to clipboard!</p>}
                </div>

                <div className="flex gap-3 flex-wrap pt-2">
                  <Button variant="primary" onClick={() => handleDownloadQR('png')}>
                    <Download size={16} /> Download PNG
                  </Button>
                  <Button variant="secondary" onClick={() => handleDownloadQR('svg')}>
                    <Download size={16} /> Download SVG
                  </Button>
                  <button
                    onClick={handleRegenerateToken}
                    disabled={regenerating}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-700 font-bold rounded-2xl text-xs transition border border-red-200 flex items-center gap-1.5"
                  >
                    <ShieldAlert size={16} /> {regenerating ? 'Regenerating…' : 'Regenerate Token'}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Printing Guide */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-3 text-xs text-amber-900">
              <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                Hospital Entrance QR Printing Guide
              </h3>
              <ul className="list-disc list-inside space-y-1.5 font-medium text-amber-900">
                <li><strong>Minimum size:</strong> 4cm × 4cm (for smartphone camera focus)</li>
                <li><strong>Recommended size:</strong> 10cm × 10cm or full A4 entrance poster</li>
                <li><strong>Protection:</strong> Laminate poster to protect from scratches and glare</li>
                <li><strong>Placement:</strong> Mount at eye level near main reception door</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
