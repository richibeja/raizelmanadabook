'use client';
import { useEffect, useState } from "react";
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from '../components/CheckoutForm';
import '../globals.css';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implementar lógica de Stripe
    setLoading(false);
  }, []);

  const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  if (!stripePublishableKey) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Error de Configuración</h1>
        <p>El formulario de pago no puede mostrarse. Falta la clave de Stripe.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      {loading && <p>Cargando formulario de pago...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {stripePromise && clientSecret && !loading && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}




