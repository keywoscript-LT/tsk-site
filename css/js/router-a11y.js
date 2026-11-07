/* ===== v2: URL-роутинг, календарь, skeleton, a11y ===== */
(()=>{
$('#hl').src=L;
const ROUTES=['news','rank','players','matches','tourn','games','lfg','rules','about','privacy','terms'],
NK=new Set(ROUTES),o={go,openT,openP,ui,render},enc=encodeURIComponent;
let cur='',ENT=null;
const DESC0='TSK Esports — международная организация по Brawl Stars. Рейтинг команд PPS, расписание и результаты матчей, турниры, составы, поиск команды и переходы игроков.',TITLE0='TSK Esports — Brawl Stars: рейтинг команд, турниры и матчи';
const SITE=(()=>{const c=document.querySelector('link[rel=canonical]');try{const u=new URL(c.getAttribute('href'));return u.origin}catch(e){}return location.origin})();
const pathOf=(k,id)=>TSK_ROOT+(k=='news'&&!id?'':k+'/'+(id?enc(id)+'/':''));
const safeDec=x=>{try{return decodeURIComponent(x)}catch(e){return x}};
const rel=()=>safeDec(location.pathname).slice(TSK_ROOT.length).replace(/index\.html$/,'').replace(/^\/+|\/+$/g,'');
const parse=()=>{const p=rel().split('/');let k=p[0]||'',id=p.slice(1).join('/');
 if(!k){const m=location.hash.match(/^#\/([\w-]+)(?:\/(.+))?$/);if(m){k=m[1];id=m[2]?safeDec(m[2]):''}}
 return[k,id]};
const KNOWN=k=>NK.has(k)||k=='team'||k=='player';
const setH=h=>{cur=h;const m=h.match(/^#\/([\w-]+)(?:\/(.+))?$/);if(!m||!KNOWN(m[1]))return;
 const u=TSK_ROOT+'#/'+m[1]+(m[2]?'/'+m[2]:'');if(location.pathname+location.hash!==u){try{history.pushState(null,'',u)}catch(e){}}};

/* ---- мета-теги и JSON-LD текущей страницы ---- */
const strip=x=>String(x||'').replace(/\[[^\]]*\]/g,' ').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const clip=(x,n)=>{x=strip(x);return x.length>n?x.slice(0,n-1).replace(/\s+\S*$/,'')+'…':x};
const PAGES=()=>({
 rank:[R('Рейтинг команд Brawl Stars — PPS','Brawl Stars team ranking — PPS'),R('Актуальный рейтинг команд по системе PPS: очки, победы, поражения и форма за последние матчи.','Current team ranking by PPS: points, wins, losses and recent form.')],
 players:[R('Игроки Brawl Stars — рейтинг и составы','Brawl Stars players — ranking and rosters'),R('Профили игроков: PPS, команды, страны и история переходов.','Player profiles: PPS, teams, countries and transfer history.')],
 matches:[R('Матчи Brawl Stars — расписание и результаты','Brawl Stars matches — schedule and results'),R('Расписание ближайших матчей, live-результаты и архив игр с прогнозами.','Upcoming schedule, live results and match archive with predictions.')],
 tourn:[R('Турниры Brawl Stars — сетки и победители','Brawl Stars tournaments — brackets and winners'),R('Турнирные сетки, групповые этапы, плей-офф и победители турниров.','Tournament brackets, group stages, playoffs and winners.')],
 games:[R('Мини-игры','Mini-games'),R('Мини-игры сообщества TSK Esports.','TSK Esports community mini-games.')],
 lfg:[R('Поиск команды Brawl Stars — игроки и составы','Find a Brawl Stars team — players and rosters'),R('Ищешь команду или игроков? Анкеты свободных игроков и команды, которые набирают состав.','Looking for a team or players? Free agents and teams that are recruiting.')],
 rules:[R('Правила турниров и сообщества','Tournament and community rules'),R('Правила участия в турнирах и поведения в сообществе TSK Esports.','Rules for tournaments and community conduct.')],
 about:[R('О TSK Esports','About TSK Esports'),R('Кто мы, чем занимаемся и как с нами связаться: игроки, партнёры, спонсоры.','Who we are, what we do and how to reach us: players, partners, sponsors.')],
 privacy:[R('Политика конфиденциальности','Privacy policy'),R('Какие данные мы собираем и как их используем.','What data we collect and how we use it.')],
 terms:[R('Условия использования','Terms of use'),R('Правила пользования сайтом TSK Esports.','Terms for using the TSK Esports website.')]});
function curMeta(){
 if(ENT&&ENT.k=='player'){const p=DB.players.find(z=>z.id==ENT.id);if(p){const tm=DB.teams.find(z=>z.id==p.team);
  return{k:'player',id:ENT.id,title:p.nick+R(' — игрок Brawl Stars',' — Brawl Stars player'),
   desc:p.nick+(tm?R(' играет за ',' plays for ')+tm.name+'. ':'. ')+(p.pps||0)+' PPS. '+R('Профиль игрока, команда и история переходов.','Player profile, team and transfer history.'),
   ld:{'@type':'Person',name:p.nick,url:SITE+pathOf('player',ENT.id),description:p.nick+' — Brawl Stars',memberOf:tm?{'@type':'SportsTeam',name:tm.name}:undefined}}}}
 if(ENT&&ENT.k=='news'){const n=DB.news.find(z=>z.id==ENT.id);if(n){
  return{k:'news',id:ENT.id,title:n.title||'TSK Esports',desc:clip(n.summary||n.body,155)||DESC0,
   img:/^https?:/.test(n.img||'')?n.img:'',
   ld:{'@type':'NewsArticle',headline:n.title,datePublished:n.when,image:/^https?:/.test(n.img||'')?[n.img]:undefined,mainEntityOfPage:SITE+pathOf('news',ENT.id),publisher:{'@type':'Organization',name:'TSK Esports',logo:{'@type':'ImageObject',url:SITE+TSK_ROOT+'icon-192.png'}}}}}}
 if(S.tab=='team'&&S.tid){const x=DB.teams.find(z=>z.id==S.tid);if(x){
  return{k:'team',id:S.tid,title:x.name+R(' — состав, рейтинг PPS и матчи',' — roster, PPS rating and matches'),
   desc:x.name+': '+(x.pps||0)+' PPS, '+(x.w||0)+' '+R('побед','wins')+' / '+(x.l||0)+' '+R('поражений','losses')+'. '+R('Состав, история матчей и переходов игроков.','Roster, match history and player transfers.'),
   ld:{'@type':'SportsTeam',name:x.name,sport:'Brawl Stars',url:SITE+pathOf('team',S.tid),description:x.name+' — Brawl Stars'}}}
  return{k:'team',id:S.tid,title:R('Команда','Team'),desc:DESC0}}
 const P=PAGES()[S.tab];
 if(P&&NK.has(S.tab))return{k:S.tab,id:'',title:P[0],desc:P[1]};
 if(!NK.has(S.tab))return{k:'',id:'',title:TITLE0,desc:DESC0,noindex:true};
 return{k:'news',id:'',title:TITLE0,desc:DESC0,home:true}}
let _sig='';
function seoNow(){let m;try{m=curMeta()}catch(e){return}
 const url=SITE+((m.k=='news'&&!m.id)||!m.k?TSK_ROOT:pathOf(m.k,m.id));
 const full=m.home||m.title==TITLE0?TITLE0:m.title+' — TSK Esports';
 const sg=[full,m.desc,url,m.img,!!m.noindex].join('|');if(sg===_sig)return;_sig=sg;
 document.title=full;
 const set=(sel,attr,val)=>{const e=document.querySelector(sel);if(e)e.setAttribute(attr,val)};
 set('meta[name=description]','content',m.desc);
 set('link[rel=canonical]','href',url);
 set('meta[property="og:url"]','content',url);
 set('meta[property="og:title"]','content',full);
 set('meta[property="og:description"]','content',m.desc);
 set('meta[name="twitter:title"]','content',full);
 set('meta[name="twitter:description"]','content',m.desc);
 if(m.img){set('meta[property="og:image"]','content',m.img);set('meta[name="twitter:image"]','content',m.img)}
 else{const d=SITE+TSK_ROOT+'og-image.png';set('meta[property="og:image"]','content',d);set('meta[name="twitter:image"]','content',d)}
 set('meta[name=robots]','content',m.noindex?'noindex,nofollow':'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
 let ld=document.getElementById('ld-page');
 if(m.ld){if(!ld){ld=document.createElement('script');ld.type='application/ld+json';ld.id='ld-page';document.head.appendChild(ld)}
  ld.textContent=JSON.stringify(Object.assign({'@context':'https://schema.org'},m.ld))}
 else if(ld)ld.remove()}

window.go=k=>{if(k=='more'){window.moreMenu&&moreMenu();return}ENT=null;o.go(k);setH('#/'+k);seoNow()};
window.openT=id=>{o.openT(id);ENT=null;setH('#/team/'+enc(id));seoNow()};
window.openP=id=>{o.openP(id);const p=DB.players.find(z=>z.id==id);if(p){ENT={k:'player',id};setH('#/player/'+enc(id));seoNow()}};
window.ui=function(){o.ui();document.documentElement.lang=S.lang;seoNow()};
const tryP=(id,n=40)=>{if(DB.players.some(p=>p.id==id)){o.openP(id);ENT={k:'player',id};seoNow()}else if(n)setTimeout(()=>tryP(id,n-1),250)};
const tryN=(id,n=40)=>{if(DB.news.some(x=>x.id==id)&&window.openNews){window.openNews(id)}else if(n)setTimeout(()=>tryN(id,n-1),250)};
function route(){const[k,id]=parse();if(k=='bk'){closeM();ENT=null;if(window.brkRoute)brkRoute(id);else window.__brkPending=id;seoNow();return}
 if(k=='team'&&id){closeM();ENT=null;S.tab='team';S.tid=id;o.ui()}
 else if(k=='player'&&id){tryP(id)}
 else if(k=='news'&&id){closeM();ENT=null;o.go('news');tryN(id)}
 else if(NK.has(k)){closeM();ENT=null;o.go(k)}
 else{closeM();ENT=null;o.go('news');try{history.replaceState(null,'',TSK_ROOT)}catch(e){}}
 seoNow()}
window.TSKR={seo:seoNow,setH,ent:v=>{ENT=v},pathOf};
addEventListener('popstate',()=>{route()});
addEventListener('hashchange',()=>{if(!rel()&&/^#\//.test(location.hash))route()});
/* старые ссылки вида /#/team/id -> /team/id/ */
if(!rel()&&/^#\/[\w-]+/.test(location.hash)){const[k0,i0]=parse();if(KNOWN(k0)){try{history.replaceState(null,'',pathOf(k0,i0))}catch(e){}}try{route()}catch(e){console.warn('[TSK]',e)}}
else if(rel()){try{route()}catch(e){console.warn('[TSK]',e)}}
else seoNow();
/* skeleton пока грузится Supabase */
const SKC='<div class="g sk-card"><i class="sk sk-av"></i><div class="sk-ln"><i class="sk" style="width:55%"></i><i class="sk" style="width:85%"></i><i class="sk" style="width:35%"></i></div></div>',SK='<div class="mt-3" aria-busy="true" aria-label="Loading"><i class="sk sk-h"></i><div class="space-y-2 mt-4">'+SKC.repeat(5)+'</div></div>';
window.retryLoad=async function(){window.TSK_DONE=0;window.TSK_FAIL=0;const v=$('#v');if(v)v.innerHTML=SKL.page(S.tab);try{await load()}catch(e){}if(!window.TSK_DONE){window.TSK_DONE=1;if(!window._sig)window.TSK_FAIL=1}render(true)};
window.failScreen=function(){const off=navigator.onLine===false,T=(a,b)=>S.lang==='en'?b:a;$('#v').innerHTML='<div class="g p-6 text-center fd"><div class="text-4xl kc-cy-60 grid place-items-center">'+ic(off?'globe':'x','!w-14 !h-14')+'</div><p class="font-bold mt-3">'+(off?T('Нет соединения','No connection'):T('Данные не загрузились','Data failed to load'))+'</p><p class="text-[13px] k-t4 mt-1">'+(off?T('Проверь интернет — подключимся автоматически','Check your internet — we will reconnect automatically'):T('Проверь соединение и попробуй ещё раз','Check your connection and try again'))+'</p><button class="btn mt-4" onclick="retryLoad()">'+T('Повторить','Retry')+'</button></div>'};
addEventListener('offline',function(){var b=document.getElementById('offl');if(!b){b=document.createElement('div');b.id='offl';b.setAttribute('role','status');document.body.appendChild(b)}b.textContent=S.lang==='en'?'No connection':'Нет соединения';b.className='on'});
addEventListener('online',function(){var b=document.getElementById('offl');if(b)b.className='';try{if(sb)load().then(function(){render(true)})}catch(e){}});window.TSK_DONE=!sb;
{const SKT={news:1,rank:1,players:1,matches:1,tourn:1,team:1,me:1,lfg:1,rules:1},
noData=()=>!DB.teams.length&&!DB.news.length&&!DB.matches.length&&!DB.players.length&&!window._sig;
window.render=function(q){
 if(sb&&S.tab!='admin'&&SKT[S.tab]){
  if(TSK_BUSY()){$('#v').innerHTML=SKL.page(S.tab);return}
  if(window.TSK_FAIL&&noData()){failScreen();return}
 }
 o.render(q)};
if(sb){
 setTimeout(()=>{if(!window.TSK_DONE&&!window._sig){window.TSK_DONE=1;window.TSK_FAIL=1;if(S.tab!='admin'&&SKT[S.tab])render(true)}},8000);
 if(S.tab!='admin'&&SKT[S.tab]&&TSK_BUSY())$('#v').innerHTML=SKL.page(S.tab)
}}
/* переводы новых строк (uk / kk) — только если ключа ещё нет */
try{const X={
uk:{'Игроков пока нет':'Гравців поки немає','Станьте первым — зарегистрируйте профиль, и он появится в списке.':'Станьте першим — зареєструйте профіль, і він з’явиться у списку.','Никого не нашли':'Нікого не знайдено','Попробуйте изменить запрос или убрать фильтры.':'Спробуйте змінити запит або прибрати фільтри.','Сбросить фильтры':'Скинути фільтри','Список пуст':'Список порожній','Команд пока нет':'Команд поки немає','Зарегистрируйте команду — она попадёт в рейтинг после проверки.':'Зареєструйте команду — вона потрапить до рейтингу після перевірки.','Команды не найдены':'Команди не знайдено','Матчей пока нет':'Матчів поки немає','Расписание появится, когда организаторы добавят матчи.':'Розклад з’явиться, коли організатори додадуть матчі.','Загляни позже или посмотри остальные матчи.':'Загляньте пізніше або перегляньте інші матчі.','Показать все':'Показати все','Добавь команды в избранное звёздочкой — их матчи будут здесь.':'Додайте команди до обраного зірочкою — їхні матчі будуть тут.','Турниров пока нет':'Турнірів поки немає','Анонсы турниров появятся здесь и в новостях.':'Анонси турнірів з’являться тут і в новинах.','В этой категории пусто':'У цій категорії порожньо','В этой категории пока пусто':'У цій категорії поки порожньо','Новостей пока нет':'Новин поки немає','Следи за обновлениями — здесь появятся анонсы и итоги.':'Стежте за оновленнями — тут з’являться анонси та підсумки.','Ищешь команду? Включи отметку в «Мой профиль» — тебя увидят капитаны.':'Шукаєте команду? Увімкніть позначку в «Мій профіль» — вас побачать капітани.','Капитан может открыть набор в «Мой профиль» — команда появится здесь.':'Капітан може відкрити набір у «Мій профіль» — команда з’явиться тут.','Состав пока не заполнен':'Склад поки не заповнено','Матчей ещё не было':'Матчів ще не було','Загрузка…':'Завантаження…'},
kk:{'Игроков пока нет':'Ойыншылар әлі жоқ','Станьте первым — зарегистрируйте профиль, и он появится в списке.':'Алғашқы болыңыз — профильді тіркеңіз, ол тізімде көрінеді.','Никого не нашли':'Ешкім табылмады','Попробуйте изменить запрос или убрать фильтры.':'Сұранысты өзгертіп көріңіз немесе сүзгілерді алып тастаңыз.','Сбросить фильтры':'Сүзгілерді тазарту','Список пуст':'Тізім бос','Команд пока нет':'Командалар әлі жоқ','Зарегистрируйте команду — она попадёт в рейтинг после проверки.':'Команданы тіркеңіз — тексерістен кейін ол рейтингке түседі.','Команды не найдены':'Командалар табылмады','Матчей пока нет':'Матчтар әлі жоқ','Расписание появится, когда организаторы добавят матчи.':'Ұйымдастырушылар матч қосқанда кесте пайда болады.','Загляни позже или посмотри остальные матчи.':'Кейінірек қараңыз немесе басқа матчтарды көріңіз.','Показать все':'Барлығын көрсету','Добавь команды в избранное звёздочкой — их матчи будут здесь.':'Командаларды жұлдызшамен таңдаулыға қосыңыз — олардың матчтары осында болады.','Турниров пока нет':'Турнирлер әлі жоқ','Анонсы турниров появятся здесь и в новостях.':'Турнир жарияламалары осында және жаңалықтарда шығады.','В этой категории пусто':'Бұл санатта бос','В этой категории пока пусто':'Бұл санатта әзірге бос','Новостей пока нет':'Жаңалықтар әлі жоқ','Следи за обновлениями — здесь появятся анонсы и итоги.':'Жаңартуларды бақылаңыз — мұнда жарияламалар мен қорытындылар шығады.','Ищешь команду? Включи отметку в «Мой профиль» — тебя увидят капитаны.':'Команда іздеп жүрсіз бе? «Менің профилім» бөлімінде белгіні қосыңыз — капитандар көреді.','Капитан может открыть набор в «Мой профиль» — команда появится здесь.':'Капитан «Менің профилім» бөлімінде қабылдауды ашса — команда осында шығады.','Состав пока не заполнен':'Құрам әлі толтырылмаған','Матчей ещё не было':'Матчтар әлі болған жоқ','Загрузка…':'Жүктелуде…'}};
for(const l in X){const m=XL[l];if(m)for(const k in X[l])if(!(k in m))m[k]=X[l][k]}}catch(e){}
/* календарь */
window.icsM=id=>{const m=DB.matches.find(z=>z.id==id);if(!m)return;const e=x=>x.replace(/[,;\\]/g,' '),f=d=>new Date(d).toISOString().replace(/[-:]|\.\d{3}/g,''),st=new Date(m.when);
const c=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//TSK Esports//EN','BEGIN:VEVENT','UID:'+m.id+'@tsk-esports','DTSTAMP:'+f(Date.now()),'DTSTART:'+f(st),'DTEND:'+f(+st+36e5),'SUMMARY:'+e(tm(m.a).name+' vs '+tm(m.b).name)+' · TSK Esports','END:VEVENT','END:VCALENDAR'].join('\r\n');
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:'text/calendar'}));a.download='tsk-match.ics';a.click();toast(R('Добавь файл в календарь','Open the file to add it to your calendar'))};
/* a11y + модалки */
const AL=[[/closeM/,'Закрыть / Close'],[/shT|shP|share/i,'Поделиться / Share'],[/dl[TP]|download/i,'Скачать / Download'],[/fav/i,'Избранное / Favorite'],[/meBtn/,'Профиль / Profile'],[/adminBtn/,'Admin']];
let raf=0;new MutationObserver(()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;
 document.querySelectorAll('button:not([aria-label]),a:not([aria-label])').forEach(e=>{if(e.textContent.trim()||e.title)return;const r=AL.find(a=>a[0].test(e.getAttribute('onclick')||''));if(r)e.setAttribute('aria-label',r[1])});
 document.querySelectorAll('img:not([alt])').forEach(i=>i.alt='');
 const d=$('#m').firstElementChild;if(d&&!d.hasAttribute('role')){d.setAttribute('role','dialog');d.setAttribute('aria-modal','true')}
 if(!d&&ENT){ENT=null;setH(S.tab=='team'&&S.tid?'#/team/'+enc(S.tid):'#/'+S.tab);seoNow()}})}).observe(document.body,{childList:true,subtree:true});
addEventListener('keydown',e=>{if(e.key=='Escape')closeM()});
})();
