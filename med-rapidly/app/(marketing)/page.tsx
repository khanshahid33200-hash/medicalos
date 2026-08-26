"use client";

import Link from "next/link";
import { CheckCircle2, Zap, Users, Clock, Smartphone, BarChart3, Shield, TrendingUp, Play } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="bg-white overflow-hidden">
      {/* Hero Section - Premium */}
      <section className="relative pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="feature-badge">
                <Shield className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-700">TRUSTED BY 500+ HOSPITALS</span>
              </div>

              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                  The best queue
                  <br />
                  <span className="text-teal-600">management system</span>
                  <br />
                  for your clinic.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                  Replace paper registers, eliminate waiting room chaos, and deliver real-time patient tracking. Built for hospitals of every size.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/contact"
                  className="btn-primary shadow-premium hover:shadow-premium-lg"
                >
                  Get Started
                  <span className="ml-2">→</span>
                </Link>
                <button className="btn-secondary">
                  <Play className="w-4 h-4" />
                  Watch Demo (2 min)
                </button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-3 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">250K+</div>
                  <div className="text-sm text-gray-600">Happy Users</div>
                </div>
              </div>
            </div>

            {/* Right Visual - Phone Mockups */}
            <div className="relative h-96 md:h-full min-h-96">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Decorative Circles */}
                <div className="absolute w-96 h-96 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full blur-3xl opacity-40" />
                <div className="absolute w-64 h-64 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full blur-2xl opacity-40 -bottom-20 -right-20" />

                {/* Phone Mockups */}
                <div className="relative z-10 flex gap-4 justify-center items-center">
                  {/* Phone 1 - Patient Intake */}
                  <div className="relative">
                    <div className="w-40 md:w-52 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-3 shadow-premium-lg">
                      <div className="bg-white rounded-2xl p-4 space-y-3 h-64 md:h-80 overflow-hidden">
                        <div className="h-6 bg-teal-600 rounded-full opacity-10" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                        <div className="space-y-2 pt-2">
                          <div className="h-12 bg-teal-50 rounded-lg border border-teal-200" />
                          <div className="h-12 bg-teal-50 rounded-lg border border-teal-200" />
                          <div className="h-10 bg-teal-600 rounded-lg" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -left-2 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold text-gray-900">
                      Patient Intake
                    </div>
                  </div>

                  {/* Phone 2 - Queue Tracking */}
                  <div className="relative -ml-8 md:-ml-12 transform translate-y-8">
                    <div className="w-40 md:w-52 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-3 shadow-premium-lg">
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-4 space-y-4 h-64 md:h-80">
                        <div className="bg-white rounded-lg p-3 space-y-2">
                          <div className="h-3 bg-gray-300 rounded w-1/2" />
                          <div className="h-6 text-center font-bold text-teal-600">ORT-07</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold">Now Serving</span>
                            <span>ORT-05</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold">Ahead of You</span>
                            <span>2 patients</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold">Est. Wait</span>
                            <span className="text-teal-600 font-bold">~12 min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold text-gray-900">
                      Live Tracking
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-16 border-b border-gray-200">
        <div className="container-premium">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Hospitals" },
              { number: "10M+", label: "Appointments" },
              { number: "4.9★", label: "Rating" },
              { number: "99.9%", label: "Uptime" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Trusted Partner Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container-premium">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 max-w-3xl">
            Your <span className="text-teal-600">trusted</span> partner
            <br />
            in patient management.
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl">
            We combine intelligent technology with healthcare best practices to deliver a secure, seamless experience for everyone.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Shield, title: "Bank-grade Security", desc: "Your data protected with enterprise encryption." },
              { icon: CheckCircle2, title: "100% Transparent", desc: "Real-time operations and complete audit trails." },
              { icon: Clock, title: "Always Available", desc: "24/7 support from real healthcare experts." },
              { icon: Zap, title: "Lightning Fast", desc: "Instant transactions and real-time updates." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-xl bg-white p-6 border border-gray-200 text-center hover:shadow-premium transition-all">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us - 3 Feature Cards */}
      <section className="py-16 md:py-24">
        <div className="container-premium">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-16 text-center">
            Why choose Med Rapidly
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "01.",
                title: "Expertise at Every Step",
                desc: "Get professional insights and personalized guidance for your clinic.",
                badge: "📊",
                color: "from-teal-50",
              },
              {
                number: "02.",
                title: "Industry Best Practices",
                desc: "We follow the highest healthcare standards to ensure safety and growth.",
                badge: "⭐",
                color: "from-teal-600",
                highlighted: true,
              },
              {
                number: "03.",
                title: "Protected by Insurance",
                desc: "Your funds and data covered by leading insurance providers.",
                badge: "🛡️",
                color: "from-rose-50",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 md:p-10 ${
                  card.highlighted
                    ? "gradient-primary text-white shadow-premium-lg"
                    : `bg-gradient-to-br ${card.color} to-transparent border border-gray-200`
                }`}
              >
                <div className="text-5xl font-bold mb-4 opacity-20">{card.number}</div>
                <h3 className={`text-2xl font-bold mb-3 ${card.highlighted ? "" : "text-gray-900"}`}>
                  {card.title}
                </h3>
                <p className={card.highlighted ? "text-teal-50" : "text-gray-600"}>{card.desc}</p>
                {card.highlighted && (
                  <Link href="/features" className="inline-flex items-center gap-2 mt-6 text-white font-semibold hover:gap-3 transition-all">
                    Learn More <span>→</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem vs Solution - Side by Side */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="container-premium">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16">
            From chaos to clarity
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-300 mb-6">Without Med Rapidly</h3>
              {[
                "Endless waiting with no visibility",
                "Frustrated patients in crowded corridors",
                "Receptionist handling non-stop inquiries",
                "Doctor gets bare paper slip",
                "Handwritten prescriptions get lost",
                "Zero insight into performance",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-red-400 font-bold flex-shrink-0">✗</span>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-teal-300 mb-6">With Med Rapidly</h3>
              {[
                "Real-time position tracking on phone",
                "Patients wait anywhere, tracked live",
                "Receptionist handles walk-ins only",
                "Doctor sees full patient history",
                "Digital Rx in seconds as PDF",
                "Complete analytics on every metric",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Overview Section */}
      <section className="py-16 md:py-24">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="text-sm font-semibold opacity-70 mb-4">CLINIC OVERVIEW</div>
              <div className="text-5xl font-bold mb-2">2,450</div>
              <div className="text-teal-400 text-lg font-semibold mb-6">Patients Today</div>
              <div className="h-32 bg-gradient-to-r from-teal-600/30 to-cyan-600/30 rounded-lg mb-6"></div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {[
                  { label: "Avg Wait", value: "12 min" },
                  { label: "Peak Hours", value: "2-4 PM" },
                  { label: "Satisfaction", value: "4.9★" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="opacity-70">{stat.label}</div>
                    <div className="font-bold text-lg">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Trusted platform anytime & anywhere.
              </h2>
              <div className="flex items-center gap-2 text-teal-600">
                <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
                <span className="font-semibold">4.8 / 5 from 150+ reviews</span>
              </div>
              <p className="text-lg text-gray-600">
                Med Rapidly is a secure and innovative ecosystem of healthcare products built to help you invest, earn, and grow — anytime & anywhere.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🔒", label: "Low Transaction Fees" },
                  { icon: "🌍", label: "Global Access" },
                  { icon: "📱", label: "Mobile First" },
                  { icon: "🚀", label: "Instant Setup" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn-primary shadow-premium hover:shadow-premium-lg inline-flex">
                Start Investing Now <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-900 to-teal-800 text-white">
        <div className="container-premium text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to transform your clinic?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join 500+ hospitals improving patient experience and streamlining operations. Start free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-teal-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all inline-flex items-center justify-center"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
