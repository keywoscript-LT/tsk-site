/* ===== v16: вкладка «Игры» ===== */
(()=>{
const K='tsk_g_',ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(K+k))??d}catch{return d}},sv=(k,v)=>{try{localStorage.setItem(K+k,JSON.stringify(v))}catch{}},
rnd=a=>a[Math.floor(Math.random()*a.length)],shuf=a=>[...a].sort(()=>Math.random()-.5),ru=()=>S.lang=='ru';
Object.assign(T.ru,{games:'Игры'});Object.assign(T.en,{games:'Games'});Object.assign(T.uk,{games:'Ігри'});Object.assign(T.kk,{games:'Ойындар'});
P.games='<path fill-rule="evenodd" d="M7.5 6h9a5.5 5.5 0 015.4 6.5l-.7 3.8a3.2 3.2 0 01-5.6 1.5L14 16h-4l-1.6 1.8a3.2 3.2 0 01-5.6-1.5l-.7-3.8A5.5 5.5 0 017.5 6zM7 9.5v1.7H5.3v1.6H7v1.7h1.6v-1.7h1.7v-1.6H8.6V9.5zm9.6 1.2a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2zm2.4 1.9a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z"/>';
const G={g:null,s:0,q:null,pick:null,over:false,rt:null,mm:null},bst=k=>ld('b_'+k,0),sb_=(k,v,low)=>{const b=bst(k);if(!b||(low?v<b:v>b))sv('b_'+k,v)};
const back=`<button class="btn k !py-1.5 !px-3 text-xs mb-3" onclick="gmBack()">← ${R('Все игры','All games')}</button>`,
again=(k,msg)=>`<div class="g p-4 text-center mt-3"><div class="font-head font-black text-lg">${msg}</div><div class="text-[12px] k-t4 mt-1">${R('Счёт','Score')}: <b class="k-hi">${G.s}</b> · ${R('рекорд','best')}: ${bst(k)}</div><button class="btn mt-3" onclick="gmOpen('${k}')">${R('Играть снова','Play again')}</button></div>`,
stat=k=>`<div class="text-[12px] k-t4 mb-3">${R('Счёт','Score')}: <b class="k-hi">${G.s}</b> · ${R('рекорд','best')}: ${bst(k)}</div>`;
const nm=x=>esc(x.name||x.nick),poolHL=()=>{const T=DB.teams.filter(x=>+x.pps);return T.length>=3?T.map(x=>[x.name,+x.pps]):DB.players.filter(x=>+x.pps).map(x=>[x.nick,+x.pps])};
const nxHL=()=>{const P=poolHL();if(P.length<3)return null;const a=G.q?G.q.b:rnd(P);let b=rnd(P.filter(x=>x!=a));return{a,b}};
const mkTQ=()=>{const T=DB.teams;if(T.length<2)return null;const a=rnd(T),o=shuf([a,...shuf(T.filter(x=>x.id!=a.id)).slice(0,3)]),n=DB.players.filter(p=>p.team==a.id).length;return{ans:a.id,o:o.map(x=>[x.id,x.name]),clue:`PPS ${a.pps} · W/L ${a.w}/${a.l} · ${R('игроков','players')}: ${n}`}};
const mkBQ=()=>{const B=window.BRL||[],a=rnd(B);if(!a)return null;const o=shuf([a,...shuf(B.filter(x=>x!=a)).slice(0,3)]);return{ans:a[0],o:o.map(x=>[x[0],ru()?x[1]:x[0]]),clue:ru()?a[2]:a[3]}};
const H=[['hl','rank',R('Выше или ниже','Higher or lower'),R('Чей PPS больше?','Whose PPS is higher?')],['tq','players',R('Угадай команду','Guess the team'),R('По статистике','By the stats')],['bq','target',R('Бравлер-квиз','Brawler quiz'),R('По описанию, 4 варианта','By description')],['rt','fire',R('Реакция','Reaction'),R('Жми, когда позеленеет','Tap on green')],['mm','star',R('Мемори','Memory'),R('Найди все пары','Match the pairs')]];
window.gmOpen=k=>{clearTimeout(G.t);Object.assign(G,{g:k,s:0,pick:null,over:false,q:null,rt:null,mm:null});
if(k=='hl')G.q=nxHL();if(k=='tq')G.q=mkTQ();if(k=='bq')G.q=mkBQ();
if(k=='rt')G.rt={st:'idle'};
if(k=='mm'){const e=(window.BRL&&window.bIconN)?shuf(window.BRL).slice(0,6).map(b=>bIconN(b[0],46)):['🔥','💀','⚡','🎯','👑','🛡️'];G.mm={c:shuf([...e,...e]),o:[],d:[],m:0,lock:false}}
render(true);scrollTo({top:0})};
window.gmBack=()=>{clearTimeout(G.t);G.g=null;render(true)};
window.hlGo=up=>{const{a,b}=G.q;if(G.pick!==null)return;G.pick=up;const ok=up?b[1]>=a[1]:b[1]<=a[1];G.ok=ok;render(true);G.t=setTimeout(()=>{if(ok){G.s++;sb_('hl',G.s);G.pick=null;G.q=nxHL()}else{sb_('hl',G.s);G.over=true}render(true)},900)};
window.qzGo=id=>{if(G.pick!==null)return;G.pick=id;const ok=id==G.q.ans;render(true);G.t=setTimeout(()=>{if(ok){G.s++;sb_(G.g,G.s);G.pick=null;G.q=(G.g=='tq'?mkTQ:mkBQ)()}else{sb_(G.g,G.s);G.over=true}render(true)},ok?600:1100)};
window.rtTap=()=>{const r=G.rt,up=()=>{if(S.tab=='games'&&G.g=='rt')render(true)};
if(r.st=='idle'||r.st=='res'||r.st=='early'){r.st='wait';up();G.t=setTimeout(()=>{r.st='go';r.t0=performance.now();up()},1500+Math.random()*2500)}
else if(r.st=='wait'){clearTimeout(G.t);r.st='early';up()}
else if(r.st=='go'){r.ms=Math.round(performance.now()-r.t0);r.st='res';G.s=r.ms;sb_('rt',r.ms,1);up()}};
window.mmFlip=i=>{const m=G.mm;if(m.lock||m.o.includes(i)||m.d.includes(i))return;m.o.push(i);
if(m.o.length==2){m.m++;const[a,b]=m.o;if(m.c[a]==m.c[b]){m.d.push(a,b);m.o=[];if(m.d.length==12){sb_('mm',m.m,1);G.over=true}}else{m.lock=true;render(true);G.t=setTimeout(()=>{m.o=[];m.lock=false;render(true)},800);return}}render(true)};
const tile=(c,t,d,k,b)=>`<button class="g r p-3 text-left active:scale-[.98] transition" onclick="${k}"><span class="grid place-items-center w-10 h-10 rounded-xl ${c}">${ic(b,'!w-5 !h-5')}</span><div class="font-head font-black text-[15px] mt-2">${t}</div><div class="text-[11px] k-t4">${d}</div></button>`,
cols=['kb-cy-10 kc-cy','kb-rd-10 kc-rd','kb-gd-10 kc-gd','kb-gn-10 kc-gn','bw-10 k-hi'];
const fmtB=(k,v)=>v?(k=='rt'?v+' ms':k=='mm'?v+' '+R('ходов','moves'):v):'—';
const view=()=>{const g=G.g;
if(!g)return hd(R('Мини-игры','Mini-games'))+`<div class="grid grid-cols-2 gap-2.5">${H.map((x,i)=>tile(cols[i%5],x[2],x[3]+' · '+R('рекорд','best')+': '+fmtB(x[0],bst(x[0])),`gmOpen('${x[0]}')`,x[1])).join('')}${tile('kb-gd-10 kc-gd',R('Бравлер дня','Brawler of the day'),R('Одна попытка в день','Once a day'),"dgOpen()",'crown')}</div>`;
const q=G.q;
if(g=='hl'){if(!q)return back+`<p class="k-t4 text-sm">${R('Недостаточно данных для игры.','Not enough data.')}</p>`;
return back+stat('hl')+`<div class="g p-4 text-center"><div class="text-[11px] uppercase tracking-wider k-t5">${R('PPS известен','Known PPS')}</div><div class="font-head font-black text-xl mt-1">${esc(q.a[0])}</div><div class="font-head font-black text-4xl kc-cy">${q.a[1]}</div></div>
<div class="g p-4 text-center mt-2.5"><div class="font-head font-black text-xl">${esc(q.b[0])}</div><div class="font-head font-black text-4xl ${G.pick===null?'k-t5':G.ok?'kc-gn':'kc-rd'}">${G.pick===null?'?':q.b[1]}</div>
<div class="text-[12px] k-t4 mt-1">${R('PPS выше или ниже, чем у','PPS is higher or lower than')} ${esc(q.a[0])}?</div>${G.pick===null?`<div class="grid grid-cols-2 gap-2 mt-3"><button class="btn" onclick="hlGo(true)">▲ ${R('Выше','Higher')}</button><button class="btn k" onclick="hlGo(false)">▼ ${R('Ниже','Lower')}</button></div>`:''}</div>`+(G.over?again('hl',R('Не угадал!','Wrong!')):'')}
if(g=='tq'||g=='bq'){if(!q)return back+`<p class="k-t4 text-sm">${R('Недостаточно данных для игры.','Not enough data.')}</p>`;
return back+stat(g)+`<div class="g p-4"><div class="text-[11px] uppercase tracking-wider k-t5">${g=='tq'?R('Что за команда?','Which team?'):R('Что за бравлер?','Which brawler?')}</div><p class="text-[15px] mt-1.5 font-semibold">«${esc(q.clue)}»</p></div><div class="grid grid-cols-2 gap-2 mt-2.5">${q.o.map(o=>{const st=G.pick===null?'':o[0]==q.ans?'ko-gn kb-gn-15':o[0]==G.pick?'ko-rd kb-rd-15':'opacity-50';return`<button class="g r p-3 text-sm font-bold border ${st}" onclick="qzGo('${esc(String(o[0]))}')">${g=='bq'&&window.bIconN?`<span class="inline-flex items-center gap-2">${bIconN(o[0],28)}${esc(o[1])}</span>`:esc(o[1])}</button>`}).join('')}</div>`+(G.over?again(g,R('Мимо!','Missed!')):'')}
if(g=='rt'){const r=G.rt,m={idle:['kb-cy-15 ko-cy',R('Нажми, чтобы начать','Tap to start')],wait:['kb-rd-20 ko-rd',R('Жди зелёного…','Wait for green…')],go:['kb-gn-30 ko-gn',R('ЖМИ!','TAP!')],early:['kb-gd-15 ko-gd',R('Рано! Нажми, чтобы повторить','Too early! Tap to retry')],res:['kb-cy-15 ko-cy',(r.ms||0)+' ms · '+R('ещё раз?','again?')]}[r.st];
return back+`<div class="text-[12px] k-t4 mb-3">${R('Лучший результат','Best')}: ${fmtB('rt',bst('rt'))}</div><button class="w-full h-56 rounded-2xl border-2 font-head font-black text-2xl select-none ${m[0]}" onpointerdown="rtTap()">${m[1]}</button>`}
if(g=='mm'){const m=G.mm;return back+`<div class="text-[12px] k-t4 mb-3">${R('Ходов','Moves')}: <b class="k-hi">${m.m}</b> · ${R('рекорд','best')}: ${fmtB('mm',bst('mm'))}</div><div class="grid grid-cols-4 gap-2">${m.c.map((e,i)=>{const sh=m.o.includes(i)||m.d.includes(i);return`<button class="h-20 rounded-xl border text-3xl ${sh?'kb-cy-10 ko-cy-40':'g'} ${m.d.includes(i)?'opacity-60':''}" onclick="mmFlip(${i})">${sh?e:'?'}</button>`}).join('')}</div>`+(G.over?`<div class="g p-4 text-center mt-3"><div class="font-head font-black text-lg">${R('Все пары найдены!','All pairs found!')}</div><div class="text-[12px] k-t4 mt-1">${m.m} ${R('ходов','moves')}</div><button class="btn mt-3" onclick="gmOpen('mm')">${R('Ещё раз','Again')}</button></div>`:'')}
return''};
V.games=()=>view();
})();
