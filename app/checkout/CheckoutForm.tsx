import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../globals.css';
'use client';
import React from 'react';

export default function CheckoutForm() {
    return (
        <form>
            <input type='text' placeholder='Nombre' />
            <input type='email' placeholder='Correo' />
            <button type='submit'>Enviar</button>
        </form>
    );
}
