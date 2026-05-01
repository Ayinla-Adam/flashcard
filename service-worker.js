self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("flashcards-cache").then((cache) => {
            return cache.addAll([
                "flashcard/",
                "flashcard/index.html",
                'flashcard/styles.css',
                'flashcard/script.js',
                'flashcard/manifest.json',
            ]);
        }).catch((error) => {
            console.error("Registration failed! This file is likely missing:", error);
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