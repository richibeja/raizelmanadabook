
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import Link from 'next/link';
import Image from 'next/image'; // Importar el componente Image
import CreateListingForm from '../../CreateListingForm'; 
import { AuthProvider } from '../../AuthContext';
import FavoriteButton from '../../FavoriteButton';
import '../../MarketplacePage.css'; // Importar el archivo CSS

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  imageUrl?: string;
  location?: string;
}

const categories = ["Todos", "Alimento", "Juguetes", "Accesorios", "Salud y Cuidado", "Servicios"];

const MarketplacePageContent = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const listingsCollection = collection(db, 'marketplace_listings');
        const queryConstraints = [];

        // Filtro de búsqueda por palabra clave
        if (searchQuery.trim() !== '') {
          queryConstraints.push(where('keywords', 'array-contains', searchQuery.trim().toLowerCase()));
        }

        if (categoryFilter !== 'Todos') {
          queryConstraints.push(where('category', '==', categoryFilter));
        }

        if (locationFilter.trim() !== '') {
          // Para búsquedas de ubicación insensibles a mayúsculas, se necesita una solución más avanzada
          // o guardar la ubicación en minúsculas. Por ahora, será sensible a mayúsculas.
          queryConstraints.push(where('location', '==', locationFilter.trim()));
        }

        if (sortBy === 'price_asc') {
          queryConstraints.push(orderBy('price', 'asc'));
        } else if (sortBy === 'price_desc') {
          queryConstraints.push(orderBy('price', 'desc'));
        } else {
          // El orderBy por defecto debe ser diferente al campo de la consulta de desigualdad (keywords)
          // si se usa uno. Si no hay búsqueda, podemos ordenar por fecha.
          if(searchQuery.trim() === '') {
            queryConstraints.push(orderBy('createdAt', 'desc'));
          }
        }

        const q = query(listingsCollection, ...queryConstraints);
        const querySnapshot = await getDocs(q);
        const listingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Listing[];
        setListings(listingsData);
      } catch (error) {
        console.error("Error fetching listings: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [categoryFilter, locationFilter, searchQuery, sortBy]);

  return (
    <div className="marketplace-page-container">
      <aside className="marketplace-sidebar">
        <h2>Marketplace</h2>
        <hr />
        <div className="marketplace-filters">
            <div className="filter-group">
                <label htmlFor="search-query">Buscar artículo</label>
                <input 
                    type="text" 
                    id="search-query" 
                    placeholder="Ej: collar, cama, etc."
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
            </div>
            <div className="filter-group">
                <label htmlFor="category-filter">Categoría</label>
                <select id="category-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div className="filter-group">
                <label htmlFor="location-filter">Ubicación</label>
                <input 
                    type="text" 
                    id="location-filter" 
                    placeholder="Ej: Bogotá"
                    value={locationFilter} 
                    onChange={(e) => setLocationFilter(e.target.value)} 
                />
            </div>
            <div className="filter-group">
                <label htmlFor="sort-by">Ordenar por</label>
                <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="createdAt_desc">Más recientes</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                </select>
            </div>
        </div>
        <hr />
        <CreateListingForm />
      </aside>
      <main className="marketplace-main-content">
        <div className="marketplace-grid">
          {loading ? <p className="marketplace-empty-message">Cargando productos y servicios...</p> : listings.length === 0 ? (
            <p className="marketplace-empty-message">No se encontraron artículos con estos filtros.</p>
          ) : (
            listings.map(listing => (
              <Link key={listing.id} href={`/marketplace/${listing.id}`} className="listing-link">
                <div className="listing-card">
                  <div className="listing-image-container">
                    <Image 
                      src={listing.imageUrl || 'https://via.placeholder.com/300x200.png?text=Producto'} 
                      alt={listing.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="listing-info">
                    <p className="price">${listing.price.toLocaleString('es-CO')}</p>
                    <h3 className="listing-title">{listing.title}</h3>
                    {listing.location && <p className="listing-location">{listing.location}</p>}
                    <div className="listing-footer">
                      <small>{listing.category}</small>
                      <FavoriteButton 
                          contentId={listing.id} 
                          contentType="marketplace_listing"
                          contentData={{ title: listing.title, imageUrl: listing.imageUrl }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default function MarketplacePage() {
    return (
        <AuthProvider>
            <MarketplacePageContent />
        </AuthProvider>
    )
}
