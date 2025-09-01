'use client';
import React from 'react';
import { MessageCircle, Clock, User } from 'lucide-react';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video';
  created_at: string;
}

interface Conversation {
  id: string;
  participants: string[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface ConversationCardProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick?: (conversation: Conversation) => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ 
  conversation, 
  isActive = false, 
  onClick 
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Ahora';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-ES');
  };

  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getParticipantNames = () => {
    // Simulación de nombres de participantes
    const names = ['Juan Pérez', 'María García', 'Carlos López'];
    return names.slice(0, Math.min(conversation.participants.length, 3)).join(', ');
  };

  return (
    <div
      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
        isActive 
          ? 'bg-blue-50 border-l-4 border-l-blue-500' 
          : 'hover:bg-gray-50'
      }`}
      onClick={() => onClick?.(conversation)}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar del grupo */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageCircle className="text-blue-600" size={20} />
          </div>
        </div>

        {/* Contenido de la conversación */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-gray-800 truncate">
              {getParticipantNames()}
            </h4>
            <div className="flex items-center space-x-2">
              {conversation.last_message && (
                <span className="text-xs text-gray-500">
                  {formatTime(conversation.last_message.created_at)}
                </span>
              )}
              {conversation.unread_count > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                </span>
              )}
            </div>
          </div>

          {/* Último mensaje */}
          {conversation.last_message ? (
            <div className="flex items-center space-x-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 truncate">
                  {conversation.last_message.message_type === 'text' 
                    ? truncateContent(conversation.last_message.content)
                    : conversation.last_message.message_type === 'image'
                    ? '📷 Imagen'
                    : '🎥 Video'
                  }
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No hay mensajes aún
            </p>
          )}

          {/* Información adicional */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-xs text-gray-500">
              <User size={14} className="mr-1" />
              <span>{conversation.participants.length} participantes</span>
            </div>
            <div className="text-xs text-gray-400">
              {formatTime(conversation.updated_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
