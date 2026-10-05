var CACHE='familytube-v11-static';
var ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icons/icon-180.png','./icons/icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS)}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.map(function(k){if(k!==CACHE)return caches.delete(k)}))}));self.clients.claim()});
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(function(r){return r}).catch(function(){return caches.match(e.request).then(function(r){return r||caches.match('./index.html')})}))});
