// Service Worker para Sistema Neural Jurídico
// Cache e funcionalidades offline

const CACHE_NAME = 'neural-juridico-v2.3.8';
const OFFLINE_URL = '/offline.html';

// Recursos para cache
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/audio.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
  'https://fonts.googleapis.com/css2?family=Orbitron&family=Space+Grotesk&family=Major+Mono+Display&family=Syne&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalação - Pré-cache de recursos críticos
self.addEventListener('install', event => {
  console.log('🧠 Service Worker: Instalando Sistema Neural...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Pré-cache de recursos críticos');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => {
        console.log('✅ Pré-cache completo');
        return self.skipWaiting();
      })
  );
});

// Ativação - Limpar caches antigos
self.addEventListener('activate', event => {
  console.log('⚡ Service Worker: Ativando Sistema Neural...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️ Removendo cache antigo: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Cache limpo, sistema pronto');
      return self.clients.claim();
    })
  );
});

// Estratégia: Cache First, com fallback para network
self.addEventListener('fetch', event => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar requisições de analytics
  if (event.request.url.includes('analytics')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Retornar do cache se disponível
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Buscar da rede
        return fetch(event.request)
          .then(response => {
            // Verificar se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar resposta para cache
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Fallback offline
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
            
            // Para outros recursos, retornar resposta vazia ou fallback
            return new Response('', {
              status: 408,
              statusText: 'Offline'
            });
          });
      })
  );
});

// Mensagens do sistema
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Notificações push
self.addEventListener('push', event => {
  console.log('📲 Notificação push recebida');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização do Sistema Neural',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90" fill="%2300ffff">🧠</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90" fill="%2300ffff">⚖️</text></svg>',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'contact',
        title: '📞 Contatar'
      },
      {
        action: 'dismiss',
        title: 'Ignorar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Sistema Neural Jurídico', options)
  );
});

// Clique em notificações
self.addEventListener('notificationclick', event => {
  console.log('🔔 Notificação clicada:', event.notification.tag);
  event.notification.close();
  
  if (event.action === 'contact') {
    // Abrir página de contato
    event.waitUntil(
      clients.openWindow('/?contact=true')
    );
  } else {
    // Abrir app principal
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Funções de sincronização
async function syncMessages() {
  // Sincronizar mensagens offline
  console.log('🔄 Sincronizando mensagens...');
  
  // Implementação de sincronização com servidor
  // (Para um sistema real)
}
