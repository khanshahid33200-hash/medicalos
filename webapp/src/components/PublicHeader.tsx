import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, Shield, HeartPulse } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactModal from './ContactModal'

const NAV_LINKS = [
  { to: '/product', label: 'Product' },
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'QR System' },
  { to: '/about', label: 'Hospitals' },
  { to: '/architecture', label: 'Doctors' },
  { to: '/pricing', label: 'Security' },
]

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ─── FLOATING GLASSMORPHISM NAVBAR (EXACT MATCH TO REFERENCE) ─── */}
      <header
        className={`fixed top-4 inset-x-0 z-50 max-w-6xl mx-auto px-4 sm:px-6 transition-all duration-300`}
      >
        <div
          className={`h-16 rounded-full px-5 sm:px-6 flex items-center justify-between gap-6 transition-all duration-300 ${
            scrolled
              ? 'backdrop-blur-3xl bg-[#140E0C]/90 border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)]'
              : 'backdrop-blur-2xl bg-[#18110F]/80 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
          }`}
        >
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/assets/brand-icon.png"
              alt="MedTech Fixaters Logo"
              className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
              MedTech Fixaters
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors hover:text-white ${
                  isActive(link.to) ? 'text-white font-bold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/auth"
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-200 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link to="/book-demo">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#4A3AFF] to-[#6049FE] hover:from-[#3D2DE0] hover:to-[#4A3AFF] text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
              >
                Book a Demo
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 p-4 rounded-3xl bg-[#18110F]/95 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-3 text-left"
            >
              <nav className="space-y-1 text-xs font-semibold text-slate-200">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl bg-white/10 text-white font-bold text-xs"
                >
                  Login
                </Link>
                <Link
                  to="/book-demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl bg-[#4A3AFF] text-white font-bold text-xs block"
                >
                  Book a Demo
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ContactModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </>
  )
}
