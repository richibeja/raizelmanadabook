"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, MessageCircle, Users, ArrowLeft } from 'lucide-react';
import { useConversations } from '../hooks/useConversations';
import ConversationCard from '../components/ConversationCard';
import { Conversation } from '../hooks/useConversations';

export default function ConversationsPage() {
  const router = useRouter();
  const { 
    conversations, 
    loading, 
    error, 
    fetchConversations, 
    createConversation,
    deleteConversation,
    leaveConversation 
  } = useConversations();

  const [currentUserId] = useState('550e8400-e29b-41d4-a716-446655440001'); // Mock user ID
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'direct' | 'group'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: 'direct' as 'direct' | 'group',
    title: '',
    description: '',
    participants: [] as string[]
  });

  useEffect(() => {
    fetchConversations({ 
      user_id: currentUserId, 
      limit: 20, 
      sort: 'last_message_at', 
      order: 'desc' 
    });
  }, [currentUserId, fetchConversations]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.last_message?.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || conv.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateConversation = async () => {
    try {
      const newConversation = await createConversation({
        ...createForm,
        created_by: currentUserId,
        participants: [...createForm.participants, currentUserId]
      });
      setShowCreateModal(false);
      setCreateForm({ type: 'direct', title: '', description: '', participants: [] });
      router.push(`/conversations/${newConversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    router.push(`/conversations/${conversation.id}`);
  };

  const handleEditConversation = (conversation: Conversation) => {
    router.push(`/conversations/${conversation.id}/edit`);
  };

  const handleDeleteConversation = async (conversation: Conversation) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
      try {
        await deleteConversation(conversation.id);
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    }
  };

  const handleLeaveConversation = async (conversation: Conversation) => {
    if (confirm('¿Estás seguro de que quieres salir de esta conversación?')) {
      try {
        await leaveConversation(conversation.id, currentUserId);
      } catch (error) {
        console.error('Error leaving conversation:', error);
      }
    }
  };

  const stats = {
    total: conversations.length,
    direct: conversations.filter(c => c.type === 'direct').length,
    group: conversations.filter(c => c.type === 'group').length,
    unread: conversations.reduce((sum, c) => {
      const participant = c.participants.find(p => p.user_id === currentUserId);
      return sum + (participant?.unread_count || 0);
    }, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Conversaciones</h1>
                <p className="text-sm text-gray-500">
                  {stats.total} conversaciones • {stats.unread} no leídas
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva conversación
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.direct}</div>
              <div className="text-sm text-gray-500">Directas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.group}</div>
              <div className="text-sm text-gray-500">Grupos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
              <div className="text-sm text-gray-500">No leídas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'all' | 'direct' | 'group')}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas</option>
                <option value="direct">Directas</option>
                <option value="group">Grupos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={() => fetchConversations({ user_id: currentUserId })}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Reintentar
            </button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay conversaciones</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedType !== 'all' 
                ? 'No se encontraron conversaciones con los filtros aplicados.'
                : 'Comienza una nueva conversación para conectarte con otros.'
              }
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva conversación
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                currentUserId={currentUserId}
                onSelect={handleSelectConversation}
                onEdit={handleEditConversation}
                onDelete={handleDeleteConversation}
                onLeave={handleLeaveConversation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Conversation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva conversación</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de conversación
                  </label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, type: e.target.value as 'direct' | 'group' }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="direct">Conversación directa</option>
                    <option value="group">Grupo</option>
                  </select>
                </div>

                {createForm.type === 'group' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del grupo
                      </label>
                      <input
                        type="text"
                        value={createForm.title}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Nombre del grupo"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción (opcional)
                      </label>
                      <textarea
                        value={createForm.description}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción del grupo"
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Participantes (IDs separados por comas)
                  </label>
                  <input
                    type="text"
                    value={createForm.participants.join(', ')}
                    onChange={(e) => setCreateForm(prev => ({ 
                      ...prev, 
                      participants: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                    }))}
                    placeholder="550e8400-e29b-41d4-a716-446655440002, 550e8400-e29b-41d4-a716-446655440003"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateConversation}
                  disabled={!createForm.title && createForm.type === 'group'}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
