import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, MapPin, Shield, AlertCircle, Loader2 } from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import { useSEO } from '../hooks/useSEO'

export default function ContactPage() {
  useSEO({
    title: 'Contact Us - Onboarding & Hospital Sales',
    description: 'Get in touch with MedTech Fixaters team for custom hospital onboarding, on-site reception kiosk setup, and OPD queue software assistance.',
  })

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    clinic_name: '',
    city: '',
    message: ''
  })

  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    const cleanPhone = formData.phone.trim().replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile phone number.')
      return
    }

    setIsSubmitting(true)

    // Simulate async network submission
    await new Promise((res) => setTimeout(res, 800))

    try {
      const existing = JSON.parse(localStorage.getItem('clinicos_leads') || '[]')
      existing.unshift({
        id: `lead-${Date.now()}`,
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim(),
        clinic_name: formData.clinic_name.trim(),
        city: formData.city.trim(),
        message: formData.message.trim(),
        timestamp: new Date().toLocaleString()
      })
      localStorage.setItem('clinicos_leads', JSON.stringify(existing))
    } catch (e) {}

    setIsSubmitting(false)
    navigate('/thank-you')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white flex flex-col justify-between">
      <PublicHeader />

      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50/30 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold tracking-wide">
            <Shield size={14} className="text-emerald-700" /> CONTACT MEDTECH FIXATERS
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            We'd love to hear from your <span className="text-emerald-700">medical team</span>
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto font-medium">
            Get in touch for custom hospital onboarding, on-site reception kiosk setup, or ABDM compliance assistance.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Info */}
          <div className="md:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Direct Support Helpline</h2>
              <p className="text-xs text-slate-600 font-medium">
                Our support desk is available Monday through Saturday (9 AM - 8 PM IST).
              </p>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-slate-400 font-normal">Phone / WhatsApp</p>
                  <p className="text-slate-900 font-bold">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-slate-400 font-normal">Email Inquiry</p>
                  <p className="text-slate-900 font-bold">shahidbcsm@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-slate-400 font-normal">Headquarters</p>
                  <p className="text-slate-900 font-bold">Prestige Blue Chip Software Park, Dairy Colony, Bengaluru - 560029</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Contact MedTech Fixaters Team</h3>

                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Full Name"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Clinic / Hospital Name</label>
                    <input
                      type="text"
                      value={formData.clinic_name}
                      onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                      placeholder="e.g. Metro Cardiology"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Kolkata, Mumbai"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message / Inquiry</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your clinic setup requirements..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs tracking-wider rounded-xl shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Submitting Inquiry...
                    </>
                  ) : (
                    'Submit Contact Inquiry'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
