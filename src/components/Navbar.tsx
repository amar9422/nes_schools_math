import React, { useState } from 'react';
import { Swords, Compass, Scale, School, BookOpen, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { GameId, DifficultyTier } from '../types';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  activeGame: GameId;
  onSelectGame: (game: GameId) => void;
  selectedTier: DifficultyTier;
  onSelectTier: (tier: DifficultyTier) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeGame,
  onSelectGame,
  selectedTier,
  onSelectTier,
}) => {
  const [muted, setMuted] = useState(soundManager.isMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    setMuted(nextMuted);
    if (!nextMuted) {
      soundManager.playClick();
    }
  };

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => {
              soundManager.playClick();
              onSelectGame('tug-of-war');
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="mathtug-brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Swords className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">Math<span className="text-amber-400">Tug</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">Classroom</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium -mt-1 hidden sm:block">Interactive Multiplayer Math</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" id="nav-game-links">
            <button
              id="nav-tab-tug-of-war"
              onClick={() => {
                soundManager.playClick();
                onSelectGame('tug-of-war');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeGame === 'tug-of-war'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Math Tug of War</span>
            </button>

            <button
              id="nav-tab-arrow-puzzle"
              onClick={() => {
                soundManager.playClick();
                onSelectGame('arrow-puzzle');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeGame === 'arrow-puzzle'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Arrow Puzzle</span>
            </button>

            <button
              id="nav-tab-balance-scale"
              onClick={() => {
                soundManager.playClick();
                onSelectGame('balance-scale');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeGame === 'balance-scale'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Balance Scale</span>
            </button>

            <button
              id="nav-tab-classroom-mode"
              onClick={() => {
                soundManager.playClick();
                onSelectGame('classroom-mode');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeGame === 'classroom-mode'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Classroom Projector</span>
            </button>

            <button
              id="nav-tab-curriculum"
              onClick={() => {
                soundManager.playClick();
                onSelectGame('curriculum');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeGame === 'curriculum'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Curriculum & Rules</span>
            </button>
          </nav>

          {/* Right Action Tools: Sound, Fullscreen, Language */}
          <div className="flex items-center gap-2" id="nav-action-buttons">
            <button
              id="btn-sound-toggle"
              onClick={toggleSound}
              title={muted ? 'Unmute Game Sounds' : 'Mute Game Sounds'}
              className={`p-2.5 rounded-lg border transition-all ${
                muted 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              id="btn-fullscreen-toggle"
              onClick={toggleFullscreen}
              title="Fullscreen Projector Mode"
              className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all hidden sm:flex items-center justify-center"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-amber-400" />}
            </button>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% Free • No Sign-up</span>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              id="btn-mobile-nav-toggle"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 flex flex-col gap-1.5">
            <button
              onClick={() => { onSelectGame('tug-of-war'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-md font-medium text-sm ${activeGame === 'tug-of-war' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              ⚔️ Math Tug of War
            </button>
            <button
              onClick={() => { onSelectGame('arrow-puzzle'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-md font-medium text-sm ${activeGame === 'arrow-puzzle' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              🧭 Arrow Puzzle
            </button>
            <button
              onClick={() => { onSelectGame('balance-scale'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-md font-medium text-sm ${activeGame === 'balance-scale' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              ⚖️ Balance Scale
            </button>
            <button
              onClick={() => { onSelectGame('classroom-mode'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-md font-medium text-sm ${activeGame === 'classroom-mode' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              🏫 Classroom Projector
            </button>
            <button
              onClick={() => { onSelectGame('curriculum'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-md font-medium text-sm ${activeGame === 'curriculum' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              📖 Curriculum & Rules
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
