'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from 'C:/Users/ALP/Documents/raizel/../AuthContext';

export default function CreateAdoptionForm() {
  const { user } = useAuth();
  const [formState, setFormState] = useState({
    petName: '',
    breed: '',
    age: '',
    location: '',
    story: '',
    healthInfo: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
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
      setMessage('Debes iniciar sesión para publicar una adopción.');
      return;
    }
    if (!file) {
        setMessage('Debes subir una foto de la mascota.');
        return;
    }

    setLoading(true);
    setMessage('Publicando perfil de adopción...');

    try {
      const storageRef = ref(storage, `adoptions/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'adoptions'), {
        ...formState,
        imageUrl: imageUrl,
        publisherId: user.uid,
        status: 'available',
        createdAt: serverTimestamp(),
      });

      setMessage(`¡Perfil de ${formState.petName} publicado con éxito! Gracias por ayudar.`);
      // Reset form
      setFormState({ petName: '', breed: '', age: '', location: '', story: '', healthInfo: '', contactName: '', contactPhone: '', contactEmail: '' });
      setFile(null);
      const fileInput = document.getElementById('adoption-file-input') as HTMLInputElement;
      if(fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Error creating adoption profile: ", error);
      setMessage('Hubo un error al publicar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Inicia sesión para dar una mascota en adopción.</p>;

  return (
    <div className="create-adoption-container">
      <h3>Publicar una Mascota en Adopción</h3>
      <form onSubmit={handleSubmit} className="create-adoption-form">
        <div className="grid-columns">
            <input type="text" name="petName" placeholder="Nombre de la mascota" value={formState.petName} onChange={handleInputChange} required />
            <input type="text" name="breed" placeholder="Raza" value={formState.breed} onChange={handleInputChange} required />
            <input type="text" name="age" placeholder="Edad (ej. 2 años)" value={formState.age} onChange={handleInputChange} required />
            <input type="text" name="location" placeholder="Ubicación (Ciudad)" value={formState.location} onChange={handleInputChange} required />
        </div>
        <textarea name="story" placeholder="Cuenta la historia de la mascota..." value={formState.story} onChange={handleInputChange} required style={{ minHeight: '120px', marginTop: '20px' }}/>
        <textarea name="healthInfo" placeholder="Información de salud (vacunas, esterilización, etc.)" value={formState.healthInfo} onChange={handleInputChange} required style={{ minHeight: '80px', marginTop: '20px' }}/>
        <h4 style={{marginTop: '30px'}}>Información de Contacto</h4>
        <div className="grid-columns">
            <input type="text" name="contactName" placeholder="Tu nombre" value={formState.contactName} onChange={handleInputChange} required />
            <input type="email" name="contactEmail" placeholder="Tu email" value={formState.contactEmail} onChange={handleInputChange} required />
            <input type="tel" name="contactPhone" placeholder="Tu teléfono" value={formState.contactPhone} onChange={handleInputChange} required />
        </div>
        <div style={{ marginTop: '20px' }}>
          <label>Foto de la Mascota:</label>
          <input type="file" id="adoption-file-input" onChange={handleFileChange} accept="image/*" required />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Publicando...' : 'Publicar en Adopción'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
