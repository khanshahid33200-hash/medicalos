import { motion } from "framer-motion";
import { Users, Calendar, Stethoscope, FileText } from "lucide-react";

export default function DisconnectedWorkflowVisual() {
  return (
    <div className="relative w-full max-w-[340px] h-[220px] flex items-center justify-center">
      {/* Connecting Dashed Curved SVG Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300 stroke-[1.5]" strokeDasharray="4 4" fill="none">
        <path d="M 70 60 Q 120 90, 170 110" />
        <path d="M 270 60 Q 220 90, 170 110" />
        <path d="M 70 160 Q 120 130, 170 110" />
        <path d="M 270 160 Q 220 130, 170 110" />
      </svg>

      {/* Central '?' Circle */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-11 h-11 rounded-full bg-slate-50 border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-400 font-bold text-sm"
      >
        ?
      </motion.div>

      {/* Top Left: Patients */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-2 left-2 z-20 flex flex-col items-center justify-center w-[92px] h-[80px] rounded-2xl bg-white border border-slate-100 shadow-[0_8px_20px_rgba(15,23,42,0.06)] p-2"
      >
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
          <Users size={16} />
        </div>
        <span className="text-[11px] font-semibold text-slate-700">Patients</span>
      </motion.div>

      {/* Top Right: Appointments */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        className="absolute top-2 right-2 z-20 flex flex-col items-center justify-center w-[92px] h-[80px] rounded-2xl bg-white border border-slate-100 shadow-[0_8px_20px_rgba(15,23,42,0.06)] p-2"
      >
        <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-1">
          <Calendar size={16} />
        </div>
        <span className="text-[11px] font-semibold text-slate-700">Appointments</span>
      </motion.div>

      {/* Bottom Left: Doctors */}
      <motion.div
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute bottom-2 left-2 z-20 flex flex-col items-center justify-center w-[92px] h-[80px] rounded-2xl bg-white border border-slate-100 shadow-[0_8px_20px_rgba(15,23,42,0.06)] p-2"
      >
        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
          <Stethoscope size={16} />
        </div>
        <span className="text-[11px] font-semibold text-slate-700">Doctors</span>
      </motion.div>

      {/* Bottom Right: Records */}
      <motion.div
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute bottom-2 right-2 z-20 flex flex-col items-center justify-center w-[92px] h-[80px] rounded-2xl bg-white border border-slate-100 shadow-[0_8px_20px_rgba(15,23,42,0.06)] p-2"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
          <FileText size={16} />
        </div>
        <span className="text-[11px] font-semibold text-slate-700">Records</span>
      </motion.div>
    </div>
  );
}
