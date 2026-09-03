import { motion } from "framer-motion";

export default function SectionHeading() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-4 py-1.5 shadow-xs backdrop-blur-md"
      >
        <span className="h-2 w-2 rounded-full bg-[#f97316]" />
        <span className="text-xs font-semibold text-slate-700">
          The Problem We Solve
        </span>
      </motion.div>

      {/* Main Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[56px] leading-[1.15]"
      >
        Hospital operations should not<br />
        feel{" "}
        <span className="text-[#f97316]">
          disconnected.
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-5 max-w-2xl text-xs sm:text-sm font-medium leading-relaxed text-slate-500"
      >
        Managing a hospital often means switching between doctors, patient records,
        appointments, queues, and daily operations. MedTech Fixaters brings these
        essential workflows into one connected digital platform.
      </motion.p>
    </div>
  );
}
