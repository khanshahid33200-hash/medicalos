"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Solo",
      desc: "Perfect for solo doctors and single-doctor practices",
      price: 499,
      period: "month",
      features: [
        "1 doctor account",
        "1 queue per doctor",
        "Patient intake form",
        "Live queue tracking",
        "Digital prescriptions",
        "Basic analytics",
        "Email support",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Clinic",
      desc: "For multi-specialty clinics and small hospitals",
      price: 1499,
      period: "month",
      features: [
        "Up to 10 doctors",
        "Unlimited queues",
        "All Solo features",
        "Department management",
        "Team management",
        "Advanced analytics",
        "Voice reception agent",
        "Priority support",
      ],
      cta: "Get Started",
      highlighted: true,
    },
    {
      name: "Enterprise",
      desc: "For large hospital chains and networks",
      price: "Custom",
      period: "",
      features: [
        "Unlimited doctors",
        "Unlimited hospitals",
        "Unlimited queues",
        "All Clinic features",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee (99.9%)",
        "24/7 phone support",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your practice. All plans include 30-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl transition-all duration-300 ${
                  plan.highlighted
                    ? "md:scale-105 shadow-2xl border-2 border-blue-600 bg-gradient-to-br from-white to-blue-50"
                    : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className="p-6 md:p-8">
                  {/* Header */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.desc}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      {typeof plan.price === "number" ? (
                        <>
                          <span className="text-5xl font-bold text-gray-900">
                            ${plan.price}
                          </span>
                          <span className="text-gray-600">/{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-5xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                      )}
                    </div>
                    {typeof plan.price === "number" && (
                      <p className="text-sm text-gray-500 mt-2">Billed monthly. Annual plans get 20% off.</p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/contact"
                    className={`w-full block text-center py-3 rounded-lg font-semibold transition-all duration-200 mb-8 ${
                      plan.highlighted
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                        : "border-2 border-gray-300 text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-900">What's included:</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 md:mb-14 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 md:space-y-8">
            {[
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes, you can change your plan anytime. Changes take effect at the next billing cycle.",
              },
              {
                q: "What's included in the free trial?",
                a: "Everything. Full access to all features for 30 days. No credit card required to start.",
              },
              {
                q: "Do you offer annual discounts?",
                a: "Yes, annual plans get 20% off the monthly price. You can pay for 10 months and get 12 months of service.",
              },
              {
                q: "Is there a setup fee?",
                a: "No setup fees. We handle the implementation for free, typically completed in 48 hours.",
              },
              {
                q: "What if I need to cancel?",
                a: "You can cancel anytime. No long-term contracts. We'll export your data within 24 hours.",
              },
              {
                q: "Do you provide training?",
                a: "Yes, included for all doctors, admins, and reception staff. Online and on-site options available.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-6 md:pb-8 last:border-b-0">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 md:mb-14 text-center">
            Detailed Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Solo</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Clinic</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Doctors", solo: "1", clinic: "Up to 10", enterprise: "Unlimited" },
                  { feature: "Departments", solo: "1", clinic: "Unlimited", enterprise: "Unlimited" },
                  { feature: "Patient Intake", solo: "✓", clinic: "✓", enterprise: "✓" },
                  { feature: "Live Queue Tracking", solo: "✓", clinic: "✓", enterprise: "✓" },
                  { feature: "Digital Prescriptions", solo: "✓", clinic: "✓", enterprise: "✓" },
                  { feature: "Voice Reception Agent", solo: "Add-on", clinic: "✓", enterprise: "✓" },
                  { feature: "Advanced Analytics", solo: "Basic", clinic: "Full", enterprise: "Full" },
                  { feature: "Custom Integrations", solo: "–", clinic: "–", enterprise: "✓" },
                  { feature: "Dedicated Support", solo: "Email", clinic: "Priority", enterprise: "24/7 Phone" },
                  { feature: "SLA", solo: "99%", clinic: "99.5%", enterprise: "99.9%" },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-900 font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{row.solo}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{row.clinic}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to streamline your clinic?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get started with a free 30-day trial. No credit card required.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </main>
  );
}
