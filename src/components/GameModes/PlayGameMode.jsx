// src/components/GameModes/PlayGameMode.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../UI/Button';
import { Select } from '../UI/Select';
import { WordPuzzle } from '../WordPuzzle';
import { AIWordService } from '../../lib/aiService';
import { WORD_CATEGORIES, DIFFICULTY_LEVELS } from '../../lib/constants';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowLeft, Shuffle, TrendingUp, Trophy, Clock } from 'lucide-react';

export function PlayGameMode({ onBack }) {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState('setup');
  const [gameConfig, setGameConfig] = useState({
    difficulty: 'medium',
    category: 'general'
  });
  const [currentWord, setCurrentWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [gameStats, setGameStats] = useLocalStorage('wordPuzzleStats', {
    totalGames: 0,
    totalWins: 0,
    totalScore: 0,
    bestScore: 0,
    averageTime: 0
  });

  const difficultyOptions = Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => ({
    value: key.toLowerCase(),
    label: `${key.charAt(0) + key.slice(1).toLowerCase()} (${value.wordLength} letters)`
  }));

  const categoryOptions = [
    { value: 'general', label: 'General' },
    ...WORD_CATEGORIES.map(cat => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];

  const generateWord = async () => {
    setLoading(true);
    setCurrentStep('loading');
    
    try {
      const difficulty = DIFFICULTY_LEVELS[gameConfig.difficulty.toUpperCase()];
      const word = await AIWordService.generateRandomWord(
        difficulty.wordLength,
        gameConfig.category,
        gameConfig.difficulty
      );
      
      setCurrentWord(word);
      setCurrentStep('playing');
    } catch (error) {
      // If AI fails, go back to setup
      setCurrentStep('setup');
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = (score, attempts, time) => {
    const newStats = {
      totalGames: gameStats.totalGames + 1,
      totalWins: gameStats.totalWins + 1,
      totalScore: gameStats.totalScore + score,
      bestScore: Math.max(gameStats.bestScore, score),
      averageTime: Math.round(((gameStats.averageTime * gameStats.totalGames) + time) / (gameStats.totalGames + 1))
    };
    setGameStats(newStats);

    // Auto-generate next word after 3 seconds
    setTimeout(() => {
      generateWord();
    }, 3000);
  };

  const handleGameReset = () => {
    generateWord();
  };

  if (currentStep === 'loading') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-96 space-y-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <div className="text-center">
          <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Generating Word...
          </h3>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Creating a {gameConfig.difficulty} word about {gameConfig.category}
          </p>
        </div>
      </motion.div>
    );
  }

  if (currentStep === 'playing') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            onClick={() => setCurrentStep('setup')} 
            variant="secondary"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Setup
          </Button>
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Generated Game
            </h2>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              {gameConfig.difficulty} • {gameConfig.category}
            </p>
          </div>
          <Button
            onClick={generateWord}
            variant="secondary"
            size="sm"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            New Word
          </Button>
        </div>

        <WordPuzzle
          targetWord={currentWord}
          onComplete={handleGameComplete}
          onReset={handleGameReset}
          showStats={true}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="secondary" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          AI Random Game
        </h2>
        <div className="w-20"></div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 text-center shadow border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Games Played</p>
          <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{gameStats.totalGames}</p>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 text-center shadow border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Best Score</p>
          <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{gameStats.bestScore}</p>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 text-center shadow border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
            %
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Win Rate</p>
          <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {gameStats.totalGames > 0 ? Math.round((gameStats.totalWins / gameStats.totalGames) * 100) : 0}%
          </p>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 text-center shadow border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Avg Time</p>
          <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{gameStats.averageTime}s</p>
        </div>
      </div>

      {/* Game Settings */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 space-y-4 shadow border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Game Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Difficulty"
            options={difficultyOptions}
            value={gameConfig.difficulty}
            onChange={(value) => setGameConfig(prev => ({ ...prev, difficulty: value }))}
          />

          <Select
            label="Category"
            options={categoryOptions}
            value={gameConfig.category}
            onChange={(value) => setGameConfig(prev => ({ ...prev, category: value }))}
          />
        </div>
      </div>

      {/* Preview */}
      <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Game Preview
        </h4>
        <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
          <p>🤖 AI Generated Words: Single word challenges</p>
          <p>📏 Length: {DIFFICULTY_LEVELS[gameConfig.difficulty.toUpperCase()]?.wordLength} letters</p>
          <p>🎯 Category: {gameConfig.category}</p>
          <p>⚡ Difficulty: {gameConfig.difficulty}</p>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-center">
        <Button onClick={generateWord} variant="primary" size="lg" disabled={loading}>
          <Shuffle className="w-5 h-5 mr-2" />
          Generate & Start Game
        </Button>
      </div>
    </motion.div>
  );
}