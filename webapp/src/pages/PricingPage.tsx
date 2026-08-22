import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import ContactModal from '../components/ContactModal'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null)

  const plans = [
    {
      name: 'Solo Clinic',
      price: '₹1,999',
      period: '/ month',
      desc: 'Ideal for individual doctor clinics and general practitioners.',
      features: [
        'Single Doctor Profile',
        'Contactless Reception QR Kiosk',
        'Digital Rx Writing in < 30s',
        'Live Audio Callouts',
        'WhatsApp Receipt & e-Rx',
        '100% ABDM Compliant EMR',
        'Email & Phone Support'
      ],
      popular: false
    },
    {
      name: 'Polyclinic Pro',
      price: '₹3,999',
      period: '/ month',
      desc: 'Best for multi-specialty polyclinics with 2-5 doctors.',
      features: [
        'Up to 5 Doctor Profiles',
        'Individual Doctor QR Codes',
        'Digital Rx & Diagnostic Orders',
        'Reception Multi-Queue System',
        'WhatsApp & SMS Notifications',
        'Doctor Practice Analytics',
        'Dedicated Account Manager'
      ],
      popular: true
    },
    {
      name: 'Hospital Enterprise',
      price: '₹6,999',
      period: '/ month',
      desc: 'Complete reception & OPD queue management for hospitals.',
      features: [
        'Unlimited Doctor Profiles',
        'Multi-Department Reception Kiosks',
        'Custom Hospital EMR Integration',
        'Central Owner Admin Console',
        '24/7 Priority Support & Onsite Setup',
        'Custom Domain & Branding'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="Clinic OS Logo" className="h-10 object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/features" className="hover:text-blue-600 transition">Features</Link>
            <Link to="/pricing" className="text-blue-600 font-bold">Pricing</Link>
            <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/doctor" className="text-xs font-bold text-slate-700 hover:text-blue-600">Login</Link>
            <button
              onClick={() => setSelectedPlan({ name: 'Solo Clinic', price: '₹1,999 / mo' })}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow"
            >
              Buy Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-xs rounded-full border border-blue-100 uppercase tracking-widest">
            Transparent Pricing Plans
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-recoleta">
            Simple, affordable plans for <span className="text-blue-600">every clinic & hospital</span>
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto font-medium">
            No hidden setup fees. All plans include a 14-day free trial, unlimited QR check-ins, and ABDM compliance.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-3xl p-8 border ${
                plan.popular ? 'border-2 border-blue-600 shadow-2xl relative' : 'border-slate-200 shadow-md'
              } flex flex-col justify-between space-y-6`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider rounded-full shadow">
                  Most Popular for Clinics
                </span>
              )}

              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 font-recoleta">{plan.name}</h3>
                <p className="text-xs text-slate-500 font-medium min-h-[36px]">{plan.desc}</p>
                <div className="pt-2">
                  <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-xs font-bold text-slate-500">{plan.period}</span>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Plan Highlights:</p>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <Check size={16} className="text-blue-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlan({ name: plan.name, price: `${plan.price} / mo` })}
                className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Buy {plan.name} License
              </button>
            </div>
          ))}
        </div>
      </section>

      <ContactModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        planName={selectedPlan?.name}
        planPrice={selectedPlan?.price}
      />
    </div>
  )
}
