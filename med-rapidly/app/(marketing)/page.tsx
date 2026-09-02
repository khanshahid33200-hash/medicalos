import Link from "next/link";
import { Grid3x3, Users, Clipboard, Lock, BarChart3, ArrowRight, Play } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-4">
                  ⭐ All-in-one OPD Management Platform
                </p>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  The smart OS for modern OPDs
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Med Rapidly digitizes your entire OPD workflow — from patient intake and live queues to consultations, prescriptions, and follow-ups.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Explore Product
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-all">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Watch Demo
                </button>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {['👨‍⚕️', '👩‍⚕️', '👨‍💼', '👩‍💼'].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg border-2 border-white">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Trusted by 500+ hospitals across India
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual - Dashboard Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8 text-white">
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-500 rounded-lg p-4">
                      <p className="text-2xl font-bold">256</p>
                      <p className="text-xs text-blue-200">Today's APT</p>
                    </div>
                    <div className="bg-blue-500 rounded-lg p-4">
                      <p className="text-2xl font-bold">68</p>
                      <p className="text-xs text-blue-200">Waiting</p>
                    </div>
                    <div className="bg-blue-500 rounded-lg p-4">
                      <p className="text-2xl font-bold">182</p>
                      <p className="text-xs text-blue-200">Consulting</p>
                    </div>
                    <div className="bg-blue-500 rounded-lg p-4">
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-xs text-blue-200">Doctors</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-500/50 rounded-lg p-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-xs font-bold text-white">RC</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Ravi Kumar</p>
                        <p className="text-xs text-blue-200">Cardiology</p>
                      </div>
                      <span className="text-lg font-bold">12</span>
                    </div>
                    <div className="bg-blue-500/50 rounded-lg p-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-xs font-bold text-white">NS</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Neha Singh</p>
                        <p className="text-xs text-blue-200">Orthopedics</p>
                      </div>
                      <span className="text-lg font-bold">13</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Phone Preview */}
              <div className="absolute -right-12 -bottom-12 w-48 h-64 bg-white rounded-3xl shadow-2xl border-8 border-gray-100 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-b from-blue-600 to-blue-700 rounded-2xl flex flex-col items-center justify-center text-white p-4">
                  <div className="text-center">
                    <p className="text-sm mb-2">Your Token</p>
                    <p className="text-3xl font-bold">CC-012</p>
                    <p className="text-xs text-blue-200 mt-2">You are next</p>
                    <p className="text-xs text-blue-200">Ahead of you 2 Patients</p>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg text-xs font-semibold">
                      View Queue Live
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600 font-semibold mb-8">Trusted by leading hospitals & clinics</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-60">
            {['MAX Healthcare', 'Apollo Hospitals', 'Fortis', 'Manipal', 'Rainbow'].map((hospital, i) => (
              <div key={i} className="text-center">
                <p className="font-semibold text-gray-700 text-sm">{hospital}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Game-changing features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Grid3x3, title: "Smart Patient Intake", desc: "QR-based registration. Only real, registered doctors are shown to patients." },
              { icon: Users, title: "Live Doctor Queues", desc: "Real-time queue numbers. Live updates for patients and doctors." },
              { icon: Clipboard, title: "Digital Prescriptions", desc: "Create, store & share e-prescriptions with ease." },
              { icon: Users, title: "Patient History", desc: "Access complete medical history in seconds." },
              { icon: Lock, title: "Secure & Private", desc: "Role-based access ensures 100% data security." },
              { icon: BarChart3, title: "Insights & Reports", desc: "Powerful analytics for better decisions." },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">How it works</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">From QR to Queue in 6 simple steps</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Patient scans hospital QR" },
              { step: 2, title: "Hospital name appears" },
              { step: 3, title: "Only registered doctors shown" },
              { step: 4, title: "Patient selects a doctor" },
              { step: 5, title: "Real queue number generated" },
              { step: 6, title: "Appointment appears live" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <p className="font-semibold text-gray-900">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Loved by doctors. Trusted by hospitals.</h2>
          <p className="text-center text-gray-600 mb-16">See what our users have to say about Med Rapidly.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Dr. Rajeev S.", hospital: "Fortis Hospital", quote: "Med Rapidly has completely changed the way our OPD runs. The queue system is fantastic." },
              { name: "Dr. Priya Mehta", hospital: "Apollo Hospitals", quote: "The digital prescriptions and patient history save us so much time every day." },
              { name: "Dr. Amit Verma", hospital: "Max Healthcare", quote: "Finally, an OPD software that doctors actually love to use." },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.hospital}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 text-white rounded-2xl mx-4 sm:mx-6 lg:mx-8 mb-20">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h2 className="text-4xl font-bold mb-6">Built for today. Ready for tomorrow.</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Easy to start, Works everywhere, Always secure.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
