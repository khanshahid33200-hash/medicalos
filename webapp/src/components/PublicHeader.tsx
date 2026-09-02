import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import ContactModal from './ContactModal'

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E9F0] shadow-sm selection:bg-[#4361EE] selection:text-white">
        <div className="max-w-[1360px] mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/assets/brand-icon.png"
              alt="MedTech Fixaters Logo"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-lg text-[#18233D] tracking-tight leading-tight">
                Med Rapidly
              </span>
              <span className="text-[10px] font-medium text-[#5E687B]">
                by MedTech Fixaters • Smart Hospital
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Separated Dedicated Pages) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-[#5E687B]">
            <Link
              to="/"
              className={`transition hover:text-[#18233D] ${isActive('/') ? 'text-[#4361EE] font-bold border-b-2 border-[#4361EE] pb-0.5' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/features"
              className={`transition hover:text-[#18233D] ${isActive('/features') ? 'text-[#4361EE] font-bold border-b-2 border-[#4361EE] pb-0.5' : ''}`}
            >
              Features
            </Link>
            <Link
              to="/how-it-works"
              className={`transition hover:text-[#18233D] ${isActive('/how-it-works') ? 'text-[#4361EE] font-bold border-b-2 border-[#4361EE] pb-0.5' : ''}`}
            >
              How It Works
            </Link>
            <Link
              to="/pricing"
              className={`transition hover:text-[#18233D] ${isActive('/pricing') ? 'text-[#4361EE] font-bold border-b-2 border-[#4361EE] pb-0.5' : ''}`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`transition hover:text-[#18233D] ${isActive('/about') ? 'text-[#4361EE] font-bold border-b-2 border-[#4361EE] pb-0.5' : ''}`}
            >
              About Us
            </Link>
            <Link
              to="/architecture"
              className={`transition hover:text-[#18233D] ${isActive('/architecture') ? 'text-[#4361EE] font-bold border-b-2 border-[#4361EE] pb-0.5' : ''}`}
            >
              Platform
            </Link>
            <Link
              to="/contact"
              className={`transition hover:text-[#18233D] ${isActive('/contact') ? 'text-[#4361EE] font-bold border-b-2 border-[#4361EE] pb-0.5' : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-[#18233D] hover:text-[#4361EE] bg-white hover:bg-slate-50 rounded-xl border border-[#E6E9F0] transition"
            >
              Login
            </Link>
            <button
              onClick={() => setDemoModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#4361EE] to-[#5D4CC8] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#18233D] hover:text-[#4361EE]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E6E9F0] px-6 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3 text-sm font-bold text-[#18233D]">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={isActive('/') ? 'text-[#4361EE]' : ''}>Home</Link>
              <Link to="/features" onClick={() => setMobileMenuOpen(false)} className={isActive('/features') ? 'text-[#4361EE]' : ''}>Features</Link>
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className={isActive('/how-it-works') ? 'text-[#4361EE]' : ''}>How It Works</Link>
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className={isActive('/pricing') ? 'text-[#4361EE]' : ''}>Pricing</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={isActive('/about') ? 'text-[#4361EE]' : ''}>About Us</Link>
              <Link to="/architecture" onClick={() => setMobileMenuOpen(false)} className={isActive('/architecture') ? 'text-[#4361EE]' : ''}>Platform</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={isActive('/contact') ? 'text-[#4361EE]' : ''}>Contact</Link>
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/login" className="w-full text-center py-2.5 font-bold text-xs border border-[#E6E9F0] rounded-xl text-[#18233D]">Login</Link>
              <button
                onClick={() => { setMobileMenuOpen(false); setDemoModalOpen(true); }}
                className="w-full text-center py-2.5 font-bold text-xs bg-gradient-to-r from-[#4361EE] to-[#5D4CC8] text-white rounded-xl shadow"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      <ContactModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </>
  )
}
