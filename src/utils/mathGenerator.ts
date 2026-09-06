import { DifficultyTier, MathQuestion } from '../types';

const EMOJIS = ['🍎', '⭐', '🎈', '🐶', '🚗', '🍕', '🐱', '⚽', '🍦', '🚀'];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateOptions(correctAnswer: number, range: number = 3): number[] {
  const optionsSet = new Set<number>([correctAnswer]);
  
  // Try generating nearby sensible distractors
  let attempts = 0;
  while (optionsSet.size < 4 && attempts < 20) {
    attempts++;
    const delta = getRandomInt(1, Math.max(3, range)) * (Math.random() < 0.5 ? 1 : -1);
    const candidate = correctAnswer + delta;
    // Keep numbers positive if original is positive (unless in high school tier)
    if (correctAnswer >= 0 && candidate >= 0) {
      optionsSet.add(candidate);
    } else if (correctAnswer < 0) {
      optionsSet.add(candidate);
    }
  }

  // Fallback if needed
  let fallback = 1;
  while (optionsSet.size < 4) {
    optionsSet.add(correctAnswer + fallback);
    fallback++;
  }

  return shuffleArray(Array.from(optionsSet));
}

export function generateQuestion(tier: DifficultyTier): MathQuestion {
  const id = Math.random().toString(36).substring(2, 9);

  switch (tier) {
    case 'nursery': {
      // 70% object counting, 30% simple number recognition/addition under 6
      const isCounting = Math.random() < 0.7;
      if (isCounting) {
        const count = getRandomInt(1, 9);
        const emoji = EMOJIS[getRandomInt(0, EMOJIS.length - 1)];
        return {
          id,
          tier,
          question: `How many ${emoji} are there?`,
          visualEmoji: emoji,
          visualCount: count,
          correctAnswer: count,
          options: generateOptions(count, 3),
          explanation: `Count each one: there are ${count} ${emoji}!`,
        };
      } else {
        const a = getRandomInt(1, 5);
        const b = getRandomInt(1, 4);
        const ans = a + b;
        return {
          id,
          tier,
          question: `${a} + ${b} = ?`,
          correctAnswer: ans,
          options: generateOptions(ans, 2),
          explanation: `${a} plus ${b} equals ${ans}.`,
        };
      }
    }

    case 'primary': {
      // Grade 1-2: Add / Sub within 20 or round numbers to 50
      const isAdd = Math.random() < 0.55;
      if (isAdd) {
        const a = getRandomInt(3, 19);
        const b = getRandomInt(2, 15);
        const ans = a + b;
        return {
          id,
          tier,
          question: `${a} + ${b} = ?`,
          correctAnswer: ans,
          options: generateOptions(ans, 4),
          explanation: `${a} + ${b} = ${ans}`,
        };
      } else {
        const ans = getRandomInt(2, 16);
        const b = getRandomInt(2, 14);
        const a = ans + b;
        return {
          id,
          tier,
          question: `${a} - ${b} = ?`,
          correctAnswer: ans,
          options: generateOptions(ans, 4),
          explanation: `${a} - ${b} = ${ans}`,
        };
      }
    }

    case 'middle': {
      // Grade 3-5: Multiplication & Division
      const mode = Math.random();
      if (mode < 0.55) {
        // Multiplication
        const a = getRandomInt(2, 12);
        const b = getRandomInt(2, 12);
        const ans = a * b;
        return {
          id,
          tier,
          question: `${a} × ${b} = ?`,
          correctAnswer: ans,
          options: generateOptions(ans, 8),
          explanation: `${a} times ${b} is ${ans}`,
        };
      } else if (mode < 0.85) {
        // Division
        const b = getRandomInt(2, 11);
        const ans = getRandomInt(2, 12);
        const a = b * ans;
        return {
          id,
          tier,
          question: `${a} ÷ ${b} = ?`,
          correctAnswer: ans,
          options: generateOptions(ans, 3),
          explanation: `${a} divided by ${b} is ${ans}`,
        };
      } else {
        // Mixed: 2-step
        const a = getRandomInt(2, 6);
        const b = getRandomInt(2, 5);
        const c = getRandomInt(1, 10);
        const ans = a * b + c;
        return {
          id,
          tier,
          question: `(${a} × ${b}) + ${c} = ?`,
          correctAnswer: ans,
          options: generateOptions(ans, 5),
          explanation: `${a} × ${b} = ${a * b}, plus ${c} = ${ans}`,
        };
      }
    }

    case 'high': {
      // Grade 6-8: Algebra, negative numbers, roots
      const mode = Math.random();
      if (mode < 0.5) {
        // Linear equation: a * x + b = c
        const x = getRandomInt(2, 12);
        const a = getRandomInt(2, 6);
        const b = getRandomInt(1, 15);
        const c = a * x + b;
        return {
          id,
          tier,
          question: `Solve for x:  ${a}x + ${b} = ${c}`,
          correctAnswer: x,
          options: generateOptions(x, 3),
          explanation: `${a}x = ${c - b} ➔ x = ${x}`,
        };
      } else if (mode < 0.8) {
        // Negative integer arithmetic
        const a = getRandomInt(-15, 15);
        const b = getRandomInt(-15, 15);
        const ans = a + b;
        const bStr = b < 0 ? `(${b})` : `${b}`;
        return {
          id,
          tier,
          question: `${a} + ${bStr} = ?`,
          correctAnswer: ans,
          options: generateOptions(ans, 5),
          explanation: `${a} + ${bStr} = ${ans}`,
        };
      } else {
        // Square root or exponent
        const base = getRandomInt(3, 12);
        const square = base * base;
        return {
          id,
          tier,
          question: `√${square} = ?`,
          correctAnswer: base,
          options: generateOptions(base, 3),
          explanation: `Because ${base}² = ${square}, √${square} = ${base}`,
        };
      }
    }

    case 'gamer':
    default: {
      // Fast mental rapid math
      const ops = ['+', '-', '×'];
      const op = ops[getRandomInt(0, ops.length - 1)];
      let a = 0, b = 0, ans = 0;

      if (op === '+') {
        a = getRandomInt(18, 99);
        b = getRandomInt(15, 89);
        ans = a + b;
      } else if (op === '-') {
        ans = getRandomInt(15, 75);
        b = getRandomInt(12, 60);
        a = ans + b;
      } else {
        a = getRandomInt(6, 15);
        b = getRandomInt(4, 12);
        ans = a * b;
      }

      return {
        id,
        tier: 'gamer',
        question: `${a} ${op} ${b} = ?`,
        correctAnswer: ans,
        options: generateOptions(ans, 10),
        explanation: `${a} ${op} ${b} = ${ans}`,
      };
    }
  }
}
