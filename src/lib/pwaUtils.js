/**
 * PWA Utilities for Ri-Puzzle
 * Handles PWA detection, installation, and offline capabilities
 */

export class PWAUtils {
  static isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://') ||
           localStorage.getItem('pwa-installed') === 'true';
  }

  static isPWASupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  static isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  static isAndroid() {
    return /Android/.test(navigator.userAgent);
  }

  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static async checkInstallability() {
    if (this.isInstalled()) {
      return { canInstall: false, reason: 'already_installed' };
    }

    if (this.isIOS()) {
      return { 
        canInstall: true, 
        method: 'manual', 
        platform: 'ios',
        instructions: 'Add to Home Screen via Safari share menu'
      };
    }

    // Check for beforeinstallprompt support
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ canInstall: false, reason: 'not_supported' });
      }, 3000);

      window.addEventListener('beforeinstallprompt', (e) => {
        clearTimeout(timeout);
        resolve({ 
          canInstall: true, 
          method: 'automatic', 
          platform: 'chrome',
          prompt: e
        });
      }, { once: true });
    });
  }

  static async installPWA(deferredPrompt) {
    if (!deferredPrompt) {
      throw new Error('No install prompt available');
    }

    try {
      const result = await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true');
        this.trackEvent('pwa_install_success');
        return { success: true, outcome };
      } else {
        this.trackEvent('pwa_install_dismissed');
        return { success: false, outcome };
      }
    } catch (error) {
      this.trackEvent('pwa_install_error', { error: error.message });
      throw error;
    }
  }

  static trackEvent(eventName, data = {}) {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'PWA',
        ...data
      });
    }

    // Console logging for development
    console.log(`PWA Event: ${eventName}`, data);
  }

  static async getNetworkStatus() {
    return {
      online: navigator.onLine,
      connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
      effectiveType: navigator.connection?.effectiveType || 'unknown',
      downlink: navigator.connection?.downlink || 0,
      rtt: navigator.connection?.rtt || 0
    };
  }

  static registerNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 App is online');
      this.trackEvent('network_online');
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      console.log('📱 App is offline');
      this.trackEvent('network_offline');
    });

    // Connection change listener
    if (navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        const connection = navigator.connection;
        console.log(`📶 Connection changed: ${connection.effectiveType}`);
        this.trackEvent('network_change', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      });
    }
  }

  static async syncOfflineData() {
    try {
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('game-data-sync');
        console.log('📤 Background sync registered');
      }
    } catch (error) {
      console.error('❌ Background sync registration failed:', error);
    }
  }

  static async cacheGameData(gameData) {
    try {
      const cache = await caches.open('ri-puzzle-game-data');
      const response = new Response(JSON.stringify(gameData));
      await cache.put('/game-data', response);
      console.log('💾 Game data cached');
    } catch (error) {
      console.error('❌ Failed to cache game data:', error);
    }
  }

  static async getCachedGameData() {
    try {
      const cache = await caches.open('ri-puzzle-game-data');
      const response = await cache.match('/game-data');
      if (response) {
        const data = await response.json();
        console.log('📁 Retrieved cached game data');
        return data;
      }
    } catch (error) {
      console.error('❌ Failed to retrieve cached game data:', error);
    }
    return null;
  }

  static async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('❌ Notifications not supported');
      return 'not-supported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.trackEvent('notification_permission', { permission });
      return permission;
    } catch (error) {
      console.error('❌ Notification permission request failed:', error);
      return 'error';
    }
  }

  static async showNotification(title, options = {}) {
    const permission = await this.requestNotificationPermission();
    
    if (permission !== 'granted') {
      console.log('❌ Notification permission not granted');
      return false;
    }

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          icon: '/icon-192x192.png',
          badge: '/icon-96x96.png',
          vibrate: [200, 100, 200],
          ...options
        });
        return true;
      } else {
        // Fallback for browsers without service worker
        new Notification(title, {
          icon: '/icon-192x192.png',
          ...options
        });
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to show notification:', error);
      return false;
    }
  }

  static async subscribeToNotifications() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY || '')
      });

      console.log('🔔 Push subscription successful');
      this.trackEvent('push_subscription_success');
      return subscription;
    } catch (error) {
      console.error('❌ Push subscription failed:', error);
      this.trackEvent('push_subscription_error', { error: error.message });
      return null;
    }
  }

  static urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  static async shareGameResult(gameData) {
    const shareData = {
      title: 'Ri-Puzzle Game Result',
      text: `I just completed a word puzzle in ${gameData.attempts} attempts! Score: ${gameData.score}`,
      url: window.location.href
    };

    try {
      if (navigator.share && this.isMobile()) {
        await navigator.share(shareData);
        this.trackEvent('share_success', { method: 'native' });
        return true;
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        this.trackEvent('share_success', { method: 'clipboard' });
        return true;
      }
    } catch (error) {
      console.error('❌ Share failed:', error);
      this.trackEvent('share_error', { error: error.message });
      return false;
    }
  }

  static async getStorageUsage() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage,
          available: estimate.quota,
          usedMB: Math.round(estimate.usage / 1024 / 1024 * 100) / 100,
          availableMB: Math.round(estimate.quota / 1024 / 1024 * 100) / 100,
          usagePercentage: Math.round((estimate.usage / estimate.quota) * 100)
        };
      }
    } catch (error) {
      console.error('❌ Failed to get storage usage:', error);
    }
    return null;
  }

  static async clearAppCache() {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('🗑️ App cache cleared');
      this.trackEvent('cache_cleared');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
      return false;
    }
  }

  static async updateServiceWorker() {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        console.log('🔄 Service worker update triggered');
        return true;
      }
    } catch (error) {
      console.error('❌ Service worker update failed:', error);
    }
    return false;
  }

  static getDisplayMode() {
    if (this.isInstalled()) {
      return 'standalone';
    }
    
    if (window.matchMedia('(display-mode: minimal-ui)').matches) {
      return 'minimal-ui';
    }
    
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
      return 'fullscreen';
    }
    
    return 'browser';
  }

  static setupPWAEventListeners() {
    // Install prompt listener
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('💾 PWA install prompt available');
      this.trackEvent('install_prompt_available');
    });

    // App installed listener
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      this.trackEvent('app_installed');
      localStorage.setItem('pwa-installed', 'true');
    });

    // Display mode change listener
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      if (e.matches) {
        console.log('📱 Switched to standalone mode');
        this.trackEvent('display_mode_standalone');
      } else {
        console.log('🌐 Switched to browser mode');
        this.trackEvent('display_mode_browser');
      }
    });

    // Register network listeners
    this.registerNetworkListeners();
  }

  static init() {
    console.log('🚀 Initializing PWA utilities...');
    
    // Setup event listeners
    this.setupPWAEventListeners();
    
    // Log current state
    console.log('PWA Status:', {
      installed: this.isInstalled(),
      supported: this.isPWASupported(),
      platform: this.isIOS() ? 'iOS' : this.isAndroid() ? 'Android' : 'Desktop',
      displayMode: this.getDisplayMode(),
      online: navigator.onLine
    });
    
    this.trackEvent('pwa_init', {
      installed: this.isInstalled(),
      platform: this.isIOS() ? 'iOS' : this.isAndroid() ? 'Android' : 'Desktop',
      displayMode: this.getDisplayMode()
    });
  }
}

// Auto-initialize when module is loaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    PWAUtils.init();
  });
}