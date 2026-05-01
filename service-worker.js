// self.addEventListener("install", (event) => {
//     event.waitUntil(
//         caches.open("flashcards-cache").then((cache) => {
//             return cache.addAll([
//                 "flashcard/",
//                 "flashcard/index.html",
//                 'flashcard/styles.css',
//                 'flashcard/script.js',
//                 'flashcard/manifest.json',
//             ]);
//         }).catch((error) => {
//             console.error("Registration failed! This file is likely missing:", error);
//         })
//     );
//     self.skipWaiting();
// });
const CACHE_NAME = "flashcard-v1"
const ASSETS = [
    "./",
    "./index.html",
    "./styles.css",
    "./script.js",
    "./manifest.json",
    "./pngtree-yellow-lightning-bolt-clipart-png-image_16520276.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // This will log which file is failing if it crashes again
            return Promise.all(
                ASSETS.map(link => {
                    return cache.add(link).catch(err => console.error("Failed to cache:", link, err));
                })
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});
})

self.addEventListener("fetch", (event) => {
    // 1. Only handle GET requests
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // 2. Return cached file if found
            if (cachedResponse) {
                return cachedResponse;
            }

            // 3. Otherwise, try the network
            return fetch(event.request).catch(() => {
                // 4. OPTIONAL: If network fails and it's a page navigation, 
                // you could return a specific offline page here
                if (event.request.mode === 'navigate') {
                    return caches.match("./index.html");
                }
            });
        })
    );
});