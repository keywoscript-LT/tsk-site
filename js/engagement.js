/* ===== v13: вовлечение — серии/достижения, мини-игра, реакции, лента, OBS-оверлей, сравнение команд ===== */
(()=>{
const K='tsk_x_',ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(K+k))??d}catch{return d}},sv=(k,v)=>{try{localStorage.setItem(K+k,JSON.stringify(v))}catch{}},
ds=n=>{const d=new Date(Date.now()-n*864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')},
win=m=>tsK(m.st)=='fin'&&+m.sa!=+m.sb?(+m.sa>+m.sb?'a':'b'):null,
card=(i,c,h)=>`<span class="grid place-items-center w-9 h-9 rounded-xl shrink-0 ${c}">${ic(i,'!w-5 !h-5')}</span>`+h;

/* ---------- 1. серии и достижения прогнозиста ---------- */
function stats(){const L=DB.matches.map(m=>[PRED.me[m.id],win(m),m]).filter(x=>x[0]&&x[1]).sort((a,b)=>new Date(a[2].when)-new Date(b[2].when));let cur=0,best=0,ok=0;
L.forEach(x=>{if(x[0]==x[1]){ok++;cur++;best=Math.max(best,cur)}else cur=0});
const th=DB.tourn.filter(x=>TP.me[x.id]&&tsK(x.status)=='fin'&&x.winner&&TP.me[x.id]==x.winner).length;
return{n:Object.keys(PRED.me).length+Object.keys(TP.me).length,ok,tot:L.length,cur,best,th}}
const AC=s=>[['star',R('Первый прогноз','First prediction'),s.n>=1,s.n+'/1'],['fire',R('5 подряд','5 in a row'),s.best>=5,Math.min(5,s.best)+'/5'],
['target',R('10 угаданных','10 correct'),s.ok>=10,Math.min(10,s.ok)+'/10'],['cup',R('Победитель турнира','Tournament winner'),s.th>=1,Math.min(1,s.th)+'/1'],
['crown',R('Снайпер 70%','Sharpshooter 70%'),s.tot>=10&&s.ok/s.tot>=.7,s.tot>=10?Math.round(100*s.ok/s.tot)+'%':s.tot+'/10']];
const formCard=()=>{if(!S.me)return'';const s=stats();
return`<section class="g mb-3 p-3"><div class="flex items-center gap-3">${card('fire','kb-rd-10 kc-rd',`<div class="flex-1"><div class="font-head font-black text-[15px]">${R('Серия угаданных','Streak')}: ${s.cur}</div><div class="text-[11px] k-t4">${R('Рекорд','Best')}: ${s.best} · ${R('Достижения','Achievements')}</div></div>`)}</div>
<div class="grid grid-cols-5 gap-1.5 mt-3">${AC(s).map(a=>`<div class="text-center ${a[2]?'':'opacity-40'}"><span class="grid place-items-center h-10 w-10 mx-auto rounded-full ${a[2]?'kb-gd-15 kc-gd':'bw-10 k-t4'}">${ic(a[0],'!w-5 !h-5')}</span><div class="text-[9px] leading-tight mt-1">${esc(a[1])}</div><div class="text-[9px] k-t5">${a[3]}</div></div>`).join('')}</div></section>`};
const _ph=window.predHead;window.predHead=()=>_ph()+formCard();

/* ---------- 2. ежедневная мини-игра: угадай бравлера (список правится здесь) ---------- */
const BR=[['Shelly','Шелли','Дробовик в упор; супер ломает стены и отбрасывает врагов','Close-range shotgun; her super breaks walls and knocks enemies back'],
['Colt','Кольт','Два револьвера: длинная очередь по прямой; супер пробивает стены','Dual revolvers firing a long straight burst; super breaks walls'],
['Bull','Булл','Танк с дробовиком; супер — таран, ломающий стены','Tank with a shotgun; super is a wall-breaking charge'],
['Brock','Брок','Ракетница дальнего боя; супер — ракетный дождь','Long-range rocket launcher; super is a rocket rain'],
['Spike','Спайк','Кактус: бросает иглы веером; супер — замедляющее поле','Cactus throwing a fan of needles; super leaves a slowing field'],
['Crow','Ворон','Метает отравленные кинжалы и прыгает; яд снижает лечение','Poison daggers and a jump super; poison reduces healing'],
['Leon','Леон','Невидимка: супер делает его незаметным','Stealth master: his super makes him invisible'],
['Poco','Поко','Музыкант с гитарой: лечит союзников волной звука','Guitarist who heals allies with sound waves'],
['El Primo','Эль Примо','Борец-танк: быстрые удары кулаками и прыжок-супер','Wrestler tank: fast punches and a jumping super'],
['Barley','Барли','Бармен: бросает бутылки, оставляя горящие лужи','Bartender lobbing bottles that leave fire puddles'],
['Piper','Пайпер','Снайпер с зонтиком: чем дальше цель, тем больше урон','Umbrella sniper: more damage the farther the target'],
['Pam','Пэм','Лечащая турель и дробь из металлолома','Healing turret plus a scrap-metal shotgun'],
['Frank','Фрэнк','Здоровяк с молотом: супер оглушает','Big hammer tank: his super stuns'],
['Edgar','Эдгар','Ассасин с шарфом: прыгает на врагов и лечится ударами','Scarf assassin who jumps on enemies and heals by hitting'],
['Mortis','Мортис','Ассасин с лопатой: рывками добирается до цели','Shovel assassin dashing to his target'],
['Max','Макс','Саппорт-спринтер: супер ускоряет всю команду','Speedy support: her super speeds up the team']];
window.BRL=BR;const NZ=s=>String(s).toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]/g,''),dgS=()=>ld('dg',{streak:0,best:0,last:'',d:'',ok:null});
const dgPick=()=>{let h=0;for(const c of ds(0))h=(h*31+c.charCodeAt())>>>0;return BR[h%BR.length]};
window.dgGo=()=>{const s=dgS(),b=dgPick(),v=NZ(($('#dg-i')||{}).value);if(!v)return;if(s.d==ds(0))return;const ok=v==NZ(b[0])||v==NZ(b[1]);
s.d=ds(0);s.ok=ok;s.streak=ok?(s.last==ds(1)?s.streak+1:1):0;if(ok)s.last=ds(0);s.best=Math.max(s.best,s.streak);sv('dg',s);window.hap&&hap([30]);render(true)};
const dgCard=()=>{const s=dgS(),b=dgPick(),done=s.d==ds(0),l=n=>S.lang=='ru'?n[1]:n[0];
return`<section class="g mb-3 p-3"><div class="flex items-center gap-3">${card('target','kb-cy-10 kc-cy',`<div class="flex-1 min-w-0"><div class="font-head font-black text-[15px]">${R('Бравлер дня','Brawler of the day')}</div><div class="text-[11px] k-t4">${R('Одна попытка в день','One try per day')} · ${R('серия','streak')}: <b class="k-hi">${s.last==ds(0)||s.last==ds(1)?s.streak:0}</b> · ${R('рекорд','best')}: ${s.best}</div></div>`)}</div>
${done||!window.bIconN?'':`<div class="flex justify-center mt-3">${bIconN(b[0],76,0,1)}</div>`}<p class="text-[13px] k-t2 mt-2.5">«${esc(S.lang=='ru'?b[2]:b[3])}»</p>
${done?`<div class="mt-2 text-sm font-bold ${s.ok?'kc-gn':'kc-rd'}"><span class="inline-flex align-middle mr-1.5">${window.bIconN?bIconN(b[0],24):''}</span>${s.ok?R('Верно! ','Correct! '):R('Не угадал. Это ','Missed. It was ')}${esc(l(b))}<span class="k-t5 font-normal"> · ${R('приходи завтра','come back tomorrow')}</span></div>`
:`<div class="flex gap-2 mt-2"><input id="dg-i" class="inp !mt-0" list="dg-l" autocomplete="off" placeholder="${R('Имя бравлера','Brawler name')} (${b[S.lang=='ru'?1:0].length} ${R('букв','letters')})" onkeydown="if(event.key=='Enter')dgGo()"><datalist id="dg-l">${BR.map(x=>`<option value="${esc(l(x))}">`).join('')}</datalist><button class="btn shrink-0" onclick="dgGo()">OK</button></div>`}</section>`};

/* ---------- 3. лента событий ---------- */
const feed=()=>{const ev=[];histU().filter(e=>e.kind=='join'||e.kind=='leave').slice(0,12).forEach(e=>{const p=DB.players.find(x=>x.id==e.player_id);if(p)ev.push([e.at,e.kind=='join'?'ne':'sw',`<b>${esc(p.nick)}</b> ${e.kind=='join'?R('перешёл(а) в','joined'):R('покинул(а)','left')} <b>${esc(tm(e.team_id).name)}</b>`,e.team_id])});
DB.matches.filter(m=>tsK(m.st)=='fin').sort((a,b)=>new Date(b.when)-new Date(a.when)).slice(0,6).forEach(m=>{const w=win(m);ev.push([m.when,'cup',w?`<b>${esc(tm(m[w]).name)}</b> ${R('выиграла матч','won')} ${m.sa}:${m.sb} ${R('против','vs')} ${esc(tm(m[w=='a'?'b':'a']).name)}`:`${esc(tm(m.a).name)} ${m.sa}:${m.sb} ${esc(tm(m.b).name)}`,m[w||'a']])});
ev.sort((a,b)=>new Date(b[0])-new Date(a[0]));if(!ev.length)return'';
return hd(R('Лента событий','Activity'))+`<div class="grid gap-1.5 mb-3">${ev.slice(0,8).map(e=>`<div class="g r p-2.5 flex items-center gap-2.5 text-[13px] cursor-pointer" onclick="openT('${esc(e[3])}')"><span class="k-t4">${ic(e[1],'!w-4 !h-4')}</span><span class="flex-1 min-w-0">${e[2]}</span><span class="text-[10px] k-t5 shrink-0">${dt(e[0])}</span></div>`).join('')}</div>`};
window.dgCard=dgCard;const _vn=V.news;V.news=q=>_vn(q)+feed();

/* ---------- 4. реакции на LIVE-матч ---------- */
const RX=['🔥','😮','💀'],RC=ld('rx',{c:{},me:{}}),ovU=id=>location.origin+TSK_ROOT+'?overlay='+encodeURIComponent(id);
window.rxGo=(id,e)=>{if(sb&&!S.me)return authModal();const o=RC.me[id];if(o==e)return;const c=RC.c[id]=RC.c[id]||{};if(o)c[o]=Math.max(0,(c[o]||0)-1);c[e]=(c[e]||0)+1;RC.me[id]=e;sv('rx',RC);
if(sb)sb.from('match_reactions').upsert({match_id:id,user_id:S.me.id,emoji:e},{onConflict:'match_id,user_id'}).then(()=>{});window.hap&&hap([20]);render(true)};
window.ovCopy=id=>{try{navigator.clipboard.writeText(ovU(id));toast(R('Ссылка для OBS скопирована','OBS link copied'))}catch{toast(ovU(id),6000)}};
const rxLoad=async()=>{if(!sb)return;try{const r=await sb.rpc('reaction_counts');if(r.error)return;const c={};(r.data||[]).forEach(x=>{(c[x.match_id]=c[x.match_id]||{})[x.emoji]=+x.n});if(JSON.stringify(c)!=JSON.stringify(RC.c)){RC.c=c;if(!$('#m').innerHTML)render(true)}}catch{}};
setInterval(rxLoad,15000);rxLoad();
function after(){document.querySelectorAll('#v .lv[data-mid]').forEach(cd=>{const box=cd.querySelector('.lv-rx');if(!box||box.dataset.k)return;
const m=DB.matches.find(x=>String(x.id)==cd.dataset.mid&&tsK(x.st)=='live');if(!m)return;box.dataset.k=1;
const c=RC.c[m.id]||{},me=RC.me[m.id];
box.innerHTML=`<div class="lv-rg">${RX.map(e=>`<button type="button" class="lv-r${me==e?' on':''}" onclick="event.stopPropagation();rxGo('${esc(m.id)}','${e}')"><span>${e}</span><b>${c[e]||0}</b></button>`).join('')}</div><button type="button" class="lv-obs" title="${R('Ссылка для OBS-оверлея','OBS overlay link')}" onclick="event.stopPropagation();ovCopy('${esc(m.id)}')"><span>OBS</span></button>`})}
new MutationObserver(after).observe($('#v'),{childList:true});after();

/* ---------- 5. сравнение команд ---------- */
window.h2h=(()=>{
const st={k:'t',a:{t:'',p:''},b:{t:'',p:''},pick:null,q:''};
const CHV='<svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const list=k=>k=='t'?sortedT():[...DB.players].sort((x,y)=>(+y.pps||0)-(+x.pps||0)),
get=(k,id)=>(k=='t'?DB.teams:DB.players).find(x=>x.id==id),
nm=(k,x)=>k=='t'?x.name:x.nick,
av2=(k,x,c)=>k=='t'?lg(x,c):`<span class="dk block overflow-hidden rounded-2xl shrink-0 ${c}" style="background:linear-gradient(160deg,hsl(${pHue(x)} 70% 30%),#0b0f16)">${av(x)}</span>`,
subL=(k,x)=>k=='t'?`${fl(x.country)}<span>${esc(cn(x.country))}</span>`:`${fl(x.country)}<span>${esc(x.team?tm(x.team).name:cn(x.country))}</span>`,
fix=k=>{const L=list(k);if(L.length<2)return null;let a=get(k,st.a[k]),b=get(k,st.b[k]);if(!a)a=L[0];if(!b||b.id==a.id)b=L.find(x=>x.id!=a.id);st.a[k]=a.id;st.b[k]=b.id;return[a,b,L]},
wr=x=>Math.round(100*(+x.w||0)/Math.max(1,(+x.w||0)+(+x.l||0))),
meet=(a,b)=>!a||!b||a==b?[]:DB.matches.filter(m=>tsK(m.st)=='fin'&&((m.a==a&&m.b==b)||(m.a==b&&m.b==a))).sort((x,y)=>new Date(y.when)-new Date(x.when)),
stats=(k,A,B,L,ms,ida)=>{const ra=L.indexOf(A)+1,rb=L.indexOf(B)+1;
 if(k=='t'){const wa=ms.filter(m=>win(m)&&m[win(m)]==A.id).length,wb=ms.filter(m=>win(m)&&m[win(m)]==B.id).length,n=x=>DB.players.filter(p=>p.team==x.id).length;
  return[[R('Место','Rank'),ra,rb,-1,'#'],['PPS',A.pps,B.pps,1],[R('Победы','Wins'),A.w,B.w,1],[R('Поражения','Losses'),A.l,B.l,-1],[R('Винрейт','Win rate'),wr(A),wr(B),1,'%'],[R('Личные встречи','Head to head'),wa,wb,1],[R('Игроков','Players'),n(A),n(B),0]]}
 return[[R('Место','Rank'),ra,rb,-1,'#'],['PPS',A.pps,B.pps,1],['K/D',A.kd,B.kd,1],['WR',A.wr,B.wr,1,'%'],[R('Возраст','Age'),+A.age>0?A.age:0,+B.age>0?B.age:0,0]]},
row=([l,va,vb,d,f])=>{const nv=x=>(d==0&&!x)?'—':(f=='#'?'#'+x:f=='%'?x+'%':(x??0));
 const A=+va||0,B=+vb||0;let sa=A,sb=B;if(d==-1){sa=A>0?1/A:0;sb=B>0?1/B:0}
 const mx=Math.max(sa,sb),wa=mx?Math.round(100*sa/mx):0,wb=mx?Math.round(100*sb/mx):0,w=d&&sa!=sb?(sa>sb?'a':'b'):'';
 return{w,html:`<div class="cmp-row"><span class="cmp-l">${l}</span><div class="cmp-m${d?'':' n'}"><b class="cmp-v${w=='a'?' w':''}">${nv(va)}</b><div class="cmp-bar a${w=='b'?' lo':''}"><i style="width:${wa}%"></i></div><div class="cmp-bar b${w=='a'?' lo':''}"><i style="width:${wb}%"></i></div><b class="cmp-v r${w=='b'?' w':''}">${nv(vb)}</b></div></div>`}},
opts=(k,L,q,cur,other)=>{q=(q||'').trim().toLowerCase();const l=L.filter(x=>!q||[nm(k,x),x.country,cn(x.country),k=='p'&&x.team?tm(x.team).name:''].join(' ').toLowerCase().includes(q));
 return l.length?l.map(x=>`<button type="button" class="cmp-o${x.id==cur?' on':''}" ${x.id==other?'disabled':''} onclick="cmpSet('${esc(x.id)}')">${av2(k,x,'cmp-ao')}<span class="m"><b>${esc(nm(k,x))}</b><span class="s">${subL(k,x)}</span></span><span class="p">${x.pps||0}</span></button>`).join(''):`<p class="text-center text-sm opacity-60 py-6">${t('none')}</p>`};
const draw=()=>{const k=st.k,f=fix(k),
 tabs=`<div class="cmp-tabs" role="tablist">${[['t',R('Команды','Teams'),DB.teams.length],['p',R('Игроки','Players'),DB.players.length]].map(([v,l,n])=>`<button type="button" role="tab" aria-selected="${k==v}" class="${k==v?'on':''}" ${n<2?'disabled':''} onclick="h2h('${v}')">${l}<small>${n}</small></button>`).join('')}</div>`,
 head=`<button class="absolute right-3 top-3 btn k !p-1.5 z-10" onclick="closeM()">${ic('x')}</button><div class="flex items-center gap-3 mb-3 pr-12 flex-wrap"><h3 class="font-head font-black text-lg">${R('Сравнение','Compare')}</h3>${tabs}</div>`;
 if(!f)return modal(head+`<p class="text-sm opacity-70 py-6 text-center">${k=='t'?R('Нужно минимум две команды.','At least two teams are needed.'):R('Нужно минимум два игрока.','At least two players are needed.')}</p>`,'md:max-w-2xl');
 const[A,B,L]=f;
 if(st.pick){const s=st.pick,cur=s=='a'?A:B,oth=s=='a'?B:A;
  return modal(head+`<div class="cmp-pk" style="--c:${s=='a'?'var(--cy)':'var(--rd)'}"><div class="flex items-center gap-2 mb-3"><button type="button" class="btn k !p-1.5" aria-label="${R('Назад','Back')}" onclick="cmpPick()">${ic('back')}</button><b class="font-head" style="color:var(--c)">${k=='t'?R('Выбери команду','Pick a team'):R('Выбери игрока','Pick a player')} ${s=='a'?'1':'2'}</b></div><div class="cmp-sr">${ic('search')}<input id="cmpq" type="text" autocomplete="off" spellcheck="false" placeholder="${esc(t(k=='t'?'rs':'ps'))}" value="${esc(st.q)}" oninput="cmpQ(this.value)"></div><div id="cmpl" class="cmp-pl">${opts(k,L,st.q,cur.id,oth.id)}</div></div>`,'md:max-w-2xl'),setTimeout(()=>{const i=document.getElementById('cmpq');i&&matchMedia('(hover:hover)').matches&&i.focus()},30)}
 const ms=k=='t'?meet(A.id,B.id):meet(A.team,B.team),R_=stats(k,A,B,L,ms).map(row),la=R_.filter(r=>r.w=='a').length,lb=R_.filter(r=>r.w=='b').length,
 pa=Math.round(100/(1+Math.pow(10,((+B.pps||0)-(+A.pps||0))/400))),
 slot=(s,x)=>`<button type="button" class="cmp-slot ${s}" onclick="cmpPick('${s}')" aria-label="${R('Сменить','Change')}: ${esc(nm(k,x))}"><i class="cmp-rk">#${L.indexOf(x)+1}</i>${av2(k,x,'cmp-av')}<b class="cmp-n">${esc(nm(k,x))}</b><span class="cmp-s">${subL(k,x)}</span><span class="cmp-ch">${R('Сменить','Change')} ${CHV}</span></button>`,
 mh=k=='t'||(A.team&&B.team&&A.team!=B.team)?(ms.length?hd(k=='t'?R('История встреч','Meetings'):R('Матчи их команд','Their teams’ matches'))+`<div class="grid gap-1.5">${ms.slice(0,6).map(m=>{const w=win(m);return`<div class="cmp-mt"><span class="${w=='a'?'w':''}">${esc(tm(m.a).name)}</span><b>${m.sa}:${m.sb}</b><span class="${w=='b'?'w':''}">${esc(tm(m.b).name)}</span><em>${dt(m.when)}</em></div>`}).join('')}</div>`:`<p class="text-[12px] opacity-60 mt-3 text-center">${k=='t'?R('Команды ещё не встречались.','No meetings yet.'):R('Их команды ещё не встречались.','Their teams haven’t met yet.')}</p>`):(A.team&&A.team==B.team?`<p class="text-[12px] opacity-60 mt-3 text-center">${R('Играют в одной команде.','Same team.')}</p>`:'');
 modal(head+`<div class="cmp-top">${slot('a',A)}<button type="button" class="cmp-sw" title="${R('Поменять местами','Swap')}" aria-label="${R('Поменять местами','Swap')}" onclick="cmpSwap()">${ic('swap')}</button>${slot('b',B)}</div><div class="cmp-sum"><b class="a">${la}</b><span>${R('категорий выиграно','categories won')}</span><b class="b">${lb}</b></div><div>${R_.map(r=>r.html).join('')}</div><div class="cmp-od"><div class="t"><b class="a">${pa}%</b><span>${R('Шансы по PPS','Odds by PPS')}</span><b class="b">${100-pa}%</b></div><div class="bar"><i style="width:${pa}%"></i></div></div>${mh}`,'md:max-w-2xl')};
window.cmpPick=s=>{st.pick=s||null;st.q='';draw()};
window.cmpSet=id=>{if(!st.pick)return;st[st.pick][st.k]=id;st.pick=null;st.q='';draw()};
window.cmpSwap=()=>{const k=st.k,a=st.a[k];st.a[k]=st.b[k];st.b[k]=a;draw()};
window.cmpQ=v=>{st.q=v;const f=fix(st.k),el=document.getElementById('cmpl');if(!f||!el||!st.pick)return;const[A,B,L]=f,s=st.pick;el.innerHTML=opts(st.k,L,v,(s=='a'?A:B).id,(s=='a'?B:A).id)};
return(k,id)=>{if(k=='t'||k=='p')st.k=k;if(id&&get(st.k,id)){st.a[st.k]=id;if(st.b[st.k]==id)st.b[st.k]=''}st.pick=null;st.q='';draw()}})();
const _vr=V.rank;V.rank=q=>_vr(q).replace('</h1>',m=>m+`<button class="btn k w-full mb-2" onclick="h2h('t')">${ic('swap')} ${R('Сравнить команды','Compare teams')}</button>`);

/* ---------- 6. оверлей для OBS: ?overlay=<id матча> ---------- */
const ov=new URLSearchParams(location.search).get('overlay');
if(ov){const st=document.createElement('style');st.textContent='html,body{background:transparent!important;background-image:none!important}header,#ft,#bot,#v,#mt{display:none!important}#ovl{position:fixed;left:16px;bottom:16px;display:flex;align-items:center;gap:14px;padding:10px 18px;border-radius:14px;background:rgba(7,9,14,.88);border:1px solid #2a3446;color:#fff;font:900 26px Montserrat,sans-serif}#ovl i{font-style:normal;color:#FF2E63;font-size:11px;letter-spacing:.15em}#ovl b{color:#00F0FF;font-size:34px}';document.head.appendChild(st);
const o=document.createElement('div');o.id='ovl';document.body.appendChild(o);
const up=()=>{const m=DB.matches.find(x=>String(x.id)==ov);o.style.display=m?'flex':'none';if(m)o.innerHTML=`<i>${tsK(m.st)=='live'?'● LIVE':''}</i><span>${esc(tm(m.a).name)}</span><b>${m.sa} : ${m.sb}</b><span>${esc(tm(m.b).name)}</span>`};setInterval(up,2000);up()}
})();
