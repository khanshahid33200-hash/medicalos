import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactModal from './ContactModal'

const NAV_LINKS = [
  { to: '/', label: 'Product' },
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'QR System' },
  { to: '/architecture', label: 'Platform' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'Security' },
]

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 flex justify-center px-4 pt-4">
        <motion.div
          animate={{
            maxWidth: scrolled ? 1080 : 1280,
            paddingLeft: scrolled ? 10 : 24,
            paddingRight: scrolled ? 10 : 24,
            paddingTop: scrolled ? 8 : 14,
            paddingBottom: scrolled ? 8 : 14,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          className={`w-full flex items-center justify-between gap-4 rounded-2xl border transition-colors duration-300 ${
            scrolled
              ? 'bg-white/75 backdrop-blur-xl border-slate-200/80 shadow-[0_8px_30px_-12px_rgba(30,41,86,0.18)]'
              : 'bg-white/40 backdrop-blur-md border-white/40 shadow-none'
          }`}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/assets/brand-icon.png"
              alt="MedTech Fixaters Logo"
              className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col text-left leading-none">
              <span className="font-display font-extrabold text-[15px] text-[#131A2E] tracking-tight">
                Med Rapidly
              </span>
              <span className="text-[9px] font-semibold text-[#8890A6] tracking-wide mt-0.5">
                MEDTECH FIXATERS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-[13px] font-semibold text-[#4A5268]">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-3.5 py-2 rounded-lg transition-colors hover:text-[#131A2E] group"
              >
                <span className={isActive(link.to) ? 'text-[#4361EE]' : ''}>{link.label}</span>
                <span
                  className={`absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#4361EE] to-[#7C5CFC] origin-left transition-transform duration-300 ${
                    isActive(link.to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="px-4 py-2 text-[13px] font-bold text-[#131A2E] hover:bg-slate-900/5 rounded-xl transition"
            >
              Sign In
            </Link>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDemoModalOpen(true)}
              className="group px-4 py-2.5 bg-gradient-to-br from-[#4361EE] to-[#7C5CFC] text-white text-[13px] font-bold rounded-xl shadow-[0_8px_20px_-6px_rgba(67,97,238,0.55)] transition-shadow hover:shadow-[0_12px_28px_-6px_rgba(67,97,238,0.65)] flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#131A2E]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </motion.div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden fixed top-[76px] left-4 right-4 z-40 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl px-6 py-6 space-y-4 shadow-2xl"
          >
            <nav className="flex flex-col space-y-1 text-sm font-bold text-[#131A2E]">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 ${isActive(link.to) ? 'text-[#4361EE]' : ''}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/login" className="w-full text-center py-2.5 font-bold text-xs border border-slate-200 rounded-xl text-[#131A2E]">Sign In</Link>
              <button
                onClick={() => { setMobileMenuOpen(false); setDemoModalOpen(true) }}
                className="w-full text-center py-2.5 font-bold text-xs bg-gradient-to-br from-[#4361EE] to-[#7C5CFC] text-white rounded-xl shadow"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </>
  )
}
