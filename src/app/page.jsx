// src/app/page.jsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/UI/Button';
import { Header, Footer } from '../components/Layout';
import { CreateGameMode, PlayGameMode } from '../components/GameModes';
import { SettingsModal } from '../components/SettingsModal';
import { GridBeam } from '../components/UI/GridBeam';
import { useTheme } from '../contexts/ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { Play, Sparkles, Brain, Zap, Target, ArrowRight } from 'lucide-react';

function MainApp() {
  const { isDark } = useTheme();
  const [currentMode, setCurrentMode] = useState('home');
  const [showSettings, setShowSettings] = useState(false);

  if (currentMode === 'create') {
    return (
      <GridBeam className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header 
          title="Create Custom Game" 
          showSettings={true}
          onSettingsClick={() => setShowSettings(true)}
        />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <CreateGameMode onBack={() => setCurrentMode('home')} />
        </main>
        <Footer />
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </GridBeam>
    );
  }

  if (currentMode === 'play') {
    return (
      <GridBeam className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header 
          title="AI Random Game" 
          showSettings={true}
          onSettingsClick={() => setShowSettings(true)}
        />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <PlayGameMode onBack={() => setCurrentMode('home')} />
        </main>
        <Footer />
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </GridBeam>
    );
  }

  return (
    <GridBeam className={`min-h-screen transition-all duration-500 ${isDark 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <Header 
        title="Ri-Puzzle" 
        showSettings={true}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section - Clean & Minimal */}
        <GridBeam className="container relative z-50 flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-4xl text-center">
            {/* Clean Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-12"
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <img 
                  src="/icon-192x192.png" 
                  alt="Ri-Puzzle Icon" 
                  className="w-10 h-10 object-contain"
                />
              </motion.div>
            </motion.div>

            {/* Elegant Typography */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-6 text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-black dark:text-white tracking-tight"
            >
              We Empower Businesses with{' '}
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-medium"
                style={{ backgroundSize: '200% 200%' }}
              >
                Innovative AI Solutions
              </motion.span>
            </motion.h1>
            
            {/* Refined Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-16 text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light"
            >
              AI solutions for streamlined operations, enhanced decisions, and scalable growth. 
              We unlock your full potential with intelligent automation and data-driven insights.
            </motion.p>
            
            {/* Single Elegant CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mb-20"
            >
              <motion.button
                onClick={() => setCurrentMode('play')}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Playing
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.div>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.button>
            </motion.div>

            {/* Minimalist Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              {[
                {
                  icon: Brain,
                  title: "AI-Powered",
                  description: "Smart word generation"
                },
                {
                  icon: Zap,
                  title: "Instant Play",
                  description: "No setup required"
                },
                {
                  icon: Target,
                  title: "Adaptive",
                  description: "Difficulty scaling"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"
                  >
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </GridBeam>

        {/* Secondary Actions - Enhanced Design */}
        <GridBeam className="container relative z-30 pb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="text-center"
          >
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 font-light">
              Choose your experience
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-lg mx-auto">
              <motion.button
                onClick={() => setCurrentMode('play')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-full sm:w-48 px-8 py-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/30 rounded-xl hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center justify-center">
                  <Brain className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    AI Challenge
                  </span>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 w-0 group-hover:w-full transition-all duration-300"
                />
              </motion.button>

              <motion.button
                onClick={() => setCurrentMode('create')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-full sm:w-48 px-8 py-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/30 rounded-xl hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-3 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    Custom Game
                  </span>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 w-0 group-hover:w-full transition-all duration-300"
                />
              </motion.button>
            </div>
          </motion.div>
        </GridBeam>
      </main>

      <Footer />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </GridBeam>
  );
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
