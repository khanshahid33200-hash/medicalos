import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Phone, Mail, MapPin, Clock, Send,
  CheckCircle2, Sparkles, ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import { useSEO } from '../hooks/useSEO'

export default function ContactPage() {
  useSEO({
    title: 'Contact Us — MedTech Fixaters Support & Sales',
    description: 'Get in touch with MedTech Fixaters for clinical onboarding, QR standee orders, enterprise deployments, and support.',
  })

  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', hospital: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#5B4DF5] selection:text-white">
      <PublicHeader />

      {/* Hero Header with Lavender Cloud Backdrop */}
      <section className="relative pt-36 sm:pt-44 pb-20 px-6 bg-gradient-to-b from-[#E9EDFF] via-[#F4F5FF] to-white text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-white/90 border border-indigo-100 text-xs font-extrabold text-[#5B4DF5] inline-block shadow-2xs">
            Connect With Our Team
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-[-0.035em] text-slate-900 leading-tight">
            We're Here to Help Your<br />Hospital Succeed.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
            Whether you need a quick demo, acrylic standee dispatch, or custom HIS integration, our team is ready to assist.
          </p>
        </div>
      </section>

      {/* Contact Form & Information */}
      <section className="py-16 sm:py-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Info Card (5 cols) */}
          <div className="md:col-span-5 bg-slate-50 p-8 rounded-3xl border border-slate-200/80 space-y-6">
            <h3 className="text-xl font-black text-slate-900">Direct Contacts</h3>
            <div className="space-y-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#5B4DF5]">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Phone Support</span>
                  <span className="font-bold text-slate-800">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#5B4DF5]">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Email Support</span>
                  <span className="font-bold text-slate-800">support@medtechfixaters.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#5B4DF5]">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Hospital Ops Response</span>
                  <span className="font-bold text-slate-800">Mon - Sat: 8:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-lg font-black text-slate-900">Message Received!</h4>
                <p className="text-xs text-slate-500">Our clinical solutions specialist will reach out to you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Dr. Amit Sharma"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5B4DF5]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5B4DF5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Hospital / Clinic Name</label>
                  <input
                    required
                    type="text"
                    placeholder="City Care Hospital"
                    value={formData.hospital}
                    onChange={e => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5B4DF5]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Message or Requirement</label>
                  <textarea
                    rows={3}
                    placeholder="We want to deploy QR standees across our 4 OPD departments..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5B4DF5]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#5B4DF5] hover:bg-[#4939E8] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2"
                >
                  <Send size={13} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
