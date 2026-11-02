/* Cache tampilan dasar saja; video YouTube membutuhkan koneksi internet. */
const CACHE='k3-active-break-shell-v2-foto-bersama';
const FILES=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./assets/icon.svg','./assets/hero-k3-bersama.avif'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(r=>{if(r.ok&&FILES.some(x=>u.pathname.endsWith(x.replace(/^\.\//,'')))){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match(e.request)));});
