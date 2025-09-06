'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Video, Camera, FileVideo, AlertCircle } from 'lucide-react';
import VideoRecorder from './VideoRecorder';
import VideoEffects from './VideoEffects';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (videoData: {
    file: File;
    caption: string;
    hashtags: string[];
  }) => void;
}

export default function VideoUploadModal({ isOpen, onClose, onUpload }: VideoUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [appliedEffect, setAppliedEffect] = useState('none');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    
    // Validar tipo de archivo
    if (!file.type.startsWith('video/')) {
      setError('Por favor selecciona un archivo de video válido');
      return;
    }

    // Validar tamaño (máximo 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('El video debe ser menor a 100MB');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      // Procesar hashtags
      const hashtagArray = hashtags
        .split(' ')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

      // Simular subida (aquí conectarías con tu API real)
      await new Promise(resolve => setTimeout(resolve, 2000));

      onUpload({
        file: selectedFile,
        caption: caption.trim(),
        hashtags: hashtagArray,
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl('');
      setCaption('');
      setHashtags('');
      onClose();
    } catch (err) {
      setError('Error al subir el video. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRecord = () => {
    setShowRecorder(true);
  };

  const handleRecordedVideo = (videoBlob: Blob) => {
    const file = new File([videoBlob], 'recorded-video.webm', { type: 'video/webm' });
    handleFile(file);
    setShowRecorder(false);
  };

  const handleApplyEffect = (effect: string) => {
    setAppliedEffect(effect);
    setShowEffects(false);
    // Aquí aplicarías el efecto al video
    console.log('Aplicando efecto:', effect);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Subir Video</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Upload Area */}
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">
                Arrastra tu video aquí o{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-red-500 hover:text-red-400 underline"
                >
                  selecciona un archivo
                </button>
              </p>
              <p className="text-sm text-gray-500">
                MP4, MOV, AVI hasta 100MB
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          ) : (
            /* Video Preview */
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  src={previewUrl}
                  className={`w-full h-48 object-cover rounded-lg ${appliedEffect !== 'none' ? 'filter-' + appliedEffect : ''}`}
                  controls
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                    setAppliedEffect('none');
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowEffects(true)}
                  className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  rows={3}
                  placeholder="Describe tu video..."
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {caption.length}/200 caracteres
                </p>
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  placeholder="#perro #jugar #feliz"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separa los hashtags con espacios
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleRecord}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span>Grabar</span>
            </button>
            
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading || !caption.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors"
              >
                {uploading ? 'Subiendo...' : 'Subir Video'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Recorder Modal */}
      <VideoRecorder
        isOpen={showRecorder}
        onClose={() => setShowRecorder(false)}
        onRecord={handleRecordedVideo}
      />

      {/* Video Effects Modal */}
      <VideoEffects
        isOpen={showEffects}
        onClose={() => setShowEffects(false)}
        onApplyEffect={handleApplyEffect}
      />
    </div>
  );
}
