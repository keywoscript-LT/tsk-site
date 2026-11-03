/* TSK Esports — service worker (push-уведомления) */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));

/* ===== PUSH: если у тебя уже есть свой sw.js — вставь в него только этот блок ===== */
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||'TSK Esports',{
    body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',
    tag:d.tag||'tsk',renotify:true,data:{url:d.url||'/'}
  }));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||'/';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    for(const c of l){if('focus' in c)return c.focus()}
    return self.clients.openWindow(url)
  }));
});
/* ===== конец push-блока ===== */
