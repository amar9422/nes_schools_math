import React, { useState } from 'react';
import { School, Swords, Trophy, Play, Users, CheckCircle2, Monitor } from 'lucide-react';
import { DifficultyTier } from '../types';
import { soundManager } from '../utils/audio';

interface ClassroomTournamentProps {
  onStartClassroomMatch: (blueName: string, redName: string, tier: DifficultyTier) => void;
}

export const ClassroomTournament: React.FC<ClassroomTournamentProps> = ({
  onStartClassroomMatch,
}) => {
  const [blueName, setBlueName] = useState('Blue Sharks');
  const [redName, setRedName] = useState('Red Eagles');
  const [tier, setTier] = useState<DifficultyTier>('middle');
  const [seriesLength, setSeriesLength] = useState<number>(3); // Best of 3

  const handleLaunch = () => {
    soundManager.playWhistle();
    onStartClassroomMatch(blueName, redName, tier);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6" id="classroom-tournament-container">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-red-950 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-2">
            <School className="w-4 h-4" />
            <span>Classroom Smartboard & Projector Setup</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
            Math Tug-of-War Tournament
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-2">
            Turn daily math practice into an energetic classroom championship. Project this screen to engage the entire room in collaborative mental math relays!
          </p>
        </div>
      </div>

      {/* Setup Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Left: Team Names & Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Customize Classroom Teams</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-1.5">
                Team 1 (Blue Side):
              </label>
              <input
                type="text"
                value={blueName}
                onChange={(e) => setBlueName(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/40 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-blue-400"
                placeholder="e.g. Blue Sharks"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-1.5">
                Team 2 (Red Side):
              </label>
              <input
                type="text"
                value={redName}
                onChange={(e) => setRedName(e.target.value)}
                className="w-full bg-slate-950 border border-red-500/40 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-red-400"
                placeholder="e.g. Red Eagles"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Grade Level:
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as DifficultyTier)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="nursery">Nursery (Counting, Ages 4-5)</option>
                <option value="primary">Grade 1-2 (Addition & Subtraction)</option>
                <option value="middle">Grade 3-5 (Multiplication & Division)</option>
                <option value="high">Grade 6-8 (Pre-Algebra & Integers)</option>
                <option value="gamer">Gamer Speed (Rapid Mental Math)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Tournament Series:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSeriesLength(3)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    seriesLength === 3
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  Best of 3 Rounds
                </button>
                <button
                  type="button"
                  onClick={() => setSeriesLength(5)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    seriesLength === 5
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  Best of 5 Rounds
                </button>
              </div>
            </div>

            <button
              onClick={handleLaunch}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all active:scale-95"
            >
              <Swords className="w-5 h-5" />
              <span>LAUNCH CLASSROOM MATCH NOW</span>
            </button>
          </div>
        </div>

        {/* Right: Teacher Playbook & Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-400" />
              <span>Classroom Relay Rules</span>
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Divide the Class</strong> into two equal teams. Align them in two single-file queues facing the smartboard or keyboard.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>One Runner at a Time</strong>: The student at the front of each line approaches to solve the active equation, then tags the next classmate!
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Penalty Awareness</strong>: A wrong guess freezes the team for 1.5 seconds. Emphasize team double-checking to prevent reckless spamming!
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Big Screen View</strong>: Click the fullscreen icon in the top header to maximize visibility for the whole room.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 font-medium">
            💡 <strong>Teacher Tip:</strong> To avoid student anxiety, pair students in "Tug Duos" where two classmates whisper and solve together before pressing the answer.
          </div>
        </div>

      </div>

    </div>
  );
};
