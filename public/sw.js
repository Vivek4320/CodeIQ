const CACHE_NAME = "codeiq-v2";

// Install — skipWaiting immediately, don't pre-cache (Next.js pages are server-rendered)
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — network first, cache only successful HTML page responses
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET
  if (request.method !== "GET") return;

  // Skip API calls, Next.js internals, and non-navigation requests
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful HTML responses (navigation requests)
        if (response.ok && request.mode === "navigate") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline — try cached page
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Fallback to home page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/") || new Response("Offline", { status: 503 });
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});
