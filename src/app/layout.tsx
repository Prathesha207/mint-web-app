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
const MouseFollower = () => {
  // This component will be rendered on the client side
  // The actual implementation is in globals.css for better performance
  return null;
};

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
        {/* Mouse Follower Element */}
        <div id="mouse-follower" className="mouse-follower">
          <div className="mouse-dot"></div>
          <div className="mouse-ring"></div>
          <div className="mouse-sparkle"></div>
        </div>

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
              
              // Mouse follower functionality
              document.addEventListener('DOMContentLoaded', function() {
                const follower = document.getElementById('mouse-follower');
                const dot = follower.querySelector('.mouse-dot');
                const ring = follower.querySelector('.mouse-ring');
                const sparkle = follower.querySelector('.mouse-sparkle');
                
                let mouseX = 0;
                let mouseY = 0;
                let followerX = 0;
                let followerY = 0;
                let ringX = 0;
                let ringY = 0;
                let sparkleX = 0;
                let sparkleY = 0;
                
                const speed = 0.15;
                const ringSpeed = 0.08;
                const sparkleSpeed = 0.12;
                
                document.addEventListener('mousemove', function(e) {
                  mouseX = e.clientX;
                  mouseY = e.clientY;
                  
                  // Add sparkle animation on rapid movement
                  if (Math.abs(mouseX - followerX) > 20 || Math.abs(mouseY - followerY) > 20) {
                    sparkle.style.opacity = '1';
                    sparkle.style.transform = 'translate(-50%, -50%) scale(1)';
                    setTimeout(() => {
                      sparkle.style.opacity = '0';
                      sparkle.style.transform = 'translate(-50%, -50%) scale(0.5)';
                    }, 300);
                  }
                });
                
                function animate() {
                  // Main dot follows mouse directly
                  followerX += (mouseX - followerX) * speed;
                  followerY += (mouseY - followerY) * speed;
                  
                  // Ring follows with delay
                  ringX += (mouseX - ringX) * ringSpeed;
                  ringY += (mouseY - ringY) * ringSpeed;
                  
                  // Sparkle follows with medium delay
                  sparkleX += (mouseX - sparkleX) * sparkleSpeed;
                  sparkleY += (mouseY - sparkleY) * sparkleSpeed;
                  
                  // Apply transforms
                  dot.style.transform = 'translate(' + followerX + 'px, ' + followerY + 'px)';
                  ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px)';
                  sparkle.style.transform = 'translate(' + sparkleX + 'px, ' + sparkleY + 'px) scale(var(--sparkle-scale, 0.5))';
                  
                  requestAnimationFrame(animate);
                }
                
                // Hide on touch devices
                if ('ontouchstart' in window || navigator.maxTouchPoints) {
                  follower.style.display = 'none';
                }
                
                animate();
                
                // Interactive elements highlight
                const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
                interactiveElements.forEach(el => {
                  el.addEventListener('mouseenter', () => {
                    dot.style.transform += ' scale(1.5)';
                    ring.style.transform += ' scale(1.8)';
                  });
                  el.addEventListener('mouseleave', () => {
                    dot.style.transform = dot.style.transform.replace(' scale(1.5)', '');
                    ring.style.transform = ring.style.transform.replace(' scale(1.8)', '');
                  });
                });
              });
            `,
          }}
        />
      </body>
    </html>
  );
}