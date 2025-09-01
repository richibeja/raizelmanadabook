'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from './AuthContext';
import './CreateMomentoForm.css';

interface CreateMomentoFormProps {
  onClose: () => void; // Función para cerrar el modal
}

export default function CreateMomentoForm({ onClose }: CreateMomentoFormProps) {
  const { user } = useAuth();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !videoFile) {
      setMessage('Debes seleccionar un video.');
      return;
    }

    setLoading(true);
    setMessage('Publicando tu Momento...');

    const storageRef = ref(storage, `momentos/${user.uid}/${Date.now()}_${videoFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading Momento: ", error);
        setMessage('Hubo un error al subir tu Momento.');
        setLoading(false);
      },
      async () => {
        const videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
        
        const batch = writeBatch(db);

        // 1. Añadir el Momento a la subcolección del usuario
        const momentoRef = doc(collection(db, 'users', user.uid, 'momentos'));
        batch.set(momentoRef, {
          videoUrl: videoUrl,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
        });

        // 2. Actualizar el perfil del usuario para indicar que tiene un Momento activo
        const userRef = doc(db, 'users', user.uid);
        batch.update(userRef, { hasActiveMomento: true, lastMomentoAt: serverTimestamp() });

        await batch.commit();

        setMessage('¡Momento publicado!');
        onClose(); // Cierra el formulario/modal después de publicar
      }
    );
  };

  return (
    <div className="create-momento-modal">
        <div className="create-momento-content">
            <button onClick={onClose} className="close-button">&times;</button>
            <h3>Crear un nuevo Momento</h3>
            <p>Sube un video corto (con o sin música) para compartirlo durante 24 horas.</p>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="video/mp4,video/quicktime" required />
                {loading && <progress value={uploadProgress} max="100" />}
                <button type="submit" disabled={loading}>
                {loading ? `Publicando... ${Math.round(uploadProgress)}%` : 'Publicar Momento'}
                </button>
                {message && <p>{message}</p>}
            </form>
        </div>
    </div>
  );
}
