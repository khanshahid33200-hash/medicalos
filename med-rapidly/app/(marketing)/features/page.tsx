"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Users, BarChart3, Lock, Zap, Phone, FileText } from "lucide-react";

export default function FeaturesPage() {
  const patientFeatures = [
    {
      title: "Scan & Go",
      description: "One QR code at entrance. No signup. No app. No password.",
      icon: Zap,
    },
    {
      title: "Real-Time Tracking",
      description: "See your exact position in queue, people ahead, and wait time estimates.",
      icon: Clock,
    },
    {
      title: "Instant Notifications",
      description: "Alerts when 2 patients remain ahead, and when it's your turn.",
      icon: Phone,
    },
    {
      title: "Digital Prescriptions",
      description: "Download prescriptions as PDF instantly with doctor signature and letterhead.",
      icon: FileText,
    },
  ];

  const doctorFeatures = [
    {
      title: "Complete Patient History",
      description: "See all previous visits, diagnoses, prescriptions, and allergies instantly.",
      icon: FileText,
    },
    {
      title: "Queue Management",
      description: "Live queue list with one-click 'Call Next' button. Automatic queue advancement.",
      icon: Users,
    },
    {
      title: "Consultation Form",
      description: "Symptoms, vitals, diagnosis, and medicines all in one screen. Templates for common protocols.",
      icon: Zap,
    },
    {
      title: "Instant Prescriptions",
      description: "Generate professional PDFs with your signature. Delivered to patient in seconds.",
      icon: FileText,
    },
  ];

  const adminFeatures = [
    {
      title: "Hospital Dashboard",
      description: "See all departments and doctors. Track patients seen, wait times, peak hours.",
      icon: BarChart3,
    },
    {
      title: "Team Management",
      description: "Add doctors, assign to departments, set availability and daily limits.",
      icon: Users,
    },
    {
      title: "Complete Analytics",
      description: "Patient statistics, top diagnoses, per-doctor comparison, revenue metrics.",
      icon: BarChart3,
    },
    {
      title: "Security & Audit",
      description: "HIPAA-compliant. All access logged. Multi-tenant isolation enforced.",
      icon: Lock,
    },
  ];

  const FeatureGrid = ({ items }: { items: typeof patientFeatures }) => (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
      {items.map((feature, i) => {
        const Icon = feature.icon;
        return (
          <div
            key={i}
            className="group relative rounded-xl border border-gray-200 bg-white p-6 md:p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Complete Patient Queue Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every feature designed to eliminate waiting room chaos, improve patient experience, and give doctors complete visibility
          </p>
        </div>
      </section>

      {/* Patient Features */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 md:mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">For Patients</h2>
            <p className="text-lg text-gray-600">No account. No app. No password. Just scan and track.</p>
          </div>
          <FeatureGrid items={patientFeatures} />
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Doctor Features */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 md:mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">For Doctors</h2>
            <p className="text-lg text-gray-600">Patient history, queue management, and instant prescriptions in one place.</p>
          </div>
          <FeatureGrid items={doctorFeatures} />
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Admin Features */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 md:mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">For Hospital Admins</h2>
            <p className="text-lg text-gray-600">Hospital-wide visibility, team management, and complete analytics.</p>
          </div>
          <FeatureGrid items={adminFeatures} />
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 md:mb-14">Advanced Capabilities</h2>

          <div className="space-y-8 md:space-y-10">
            {[
              {
                title: "Voice Reception Agent",
                description: "AI assistant answers your phone line. Books appointments. Speaks Hindi & English. Always available.",
                features: [
                  "24/7 call answering",
                  "Automatic appointment booking",
                  "Multi-language support",
                  "Call transcripts and audit trail",
                ],
              },
              {
                title: "Real-Time Synchronization",
                description: "All screens stay in perfect sync. Doctor queue, reception tablet, waiting room TV, patient phone - all updated in <1 second.",
                features: [
                  "WebSocket live updates",
                  "Zero polling delays",
                  "Automatic queue advancement",
                  "Multi-device synchronization",
                ],
              },
              {
                title: "Complete Analytics",
                description: "Understand your clinic's performance with actionable metrics and trends.",
                features: [
                  "Patients seen (daily/weekly/monthly)",
                  "Average consultation time",
                  "No-show rates and patterns",
                  "Top diagnoses and treatments",
                  "Peak hours heatmap",
                  "Per-doctor comparison",
                  "Revenue analytics",
                ],
              },
              {
                title: "Security & Compliance",
                description: "Enterprise-grade security with HIPAA compliance and full audit trails.",
                features: [
                  "Field-level encryption for PHI",
                  "Row-level database security",
                  "Multi-tenant isolation",
                  "Complete audit logs",
                  "GDPR compliance",
                  "99.9% uptime SLA",
                ],
              },
            ].map((section, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-gray-600 mb-6">{section.description}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {section.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            See All Features in Action
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Schedule a personalized demo. We'll walk you through the complete workflow.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Request Demo
          </Link>
        </div>
      </section>
    </main>
  );
}
