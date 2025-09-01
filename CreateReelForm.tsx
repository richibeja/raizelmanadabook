'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { collection, doc, writeBatch, serverTimestamp, getDoc, DocumentData, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/AuthContext';
import './CreateReelForm.css';

export default function CreateReelForm() {
  const { user } = useAuth();
  const [petProfile, setPetProfile] = useState<DocumentData | null>(null);
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      const fetchPetProfile = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().primaryPetId) {
          const petDocRef = doc(db, 'users', user.uid, 'pets', userDocSnap.data().primaryPetId);
          const petSnap = await getDoc(petDocRef);
          if (petSnap.exists()) setPetProfile(petSnap.data());
        }
      };
      fetchPetProfile();
    }
  }, [user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !videoFile) {
      setMessage('Debes seleccionar un video para subir.');
      return;
    }

    setLoading(true);
    setMessage('Subiendo video...');

    const storageRef = ref(storage, `reels/${user.uid}/${Date.now()}_${videoFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading video: ", error);
        setMessage('Hubo un error al subir el video.');
        setLoading(false);
      },
      async () => {
        const videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
        const reelRef = doc(collection(db, 'reels'));
        await setDoc(reelRef, {
          ownerId: user.uid,
          ownerName: petProfile?.name || user.displayName,
          ownerAvatarUrl: petProfile?.avatarUrl || '',
          videoUrl: videoUrl,
          description: description,
          likesCount: 0,
          commentsCount: 0,
          createdAt: serverTimestamp(),
        });

        setMessage('¡Video subido con éxito!');
        setDescription('');
        setVideoFile(null);
        setLoading(false);
      }
    );
  };

  if (!user) return <p>Inicia sesión para subir videos.</p>;

  return (
    <div className="create-reel-form-container">
      <h3>Sube un nuevo video</h3>
      <form onSubmit={handleSubmit}>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Añade una descripción..." />
        <input type="file" onChange={handleFileChange} accept="video/mp4,video/quicktime" required />
        {loading && <progress value={uploadProgress} max="100" />}
        <button type="submit" disabled={loading}>
          {loading ? `Subiendo... ${Math.round(uploadProgress)}%` : 'Publicar Video'}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
