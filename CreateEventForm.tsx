
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from 'C:/Users/ALP/Documents/raizel/../AuthContext';

export default function CreateEventForm() {
  const { user } = useAuth();
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setMessage('Debes iniciar sesión para crear un evento.');
      return;
    }

    setLoading(true);
    setMessage('Creando evento...');

    try {
      let imageUrl = '';
      if (file) {
        const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Combinar fecha y hora en un solo objeto Date
      const eventTimestamp = new Date(`${formState.date}T${formState.time}`);

      await addDoc(collection(db, 'events'), {
        ...formState,
        date: eventTimestamp,
        imageUrl: imageUrl,
        creatorId: user.uid,
        attendeeCount: 0,
        createdAt: serverTimestamp(),
      });

      setMessage(`¡Evento "${formState.title}" creado con éxito!`);
      // Reset form
      setFormState({ title: '', description: '', date: '', time: '', location: '' });
      setFile(null);
      const fileInput = document.getElementById('event-file-input') as HTMLInputElement;
      if(fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Error creating event: ", error);
      setMessage('Hubo un error al crear el evento.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Inicia sesión para crear un evento.</p>;

  return (
    <div className="create-event-container">
      <h3>Crear un Nuevo Evento</h3>
      <form onSubmit={handleSubmit} className="create-event-form">
        <div>
          <label>Título del Evento:</label>
          <input type="text" name="title" value={formState.title} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea name="description" value={formState.description} onChange={handleInputChange} required />
        </div>
        <div className="date-time-group">
            <div>
                <label>Fecha:</label>
                <input type="date" name="date" value={formState.date} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Hora:</label>
                <input type="time" name="time" value={formState.time} onChange={handleInputChange} required />
            </div>
        </div>
        <div>
          <label>Lugar o Dirección:</label>
          <input type="text" name="location" value={formState.location} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Imagen del Evento (Opcional):</label>
          <input type="file" id="event-file-input" onChange={handleFileChange} accept="image/*" />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Evento'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
