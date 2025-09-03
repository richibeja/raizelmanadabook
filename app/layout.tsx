import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from './contexts/AuthContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';

export const metadata: Metadata = {
    title: 'Manadabook - Ecosistema para Mascotas',
    description: 'Ecosistema completo para el bienestar de tu mascota con red social y marketplace',
    // PWA Meta Tags
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'ManadaBook',
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: 'website',
      siteName: 'ManadaBook',
      title: 'ManadaBook - Red Social para Mascotas',
      description: 'La red social definitiva para amantes de las mascotas',
    },
    twitter: {
      card: 'summary',
      title: 'ManadaBook - Red Social para Mascotas',
      description: 'La red social definitiva para amantes de las mascotas',
    },
    icons: {
      icon: [
        { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      ],
    },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#3b82f6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='es' className="h-full">
            <body className="h-full font-sans antialiased">
                <AuthProvider>
                    {children}
                    <PWAInstallPrompt />
                </AuthProvider>
            </body>
        </html>
    );
}
