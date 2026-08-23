import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appointments, patients, users, departments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

interface TrackRequest {
  token: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackRequest = await request.json();

    if (!body.token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    // Find appointment by token
    const appointment = await db.query.appointments.findFirst({
      where: eq(appointments.apptToken, body.token),
      with: {
        patient: true,
        doctor: {
          with: {
            department: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Verify phone number if provided
    if (body.phone && appointment.patient?.phone !== body.phone) {
      return NextResponse.json(
        { message: "Phone number does not match" },
        { status: 403 }
      );
    }

    // Count people ahead in queue (same doctor, same date, waiting status)
    const peopleAhead = await db.query.appointments.findMany({
      where: and(
        eq(appointments.doctorId, appointment.doctorId),
        eq(appointments.apptDate, appointment.apptDate),
        (db) => {
          const n = db.schema.appointments.queueNumber;
          const currentQN = appointment.queueNumber;
          return and(
            n.lt(currentQN),
            eq(appointments.status, "waiting")
          );
        }
      ),
    });

    // Get now serving (first in_consult appointment)
    const nowServing = await db.query.appointments.findFirst({
      where: and(
        eq(appointments.doctorId, appointment.doctorId),
        eq(appointments.apptDate, appointment.apptDate),
        eq(appointments.status, "in_consult")
      ),
    });

    // Estimate wait time (simple: 5 minutes per patient ahead)
    const estimatedWait = peopleAhead.length * 5;

    return NextResponse.json(
      {
        status: appointment.status,
        queueNumber: `${appointment.queuePrefix}-${String(appointment.queueNumber).padStart(2, "0")}`,
        doctorName: appointment.doctor?.fullName || "Unknown",
        department: appointment.doctor?.department?.name || "General",
        room: (await db.query.doctorAvailability.findFirst({
          where: and(
            eq(db.schema.doctorAvailability.doctorId, appointment.doctorId),
            eq(db.schema.doctorAvailability.availDate, appointment.apptDate)
          ),
        }))?.roomNumber || "TBD",
        nowServing: nowServing
          ? `${nowServing.queuePrefix}-${String(nowServing.queueNumber).padStart(2, "0")}`
          : "None",
        peopleAhead: peopleAhead.length,
        estimatedWaitMinutes: estimatedWait,
        apptToken: appointment.apptToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { message: "Failed to track appointment" },
      { status: 500 }
    );
  }
}
