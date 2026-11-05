/* Only SONORA's public application files are cached. No music, auth or diary responses. */
const VERSION='2026-11-05-pwa-4';
const PREFIX='sonora-shell:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const FILES=['./','index.html','style.css','memories.css','experience.css','i18n.js','diary-core.js','experience-i18n.js','spotify.js','app.js','memories.js','experience.js','pwa.js','auth-i18n.js','auth.js','auth-core.mjs','sync.js','sync-core.mjs','firebase-config.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
const urls=FILES.map(f=>new URL(f,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(urls))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==base.origin)return;
 const home=url.pathname===base.pathname||url.pathname===base.pathname+'index.html';
 if(request.mode==='navigate'&&home){event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(new URL('index.html',base).href))||fetch(request)));return}
 if(!urls.includes(url.href))return;
 event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(request))||fetch(request)));
});
