'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Square, Camera, RotateCcw, Check } from 'lucide-react';

interface VideoRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onRecord: (videoBlob: Blob) => void;
}

export default function VideoRecorder({ isOpen, onClose, onRecord }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 720 },
          height: { ideal: 1280 },
          facingMode: 'user'
        },
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setError(null);
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setHasPermission(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    // Timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    setRecordedChunks([]);
    setRecordingTime(0);
    setIsRecording(false);
  };

  const saveRecording = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      onRecord(blob);
      resetRecording();
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto bg-black">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={onClose}
            className="text-white bg-black/50 rounded-full p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-white text-lg font-semibold">
            {formatTime(recordingTime)}
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Camera Preview */}
        <div className="w-full h-full relative">
          {hasPermission ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">Cámara no disponible</p>
                <p className="text-sm text-gray-400">
                  {error || 'Permisos de cámara requeridos'}
                </p>
              </div>
            </div>
          )}

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-20 left-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Grabando...</span>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex justify-center items-center space-x-6">
              {recordedChunks.length === 0 ? (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!hasPermission}
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-white hover:bg-gray-200'
                  } ${!hasPermission ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isRecording ? (
                    <Square className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-black" />
                  )}
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={resetRecording}
                    className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center"
                  >
                    <RotateCcw className="w-6 h-6 text-white" />
                  </button>
                  
                  <button
                    onClick={saveRecording}
                    className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
