
 if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

window.addEventListener('beforeinstallprompt', function(e) {
  // Empêche la bannière d'installation automatique
  e.preventDefault();
  // Affiche un bouton pour installer manuellement l'application
  var installButton = document.getElementById('install-button');
  installButton.style.display = 'block';
  installButton.addEventListener('click', function() {
    // Affiche la bannière d'installation
    e.prompt();
  });
});

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/Actor.js',
        '/mySketch.js',
        '/Magnificat-Bassu.mp3',
        '/Magnificat-Seconda.mp3',
        '/Magnificat-Terza.mp3',
        '/Laudate-Dominum-Bassu.mp3',
        '/Laudate-Dominum-Seconda.mp3',
        '/Laudate-Dominum-Terza.mp3',
        '/icon-192x192.png',
        '/icon-512x512.png',
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('push', function(e) {
  var data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: '/icon-192x192.png'
  });
});