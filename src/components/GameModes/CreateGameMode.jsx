import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { WordPuzzle } from '../WordPuzzle';
import { WORD_CATEGORIES } from '../../lib/constants';
import { validateWordFormat } from '../../lib/wordValidation';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Trash2, Play, ArrowLeft, Target, Clock, Zap } from 'lucide-react';

export function CreateGameMode({ onBack }) {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState('setup');
  const [gameConfig, setGameConfig] = useState({
    wordLength: 5,
    customWords: [''],
    category: 'general',
    difficulty: 'medium',
    maxAttempts: 6,
    timeLimit: null
  });
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const wordLengthOptions = [
    { value: 3, label: '3 Letters (Easy)' },
    { value: 4, label: '4 Letters (Easy)' },
    { value: 5, label: '5 Letters (Medium)' },
    { value: 6, label: '6 Letters (Hard)' },
    { value: 7, label: '7 Letters (Very Hard)' },
    { value: 8, label: '8 Letters (Expert)' },
  ];

  const attemptsOptions = [
    { value: 3, label: '3 Attempts (Hard)' },
    { value: 4, label: '4 Attempts (Medium-Hard)' },
    { value: 5, label: '5 Attempts (Medium)' },
    { value: 6, label: '6 Attempts (Standard)' },
    { value: 7, label: '7 Attempts (Easy)' },
    { value: 8, label: '8 Attempts (Very Easy)' },
    { value: 10, label: '10 Attempts (Practice)' },
  ];

  const timeLimitOptions = [
    { value: null, label: 'No Time Limit' },
    { value: 60, label: '1 Minute' },
    { value: 120, label: '2 Minutes' },
    { value: 300, label: '5 Minutes' },
    { value: 600, label: '10 Minutes' },
  ];

  const categoryOptions = WORD_CATEGORIES.map(cat => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1)
  }));

  const addCustomWord = () => {
    setGameConfig(prev => ({
      ...prev,
      customWords: [...prev.customWords, '']
    }));
  };

  const removeCustomWord = (index) => {
    if (gameConfig.customWords.length > 1) {
      setGameConfig(prev => ({
        ...prev,
        customWords: prev.customWords.filter((_, i) => i !== index)
      }));
    }
  };

  const updateCustomWord = (index, value) => {
    setGameConfig(prev => ({
      ...prev,
      customWords: prev.customWords.map((word, i) => 
        i === index ? value.toUpperCase() : word
      )
    }));
  };

  const validateSetup = () => {
    const newErrors = {};
    const validWords = [];

    gameConfig.customWords.forEach((word, index) => {
      if (!word.trim()) {
        newErrors[`word-${index}`] = 'Word is required';
        return;
      }

      const validation = validateWordFormat(word);
      if (!validation.isValid) {
        newErrors[`word-${index}`] = 'Word must contain only letters';
        return;
      }

      if (word.length !== gameConfig.wordLength) {
        newErrors[`word-${index}`] = `Word must be exactly ${gameConfig.wordLength} letters`;
        return;
      }

      validWords.push(word.toUpperCase());
    });

    if (validWords.length === 0) {
      newErrors.general = 'At least one valid word is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startGame = () => {
    if (validateSetup()) {
      setCurrentStep('playing');
      setCurrentWordIndex(0);
    }
  };

  const handleGameComplete = (score, attempts, time) => {
    if (currentWordIndex < gameConfig.customWords.length - 1) {
      setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
      }, 3000);
    } else {
      setTimeout(() => {
        setCurrentStep('setup');
        setCurrentWordIndex(0);
      }, 3000);
    }
  };

  const handleGameReset = () => {
    setCurrentWordIndex(0);
  };

  if (currentStep === 'playing') {
    const currentWord = gameConfig.customWords[currentWordIndex];
    
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
              Custom Game
            </h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Word {currentWordIndex + 1} of {gameConfig.customWords.length}
            </p>
          </div>
          <div className="w-24"></div>
        </div>

        <WordPuzzle
          targetWord={currentWord}
          maxAttempts={gameConfig.maxAttempts}
          timeLimit={gameConfig.timeLimit}
          onComplete={handleGameComplete}
          onReset={handleGameReset}
          showStats={true}
        />

        {gameConfig.customWords.length > 1 && (
          <div className="flex justify-center space-x-2">
            {gameConfig.customWords.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentWordIndex 
                    ? 'bg-blue-500' 
                    : index < currentWordIndex 
                      ? 'bg-green-500' 
                      : isDark ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
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
          Create Custom Game
        </h2>
        <div className="w-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Settings */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} space-y-4`}>
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Game Settings
            </h3>
          </div>
          
          <Select
            label="Word Length"
            options={wordLengthOptions}
            value={gameConfig.wordLength}
            onChange={(value) => setGameConfig(prev => ({ 
              ...prev, 
              wordLength: parseInt(value),
              customWords: ['']
            }))}
          />

          <Select
            label="Max Attempts"
            options={attemptsOptions}
            value={gameConfig.maxAttempts}
            onChange={(value) => setGameConfig(prev => ({ 
              ...prev, 
              maxAttempts: parseInt(value)
            }))}
          />

          <Select
            label="Time Limit"
            options={timeLimitOptions}
            value={gameConfig.timeLimit}
            onChange={(value) => setGameConfig(prev => ({ 
              ...prev, 
              timeLimit: value ? parseInt(value) : null
            }))}
          />

          <Select
            label="Category"
            options={categoryOptions}
            value={gameConfig.category}
            onChange={(value) => setGameConfig(prev => ({ ...prev, category: value }))}
          />
        </div>

        {/* Custom Words */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Custom Words
              </h3>
            </div>
            <Button onClick={addCustomWord} variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {gameConfig.customWords.map((word, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    placeholder={`${gameConfig.wordLength}-letter word`}
                    value={word}
                    onChange={(e) => updateCustomWord(index, e.target.value)}
                    error={errors[`word-${index}`]}
                    maxLength={gameConfig.wordLength}
                  />
                </div>
                {gameConfig.customWords.length > 1 && (
                  <Button
                    onClick={() => removeCustomWord(index)}
                    variant="danger"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm">{errors.general}</p>
          )}
        </div>

        {/* Game Preview */}
        <div className={`${isDark ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 to-purple-50'} rounded-xl p-6 border ${isDark ? 'border-blue-800/30' : 'border-blue-200'}`}>
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-green-500 mr-2" />
            <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Game Preview
            </h4>
          </div>
          
          <div className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex justify-between">
              <span>Words:</span>
              <span className="font-medium">{gameConfig.customWords.filter(w => w.trim()).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Length:</span>
              <span className="font-medium">{gameConfig.wordLength} letters</span>
            </div>
            <div className="flex justify-between">
              <span>Attempts:</span>
              <span className="font-medium">{gameConfig.maxAttempts}</span>
            </div>
            <div className="flex justify-between">
              <span>Time Limit:</span>
              <span className="font-medium">
                {gameConfig.timeLimit ? `${Math.floor(gameConfig.timeLimit / 60)}:${(gameConfig.timeLimit % 60).toString().padStart(2, '0')}` : 'None'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-medium capitalize">{gameConfig.category}</span>
            </div>
          </div>

          <div className="mt-6">
            <Button 
              onClick={startGame} 
              variant="primary" 
              size="lg" 
              className="w-full"
              disabled={gameConfig.customWords.filter(w => w.trim()).length === 0}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Custom Game
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}