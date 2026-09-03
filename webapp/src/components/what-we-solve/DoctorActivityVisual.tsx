import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function DoctorActivityVisual() {
  return (
    <div className="w-full max-w-[340px] flex items-center justify-between gap-2 py-2">
      {/* Left: Scattered/Staggered Doctors */}
      <div className="relative w-[130px] h-[190px] flex flex-col justify-between">
        {/* Dr. Sharma (Top, slightly right) */}
        <div className="self-end flex items-center gap-2 bg-white rounded-xl border border-slate-100 px-2 py-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.05)] w-[108px]">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&auto=format&fit=crop&q=80" alt="Dr." className="w-6 h-6 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">Dr. Sharma</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-[8px] text-slate-400">Busy</span>
            </div>
          </div>
        </div>

        {/* Dr. Khan (Middle, slightly left) */}
        <div className="self-start flex items-center gap-2 bg-white rounded-xl border border-slate-100 px-2 py-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.05)] w-[108px]">
          <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=80&auto=format&fit=crop&q=80" alt="Dr." className="w-6 h-6 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">Dr. Khan</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] text-slate-400">Available</span>
            </div>
          </div>
        </div>

        {/* Dr. Verma (Bottom, center) */}
        <div className="self-center flex items-center gap-2 bg-white rounded-xl border border-slate-100 px-2 py-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.05)] w-[114px]">
          <img src="https://images.unsplash.com/photo-1594824813593-9c8ef7d6e6ea?w=80&auto=format&fit=crop&q=80" alt="Dr." className="w-6 h-6 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">Dr. Verma</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[7.5px] text-slate-400 whitespace-nowrap">In Consultation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Arrow in circle */}
      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 shrink-0 shadow-xs">
        <ArrowRight size={14} />
      </div>

      {/* Right: Perfectly Aligned Stack of Doctors */}
      <div className="w-[130px] space-y-2">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-100 px-2.5 py-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&auto=format&fit=crop&q=80" alt="Dr." className="w-6 h-6 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">Dr. Sharma</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-[8px] text-slate-400">Busy</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-100 px-2.5 py-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
          <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=80&auto=format&fit=crop&q=80" alt="Dr." className="w-6 h-6 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">Dr. Khan</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] text-slate-400">Available</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-100 px-2.5 py-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
          <img src="https://images.unsplash.com/photo-1594824813593-9c8ef7d6e6ea?w=80&auto=format&fit=crop&q=80" alt="Dr." className="w-6 h-6 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">Dr. Verma</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[7.5px] text-slate-400 whitespace-nowrap">In Consultation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
