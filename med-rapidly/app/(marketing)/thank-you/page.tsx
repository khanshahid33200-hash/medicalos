import Link from "next/link";
import { CheckCircle, Mail, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Thank You | Med Rapidly",
  description: "Your message has been received. We'll be in touch soon.",
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8 md:mb-12">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 md:w-14 md:h-14 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            We've received your message and appreciate you reaching out. Our team will review your inquiry and get back to you shortly.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Check Your Email</h3>
            </div>
            <p className="text-sm text-gray-600">
              We'll send you a confirmation and keep you updated on your request.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Response Time</h3>
            </div>
            <p className="text-sm text-gray-600">
              Our team typically responds within 24 business hours.
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-gray-50 rounded-lg p-8 mb-10 md:mb-12 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
          <ol className="space-y-4">
            {[
              {
                step: "1",
                title: "Confirmation Email",
                desc: "You'll receive a confirmation email with your request details within minutes.",
              },
              {
                step: "2",
                title: "Review Process",
                desc: "Our team will review your inquiry and prepare a personalized response.",
              },
              {
                step: "3",
                title: "Follow Up",
                desc: "We'll reach out to you within 24 hours with next steps and available options.",
              },
              {
                step: "4",
                title: "Support",
                desc: "Our team will assist you with any questions or requirements you have.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Back to Home
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-all"
          >
            Explore Features
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* FAQ Preview */}
        <div className="mt-12 pt-8 border-t border-gray-200 max-w-lg">
          <p className="text-sm text-gray-600 mb-4">Have questions?</p>
          <div className="space-y-3 text-left">
            <details className="group cursor-pointer">
              <summary className="flex items-center gap-3 font-medium text-gray-900 group-open:text-blue-600">
                <span className="text-blue-600">+</span>
                How long does it take to set up Med Rapidly?
              </summary>
              <p className="mt-3 text-sm text-gray-600 pl-7">
                Most hospitals are up and running within 1-2 weeks. Our onboarding team will guide you through every step.
              </p>
            </details>
            <details className="group cursor-pointer">
              <summary className="flex items-center gap-3 font-medium text-gray-900 group-open:text-blue-600">
                <span className="text-blue-600">+</span>
                Do you offer a free trial?
              </summary>
              <p className="mt-3 text-sm text-gray-600 pl-7">
                Yes! We offer a 30-day free trial for new customers. No credit card required.
              </p>
            </details>
            <details className="group cursor-pointer">
              <summary className="flex items-center gap-3 font-medium text-gray-900 group-open:text-blue-600">
                <span className="text-blue-600">+</span>
                Is my data secure?
              </summary>
              <p className="mt-3 text-sm text-gray-600 pl-7">
                Absolutely. We comply with HIPAA, use encryption, and maintain enterprise-grade security standards.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
