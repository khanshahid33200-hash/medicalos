import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactModal from './ContactModal'

const NAV_LINKS = [
  { to: '/#features', label: "What's Inside" },
  { to: '/#use-cases', label: 'Use Cases' },
  { to: '/#metrics', label: 'Metrics' },
  { to: '/#smart-assist', label: 'Smart Assist' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/how-it-works', label: 'QR System' },
]

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className="fixed top-4 sm:top-5 inset-x-0 mx-auto z-50 max-w-5xl w-[92%] transition-all">
        <div className="bg-white/85 backdrop-blur-xl border border-[#e8e8e8] shadow-sm shadow-black/[0.04] rounded-full px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#131515] text-white flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform shadow-xs">
              M
            </div>
            <div className="flex flex-col text-left leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-[#131515] tracking-tight">
                  Med Rapidly
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  Clinical OS
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => {
              const active = isActive(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-xs font-semibold transition-colors ${
                    active ? 'text-[#131515]' : 'text-[#494d4d] hover:text-[#131515]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-[#131515] hover:text-black transition rounded-full hover:bg-[#f2f2f2]"
            >
              Sign In
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDemoModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#131515] hover:bg-black rounded-full shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight size={13} />
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#131515] hover:bg-[#f2f2f2] rounded-full transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mt-2 p-5 bg-white/95 backdrop-blur-2xl border border-[#e8e8e8] shadow-2xl rounded-3xl space-y-4 md:hidden text-left"
            >
              <div className="flex flex-col space-y-2.5">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-bold text-[#131515] hover:text-indigo-600 transition py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-bold text-[#131515] bg-[#f7f7f7] rounded-xl"
                >
                  Doctor Sign In
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setDemoModalOpen(true)
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#131515] rounded-xl"
                >
                  Get Started Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Book Demo Contact Modal */}
      <ContactModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </>
  )
}
