import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, RotateCcw, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ScaleProblem {
  id: number;
  leftWeights: number[];
  rightKnownWeights: number[];
  targetMissingWeight: number; // what makes left == right
  options: number[];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateScaleProblem(level: number): ScaleProblem {
  const leftCount = level > 2 ? 2 : 1;
  const leftWeights: number[] = [];
  let leftTotal = 0;

  for (let i = 0; i < leftCount; i++) {
    const w = getRandomInt(5 * level, 12 * level);
    leftWeights.push(w);
    leftTotal += w;
  }

  // Right side: known weight + missing weight
  const known = getRandomInt(2 * level, Math.max(3, leftTotal - 2));
  const missing = leftTotal - known;

  // Distractors
  const optsSet = new Set<number>([missing]);
  while (optsSet.size < 4) {
    const delta = getRandomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
    const candidate = missing + delta;
    if (candidate > 0) optsSet.add(candidate);
  }

  const options = Array.from(optsSet).sort(() => Math.random() - 0.5);

  return {
    id: Date.now(),
    leftWeights,
    rightKnownWeights: [known],
    targetMissingWeight: missing,
    options,
  };
}

export const BalanceScaleGame: React.FC = () => {
  const [level, setLevel] = useState<number>(1);
  const [problem, setProblem] = useState<ScaleProblem>(() => generateScaleProblem(1));
  const [placedWeight, setPlacedWeight] = useState<number | null>(null);
  const [isBalanced, setIsBalanced] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const leftTotal = problem.leftWeights.reduce((a, b) => a + b, 0);
  const rightCurrentTotal = problem.rightKnownWeights.reduce((a, b) => a + b, 0) + (placedWeight ?? 0);

  // Calculate tilt angle: negative = left heavier, positive = right heavier, 0 = balanced
  const weightDiff = rightCurrentTotal - leftTotal;
  const tiltAngle = placedWeight === null ? -8 : Math.max(-12, Math.min(12, weightDiff * 1.8));

  const handleSelectWeight = (w: number) => {
    soundManager.playClick();
    setPlacedWeight(w);

    if (w === problem.targetMissingWeight) {
      soundManager.playCorrect();
      setIsBalanced(true);
      setScore(prev => prev + 1);
    } else {
      soundManager.playWrong();
      setIsBalanced(false);
    }
  };

  const nextProblem = () => {
    soundManager.playClick();
    const nextLvl = level + 1;
    setLevel(nextLvl);
    setPlacedWeight(null);
    setIsBalanced(false);
    setProblem(generateScaleProblem(nextLvl));
  };

  const resetCurrent = () => {
    soundManager.playClick();
    setPlacedWeight(null);
    setIsBalanced(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6" id="balance-scale-container">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Scale className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">MathTug Balance Scale</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Find the unknown weight <strong className="text-amber-400 font-mono">[ ? ]</strong> to balance both sides equally!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            Level: <strong className="text-amber-400 font-black">{level}</strong> | Score: <strong className="text-white font-black">{score}</strong>
          </div>
          <button
            onClick={resetCurrent}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            title="Reset Placed Weight"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Visual Scale Stage */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-12 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden">
        
        {/* Balance Status Pill */}
        <div className="mb-8">
          {isBalanced ? (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/20 animate-bounce">
              <Sparkles className="w-4 h-4" />
              <span>PERFECTLY BALANCED! (Left: {leftTotal} kg = Right: {rightCurrentTotal} kg)</span>
            </div>
          ) : placedWeight !== null ? (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs sm:text-sm font-bold">
              <span>Not Equal! (Left: {leftTotal} kg vs Right: {rightCurrentTotal} kg)</span>
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Scale is Unbalanced • Choose a Weight Below
            </div>
          )}
        </div>

        {/* The Animated Physics Scale Beam */}
        <div className="relative w-full max-w-lg h-56 flex flex-col items-center justify-end">
          
          {/* Fulcrum Stand */}
          <div className="absolute bottom-0 w-8 h-28 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-lg z-0"></div>
          <div className="absolute bottom-0 w-24 h-4 bg-slate-800 rounded-full z-0 border border-slate-700"></div>

          {/* Pivot Fulcrum Triangle */}
          <div className="absolute bottom-24 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[24px] border-b-amber-500 z-10"></div>

          {/* Tilting Horizontal Beam */}
          <motion.div
            className="absolute bottom-28 w-72 sm:w-96 h-4 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full border border-amber-300 shadow-xl flex items-center justify-between px-2 z-20"
            animate={{ rotate: tiltAngle }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          >
            {/* Center Pivot Pin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow"></div>

            {/* Left Pan Attachment */}
            <div className="relative -ml-6 -mb-28 flex flex-col items-center">
              {/* Chains */}
              <div className="w-16 h-20 border-x border-amber-300/60 -skew-x-6 origin-top"></div>
              {/* Left Dish */}
              <div className="w-24 sm:w-28 h-6 bg-slate-800 border-2 border-blue-400 rounded-b-2xl shadow-lg flex items-center justify-center -mt-1 relative">
                {/* Placed known weights */}
                <div className="absolute -top-7 flex items-center gap-1">
                  {problem.leftWeights.map((w, idx) => (
                    <div key={idx} className="px-2 py-1 bg-blue-600 border border-blue-300 text-white rounded font-black text-xs shadow">
                      {w}kg
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[11px] font-bold text-blue-400 mt-1">Total: {leftTotal}kg</div>
            </div>

            {/* Right Pan Attachment */}
            <div className="relative -mr-6 -mb-28 flex flex-col items-center">
              {/* Chains */}
              <div className="w-16 h-20 border-x border-amber-300/60 skew-x-6 origin-top"></div>
              {/* Right Dish */}
              <div className="w-24 sm:w-28 h-6 bg-slate-800 border-2 border-red-400 rounded-b-2xl shadow-lg flex items-center justify-center -mt-1 relative">
                {/* Known right weight + Missing weight box */}
                <div className="absolute -top-7 flex items-center gap-1">
                  <div className="px-2 py-1 bg-red-600 border border-red-300 text-white rounded font-black text-xs shadow">
                    {problem.rightKnownWeights[0]}kg
                  </div>
                  <div className={`px-2.5 py-1 rounded font-black text-xs border-2 shadow transition-all ${
                    placedWeight !== null 
                      ? 'bg-amber-400 border-white text-slate-950 scale-105' 
                      : 'bg-slate-900 border-dashed border-amber-400 text-amber-400 animate-pulse'
                  }`}>
                    {placedWeight !== null ? `${placedWeight}kg` : '? kg'}
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-bold text-red-400 mt-1">Total: {rightCurrentTotal}kg</div>
            </div>

          </motion.div>

        </div>

        {/* Weight Options for '?' */}
        <div className="w-full max-w-md mt-10">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Select the weight that satisfies: {leftTotal} = {problem.rightKnownWeights[0]} + ?
          </div>

          <div className="grid grid-cols-4 gap-3">
            {problem.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectWeight(opt)}
                className={`py-3 px-2 rounded-xl font-black text-lg transition-all border-2 flex flex-col items-center shadow-lg active:scale-95 ${
                  placedWeight === opt
                    ? isBalanced
                      ? 'bg-emerald-500 border-emerald-300 text-white shadow-emerald-500/30'
                      : 'bg-red-500 border-red-300 text-white shadow-red-500/30'
                    : 'bg-slate-900 border-slate-700 text-slate-100 hover:border-amber-400 hover:text-amber-400'
                }`}
              >
                <span>{opt}</span>
                <span className="text-[10px] font-semibold opacity-70">kg</span>
              </button>
            ))}
          </div>

          {/* Next Level Action */}
          {isBalanced && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-center"
            >
              <button
                onClick={nextProblem}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/25 transition-all"
              >
                <span>NEXT PROBLEM</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
};
