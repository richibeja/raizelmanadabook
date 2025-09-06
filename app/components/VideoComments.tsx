'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Heart, Smile } from 'lucide-react';

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: number;
  likes: number;
  isLiked: boolean;
}

interface VideoCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export default function VideoComments({ isOpen, onClose, videoId }: VideoCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'PetLover23',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      text: '¡Qué lindo! 😍',
      timestamp: Date.now() - 300000,
      likes: 12,
      isLiked: false
    },
    {
      id: '2',
      user: 'DogMom2024',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      text: 'Mi perro hace lo mismo jajaja',
      timestamp: Date.now() - 180000,
      likes: 8,
      isLiked: true
    },
    {
      id: '3',
      user: 'CatWhisperer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      text: 'Los gatos son los mejores 🐱',
      timestamp: Date.now() - 120000,
      likes: 15,
      isLiked: false
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, comments]);

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: 'Tú',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      text: newComment.trim(),
      timestamp: Date.now(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    setIsTyping(false);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Ahora';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
      <div className="w-full bg-gray-900 rounded-t-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            Comentarios ({comments.length})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img
                src={comment.avatar}
                alt={comment.user}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-white font-medium text-sm">
                    {comment.user}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {formatTime(comment.timestamp)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  {comment.text}
                </p>
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center space-x-1 text-xs ${
                    comment.isLiked ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                  <span>{comment.likes}</span>
                </button>
              </div>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
              alt="Tu avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 flex items-center bg-gray-800 rounded-full px-4 py-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                placeholder="Añade un comentario..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={handleSendComment}
                disabled={!newComment.trim()}
                className="text-red-500 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
