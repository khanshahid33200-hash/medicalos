"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Mail, Loader } from "lucide-react";
import Link from "next/link";

type FormState = "idle" | "loading" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  hospital?: string;
  message?: string;
  general?: string;
}

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hospital: "",
    phone: "",
    message: "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.hospital.trim()) {
      newErrors.hospital = "Hospital/Clinic name is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormState("loading");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would normally send the data to your backend
      console.log("Form submitted:", formData);

      setFormState("success");
      setFormData({ name: "", email: "", hospital: "", phone: "", message: "" });

      // Redirect to thank you page after 2 seconds
      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 2000);
    } catch (error) {
      setFormState("error");
      setErrors({
        general:
          "An error occurred while submitting the form. Please try again.",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Success State */}
      {formState === "success" && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Submission Successful!
          </h3>
          <p className="text-gray-600 mb-4">
            Thank you for reaching out. We'll be in touch within 24 hours.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to thank you page...
          </p>
        </div>
      )}

      {/* Form State */}
      {formState !== "success" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-600 p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={formState === "loading"}
              className={`w-full px-4 py-3 border rounded-lg font-regular text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              } disabled:bg-gray-50 disabled:text-gray-500`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={formState === "loading"}
              className={`w-full px-4 py-3 border rounded-lg font-regular text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              } disabled:bg-gray-50 disabled:text-gray-500`}
              placeholder="john@hospital.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Hospital Field */}
          <div>
            <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-2">
              Hospital/Clinic Name *
            </label>
            <input
              type="text"
              id="hospital"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              disabled={formState === "loading"}
              className={`w-full px-4 py-3 border rounded-lg font-regular text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.hospital
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              } disabled:bg-gray-50 disabled:text-gray-500`}
              placeholder="City Care Hospital"
            />
            {errors.hospital && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.hospital}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={formState === "loading"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-regular text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="+91-XXXX-XXXXXX"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={formState === "loading"}
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg font-regular text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                errors.message
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              } disabled:bg-gray-50 disabled:text-gray-500`}
              placeholder="Tell us about your clinic and what you're looking for..."
            />
            {errors.message && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.message}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
            <input
              type="checkbox"
              id="consent"
              disabled={formState === "loading"}
              className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="consent" className="text-sm text-gray-700">
              I agree to the{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms & Conditions
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formState === "loading"}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {formState === "loading" ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 text-center">
            We'll respond to your inquiry within 24 business hours.
          </p>
        </form>
      )}
    </div>
  );
}
