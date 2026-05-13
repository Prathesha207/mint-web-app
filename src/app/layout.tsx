import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// PWA Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://localhost:3000'),
  title: "DIME - Dynamic Inspection Metrology & Evaluation",
  description: "Industrial AI platform for anomaly detection and quality inspection. Train and deploy computer vision models for real-time monitoring.",
  keywords: ["AI", "Computer Vision", "Anomaly Detection", "Industrial Inspection", "Metrology", "Quality Control"],
  authors: [{ name: "DIME AI" }],
  creator: "DIME AI",
  publisher: "DIME AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DIME - Dynamic Inspection Metrology & Evaluation',
    description: 'Industrial AI platform for anomaly detection and quality inspection',
    creator: '@dime_ai',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dime-ai.com',
    title: 'DIME - Dynamic Inspection Metrology & Evaluation',
    description: 'Industrial AI platform for anomaly detection and quality inspection',
    siteName: 'DIME AI Platform',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DIME AI Platform',
      },
    ],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: ['/favicon.ico'],
  },
};

// PWA Viewport settings
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  colorScheme: 'dark light',
};

// Mouse Following Object Component
import MouseFollower from './mint/components/MouseFollower';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="DIME AI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DIME AI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* iOS Splash Screen Colors */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Additional PWA Optimizations */}
        <link rel="apple-touch-startup-image" href="/splash.png" />

        {/* Theme Color for Chrome, Firefox OS and Opera */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-navbutton-color" content="#0f172a" />

        {/* iOS Status Bar Style */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white overflow-x-hidden`}
      >
        <MouseFollower />

        {/* Main Content */}
        {children}

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
              
            `,
          }}
        />

      </body>
    </html>
  );
}