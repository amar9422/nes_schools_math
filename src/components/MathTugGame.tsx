import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, RotateCcw, Play, Pause, Bot, Users, User, Flame, 
  Sparkles, AlertCircle, Clock, CheckCircle2, ChevronRight, Keyboard
} from 'lucide-react';
import { TugArenaVisual } from './TugArenaVisual';
import { DifficultyTier, TugMode, AIDifficulty, MathQuestion, MatchResult } from '../types';
import { generateQuestion } from '../utils/mathGenerator';
import { soundManager } from '../utils/audio';

interface MathTugGameProps {
  initialTier?: DifficultyTier;
  initialMode?: TugMode;
}

export const MathTugGame: React.FC<MathTugGameProps> = ({
  initialTier = 'primary',
  initialMode = 'vs-ai',
}) => {
  // Game Setup State
  const [tier, setTier] = useState<DifficultyTier>(initialTier);
  const [mode, setMode] = useState<TugMode>(initialMode);
  const [aiDiff, setAiDiff] = useState<AIDifficulty>('medium');
  const [targetPulls, setTargetPulls] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Match State
  const [ropePosition, setRopePosition] = useState<number>(0); // -targetPulls = Blue wins, +targetPulls = Red wins
  const [lastPuller, setLastPuller] = useState<'blue' | 'red' | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  // Player 1 (Blue) State
  const [blueQuestion, setBlueQuestion] = useState<MathQuestion>(() => generateQuestion(tier));
  const [bluePenaltyUntil, setBluePenaltyUntil] = useState<number>(0);
  const [blueStats, setBlueStats] = useState({ correct: 0, attempts: 0, streak: 0, maxStreak: 0 });
  const [blueFeedback, setBlueFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Player 2 / AI (Red) State
  const [redQuestion, setRedQuestion] = useState<MathQuestion>(() => generateQuestion(tier));
  const [redPenaltyUntil, setRedPenaltyUntil] = useState<number>(0);
  const [redStats, setRedStats] = useState({ correct: 0, attempts: 0, streak: 0, maxStreak: 0 });
  const [redFeedback, setRedFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Penalty timers remaining in milliseconds for UI countdown
  const [bluePenaltyMs, setBluePenaltyMs] = useState<number>(0);
  const [redPenaltyMs, setRedPenaltyMs] = useState<number>(0);

  // Sound ref
  const soundWhistleRef = useRef<boolean>(false);

  // Reset/Start Match
  const startMatch = useCallback(() => {
    soundManager.playWhistle();
    setRopePosition(0);
    setLastPuller(null);
    setMatchResult(null);
    setBluePenaltyUntil(0);
    setRedPenaltyUntil(0);
    setBlueStats({ correct: 0, attempts: 0, streak: 0, maxStreak: 0 });
    setRedStats({ correct: 0, attempts: 0, streak: 0, maxStreak: 0 });
    setBlueFeedback(null);
    setRedFeedback(null);
    setBlueQuestion(generateQuestion(tier));
    setRedQuestion(generateQuestion(tier));
    setStartTime(Date.now());
    setIsPlaying(true);
    setIsPaused(false);
  }, [tier]);

  // Handle Win
  const handleVictory = useCallback((winner: 'blue' | 'red') => {
    setIsPlaying(false);
    soundManager.playVictory();

    // Trigger confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: winner === 'blue' ? ['#3b82f6', '#60a5fa', '#93c5fd'] : ['#ef4444', '#f87171', '#fca5a5'],
      });
    } catch {
      // ignore if canvas-confetti is not loaded
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    const blueAcc = blueStats.attempts > 0 ? Math.round((blueStats.correct / blueStats.attempts) * 100) : 0;
    const redAcc = redStats.attempts > 0 ? Math.round((redStats.correct / redStats.attempts) * 100) : 0;

    setMatchResult({
      winner,
      bluePulls: Math.max(0, -ropePosition),
      redPulls: Math.max(0, ropePosition),
      blueAccuracy: blueAcc,
      redAccuracy: redAcc,
      durationSeconds: Math.max(1, duration),
      tier,
      mode,
    });
  }, [startTime, blueStats, redStats, ropePosition, tier, mode]);

  // Player 1 (Blue) Answer Submission
  const handleBlueAnswer = useCallback((chosen: number) => {
    if (!isPlaying || isPaused || Date.now() < bluePenaltyUntil) return;

    const isCorrect = chosen === blueQuestion.correctAnswer;
    const now = Date.now();

    setBlueStats(prev => {
      const attempts = prev.attempts + 1;
      const correct = prev.correct + (isCorrect ? 1 : 0);
      const streak = isCorrect ? prev.streak + 1 : 0;
      const maxStreak = Math.max(prev.maxStreak, streak);
      return { attempts, correct, streak, maxStreak };
    });

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playTug();
      setBlueFeedback('correct');
      setTimeout(() => setBlueFeedback(null), 500);

      const nextPos = ropePosition - 1;
      setRopePosition(nextPos);
      setLastPuller('blue');

      if (nextPos <= -targetPulls) {
        handleVictory('blue');
        return;
      }

      setBlueQuestion(generateQuestion(tier));
    } else {
      soundManager.playWrong();
      setBlueFeedback('wrong');
      setTimeout(() => setBlueFeedback(null), 800);
      // 1.5s penalty
      setBluePenaltyUntil(now + 1500);
    }
  }, [isPlaying, isPaused, bluePenaltyUntil, blueQuestion, ropePosition, targetPulls, tier, handleVictory]);

  // Player 2 / Red Answer Submission
  const handleRedAnswer = useCallback((chosen: number) => {
    if (!isPlaying || isPaused || Date.now() < redPenaltyUntil) return;

    const isCorrect = chosen === redQuestion.correctAnswer;
    const now = Date.now();

    setRedStats(prev => {
      const attempts = prev.attempts + 1;
      const correct = prev.correct + (isCorrect ? 1 : 0);
      const streak = isCorrect ? prev.streak + 1 : 0;
      const maxStreak = Math.max(prev.maxStreak, streak);
      return { attempts, correct, streak, maxStreak };
    });

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playTug();
      setRedFeedback('correct');
      setTimeout(() => setRedFeedback(null), 500);

      const nextPos = ropePosition + 1;
      setRopePosition(nextPos);
      setLastPuller('red');

      if (nextPos >= targetPulls) {
        handleVictory('red');
        return;
      }

      setRedQuestion(generateQuestion(tier));
    } else {
      soundManager.playWrong();
      setRedFeedback('wrong');
      setTimeout(() => setRedFeedback(null), 800);
      // 1.5s penalty
      setRedPenaltyUntil(now + 1500);
    }
  }, [isPlaying, isPaused, redPenaltyUntil, redQuestion, ropePosition, targetPulls, tier, handleVictory]);

  // AI Opponent Loop for Solo vs AI Mode
  useEffect(() => {
    if (!isPlaying || isPaused || mode !== 'vs-ai' || matchResult) return;

    // AI speed & accuracy based on difficulty
    const aiConfigs: Record<AIDifficulty, { minDelay: number; maxDelay: number; accuracy: number }> = {
      easy: { minDelay: 2800, maxDelay: 4200, accuracy: 0.70 },
      medium: { minDelay: 1800, maxDelay: 3000, accuracy: 0.85 },
      hard: { minDelay: 1200, maxDelay: 2100, accuracy: 0.94 },
      beast: { minDelay: 700, maxDelay: 1300, accuracy: 0.99 },
    };

    const config = aiConfigs[aiDiff];
    const delay = Math.random() * (config.maxDelay - config.minDelay) + config.minDelay;

    const timer = setTimeout(() => {
      if (!isPlaying || isPaused || Date.now() < redPenaltyUntil) return;

      const roll = Math.random();
      if (roll < config.accuracy) {
        // AI chooses correct answer
        handleRedAnswer(redQuestion.correctAnswer);
      } else {
        // AI makes an error
        const wrongOpts = redQuestion.options.filter(o => o !== redQuestion.correctAnswer);
        const wrong = wrongOpts[Math.floor(Math.random() * wrongOpts.length)] ?? redQuestion.correctAnswer + 1;
        handleRedAnswer(wrong);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, isPaused, mode, redQuestion, redPenaltyUntil, aiDiff, matchResult, handleRedAnswer]);

  // Penalty Countdown Tick
  useEffect(() => {
    if (!isPlaying) {
      setBluePenaltyMs(0);
      setRedPenaltyMs(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setBluePenaltyMs(Math.max(0, bluePenaltyUntil - now));
      setRedPenaltyMs(Math.max(0, redPenaltyUntil - now));
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, bluePenaltyUntil, redPenaltyUntil]);

  // Global Dual Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;

      // Prevent scrolling on arrow keys during play
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      // Player 1 (Blue): Keys 1, 2, 3, 4 OR W, A, S, D
      if (['Digit1', 'KeyW'].includes(e.code) && blueQuestion.options[0] !== undefined) {
        handleBlueAnswer(blueQuestion.options[0]);
      } else if (['Digit2', 'KeyA'].includes(e.code) && blueQuestion.options[1] !== undefined) {
        handleBlueAnswer(blueQuestion.options[1]);
      } else if (['Digit3', 'KeyS'].includes(e.code) && blueQuestion.options[2] !== undefined) {
        handleBlueAnswer(blueQuestion.options[2]);
      } else if (['Digit4', 'KeyD'].includes(e.code) && blueQuestion.options[3] !== undefined) {
        handleBlueAnswer(blueQuestion.options[3]);
      }

      // Player 2 (Red): Only in 1v1 or Classroom mode!
      if (mode !== 'vs-ai') {
        if (['ArrowUp', 'Numpad7', 'Numpad8'].includes(e.code) && redQuestion.options[0] !== undefined) {
          handleRedAnswer(redQuestion.options[0]);
        } else if (['ArrowLeft', 'Numpad4'].includes(e.code) && redQuestion.options[1] !== undefined) {
          handleRedAnswer(redQuestion.options[1]);
        } else if (['ArrowDown', 'Numpad5', 'Numpad2'].includes(e.code) && redQuestion.options[2] !== undefined) {
          handleRedAnswer(redQuestion.options[2]);
        } else if (['ArrowRight', 'Numpad6'].includes(e.code) && redQuestion.options[3] !== undefined) {
          handleRedAnswer(redQuestion.options[3]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, blueQuestion, redQuestion, mode, handleBlueAnswer, handleRedAnswer]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6" id="math-tug-game-container">
      
      {/* Grade Level / Curriculum Selector Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 sm:p-3 mb-4 sm:mb-6 shadow-lg flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-2 hidden sm:inline">Grade Tier:</span>
          
          <button
            onClick={() => { soundManager.playClick(); setTier('nursery'); if (isPlaying) setBlueQuestion(generateQuestion('nursery')); if (isPlaying) setRedQuestion(generateQuestion('nursery')); }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tier === 'nursery' 
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🐣 Nursery</span>
            <span className="text-[10px] opacity-75 font-normal">(Ages 4-5)</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setTier('primary'); if (isPlaying) setBlueQuestion(generateQuestion('primary')); if (isPlaying) setRedQuestion(generateQuestion('primary')); }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tier === 'primary' 
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎒 Grade 1-2</span>
            <span className="text-[10px] opacity-75 font-normal">(Add / Sub)</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setTier('middle'); if (isPlaying) setBlueQuestion(generateQuestion('middle')); if (isPlaying) setRedQuestion(generateQuestion('middle')); }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tier === 'middle' 
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📐 Grade 3-5</span>
            <span className="text-[10px] opacity-75 font-normal">(Mul / Div)</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setTier('high'); if (isPlaying) setBlueQuestion(generateQuestion('high')); if (isPlaying) setRedQuestion(generateQuestion('high')); }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tier === 'high' 
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🔬 Grade 6-8</span>
            <span className="text-[10px] opacity-75 font-normal">(Algebra)</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setTier('gamer'); if (isPlaying) setBlueQuestion(generateQuestion('gamer')); if (isPlaying) setRedQuestion(generateQuestion('gamer')); }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tier === 'gamer' 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-red-500/30' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ Gamer Speed</span>
          </button>
        </div>

        {/* Pull Goal Switcher */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <span className="text-xs text-slate-400 font-semibold hidden lg:inline">Match Length:</span>
          <button
            onClick={() => { soundManager.playClick(); setTargetPulls(5); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              targetPulls === 5 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5 Pulls
          </button>
          <button
            onClick={() => { soundManager.playClick(); setTargetPulls(10); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              targetPulls === 10 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            10 Pulls
          </button>
        </div>
      </div>

      {/* Game Mode Bar & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        
        {/* Modes */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { soundManager.playClick(); setMode('vs-ai'); if (isPlaying) startMatch(); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'vs-ai'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Solo vs AI Bot</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setMode('1v1'); if (isPlaying) startMatch(); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === '1v1'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1v1 Split Screen</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setMode('classroom'); if (isPlaying) startMatch(); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'classroom'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Classroom Teams</span>
          </button>
        </div>

        {/* AI Difficulty (Only if vs AI) */}
        {mode === 'vs-ai' && (
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Bot Speed:</span>
            {(['easy', 'medium', 'hard', 'beast'] as AIDifficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => { soundManager.playClick(); setAiDiff(diff); }}
                className={`px-2 py-0.5 rounded text-xs font-bold capitalize transition-colors ${
                  aiDiff === diff
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        )}

        {/* Match Action: Start / Restart */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={startMatch}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95"
              id="btn-start-tug-match"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>START TUG MATCH</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
                title={isPaused ? 'Resume Match' : 'Pause Match'}
              >
                {isPaused ? <Play className="w-4 h-4 fill-slate-200" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                onClick={startMatch}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Visual Tug of War Arena (The Rope, Mascot Pullers, Notches) */}
      <TugArenaVisual
        ropePosition={ropePosition}
        maxPulls={targetPulls}
        blueTeamName={mode === 'classroom' ? 'Blue Bulldogs' : 'Player 1 (Blue)'}
        redTeamName={mode === 'vs-ai' ? `Robot (${aiDiff.toUpperCase()})` : mode === 'classroom' ? 'Red Rockets' : 'Player 2 (Red)'}
        lastPuller={lastPuller}
      />

      {/* Keyboard Controls Reminder Indicator for Classrooms / 1v1 */}
      {mode !== 'vs-ai' && (
        <div className="mt-3 text-center text-xs text-slate-400 bg-slate-900/50 py-1.5 px-3 rounded-lg border border-slate-800 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-300 font-bold">Player 1:</span>
            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 font-mono">1, 2, 3, 4</span>
            <span className="text-slate-500">or</span>
            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 font-mono">W, A, S, D</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-300 font-bold">Player 2:</span>
            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 font-mono">Arrow Keys ↑ ← ↓ →</span>
          </div>
        </div>
      )}

      {/* Dual Problem & Interaction Consoles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        
        {/* ================= LEFT CONSOLE: PLAYER 1 (BLUE) ================= */}
        <div className={`relative bg-slate-900 rounded-2xl border-2 transition-all p-4 sm:p-6 shadow-xl ${
          blueFeedback === 'correct' 
            ? 'border-emerald-500 bg-emerald-950/20' 
            : blueFeedback === 'wrong' 
              ? 'border-red-500 bg-red-950/20' 
              : 'border-blue-500/40'
        }`}>
          
          {/* Header & Stats */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-extrabold text-blue-400 uppercase tracking-wider">Player 1 • Blue Team</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
              <span>Streak: <strong className="text-amber-400 font-black">{blueStats.streak}</strong> 🔥</span>
              <span>Score: <strong className="text-white font-black">{blueStats.correct}</strong></span>
            </div>
          </div>

          {/* Question Box */}
          <div className="min-h-[110px] flex flex-col items-center justify-center bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-center relative overflow-hidden">
            {/* Visual Counting for Nursery */}
            {blueQuestion.visualEmoji && blueQuestion.visualCount ? (
              <div className="flex flex-col items-center gap-2">
                <div className="text-sm font-bold text-slate-300">{blueQuestion.question}</div>
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xs text-2xl sm:text-3xl">
                  {Array.from({ length: blueQuestion.visualCount }).map((_, i) => (
                    <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                      {blueQuestion.visualEmoji}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Calculate:</span>
                <span className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] tracking-wide">
                  {blueQuestion.question}
                </span>
              </div>
            )}
          </div>

          {/* Multiple Choice Option Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {blueQuestion.options.map((option, idx) => {
              const keyLabel = idx === 0 ? '1' : idx === 1 ? '2' : idx === 2 ? '3' : '4';
              return (
                <button
                  key={idx}
                  onClick={() => handleBlueAnswer(option)}
                  disabled={!isPlaying || isPaused || bluePenaltyMs > 0}
                  className={`relative py-3.5 sm:py-4 px-4 rounded-xl font-black text-xl sm:text-2xl transition-all flex items-center justify-center gap-2 border-2 ${
                    !isPlaying || isPaused || bluePenaltyMs > 0
                      ? 'bg-slate-800/50 border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-b from-blue-900/60 to-blue-950 border-blue-600/50 text-blue-100 hover:border-blue-400 hover:from-blue-800/80 hover:to-blue-900 active:scale-95 shadow-md shadow-blue-950/50'
                  }`}
                  id={`blue-option-${idx}`}
                >
                  <span className="absolute top-1.5 left-2 text-[10px] font-bold text-blue-400/60 font-mono bg-blue-950/80 px-1 rounded">
                    [{keyLabel}]
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Penalty 1.5s Overlay Lockout */}
          <AnimatePresence>
            {bluePenaltyMs > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-red-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-6 z-30 border-2 border-red-500"
              >
                <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center mb-2 animate-bounce">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h4 className="text-xl font-black text-white">Wrong Answer!</h4>
                <p className="text-xs text-red-200 mt-1 font-medium">1.5s Cooldown Penalty</p>
                <div className="mt-3 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 font-mono font-black text-sm">
                  {(bluePenaltyMs / 1000).toFixed(1)}s
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>


        {/* ================= RIGHT CONSOLE: PLAYER 2 / AI (RED) ================= */}
        <div className={`relative bg-slate-900 rounded-2xl border-2 transition-all p-4 sm:p-6 shadow-xl ${
          redFeedback === 'correct' 
            ? 'border-emerald-500 bg-emerald-950/20' 
            : redFeedback === 'wrong' 
              ? 'border-red-500 bg-red-950/20' 
              : 'border-red-500/40'
        }`}>
          
          {/* Header & Stats */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-extrabold text-red-400 uppercase tracking-wider">
                {mode === 'vs-ai' ? `Robot AI (${aiDiff})` : 'Player 2 • Red Team'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
              <span>Streak: <strong className="text-amber-400 font-black">{redStats.streak}</strong> 🔥</span>
              <span>Score: <strong className="text-white font-black">{redStats.correct}</strong></span>
            </div>
          </div>

          {/* Question Box */}
          <div className="min-h-[110px] flex flex-col items-center justify-center bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-center relative overflow-hidden">
            {/* Visual Counting for Nursery */}
            {redQuestion.visualEmoji && redQuestion.visualCount ? (
              <div className="flex flex-col items-center gap-2">
                <div className="text-sm font-bold text-slate-300">{redQuestion.question}</div>
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xs text-2xl sm:text-3xl">
                  {Array.from({ length: redQuestion.visualCount }).map((_, i) => (
                    <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                      {redQuestion.visualEmoji}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Calculate:</span>
                <span className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] tracking-wide">
                  {redQuestion.question}
                </span>
              </div>
            )}
          </div>

          {/* Multiple Choice Option Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {redQuestion.options.map((option, idx) => {
              const keyLabel = idx === 0 ? '↑' : idx === 1 ? '←' : idx === 2 ? '↓' : '→';
              return (
                <button
                  key={idx}
                  onClick={() => handleRedAnswer(option)}
                  disabled={!isPlaying || isPaused || redPenaltyMs > 0 || mode === 'vs-ai'}
                  className={`relative py-3.5 sm:py-4 px-4 rounded-xl font-black text-xl sm:text-2xl transition-all flex items-center justify-center gap-2 border-2 ${
                    !isPlaying || isPaused || redPenaltyMs > 0 || mode === 'vs-ai'
                      ? 'bg-slate-800/50 border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-b from-red-900/60 to-red-950 border-red-600/50 text-red-100 hover:border-red-400 hover:from-red-800/80 hover:to-red-900 active:scale-95 shadow-md shadow-red-950/50'
                  }`}
                  id={`red-option-${idx}`}
                >
                  {mode !== 'vs-ai' && (
                    <span className="absolute top-1.5 right-2 text-[10px] font-bold text-red-400/60 font-mono bg-red-950/80 px-1 rounded">
                      [{keyLabel}]
                    </span>
                  )}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Penalty 1.5s Overlay Lockout */}
          <AnimatePresence>
            {redPenaltyMs > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-red-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center p-6 z-30 border-2 border-red-500"
              >
                <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center mb-2 animate-bounce">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h4 className="text-xl font-black text-white">Wrong Answer!</h4>
                <p className="text-xs text-red-200 mt-1 font-medium">1.5s Cooldown Penalty</p>
                <div className="mt-3 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 font-mono font-black text-sm">
                  {(redPenaltyMs / 1000).toFixed(1)}s
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI thinking indicator if in vs AI mode */}
          {mode === 'vs-ai' && isPlaying && redPenaltyMs <= 0 && (
            <div className="mt-2 text-center text-[11px] font-semibold text-slate-400 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>AI is calculating answer...</span>
            </div>
          )}

        </div>

      </div>

      {/* Match Over / Victory Celebration Modal */}
      <AnimatePresence>
        {matchResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl shadow-amber-500/10"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                <Trophy className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                {matchResult.winner === 'blue' ? (
                  <span className="text-blue-400">🏆 Player 1 (Blue) Wins!</span>
                ) : (
                  <span className="text-red-400">🏆 {mode === 'vs-ai' ? 'Robot' : 'Player 2 (Red)'} Wins!</span>
                )}
              </h2>

              <p className="text-slate-300 text-sm mt-1">
                Completed in <strong className="text-white">{matchResult.durationSeconds}s</strong> of intense mental math!
              </p>

              {/* Match Statistics Table */}
              <div className="grid grid-cols-2 gap-3 my-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-left">
                <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/50">
                  <div className="text-xs font-bold text-blue-400 uppercase">Blue Team</div>
                  <div className="text-xl font-black text-white mt-1">{matchResult.blueAccuracy}% Acc</div>
                  <div className="text-[11px] text-slate-400">{blueStats.correct} correct of {blueStats.attempts}</div>
                </div>
                <div className="p-3 bg-red-950/40 rounded-xl border border-red-900/50">
                  <div className="text-xs font-bold text-red-400 uppercase">Red Team</div>
                  <div className="text-xl font-black text-white mt-1">{matchResult.redAccuracy}% Acc</div>
                  <div className="text-[11px] text-slate-400">{redStats.correct} correct of {redStats.attempts}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={startMatch}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/25 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>PLAY REMATCH</span>
                </button>

                <button
                  onClick={() => setMatchResult(null)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all"
                >
                  Close Stats
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
