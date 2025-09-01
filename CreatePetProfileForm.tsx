'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import './CreatePetProfileForm.css';

export default function CreatePetProfileForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    petType: 'Perro',
    breed: '',
    birthdate: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setMessage('Debes iniciar sesión.');
      return;
    }
    if (!file) {
        setMessage('Debes subir una foto de tu mascota.');
        return;
    }

    setLoading(true);
    setMessage('Creando perfil de tu mascota...');

    try {
      const storageRef = ref(storage, `pet_avatars/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const avatarUrl = await getDownloadURL(snapshot.ref);

      const batch = writeBatch(db);

      // 1. Crear el documento de la mascota en la subcolección 'pets'
      const petRef = doc(collection(db, 'users', user.uid, 'pets'));
      batch.set(petRef, {
        ...formState,
        avatarUrl: avatarUrl,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });

      // 2. Actualizar el documento del usuario para establecer esta mascota como la principal
      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, { primaryPetId: petRef.id });

      await batch.commit();

      setMessage(`¡Perfil de ${formState.name} creado! Redirigiendo...`);
      router.push(`/profile/${user.uid}`);

    } catch (error) {
      console.error("Error creating pet profile: ", error);
      setMessage('Hubo un error al crear el perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="create-pet-profile-container">
      <h2>Crea el Perfil de tu Mascota</h2>
      <p>Este será el perfil principal que otros verán en ManadaBook.</p>
      <form onSubmit={handleSubmit} className="create-pet-profile-form">
        <div>
          <label>Nombre de tu mascota:</label>
          <input type="text" name="name" value={formState.name} onChange={handleInputChange} required />
        </div>
        <div className="form-row">
            <div>
                <label>Tipo:</label>
                <select name="petType" value={formState.petType} onChange={handleInputChange}>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                </select>
            </div>
            <div>
                <label>Raza:</label>
                <input type="text" name="breed" placeholder="Ej: Criollo, Golden Retriever" value={formState.breed} onChange={handleInputChange} required />
            </div>
        </div>
        <div>
          <label>Fecha de Nacimiento:</label>
          <input type="date" name="birthdate" value={formState.birthdate} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Foto de Perfil:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear Perfil de Mascota'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
