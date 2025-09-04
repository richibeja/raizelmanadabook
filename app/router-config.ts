// Configuración para suprimir warnings de React Router
// Estos warnings vienen de Next.js internamente y no afectan la funcionalidad

// Configuración de supresión de warnings
if (typeof window !== 'undefined') {
  // Suprimir warnings de React Router en desarrollo
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === 'string' && 
      (message.includes('React Router Future Flag Warning') || 
       message.includes('v7_startTransition') || 
       message.includes('v7_relativeSplatPath'))
    ) {
      // Suprimir estos warnings específicos
      return;
    }
    // Mostrar otros warnings normalmente
    originalWarn.apply(console, args);
  };
}

export {};
