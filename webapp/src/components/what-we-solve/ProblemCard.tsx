import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ProblemCardProps {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function ProblemCard({
  number,
  title,
  description,
  children,
}: ProblemCardProps) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="group relative overflow-hidden rounded-[28px] border border-slate-100 bg-white/80 p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)] backdrop-blur-xl text-left flex flex-col lg:flex-row gap-6 items-center justify-between"
    >
      {/* Soft internal gradient shine */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/90 via-slate-50/40 to-transparent -z-10" />

      {/* Left Info Column */}
      <div className="w-full lg:w-[42%] flex flex-col justify-start shrink-0">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-orange-50 border border-orange-100/80 text-xs font-bold text-[#f97316] mb-4">
          {number}
        </span>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
          {title}
        </h3>

        <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-500 font-normal">
          {description}
        </p>
      </div>

      {/* Right Visual Graphic */}
      <div className="w-full lg:w-[58%] flex items-center justify-center">
        {children}
      </div>
    </motion.article>
  );
}
