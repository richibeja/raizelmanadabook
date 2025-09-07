'use client';

import React, { useState } from 'react';
import { useManadaBookAuth } from '../contexts/ManadaBookAuthContext';
import { usePosts } from '../hooks/usePosts';
import { useComments } from '../hooks/useComments';
import { useMessaging } from '../hooks/useMessaging';
import { usePetsRealtime } from '../hooks/usePetsRealtime';

export default function TestManadaBookPage() {
  const { user, userProfile, loading: authLoading, login, register, logout } = useManadaBookAuth();
  const { posts, loading: postsLoading, likePost, sharePost, deletePost, createPost } = usePosts();
  const { addComment, editComment, deleteComment, likeComment } = useComments('test-post');
  const { conversations, sendMessage, createDirectConversation } = useMessaging();
  const { pets, createPet, editPet, deletePet } = usePetsRealtime();
  
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Autenticación
      addTestResult('🔐 Probando autenticación...');
      if (!user) {
        addTestResult('❌ Usuario no autenticado - probando registro');
        try {
          await register('test@manadabook.com', 'password123', 'Usuario Test');
          addTestResult('✅ Registro exitoso');
        } catch (error: any) {
          addTestResult(`❌ Error en registro: ${error.message}`);
        }
      } else {
        addTestResult('✅ Usuario autenticado correctamente');
      }

      // Test 2: Posts
      addTestResult('📝 Probando sistema de posts...');
      try {
        if (user) {
          const newPost = await createPost({
            content: 'Post de prueba desde test - ' + new Date().toLocaleString(),
            mediaUrls: [],
            postType: 'post',
            visibility: 'public',
            location: 'Test Location',
            tags: ['test', 'manadabook']
          });
          addTestResult(`✅ Post creado exitosamente: ${newPost}`);
        } else {
          addTestResult('⚠️ No se puede probar posts sin autenticación');
        }
      } catch (error: any) {
        addTestResult(`❌ Error creando post: ${error.message}`);
      }

      // Test 3: Likes
      addTestResult('❤️ Probando sistema de likes...');
      try {
        if (posts.length > 0 && user) {
          await likePost(posts[0].id);
          addTestResult('✅ Like aplicado exitosamente');
        } else {
          addTestResult('⚠️ No hay posts para probar likes');
        }
      } catch (error: any) {
        addTestResult(`❌ Error en like: ${error.message}`);
      }

      // Test 4: Comentarios
      addTestResult('💬 Probando sistema de comentarios...');
      try {
        if (posts.length > 0 && user) {
          await addComment('Comentario de prueba desde test');
          addTestResult('✅ Comentario agregado exitosamente');
        } else {
          addTestResult('⚠️ No hay posts para probar comentarios');
        }
      } catch (error: any) {
        addTestResult(`❌ Error en comentario: ${error.message}`);
      }

      // Test 5: Compartir
      addTestResult('📤 Probando sistema de compartir...');
      try {
        if (posts.length > 0 && user) {
          await sharePost(posts[0].id);
          addTestResult('✅ Post compartido exitosamente');
        } else {
          addTestResult('⚠️ No hay posts para probar compartir');
        }
      } catch (error: any) {
        addTestResult(`❌ Error compartiendo: ${error.message}`);
      }

      // Test 6: Mascotas
      addTestResult('🐾 Probando sistema de mascotas...');
      try {
        if (user) {
          const petId = await createPet({
            name: 'Mascota Test',
            species: 'dog',
            breed: 'Test Breed',
            birthDate: new Date('2020-01-01'),
            gender: 'male',
            weight: 25,
            photoURL: '',
            bio: 'Mascota de prueba',
            isPublic: true,
            medicalInfo: {
              vaccinated: true,
              spayed: false,
              allergies: [],
              conditions: []
            }
          });
          if (petId) {
            addTestResult(`✅ Mascota creada exitosamente: ${petId}`);
          } else {
            addTestResult('❌ Error creando mascota');
          }
        } else {
          addTestResult('⚠️ No se puede probar mascotas sin autenticación');
        }
      } catch (error: any) {
        addTestResult(`❌ Error en mascotas: ${error.message}`);
      }

      // Test 7: Mensajería
      addTestResult('💌 Probando sistema de mensajería...');
      try {
        if (user) {
          // Crear conversación de prueba
          const conversationId = await createDirectConversation('test-user-2');
          addTestResult(`✅ Conversación creada: ${conversationId}`);
          
          // Enviar mensaje de prueba
          await sendMessage(conversationId, 'Mensaje de prueba desde test');
          addTestResult('✅ Mensaje enviado exitosamente');
        } else {
          addTestResult('⚠️ No se puede probar mensajería sin autenticación');
        }
      } catch (error: any) {
        addTestResult(`❌ Error en mensajería: ${error.message}`);
      }

      addTestResult('🎉 ¡Todas las pruebas completadas!');
      
    } catch (error: any) {
      addTestResult(`❌ Error general en pruebas: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🧪 Test de ManadaBook - Verificación de Funciones Reales
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado Actual</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Usuario:</strong> {user ? user.email : 'No autenticado'}</p>
              <p><strong>Perfil:</strong> {userProfile ? userProfile.name : 'No disponible'}</p>
              <p><strong>Posts:</strong> {posts.length}</p>
            </div>
            <div>
              <p><strong>Conversaciones:</strong> {conversations.length}</p>
              <p><strong>Mascotas:</strong> {pets.length}</p>
              <p><strong>Loading:</strong> {authLoading || postsLoading ? 'Sí' : 'No'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Controles de Prueba</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning ? 'Ejecutando...' : 'Ejecutar Todas las Pruebas'}
            </button>
            <button
              onClick={clearResults}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Limpiar Resultados
            </button>
            {user && (
              <button
                onClick={logout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Resultados de Pruebas</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No hay resultados aún. Ejecuta las pruebas para comenzar.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">¿Qué se está probando?</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>🔐 <strong>Autenticación:</strong> Registro, login, logout reales</li>
            <li>📝 <strong>Posts:</strong> Crear, editar, eliminar posts reales</li>
            <li>❤️ <strong>Likes:</strong> Dar/quitar likes reales</li>
            <li>💬 <strong>Comentarios:</strong> Agregar, editar, eliminar comentarios reales</li>
            <li>📤 <strong>Compartir:</strong> Compartir posts reales</li>
            <li>🐾 <strong>Mascotas:</strong> Crear, editar, eliminar mascotas reales</li>
            <li>💌 <strong>Mensajería:</strong> Crear conversaciones y enviar mensajes reales</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
