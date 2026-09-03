import { motion } from "framer-motion";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Building2,
  QrCode,
  Route,
  Scan,
  Stethoscope,
  User,
  Users,
  Zap,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Hospital QR",
    description: "Every hospital receives its own unique QR code.",
    icon: QrCode,
  },
  {
    number: "02",
    title: "Patient Scans",
    description: "The patient scans the QR using their phone.",
    icon: Scan,
  },
  {
    number: "03",
    title: "Selects Department",
    description: "The patient selects the required department.",
    icon: ClipboardList,
  },
  {
    number: "04",
    title: "Selects Available Doctor",
    description: "Only doctors registered in that hospital appear.",
    icon: Stethoscope,
  },
  {
    number: "05",
    title: "Gets Live Queue Number",
    description: "A live queue number and waiting estimate appear.",
    icon: Users,
  },
  {
    number: "06",
    title: "Doctor Receives Appointment",
    description: "The appointment reaches the selected doctor instantly.",
    icon: Bell,
  },
];

const queueCards = [
  {
    queue: "A-010",
    name: "Rahul Sharma",
    time: "10:10 AM",
    image: "👨‍⚕️",
  },
  {
    queue: "A-012",
    name: "Priya Singh",
    time: "10:30 AM",
    image: "👩‍⚕️",
    active: true,
  },
  {
    queue: "A-013",
    name: "Vikram Joshi",
    time: "10:40 AM",
    image: "👨‍⚕️",
  },
  {
    queue: "A-014",
    name: "Meera Kapoor",
    time: "10:50 AM",
    image: "👩‍⚕️",
  },
];

const features = [
  {
    title: "Real-time Sync",
    description: "Fast updates across connected devices.",
    icon: Zap,
    color: "blue",
  },
  {
    title: "Live Queue",
    description: "Dynamic queue updates in real time.",
    icon: Users,
    color: "green",
  },
  {
    title: "Smart Routing",
    description: "Patients reach the correct doctor.",
    icon: Route,
    color: "purple",
  },
  {
    title: "Better Experience",
    description: "A smoother journey from scan to consultation.",
    icon: Check,
    color: "orange",
  },
];

export default function QRAppointmentSystem() {
  return (
    <section className="relative overflow-hidden bg-[#f5f6f8] py-24 lg:py-32">
      <Background />

      <div className="relative z-10 mx-auto max-w-[1700px] px-5 sm:px-8 lg:px-12">
        <Header />

        <div className="relative mt-16 grid gap-10 xl:grid-cols-[340px_minmax(400px,1fr)_380px] xl:items-center">
          <PatientSteps />

          <PhoneSystem />

          <DoctorDashboard />
        </div>

        <FeatureBar />
      </div>
    </section>
  );
}

/* ----------------------------------------
   BACKGROUND
----------------------------------------- */

function Background() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_5%_10%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_95%_30%,rgba(249,115,22,0.10),transparent_30%)]" />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-[120px]"
      />

      <div className="pointer-events-none absolute bottom-[-250px] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-[100%] bg-blue-500/10 blur-[100px]" />
    </>
  );
}

/* ----------------------------------------
   HEADER
----------------------------------------- */

function Header() {
  return (
    <div className="mx-auto max-w-6xl text-center">
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
        transition={{ duration: 0.7 }}
        className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 py-2 shadow-xs backdrop-blur-xl"
      >
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-700">
          04
        </span>

        <span className="text-xs font-bold tracking-[0.14em] text-blue-800">
          QR APPOINTMENT SYSTEM
        </span>
      </motion.div>

      <motion.h2
        initial={{
          opacity: 0,
          y: 35,
          filter: "blur(15px)",
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        viewport={{ once: true }}
        transition={{
          duration: 0.9,
          delay: 0.1,
        }}
        className="mt-7 text-4xl font-semibold tracking-[-0.055em] text-[#172033] sm:text-5xl md:text-6xl lg:text-7xl"
      >
        One QR Code.
        <span className="ml-3 text-blue-600">
          The Right Doctor.
        </span>
        <span className="ml-3 text-orange-500">
          A Live Queue.
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-500 md:text-lg"
      >
        Patients scan, select and join a live queue. Doctors receive
        appointments instantly. Every step stays connected in real time.
      </motion.p>
    </div>
  );
}

/* ----------------------------------------
   LEFT FLOW STEPS
----------------------------------------- */

function PatientSteps() {
  return (
    <div className="relative space-y-3">
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: "82%" }}
        viewport={{ once: true }}
        transition={{
          duration: 1.8,
          delay: 0.5,
          ease: "easeInOut",
        }}
        className="absolute left-[30px] top-[60px] z-0 border-l-2 border-dashed border-blue-300"
      />

      {steps.map((step, index) => {
        const Icon = step.icon;

        return (
          <motion.div
            key={step.number}
            initial={{
              opacity: 0,
              x: -45,
              filter: "blur(10px)",
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: index * 0.09,
            }}
            whileHover={{
              x: 8,
              scale: 1.015,
            }}
            className="group relative z-10"
          >
            <div className="relative overflow-hidden rounded-[22px] border border-white bg-white/70 p-4 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 group-hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)] text-left">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-700">
                  {step.number}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[#1b2940]">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {step.description}
                  </p>
                </div>

                <motion.div
                  whileHover={{
                    rotate: 8,
                    scale: 1.08,
                  }}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 text-blue-600"
                >
                  <Icon size={24} strokeWidth={1.8} />
                </motion.div>
              </div>

              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------
   PHONE AND LIVE QUEUE
----------------------------------------- */

function PhoneSystem() {
  return (
    <div className="relative flex min-h-[780px] items-center justify-center">
      <QueueConnectionLines />

      <QueueCards />

      <motion.div
        initial={{
          opacity: 0,
          y: 60,
          scale: 0.94,
          filter: "blur(15px)",
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1,
          delay: 0.25,
          type: "spring",
          stiffness: 80,
        }}
        className="relative z-20"
      >
        <PhoneGlow />

        <div className="relative w-[320px] rounded-[48px] bg-[#11151d] p-[7px] shadow-[0_35px_90px_rgba(15,23,42,0.32)] sm:w-[340px]">
          <div className="absolute left-1/2 top-[10px] z-30 h-[26px] w-[112px] -translate-x-1/2 rounded-full bg-black" />

          <div className="relative overflow-hidden rounded-[42px] bg-[#f7f8fa]">
            <PhoneScreen />
          </div>
        </div>

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-8 left-1/2 h-10 w-[90%] -translate-x-1/2 rounded-full bg-blue-500/25 blur-xl"
        />
      </motion.div>
    </div>
  );
}

function PhoneGlow() {
  return (
    <>
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="pointer-events-none absolute -inset-16 rounded-full border border-dashed border-blue-300/50"
      />

      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="pointer-events-none absolute -inset-8 rounded-full border border-blue-300/30"
      />
    </>
  );
}

function QueueConnectionLines() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "45%" }}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          delay: 0.7,
        }}
        className="absolute right-[50%] top-1/2 h-px border-t-2 border-dashed border-blue-400"
      />

      <motion.div
        animate={{
          x: [-30, 150, 300],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[48%] top-[calc(50%-4px)] h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.9)]"
      />
    </div>
  );
}

function QueueCards() {
  return (
    <div className="absolute right-[-20px] top-1/2 z-10 hidden w-[250px] -translate-y-1/2 xl:block text-left">
      <div className="space-y-5">
        {queueCards.map((card, index) => (
          <motion.div
            key={card.queue}
            initial={{
              opacity: 0,
              x: 60,
              filter: "blur(8px)",
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: index * 0.15,
            }}
            animate={
              card.active
                ? {
                    x: [0, -8, 0],
                    y: [0, -5, 0],
                  }
                : {}
            }
            whileHover={{
              x: -12,
              scale: 1.03,
            }}
            className={`relative rounded-2xl border p-3 backdrop-blur-xl ${
              card.active
                ? "border-blue-300 bg-white shadow-[0_15px_45px_rgba(37,99,235,0.18)]"
                : "border-white bg-white/60 shadow-lg"
            }`}
          >
            {card.active && (
              <motion.div
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="absolute -inset-1 rounded-2xl border border-blue-400"
              />
            )}

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-xl">
                {card.image}
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm font-bold ${
                    card.active ? "text-blue-700" : "text-slate-700"
                  }`}
                >
                  {card.queue}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  {card.name}
                </p>

                <p className="text-[9px] text-slate-400">{card.time}</p>
              </div>
            </div>

            {card.active && (
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, 15, 30],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                }}
                className="absolute -right-12 top-1/2 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6]"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PhoneScreen() {
  return (
    <div className="min-h-[680px] px-5 pb-6 pt-12 text-left">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#1d2a42]">
            MedTech Fixaters
          </p>

          <p className="mt-1 text-[9px] text-slate-500">
            City Care Hospital
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
          <Building2 size={17} className="text-blue-600" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#2c78dc] to-[#193d9b] p-5 text-center text-white shadow-xl shadow-blue-500/20"
      >
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
          }}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15"
        >
          <Check size={25} />
        </motion.div>

        <p className="mt-4 text-xs text-blue-100">
          You&apos;re in Queue
        </p>

        <motion.h3
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mt-1 text-3xl font-bold"
        >
          A-012
        </motion.h3>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-[10px]">
          <span className="flex items-center gap-1 text-blue-100">
            <Clock size={12} />
            Estimated Time
          </span>

          <span className="font-bold">15 - 20 min</span>
        </div>
      </motion.div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-semibold text-slate-600">
            Live Queue Progress
          </span>

          <span className="font-bold text-blue-600">
            35 People Ahead
          </span>
        </div>

        <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            animate={{
              width: ["35%", "45%", "35%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-bold text-[#1d2a42]">
          Appointment Details
        </p>

        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <DetailRow
            icon={ClipboardList}
            label="Department"
            value="General Medicine"
          />

          <DetailRow
            icon={Stethoscope}
            label="Doctor"
            value="Dr. Arjun Patel"
          />

          <DetailRow
            icon={CalendarDays}
            label="Date"
            value="24 May 2026"
          />

          <DetailRow
            icon={Clock}
            label="Time"
            value="10:30 AM"
          />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-around border-t border-slate-100 pt-4 text-[9px] text-slate-400">
        <NavItem icon={Building2} label="Home" active />
        <NavItem icon={CalendarDays} label="Appointments" />
        <NavItem icon={Users} label="Queue" />
        <NavItem icon={FileText} label="Reports" />
        <NavItem icon={User} label="Profile" />
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
      <Icon size={13} className="text-blue-500" />

      <span className="flex-1 text-[9px] text-slate-500">
        {label}
      </span>

      <span className="text-[9px] font-semibold text-slate-700">
        {value}
      </span>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 ${
        active ? "text-blue-600" : ""
      }`}
    >
      <Icon size={14} />
      <span>{label}</span>
    </div>
  );
}

/* ----------------------------------------
   DOCTOR DASHBOARD
----------------------------------------- */

function DoctorDashboard() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 55,
        filter: "blur(12px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.85,
        delay: 0.3,
      }}
      className="relative text-left"
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 20px 60px rgba(249,115,22,0.08)",
            "0 30px 70px rgba(249,115,22,0.18)",
            "0 20px 60px rgba(249,115,22,0.08)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="overflow-hidden rounded-[30px] border border-white bg-white/75 shadow-xl backdrop-blur-2xl"
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-5 text-white">
          <motion.div
            animate={{
              x: [-100, 400],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-y-0 w-24 -skew-x-12 bg-white/15 blur-xl"
          />

          <div className="relative flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Doctor Receives
              <br />
              Appointment
            </h3>

            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/15"
            >
              <Bell size={22} />
            </motion.div>
          </div>
        </div>

        <div className="p-5">
          <DoctorProfile />

          <NewAppointment />

          <TodayQueue />

          <motion.button
            whileHover={{
              scale: 1.02,
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/25"
          >
            Start Consultation
            <ChevronRight size={17} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DoctorProfile() {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
        👨‍⚕️
      </div>

      <div>
        <h4 className="font-semibold text-[#1b2940]">
          Dr. Arjun Patel
        </h4>

        <p className="mt-1 text-xs text-slate-500">
          General Physician
        </p>

        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Online
        </div>
      </div>
    </div>
  );
}

function NewAppointment() {
  return (
    <div className="border-b border-slate-100 py-5">
      <p className="text-xs font-bold text-[#1b2940]">
        New Appointment
      </p>

      <motion.div
        animate={{
          y: [0, -3, 0],
          boxShadow: [
            "0 5px 15px rgba(37,99,235,0.05)",
            "0 12px 25px rgba(37,99,235,0.13)",
            "0 5px 15px rgba(37,99,235,0.05)",
          ],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
        className="mt-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl">
          👩‍⚕️
        </div>

        <div className="flex-1">
          <p className="text-xs font-bold text-blue-700">
            A-012
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            Priya Singh
          </p>

          <p className="text-[9px] text-slate-400">
            10:30 AM
          </p>
        </div>

        <span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-semibold text-orange-600">
          New
        </span>
      </motion.div>
    </div>
  );
}

function TodayQueue() {
  const queue = [
    {
      number: "A-010",
      name: "Rahul Sharma",
      status: "Completed",
      color: "green",
    },
    {
      number: "A-011",
      name: "Sneha Verma",
      status: "Consulting",
      color: "orange",
    },
    {
      number: "A-012",
      name: "Priya Singh",
      status: "Next",
      color: "blue",
      active: true,
    },
    {
      number: "A-013",
      name: "Vikram Joshi",
      status: "Waiting",
      color: "gray",
    },
  ];

  return (
    <div className="pt-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-[#1b2940]">
          Today&apos;s Queue
        </p>

        <span className="text-[9px] font-semibold text-orange-500">
          35 People Ahead
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {queue.map((item, index) => (
          <motion.div
            key={item.number}
            initial={{
              opacity: 0,
              x: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.08,
            }}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
              item.active
                ? "bg-blue-50"
                : "bg-slate-50/70"
            }`}
          >
            <span
              className={`text-[10px] font-bold ${
                item.active
                  ? "text-blue-700"
                  : "text-slate-500"
              }`}
            >
              {item.number}
            </span>

            <span className="flex-1 text-[10px] text-slate-600">
              {item.name}
            </span>

            <span
              className={`rounded-full px-2 py-1 text-[8px] font-semibold ${
                item.color === "green"
                  ? "bg-emerald-50 text-emerald-600"
                  : item.color === "orange"
                  ? "bg-orange-50 text-orange-600"
                  : item.color === "blue"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   FEATURE BAR
----------------------------------------- */

function FeatureBar() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 35,
        filter: "blur(10px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
      }}
      className="mx-auto mt-14 max-w-6xl rounded-[26px] border border-white bg-white/70 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-2xl text-left"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          const iconColors = {
            blue: "bg-blue-50 text-blue-600",
            green: "bg-emerald-50 text-emerald-600",
            purple: "bg-violet-50 text-violet-600",
            orange: "bg-orange-50 text-orange-500",
          };

          return (
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
              }}
              whileHover={{
                y: -5,
              }}
              className="flex items-center gap-4 rounded-2xl px-4 py-3 transition-all"
            >
              <motion.div
                animate={{
                  scale:
                    feature.title === "Live Queue"
                      ? [1, 1.08, 1]
                      : 1,
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  iconColors[
                    feature.color as keyof typeof iconColors
                  ]
                }`}
              >
                <Icon size={21} />
              </motion.div>

              <div>
                <h3 className="text-sm font-semibold text-[#1b2940]">
                  {feature.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
