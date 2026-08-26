"use client";

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Show banner after 2 seconds
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleClose = () => {
    handleAccept(); // Default to accept on close
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 transition-all duration-300 ${
        isAnimating
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm pointer-events-none"
        style={{
          opacity: isAnimating ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* Banner */}
      <div className="relative max-w-2xl mx-auto bg-white rounded-lg shadow-2xl border border-gray-200">
        <div className="p-6 md:p-8">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cookie banner"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex gap-4 md:gap-6 pr-10">
            {/* Icon */}
            <div className="flex-shrink-0 hidden sm:flex">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-amber-600" />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Cookie Policy
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept," you consent to our use of cookies as described in our{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  privacy policy
                </Link>
                .
              </p>

              {/* Cookie Types */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600 mb-6">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Essential Cookies</p>
                  <p>Required for basic site functionality</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Analytics Cookies</p>
                  <p>Help us understand how you use our site</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Marketing Cookies</p>
                  <p>Deliver personalized ads and content</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Preference Cookies</p>
                  <p>Remember your settings and preferences</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Decline Non-Essential
                </button>
              </div>

              {/* Settings Link */}
              <Link
                href="/privacy#cookies"
                className="inline-block mt-4 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cookie Settings →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
