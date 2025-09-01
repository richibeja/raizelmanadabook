'use client';

import { useState, ChangeEvent } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, doc, getDoc, writeBatch } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { useAuth } from './AuthContext';
import './StoryUploader.css'; // Importar el archivo CSS

export default function StoryUploader() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setMessage('');
      // Crear una URL de previsualización
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      setMessage('Por favor, selecciona un archivo y asegúrate de haber iniciado sesión.');
      return;
    }

    setUploading(true);
    setMessage(`Subiendo ${file.name}...`);

    try {
      const storageRef = ref(storage, `stories/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const batch = writeBatch(db);
      const storiesCollection = collection(db, 'stories');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expira en 24 horas
      
      batch.set(doc(storiesCollection), {
        ownerId: user.uid,
        ownerName: user.displayName || user.email,
        mediaUrl: downloadURL,
        mediaType: file.type.startsWith('video') ? 'video' : 'image',
        createdAt: serverTimestamp(),
        expiresAt: expiresAt,
      });

      const storytellerBadgeRef = doc(db, 'users', user.uid, 'badges', 'cuentacuentos');
      const badgeSnap = await getDoc(storytellerBadgeRef);

      if (!badgeSnap.exists()) {
        batch.set(storytellerBadgeRef, {
          name: "Cuentacuentos",
          description: "Otorgada por subir tu primera historia.",
          earnedAt: serverTimestamp(),
        });
        setMessage('¡Historia subida y nueva medalla ganada: Cuentacuentos!');
      } else {
        setMessage('¡Historia subida con éxito!');
      }

      await batch.commit();
      setFile(null);
      setPreviewUrl(null);

    } catch (error) {
      console.error("Error uploading story: ", error);
      setMessage('Hubo un error al subir tu historia.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="story-uploader-container">
      <h4>Subir una Nueva Historia (Imagen o Video)</h4>
      <input type="file" onChange={handleFileChange} accept="image/*,video/mp4,video/quicktime" />
      {previewUrl && (
        <div className="story-uploader-preview">
            {file?.type.startsWith('video') 
                ? <video src={previewUrl} width="200" controls />
                : <img src={previewUrl} alt="Preview" height="200" />
            }
        </div>
      )}
      {file && (
        <div className="story-uploader-actions">
          <button onClick={handleUpload} disabled={uploading || !user}>
            {uploading ? 'Subiendo...' : 'Publicar Historia'}
          </button>
        </div>
      )}
      {message && <p className="story-uploader-message">{message}</p>}
    </div>
  );
}
