
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, startAt, endAt, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase';

interface UserSearchResult {
  id: string;
  displayName: string;
  // Podrías añadir el avatar aquí
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Si la búsqueda está vacía, limpiamos los resultados
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    // Cancelar el timeout anterior si el usuario sigue escribiendo
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    setLoading(true);

    // Establecer un nuevo timeout para ejecutar la búsqueda después de 300ms
    debounceTimeout.current = setTimeout(async () => {
      try {
        const q = query(
          collection(db, 'users'), // Asumiendo que buscas en la colección 'users'
          orderBy('displayName'), // Necesitas un índice en Firestore para este campo
          startAt(searchQuery),
          endAt(searchQuery + '\uf8ff'),
          limit(10) // Limitar el número de resultados
        );

        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          displayName: doc.data().displayName,
        }));
        setResults(users);
      } catch (error) {
        console.error("Error searching users: ", error);
        // Podrías querer mostrar un error en la UI
      } finally {
        setLoading(false);
      }
    }, 300);

    // Limpiar el timeout si el componente se desmonta
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };

  }, [searchQuery]);

  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: '100%' }}
      />
      {loading && <p>Buscando...</p>}
      {searchQuery && !loading && results.length > 0 && (
        <ul style={resultsListStyle}>
          {results.map(user => (
            <li key={user.id} style={resultsItemStyle}>
              <Link href={`/profile/${user.id}`} onClick={() => setSearchQuery('')}>
                {user.displayName}
              </Link>
            </li>
          ))}
        </ul>
      )}
       {searchQuery && !loading && results.length === 0 && (
        <div style={noResultsStyle}>
            <p>No se encontraron resultados.</p>
        </div>
       )}
    </div>
  );
}

const resultsListStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    border: '1px solid #ccc',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    zIndex: 1000,
};

const resultsItemStyle: React.CSSProperties = {
    padding: '10px',
    borderBottom: '1px solid #eee',
};

const noResultsStyle: React.CSSProperties = {
    ...resultsListStyle,
    padding: '10px',
}
