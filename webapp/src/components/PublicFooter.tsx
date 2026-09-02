import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function PublicFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
      setSubscribed(false)
    }, 4000)
  }

  return (
    <footer className="bg-[#131515] text-[#b8b8b8] font-sans pt-16 pb-12 selection:bg-white selection:text-[#131515] border-t border-[#131515]/20">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white text-[#131515] flex items-center justify-center font-black text-sm">
                M
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="font-extrabold text-base text-white tracking-tight">Med Rapidly</span>
                <span className="text-[10px] font-semibold text-slate-400 mt-0.5">by MedTech Fixaters</span>
              </div>
            </Link>

            <p className="text-xs text-[#b8b8b8] leading-relaxed font-normal max-w-sm">
              The next-generation Clinical Operating System. Zero app install QR check-ins, live token tracking, and 30-second digital prescriptions.
            </p>

            {/* Newsletter form like in Framer reference */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-medium text-slate-400 block">
                No spam. Just simple product updates & clinical OPD tips.
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter your work email..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-full bg-white/10 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/40 font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-white text-[#131515] hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  {subscribed ? <span>Joined! ✓</span> : <span>Subscribe</span>}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs text-[#b8b8b8]">
              <li><Link to="/#features" className="hover:text-white transition">What's Inside</Link></li>
              <li><Link to="/#use-cases" className="hover:text-white transition">Use Cases</Link></li>
              <li><Link to="/#metrics" className="hover:text-white transition">Numbers & Proof</Link></li>
              <li><Link to="/#smart-assist" className="hover:text-white transition">Smart Assist</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Plans & Pricing</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Workspaces</h4>
            <ul className="space-y-2 text-xs text-[#b8b8b8]">
              <li><Link to="/dashboard" className="hover:text-white transition">Doctor Console</Link></li>
              <li><Link to="/hospitaladmin" className="hover:text-white transition">Hospital Admin</Link></li>
              <li><Link to="/display/live" className="hover:text-white transition">Live TV Board</Link></li>
              <li><Link to="/checkin" className="hover:text-white transition">QR Standee Kiosk</Link></li>
              <li><Link to="/track" className="hover:text-white transition">Patient Live Tracker</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs text-[#b8b8b8]">
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About MedTech</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li className="pt-2 text-[11px] text-slate-400">support@medtechfixaters.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Status Indicator */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MedTech Fixaters Systems. Powered by Motion Studio.</p>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational • 99.99%</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
