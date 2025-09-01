
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from '@/AuthContext';

export default function CreateGroupForm() {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || groupName.trim() === '' || description.trim() === '') {
      setMessage('El nombre y la descripción son obligatorios.');
      return;
    }

    setLoading(true);
    setMessage('Creando grupo...');

    try {
      let imageUrl = '';
      if (file) {
        const storageRef = ref(storage, `groups/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'groups'), {
        name: groupName,
        description: description,
        imageUrl: imageUrl,
        creatorId: user.uid,
        memberCount: 0,
        createdAt: serverTimestamp(),
      });

      setMessage(`¡Grupo "${groupName}" creado con éxito!`);
      setGroupName('');
      setDescription('');
      setFile(null);
      const fileInput = document.getElementById('group-file-input') as HTMLInputElement;
      if(fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Error creating group: ", error);
      setMessage('Hubo un error al crear el grupo.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Inicia sesión para crear un grupo.</p>;

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '30px' }}>
      <h3>Crear un Nuevo Grupo</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Nombre del Grupo:</label>
          <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} required style={{ width: '100%' }}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Descripción:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', minHeight: '80px' }}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Imagen del Grupo (Opcional):</label>
          <input type="file" id="group-file-input" onChange={handleFileChange} accept="image/*" />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Grupo'}
        </button>
        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </form>
    </div>
  );
}
