import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, Building2, User, Sparkles } from 'lucide-react'
import ContactModal from './ContactModal'

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm selection:bg-blue-600 selection:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-10 object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <Link
              to="/"
              className={`transition hover:text-blue-600 ${isActive('/') ? 'text-blue-600 font-extrabold' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/product"
              className={`transition hover:text-blue-600 ${isActive('/product') ? 'text-blue-600 font-extrabold' : ''}`}
            >
              Our Product
            </Link>
            <Link
              to="/features"
              className={`transition hover:text-blue-600 ${isActive('/features') ? 'text-blue-600 font-extrabold' : ''}`}
            >
              Features
            </Link>
            <Link
              to="/about"
              className={`transition hover:text-blue-600 ${isActive('/about') ? 'text-blue-600 font-extrabold' : ''}`}
            >
              About Us
            </Link>
            <Link
              to="/pricing"
              className={`transition hover:text-blue-600 ${isActive('/pricing') ? 'text-blue-600 font-extrabold' : ''}`}
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className={`transition hover:text-blue-600 ${isActive('/contact') ? 'text-blue-600 font-extrabold' : ''}`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-extrabold text-slate-700 hover:text-blue-600 transition flex items-center gap-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100"
            >
              <User size={14} className="text-blue-600" /> Doctor Login
            </Link>

            <Link
              to="/login/hospitaladmin009"
              className="px-4 py-2 text-xs font-extrabold text-slate-700 hover:text-blue-600 transition flex items-center gap-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100"
            >
              <Building2 size={14} className="text-indigo-600" /> Hospital Portal
            </Link>

            <button
              onClick={() => setDemoModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
            >
              <Sparkles size={14} /> Request Demo
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-700">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/') ? 'text-blue-600' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/product"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/product') ? 'text-blue-600' : ''}`}
              >
                Our Product
              </Link>
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/features') ? 'text-blue-600' : ''}`}
              >
                Features
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/about') ? 'text-blue-600' : ''}`}
              >
                About Us
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/pricing') ? 'text-blue-600' : ''}`}
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 border-b border-slate-100 ${isActive('/contact') ? 'text-blue-600' : ''}`}
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
                <User size={15} /> Doctor Portal Login
              </Link>
              <Link
                to="/login/hospitaladmin009"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl flex items-center justify-center gap-2 border border-slate-200"
              >
                <Building2 size={15} /> Hospital Admin Login
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setDemoModalOpen(true)
                }}
                className="w-full py-3 bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                Book Live Demo <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </header>

      <ContactModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} planName="Clinic OS Live Demo" planPrice="Free Consultation" />
    </>
  )
}
