'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { X, Bell, Check, Trash2, Filter, Settings } from 'lucide-react';

interface NotificationsManagerProps {
  onClose: () => void;
}

export default function NotificationsManager({ onClose }: NotificationsManagerProps) {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    getNotificationIcon,
    getNotificationColor,
    getPriorityColor,
    formatTimeAgo,
    getUnreadNotifications,
    getNotificationsByType,
    getHighPriorityNotifications
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'high-priority'>('all');
  const [filterType, setFilterType] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getCurrentNotifications = () => {
    let filtered = notifications;

    switch (activeTab) {
      case 'unread':
        filtered = getUnreadNotifications();
        break;
      case 'high-priority':
        filtered = getHighPriorityNotifications();
        break;
      default:
        filtered = notifications;
    }

    if (filterType) {
      filtered = filtered.filter(n => n.type === filterType);
    }

    return filtered;
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'like': 'Me gusta',
      'comment': 'Comentarios',
      'follow': 'Seguimiento',
      'mention': 'Menciones',
      'circle_invite': 'Invitaciones',
      'moment_expired': 'Moments',
      'snippet_trending': 'Snippets',
      'system': 'Sistema',
    };
    return labels[type] || type;
  };

  const NotificationCard = ({ notification }: { notification: any }) => {
    return (
      <div className={`bg-white rounded-lg border-l-4 ${getPriorityColor(notification.priority)} border border-gray-200 p-4 hover:shadow-md transition-shadow ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`text-2xl ${getNotificationColor(notification.type)}`}>
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{notification.title}</h3>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              
              <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{formatTimeAgo(notification.createdAt)}</span>
                <span className="capitalize">{getNotificationTypeLabel(notification.type)}</span>
                {notification.priority === 'high' && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                    Alta prioridad
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!notification.isRead && (
              <button
                onClick={() => handleMarkAsRead(notification.id)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Marcar como leída"
              >
                <Check className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => handleDeleteNotification(notification.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {notification.data && (notification.data.fromUserName || notification.data.actionUrl) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {notification.data.fromUserName && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {notification.data.fromUserName.charAt(0)}
                </div>
                <span>de {notification.data.fromUserName}</span>
              </div>
            )}
            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver más →
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Notificaciones</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-indigo-100 mt-2">
            Mantente al día con las últimas actividades
          </p>
        </div>

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">Todos los tipos</option>
                <option value="like">Me gusta</option>
                <option value="comment">Comentarios</option>
                <option value="follow">Seguimiento</option>
                <option value="mention">Menciones</option>
                <option value="circle_invite">Invitaciones</option>
                <option value="moment_expired">Moments</option>
                <option value="snippet_trending">Snippets</option>
                <option value="system">Sistema</option>
              </select>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Configuración"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'unread'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              No leídas ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab('high-priority')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'high-priority'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Alta prioridad ({getHighPriorityNotifications().length})
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Configuración de notificaciones</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Notificaciones push</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Notificaciones por email</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Solo notificaciones importantes</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">🔔</div>
                <div className="text-gray-600">Cargando notificaciones...</div>
              </div>
            ) : getCurrentNotifications().length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {activeTab === 'unread' ? 'No hay notificaciones sin leer' :
                   activeTab === 'high-priority' ? 'No hay notificaciones de alta prioridad' :
                   'No hay notificaciones'}
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'unread' ? '¡Estás al día con todas tus notificaciones!' :
                   activeTab === 'high-priority' ? 'No hay notificaciones urgentes' :
                   'Las notificaciones aparecerán aquí cuando tengas actividad'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getCurrentNotifications().map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
