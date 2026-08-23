"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Download } from "lucide-react";

interface Prescription {
  id: string;
  visitDate: string;
  doctorName: string;
  diagnosis: string;
  token: string;
}

export default function RxDownloadPage() {
  const [step, setStep] = useState<"phone" | "otp" | "list">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/prescriptions/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        setStep("otp");
        setSuccessMessage("OTP sent to your phone");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/prescriptions/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data.prescriptions);
        setStep("list");
      } else {
        const data = await response.json();
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pdfId: string) => {
    try {
      const response = await fetch(`/api/prescriptions/download/${pdfId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `prescription-${pdfId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Failed to download prescription");
      }
    } catch (err) {
      setError("An error occurred during download");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Download Prescription</h1>
            <p className="text-blue-100">Your digital Rx</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Phone Entry */}
            {step === "phone" && (
              <form onSubmit={handlePhoneSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your registered phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the phone number associated with your appointment
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* OTP Entry */}
            {step === "otp" && (
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    We've sent a 6-digit code to {phone}
                  </p>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center text-2xl tracking-widest focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 mb-3"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setSuccessMessage("");
                  }}
                  className="w-full text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50"
                >
                  Use Different Phone
                </button>
              </form>
            )}

            {/* Prescriptions List */}
            {step === "list" && (
              <div>
                {prescriptions.length > 0 ? (
                  <div className="space-y-3">
                    {prescriptions.map((rx) => (
                      <div
                        key={rx.id}
                        className="border border-gray-200 rounded-lg p-4 flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {rx.doctorName}
                          </p>
                          <p className="text-sm text-gray-600">{rx.diagnosis}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {rx.visitDate}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownload(rx.id)}
                          className="ml-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                          title="Download prescription"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      No prescriptions found for this phone number
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setStep("phone");
                    setPhone("");
                    setOtp("");
                    setPrescriptions([]);
                  }}
                  className="w-full mt-6 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50"
                >
                  Search Another Number
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
