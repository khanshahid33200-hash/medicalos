import { useState } from 'react'
import { X, CheckCircle, ShieldCheck } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  planName?: string
  planPrice?: string
}

export default function ContactModal({ isOpen, onClose, planName = 'Solo Clinic', planPrice = '₹1,999 / month' }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    clinic_name: '',
    city: '',
    speciality: 'General Practice',
    plan: planName,
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const existing = JSON.parse(localStorage.getItem('clinicos_leads') || '[]')
      existing.unshift({
        id: `lead-${Date.now()}`,
        ...formData,
        timestamp: new Date().toLocaleString()
      })
      localStorage.setItem('clinicos_leads', JSON.stringify(existing))
    } catch (e) {
      // ignore
    }
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 relative text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-bold shadow-md">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-recoleta">Request Received!</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Thank you for choosing <strong>Clinic OS ({planName})</strong>. Our clinic digitalization team will contact you at <strong>+91-{formData.phone}</strong> within 2 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                onClose()
              }}
              className="w-full py-3 bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider rounded-full border border-blue-100">
                Buy Plan: {planName} ({planPrice})
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1 font-recoleta">
                Get Clinic OS Digitalized
              </h3>
              <p className="text-xs text-slate-500 font-medium">Fill details below to activate your 14-day free trial or buy license.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Doctor / Admin Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Clinic / Hospital Name</label>
                <input
                  type="text"
                  placeholder="e.g. Care Heart Clinic"
                  value={formData.clinic_name}
                  onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Kolkata, Delhi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">Doctor Speciality</label>
              <input
                type="text"
                placeholder="e.g. Cardiology, Pediatrics, General OPD"
                value={formData.speciality}
                onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Directly transmitted to Clinic OS Owner Console (/mrshahidbabu)</span>
            </p>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition"
            >
              Confirm & Buy Now ({planPrice})
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
