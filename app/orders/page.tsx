import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../globals.css';

'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
@/;

// Definimos un tipo para nuestros pedidos
interface Order {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
}

const OrdersList = () => {
    const { user, loading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchOrders = async () => {
                try {
                    const q = query(
                        collection(db, 'orders'), 
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc')
                    );
                    const querySnapshot = await getDocs(q);
                    const userOrders = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        // Convertimos el Timestamp de Firestore a un objeto Date de JS
                        const createdAt = data.createdAt instanceof Timestamp 
                            ? data.createdAt.toDate() 
                            : new Date();

                        return {
                            id: doc.id,
                            amount: data.amount,
                            currency: data.currency,
                            status: data.status,
                            createdAt: createdAt,
                        };
                    });
                    setOrders(userOrders);
                } catch (error) {
                    console.error("Error fetching orders: ", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchOrders();
        }
         else if (!loading) {
            // Si no hay usuario y la autenticación ha terminado de cargar
            setIsLoading(false);
        }
    }, [user, loading]);

    if (isLoading || loading) {
        return <p>Cargando historial de pedidos...</p>;
    }

    if (!user) {
        return <p>Por favor, <a href="/login">inicia sesión</a> para ver tus pedidos.</p>;
    }

    return (
        <div>
            <h2>Mi Historial de Pedidos</h2>
            {orders.length === 0 ? (
                <p>Aún no has realizado ningún pedido.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {orders.map(order => (
                        <li key={order.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
                            <p><strong>ID del Pedido:</strong> {order.id}</p>
                            <p><strong>Total:</strong> {(order.amount / 100).toFixed(2)} {order.currency.toUpperCase()}</p>
                            <p><strong>Fecha:</strong> {order.createdAt.toLocaleDateString('es-MX')}</p>
                            <p><strong>Estado:</strong> {order.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function OrdersPage() {
    // El AuthProvider ya está en el layout principal, no es necesario aquí.
    return <OrdersList />;
}




