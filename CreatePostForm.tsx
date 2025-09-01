'use client';

import { useState, FormEvent } from 'react';
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/AuthContext';
import './CreatePostForm.css';

export default function CreatePostForm() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || (!content.trim() && !imageFile)) {
      setMessage('Debes escribir algo o seleccionar una imagen.');
      return;
    }

    setLoading(true);
    setMessage('Publicando en el universo...');

    try {
      let imageUrl = '';
      if (imageFile) {
        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 1. Crear el post en la colección principal 'posts'
      const postsCollectionRef = collection(db, 'posts');
      const newPostDoc = await addDoc(postsCollectionRef, {
        ownerId: user.uid,
        ownerName: user.displayName || user.email,
        ownerAvatar: user.photoURL || '/images/default-avatar.png',
        content: content,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
      });

      // 2. Añadir una referencia al post en el feed del propio usuario para que lo vea inmediatamente
      const userFeedRef = doc(db, 'users', user.uid, 'feed', newPostDoc.id);
      await setDoc(userFeedRef, {
        createdAt: serverTimestamp(), // Usar el mismo timestamp para ordenar
      });
      
      // En una app real, una Cloud Function se encargaría de distribuir
      // este post a los feeds de los seguidores.

      setContent('');
      setImageFile(null);
      setMessage('¡Publicado con éxito!');
    } catch (error) {
      console.error("Error al crear el post: ", error);
      setMessage('Hubo un error al publicar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000); // Limpiar mensaje después de 3 segundos
    }
  };

  if (!user) {
    return null; // No mostrar el formulario si el usuario no está logueado
  }

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          placeholder={`¿Qué aventura tuvo tu mascota hoy, ${user.displayName || 'tú'}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading || (!content.trim() && !imageFile)}>
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}