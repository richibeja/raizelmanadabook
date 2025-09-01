
'use client';

import { useEffect, useState } from 'react';
import { useStripe, Elements } from '@stripe/react-stripe-js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';

// Este componente es necesario para poder usar los hooks
const PaymentStatus = () => {
  const stripe = useStripe();
  const { user } = useAuth(); // Hook para obtener el usuario logueado
  const [message, setMessage] = useState<string | null>(null);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (!stripe || !user || processed) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
      if (paymentIntent?.status === 'succeeded' && !processed) {
        setMessage('¡Pago exitoso! Guardando tu pedido...');
        setProcessed(true); // Evita duplicados

        try {
          // Guarda el pedido en la colección 'orders' de Firestore
          await addDoc(collection(db, 'orders'), {
            userId: user.uid,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            createdAt: serverTimestamp(),
            // En una app real, aquí añadirías los items del carrito
          });
          setMessage('¡Pago exitoso y pedido guardado!');
        } catch (error) {
          console.error("Error saving order to Firestore:", error);
          setMessage("El pago fue exitoso, pero hubo un error al guardar tu pedido.");
        }
      } else {
         switch (paymentIntent?.status) {
            case 'processing':
              setMessage("El pago se está procesando.");
              break;
            case 'requires_payment_method':
              setMessage('El pago falló. Por favor, intenta con otro método de pago.');
              break;
            default:
              setMessage('Algo salió mal.');
              break;
          }
      }
    });
  }, [stripe, user, processed]);

  return (
    <div>
      <h1>Estado del Pago</h1>
      {message ? <p>{message}</p> : <p>Cargando resultado del pago...</p>}
    </div>
  );
};

// Carga tu clave publicable de Stripe desde las variables de entorno
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function PaymentSuccessPage() {
  // El AuthProvider ya está en el layout principal, no es necesario aquí.
  // Envolvemos el componente de estado con el provider de Elements
  // para que pueda usar el hook `useStripe`.
  return (
    <Elements stripe={stripePromise}>
      <PaymentStatus />
    </Elements>
  );
}
