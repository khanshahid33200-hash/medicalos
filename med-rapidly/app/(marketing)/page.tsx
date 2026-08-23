import Link from "next/link";
import { CheckCircle2, Zap, Users, Clock, Smartphone, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Replace Your Paper Queue with a Digital One
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Med Rapidly replaces the paper register at the front desk and the crowd of people waiting in the corridor with a queue that runs on the patient's own phone.
            </p>
            <div className="flex gap-4">
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                href="/features"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white">
            <div className="text-center py-20">
              <Smartphone className="w-24 h-24 mx-auto mb-4" />
              <p className="text-lg">Scan QR → Choose Doctor → Get Token</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">The Problem</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Today's OPD</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✗</span>
                  <span>Patients crowd the corridor with no idea how long they'll wait</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✗</span>
                  <span>Receptionist answers "how long more?" all day</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✗</span>
                  <span>Doctor gets a paper slip with no patient history</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✗</span>
                  <span>Prescriptions are handwritten and easily lost</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✗</span>
                  <span>No visibility into hospital performance</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">With Med Rapidly</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>Patients track their position in real-time on their phone</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>Queue management is automatic, no manual tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>Doctor has complete patient history on screen</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>Digital prescriptions delivered instantly as PDF</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>Real-time analytics on patients, wait times, diagnoses</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: QrCode,
              title: "One QR Code",
              description: "One code per hospital, valid forever. No need to update signage when departments change.",
            },
            {
              icon: Clock,
              title: "Live Queue Tracking",
              description: "Patients see their position in real-time. Doctor, reception, and waiting room display stay in sync.",
            },
            {
              icon: Smartphone,
              title: "No Account Needed",
              description: "Patients scan, fill a form, and get a token. No signup, no app, no password.",
            },
            {
              icon: Zap,
              title: "Digital Prescriptions",
              description: "Prescriptions generated instantly as letterheaded PDFs with doctor signature.",
            },
            {
              icon: Users,
              title: "Voice Reception",
              description: "An AI voice agent answers calls, books appointments in Hindi or English.",
            },
            {
              icon: BarChart3,
              title: "Real-Time Analytics",
              description: "Dashboard showing patients seen, wait times, diagnoses, and peak hours.",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <Icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your clinic?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Med Rapidly works for solo doctors and large hospital chains. Same software, same interface, zero setup.
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
          >
            Schedule a Demo
          </Link>
        </div>
      </section>
    </main>
  );
}

// Simple icon components
const QrCode = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
