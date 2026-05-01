self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("flashcard-cache").then((cache) => {
            return caches.addAll([
                "flashcard/",
                "flashcard/index.html",
                'flashcard/styles.css',
                'flashcard/script.js',
            ])
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

    event.respondWidth(
        caches.match(event.request).then((response) => {
            return responsse || fetch(event.request);
        })
    )
})