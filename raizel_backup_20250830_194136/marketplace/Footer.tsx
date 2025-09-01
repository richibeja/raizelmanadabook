'use client';

import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} ManadaBook. Todos los derechos reservados.</p>
        <nav className="footer-links">
          <Link href="/legal/terms">Términos y Condiciones</Link>
          <Link href="/legal/privacy">Política de Privacidad</Link>
        </nav>
      </div>
    </footer>
  );
}
