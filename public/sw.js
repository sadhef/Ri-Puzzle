const CACHE_NAME = 'ri-puzzle-v1.2.0';
const STATIC_CACHE = 'ri-puzzle-static-v1.2.0';
const DYNAMIC_CACHE = 'ri-puzzle-dynamic-v1.2.0';

// Essential files for offline functionality
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.ico'
];

// Skip these patterns during fetch interception
const SKIP_PATTERNS = [
  '/api/',
  '/_next/webpack-hmr',
  '/_next/static/webpack/',
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://'
];

// Network-first resources
const NETWORK_FIRST = [
  '/api/',
  'https://generativelanguage.googleapis.com/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

self.addEventListener('install', (event) => {
  console.log('🔧 SW: Installing version', CACHE_NAME);
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS.filter(url => url !== '/'));
      })
      .then(() => {
        console.log('✅ SW: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ SW: Installation failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('🚀 SW: Activating version', CACHE_NAME);
  
  event.waitUntil(
    Promise.all([
      // Clear old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('ri-puzzle-') && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE
            )
            .map(cacheName => {
              console.log('🗑️ SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('✅ SW: Activation complete');
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip certain patterns
  if (SKIP_PATTERNS.some(pattern => request.url.includes(pattern))) {
    return;
  }

  // Handle different request types
  if (request.destination === 'document') {
    event.respondWith(handlePageRequest(request));
  } else if (NETWORK_FIRST.some(pattern => request.url.includes(pattern))) {
    event.respondWith(handleNetworkFirst(request));
  } else {
    event.respondWith(handleCacheFirst(request));
  }
});

// Handle page requests with network-first, fallback to cache, then offline page
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('📄 SW: Network failed for page, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page as fallback
    console.log('📱 SW: Returning offline page');
    return caches.match('/offline.html') || new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.status < 400) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('🌐 SW: Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Cache-first strategy
async function handleCacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.status < 400) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('💾 SW: Both cache and network failed:', request.url);
    throw error;
  }
}

// Background sync
self.addEventListener('sync', (event) => {
  console.log('🔄 SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'game-data-sync') {
    event.waitUntil(syncGameData());
  }
});

async function syncGameData() {
  try {
    console.log('📊 SW: Syncing game data...');
    // Add your game data sync logic here
    const gameData = await getStoredGameData();
    if (gameData && gameData.length > 0) {
      // Sync with server when online
      await fetch('/api/sync-game-data', {
        method: 'POST',
        body: JSON.stringify(gameData),
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('❌ SW: Game data sync failed:', error);
  }
}

async function getStoredGameData() {
  // This would get data from IndexedDB or other storage
  return [];
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('🔔 SW: Push notification received');
  
  const options = {
    body: 'New puzzle available!',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: { url: '/' },
    actions: [
      { action: 'open', title: 'Play Now' },
      { action: 'dismiss', title: 'Later' }
    ]
  };

  if (event.data) {
    try {
      const data = event.data.json();
      Object.assign(options, data);
    } catch (e) {
      options.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification('Ri-Puzzle', options)
  );
});

// Notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('👆 SW: Notification clicked');
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if not already open
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('💬 SW: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    // Notify clients about the update
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'SW_UPDATED' });
      });
    });
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('❌ SW: Error occurred:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ SW: Unhandled promise rejection:', event.reason);
});

console.log('✅ SW: Service Worker loaded successfully');