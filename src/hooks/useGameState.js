import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useGameState() {
  const [gameHistory, setGameHistory] = useLocalStorage('wordPuzzleHistory', []);
  const [preferences, setPreferences] = useLocalStorage('wordPuzzlePreferences', {
    soundEnabled: true,
    animationsEnabled: true,
    darkMode: true,
    difficulty: 'medium',
    category: 'general',
  });

  const addGameToHistory = useCallback((gameData) => {
    const newGame = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...gameData,
    };
    
    setGameHistory(prev => [newGame, ...prev.slice(0, 99)]); // Keep last 100 games
  }, [setGameHistory]);

  const getGameStats = useCallback(() => {
    const totalGames = gameHistory.length;
    const wonGames = gameHistory.filter(game => game.won).length;
    const winRate = totalGames > 0 ? (wonGames / totalGames) * 100 : 0;
    
    const scores = gameHistory.map(game => game.score || 0);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const bestScore = Math.max(0, ...scores);
    
    const times = gameHistory.filter(game => game.won).map(game => game.timeTaken || 0);
    const averageTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    const bestTime = times.length > 0 ? Math.min(...times) : 0;
    
    const attempts = gameHistory.filter(game => game.won).map(game => game.attempts || 6);
    const averageAttempts = attempts.length > 0 ? attempts.reduce((a, b) => a + b, 0) / attempts.length : 0;
    
    return {
      totalGames,
      wonGames,
      winRate: Math.round(winRate),
      averageScore: Math.round(averageScore),
      bestScore,
      averageTime: Math.round(averageTime),
      bestTime,
      averageAttempts: Math.round(averageAttempts * 10) / 10,
    };
  }, [gameHistory]);

  const clearHistory = useCallback(() => {
    setGameHistory([]);
  }, [setGameHistory]);

  const updatePreferences = useCallback((newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, [setPreferences]);

  return {
    gameHistory,
    preferences,
    addGameToHistory,
    getGameStats,
    clearHistory,
    updatePreferences,
  };
}