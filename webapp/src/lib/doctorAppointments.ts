// Supabase-backed doctor appointment data — the ONE source of truth for
// the Doctor Dashboard (Dashboard.tsx, Queue.tsx, History.tsx, Reports.tsx).
//
// Why this file exists: the Doctor Dashboard previously read/wrote its own
// localStorage caches (two different, unsynchronized namespaces across
// Dashboard.tsx vs. doctorStore.ts) plus a legacy FastAPI backend whose
// production URL was never configured — completely disconnected from the
// `appointments`/`patients` rows a real QR booking (book_qr_appointment RPC,
// see supabase/schema.sql) actually writes. So a patient booking with
// Doctor D1 never appeared anywhere in D1's dashboard. This module queries
// the same tables the booking flow writes to, so both are finally in sync.
//
// Isolation: every query below filters by doctor_id, but that filter is
// query-shape/defense-in-depth, NOT the security boundary — the real
// enforcement is Postgres RLS ("Doctor manage ONLY own appointments" /
// "own consultations" / "own prescriptions" in supabase/schema.sql), which
// checks `doctor_id = auth.uid()` server-side regardless of what a client
// asks for.

import { supabase } from './supabase'

export type AppointmentStatus =
  | 'waiting'
  | 'called'
  | 'in_consultation'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'pending'
  | 'confirmed'

export interface DoctorAppointmentPatient {
  id: string
  name: string
  phone: string
  age: number | null
  gender: string | null
  allergies: string | null
  known_diseases: string | null
}

export interface DoctorAppointment {
  id: string
  token_number: number | null
  status: AppointmentStatus
  appointment_date: string
  created_at: string
  symptoms: string | null
  fee: number | null
  patient: DoctorAppointmentPatient | null
}

const APPOINTMENT_SELECT = `
  id, token_number, status, appointment_date, created_at, symptoms, fee,
  patient:patients(id, name, phone, age, gender, allergies, known_diseases)
`

function normalizeAppointment(row: any): DoctorAppointment {
  return {
    id: row.id,
    token_number: row.token_number ?? null,
    status: row.status,
    appointment_date: row.appointment_date,
    created_at: row.created_at,
    symptoms: row.symptoms ?? null,
    fee: row.fee != null ? Number(row.fee) : null,
    patient: Array.isArray(row.patient) ? row.patient[0] ?? null : row.patient ?? null,
  }
}

/**
 * All appointments for this doctor. Pass `date` (YYYY-MM-DD) to scope to a
 * single day (the live queue); omit it for full history.
 */
export async function getDoctorAppointments(
  doctorId: string,
  opts: { date?: string } = {}
): Promise<DoctorAppointment[]> {
  if (!doctorId) return []

  let query = supabase
    .from('appointments')
    .select(APPOINTMENT_SELECT)
    .eq('doctor_id', doctorId)
    .order('token_number', { ascending: true })

  if (opts.date) {
    query = query.eq('appointment_date', opts.date)
  }

  const { data, error } = await query
  if (error) {
    console.warn('getDoctorAppointments error:', error.message)
    return []
  }
  return (data || []).map(normalizeAppointment)
}

export async function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): Promise<boolean> {
  const { error } = await supabase.from('appointments').update({ status }).eq('id', appointmentId)
  if (error) {
    console.warn('updateAppointmentStatus error:', error.message)
    return false
  }
  return true
}

/**
 * Add a walk-in patient to this doctor's queue. Reuses the already-audited
 * book_qr_appointment RPC (rather than duplicating its token-numbering /
 * advisory-lock / patient-dedup logic) with the doctor's own hospital's QR
 * token, so a walk-in is indistinguishable from a QR booking once created —
 * same table, same isolation guarantees.
 */
export async function addWalkInAppointment(params: {
  hospitalId: string
  doctorId: string
  patientName: string
  patientPhone: string
  patientGender?: string
  patientAge?: number
  symptoms?: string
}): Promise<{ success: boolean; error?: string }> {
  const { data: qr, error: qrError } = await supabase
    .from('qr_codes')
    .select('token')
    .eq('hospital_id', params.hospitalId)
    .limit(1)
    .maybeSingle()

  if (qrError || !qr?.token) {
    return { success: false, error: qrError?.message || 'No active QR/booking token found for this hospital.' }
  }

  const { data, error } = await supabase.rpc('book_qr_appointment', {
    p_qr_token: qr.token,
    p_doctor_id: params.doctorId,
    p_appointment_date: new Date().toISOString().split('T')[0],
    p_patient_name: params.patientName,
    p_patient_phone: params.patientPhone,
    p_patient_gender: params.patientGender || 'Other',
    p_patient_age: params.patientAge ?? 30,
    p_patient_dob: null,
    p_symptoms: params.symptoms || null,
    p_known_diseases: null,
    p_previous_medicine: null,
    p_previous_doctor_id: null,
  })

  if (error) return { success: false, error: error.message }
  if (data && data.success === false) return { success: false, error: data.error }
  return { success: true }
}

/**
 * Complete a consultation: writes a real consultations row + prescriptions
 * row, then marks the appointment completed. Replaces doctorStore's
 * savePrescriptionForDoctor, which only ever touched localStorage.
 */
export async function completeConsultation(params: {
  hospitalId: string
  appointmentId: string
  doctorId: string
  patientId: string | null
  diagnosis?: string
  clinicalNotes?: string
  vitals?: Record<string, string>
  medicines?: { name: string; dosage: string; duration: string; instruction: string }[]
  labTests?: string
  advice?: string
  followUp?: string
}): Promise<{ success: boolean; error?: string }> {
  const { data: consultation, error: consultError } = await supabase
    .from('consultations')
    .insert([
      {
        hospital_id: params.hospitalId,
        appointment_id: params.appointmentId,
        doctor_id: params.doctorId,
        patient_id: params.patientId,
        diagnosis: params.diagnosis || null,
        clinical_notes: params.clinicalNotes || null,
        vitals: params.vitals || {},
      },
    ])
    .select('id')
    .single()

  if (consultError) return { success: false, error: consultError.message }

  const { error: rxError } = await supabase.from('prescriptions').insert([
    {
      hospital_id: params.hospitalId,
      consultation_id: consultation.id,
      appointment_id: params.appointmentId,
      doctor_id: params.doctorId,
      patient_id: params.patientId,
      medicines: params.medicines || [],
      lab_tests: params.labTests || null,
      advice: params.advice || null,
      follow_up: params.followUp || null,
    },
  ])

  if (rxError) return { success: false, error: rxError.message }

  const updated = await updateAppointmentStatus(params.appointmentId, 'completed')
  if (!updated) return { success: false, error: 'Consultation saved but appointment status update failed.' }

  return { success: true }
}

export interface DoctorStats {
  totalToday: number
  completedToday: number
  waitingToday: number
  revenueToday: number
}

/**
 * Replaces doctorStore.getDoctorRealStats, which derived counts from three
 * separate localStorage buckets. One query, real data.
 */
export async function getDoctorStats(doctorId: string, dateStr?: string): Promise<DoctorStats> {
  const today = dateStr || new Date().toISOString().split('T')[0]
  const appointments = await getDoctorAppointments(doctorId, { date: today })

  const completed = appointments.filter(a => a.status === 'completed')
  const waiting = appointments.filter(a => a.status === 'waiting' || a.status === 'pending')
  const revenue = completed.reduce((sum, a) => sum + (a.fee || 0), 0)

  return {
    totalToday: appointments.length,
    completedToday: completed.length,
    waitingToday: waiting.length,
    revenueToday: revenue,
  }
}

export interface DoctorPrescription {
  appointmentId: string
  diagnosis: string | null
  clinicalNotes: string | null
  medicines: { name: string; dosage: string; duration: string; instruction: string }[]
  advice: string | null
  followUp: string | null
}

/**
 * All prescriptions this doctor has written, keyed by appointment_id, so
 * callers can merge them onto the appointment list they already have (see
 * Reports.tsx). Real rows from `prescriptions`/`consultations`, replacing
 * the prescription object doctorStore used to embed directly on a
 * localStorage-only queue item.
 */
export async function getDoctorPrescriptions(doctorId: string): Promise<Map<string, DoctorPrescription>> {
  const map = new Map<string, DoctorPrescription>()
  if (!doctorId) return map

  const { data, error } = await supabase
    .from('prescriptions')
    .select('appointment_id, medicines, lab_tests, advice, follow_up, consultation:consultations(diagnosis, clinical_notes)')
    .eq('doctor_id', doctorId)

  if (error) {
    console.warn('getDoctorPrescriptions error:', error.message)
    return map
  }

  for (const row of data || []) {
    if (!row.appointment_id) continue
    const consultation = Array.isArray(row.consultation) ? row.consultation[0] : row.consultation
    map.set(row.appointment_id, {
      appointmentId: row.appointment_id,
      diagnosis: consultation?.diagnosis ?? null,
      clinicalNotes: consultation?.clinical_notes ?? null,
      medicines: row.medicines || [],
      advice: row.advice ?? null,
      followUp: row.follow_up ?? null,
    })
  }
  return map
}

/**
 * Live updates: fires `onChange` whenever any appointment row belonging to
 * this doctor is inserted/updated/deleted. The `filter` is required, not
 * optional — without it, Realtime evaluates the permissive anon "Public
 * view queue for display" RLS policy (scoped only by appointment_date, not
 * hospital/doctor) and pushes every hospital's changes to every subscriber
 * (see the same fix already applied in TrackPage.tsx). Returns an
 * unsubscribe function; always call it on unmount.
 */
export function subscribeToDoctorAppointments(doctorId: string, onChange: () => void): () => void {
  if (!doctorId) return () => {}

  const channel = supabase
    .channel(`doctor_queue_${doctorId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `doctor_id=eq.${doctorId}`,
      },
      onChange
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
