/* высота нижней панели -> CSS-переменная (для кнопки «наверх») */
(function(){const n=document.getElementById('bot');if(!n)return;const f=()=>document.documentElement.style.setProperty('--bot-h',n.offsetHeight+'px');f();try{new ResizeObserver(f).observe(n)}catch{addEventListener('resize',f)}})();
/* ===== push на телефон для админов ===== */
const PUSH_PK='BMB_n3Wu19C_DsbhOtG8Iy6ZoqCSsFILVION7DBM61YOZcvMD_i5CobxE8pfGIs8c1zqiqdTBlydjpwTO-PLCg4',_u8=b=>{b=(b+'='.repeat((4-b.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(b),c=>c.charCodeAt())};
const _swReady=()=>Promise.race([navigator.serviceWorker.ready,new Promise((_,j)=>setTimeout(()=>j(new Error('Service Worker не запущен (sw.js)')),8000))]);
async function pushSync(){if(!sb||!S.me||!window.Notification||Notification.permission!='granted'||!('serviceWorker' in navigator)||!('PushManager' in window))return;const reg=await _swReady();let sub=await reg.pushManager.getSubscription();if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:_u8(PUSH_PK)});const r=await sb.from('push_subscriptions').upsert({user_id:S.me.id,endpoint:sub.endpoint,sub:sub.toJSON()},{onConflict:'endpoint'});if(r.error)throw r.error}
async function staffPushOn(){if(!window.Notification||!('serviceWorker' in navigator)||!('PushManager' in window))return notifyApps();if(await Notification.requestPermission()!='granted')return notifyApps();_pe='';try{await pushSync();toast(R('Уведомления на телефон включены','Phone notifications enabled'))}catch(e){_pe=(e&&e.message)||String(e);toast(R('Не удалось включить: ','Failed: ')+_pe,6000)}window._ps=1;notifyApps()}
let _pe='';
function pushAskHide(){try{sessionStorage.setItem('tsk_pushask','1')}catch{}notifyApps()}
function pushAsk(){try{if(sessionStorage.getItem('tsk_pushask'))return''}catch{}
const hide=`<button class="btn k !p-1.5" onclick="pushAskHide()" aria-label="x">✕</button>`,
card=(t1,t2,btn)=>`<div class="g p-3" style="pointer-events:auto;border:1px solid #00F0FF;margin-top:6px"><div class="flex items-center gap-2"><div class="min-w-0 flex-1 text-[13px]"><b>${t1}</b><div class="text-[11px] k-t4 break-words">${t2}</div></div>${btn||''}${hide}</div></div>`;
if(!window.Notification||!('serviceWorker' in navigator)||!('PushManager' in window))return card(R('Пуши на телефон недоступны','Phone push unavailable'),R('Открой сайт в Chrome (не во встроенном браузере Telegram). На iPhone: «Поделиться» → «На экран Домой», затем открой оттуда','Open in Chrome (not an in-app browser). On iPhone: Share → Add to Home Screen, then open from there'),'');
const p=Notification.permission;
if(p=='default')return card(R('Включить уведомления о заявках','Enable application alerts'),R('Пуш на телефон о каждой новой заявке','A push on your phone for each new application'),`<button class="btn" onclick="staffPushOn()">${R('Включить','Enable')}</button>`);
if(p=='denied')return card(R('Уведомления заблокированы','Notifications blocked'),R('Нажми на замок рядом с адресом сайта → Уведомления → Разрешить, затем обнови страницу','Tap the lock next to the address → Notifications → Allow, then reload'),'');
if(_pe)return card(R('Пуши не подключены','Push not connected'),esc(_pe),`<button class="btn" onclick="staffPushOn()">${R('Повторить','Retry')}</button>`);
return''}

/* ===== уведомления о заявках для админов / овнера ===== */
function isStaff(){return !!(S.user&&['owner','admin'].includes(S.user.role))}
const MODL={mod_jr:1,moderator:2,mod_sr:3},ROLE_LBL={owner:'Owner',admin:'Admin',mod_sr:'Старший модератор',moderator:'Модератор',mod_jr:'Младший модератор',creator:'Контент-мейкер'};
function modLv(){return S.user?(MODL[S.user.role]||0):0}
function isMod(){return modLv()>0}
function hasTier(n){const r=S.user&&S.user.role;return r=='owner'||r=='admin'||modLv()>=n}
function modSecs(){const l=modLv();return l>=3?['home','apps','reports','bans','appeals','rules','audit']:l==2?['home','apps','reports','bans','audit']:['home','apps','reports','bans']}
const banOk=d=>hasTier(3)||(d[1]>0&&d[1]<=168);
function canApps(){return !!(S.user&&(['owner','admin'].includes(S.user.role)||isMod()))}
const _sk=()=>'tsk_seen_apps_'+((S.user&&S.user.email)||'');
function _seen(){try{return JSON.parse(localStorage.getItem(_sk()))||[]}catch{return[]}}
function _mark(ids){try{const x=new Set(_seen());ids.forEach(i=>x.add(i));localStorage.setItem(_sk(),JSON.stringify([...x].slice(-300)))}catch{}}
function _beep(){try{const A=window.AudioContext||window.webkitAudioContext,c=new A(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.05;o.start();setTimeout(()=>{o.stop();c.close()},180)}catch{}}
/* фирменный вид уведомлений: аватар сайта (icon-192.png), монохромный значок (badge-72.png), вибрация, время */
function TSKN(o){return Object.assign({icon:TSK_ROOT+'icon-192.png',badge:TSK_ROOT+'badge-72.png',vibrate:[120,60,120],timestamp:Date.now(),renotify:true,lang:(window.S&&S.lang)||'ru',data:{url:'/'}},o)}
function appLabel(a){const d=a.data||{};if(d.type=='player')return R('игрок','player')+' «'+(d.nick||'?')+'»';if(d.type=='edit')return R('изменение профиля/команды','profile/team edit');return R('команда','team')+' «'+(d.name||'?')+'»'+(d.players?' · '+d.players.length+' '+R('игр.','pl.'):'')}
const _known=new Set();let _ntInit=0;
function notifyApps(){
 let box=document.getElementById('appNote');
 if(!box){box=document.createElement('div');box.id='appNote';box.style.cssText='position:fixed;z-index:9999;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 8px);width:min(94vw,440px);pointer-events:none';document.body.appendChild(box)}
 const base=document.title.replace(/^\(\d+\) /,'');
 if(!canApps()){box.innerHTML='';document.title=base;_ntInit=0;_known.clear();return}
 if(!window._ps&&window.Notification&&Notification.permission=='granted'){window._ps=1;pushSync().then(()=>{_pe=''}).catch(e=>{_pe=(e&&e.message)||String(e);notifyApps()})}
 const P=(DB.apps||[]).filter(a=>a.status=='pending');
 document.title=(P.length?'('+P.length+') ':'')+base;
 const seen=new Set(_seen()),fresh=P.filter(a=>!seen.has(a.id)),nw=fresh.filter(a=>!_known.has(a.id));
 if(nw.length){_beep();try{if(window.Notification&&Notification.permission=='granted'){const tt='TSK Esports · '+R('Новая заявка','New application'),oo=TSKN({body:appLabel(nw[0])+(P.length>1?' (+'+(P.length-1)+')':''),tag:'tsk-app-'+nw[0].id});if('serviceWorker' in navigator)navigator.serviceWorker.ready.then(r=>r.showNotification(tt,oo)).catch(()=>{});else{const n=new Notification(tt,oo);n.onclick=()=>{window.focus();appNoteOpen(nw[0].id);n.close()}}}}catch{}}
 P.forEach(a=>_known.add(a.id));_ntInit=1;
 if(!fresh.length){box.innerHTML=pushAsk();return}
 const a=fresh[0],id=esc(a.id),more=fresh.length-1;
 box.innerHTML=`<div class="g p-3" style="pointer-events:auto;border:1px solid #FFD700;box-shadow:0 8px 30px rgba(0,0,0,.5)"><div class="flex items-start gap-2"><div class="min-w-0 flex-1"><b class="block text-sm" style="color:#FFD700">${R('Новая заявка','New application')}${more?' (+'+more+')':''}</b><div class="text-sm break-words">${esc(appLabel(a))}</div></div><button class="btn k !p-1.5" onclick="appNoteHide()" aria-label="x">✕</button></div><div class="flex gap-2 mt-2"><button class="btn flex-1" onclick="appOk('${id}')">${R('Одобрить','Approve')}</button><button class="btn r flex-1" onclick="appNo('${id}')">${R('Отклонить','Reject')}</button><button class="btn k" onclick="appNoteOpen('${id}')">${R('Открыть','Open')}</button></div></div>${pushAsk()}`}
function appNoteHide(){_mark((DB.apps||[]).filter(a=>a.status=='pending').map(a=>a.id));notifyApps()}
function appNoteOpen(id){_mark([id]);notifyApps();openApp(id)}
