'use client';
import React from 'react';
import NavigationHub from './components/NavigationHub';
import './globals.css';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            <NavigationHub />
        </div>
    );
}
