const CACHE='watch-v15652';
const CORE=[
 './',
 './index.html',
 './styles.css?v=15652',
 './app.js?v=15652',
 './ktv_singers.js?v=15652',
 './ktv_songs.js?v=15652',
 './manifest.webmanifest',
 './icons/icon-192.png?v=15652',
 './icons/icon-512.png?v=15652',
 './icons/apple-touch-icon-180.png?v=15652'
];
self.addEventListener('install',function(e){
 self.skipWaiting();
 e.waitUntil(caches.open(CACHE).then(function(c){
  return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){})}));
 }));
});
self.addEventListener('activate',function(e){
 e.waitUntil(caches.keys().then(function(keys){
  return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
 }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
 var u=new URL(e.request.url);
 if(u.origin!==self.location.origin)return;
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(e.request).then(function(r){
   var copy=r.clone();caches.open(CACHE).then(function(c){c.put('./index.html',copy)});return r;
  }).catch(function(){return caches.match('./index.html')}));
  return;
 }
 e.respondWith(caches.match(e.request).then(function(hit){
  return hit||fetch(e.request).then(function(r){
   var copy=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy)});return r;
  });
 }));
});
