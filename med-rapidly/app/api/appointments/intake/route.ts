import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  hospitals,
  intakeLinks,
  patients,
  appointments,
  tokenCounters,
  queueCounters,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

interface IntakeRequest {
  hospitalToken: string;
  doctorId: string;
  appointmentDate: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  email?: string;
  complaint: string;
  previousDoctor?: string;
  previousMedicines?: string;
  otherDetails?: string;
  consent: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: IntakeRequest = await request.json();

    // Validate required fields
    if (
      !body.hospitalToken ||
      !body.doctorId ||
      !body.appointmentDate ||
      !body.name ||
      !body.phone
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find hospital by intake token
    const intakeLink = await db.query.intakeLinks.findFirst({
      where: eq(intakeLinks.token, body.hospitalToken),
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

    // Check if doctor exists and belongs to this hospital
    const doctor = await db.query.users.findFirst({
      where: and(
        eq(db.schema.users.id, body.doctorId),
        eq(db.schema.users.hospitalId, hospital.id)
      ),
    });

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Format date
    const apptDate = new Date(body.appointmentDate);
    const dateStr = apptDate.toISOString().split("T")[0];

    // Check if doctor has availability for this date
    const availability = await db.query.doctorAvailability.findFirst({
      where: and(
        eq(db.schema.doctorAvailability.doctorId, doctor.id),
        eq(db.schema.doctorAvailability.availDate, dateStr)
      ),
    });

    if (!availability || !availability.isAvailable) {
      return NextResponse.json(
        { message: "Doctor not available on this date" },
        { status: 400 }
      );
    }

    // Check if doctor has reached daily limit
    const existingAppointments = await db.query.appointments.findMany({
      where: and(
        eq(appointments.doctorId, doctor.id),
        eq(appointments.apptDate, dateStr),
        eq(appointments.status, "waiting")
      ),
    });

    if (existingAppointments.length >= availability.dailyLimit) {
      return NextResponse.json(
        { message: "Doctor is fully booked for this date" },
        { status: 400 }
      );
    }

    // Check if patient already has appointment with this doctor on this date
    const existingPatient = await db.query.patients.findFirst({
      where: and(
        eq(db.schema.patients.hospitalId, hospital.id),
        eq(db.schema.patients.phone, body.phone)
      ),
    });

    if (existingPatient) {
      const dupAppt = await db.query.appointments.findFirst({
        where: and(
          eq(appointments.patientId, existingPatient.id),
          eq(appointments.doctorId, doctor.id),
          eq(appointments.apptDate, dateStr)
        ),
      });

      if (dupAppt) {
        return NextResponse.json(
          { message: "You already have an appointment with this doctor on this date" },
          { status: 400 }
        );
      }
    }

    // Generate appointment token (YYYYMMDD + sequence)
    const today = apptDate.toISOString().split("T")[0].replace(/-/g, "");

    let tokenCounter = await db.query.tokenCounters.findFirst({
      where: and(
        eq(db.schema.tokenCounters.hospitalId, hospital.id),
        eq(db.schema.tokenCounters.counterDate, dateStr)
      ),
    });

    let tokenNumber: number;
    if (!tokenCounter) {
      // Create new counter
      tokenNumber = 1;
      await db.insert(tokenCounters).values({
        id: uuidv4(),
        hospitalId: hospital.id,
        counterDate: dateStr,
        nextNumber: 2,
      });
    } else {
      tokenNumber = tokenCounter.nextNumber;
      await db
        .update(tokenCounters)
        .set({ nextNumber: tokenCounter.nextNumber + 1 })
        .where(eq(db.schema.tokenCounters.id, tokenCounter.id));
    }

    const apptToken = `${today}${String(tokenNumber).padStart(2, "0")}`;

    // Generate queue number (per doctor per date)
    let queueCounter = await db.query.queueCounters.findFirst({
      where: and(
        eq(db.schema.queueCounters.doctorId, doctor.id),
        eq(db.schema.queueCounters.counterDate, dateStr)
      ),
    });

    let queueNumber: number;
    if (!queueCounter) {
      queueNumber = 1;
      await db.insert(queueCounters).values({
        id: uuidv4(),
        doctorId: doctor.id,
        counterDate: dateStr,
        nextNumber: 2,
      });
    } else {
      queueNumber = queueCounter.nextNumber;
      await db
        .update(queueCounters)
        .set({ nextNumber: queueCounter.nextNumber + 1 })
        .where(eq(db.schema.queueCounters.id, queueCounter.id));
    }

    // Get department for queue prefix
    const department = await db.query.departments.findFirst({
      where: eq(db.schema.departments.id, doctor.departmentId!),
    });

    const queuePrefix = department?.shortCode || "GEN";
    const fullQueueNumber = `${queuePrefix}-${String(queueNumber).padStart(2, "0")}`;

    // Get or create patient
    let patient = existingPatient;
    if (!patient) {
      const patientId = uuidv4();
      await db.insert(patients).values({
        id: patientId,
        hospitalId: hospital.id,
        name: body.name,
        phone: body.phone,
        email: body.email,
        age: body.age,
        address: body.address,
      });
      patient = await db.query.patients.findFirst({
        where: eq(db.schema.patients.id, patientId),
      });
    }

    // Create appointment
    const appointmentId = uuidv4();
    await db.insert(appointments).values({
      id: appointmentId,
      hospitalId: hospital.id,
      patientId: patient!.id,
      doctorId: doctor.id,
      apptDate: dateStr,
      apptToken,
      queueNumber,
      queuePrefix,
      status: "waiting",
      complaint: body.complaint,
      previousDoctor: body.previousDoctor,
      previousMedicines: body.previousMedicines,
      otherDetails: body.otherDetails,
      consentGiven: body.consent,
      source: "qr",
    });

    // TODO: Send SMS/WhatsApp notification with token and queue position

    return NextResponse.json(
      {
        success: true,
        appointmentToken: apptToken,
        queueNumber: fullQueueNumber,
        message: `Booked successfully. Your token is ${apptToken}, you are ${fullQueueNumber} in the queue.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Intake error:", error);
    return NextResponse.json(
      { message: "Failed to process appointment" },
      { status: 500 }
    );
  }
}
