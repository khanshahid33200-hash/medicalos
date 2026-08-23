"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

const intakeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1).max(150),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email().optional(),
  complaint: z.string().min(1, "Reason for visit is required"),
  previousDoctor: z.string().optional(),
  previousMedicines: z.string().optional(),
  otherDetails: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to proceed",
  }),
});

type IntakeFormData = z.infer<typeof intakeFormSchema>;

interface Doctor {
  id: string;
  name: string;
  department: string;
  room: string;
  waiting: number;
  slotsLeft: number;
}

export default function IntakePage() {
  const params = useParams();
  const token = params.token as string;
  const [selectedDate, setSelectedDate] = useState<string>("today");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appointmentToken, setAppointmentToken] = useState<string>("");
  const [queueNumber, setQueueNumber] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
  });

  useEffect(() => {
    // Fetch available doctors
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`/api/doctors/available/${token}?date=${selectedDate}`);
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
  }, [token, selectedDate]);

  const onSubmit = async (data: IntakeFormData) => {
    if (!selectedDoctor) {
      alert("Please select a doctor");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/appointments/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalToken: token,
          doctorId: selectedDoctor,
          appointmentDate: selectedDate,
          ...data,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAppointmentToken(result.appointmentToken);
        setQueueNumber(result.queueNumber);
        setSubmitted(true);
        reset();
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Appointment Booked!
          </h1>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Token Number</p>
            <p className="text-4xl font-bold text-blue-600">{appointmentToken}</p>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Queue Position</p>
            <p className="text-4xl font-bold text-orange-600">{queueNumber}</p>
          </div>

          <div className="text-left space-y-3 mb-8 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Save your token number.</strong> You'll need it to track your position and download your prescription.
            </p>
            <p className="text-sm text-gray-700">
              <strong>We've sent you:</strong> Confirmation email and WhatsApp message with your token and queue position.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Track your queue:</strong> Open the tracking link we sent to watch your position update in real-time.
            </p>
          </div>

          <Link
            href={`/track?token=${appointmentToken}`}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 block mb-3"
          >
            Track Your Queue
          </Link>

          <button
            onClick={() => {
              setSubmitted(false);
              setAppointmentToken("");
              setQueueNumber("");
            }}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Join the Queue</h1>
            <p className="text-blue-100">
              Scan complete! Now tell us about your visit.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            {/* Date Selection */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                When would you like to come?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Today", "Tomorrow", "+2 days", "+3 days", "+4 days", "+5 days"].map(
                  (day, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDate(day)}
                      className={`py-3 px-4 rounded-lg font-semibold transition ${
                        selectedDate === day
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {day}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Doctor Selection */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Who would you like to see?
              </label>
              <div className="space-y-3">
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <label
                      key={doctor.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                        selectedDoctor === doctor.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="doctor"
                        value={doctor.id}
                        checked={selectedDoctor === doctor.id}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="mr-3"
                      />
                      <span className="font-semibold text-gray-900">
                        {doctor.name}
                      </span>
                      <span className="text-gray-600"> — {doctor.department}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        Room {doctor.room}
                      </span>
                      <div className="mt-2 flex justify-between text-sm text-gray-600">
                        <span>{doctor.waiting} waiting</span>
                        <span>
                          {doctor.slotsLeft > 0
                            ? `${doctor.slotsLeft} slots left`
                            : "Fully booked"}
                        </span>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-600">
                    No doctors available for this date
                  </p>
                )}
              </div>
            </div>

            {/* Patient Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Details
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Age"
                  />
                  {errors.age && (
                    <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  {...register("address")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Your address"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Your email"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What's troubling you? *
                </label>
                <textarea
                  {...register("complaint")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Describe your symptoms or reason for visit"
                  rows={3}
                />
                {errors.complaint && (
                  <p className="text-red-600 text-sm mt-1">{errors.complaint.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previous doctor (if any)
                </label>
                <input
                  type="text"
                  {...register("previousDoctor")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Doctor's name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current medicines (if any)
                </label>
                <input
                  type="text"
                  {...register("previousMedicines")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="List of medicines"
                />
              </div>
            </div>

            {/* Consent */}
            <div className="mb-8 border-t pt-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("consent")}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  I consent to my details being stored and shared with the doctor for my consultation and treatment.
                </span>
              </label>
              {errors.consent && (
                <p className="text-red-600 text-sm mt-2">{errors.consent.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Booking..." : "Complete Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
