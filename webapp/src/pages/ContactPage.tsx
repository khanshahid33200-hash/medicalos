import { useState } from 'react'
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    clinic_name: '',
    city: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <PublicHeader />

      {/* Hero */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-xs rounded-full border border-blue-100 uppercase tracking-widest">
            Contact Clinic OS Support & Sales
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-recoleta">
            We'd love to hear from your <span className="text-blue-600">medical team</span>
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto font-medium">
            Get in touch for custom hospital onboarding, on-site reception kiosk setup, or ABDM compliance assistance.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Contact Details */}
          <div className="md:col-span-5 space-y-6 text-left">
            <h2 className="text-3xl font-black text-slate-900 font-recoleta">Get in touch with Clinic OS</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Have questions about digitizing your clinic reception, setting up QR check-in kiosks, or ABDM compliance? Our team is here to help.
            </p>

            <div className="space-y-4 text-xs font-semibold text-slate-700 pt-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Mail className="text-blue-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-slate-400 font-normal">Official Support Email</p>
                  <p className="text-slate-900 font-bold">info@shahidkhan.site</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Phone className="text-blue-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-slate-400 font-normal">Phone Helpline</p>
                  <p className="text-slate-900 font-bold">080 6823 6823 / +91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <MapPin className="text-blue-600 flex-shrink-0" size={20} />
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
              {submitted ? (
                <div className="text-center space-y-4 py-8">
                  <CheckCircle size={56} className="text-emerald-600 mx-auto" />
                  <h3 className="text-2xl font-bold font-recoleta">Message Received!</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Thank you, <strong>{formData.name}</strong>. Our clinic consultant will reach out to <strong>+91-{formData.phone}</strong> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-recoleta">Contact Clinic OS Team</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Full Name"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
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
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
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
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Kolkata, Mumbai"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition"
                  >
                    Submit Contact Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
