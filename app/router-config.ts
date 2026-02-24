// Configuración para suprimir warnings de React Router
// Estos warnings vienen de Next.js internamente y no afectan la funcionalidad

// Función para suprimir warnings específicos
function suppressReactRouterWarnings() {
  if (typeof window === 'undefined') return;

  // Guardar la función original de console.warn
  const originalWarn = console.warn;

  // Reemplazar console.warn con una versión filtrada
  console.warn = (...args: any[]) => {
    const message = args[0];

    // Verificar si es un warning de React Router
    if (typeof message === 'string') {
      const isReactRouterWarning =
        message.includes('React Router Future Flag Warning') ||
        message.includes('v7_startTransition') ||
        message.includes('v7_relativeSplatPath') ||
        message.includes('React Router will begin wrapping state updates') ||
        message.includes('Relative route resolution within Splat routes') ||
        message.includes('React Router will begin wrapping state updates in `React.startTransition`') ||
        message.includes('Relative route resolution within Splat routes is changing');

      if (isReactRouterWarning) {
        // Suprimir este warning específico
        return;
      }
    }

    // Mostrar otros warnings normalmente
    originalWarn.apply(console, args);
  };

  // También filtrar errores de Vercel API (opcional)
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0];
    
    if (typeof message === 'string') {
      const isVercelAPIError = 
        message.includes('CustomFetchError') ||
        message.includes('unauthorized') ||
        message.includes('vercel.com/api') ||
        message.includes('The request is missing an authentication token');
      
      if (isVercelAPIError) {
        // Silenciar errores de API de Vercel
        return;
      }
    }
    
    // Mostrar otros errores normalmente
    originalError.apply(console, args);
  };
}

// Aplicar la supresión inmediatamente
suppressReactRouterWarnings();

// También aplicar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', suppressReactRouterWarnings);
  } else {
    suppressReactRouterWarnings();
  }
}

export {};
