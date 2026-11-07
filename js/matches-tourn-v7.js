/* ===== v7: вкладки «Матчи» и «Турниры» ===== */
(()=>{
const grp=(l,fn)=>{const g=[];l.forEach(m=>{const d=dayLabel(m.when),a=g[g.length-1];a&&a.d==d?a.l.push(m):g.push({d,l:[m]})});
 return g.map(x=>`<div class="md:col-span-2 sticky top-[56px] z-10 -mx-3 px-3 py-1.5 kb-s0-90 backdrop-blur text-[11px] uppercase tracking-[.14em] k-t4 flex justify-between"><span>${x.d}</span><span class="k-t5">${x.l.length}</span></div>`+x.l.map(fn).join('')).join('')};
const empty=(e,m,act)=>`<div class="g p-6 text-center fd"><div class="text-4xl kc-cy-60 grid place-items-center">${ic(e,e=='cup'?'!w-20 !h-20':'')}</div><p class="k-t4 text-sm mt-2">${m}</p>${act||''}</div>`;
V.matches=q=>{const f=S.mt||'all',fv=favs(),all=DB.matches.filter(m=>has(q,tm(m.a).name,tm(m.b).name)&&(!S.mf||fv.includes(m.a)||fv.includes(m.b))),
 by=k=>all.filter(m=>m.st==k).sort((a,b)=>k=='fin'?new Date(b.when)-new Date(a.when):new Date(a.when)-new Date(b.when)),Lv=by('live'),U=by('up'),F=by('fin'),sh=k=>f=='all'||f==k,
 fb=(on,js,lab,n,dot)=>`<button class="${on?'on':''}" onclick="${js}">${dot?'<i class="tn-dot"></i>':''}${lab}${n==null?'':'<em>'+n+'</em>'}</button>`,
 day=(l,fn)=>{let last='',o='';l.forEach(m=>{const d=dayLabel(m.when);if(d!=last){o+=`<div class="mx-day">${d}</div>`;last=d}o+=fn(m)});return o},
 blk=(cls,ico,tag,n,inner,dot)=>`<section class="tn ${cls} fd"><div class="tn-hero mx-hero"><span class="tn-wm">${ic(ico)}</span><span class="tn-tag">${dot?'<i class="tn-dot"></i>':''}${tag}</span><div class="tn-kv"><div><b>${n}</b><span>${R('матчей','matches')}</span></div></div></div><div class="mx-body"><div class="mx-grid">${inner}</div></div></section>`;
 const body=(sh('live')&&Lv.length?blk('tn-live','bolt','LIVE',Lv.length,Lv.map(m=>`<div class="min-w-0 mx-live">${liveCard(m)}</div>`).join(''),1):'')
 +(sh('up')&&U.length?blk('tn-up','cal',t('up'),U.length,day(U,upCard)):'')
 +(sh('fin')&&F.length?blk('tn-fin','rank',t('fin'),F.length,day(F,finCard)):'');
 const em=f=='live'?['bolt',R('Сейчас нет матчей в эфире','No live matches right now')]:f=='up'?['cal',R('Скоро матчей нет','Nothing scheduled yet')]:f=='fin'?['rank',R('Результатов пока нет','No results yet')]:['matches',S.mf?R('У избранных команд нет матчей','No matches for your favorites'):t('none')];
 return`<div class="tn-page mx-pg"><h1 class="font-head font-black text-2xl uppercase tracking-wide mt-1">${t('matches')} <span class="kc-rd">/</span> <span class="k-t5 text-base">${all.length}</span></h1>`
 +`<div class="tn-flt">${fb(f=='all',"S.mt='all';render()",R('Все','All'),all.length)}${fb(f=='live',"S.mt='live';render()",'LIVE',Lv.length,Lv.length)}${fb(f=='up',"S.mt='up';render()",R('Скоро','Soon'),U.length)}${fb(f=='fin',"S.mt='fin';render()",R('Итоги','Results'),F.length)}${fv.length?fb(!!S.mf,"S.mf=!S.mf;render()",ic('star')+' '+R('Избранные','Favorites')):''}</div>`
 +(body||EMP.matches(f,!!S.mf,DB.matches.length))+`</div>`};
V.tourn=q=>{const f=S.tf||'all',l=DB.tourn.filter(x=>has(q,x.name)),ord={live:0,up:1,fin:2},n=k=>l.filter(x=>tsK(x.status)==k).length,
 sh=l.filter(x=>f=='all'||tsK(x.status)==f).sort((a,b)=>ord[tsK(a.status)]-ord[tsK(b.status)]);
 return`<h1 class="font-head font-black text-2xl uppercase tracking-wide mt-1">${t('tourn')} <span class="kc-rd">/</span> <span class="k-t5 text-base">${l.length}</span></h1>`
 +(l.length>1?`<div class="hs mt-2">${segBtn(f=='all',"S.tf='all';render()",R('Все','All'),l.length)}${segBtn(f=='live',"S.tf='live';render()",'LIVE',n('live'),n('live'))}${segBtn(f=='up',"S.tf='up';render()",R('Скоро','Soon'),n('up'))}${segBtn(f=='fin',"S.tf='fin';render()",R('Завершённые','Finished'),n('fin'))}</div>`:'')
 +(sh.map(tCard).join('')||EMP.tourn(S.tf||'all',DB.tourn.length))};
})();
