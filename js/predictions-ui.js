/* ===== v9: прогнозы — интерфейс (итоги матчей, победитель турнира, таблица прогнозистов) ===== */
(()=>{
const TP=window.TP={c:{},me:{},_s:'',ok:!sb},PL=window.PL={rows:[],ok:false,_s:'',_t:0};
if(!sb){try{const d=JSON.parse(localStorage.getItem('tsk_tpred')||'{}');TP.c=d.c||{};TP.me=d.me||{}}catch{}}
const dec=m=>{const a=+m.sa,b=+m.sb;return tsK(m.st)=='fin'&&a!=b?(a>b?'a':'b'):null},
hp=p=>{try{window.hap&&hap(p||[25])}catch{}},
chip=(ok,txt)=>`<span class="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-md ${ok?'kb-gd-15 kc-gd':'kb-rd-10 kc-rd'}">${ic(ok?'check':'x','!w-3 !h-3')}${txt}</span>`,
lock=t=>`<span class="inline-flex items-center gap-1">${ic('lock','!w-3 !h-3')}${t}</span>`;

/* ---------- матч ---------- */
window.predRes=m=>{const p=PRED.me[m.id],w=dec(m);if(!p||!w)return'';const ok=p==w,t=tm(p=='a'?m.a:m.b);return`<div class="mt-2 pt-2 border-t bd-10 flex items-center gap-2 text-[12px]"><span class="k-t5 uppercase tracking-wider text-[10px] shrink-0">${R('Твой выбор','Your pick')}</span>${lg(t,'h-5 w-5 shrink-0')}<b class="truncate">${esc(t.name)}</b><span class="ml-auto shrink-0">${chip(ok,ok?R('Угадал','Correct')+' +1':R('Не угадал','Wrong'))}</span></div>`};
window.predBox=m=>{const c=PRED.c[m.id]||{},mine=PRED.me[m.id],na=c.a||0,nb=c.b||0,n=na+nb,fin=tsK(m.st)=='fin',started=new Date(m.when)<=Date.now()||tsK(m.st)!='up',w=dec(m);
 if(fin&&!n&&!mine)return'';
 const showP=!!mine||started||fin,pa=n?Math.round(100*na/n):0,pb=n?100-pa:0,
 side=(k,x)=>{const sel=mine==k,win=w==k,wrong=w&&sel&&!win;return`<button class="relative flex items-center gap-2 min-w-0 rounded-xl border px-2.5 py-2 text-left transition active:scale-[.97] ${win?'ko-gd kb-gd-10':wrong?'ko-rd kb-rd-10':sel?'ko-cy kb-cy-10':'bd-10 hv-bw-04'} ${started&&!sel&&!win?'opacity-60':''}" ${started?'disabled':''} aria-pressed="${sel}" onclick="event.stopPropagation();vote('${esc(m.id)}','${k}')">${lg(x,'h-7 w-7 shrink-0')}<span class="min-w-0 flex-1"><b class="block truncate text-[12px] leading-tight">${esc(x.name)}</b>${n&&showP?`<span class="text-[10px] tabular-nums ${k=='a'?'kc-cy':'kc-pu'}">${k=='a'?pa:pb}%</span>`:''}</span>${win?`<span class="kc-gd shrink-0">${ic('crown','!w-4 !h-4')}</span>`:sel?`<span class="shrink-0 ${wrong?'kc-rd':'kc-cy'}">${ic(wrong?'x':'check','!w-4 !h-4')}</span>`:''}</button>`},
 st=fin&&mine&&w?chip(mine==w,mine==w?R('Угадал','Correct')+' +1':R('Не угадал','Wrong')):started&&!fin?lock(R('Приём закрыт','Closed')):n&&showP?n+' '+R('голосов','votes'):mine?R('Голос принят','Vote saved'):R('Выбери победителя — проценты увидишь после голоса','Pick the winner to see the split'),
 bar=n&&showP?`<div class="mt-2 flex h-1 rounded-full overflow-hidden bw-10"><i class="kb-cy" style="width:${pa}%"></i><i class="kb-pu" style="width:${pb}%"></i></div>`:'';
 return`<div class="mt-3 pt-3 border-t bd-10" onclick="event.stopPropagation()"><div class="flex items-center justify-between mb-2 text-[10px] uppercase tracking-[.14em] k-t5"><span class="flex items-center gap-1.5">${ic('target','!w-3.5 !h-3.5')}${R('Прогноз','Prediction')}</span><span class="normal-case tracking-normal text-[11px]">${st}</span></div><div class="grid grid-cols-2 gap-2">${side('a',tm(m.a))}${side('b',tm(m.b))}</div>${bar}</div>`};
window.vote=async(mid,k)=>{const m=DB.matches.find(z=>z.id==mid);if(!m||new Date(m.when)<=Date.now()||tsK(m.st)!='up')return toast(R('Голосование закрыто','Voting closed'));
 if(sb&&!S.me)return authModal();if(PRED._b)return;const o=PRED.me[mid];if(o==k)return;
 const c=PRED.c[mid]=PRED.c[mid]||{a:0,b:0};if(o)c[o]=Math.max(0,(c[o]||0)-1);c[k]=(c[k]||0)+1;PRED.me[mid]=k;hp();render(true);
 if(sb){PRED._b=1;const{error}=await sb.from('predictions').upsert({match_id:mid,user_id:S.me.id,pick:k},{onConflict:'match_id,user_id'});PRED._b=0;
  if(error){c[k]=Math.max(0,(c[k]||0)-1);if(o){c[o]=(c[o]||0)+1;PRED.me[mid]=o}else delete PRED.me[mid];render(true);return toast(error.message)}PRED._s='';await loadPred()}
 else{try{localStorage.setItem('tsk_pred',JSON.stringify({c:PRED.c,me:PRED.me}))}catch{}}
 toast(R('Голос принят','Vote saved'))};

/* ---------- победитель турнира ---------- */
const tTeams=x=>{const seen={},o=[];[...(x.groups||[]).flatMap(g=>g.teams||[]),...(x.po||[]).flatMap(y=>[y.a,y.b])].forEach(n=>{const t=n&&tnm(n);if(t&&!seen[t.id]){seen[t.id]=1;o.push(t)}});return o};
window.tpBox=(x,sk)=>{if(!TP.ok)return'';const ts=tTeams(x);if(ts.length<2)return'';
 const c=TP.c[x.id]||{},mine=TP.me[x.id],n=Object.values(c).reduce((a,b)=>a+b,0),pct=id=>n?Math.round(100*(c[id]||0)/n):0,mt=mine&&(ts.find(z=>z.id==mine)||DB.teams.find(z=>z.id==mine)),
 wrap=h=>`<div class="px-4 py-3 border-t bd-10">${h}</div>`,
 head=r=>`<div class="flex items-center justify-between mb-2 text-[10px] uppercase tracking-[.14em] k-t5"><span class="flex items-center gap-1.5">${ic('target','!w-3.5 !h-3.5')}${R('Кто выиграет турнир?','Who will win?')}</span><span class="normal-case tracking-normal text-[11px]">${r}</span></div>`,
 mineRow=(extra)=>`<div class="flex items-center gap-2.5 rounded-xl border bd-10 px-2.5 py-2 text-[13px]"><span class="k-t5 uppercase tracking-wider text-[10px] shrink-0">${R('Твой выбор','Your pick')}</span>${lg(mt,'h-6 w-6 shrink-0')}<b class="truncate">${esc(mt.name)}</b><span class="ml-auto shrink-0">${extra}</span></div>`;
 if(sk=='fin'){if(!mt)return'';const ok=x.winner&&mine==x.winner;return wrap(head(R('Итог','Result'))+mineRow(chip(ok,ok?R('Угадал','Correct')+' +5':R('Не угадал','Wrong'))))}
 if(sk=='live'){if(!mt&&!n)return'';const top=ts.slice().sort((a,b)=>(c[b.id]||0)-(c[a.id]||0))[0];return wrap(head(lock(R('Приём закрыт','Closed')))+(mt?mineRow(''):'')+(n&&top?`<div class="text-[12px] k-t4 mt-2">${R('Народный фаворит','Crowd favorite')}: <b>${esc(top.name)}</b> · ${pct(top.id)}%</div>`:''))}
 const sorted=ts.slice().sort((a,b)=>(c[b.id]||0)-(c[a.id]||0)||a.name.localeCompare(b.name)),ex=(S.tpx||{})[x.id],LIM=4,vis=ex?sorted:sorted.filter((z,i)=>i<LIM||z.id==mine),
 row=z=>{const sel=mine==z.id,i=sorted.indexOf(z);return`<button class="relative overflow-hidden flex items-center gap-2.5 w-full rounded-xl border px-2.5 py-2 text-left transition active:scale-[.98] ${sel?'ko-cy kb-cy-10':'bd-10 hv-bw-04'}" aria-pressed="${sel}" onclick="tpVote('${esc(x.id)}','${esc(z.id)}')"><i class="absolute inset-y-0 left-0 ${sel?'kb-cy-15':'bw-05'}" style="width:${pct(z.id)}%"></i>${n?`<span class="relative w-4 text-center text-[11px] font-head font-bold ${i<3?'kc-gd':'k-t5'}">${i+1}</span>`:''}<span class="relative shrink-0">${lg(z,'h-6 w-6')}</span><span class="relative min-w-0 flex-1 truncate text-[13px] font-semibold">${esc(z.name)}</span>${n?`<span class="relative text-[11px] tabular-nums k-t4">${pct(z.id)}%</span>`:''}${sel?`<span class="relative kc-cy shrink-0">${ic('check','!w-4 !h-4')}</span>`:''}</button>`},
 more=sorted.length>LIM?`<button class="mt-2 w-full text-[11px] font-bold uppercase tracking-wider k-t4 py-1.5 rounded-lg ac-bw-05" onclick="(S.tpx=S.tpx||{})['${esc(x.id)}']=${!ex};render()">${ex?R('Свернуть','Collapse'):R('Показать все','Show all')+' ('+sorted.length+')'}</button>`:'';
 return wrap(head(n?n+' '+R('голосов','votes'):mine?'':R('Выбери победителя','Pick the winner'))+`<div class="grid gap-1.5">${vis.map(row).join('')}</div>`+more)};
window.tpVote=async(tid,team)=>{const x=DB.tourn.find(z=>z.id==tid);if(!x||tsK(x.status)!='up')return toast(R('Приём прогнозов закрыт','Predictions are closed'));
 if(sb&&!S.me)return authModal();if(TP._b)return;const o=TP.me[tid];if(o==team)return;
 const c=TP.c[tid]=TP.c[tid]||{};if(o)c[o]=Math.max(0,(c[o]||0)-1);c[team]=(c[team]||0)+1;TP.me[tid]=team;hp();render(true);
 if(sb){TP._b=1;const{error}=await sb.from('tourn_predictions').upsert({tourn_id:tid,user_id:S.me.id,team_id:team},{onConflict:'user_id,tourn_id'});TP._b=0;
  if(error){c[team]=Math.max(0,(c[team]||0)-1);if(o){c[o]=(c[o]||0)+1;TP.me[tid]=o}else delete TP.me[tid];render(true);return toast(/closed/i.test(error.message)?R('Приём прогнозов закрыт','Predictions are closed'):error.message)}TP._s='';await loadTP()}
 else{try{localStorage.setItem('tsk_tpred',JSON.stringify({c:TP.c,me:TP.me}))}catch{}}
 toast(R('Прогноз принят','Prediction saved'))};
window.loadTP=async()=>{if(!sb)return;try{const[c,me]=await Promise.all([sb.rpc('tourn_prediction_counts'),S.me?sb.from('tourn_predictions').select('tourn_id,team_id'):{data:[]}]);const ok=!c.error;const C={},M={};if(ok){(c.data||[]).forEach(r=>{(C[r.tourn_id]=C[r.tourn_id]||{})[r.team_id]=+r.n});(me.data||[]).forEach(r=>M[r.tourn_id]=r.team_id)}const sg=JSON.stringify([ok,C,M]);if(sg===TP._s)return;TP.ok=ok;TP.c=C;TP.me=M;TP._s=sg;if(!$('#m').innerHTML&&['tourn','matches'].includes(S.tab))render(true)}catch{}};

/* ---------- очки и таблица прогнозистов ---------- */
const mine=()=>{let ok=0,tot=0,hit=0;DB.matches.forEach(m=>{const p=PRED.me[m.id],w=dec(m);if(!p||!w)return;tot++;if(p==w)ok++});DB.tourn.forEach(x=>{const p=TP.me[x.id];if(!p||tsK(x.status)!='fin'||!x.winner)return;tot++;if(p==x.winner){ok++;hit++}});return{ok,tot,pts:ok-hit+5*hit}};
window.loadPL=async force=>{if(!sb||(!force&&Date.now()-PL._t<45000))return;PL._t=Date.now();try{const r=await sb.rpc('prediction_leaderboard',{lim:20});const ok=!r.error,rows=ok?(r.data||[]):[],sg=JSON.stringify([ok,rows]);if(sg===PL._s)return;PL._s=sg;PL.ok=ok;PL.rows=rows;if(!$('#m').innerHTML&&S.tab=='matches')render(true)}catch{}};
window.predHead=()=>{if(sb&&!PL.ok)return'';const s=mine(),open=!!S.plo&&sb,me=S.me&&S.me.id,acc=s.tot?Math.round(100*s.ok/s.tot):null,idx=me?PL.rows.findIndex(r=>r.user_id==me):-1,
 cell=(v,l,f)=>`<div class="flex-1 min-w-0 px-3 py-2 ${f?'':'border-l bd-10'}"><div class="font-head font-black text-lg leading-none tabular-nums">${v}</div><div class="text-[10px] uppercase tracking-wider k-t5 mt-1 truncate">${l}</div></div>`,
 medal=i=>['kb-gd text-black','bg-slate-300 text-black','kb-br text-black'][i]||'bw-10 k-t4',
 rows=PL.rows.map((r,i)=>{const ok=(+r.correct||0)+(+r.tourn_hits||0),t=+r.total||0;return`<div class="flex items-center gap-2.5 px-3 py-2 border-t bd-10 text-[13px] ${me&&r.user_id==me?'kb-cy-10':''}"><span class="w-6 h-6 rounded-full grid place-items-center text-[11px] font-head font-black shrink-0 ${medal(i)}">${i+1}</span><span class="flex-1 min-w-0"><b class="block truncate font-semibold">${esc(r.nick||'—')}</b><span class="text-[10px] k-t5">${ok}/${t}${t?' · '+Math.round(100*ok/t)+'%':''}</span></span><b class="font-head font-black tabular-nums">${+r.points||0}</b><span class="text-[10px] k-t5">${R('очк.','pts')}</span></div>`}).join('');
 return`<section class="g mb-3 overflow-hidden"><div class="flex items-center gap-3 px-3 py-2.5"><span class="grid place-items-center w-9 h-9 rounded-xl kb-gd-10 kc-gd shrink-0">${ic('target','!w-5 !h-5')}</span><div class="min-w-0 flex-1"><div class="font-head font-black text-[15px] leading-tight">${R('Прогнозы','Predictions')}</div><div class="text-[11px] k-t4 truncate">${R('Матч — 1 очко · победитель турнира — 5','Match — 1 pt · tournament winner — 5')}</div></div>${sb?`<button class="btn k !py-1.5 !px-3 text-[11px] shrink-0" onclick="S.plo=!S.plo;if(S.plo)loadPL(true);render()">${open?R('Свернуть','Collapse'):(idx>=0?'#'+(idx+1)+' · ':'')+R('Топ','Top')}</button>`:''}</div>`
 +(!S.me&&sb?`<div class="px-3 pb-3"><button class="btn w-full" onclick="authModal()">${R('Войти, чтобы делать прогнозы','Sign in to make predictions')}</button></div>`:`<div class="flex border-t bd-10">${cell(s.tot?s.ok+'/'+s.tot:'—',R('Угадано','Correct'),1)}${cell(acc==null?'—':acc+'%',R('Точность','Accuracy'))}${cell(s.pts,R('очк.','pts'))}</div>`)
 +(open?(rows||`<div class="px-3 py-3 border-t bd-10 text-[12px] k-t5">${R('Ещё нет результатов','No results yet')}</div>`):'')+`</section>`};
const _vm=V.matches;V.matches=q=>{loadPL();return _vm(q).replace('</h1>',m=>m+predHead())};
if(sb){loadTP();setInterval(loadTP,20000);addEventListener('focus',loadTP);sb.auth.onAuthStateChange(()=>setTimeout(()=>{TP._s='';PL._t=0;loadTP();loadPL(true)},300))}
})();
