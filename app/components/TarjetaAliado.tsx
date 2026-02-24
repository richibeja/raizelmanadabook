'use client';
import React from 'react';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  ExternalLink
} from 'lucide-react';

interface Affiliate {
  id: string;
  name: string;
  contact_type: 'WhatsApp' | 'Email' | 'Teléfono' | 'Web';
  contact_value: string;
  region: string;
  description: string;
  logo_url?: string | null;
  is_active: boolean;
}

interface TarjetaAliadoProps {
  affiliate: Affiliate;
}

const TarjetaAliado: React.FC<TarjetaAliadoProps> = ({ affiliate }) => {
  // Función para obtener el icono según el tipo de contacto
  const getContactIcon = (contactType: string) => {
    switch (contactType) {
      case 'WhatsApp':
        return <MessageCircle size={20} className="text-green-600" />;
      case 'Email':
        return <Mail size={20} className="text-blue-600" />;
      case 'Teléfono':
        return <Phone size={20} className="text-purple-600" />;
      case 'Web':
        return <Globe size={20} className="text-orange-600" />;
      default:
        return <MessageCircle size={20} className="text-gray-600" />;
    }
  };

  // Función para obtener el color del botón según el tipo de contacto
  const getButtonColor = (contactType: string) => {
    switch (contactType) {
      case 'WhatsApp':
        return 'bg-green-600 hover:bg-green-700';
      case 'Email':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'Teléfono':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'Web':
        return 'bg-orange-600 hover:bg-orange-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  // Función para manejar el contacto según el tipo
  const handleContact = () => {
    switch (affiliate.contact_type) {
      case 'WhatsApp':
        // Abrir WhatsApp con el número
        const whatsappUrl = `https://wa.me/${affiliate.contact_value.replace(/\D/g, '')}`;
        window.open(whatsappUrl, '_blank');
        break;
      case 'Email':
        // Abrir cliente de email
        const emailUrl = `mailto:${affiliate.contact_value}`;
        window.open(emailUrl, '_blank');
        break;
      case 'Teléfono':
        // Abrir teléfono (móvil) o copiar número
        if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
          window.open(`tel:${affiliate.contact_value}`, '_blank');
        } else {
          // En desktop, copiar al portapapeles
          navigator.clipboard.writeText(affiliate.contact_value);
          alert(`Número copiado: ${affiliate.contact_value}`);
        }
        break;
      case 'Web':
        // Abrir sitio web
        window.open(affiliate.contact_value, '_blank');
        break;
    }
  };

  // Función para obtener el texto del botón
  const getButtonText = () => {
    switch (affiliate.contact_type) {
      case 'WhatsApp':
        return 'Chatear por WhatsApp';
      case 'Email':
        return 'Enviar Email';
      case 'Teléfono':
        return 'Llamar';
      case 'Web':
        return 'Visitar Sitio Web';
      default:
        return 'Contactar';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      {/* Header de la tarjeta */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {affiliate.name}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">{affiliate.region}</span>
            </div>
          </div>
          
          {/* Icono del tipo de contacto */}
          <div className="flex-shrink-0 ml-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {getContactIcon(affiliate.contact_type)}
            </div>
          </div>
        </div>
        
        {/* Descripción */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {affiliate.description}
        </p>
      </div>

      {/* Footer con botón de contacto */}
      <div className="p-6 bg-gray-50">
        <button
          onClick={handleContact}
          className={`w-full text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${getButtonColor(affiliate.contact_type)}`}
        >
          {getContactIcon(affiliate.contact_type)}
          <span>{getButtonText()}</span>
          {affiliate.contact_type === 'Web' && <ExternalLink size={16} />}
        </button>
        
        {/* Información adicional del contacto */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            {affiliate.contact_type}: {affiliate.contact_value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TarjetaAliado;
