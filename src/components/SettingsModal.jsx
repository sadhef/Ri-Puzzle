import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Zap, ZapOff, Moon, Sun, Trash2, Monitor } from 'lucide-react';
import { Button } from './UI/Button';
import { Select } from './UI/Select';
import { useGameState } from '../hooks/useGameState';
import { useTheme } from '../contexts/ThemeContext';

export function SettingsModal({ isOpen, onClose }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const { preferences, updatePreferences, getGameStats, clearHistory } = useGameState();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const stats = getGameStats();

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'expert', label: 'Expert' },
  ];

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'animals', label: 'Animals' },
    { value: 'food', label: 'Food' },
    { value: 'technology', label: 'Technology' },
    { value: 'nature', label: 'Nature' },
    { value: 'sports', label: 'Sports' },
  ];

  const handleClearHistory = () => {
    clearHistory();
    setShowConfirmClear(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto shadow-2xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Settings
            </h2>
            <Button onClick={onClose} variant="secondary" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Appearance */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Appearance
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Monitor className="w-5 h-5 mr-3 text-blue-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Theme
                    </span>
                  </div>
                  <Button
                    onClick={toggleTheme}
                    variant="secondary"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    {isDark ? (
                      <>
                        <Moon className="w-4 h-4" />
                        <span>Dark</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-4 h-4" />
                        <span>Light</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 mr-3 text-purple-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Animations
                    </span>
                  </div>
                  <Button
                    onClick={() => updatePreferences({ animationsEnabled: !preferences.animationsEnabled })}
                    variant="secondary"
                    size="sm"
                  >
                    {preferences.animationsEnabled ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <ZapOff className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 className="w-5 h-5 mr-3 text-green-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Sound Effects
                    </span>
                  </div>
                  <Button
                    onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
                    variant="secondary"
                    size="sm"
                  >
                    {preferences.soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Game Defaults */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Game Defaults
              </h3>
              
              <div className="space-y-4">
                <Select
                  label="Default Difficulty"
                  options={difficultyOptions}
                  value={preferences.difficulty}
                  onChange={(value) => updatePreferences({ difficulty: value })}
                />

                <Select
                  label="Default Category"
                  options={categoryOptions}
                  value={preferences.category}
                  onChange={(value) => updatePreferences({ category: value })}
                />
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Statistics
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalGames}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Games Played
                  </p>
                </div>
                <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats.winRate}%
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Win Rate
                  </p>
                </div>
                <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats.bestScore}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Best Score
                  </p>
                </div>
                <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-3 text-center`}>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats.averageAttempts}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Avg Attempts
                  </p>
                </div>
              </div>

              {!showConfirmClear ? (
                <Button
                  onClick={() => setShowConfirmClear(true)}
                  variant="danger"
                  size="sm"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Game History
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-red-500 text-center">
                    Are you sure? This cannot be undone.
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleClearHistory}
                      variant="danger"
                      size="sm"
                      className="flex-1"
                    >
                      Yes, Clear All
                    </Button>
                    <Button
                      onClick={() => setShowConfirmClear(false)}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}