export type GameId = 'tug-of-war' | 'arrow-puzzle' | 'balance-scale' | 'classroom-mode' | 'curriculum';

export type TugMode = '1v1' | 'vs-ai' | 'classroom';

export type DifficultyTier = 'nursery' | 'primary' | 'middle' | 'high' | 'gamer';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'beast';

export interface MathQuestion {
  id: string;
  tier: DifficultyTier;
  question: string;
  visualEmoji?: string;
  visualCount?: number;
  options: number[];
  correctAnswer: number;
  explanation?: string;
}

export interface PlayerStats {
  score: number;
  correctAnswers: number;
  totalAttempts: number;
  currentStreak: number;
  maxStreak: number;
  isPenalty: boolean;
  penaltyRemaining: number;
}

export interface MatchResult {
  winner: 'blue' | 'red' | 'draw';
  bluePulls: number;
  redPulls: number;
  blueAccuracy: number;
  redAccuracy: number;
  durationSeconds: number;
  tier: DifficultyTier;
  mode: TugMode;
}
