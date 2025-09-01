'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Link from 'next/link';
import './BirthdayPets.css';

interface BirthdayPet {
  userId: string;
  petName: string;
  petAvatarUrl: string;
}

export default function BirthdayPets() {
  const [birthdayPets, setBirthdayPets] = useState<BirthdayPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBirthdayPets = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const today = new Date();
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();
        
        const petsWithBirthdays: BirthdayPet[] = [];

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          if (userData.primaryPetId) {
            const petDocRef = doc(db, 'users', userDoc.id, 'pets', userData.primaryPetId);
            const petSnap = await getDoc(petDocRef);
            if (petSnap.exists()) {
              const petData = petSnap.data();
              if (petData.birthdate) {
                // Se suma 1 al día porque el input 'date' puede tener problemas de zona horaria
                const birthdate = new Date(petData.birthdate);
                if (birthdate.getMonth() === todayMonth && birthdate.getDate() + 1 === todayDay) {
                  petsWithBirthdays.push({
                    userId: userDoc.id,
                    petName: petData.name,
                    petAvatarUrl: petData.avatarUrl,
                  });
                }
              }
            }
          }
        }
        setBirthdayPets(petsWithBirthdays);
      } catch (error) {
        console.error("Error fetching birthday pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdayPets();
  }, []);

  if (loading || birthdayPets.length === 0) {
    return null;
  }

  return (
    <div className="birthday-pets-container">
      <h4>🎂 ¡Cumpleaños de la Manada!</h4>
      <div className="birthday-list">
        {birthdayPets.map(pet => (
          <Link key={pet.userId} href={`/profile/${pet.userId}`} className="birthday-pet-item">
            <img src={pet.petAvatarUrl} alt={pet.petName} />
            <span>{pet.petName}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
