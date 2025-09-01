
'use client';

import { useEffect, useState } from "react";
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm"; // Corrected Path
import "@/components/CheckoutForm.css"; // Corrected Path

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Cargar Stripe solo si la clave pública está disponible.
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Crea el PaymentIntent tan pronto como la página se carga
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 10000 }), // Ejemplo: 100.00 MXN
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError("No se pudo inicializar el pago. Por favor, intenta de nuevo.");
          console.error("Failed to get client secret:", data.error || "Unknown error");
        }
      })
      .catch((err) => {
        setError("Error de conexión al iniciar el pago.");
        console.error("Error fetching client secret:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
