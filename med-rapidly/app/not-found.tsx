import Link from "next/link";
import { Search, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8 md:mb-12">
          <div className="text-9xl md:text-[180px] font-bold text-gray-200 leading-none">
            404
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-6 rounded-full" />
        </div>

        {/* Content */}
        <div className="space-y-4 md:space-y-6 mb-10 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            We couldn't find the page you're looking for. It might have been moved or deleted. Let's get you back on track.
          </p>
        </div>

        {/* Search Suggestion */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8 mb-10 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">What were you looking for?</h3>
          </div>
          <p className="text-sm text-gray-600">
            Try searching our site or use the navigation menu to find what you need.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
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

        {/* Quick Links */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-6">Popular Pages</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Features", href: "/features" },
              { label: "Pricing", href: "/pricing" },
              { label: "Contact", href: "/contact" },
              { label: "Login", href: "/login" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
