/* ===== v6: вкладка игроков ===== */
(()=>{
const col=['#FFD700','#C0C8D6','#CD7F32'];
window.bsMini=p=>{const tr=+p.bsTrophies>0,rk=p.bsRank?String(p.bsRank).replace(/[<>]/g,''):'';if(!tr&&!rk)return'';const sm=h=>h.replace(/class="[^"]*"/,'style="height:16px;width:auto;display:block"');return`<div class="flex items-center gap-2.5 mt-0.5 text-[11px] font-bold min-w-0">${tr?`<span class="flex items-center gap-1 shrink-0" style="color:#FFB020">${sm(BS_TROPHY_SVG)}${(+p.bsTrophies).toLocaleString('ru-RU')}</span>`:''}${rk?`<span class="flex items-center gap-1 min-w-0" style="color:${BS_RANK_CLR[rk.split(' ')[0]]||'#fff'}">${sm(bsRankImg(rk))}<span class="truncate">${esc(rk)}</span></span>`:''}</div>`};
window.PGS=window.PGS||{};
window.pgOf=(list,key,per,sig)=>{const g=PGS[key]||(PGS[key]={p:1,s:''}),sg=JSON.stringify(sig||[]);if(g.s!==sg){g.s=sg;g.p=1}const n=Math.max(1,Math.ceil(list.length/per));if(g.p>n)g.p=n;if(g.p<1)g.p=1;const a=(g.p-1)*per,items=list.slice(a,a+per);let bar='';
if(n>1){const pages=[];for(let i=1;i<=n;i++)if(i==1||i==n||Math.abs(i-g.p)<=1||(g.p<=3&&i<=4)||(g.p>=n-2&&i>=n-3))pages.push(i);
const btn=(i,t,on,dis)=>`<button type="button" ${dis?'disabled':''} class="min-w-9 h-9 px-2.5 rounded-lg border bd-10 text-sm font-bold ${on?'kb-cy k-on':'bw-05'} ${dis?'opacity-40':''}" onclick="pgGo('${key}',${i})">${t}</button>`;
let out='',prev=0;pages.forEach(i=>{if(prev&&i-prev>1)out+='<span class="k-t5 px-1">…</span>';out+=btn(i,i,i==g.p);prev=i});
bar=`<nav class="flex flex-wrap items-center justify-center gap-1.5 mt-4" aria-label="pages">${btn(g.p-1,'‹',false,g.p==1)}${out}${btn(g.p+1,'›',false,g.p==n)}</nav><div class="text-center text-[11px] k-t5 mt-1.5">${a+1}–${a+items.length} / ${list.length}</div>`}
return{items,bar,page:g.p,pages:n,start:a}};
window.pgGo=(key,i)=>{(PGS[key]||(PGS[key]={p:1,s:''})).p=i;render();scrollTo({top:0,behavior:'smooth'})};
window.plist=function(q){const K=['pps','kd','wr'][S.ps||0],mc=p=>+p.gp||DB.matches.filter(m=>m.st=='fin'&&(m.a==p.team||m.b==p.team)).length,rated=p=>(+p.pps>0)||mc(p)>0,
 all=[...DB.players].sort((a,b)=>(rated(b)-rated(a))||((+b[K]||0)-(+a[K]||0))),pn=(S.pn||'').toLowerCase(),
 L0=all.filter(p=>has(q,p.nick,p.country,tm(p.team).name)&&(!pn||p.nick.toLowerCase().includes(pn))&&(!S.pc||p.country==S.pc)&&(!S.pf||p.lfg)),PG=pgOf(L0,'pp',50,[S.pn,S.pc,S.pf,S.ps,q]),l=PG.items;
 if(!l.length)return EMP.players();
 const mx={pps:DB.players.reduce((m,p)=>Math.max(m,+p.pps||0),1),kd:DB.players.reduce((m,p)=>Math.max(m,+p.kd||0),1),wr:100},
 pic=(p,c)=>p.img?av(p,'h-full w-full'):av(p,c||'h-full'),
 V=(p,k)=>rated(p)?(k=='pps'?p.pps:k=='kd'?p.kd:(p.wr??0)+'%'):'—';
const COL3=['#FFD700','#C0C8D6','#CD7F32'],LV=(S.pv||'l')=='l',top=(LV&&PG.page==1&&!pn&&!S.pc&&!S.pf&&!q&&l.length>=3&&rated(l[0])&&rated(l[1])&&rated(l[2]))?l.slice(0,3):[],rest=top.length?l.slice(3):l;
if(LV){const pd=top.length?`<div class="rk-pod">${[1,0,2].map(i=>{const p=top[i],tt=tm(p.team),r=all.indexOf(p);return`<div class="rk-p ${i==0?'f':''} fd" style="--c:${COL3[i]};animation-delay:${i*80}ms" onclick="openP('${esc(p.id)}')"><span class="rk-pn">#${r+1}</span>${i==0?`<span class="rk-cr">${ic('crown')}</span>`:''}<div class="rk-pl"><div class="dk overflow-hidden rounded-lg flex justify-center ${i?'h-14 w-14':'h-16 w-16'}" style="background:linear-gradient(160deg,hsl(${pHue(p)} 70% 30%),#0b0f16)">${pic(p)}</div></div><b class="rk-pt">${esc(p.nick)}</b><div class="rk-pb">${fl(p.country)}${bdg(p)}</div><div class="rk-pp">${V(p,K)}<small>${['PPS','K/D','WR'][S.ps||0]}</small></div><div class="rk-pw">${esc(tt.name)}</div></div>`}).join('')}</div>`:'';
return`<div class="tn-page"><section class="tn tn-up"><div class="rk-body">${pd}${rest.length?`<div class="rk-list">${rest.map((p,i)=>{const r=all.indexOf(p),ok=rated(p),tt=tm(p.team);return`<div class="rk-r fd" style="animation-delay:${Math.min(i,12)*35}ms" onclick="openP('${esc(p.id)}')"><span class="rk-i ${ok&&r<3?'t'+(r+1):''}">${ok?r+1:'?'}</span><div class="dk h-9 w-9 rounded-lg overflow-hidden shrink-0 flex justify-center" style="background:linear-gradient(160deg,hsl(${pHue(p)} 70% 30%),#0b0f16)">${pic(p)}</div><div class="rk-m"><div class="rk-n"><b>${esc(p.nick)}</b>${bdg(p)}${fl(p.country)}</div><div class="rk-s">${lg(tt,'h-3.5 w-3.5')}<span class="truncate">${esc(tt.name)}</span></div></div><div class="rk-v"><b>${V(p,K)}</b><i style="width:${ok?Math.min(100,Math.round(100*(+p[K]||0)/mx[K])):0}%"></i></div></div>`}).join('')}</div>`:''}<div class="px-3 pb-2">${PG.bar}</div></div></section></div>`}
 return`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">${l.map((p,i)=>{const h=pHue(p),tt=tm(p.team),r=all.indexOf(p),ok=rated(p),c=ok&&r<3?col[r]:null;
 const st=[['PPS','pps',p.pps],['K/D','kd',p.kd],['WR','wr',(p.wr??0)+'%']].map(([a,k,v],j)=>{const on=(S.ps||0)==j;return`<div class="px-1 ${on?'kc-cy':''}"><b class="font-head text-[13px]">${ok?(v??'—'):'—'}</b><div class="text-[9px] k-t5">${a}</div><div class="h-0.5 rounded-full bw-10 mt-0.5 overflow-hidden"><i class="block h-full rounded-full ${on?'kb-cy':'bw-30'}" style="width:${ok?Math.min(100,Math.round(100*(+p[k]||0)/mx[k])):0}%"></i></div></div>`}).join('');
 return`<div class="edge cursor-pointer transition active:scale-[.96] hover:brightness-125 fd min-w-0" style="animation-delay:${Math.min(i,12)*35}ms;${c?`background:linear-gradient(135deg,${c},rgba(255,255,255,.07) 45%,${c}aa)`:''}" onclick="openP('${esc(p.id)}')"><div class="cut kb-s2"><div class="relative aspect-[4/5] overflow-hidden" style="background:radial-gradient(circle at 50% 100%,hsl(${h} 90% 50%/.5),transparent 70%),linear-gradient(170deg,hsl(${h} 70% 26%),#0b0f16)"><div class="absolute inset-0 flex justify-center">${pic(p)}</div><span class="absolute top-0 left-0 font-head font-black text-[11px] px-2 py-0.5 rounded-br-lg ${c?'text-black':'kb-rd k-on'}" style="${c?`background:${c}`:''}">${ok?(r==0?ic('crown','fl !w-3 !h-3 inline -mt-0.5')+' ':'')+'#'+(r+1):'—'}</span><span class="absolute top-1.5 right-4 flex">${fl(p.country)}</span><div class="absolute inset-x-0 bottom-0 pt-8 px-2 pb-1.5 bg-gradient-to-t kgf-s2 kgv-s2-80 to-transparent"><b class="block truncate font-head font-extrabold text-[15px] leading-tight">${esc(p.nick)}</b><div class="flex flex-wrap gap-1 my-0.5">${bdg(p)}</div><div class="flex items-center gap-1 text-[11px] k-t4 min-w-0">${lg(tt,'h-3.5 w-3.5')}<span class="truncate">${esc(tt.name)}</span></div>${bsMini(p)}</div></div><div class="grid grid-cols-3 text-center py-1.5 border-t bd-10">${st}</div></div></div>`}).join('')}</div>${PG.bar}`};
V.players=q=>{const k=S.ps||0,lf=DB.players.filter(p=>p.lfg).length,vb=(m,i)=>`<button type="button" class="px-2.5 py-1.5 ${(S.pv||'l')==m?'kc-cy':'k-t4'}" aria-pressed="${(S.pv||'l')==m}" onclick="S.pv='${m}';render()">${i}</button>`;
 return`<div class="flex items-center gap-2 mt-1 mb-2 flex-wrap min-w-0"><h1 class="font-head font-black text-2xl uppercase tracking-wide">${t('players')} <span class="kc-rd">/</span> <span class="k-t5 text-base">${DB.players.length}</span></h1><div class="pl-bar w-full sm:w-auto sm:ml-auto flex items-center gap-2 min-w-0"><div class="inline-flex shrink-0 rounded-lg bw-05 border bd-10 text-sm font-bold overflow-hidden" role="group">${vb('g','▦')}${vb('l','☰')}</div><button class="btn !py-1.5 !px-2 text-xs flex-1 sm:flex-none min-w-0 whitespace-nowrap justify-center" onclick="openReg('player')">${ic('plus')} ${S.me&&reg1('player')?R('Мой профиль','My profile'):R('Регистрация','Register')}</button><button class="btn k !py-1.5 !px-2 text-xs flex-1 sm:flex-none min-w-0 whitespace-nowrap justify-center" onclick="go('lfg')">${ic('search')} ${R('Поиск команды','Find a team')}</button><button class="btn k !py-1.5 !px-2 text-xs flex-1 sm:flex-none min-w-0 whitespace-nowrap justify-center" onclick="h2h('p')">${ic('swap')} ${R('Сравнить','Compare')}</button></div></div>${sx('p',lf)}<div id="pl">${plist(q)}</div>`};

/* ===== поиск и фильтры: игроки / рейтинг ===== */
const sxF=P=>{const q=String(S.q||'').toLowerCase();if(P){const n=(S.pn||'').trim().toLowerCase(),l=DB.players.filter(p=>has(q,p.nick,p.country,tm(p.team).name)&&(!n||p.nick.toLowerCase().includes(n))&&(!S.pc||p.country==S.pc)&&(!S.pf||p.lfg));return[l.length,DB.players.length]}
 const n=(S.rn||'').trim().toLowerCase(),T=sortedT(),l=T.filter(x=>has(q,x.name,x.country)&&(!n||x.name.toLowerCase().includes(n))&&(!S.rc||x.country==S.rc));return[l.length,T.length]},
sxA=P=>P?!!((S.pn||'').trim()||S.pc||S.pf):!!((S.rn||'').trim()||S.rc);
window.sx=(kind,lf)=>{const P=kind=='p',nk=P?'pn':'rn',ck=P?'pc':'rc',val=S[nk]||'',cur=S[ck]||'',k=S.ps||0,[a,n]=sxF(P),m={};
 (P?DB.players:DB.teams).forEach(x=>{if(x.country)m[x.country]=(m[x.country]||0)+1});
 const cs=Object.keys(m).sort((x,y)=>String(cn(x)).localeCompare(String(cn(y)))),
 sel=`<div class="sx-c"><span class="sx-l" id="sxl-${kind}">${R('Страна','Country')}</span><button type="button" class="sxc-btn" data-ck="${ck}" data-kind="${kind}" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="sxl-${kind}" onclick="sxcOpen(this)">${sxcFlag(cur)}<span class="sxc-t">${esc(cur?cn(cur):t('allc'))}</span>${cur?`<span class="sxc-n">${m[cur]||0}</span>`:''}<svg class="ic sxc-ch" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`,
 seg=P?`<div class="sx-c"><span class="sx-l">${R('Сортировка','Sort by')}</span><div class="sx-seg" role="group">${['PPS','K/D','WR'].map((l,i)=>`<button type="button" class="${k==i?'on':''}" aria-pressed="${k==i}" onclick="S.ps=${i};render()">${l}</button>`).join('')}</div></div>`:'';
 return`<div class="sx${sxA(P)?' act':''}" role="search"><div class="sx-q${val?' has':''}"><input type="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(t(P?'ps':'rs'))}" placeholder="${esc(t(P?'ps':'rs'))}" value="${esc(val)}" oninput="S.${nk}=this.value;${P?'pl':'rl'}();sxUp(this,'${kind}')"><button type="button" class="sx-x" aria-label="${R('Очистить','Clear')}" onclick="sxClr(this,'${nk}','${kind}')">${ic('x')}</button><span class="sx-n" aria-live="polite">${a==n?n:a+' / '+n}</span></div><div class="sx-r${P?'':' one'}">${sel}${seg}</div>${P&&lf?`<button type="button" class="sx-sw" role="switch" aria-checked="${!!S.pf}" onclick="S.pf=!S.pf;render()"><i></i>${R('Только ищущие команду','Looking for a team only')}<b>${lf}</b></button>`:''}<div class="sx-ft"><span>${R('Фильтры включены','Filters applied')}</span><button type="button" onclick="sxReset('${kind}')">${R('Сбросить','Reset')}</button></div></div>`};
window.sxUp=(i,kind)=>{const P=kind=='p',b=i.closest('.sx'),[a,n]=sxF(P);i.parentNode.classList.toggle('has',!!i.value);b.querySelector('.sx-n').textContent=a==n?n:a+' / '+n;b.classList.toggle('act',sxA(P))};
window.sxClr=(btn,k,kind)=>{const i=btn.parentNode.querySelector('input');i.value='';S[k]='';(kind=='p'?pl:rl)();sxUp(i,kind);i.focus()};
window.sxReset=kind=>{if(kind=='p'){S.pn='';S.pc='';S.pf=false}else{S.rn='';S.rc=''}render()};

/* ===== country picker (флаги, поиск, клавиатура, bottom sheet на мобильных) ===== */
window.sxcFlag=c=>`<span class="sxc-f">${!c||String(c).toUpperCase()=='INT'?ic('globe'):fl(c)}</span>`;
(()=>{let pop=null,bd=null,btn=null;
const close=(focus)=>{if(!pop)return;pop.remove();bd.remove();document.removeEventListener('keydown',key,true);window.removeEventListener('resize',onR);window.removeEventListener('scroll',onR,true);btn&&btn.setAttribute('aria-expanded','false');focus&&btn&&btn.focus();pop=bd=null};
const onR=e=>{if(!pop||pop.classList.contains('sheet'))return;if(e&&e.target instanceof Node&&pop.contains(e.target))return;close()};
const key=e=>{if(!pop)return;
 if(e.key=='Escape'){e.preventDefault();e.stopPropagation();close(1);return}
 const os=[...pop.querySelectorAll('.sxc-o')];if(!os.length)return;
 let i=os.findIndex(o=>o.classList.contains('hl'));
 if(e.key=='ArrowDown'||e.key=='ArrowUp'){e.preventDefault();i=e.key=='ArrowDown'?(i+1)%os.length:(i<=0?os.length-1:i-1);os.forEach(o=>o.classList.remove('hl'));os[i].classList.add('hl');os[i].scrollIntoView({block:'nearest'})}
 else if(e.key=='Enter'&&i>=0&&document.activeElement!==btn){e.preventDefault();os[i].click()}};
window.sxcPick=(ck,v)=>{close();S[ck]=v;render()};
window.sxcOpen=b=>{if(pop&&btn===b)return close(1);close();
 const ck=b.dataset.ck,P=b.dataset.kind=='p',cur=S[ck]||'',m={};
 (P?DB.players:DB.teams).forEach(x=>{if(x.country)m[x.country]=(m[x.country]||0)+1});
 const cs=Object.keys(m).sort((x,y)=>String(cn(x)).localeCompare(String(cn(y)))),total=Object.values(m).reduce((a,c)=>a+c,0),
 opt=(c,name,n)=>`<button type="button" role="option" class="sxc-o${c==cur?' on':''}${c===''?' all':''}" aria-selected="${c==cur}" data-n="${esc(String(name).toLowerCase())}" data-c="${esc(c)}">${sxcFlag(c)}<span class="sxc-t">${esc(name)}</span><span class="sxc-n">${n}</span>${ic('check','sxc-ok')}</button>`,
 sheet=matchMedia('(max-width:640px)').matches;
 bd=document.createElement('div');bd.className='sxc-bd'+(sheet?' sheet':'');
 pop=document.createElement('div');pop.className='sxc-pop'+(sheet?' sheet':'');
 pop.innerHTML=(cs.length>6?`<div class="sxc-s">${ic('search')}<input type="text" autocomplete="off" spellcheck="false" placeholder="${esc(R('Найти страну','Find country'))}" aria-label="${esc(R('Найти страну','Find country'))}"></div>`:'')+`<div class="sxc-l" role="listbox">${opt('',t('allc'),total)}${cs.map(c=>opt(c,cn(c),m[c])).join('')}<div class="sxc-e" hidden>${esc(t('none'))}</div></div>`;
 document.body.append(bd,pop);btn=b;b.setAttribute('aria-expanded','true');
 if(!sheet){const r=b.closest('.sx-c').getBoundingClientRect(),w=Math.max(r.width,260),vh=innerHeight,vw=innerWidth;
  pop.style.width=w+'px';pop.style.left=Math.max(8,Math.min(r.left,vw-w-8))+'px';
  const h=pop.offsetHeight,below=vh-r.bottom-8,above=r.top-8;
  if(h>below&&above>below){pop.classList.add('up');pop.style.bottom=(vh-r.top+4)+'px';pop.style.maxHeight=Math.min(380,above)+'px'}
  else{pop.style.top=(r.bottom+4)+'px';pop.style.maxHeight=Math.min(380,below)+'px'}}
 bd.onclick=()=>close(1);
 pop.addEventListener('click',e=>{const o=e.target.closest('.sxc-o');if(o)sxcPick(ck,o.dataset.c)});
 pop.addEventListener('mousemove',e=>{const o=e.target.closest('.sxc-o');if(o)pop.querySelectorAll('.hl').forEach(x=>x.classList.remove('hl'))});
 const inp=pop.querySelector('input');
 if(inp)inp.addEventListener('input',()=>{const q=inp.value.trim().toLowerCase();let n=0;pop.querySelectorAll('.sxc-o').forEach(o=>{const ok=!q||o.dataset.n.includes(q);o.hidden=!ok;o.classList.remove('hl');if(ok)n++});pop.querySelector('.sxc-e').hidden=n>0;const f=pop.querySelector('.sxc-o:not([hidden])');if(q&&f)f.classList.add('hl')});
 document.addEventListener('keydown',key,true);window.addEventListener('resize',onR);window.addEventListener('scroll',onR,true);
 if(inp&&!sheet)inp.focus();else{const on=pop.querySelector('.sxc-o.on');on&&on.scrollIntoView({block:'center'});}
 const on=pop.querySelector('.sxc-o.on');if(on&&inp)on.scrollIntoView({block:'nearest'});
};})();

})();
