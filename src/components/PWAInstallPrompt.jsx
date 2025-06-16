"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Monitor, Share, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function PWAInstallPrompt() {
  const { isDark } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installSource, setInstallSource] = useState('');
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                            window.navigator.standalone === true ||
                            document.referrer.includes('android-app://');
    setIsStandalone(isStandaloneMode);

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = /mobile|tablet/.test(userAgent);
    
    setIsIOS(isiOS);

    // Determine install source
    if (isiOS) {
      setInstallSource('ios');
    } else if (isAndroid) {
      setInstallSource('android');
    } else {
      setInstallSource('desktop');
    }

    // Handle beforeinstallprompt event (Chrome/Edge on Android/Desktop)
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      
      // Show prompt logic
      const shouldShow = checkShouldShowPrompt();
      if (shouldShow) {
        setTimeout(() => setShowPrompt(true), 2000); // Delay for better UX
      }
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
      setCanInstall(false);
      localStorage.setItem('pwa-installed', 'true');
      
      // Track installation
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
          event_category: 'PWA',
          event_label: installSource
        });
      }
    };

    // Check if PWA is installable on iOS
    const checkIOSInstallable = () => {
      if (isiOS && !isStandaloneMode) {
        const hasBeenPrompted = localStorage.getItem('ios-install-prompted');
        const lastPrompted = localStorage.getItem('ios-install-last-prompted');
        const now = Date.now();
        
        // Show iOS prompt if not prompted before or after 7 days
        if (!hasBeenPrompted || (lastPrompted && now - parseInt(lastPrompted) > 7 * 24 * 60 * 60 * 1000)) {
          setTimeout(() => setShowPrompt(true), 3000);
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check iOS installability
    checkIOSInstallable();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [installSource]);

  const checkShouldShowPrompt = () => {
    // Don't show if already installed
    if (isStandalone || localStorage.getItem('pwa-installed')) {
      return false;
    }

    // Check user preferences
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    const lastShown = localStorage.getItem('pwa-prompt-last-shown');
    const dismissCount = parseInt(localStorage.getItem('pwa-dismiss-count') || '0');
    const now = Date.now();

    // Don't show if dismissed more than 3 times
    if (dismissCount >= 3) {
      return false;
    }

    // Don't show if dismissed recently (less than 3 days)
    if (dismissed && lastShown && now - parseInt(lastShown) < 3 * 24 * 60 * 60 * 1000) {
      return false;
    }

    return true;
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        // Show the install prompt
        const result = await deferredPrompt.prompt();
        console.log('PWA: Install prompt result:', result);
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log('PWA: User choice:', outcome);
        
        if (outcome === 'accepted') {
          console.log('PWA: User accepted the install prompt');
          localStorage.setItem('pwa-installed', 'true');
        } else {
          console.log('PWA: User dismissed the install prompt');
          handleDismiss();
        }
        
        setDeferredPrompt(null);
        setShowPrompt(false);
      } catch (error) {
        console.error('PWA: Error during installation:', error);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    const dismissCount = parseInt(localStorage.getItem('pwa-dismiss-count') || '0');
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    localStorage.setItem('pwa-prompt-last-shown', Date.now().toString());
    localStorage.setItem('pwa-dismiss-count', (dismissCount + 1).toString());

    if (isIOS) {
      localStorage.setItem('ios-install-prompted', 'true');
      localStorage.setItem('ios-install-last-prompted', Date.now().toString());
    }
  };

  const getInstallInstructions = () => {
    if (isIOS) {
      return {
        title: "Add to Home Screen",
        steps: [
          { icon: Share, text: "Tap the Share button in Safari" },
          { icon: Plus, text: 'Tap "Add to Home Screen"' },
          { icon: Download, text: 'Tap "Add" to install' }
        ]
      };
    } else if (installSource === 'android') {
      return {
        title: "Install App",
        steps: [
          { icon: Download, text: "Tap Install when prompted" },
          { icon: Smartphone, text: "Or use browser menu > 'Add to Home screen'" }
        ]
      };
    } else {
      return {
        title: "Install Desktop App",
        steps: [
          { icon: Download, text: "Click Install when prompted" },
          { icon: Monitor, text: "Or use browser menu > 'Install Ri-Puzzle'" }
        ]
      };
    }
  };

  // Don't show if already installed or conditions not met
  if (isStandalone || (!canInstall && !isIOS) || !showPrompt) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`relative rounded-2xl p-5 shadow-2xl border backdrop-blur-lg ${
            isDark 
              ? 'bg-gray-900/95 border-gray-700/50' 
              : 'bg-white/95 border-gray-200/50'
          }`}
        >
          {/* Close Button */}
          <motion.button
            onClick={handleDismiss}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X className="w-4 h-4" />
          </motion.button>

          {/* App Icon and Info */}
          <div className="flex items-start mb-4 pr-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg"
            >
              <img 
                src="/icon-192x192.png" 
                alt="Ri-Puzzle" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-2xl hidden">🧩</span>
            </motion.div>
            <div className="flex-1">
              <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Install Ri-Puzzle
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Get faster access and offline play
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className={`mb-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Offline play</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Faster loading</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>Native experience</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span>No browser tabs</span>
              </div>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className={`mb-4 p-3 rounded-lg ${
            isDark ? 'bg-gray-800/50 border border-gray-700/30' : 'bg-gray-50 border border-gray-200/50'
          }`}>
            <h5 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {instructions.title}:
            </h5>
            <div className="space-y-2">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-center text-xs">
                  <step.icon className="w-3 h-3 mr-2 text-blue-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isIOS && deferredPrompt && (
              <motion.button
                onClick={handleInstallClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Install Now
              </motion.button>
            )}
            
            <motion.button
              onClick={handleDismiss}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`${isIOS || !deferredPrompt ? 'flex-1' : 'px-4'} py-3 text-sm font-medium rounded-xl transition-colors ${
                isDark 
                  ? 'text-gray-300 hover:bg-gray-700 border border-gray-600' 
                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {isIOS ? 'Got it' : 'Later'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}