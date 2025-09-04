// Service Worker para ManadaBook PWA
// Versión: 1.0.0
// Funcionalidades: Cache de recursos estáticos, offline fallback

const CACHE_NAME = 'manadabook-v1.0.0';
const STATIC_CACHE = 'manadabook-static-v1.0.0';
const DYNAMIC_CACHE = 'manadabook-dynamic-v1.0.0';

// Recursos estáticos para cachear
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192x192.svg',
  '/icon-512x512.svg',
  '/icon-32x32.png',
  '/icon-144x144.png',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Rutas que deben funcionar offline
const OFFLINE_ROUTES = [
  '/',
  '/feed',
  '/pets',
  '/marketplace',
  '/circles',
  '/moments'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Cacheando recursos estáticos...');
        // Cachear recursos uno por uno para evitar errores
        return Promise.allSettled(
          STATIC_ASSETS.map(url => 
            cache.add(url).catch(err => {
              console.warn(`[SW] No se pudo cachear ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Service Worker instalado correctamente');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error durante la instalación:', error);
        // Continuar aunque haya errores
        return self.skipWaiting();
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar caches antiguos
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activado');
        return self.clients.claim();
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar requests del mismo origen
  if (url.origin !== location.origin) {
    return;
  }

  // Estrategia para diferentes tipos de recursos
  if (request.method === 'GET') {
    // Recursos estáticos (CSS, JS, imágenes)
    if (request.destination === 'style' || 
        request.destination === 'script' || 
        request.destination === 'image' ||
        request.destination === 'font') {
      event.respondWith(cacheFirst(request));
    }
    // Páginas HTML
    else if (request.destination === 'document') {
      event.respondWith(networkFirst(request));
    }
    // API calls
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirst(request));
    }
    // Otros recursos
    else {
      event.respondWith(staleWhileRevalidate(request));
    }
  }
});

// Estrategia: Cache First (para recursos estáticos)
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Error en cacheFirst:', error);
    return new Response('Recurso no disponible offline', { status: 503 });
  }
}

// Estrategia: Network First (para páginas y APIs)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Red no disponible, buscando en cache...');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback para páginas HTML
    if (request.destination === 'document') {
      const fallbackResponse = await caches.match('/');
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    return new Response('Contenido no disponible offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Estrategia: Stale While Revalidate (para otros recursos)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Si falla la red, devolver cache si existe
    return cachedResponse;
  });

  return cachedResponse || fetchPromise;
}

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Notificaciones push (preparado para futuras implementaciones)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
      const options = {
    body: data.body,
    icon: '/icon-192x192.svg',
    badge: '/icon-192x192.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver en ManadaBook',
        icon: '/icon-192x192.svg'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icon-192x192.svg'
      }
    ]
  };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker cargado correctamente');
