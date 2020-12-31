self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open('sw-cache').then(function(cache){
            return cache.addAll([
                'index.html',
                'manifest.json',
                './dist/main.js',
                './assets/*',
                'https://fonts.googleapis.com/css?family=Baloo+2|Roboto&display=swap'
            ]);
        })
    )
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request).then(function(response){
            return response || fetch(event.request);
        })
    )
});