'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from './AuthContext';
import './CreateAdoptionListingForm.css';

const petTypes = ["Perro", "Gato"];
const petSizes = ["Pequeño", "Mediano", "Grande"];

export default function CreateAdoptionListingForm() {
  const { user } = useAuth();
  const [formState, setFormState] = useState({
    name: '',
    petType: petTypes[0],
    breed: '',
    age: '',
    size: petSizes[0],
    location: '',
    story: '',
    contactPhone: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!user || !file) {
      setMessage('Debes iniciar sesión y subir una foto.');
      return;
    }

    setLoading(true);
    setMessage('Publicando...');

    try {
      const storageRef = ref(storage, `adoptions/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'adoption_listings'), {
        ...formState,
        age: parseInt(formState.age),
        imageUrl: imageUrl,
        publisherId: user.uid,
        publisherName: user.displayName || user.email,
        status: 'available',
        createdAt: serverTimestamp(),
      });

      setMessage(`¡${formState.name} ha sido publicado en adopción!`);
      setFormState({ name: '', petType: petTypes[0], breed: '', age: '', size: petSizes[0], location: '', story: '', contactPhone: '' });
      setFile(null);
      const fileInput = document.getElementById('adoption-file-input') as HTMLInputElement;
      if(fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Error creating adoption listing: ", error);
      setMessage('Hubo un error al realizar la publicación.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Inicia sesión para publicar en la sección de adopciones.</p>;

  return (
    <div className="create-adoption-form-container">
      <h3>Dar una Mascota en Adopción</h3>
      <form onSubmit={handleSubmit} className="create-adoption-form">
        <input type="text" name="name" placeholder="Nombre de la mascota" value={formState.name} onChange={handleInputChange} required />
        <textarea name="story" placeholder="Cuenta su historia..." value={formState.story} onChange={handleInputChange} required />
        <div className="form-row">
            <select name="petType" value={formState.petType} onChange={handleInputChange}><option value="">Tipo</option>{petTypes.map(type => <option key={type} value={type}>{type}</option>)}</select>
            <input type="text" name="breed" placeholder="Raza (ej. Criollo)" value={formState.breed} onChange={handleInputChange} required />
        </div>
        <div className="form-row">
            <input type="number" name="age" placeholder="Edad (meses)" value={formState.age} onChange={handleInputChange} required />
            <select name="size" value={formState.size} onChange={handleInputChange}><option value="">Tamaño</option>{petSizes.map(size => <option key={size} value={size}>{size}</option>)}</select>
        </div>
        <input type="text" name="location" placeholder="Ubicación (Ciudad)" value={formState.location} onChange={handleInputChange} required />
        <input type="tel" name="contactPhone" placeholder="Teléfono de contacto" value={formState.contactPhone} onChange={handleInputChange} required />
        <div>
          <label>Foto de la Mascota:</label>
          <input type="file" id="adoption-file-input" onChange={handleFileChange} accept="image/*" required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Publicando...' : 'Publicar en Adopción'}</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
