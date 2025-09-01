
'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import './ShareButton.css'; // Importar el archivo CSS

interface ShareButtonProps {
  contentId: string;
  contentType: 'post' | 'story' | 'achievement'; // Tipo de contenido a compartir
  // contentOwnerId: string; // Podría ser útil para notificaciones futuras
  // achievementName?: string; // Para compartir logros
}

export default function ShareButton({ contentId, contentType }: ShareButtonProps) {
  const { user: currentUser } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [message, setMessage] = useState('');

  const getShareableUrl = () => {
    const baseUrl = window.location.origin; // Obtiene la URL base de tu app
    let path = '';
    switch (contentType) {
      case 'post':
        path = `/posts/${contentId}`;
        break;
      case 'story':
        path = `/stories/${contentId}`;
        break;
      case 'achievement':
        path = `/profile/${currentUser?.uid}?achievement=${contentId}`;
        break;
      default:
        path = `/content/${contentId}`;
    }
    
    // Añadir el código de referido si el usuario está logueado
    const refCode = currentUser ? `?ref=${currentUser.uid}` : '';
    return `${baseUrl}${path}${refCode}`;
  };

  const handleCopyLink = () => {
    const url = getShareableUrl();
    navigator.clipboard.writeText(url);
    setMessage('¡Enlace copiado!');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleShareExternal = (platform: 'whatsapp' | 'facebook' | 'twitter') => {
    const url = getShareableUrl();
    const text = `¡Mira esto en ManadaBook!`; // Puedes personalizar el texto
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
    }
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="share-container">
      <button onClick={() => setShowOptions(!showOptions)} className="share-button">
        Compartir
      </button>

      {showOptions && (
        <div className="share-options">
          <button onClick={handleCopyLink}>Copiar Enlace</button>
          <button onClick={() => handleShareExternal('whatsapp')}>WhatsApp</button>
          <button onClick={() => handleShareExternal('facebook')}>Facebook</button>
          <button onClick={() => handleShareExternal('twitter')}>Twitter</button>
          {/* Opción de compartir dentro de ManadaBook (placeholder) */}
          <button onClick={() => setMessage('Compartir dentro de ManadaBook (próximamente)')}>Dentro de ManadaBook</button>
          {message && <p className="share-message">{message}</p>}
        </div>
      )}
    </div>
  );
}
