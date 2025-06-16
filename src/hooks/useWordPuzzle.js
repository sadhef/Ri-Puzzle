import { useState, useCallback, useEffect } from 'react';
import { getGuessFeedback, calculateScore } from '../lib/gameLogic';
import { GAME_CONSTANTS, GAME_STATES, FEEDBACK_TYPES } from '../lib/constants';

export function useWordPuzzle(targetWord, maxAttempts = GAME_CONSTANTS.MAX_ATTEMPTS) {
  const [gameState, setGameState] = useState(GAME_STATES.PLAYING);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedbackGrid, setFeedbackGrid] = useState([]);
  const [letterStatuses, setLetterStatuses] = useState({});
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(null);
  const [score, setScore] = useState(0);

  const wordLength = targetWord?.length || GAME_CONSTANTS.DEFAULT_WORD_LENGTH;

  const submitGuess = useCallback(() => {
    if (!targetWord || currentGuess.length !== wordLength || gameState !== GAME_STATES.PLAYING) {
      return { success: false, message: 'Invalid guess' };
    }

    const feedback = getGuessFeedback(currentGuess.toUpperCase(), targetWord.toUpperCase());
    const newGuesses = [...guesses, currentGuess.toUpperCase()];
    const newFeedbackGrid = [...feedbackGrid, feedback];

    setGuesses(newGuesses);
    setFeedbackGrid(newFeedbackGrid);

    // Update letter statuses for keyboard
    const newLetterStatuses = { ...letterStatuses };
    currentGuess.toUpperCase().split('').forEach((letter, index) => {
      const status = feedback[index];
      if (newLetterStatuses[letter] === FEEDBACK_TYPES.CORRECT) return;
      if (newLetterStatuses[letter] === FEEDBACK_TYPES.PRESENT && status !== FEEDBACK_TYPES.CORRECT) return;
      newLetterStatuses[letter] = status;
    });
    setLetterStatuses(newLetterStatuses);

    // Check win condition
    if (currentGuess.toUpperCase() === targetWord.toUpperCase()) {
      setGameState(GAME_STATES.WON);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      setEndTime(timeTaken);
      const finalScore = calculateScore(newGuesses.length, wordLength, timeTaken, 0);
      setScore(finalScore);
      setCurrentGuess('');
      return { success: true, message: 'Congratulations! You won!', won: true };
    }

    // Check lose condition
    if (newGuesses.length >= maxAttempts) {
      setGameState(GAME_STATES.LOST);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      setEndTime(timeTaken);
      setCurrentGuess('');
      return { success: true, message: `Game over! The word was ${targetWord}`, won: false };
    }

    setCurrentGuess('');
    return { success: true, message: 'Keep trying!', won: false };
  }, [currentGuess, targetWord, wordLength, gameState, guesses, feedbackGrid, letterStatuses, maxAttempts, startTime]);

  const addLetter = useCallback((letter) => {
    if (gameState !== GAME_STATES.PLAYING || currentGuess.length >= wordLength) return;
    setCurrentGuess(prev => prev + letter.toUpperCase());
  }, [currentGuess.length, wordLength, gameState]);

  const removeLetter = useCallback(() => {
    if (gameState !== GAME_STATES.PLAYING) return;
    setCurrentGuess(prev => prev.slice(0, -1));
  }, [gameState]);

  const resetGame = useCallback((newTargetWord) => {
    setGameState(GAME_STATES.PLAYING);
    setGuesses([]);
    setCurrentGuess('');
    setFeedbackGrid([]);
    setLetterStatuses({});
    setEndTime(null);
    setScore(0);
  }, []);

  return {
    gameState,
    guesses,
    currentGuess,
    feedbackGrid,
    letterStatuses,
    score,
    attemptsLeft: maxAttempts - guesses.length,
    timeTaken: endTime || Math.floor((Date.now() - startTime) / 1000),
    submitGuess,
    addLetter,
    removeLetter,
    resetGame,
  };
}