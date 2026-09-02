import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactModal from './ContactModal'

// Design system: extracted Habitline token spec, translated to this
// product. Deliberately NOT sticky/glass/blurred — the reference navbar
// is transparent, 0px border, position:relative, backdropFilter:none; it
// scrolls away with the page rather than pinning with a glass background.
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
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className="relative z-50 bg-transparent">
        <div className="max-w-[1360px] mx-auto px-6 h-[124px] flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/assets/brand-icon.png"
              alt="MedTech Fixaters Logo"
              className="w-9 h-9 object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col text-left leading-none">
              <span className="font-habit-display font-medium text-[17px] text-black tracking-tight">
                Med Rapidly
              </span>
              <span className="text-[10px] font-medium text-[#494D4D] tracking-wide mt-1">
                MEDTECH FIXATERS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — classic link-blue, small, per spec */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[12px] leading-[1.5] transition-opacity hover:opacity-70 ${
                  isActive(link.to) ? 'font-medium' : 'font-normal'
                }`}
                style={{ color: '#0000EE' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="px-4 py-2.5 text-[15px] font-medium rounded-[50px] transition-colors hover:bg-[#E8E8E8]"
              style={{ color: '#131515' }}
            >
              Sign In
            </Link>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDemoModalOpen(true)}
              className="px-5 py-2.5 text-[15px] font-medium rounded-[50px] transition-shadow"
              style={{
                backgroundColor: '#0080E6',
                color: '#F7F7F7',
                boxShadow: 'rgba(0, 128, 230, 0.5) 0px 10px 15px 0px',
              }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
            style={{ color: '#131515' }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden fixed top-[110px] left-4 right-4 z-40 rounded-[20px] px-6 py-6 space-y-4"
            style={{ backgroundColor: '#F7F7F7', boxShadow: 'rgba(19, 21, 21, 0.5) 0px 4px 10px 0px, rgba(19, 21, 21, 0.5) 0px 10px 35px 0px' }}
          >
            <nav className="flex flex-col space-y-1">
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
                    className="block py-2 text-[15px] font-medium"
                    style={{ color: '#0000EE' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="pt-4 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center py-2.5 text-[15px] font-medium rounded-[50px]"
                style={{ backgroundColor: '#E8E8E8', color: '#131515' }}
              >
                Sign In
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); setDemoModalOpen(true) }}
                className="w-full text-center py-2.5 text-[15px] font-medium rounded-[50px]"
                style={{ backgroundColor: '#0080E6', color: '#F7F7F7', boxShadow: 'rgba(0, 128, 230, 0.5) 0px 10px 15px 0px' }}
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
