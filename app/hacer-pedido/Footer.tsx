'use client';
import React from 'react';
import '../globals.css';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-6 mt-12">
            <div className="max-w-6xl mx-auto text-center">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <h3 className="font-semibold mb-2">📞 Contacto</h3>
                        <p>WhatsApp: +57 310 818 8723</p>
                        <p>Email: contactoraizel@gmail.com</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">📍 Ubicación</h3>
                        <p>Subía, Cundinamarca</p>
                        <p>Colombia 🇨🇴</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">🌐 Redes Sociales</h3>
                        <p>Instagram: @somosraizel</p>
                        <p>TikTok: @raizeloficial</p>
                    </div>
                </div>
                <div className="border-t border-gray-600 pt-4">
                    <p>&copy; 2024 Raízel. Todos los derechos reservados.</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Alimentación 100% natural • Hecho en Colombia • Sin químicos ni conservantes
                    </p>
                </div>
            </div>
        </footer>
    );
}