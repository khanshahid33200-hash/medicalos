import { Link } from 'react-router-dom'
import { ShieldCheck, Mail, Phone, MapPin, Award } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="bg-[#18233D] text-slate-400 font-sans border-t border-slate-800 pt-16 pb-12 selection:bg-[#4361EE] selection:text-white">
      <div className="max-w-[1360px] mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/brand-icon.png" alt="MedTech Fixaters Logo" className="w-9 h-9 object-contain" />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-xl text-white tracking-tight leading-tight">Med Rapidly</span>
                <span className="text-[10px] font-medium text-indigo-300">by MedTech Fixaters • Smart Hospital</span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-sm">
              Med Rapidly by MedTech Fixaters is India's leading Smart OPD & Reception Operating System. We eliminate crowded hospital waiting lines, generate digital prescriptions in under 30 seconds, and streamline multi-tenant clinical operations.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-indigo-300 text-[10px] font-bold rounded-full border border-slate-700">
                <ShieldCheck size={13} className="text-[#4361EE]" /> ISO 27001 Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-emerald-400 text-[10px] font-bold rounded-full border border-slate-700">
                <Award size={13} className="text-emerald-400" /> HIPAA Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-purple-300 text-[10px] font-bold rounded-full border border-slate-700">
                <Award size={13} className="text-purple-300" /> ABDM Ready
              </span>
            </div>
          </div>

          {/* Product & Modules */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Product & Modules</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/features" className="hover:text-white transition">Platform Features</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/product" className="hover:text-white transition">Product Tour</Link></li>
              <li><Link to="/architecture" className="hover:text-white transition">System Architecture</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Pricing & Plans</Link></li>
              <li><Link to="/track" className="hover:text-white transition">Live Patient Queue</Link></li>
            </ul>
          </div>

          {/* Solutions & Workspaces */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Workspaces</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/hospitaladmin" className="hover:text-white transition">Hospital Admin Console</Link></li>
              <li><Link to="/doctor" className="hover:text-white transition">Doctor Consultation Pad</Link></li>
              <li><Link to="/display/live" className="hover:text-white transition">TV Queue Display Board</Link></li>
              <li><Link to="/checkin" className="hover:text-white transition">Reception Manual Kiosk</Link></li>
              <li><Link to="/mrshahidbabu" className="hover:text-white transition">Root Platform Admin</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Company & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
              <li className="pt-2 text-slate-400 font-mono text-[11px]">Helpline: +91 98765 43210</li>
              <li className="text-slate-400 font-mono text-[11px]">support@medtechfixaters.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MedTech Fixaters Healthcare Systems. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span>Mumbai • Delhi NCR • Bengaluru • Pune</span>
            <span className="text-slate-400">256-Bit SSL/TLS Encrypted Multi-Hospital Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
