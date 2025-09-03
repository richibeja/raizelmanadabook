"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical, Users, Settings } from 'lucide-react';
import { useConversations, useMessages, useWebSocket } from '../../hooks/useConversations';
import MessageBubble from '../../components/MessageBubble';
import { Message, Conversation } from '../../hooks/useConversations';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  
  const { } = useConversations();
  const { 
    messages, 
    loading, 
    error
  } = useMessages(conversationId);
  
  const [currentUserId] = useState('550e8400-e29b-41d4-a716-446655440001'); // Mock user ID
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // WebSocket connection
  // const { isConnected, lastMessage } = useWebSocket(currentUserId);

  useEffect(() => {
    if (conversationId) {
      // Fetch conversation details
      // fetchConversations({ user_id: currentUserId }).then(() => {
      // Find the specific conversation
      // In a real app, you'd have a separate endpoint for this
      const conv: Conversation = {
        id: conversationId,
        participants: [currentUserId, '550e8400-e29b-41d4-a716-446655440002'],
        unread_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setConversation(conv);
      // });

      // Fetch messages
      // fetchMessages({ 
      //   conversation_id: conversationId,
      //   limit: 50,
      //   sort: 'created_at',
      //   order: 'desc'
      // });
    }
  }, [conversationId, currentUserId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Handle real-time messages (placeholder)
    // if (lastMessage && lastMessage.data?.conversation_id === conversationId) {
    //   Add new message to the list
    //   In a real app, you'd update the messages state
    //   console.log('New real-time message:', lastMessage);
    // }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      // await sendMessage({
      //   conversation_id: conversationId,
      //   sender_id: currentUserId,
      //   content: newMessage,
      //   message_type: 'text',
      //   reply_to_id: replyToMessage?.id
      // });
      
      console.log('Mensaje enviado (mock):', newMessage);
      setNewMessage('');
      setReplyToMessage(null);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReply = (message: Message) => {
    setReplyToMessage(message);
    inputRef.current?.focus();
  };

  const handleEdit = (message: Message) => {
    // In a real app, you'd implement message editing
    console.log('Edit message:', message);
  };

  const handleDelete = (message: Message) => {
    // In a real app, you'd implement message deletion
    console.log('Delete message:', message);
  };

  const handleLoadMore = () => {
    if (conversationId) {
      // loadMoreMessages({ 
      //   conversation_id: conversationId, 
      //   limit: 20, 
      //   sort: 'created_at', 
      //   order: 'desc' 
      // });
      console.log('Cargar más mensajes (mock)');
    }
  };

  const getDisplayName = () => {
    if (!conversation) return 'Conversación';
    return 'Conversación'; // Simplificado para compatibilidad
  };

  const getDisplayAvatar = () => {
    return '/api/placeholder/32/32'; // Simplificado para compatibilidad
  };

  if (loading && !conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <img
              src={getDisplayAvatar()}
              alt={getDisplayName()}
              className="w-10 h-10 rounded-full object-cover"
            />
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{getDisplayName()}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>En línea</span>
                <span>•</span>
                <span>Conversación directa</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Opciones"
            >
              <Users className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Configuración"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Load More Button */}
        {messages.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Cargar mensajes anteriores
            </button>
          </div>
        )}

        {/* Messages */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Send className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes aún</h3>
            <p className="text-gray-500">Comienza la conversación enviando un mensaje</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.sender_id === currentUserId}
                showTimestamp={true}
              />
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyToMessage && (
        <div className="bg-gray-100 border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Respondiendo a:</span>
              <span className="text-sm text-gray-600 truncate">
                {replyToMessage.content.length > 50 
                  ? `${replyToMessage.content.substring(0, 50)}...` 
                  : replyToMessage.content
                }
              </span>
            </div>
            <button
              onClick={() => setReplyToMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Adjuntar archivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <button
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Enviar mensaje"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Participants Sidebar */}
      {false && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg border-l border-gray-200 z-40">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Participantes</h3>
              <button
                onClick={() => setShowParticipants(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {conversation.participants.map((participantId) => (
              <div key={participantId} className="flex items-center space-x-3">
                <img
                  src="/api/placeholder/32/32"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Usuario {participantId.slice(-4)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">Participante</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Sidebar */}
      {showSettings && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg border-l border-gray-200 z-40">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Configuración</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Notificaciones</h4>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">Activar notificaciones</span>
              </label>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Privacidad</h4>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">Mostrar estado de lectura</span>
              </label>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button className="w-full text-left text-sm text-red-600 hover:text-red-700">
                Eliminar conversación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
