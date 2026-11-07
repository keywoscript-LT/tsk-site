/* ===== v18: хаб игр и колесо в стиле сайта; иконки бравлеров с CDN Brawlify ===== */
(()=>{
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}},ru=()=>S.lang=='ru',
slug=n=>String(n).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),ini=n=>{const w=String(n).split(/[\s.\-]+/).filter(Boolean);return(w.length>1?w[0][0]+w[1][0]:String(n).slice(0,2)).toUpperCase()};
/* id бравлеров в Brawlify CDN (cdn.brawlify.com/brawlers/borderless/<id>.png) */
const BR_LOCAL=window.BR_LOCAL||{},
ID={shelly:0,colt:1,bull:2,brock:3,spike:5,barley:6,'el-primo':10,mortis:11,crow:12,poco:13,piper:15,pam:16,frank:20,leon:23,max:32,edgar:43},
srcs=n=>{const k=slug(n),u=k in ID?`cdn.brawlify.com/brawlers/borderless/${16000000+ID[k]}.png`:null;return[BR_LOCAL[k],u&&'https://'+u,u&&`https://images.weserv.nl/?url=${encodeURIComponent(u)}&w=128&h=128&fit=cover`,`brawlers/${k}.png`].filter(Boolean)},src=n=>srcs(n)[0];
window.bErr=im=>{const l=srcs(im.dataset.n),i=(+im.dataset.i||0)+1;if(i<l.length){im.dataset.i=i;im.src=l[i]}else im.remove()};
window.bIcon=(b,s=40,c='rgba(255,255,255,.18)',sil)=>`<span style="position:relative;display:inline-grid;place-items:center;flex-shrink:0;border-radius:50%;overflow:hidden;width:${s}px;height:${s}px;font-weight:900;font-size:${s*.36}px;color:${sil?'transparent':'#cbd5e1'};background:#0b0f16;box-shadow:inset 0 0 0 1.5px ${c}">${ini(b[0])}<img src="${src(b[0])}" data-n="${esc(b[0])}" data-i="0" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;object-fit:cover${sil?';filter:brightness(0)':''}" onerror="bErr(this)"></span>`;
window.bIconN=(n,s,sil)=>bIcon([n],s,undefined,sil);
const CH=[['Выиграй матч, ни разу не умерев','Win a match without dying'],['Играй только вблизи','Stay close-range only'],['Не используй гаджет весь матч','No gadgets this match'],['Только атакуй — никакого кемпинга','Attack only, no camping'],['Первым возьми кристалл','Grab the first gem'],['Сыграй 3 матча подряд без пауз','Play 3 matches in a row'],['Помоги новичку в команде','Help a newcomer'],['Сыграй за бравлера, которого давно не брал','Play a brawler you haven’t used lately']];
/* ---------- колесо ---------- */
const W={on:false,th:0,spin:false,kick:0,res:ld('tsk_w_last',null),img:{},logo:null};
{const f=document.querySelector('link[rel=icon]');if(f){const i=new Image();i.onload=()=>{W.logo=i;draw()};i.src=f.href}}
const B=()=>window.BRL||[],pic=b=>{const k=slug(b[0]);if(!(k in W.img)){W.img[k]=null;const l=srcs(b[0]);let n=0;const i=new Image(),go=()=>{if(n<l.length)i.src=l[n++];else W.img[k]=false};i.onload=()=>{W.img[k]=i;draw()};i.onerror=go;go()}return W.img[k]};
function draw(){const c=document.getElementById('whl');if(!c)return;const L=B(),n=L.length;if(!n)return;const a=2*Math.PI/n,d=devicePixelRatio||1,g=c.getContext('2d'),R=154,r0=42;c.width=c.height=360*d;g.scale(d,d);g.translate(180,188);
const win=!W.spin&&W.res?W.res.b:-1,wedge=i=>{g.beginPath();g.arc(0,0,R,i*a,(i+1)*a);g.arc(0,0,r0,(i+1)*a,i*a,true);g.closePath()};
g.save();g.rotate(W.th);
L.forEach((b,i)=>{wedge(i);g.fillStyle=i%2?'#111826':'#0b0f16';g.fill();g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=1;g.stroke();
g.save();g.rotate((i+.5)*a);g.translate(100,0);g.rotate(Math.PI/2);g.beginPath();g.arc(0,0,20,0,7);g.fillStyle='#0b0f16';g.fill();g.save();g.clip();const im=pic(b);
if(im)g.drawImage(im,-20,-20,40,40);else{g.fillStyle='#8d99ae';g.font='800 14px Montserrat,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(ini(b[0]),0,1)}g.restore();g.beginPath();g.arc(0,0,20,0,7);g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=1.5;g.stroke();g.restore();
if(win>=0&&win!=i){wedge(i);g.fillStyle='rgba(7,9,14,.6)';g.fill()}});
if(win>=0){wedge(win);g.fillStyle='rgba(255,215,0,.08)';g.fill();g.strokeStyle='#FFD700';g.lineWidth=2;g.stroke()}g.restore();
g.beginPath();g.arc(0,0,R+4,0,7);g.strokeStyle='rgba(0,240,255,.55)';g.lineWidth=2;g.stroke();
g.beginPath();g.arc(0,0,r0,0,7);g.fillStyle='#0b0f16';g.fill();g.strokeStyle='rgba(0,240,255,.55)';g.lineWidth=2;g.stroke();
if(W.logo){const w=38,h=w*W.logo.height/W.logo.width;g.drawImage(W.logo,-w/2,-h/2,w,h)}
g.save();g.translate(0,-R-8);g.rotate(-W.kick*.4);g.beginPath();g.moveTo(0,20);g.lineTo(-11,-6);g.lineTo(11,-6);g.closePath();g.fillStyle='#FF2E63';g.fill();g.restore()}
const tick=()=>{try{const x=W.ac||(W.ac=new(window.AudioContext||window.webkitAudioContext)()),o=x.createOscillator(),v=x.createGain();o.type='square';o.frequency.value=1100;v.gain.value=.01;o.connect(v);v.connect(x.destination);o.start();o.stop(x.currentTime+.018)}catch{}};
window.whSpin=()=>{if(W.spin)return;const L=B(),n=L.length;if(!n)return;W.spin=true;W.res=null;render(true);const a=2*Math.PI/n,k=Math.floor(Math.random()*n),tg=-Math.PI/2-(k+.5)*a+(Math.random()-.5)*a*.6,th0=W.th,
dl=((tg-th0)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)+2*Math.PI*(6+Math.floor(Math.random()*3)),T=5600,t0=performance.now();let last=-1;
const step=t=>{const p=Math.min(1,(t-t0)/T);W.th=th0+dl*(1-Math.pow(1-p,4.2));const idx=Math.floor((((-Math.PI/2-W.th)%(2*Math.PI))+2*Math.PI)%(2*Math.PI)/a);if(idx!=last){last=idx;W.kick=1;tick();try{navigator.vibrate&&navigator.vibrate(8)}catch{}}W.kick*=.86;draw();
if(p<1&&document.getElementById('whl'))requestAnimationFrame(step);else{W.spin=false;W.kick=0;W.res={b:k,c:Math.floor(Math.random()*CH.length)};sv('tsk_w_last',W.res);if(S.tab=='games'&&W.on)render(true)}};requestAnimationFrame(step)};
const DI={};srcs('Shelly').forEach((u,i)=>{const m=new Image();m.onload=()=>{DI[i]=1;dgn()};m.onerror=()=>{DI[i]=0;dgn()};m.src=u});
function dgn(){if(S.tab=='games'&&!document.getElementById('m').innerHTML&&Object.keys(DI).length==3)render(true)}
const dgS=()=>`<p class="text-[10px] k-t5 mt-3">${R('Иконки','Icons')}: CDN ${DI[0]===1?'✔':DI[0]===0?'✖':'…'} · ${R('прокси','proxy')} ${DI[1]===1?'✔':DI[1]===0?'✖':'…'} · ${R('файлы','files')} ${DI[2]===1?'✔':DI[2]===0?'✖':'…'}</p>`;
const H1=(t,n)=>`<h1 class="font-head font-black text-2xl uppercase tracking-wide mt-1 mb-3">${t} <span class="kc-rd">/</span> <span class="k-t5 text-base">${n}</span></h1>`,
back=`<button class="btn k !py-1.5 !px-3 text-xs mb-3" onclick="gmBack()">← ${R('Все игры','All games')}</button>`;
const wview=()=>{const L=B(),r=W.res,b=r&&L[r.b];
return back+H1(R('Колесо судьбы','Wheel of fate'),L.length)+`<div class="g p-4 fd"><div class="relative mx-auto" style="width:min(340px,100%);aspect-ratio:1"><canvas id="whl" style="width:100%;height:100%"></canvas></div>
<div class="text-center mt-2"><button class="btn ${W.spin?'k opacity-60':''}" onclick="whSpin()" ${W.spin?'disabled':''}>${W.spin?R('Крутится…','Spinning…'):b?R('Ещё раз','Again'):R('Крутить колесо','Spin the wheel')}</button></div></div>`
+(b&&!W.spin?`<div class="g mt-3 overflow-hidden fd"><div class="mx-4 mt-4 mb-3 flex items-center gap-3 rounded-xl border ko-gd-40 kb-gd-10 px-3 py-2.5">${bIcon(b,48,'rgba(255,215,0,.6)')}<div class="min-w-0 flex-1"><div class="text-[10px] uppercase tracking-[.2em] kc-gd">${R('Выпало','You got')}</div><b class="block truncate text-base">${esc(ru()?b[1]:b[0])}</b></div><span class="kc-gd shrink-0">${ic('cup','!w-7 !h-7')}</span></div><div class="border-t bd-10 px-4 py-3"><div class="text-[10px] uppercase tracking-wider k-t5">${R('Челлендж','Challenge')}</div><div class="text-[14px] font-semibold mt-1">${esc(CH[r.c][ru()?0:1])}</div></div></div>`:'')+`<p class="text-[10px] k-t5 mt-3">Brawl Stars © Supercell.</p>`+dgS()};
/* ---------- хаб игр ---------- */
const bv=(p,k)=>ld(p+'b_'+k,0),dg=ld('tsk_x_dg',{streak:0,best:0}),
fm=(k,v)=>!v?'—':k=='rt'?v+' ms':k=='mm'?v+' '+R('ходов','moves'):v,
GM=[['hl','tsk_g_','rank',R('Выше или ниже','Higher or lower'),R('Чей PPS больше?','Whose PPS is higher?'),'brain',R('до ошибки','until a miss'),'gmOpen'],
['tq','tsk_g_','players',R('Угадай команду','Guess the team'),R('По статистике','By the stats'),'brain',R('до ошибки','until a miss'),'gmOpen'],
['bq','tsk_g_','target',R('Бравлер-квиз','Brawler quiz'),R('По описанию, 4 варианта','By description'),'brain',R('до ошибки','until a miss'),'gmOpen'],
['tf','tsk_h_','cup',R('Правда или ложь','True or false'),R('По статистике команд','Team stats'),'brain',R('до ошибки','until a miss'),'xOpen'],
['mt','tsk_h_','star',R('Быстрый счёт','Quick math'),R('Примеры на скорость','Speed arithmetic'),'brain',R('30 секунд','30 seconds'),'xOpen'],
['rt','tsk_g_','fire',R('Реакция','Reaction'),R('Жми, когда позеленеет','Tap on green'),'reflex',R('1 попытка','1 try'),'gmOpen'],
['wh','tsk_h_','bolt',R('Лови бравлера','Whack-a-brawler'),R('20 секунд, жми быстрее','20 seconds'),'reflex',R('20 секунд','20 seconds'),'xOpen'],
['mm','tsk_g_','matches',R('Мемори','Memory'),R('Найди все пары','Match the pairs'),'reflex',R('1 партия','1 round'),'gmOpen'],
['ttt','tsk_h_','swap',R('Крестики-нолики','Tic-tac-toe'),R('Против бота','Vs bot'),'fun',R('1 партия','1 round'),'xOpen'],
['wf','','crown',R('Колесо судьбы','Wheel of fate'),R('Бравлер и челлендж','Brawler and challenge'),'fun',R('Раз в день','Once a day'),'xOpen'],
['dg','','target',R('Бравлер дня','Brawler of the day'),R('Угадай бравлера по описанию','Guess the brawler by its hint'),'fun',R('Раз в день','Once a day'),'dgOpen']],
CT={brain:['#00F0FF',R('Викторины','Quizzes')],reflex:['#FF2E63',R('Реакция','Reflex')],fun:['#FFD700',R('Удача','Luck')]};
const cell=(v,l,first)=>`<div class="flex-1 min-w-0 px-4 py-2.5 ${first?'':'border-l bd-10'}"><div class="font-head font-black text-lg leading-none truncate">${v}</div><div class="text-[10px] uppercase tracking-wider k-t5 mt-1">${l}</div></div>`,
gcard=x=>{const[k,p,i,t,d,c,m,f]=x,col=CT[c][0],rec=k=='dg'?dg.best:k=='wf'?'—':bv(p,k),act=`${f}('${k}')`;
return`<div class="pg-card hov gm fd" style="--c:${col}" onclick="${act}"><div class="gm-top"><span class="gm-ic">${ic(i,'!w-6 !h-6')}</span><div class="min-w-0 flex-1"><b class="gm-t">${t}</b><div class="gm-d">${d}</div></div><span class="pg-tag" style="--c:${col};--onc:${c=='reflex'?'#fff':'#07090E'}">${CT[c][1]}</span></div><div class="gm-ft">${cell(fm(k,rec),R('Рекорд','Best'),1)}${cell(m,R('Режим','Mode'))}</div></div>`},
sb=(on,a,l,n)=>segBtn(on,a,l,n);
const hub=()=>{const f=S.gf||'all',sh=GM.filter(x=>f=='all'||x[5]==f),n=c=>GM.filter(x=>x[5]==c).length;
return H1(t('games'),GM.length)+`<div class="hs mb-3">${sb(f=='all',"S.gf='all';render()",R('Все','All'),GM.length)}${sb(f=='brain',"S.gf='brain';render()",CT.brain[1],n('brain'))}${sb(f=='reflex',"S.gf='reflex';render()",CT.reflex[1],n('reflex'))}${sb(f=='fun',"S.gf='fun';render()",CT.fun[1],n('fun'))}</div><div class="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 gap-3.5">${sh.map(gcard).join('')}</div>`+dgS()};
const _xo=window.xOpen,_gb=window.gmBack,_go=window.gmOpen,DGV={on:false};
window.dgOpen=()=>{DGV.on=true;W.on=false;render(true);scrollTo({top:0})};
window.xOpen=k=>{DGV.on=false;if(k=='wf'){W.on=true;render(true);scrollTo({top:0});return}W.on=false;_xo(k)};
window.gmBack=()=>{W.on=false;DGV.on=false;_gb()};window.gmOpen=k=>{W.on=false;DGV.on=false;_go(k)};
const _gg=window.go;window.go=k=>{DGV.on=false;_gg(k)};
const _vg=V.games;V.games=()=>{if(DGV.on&&window.dgCard)return back+window.dgCard()+(window.dgSolved?window.dgSolved():'');if(W.on){setTimeout(draw,0);return wview()}const h=_vg();return h.includes('gmBack()')?h:hub()};
})();
