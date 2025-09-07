'use client';

import React, { useState, useEffect } from 'react';
import { useManadaBookAuth } from '../contexts/ManadaBookAuthContext';
import { useManadaShorts } from '../hooks/useManadaShorts';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface VerificationResult {
  test: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  details: string;
  timestamp: string;
  firebaseData?: any;
}

export default function ManadaShortsExhaustiveVerification() {
  const { user, userProfile, login, register, logout } = useManadaBookAuth();
  const { 
    videos, 
    loading, 
    error, 
    likeVideo, 
    followUser, 
    shareVideo, 
    uploadVideo, 
    getVideoComments, 
    addComment 
  } = useManadaShorts();

  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testVideo, setTestVideo] = useState<File | null>(null);

  const addResult = (test: string, status: VerificationResult['status'], details: string, firebaseData?: any) => {
    const result: VerificationResult = {
      test,
      status,
      details,
      timestamp: new Date().toLocaleTimeString(),
      firebaseData
    };
    setVerificationResults(prev => [...prev, result]);
  };

  const checkFirebaseCollection = async (collectionName: string, description: string) => {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      addResult(
        `Firebase Collection: ${collectionName}`,
        'passed',
        `${description}: ${data.length} documentos encontrados`,
        data
      );
      return data;
    } catch (error: any) {
      addResult(
        `Firebase Collection: ${collectionName}`,
        'failed',
        `Error: ${error.message}`,
        null
      );
      return [];
    }
  };

  const runExhaustiveVerification = async () => {
    setIsRunning(true);
    setVerificationResults([]);
    
    addResult('🚀 INICIO VERIFICACIÓN EXHAUSTIVA', 'running', 'Iniciando pruebas sistemáticas...');

    try {
      // 1. VERIFICACIÓN DE FIREBASE CONNECTIVITY
      addResult('1. Firebase Connectivity', 'running', 'Verificando conexión a Firebase...');
      await checkFirebaseCollection('manadashorts_videos', 'Videos en Firebase');
      await checkFirebaseCollection('manadashorts_likes', 'Likes en Firebase');
      await checkFirebaseCollection('manadashorts_follows', 'Follows en Firebase');
      await checkFirebaseCollection('manadashorts_comments', 'Comentarios en Firebase');

      // 2. VERIFICACIÓN DE AUTENTICACIÓN
      addResult('2. Authentication System', 'running', 'Verificando sistema de autenticación...');
      if (user) {
        addResult('2.1 User Authentication', 'passed', `Usuario autenticado: ${user.email}`, { uid: user.uid });
        if (userProfile) {
          addResult('2.2 User Profile', 'passed', `Perfil cargado: ${userProfile.name}`, userProfile);
        } else {
          addResult('2.2 User Profile', 'failed', 'Perfil de usuario no encontrado');
        }
      } else {
        addResult('2.1 User Authentication', 'failed', 'Usuario no autenticado');
      }

      // 3. VERIFICACIÓN DE VIDEOS
      addResult('3. Video System', 'running', 'Verificando sistema de videos...');
      if (videos.length > 0) {
        addResult('3.1 Video Loading', 'passed', `${videos.length} videos cargados desde Firebase`, videos.slice(0, 3));
        
        // Verificar estructura de videos
        const firstVideo = videos[0];
        const requiredFields = ['id', 'authorId', 'authorName', 'videoUrl', 'likes', 'comments', 'shares'];
        const missingFields = requiredFields.filter(field => !(field in firstVideo));
        
        if (missingFields.length === 0) {
          addResult('3.2 Video Structure', 'passed', 'Estructura de video completa', firstVideo);
        } else {
          addResult('3.2 Video Structure', 'failed', `Campos faltantes: ${missingFields.join(', ')}`);
        }
      } else {
        addResult('3.1 Video Loading', 'failed', 'No se pudieron cargar videos');
      }

      // 4. VERIFICACIÓN DE FUNCIONES DE INTERACCIÓN
      if (user && videos.length > 0) {
        const testVideo = videos[0];
        
        // 4.1 TEST DE LIKES
        addResult('4.1 Like System', 'running', 'Probando sistema de likes...');
        try {
          const initialLikes = testVideo.likes;
          const initialIsLiked = testVideo.isLiked;
          
          await likeVideo(testVideo.id);
          
          // Verificar en Firebase
          const likesQuery = query(
            collection(db, 'manadashorts_likes'),
            where('videoId', '==', testVideo.id),
            where('userId', '==', user.uid)
          );
          const likesSnapshot = await getDocs(likesQuery);
          const likeExists = !likesSnapshot.empty;
          
          if (likeExists) {
            addResult('4.1 Like System', 'passed', 'Like guardado correctamente en Firebase', { 
              videoId: testVideo.id, 
              userId: user.uid,
              likeExists 
            });
          } else {
            addResult('4.1 Like System', 'failed', 'Like no encontrado en Firebase');
          }
        } catch (error: any) {
          addResult('4.1 Like System', 'failed', `Error en like: ${error.message}`);
        }

        // 4.2 TEST DE FOLLOWS
        addResult('4.2 Follow System', 'running', 'Probando sistema de follows...');
        try {
          await followUser(testVideo.authorId);
          
          // Verificar en Firebase
          const followsQuery = query(
            collection(db, 'manadashorts_follows'),
            where('followerId', '==', user.uid),
            where('followingId', '==', testVideo.authorId)
          );
          const followsSnapshot = await getDocs(followsQuery);
          const followExists = !followsSnapshot.empty;
          
          if (followExists) {
            addResult('4.2 Follow System', 'passed', 'Follow guardado correctamente en Firebase', { 
              followerId: user.uid, 
              followingId: testVideo.authorId,
              followExists 
            });
          } else {
            addResult('4.2 Follow System', 'failed', 'Follow no encontrado en Firebase');
          }
        } catch (error: any) {
          addResult('4.2 Follow System', 'failed', `Error en follow: ${error.message}`);
        }

        // 4.3 TEST DE SHARES
        addResult('4.3 Share System', 'running', 'Probando sistema de shares...');
        try {
          await shareVideo(testVideo.id);
          addResult('4.3 Share System', 'passed', 'Share ejecutado correctamente');
        } catch (error: any) {
          addResult('4.3 Share System', 'failed', `Error en share: ${error.message}`);
        }

        // 4.4 TEST DE COMENTARIOS
        addResult('4.4 Comment System', 'running', 'Probando sistema de comentarios...');
        try {
          await addComment(testVideo.id, `Test comment at ${new Date().toLocaleTimeString()}`);
          
          // Verificar comentarios en Firebase
          const comments = await getVideoComments(testVideo.id);
          const testComment = comments.find(c => c.content.includes('Test comment'));
          
          if (testComment) {
            addResult('4.4 Comment System', 'passed', 'Comentario guardado correctamente en Firebase', testComment);
          } else {
            addResult('4.4 Comment System', 'failed', 'Comentario no encontrado en Firebase');
          }
        } catch (error: any) {
          addResult('4.4 Comment System', 'failed', `Error en comentario: ${error.message}`);
        }
      }

      // 5. VERIFICACIÓN DE PERSISTENCIA
      addResult('5. Persistence Test', 'running', 'Verificando persistencia de datos...');
      
      // Simular recarga de datos
      const videosQuery = query(
        collection(db, 'manadashorts_videos'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const videosSnapshot = await getDocs(videosQuery);
      
      if (videosSnapshot.docs.length > 0) {
        addResult('5. Persistence Test', 'passed', `Datos persistentes: ${videosSnapshot.docs.length} videos encontrados`);
      } else {
        addResult('5. Persistence Test', 'failed', 'No se encontraron datos persistentes');
      }

      // 6. VERIFICACIÓN DE RENDIMIENTO
      addResult('6. Performance Test', 'running', 'Verificando rendimiento...');
      const startTime = Date.now();
      
      // Simular múltiples operaciones
      if (videos.length > 0) {
        const promises = videos.slice(0, 3).map(video => getVideoComments(video.id));
        await Promise.all(promises);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (duration < 5000) {
        addResult('6. Performance Test', 'passed', `Operaciones completadas en ${duration}ms`);
      } else {
        addResult('6. Performance Test', 'failed', `Operaciones tardaron demasiado: ${duration}ms`);
      }

      addResult('✅ VERIFICACIÓN COMPLETADA', 'passed', 'Todas las pruebas ejecutadas');

    } catch (error: any) {
      addResult('❌ ERROR CRÍTICO', 'failed', `Error general: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestVideo(file);
    }
  };

  const testVideoUpload = async () => {
    if (!testVideo || !user) return;
    
    addResult('7. Video Upload Test', 'running', 'Probando subida de video...');
    try {
      const videoId = await uploadVideo({
        file: testVideo,
        caption: `Test video uploaded at ${new Date().toLocaleTimeString()}`,
        hashtags: ['#test', '#verification']
      });
      
      addResult('7. Video Upload Test', 'passed', `Video subido con ID: ${videoId}`);
    } catch (error: any) {
      addResult('7. Video Upload Test', 'failed', `Error en subida: ${error.message}`);
    }
  };

  const getStatusColor = (status: VerificationResult['status']) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: VerificationResult['status']) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'running': return '🔄';
      default: return '⏳';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🔍 VERIFICACIÓN EXHAUSTIVA DE MANADASHORTS
        </h1>
        <p className="text-gray-600 mb-6">
          Verificación milimétrica de todas las funcionalidades con persistencia real en Firebase
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📊 Estado Actual:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Usuario:</span> 
              <span className={user ? 'text-green-600' : 'text-red-600'}>
                {user ? 'Autenticado' : 'No autenticado'}
              </span>
            </div>
            <div>
              <span className="font-medium">Videos:</span> 
              <span className="text-blue-600">{videos.length}</span>
            </div>
            <div>
              <span className="font-medium">Cargando:</span> 
              <span className={loading ? 'text-yellow-600' : 'text-green-600'}>
                {loading ? 'Sí' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Error:</span> 
              <span className={error ? 'text-red-600' : 'text-green-600'}>
                {error ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={runExhaustiveVerification}
            disabled={isRunning}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? '🔄 Ejecutando...' : '🚀 Iniciar Verificación Exhaustiva'}
          </button>
          
          <button
            onClick={() => setVerificationResults([])}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            🗑️ Limpiar Resultados
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">📹 Test de Subida de Video:</h3>
          <div className="flex gap-4 items-center">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <button
              onClick={testVideoUpload}
              disabled={!testVideo || !user}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Subir Video de Prueba
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📋 Resultados de Verificación ({verificationResults.length})
        </h2>
        
        {verificationResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay resultados de verificación aún.</p>
            <p>Haz clic en "Iniciar Verificación Exhaustiva" para comenzar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {verificationResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{getStatusIcon(result.status)}</span>
                      <span className="font-medium">{result.test}</span>
                      <span className="text-sm opacity-75">({result.timestamp})</span>
                    </div>
                    <p className="text-sm opacity-90">{result.details}</p>
                    {result.firebaseData && (
                      <details className="mt-2">
                        <summary className="text-sm cursor-pointer hover:underline">
                          Ver datos de Firebase
                        </summary>
                        <pre className="mt-2 text-xs bg-black bg-opacity-10 p-2 rounded overflow-auto">
                          {JSON.stringify(result.firebaseData, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
