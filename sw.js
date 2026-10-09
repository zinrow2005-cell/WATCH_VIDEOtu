const CACHE='watch-v15730';
const CORE=[
 './styles.css?v=15694',
 './responsive-v63.css?v=15694',
 './ui-v65.css?v=15694',
 './app.js?v=15694',
 './ktv_singers.js?v=15694',
 './ktv_songs.js?v=15694',
 './ktv-studio.css?v=15730',
 './ktv-studio.js?v=15730',
 './ktv-mask-worker.js?v=15730',
 './ktv-lyrics.js?v=15730',
 './ktv-lyrics.css?v=15730',
 './manifest.webmanifest'
];

self.addEventListener('install',function(e){
 self.skipWaiting();
 e.waitUntil(
  caches.open(CACHE).then(function(c){
   return Promise.all(CORE.map(function(u){
    return c.add(new Request(u,{cache:'reload'})).catch(function(){});
   }));
  })
 );
});

self.addEventListener('activate',function(e){
 e.waitUntil(
  caches.keys().then(function(keys){
   return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()})
 );
});

self.addEventListener('message',function(e){
 if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('fetch',function(e){
 var req=e.request;
 var u=new URL(req.url);

 if(u.origin!==self.location.origin)return;

 // HTML/navigation must always prefer network so installed iPhone/iPad PWAs see the latest version.
 if(req.mode==='navigate'||req.destination==='document'){
  e.respondWith(
   fetch(new Request(req,{cache:'no-store'})).then(function(r){
    return r;
   }).catch(function(){
    return caches.match('./index.html').then(function(r){
     return r||caches.match('./');
    });
   })
  );
  return;
 }

 // Versioned static files are safe to cache-first.
 e.respondWith(
  caches.match(req).then(function(hit){
   if(hit)return hit;
   return fetch(req).then(function(r){
    var copy=r.clone();
    caches.open(CACHE).then(function(c){c.put(req,copy)});
    return r;
   });
  })
 );
});
