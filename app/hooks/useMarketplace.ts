'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  title: string;
  description: string;
  price: number;
  currency: 'USD' | 'EUR' | 'MXN';
  category: 'food' | 'toys' | 'accessories' | 'health' | 'grooming' | 'clothing' | 'home' | 'other';
  subcategory?: string;
  images: string[];
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  brand?: string;
  size?: string;
  color?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  location: string;
  shippingAvailable: boolean;
  shippingCost?: number;
  pickupAvailable: boolean;
  isActive: boolean;
  isSold: boolean;
  viewsCount: number;
  likesCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
  userLiked?: boolean;
  userViewed?: boolean;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  product: Product;
  quantity: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'transfer' | 'crypto';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export function useMarketplace() {
  const { user, userProfile } = useManadaBookAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setMyProducts([]);
      setMyOrders([]);
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query para obtener todos los productos activos
    const productsQuery = query(
      collection(db, 'products'),
      where('isActive', '==', true),
      where('isSold', '==', false),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      productsQuery,
      async (snapshot) => {
        try {
          const productsData: Product[] = [];
          
          for (const docSnapshot of snapshot.docs) {
            const productData = docSnapshot.data();
            
            // Obtener información del vendedor
            const sellerDoc = await doc(db, 'users', productData.sellerId).get();
            let sellerName = 'Vendedor Anónimo';
            let sellerAvatar = '';
            
            if (sellerDoc.exists()) {
              const sellerData = sellerDoc.data();
              sellerName = sellerData.name || 'Vendedor Anónimo';
              sellerAvatar = sellerData.avatarUrl || '';
            }

            // Verificar si el usuario actual vio este producto
            const viewQuery = query(
              collection(db, 'product_views'),
              where('productId', '==', docSnapshot.id),
              where('userId', '==', user.uid)
            );
            const viewSnapshot = await getDocs(viewQuery);
            const userViewed = !viewSnapshot.empty;

            // Verificar si el usuario le dio like
            const likeQuery = query(
              collection(db, 'product_likes'),
              where('productId', '==', docSnapshot.id),
              where('userId', '==', user.uid)
            );
            const likeSnapshot = await getDocs(likeQuery);
            const userLiked = !likeSnapshot.empty;

            productsData.push({
              id: docSnapshot.id,
              sellerId: productData.sellerId,
              sellerName,
              sellerAvatar,
              title: productData.title || '',
              description: productData.description || '',
              price: productData.price || 0,
              currency: productData.currency || 'USD',
              category: productData.category || 'other',
              subcategory: productData.subcategory || '',
              images: productData.images || [],
              condition: productData.condition || 'good',
              brand: productData.brand || '',
              size: productData.size || '',
              color: productData.color || '',
              weight: productData.weight || 0,
              dimensions: productData.dimensions || {},
              tags: productData.tags || [],
              location: productData.location || '',
              shippingAvailable: productData.shippingAvailable || false,
              shippingCost: productData.shippingCost || 0,
              pickupAvailable: productData.pickupAvailable || false,
              isActive: productData.isActive || false,
              isSold: productData.isSold || false,
              viewsCount: productData.viewsCount || 0,
              likesCount: productData.likesCount || 0,
              sharesCount: productData.sharesCount || 0,
              createdAt: productData.createdAt?.toDate() || new Date(),
              updatedAt: productData.updatedAt?.toDate() || new Date(),
              userLiked,
              userViewed,
            });
          }

          setProducts(productsData);
          
          // Filtrar productos del usuario
          const userProducts = productsData.filter(product => 
            product.sellerId === user.uid
          );
          setMyProducts(userProducts);
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching products:', err);
          setError('Error al cargar los productos');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in products listener:', err);
        setError('Error al cargar los productos');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createProduct = async (productData: {
    title: string;
    description: string;
    price: number;
    currency: Product['currency'];
    category: Product['category'];
    subcategory?: string;
    images: string[];
    condition: Product['condition'];
    brand?: string;
    size?: string;
    color?: string;
    weight?: number;
    dimensions?: Product['dimensions'];
    tags: string[];
    location: string;
    shippingAvailable: boolean;
    shippingCost?: number;
    pickupAvailable: boolean;
  }) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (!productData.title.trim()) throw new Error('El título es requerido');
    if (productData.price <= 0) throw new Error('El precio debe ser mayor a 0');

    try {
      const newProduct = {
        sellerId: user.uid,
        sellerName: userProfile?.name || 'Usuario Anónimo',
        sellerAvatar: userProfile?.avatarUrl || '',
        title: productData.title.trim(),
        description: productData.description.trim(),
        price: productData.price,
        currency: productData.currency,
        category: productData.category,
        subcategory: productData.subcategory || '',
        images: productData.images,
        condition: productData.condition,
        brand: productData.brand || '',
        size: productData.size || '',
        color: productData.color || '',
        weight: productData.weight || 0,
        dimensions: productData.dimensions || {},
        tags: productData.tags,
        location: productData.location,
        shippingAvailable: productData.shippingAvailable,
        shippingCost: productData.shippingCost || 0,
        pickupAvailable: productData.pickupAvailable,
        isActive: true,
        isSold: false,
        viewsCount: 0,
        likesCount: 0,
        sharesCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'products'), newProduct);
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(prev => prev.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart(prev => [...prev, {
        productId: product.id,
        product,
        quantity,
        addedAt: new Date(),
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    products,
    myProducts,
    myOrders,
    cart,
    loading,
    error,
    createProduct,
    addToCart,
    removeFromCart,
    getCartTotal,
    getCartItemCount,
  };
}

// Hook para favoritos del marketplace
export const useMarketplaceFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      // Simular datos de favoritos
      setFavorites(['1', '2', '3']);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar favoritos');
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId: string) => {
    try {
      if (favorites.includes(productId)) {
        setFavorites(favorites.filter(id => id !== productId));
      } else {
        setFavorites([...favorites, productId]);
      }
    } catch (err) {
      setError('Error al actualizar favoritos');
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    loadFavorites,
    toggleFavorite
  };
};

// Hook para marketplace del usuario
export const useUserMarketplace = () => {
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserProducts = async () => {
    try {
      setLoading(true);
      // Simular datos de productos del usuario
      setUserProducts([]);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar productos del usuario');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProducts();
  }, []);

  return {
    userProducts,
    loading,
    error,
    loadUserProducts
  };
};
