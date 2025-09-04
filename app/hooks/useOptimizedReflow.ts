import { useCallback, useRef } from 'react';

// Hook para optimizar cambios de DOM y evitar forced reflows
export function useOptimizedReflow() {
  const rafRef = useRef<number>();

  // Función para agrupar cambios de DOM
  const batchDOMUpdates = useCallback((updates: (() => void)[]) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      // Ejecutar todas las actualizaciones en un solo frame
      updates.forEach(update => update());
    });
  }, []);

  // Función para leer propiedades que causan reflow de forma optimizada
  const readLayoutProperties = useCallback((element: HTMLElement, properties: string[]) => {
    return new Promise<Record<string, any>>((resolve) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const values: Record<string, any> = {};
        properties.forEach(prop => {
          values[prop] = (element as any)[prop];
        });
        resolve(values);
      });
    });
  }, []);

  // Función para escribir propiedades de forma optimizada
  const writeLayoutProperties = useCallback((element: HTMLElement, properties: Record<string, any>) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      Object.entries(properties).forEach(([prop, value]) => {
        (element as any)[prop] = value;
      });
    });
  }, []);

  return {
    batchDOMUpdates,
    readLayoutProperties,
    writeLayoutProperties
  };
}
