'use client';
import Link from 'next/link';
import '../globals.css';

export default function MarketplaceFooter() {
  return (
    <footer className="marketplace-footer">
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