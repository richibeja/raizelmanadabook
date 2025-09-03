import React from 'react';
import Link from 'next/link';
import { Menu, Search, Bell, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <span className="text-white text-lg">🐾</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                            ManadaBook
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/feed" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            Feed
                        </Link>
                        <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            Marketplace
                        </Link>
                        <Link href="/circles" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            Círculos
                        </Link>
                        <Link href="/pets" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            Mascotas
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Search size={20} />
                        </button>
                        
                        {/* Notifications */}
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        
                        {/* Profile */}
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <User size={20} />
                        </button>
                        
                        {/* Mobile menu */}
                        <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}