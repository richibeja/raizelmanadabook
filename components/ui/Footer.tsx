'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    mascotas: [
      { name: 'Buscar Mascotas', href: '/mascotas' },
      { name: 'Adoptar', href: '/adoptar' },
      { name: 'Dar en Adopción', href: '/dar-adopcion' },
      { name: 'Historias de Éxito', href: '/historias' },
    ],
    comunidad: [
      { name: 'Foro', href: '/foro' },
      { name: 'Eventos', href: '/eventos' },
      { name: 'Grupos', href: '/grupos' },
      { name: 'Blog', href: '/blog' },
    ],
    recursos: [
      { name: 'Guías de Cuidado', href: '/guias' },
      { name: 'Veterinarios', href: '/veterinarios' },
      { name: 'Tienda', href: '/tienda' },
      { name: 'Donaciones', href: '/donaciones' },
    ],
    empresa: [
      { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
      { name: 'Contacto', href: '/contacto' },
      { name: 'Privacidad', href: '/privacidad' },
      { name: 'Términos', href: '/terminos' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  return (
    <footer className={cn("bg-[#0B1220] text-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-4">
              <Heart className="w-8 h-8 text-[#FF7A59] mr-3" />
              <h3 className="text-2xl font-bold">Raizel</h3>
            </div>
            <p className="text-[#9CA3AF] mb-6 leading-relaxed">
              Conectamos mascotas que buscan un hogar con personas que buscan un compañero. 
              Juntos creamos historias de amor y felicidad.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-[#9CA3AF]">
                <Mail className="w-4 h-4 mr-3" />
                <span>hola@raizel.com</span>
              </div>
              <div className="flex items-center text-[#9CA3AF]">
                <Phone className="w-4 h-4 mr-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-[#9CA3AF]">
                <MapPin className="w-4 h-4 mr-3" />
                <span>Madrid, España</span>
              </div>
            </div>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([section, links], index) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4 capitalize">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-[#9CA3AF] hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-[#1F2937] mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-[#9CA3AF] text-sm">
              © {currentYear} Raizel. Todos los derechos reservados.
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-[#1F2937] rounded-full text-[#9CA3AF] hover:text-white hover:bg-[#374151] transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
