'use client';
import React from 'react';
import Image from 'next/image';
import { Clock, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video';
  created_at: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showTimestamp?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwnMessage, 
  showTimestamp = true 
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStatus = () => {
    // Simulación de estados de mensaje
    const random = Math.random();
    if (random < 0.3) return 'sent';
    if (random < 0.7) return 'delivered';
    return 'read';
  };

  const renderStatusIcon = () => {
    const status = getMessageStatus();
    switch (status) {
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-200 text-gray-800 rounded-bl-md'
          }`}
        >
          {/* Contenido del mensaje */}
          <div className="break-words">
            {message.message_type === 'text' ? (
              <p className="text-sm leading-relaxed">{message.content}</p>
            ) : message.message_type === 'image' ? (
              <div className="relative w-full max-w-xs">
                <Image
                  src={message.content}
                  alt="Imagen del mensaje"
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-lg"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            ) : (
              <div className="relative">
                <video
                  src={message.content}
                  controls
                  className="w-full h-auto rounded-lg max-w-xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* Timestamp y estado */}
        {showTimestamp && (
          <div className={`flex items-center justify-end mt-1 space-x-1 ${
            isOwnMessage ? 'order-1' : 'order-2'
          }`}>
            <span className="text-xs text-gray-500">
              {formatTime(message.created_at)}
            </span>
            {isOwnMessage && (
              <div className="ml-1">
                {renderStatusIcon()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
