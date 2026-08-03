const CACHE_NAME = "codeiq-v4";

// Install — activate immediately, don't cache anything
self.addEventListener("install", (event) => {
  // Clear ALL old caches during install
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
  );
  self.skipWaiting();
});

// Activate — claim all clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
  );
  self.clients.claim();
});

// Fetch — do NOTHING, let browser handle everything
// This SW only exists so the PWA is installable
self.addEventListener("fetch", () => {
  // Pass through — don't intercept any requests
});
