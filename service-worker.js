// Defines the cache name for this version of the service worker.
// Incrementing the version (e.g., "countdown-cache-v2") will trigger the 'activate' event
// for new service workers, allowing old caches to be cleared.
const CACHE_NAME = "countdown-cache-v1";

// A list of essential files to be cached for offline access.
const FILES_TO_CACHE = [
  "./", // Caches the root path, often serving index.html.
  "./index.html", // The main HTML file.
  "./styles.css", // The primary stylesheet.
  "./script.js", // The main JavaScript file.
  "./sounds/day-change.mp3", // Audio asset.
  "./sounds/hour-change.mp3", // Audio asset.
  "./sounds/minute-change.mp3", // Audio asset.
  "./sounds/second-tick.mp3", // Audio asset.
];

// 'install' event: Fired when the service worker is first registered or a new version is detected.
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting(); // Forces the waiting service worker to become the active service worker.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          // Delete old caches that don't match the current CACHE_NAME.
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Allows the activated service worker to take control of open clients immediately.
});

// 'fetch' event: Fired for every network request made by the page.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Try to find the request in the cache first.
    caches.match(event.request).then((response) => response || fetch(event.request) // If not in cache, fetch from the network.
    )
  );
});
