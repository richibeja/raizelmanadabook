'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from './AuthContext';
import './CreateProductForm.css';

const categories = ["BARF", "Pellets", "Snacks"];

export default function CreateProductForm() {
  const { user } = useAuth();
  const [formState, setFormState] = useState({
    name: '',
    summary: '',
    description: '',
    category: categories[0],
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
      setMessage('Debes iniciar sesión como administrador.');
      return;
    }
    if (!file) {
        setMessage('Debes subir una imagen para el producto.');
        return;
    }

    setLoading(true);
    setMessage('Creando producto...');

    try {
      const storageRef = ref(storage, `raizel_products/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'raizel_products'), {
        ...formState,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
      });

      setMessage(`¡Producto "${formState.name}" creado con éxito!`);
      setFormState({ name: '', summary: '', description: '', category: categories[0] });
      setFile(null);
      const fileInput = document.getElementById('product-file-input') as HTMLInputElement;
      if(fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Error creating product: ", error);
      setMessage('Hubo un error al crear el producto.');
    } finally {
      setLoading(false);
    }
  };

  // En una app real, aquí se verificaría si el usuario tiene rol de 'admin'
  if (!user) return <p>Acceso denegado.</p>;

  return (
    <div className="create-product-form-container">
      <h3>Añadir Nuevo Producto al Catálogo</h3>
      <form onSubmit={handleSubmit} className="create-product-form">
        <input type="text" name="name" placeholder="Nombre del Producto" value={formState.name} onChange={handleInputChange} required />
        <input type="text" name="summary" placeholder="Resumen corto del producto" value={formState.summary} onChange={handleInputChange} required />
        <textarea name="description" placeholder="Descripción completa" value={formState.description} onChange={handleInputChange} required />
        <select name="category" value={formState.category} onChange={handleInputChange}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <label>Imagen del Producto:</label>
        <input type="file" id="product-file-input" onChange={handleFileChange} accept="image/*" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Añadir Producto'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
