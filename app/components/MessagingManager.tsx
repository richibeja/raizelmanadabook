'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { X, Send, Plus, Smile, Image, Paperclip, MoreVertical, Search, Users, Phone, Video } from 'lucide-react';

interface MessagingManagerProps {
  onClose: () => void;
}

export default function MessagingManager({ onClose }: MessagingManagerProps) {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const { 
    conversations, 
    activeConversation, 
    messages, 
    loading, 
    loadMessages, 
    createDirectConversation, 
    createGroupConversation, 
    sendMessage, 
    editMessage, 
    deleteMessage, 
    markAsRead,
    addReaction,
    removeReaction,
    formatTimeAgo,
    getConversationName,
    getConversationAvatar,
    getUnreadCount,
    setActiveConversation
  } = useMessaging();
  
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [editingMessage, setEditingMessage] = useState<any | null>(null);
  const [editContent, setEditContent] = useState('');
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    participants: [] as string[],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '😢', '😡', '👍', '👎', '❤️', '🔥', '🎉', '👏', '🙌', '💯'];

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
      markAsRead(activeConversation.id);
    }
  }, [activeConversation, loadMessages, markAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;

    try {
      await sendMessage(activeConversation.id, {
        content: newMessage,
        messageType: 'text',
        replyTo: replyingTo?.id,
      });
      
      setNewMessage('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editContent.trim()) return;

    try {
      await editMessage(messageId, editContent);
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      try {
        await deleteMessage(messageId);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleRemoveReaction = async (messageId: string) => {
    try {
      await removeReaction(messageId);
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupFormData.name.trim()) return;

    try {
      await createGroupConversation({
        name: groupFormData.name,
        description: groupFormData.description,
        imageUrl: groupFormData.imageUrl,
        participants: groupFormData.participants,
      });
      
      setGroupFormData({
        name: '',
        description: '',
        imageUrl: '',
        participants: [],
      });
      setShowCreateGroup(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const getFilteredConversations = () => {
    if (!searchTerm.trim()) return conversations;
    
    return conversations.filter(conversation => 
      getConversationName(conversation).toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const MessageBubble = ({ message }: { message: any }) => {
    const isOwn = message.senderId === userProfile?.id;
    const hasReactions = message.reactions && message.reactions.length > 0;
    const userReaction = message.reactions?.find(r => r.userId === userProfile?.id);

    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-800'
        }`}>
          {!isOwn && (
            <div className="text-xs font-medium text-gray-600 mb-1">
              {message.senderName}
            </div>
          )}
          
          {message.replyTo && message.replyToMessage && (
            <div className={`text-xs p-2 rounded mb-2 ${
              isOwn ? 'bg-blue-500' : 'bg-gray-100'
            }`}>
              <div className="font-medium">
                {message.replyToMessage.senderName}
              </div>
              <div className="truncate">
                {message.replyToMessage.content}
              </div>
            </div>
          )}
          
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {message.isEdited && (
            <div className="text-xs opacity-70 mt-1">(editado)</div>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs opacity-70">
              {formatTimeAgo(message.createdAt)}
            </div>
            
            {isOwn && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingMessage(message)}
                  className="opacity-70 hover:opacity-100"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteMessage(message.id)}
                  className="opacity-70 hover:opacity-100"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          
          {hasReactions && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions?.map((reaction, index) => (
                <button
                  key={index}
                  onClick={() => 
                    reaction.userId === userProfile?.id 
                      ? handleRemoveReaction(message.id)
                      : handleAddReaction(message.id, reaction.emoji)
                  }
                  className={`text-xs px-2 py-1 rounded-full ${
                    reaction.userId === userProfile?.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {reaction.emoji} {reaction.userName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ConversationItem = ({ conversation }: { conversation: any }) => {
    const unreadCount = getUnreadCount(conversation);
    const isActive = activeConversation?.id === conversation.id;

    return (
      <div
        onClick={() => setActiveConversation(conversation)}
        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
          isActive ? 'bg-blue-50' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {getConversationAvatar(conversation) ? (
              <img
                src={getConversationAvatar(conversation)}
                alt={getConversationName(conversation)}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getConversationName(conversation).charAt(0)
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm truncate">
                {getConversationName(conversation)}
              </h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 truncate">
              {conversation.lastMessage?.content || 'Sin mensajes'}
            </p>
            
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">
                {formatTimeAgo(conversation.lastMessageAt)}
              </span>
              {conversation.type === 'group' && (
                <Users className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Mensajes</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar conversaciones..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* New Group Button */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setShowCreateGroup(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Nuevo Grupo
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">💬</div>
                <div className="text-gray-600">Cargando conversaciones...</div>
              </div>
            ) : getFilteredConversations().length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay conversaciones</h3>
                <p className="text-gray-500">Inicia una conversación con alguien</p>
              </div>
            ) : (
              getFilteredConversations().map((conversation) => (
                <ConversationItem key={conversation.id} conversation={conversation} />
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {getConversationAvatar(activeConversation) ? (
                        <img
                          src={getConversationAvatar(activeConversation)}
                          alt={getConversationName(activeConversation)}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getConversationName(activeConversation).charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{getConversationName(activeConversation)}</h3>
                      <p className="text-sm text-gray-600">
                        {activeConversation.type === 'group' 
                          ? `${activeConversation.participants.length} miembros`
                          : 'En línea'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-2xl mb-2">💬</div>
                    <div className="text-gray-600">Cargando mensajes...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💭</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay mensajes</h3>
                    <p className="text-gray-500">Envía el primer mensaje</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                {replyingTo && (
                  <div className="bg-gray-100 rounded-lg p-2 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-medium">Respondiendo a {replyingTo.senderName}</div>
                        <div className="text-gray-600 truncate">{replyingTo.content}</div>
                      </div>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {editingMessage && (
                  <div className="bg-blue-100 rounded-lg p-2 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-medium">Editando mensaje</div>
                        <div className="text-gray-600 truncate">{editingMessage.content}</div>
                      </div>
                      <button
                        onClick={() => setEditingMessage(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={editingMessage ? (e) => { e.preventDefault(); handleEditMessage(editingMessage.id); } : handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={editingMessage ? editContent : newMessage}
                    onChange={(e) => editingMessage ? setEditContent(e.target.value) : setNewMessage(e.target.value)}
                    placeholder={editingMessage ? "Editar mensaje..." : "Escribe un mensaje..."}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Image className="h-5 w-5" />
                  </button>
                  
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>

                {showEmojiPicker && (
                  <div className="absolute bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <div className="grid grid-cols-6 gap-2">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (editingMessage) {
                              setEditContent(editContent + emoji);
                            } else {
                              setNewMessage(newMessage + emoji);
                            }
                            setShowEmojiPicker(false);
                          }}
                          className="text-2xl hover:bg-gray-100 rounded p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecciona una conversación</h3>
                <p className="text-gray-500">Elige una conversación para comenzar a chatear</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Crear Grupo</h3>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateGroup} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del grupo *
                  </label>
                  <input
                    type="text"
                    value={groupFormData.name}
                    onChange={(e) => setGroupFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del grupo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={groupFormData.description}
                    onChange={(e) => setGroupFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción del grupo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de imagen
                  </label>
                  <input
                    type="url"
                    value={groupFormData.imageUrl}
                    onChange={(e) => setGroupFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateGroup(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
