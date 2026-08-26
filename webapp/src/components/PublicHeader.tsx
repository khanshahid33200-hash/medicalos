import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, User, Building2 } from 'lucide-react'
import ContactModal from './ContactModal'

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 selection:bg-emerald-600 selection:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          {/* MedTech Fixaters Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/assets/logo.png" alt="MedTech Fixaters Logo" className="h-10 object-contain group-hover:scale-105 transition-transform" />
            <div className="flex flex-col text-left">
              <span className="font-black text-xl text-slate-900 tracking-tight font-sans leading-none">MedTech Fixaters</span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-widest uppercase mt-0.5">Smart OPD & EMR Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <div className="relative py-1">
              <Link
                to="/"
                className={`transition hover:text-emerald-800 ${isActive('/') ? 'text-slate-900 font-extrabold' : ''}`}
              >
                Home
              </Link>
              {isActive('/') && <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mx-auto mt-1" />}
            </div>

            <div className="relative py-1">
              <Link
                to="/product"
                className={`transition hover:text-emerald-800 ${isActive('/product') ? 'text-slate-900 font-extrabold' : ''}`}
              >
                Our Product
              </Link>
              {isActive('/product') && <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mx-auto mt-1" />}
            </div>

            <div className="relative py-1">
              <Link
                to="/about"
                className={`transition hover:text-emerald-800 ${isActive('/about') ? 'text-slate-900 font-extrabold' : ''}`}
              >
                About Us
              </Link>
              {isActive('/about') && <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mx-auto mt-1" />}
            </div>

            <div className="relative py-1">
              <Link
                to="/features"
                className={`transition hover:text-emerald-800 ${isActive('/features') ? 'text-slate-900 font-extrabold' : ''}`}
              >
                Features
              </Link>
              {isActive('/features') && <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mx-auto mt-1" />}
            </div>

            <div className="relative py-1">
              <Link
                to="/contact"
                className={`transition hover:text-emerald-800 ${isActive('/contact') ? 'text-slate-900 font-extrabold' : ''}`}
              >
                Contact Us
              </Link>
              {isActive('/contact') && <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mx-auto mt-1" />}
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 transition flex items-center gap-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100"
            >
              <User size={14} className="text-emerald-700" /> Doctor Portal
            </Link>

            <Link
              to="/hospitaladminmedtech"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 transition flex items-center gap-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100"
            >
              <Building2 size={14} className="text-emerald-700" /> Hospital Portal
            </Link>

            <button
              onClick={() => setDemoModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs tracking-wide rounded-full shadow-md shadow-emerald-950/20 transition flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-emerald-800 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-700">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/') ? 'text-emerald-700' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/product"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/product') ? 'text-emerald-700' : ''}`}
              >
                Our Product
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/about') ? 'text-emerald-700' : ''}`}
              >
                About Us
              </Link>
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/features') ? 'text-emerald-700' : ''}`}
              >
                Features
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/contact') ? 'text-emerald-700' : ''}`}
              >
                Contact Us
              </Link>
            </nav>

            <div className="pt-2 space-y-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl flex items-center justify-center gap-2 border border-slate-200"
              >
                <User size={15} className="text-emerald-700" /> Doctor Portal Login
              </Link>
              <Link
                to="/hospitaladminmedtech"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl flex items-center justify-center gap-2 border border-slate-200"
              >
                <Building2 size={15} className="text-emerald-700" /> Hospital Admin Login
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setDemoModalOpen(true)
                }}
                className="w-full py-3 bg-emerald-950 text-white font-extrabold text-xs tracking-wider rounded-xl shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2"
              >
                <span>Get Started Now</span> <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </header>

      <ContactModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} planName="Clinic OS Demo" planPrice="Free Consultation" />
    </>
  )
}
