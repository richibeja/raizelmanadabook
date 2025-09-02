'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
  description?: string;
  benefits?: string[];
  presentaciones?: string[];
  target?: string;
  composicion?: string;
}

const CatalogoPageContent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Productos Raízel reales - Catálogo oficial
        const productosRaizel = [
          {
            id: 'vital-barf-pollo',
            name: 'Vital BARF Pollo',
            price: 45000, // Por kg  
            category: 'barf',
            description: 'Alimentación cruda biológicamente apropiada con pollo fresco colombiano. Sin químicos ni conservantes.',
            benefits: ['Digestión óptima', 'Pelaje brillante', 'Energía sostenida', 'Sistema inmune fuerte'],
            presentaciones: ['500g - $22,500', '1kg - $45,000', '2kg - $85,000'],
            target: 'Perros todas las edades - Especial cachorros y adultos',
            composicion: '65% carne pollo + 15% vísceras + 20% huesos carnosos',
            imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop'
          },
          {
            id: 'vital-barf-res',
            name: 'Vital BARF Res', 
            price: 52000, // Por kg
            category: 'barf',
            description: 'BARF con carne de res premium para perros grandes y muy activos. Desarrollo muscular superior.',
            benefits: ['Desarrollo muscular', 'Huesos fuertes', 'Recuperación rápida', 'Ideal razas grandes'],
            presentaciones: ['1kg - $52,000', '2kg - $98,000', '5kg - $235,000'],
            target: 'Perros grandes (20kg+) - Razas trabajadoras y deportivas',
            composicion: '68% carne res + 12% vísceras + 20% estructura ósea',
            imageUrl: 'https://images.unsplash.com/photo-1601758228041-3caa3d3d3c1c?w=400&h=400&fit=crop'
          },
          {
            id: 'vital-pellets',
            name: 'Vital Pellets Naturales',
            price: 38000, // Por kg
            category: 'pellets', 
            description: 'Pellets horneados a baja temperatura sin químicos, BHA, BHT ni conservantes artificiales.',
            benefits: ['100% natural', 'Fácil digestión', 'Sin químicos', 'Hecho en Colombia'],
            presentaciones: ['1kg - $38,000', '3kg - $108,000', '8kg - $275,000'],
            target: 'Perros y gatos - Alternativa natural a pellets comerciales', 
            composicion: '28% proteína + 35% carbohidratos complejos + 15% fibras naturales',
            imageUrl: 'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?w=400&h=400&fit=crop'
          }
        ];
        setProducts(productosRaizel);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'alimentos', label: 'Alimentos' },
    { value: 'juguetes', label: 'Juguetes' },
    { value: 'accesorios', label: 'Accesorios' }
  ];

  return (
    <div className="catalogo-page-container">
      <Header />
      <div className="catalogo-content">
        <h1>Catálogo de Productos</h1>
        
        <div className="catalogo-filters">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`filter-button ${selectedCategory === category.value ? 'active' : ''}`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <div className="catalogo-grid">
          {loading ? (
            <p className="catalogo-empty-message">Cargando productos...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="catalogo-empty-message">No hay productos disponibles en esta categoría.</p>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image" style={{ backgroundImage: `url(${product.imageUrl || 'https://via.placeholder.com/300x300.png?text=Producto'})` }} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  {product.description && <p className="product-description">{product.description}</p>}
                  <div className="product-price">${product.price.toLocaleString()}</div>
                  <button className="add-to-cart-button">Agregar al carrito</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function CatalogoPage() {
    return <CatalogoPageContent />;
}