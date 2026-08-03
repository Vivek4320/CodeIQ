const CACHE_NAME = "codeiq-v3";

// Install — skipWaiting immediately, no pre-caching
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

// Fetch — network first, NO caching, offline fallback only
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip API calls, Next.js internals, and static assets
  // Let the browser handle caching for these
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json)$/)
  ) {
    return;
  }

  // Network first — never cache, just return response
  // Only use cache as offline fallback
  event.respondWith(
    fetch(request).catch(() => {
      // Offline — serve cached home page for navigation
      if (request.mode === "navigate") {
        return caches.match("/") || new Response("Offline", { status: 503 });
      }
      return new Response("Offline", { status: 503 });
    })
  );
});
