'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from 'C:/Users/ALP/Documents/raizel/../AuthContext';

const categories = ["Alimento", "Juguetes", "Accesorios", "Salud y Cuidado", "Servicios"];

export default function CreateListingForm() {
  const { user } = useAuth();
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    price: '',
    category: categories[0],
    location: '',
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
    if (!user) {
      setMessage('Debes iniciar sesión para publicar un artículo.');
      return;
    }
    if (!file) {
        setMessage('Debes subir una imagen para el artículo.');
        return;
    }

    setLoading(true);
    setMessage('Publicando artículo...');

    try {
      const storageRef = ref(storage, `marketplace/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Generar palabras clave para la búsqueda a partir del título
      const generateKeywords = (title: string) => {
        const keywords = new Set<string>();
        const lowerCaseTitle = title.toLowerCase();
        const words = lowerCaseTitle.split(' ').filter(Boolean); // Divide por palabras
        words.forEach(word => keywords.add(word));
        return Array.from(keywords);
      };

      await addDoc(collection(db, 'marketplace_listings'), {
        ...formState,
        price: parseFloat(formState.price),
        imageUrl: imageUrl,
        keywords: generateKeywords(formState.title), // Guardar las palabras clave
        status: 'available', // Estado inicial del artículo
        sellerId: user.uid,
        sellerName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      });

      setMessage(`¡Artículo "${formState.title}" publicado con éxito!`);
      // Reset form
      setFormState({ title: '', description: '', price: '', category: categories[0], location: '' });
      setFile(null);
      const fileInput = document.getElementById('listing-file-input') as HTMLInputElement;
      if(fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Error creating listing: ", error);
      setMessage('Hubo un error al publicar el artículo.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Inicia sesión para publicar en el Mercado.</p>;

  return (
    <div className="create-listing-container">
      <h3>Vender un Artículo o Servicio</h3>
      <form onSubmit={handleSubmit} className="create-listing-form">
        <div>
          <label>Título:</label>
          <input type="text" name="title" value={formState.title} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea name="description" value={formState.description} onChange={handleInputChange} required />
        </div>
        <div className="price-category-group">
            <div>
                <label>Precio (COP):</label>
                <input type="number" name="price" value={formState.price} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Categoría:</label>
                <select name="category" value={formState.category} onChange={handleInputChange} required >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
        </div>
        <div>
          <label>Ubicación (Ciudad):</label>
          <input type="text" name="location" value={formState.location} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Imagen del Artículo:</label>
          <input type="file" id="listing-file-input" onChange={handleFileChange} accept="image/*" required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar Artículo'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
