/* ===== v3: прогнозы на матчи ===== */
(()=>{
const PRED=window.PRED={c:{},me:{},_s:''};
if(!sb){try{const d=JSON.parse(localStorage.getItem('tsk_pred')||'{}');PRED.c=d.c||{};PRED.me=d.me||{}}catch{}}
const pct=(c,k)=>{const n=(c.a||0)+(c.b||0);return n?Math.round(100*(c[k]||0)/n):0};
window.predBox=m=>{const c=PRED.c[m.id]||{},mine=PRED.me[m.id],n=(c.a||0)+(c.b||0),lock=new Date(m.when)<=Date.now();
 const btn=(k,x)=>`<button class="flex-1 relative overflow-hidden rounded-lg border text-[12px] font-bold py-1.5 px-2 transition active:scale-95 ${mine==k?'ko-cy kb-cy-15 kc-cy':'bd-10 k-t3'}" ${lock?'disabled':''} onclick="event.stopPropagation();vote('${esc(m.id)}','${k}')"><i class="absolute inset-y-0 left-0 bw-07" style="width:${pct(c,k)}%"></i><span class="relative block truncate">${esc(x.name)}${n?' · '+pct(c,k)+'%':''}</span></button>`;
 return`<div class="mt-2.5 pt-2.5 border-t bd-10"><div class="text-[10px] uppercase tracking-[.14em] k-t5 mb-1.5 flex justify-between"><span>${R('Прогноз','Prediction')}</span><span>${n?n+' '+R('голосов','votes'):''}</span></div><div class="flex gap-1.5">${btn('a',tm(m.a))}${btn('b',tm(m.b))}</div></div>`};
window.loadPred=async()=>{if(!sb)return;try{const[c,me]=await Promise.all([sb.rpc('prediction_counts'),S.me?sb.from('predictions').select('match_id,pick'):{data:[]}]);
 const C={},M={};(c.data||[]).forEach(r=>{(C[r.match_id]=C[r.match_id]||{})[r.pick]=+r.n});(me.data||[]).forEach(r=>M[r.match_id]=r.pick);
 const sg=JSON.stringify([C,M]);if(sg===PRED._s)return;PRED.c=C;PRED.me=M;PRED._s=sg;if(!$('#m').innerHTML&&['matches','news'].includes(S.tab))render(true)}catch{}};
window.vote=async(mid,k)=>{const m=DB.matches.find(z=>z.id==mid);if(!m||new Date(m.when)<=Date.now())return toast(R('Голосование закрыто','Voting closed'));
 if(sb){if(!S.me)return authModal();const{error}=await sb.from('predictions').upsert({match_id:mid,user_id:S.me.id,pick:k},{onConflict:'match_id,user_id'});if(error)return toast(error.message);PRED._s='';await loadPred()}
 else{const c=PRED.c[mid]=PRED.c[mid]||{a:0,b:0},o=PRED.me[mid];if(o)c[o]=Math.max(0,(c[o]||0)-1);c[k]=(c[k]||0)+1;PRED.me[mid]=k;try{localStorage.setItem('tsk_pred',JSON.stringify({c:PRED.c,me:PRED.me}))}catch{}}
 toast(R('Голос принят','Vote saved'));render(true)};
if(sb){loadPred();setInterval(()=>{document.hidden||loadPred()},3e4);addEventListener('focus',loadPred);sb.auth.onAuthStateChange(()=>setTimeout(()=>{PRED._s='';loadPred()},300))}
})();
