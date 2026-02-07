self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('study-planner-v1').then((cache) => {
            return cache.addAll([
                '/smart-study-planner/',
                '/smart-study-planner/index.html',
                '/smart-study-planner/manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
