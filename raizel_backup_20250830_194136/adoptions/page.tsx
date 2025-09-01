'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import CreateAdoptionForm from '@/CreateAdoptionForm';
import { AuthProvider } from '@/AuthContext';
import FavoriteButton from '@/FavoriteButton';
import '@/AdoptionsPage.css'; // Importar el archivo CSS

interface PetForAdoption {
  id: string;
  petName: string;
  breed: string;
  age: string;
  location: string;
  imageUrl?: string;
}

const AdoptionsPageContent = () => {
  const [pets, setPets] = useState<PetForAdoption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const q = query(
          collection(db, 'adoptions'), 
          where('status', '==', 'available'), // Solo mostrar mascotas disponibles
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const petsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          petName: doc.data().petName,
          breed: doc.data().breed,
          age: doc.data().age,
          location: doc.data().location,
          imageUrl: doc.data().imageUrl,
        }));
        setPets(petsData);
      } catch (error) {
        console.error("Error fetching pets for adoption: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return (
    <div className="adoptions-page-container">
      <div className="adoptions-header">
        <h2>Adopta un Amigo para Siempre</h2>
        <p>Estos maravillosos animales están esperando una segunda oportunidad. ¿Puedes dársela?</p>
      </div>

      <CreateAdoptionForm />

      <hr style={{ margin: '30px 0' }} />
      
      <div className="adoptions-grid">
        {loading ? <p className="adoptions-empty-message">Cargando peluditos que buscan un hogar...</p> : pets.length === 0 ? (
          <p className="adoptions-empty-message">¡Buenas noticias! No hay mascotas en adopción en este momento.</p>
        ) : (
          pets.map(pet => (
            <Link key={pet.id} href={`/adoptions/${pet.id}`} className="adoption-card">
              <div className="adoption-image" style={{ backgroundImage: `url(${pet.imageUrl || 'https://via.placeholder.com/300x250.png?text=Adóptame'})` }} />
              <div className="adoption-info">
                <h3>{pet.petName}</h3>
                <div className="adoption-footer">
                    <p>{pet.breed} - {pet.age}</p>
                    <FavoriteButton 
                        contentId={pet.id} 
                        contentType="adoption_listing"
                        contentData={{ title: pet.petName, imageUrl: pet.imageUrl }}
                    />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdoptionsPage() {
    return (
        <AuthProvider>
            <AdoptionsPageContent />
        </AuthProvider>
    )
}
