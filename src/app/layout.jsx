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
    statusBarStyle: 'black-translucent',
    title: 'Ri-Puzzle',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Ri-Puzzle | AI-Powered Word Guessing Game',
    description: 'Challenge yourself with AI-generated word puzzles or create custom games.',
    siteName: 'Ri-Puzzle',
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
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Ri-Puzzle" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ri-Puzzle" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Theme Colors */}
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: dark)" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        
        {/* Standard Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/icon-192x192.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                  })
                  .then(function(registration) {
                    console.log('✅ SW registered:', registration.scope);
                    
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 New SW version available');
                            if (confirm('New version available. Update now?')) {
                              newWorker.postMessage({ type: 'SKIP_WAITING' });
                              window.location.reload();
                            }
                          }
                        });
                      }
                    });
                  })
                  .catch(function(err) {
                    console.log('❌ SW registration failed:', err);
                  });
                });

                navigator.serviceWorker.addEventListener('message', (event) => {
                  if (event.data && event.data.type === 'SW_UPDATED') {
                    window.location.reload();
                  }
                });
              }

              // PWA Install Prompt
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                window.dispatchEvent(new CustomEvent('canInstallPWA', { detail: e }));
              });

              window.addEventListener('appinstalled', () => {
                console.log('✅ PWA installed');
                window.dispatchEvent(new CustomEvent('appInstalled'));
              });

              // Theme initialization
              try {
                const theme = localStorage.getItem('word-puzzle-theme') || 
                             (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                console.log('Theme init failed:', e);
              }
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

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Ri-Puzzle",
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
                "Progressive Web App"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}