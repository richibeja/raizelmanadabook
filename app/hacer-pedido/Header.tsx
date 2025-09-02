'use client';
import React from 'react';
import '../globals.css';

export default function Header() {
    return (
        <header className="bg-green-600 text-white p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold">🐾 Raízel</h1>
                <p className="text-green-100">Alimentación 100% natural para mascotas</p>
            </div>
        </header>
    );
}
