'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  subcategory: string;
  condition: string;
  brand?: string;
  photos: string[];
  location: string;
  seller_username: string;
  seller_verified: boolean;
  views_count: number;
  likes_count: number;
  created_at: string;
}

const categories = ["Todos", "accesorios", "adopcion", "alimentacion", "juguetes", "servicios"];

const MarketplacePageContent = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categoryFilter !== 'Todos') {
          params.append('category', categoryFilter);
        }
        if (locationFilter) {
          params.append('location', locationFilter);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        params.append('sort', sortBy);
        params.append('order', 'desc');

        const response = await fetch(`/api/market/items?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setListings(data.data.items || []);
        } else {
          console.error('Error fetching listings:', data.error);
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [categoryFilter, locationFilter, searchQuery, sortBy]);

  return (
    <div className="marketplace-page-container">
      <aside className="marketplace-sidebar">
        <h2>Mercaplace</h2>
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
                    placeholder="Ej: Madrid, Barcelona"
                    value={locationFilter} 
                    onChange={(e) => setLocationFilter(e.target.value)} 
                />
            </div>
            <div className="filter-group">
                <label htmlFor="sort-by">Ordenar por</label>
                <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="created_at">Más recientes</option>
                    <option value="price">Precio</option>
                    <option value="views_count">Más vistos</option>
                    <option value="likes_count">Más populares</option>
                </select>
            </div>
        </div>
        <hr />
        <div className="create-listing-section">
          <h3>Crear Publicación</h3>
          <p>¿Tienes algo para vender o adoptar?</p>
          <Link href="/marketplace/create" className="create-listing-btn">
            Crear Publicación
          </Link>
        </div>
      </aside>
      <main className="marketplace-main-content">
        <div className="marketplace-grid">
          {loading ? (
            <p className="marketplace-empty-message">Cargando productos y servicios...</p>
          ) : listings.length === 0 ? (
            <p className="marketplace-empty-message">No se encontraron artículos con estos filtros.</p>
          ) : (
            listings.map(listing => (
              <Link key={listing.id} href={`/marketplace/${listing.id}`} className="listing-link">
                <div className="listing-card">
                  <div className="listing-image-container">
                    <Image 
                      src={listing.photos[0] || 'https://via.placeholder.com/300x200.png?text=Producto'} 
                      alt={listing.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="listing-info">
                    <p className="price">€{listing.price.toLocaleString('es-ES')}</p>
                    <h3 className="listing-title">{listing.title}</h3>
                    {listing.location && <p className="listing-location">{listing.location}</p>}
                    <div className="listing-footer">
                      <small>{listing.category} • {listing.condition}</small>
                      <div className="listing-stats">
                        <span>👁️ {listing.views_count}</span>
                        <span>❤️ {listing.likes_count}</span>
                      </div>
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
  return <MarketplacePageContent />;
}




