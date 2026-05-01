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

const ASSETS = [
    "./",
    "./index.html",
    "./styles.css",
    "./script.js",
    "./manifest.json"
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
    event.waitUntil(clients.claim());
})

self.addEventListener("fetch", (event) => {
    if (event.request !== "GET") return;
    if(event.request.mode === "navigate") {
        event.respondWith(
            caches.match("flashcard/index.html").then((response) => {
                return response || fetch(event.request);
            })
        )
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    )
})