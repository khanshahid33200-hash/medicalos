import { useState } from 'react'
import {
  FileText,
  QrCode,
  Volume2,
  BarChart2,
  CheckCircle,
  ShieldCheck,
  Smartphone
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ContactModal from '../components/ContactModal'

export default function FeaturesPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <PublicHeader />

      {/* Hero */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-xs rounded-full border border-blue-100 uppercase tracking-widest">
            Complete Feature Suite
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-recoleta">
            Everything your clinic needs to <span className="text-blue-600">go 100% digital</span>
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto font-medium">
            Explore how Clinic OS streamlines reception check-ins, queue management, EMR prescription generation, and patient engagement.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
              <QrCode size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">1. Contactless QR Check-in</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Patients scan a QR code at reception, fill basic symptoms on their smartphone, and instantly receive a live queue token without touching reception pens or waiting in line.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Individual Doctor & Hospital QR System</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Real-time 2-second cross-device sync</li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">2. Rx Writing in &lt; 30 Seconds</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Doctor consultation workspace allowing rapid input of vitals, symptoms, medical diagnosis, and custom dosage instructions (1-0-1).
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Print prescription card layout</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Digital EMR timeline history</li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
              <Volume2 size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">3. Live Audio Queue Announcer</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Click "Call Next Patient" in doctor consultation window to trigger automated voice callouts in the waiting room screen ("Token #12 - Dr. Shahid Khan").
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Multi-lingual audio callouts</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Reduced OPD noise level</li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
              <Smartphone size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">4. WhatsApp Receipt & e-Rx</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Automatically send digital prescriptions, token updates, and follow-up reminders to patient phone numbers.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Zero paper waste</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> High patient satisfaction</li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
              <BarChart2 size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">5. Doctor Analytics & Reports</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Track daily consultation counts, OPD wait times, peak queue hours, and revenue trends across all hospital departments.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Real-time OPD analytics</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Exportable patient records</li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">6. ABDM & NDHM Compliant</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Built in compliance with Niti Aayog tele-consultation guidelines 2020 and ABDM Milestone-3 for encrypted medical storage.
            </p>
            <ul className="text-xs space-y-2 text-slate-700 font-bold pt-2">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> 128-bit AES Encryption</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Multi-tenant Doctor Isolation</li>
            </ul>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-10 text-center space-y-4 shadow-xl">
          <h2 className="text-3xl font-black font-recoleta">Ready to transform your clinic reception?</h2>
          <p className="text-xs text-blue-100 max-w-xl mx-auto font-medium">Join 4,500+ doctors across India using Clinic OS to digitalize patient records.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-8 py-3.5 bg-white text-blue-600 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-slate-50 transition"
          >
            Buy Clinic OS License Now →
          </button>
        </div>
      </section>

      <PublicFooter />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} planName="Clinic OS Pro Suite" planPrice="₹1,999 / mo" />
    </div>
  )
}
