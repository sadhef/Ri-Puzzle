import { FEEDBACK_TYPES } from './constants';

export function getGuessFeedback(guess, targetWord) {
  const feedback = Array(guess.length).fill(FEEDBACK_TYPES.ABSENT);
  const targetLetters = [...targetWord];
  const guessLetters = [...guess];

  // First pass: mark correct letters
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      feedback[i] = FEEDBACK_TYPES.CORRECT;
      targetLetters[i] = null; // Mark as used
      guessLetters[i] = null; // Mark as processed
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] !== null) {
      const targetIndex = targetLetters.indexOf(guessLetters[i]);
      if (targetIndex !== -1) {
        feedback[i] = FEEDBACK_TYPES.PRESENT;
        targetLetters[targetIndex] = null; // Mark as used
      }
    }
  }

  return feedback;
}

export function isValidWord(word) {
  // Basic validation - you can enhance this with a dictionary API
  return /^[A-Za-z]+$/.test(word) && word.length >= 3;
}

export function calculateScore(attempts, wordLength, timeTaken, hintsUsed = 0) {
  const baseScore = 1000;
  const lengthBonus = wordLength * 50;
  const attemptPenalty = (attempts - 1) * 50;
  const timePenalty = Math.floor(timeTaken / 10); // 1 point per 10 seconds
  const hintPenalty = hintsUsed * 100;
  
  return Math.max(0, baseScore + lengthBonus - attemptPenalty - timePenalty - hintPenalty);
}

export function getGameStats(gameHistory) {
  const totalGames = gameHistory.length;
  const wonGames = gameHistory.filter(game => game.won).length;
  const winRate = totalGames > 0 ? (wonGames / totalGames) * 100 : 0;
  
  const averageAttempts = wonGames > 0 
    ? gameHistory.filter(game => game.won).reduce((sum, game) => sum + game.attempts, 0) / wonGames 
    : 0;
  
  return {
    totalGames,
    wonGames,
    winRate: Math.round(winRate),
    averageAttempts: Math.round(averageAttempts * 10) / 10,
  };
}