import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from './contexts/AuthContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';

export const metadata: Metadata = {
    title: 'Manadabook - Ecosistema para Mascotas',
    description: 'Ecosistema completo para el bienestar de tu mascota con red social y marketplace',
    // PWA Meta Tags
    manifest: '/manifest.json',
    themeColor: '#3b82f6',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
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
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='es'>
            <body>
                <AuthProvider>
                    {children}
                    <PWAInstallPrompt />
                </AuthProvider>
            </body>
        </html>
    );
}
