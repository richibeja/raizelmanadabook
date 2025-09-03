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
        // Productos BARF Raízel reales - Catálogo actualizado
        const productosRaizel = [
          {
            id: 'choribarf',
            name: 'Choribarf',
            price: 0, // Consultar precio
            category: 'barf',
            description: 'Chorizo BARF natural, ideal para premios y entrenamiento. 100% carne fresca sin aditivos.',
            benefits: ['Premio natural', 'Alto valor proteico', 'Fácil dosificación', 'Irresistible para perros'],
            presentaciones: ['Consultar disponibilidad y precios'],
            target: 'Perros todas las edades - Premios y recompensas',
            composicion: 'Carne fresca + vísceras naturales sin conservantes',
            imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop'
          },
          {
            id: 'helados-barf',
            name: 'Helados BARF',
            price: 0, // Consultar precio
            category: 'barf',
            description: 'Helados naturales BARF para mascotas, refrescantes y nutritivos. Perfectos para días calurosos.',
            benefits: ['Refrescante natural', 'Hidratación extra', 'Premio saludable', 'Ideal verano'],
            presentaciones: ['Consultar sabores y tamaños disponibles'],
            target: 'Perros todas las edades - Refrescante y nutritivo',
            composicion: 'Base BARF natural congelada sin azúcares',
            imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop'
          },
          {
            id: 'bandejas-higado-res',
            name: 'Bandejas Hígado de Res',
            price: 0, // Consultar precio
            category: 'barf',
            description: 'Hígado de res fresco en bandejas, rico en hierro y vitaminas. Ideal para suplementar dieta BARF.',
            benefits: ['Alto en hierro', 'Vitaminas A y B', 'Palatabilidad excelente', 'Suplemento natural'],
            presentaciones: ['Bandejas de diferentes tamaños disponibles'],
            target: 'Perros con deficiencias nutricionales - Suplemento BARF',
            composicion: '100% hígado de res fresco sin procesamiento',
            imageUrl: 'https://images.unsplash.com/photo-1601758228041-3caa3d3d3c1c?w=400&h=400&fit=crop'
          },
          {
            id: 'mista-visceras-res',
            name: 'Mista con Vísceras de Res',
            price: 0, // Consultar precio
            category: 'barf',
            description: 'Mezcla balanceada de vísceras de res (hígado, corazón, riñón) para dieta BARF completa.',
            benefits: ['Nutrición completa', 'Órganos frescos', 'Balanceado naturalmente', 'Rico en enzimas'],
            presentaciones: ['Consultar disponibilidad según peso mascota'],
            target: 'Perros en dieta BARF - Vísceras esenciales semanales',
            composicion: 'Hígado + corazón + riñón de res fresco',
            imageUrl: 'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?w=400&h=400&fit=crop'
          },
          {
            id: 'vital-pellets',
            name: 'Vital Pellets Naturales',
            price: 0, // Consultar precio
            category: 'pellets', 
            description: 'Pellets horneados a baja temperatura sin químicos, BHA, BHT ni conservantes artificiales.',
            benefits: ['100% natural', 'Fácil digestión', 'Sin químicos', 'Hecho en Colombia'],
            presentaciones: ['Consultar presentaciones disponibles'],
            target: 'Perros y gatos - Alternativa natural a pellets comerciales', 
            composicion: '28% proteína + 35% carbohidratos complejos + 15% fibras naturales',
            imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop'
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