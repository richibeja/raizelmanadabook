'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Video, X, Upload, Clock, Globe, Users } from 'lucide-react';
import { useMoments } from '../hooks/useMoments';
import { useAuthContext } from '../contexts/AuthContext';

interface UploadMomentProps {
  isOpen: boolean;
  onClose: () => void;
  circleId?: string;
  circleName?: string;
}

const UploadMoment: React.FC<UploadMomentProps> = ({ 
  isOpen, 
  onClose, 
  circleId,
  circleName 
}) => {
  const { user } = useAuthContext();
  const { upload } = useMoments();
  
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`Archivo muy grande. Máximo ${file.type.startsWith('video/') ? '50MB' : '10MB'}`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Solo se permiten imágenes y videos');
      return;
    }

    setMediaFile(file);
    setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!mediaFile || !user) {
      setError('Selecciona un archivo y asegúrate de estar logueado');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // TODO: Upload file to storage (MinIO/S3)
      // For now, using placeholder URL
      const mediaUrl = `https://via.placeholder.com/400x600?text=Moment+${Date.now()}`;
      
      // Get video duration for videos
      let duration: number | undefined;
      if (mediaType === 'video') {
        duration = await getVideoDuration(mediaFile);
      }

      const momentData = {
        content: content.trim(),
        mediaUrl,
        mediaType,
        duration,
        circleId: circleId || undefined,
        tags: circleId ? ['circle', circleName?.toLowerCase()] : ['public']
      };

      const momentId = await upload(momentData);
      
      if (momentId) {
        // Reset form
        setContent('');
        setMediaFile(null);
        setMediaPreview('');
        onClose();
      } else {
        setError('Error al crear moment');
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir moment');
    } finally {
      setUploading(false);
    }
  };

  // Get video duration
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Crear Moment</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          {!mediaPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="flex space-x-4 mb-4">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">Selecciona imagen o video</p>
                <p className="text-sm text-gray-500">
                  Máx. 10MB imágenes, 50MB videos
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {mediaType === 'image' ? (
                <Image
                  src={mediaPreview}
                  alt="Preview"
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <video
                  src={mediaPreview}
                  className="w-full h-64 object-cover rounded-lg"
                  controls
                />
              )}
              <button
                onClick={() => {
                  setMediaFile(null);
                  setMediaPreview('');
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Content Text */}
        <div className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué está pasando con tus mascotas?"
            rows={3}
            maxLength={200}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {content.length}/200 caracteres
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              Expira en 24h
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audiencia
          </label>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center">
              {circleId ? (
                <>
                  <Users className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    Círculo: <strong>{circleName}</strong>
                  </span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    <strong>Público</strong> - Todos pueden ver
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!mediaFile || uploading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-400 flex items-center justify-center"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Compartir Moment
              </>
            )}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 <strong>Tips:</strong> Los moments son efímeros y desaparecen en 24h. 
            Ideal para compartir momentos especiales con productos Raízel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadMoment;