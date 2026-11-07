/* ===== Сетки сообщества: пользователи создают свои турнирные сетки ===== */
(()=>{
const COLS='id,owner,owner_nick,name,descr,game,visibility,pub_req,pub_note,code,data,created_at,updated_at',LS='tsk_brk_v1',
BX={tab:'pub',view:'list',pub:null,mine:null,cur:null,code:'',err:'',admL:null,adm:'pending',pend:0,q:''},
me=()=>S.me&&S.me.id,own=c=>!!(c&&me()&&c.owner===me()),isStaff=()=>!!S.user&&['owner','admin','mod_sr','moderator'].includes(S.user.role),
ownNick=c=>{const p=c&&c.owner&&(DB.players||[]).find(x=>x.uid&&x.uid==c.owner);return p&&p.nick?p.nick:(c&&c.owner_nick)||''},
 nick=()=>clean(((DB.players||[]).find(p=>S.me&&p.uid==S.me.id)||{}).nick||(S.me&&S.me.nick)||String((S.me&&S.me.email)||'').split('@')[0]||'player').slice(0,24),
link=c=>location.origin+TSK_ROOT+'#/bk/'+c,
paint=()=>{if(S.tab=='brk'&&!document.getElementById('bx-ed')&&!$('#m').innerHTML)render(true)},
errTxt=e=>{const m=String((e&&e.message)||e||'');return /relation .*brackets|does not exist|schema cache|bracket_by_code/i.test(m)?R('Раздел сеток ещё не включён: выполни 02_brackets.sql в Supabase.','Brackets are not enabled yet: run 02_brackets.sql in Supabase.'):m};
window.brkCan=isStaff;window.brkPending=()=>BX.pend||0;

/* ---------- хранилище (Supabase или локальный демо-режим) ---------- */
const lsGet=()=>{try{return JSON.parse(localStorage.getItem(LS))||[]}catch{return[]}},lsSet=a=>{try{localStorage.setItem(LS,JSON.stringify(a))}catch{toast('Storage full',4000)}};
const A={
 async pub(){if(!sb)return lsGet().filter(x=>x.visibility=='public'&&x.pub_req=='approved');const{data,error}=await sb.from('brackets').select(COLS).eq('visibility','public').eq('pub_req','approved').order('updated_at',{ascending:false}).limit(60);if(error)throw error;return data||[]},
 async mine(){if(!me())return[];if(!sb)return lsGet().filter(x=>x.owner===me());const{data,error}=await sb.from('brackets').select(COLS).eq('owner',me()).order('updated_at',{ascending:false});if(error)throw error;return data||[]},
 async code(c){c=String(c||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,32);if(!c)return null;if(!sb)return lsGet().find(x=>x.code==c&&(x.visibility!='private'||own(x)||isStaff()))||null;const{data,error}=await sb.rpc('bracket_by_code',{p_code:c});if(error)throw error;return data||null},
 async save(row,id){
  if(!sb){const L=lsGet();let o=id&&L.find(x=>x.id==id);
   if(o){const was=o.visibility=='public'&&o.pub_req=='approved';Object.assign(o,row);if(!isStaff()){if(o.visibility=='public'&&!was)o.visibility='invite';if(was&&(row.name!==undefined||row.data)&&o.visibility=='public'){}}o.updated_at=new Date().toISOString()}
   else{o={id:uid(),owner:me(),owner_nick:nick(),code:uid().toLowerCase().replace(/[^a-z0-9]/g,'').padEnd(12,'x').slice(0,12),pub_note:null,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),...row};if(o.visibility=='public')o.visibility='invite';L.push(o)}
   lsSet(L);return o}
  const q=id?sb.from('brackets').update(row).eq('id',id):sb.from('brackets').insert({...row,owner_nick:nick()}),{data,error}=await q.select(COLS).single();if(error)throw error;return data},
 async del(id){if(!sb){lsSet(lsGet().filter(x=>x.id!=id));return}const{error}=await sb.from('brackets').delete().eq('id',id);if(error)throw error},
 async review(id,ok,note){if(!sb){const L=lsGet(),o=L.find(x=>x.id==id);if(o){if(ok){o.visibility='public';o.pub_req='approved';o.pub_note=null}else{if(o.visibility=='public')o.visibility='invite';o.pub_req='rejected';o.pub_note=note||null}lsSet(L)}return}const{error}=await sb.rpc('bracket_review',{p_id:id,p_approve:ok,p_note:note||null});if(error)throw error},
 async adm(){if(!sb)return lsGet().filter(x=>x.pub_req!='none');const{data,error}=await sb.from('brackets').select(COLS).neq('pub_req','none').order('updated_at',{ascending:false}).limit(200);if(error)throw error;return data||[]},
 async pendN(){if(!sb)return lsGet().filter(x=>x.pub_req=='pending').length;const{count,error}=await sb.from('brackets').select('id',{count:'exact',head:true}).eq('pub_req','pending');if(error)throw error;return count||0}
};

/* ---------- логика сетки (одиночное выбывание, автопроходы, матч за 3-е место) ---------- */
const seedOrder=n=>{let a=[1];while(a.length<n){const m=a.length*2+1;a=a.flatMap(x=>[x,m-x])}return a},
dOf=c=>(c&&c.data)||{},
decide=(a,b,rs)=>{if(!a||!b||!rs||rs.ai!==a.id||rs.bi!==b.id)return null;if(rs.w==='a')return{w:a,l:b};if(rs.w==='b')return{w:b,l:a};const x=+rs.a,y=+rs.b;if(rs.a===''||rs.b===''||!isFinite(x)||!isFinite(y)||x===y)return null;return x>y?{w:a,l:b}:{w:b,l:a}},
calc=d=>{const T=(d&&d.teams)||[],n=T.length;if(n<2)return null;let size=2;while(size<n)size*=2;const R0=Math.log2(size);let cur=seedOrder(size).map(s=>s<=n?T[s-1]:null);const rounds=[],res=(d&&d.res)||{};
 for(let r=0;r<R0;r++){const ms=[],nx=[];for(let m=0;m<cur.length/2;m++){const a=cur[2*m],b=cur[2*m+1],k=r+'-'+m;let w=null,l=null,bye=false,rr=null;
   if(r==0&&(!a||!b)){bye=true;w=a||b}else{const x=decide(a,b,res[k]);if(x){w=x.w;l=x.l;rr=res[k]}}
   ms.push({k,r,m,a,b,w,l,bye,res:rr});nx.push(w)}rounds.push(ms);cur=nx}
 let third=null;if(d.third&&R0>=2){const s=rounds[R0-2];if(!s[0].bye&&!s[1].bye){const a=s[0].l,b=s[1].l,x=decide(a,b,res['3rd']);third={k:'3rd',r:R0-1,m:0,a,b,w:x?x.w:null,l:x?x.l:null,bye:false,res:x?res['3rd']:null}}}
 const all=rounds.flat().concat(third?[third]:[]),real=all.filter(m=>!m.bye),fin=rounds[R0-1][0];
 return{n,size,R0,rounds,third,all,total:real.length,played:real.filter(m=>m.w).length,byes:all.length-real.length,champ:fin.w,nx:real.find(m=>m.a&&m.b&&!m.w)||null}},
prune=d=>{const c=calc(d),ok={};if(c)c.all.forEach(m=>{if(m.res)ok[m.k]=m.res});d.res=ok;return d},
rn=(r,tot)=>{const l=tot-r;return l==1?R('Финал','Final'):l==2?R('Полуфинал','Semifinal'):l==3?R('Четвертьфинал','Quarterfinal'):l==4?R('1/8 финала','Round of 16'):l==5?R('1/16 финала','Round of 32'):l==6?R('1/32 финала','Round of 64'):R('Раунд','Round')+' '+(r+1)},
mname=(m,c)=>m.k=='3rd'?R('Матч за 3-е место','Third place match'):rn(m.r,c.R0);

/* ---------- мелкие кусочки интерфейса ---------- */
const VISF=()=>({private:['lock',R('Приватная','Private'),R('Видишь только ты','Only you can see it')],invite:['share',R('По приглашению','Invite only'),R('Открывается по ссылке — в списках не показывается','Opens by link — not shown in lists')],public:['globe',R('Публичная','Public'),R('Видна всем в списке сеток. Включается после одобрения администрации','Listed for everyone. Goes live after staff approval')]}),
chips=c=>{const V_=VISF(),v=V_[c.visibility]||V_.private,o=[`<span class="bx-chip ${c.visibility=='public'?'pub':''}">${ic(v[0])}${v[1]}</span>`];if(c.pub_req=='pending')o.push(`<span class="bx-chip pend">${R('На проверке','Under review')}</span>`);if(c.pub_req=='rejected')o.push(`<span class="bx-chip rej">${R('Публикация отклонена','Publishing declined')}</span>`);return`<div class="bx-chips">${o.join('')}</div>`},
tag=(c,s)=>{const k=!s?'up':s.champ?'fin':s.played?'live':'up';return`<span class="tn-tag">${k=='live'?'<i class="tn-dot"></i>':''}${k=='fin'?R('Завершена','Finished'):k=='live'?R('Идёт','In progress'):R('Не началась','Not started')}</span>`},
stOf=s=>!s?'up':s.champ?'fin':s.played?'live':'up',
siteTm=t=>{if(!t)return null;const L=DB.teams||[];let x=t.site&&L.find(z=>z.id==t.site);if(!x){const n=String(t.name||'').trim().toLowerCase();x=n&&L.find(z=>String(z.name).trim().toLowerCase()==n)}return x||null},
ownPl=c=>c&&c.owner?(DB.players||[]).find(x=>x.uid&&x.uid==c.owner)||null:null,
brow=(tm,bye,v,st)=>{const nm=tm?esc(tm.name):bye?'BYE':'—';return`<div class="bk-t ${st} ${tm?'':'bx-nil'}" ${tm?`data-tn="${esc(tm.id)}"`:''}>${tm?lg(tm,'h-5 w-5'):'<span class="bx-dot"></span>'}<span class="n${tm?' bx-lk'+(siteTm(tm)?'':' off'):''}" ${tm?`onclick="event.stopPropagation();bxTeam('${esc(tm.id)}')"`:''}>${nm}</span><b class="sc">${v}</b></div>`},
mcard=(m,o)=>{let va='–',vb='–';if(m.bye){va=m.w===m.a?'':'';vb=''}else if(m.res){if(m.res.w&&(m.res.a===''||m.res.a==null||m.res.b===''||m.res.b==null)){va=m.w===m.a?'W':'L';vb=m.w===m.b?'W':'L'}else{va=m.res.a;vb=m.res.b}}
 const ca=m.w&&m.w===m.a?'w':m.w?'l':'',cb=m.w&&m.w===m.b?'w':m.w?'l':'',can=o.ed&&m.a&&m.b&&!m.bye;
 return`<div class="bk-m ${m===o.nx?'nx':''} ${o.f?'fin':''} ${o.li?'li':''} ${can?'bx-ed':''} ${m.bye?'bx-bye':''}" ${can?`onclick="bxScore('${m.k}')" title="${esc(R('Ввести счёт','Enter score'))}"`:''}>${m===o.nx?`<i class="bk-tag">${R('Далее','Next')}</i>`:''}${brow(m.a,m.bye&&!m.a,va,ca)}${brow(m.b,m.bye&&!m.b,vb,cb)}</div>`},
bracketH=(c,s,ed)=>{const rs=s.rounds,n=rs.length,act=rs.findIndex(r=>r.some(m=>!m.bye&&!m.w)),foc=act<0?n-1:act;
 const cols=rs.map((g,i)=>{const pr=i<n-1,li=i>0,fin=i==n-1,real=g.filter(m=>!m.bye),done=real.filter(m=>m.w).length;
  return`<div class="bk-col" data-i="${i}"><div class="bk-h ${i==act?'act':''} ${fin?'fin':''}"><span><b>${fin?ic('cup'):''}${esc(rn(i,s.R0))}</b><em>${done}/${real.length}</em></span></div><div class="bk-b">${g.map((m,k)=>`<div class="bk-s ${pr?'c '+(k%2?'d':'u'):''} ${pr&&m.w?'dn':''}">${mcard(m,{nx:s.nx,f:fin,li,ed})}</div>`).join('')}</div></div>`}).join(''),
 th=s.third?`<div class="bk-3"><div class="bk-h"><span><b>${esc(R('Матч за 3-е место','Third place match'))}</b></span></div><div class="bk-s">${mcard(s.third,{nx:s.nx,ed})}</div></div>`:'';
 return`<div class="bk-scroll" data-id="bx${esc(c.id)}" data-f="${foc}"><div class="bk" style="--n:${n}">${cols}${th}</div></div>`},
summary=c=>{const s=calc(dOf(c));return{s,n:(dOf(c).teams||[]).length}},
card=c=>{const{s,n}=summary(c),st=stOf(s);
 return`<button class="bx-card" style="--st:${st=='fin'?'var(--tn-gd)':st=='live'?'var(--tn-rd)':'var(--tn-ac)'}" onclick="bxOpen('${esc(c.code)}')"><b class="t">${esc(c.name)}</b><div class="bx-meta"><span><b>${n}</b> ${R('команд','teams')}</span>${s?`<span><b>${s.played}/${s.total}</b> ${R('матчей','matches')}</span>`:''}${c.game?`<span>${esc(c.game)}</span>`:''}${ownNick(c)?`<span>${ic('user','!w-3 !h-3')} ${esc(ownNick(c))}</span>`:''}</div>${s&&s.champ?`<div class="bx-champ">${ic('cup','!w-4 !h-4')} ${esc(s.champ.name)}</div>`:''}${chips(c)}</button>`};

/* ---------- страница «Сетки» ---------- */
const ld=(k,f)=>{BX[k]=null;f().then(r=>{BX[k]=r;BX.err='';paint()}).catch(e=>{BX[k]=[];BX.err=errTxt(e);paint()})},
loadLists=()=>{ld('pub',A.pub);if(me())ld('mine',A.mine);else BX.mine=[]};
window.brkPromo=()=>{
 if(BX.pub===null&&!BX.pubLoad){BX.pubLoad=1;A.pub().then(r=>{BX.pub=r;BX.pubLoad=0;if(S.tab=='tourn'&&!$('#m').innerHTML)render(true)}).catch(()=>{BX.pub=[];BX.pubLoad=0})}
 const P=(BX.pub||[]).slice(0,4);
 return`<div class="bx-promo"><div><b>${R('Сетки сообщества','Community brackets')}</b><small>${R('Турнирные сетки, которые создали игроки. Хочешь свою — команды, логотипы и счёт настраиваются в пару кликов.','Brackets made by players. Want your own? Teams, logos and scores take a few taps.')}</small></div><button class="btn" onclick="bxNew()">${ic('plus')} ${R('Создать сетку','Create bracket')}</button></div>${P.length?`<div class="bx-pubh"><span>${R('Публичные сетки','Public brackets')}</span><button class="btn k" onclick="brkGo()">${R('Все сетки','All brackets')} ›</button></div><div class="bx-grid" style="margin-top:8px">${P.map(card).join('')}</div>`:''}`};
const listH=()=>{const tab=BX.tab=='mine'?'mine':'pub',L=BX[tab],q=(BX.q||'').toLowerCase(),
 tb=(k,l,n)=>`<button class="${tab==k?'on':''}" onclick="BX_.tab='${k}';render()">${l}${n!=null?`<em>${n}</em>`:''}</button>`;
 let body;if(L===null)body=SKL.rows(3);
 else if(tab=='mine'&&!me())body=`<div class="bx-empty">${R('Войди в аккаунт, чтобы создавать свои сетки.','Sign in to create your own brackets.')}<br><button class="btn" onclick="authModal()">${R('Войти','Sign in')}</button></div>`;
 else{const f=L.filter(x=>!q||x.name.toLowerCase().includes(q)||String(ownNick(x)).toLowerCase().includes(q));
  body=f.length?`<div class="bx-grid">${f.map(card).join('')}</div>`:`<div class="bx-empty">${tab=='mine'?R('У тебя пока нет сеток.','You have no brackets yet.'):R('Публичных сеток пока нет. Создай первую — после одобрения она появится здесь.','No public brackets yet. Create the first one — it appears here after approval.')}<br><button class="btn" onclick="bxNew()">${ic('plus')} ${R('Создать сетку','Create bracket')}</button></div>`}
 return`<div class="tn-page bx"><div class="bx-top"><h1 class="font-head font-black text-2xl uppercase tracking-wide">${R('Сетки сообщества','Community brackets')}</h1><button class="btn" onclick="bxNew()">${ic('plus')} ${R('Создать','Create')}</button></div>
 <div class="bx-tabs">${tb('pub',R('Публичные','Public'),BX.pub?BX.pub.length:null)}${tb('mine',R('Мои','Mine'),BX.mine&&BX.mine.length?BX.mine.length:null)}</div>
 <div style="display:flex;gap:8px;margin-top:12px"><input class="inp" style="margin:0" placeholder="${esc(R('Поиск или вставь ссылку / код приглашения','Search, or paste an invite link / code'))}" value="${esc(BX.q||'')}" oninput="bxQ(this.value)" onkeydown="if(event.key=='Enter')bxCodeGo(this.value)"></div>
 ${BX.err?`<div class="bx-note e">${esc(BX.err)}</div>`:''}${body}</div>`};

/* ---------- просмотр сетки ---------- */
const viewH=()=>{const c=BX.cur;
 if(BX.err&&!c)return`<div class="tn-page bx"><button class="btn k" onclick="bxList()">${ic('back')} ${R('К сеткам','All brackets')}</button><div class="bx-note e">${esc(BX.err)}</div></div>`;
 if(!c)return`<div class="tn-page bx"><button class="btn k" onclick="bxList()">${ic('back')} ${R('К сеткам','All brackets')}</button>${SKL.rows(3)}</div>`;
 if(c==='404')return`<div class="tn-page bx"><button class="btn k" onclick="bxList()">${ic('back')} ${R('К сеткам','All brackets')}</button><div class="bx-empty">${R('Сетка не найдена, закрыта или ссылка устарела.','Bracket not found, private, or the link is outdated.')}</div></div>`;
 const d=dOf(c),s=calc(d),o=own(c),st=stOf(s),T=d.teams||[],
 notes=(o&&c.pub_req=='pending'?`<div class="bx-note w">${R('Заявка на публикацию на проверке у администрации. Пока сетка доступна по ссылке.','Your publishing request is under staff review. Meanwhile the bracket is available by link.')}</div>`:'')+(o&&c.pub_req=='rejected'?`<div class="bx-note e">${R('Публикация отклонена','Publishing declined')}${c.pub_note?': '+esc(c.pub_note):''}. ${R('Можно исправить и подать снова.','You can fix it and apply again.')}</div>`:'');
 return`<div class="tn-page bx"><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn k" onclick="bxList()">${ic('back')} ${R('К сеткам','All brackets')}</button></div>${notes}
 <section class="tn tn-${st} fd"><div class="tn-hero"><span class="tn-wm">${ic('cup')}</span>${tag(c,s)}<h2 class="tn-name font-head">${esc(c.name)}</h2><div class="tn-kv"><div><b>${T.length}</b><span>${R('команд','teams')}</span></div>${s?`<div><b>${s.played}/${s.total}</b><span>${R('матчей','matches')}</span></div>`:''}${c.game?`<div><b style="font-size:14px">${esc(c.game)}</b><span>${R('игра','game')}</span></div>`:''}${ownNick(c)?(()=>{const p=ownPl(c);return`<div ${p?`class="bx-lkd" onclick="openP('${esc(p.id)}')" title="${esc(R('Открыть профиль игрока','Open player profile'))}"`:''}><b style="font-size:14px">${esc(ownNick(c))}${p?' ›':''}</b><span>${R('организатор','organizer')}</span></div>`})():''}</div><div style="margin-top:12px;position:relative">${chips(c)}</div></div>
 <div class="bx-act">${c.visibility!='private'||o?`<button class="btn k" onclick="bxCopy()">${ic('copy')} ${R('Копировать ссылку','Copy link')}</button>`:''}${c.visibility!='private'?`<button class="btn k" onclick="bxShare()">${ic('share')} ${R('Поделиться','Share')}</button>`:''}${o?`<button class="btn" onclick="bxEdit()">${ic('edit')} ${R('Редактировать','Edit')}</button><button class="btn k" onclick="bxAccess()">${ic('lock')} ${R('Доступ','Access')}</button>`:''}${isStaff()&&!o&&c.visibility=='public'?`<button class="btn r" onclick="bxRejectDlg('${esc(c.id)}')">${R('Снять с публикации','Unpublish')}</button>`:''}</div>
 ${c.descr?`<div class="bx-desc">${esc(c.descr)}</div>`:''}
 ${s&&s.champ?`<div class="tn-champ" style="cursor:pointer" onclick="bxTeam('${esc(s.champ.id)}')">${lg(s.champ,'h-10 w-10')}<div><small>${R('Победитель','Champion')}</small><b>${esc(s.champ.name)}</b></div>${ic('cup')}</div>`:''}
 ${s?`${o?`<div class="bx-hint">${R('Нажми на матч, чтобы ввести счёт — победитель пройдёт дальше сам.','Tap a match to enter the score — the winner advances automatically.')}</div>`:''}<div class="bx-bkw">${bracketH(c,s,o)}</div>`:`<div class="bx-empty" style="border:0">${R('Добавь минимум 2 команды, чтобы появилась сетка.','Add at least 2 teams to build the bracket.')}${o?`<br><button class="btn" onclick="bxEdit()">${ic('edit')} ${R('Редактировать','Edit')}</button>`:''}</div>`}
 ${T.length?`<div class="tn-sec" style="margin:6px 22px 10px 22px"><span>${R('Команды','Teams')}</span></div><div class="bx-teams">${T.map((t,i)=>{const x=siteTm(t);return`<button class="bx-tm ${x?'lk':'off'}" onclick="bxTeam('${esc(t.id)}')"><i>${i+1}</i>${lg(t,'h-6 w-6')}<span>${esc(t.name)}</span>${x?'<b class="bx-go">›</b>':`<em class="bx-no">${R('Не на сайте','Not on site')}</em>`}</button>`}).join('')}</div>${T.some(t=>!siteTm(t))?`<div class="bx-hint" style="padding:0 22px 14px">${R('«Не на сайте» — этих команд нет на сайте, их добавил автор сетки. Остальные можно открыть нажатием.','“Not on site” teams aren’t registered on the site — the bracket author added them. Tap the others to open their profile.')}</div>`:''}`:''}</section></div>`};

V.brk=()=>{if(BX.view=='view'&&BX.cur==='404'&&me()&&!BX.retry){BX.retry=1;const c0=BX.code;A.code(c0).then(r=>{if(r&&BX.code==c0){BX.cur=r;paint()}}).catch(()=>{})}return BX.view=='view'?viewH():listH()};
window.BX_=BX;
setTimeout(()=>{if(window.__brkPending!==undefined){const p=window.__brkPending;delete window.__brkPending;brkRoute(p)}},0);

/* ---------- навигация ---------- */
const push=h=>{try{if(location.pathname+location.hash!==TSK_ROOT+h&&location.hash!==h)history.pushState(null,'',TSK_ROOT+h)}catch{}};
window.brkRoute=async code=>{S.tab='brk';closeM();document.title='TSK Esports — '+R('Сетки сообщества','Community brackets');
 if(!code){BX.view='list';BX.cur=null;BX.err='';ui();loadLists();return}
 BX.view='view';BX.code=String(code);BX.cur=null;BX.err='';BX.retry=0;ui();
 try{const r=await A.code(code);if(BX.code!=String(code))return;BX.cur=r||'404';if(r)document.title=r.name+' — TSK Esports'}catch(e){BX.err=errTxt(e)}paint()};
window.brkGo=()=>{push('#/bk');brkRoute('')};
window.bxList=()=>brkGo();
window.bxOpen=c=>{push('#/bk/'+c);brkRoute(c)};
window.bxQ=v=>{BX.q=v;const el=document.activeElement,p=el&&el.selectionStart;render(true);const n=document.querySelector('.bx input.inp');if(n){n.focus();try{n.setSelectionRange(p,p)}catch{}}};
window.bxCodeGo=v=>{v=String(v).trim();const m=v.match(/bk\/([a-z0-9]{8,32})\/?$/i)||v.match(/^([a-z0-9]{12})$/i);if(m)bxOpen(m[1].toLowerCase())};
window.bxCopy=()=>{const c=BX.cur;if(!c||c==='404')return;const u=link(c.code);if(navigator.clipboard)navigator.clipboard.writeText(u).then(()=>toast(R('Ссылка скопирована','Link copied')),()=>prompt('Link',u));else prompt('Link',u)};
window.bxShare=()=>{const c=BX.cur;if(!c||c==='404')return;const u={title:c.name+' — TSK Esports',text:c.name,url:link(c.code)};if(navigator.share)navigator.share(u).catch(()=>{});else bxCopy()};
window.bxTeam=id=>{const c=BX.cur;if(!c||c==='404')return;const t=(dOf(c).teams||[]).find(z=>z.id==id);if(!t)return;const x=siteTm(t);if(x)return window.openT(x.id);
 modal(`<div class="bx"><div style="display:flex;align-items:center;gap:10px">${lg(t,'h-10 w-10')}<h3 class="font-head font-black text-lg" style="min-width:0;word-break:break-word">${esc(t.name)}</h3></div><div class="bx-note w">${R('Этой команды нет на сайте — её добавил автор сетки','This team isn’t on the site — it was added by the bracket author')}${ownNick(c)?` (${esc(ownNick(c))})`:''}.</div><button class="btn k" style="margin-top:12px;width:100%" onclick="closeM()">${R('Понятно','Got it')}</button></div>`)};
window.bxNew=()=>{if(!S.me)return authModal();if(typeof isBanned=='function'&&isBanned())return;edOpen(null)};
window.bxEdit=()=>{const c=BX.cur;if(own(c))edOpen(c)};
const _go=window.go;window.go=k=>{if(k=='brk'){brkGo();return}_go(k)};
setInterval(async()=>{if(document.hidden||S.tab!='brk'||BX.view!='view'||!BX.code||$('#m').innerHTML||document.getElementById('bx-ed'))return;try{const r=await A.code(BX.code);if(r&&JSON.stringify(r)!==JSON.stringify(BX.cur)){BX.cur=r;paint()}}catch{}},15000);

/* ---------- ввод счёта ---------- */
const findM=k=>{const s=calc(dOf(BX.cur));return s?{s,m:s.all.find(x=>x.k==k)}:{}},num=v=>{v=String(v).trim();if(v==='')return null;const n=Math.floor(+v);return isFinite(n)&&n>=0&&n<=99?n:null};
window.bxScore=k=>{const c=BX.cur;if(!own(c))return;const{s,m}=findM(k);if(!m||!m.a||!m.b||m.bye)return;const r=m.res||{};
 modal(`<div class="bx"><h3 class="font-head font-black text-lg">${esc(mname(m,s))}</h3><div class="bx-sm">${[['a',m.a,'bx-sa'],['b',m.b,'bx-sb']].map(([x,t,id])=>`<div class="bx-sx">${lg(t,'h-8 w-8')}<b>${esc(t.name)}</b><input class="inp" id="${id}" type="number" inputmode="numeric" min="0" max="99" value="${r[x]!==undefined&&r[x]!==null?esc(r[x]):''}" placeholder="0"></div>`).join('')}</div>
 <div class="bx-pr">${['1:0','0:1','2:0','2:1','1:2','0:2','3:0','3:1','3:2','2:3','1:3','0:3'].map(p=>`<button class="btn k" onclick="bxPre('${p}')">${p}</button>`).join('')}</div>
 <label class="bx-sm" style="margin-top:12px"><span style="font-size:11px;opacity:.7">${R('Или победа без счёта (неявка, тех. победа)','Or a win without a score (walkover)')}</span><select class="inp" id="bx-sw" style="margin:0"><option value="">—</option><option value="a" ${r.w==='a'?'selected':''}>${esc(m.a.name)}</option><option value="b" ${r.w==='b'?'selected':''}>${esc(m.b.name)}</option></select></label>
 <div class="grid grid-cols-2 gap-2 mt-3"><button class="btn" onclick="bxScoreSave('${k}')">${ic('check')} ${R('Сохранить','Save')}</button>${m.res?`<button class="btn r" onclick="bxScoreClear('${k}')">${R('Очистить','Clear')}</button>`:`<button class="btn k" onclick="closeM()">${R('Отмена','Cancel')}</button>`}</div></div>`);
 setTimeout(()=>{const i=document.getElementById('bx-sa');if(i&&!i.value)i.focus()},60)};
window.bxPre=p=>{const[a,b]=p.split(':');document.getElementById('bx-sa').value=a;document.getElementById('bx-sb').value=b;document.getElementById('bx-sw').value=''};
const persistData=async d=>{const c=BX.cur;try{const r=await A.save({data:d},c.id);BX.cur=r;BX.mine=null;BX.pub=null;closeM();paint();return true}catch(e){toast(errTxt(e),5000);return false}};
window.bxScoreSave=async k=>{const c=BX.cur,{s,m}=findM(k);if(!own(c)||!m)return;const d=JSON.parse(JSON.stringify(dOf(c))),a=num(document.getElementById('bx-sa').value),b=num(document.getElementById('bx-sb').value),w=document.getElementById('bx-sw').value;
 d.res=d.res||{};if(w)d.res[k]={a:a===null?'':a,b:b===null?'':b,ai:m.a.id,bi:m.b.id,w};
 else{if(a===null||b===null)return toast(R('Укажи счёт обеих команд или выбери победителя','Enter both scores or pick a winner'));if(a===b)return toast(R('Ничьей быть не может — измени счёт или выбери победителя','No draws — change the score or pick a winner'));d.res[k]={a,b,ai:m.a.id,bi:m.b.id}}
 const before=Object.keys(dOf(c).res||{}).length;prune(d);if(m.w&&Object.keys(d.res).length<before&&!confirm(R('Изменение результата сбросит результаты следующих матчей. Продолжить?','Changing this result will reset the following matches. Continue?')))return;
 await persistData(d)};
window.bxScoreClear=async k=>{const c=BX.cur;if(!own(c))return;const d=JSON.parse(JSON.stringify(dOf(c)));if(d.res)delete d.res[k];prune(d);await persistData(d)};

/* ---------- доступ: приватная / по приглашению / публичная ---------- */
const visPayload=(choice,orig)=>{const approved=!!(orig&&orig.visibility=='public'&&orig.pub_req=='approved');
 if(choice=='public'){if(approved)return{visibility:'public',pub_req:'approved'};return{visibility:orig&&orig.visibility!='public'?orig.visibility:'invite',pub_req:'pending'}}
 return{visibility:choice,pub_req:'none'}},
curChoice=c=>c?(c.visibility=='public'||c.pub_req=='pending'?'public':c.visibility):'private',
visBox=(sel,fn)=>`<div class="bx-vis">${['private','invite','public'].map(k=>{const v=VISF()[k];return`<button type="button" class="bx-vo ${sel==k?'on':''}" onclick="${fn}('${k}')">${ic(v[0])}<span><b>${v[1]}</b><small>${v[2]}</small></span></button>`}).join('')}</div>`;
let AC='private';
window.bxAccess=()=>{const c=BX.cur;if(!own(c))return;AC=curChoice(c);accPaint()};
const accPaint=()=>{const c=BX.cur;modal(`<div class="bx"><h3 class="font-head font-black text-lg">${R('Доступ к сетке','Bracket access')}</h3><div style="margin-top:12px">${visBox(AC,'bxAccPick')}</div>${AC=='public'&&!(c.visibility=='public'&&c.pub_req=='approved')?`<div class="bx-note w">${R('Администрация проверит сетку. До одобрения она доступна по ссылке-приглашению.','Staff will review the bracket. Until approved it is available by invite link.')}</div>`:''}<div class="grid grid-cols-2 gap-2 mt-3"><button class="btn" onclick="bxAccSave()">${ic('check')} ${R('Сохранить','Save')}</button><button class="btn k" onclick="closeM()">${R('Отмена','Cancel')}</button></div></div>`)};
window.bxAccPick=k=>{AC=k;accPaint()};
window.bxAccSave=async()=>{const c=BX.cur;try{const r=await A.save(visPayload(AC,c),c.id);BX.cur=r;BX.mine=null;BX.pub=null;closeM();toast(AC=='public'&&r.pub_req=='pending'?R('Отправлено на проверку','Sent for review'):R('Сохранено','Saved'));paint()}catch(e){toast(errTxt(e),5000)}};

/* ---------- редактор ---------- */
let BE=null;const MAXT=64,EL=()=>document.getElementById('bx-ed'),
sig=d=>JSON.stringify([(d.teams||[]).map(t=>[t.id,t.name,t.logo||''])]);
function edOpen(c){const d=c?JSON.parse(JSON.stringify(dOf(c))):{};
 BE={id:c?c.id:null,orig:c||null,name:c?c.name:'',game:c?c.game||'':'Brawl Stars',descr:c?c.descr||'':'',choice:curChoice(c),teams:(d.teams||[]).map(t=>({id:t.id||uid(),name:t.name||'',logo:t.logo||'',site:t.site||''})),third:!!d.third,res:d.res||{},dirty:false,site:false,bulk:false,busy:false};
 let o=EL();if(!o){o=document.createElement('div');o.id='bx-ed';o.className='tn-page tn-ov bx-ov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');document.body.appendChild(o);document.body.classList.add('bx-open');document.documentElement.style.overflow='hidden';o.addEventListener('input',()=>{BE.dirty=true;window.bxLive&&bxLive()})}
 edPaint();if(!c)setTimeout(()=>{const i=document.getElementById('bx-name');i&&i.focus()},80)}
function edClose(force){if(!force&&BE&&BE.dirty&&!confirm(R('Закрыть без сохранения? Изменения пропадут.','Close without saving? Changes will be lost.')))return;const o=EL();if(o)o.remove();document.body.classList.remove('bx-open');document.documentElement.style.overflow='';BE=null}
window.bxEdClose=()=>edClose();
const draftCalc=()=>calc({teams:BE.teams.filter(t=>t.name.trim()),third:BE.third,res:BE.res}),
trH=(t,i)=>`<div class="bx-tr${DUP[clean(t.name).toLowerCase()]>1?' dup':''}"><span class="bx-sd">${i+1}</span><label class="bx-av ${t.up?'ld':''}" title="${esc(R('Загрузить логотип','Upload logo'))}">${lg({name:t.name||'?',logo:t.logo,id:t.id},'h-9 w-9')}<input type="file" accept="image/*" onchange="bxLogo(${i},this)"></label><input class="inp" data-ti="${i}" maxlength="30" value="${esc(t.name)}" placeholder="${esc(R('Название команды','Team name'))}" oninput="BE_.teams[${i}].name=this.value" onkeydown="if(event.key=='Enter'){event.preventDefault();document.getElementById('bx-add').focus()}"><div class="bx-ac">${t.logo?`<button class="bx-ib u2" title="${esc(R('Убрать логотип','Remove logo'))}" onclick="bxTm(${i},'nologo')">${ic('minus')}</button>`:''}<button class="bx-ib" ${i?'':'disabled'} onclick="bxTm(${i},'up')">${ic('up')}</button><button class="bx-ib" ${i<BE.teams.length-1?'':'disabled'} onclick="bxTm(${i},'dn')">${ic('dn')}</button><button class="bx-ib d" onclick="bxTm(${i},'del')">${ic('trash')}</button></div></div>`,
siteList=q=>{q=String(q||'').toLowerCase();const have=new Set(BE.teams.map(t=>t.site).filter(Boolean)),L=(DB.teams||[]).filter(x=>!q||String(x.name).toLowerCase().includes(q)).sort((a,b)=>(b.pps||0)-(a.pps||0)).slice(0,40);
 return L.map(x=>`<div class="bx-sr">${lg(x,'h-7 w-7')}<span>${esc(x.name)}</span><button class="bx-ib" ${have.has(x.id)||BE.teams.length>=MAXT?'disabled':''} onclick="bxSite('${esc(x.id)}')">${ic('plus')}</button></div>`).join('')||`<div class="bx-sum">${t('none')}</div>`};
let DUP={};
const dupSet=()=>{const m={};BE.teams.forEach(t=>{const k=clean(t.name).toLowerCase();if(k)m[k]=(m[k]||0)+1});return m},
stat=()=>{const nm=clean(BE.name).length>=2,n=BE.teams.filter(t=>clean(t.name)).length,miss=[];if(!nm)miss.push(R('название','a name'));if(n<2)miss.push(n==1?R('ещё 1 команду','1 more team'):R('минимум 2 команды','at least 2 teams'));return{nm,n,ok:!miss.length,miss}},
statTxt=s=>{if(!s.ok)return R('Не хватает: ','Missing: ')+s.miss.join(', ');const ct=draftCalc();return'✓ '+R('Всё готово','All set')+(ct?` · ${ct.n} ${R('команд','teams')}, ${ct.total} ${R('матчей','matches')}`:'')},
stepsHtml=s=>[[R('Название','Name'),s.nm],[R('Команды','Teams'),s.n>=2],[R('Готово','Ready'),s.ok]].map((x,i)=>`<div class="bx-st ${x[1]?'ok':''}"><b>${x[1]?ic('check'):i+1}</b><span>${x[0]}</span></div>`).join('<em></em>'),
pvHtml=()=>{const ct=draftCalc();if(!ct)return`<div class="bx-sum" style="margin:0">${R('Добавь минимум 2 команды — здесь появится сетка.','Add at least 2 teams — the bracket preview will appear here.')}</div>`;
 const L=BE.teams.filter(t=>t.name.trim()),sd=x=>x?L.findIndex(z=>z.id==x.id)+1:0,nm=x=>x?`<em>№${sd(x)}</em>${esc(x.name)}`:'—';
 return`<div class="bx-kv"><b>${ct.n}</b> ${R('команд','teams')} → <b>${ct.R0}</b> ${R('раунд(ов)','round(s)')}, <b>${ct.total}</b> ${R('матчей','matches')}${ct.byes?`, <b>${ct.byes}</b> ${R('автопроход(ов)','bye(s)')}`:''}<br>${R('Первый раунд','First round')}: <b>${esc(rn(0,ct.R0))}</b></div><div class="bx-pv">${ct.rounds[0].map(m=>m.bye?`<div class="bx-pm bye"><span>${nm(m.w)}</span><i>${R('автопроход','bye')}</i><span></span></div>`:`<div class="bx-pm"><span>${nm(m.a)}</span><i>vs</i><span>${nm(m.b)}</span></div>`).join('')}</div>`};
window.bxLive=()=>{if(!BE)return;const o=EL();if(!o)return;const s=stat(),q=x=>o.querySelector(x),g=q('#bx-stat'),bt=q('#bx-go'),p=q('#bx-pv'),h=q('#bx-ttl'),st=q('#bx-steps'),nc=q('#bx-nc'),dc=q('#bx-dc');
 if(g){g.className='bx-bst'+(s.ok?' ok':'');g.textContent=statTxt(s)}
 if(bt)bt.disabled=!s.ok||BE.busy;
 if(p)p.innerHTML=pvHtml();
 if(h)h.textContent=BE.name||R('Без названия','Untitled');
 if(st)st.innerHTML=stepsHtml(s);
 if(nc)nc.textContent=String(BE.name||'').length+'/60';
 if(dc)dc.textContent=String(BE.descr||'').length+'/300'};
window.bxQuick=k=>{for(let i=1;i<=k;i++)addTeam(R('Команда ','Team ')+i);edPaint()};
window.bxClear=()=>{if(!BE.teams.length)return;if(!confirm(R('Удалить все команды из списка?','Remove all teams from the list?')))return;BE.teams=[];BE.res={};BE.dirty=true;edPaint()};
const secH=(num,title,hint,done)=>`<div class="bx-sh"><span class="bx-nm ${done?'ok':''}">${done?ic('check'):num}</span><div><h3>${title}</h3><p>${hint}</p></div></div>`;
function edPaint(){const o=EL();if(!o||!BE)return;const old=o.querySelector('.tn-ovb'),st=old?old.scrollTop:0,n=BE.teams.length,orig=BE.orig,s=stat(),
 appr=!!(orig&&orig.visibility=='public'&&orig.pub_req=='approved');DUP=dupSet();const hasDup=Object.values(DUP).some(v=>v>1);
 o.innerHTML=`<div class="tn-ovh"><div class="tn-ovt"><span class="tn-tag">${BE.id?R('Редактирование','Editing'):R('Новая сетка','New bracket')}</span><h2 class="tn-ovn font-head" id="bx-ttl">${esc(BE.name||R('Без названия','Untitled'))}</h2></div><button class="tn-ovx" aria-label="${R('Закрыть','Close')}" onclick="bxEdClose()">${ic('x')}</button></div>
 <div class="tn-ovb"><div class="bx-ovb">
 <div class="bx-steps" id="bx-steps">${stepsHtml(s)}</div>
 <div class="bx-sec">${secH(1,R('Основное','Basics'),R('Как назвать турнир и что о нём рассказать.','Name your tournament and describe it.'),s.nm)}
  <label class="f">${R('Название турнира','Tournament name')}<span class="bx-req">*</span><span class="bx-c" id="bx-nc">${String(BE.name||'').length}/60</span><input id="bx-name" class="inp" maxlength="60" value="${esc(BE.name)}" placeholder="${esc(R('Например: Весенний кубок TSK','e.g. Spring Cup'))}" oninput="BE_.name=this.value"></label>
  <label class="f">${R('Описание (необязательно)','Description (optional)')}<span class="bx-c" id="bx-dc">${String(BE.descr||'').length}/300</span><textarea class="inp" rows="2" maxlength="300" oninput="BE_.descr=this.value" placeholder="${esc(R('Даты, призы, правила, ссылка на чат…','Dates, prizes, rules, chat link…'))}">${esc(BE.descr)}</textarea></label></div>
 <div class="bx-sec">${secH(2,`${R('Команды','Teams')} · <span id="bx-cnt">${n}</span>/${MAXT}`,R('Впиши названия по одному, вставь списком или выбери команды сайта.','Type names one by one, paste a list or pick site teams.'),s.n>=2)}
  <div class="bx-addrow"><input id="bx-add" class="inp" maxlength="30" placeholder="${esc(R('Название команды и Enter — добавить','Team name, Enter to add'))}" onkeydown="if(event.key=='Enter'){event.preventDefault();bxAdd(this.value)}"><button class="btn" aria-label="${R('Добавить','Add')}" onclick="bxAdd(document.getElementById('bx-add').value)">${ic('plus')}</button></div>
  ${n?'':`<div class="bx-quick"><span>${R('Быстрый старт','Quick start')}:</span>${[4,8,16,32].map(k=>`<button class="btn k" onclick="bxQuick(${k})">${k}</button>`).join('')}<span>${R('команд — потом переименуешь','teams — rename them later')}</span></div>`}
  <div class="bx-tools"><button class="btn k ${BE.bulk?'on':''}" onclick="BE_.bulk=!BE_.bulk;bxRe()">${R('Вставить списком','Paste a list')}</button><button class="btn k ${BE.site?'on':''}" onclick="BE_.site=!BE_.site;bxRe()">${R('Команды с сайта','Site teams')}</button><button class="btn k" onclick="bxShuffle()" ${n<3?'disabled':''}>${ic('swap')} ${R('Перемешать','Shuffle')}</button>${n?`<button class="btn k" onclick="bxClear()">${ic('trash')} ${R('Очистить','Clear')}</button>`:''}</div>
  ${BE.bulk?`<div style="margin-top:10px"><textarea id="bx-bulk" class="inp" rows="5" placeholder="${esc(R('По одной команде на строку (или через запятую)','One team per line (or comma separated)'))}"></textarea><button class="btn" style="margin-top:8px" onclick="bxBulk()">${ic('plus')} ${R('Добавить всех','Add all')}</button></div>`:''}
  ${BE.site?`<div style="margin-top:10px"><input class="inp" placeholder="${esc(R('Поиск команды сайта','Search site teams'))}" oninput="bxSiteQ(this.value)"><div class="bx-sl" id="bx-sl">${siteList('')}</div></div>`:''}
  <div class="bx-tl">${BE.teams.map(trH).join('')}</div>
  ${hasDup?`<div class="bx-note w">${R('Есть команды с одинаковыми названиями (подсвечены красным).','Some teams share a name (highlighted in red).')}</div>`:''}
  ${n?`<div class="bx-sum">${R('Порядок = посев. №1 играет с самой слабой командой, №2 — с предпоследней и т.д. Стрелками меняй порядок или нажми «Перемешать» для случайной жеребьёвки. Если команд не степень двойки, сильнейшие проходят первый раунд без игры.','Order = seeding. #1 meets the weakest team, #2 the second weakest, etc. Use arrows to reorder or hit “Shuffle” for a random draw. If the team count is not a power of two, top seeds skip the first round.')}</div>`:`<div class="bx-sum">${R('Логотип — нажми на кружок рядом с командой.','Logo — tap the circle next to a team.')}</div>`}</div>
 <div class="bx-sec">${secH(3,R('Сетка','Bracket'),R('Так выглядит первый раунд. Обновляется сразу.','This is the first round. Updates instantly.'),s.n>=2)}
  <div id="bx-pv">${pvHtml()}</div>
  <label class="bx-opt"><input type="checkbox" ${BE.third?'checked':''} ${n<4?'disabled':''} onchange="BE_.third=this.checked;BE_.dirty=true;bxRe()"><span><b>${R('Матч за 3-е место','Third place match')}</b><small>${R('Проигравшие в полуфиналах сыграют за бронзу. Нужно от 4 команд.','Semifinal losers play for bronze. Needs 4+ teams.')}</small></span></label>
  ${Object.keys(BE.res).length?`<button class="btn k" style="margin-top:10px" onclick="bxResetRes()">${R('Сбросить все результаты','Reset all results')}</button>`:''}</div>
 <div class="bx-sec">${secH(4,R('Доступ','Access'),R('Кто увидит сетку. Это можно поменять позже.','Who can see the bracket. You can change it later.'),true)}${visBox(BE.choice,'bxEdVis')}${BE.choice=='public'&&!appr?`<div class="bx-note w">${R('Публичной сетка станет после одобрения администрации. До этого она доступна по ссылке-приглашению.','The bracket goes public after staff approval. Until then it is available by invite link.')}</div>`:''}${appr?`<div class="bx-note">${R('Сетка опубликована. Если изменить название, описание или состав команд — она уйдёт на повторную проверку (счёт можно менять свободно).','The bracket is published. Changing the name, description or teams sends it for re-review (scores can be changed freely).')}</div>`:''}${orig&&orig.pub_req=='rejected'?`<div class="bx-note e">${R('Прошлая заявка отклонена','Previous request declined')}${orig.pub_note?': '+esc(orig.pub_note):''}</div>`:''}</div>
 ${BE.id?`<div class="bx-sec"><h3>${R('Опасная зона','Danger zone')}</h3><button class="btn r" onclick="bxDelete()">${ic('trash')} ${R('Удалить сетку','Delete bracket')}</button></div>`:''}
 </div></div><div class="bx-bar"><div class="bx-bst${s.ok?' ok':''}" id="bx-stat">${statTxt(s)}</div><div class="bx-bb"><button class="btn k" onclick="bxEdClose()">${R('Отмена','Cancel')}</button><button class="btn" id="bx-go" onclick="bxSave()" ${!s.ok||BE.busy?'disabled':''}>${ic('check')} ${BE.id?R('Сохранить','Save'):R('Создать сетку','Create bracket')}</button></div></div>`;
 const nb=o.querySelector('.tn-ovb');if(nb)nb.scrollTop=st}
window.BE_=new Proxy({},{get:(_,k)=>BE&&BE[k],set:(_,k,v)=>{if(BE)BE[k]=v;return true}});
window.bxRe=edPaint;
window.bxEdVis=k=>{BE.choice=k;BE.dirty=true;edPaint()};
const addTeam=(name,extra)=>{name=clean(name).slice(0,30);if(!name)return false;if(BE.teams.length>=MAXT){toast(R('Максимум 64 команды','Max 64 teams'));return false}BE.teams.push({id:uid(),name,logo:'',...(extra||{})});BE.dirty=true;return true};
window.bxAdd=v=>{if(addTeam(v)){edPaint();const i=document.getElementById('bx-add');i&&i.focus()}};
window.bxBulk=()=>{const v=document.getElementById('bx-bulk').value;let c=0;v.split(/[\n,;]+/).forEach(x=>{if(addTeam(x))c++});BE.bulk=false;edPaint();if(c)toast(R('Добавлено','Added')+': '+c)};
window.bxSite=id=>{const x=(DB.teams||[]).find(z=>z.id==id);if(!x)return;if(addTeam(x.name,{site:x.id,logo:su(x.logo||'')})){const q=document.querySelector('#bx-sl');edPaint()}};
window.bxSiteQ=v=>{const e=document.getElementById('bx-sl');if(e)e.innerHTML=siteList(v)};
window.bxShuffle=()=>{const a=BE.teams;for(let i=a.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[a[i],a[j]]=[a[j],a[i]]}BE.dirty=true;edPaint()};
window.bxTm=(i,op)=>{const a=BE.teams;if(op=='del')a.splice(i,1);else if(op=='nologo')a[i].logo='';else{const j=op=='up'?i-1:i+1;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]]}BE.dirty=true;edPaint()};
window.bxResetRes=()=>{if(!confirm(R('Сбросить все введённые результаты?','Reset all entered results?')))return;BE.res={};BE.dirty=true;edPaint()};
window.bxLogo=async(i,inp)=>{const f=inp.files&&inp.files[0],t=BE.teams[i];inp.value='';if(!f||!t)return;
 if(!/^image\//.test(f.type)||f.size>8e6)return toast(R('Нужна картинка до 8 МБ','Image up to 8 MB'));
 t.up=1;edPaint();
 try{const p=await imgPack(f,256);if(p.size>2e6)throw new Error(R('Картинка слишком большая','Image too large'));
  if(sb){const pth='brackets/'+me()+'/'+uid()+'-'+String(p.name||'logo.png').replace(/[^\w.]/g,'_'),u=await sb.storage.from('media').upload(pth,p);if(u.error)throw u.error;t.logo=sb.storage.from('media').getPublicUrl(pth).data.publicUrl}
  else t.logo=await new Promise((y,n)=>{const fr=new FileReader();fr.onload=()=>y(fr.result);fr.onerror=n;fr.readAsDataURL(p)});
  BE.dirty=true}catch(e){toast(errTxt(e)||R('Не удалось загрузить логотип','Logo upload failed'),5000)}
 t.up=0;if(BE)edPaint()};
window.bxSave=async()=>{if(!BE||BE.busy)return;const name=clean(BE.name).slice(0,60);if(name.length<2)return toast(R('Укажи название турнира','Enter the tournament name'));
 if(BE.teams.filter(t=>clean(t.name)).length<2)return toast(R('Добавь минимум 2 команды','Add at least 2 teams'));
 const teams=BE.teams.map(t=>{const nm=clean(t.name).slice(0,30),st=t.site&&(DB.teams||[]).find(z=>z.id==t.site),ok=st&&String(st.name).trim().toLowerCase()==nm.toLowerCase();return{id:t.id,name:nm,logo:su(t.logo||''),...(ok?{site:t.site}:{})}}).filter(t=>t.name);
 if(new Set(teams.map(t=>t.name.toLowerCase())).size<teams.length&&!confirm(R('Есть команды с одинаковыми названиями. Всё равно сохранить?','Some teams share a name. Save anyway?')))return;
 const d=prune({v:1,teams,third:BE.third&&teams.length>=4,res:BE.res}),o=BE.orig,appr=!!(o&&o.visibility=='public'&&o.pub_req=='approved'),
 vp=visPayload(BE.choice,o);
 if(appr&&BE.choice=='public'&&(sig(d)!==sig(dOf(o))||name!==o.name||clean(BE.descr)!==(o.descr||''))&&!confirm(R('Опубликованная сетка уйдёт на повторную проверку. Продолжить?','The published bracket will go back for review. Continue?')))return;
 if(!BE.id&&!RL('bxnew',3,60000))return toast(R('Слишком часто. Подожди минуту','Too fast. Wait a minute'));
 BE.busy=true;edPaint();
 try{const row={name,game:'Brawl Stars',descr:clean(BE.descr).slice(0,300),data:d,...vp},r=await A.save(row,BE.id);
  BX.mine=null;BX.pub=null;edClose(true);BX.cur=r;BX.view='view';BX.code=r.code;S.tab='brk';push('#/bk/'+r.code);ui();
  toast(r.pub_req=='pending'?R('Сохранено. Публикация отправлена на проверку','Saved. Publishing request sent for review'):R('Сохранено','Saved'),3200)}
 catch(e){if(BE){BE.busy=false;edPaint()}toast(errTxt(e),6000)}};
window.bxDelete=async()=>{if(!BE||!BE.id||!confirm(R('Удалить сетку навсегда?','Delete this bracket forever?')))return;try{await A.del(BE.id);edClose(true);BX.mine=null;BX.pub=null;toast(R('Удалено','Deleted'));brkGo()}catch(e){toast(errTxt(e),5000)}};

/* ---------- админка: модерация публичных сеток ---------- */
const admLoad=()=>{if(!isStaff())return;A.adm().then(r=>{BX.admL=r;BX.pend=r.filter(x=>x.pub_req=='pending').length;if(S.tab=='admin'&&(S.sec=='brk'||S.sec=='apps')&&!$('#m').innerHTML)render(true)}).catch(e=>{BX.admL=[];BX.err=errTxt(e);if(S.tab=='admin'&&(S.sec=='brk'||S.sec=='apps'))render(true)})};
const pendPoll=()=>{if(!isStaff()||document.hidden)return;A.pendN().then(n=>{if(n!==BX.pend){BX.pend=n;BX.admL=null;if(S.tab=='admin'&&!$('#m').innerHTML)render(true)}}).catch(()=>{})};
setInterval(pendPoll,6e4);setTimeout(pendPoll,4000);
window.brkPanel=(secs,k)=>{if(BX.admL===null){BX.admL=undefined;admLoad()}const L=BX.admL||[],f=BX.adm,F=L.filter(x=>f=='all'||(f=='pending'&&x.pub_req=='pending')||(f=='approved'&&x.pub_req=='approved')||(f=='rejected'&&x.pub_req=='rejected')),
 fb=(v,l,n)=>`<button class="btn ${f==v?'':'k'} shrink-0" onclick="BX_.adm='${v}';render(true)">${l} ${n}</button>`,cn=v=>L.filter(x=>x.pub_req==v).length;
 return`${admHead(secs,k)}<div class="hs mb-2">${fb('pending',R('Ожидают','Pending'),cn('pending'))}${fb('approved',R('Опубликованы','Published'),cn('approved'))}${fb('rejected',R('Отклонены','Declined'),cn('rejected'))}${fb('all',R('Все','All'),L.length)}</div>
 ${BX.err&&!L.length?`<div class="g p-3 text-sm">${esc(BX.err)}</div>`:''}${BX.admL===undefined?SKL.rows(3):''}
 <div class="grid gap-1.5">${F.map(x=>{const{s,n}=summary(x);return`<div class="g p-2.5"><div class="flex items-center gap-2"><div class="min-w-0 flex-1"><b class="block truncate text-sm">${esc(x.name)}</b><div class="text-[11px] k-t4 truncate">${esc(ownNick(x)||'—')} · ${n} ${R('команд','teams')}${s?' · '+s.played+'/'+s.total:''} · ${new Date(x.updated_at).toLocaleDateString()}</div></div><span class="text-[10px] font-bold uppercase ${x.pub_req=='pending'?'kc-gd':x.pub_req=='approved'?'kc-cy':'kc-rd'}">${x.pub_req=='pending'?R('ждёт','pending'):x.pub_req=='approved'?R('опубл.','live'):R('отказ','declined')}</span></div>${x.pub_note?`<div class="text-[11px] k-t4 mt-1">${esc(x.pub_note)}</div>`:''}<div class="flex flex-wrap gap-1.5 mt-2"><button class="btn k !py-1.5 !px-3 text-[12px]" onclick="bxOpen('${esc(x.code)}')">${R('Открыть','Open')}</button>${x.pub_req!='approved'?`<button class="btn !py-1.5 !px-3 text-[12px]" onclick="bxRev('${esc(x.id)}',true)">${ic('check')} ${R('Одобрить','Approve')}</button>`:''}<button class="btn r !py-1.5 !px-3 text-[12px]" onclick="bxRejectDlg('${esc(x.id)}')">${x.pub_req=='approved'?R('Снять','Unpublish'):R('Отклонить','Decline')}</button><button class="btn k !py-1.5 !px-3 text-[12px]" onclick="bxAdmDel('${esc(x.id)}')">${ic('trash')}</button></div></div>`}).join('')||(BX.admL===undefined?'':`${EMP.mini(t('none'))}`)}</div>`};
window.brkAppsBlock=()=>{if(!isStaff())return'';if(BX.admL===null){BX.admL=undefined;admLoad()}const P=(BX.admL||[]).filter(x=>x.pub_req=='pending');if(!P.length)return'';
 return`<div class="mb-3"><div class="font-head font-black text-[13px] uppercase tracking-wider mb-1.5">${ic('tourn')} ${R('Заявки на публичные сетки','Public bracket requests')} · ${P.length}</div><div class="grid gap-1.5">${P.map(x=>{const{s,n}=summary(x);return`<div class="g p-2.5"><div class="min-w-0"><b class="block truncate text-sm">${esc(x.name)}</b><div class="text-[11px] k-t4 truncate">${esc(ownNick(x)||'—')} · ${n} ${R('команд','teams')} · ${new Date(x.updated_at).toLocaleDateString()}</div></div>${x.descr?`<div class="text-[11px] k-t4 mt-1">${esc(String(x.descr).slice(0,140))}</div>`:''}<div class="flex flex-wrap gap-1.5 mt-2"><button class="btn k !py-1.5 !px-3 text-[12px]" onclick="bxOpen('${esc(x.code)}')">${R('Открыть','Open')}</button><button class="btn !py-1.5 !px-3 text-[12px]" onclick="bxRev('${esc(x.id)}',true)">${ic('check')} ${R('Одобрить','Approve')}</button><button class="btn r !py-1.5 !px-3 text-[12px]" onclick="bxRejectDlg('${esc(x.id)}')">${R('Отклонить','Decline')}</button></div></div>`}).join('')}</div></div>`};
window.bxRev=async(id,ok,note)=>{try{await A.review(id,ok,note);toast(R('Готово','Done'));closeM();BX.admL=null;BX.pub=null;if(S.tab=='admin')render(true);else if(BX.view=='view'){const r=await A.code(BX.code);BX.cur=r||'404';paint()}}catch(e){toast(errTxt(e),5000)}};
window.bxRejectDlg=id=>modal(`<div class="bx"><h3 class="font-head font-black text-lg">${R('Причина (увидит автор)','Reason (the author will see it)')}</h3><textarea id="bx-rn" class="inp" rows="3" maxlength="200" placeholder="${esc(R('Например: неприемлемое название команды','e.g. inappropriate team name'))}"></textarea><div class="grid grid-cols-2 gap-2 mt-3"><button class="btn r" onclick="bxRev('${esc(id)}',false,clean(document.getElementById('bx-rn').value))">${R('Подтвердить','Confirm')}</button><button class="btn k" onclick="closeM()">${R('Отмена','Cancel')}</button></div></div>`);
window.bxAdmDel=async id=>{if(!confirm(R('Удалить сетку навсегда?','Delete this bracket forever?')))return;try{await A.del(id);toast(R('Удалено','Deleted'));BX.admL=null;BX.pub=null;render(true)}catch(e){toast(errTxt(e),5000)}};
})();
