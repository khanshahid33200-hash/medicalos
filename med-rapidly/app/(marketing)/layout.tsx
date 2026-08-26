import Link from "next/link";
import { Users, TrendingUp, Shield } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Premium */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900">Med Rapidly</span>
          </Link>

          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex gap-3 md:gap-4">
            <Link
              href="/login"
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-gray-900 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer - Premium */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="py-12 md:py-16 border-b border-gray-800">
            <div className="grid md:grid-cols-2 gap-12 mb-10">
              <div>
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <span className="text-xl font-bold text-white">Med Rapidly</span>
                </Link>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  Digital queue management for hospitals and clinics. Trusted by 500+ facilities to improve patient experience and streamline operations.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 md:justify-end">
                <div>
                  <h4 className="font-bold mb-4 text-white">Product</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                    <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                    <li><Link href="/contact" className="hover:text-white transition-colors">Demo</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-white">Company</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    <li><Link href="/" className="hover:text-white transition-colors">Blog</Link></li>
                    <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-white">Legal</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                    <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                    <li><Link href="/" className="hover:text-white transition-colors">Security</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Users, label: "Hospitals", value: "500+" },
                { icon: TrendingUp, label: "Appointments", value: "10M+" },
                { icon: Shield, label: "Uptime", value: "99.9%" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2026 Med Rapidly. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
