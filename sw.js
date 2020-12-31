self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open('sw-cache').then(function(cache){
            return cache.addAll([
                'index.html',
                'manifest.json',
                './dist/main.js',
                './assets/css/style.css',
                './assets/json/levels/level-1.json',
                './assets/json/levels/level-2.json',
                './assets/json/levels/level-3.json',
                './assets/json/levels/level-4.json',
                './assets/json/levels/level-5.json',
                './assets/json/levels/level-6.json',
                './assets/json/viruses/virus-1.json',
                './assets/json/viruses/virus-2.json',
                './assets/json/viruses/virus-3.json',
                './assets/json/viruses/virus-4.json',
                './assets/img/backgrounds/bathroom-desktop.png',
                './assets/img/backgrounds/bedroom-desktop.png',
                './assets/img/backgrounds/dining-desktop.png',
                './assets/img/backgrounds/kitchen-desktop.png',
                './assets/img/backgrounds/living-desktop.png',
                './assets/img/backgrounds/street-desktop.png',
                './assets/img/disinfection-logo.svg',
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