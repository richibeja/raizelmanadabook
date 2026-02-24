'use client';

import React, { useState } from 'react';
import { useComments } from '@/hooks/useComments';
import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { Heart, Reply, MoreHorizontal, Edit, Trash2, Send } from 'lucide-react';

interface CommentsSectionProps {
  postId: string;
  onClose: () => void;
}

export default function CommentsSection({ postId, onClose }: CommentsSectionProps) {
  const { user, userProfile } = useManadaBookAuth();
  const { comments, loading, addComment, editComment, deleteComment, likeComment } = useComments(postId);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    try {
      await addComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim() || !replyingTo) return;

    try {
      await addComment(replyContent.trim(), replyingTo);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await editComment(commentId, editContent.trim());
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment(commentId);
    } catch (error) {
      console.error('Error liking comment:', error);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Comentarios</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">💬</div>
              <div className="text-gray-600">Cargando comentarios...</div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💭</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay comentarios aún</h3>
              <p className="text-gray-500">Sé el primero en comentar</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                {/* Main Comment */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {comment.authorName.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{comment.authorName}</span>
                      <span className="text-gray-500 text-xs">
                        {formatTimeAgo(comment.createdAt)}
                        {comment.isEdited && ' (editado)'}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 text-sm mb-2 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                          comment.userLiked ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className={`h-3 w-3 ${comment.userLiked ? 'fill-current' : ''}`} />
                        <span>{comment.likesCount}</span>
                      </button>
                      
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                      >
                        <Reply className="h-3 w-3" />
                        <span>Responder</span>
                      </button>
                      
                      {comment.authorId === user?.uid && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditContent(comment.content);
                            }}
                            className="hover:text-blue-500 transition-colors"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <form onSubmit={handleSubmitReply} className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Escribe una respuesta..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          disabled={!replyContent.trim()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                      </form>
                    )}
                    
                    {/* Edit Form */}
                    {editingComment === comment.id && (
                      <form onSubmit={(e) => { e.preventDefault(); handleEditComment(comment.id); }} className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          disabled={!editContent.trim()}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingComment(null);
                            setEditContent('');
                          }}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        {user && (
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
