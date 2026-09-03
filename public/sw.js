/**
 * SaltStore PWA Service Worker v2.0
 * Tiered caching strategy:
 *   - Cache-First  → JS/CSS/font assets (versioned hashes, long-lived)
 *   - Network-First → API/Supabase calls (always fresh, cached fallback)
 *   - Stale-While-Revalidate → Product images (instant from cache, updates in bg)
 *   - Cache-Only  → App shell (/, index.html, manifest)
 */

const CACHE_VERSION = 'v2.0';
const SHELL_CACHE = `saltstore-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `saltstore-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `saltstore-images-${CACHE_VERSION}`;
const API_CACHE = `saltstore-api-${CACHE_VERSION}`;

const SHELL_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

// Max image cache entries to prevent storage bloat (LRU-style trimming)
const MAX_IMAGE_CACHE = 60;
const MAX_API_CACHE = 30;

// ─── Install: Pre-cache app shell ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: Purge stale caches ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const validCaches = new Set([SHELL_CACHE, STATIC_CACHE, IMAGE_CACHE, API_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !validCaches.has(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    // Delete oldest entries (FIFO approximation)
    const toDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(toDelete.map((key) => cache.delete(key)));
  }
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/assets/') ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  );
}

function isImageRequest(url) {
  return (
    /\.(jpe?g|png|gif|webp|avif|svg)(\?.*)?$/i.test(url.pathname) ||
    url.hostname === 'poppers.id' ||
    url.hostname === 'images.unsplash.com'
  );
}

function isApiRequest(url) {
  return (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('supabase.io') ||
    url.pathname.startsWith('/rest/') ||
    url.pathname.startsWith('/api/')
  );
}

// ─── Fetch: Route to appropriate strategy ────────────────────────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip cross-origin requests that don't match our CDNs
  if (url.origin !== location.origin && !isStaticAsset(url) && !isImageRequest(url)) {
    if (!isApiRequest(url)) return;
  }

  // Strategy: Cache-First for versioned JS/CSS/font assets
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  // Strategy: Stale-While-Revalidate for product images
  if (isImageRequest(url)) {
    event.respondWith(staleWhileRevalidate(event.request, IMAGE_CACHE, MAX_IMAGE_CACHE));
    return;
  }

  // Strategy: Network-First for Supabase API calls
  if (isApiRequest(url)) {
    event.respondWith(networkFirst(event.request, API_CACHE, MAX_API_CACHE));
    return;
  }

  // Strategy: Cache-First for app shell (SPA navigation)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      // For SPA navigation, serve index.html
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
      return fetch(event.request);
    })
  );
});

// ─── Strategy Implementations ─────────────────────────────────────────────────

/** Cache-First: Serve from cache immediately; only fetch if not cached. */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline — resource not cached', { status: 503 });
  }
}

/** Network-First: Always try network; fall back to cache if offline. */
async function networkFirst(request, cacheName, maxEntries) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      trimCache(cacheName, maxEntries);
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/** Stale-While-Revalidate: Return cache instantly while updating in background. */
async function staleWhileRevalidate(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Kick off network fetch in background regardless
  const fetchPromise = fetch(request).then((response) => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
      trimCache(cacheName, maxEntries);
    }
    return response;
  }).catch(() => null);

  // Return cached immediately if available, otherwise wait for network
  return cached || fetchPromise;
}
