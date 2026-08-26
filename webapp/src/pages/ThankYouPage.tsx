import { Link } from 'react-router-dom'
import { CheckCircle, PhoneCall, ArrowRight, Clock } from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import { useSEO } from '../hooks/useSEO'

export default function ThankYouPage() {
  useSEO({
    title: 'Thank You - Demo Request Received',
    description: 'Thank you for requesting a demo of MedTech Fixaters Smart OPD & EMR system. Our onboarding specialist will contact you shortly.',
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      <PublicHeader />

      <main className="max-w-3xl w-full mx-auto px-4 py-16 sm:py-24 text-center my-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200/80 space-y-8 text-left">
          {/* Top Success Icon */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 text-[#00875A] rounded-3xl flex items-center justify-center mx-auto shadow-md">
              <CheckCircle size={36} />
            </div>
            <span className="px-4 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-black uppercase tracking-wider inline-block">
              Request Received
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Thank You! We've Received Your Details.
            </h1>
            <p className="text-sm text-slate-600 font-medium max-w-lg mx-auto">
              Our clinical onboarding team is reviewing your information and will reach out to schedule your live 1-on-1 OPD Smart System walkthrough.
            </p>
          </div>

          {/* Expectations Timeline Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-black text-slate-900 tracking-wide uppercase flex items-center gap-2">
              <Clock size={16} className="text-[#00875A]" /> What Happens Next?
            </h3>
            <div className="space-y-3 text-xs font-medium text-slate-700">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">1</span>
                <div>
                  <strong className="text-slate-900 block">Verification Call (Within 2 Hours)</strong>
                  <p className="text-slate-500">A clinical specialist will call your registered phone number to confirm OPD daily patient volume.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">2</span>
                <div>
                  <strong className="text-slate-900 block">Instant WhatsApp Credentials</strong>
                  <p className="text-slate-500">You will receive a demo intake QR code and sample Rx templates directly on WhatsApp.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">3</span>
                <div>
                  <strong className="text-slate-900 block">Zero-Cost Setup Guarantee</strong>
                  <p className="text-slate-500">We assist in setting up your clinic printer and QR signage boards for immediate deployment.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/919876543210?text=Hi%20MedTech%20Fixaters%2C%20I%20just%20submitted%20a%20demo%20request."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
            >
              <PhoneCall size={16} /> Instant WhatsApp Connect
            </a>

            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs uppercase tracking-wider rounded-full border border-slate-200 transition flex items-center justify-center gap-2"
            >
              <span>Back to Homepage</span> <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
