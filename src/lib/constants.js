export const GAME_CONSTANTS = {
  MIN_WORD_LENGTH: 3,
  MAX_WORD_LENGTH: 8,
  DEFAULT_WORD_LENGTH: 4,
  MAX_ATTEMPTS: 6,
  TILE_ANIMATION_DELAY: 100,
  CELEBRATION_DURATION: 3000,
};

export const FEEDBACK_TYPES = {
  CORRECT: 'correct',
  PRESENT: 'present',
  ABSENT: 'absent',
  DEFAULT: 'default',
};

export const GAME_STATES = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
  PAUSED: 'paused',
};

export const DIFFICULTY_LEVELS = {
  EASY: { wordLength: 4, maxAttempts: 6, category: 'common' },
  MEDIUM: { wordLength: 5, maxAttempts: 6, category: 'moderate' },
  HARD: { wordLength: 6, maxAttempts: 5, category: 'challenging' },
  EXPERT: { wordLength: 7, maxAttempts: 5, category: 'expert' },
};

export const WORD_CATEGORIES = [
  'animals', 'food', 'technology', 'nature', 'sports', 
  'music', 'travel', 'science', 'art', 'literature'
];

export const CELEBRATION_MESSAGES = [
  "🎉 Amazing! You're a word wizard!",
  "🌟 Fantastic! You solved it!",
  "🎊 Brilliant! You found the word!",
  "✨ Incredible! You're on fire!",
  "🏆 Outstanding! You're the champion!",
];