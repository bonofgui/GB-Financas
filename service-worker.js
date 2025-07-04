const CACHE_NAME = "gb-financas-cache-v1";
const urlsToCache = [
  "/", 
  "/index.html",
  "/manifest.json",
  "/icon192.png",
  "/icon512.png",
  // Adicione outros arquivos aqui se tiver
];

// Instala e salva arquivos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  console.log("✅ Service Worker instalado");
});

// Ativação: limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  console.log("♻️ Service Worker ativado");
});

// Intercepta requests e responde com cache ou rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
      );
    })
  );
});
