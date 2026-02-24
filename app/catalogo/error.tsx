'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Algo salió mal!</h2>
        <p className="text-gray-600 mb-6">
          Ha ocurrido un error al cargar el catálogo de productos.
        </p>
        <button
          onClick={reset}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}