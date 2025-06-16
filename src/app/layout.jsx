import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../contexts/ThemeContext';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Ri-Puzzle | AI-Powered Word Guessing Game',
  description: 'Challenge yourself with AI-generated word puzzles or create custom games. A modern, progressive web app for word game enthusiasts.',
  keywords: 'word puzzle, word game, AI, guessing game, brain training, custom puzzles, PWA, offline game',
  authors: [{ name: 'Sadhef' }],
  creator: 'Sadhef',
  publisher: 'Sadhef',
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ri-Puzzle',
    startupImage: [
      {
        url: '/icon-512x512.png',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
      }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Ri-Puzzle | AI-Powered Word Guessing Game',
    description: 'Challenge yourself with AI-generated word puzzles or create custom games.',
    siteName: 'Ri-Puzzle',
    url: 'https://your-domain.com',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Ri-Puzzle Game'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ri-Puzzle | AI-Powered Word Guessing Game',
    description: 'Challenge yourself with AI-generated word puzzles or create custom games.',
    images: ['/icon-512x512.png'],
    creator: '@yourusername'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Essential PWA Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="application-name" content="Ri-Puzzle" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ri-Puzzle" />
        <meta name="description" content="AI-powered word puzzle game with offline support" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Theme Colors */}
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: dark)" />

        {/* Apple Touch Icons - Multiple Sizes */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />

        {/* Apple Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icon-512x512.png" 
              media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icon-512x512.png" 
              media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icon-512x512.png" 
              media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        
        {/* Standard Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/icon-192x192.png" />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/icon-192x192.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker Registration with Error Handling
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                  })
                  .then(function(registration) {
                    console.log('✅ Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                          // New version available
                          console.log('🔄 New version available');
                          if (confirm('A new version is available. Update now?')) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                          }
                        }
                      });
                    });
                  })
                  .catch(function(registrationError) {
                    console.log('❌ Service Worker registration failed:', registrationError);
                  });
                });

                // Handle service worker messages
                navigator.serviceWorker.addEventListener('message', (event) => {
                  if (event.data && event.data.type === 'SW_UPDATED') {
                    window.location.reload();
                  }
                });
              } else {
                console.log('❌ Service Worker not supported');
              }

              // Handle app installation
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                console.log('💾 Install prompt triggered');
                e.preventDefault();
                deferredPrompt = e;
                window.dispatchEvent(new CustomEvent('canInstallPWA', { detail: e }));
              });

              window.addEventListener('appinstalled', (evt) => {
                console.log('✅ PWA was installed');
                window.dispatchEvent(new CustomEvent('appInstalled'));
              });

              // Prevent zoom on iOS
              document.addEventListener('gesturestart', function (e) {
                e.preventDefault();
              });
            `,
          }}
        />

        {/* Performance and Accessibility */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent FOUC (Flash of Unstyled Content)
              document.documentElement.classList.add('js-enabled');
              
              // Set initial theme based on preference
              try {
                const theme = localStorage.getItem('word-puzzle-theme') || 
                             (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                console.log('Theme initialization failed:', e);
              }

              // Preload critical fonts
              const fontLink = document.createElement('link');
              fontLink.rel = 'stylesheet';
              fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap';
              fontLink.media = 'print';
              fontLink.onload = function() { this.media = 'all'; };
              document.head.appendChild(fontLink);
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <div id="root">
            {children}
            <PWAInstallPrompt />
          </div>
        </ThemeProvider>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Ri-Puzzle",
              "url": "https://your-domain.com",
              "description": "AI-powered word puzzle game with offline support",
              "applicationCategory": "GameApplication",
              "operatingSystem": "Any",
              "browserRequirements": "Requires JavaScript",
              "author": {
                "@type": "Person",
                "name": "Sadhef"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "AI-generated word puzzles",
                "Custom game creation",
                "Offline gameplay",
                "Progressive Web App",
                "Cross-platform compatibility"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}