'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../globals.css';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  seller: string;
  category: string;
  location: string;
}

export default function MarketplaceListingPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Mock data since Firebase is not available
        const mockListing = {
          id: params.listingId as string,
          title: 'Producto para Mascotas',
          description: 'Descripción del producto para mascotas',
          price: 25000,
          imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
          seller: 'Vendedor Ejemplo',
          category: 'accesorios',
          location: 'Bogotá'
        };
        setListing(mockListing);
      } catch (error) {
        console.error("Error fetching listing: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.listingId) {
      fetchListing();
    }
  }, [params.listingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <p className="text-gray-600">El producto que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace-listing-page">
      <Header />
      <div className="listing-content">
        <div className="listing-grid">
          <div className="listing-image">
            <img src={listing.imageUrl || 'https://via.placeholder.com/400x300.png?text=Producto'} alt={listing.title} />
          </div>
          <div className="listing-info">
            <h1>{listing.title}</h1>
            <p className="listing-description">{listing.description}</p>
            <div className="listing-price">${listing.price.toLocaleString()}</div>
            <div className="listing-meta">
              <p><strong>Vendedor:</strong> {listing.seller}</p>
              <p><strong>Ubicación:</strong> {listing.location}</p>
              <p><strong>Categoría:</strong> {listing.category}</p>
            </div>
            <button className="contact-seller-button">Contactar Vendedor</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}