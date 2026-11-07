(()=>{
/* ---------- переводы новых строк ---------- */
try{
 Object.assign(XL.uk,{'Следующий матч':'Наступний матч','Далее':'Далі','Матч за 3-е место':'Матч за 3-є місце','Полуфинал':'Півфінал','Четвертьфинал':'Чвертьфінал','1/8 финала':'1/8 фіналу','1/16 финала':'1/16 фіналу','Финал':'Фінал','Плей-офф':'Плей-оф','Сетка плей-офф':'Сітка плей-оф','Открыть':'Відкрити','Закрыть':'Закрити'});
 Object.assign(XL.kk,{'Следующий матч':'Келесі матч','Далее':'Келесі','Матч за 3-е место':'3-орын үшін матч','Полуфинал':'Жартылай финал','Четвертьфинал':'Ширек финал','1/8 финала':'1/8 финал','1/16 финала':'1/16 финал','Финал':'Финал','Плей-офф':'Плей-офф','Сетка плей-офф':'Плей-офф торы','Открыть':'Ашу','Закрыть':'Жабу'});
}catch(e){}

/* ---------- помощники ---------- */
const sc=s=>{const m=String(s==null?'':s).match(/(\d+)\D+(\d+)/);return m?[+m[1],+m[2]]:null};
const kind=r=>{const s=String(r||'');
 if(/third|3rd|бронз|3[\s-]*(е|й|го)?\s*мест|за\s*3/i.test(s))return{k:'3',w:90};
 if(/semi|полуфин|півфін|1\/2/i.test(s))return{k:'sf',w:60};
 if(/quarter|четверт|чвертьф|1\/4/i.test(s))return{k:'qf',w:50};
 if(/1\/16|round of 32|last 32/i.test(s))return{k:'r32',w:30};
 if(/1\/8|round of 16|last 16/i.test(s))return{k:'r16',w:40};
 if(/^\s*(grand\s*)?(final|финал|фінал)\s*$/i.test(s))return{k:'f',w:80};
 return{k:'',w:null}};
const rlab=r=>{const k=kind(r).k;
 return k=='3'?R('Матч за 3-е место','Third place'):k=='sf'?R('Полуфинал','Semifinal'):k=='qf'?R('Четвертьфинал','Quarterfinal'):k=='r32'?R('1/16 финала','Round of 32'):k=='r16'?R('1/8 финала','Round of 16'):k=='f'?R('Финал','Final'):String(r||'')};
const split=po=>{const rs=[];po.forEach(y=>{let g=rs.find(z=>z.r==y.r);if(!g)rs.push(g={r:y.r,m:[]});g.m.push(y)});
 let third=rs.filter(g=>kind(g.r).k=='3'),main=rs.filter(g=>kind(g.r).k!='3');
 if(!main.length){main=third;third=[]}
 if(main.length>1&&main.every(g=>kind(g.r).w!=null))main.sort((a,b)=>kind(a.r).w-kind(b.r).w);
 return{main,third}};
const oc=T=>T?`onclick="openT('${esc(String(T.id))}')"`:'';

/* ---------- матч в сетке ---------- */
const row=(n,v,st,extra)=>{const tt=tnm(n);
 return`<div class="bk-t ${st}" data-tn="${esc(n)}" ${oc(tt)}>${lg(tt||{name:n},'h-5 w-5')}<span class="n">${esc(n)}</span>${extra||''}<b class="sc">${v}</b></div>`};
const mt=(y,o)=>{const p=sc(y.s),wa=p&&p[0]>p[1],wb=p&&p[1]>p[0],cup=`<span class="tr">${ic('cup')}</span>`;
 return`<div class="bk-m ${o.nx?'nx':''} ${o.f?'fin':''} ${o.li?'li':''}">${o.nx?`<i class="bk-tag">${R('Далее','Next')}</i>`:''}${row(y.a,p?p[0]:'–',wa?'w':wb?'l':'',wa&&o.f?cup:'')}${row(y.b,p?p[1]:'–',wb?'w':wa?'l':'',wb&&o.f?cup:'')}</div>`};

/* ---------- сетка ---------- */
const bracket=(id,po,nx)=>{
 const{main,third}=split(po),n=main.length,cnt=main.map(g=>g.m.length);
 if(!n)return`<p class="tn-empty">${t('none')}</p>`;
 const act=main.findIndex(g=>g.m.some(y=>!sc(y.s))),foc=act<0?n-1:act;
 const cols=main.map((g,i)=>{
  const pr=i<n-1&&cnt[i]==2*cnt[i+1],li=i>0&&cnt[i-1]==2*cnt[i],
   fin=i==n-1&&(kind(g.r).k=='f'||(n>1&&cnt[i]==1)),
   done=g.m.filter(y=>sc(y.s)).length;
  return`<div class="bk-col" data-i="${i}"><div class="bk-h ${i==act?'act':''} ${fin?'fin':''}"><span><b>${fin?ic('cup'):''}${esc(rlab(g.r))}</b><em>${done}/${g.m.length}</em></span></div><div class="bk-b">${g.m.map((y,k)=>`<div class="bk-s ${pr?'c '+(k%2?'d':'u'):''} ${pr&&sc(y.s)?'dn':''}">${mt(y,{nx:y===nx,f:fin,li})}</div>`).join('')}</div></div>`}).join('');
 const t3=third.flatMap(g=>g.m),
  thirdHtml=t3.length?`<div class="bk-3"><div class="bk-h"><span><b>${esc(rlab(third[0].r))}</b></span></div>${t3.map(y=>`<div class="bk-s">${mt(y,{nx:y===nx})}</div>`).join('')}</div>`:'';
 return`<div class="bk-scroll" data-id="${esc(id)}" data-f="${foc}"><div class="bk" style="--n:${n}">${cols}${thirdHtml}</div></div>`};

/* ---------- группы ---------- */
const groups=gr=>{
 if(!gr.length)return`<p class="tn-empty">${t('none')}</p>`;
 const badge=g=>{const w=String(g.n||'').trim().split(/\s+/),l=w[w.length-1]||'?';return esc((l.length<=2?l:l[0]).toUpperCase())};
 return`<div class="tn-gg">${gr.map(g=>{const ts=g.teams||[];
  return`<div class="tn-g"><div class="tn-gh"><span class="tn-gl">${badge(g)}</span><b>${esc(g.n)}</b><span class="k">PPS</span></div>${ts.map((n,k)=>{const tt=tnm(n),q=k<2,pps=tt&&tt.pps!==''&&tt.pps!=null&&isFinite(+tt.pps)?+(+tt.pps).toFixed(1):null;
   return`<div class="tn-gr ${q?'q':''}" ${oc(tt)}><span class="i">${k+1}</span>${lg(tt||{name:n},'h-6 w-6')}<span class="n">${esc(n)}</span>${q?'<span class="po">PO</span>':''}${pps!=null?`<span class="r">${pps}</span>`:''}</div>`}).join('')}</div>`}).join('')}</div><div class="tn-leg"><b>PO</b> — ${R('выходят в плей-офф','advance to playoffs')}</div>`};

/* ---------- данные турнира ---------- */
const info=x=>{const sk=tsK(x.status),po=x.po||[],gr=x.groups||[],{main}=split(po),played=po.filter(y=>sc(y.s)).length;
 let cw=x.winner&&DB.teams.find(z=>z.id==x.winner)||null;
 if(!cw&&main.length){const lm=main[main.length-1];
  if(lm.m.length==1&&(main.length>1||kind(lm.r).k=='f')){const p=sc(lm.m[0].s);if(p&&p[0]!=p[1]){const nm=p[0]>p[1]?lm.m[0].a:lm.m[0].b;cw=tnm(nm)||{name:nm}}}}
 let nx=null;
 if(sk!='fin'&&!cw)for(const g of main){nx=g.m.find(y=>!sc(y.s));if(nx)break}
 return{sk,po,gr,main,played,cw,nx}};
const tagOf=sk=>sk=='live'?`<span class="tn-tag"><i class="tn-dot"></i>LIVE</span>`:sk=='fin'?`<span class="tn-tag">${R('Завершён','Finished')}</span>`:`<span class="tn-tag">${R('Скоро','Upcoming')}</span>`;
const champOf=cw=>`<div class="tn-champ" ${oc(cw.id?cw:null)}>${lg(cw,'h-10 w-10')}<div><small>${R('Победитель','Champion')}</small><b>${esc(cw.name)}</b></div>${ic('cup')}</div>`;

/* ---------- карточка турнира ---------- */
const card=(x,i,solo)=>{
 const{sk,po,gr,played,cw,nx}=info(x),id=String(x.id),
  names=new Set([...gr.flatMap(g=>g.teams||[]),...po.flatMap(y=>[y.a,y.b])].filter(Boolean)),
  op=(S.tx||{})[id]!=null?(S.tx||{})[id]:(solo||sk!='fin'),
  kv=[names.size?[names.size,R('команд','teams')]:null,gr.length?[gr.length,t('groups')]:null,po.length?[played+'/'+po.length,R('матчей','matches')]:null].filter(Boolean),
  stats=kv.length?`<div class="tn-kv">${kv.map(c=>`<div><b>${c[0]}</b><span>${c[1]}</span></div>`).join('')}</div>`:'',
  prog=po.length?`<div class="tn-pgh"><span>${t('po')}</span><b>${played}/${po.length}</b></div>`+(po.length<=24?`<div class="tn-pg">${po.map((y,k)=>`<i class="${k<played?'on':''}"></i>`).join('')}</div>`:`<div class="tn-pg bar"><i style="width:${Math.round(100*played/po.length)}%"></i></div>`):'',
  nextT=nx?(()=>{const A=tnm(nx.a),B=tnm(nx.b),a=`<div ${oc(A)}><span>${esc(nx.a)}</span>${lg(A||{name:nx.a},'h-8 w-8')}</div>`,b=`<div ${oc(B)}>${lg(B||{name:nx.b},'h-8 w-8')}<span>${esc(nx.b)}</span></div>`;
   return`<div class="tn-next"><div class="tn-nl"><small>${R('Следующий матч','Next match')}</small><b>${esc(rlab(nx.r))}</b></div><div class="tn-vs">${a}<em>VS</em>${b}</div></div>`})():'',
  bkBtn=po.length?`<button class="tn-bkb" onclick="tnOpen('${esc(id)}')"><span class="ib">${ic('tourn')}</span><span class="tx"><b>${R('Сетка плей-офф','Playoff bracket')}</b><small>${nx?esc(rlab(nx.r))+' · ':''}${played}/${po.length} ${R('матчей','matches')}</small></span><span class="go"><span>${R('Открыть','Open')}</span>${ic('ne')}</span></button>`:'',
  body=gr.length?`<div class="tn-body"><div class="tn-sec"><span>${t('groups')}</span></div>${groups(gr)}</div>`:'',
  tog=body?`<button class="tn-tg" onclick="(S.tx=S.tx||{})['${esc(id)}']=${!op};render()">${op?R('Свернуть','Collapse')+ic('up'):R('Подробнее','Details')+ic('dn')}</button>`:'';
 return`<section class="tn tn-${sk} fd" style="animation-delay:${Math.min(i,6)*70}ms"><div class="tn-hero"><span class="tn-wm">${ic('cup')}</span>${tagOf(sk)}<h2 class="tn-name font-head">${esc(x.name)}</h2>${stats}${prog}</div>${cw?champOf(cw):''}${nextT}${bkBtn}${window.tpBox?tpBox(x,sk):''}${op?body:''}${tog}</section>`};

/* ---------- окно с сеткой ---------- */
const paintOv=()=>{const ov=document.getElementById('tn-ov');if(!ov)return;
 const x=DB.tourn.find(z=>String(z.id)==window.__tnOv);if(!x){tnClose();return}
 const{sk,po,played,cw,nx}=info(x),old=ov.querySelector('.tn-ovb'),st=old?old.scrollTop:0;
 ov.className='tn-page tn-ov tn-'+sk;
 ov.innerHTML=`<div class="tn-ovh"><div class="tn-ovt">${tagOf(sk)}<h2 class="tn-ovn font-head">${esc(x.name)}</h2></div><div class="tn-ovp">${played}/${po.length}<small>${R('матчей','matches')}</small></div><button class="tn-ovx" aria-label="${R('Закрыть','Close')}" onclick="tnClose()">${ic('x')}</button></div><div class="tn-ovb">${cw?champOf(cw):''}${bracket(String(x.id),po,nx)}</div>`;
 const nb=ov.querySelector('.tn-ovb');if(nb)nb.scrollTop=st};
window.tnOpen=id=>{window.__tnOv=String(id);delete pos[String(id)];
 let ov=document.getElementById('tn-ov');
 if(!ov){ov=document.createElement('div');ov.id='tn-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');document.body.appendChild(ov);document.documentElement.style.overflow='hidden'}
 paintOv();fixScroll();const c=ov.querySelector('.tn-ovx');if(c)c.focus()};
window.tnClose=()=>{const ov=document.getElementById('tn-ov');if(ov)ov.remove();window.__tnOv=null;document.documentElement.style.overflow=''};
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&window.__tnOv)tnClose()});

/* ---------- вкладка ---------- */
V.tourn=q=>{
 const f=S.tf||'all',l=DB.tourn.filter(x=>has(q,x.name)),ord={live:0,up:1,fin:2},cn=k=>l.filter(x=>tsK(x.status)==k).length,
  sh=l.filter(x=>f=='all'||tsK(x.status)==f).sort((a,b)=>ord[tsK(a.status)]-ord[tsK(b.status)]),
  fb=(on,v,lab,n,dot)=>`<button class="${on?'on':''}" onclick="S.tf='${v}';render()">${dot?'<i class="tn-dot"></i>':''}${lab}<em>${n}</em></button>`;
 return`<div class="tn-page"><h1 class="font-head font-black text-2xl uppercase tracking-wide mt-1">${t('tourn')} <span class="kc-rd">/</span> <span class="k-t5 text-base">${l.length}</span></h1>`
 +(window.brkPromo?brkPromo():'')+(l.length>1?`<div class="tn-flt">${fb(f=='all','all',R('Все','All'),l.length)}${fb(f=='live','live','LIVE',cn('live'),cn('live'))}${fb(f=='up','up',R('Скоро','Soon'),cn('up'))}${fb(f=='fin','fin',R('Завершённые','Finished'),cn('fin'))}</div>`:'')
 +(sh.map((x,i)=>card(x,i,l.length==1)).join('')||EMP.tourn(f,DB.tourn.length))+`</div>`};

/* ---------- интерактив ---------- */
document.addEventListener('mouseover',e=>{const el=e.target.closest&&e.target.closest('.bk-t[data-tn]');if(!el)return;
 const n=el.dataset.tn;el.closest('.bk').querySelectorAll('.bk-t[data-tn]').forEach(z=>z.classList.toggle('hl',z.dataset.tn===n))});
document.addEventListener('mouseout',e=>{const el=e.target.closest&&e.target.closest('.bk-t[data-tn]');if(!el)return;
 el.closest('.bk').querySelectorAll('.bk-t.hl').forEach(z=>z.classList.remove('hl'))});
const pos=window.__tnPos=window.__tnPos||{};
document.addEventListener('scroll',e=>{const el=e.target;if(el&&el.classList&&el.classList.contains('bk-scroll'))pos[el.dataset.id]=el.scrollLeft},true);
const fixScroll=()=>document.querySelectorAll('.bk-scroll').forEach(el=>{
 const id=el.dataset.id;
 if(pos[id]!=null){el.scrollLeft=pos[id];return}
 const c=el.querySelector('.bk-col[data-i="'+el.dataset.f+'"]');
 if(c&&el.scrollWidth>el.clientWidth)el.scrollLeft=Math.max(0,c.offsetLeft-22)});
const _r=window.render;
window.render=function(){const r=_r.apply(this,arguments);try{if(window.__tnOv)paintOv();fixScroll()}catch(e){}return r};
const _o=window.openT;
if(typeof _o=='function')window.openT=function(){tnClose();return _o.apply(this,arguments)};
})();
