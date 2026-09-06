import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, RotateCcw, Award, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ArrowPiece {
  id: string;
  r: number;
  c: number;
  dir: Direction;
  cleared: boolean;
}

interface LevelDef {
  id: number;
  name: string;
  rows: number;
  cols: number;
  arrows: { r: number; c: number; dir: Direction }[];
}

const PUZZLE_LEVELS: LevelDef[] = [
  {
    id: 1,
    name: 'Level 1: The First Flight',
    rows: 3,
    cols: 3,
    arrows: [
      { r: 0, c: 1, dir: 'up' },     // Can exit immediately
      { r: 1, c: 1, dir: 'up' },     // Blocked by (0,1) until cleared
      { r: 2, c: 1, dir: 'up' },     // Blocked by (1,1)
      { r: 1, c: 2, dir: 'right' },  // Can exit immediately
    ],
  },
  {
    id: 2,
    name: 'Level 2: Cross Traffic',
    rows: 4,
    cols: 4,
    arrows: [
      { r: 0, c: 0, dir: 'right' }, // Blocked by (0,3)
      { r: 0, c: 3, dir: 'up' },    // Can exit immediately
      { r: 1, c: 1, dir: 'down' },  // Blocked by (3,1)
      { r: 3, c: 1, dir: 'down' },  // Can exit
      { r: 2, c: 3, dir: 'right' }, // Can exit
    ],
  },
  {
    id: 3,
    name: 'Level 3: The Interlock',
    rows: 4,
    cols: 4,
    arrows: [
      { r: 1, c: 1, dir: 'right' }, // blocked by (1,2)
      { r: 1, c: 2, dir: 'down' },  // blocked by (2,2)
      { r: 2, c: 2, dir: 'left' },  // blocked by (2,1)
      { r: 2, c: 1, dir: 'up' },    // blocked by (1,1)
      { r: 0, c: 2, dir: 'up' },    // Can exit immediately!
      { r: 2, c: 3, dir: 'right' }, // Can exit immediately!
    ],
  },
  {
    id: 4,
    name: 'Level 4: Matrix Maze',
    rows: 5,
    cols: 5,
    arrows: [
      { r: 0, c: 2, dir: 'up' },
      { r: 1, c: 2, dir: 'up' },
      { r: 2, c: 2, dir: 'right' },
      { r: 2, c: 3, dir: 'down' },
      { r: 4, c: 3, dir: 'down' },
      { r: 3, c: 1, dir: 'left' },
      { r: 3, c: 0, dir: 'left' },
    ],
  },
  {
    id: 5,
    name: 'Level 5: Grand Master Arrows',
    rows: 5,
    cols: 5,
    arrows: [
      { r: 1, c: 1, dir: 'up' },
      { r: 2, c: 1, dir: 'up' },
      { r: 3, c: 1, dir: 'left' },
      { r: 1, c: 3, dir: 'right' },
      { r: 2, c: 3, dir: 'down' },
      { r: 3, c: 3, dir: 'down' },
      { r: 0, c: 1, dir: 'up' },
      { r: 4, c: 3, dir: 'down' },
    ],
  },
];

export const ArrowPuzzleGame: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [pieces, setPieces] = useState<ArrowPiece[]>([]);
  const [blockedId, setBlockedId] = useState<string | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [isLevelCleared, setIsLevelCleared] = useState<boolean>(false);

  const level = PUZZLE_LEVELS[currentLevelIdx];

  // Initialize level
  const initLevel = (idx: number) => {
    const l = PUZZLE_LEVELS[idx];
    const newPieces: ArrowPiece[] = l.arrows.map((a, i) => ({
      id: `p-${i}-${a.r}-${a.c}`,
      r: a.r,
      c: a.c,
      dir: a.dir,
      cleared: false,
    }));
    setPieces(newPieces);
    setBlockedId(null);
    setMoves(0);
    setIsLevelCleared(false);
  };

  useEffect(() => {
    initLevel(currentLevelIdx);
  }, [currentLevelIdx]);

  // Check if an arrow has a clear flight path out of the grid
  const isPathClear = (arrow: ArrowPiece): boolean => {
    const { r, c, dir } = arrow;
    let dr = 0, dc = 0;
    if (dir === 'up') dr = -1;
    if (dir === 'down') dr = 1;
    if (dir === 'left') dc = -1;
    if (dir === 'right') dc = 1;

    let checkR = r + dr;
    let checkC = c + dc;

    while (checkR >= 0 && checkR < level.rows && checkC >= 0 && checkC < level.cols) {
      // Is there another un-cleared piece at this grid coordinate?
      const obstacle = pieces.find(p => !p.cleared && p.r === checkR && p.c === checkC);
      if (obstacle) {
        return false;
      }
      checkR += dr;
      checkC += dc;
    }

    return true;
  };

  // Handle arrow click
  const handlePieceClick = (piece: ArrowPiece) => {
    if (piece.cleared || isLevelCleared) return;

    soundManager.playClick();
    setMoves(prev => prev + 1);

    if (isPathClear(piece)) {
      soundManager.playTug();
      // Clear this arrow!
      const updated = pieces.map(p => p.id === piece.id ? { ...p, cleared: true } : p);
      setPieces(updated);

      // Check if all pieces cleared
      const remaining = updated.filter(p => !p.cleared);
      if (remaining.length === 0) {
        soundManager.playVictory();
        setIsLevelCleared(true);
      }
    } else {
      // Blocked! Shake and sound wrong
      soundManager.playWrong();
      setBlockedId(piece.id);
      setTimeout(() => setBlockedId(null), 600);
    }
  };

  const getArrowSymbol = (dir: Direction) => {
    switch (dir) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'left': return '←';
      case 'right': return '→';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6" id="arrow-puzzle-container">
      
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">MathTug Arrow Puzzle</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tap arrows whose paths are clear to guide them out of the maze without collisions!
          </p>
        </div>

        {/* Level Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Level:</span>
          {PUZZLE_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => { soundManager.playClick(); setCurrentLevelIdx(idx); }}
              className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${
                currentLevelIdx === idx
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {lvl.id}
            </button>
          ))}

          <button
            onClick={() => { soundManager.playClick(); initLevel(currentLevelIdx); }}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 ml-2"
            title="Reset Puzzle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Board Arena */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-10 flex flex-col items-center justify-center relative shadow-2xl">
        
        {/* Level Info & Moves */}
        <div className="w-full flex items-center justify-between mb-6 max-w-md text-xs font-bold text-slate-400">
          <span className="text-amber-400 font-extrabold">{level.name}</span>
          <span>Moves: <strong className="text-white font-black">{moves}</strong></span>
          <span>Remaining: <strong className="text-emerald-400 font-black">{pieces.filter(p => !p.cleared).length}</strong></span>
        </div>

        {/* The Puzzle Grid */}
        <div 
          className="relative bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 shadow-inner grid gap-2 sm:gap-3"
          style={{
            gridTemplateRows: `repeat(${level.rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: level.rows }).map((_, r) =>
            Array.from({ length: level.cols }).map((_, c) => {
              const piece = pieces.find(p => p.r === r && p.c === c);
              const isBlocked = piece && blockedId === piece.id;

              return (
                <div
                  key={`${r}-${c}`}
                  className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-center relative"
                >
                  {piece && !piece.cleared && (
                    <motion.button
                      onClick={() => handlePieceClick(piece)}
                      animate={isBlocked ? { x: [-4, 4, -4, 4, 0] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`w-full h-full rounded-xl flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg transition-all ${
                        isBlocked
                          ? 'bg-red-600 text-white shadow-red-500/50'
                          : 'bg-gradient-to-tr from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 shadow-amber-500/20 active:scale-90 cursor-pointer'
                      }`}
                    >
                      <span>{getArrowSymbol(piece.dir)}</span>
                    </motion.button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Puzzle Guide */}
        <p className="text-xs text-slate-500 mt-6 text-center max-w-sm">
          💡 If an arrow's flight path has another arrow blocking it before the border edge, it cannot exit yet. Clear blocking arrows first!
        </p>

        {/* Level Complete Modal */}
        <AnimatePresence>
          {isLevelCleared && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center z-30"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Puzzle Cleared!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Completed in <strong className="text-amber-400">{moves} moves</strong>.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => initLevel(currentLevelIdx)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold"
                >
                  Replay Level
                </button>

                {currentLevelIdx < PUZZLE_LEVELS.length - 1 ? (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentLevelIdx(prev => prev + 1);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 shadow-md shadow-amber-400/20"
                  >
                    <span>NEXT LEVEL</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    All Levels Mastered! 🎉
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
};
