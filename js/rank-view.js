/* ===== Вкладка «Рейтинг» в стиле «Турниров» ===== */
(()=>{
try{XL.uk['стран']='країн';XL.kk['стран']='елдер';XL.uk['Рейтинг команд']=XL.uk['Рейтинг команд']||'Рейтинг команд';XL.kk['Рейтинг команд']=XL.kk['Рейтинг команд']||'Командалар рейтингі'}catch(e){}
const frm=x=>{const l=DB.matches.filter(m=>m.st=='fin'&&(m.a==x.id||m.b==x.id)).sort((a,b)=>new Date(b.when)-new Date(a.when)).slice(0,5).reverse();
 return l.length?`<span class="rk-f" aria-label="${R('Форма','Form')}">${l.map(m=>{const me=m.a==x.id?m.sa:m.sb,op=m.a==x.id?m.sb:m.sa;return`<i class="${me>op?'w':me<op?'l':'d'}"></i>`}).join('')}</span>`:''};
window.rlist=function(q){
 const all=sortedT(),rn=(S.rn||'').toLowerCase(),
  L0=all.filter(x=>has(q,x.name,x.country)&&(!rn||x.name.toLowerCase().includes(rn))&&(!S.rc||x.country==S.rc)),PG=pgOf(L0,'rp',30,[S.rn,S.rc,q]),l=PG.items;
 if(!l.length)return EMP.rank();
 const mx=Math.max(1,+(all[0]&&all[0].pps)||1),top=PG.page==1&&l.length>=3&&!rn?l.slice(0,3):[],rest=top.length?l.slice(3):l,
  col=['var(--tn-gd)','#C0C8D6','#CD7F32'],rk=x=>all.indexOf(x)+1,
  pod=top.length?`<div class="rk-pod">${[1,0,2].map(i=>{const x=top[i];
   return`<div class="rk-p ${i==0?'f':''} fd" style="--c:${col[i]};animation-delay:${i*80}ms" onclick="openT('${esc(x.id)}')"><span class="rk-pn">#${rk(x)}</span>${i==0?`<span class="rk-cr">${ic('crown')}</span>`:''}<div class="rk-pl">${lg(x,i?'h-11 w-11':'h-14 w-14')}</div><b class="rk-pt">${esc(x.name)}</b><div class="rk-pb">${fl(x.country)}${bdg(x)}</div><div class="rk-pp">${x.pps}<small>PPS</small></div><div class="rk-pw">${x.w}W · ${x.l}L</div></div>`}).join('')}</div>`:'';
 return pod+(rest.length?`<div class="rk-list">${rest.map((x,k)=>{const r=rk(x),w=Math.round(100*x.w/Math.max(1,x.w+x.l));
  return`<div class="rk-r fd" style="animation-delay:${Math.min(k,12)*35}ms" onclick="openT('${esc(x.id)}')"><span class="rk-i ${r<=3?'t'+r:''}">${r}</span>${lg(x,'h-9 w-9')}<div class="rk-m"><div class="rk-n"><b>${esc(x.name)}</b>${bdg(x)}${fl(x.country)}</div><div class="rk-s"><span>${x.w}W · ${x.l}L · ${w}%</span>${frm(x)}</div></div><div class="rk-v"><b>${x.pps}</b><i style="width:${Math.round(100*(+x.pps||0)/mx)}%"></i></div></div>`}).join('')}</div>`:'')+PG.bar};
V.rank=q=>{
 const T=DB.teams,cs=new Set(T.map(x=>x.country).filter(Boolean)).size,fm=DB.matches.filter(m=>m.st=='fin').length,
  kv=[[T.length,R('команд','teams')],[cs,R('стран','countries')],[fm,R('матчей','matches')]];
 return`<div class="tn-page"><h1 class="font-head font-black text-2xl uppercase tracking-wide mt-1">${t('rank')} <span class="kc-rd">/</span> <span class="k-t5 text-base">PPS</span></h1>`
 +`<div class="rk-act"><button class="btn" onclick="openReg('team')">${ic('plus')} ${S.me&&reg1('team')?R('Моя команда','My team'):R('Зарегистрировать команду','Register your team')}</button><button class="btn k" onclick="h2h('t')">${ic('swap')} ${R('Сравнить команды','Compare teams')}</button></div>`
 +sx('t')
 +`<section class="tn tn-up fd"><div class="tn-hero"><span class="tn-wm">${ic('cup')}</span><span class="tn-tag">PPS</span><h2 class="tn-name font-head">${R('Рейтинг команд','Team ranking')}</h2><div class="tn-kv">${kv.map(c=>`<div><b>${c[0]}</b><span>${c[1]}</span></div>`).join('')}</div></div><div id="rl" class="rk-body">${rlist(q)}</div></section></div>`};
const _vtc=V.team;V.team=function(){return'<div class="tcard tn-page">'+_vtc.apply(this,arguments)+'</div>'};
})();
