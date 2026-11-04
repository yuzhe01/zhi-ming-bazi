'use strict';
const CACHE='zhi-ming-shell-2.0.0';
const SHELL=['./','./index.html','./style.css','./app.js','./analysis.js','./engine.js','./vendor/lunar.js','./favicon.svg','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('zhi-ming-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    const stored=await cache.match(event.request,{ignoreSearch:true});
    if(stored)return stored;
    try{return await fetch(event.request);}catch(error){if(event.request.mode==='navigate')return cache.match(new URL('./index.html',self.location).href);throw error;}
  }));
});
