import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from './contexts/AuthContext';

export const metadata: Metadata = {
    title: 'Manadabook - Ecosistema para Mascotas',
    description: 'Ecosistema completo para el bienestar de tu mascota con red social y marketplace'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='es'>
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
