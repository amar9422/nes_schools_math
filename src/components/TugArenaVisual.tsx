import React from 'react';
import { motion } from 'motion/react';
import { Flag, Sparkles } from 'lucide-react';

interface TugArenaVisualProps {
  ropePosition: number; // e.g. -5 to +5 (negative = Blue leads, positive = Red leads)
  maxPulls: number; // e.g. 5
  blueTeamName?: string;
  redTeamName?: string;
  lastPuller?: 'blue' | 'red' | null;
}

export const TugArenaVisual: React.FC<TugArenaVisualProps> = ({
  ropePosition,
  maxPulls,
  blueTeamName = 'Blue Team',
  redTeamName = 'Red Team',
  lastPuller = null,
}) => {
  // Calculate percentage: 0% is max Blue win, 50% is dead center, 100% is max Red win
  // Clamp between -maxPulls and +maxPulls
  const clampedPos = Math.max(-maxPulls, Math.min(maxPulls, ropePosition));
  const normalizedPct = 50 + (clampedPos / maxPulls) * 40; // ranges from 10% to 90%

  return (
    <div className="relative w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 overflow-hidden shadow-2xl shadow-slate-950/60" id="tug-arena-stage">
      
      {/* Background Stadium Grid & Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.06)_0%,transparent_35%,transparent_65%,rgba(239,68,68,0.06)_100%)] pointer-events-none" />
      
      {/* Top Stadium Scoreboard Banner */}
      <div className="relative z-10 flex items-center justify-between mb-4 px-2 sm:px-6">
        
        {/* Blue Team Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600/20 border-2 border-blue-500/50 flex items-center justify-center text-blue-400 font-black text-lg sm:text-xl shadow-lg shadow-blue-600/20">
            {clampedPos < 0 ? Math.abs(clampedPos) : 0}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-blue-400 flex items-center gap-1.5">
              <span>Player 1</span>
              {clampedPos < 0 && <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded-full font-bold">Leading</span>}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">{blueTeamName}</h3>
          </div>
        </div>

        {/* Center Target Marker */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Pull Target</span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs font-black text-amber-400 px-2.5 py-0.5 bg-amber-400/10 border border-amber-400/20 rounded-full">
              First to {maxPulls} Pulls
            </span>
          </div>
        </div>

        {/* Red Team Status */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-red-400 flex items-center justify-end gap-1.5">
              {clampedPos > 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 rounded-full font-bold">Leading</span>}
              <span>Player 2 / AI</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">{redTeamName}</h3>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-600/20 border-2 border-red-500/50 flex items-center justify-center text-red-400 font-black text-lg sm:text-xl shadow-lg shadow-red-600/20">
            {clampedPos > 0 ? clampedPos : 0}
          </div>
        </div>

      </div>

      {/* Main Tug Arena Playing Field */}
      <div className="relative z-10 my-4 sm:my-6 h-36 sm:h-44 rounded-xl bg-slate-900/80 border border-slate-800/80 overflow-hidden flex flex-col justify-end">
        
        {/* Field Markings */}
        <div className="absolute inset-0 flex">
          {/* Blue Zone */}
          <div className="flex-1 bg-gradient-to-r from-blue-950/40 via-blue-900/10 to-transparent border-r border-dashed border-blue-500/20 relative">
            <span className="absolute top-2 left-4 text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">Blue Goal</span>
            {/* Win Line */}
            <div className="absolute top-0 bottom-0 left-[15%] w-1 bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.6)] flex flex-col items-center">
              <Flag className="w-3.5 h-3.5 text-blue-300 mt-1 fill-blue-500" />
            </div>
          </div>

          {/* Center Mud Pit / Neutral Zone */}
          <div className="w-16 sm:w-24 bg-amber-950/20 border-x border-dashed border-amber-500/30 relative flex items-center justify-center">
            <div className="h-full w-0.5 bg-amber-500/40"></div>
            <div className="absolute top-1 text-[9px] font-extrabold text-amber-400/70 tracking-widest">CENTER</div>
          </div>

          {/* Red Zone */}
          <div className="flex-1 bg-gradient-to-l from-red-950/40 via-red-900/10 to-transparent border-l border-dashed border-red-500/20 relative">
            <span className="absolute top-2 right-4 text-[10px] font-bold text-red-400/60 uppercase tracking-widest">Red Goal</span>
            {/* Win Line */}
            <div className="absolute top-0 bottom-0 right-[15%] w-1 bg-gradient-to-b from-red-500 to-orange-400 shadow-[0_0_12px_rgba(239,68,68,0.6)] flex flex-col items-center">
              <Flag className="w-3.5 h-3.5 text-red-300 mt-1 fill-red-500" />
            </div>
          </div>
        </div>

        {/* Visual Tug Pullers & Animated Rope */}
        <div className="relative w-full h-24 mb-3 flex items-center">
          
          {/* Blue Puller Mascot (Left) */}
          <motion.div 
            className="absolute left-3 sm:left-8 z-20 flex items-center select-none"
            animate={{ 
              x: lastPuller === 'blue' ? [-4, 6, 0] : 0,
              rotate: clampedPos < 0 ? -4 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative flex flex-col items-center">
              {/* Muscle mascot character */}
              <div className="w-14 h-16 sm:w-16 sm:h-20 bg-blue-600 rounded-2xl border-2 border-blue-400 p-1 flex flex-col items-center justify-between shadow-xl shadow-blue-500/30">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-200 border border-blue-900 flex items-center justify-center text-xs font-black text-blue-950">
                  💪
                </div>
                <div className="text-[10px] sm:text-xs font-black text-white tracking-wider uppercase">P1</div>
                <div className="w-full bg-blue-800/80 rounded py-0.5 text-center text-[9px] font-bold text-blue-200">BLUE</div>
              </div>
              {/* Tug shadow */}
              <div className="w-12 h-2 rounded-full bg-black/40 mt-1"></div>
            </div>
          </motion.div>

          {/* The Rope */}
          <div className="relative w-full h-4 mx-8 sm:mx-16 flex items-center z-10">
            {/* Rope Texture & Fiber */}
            <div className="w-full h-3 sm:h-3.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 border-y border-amber-900 shadow-inner flex items-center justify-around overflow-hidden">
              {/* Rope twists pattern */}
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-1.5 h-full bg-amber-800/40 -skew-x-12"></div>
              ))}
            </div>

            {/* The Center Red/Gold Ribbon Knot (Moves dynamically with pull score) */}
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none"
              animate={{ left: `${normalizedPct}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="relative -ml-3.5 flex flex-col items-center">
                {/* Knot Ribbon */}
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-red-600 via-rose-500 to-amber-400 border-2 border-white shadow-[0_0_15px_rgba(239,68,68,0.8)] flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Ribbon tails */}
                <div className="flex gap-1 -mt-0.5">
                  <div className="w-1.5 h-4 bg-red-600 rounded-b -rotate-12 shadow"></div>
                  <div className="w-1.5 h-4 bg-amber-500 rounded-b rotate-12 shadow"></div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Red Puller Mascot (Right) */}
          <motion.div 
            className="absolute right-3 sm:right-8 z-20 flex items-center select-none"
            animate={{ 
              x: lastPuller === 'red' ? [4, -6, 0] : 0,
              rotate: clampedPos > 0 ? 4 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative flex flex-col items-center">
              {/* Muscle mascot character */}
              <div className="w-14 h-16 sm:w-16 sm:h-20 bg-red-600 rounded-2xl border-2 border-red-400 p-1 flex flex-col items-center justify-between shadow-xl shadow-red-500/30">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-200 border border-red-900 flex items-center justify-center text-xs font-black text-red-950">
                  🔥
                </div>
                <div className="text-[10px] sm:text-xs font-black text-white tracking-wider uppercase">P2</div>
                <div className="w-full bg-red-800/80 rounded py-0.5 text-center text-[9px] font-bold text-red-200">RED</div>
              </div>
              {/* Tug shadow */}
              <div className="w-12 h-2 rounded-full bg-black/40 mt-1"></div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Tug Progress Notches */}
        <div className="w-full bg-slate-950/90 py-1.5 px-4 flex items-center justify-between text-[10px] font-bold border-t border-slate-800">
          <div className="flex items-center gap-1 text-blue-400">
            <span>◄ BLUE PULLING</span>
            <span>({Math.max(0, -clampedPos)}/{maxPulls})</span>
          </div>

          {/* Notch indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxPulls * 2 + 1 }).map((_, idx) => {
              const val = idx - maxPulls;
              const isCurrent = val === clampedPos;
              const isZero = val === 0;
              return (
                <div 
                  key={idx}
                  className={`transition-all rounded-full ${
                    isCurrent 
                      ? 'w-3 h-3 bg-amber-400 ring-2 ring-amber-400/50' 
                      : isZero 
                        ? 'w-2 h-2 bg-slate-400' 
                        : val < 0 
                          ? (val >= clampedPos ? 'w-1.5 h-1.5 bg-blue-500' : 'w-1 h-1 bg-slate-700')
                          : (val <= clampedPos ? 'w-1.5 h-1.5 bg-red-500' : 'w-1 h-1 bg-slate-700')
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-1 text-red-400">
            <span>({Math.max(0, clampedPos)}/{maxPulls})</span>
            <span>RED PULLING ►</span>
          </div>
        </div>

      </div>

    </div>
  );
};
