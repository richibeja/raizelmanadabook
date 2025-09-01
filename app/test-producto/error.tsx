import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../globals.css';
'use client';
export default function ErrorPage() {
  return (
    <div>
      <h1>Ocurrió un error en la sección test-producto</h1>
    </div>
  );
}




