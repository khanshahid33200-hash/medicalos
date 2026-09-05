import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  QrCode,
  Stethoscope,
  User,
  ListOrdered,
  HeartPulse,
  FileText,
  Users,
  CalendarDays,
  History,
  IndianRupee,
  UserCog,
  ArrowRight,
  ClipboardList,
  UserCheck,
  FileHeart,
  Pill,
  Activity,
  Clock,
  CalendarCheck,
} from "lucide-react";

const patientSteps = [
  {
    number: "01",
    title: "Scan Hospital QR",
    description:
      "Scan the hospital QR code or open the clinic's dedicated appointment link.",
    icon: QrCode,
    badge: "Unique QR",
  },
  {
    number: "02",
    title: "AI or Direct Booking",
    description:
      "Get guided by the AI Assistant for symptoms or select your department manually.",
    icon: Bot,
    badge: "AI Powered",
  },
  {
    number: "03",
    title: "Select Doctor",
    description:
      "Choose from verified available doctors belonging strictly to that hospital.",
    icon: Stethoscope,
    badge: "Hospital Only",
  },
  {
    number: "04",
    title: "Live Token & Queue",
    description:
      "Receive a live token (e.g. A-012) and real-time waiting countdown estimate.",
    icon: ListOrdered,
    badge: "Real-time",
  },
  {
    number: "05",
    title: "Doctor Consultation",
    description:
      "Appointment arrives directly at the doctor's private workspace dashboard.",
    icon: HeartPulse,
    badge: "Encrypted",
  },
  {
    number: "06",
    title: "Access Reports Online",
    description:
      "Access digital prescriptions, consultation history, and reports anywhere.",
    icon: FileText,
    badge: "24/7 Access",
  },
];

const hospitalFeatures = [
  {
    title: "Manage Doctors",
    description: "Manage doctor profiles and access.",
    icon: Users,
    position: "top-left",
  },
  {
    title: "Appointments",
    description: "Track appointments across your hospital.",
    icon: CalendarDays,
    position: "top-right",
  },
  {
    title: "Live Queue",
    description: "Monitor each doctor's queue separately.",
    icon: ListOrdered,
    position: "middle-left",
  },
  {
    title: "Patient History",
    description: "Access records, history, and prescriptions.",
    icon: History,
    position: "middle-right",
  },
  {
    title: "Revenue",
    description: "Track financial activity and performance.",
    icon: IndianRupee,
    position: "bottom-left",
  },
  {
    title: "Manage Staff",
    description: "Control staff roles and access.",
    icon: UserCog,
    position: "bottom-right",
  },
];

const doctorFeatures = [
  {
    title: "Today's Appointments",
    description: "See all appointments assigned to your account.",
    icon: CalendarCheck,
  },
  {
    title: "Live Queue",
    description: "Track your patient queue in real time.",
    icon: Clock,
  },
  {
    title: "Patient Profile",
    description: "View patient details and medical information.",
    icon: UserCheck,
  },
  {
    title: "Medical History",
    description: "Review previous visits and treatment records.",
    icon: FileHeart,
  },
  {
    title: "Prescriptions",
    description: "Create and manage patient prescriptions.",
    icon: Pill,
  },
  {
    title: "Consultation Status",
    description: "Manage active and completed consultations.",
    icon: Activity,
  },
];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HowPlatformWorks() {
  return (
    <section className="relative overflow-hidden bg-[#F6F6F4] py-24 md:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/[0.05] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              filter: "blur(10px)",
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              ease,
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-4 py-2 backdrop-blur-xl"
          >
            <span className="h-2 w-2 rounded-full bg-orange-500" />

            <span className="text-[11px] font-semibold tracking-[0.16em] text-slate-500">
              HOW IT WORKS
            </span>
          </motion.div>

          <motion.h2
            initial={{
              opacity: 0,
              y: 30,
              filter: "blur(12px)",
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease,
            }}
            className="mt-7 text-4xl font-semibold tracking-[-0.05em] text-[#17191F] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            One Platform.
            <br />

            <span className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#F97316] bg-clip-text text-transparent">
              Different Journeys.
            </span>
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease,
            }}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#6B6F78] md:text-lg"
          >
            MedTech Fixaters connects patients, doctors, and hospital
            administration through one digital system.
          </motion.p>
        </div>

        {/* 1. PATIENT JOURNEY */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            filter: "blur(10px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease,
          }}
          className="mt-20"
        >
          <SectionLabel
            number="01"
            title="For Patients"
            description="From scanning a hospital QR to AI-guided booking, live queue tracking, and digital access to healthcare information."
          />

          <div className="relative mt-10 overflow-hidden rounded-[36px] border border-white/90 bg-white/55 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-8">

            {/* Background glow */}
            <div className="pointer-events-none absolute left-[10%] top-[30%] h-40 w-40 rounded-full bg-orange-500/[0.08] blur-[70px]" />

            <div className="pointer-events-none absolute right-[10%] top-[30%] h-40 w-40 rounded-full bg-blue-500/[0.08] blur-[70px]" />

            {/* Desktop animated line */}
            <div className="absolute left-[8%] right-[8%] top-[58%] hidden h-px overflow-hidden bg-slate-200 lg:block">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{
                  duration: 2.2,
                  ease: "easeInOut",
                }}
                className="h-full bg-gradient-to-r from-orange-400 via-blue-500 to-orange-400"
              />
            </div>

            <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {patientSteps.map((step, index) => (
                <PatientStep
                  key={step.number}
                  step={step}
                  index={index}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* 2. HOSPITAL JOURNEY */}
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
            filter: "blur(12px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.9,
            ease,
          }}
          className="mt-16"
        >
          <SectionLabel
            number="02"
            title="For Hospitals"
            description="Manage your doctors, patients, appointments, queues, staff, and operations through one connected system supported by AI-driven insights and automation."
          />

          <div className="relative mt-8 min-h-[680px] overflow-hidden rounded-[32px] border border-white/90 bg-gradient-to-b from-white/70 to-white/40 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-2xl md:p-6 lg:min-h-[520px]">

            {/* Ambient background */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.08] blur-[100px]" />

            {/* Connection lines desktop */}
            <DesktopConnectionLines />

            {/* Mobile and tablet grid */}
            <div className="relative z-10 grid gap-4 lg:hidden">
              <HospitalDashboard />
              <div className="grid gap-4 sm:grid-cols-2">
                {hospitalFeatures.map((feature, index) => (
                  <HospitalFeatureCard
                    key={feature.title}
                    feature={feature}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Desktop layout */}
            <div className="relative z-10 hidden h-[480px] lg:block">

              {/* Top Left */}
              <div className="absolute left-0 top-0">
                <HospitalFeatureCard
                  feature={hospitalFeatures[0]}
                  index={0}
                />
              </div>

              {/* Top Right */}
              <div className="absolute right-0 top-0">
                <HospitalFeatureCard
                  feature={hospitalFeatures[1]}
                  index={1}
                />
              </div>

              {/* Middle Left */}
              <div className="absolute left-0 top-[185px]">
                <HospitalFeatureCard
                  feature={hospitalFeatures[2]}
                  index={2}
                />
              </div>

              {/* Middle Right */}
              <div className="absolute right-0 top-[185px]">
                <HospitalFeatureCard
                  feature={hospitalFeatures[3]}
                  index={3}
                />
              </div>

              {/* Bottom Left */}
              <div className="absolute bottom-0 left-0">
                <HospitalFeatureCard
                  feature={hospitalFeatures[4]}
                  index={4}
                />
              </div>

              {/* Bottom Right */}
              <div className="absolute bottom-0 right-0">
                <HospitalFeatureCard
                  feature={hospitalFeatures[5]}
                  index={5}
                />
              </div>

              {/* Central Dashboard */}
              <div className="absolute left-1/2 top-1/2 w-[290px] -translate-x-1/2 -translate-y-1/2">
                <HospitalDashboard />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. DOCTOR JOURNEY */}
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
            filter: "blur(12px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.9,
            ease,
          }}
          className="mt-16"
        >
          <SectionLabel
            number="03"
            title="For Doctors"
            description="Everything a doctor needs to manage appointments, patients, medical information, and daily workflow from one private workspace, supported by intelligent automation."
          />

          <div className="relative mt-8 overflow-hidden rounded-[32px] border border-white/90 bg-gradient-to-b from-white/80 to-white/40 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-2xl md:p-6">

            {/* Background light */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.08] blur-[120px]" />

            <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_1.2fr_1fr] lg:items-center">

              {/* Left Features */}
              <div className="space-y-4">
                <DoctorFeatureCard
                  feature={doctorFeatures[0]}
                  index={0}
                />

                <DoctorFeatureCard
                  feature={doctorFeatures[1]}
                  index={1}
                />

                <DoctorFeatureCard
                  feature={doctorFeatures[2]}
                  index={2}
                />
              </div>

              {/* Central Doctor Dashboard */}
              <DoctorDashboard />

              {/* Right Features */}
              <div className="space-y-4">
                <DoctorFeatureCard
                  feature={doctorFeatures[3]}
                  index={3}
                />

                <DoctorFeatureCard
                  feature={doctorFeatures[4]}
                  index={4}
                />

                <DoctorFeatureCard
                  feature={doctorFeatures[5]}
                  index={5}
                />
              </div>

            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom transition */}
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[300px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[130px]" />
    </section>
  );
}

/* ---------------------------------- */
/* SECTION LABEL */
/* ---------------------------------- */

function SectionLabel({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm font-semibold text-orange-500">
          {number}
        </span>

        <div className="h-px w-10 bg-slate-300" />

        <span className="text-sm font-semibold text-slate-500">
          {title}
        </span>
      </div>

      <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#17191F] md:text-5xl">
        {description}
      </h3>
    </div>
  );
}

/* ---------------------------------- */
/* PATIENT STEP */
/* ---------------------------------- */

function PatientStep({
  step,
  index,
}: {
  step: (typeof patientSteps)[number];
  index: number;
}) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.95,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease,
      }}
      whileHover={{
        y: -7,
        transition: {
          duration: 0.25,
        },
      }}
      className="group relative rounded-[24px] border border-white bg-white/75 p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl text-left"
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
          {step.badge}
        </span>
        <span className="text-[10px] font-semibold text-slate-300">
          {step.number}
        </span>
      </div>

      <motion.div
        whileHover={{
          rotate: [0, -8, 8, 0],
        }}
        transition={{
          duration: 0.5,
        }}
        className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B00] via-[#FF8533] to-[#FF4500] text-white shadow-lg shadow-orange-500/25"
      >
        <Icon size={20} />
      </motion.div>

      <h4 className="mt-6 text-sm font-semibold text-[#17191F]">
        {step.title}
      </h4>

      <p className="mt-2 text-[11px] leading-5 text-[#6B6F78]">
        {step.description}
      </p>

      {index < patientSteps.length - 1 && (
        <div className="absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
          <motion.div
            animate={{
              x: [0, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowRight
              size={18}
              className="text-blue-500"
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* ---------------------------------- */
/* HOSPITAL FEATURE CARD */
/* ---------------------------------- */

function HospitalFeatureCard({
  feature,
  index,
}: {
  feature: (typeof hospitalFeatures)[number];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease,
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
      }}
      className="group w-full rounded-2xl border border-white bg-white/80 p-3.5 shadow-[0_10px_25px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:w-[220px] text-left"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition-transform duration-300 group-hover:scale-105">
          <Icon size={16} />
        </div>

        <div>
          <h4 className="text-xs font-bold text-[#17191F]">
            {feature.title}
          </h4>

          <p className="mt-0.5 text-[9.5px] leading-snug text-[#6B6F78]">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------- */
/* CENTRAL HOSPITAL DASHBOARD */
/* ---------------------------------- */

function HospitalDashboard() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 15,
        filter: "blur(10px)",
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        ease,
      }}
      animate={{
        y: [0, -5, 0],
      }}
      className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#111827] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.25)] text-left"
    >
      {/* Dashboard header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            <span className="text-[9px] font-bold text-white/50 tracking-wider">
              MEDTECH FIXATERS
            </span>
          </div>

          <h4 className="mt-1 text-sm font-bold text-white">
            Hospital Dashboard
          </h4>
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
          <HeartPulse
            size={13}
            className="text-orange-400"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3.5 grid grid-cols-3 gap-1.5">
        <DashboardStat
          label="Doctors"
          value="12"
          color="blue"
        />

        <DashboardStat
          label="Today"
          value="86"
          color="orange"
        />

        <DashboardStat
          label="Queue"
          value="24"
          color="green"
        />
      </div>

      {/* Chart */}
      <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-medium text-white/50">
            Hospital Activity
          </p>

          <span className="text-[8px] font-bold text-orange-400">
            Live
          </span>
        </div>

        <div className="mt-2 flex h-11 items-end gap-1">
          {[30, 52, 38, 70, 48, 85, 62, 92].map(
            (height, index) => (
              <motion.div
                key={index}
                animate={{
                  height: [
                    `${height}%`,
                    `${Math.min(height + 12, 100)}%`,
                    `${height}%`,
                  ],
                }}
                transition={{
                  duration: 2.5,
                  delay: index * 0.08,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex-1 rounded-t-xs bg-gradient-to-t from-blue-600 to-blue-400"
                style={{
                  height: `${height}%`,
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Doctors */}
      <div className="mt-3 space-y-1.5">
        <MiniDoctor
          name="Dr. Sharma"
          status="In consultation"
          active
        />

        <MiniDoctor
          name="Dr. Khan"
          status="3 patients waiting"
        />

        <MiniDoctor
          name="Dr. Verma"
          status="Available"
        />
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -bottom-16 left-1/2 h-24 w-32 -translate-x-1/2 rounded-full bg-blue-500/20 blur-2xl" />
    </motion.div>
  );
}

/* ---------------------------------- */
/* DOCTOR FEATURE CARD */
/* ---------------------------------- */

function DoctorFeatureCard({
  feature,
  index,
}: {
  feature: (typeof doctorFeatures)[number];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: index < 3 ? -20 : 20,
        filter: "blur(6px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease,
      }}
      whileHover={{
        y: -3,
        scale: 1.015,
      }}
      className="group relative overflow-hidden rounded-2xl border border-white bg-white/80 p-3.5 shadow-[0_10px_25px_rgba(15,23,42,0.05)] backdrop-blur-xl text-left"
    >
      <div className="relative flex items-center gap-3">
        <motion.div
          whileHover={{
            rotate: [0, -6, 6, 0],
          }}
          transition={{
            duration: 0.4,
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-500/20"
        >
          <Icon size={16} />
        </motion.div>

        <div>
          <h4 className="text-xs font-bold text-[#17191F]">
            {feature.title}
          </h4>

          <p className="mt-0.5 text-[9.5px] leading-snug text-[#6B6F78]">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------- */
/* DOCTOR DASHBOARD COMPONENT */
/* ---------------------------------- */

function DoctorDashboard() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 30,
        filter: "blur(12px)",
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.9,
        ease,
      }}
      animate={{
        y: [0, -8, 0],
      }}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111827] p-5 shadow-[0_35px_80px_rgba(15,23,42,0.35)] text-left"
    >
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-[10px] font-medium text-white/50">
              DOCTOR WORKSPACE
            </span>
          </div>

          <h4 className="mt-2 text-xl font-semibold text-white">
            Dr. Dashboard
          </h4>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
          <Stethoscope
            size={18}
            className="text-blue-400"
          />
        </div>
      </div>

      {/* Doctor Info */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-semibold text-white">
          AS
        </div>

        <div>
          <p className="text-xs font-medium text-white">
            Dr. Amit Sharma
          </p>

          <p className="mt-1 text-[9px] text-white/40">
            Cardiology Specialist
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-[9px] text-emerald-400">
            Available
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <DoctorStat
          label="Today"
          value="18"
          accent="blue"
        />

        <DoctorStat
          label="Waiting"
          value="06"
          accent="orange"
        />

        <DoctorStat
          label="Completed"
          value="12"
          accent="green"
        />
      </div>

      {/* Current Patient */}
      <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/[0.07] p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-white/50">
            CURRENT PATIENT
          </p>

          <span className="rounded-full bg-orange-500/15 px-2 py-1 text-[8px] font-medium text-orange-400">
            Consultation
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white">
            RK
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Ravi Kumar
            </p>

            <p className="mt-1 text-[9px] text-white/40">
              Queue No. 01 • Token #CC-012
            </p>
          </div>

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-md shadow-blue-500/30"
          >
            <ClipboardList
              size={14}
              className="text-white"
            />
          </motion.div>
        </div>
      </div>

      {/* Queue List */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-white/50">
            UPCOMING PATIENTS
          </p>

          <p className="text-[9px] text-blue-400 font-semibold">
            Live Queue
          </p>
        </div>

        <div className="mt-3 space-y-2">
          <QueuePatient
            number="02"
            name="Neha Singh (#CC-013)"
            status="Next"
          />

          <QueuePatient
            number="03"
            name="Mohd. Ali (#CC-014)"
            status="Waiting"
          />

          <QueuePatient
            number="04"
            name="Sunita Devi (#CC-015)"
            status="Upcoming"
          />
        </div>
      </div>

      {/* Activity Graph */}
      <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-white/50">
            Weekly Consultations
          </p>

          <span className="text-[9px] text-emerald-400 font-bold">
            +18%
          </span>
        </div>

        <div className="mt-4 flex h-14 items-end gap-1.5">
          {[40, 65, 45, 80, 60, 90, 70].map(
            (height, index) => (
              <motion.div
                key={index}
                initial={{
                  height: "0%",
                }}
                whileInView={{
                  height: `${height}%`,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.08,
                  ease,
                }}
                className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-400"
              />
            )
          )}
        </div>
      </div>

      {/* Background Glow */}
      <div className="pointer-events-none absolute -bottom-20 left-1/2 h-40 w-48 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
    </motion.div>
  );
}

/* ---------------------------------- */
/* DOCTOR STATISTICS COMPONENT */
/* ---------------------------------- */

function DoctorStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "blue" | "orange" | "green";
}) {
  const accentColors = {
    blue: "text-blue-400",
    orange: "text-orange-400",
    green: "text-emerald-400",
  };

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3">
      <p className="text-[8px] text-white/40">
        {label}
      </p>

      <p
        className={`mt-2 text-lg font-semibold ${accentColors[accent]}`}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* QUEUE PATIENT COMPONENT */
/* ---------------------------------- */

function QueuePatient({
  number,
  name,
  status,
}: {
  number: string;
  name: string;
  status: string;
}) {
  return (
    <motion.div
      whileHover={{
        x: 4,
      }}
      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] p-2.5"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08] text-[9px] font-semibold text-blue-400">
        {number}
      </div>

      <div className="flex-1">
        <p className="text-[10px] font-medium text-white">
          {name}
        </p>
      </div>

      <span className="text-[8px] text-white/40">
        {status}
      </span>
    </motion.div>
  );
}

/* ---------------------------------- */
/* DASHBOARD STAT (HOSPITAL) */
/* ---------------------------------- */

function DashboardStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "blue" | "orange" | "green";
}) {
  const colors = {
    blue: "text-blue-400",
    orange: "text-orange-400",
    green: "text-emerald-400",
  };

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-2.5">
      <p className="text-[8px] text-white/40">
        {label}
      </p>

      <p className={`mt-2 text-base font-semibold ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* MINI DOCTOR (HOSPITAL) */
/* ---------------------------------- */

function MiniDoctor({
  name,
  status,
  active = false,
}: {
  name: string;
  status: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] p-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[9px] font-medium text-white">
        {name
          .split(" ")
          .map((word) => word[0])
          .join("")}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-white">
          {name}
        </p>

        <p className="mt-0.5 text-[8px] text-white/40">
          {status}
        </p>
      </div>

      <span
        className={`h-2 w-2 rounded-full ${
          active
            ? "bg-orange-400"
            : status === "Available"
            ? "bg-emerald-400"
            : "bg-blue-400"
        }`}
      />
    </div>
  );
}

/* ---------------------------------- */
/* DESKTOP CONNECTION LINES */
/* ---------------------------------- */

function DesktopConnectionLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      viewBox="0 0 1200 600"
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M180 100 C350 100 400 220 520 260"
        stroke="rgba(37,99,235,0.25)"
        strokeWidth="1.5"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        whileInView={{
          pathLength: 1,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.5,
        }}
      />

      <motion.path
        d="M1020 100 C850 100 800 220 680 260"
        stroke="rgba(37,99,235,0.25)"
        strokeWidth="1.5"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        whileInView={{
          pathLength: 1,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.5,
          delay: 0.1,
        }}
      />

      <motion.path
        d="M180 300 C350 300 400 300 520 300"
        stroke="rgba(249,115,22,0.25)"
        strokeWidth="1.5"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        whileInView={{
          pathLength: 1,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.5,
          delay: 0.2,
        }}
      />

      <motion.path
        d="M1020 300 C850 300 800 300 680 300"
        stroke="rgba(249,115,22,0.25)"
        strokeWidth="1.5"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        whileInView={{
          pathLength: 1,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.5,
          delay: 0.3,
        }}
      />

      <motion.path
        d="M180 500 C350 500 400 380 520 340"
        stroke="rgba(37,99,235,0.25)"
        strokeWidth="1.5"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        whileInView={{
          pathLength: 1,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.5,
          delay: 0.4,
        }}
      />

      <motion.path
        d="M1020 500 C850 500 800 380 680 340"
        stroke="rgba(37,99,235,0.25)"
        strokeWidth="1.5"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        whileInView={{
          pathLength: 1,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.5,
          delay: 0.5,
        }}
      />
    </svg>
  );
}
