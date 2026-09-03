import { useState } from "react";
import {
  Home,
  CalendarDays,
  Users,
  Stethoscope,
  FileText,
  ClipboardList,
  BarChart3,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  Plus,
  ShieldPlus,
  FlaskConical,
  FilePlus2,
  Upload,
  HelpCircle,
  Building2,
  Star,
  Timer,
  UserCheck,
  HeartPulse,
} from "lucide-react";

type Page =
  | "Dashboard"
  | "Today's Queue"
  | "Appointments"
  | "Patients"
  | "Consultations"
  | "Prescriptions"
  | "Templates"
  | "Follow Ups"
  | "Reports"
  | "Profile"
  | "Settings";

const queuePatients = [
  {
    number: 1,
    token: "CC-012",
    name: "Ravi Kumar",
    age: "32",
    gender: "Male",
    status: "Now Consulting",
    wait: "—",
  },
  {
    number: 2,
    token: "CC-013",
    name: "Neha Singh",
    age: "28",
    gender: "Female",
    status: "Next",
    wait: "5 min",
  },
  {
    number: 3,
    token: "CC-014",
    name: "Mohd. Ali",
    age: "45",
    gender: "Male",
    status: "Waiting",
    wait: "18 min",
  },
  {
    number: 4,
    token: "CC-015",
    name: "Sunita Devi",
    age: "34",
    gender: "Female",
    status: "Waiting",
    wait: "28 min",
  },
  {
    number: 5,
    token: "CC-016",
    name: "Vikas Patel",
    age: "50",
    gender: "Male",
    status: "Waiting",
    wait: "35 min",
  },
];

const appointments = [
  {
    time: "11:30 AM",
    name: "Arjun Mehta",
    type: "Follow up",
  },
  {
    time: "12:00 PM",
    name: "Pooja Gupta",
    type: "New Patient",
  },
  {
    time: "12:30 PM",
    name: "Sanjay Verma",
    type: "Follow up",
  },
  {
    time: "01:00 PM",
    name: "Anita Desai",
    type: "Consultation",
  },
  {
    time: "01:30 PM",
    name: "Rajesh Nair",
    type: "ECG Review",
  },
];

export default function DoctorDashboardSimulator() {
  const [activePage, setActivePage] = useState<Page>("Dashboard");

  const [currentPatient, setCurrentPatient] = useState(queuePatients[0]);

  const [selectedPatient, setSelectedPatient] = useState(queuePatients[0]);

  const navigation = [
    { label: "Dashboard", icon: Home },
    { label: "Today's Queue", icon: CalendarDays },
    { label: "Appointments", icon: CalendarDays },
    { label: "Patients", icon: Users },
    { label: "Consultations", icon: Stethoscope },
    { label: "Prescriptions", icon: FileText },
    { label: "Templates", icon: ClipboardList },
    { label: "Follow Ups", icon: HelpCircle },
    { label: "Reports", icon: BarChart3 },
    { label: "Profile", icon: User },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-[#f7f8fc] font-sans text-slate-800 shadow-[0_30px_100px_rgba(15,23,42,0.15)] text-left">
      <div className="flex flex-col lg:flex-row min-h-[920px]">
        {/* ─── SIDEBAR ─── */}
        <aside className="w-full lg:w-[250px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col">
          <div className="flex h-[82px] items-center gap-3 border-b border-slate-100 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4f6bdc] to-[#6b46c1] text-lg font-bold text-white shadow-md shadow-indigo-500/20">
              <HeartPulse size={20} />
            </div>

            <div>
              <p className="text-[18px] font-semibold tracking-tight text-slate-800">
                MedTech Fixaters
              </p>

              <p className="text-[11px] text-slate-400">
                Doctor Dashboard
              </p>
            </div>
          </div>

          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-slate-100 to-slate-300 shadow-sm flex items-center justify-center text-xl font-semibold text-slate-500">
                AS
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Dr. Amit Sharma
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Cardiologist
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  MBBS, MD Cardiology
                </p>

                <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Available
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5 overflow-x-auto lg:overflow-visible flex lg:flex-col gap-1 lg:gap-0">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => setActivePage(item.label as Page)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all duration-200 shrink-0 lg:w-full ${
                    isActive
                      ? "bg-gradient-to-r from-[#4658c8] to-[#5b4bc4] font-medium text-white shadow-lg shadow-indigo-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#4658c8]"
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mx-5 mb-5 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4">
            <div className="flex items-center gap-2">
              <HelpCircle size={17} className="text-[#4f63d7]" />
              <p className="text-sm font-medium text-slate-700">Need Help?</p>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Contact hospital administration or support team.
            </p>

            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-100 bg-white py-2 text-xs font-medium text-[#4658c8] shadow-sm">
              <HelpCircle size={14} />
              Get Support
            </button>
          </div>

          <button className="flex items-center gap-3 border-t border-slate-100 px-8 py-6 text-sm text-red-500">
            <LogOut size={17} />
            Logout
          </button>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[82px] items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[#5264d6]">
                <Building2 size={22} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-semibold text-slate-800">
                    City Care Hospital
                  </h1>
                  <ChevronDown size={15} className="text-slate-500" />
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Mumbai, Maharashtra
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600 md:flex">
                <CalendarDays size={15} />
                May 31, 2025
                <ChevronDown size={14} />
              </button>

              <button className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50">
                <Bell size={19} className="text-slate-600" />
                <span className="absolute right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] text-white">
                  3
                </span>
              </button>

              <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 md:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                  AS
                </div>
                <div>
                  <p className="text-sm font-medium">Dr. Amit Sharma</p>
                </div>
                <ChevronDown size={15} />
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 lg:p-6">
            {activePage === "Dashboard" ? (
              <DashboardContent
                currentPatient={currentPatient}
                selectedPatient={selectedPatient}
                setCurrentPatient={setCurrentPatient}
                setSelectedPatient={setSelectedPatient}
              />
            ) : (
              <PlaceholderPage title={activePage} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardContent({
  currentPatient,
  selectedPatient,
  setCurrentPatient,
  setSelectedPatient,
}: any) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-5">
        {/* ─── METRIC CARDS ─── */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<Users size={20} />}
            iconClass="bg-[#7561d8]"
            title="Total Patients"
            value="28"
            subtitle="Today"
            trend="↑ 12% vs yesterday"
            trendClass="text-emerald-600"
          />

          <MetricCard
            icon={<Clock size={20} />}
            iconClass="bg-[#3978d6]"
            title="Completed"
            value="16"
            subtitle="Today"
            trend="↑ 14% vs yesterday"
            trendClass="text-emerald-600"
          />

          <MetricCard
            icon={<Timer size={20} />}
            iconClass="bg-[#ff833d]"
            title="Avg. Consultation Time"
            value="18"
            suffix="mins"
            subtitle="Today"
            trend="↓ 4% vs yesterday"
            trendClass="text-red-500"
          />

          <MetricCard
            icon={<Star size={20} />}
            iconClass="bg-[#3eae83]"
            title="Patient Rating"
            value="4.8"
            suffix="/ 5"
            subtitle="Based on 86 reviews"
            trend="↑ 0.2 vs last month"
            trendClass="text-emerald-600"
          />
        </section>

        {/* ─── QUEUE & APPOINTMENTS ─── */}
        <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold">Today's Queue</h2>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              <button className="text-xs font-medium text-[#4d5dd2]">
                View Full Queue
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-medium">#</th>
                    <th className="px-3 py-3 font-medium">Token</th>
                    <th className="px-3 py-3 font-medium">Patient Name</th>
                    <th className="px-3 py-3 font-medium">Age / Gender</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Wait Time</th>
                  </tr>
                </thead>

                <tbody>
                  {queuePatients.map((patient) => {
                    const isSelected = selectedPatient.token === patient.token;

                    return (
                      <tr
                        key={patient.token}
                        onClick={() => setSelectedPatient(patient)}
                        className={`cursor-pointer border-b border-slate-100 text-xs transition hover:bg-indigo-50/40 ${
                          isSelected
                            ? "bg-gradient-to-r from-emerald-50/70 via-indigo-50/60 to-transparent"
                            : ""
                        }`}
                      >
                        <td className="px-5 py-4 text-slate-500">
                          {patient.number}
                        </td>

                        <td className="px-3 py-4 font-medium text-slate-600">
                          {patient.token}
                        </td>

                        <td className="px-3 py-4 font-medium text-slate-800">
                          {patient.name}
                        </td>

                        <td className="px-3 py-4 text-slate-500">
                          {patient.age} / {patient.gender}
                        </td>

                        <td className="px-3 py-4">
                          <QueueStatus status={patient.status} />
                        </td>

                        <td className="px-5 py-4 text-right text-slate-500">
                          {patient.wait}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 px-5 py-4 text-xs text-slate-500">
              <Users size={15} className="text-[#5264d6]" />
              Total Waiting: 4 Patients
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Upcoming Appointments</h2>
              <button className="text-xs font-medium text-[#4d5dd2]">
                View Calendar
              </button>
            </div>

            <div>
              {appointments.map((appointment) => (
                <div
                  key={appointment.time}
                  className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-0"
                >
                  <div className="w-[58px] text-[11px] font-medium text-[#4053b8]">
                    {appointment.time}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-700">
                      {appointment.name}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {appointment.type}
                    </p>
                  </div>

                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-600">
                    Confirmed
                  </span>

                  <ChevronRight size={15} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── QUICK ACTIONS & TODAY'S SUMMARY ─── */}
        <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)]">
            <h2 className="mb-5 text-sm font-semibold">Quick Actions</h2>

            <div className="grid grid-cols-4 gap-3">
              <QuickAction
                icon={<Plus size={20} />}
                label="New Consultation"
                color="bg-indigo-100 text-[#5a56c9]"
              />

              <QuickAction
                icon={<FilePlus2 size={20} />}
                label="Prescription"
                color="bg-emerald-100 text-emerald-600"
              />

              <QuickAction
                icon={<ShieldPlus size={20} />}
                label="Medical Certificate"
                color="bg-blue-100 text-blue-600"
              />

              <QuickAction
                icon={<FlaskConical size={20} />}
                label="Lab Test Advice"
                color="bg-orange-100 text-orange-600"
              />

              <QuickAction
                icon={<CalendarDays size={20} />}
                label="Follow Up"
                color="bg-rose-100 text-rose-500"
              />

              <QuickAction
                icon={<FileText size={20} />}
                label="Patient Notes"
                color="bg-amber-100 text-amber-600"
              />

              <QuickAction
                icon={<Upload size={20} />}
                label="Upload Report"
                color="bg-indigo-100 text-indigo-500"
              />

              <QuickAction
                icon={<ClipboardList size={20} />}
                label="Templates"
                color="bg-blue-100 text-blue-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Today's Summary</h2>

              <button className="flex items-center gap-1 text-xs font-medium text-[#4d5dd2]">
                View Reports
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row">
              <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full bg-[conic-gradient(#42af85_0deg_205deg,#f7a83b_205deg_320deg,#ef6b75_320deg_345deg,#d9dee8_345deg_360deg)]">
                <div className="flex h-[112px] w-[112px] flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-3xl font-semibold text-slate-700">28</span>
                  <span className="text-xs text-slate-500">Total</span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <SummaryRow
                  label="Completed"
                  value="16 (57%)"
                  color="bg-emerald-500"
                />

                <SummaryRow
                  label="Waiting"
                  value="9 (32%)"
                  color="bg-orange-400"
                />

                <SummaryRow
                  label="No Show"
                  value="2 (7%)"
                  color="bg-red-400"
                />

                <SummaryRow
                  label="Cancelled"
                  value="1 (4%)"
                  color="bg-slate-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── REMINDER & HOSPITAL TIME ─── */}
        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)] md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#5264d6]">
              <Bell size={20} />
            </div>

            <div>
              <p className="text-xs font-medium">Reminder</p>
              <p className="mt-1 text-[11px] text-slate-500">
                You have 3 follow-ups due tomorrow
              </p>
              <button className="mt-2 text-[11px] font-medium text-[#4d5dd2]">
                View Follow Ups
              </button>
            </div>
          </div>

          <div className="border-y border-slate-100 py-5 md:border-x md:border-y-0 md:px-8 md:py-0">
            <p className="text-xs font-medium">Today's Tip</p>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              Stay calm and take one patient at a time.
            </p>
          </div>

          <div className="flex items-center gap-4 md:pl-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#5264d6]">
              <Clock size={20} />
            </div>

            <div>
              <p className="text-xs font-medium">Hospital Time</p>
              <p className="mt-1 text-lg font-semibold">10:42 AM</p>
              <p className="text-[10px] text-slate-500">
                May 31, 2025, Saturday
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ─── RIGHT PATIENT PANEL ─── */}
      <RightPatientPanel
        currentPatient={currentPatient}
        selectedPatient={selectedPatient}
        setCurrentPatient={setCurrentPatient}
      />
    </div>
  );
}

function RightPatientPanel({
  currentPatient,
  selectedPatient,
  setCurrentPatient,
}: any) {
  return (
    <aside className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
        <div className="bg-gradient-to-r from-[#3f55c5] to-[#6655cf] px-5 py-4 text-sm font-semibold text-white">
          Current Queue
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-emerald-600">
            Now Consulting
          </p>

          <h3 className="mt-3 text-3xl font-semibold text-slate-700">
            {currentPatient.token}
          </h3>

          <p className="mt-3 text-sm font-semibold">
            {currentPatient.name}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {currentPatient.age} Yrs, {currentPatient.gender}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Chest pain, fatigue
          </p>

          <button className="mt-4 w-full rounded-lg border border-[#5966d8] py-2.5 text-xs font-medium text-[#4658c8]">
            View Patient Details
          </button>

          <div className="my-4 border-t border-slate-100" />

          <p className="text-xs font-medium text-[#5665c9]">
            Next Patient
          </p>

          <h3 className="mt-3 text-2xl font-semibold text-slate-700">
            CC-013
          </h3>

          <p className="mt-2 text-sm font-medium">
            Neha Singh
          </p>

          <p className="mt-1 text-xs text-slate-500">
            28 Yrs, Female
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Acidity, headache
          </p>

          <button
            onClick={() => setCurrentPatient(queuePatients[1])}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#4052c7] to-[#6352ce] py-3 text-xs font-medium text-white shadow-lg shadow-indigo-200"
          >
            <UserCheck size={15} />
            Call Next Patient
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Current Patient
          </h2>

          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-600">
            Consultation
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-500">
            RK
          </div>

          <div>
            <p className="text-sm font-semibold">
              Ravi Kumar
            </p>

            <p className="mt-1 text-xs text-slate-500">
              32 Yrs, Male
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              # CC-012
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-5 border-b border-slate-100">
          <button className="border-b-2 border-[#5264d6] pb-3 text-[10px] font-medium text-[#4d5dd2]">
            Details
          </button>

          <button className="pb-3 text-[10px] text-slate-500">
            History
          </button>

          <button className="pb-3 text-[10px] text-slate-500">
            Prescriptions
          </button>

          <button className="pb-3 text-[10px] text-slate-500">
            Reports
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-[10px] font-medium text-slate-500">
              Chief Complaint
            </p>

            <p className="mt-2 text-xs text-slate-700">
              Chest pain and fatigue since 2 days
            </p>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-medium text-slate-500">
              Vitals
            </p>

            <div className="grid grid-cols-4 gap-2">
              <Vital label="BP" value="120/80" />
              <Vital label="Pulse" value="78 bpm" />
              <Vital label="Temp" value="98.4°F" />
              <Vital label="SpO2" value="98%" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10px] text-slate-400">
                Allergies
              </p>

              <p className="mt-1 text-slate-700">
                None
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400">
                Last Visit
              </p>

              <p className="mt-1 text-slate-700">
                May 20, 2025
              </p>
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#4052c7] to-[#6352ce] py-3 text-xs font-medium text-white shadow-lg shadow-indigo-200">
            <Stethoscope size={15} />
            Start Consultation
          </button>
        </div>
      </div>
    </aside>
  );
}

function MetricCard({
  icon,
  iconClass,
  title,
  value,
  suffix,
  subtitle,
  trend,
  trendClass,
}: any) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-lg ${iconClass}`}>
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-500">
            {title}
          </p>

          <div className="mt-1 flex items-end gap-1">
            <p className="text-3xl font-semibold tracking-tight text-slate-800">
              {value}
            </p>

            {suffix && (
              <span className="mb-1 text-sm text-slate-600">
                {suffix}
              </span>
            )}
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      <p className={`mt-5 text-[11px] ${trendClass}`}>
        {trend}
      </p>
    </div>
  );
}

function QueueStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Now Consulting": "bg-emerald-50 text-emerald-600",
    Next: "bg-indigo-50 text-indigo-600",
    Waiting: "bg-orange-50 text-orange-600",
  };

  return (
    <span className={`rounded-md px-2 py-1.5 text-[10px] font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function QuickAction({
  icon,
  label,
  color,
}: any) {
  return (
    <button className="group flex flex-col items-center gap-2 text-center">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:-translate-y-1 ${color}`}>
        {icon}
      </div>

      <span className="text-[9px] leading-4 text-slate-600">
        {label}
      </span>
    </button>
  );
}

function SummaryRow({
  label,
  value,
  color,
}: any) {
  return (
    <div className="flex items-center justify-between gap-10">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        <span className="text-slate-600">
          {label}
        </span>
      </div>

      <span className="font-medium text-slate-700">
        {value}
      </span>
    </div>
  );
}

function Vital({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2 text-center">
      <p className="text-[8px] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[10px] font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-[#5264d6]">
        <ClipboardList size={28} />
      </div>

      <h2 className="mt-5 text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        This dashboard section will display live hospital data.
      </p>
    </div>
  );
}
