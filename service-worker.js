self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("pwa-cache").then((cache) => {
            return caches.addAll([
                "/flashcard/",
                "/flashcard/index.html",
                '/flashcard/styles.css',
                '/flashcard/script.js',
            ])
        })
    )
})

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    )
})