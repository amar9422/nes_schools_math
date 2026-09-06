/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MathTugGame } from './components/MathTugGame';
import { ArrowPuzzleGame } from './components/ArrowPuzzleGame';
import { BalanceScaleGame } from './components/BalanceScaleGame';
import { ClassroomTournament } from './components/ClassroomTournament';
import { TeacherResources } from './components/TeacherResources';
import { Footer } from './components/Footer';
import { GameId, DifficultyTier, TugMode } from './types';
import { Swords, Compass, Scale, School, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundManager } from './utils/audio';

export default function App() {
  const [activeGame, setActiveGame] = useState<GameId>('tug-of-war');
  const [selectedTier, setSelectedTier] = useState<DifficultyTier>('primary');
  const [customBlueName, setCustomBlueName] = useState<string>('Player 1 (Blue)');
  const [customRedName, setCustomRedName] = useState<string>('Player 2 (Red)');
  const [activeMode, setActiveMode] = useState<TugMode>('vs-ai');

  const handleStartClassroomMatch = (blue: string, red: string, tier: DifficultyTier) => {
    setCustomBlueName(blue);
    setCustomRedName(red);
    setSelectedTier(tier);
    setActiveMode('classroom');
    setActiveGame('tug-of-war');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Outfit'] selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar
        activeGame={activeGame}
        onSelectGame={(game) => setActiveGame(game)}
        selectedTier={selectedTier}
        onSelectTier={(tier) => setSelectedTier(tier)}
      />

      {/* Main App Body */}
      <main className="flex-1">
        
        {/* Render Active View */}
        {activeGame === 'tug-of-war' && (
          <div>
            {/* Quick Hero Banner */}
            <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 pt-6 pb-4 px-4">
              <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Math Tug of War Arena</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Math <span className="text-amber-400">Tug of War</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mt-1.5 font-medium">
                  Two sides compete by calculating fast! Correct answers pull the virtual rope towards your side.
                </p>
              </div>
            </section>

            {/* The Tug of War Arena Game */}
            <MathTugGame
              initialTier={selectedTier}
              initialMode={activeMode}
            />

            {/* Featured Games Showcase Strip */}
            <section className="max-w-7xl mx-auto px-4 py-8 mt-6">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-white">More Interactive Math Games</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Explore brain puzzles and logic challenges</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Arrow Puzzle Card */}
                <div 
                  onClick={() => { soundManager.playClick(); setActiveGame('arrow-puzzle'); }}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-white">Arrow Puzzle</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Directional maze challenge. Plan flight paths to guide all arrows off the board without collisions!
                  </p>
                  <span className="text-xs font-bold text-amber-400 mt-3 inline-block">Play Arrow Puzzle →</span>
                </div>

                {/* Balance Scale Card */}
                <div 
                  onClick={() => { soundManager.playClick(); setActiveGame('balance-scale'); }}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-white">Balance Scale</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Visual algebraic equality. Find the unknown weights to bring the tilting balance scale to equilibrium!
                  </p>
                  <span className="text-xs font-bold text-blue-400 mt-3 inline-block">Play Balance Scale →</span>
                </div>

                {/* Classroom Projector Card */}
                <div 
                  onClick={() => { soundManager.playClick(); setActiveGame('classroom-mode'); }}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <School className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-white">Classroom Tournament</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Setup custom team names, best-of series rules, and relay race guides for your classroom smartboard.
                  </p>
                  <span className="text-xs font-bold text-red-400 mt-3 inline-block">Setup Classroom Match →</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeGame === 'arrow-puzzle' && (
          <ArrowPuzzleGame />
        )}

        {activeGame === 'balance-scale' && (
          <BalanceScaleGame />
        )}

        {activeGame === 'classroom-mode' && (
          <ClassroomTournament
            onStartClassroomMatch={handleStartClassroomMatch}
          />
        )}

        {activeGame === 'curriculum' && (
          <TeacherResources />
        )}

      </main>

      {/* Footer */}
      <Footer onSelectGame={(game) => setActiveGame(game)} />

    </div>
  );
}
