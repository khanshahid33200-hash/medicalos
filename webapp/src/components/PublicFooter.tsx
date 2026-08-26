import { Link } from 'react-router-dom'
import { ShieldCheck, Mail, Phone, MapPin, Award } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 font-sans border-t border-slate-900 pt-16 pb-12 selection:bg-emerald-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="MedTech Fixaters Logo" className="h-10 object-contain bg-white px-2 py-1 rounded-lg" />
              <div className="flex flex-col text-left">
                <span className="font-black text-xl text-white tracking-tight font-sans leading-none">MedTech Fixaters</span>
                <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase mt-0.5">Smart Healthcare Platform</span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-sm">
              MedTech Fixaters is India's leading Smart OPD & Reception Operating System for hospitals and clinics. We eliminate waiting lines, digitize prescriptions in under 30 seconds, and streamline multi-tenant doctor operations.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-emerald-400 text-[11px] font-bold rounded-full border border-slate-800">
                <ShieldCheck size={14} className="text-emerald-400" /> ISO 27001 Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-emerald-400 text-[11px] font-bold rounded-full border border-slate-800">
                <Award size={14} className="text-emerald-400" /> ABDM M3 Compliant
              </span>
            </div>
          </div>

          {/* Sitemap Col 1: Product & Features */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Our Product</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/product" className="hover:text-emerald-400 transition">Smart QR Reception Kiosk</Link>
              </li>
              <li>
                <Link to="/product" className="hover:text-emerald-400 transition">EHR Rx Prescription Engine</Link>
              </li>
              <li>
                <Link to="/product" className="hover:text-emerald-400 transition">Audio Queue Announcer</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-emerald-400 transition">WhatsApp Patient Receipts</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-emerald-400 transition">OPD Analytics & Reports</Link>
              </li>
              <li>
                <Link to="/checkin" className="hover:text-emerald-400 transition">Live Patient Kiosk Demo</Link>
              </li>
            </ul>
          </div>

          {/* Sitemap Col 2: Company */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Company</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition">Contact Us</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition">Doctor Portal</Link>
              </li>
              <li>
                <Link to="/hospitaladminmedtech" className="hover:text-emerald-400 transition">Hospital Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Sitemap Col 3: Contact Details */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Headquarters</h4>
            <div className="space-y-2 text-xs text-slate-400 font-medium">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Prestige Blue Chip Park, Dairy Colony, Bengaluru - 560029</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-emerald-400 flex-shrink-0" />
                <span>info@shahidkhan.site</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-400 flex-shrink-0" />
                <span>080 6823 6823 / +91 98765 43210</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MedTech Fixaters. All rights reserved. ABDM & HIPAA Compliant OPD System.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            <Link to="/privacy" className="hover:text-emerald-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-emerald-400 transition">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-emerald-400 transition">Refund Policy</Link>
            <Link to="/thank-you" className="hover:text-emerald-400 transition">Demo Status</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
