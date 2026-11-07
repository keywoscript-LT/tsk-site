/* ===== v14: приватные лиги, MVP, общий счётчик мини-игры, карточка игрока PNG, уведомления ===== */
(()=>{
const K='tsk_y_',ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(K+k))??d}catch{return d}},sv=(k,v)=>{try{localStorage.setItem(K+k,JSON.stringify(v))}catch{}},ok=()=>sb&&S.me,
bt=(c,f,l)=>`<button class="btn ${c} !py-1.5 !px-3 text-[11px]" onclick="${f}">${l}</button>`;
/* --- приватные лиги (нужен SQL) --- */
const LG={l:[],t:0};
const lgLoad=async f=>{return;if(!ok()||(!f&&Date.now()-LG.t<30000))return;LG.t=Date.now();try{const r=await sb.rpc('my_leagues');if(r.error)return;const s=JSON.stringify(r.data);if(s!=LG.s){LG.s=s;LG.l=r.data||[];if(!$('#m').innerHTML&&S.tab=='matches')render(true)}}catch{}};
window.lgNew=async()=>{const n=clean(prompt(R('Название лиги','League name'))||'');if(!n)return;const r=await sb.rpc('create_league',{p_name:n});if(r.error)return toast(r.error.message);prompt(R('Код лиги — отправь друзьям','League code — share it'),r.data);lgLoad(1)};
window.lgJoin=async()=>{const c=clean(prompt(R('Код лиги','League code'))||'').toUpperCase();if(!c)return;const r=await sb.rpc('join_league',{p_code:c});if(r.error)return toast(r.error.message);toast(R('Ты в лиге','Joined'));lgLoad(1)};
window.lgOpen=async c=>{const r=await sb.rpc('league_board',{p_code:c});if(r.error)return toast(r.error.message);const L=LG.l.find(x=>x.code==c)||{};
modal(`<button class="absolute right-3 top-3 btn k !p-1.5 z-10" onclick="closeM()">${ic('x')}</button><h3 class="font-head font-black text-lg">${esc(L.name||'')}</h3><div class="text-[11px] k-t4 mb-2">${R('Код','Code')}: <b>${esc(c)}</b></div>`+((r.data||[]).map((x,i)=>`<div class="flex items-center gap-2.5 py-2 border-t bd-10 text-[13px] ${S.me&&x.user_id==S.me.id?'kc-cy':''}"><b class="w-6">${i+1}</b><span class="flex-1 truncate">${esc(x.nick||'—')}</span><b class="tabular-nums">${+x.points||0}</b></div>`).join('')||`<p class="text-sm k-t5">${R('Пока пусто','Empty')}</p>`))};
const lgCard=()=>'';
/* --- MVP матча и игрок недели --- */
const MV={c:{},me:{}};if(!sb){const d=ld('mv',{});MV.c=d.c||{};MV.me=d.me||{}}
const mvLoad=async()=>{if(!sb)return;try{const[c,m]=await Promise.all([sb.rpc('mvp_counts'),S.me?sb.from('mvp_votes').select('match_id,player_id'):{data:[]}]);if(c.error)return;const C={},M={};(c.data||[]).forEach(r=>(C[r.match_id]=C[r.match_id]||{})[r.player_id]=+r.n);(m.data||[]).forEach(r=>M[r.match_id]=r.player_id);const s=JSON.stringify([C,M]);if(s!=MV.s){MV.s=s;MV.c=C;MV.me=M;if(!$('#m').innerHTML&&S.tab=='matches')render(true)}}catch{}};
window.mvGo=async(mid,pid)=>{if(sb&&!S.me)return authModal();const o=MV.me[mid];if(o==pid)return;const c=MV.c[mid]=MV.c[mid]||{};if(o)c[o]=Math.max(0,(c[o]||0)-1);c[pid]=(c[pid]||0)+1;MV.me[mid]=pid;
if(sb){const{error}=await sb.from('mvp_votes').upsert({match_id:mid,user_id:S.me.id,player_id:pid},{onConflict:'match_id,user_id'});if(error)toast(error.message);MV.s=''}else sv('mv',{c:MV.c,me:MV.me});render(true)};
const mvCard=()=>{const f=DB.matches.filter(m=>tsK(m.st)=='fin').sort((a,b)=>new Date(b.when)-new Date(a.when))[0];if(!f)return'';
const P=DB.players.filter(p=>p.team==f.a||p.team==f.b),c=MV.c[f.id]||{},me=MV.me[f.id],wk={};
DB.matches.filter(m=>Date.now()-new Date(m.when)<7*864e5).forEach(m=>Object.entries(MV.c[m.id]||{}).forEach(([p,n])=>wk[p]=(wk[p]||0)+n));
const top=Object.entries(wk).sort((a,b)=>b[1]-a[1])[0],tp=top&&DB.players.find(p=>p.id==top[0]);
return`<section class="g mb-3 p-3"><div class="font-head font-black text-[15px]">${R('MVP матча','Match MVP')}: <span class="k-t4 text-[12px] font-semibold">${esc(tm(f.a).name)} ${f.sa}:${f.sb} ${esc(tm(f.b).name)}</span></div>
<div class="hs mt-2">${P.map(p=>`<button class="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border active:scale-95 ${me==p.id?'ko-gd kb-gd-15 kc-gd':'bd-15 k-t3'}" onclick="mvGo('${esc(f.id)}','${esc(p.id)}')">${esc(p.nick)} <b>${c[p.id]||0}</b></button>`).join('')||`<span class="text-xs k-t5">—</span>`}</div>
${tp?`<div class="text-[12px] kc-gd mt-2 cursor-pointer" onclick="openP('${esc(tp.id)}')">★ ${R('Игрок недели','Player of the week')}: <b>${esc(tp.nick)}</b> (${top[1]})</div>`:''}</section>`};
const _vm=V.matches;V.matches=q=>{lgLoad();mvLoad();return _vm(q).replace('</h1>',m=>m+lgCard()+mvCard())};
if(sb){setInterval(()=>{lgLoad();mvLoad()},20000);mvLoad()}
/* --- общий счётчик мини-игры --- */
const DG={n:null},dgStat=async()=>{if(!sb)return;try{const r=await sb.rpc('daily_stats');if(!r.error&&+r.data!==DG.n){DG.n=+r.data;if(!$('#m').innerHTML&&(S.tab=='news'||S.tab=='games'))render(true)}}catch{}};
const _dg=window.dgGo;window.dgGo=()=>{_dg();const s=JSON.parse(localStorage.getItem('tsk_x_dg')||'{}');if(ok()&&s.d&&s.ok!=null&&!ld('dgs_'+s.d,0)){sv('dgs_'+s.d,1);sb.rpc('daily_submit',{p_ok:!!s.ok}).then(()=>dgStat())}};
dgStat();setInterval(dgStat,30000);
/* --- уведомления --- */
const VAPID='BMB_n3Wu19C_DsbhOtG8Iy6ZoqCSsFILVION7DBM61YOZcvMD_i5CobxE8pfGIs8c1zqiqdTBlydjpwTO-PLCg4',u8=b=>{b=(b+'='.repeat((4-b.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(b),c=>c.charCodeAt())},NF=()=>'Notification' in window;
window.pushOn=async()=>{if(!NF())return toast(R('Браузер не поддерживает','Not supported'));if(await Notification.requestPermission()!='granted')return toast(R('Уведомления запрещены в браузере','Blocked'));
try{if(VAPID&&ok()){const reg=await navigator.serviceWorker.ready,sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(VAPID)});await sb.from('push_subscriptions').upsert({user_id:S.me.id,endpoint:sub.endpoint,sub:sub.toJSON(),teams:favs()},{onConflict:'endpoint'})}}catch{}
toast(R('Уведомления включены','Enabled'));render(true)};
/* синхронизация избранных команд с сервером: пуш придёт, даже если сайт закрыт */
window.pushTeams=async()=>{try{if(!NF()||Notification.permission!='granted'||!ok()||!('serviceWorker' in navigator))return;const reg=await navigator.serviceWorker.ready,sub=await reg.pushManager.getSubscription();if(!sub)return;await sb.from('push_subscriptions').update({teams:favs()}).eq('endpoint',sub.endpoint)}catch{}};
setTimeout(()=>{window.pushTeams()},4000);
const pushCard=()=>NF()&&Notification.permission=='default'?`<section class="g mb-3 p-3 flex items-center gap-3"><div class="flex-1 text-[13px]"><b>${R('Напоминания о матчах','Match reminders')}</b><div class="text-[11px] k-t4">${R('За 15 минут до матча твоей команды или прогноза','15 min before your team or predicted match')}</div></div>${bt('','pushOn()',R('Включить','Enable'))}</section>`:'';
const _vn=V.news;V.news=q=>_vn(q).replace('<!--he-->',()=>pushCard());window.dgSolved=()=>DG.n==null?'':`<div class="text-[11px] k-t5 mt-2 text-center">${R('Сегодня угадали','Solved today')}: <b>${DG.n}</b></div>`;
setInterval(async()=>{if(!NF()||Notification.permission!='granted')return;const f=favs(),n=ld('pn',{});for(const m of DB.matches){const d=new Date(m.when)-Date.now();if(tsK(m.st)!='up'||d<=0||d>9e5||n[m.id]||!(f.includes(m.a)||f.includes(m.b)||PRED.me[m.id]))continue;n[m.id]=1;sv('pn',n);
try{const r=await navigator.serviceWorker.ready;r.showNotification('TSK Esports · '+R('Скоро матч','Match soon'),TSKN({body:tm(m.a).name+' vs '+tm(m.b).name+' — '+R('через 15 минут','in 15 min'),tag:'tsk-m-'+m.id}))}catch{}}},3e4);
/* --- карточка игрока PNG --- */
(()=>{const W=1080,H=1350,CY='#00F0FF',PK='#FF2E63',MED=['#FFD700','#C0C8D6','#CD7F32'];
const ld=src=>new Promise(r=>{if(!src)return r(null);const i=new Image();i.crossOrigin='anonymous';i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src}),
 hf=()=>{const e=document.createElement('b');e.className='font-head';e.style.display='none';document.body.appendChild(e);const f=getComputedStyle(e).fontFamily;e.remove();return f||'sans-serif'},
 cut=(g,x,y,w,h,c)=>{g.beginPath();g.moveTo(x+c,y);g.lineTo(x+w,y);g.lineTo(x+w,y+h-c);g.lineTo(x+w-c,y+h);g.lineTo(x,y+h);g.lineTo(x,y+c);g.closePath()},
 cover=(g,im,x,y,w,h)=>{const k=Math.max(w/im.width,h/im.height),dw=im.width*k,dh=im.height*k;g.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh)},
 fit=(g,t,w,sz,wt,f)=>{do{g.font=wt+' '+sz+'px '+f;sz-=2}while(g.measureText(t).width>w&&sz>26)},
 ls=(g,v)=>{try{g.letterSpacing=v}catch{}},
 logoSrc=x=>x&&(x.logo||((x.id=='t1'||x.name=='TSK')&&typeof L!='undefined'?L:null));
async function draw(o){try{await document.fonts.ready}catch{}const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),F=hf(),h=o.hue,hx=50,hy=60,hw=W-100,hh=700,[im,lg]=await Promise.all([ld(o.img),ld(o.logo)]),brand=await ld(typeof L!='undefined'?L:null);
 g.fillStyle='#07090E';g.fillRect(0,0,W,H);
 let r=g.createRadialGradient(W,0,0,W,0,950);r.addColorStop(0,`hsla(${h},90%,48%,.55)`);r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,W,H);
 r=g.createRadialGradient(0,H,0,0,H,820);r.addColorStop(0,'rgba(255,46,99,.28)');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,W,H);
 g.save();g.globalAlpha=.05;g.strokeStyle='#fff';g.lineWidth=2;for(let i=-H;i<W;i+=46){g.beginPath();g.moveTo(i,H);g.lineTo(i+H,0);g.stroke()}g.restore();
 const gr=g.createLinearGradient(0,0,W,0);gr.addColorStop(0,CY);gr.addColorStop(1,PK);g.fillStyle=gr;g.fillRect(0,0,W,12);
 g.save();cut(g,hx,hy,hw,hh,64);g.clip();g.fillStyle=`hsl(${h},60%,14%)`;g.fillRect(hx,hy,hw,hh);
 const rg=g.createRadialGradient(hx+hw/2,hy+hh,0,hx+hw/2,hy+hh,hw*.75);rg.addColorStop(0,`hsla(${h},90%,50%,.5)`);rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(hx,hy,hw,hh);
 const cx=hx+hw/2;
 if(im&&!o.contain)cover(g,im,hx,hy,hw,hh);
 else if(im){const zw=hw,zh=im.height*hw/im.width;g.drawImage(im,hx,hy+hh*.4-zh*.5,zw,zh)}
 else{g.fillStyle='rgba(6,8,12,.65)';g.beginPath();g.ellipse(cx,hy+hh,340,360,0,Math.PI,2*Math.PI);g.fill();g.beginPath();g.arc(cx,hy+300,150,0,7);g.fill();g.fillStyle=`hsl(${h},100%,68%)`;g.fillRect(cx-125,hy+250,250,64)}
 const fd=g.createLinearGradient(0,hy+hh-400,0,hy+hh);fd.addColorStop(0,'rgba(7,9,14,0)');fd.addColorStop(1,'rgba(7,9,14,.97)');g.fillStyle=fd;g.fillRect(hx,hy+hh-400,hw,400);g.restore();
 cut(g,hx,hy,hw,hh,64);g.lineWidth=4;g.strokeStyle=gr;g.stroke();
 g.fillStyle=o.rankColor;g.beginPath();g.moveTo(hx,hy+64);g.lineTo(hx+64,hy);g.lineTo(hx+250,hy);g.lineTo(hx+250,hy+84);g.lineTo(hx,hy+84);g.closePath();g.fill();
 g.fillStyle=o.rankColor==PK?'#fff':'#000';g.textBaseline='middle';fit(g,o.rank,200,54,'900',F);g.fillText(o.rank,hx+28,hy+46);
 if(o.tag){g.font='800 34px '+F;ls(g,'3px');const tw=g.measureText(o.tag).width+44;g.fillStyle='rgba(0,0,0,.55)';cut(g,hx+hw-tw-24,hy+24,tw,60,14);g.fill();g.fillStyle='#fff';g.fillText(o.tag,hx+hw-tw-2,hy+55);ls(g,'0px')}
 g.fillStyle='#fff';fit(g,o.title,hw-80,128,'900',F);g.textBaseline='alphabetic';g.fillText(o.title,hx+44,hy+hh-120);
 if(o.sub){let tx=hx+44;if(lg){g.save();g.beginPath();g.arc(tx+28,hy+hh-56,28,0,7);g.clip();g.drawImage(lg,tx,hy+hh-84,56,56);g.restore();tx+=72}g.fillStyle=CY;g.font='700 38px '+F;g.fillText(o.sub,tx,hy+hh-42)}
 const n=o.stats.length,gap=20,tw=(hw-gap*(n-1))/n,ty=800,th=260;
 o.stats.forEach((s,i)=>{const x=hx+i*(tw+gap);cut(g,x,ty,tw,th,30);g.fillStyle='rgba(255,255,255,.05)';g.fill();g.lineWidth=2;g.strokeStyle='rgba(255,255,255,.14)';g.stroke();
  g.fillStyle='#8c97ab';g.font='700 26px '+F;ls(g,'4px');g.fillText(s.l.toUpperCase(),x+28,ty+58);ls(g,'0px');
  g.fillStyle=s.hl?CY:'#fff';fit(g,String(s.v),tw-50,92,'900',F);g.fillText(String(s.v),x+28,ty+156);
  if(s.pct!=null){g.fillStyle='rgba(255,255,255,.1)';g.fillRect(x+28,ty+196,tw-56,10);g.fillStyle=s.hl?CY:PK;g.fillRect(x+28,ty+196,(tw-56)*Math.max(0,Math.min(1,s.pct)),10)}});
 let cxp=hx,cy=1100;g.font='700 30px '+F;(o.chips||[]).forEach(t=>{const w=g.measureText(t).width+44;if(cxp+w>hx+hw){cxp=hx;cy+=70}cut(g,cxp,cy,w,54,14);g.fillStyle='rgba(0,240,255,.08)';g.fill();g.lineWidth=2;g.strokeStyle='rgba(0,240,255,.4)';g.stroke();g.fillStyle='#d7f9ff';g.textBaseline='middle';g.fillText(t,cxp+22,cy+28);g.textBaseline='alphabetic';cxp+=w+14});
 g.fillStyle=gr;g.fillRect(hx,1262,hw,2);if(brand)g.drawImage(brand,hx,1276,54,54);
 g.fillStyle='#fff';g.font='900 34px '+F;ls(g,'3px');g.fillText('TSK ESPORTS',hx+(brand?70:0),1314);ls(g,'0px');g.fillStyle='#6f7a8f';g.font='600 28px '+F;g.textAlign='right';g.fillText(location.host,hx+hw,1314);g.textAlign='left';
 c.toBlob(b=>{const f=new File([b],o.file+'.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f]}).catch(()=>{});else{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=o.file+'.png';a.click()}})}
window.dlP=id=>{const p=DB.players.find(x=>x.id==id);if(!p)return;const all=[...DB.players].sort((a,b)=>b.pps-a.pps),r=all.findIndex(x=>x.id==id),tt=tm(p.team),ok=(+p.pps>0)||(+p.gp>0),mx=Math.max(1,...DB.players.map(x=>+x.pps||0)),mk=Math.max(1,...DB.players.map(x=>+x.kd||0)),V=v=>ok?v:'—';
 draw({hue:hue(p.nick),img:p.img,logo:logoSrc(tt),rank:ok?'#'+(r+1):'—',rankColor:ok&&r<3?MED[r]:PK,tag:p.country||'',title:p.nick,sub:tt.name||'',file:p.nick,
  stats:[{l:'PPS',v:V(p.pps),pct:ok?(+p.pps||0)/mx:0,hl:1},{l:'K/D',v:V(p.kd),pct:ok?(+p.kd||0)/mk:0},{l:'WR',v:V((p.wr??0)+'%'),pct:ok?(+p.wr||0)/100:0}],
  chips:[+p.gp>0?p.gp+' '+R('матчей','matches'):null,+p.bsTrophies>0?(+p.bsTrophies).toLocaleString('ru-RU')+' '+R('кубков','trophies'):null,p.bsRank?String(p.bsRank):null,R('Возраст','Age')+' '+(+p.age>0?p.age:'?')].filter(Boolean)})};
window.dlT=id=>{const x=tm(id);if(!x)return;const all=sortedT(),r=all.findIndex(z=>z.id==id),w=Math.round(100*x.w/Math.max(1,x.w+x.l)),mx=Math.max(1,...all.map(z=>+z.pps||0)),pls=DB.players.filter(p=>p.team==id).sort((a,b)=>b.pps-a.pps).slice(0,5);
 draw({hue:hue(x.name),img:logoSrc(x),contain:1,rank:'#'+(r+1),rankColor:r<3?MED[r]:PK,tag:x.country||'',title:x.name,sub:R('Мировой рейтинг','World ranking'),file:x.name,
  stats:[{l:R('Рейтинг','Rank'),v:'#'+(r+1),pct:1-r/Math.max(1,all.length),hl:1},{l:'PPS',v:x.pps,pct:(+x.pps||0)/mx},{l:'W / L',v:x.w+' / '+x.l,pct:w/100}],
  chips:pls.map(p=>p.nick)})};
})();

const _op=window.openP;window.openP=function(id){_op.apply(this,arguments);const b=document.querySelector('#m .su');if(b){b.classList.add('pcard','tn-page');const _pp=DB.players.find(z=>z.id==id);if(_pp&&typeof _pp.color=='string'&&/^#[0-9a-f]{6}$/i.test(_pp.color))b.style.setProperty('--pc',_pp.color);else b.style.removeProperty('--pc')}if(b&&!b.querySelector('.pshare')){const d=document.createElement('button');d.className='btn k w-full mt-3 pshare';d.innerHTML=ic('share')+' '+R('Поделиться карточкой','Share card');d.onclick=()=>dlP(id);b.appendChild(d)}};
})();
