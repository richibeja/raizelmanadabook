'use client';

import React, { useState, useEffect } from 'react';
import { useManadaBookAuth } from '../contexts/ManadaBookAuthContext';
import { usePosts } from '../hooks/usePosts';
import { useComments } from '../hooks/useComments';
import { useMessaging } from '../hooks/useMessaging';
import { usePetsRealtime } from '../hooks/usePetsRealtime';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  timestamp: Date;
  details?: any;
}

export default function TestManadaBookPage() {
  const { user, userProfile, loading: authLoading, login, register, logout } = useManadaBookAuth();
  const { posts, loading: postsLoading, createPost, likePost, sharePost, deletePost } = usePosts();
  const { addComment, editComment, deleteComment, likeComment } = useComments('test-post');
  const { conversations, messages, sendMessage, createConversation } = useMessaging();
  const { addPet, editPet, deletePet } = usePetsRealtime();

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testData, setTestData] = useState({
    email: 'test@manadabook.com',
    password: 'test123456',
    name: 'Usuario de Prueba'
  });

  const addTestResult = (name: string, status: TestResult['status'], message: string, details?: any) => {
    const result: TestResult = {
      id: Date.now().toString(),
      name,
      status,
      message,
      timestamp: new Date(),
      details
    };
    setTestResults(prev => [...prev, result]);
    return result;
  };

  const updateTestResult = (id: string, status: TestResult['status'], message: string, details?: any) => {
    setTestResults(prev => prev.map(r => 
      r.id === id ? { ...r, status, message, timestamp: new Date(), details } : r
    ));
  };

  // Test 1: Autenticación
  const testAutenticacion = async () => {
    const result = addTestResult('Autenticación', 'running', 'Iniciando prueba de autenticación...');
    
    try {
      // Test registro
      await register(testData.email, testData.password, testData.name);
      updateTestResult(result.id, 'success', 'Registro exitoso');
      
      // Test logout
      await logout();
      updateTestResult(result.id, 'success', 'Logout exitoso');
      
      // Test login
      await login(testData.email, testData.password);
      updateTestResult(result.id, 'success', 'Login exitoso - Autenticación completa');
      
    } catch (error: any) {
      updateTestResult(result.id, 'error', `Error en autenticación: ${error.message}`);
    }
  };

  // Test 2: Sistema de Posts
  const testSistemaPosts = async () => {
    const result = addTestResult('Sistema de Posts', 'running', 'Iniciando prueba de posts...');
    
    try {
      // Crear post de texto
      const postId = await createPost({
        content: 'Este es un post de prueba para verificar la funcionalidad',
        visibility: 'public',
        tags: ['prueba', 'test']
      });
      
      updateTestResult(result.id, 'success', `Post creado exitosamente: ${postId}`);
      
      // Verificar que el post aparece en el feed
      const postExists = posts.some(p => p.id === postId);
      if (postExists) {
        updateTestResult(result.id, 'success', 'Post aparece en el feed correctamente');
      } else {
        updateTestResult(result.id, 'error', 'Post no aparece en el feed');
      }
      
    } catch (error: any) {
      updateTestResult(result.id, 'error', `Error en sistema de posts: ${error.message}`);
    }
  };

  // Test 3: Sistema de Likes
  const testSistemaLikes = async () => {
    const result = addTestResult('Sistema de Likes', 'running', 'Iniciando prueba de likes...');
    
    try {
      if (posts.length === 0) {
        updateTestResult(result.id, 'error', 'No hay posts para probar likes');
        return;
      }
      
      const firstPost = posts[0];
      const initialLikes = firstPost.likesCount;
      
      // Dar like
      await likePost(firstPost.id);
      updateTestResult(result.id, 'success', `Like dado al post ${firstPost.id}`);
      
      // Verificar que el contador aumentó
      setTimeout(() => {
        const updatedPost = posts.find(p => p.id === firstPost.id);
        if (updatedPost && updatedPost.likesCount > initialLikes) {
          updateTestResult(result.id, 'success', 'Contador de likes actualizado correctamente');
        } else {
          updateTestResult(result.id, 'error', 'Contador de likes no se actualizó');
        }
      }, 2000);
      
    } catch (error: any) {
      updateTestResult(result.id, 'error', `Error en sistema de likes: ${error.message}`);
    }
  };

  // Test 4: Sistema de Comentarios
  const testSistemaComentarios = async () => {
    const result = addTestResult('Sistema de Comentarios', 'running', 'Iniciando prueba de comentarios...');
    
    try {
      if (posts.length === 0) {
        updateTestResult(result.id, 'error', 'No hay posts para probar comentarios');
        return;
      }
      
      const firstPost = posts[0];
      
      // Agregar comentario
      await addComment(firstPost.id, 'Este es un comentario de prueba');
      updateTestResult(result.id, 'success', `Comentario agregado al post ${firstPost.id}`);
      
    } catch (error: any) {
      updateTestResult(result.id, 'error', `Error en sistema de comentarios: ${error.message}`);
    }
  };

  // Test 5: Sistema de Compartir
  const testSistemaCompartir = async () => {
    const result = addTestResult('Sistema de Compartir', 'running', 'Iniciando prueba de compartir...');
    
    try {
      if (posts.length === 0) {
        updateTestResult(result.id, 'error', 'No hay posts para probar compartir');
        return;
      }
      
      const firstPost = posts[0];
      
      // Compartir post
      await sharePost(firstPost.id);
      updateTestResult(result.id, 'success', `Post ${firstPost.id} compartido exitosamente`);
      
    } catch (error: any) {
      updateTestResult(result.id, 'error', `Error en sistema de compartir: ${error.message}`);
    }
  };

  // Test 6: Gestión de Mascotas
  const testGestionMascotas = async () => {
    const result = addTestResult('Gestión de Mascotas', 'running', 'Iniciando prueba de mascotas...');
    
    try {
      // Crear mascota
      const petId = await addPet({
        name: 'Mascota de Prueba',
        species: 'dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'male',
        isPublic: true
      });
      
      if (petId) {
        updateTestResult(result.id, 'success', `Mascota creada exitosamente: ${petId}`);
      } else {
        updateTestResult(result.id, 'error', 'Error al crear mascota');
      }
      
    } catch (error: any) {
      updateTestResult(result.id, 'error', `Error en gestión de mascotas: ${error.message}`);
    }
  };

  // Test 7: Sistema de Mensajería
  const testSistemaMensajeria = async () => {
    const result = addTestResult('Sistema de Mensajería', 'running', 'Iniciando prueba de mensajería...');
    
    try {
      // Crear conversación
      const conversationId = await createConversation('direct', 'test-user-2');
      
      if (conversationId) {
        updateTestResult(result.id, 'success', `Conversación creada: ${conversationId}`);
        
        // Enviar mensaje
        await sendMessage(conversationId, 'Este es un mensaje de prueba', 'text');
        updateTestResult(result.id, 'success', 'Mensaje enviado exitosamente');
      } else {
        updateTestResult(result.id, 'error', 'Error al crear conversación');
      }
      
    } catch (error: any) {
      updateTestResult(result.id, 'error', `Error en sistema de mensajería: ${error.message}`);
    }
  };

  // Ejecutar todas las pruebas
  const ejecutarTodasLasPruebas = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      await testAutenticacion();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testSistemaPosts();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testSistemaLikes();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testSistemaComentarios();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testSistemaCompartir();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testGestionMascotas();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testSistemaMensajeria();
      
    } catch (error) {
      console.error('Error en pruebas:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'running': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'running': return '🔄';
      default: return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Verificación Completa de ManadaBook
        </h1>

        {/* Estado de Autenticación */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Estado de Autenticación</h2>
          {authLoading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : user ? (
            <div className="text-green-600">
              <p>✅ Usuario autenticado: {userProfile?.name || user.email}</p>
              <p>📧 Email: {user.email}</p>
              <p>🆔 UID: {user.uid}</p>
            </div>
          ) : (
            <div className="text-red-600">
              <p>❌ Usuario no autenticado</p>
              <p>Debe iniciar sesión para ejecutar las pruebas</p>
            </div>
          )}
        </div>

        {/* Controles de Prueba */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Controles de Prueba</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testAutenticacion}
              disabled={isRunning}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              🔐 Probar Autenticación
            </button>
            <button
              onClick={testSistemaPosts}
              disabled={isRunning || !user}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              📝 Probar Posts
            </button>
            <button
              onClick={testSistemaLikes}
              disabled={isRunning || !user}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              ❤️ Probar Likes
            </button>
            <button
              onClick={testSistemaComentarios}
              disabled={isRunning || !user}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              💬 Probar Comentarios
            </button>
            <button
              onClick={testSistemaCompartir}
              disabled={isRunning || !user}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              📤 Probar Compartir
            </button>
            <button
              onClick={testGestionMascotas}
              disabled={isRunning || !user}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              🐕 Probar Mascotas
            </button>
            <button
              onClick={testSistemaMensajeria}
              disabled={isRunning || !user}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              💌 Probar Mensajería
            </button>
            <button
              onClick={ejecutarTodasLasPruebas}
              disabled={isRunning || !user}
              className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 disabled:opacity-50 font-bold"
            >
              🚀 Ejecutar Todas las Pruebas
            </button>
          </div>
        </div>

        {/* Resultados de Pruebas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resultados de Pruebas</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-600">No se han ejecutado pruebas aún</p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{result.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(result.status)}>
                        {getStatusIcon(result.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {result.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{result.message}</p>
                  {result.details && (
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estadísticas */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{testResults.length}</div>
                <div className="text-sm text-gray-600">Total Pruebas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Exitosas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Fallidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.filter(r => r.status === 'running').length}
                </div>
                <div className="text-sm text-gray-600">En Progreso</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
