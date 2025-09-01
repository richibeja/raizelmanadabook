'use client';
import { useState, useEffect } from 'react';
// import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { db } from '../../firebaseConfig';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

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
        // Mock data since Firebase is not available
        const mockPets = [
          {
            id: '1',
            petName: 'Luna',
            breed: 'Labrador',
            age: '2 años',
            location: 'Bogotá',
            imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=250&fit=crop'
          },
          {
            id: '2',
            petName: 'Max',
            breed: 'Golden Retriever',
            age: '1 año',
            location: 'Medellín',
            imageUrl: 'https://images.unsplash.com/photo-1547407139-3c921a71905c?w=300&h=250&fit=crop'
          }
        ];
        setPets(mockPets);
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
      <Header />
      <div className="adoptions-content">
        <h1>Mascotas en Adopción</h1>
        
        <div className="adoptions-grid">
          {loading ? (
            <p className="adoptions-empty-message">Cargando peluditos que buscan un hogar...</p>
          ) : pets.length === 0 ? (
            <p className="adoptions-empty-message">¡Buenas noticias! No hay mascotas en adopción en este momento.</p>
          ) : (
            pets.map(pet => (
              <Link key={pet.id} href={`/adoptions/${pet.id}`} className="adoption-card">
                <div className="adoption-image" style={{ backgroundImage: `url(${pet.imageUrl || 'https://via.placeholder.com/300x250.png?text=Adóptame'})` }} />
                <div className="adoption-info">
                  <h3>{pet.petName}</h3>
                  <div className="adoption-details">
                    <p>{pet.breed} - {pet.age}</p>
                    <p>{pet.location}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function AdoptionsPage() {
    return <AdoptionsPageContent />;
}