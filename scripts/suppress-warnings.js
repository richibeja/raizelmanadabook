// Script para suprimir warnings de React Router en el servidor
// Este script se ejecuta antes de que Next.js inicie

// Suprimir warnings específicos de React Router
const originalWarn = console.warn;

console.warn = (...args) => {
  const message = args[0];
  
  if (typeof message === 'string') {
    const isReactRouterWarning = 
      message.includes('React Router Future Flag Warning') ||
      message.includes('v7_startTransition') ||
      message.includes('v7_relativeSplatPath') ||
      message.includes('React Router will begin wrapping state updates') ||
      message.includes('Relative route resolution within Splat routes');
    
    if (isReactRouterWarning) {
      // Suprimir este warning
      return;
    }
  }
  
  // Mostrar otros warnings
  originalWarn.apply(console, args);
};

console.log('🔇 Warnings de React Router suprimidos en el servidor');
