import { motion } from "framer-motion";
import { CheckCircle2, User } from "lucide-react";

export default function QueueProblemVisual() {
  return (
    <div className="w-full max-w-[340px] flex items-center gap-4 py-2">
      {/* Queue List Table */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-2.5 shadow-[0_8px_25px_rgba(15,23,42,0.05)] space-y-1.5">
        {/* Item 08: Completed */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-500">08</span>
            <span className="text-slate-600 font-medium text-[11px]">Completed</span>
          </div>
          <CheckCircle2 size={13} className="text-emerald-500" />
        </div>

        {/* Item 09: In Consultation */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-500">09</span>
            <span className="text-slate-600 font-medium text-[11px]">In Consultation</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-blue-500" />
        </div>

        {/* Item 10: You're Next (Highlighted Active Orange) */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50/80 border border-orange-200/90 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-[#f97316]">10</span>
            <span className="text-[#f97316] font-bold text-xs">You're Next</span>
          </div>
          <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
            <User size={11} />
          </div>
        </motion.div>

        {/* Item 11: Waiting */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-400">11</span>
            <span className="text-slate-500 font-medium text-[11px]">Waiting</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-slate-300" />
        </div>

        {/* Item 12: Waiting */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-400">12</span>
            <span className="text-slate-500 font-medium text-[11px]">Waiting</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
      </div>

      {/* Right Side: Please Wait Spinner */}
      <div className="flex flex-col items-center justify-center shrink-0 w-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-11 h-11 rounded-full border-2 border-dashed border-orange-500 flex items-center justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-orange-500" />
        </motion.div>
        <span className="mt-2 text-[10px] font-bold text-[#f97316] tracking-tight">
          Please Wait
        </span>
      </div>
    </div>
  );
}
