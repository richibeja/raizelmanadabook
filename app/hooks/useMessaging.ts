'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file' | 'sticker' | 'location';
  mediaUrl?: string;
  replyTo?: string;
  replyToMessage?: Message;
  isEdited: boolean;
  isDeleted: boolean;
  readBy: string[];
  reactions: MessageReaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageReaction {
  userId: string;
  userName: string;
  emoji: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  description?: string;
  imageUrl?: string;
  participants: string[];
  participantNames: { [userId: string]: string };
  participantAvatars: { [userId: string]: string };
  lastMessage?: Message;
  lastMessageAt: Date;
  unreadCount: { [userId: string]: number };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  admins: string[];
  moderators: string[];
}

export interface GroupSettings {
  name: string;
  description: string;
  imageUrl?: string;
  isPublic: boolean;
  allowInvites: boolean;
  allowMemberMessages: boolean;
  allowMemberMedia: boolean;
  allowMemberReactions: boolean;
  muteNotifications: boolean;
}

export function useMessaging() {
  const { user, userProfile } = useManadaBookAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query para obtener conversaciones del usuario
    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      where('isActive', '==', true),
      orderBy('lastMessageAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      conversationsQuery,
      async (snapshot) => {
        try {
          const conversationsData: Conversation[] = [];
          
          for (const docSnapshot of snapshot.docs) {
            const conversationData = docSnapshot.data();
            
            // Obtener información de los participantes
            const participantNames: { [userId: string]: string } = {};
            const participantAvatars: { [userId: string]: string } = {};
            
            for (const participantId of conversationData.participants) {
              const participantDoc = await doc(db, 'users', participantId).get();
              if (participantDoc.exists()) {
                const participantData = participantDoc.data();
                participantNames[participantId] = participantData.name || 'Usuario Anónimo';
                participantAvatars[participantId] = participantData.avatarUrl || '';
              }
            }

            conversationsData.push({
              id: docSnapshot.id,
              type: conversationData.type || 'direct',
              name: conversationData.name || '',
              description: conversationData.description || '',
              imageUrl: conversationData.imageUrl || '',
              participants: conversationData.participants || [],
              participantNames,
              participantAvatars,
              lastMessage: conversationData.lastMessage || null,
              lastMessageAt: conversationData.lastMessageAt?.toDate() || new Date(),
              unreadCount: conversationData.unreadCount || {},
              isActive: conversationData.isActive || false,
              createdAt: conversationData.createdAt?.toDate() || new Date(),
              updatedAt: conversationData.updatedAt?.toDate() || new Date(),
              createdBy: conversationData.createdBy || '',
              admins: conversationData.admins || [],
              moderators: conversationData.moderators || [],
            });
          }

          setConversations(conversationsData);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching conversations:', err);
          setError('Error al cargar las conversaciones');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in conversations listener:', err);
        setError('Error al cargar las conversaciones');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const loadMessages = async (conversationId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const messagesQuery = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc'),
        limit(100)
      );

      const snapshot = await getDocs(messagesQuery);
      const messagesData: Message[] = [];

      for (const docSnapshot of snapshot.docs) {
        const messageData = docSnapshot.data();
        
        // Obtener información del remitente
        const senderDoc = await doc(db, 'users', messageData.senderId).get();
        let senderName = 'Usuario Anónimo';
        let senderAvatar = '';
        
        if (senderDoc.exists()) {
          const senderData = senderDoc.data();
          senderName = senderData.name || 'Usuario Anónimo';
          senderAvatar = senderData.avatarUrl || '';
        }

        messagesData.push({
          id: docSnapshot.id,
          conversationId: messageData.conversationId,
          senderId: messageData.senderId,
          senderName,
          senderAvatar,
          content: messageData.content || '',
          messageType: messageData.messageType || 'text',
          mediaUrl: messageData.mediaUrl || '',
          replyTo: messageData.replyTo || '',
          replyToMessage: messageData.replyToMessage || null,
          isEdited: messageData.isEdited || false,
          isDeleted: messageData.isDeleted || false,
          readBy: messageData.readBy || [],
          reactions: messageData.reactions || [],
          createdAt: messageData.createdAt?.toDate() || new Date(),
          updatedAt: messageData.updatedAt?.toDate() || new Date(),
        });
      }

      setMessages(messagesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Error al cargar los mensajes');
      setLoading(false);
    }
  };

  const createDirectConversation = async (otherUserId: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (otherUserId === user.uid) throw new Error('No puedes crear una conversación contigo mismo');

    try {
      // Verificar si ya existe una conversación directa
      const existingQuery = query(
        collection(db, 'conversations'),
        where('type', '==', 'direct'),
        where('participants', 'array-contains', user.uid)
      );
      
      const existingSnapshot = await getDocs(existingQuery);
      for (const docSnapshot of existingSnapshot.docs) {
        const conversationData = docSnapshot.data();
        if (conversationData.participants.includes(otherUserId)) {
          return docSnapshot.id;
        }
      }

      // Crear nueva conversación directa
      const newConversation = {
        type: 'direct',
        participants: [user.uid, otherUserId],
        participantNames: {
          [user.uid]: userProfile?.name || 'Usuario Anónimo',
          [otherUserId]: '', // Se llenará automáticamente
        },
        participantAvatars: {
          [user.uid]: userProfile?.avatarUrl || '',
          [otherUserId]: '', // Se llenará automáticamente
        },
        lastMessageAt: Timestamp.now(),
        unreadCount: {
          [user.uid]: 0,
          [otherUserId]: 0,
        },
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: user.uid,
        admins: [user.uid],
        moderators: [],
      };

      const docRef = await addDoc(collection(db, 'conversations'), newConversation);
      return docRef.id;
    } catch (error) {
      console.error('Error creating direct conversation:', error);
      throw error;
    }
  };

  const createGroupConversation = async (groupData: {
    name: string;
    description: string;
    imageUrl?: string;
    participants: string[];
  }) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (groupData.participants.length < 2) throw new Error('Se necesitan al menos 2 participantes');

    try {
      const newConversation = {
        type: 'group',
        name: groupData.name,
        description: groupData.description,
        imageUrl: groupData.imageUrl || '',
        participants: [user.uid, ...groupData.participants],
        participantNames: {
          [user.uid]: userProfile?.name || 'Usuario Anónimo',
        },
        participantAvatars: {
          [user.uid]: userProfile?.avatarUrl || '',
        },
        lastMessageAt: Timestamp.now(),
        unreadCount: {
          [user.uid]: 0,
        },
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: user.uid,
        admins: [user.uid],
        moderators: [],
      };

      // Inicializar unreadCount para todos los participantes
      groupData.participants.forEach(participantId => {
        newConversation.unreadCount[participantId] = 0;
      });

      const docRef = await addDoc(collection(db, 'conversations'), newConversation);
      return docRef.id;
    } catch (error) {
      console.error('Error creating group conversation:', error);
      throw error;
    }
  };

  const sendMessage = async (conversationId: string, messageData: {
    content: string;
    messageType: Message['messageType'];
    mediaUrl?: string;
    replyTo?: string;
  }) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (!messageData.content.trim() && !messageData.mediaUrl) {
      throw new Error('El mensaje no puede estar vacío');
    }

    try {
      const newMessage = {
        conversationId,
        senderId: user.uid,
        content: messageData.content.trim(),
        messageType: messageData.messageType,
        mediaUrl: messageData.mediaUrl || '',
        replyTo: messageData.replyTo || '',
        isEdited: false,
        isDeleted: false,
        readBy: [user.uid],
        reactions: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'messages'), newMessage);
      
      // Actualizar conversación con último mensaje
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: {
          id: docRef.id,
          content: messageData.content.trim(),
          senderId: user.uid,
          senderName: userProfile?.name || 'Usuario Anónimo',
          createdAt: Timestamp.now(),
        },
        lastMessageAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (!newContent.trim()) throw new Error('El mensaje no puede estar vacío');

    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        content: newContent.trim(),
        isEdited: true,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        content: 'Este mensaje fue eliminado',
        isDeleted: true,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        [`unreadCount.${user.uid}`]: 0,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const messageRef = doc(db, 'messages', messageId);
      const message = messages.find(m => m.id === messageId);
      
      if (!message) throw new Error('Mensaje no encontrado');

      // Verificar si ya reaccionó
      const existingReaction = message.reactions.find(r => r.userId === user.uid);
      
      if (existingReaction) {
        // Actualizar reacción existente
        const updatedReactions = message.reactions.map(r => 
          r.userId === user.uid ? { ...r, emoji, updatedAt: Timestamp.now() } : r
        );
        await updateDoc(messageRef, {
          reactions: updatedReactions,
          updatedAt: Timestamp.now(),
        });
      } else {
        // Agregar nueva reacción
        const newReaction = {
          userId: user.uid,
          userName: userProfile?.name || 'Usuario Anónimo',
          emoji,
          createdAt: Timestamp.now(),
        };
        
        await updateDoc(messageRef, {
          reactions: [...message.reactions, newReaction],
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  };

  const removeReaction = async (messageId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const messageRef = doc(db, 'messages', messageId);
      const message = messages.find(m => m.id === messageId);
      
      if (!message) throw new Error('Mensaje no encontrado');

      const updatedReactions = message.reactions.filter(r => r.userId !== user.uid);
      
      await updateDoc(messageRef, {
        reactions: updatedReactions,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString('es-ES');
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return conversation.name || 'Grupo sin nombre';
    } else {
      // Para conversaciones directas, mostrar el nombre del otro participante
      const otherParticipant = conversation.participants.find(p => p !== user?.uid);
      return otherParticipant ? conversation.participantNames[otherParticipant] : 'Conversación';
    }
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return conversation.imageUrl || '';
    } else {
      // Para conversaciones directas, mostrar el avatar del otro participante
      const otherParticipant = conversation.participants.find(p => p !== user?.uid);
      return otherParticipant ? conversation.participantAvatars[otherParticipant] : '';
    }
  };

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.unreadCount[user?.uid || ''] || 0;
  };

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
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
    setActiveConversation,
  };
}
