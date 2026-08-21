import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Phone, User, AlertCircle, CheckCircle, Ticket, Clock, ShieldCheck, Smile } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/Card'
import Button from '../components/Button'
import { useSubmitCheckin } from '../hooks/useApi'
import { addCheckinToDoctorQueue } from '../utils/doctorStore'

export default function Checkin() {
  const [searchParams] = useSearchParams()

  // Extract doctor and hospital details from QR Code parameters
  const doctorName = searchParams.get('doctor_name') || searchParams.get('doctor') || 'Dr. Authorized Doctor'
  const doctorId = searchParams.get('doctor_id') || 'doc-001'
  const departmentName = searchParams.get('department') || 'Cardiology'
  const hospitalName = searchParams.get('hospital_name') || searchParams.get('hospital') || 'Metro Care General Hospital'

  const [step, setStep] = useState<'form' | 'success'>('form')
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    age: '',
    gender: 'M',
    symptoms: '',
    medical_history: '',
    allergies: '',
    current_medications: '',
    duration_symptoms: '',
    severity: 'moderate',
    chronic_conditions: '',
    consent_ai_triage: true,
    doctor_id: doctorId,
    source: 'qr_kiosk',
  })

  const [response, setResponse] = useState<any>(null)
  const { mutate: submitCheckin, isLoading, error } = useSubmitCheckin()

  useEffect(() => {
    setFormData((prev) => ({ ...prev, doctor_id: doctorId }))
  }, [doctorId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '' && value !== null)
    )

    const payload: Record<string, any> = { ...cleanedData, doctor_id: doctorId }
    if (payload.age && typeof payload.age === 'string') {
      payload.age = parseInt(payload.age, 10)
    }

    // Save directly to Doctor-Specific Queue Store
    const newItem = addCheckinToDoctorQueue(doctorId, payload)

    submitCheckin(payload, {
      onSuccess: (data) => {
        setResponse({
          ...data.data,
          queue_number: newItem.token_number,
          receipt_number: `RCP-${Date.now().toString().substring(5)}`,
        })
        setStep('success')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      onError: () => {
        // Fallback store confirmation
        setResponse({
          queue_number: newItem.token_number,
          receipt_number: `RCP-${Date.now().toString().substring(5)}`,
          estimated_wait_minutes: 10,
          message: `Check-in successful! Please wait in room for ${doctorName}.`
        })
        setStep('success')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white pb-12">
      {/* Docon Patient Header Banner (No login required) */}
      <header className="bg-white border-b border-slate-200 shadow-sm py-6 px-4 mb-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-full text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
              <Smile size={22} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              docon <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Patient QR Check-in</span>
            </span>
          </Link>
          <div className="text-right text-xs">
            <p className="font-extrabold text-slate-900">{doctorName}</p>
            <p className="text-blue-600 font-medium">{departmentName} • {hospitalName}</p>
          </div>
        </div>
      </header>

      {/* Main Check-in Form / Success View */}
      <div className="max-w-2xl mx-auto px-4">
        {step === 'success' && response ? (
          <div className="space-y-6">
            <Card className="border-2 border-emerald-500 bg-emerald-50/50 shadow-xl overflow-hidden rounded-3xl">
              <div className="bg-emerald-600 text-white text-center py-6 px-4">
                <CheckCircle size={56} className="mx-auto mb-2" />
                <h2 className="text-2xl font-black">Check-in Confirmed!</h2>
                <p className="text-emerald-100 text-xs mt-1">Your details have been sent directly to {doctorName}'s live Docon queue.</p>
              </div>

              <CardContent className="py-8 px-6 space-y-6 text-center">
                {/* Queue Token & Receipt Badge */}
                <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Live Queue Token</p>
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-700 font-black text-4xl rounded-2xl border border-blue-200 shadow-inner">
                    <Ticket size={32} /> {response.queue_number}
                  </div>
                  <p className="text-xs font-mono text-slate-500">Receipt Ref: {response.receipt_number}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-700 font-semibold text-sm">
                    <Clock className="text-blue-600" size={18} />
                    <span>Estimated Wait Time: {response.estimated_wait_minutes || 10} mins</span>
                  </div>
                </div>

                <div className="bg-blue-50 text-blue-900 border border-blue-200 rounded-2xl p-4 text-xs font-medium">
                  💡 Please take a seat in the <strong>{departmentName}</strong> waiting area. You will hear an audio call when {doctorName} is ready.
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setStep('form')
                    setResponse(null)
                  }}
                  className="w-full shadow-lg shadow-blue-600/30 rounded-xl"
                >
                  Submit Another Patient Check-in
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 items-center">
                <AlertCircle className="text-rose-600 flex-shrink-0" size={20} />
                <p className="text-rose-700 text-xs font-medium">Please verify your details and resubmit.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Patient Info */}
              <Card className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-blue-600 text-white py-4">
                  <h2 className="text-base font-extrabold flex items-center gap-2">
                    <User size={18} /> 1. Patient Information
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        <Phone size={14} className="inline mr-1 text-blue-600" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91-9876543210"
                        required
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        <User size={14} className="inline mr-1 text-blue-600" /> Full Patient Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Patient Full Name"
                        required
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="35"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Symptoms & Health Concerns */}
              <Card className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-800 text-white py-4">
                  <h2 className="text-base font-extrabold flex items-center gap-2">
                    <ShieldCheck size={18} /> 2. Symptoms & Health Reason
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Describe Symptoms / Reason for Visit *
                    </label>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleChange}
                      placeholder="Describe symptoms here..."
                      required
                      rows={3}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Symptom Severity</label>
                      <select
                        name="severity"
                        value={formData.severity}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Duration of Symptoms</label>
                      <input
                        type="text"
                        name="duration_symptoms"
                        value={formData.duration_symptoms}
                        onChange={handleChange}
                        placeholder="e.g. 2 days"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Medical History & Allergies */}
              <Card className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-900 text-white py-4">
                  <h2 className="text-base font-extrabold">3. Medical History & Allergies (Optional)</h2>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Known Allergies</label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="e.g. Penicillin"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Current Medications</label>
                    <input
                      type="text"
                      name="current_medications"
                      value={formData.current_medications}
                      onChange={handleChange}
                      placeholder="e.g. Paracetamol"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full py-4 text-sm font-extrabold shadow-xl shadow-blue-600/30 rounded-2xl bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Generating Queue Token...' : `Confirm Check-in for ${doctorName}`}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
