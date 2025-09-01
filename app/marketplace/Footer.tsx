import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../globals.css';
'use client';

import Link from 'next/link';
import './@/;

export default function @/app/components/Footer() {
  return (
    <@/app/components/Footer className="main-@/app/components/Footer">
      <div className="@/app/components/Footer-content">
        <p>&copy; {new Date().getFullYear()} ManadaBook. Todos los derechos reservados.</p>
        <nav className="@/app/components/Footer-links">
          <Link href="/legal/terms">Términos y Condiciones</Link>
          <Link href="/legal/privacy">Política de Privacidad</Link>
        </nav>
      </div>
    </@/app/components/Footer>
  );
}




