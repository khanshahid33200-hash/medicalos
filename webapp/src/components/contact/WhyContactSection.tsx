"use client";

import { motion } from "motion/react";
import {
  Building2,
  Users,
  Stethoscope,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";

const whyContactItems = [
  {
    icon: Building2,
    title: "Hospital Digital Operations",
    description:
      "Modernize OPD registration, roster doctors across departments, and eliminate crowded waiting areas with real-time operational visibility.",
    accent: "from-blue-600 to-indigo-600",
    borderGlow: "hover:border-blue-200",
  },
  {
    icon: Users,
    title: "Patient Experience",
    description:
      "Deliver instant QR check-ins, live token countdowns on patient phones, and automated appointment reminders without friction.",
    accent: "from-orange-500 to-amber-600",
    borderGlow: "hover:border-orange-200",
  },
  {
    icon: Stethoscope,
    title: "Doctor Workflow",
    description:
      "Equip doctors with dedicated clinical workspaces for 1-click patient calling, longitudinal medical records, and sub-30-second digital Rx generation.",
    accent: "from-emerald-500 to-teal-600",
    borderGlow: "hover:border-emerald-200",
  },
  {
    icon: Zap,
    title: "AI-Powered Automation",
    description:
      "Intelligently guide patient triage, summarize clinical visit history, and trigger automated chronic care follow-up workflows.",
    accent: "from-violet-500 to-purple-600",
    borderGlow: "hover:border-violet-200",
  },
];

export default function WhyContactSection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16 lg:py-20 w-full">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-3.5 py-1 shadow-2xs backdrop-blur-xl"
          >
            <Sparkles size={11} className="text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">
              SOLVING HEALTHCARE FRICTION
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#17191F]"
          >
            Let’s Solve the Right Problem.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-base text-slate-500 max-w-xl mx-auto"
          >
            We partner with hospitals and clinics to replace fragmented paper systems with seamless digital operating pipelines.
          </motion.p>
        </div>

        {/* 4 Compact Cards */}
        <div className="mt-8 sm:mt-12 grid gap-3.5 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {whyContactItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                }}
                className={`group flex flex-col justify-between rounded-2xl sm:rounded-[28px] border border-white/80 bg-white/75 p-4 sm:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all duration-300 ${item.borderGlow} hover:shadow-[0_15px_40px_rgba(37,99,235,0.08)] text-left`}
              >
                <div>
                  <div
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-md shadow-blue-500/20 mb-4 sm:mb-5`}
                  >
                    <Icon size={20} />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#17191F] group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 sm:mt-5 flex items-center gap-1 text-[11px] font-bold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Explore Workflow</span>
                  <ArrowRight size={13} />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
