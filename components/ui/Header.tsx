'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Plus, User, Menu, X } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className={`bg-white border-b border-neutral-200 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐾</span>
              </div>
              <span className="text-xl font-bold text-neutral-900 hidden sm:block">
                RaízSocial
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/feed" 
              className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Feed
            </Link>
            <Link 
              href="/adoptions" 
              className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Adopciones
            </Link>
            <Link 
              href="/events" 
              className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Eventos
            </Link>
            <Link 
              href="/groups" 
              className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Grupos
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={toggleSearch}
              className="p-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button
              className="p-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-100 rounded-lg transition-colors duration-200 relative"
              aria-label="Notificaciones"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full"></span>
            </button>

            {/* Create Post */}
            <button
              className="p-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
              aria-label="Crear publicación"
            >
              <Plus size={20} />
            </button>

            {/* User Profile */}
            <button
              className="p-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
              aria-label="Perfil de usuario"
            >
              <User size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
              aria-label="Menú móvil"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar en RaízSocial..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-neutral-400" size={20} />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200">
            <nav className="py-4 space-y-2">
              <Link 
                href="/feed" 
                className="block px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Feed
              </Link>
              <Link 
                href="/adoptions" 
                className="block px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Adopciones
              </Link>
              <Link 
                href="/events" 
                className="block px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Eventos
              </Link>
              <Link 
                href="/groups" 
                className="block px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Grupos
              </Link>
            </nav>
            
            <div className="border-t border-neutral-200 pt-4 px-4 space-y-2">
              <button
                onClick={toggleSearch}
                className="flex items-center w-full px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
              >
                <Search size={20} className="mr-3" />
                Buscar
              </button>
              <button className="flex items-center w-full px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg transition-colors duration-200">
                <Bell size={20} className="mr-3" />
                Notificaciones
              </button>
              <button className="flex items-center w-full px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg transition-colors duration-200">
                <Plus size={20} className="mr-3" />
                Crear publicación
              </button>
              <button className="flex items-center w-full px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg transition-colors duration-200">
                <User size={20} className="mr-3" />
                Mi perfil
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
