import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../globals.css';
'use client';
export default function ErrorPage() {
  return (
    <div>
      <h1>Ocurri� un error en la secci�n test-producto</h1>
    </div>
  );
}




