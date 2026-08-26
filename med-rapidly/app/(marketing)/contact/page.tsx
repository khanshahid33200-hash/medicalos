import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Med Rapidly",
  description: "Get in touch with Med Rapidly. We're here to help you transform your clinic's patient experience.",
  openGraph: {
    title: "Contact Us | Med Rapidly",
    description: "Get in touch with Med Rapidly. We're here to help you transform your clinic's patient experience.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600">
            Have questions about Med Rapidly? Our team is ready to help. Contact us today and let's transform your clinic together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16 md:mb-20">
          {/* Main Content - Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Sidebar - Contact Info */}
          <div>
            <div className="space-y-6">
              {/* Email */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                </div>
                <a href="mailto:contact@medrapidly.com" className="text-blue-600 hover:text-blue-700 font-medium block mb-1">
                  contact@medrapidly.com
                </a>
                <p className="text-sm text-gray-600">We'll respond within 24 hours</p>
              </div>

              {/* Phone */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                </div>
                <a href="tel:+911234567890" className="text-green-600 hover:text-green-700 font-medium block mb-1">
                  +91-XXXX-XXXXXX
                </a>
                <p className="text-sm text-gray-600">Mon-Fri, 9 AM - 6 PM IST</p>
              </div>

              {/* Address */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                </div>
                <p className="text-gray-700 font-medium mb-1">
                  123 Medical Avenue
                </p>
                <p className="text-sm text-gray-600">
                  New Delhi, India 110001
                </p>
              </div>

              {/* Hours */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Business Hours</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
                  <p><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM</p>
                  <p><span className="font-medium">Sunday:</span> Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16 md:mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What is the typical setup time?",
                a: "Most hospitals are fully operational within 1-2 weeks. Our dedicated onboarding team will guide you through every step.",
              },
              {
                q: "Do you offer a free trial?",
                a: "Yes! We offer a 30-day free trial for new customers. No credit card required. You can explore all features risk-free.",
              },
              {
                q: "What kind of support do you provide?",
                a: "We provide 24/7 email support, phone support during business hours, and a dedicated success manager for enterprise clients.",
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We comply with HIPAA regulations, use industry-standard encryption, and maintain regular security audits.",
              },
              {
                q: "Can we integrate with our existing systems?",
                a: "Yes. Med Rapidly integrates with most EMR and hospital management systems. Our technical team will help with the integration.",
              },
              {
                q: "What about training for our staff?",
                a: "We provide comprehensive training for doctors, admins, and reception staff. Online training is included, and we can arrange on-site training as needed.",
              },
            ].map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-300 transition-colors">
                <summary className="flex items-center justify-between font-semibold text-gray-900 group-open:text-blue-600">
                  <span>{faq.q}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
