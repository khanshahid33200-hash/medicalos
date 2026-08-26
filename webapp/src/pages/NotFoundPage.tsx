import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Stethoscope, HelpCircle } from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import { useSEO } from '../hooks/useSEO'

export default function NotFoundPage() {
  useSEO({
    title: '404 - Page Not Found',
    description: 'The requested page could not be found on MedTech Fixaters.',
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      <PublicHeader />

      <main className="max-w-4xl w-full mx-auto px-4 py-16 sm:py-24 text-center my-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200/80 space-y-8">
          {/* Badge & Number */}
          <div className="space-y-3">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-black uppercase tracking-widest inline-block">
              Error 404
            </span>
            <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-slate-900">
              4<span className="text-[#00875A]">0</span>4
            </h1>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Page Not Found
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto font-medium">
              The page you are trying to reach does not exist or has been moved. Please double check the URL or use one of the quick links below.
            </p>
          </div>

          {/* Quick Nav Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <Link
              to="/"
              className="p-5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-200 rounded-2xl transition text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <Home size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Main Website</h3>
              <p className="text-xs text-slate-500">Return to landing page hero</p>
            </Link>

            <Link
              to="/product"
              className="p-5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-200 rounded-2xl transition text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <Stethoscope size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Product Tour</h3>
              <p className="text-xs text-slate-500">Explore OPD Queue & EMR</p>
            </Link>

            <Link
              to="/contact"
              className="p-5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-200 rounded-2xl transition text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <HelpCircle size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Get Support</h3>
              <p className="text-xs text-slate-500">Contact team & book demo</p>
            </Link>
          </div>

          <div className="pt-2 flex justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-[#00875A] hover:bg-[#007043] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-emerald-700/20 transition flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back to Homepage
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
