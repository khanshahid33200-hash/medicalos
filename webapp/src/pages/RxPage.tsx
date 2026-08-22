import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Download, ShieldCheck, CheckCircle } from 'lucide-react'
import { Card } from '../components/Card'

export default function RxPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp' | 'prescriptions'>('phone')

  const [rxList, setRxList] = useState<any[]>([])

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return
    setStep('otp')
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) return

    setRxList([
      {
        id: 'rx-2026082230',
        token_number: '2026082230',
        doctor_name: 'Dr. Ashok Verma',
        hospital_name: 'City Care Hospital',
        department: 'Orthopaedics',
        date: '22 Aug 2026',
        diagnosis: 'Acute Knee Tendonitis',
        medicines: 'Tab. Paracetamol 650mg, Cap. Omeprazole 20mg'
      },
      {
        id: 'rx-2026041215',
        token_number: '2026041215',
        doctor_name: 'Dr. Sunita Rao',
        hospital_name: 'Metro Care General Hospital',
        department: 'General OPD',
        date: '12 Apr 2026',
        diagnosis: 'Viral Fever & Dehydration',
        medicines: 'Tab. Paracetamol 500mg, ORS Sachet'
      }
    ])
    setStep('prescriptions')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      <header className="max-w-xl mx-auto text-center space-y-2 mb-6">
        <Link to="/">
          <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-10 mx-auto object-contain" />
        </Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-recoleta">Digital Prescription Retrieval</h1>
        <p className="text-xs text-slate-500 font-medium">Retrieve & download your verified PDF prescriptions securely</p>
      </header>

      <div className="max-w-xl mx-auto">
        {step === 'phone' && (
          <Card className="rounded-3xl border border-slate-200 shadow-xl bg-white p-6 sm:p-8">
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <FileText className="text-blue-600 mx-auto" size={36} />
                <h3 className="text-xl font-bold font-recoleta">Enter Patient Phone Number</h3>
                <p className="text-xs text-slate-500">We will send a 6-digit OTP to verify your identity</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
              >
                Send Verification OTP →
              </button>
            </form>
          </Card>
        )}

        {step === 'otp' && (
          <Card className="rounded-3xl border border-slate-200 shadow-xl bg-white p-6 sm:p-8">
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="space-y-1">
                <CheckCircle className="text-emerald-600 mx-auto" size={36} />
                <h3 className="text-xl font-bold font-recoleta">Enter 6-Digit OTP</h3>
                <p className="text-xs text-slate-500">Sent via SMS to +91-{phone}</p>
              </div>

              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="1 2 3 4 5 6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-48 text-center text-2xl tracking-widest px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-600 outline-none mx-auto"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
              >
                Verify & Retrieve Prescriptions
              </button>
            </form>
          </Card>
        )}

        {step === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-recoleta">Verified Prescriptions ({rxList.length})</h3>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck size={14} /> 128-bit Encrypted
              </span>
            </div>

            {rxList.map((rx) => (
              <Card key={rx.id} className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-md hover:shadow-xl transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-mono text-[11px] font-bold rounded-full border border-blue-100">
                      Token: {rx.token_number}
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-1">{rx.doctor_name}</h4>
                    <p className="text-xs text-slate-500">{rx.hospital_name} • {rx.department}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{rx.date}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <p><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                  <p className="text-slate-600"><strong>Prescribed:</strong> {rx.medicines}</p>
                </div>

                <a
                  href={`#download-${rx.id}`}
                  onClick={() => alert(`Downloading Letterheaded PDF Prescription for Visit Token #${rx.token_number}...`)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Download size={16} /> Download Signed PDF Rx
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
