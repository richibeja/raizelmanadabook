import './globals.css';
import './router-config'; // Suprimir warnings de React Router
import type { Metadata } from 'next';
import { AuthProvider } from './contexts/AuthContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Raízel - Ecosistema para Mascotas',
    description: 'Ecosistema completo para el bienestar de tu mascota con red social y marketplace',
    keywords: ['mascotas', 'perros', 'gatos', 'alimentos naturales', 'red social', 'BARF', 'pellets'],
    authors: [{ name: 'Raízel Team' }],
    creator: 'Raízel',
    publisher: 'Raízel',
    // PWA Meta Tags
    manifest: '/api/manifest',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Raízel',
      startupImage: [
        {
          url: '/icon-512x512.svg',
          media: '(device-width: 768px) and (device-height: 1024px)',
        },
      ],
    },
    formatDetection: {
      telephone: false,
      date: false,
      address: false,
      email: false,
      url: false,
    },
    openGraph: {
      type: 'website',
      siteName: 'Raízel',
      title: 'Raízel - Ecosistema para Mascotas',
      description: 'Ecosistema completo para el bienestar de tu mascota con red social y marketplace',
      url: 'https://raizelmanadabook.vercel.app',
      images: [
        {
          url: '/icon-512x512.svg',
          width: 512,
          height: 512,
          alt: 'Raízel - Ecosistema para Mascotas',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Raízel - Ecosistema para Mascotas',
      description: 'Ecosistema completo para el bienestar de tu mascota con red social y marketplace',
      images: ['/icon-512x512.svg'],
    },
    icons: {
      icon: [
        { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        { url: '/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { url: '/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { url: '/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
      ],
      shortcut: '/favicon.svg',
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
    verification: {
      google: 'your-google-verification-code',
    },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#059669',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='es' className="h-full">
            <head>
                {/* PWA Meta Tags adicionales */}
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="msapplication-TileColor" content="#059669" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
                
                {/* Preload de recursos críticos */}
                <link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml" />
                <link rel="preload" href="/icon-192x192.svg" as="image" type="image/svg+xml" />
                
                {/* DNS Prefetch para mejor rendimiento */}
                <link rel="dns-prefetch" href="//fonts.googleapis.com" />
                <link rel="dns-prefetch" href="//images.unsplash.com" />
            </head>
            <body className="h-full font-sans antialiased bg-gray-50">
                <AuthProvider>
                    {children}
                    <PWAInstallPrompt />
                </AuthProvider>
                
                {/* Service Worker Registration */}
                <Script
                    id="sw-registration"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker.register('/sw.js')
                                        .then(function(registration) {
                                            console.log('SW registrado correctamente:', registration.scope);
                                        })
                                        .catch(function(error) {
                                            console.log('Error al registrar SW:', error);
                                        });
                                });
                            }
                        `,
                    }}
                />
            </body>
        </html>
    );
}
