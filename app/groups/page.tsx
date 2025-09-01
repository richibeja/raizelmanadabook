'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Link from 'next/link';
import '../globals.css';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
}

const GroupsPageContent = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const q = query(collection(db, 'groups'), orderBy('memberCount', 'desc'));
        const querySnapshot = await getDocs(q);
        const groupsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          memberCount: doc.data().memberCount || 0,
          imageUrl: doc.data().imageUrl,
        }));
        setGroups(groupsData);
      } catch (error) {
        console.error("Error fetching groups: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="groups-page-container">
      <h1>Grupos</h1>
      <div className="groups-list">
        {loading ? (
          <p className="groups-empty-message">Cargando grupos...</p>
        ) : groups.length === 0 ? (
          <p className="groups-empty-message">No hay grupos disponibles. ¡Crea el primero!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {groups.map(group => (
              <li key={group.id} className="group-item">
                <Link href={`/groups/${group.id}`} className="group-link">
                  <div className="group-card">
                    {group.imageUrl && <img src={group.imageUrl} alt={group.name} className="group-image"/>}
                    <div className="group-info">
                      <h3>{group.name}</h3>
                      <p>{group.description}</p>
                      <small>{group.memberCount} {group.memberCount === 1 ? 'miembro' : 'miembros'}</small>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function GroupsPage() {
    return <GroupsPageContent />;
}




