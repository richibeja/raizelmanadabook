import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'RaízSocial',
    description: 'Ecosistema completo para el bienestar de tu mascota'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='es'>
            <body>{children}</body>
        </html>
    );
}
