import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tile } from './Tile';
import { Key } from './Key';
import { Button } from '../UI/Button';
import { useWordPuzzle } from '../../hooks/useWordPuzzle';
import { useTheme } from '../../contexts/ThemeContext';
import { CELEBRATION_MESSAGES } from '../../lib/constants';
import { RotateCcw, Trophy, Clock, Target, Timer } from 'lucide-react';

export function WordPuzzle({ 
  targetWord, 
  maxAttempts = 6,
  timeLimit = null,
  onComplete, 
  onReset,
  showStats = true
}) {
  const { isDark } = useTheme();
  const {
    gameState,
    guesses,
    currentGuess,
    feedbackGrid,
    letterStatuses,
    score,
    attemptsLeft,
    timeTaken,
    submitGuess,
    addLetter,
    removeLetter,
    resetGame,
  } = useWordPuzzle(targetWord, maxAttempts);

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [shakeRow, setShakeRow] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  const wordLength = targetWord?.length || 4;

  // Timer effect
  useEffect(() => {
    if (!timeLimit || gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setToast({ show: true, message: 'Time\'s up!', type: 'error' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, gameState]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = useCallback((key) => {
    if (gameState !== 'playing' || (timeLimit && timeRemaining <= 0)) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordLength) {
        showToast("Not enough letters", 'warning');
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 600);
        return;
      }
      
      const result = submitGuess();
      if (result.won) {
        setShowCelebration(true);
        const message = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
        showToast(message, 'success');
        setTimeout(() => {
          onComplete?.(score, guesses.length, timeTaken);
        }, 2000);
      } else if (!result.success) {
        showToast(result.message, 'error');
      }
    } else if (key === 'DEL' || key === 'BACKSPACE') {
      removeLetter();
    } else if (currentGuess.length < wordLength && /^[A-Z]$/i.test(key)) {
      addLetter(key.toUpperCase());
    }
  }, [currentGuess, gameState, wordLength, timeRemaining, timeLimit, submitGuess, addLetter, removeLetter, showToast, onComplete, score, guesses.length, timeTaken]);

  useEffect(() => {
    const handlePhysicalKeyboard = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter') handleKeyPress('ENTER');
      else if (e.key === 'Backspace') handleKeyPress('DEL');
      else if (e.key.length === 1 && e.key.match(/^[a-zA-Z]$/)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyboard);
    return () => window.removeEventListener('keydown', handlePhysicalKeyboard);
  }, [handleKeyPress]);

  const handleReset = () => {
    resetGame();
    setShowCelebration(false);
    setTimeRemaining(timeLimit);
    onReset?.();
  };

  // Create grid with custom max attempts
  const grid = [];
  for (let i = 0; i < maxAttempts; i++) {
    const isCurrentRow = i === guesses.length;
    const rowChars = isCurrentRow 
      ? [...currentGuess.padEnd(wordLength, '')].slice(0, wordLength)
      : (guesses[i] || '').padEnd(wordLength, '').slice(0, wordLength);
    
    const rowFeedback = feedbackGrid[i] || Array(wordLength).fill('default');
    const isRevealed = i < guesses.length;

    grid.push(
      <motion.div 
        key={i} 
        className={`grid gap-1.5 md:gap-2`}
        style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}
        animate={shakeRow && isCurrentRow ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {Array.from({ length: wordLength }).map((_, j) => (
          <Tile
            key={j}
            char={rowChars[j] || ""}
            feedback={rowFeedback[j]}
            isRevealed={isRevealed}
            isCompleted={gameState === 'won' && i === guesses.length - 1}
            delay={j * 0.1}
          />
        ))}
      </motion.div>
    );
  }

  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
  ];

  if (showCelebration) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 text-center shadow-2xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            duration: 1, 
            repeat: Infinity, 
            repeatType: "loop", 
            repeatDelay: 2 
          }}
          className="text-6xl mb-4"
        >
          🎉🏆✨
        </motion.div>
        
        <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Congratulations! 🎊
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4`}>
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Score</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{score}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4`}>
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Attempts</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{guesses.length}/{maxAttempts}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4`}>
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Time</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{timeTaken}s</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button onClick={handleReset} variant="primary" size="lg">
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 md:p-6 flex flex-col items-center max-w-md mx-auto shadow-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
              fixed top-5 left-1/2 transform -translate-x-1/2 z-50
              px-4 py-2 rounded-lg shadow-lg text-white font-medium
              ${toast.type === 'success' ? 'bg-green-600' : 
                toast.type === 'warning' ? 'bg-yellow-600' : 
                toast.type === 'error' ? 'bg-red-600' : 'bg-gray-600'}
            `}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center w-full mb-4">
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Word Puzzle
        </h3>
        <div className="flex items-center gap-2">
          <Button onClick={handleReset} variant="secondary" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className={`flex justify-between w-full mb-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <span>Attempts: {guesses.length}/{maxAttempts}</span>
          {timeLimit && (
            <div className="flex items-center">
              <Timer className="w-4 h-4 mr-1" />
              <span className={timeRemaining <= 30 ? 'text-red-500 font-bold' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          <span>Time: {timeTaken}s</span>
        </div>
      )}

      {/* Grid */}
      <div className="space-y-1.5 md:space-y-2 mb-6">
        {grid}
      </div>

      {/* Keyboard */}
      <div className="w-full space-y-1.5 md:space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 md:gap-1.5">
            {row.map(keyVal => (
              <Key
                key={keyVal}
                value={keyVal}
                status={letterStatuses[keyVal]}
                onClick={handleKeyPress}
                disabled={gameState !== 'playing' || (timeLimit && timeRemaining <= 0)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Game Over */}
      {(gameState === 'lost' || (timeLimit && timeRemaining <= 0)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center"
        >
          <p className="text-red-500 mb-2">
            {timeLimit && timeRemaining <= 0 ? "Time's up!" : "Game Over!"}
          </p>
          <p className={`text-lg mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            The word was: <strong>{targetWord}</strong>
          </p>
          <Button onClick={handleReset} variant="primary" size="md">
            Try Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}