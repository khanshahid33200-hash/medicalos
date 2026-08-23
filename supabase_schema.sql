-- ====================================================================
-- CLINIC OS / MED RAPIDLY v3.3 & v1.1 COMPLETE SUPABASE DATABASE SCHEMA
-- Execute this SQL in your Supabase SQL Editor (https://app.supabase.com)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'hospital_admin', 'doctor', 'staff');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'in_consultation', 'completed', 'no_show', 'cancelled');
CREATE TYPE payment_status_type AS ENUM ('pending', 'paid', 'free', 'refunded');
CREATE TYPE intake_source_type AS ENUM ('qr', 'voice', 'walk_in', 'link');

-- 3. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  license_number TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  address TEXT,
  website TEXT,
  logo_url TEXT,

  -- Platform Owner Configurations
  doctor_seat_limit INTEGER DEFAULT 5, -- H1 = 5 doctors, H2 = 1 doctor, etc.

  -- Payment Gateway Configurations (Razorpay / Stripe)
  payment_gateway_provider TEXT DEFAULT 'razorpay' CHECK (payment_gateway_provider IN ('razorpay', 'stripe', 'payu')),
  payment_gateway_test_key TEXT,
  payment_gateway_live_key TEXT,
  payment_mode TEXT DEFAULT 'test' CHECK (payment_mode IN ('test', 'live')),
  default_consultation_fee INTEGER DEFAULT 50000, -- in paisa (₹500)

  -- Voice Agent Configurations
  voice_number TEXT UNIQUE,
  voice_greeting TEXT DEFAULT 'City Care Hospital, good morning. How can I help you?',
  voice_languages TEXT[] DEFAULT ARRAY['en', 'hi', 'hinglish'],
  voice_transfer_number TEXT,
  voice_record_calls BOOLEAN DEFAULT true,

  is_demo BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  short_code TEXT NOT NULL, -- ORT, GEN, PED, DER, ENT
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(hospital_id, name)
);

-- 5. PROFILES (DOCTORS & HOSPITAL ADMINS) TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  qualification TEXT DEFAULT 'MBBS, MD',
  registration_number TEXT,
  room_number TEXT DEFAULT 'Room 1',
  specialization TEXT DEFAULT 'General Physician',
  role user_role DEFAULT 'doctor',
  
  -- Consultation Fee Override (null = use hospital default)
  consultation_fee_override INTEGER,
  default_daily_patient_limit INTEGER DEFAULT 25,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. DOCTOR DAY SETTINGS TABLE (Per-Date Limits & Leave)
CREATE TABLE IF NOT EXISTS doctor_day_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  setting_date DATE NOT NULL,
  daily_limit INTEGER DEFAULT 25,
  is_on_leave BOOLEAN DEFAULT false,
  working_hours_start TIME DEFAULT '09:00:00',
  working_hours_end TIME DEFAULT '17:00:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(doctor_id, setting_date)
);

-- 7. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  address TEXT,
  email TEXT,
  allergies TEXT,
  prev_medications TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(hospital_id, phone_number)
);

-- 8. APPOINTMENTS TABLE (Tracks Queue & Payments)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES profiles(id),
  patient_id UUID REFERENCES patients(id),
  appointment_date DATE NOT NULL,

  token_number TEXT NOT NULL, -- YYYYMMDD30
  queue_number TEXT NOT NULL, -- ORT-07
  position_in_queue INTEGER,

  status appointment_status DEFAULT 'scheduled',
  
  -- Payment Fields
  payment_status payment_status_type DEFAULT 'pending',
  payment_amount INTEGER, -- in paisa
  payment_gateway_provider TEXT DEFAULT 'razorpay',
  payment_gateway_transaction_id TEXT UNIQUE,
  paid_at TIMESTAMP WITH TIME ZONE,

  complaint_summary TEXT,
  source intake_source_type DEFAULT 'qr',
  consent_given BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(doctor_id, appointment_date, queue_number),
  UNIQUE(hospital_id, appointment_date, token_number)
);

-- 9. CONSULTATIONS TABLE (Digital Prescriptions)
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES profiles(id),
  
  symptoms TEXT,
  vitals JSONB DEFAULT '{"bp": "120/80", "temp": 98.6, "pulse": 72, "spo2": 98, "weight": 70}'::jsonb,
  diagnosis TEXT,
  medicines JSONB DEFAULT '[]'::jsonb, -- [{name, dose, duration, frequency}]
  lab_tests TEXT,
  advice TEXT,
  follow_up_date DATE,
  private_notes TEXT,

  locked_at TIMESTAMP WITH TIME ZONE, -- Locks 24h after creation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. PRESCRIPTIONS TABLE (PDF Storage & Signatures)
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id),
  appointment_id UUID REFERENCES appointments(id),
  token_number TEXT NOT NULL,
  
  pdf_storage_path TEXT,
  pdf_sha256 TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. PAYMENTS TABLE (Audit & Refund Log)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id),
  
  amount INTEGER NOT NULL, -- in paisa
  gateway_provider TEXT DEFAULT 'razorpay',
  gateway_transaction_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  
  refund_transaction_id TEXT,
  refund_reason TEXT,
  refunded_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT DEFAULT 'UPI / GPay',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 12. INTAKE LINKS TABLE (Single Hospital Entrance QR)
CREATE TABLE IF NOT EXISTS intake_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE UNIQUE,
  token_string TEXT NOT NULL UNIQUE, -- 24 random chars
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 13. QUEUE COUNTERS & TOKEN COUNTERS TABLES
CREATE TABLE IF NOT EXISTS queue_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  counter_date DATE NOT NULL,
  current_count INTEGER DEFAULT 0,
  UNIQUE(doctor_id, counter_date)
);

CREATE TABLE IF NOT EXISTS token_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  counter_date DATE NOT NULL,
  current_sequence INTEGER DEFAULT 0,
  UNIQUE(hospital_id, counter_date)
);

-- 14. AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id),
  actor_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 15. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Hospital Isolation Read/Write Policies
CREATE POLICY hospital_isolation_policy ON hospitals
  FOR ALL USING (true);

CREATE POLICY profiles_hospital_isolation ON profiles
  FOR ALL USING (hospital_id = (SELECT hospital_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY appointments_hospital_isolation ON appointments
  FOR ALL USING (
    doctor_id = auth.uid() OR 
    hospital_id = (SELECT hospital_id FROM profiles WHERE id = auth.uid())
  );

-- 16. SEED INITIAL DEMO DATA
INSERT INTO hospitals (id, name, city, phone, email, doctor_seat_limit)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Metro Care General Hospital (H1)', 'Kolkata', '+91-9876543210', 'admin@metrocare.com', 5),
  ('a0000000-0000-0000-0000-000000000002', 'City Heart & Cardiac Specialty Clinic (H2)', 'Bangalore', '+91-9876543211', 'admin@cityheart.com', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO intake_links (hospital_id, token_string)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'abc123xyz78924charsstring')
ON CONFLICT DO NOTHING;

INSERT INTO departments (hospital_id, name, short_code, display_order)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Orthopaedics', 'ORT', 1),
  ('a0000000-0000-0000-0000-000000000001', 'General OPD', 'GEN', 2),
  ('a0000000-0000-0000-0000-000000000001', 'Paediatrics', 'PED', 3),
  ('a0000000-0000-0000-0000-000000000001', 'Dermatology', 'DER', 4),
  ('a0000000-0000-0000-0000-000000000001', 'ENT', 'ENT', 5)
ON CONFLICT DO NOTHING;

-- Schema setup completed successfully!
