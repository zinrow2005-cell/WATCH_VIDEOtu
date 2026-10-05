const CACHE='watch-v15613';
const ASSETS=['./','index.html','styles.css?v=15613','app.js?v=15613','manifest.webmanifest'];

self.addEventListener('install',function(e){
 self.skipWaiting();
 e.waitUntil(
  caches.open(CACHE).then(function(c){return c.addAll(ASSETS)})
 );
});

self.addEventListener('activate',function(e){
 e.waitUntil(
  caches.keys().then(function(keys){
   return Promise.all(keys.map(function(k){
    if(k!==CACHE && k.indexOf('watch-v')===0)return caches.delete(k);
   }));
  }).then(function(){return self.clients.claim()})
 );
});

self.addEventListener('fetch',function(e){
 var u=new URL(e.request.url);
 if(
  u.hostname.indexOf('youtube.com')>=0 ||
  u.hostname.indexOf('ytimg.com')>=0 ||
  u.hostname.indexOf('invidious')>=0 ||
  u.hostname.indexOf('piped')>=0 ||
  u.pathname.indexOf('/api/v1/')>=0
 )return;

 if(e.request.mode==='navigate'){
  e.respondWith(
   fetch(e.request).then(function(r){
    var copy=r.clone();
    caches.open(CACHE).then(function(c){c.put('index.html',copy)});
    return r;
   }).catch(function(){return caches.match('index.html')})
  );
  return;
 }

 e.respondWith(
  fetch(e.request).then(function(r){
   var copy=r.clone();
   caches.open(CACHE).then(function(c){c.put(e.request,copy)});
   return r;
  }).catch(function(){return caches.match(e.request)})
 );
});
