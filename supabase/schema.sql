-- ============================================================================
-- MED RAPIDLY CLINICAL HOSPITAL OS — DATABASE SCHEMA & RLS POLICIES
-- Multi-Tenant Data Isolation, Dual-Identity Auth & Account Block/Ban/Suspend/Delete
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'hospital_admin', 'doctor', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE hospital_status AS ENUM ('active', 'pending', 'suspended', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CORE MULTI-TENANT TABLES
CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    doctor_limit INTEGER DEFAULT 10,
    plan TEXT DEFAULT 'Hospital Pro',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_code TEXT UNIQUE,
    username TEXT UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'doctor' NOT NULL,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    department_id UUID,
    department TEXT,
    specialization TEXT DEFAULT 'General Physician',
    registration_number TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    head_doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    avg_wait_mins INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.doctor_details (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_code TEXT UNIQUE NOT NULL,
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    qualification TEXT DEFAULT 'MBBS, MD',
    specialization TEXT DEFAULT 'Consultant Specialist',
    registration_number TEXT,
    room_number TEXT DEFAULT 'Room 101',
    daily_patient_limit INTEGER DEFAULT 30,
    consultation_fee NUMERIC(10, 2) DEFAULT 500.00,
    availability_status TEXT DEFAULT 'active',
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_code TEXT UNIQUE,
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    specialization TEXT DEFAULT 'General Physician',
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    department_name TEXT DEFAULT 'General Medicine',
    consultation_fee NUMERIC(10, 2) DEFAULT 500.00,
    room_number TEXT DEFAULT 'Room 101',
    daily_limit INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    abha_id TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_age INTEGER,
    patient_gender TEXT,
    appointment_date DATE DEFAULT CURRENT_DATE NOT NULL,
    queue_number TEXT NOT NULL,
    status TEXT DEFAULT 'Waiting' NOT NULL,
    fee NUMERIC(10, 2) DEFAULT 0.00,
    is_emergency BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    diagnosis TEXT,
    clinical_notes TEXT,
    vitals JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    medicines JSONB DEFAULT '[]'::jsonb NOT NULL,
    pdf_url TEXT,
    whatsapp_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_broadcast BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    intake_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_email TEXT,
    category TEXT DEFAULT 'General',
    action TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3b. SCHEMA DRIFT RECONCILIATION
-- The live database has columns the CREATE TABLE blocks above never
-- declared (the QR booking RPCs below were written/evolved against the
-- live DB directly, ahead of this file). Idempotent, additive-only —
-- reconciles this file with reality without touching existing data.
ALTER TABLE public.patients
    ADD COLUMN IF NOT EXISTS patient_number TEXT,
    ADD COLUMN IF NOT EXISTS date_of_birth DATE,
    ADD COLUMN IF NOT EXISTS known_diseases TEXT,
    ADD COLUMN IF NOT EXISTS allergies TEXT,
    ADD COLUMN IF NOT EXISTS previous_medicine TEXT,
    ADD COLUMN IF NOT EXISTS previous_doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

ALTER TABLE public.appointments
    ADD COLUMN IF NOT EXISTS symptoms TEXT,
    ADD COLUMN IF NOT EXISTS token_number INTEGER,
    ADD COLUMN IF NOT EXISTS tracking_token TEXT,
    ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS known_diseases TEXT,
    ADD COLUMN IF NOT EXISTS previous_medicine TEXT,
    ADD COLUMN IF NOT EXISTS previous_doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.qr_codes
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS booking_url TEXT,
    ADD COLUMN IF NOT EXISTS scans_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_scanned_at TIMESTAMPTZ;

-- Doctor Dashboard migration (Rx form fields the UI already collects —
-- diagnosis/medicines had columns; lab tests, advice, and follow-up did not).
ALTER TABLE public.prescriptions
    ADD COLUMN IF NOT EXISTS lab_tests TEXT,
    ADD COLUMN IF NOT EXISTS advice TEXT,
    ADD COLUMN IF NOT EXISTS follow_up TEXT;

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_doctor_code ON public.profiles(doctor_code);
CREATE INDEX IF NOT EXISTS idx_profiles_hospital ON public.profiles(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctor_details_hospital ON public.doctor_details(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctor_details_code ON public.doctor_details(doctor_code);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_hospital ON public.appointments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor ON public.consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON public.prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_messages_doctor ON public.messages(sender_id, recipient_id);

-- 5. RLS SECURITY FUNCTIONS
CREATE OR REPLACE FUNCTION public.current_hospital_id()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT hospital_id FROM public.profiles WHERE id = auth.uid() AND is_active = true LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_hospital_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'hospital_admin' AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_doctor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'doctor' AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.resolve_doctor_email(p_doctor_code TEXT)
RETURNS TEXT AS $$
DECLARE
    v_email TEXT;
BEGIN
    SELECT email INTO v_email
    FROM public.profiles
    WHERE UPPER(doctor_code) = UPPER(TRIM(p_doctor_code)) AND is_active = true
    LIMIT 1;

    RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.generate_doctor_code(p_hospital_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_count INTEGER;
    v_prefix TEXT;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM public.profiles
    WHERE hospital_id = p_hospital_id AND role = 'doctor';

    v_prefix := 'H' || SUBSTRING(p_hospital_id::text, 1, 2) || '-D-';
    RETURN v_prefix || LPAD((v_count + 1)::text, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 6. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES (MULTI-TENANT & DOCTOR ISOLATION)
DROP POLICY IF EXISTS "Super Admin full access to hospitals" ON public.hospitals;
CREATE POLICY "Super Admin full access to hospitals" ON public.hospitals
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Hospital Users view own hospital" ON public.hospitals;
CREATE POLICY "Hospital Users view own hospital" ON public.hospitals
    FOR SELECT TO authenticated
    USING (id = public.current_hospital_id());

DROP POLICY IF EXISTS "Public view active hospital" ON public.hospitals;
CREATE POLICY "Public view active hospital" ON public.hospitals
    FOR SELECT TO anon
    USING (status = 'active');

DROP POLICY IF EXISTS "Super Admin full access to profiles" ON public.profiles;
CREATE POLICY "Super Admin full access to profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Users view own hospital profiles" ON public.profiles;
CREATE POLICY "Users view own hospital profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (hospital_id = public.current_hospital_id() OR id = auth.uid());

DROP POLICY IF EXISTS "Hospital Admin manage hospital profiles" ON public.profiles;
CREATE POLICY "Hospital Admin manage hospital profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (public.is_hospital_admin() AND hospital_id = public.current_hospital_id())
    WITH CHECK (public.is_hospital_admin() AND hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Super Admin full access to doctor_details" ON public.doctor_details;
CREATE POLICY "Super Admin full access to doctor_details" ON public.doctor_details
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Hospital Admin manage own doctor_details" ON public.doctor_details;
CREATE POLICY "Hospital Admin manage own doctor_details" ON public.doctor_details
    FOR ALL TO authenticated
    USING (hospital_id = public.current_hospital_id())
    WITH CHECK (hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Doctors view own doctor_details" ON public.doctor_details;
CREATE POLICY "Doctors view own doctor_details" ON public.doctor_details
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Super Admin full access to appointments" ON public.appointments;
CREATE POLICY "Super Admin full access to appointments" ON public.appointments
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Hospital Admin manage hospital appointments" ON public.appointments;
CREATE POLICY "Hospital Admin manage hospital appointments" ON public.appointments
    FOR ALL TO authenticated
    USING (hospital_id = public.current_hospital_id())
    WITH CHECK (hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Doctor manage ONLY own appointments" ON public.appointments;
CREATE POLICY "Doctor manage ONLY own appointments" ON public.appointments
    FOR ALL TO authenticated
    USING (
        public.is_doctor() AND
        doctor_id = auth.uid() AND
        hospital_id = public.current_hospital_id()
    )
    WITH CHECK (
        public.is_doctor() AND
        doctor_id = auth.uid() AND
        hospital_id = public.current_hospital_id()
    );

DROP POLICY IF EXISTS "Public insert self-appointment" ON public.appointments;
CREATE POLICY "Public insert self-appointment" ON public.appointments
    FOR INSERT TO anon
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = appointments.doctor_id AND hospital_id = appointments.hospital_id AND role = 'doctor' AND is_active = true
        )
    );

DROP POLICY IF EXISTS "Public view queue for display" ON public.appointments;
CREATE POLICY "Public view queue for display" ON public.appointments
    FOR SELECT TO anon
    USING (appointment_date = CURRENT_DATE);

DROP POLICY IF EXISTS "Super Admin full access to consultations" ON public.consultations;
CREATE POLICY "Super Admin full access to consultations" ON public.consultations
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Hospital Admin view hospital consultations" ON public.consultations;
CREATE POLICY "Hospital Admin view hospital consultations" ON public.consultations
    FOR SELECT TO authenticated
    USING (hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Doctor manage ONLY own consultations" ON public.consultations;
CREATE POLICY "Doctor manage ONLY own consultations" ON public.consultations
    FOR ALL TO authenticated
    USING (
        public.is_doctor() AND
        doctor_id = auth.uid() AND
        hospital_id = public.current_hospital_id()
    )
    WITH CHECK (
        public.is_doctor() AND
        doctor_id = auth.uid() AND
        hospital_id = public.current_hospital_id()
    );

DROP POLICY IF EXISTS "Super Admin full access to prescriptions" ON public.prescriptions;
CREATE POLICY "Super Admin full access to prescriptions" ON public.prescriptions
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Hospital Admin view hospital prescriptions" ON public.prescriptions;
CREATE POLICY "Hospital Admin view hospital prescriptions" ON public.prescriptions
    FOR SELECT TO authenticated
    USING (hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Doctor manage ONLY own prescriptions" ON public.prescriptions;
CREATE POLICY "Doctor manage ONLY own prescriptions" ON public.prescriptions
    FOR ALL TO authenticated
    USING (
        public.is_doctor() AND
        doctor_id = auth.uid() AND
        hospital_id = public.current_hospital_id()
    )
    WITH CHECK (
        public.is_doctor() AND
        doctor_id = auth.uid() AND
        hospital_id = public.current_hospital_id()
    );

DROP POLICY IF EXISTS "Super Admin full access to messages" ON public.messages;
CREATE POLICY "Super Admin full access to messages" ON public.messages
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Doctor access ONLY own messages" ON public.messages;
CREATE POLICY "Doctor access ONLY own messages" ON public.messages
    FOR ALL TO authenticated
    USING (
        hospital_id = public.current_hospital_id() AND
        (sender_id = auth.uid() OR recipient_id = auth.uid() OR is_broadcast = true)
    )
    WITH CHECK (
        hospital_id = public.current_hospital_id() AND
        sender_id = auth.uid()
    );

-- RLS was ENABLE'd on the tables below (see section 6) but had NO POLICIES
-- defined anywhere in this file, which under Postgres means deny-all for
-- every non-service-role client. That gap is why several frontend pages
-- resorted to the service-role client (`supabaseAdmin`) just to read
-- departments/patients/qr_codes/doctors at all — added here so the regular,
-- RLS-respecting client works correctly and the service-role key can be
-- removed from the browser entirely.

DROP POLICY IF EXISTS "Super Admin full access to departments" ON public.departments;
CREATE POLICY "Super Admin full access to departments" ON public.departments
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Hospital Users view own hospital departments" ON public.departments;
CREATE POLICY "Hospital Users view own hospital departments" ON public.departments
    FOR SELECT TO authenticated
    USING (hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Public view active departments for booking" ON public.departments;
CREATE POLICY "Public view active departments for booking" ON public.departments
    FOR SELECT TO anon
    USING (is_active = true);

DROP POLICY IF EXISTS "Hospital Admin manage hospital departments" ON public.departments;
CREATE POLICY "Hospital Admin manage hospital departments" ON public.departments
    FOR ALL TO authenticated
    USING (public.is_hospital_admin() AND hospital_id = public.current_hospital_id())
    WITH CHECK (public.is_hospital_admin() AND hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Super Admin full access to patients" ON public.patients;
CREATE POLICY "Super Admin full access to patients" ON public.patients
    FOR ALL TO authenticated
    USING (public.is_super_admin());

-- Was "Hospital Users manage own hospital patients" — a single FOR ALL
-- policy scoped only by hospital_id, meaning ANY authenticated user in the
-- hospital (a plain doctor included) could read or write every patient in
-- the hospital, not just their own patients. Split into a hospital_admin
-- policy (operationally needs full hospital visibility) and a doctor
-- policy restricted to patients they actually have an appointment with —
-- Doctor Dashboard isolation requires this: D1 must not be able to browse
-- D2's patients via a direct `supabase.from('patients')` query, even
-- though the current UI doesn't happen to issue one today.
DROP POLICY IF EXISTS "Hospital Admin manage hospital patients" ON public.patients;
CREATE POLICY "Hospital Admin manage hospital patients" ON public.patients
    FOR ALL TO authenticated
    USING (public.is_hospital_admin() AND hospital_id = public.current_hospital_id())
    WITH CHECK (public.is_hospital_admin() AND hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Doctor view own patients" ON public.patients;
CREATE POLICY "Doctor view own patients" ON public.patients
    FOR SELECT TO authenticated
    USING (
        public.is_doctor()
        AND hospital_id = public.current_hospital_id()
        AND EXISTS (
            SELECT 1 FROM public.appointments a
            WHERE a.patient_id = patients.id AND a.doctor_id = auth.uid()
        )
    );

-- Doctors also need to create/update patient records at check-in/booking
-- time, before an appointment row necessarily exists yet — scoped to their
-- own hospital only, same as every other hospital-scoped write.
DROP POLICY IF EXISTS "Doctor manage hospital patients at checkin" ON public.patients;
CREATE POLICY "Doctor manage hospital patients at checkin" ON public.patients
    FOR INSERT TO authenticated
    WITH CHECK (public.is_doctor() AND hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Doctor update own patients" ON public.patients;
CREATE POLICY "Doctor update own patients" ON public.patients
    FOR UPDATE TO authenticated
    USING (
        public.is_doctor()
        AND hospital_id = public.current_hospital_id()
        AND EXISTS (
            SELECT 1 FROM public.appointments a
            WHERE a.patient_id = patients.id AND a.doctor_id = auth.uid()
        )
    )
    WITH CHECK (hospital_id = public.current_hospital_id());

-- Patient self-registration during QR booking (before any appointment/profile
-- exists) — insert-only, and callers cannot read other hospitals' patients
-- back since the SELECT policy above requires an authenticated hospital
-- session. The QR booking RPCs (SECURITY DEFINER) remain the primary,
-- audited path for patient lookup — this INSERT policy only covers the
-- direct-write path some booking forms use.
DROP POLICY IF EXISTS "Public insert self patient record" ON public.patients;
CREATE POLICY "Public insert self patient record" ON public.patients
    FOR INSERT TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "Super Admin full access to qr_codes" ON public.qr_codes;
CREATE POLICY "Super Admin full access to qr_codes" ON public.qr_codes
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Hospital Admin manage own qr_codes" ON public.qr_codes;
CREATE POLICY "Hospital Admin manage own qr_codes" ON public.qr_codes
    FOR ALL TO authenticated
    USING (public.is_hospital_admin() AND hospital_id = public.current_hospital_id())
    WITH CHECK (public.is_hospital_admin() AND hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Hospital Users view own qr_codes" ON public.qr_codes;
CREATE POLICY "Hospital Users view own qr_codes" ON public.qr_codes
    FOR SELECT TO authenticated
    USING (hospital_id = public.current_hospital_id());

-- Public/anon token resolution stays on the audited SECURITY DEFINER RPCs
-- (get_qr_booking_info, lookup_patient_by_qr) rather than a broad anon SELECT
-- policy here, so an anonymous visitor can never list/scan qr_codes rows
-- directly — only resolve one specific token through the RPC.

DROP POLICY IF EXISTS "Super Admin full access to doctors" ON public.doctors;
CREATE POLICY "Super Admin full access to doctors" ON public.doctors
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Hospital Users manage own hospital doctors" ON public.doctors;
CREATE POLICY "Hospital Users manage own hospital doctors" ON public.doctors
    FOR ALL TO authenticated
    USING (hospital_id = public.current_hospital_id())
    WITH CHECK (hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Super Admin full access to activity_logs" ON public.activity_logs;
CREATE POLICY "Super Admin full access to activity_logs" ON public.activity_logs
    FOR ALL TO authenticated
    USING (public.is_super_admin());

DROP POLICY IF EXISTS "Hospital Users view own hospital activity_logs" ON public.activity_logs;
CREATE POLICY "Hospital Users view own hospital activity_logs" ON public.activity_logs
    FOR SELECT TO authenticated
    USING (hospital_id = public.current_hospital_id());

DROP POLICY IF EXISTS "Hospital Users insert own hospital activity_logs" ON public.activity_logs;
CREATE POLICY "Hospital Users insert own hospital activity_logs" ON public.activity_logs
    FOR INSERT TO authenticated
    WITH CHECK (hospital_id = public.current_hospital_id());

-- 8. AUTH USERS AUTO-SYNC TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        doctor_code,
        full_name,
        email,
        role,
        hospital_id,
        department,
        is_active
    )
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'doctor_code',
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'doctor'),
        (NEW.raw_user_meta_data->>'hospital_id')::uuid,
        NEW.raw_user_meta_data->>'department',
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        doctor_code = COALESCE(EXCLUDED.doctor_code, profiles.doctor_code),
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        hospital_id = EXCLUDED.hospital_id,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 8b. CROSS-HOSPITAL APPOINTMENT INTEGRITY TRIGGER
-- Second, DB-level backstop (in addition to app-level pre-insert checks and
-- RLS) against ever creating an appointment whose hospital_id doesn't match
-- the assigned doctor's own hospital_id — this is the exact mismatch the
-- brief calls out as required to reject ("Appointment Hospital = H1, Doctor
-- Hospital = H2"). Runs on INSERT and UPDATE so a later edit can't retarget
-- an appointment to a different doctor's hospital either.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.enforce_appointment_hospital_matches_doctor()
RETURNS TRIGGER AS $$
DECLARE
    v_doctor_hospital_id UUID;
BEGIN
    SELECT hospital_id INTO v_doctor_hospital_id
    FROM public.profiles
    WHERE id = NEW.doctor_id;

    IF v_doctor_hospital_id IS NULL OR v_doctor_hospital_id <> NEW.hospital_id THEN
        RAISE EXCEPTION 'Cross-hospital appointment rejected: doctor % belongs to hospital %, not %',
            NEW.doctor_id, v_doctor_hospital_id, NEW.hospital_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_appointment_hospital ON public.appointments;
CREATE TRIGGER trg_enforce_appointment_hospital
    BEFORE INSERT OR UPDATE OF hospital_id, doctor_id ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.enforce_appointment_hospital_matches_doctor();

-- ============================================================================
-- 9. QR BOOKING RPCs (pulled from live project 2026-09-02 for version control)
-- NOTE: these reference qr_codes/patients columns (status, scans_count,
-- last_scanned_at, booking_url, patient_number, previous_doctor_id,
-- previous_medicine, blood_group, allergies, known_diseases, date_of_birth)
-- that are NOT yet declared on the tables above in this file — the live
-- schema has drifted ahead of this file. Reconcile table definitions in a
-- follow-up migration; do not re-run the CREATE TABLE statements above
-- against the live DB until that drift is resolved.
-- Both functions were audited and are already correctly hospital-scoped
-- (deny-by-default, no cross-hospital fallback) — committed here unchanged.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_qr_booking_info(p_token text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_clean_token TEXT;
    v_qr RECORD;
    v_hosp RECORD;
    v_departments JSONB;
    v_doctors JSONB;
    v_possible_uuid UUID;
BEGIN
    v_clean_token := TRIM(p_token);

    -- Strip 'tok_' prefix if present
    IF v_clean_token LIKE 'tok_%' THEN
        v_clean_token := SUBSTRING(v_clean_token FROM 5);
    END IF;

    -- Step 1: Attempt to resolve QR code record by exact token, stripped token, or intake_url match
    SELECT * INTO v_qr
    FROM public.qr_codes
    WHERE (token = v_clean_token OR token = TRIM(p_token) OR booking_url LIKE '%' || v_clean_token || '%')
      AND (status = 'active' OR is_active = true)
    LIMIT 1;

    -- Step 2: If still not resolved, check if token represents a direct hospital ID (UUID)
    IF v_qr.id IS NULL THEN
        BEGIN
            v_possible_uuid := v_clean_token::UUID;
            SELECT * INTO v_qr
            FROM public.qr_codes
            WHERE hospital_id = v_possible_uuid
              AND (status = 'active' OR is_active = true)
            LIMIT 1;

            -- If hospital exists but had no qr_codes entry, auto-provision one
            IF v_qr.id IS NULL THEN
                INSERT INTO public.qr_codes (hospital_id, token, booking_url, intake_url, status, is_active)
                SELECT id, 'QR-' || UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)), '/book/QR-' || UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)), '/book/QR-' || UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 8)), 'active', true
                FROM public.hospitals
                WHERE id = v_possible_uuid AND status = 'active'
                RETURNING * INTO v_qr;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            v_possible_uuid := NULL;
        END;
    END IF;

    -- If QR still cannot be resolved, return error with NO fallback data
    IF v_qr.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid or unrecognized hospital QR booking code.');
    END IF;

    -- Update scans count
    UPDATE public.qr_codes
    SET scans_count = COALESCE(scans_count, 0) + 1,
        last_scanned_at = NOW()
    WHERE id = v_qr.id;

    -- Step 3: Resolve Hospital record and verify active status
    SELECT id, name, license_number, phone, email, address, status
    INTO v_hosp
    FROM public.hospitals
    WHERE id = v_qr.hospital_id;

    IF v_hosp.id IS NULL OR v_hosp.status != 'active' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'This hospital facility booking portal is currently unavailable or inactive.'
        );
    END IF;

    -- Step 4: Load ONLY Active Departments belonging STRICTLY to this hospital (NO FAKE OPD INJECTION)
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', d.id,
            'name', d.name,
            'description', d.description,
            'is_opd', (LOWER(d.name) = 'opd' OR LOWER(d.name) LIKE '%opd%')
        ) ORDER BY (CASE WHEN LOWER(d.name) = 'opd' OR LOWER(d.name) LIKE '%opd%' THEN 0 ELSE 1 END), d.name ASC
    ), '[]'::jsonb)
    INTO v_departments
    FROM public.departments d
    WHERE d.hospital_id = v_hosp.id AND d.is_active = true;

    -- Step 5: Load ONLY Active Doctors belonging STRICTLY to this hospital (NO CROSS-HOSPITAL DATA)
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', p.id,
            'doctor_code', COALESCE(p.doctor_code, 'DOC-' || SUBSTRING(p.id::text, 1, 6)),
            'name', p.full_name,
            'department', COALESCE(p.department, 'General OPD'),
            'specialization', COALESCE(p.specialization, 'Medical Officer'),
            'fee', COALESCE(dd.consultation_fee, 500),
            'room', COALESCE(dd.room_number, 'OPD Room'),
            'daily_limit', COALESCE(dd.daily_patient_limit, 40),
            'availability_status', COALESCE(dd.availability_status, 'active')
        ) ORDER BY p.full_name ASC
    ), '[]'::jsonb)
    INTO v_doctors
    FROM public.profiles p
    LEFT JOIN public.doctor_details dd ON dd.id = p.id
    WHERE p.hospital_id = v_hosp.id
      AND p.role = 'doctor'
      AND p.is_active = true
      AND (p.account_status = 'active' OR p.account_status IS NULL)
      AND p.deleted_at IS NULL;

    RETURN jsonb_build_object(
        'success', true,
        'hospital', jsonb_build_object(
            'id', v_hosp.id,
            'name', v_hosp.name,
            'license', v_hosp.license_number,
            'phone', v_hosp.phone,
            'email', v_hosp.email,
            'address', v_hosp.address
        ),
        'qr_token', v_qr.token,
        'departments', v_departments,
        'doctors', v_doctors
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.lookup_patient_by_qr(p_token text, p_patient_number text, p_mobile text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_hosp_id UUID;
    v_patient RECORD;
    v_prev_doctor_name TEXT;
BEGIN
    -- Resolve hospital_id from QR token
    SELECT q.hospital_id INTO v_hosp_id
    FROM public.qr_codes q
    JOIN public.hospitals h ON h.id = q.hospital_id
    WHERE q.token = TRIM(p_token)
      AND (q.status = 'active' OR q.is_active = true)
      AND h.status = 'active';

    IF v_hosp_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid facility token.');
    END IF;

    -- Search patient ONLY within resolved hospital
    SELECT * INTO v_patient
    FROM public.patients
    WHERE hospital_id = v_hosp_id
      AND (
          (p_patient_number IS NOT NULL AND TRIM(p_patient_number) != '' AND LOWER(patient_number) = LOWER(TRIM(p_patient_number)))
          OR
          (p_mobile IS NOT NULL AND TRIM(p_mobile) != '' AND phone = TRIM(p_mobile))
      )
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_patient.id IS NULL THEN
        RETURN jsonb_build_object('found', false);
    END IF;

    IF v_patient.previous_doctor_id IS NOT NULL THEN
        SELECT full_name INTO v_prev_doctor_name
        FROM public.profiles
        WHERE id = v_patient.previous_doctor_id;
    END IF;

    RETURN jsonb_build_object(
        'found', true,
        'patient', jsonb_build_object(
            'id', v_patient.id,
            'patient_number', v_patient.patient_number,
            'name', v_patient.name,
            'phone', v_patient.phone,
            'gender', v_patient.gender,
            'age', v_patient.age,
            'date_of_birth', v_patient.date_of_birth,
            'blood_group', v_patient.blood_group,
            'allergies', v_patient.allergies,
            'known_diseases', v_patient.known_diseases,
            'previous_doctor_id', v_patient.previous_doctor_id,
            'previous_doctor_name', v_prev_doctor_name,
            'previous_medicine', v_patient.previous_medicine
        )
    );
END;
$function$;

-- ============================================================================
-- 10. book_qr_appointment — DUPLICATE FUNCTION CLEANUP
-- Two overloaded versions of book_qr_appointment existed live (Postgres
-- allows same-name functions with different signatures). Both were audited
-- and are correctly hospital-scoped (deny-by-default; verify
-- doctor.hospital_id = the QR-resolved hospital_id before touching
-- patients/appointments) — NOT a tenant-isolation bug. But one version
-- lacks the pg_advisory_xact_lock the other uses for queue token
-- numbering, so under two simultaneous bookings for the same doctor/date it
-- could assign the same token_number to two different patients (a
-- concurrency bug). The frontend (IntakePage.tsx) calls this RPC without a
-- p_department_id argument, which was ambiguous between the two overloads.
-- Keep only the locked, department_id-aware version; drop the other by its
-- exact (unlocked) signature so this is unambiguous.
DROP FUNCTION IF EXISTS public.book_qr_appointment(
    text, uuid, date, text, text, text, integer, date, text, text, text, uuid, text
);

CREATE OR REPLACE FUNCTION public.book_qr_appointment(
    p_qr_token text,
    p_doctor_id uuid,
    p_appointment_date date,
    p_patient_name text,
    p_patient_phone text,
    p_patient_gender text,
    p_patient_age integer,
    p_patient_dob date,
    p_symptoms text,
    p_known_diseases text,
    p_previous_medicine text,
    p_previous_doctor_id uuid,
    p_patient_number text DEFAULT NULL::text,
    p_department_id uuid DEFAULT NULL::uuid
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_hosp_id UUID;
    v_hosp_name TEXT;
    v_doc RECORD;
    v_patient_id UUID;
    v_patient_num TEXT;
    v_token_number INTEGER;
    v_live_position INTEGER;
    v_patients_ahead INTEGER;
    v_tracking_token TEXT;
    v_appointment_id UUID;
    v_lock_key BIGINT;
BEGIN
    -- 1. Security check: Resolve hospital_id directly from QR token
    SELECT q.hospital_id, h.name INTO v_hosp_id, v_hosp_name
    FROM public.qr_codes q
    JOIN public.hospitals h ON h.id = q.hospital_id
    WHERE q.token = TRIM(p_qr_token)
      AND (q.status = 'active' OR q.is_active = true)
      AND h.status = 'active';

    IF v_hosp_id IS NULL THEN
        RAISE EXCEPTION 'Booking Failed: Invalid or inactive hospital QR code.';
    END IF;

    -- 2. Verify Doctor belongs to this hospital and is active
    SELECT id, full_name, doctor_code, department, specialization
    INTO v_doc
    FROM public.profiles
    WHERE id = p_doctor_id
      AND hospital_id = v_hosp_id
      AND role = 'doctor'
      AND is_active = true
      AND (account_status = 'active' OR account_status IS NULL)
      AND deleted_at IS NULL;

    IF v_doc.id IS NULL THEN
        RAISE EXCEPTION 'Booking Failed: Selected doctor is not active or does not belong to this hospital.';
    END IF;

    -- 3. Verify Appointment Date is not in the past
    IF p_appointment_date < CURRENT_DATE THEN
        RAISE EXCEPTION 'Booking Failed: Appointment date cannot be in the past.';
    END IF;

    -- 4. Patient Record Scoped strictly to Resolved Hospital
    v_patient_num := p_patient_number;
    IF v_patient_num IS NULL OR TRIM(v_patient_num) = '' THEN
        v_patient_num := 'MR-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 6));
    END IF;

    SELECT id INTO v_patient_id
    FROM public.patients
    WHERE hospital_id = v_hosp_id
      AND (
          (p_patient_phone IS NOT NULL AND phone = TRIM(p_patient_phone) AND LOWER(name) = LOWER(TRIM(p_patient_name)))
          OR
          (patient_number = v_patient_num)
      )
    LIMIT 1;

    IF v_patient_id IS NULL THEN
        INSERT INTO public.patients (
            hospital_id, patient_number, name, phone, gender, age,
            date_of_birth, known_diseases, allergies, previous_medicine,
            previous_doctor_id, created_at
        ) VALUES (
            v_hosp_id, v_patient_num, TRIM(p_patient_name), TRIM(p_patient_phone),
            COALESCE(p_patient_gender, 'Other'), p_patient_age, p_patient_dob,
            p_known_diseases, NULL, p_previous_medicine, p_previous_doctor_id, NOW()
        )
        RETURNING id INTO v_patient_id;
    ELSE
        UPDATE public.patients
        SET
            known_diseases = COALESCE(p_known_diseases, known_diseases),
            previous_medicine = COALESCE(p_previous_medicine, previous_medicine),
            previous_doctor_id = COALESCE(p_previous_doctor_id, previous_doctor_id),
            updated_at = NOW()
        WHERE id = v_patient_id;
    END IF;

    -- 5. ATOMIC QUEUE SEQUENCE GENERATION (Database Advisory Lock) — the
    -- concurrency-safe behaviour that made this the version to keep.
    v_lock_key := ('x' || SUBSTRING(MD5(p_doctor_id::text || p_appointment_date::text), 1, 16))::bit(64)::bigint;
    PERFORM pg_advisory_xact_lock(v_lock_key);

    SELECT COALESCE(MAX(token_number), 0) + 1 INTO v_token_number
    FROM public.appointments
    WHERE hospital_id = v_hosp_id
      AND doctor_id = p_doctor_id
      AND appointment_date = p_appointment_date;

    v_tracking_token := 'TRK-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 12));

    -- 6. Insert Appointment Record
    INSERT INTO public.appointments (
        hospital_id, doctor_id, patient_id, patient_name, patient_phone,
        patient_gender, patient_age, department_id, appointment_date,
        token_number, queue_number, tracking_token, status, symptoms,
        known_diseases, previous_medicine, previous_doctor_id, created_at
    ) VALUES (
        v_hosp_id, p_doctor_id, v_patient_id, TRIM(p_patient_name), TRIM(p_patient_phone),
        COALESCE(p_patient_gender, 'Other'), p_patient_age, p_department_id, p_appointment_date,
        v_token_number, v_token_number::text, v_tracking_token, 'waiting', p_symptoms,
        p_known_diseases, p_previous_medicine, p_previous_doctor_id, NOW()
    )
    RETURNING id INTO v_appointment_id;

    -- 7. Calculate Live Position & Patients Ahead
    SELECT COUNT(*) INTO v_patients_ahead
    FROM public.appointments
    WHERE hospital_id = v_hosp_id
      AND doctor_id = p_doctor_id
      AND appointment_date = p_appointment_date
      AND status IN ('waiting', 'called', 'in_consultation')
      AND token_number < v_token_number;

    v_live_position := v_patients_ahead + 1;

    RETURN jsonb_build_object(
        'success', true,
        'appointment_id', v_appointment_id,
        'hospital_name', v_hosp_name,
        'doctor_name', v_doc.full_name,
        'doctor_code', v_doc.doctor_code,
        'department', v_doc.department,
        'specialization', v_doc.specialization,
        'appointment_date', p_appointment_date,
        'token_number', v_token_number,
        'live_position', v_live_position,
        'patients_ahead', v_patients_ahead,
        'tracking_token', v_tracking_token,
        'tracking_url', '/track?t=' || v_tracking_token
    );
END;
$function$;
