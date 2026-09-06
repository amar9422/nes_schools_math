import React from 'react';
import { BookOpen, ShieldCheck, Check, Sparkles, HelpCircle, Layers } from 'lucide-react';

export const TeacherResources: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6" id="teacher-resources-container">
      
      {/* Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-8 shadow-2xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Curriculum & Teacher Playbook</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit']">
          MathTug Curriculum Standards & Rules
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-3xl">
          MathTug turns high-pressure drills into collaborative, joyful tug-of-war tournaments. Here is how our math mechanics align with international grade standards.
        </p>
      </div>

      {/* Grade Level Matrix */}
      <div className="mb-10">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>Curriculum Coverage by Grade Tier</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Nursery */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold mb-3">
              🐣
            </div>
            <h3 className="text-base font-black text-white">Nursery & Pre-K</h3>
            <p className="text-xs font-semibold text-amber-400 mt-0.5">Ages 4–5</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>One-to-one correspondence counting</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Object recognition with vibrant icons</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Early number matching 1 to 9</span>
              </li>
            </ul>
          </div>

          {/* Primary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center font-bold mb-3">
              🎒
            </div>
            <h3 className="text-base font-black text-white">Grade 1 – 2 (Primary)</h3>
            <p className="text-xs font-semibold text-blue-400 mt-0.5">Ages 6–8</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Addition and subtraction within 20</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Fact families & number bonds</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Tens and ones mental computation</span>
              </li>
            </ul>
          </div>

          {/* Middle */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center font-bold mb-3">
              📐
            </div>
            <h3 className="text-base font-black text-white">Grade 3 – 5 (Middle)</h3>
            <p className="text-xs font-semibold text-purple-400 mt-0.5">Ages 9–12</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Times tables from 1 to 12</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Division facts and remainders</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Basic order of operations: (a × b) + c</span>
              </li>
            </ul>
          </div>

          {/* High School */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-red-400/10 text-red-400 flex items-center justify-center font-bold mb-3">
              🔬
            </div>
            <h3 className="text-base font-black text-white">Grade 6 – 8 (High School)</h3>
            <p className="text-xs font-semibold text-red-400 mt-0.5">Ages 13–16</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Single-variable linear equations: ax + b = c</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Negative integer addition & subtraction</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Perfect squares & square roots</span>
              </li>
            </ul>
          </div>

          {/* Gamer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg md:col-span-2 lg:col-span-2">
            <div className="w-9 h-9 rounded-xl bg-orange-400/10 text-orange-400 flex items-center justify-center font-bold mb-3">
              ⚡
            </div>
            <h3 className="text-base font-black text-white">Gamer Speed Tier</h3>
            <p className="text-xs font-semibold text-orange-400 mt-0.5">All Ages • High Velocity Recall</p>
            <p className="text-xs text-slate-300 mt-2">
              Designed for speed champions and classroom bell-ringer warmups. Rapid mental addition, two-digit subtraction, and multi-step multiplication challenge students to calculate under split-second pressure.
            </p>
          </div>

        </div>
      </div>

      {/* The 1.5 Second Penalty Rule */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-black text-white">Why the 1.5-Second Penalty Rule Works</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Many math games suffer from students wildly clicking buttons without reading the numbers. MathTug enforces a strict <strong>1.5-second lockout penalty</strong> on wrong choices. This ensures deliberate calculation, accurate mental estimation, and team cooperation.
          </p>
        </div>
      </div>

      {/* Classroom FAQs */}
      <div>
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm font-bold text-white">Does MathTug require user accounts or student emails?</h4>
            <p className="text-xs text-slate-400 mt-1">
              No. MathTug is 100% free and requires zero login, sign-up, or tracking. Teachers can launch any game on a classroom projector in seconds.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm font-bold text-white">How do two students play on one keyboard?</h4>
            <p className="text-xs text-slate-400 mt-1">
              Player 1 on the left side uses number keys <code className="text-blue-400">1, 2, 3, 4</code> or <code className="text-blue-400">W, A, S, D</code>. Player 2 on the right side uses the <code className="text-red-400">Arrow keys</code> or <code className="text-red-400">Numpad</code>.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm font-bold text-white">Can students play against an automated computer?</h4>
            <p className="text-xs text-slate-400 mt-1">
              Yes! In "Solo vs AI Bot" mode, students can practice independently at 4 difficulty levels: Easy, Medium, Hard, and Beast mode.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
