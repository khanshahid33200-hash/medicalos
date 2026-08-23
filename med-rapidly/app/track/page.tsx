"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Clock, Users, PhoneOff } from "lucide-react";

interface QueueStatus {
  status: "waiting" | "in_consult" | "done" | "no_show" | "cancelled";
  queueNumber: string;
  doctorName: string;
  department: string;
  room: string;
  nowServing: string;
  peopleAhead: number;
  estimatedWaitMinutes: number;
  apptToken: string;
}

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");
  const [manualToken, setManualToken] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [token, setToken] = useState(tokenParam || "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [error, setError] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(!!tokenParam);

  useEffect(() => {
    if (tokenParam) {
      fetchStatus(tokenParam, "");
    }
  }, [tokenParam]);

  useEffect(() => {
    if (!status) return;

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      fetchStatus(token, phone, false);
    }, 5000);

    return () => clearInterval(interval);
  }, [token, phone, status]);

  const fetchStatus = async (
    apptToken: string,
    phoneNum: string,
    showLoading = true
  ) => {
    if (showLoading) setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/appointments/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: apptToken,
          phone: phoneNum,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setToken(apptToken);
        setPhone(phoneNum);
      } else {
        const error = await response.json();
        setError(error.message || "Appointment not found");
        setStatus(null);
      }
    } catch (err) {
      setError("Failed to fetch status. Please try again.");
      setStatus(null);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    fetchStatus(manualToken, manualPhone);
  };

  if (!searchAttempted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Track Your Queue</h1>
              <p className="text-blue-100">
                Enter your token number to see your position
              </p>
            </div>

            <form onSubmit={handleSearch} className="p-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token Number (from SMS/WhatsApp)
                </label>
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value.toUpperCase())}
                  placeholder="e.g., 2026082230"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg tracking-wider"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Phone Number
                </label>
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !manualToken}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Track Queue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-center">Not Found</h1>
            </div>

            <div className="p-8">
              <p className="text-center text-gray-700 mb-6">{error}</p>
              <button
                onClick={() => {
                  setSearchAttempted(false);
                  setManualToken("");
                  setManualPhone("");
                  setError("");
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Try Another Token
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const statusColors = {
    waiting: "bg-yellow-100 border-yellow-300",
    in_consult: "bg-blue-100 border-blue-300",
    done: "bg-green-100 border-green-300",
    no_show: "bg-gray-100 border-gray-300",
    cancelled: "bg-red-100 border-red-300",
  };

  const statusLabels = {
    waiting: "Waiting",
    in_consult: "In Consultation",
    done: "Complete",
    no_show: "No Show",
    cancelled: "Cancelled",
  };

  const statusIcons = {
    waiting: Users,
    in_consult: Clock,
    done: AlertCircle,
    no_show: PhoneOff,
    cancelled: AlertCircle,
  };

  const StatusIcon = statusIcons[status.status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Your Queue Status</h1>
            <p className="text-blue-100">Live updates, refreshing automatically</p>
          </div>

          {/* Status Content */}
          <div className="p-8">
            {/* Queue Number */}
            <div className="text-center mb-8 pb-8 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Your Queue Number</p>
              <p className="text-5xl font-bold text-orange-600">
                {status.queueNumber}
              </p>
              <p className="text-lg text-gray-700 mt-2">
                {status.doctorName} • {status.department}
              </p>
              <p className="text-sm text-gray-600">Room {status.room}</p>
            </div>

            {/* Status Badge */}
            <div
              className={`border-2 rounded-lg p-6 mb-8 text-center ${statusColors[status.status]}`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <StatusIcon className="w-6 h-6" />
                <span className="text-lg font-semibold">
                  {statusLabels[status.status]}
                </span>
              </div>

              {status.status === "waiting" && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-700">Now Serving</p>
                    <p className="text-2xl font-bold">{status.nowServing}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">People Ahead</p>
                    <p className="text-2xl font-bold">{status.peopleAhead}</p>
                  </div>
                </div>
              )}

              {status.status === "in_consult" && (
                <p className="text-lg font-semibold text-blue-700 mt-2">
                  You're with the doctor now!
                </p>
              )}

              {status.status === "done" && (
                <p className="text-lg font-semibold text-green-700 mt-2">
                  Your consultation is complete.
                </p>
              )}
            </div>

            {/* Estimated Wait Time */}
            {status.status === "waiting" && status.estimatedWaitMinutes > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Estimated Wait Time</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {status.estimatedWaitMinutes} minutes
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Message */}
            {status.status === "waiting" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-700">
                  💡 You can wait anywhere! We'll notify you when you're called.
                </p>
              </div>
            )}

            {/* Token Reference */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-1">Token Number</p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                {status.apptToken}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Save this for prescription download
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setSearchAttempted(false);
              setManualToken("");
              setManualPhone("");
              setStatus(null);
            }}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Track a Different Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
