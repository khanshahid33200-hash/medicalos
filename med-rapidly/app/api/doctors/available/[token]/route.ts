import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { intakeLinks, hospitals, users, departments, doctorAvailability, appointments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const searchParams = request.nextUrl.searchParams;
    let dateParam = searchParams.get("date") || "today";

    // Find hospital by token
    const intakeLink = await db.query.intakeLinks.findFirst({
      where: eq(intakeLinks.token, token),
    });

    if (!intakeLink) {
      return NextResponse.json(
        { message: "Invalid hospital token" },
        { status: 404 }
      );
    }

    const hospital = await db.query.hospitals.findFirst({
      where: eq(hospitals.id, intakeLink.hospitalId),
    });

    if (!hospital || hospital.status !== "active") {
      return NextResponse.json(
        { message: "Hospital not found or inactive" },
        { status: 404 }
      );
    }

    // Parse date
    let apptDate: string;
    if (dateParam === "today") {
      apptDate = new Date().toISOString().split("T")[0];
    } else {
      const parsed = new Date(dateParam);
      apptDate = parsed.toISOString().split("T")[0];
    }

    // Get all doctors in this hospital
    const doctors = await db.query.users.findMany({
      where: and(
        eq(db.schema.users.hospitalId, hospital.id),
        eq(db.schema.users.role, "doctor"),
        eq(db.schema.users.status, "active")
      ),
      with: {
        department: true,
      },
    });

    // For each doctor, get availability and current queue count
    const availableDoctors = await Promise.all(
      doctors.map(async (doctor) => {
        // Get availability for this date
        const availability = await db.query.doctorAvailability.findFirst({
          where: and(
            eq(db.schema.doctorAvailability.doctorId, doctor.id),
            eq(db.schema.doctorAvailability.availDate, apptDate)
          ),
        });

        if (!availability || !availability.isAvailable) {
          return null;
        }

        // Count current waiting appointments for this doctor on this date
        const currentAppointments = await db.query.appointments.findMany({
          where: and(
            eq(appointments.doctorId, doctor.id),
            eq(appointments.apptDate, apptDate),
            eq(appointments.status, "waiting")
          ),
        });

        const slotsLeft = availability.dailyLimit - currentAppointments.length;

        return {
          id: doctor.id,
          name: doctor.fullName,
          department: doctor.department?.name || "General",
          room: availability.roomNumber || "TBD",
          waiting: currentAppointments.length,
          slotsLeft: Math.max(0, slotsLeft),
          isAvailable: slotsLeft > 0,
        };
      })
    );

    // Filter out null values and sort by department
    const filtered = availableDoctors
      .filter((doc) => doc !== null)
      .sort((a, b) => (a!.department || "").localeCompare(b!.department || ""));

    return NextResponse.json(filtered, { status: 200 });
  } catch (error) {
    console.error("Available doctors error:", error);
    return NextResponse.json(
      { message: "Failed to fetch available doctors" },
      { status: 500 }
    );
  }
}
