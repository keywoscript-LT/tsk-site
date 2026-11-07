/* ===== v10: пустые состояния (EMP) и скелетоны (SKL) ===== */
(function(){
var W=window;
function T(a,b){try{return R(a,b)}catch(e){return b}}
var SV={
inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
cup:'<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
bolt:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
news:'<path d="M4 4h13a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z"/><path d="M8 8h7M8 12h7M8 16h4"/>',
star:'<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>'
};
function svg(k){return '<svg class="es-svg" viewBox="0 0 24 24" aria-hidden="true">'+(SV[k]||SV.inbox)+'</svg>'}

/* идёт ли первая загрузка данных */
W.TSK_BUSY=function(){try{if(!sb||W.TSK_DONE)return false;if(W._sig){W.TSK_DONE=1;return false}return true}catch(e){return false}};

/* первая загрузка не удалась (вызывается из load()) */
W.TSK_LDFAIL=function(){try{if(W.TSK_DONE||W._sig)return;W.TSK_DONE=1;W.TSK_FAIL=1;if(document.querySelector('#v [data-sk]'))render(true)}catch(e){}};

/* ---------- скелетоны ---------- */
function b(w,h,x){return '<i class="sk" style="width:'+w+(h?';height:'+h:'')+(x?';'+x:'')+'"></i>'}
function rep(s,n){var o='';while(n-->0)o+=s;return o}
function lines(){return '<div class="sk-ln">'+b('55%')+b('85%')+b('35%')+'</div>'}
function row(){return '<div class="g sk-card"><i class="sk sk-av"></i>'+lines()+'</div>'}
function pills(n){return '<div class="sk-bar">'+rep('<i class="sk sk-pill"></i>',n)+'</div>'}
function ttl(w){return '<i class="sk sk-h" style="margin-top:6px'+(w?';width:'+w:'')+'"></i>'}
function tiles(){return '<div class="sk-tiles">'+rep('<div class="g">'+b('50%','20px')+b('70%','9px')+'</div>',3)+'</div>'}
function head(){return '<div class="g sk-feat" style="display:flex;gap:14px;align-items:center"><i class="sk" style="width:72px;height:72px;border-radius:16px;flex:none"></i><div class="sk-ln" style="flex:1">'+b('50%','20px')+b('35%')+b('60%')+'</div></div>'}
function mcard(){return '<div class="g sk-m"><div class="sk-t"><i class="sk sk-av sk-sm"></i>'+b('60%')+'</div>'+b('54px','22px','border-radius:8px')+'<div class="sk-t r"><i class="sk sk-av sk-sm"></i>'+b('60%')+'</div></div>'}
function tcard(){return '<div class="g" style="padding:0;overflow:hidden;margin-top:12px"><i class="sk" style="height:110px;width:100%;border-radius:0"></i><div style="padding:14px" class="sk-ln">'+b('45%','16px')+b('80%')+b('55%')+'</div></div>'}
var PG={
news:function(){return '<div class="grid grid-cols-[minmax(0,1fr)] md:grid-cols-3 gap-3 mt-3"><div class="md:col-span-2 min-w-0">'+ttl('38%')+pills(3)+'<div class="g sk-feat"><i class="sk" style="height:180px;width:100%;border-radius:12px"></i><div class="sk-ln" style="margin-top:14px">'+b('30%','10px')+b('90%','18px')+b('70%')+'</div></div><div class="grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 gap-3 mt-3">'+rep('<div class="g sk-nw"><i class="sk" style="width:64px;height:64px;flex:none;border-radius:10px"></i>'+lines()+'</div>',4)+'</div></div><div class="min-w-0">'+ttl('50%')+'<div class="g sk-side" style="margin-top:12px">'+rep('<div class="sk-sr"><i class="sk sk-av sk-sm"></i><div class="sk-ln">'+b('60%')+b('100%','6px')+'</div></div>',3)+'</div></div></div>'},
rank:function(){return ttl('40%')+'<i class="sk" style="height:42px;width:100%;border-radius:12px;margin:12px 0 0"></i>'+pills(4)+'<div class="sk-pod">'+[88,112,76].map(function(h){return '<div class="sk-pc"><i class="sk sk-av"></i>'+b('70%')+'<i class="sk" style="height:'+h+'px;border-radius:12px 12px 0 0"></i></div>'}).join('')+'</div><div class="grid gap-2">'+rep(row(),6)+'</div>'},
players:function(){var g=(S.pv||'l')=='g';return ttl('42%')+'<i class="sk" style="height:42px;width:100%;border-radius:12px;margin:12px 0 0"></i>'+pills(4)+(g?'<div class="sk-grid">'+rep('<div class="g" style="padding:0;overflow:hidden"><i class="sk" style="height:0;padding-top:125%;width:100%;border-radius:0"></i><div style="padding:10px" class="sk-ln">'+b('70%')+b('45%')+'</div></div>',8)+'</div>':'<div class="grid gap-2">'+rep(row(),8)+'</div>')},
matches:function(){return ttl('44%')+pills(4)+'<div class="grid gap-2">'+rep(mcard(),4)+'</div>'},
tourn:function(){return ttl('44%')+pills(3)+rep(tcard(),2)},
team:function(){return b('120px','36px','border-radius:10px;margin:6px 0 10px')+head()+tiles()+ttl('30%')+'<div class="grid gap-2" style="margin-top:12px">'+rep(row(),4)+'</div>'},
me:function(){return ttl('36%')+'<div style="height:12px"></div>'+head()+tiles()+'<div class="grid gap-2">'+rep(row(),3)+'</div>'},
lfg:function(){return b('110px','36px','border-radius:10px;margin:6px 0 12px')+'<div class="g sk-feat"><div class="sk-ln">'+b('22%','10px')+b('70%','22px')+b('90%')+'</div></div>'+pills(2)+'<div class="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 gap-3">'+rep('<div class="g sk-nw"><i class="sk sk-av"></i>'+lines()+'</div>',4)+'</div>'},
rules:function(){return ttl('40%')+'<div class="grid gap-2" style="margin-top:14px">'+rep('<div class="g sk-feat"><div class="sk-ln">'+b('40%','14px')+b('95%')+b('80%')+'</div></div>',4)+'</div>'}
};
var SKL=W.SKL={};
SKL.rows=function(n){return '<div class="grid gap-2 sk-rows" role="status" aria-busy="true" aria-label="'+T('Загрузка…','Loading…')+'" data-sk="1">'+rep(row(),n||3)+'</div>'};
SKL.page=function(tab){var f=PG[tab]||PG.rules;return '<div class="sk-pg fd" role="status" aria-busy="true" aria-label="'+T('Загрузка…','Loading…')+'" data-sk="1">'+f()+'</div>'};

/* ---------- пустые состояния ---------- */
var E=W.EMP={};
E.svg=svg;
E.btn=function(label,js,k){return '<button type="button" class="btn'+(k?' '+k:'')+'" onclick="'+js+'">'+label+'</button>'};
E.box=function(ic,title,hint,acts){return '<div class="es fd" role="status"><div class="es-ic">'+svg(ic)+'</div><b class="es-t font-head">'+title+'</b>'+(hint?'<p class="es-h">'+hint+'</p>':'')+(acts?'<div class="es-a">'+acts+'</div>':'')+'</div>'};
E.mini=function(x){return '<div class="es-mini" role="status">'+svg('inbox')+'<span>'+x+'</span></div>'};
E.clear=function(k){
 if(k=='p'){S.pn='';S.pc='';S.pf=0}
 else if(k=='r'){S.rn='';S.rc=''}
 else if(k=='t'){S.tf='all'}
 else if(k=='m'){S.mt='all';S.mf=false}
 else if(k=='n'){S.nc=''}
 S.q='';render()
};
E.players=function(){
 if(W.TSK_BUSY())return SKL.rows(3);
 var act=!!((String(S.pn||'').trim())||S.pc||S.pf||S.q);
 if(!DB.players.length)return E.box('users',T('Игроков пока нет','No players yet'),T('Станьте первым — зарегистрируйте профиль, и он появится в списке.','Be the first — register a profile and it will show up here.'),E.btn(T('Регистрация','Register'),"openReg('player')"));
 if(act)return E.box('search',T('Никого не нашли','No players found'),T('Попробуйте изменить запрос или убрать фильтры.','Try a different search or clear the filters.'),E.btn(T('Сбросить фильтры','Clear filters'),"EMP.clear('p')",'k'));
 return E.box('users',T('Список пуст','The list is empty'),'')
};
E.rank=function(){
 if(W.TSK_BUSY())return SKL.rows(3);
 var act=!!((String(S.rn||'').trim())||S.rc||S.q);
 if(!DB.teams.length)return E.box('cup',T('Команд пока нет','No teams yet'),T('Зарегистрируйте команду — она попадёт в рейтинг после проверки.','Register a team — it will join the ranking after review.'),E.btn(T('Регистрация','Register'),"openReg('team')"));
 if(act)return E.box('search',T('Команды не найдены','No teams found'),T('Попробуйте изменить запрос или убрать фильтры.','Try a different search or clear the filters.'),E.btn(T('Сбросить фильтры','Clear filters'),"EMP.clear('r')",'k'));
 return E.box('cup',T('Список пуст','The list is empty'),'')
};
E.matches=function(f,fav,total){
 if(W.TSK_BUSY())return SKL.rows(3);
 if(fav)return E.box('star',T('У избранных команд нет матчей','No matches for your favorites'),T('Добавь команды в избранное звёздочкой — их матчи будут здесь.','Star teams to follow them — their matches show up here.'),E.btn(T('Показать все','Show all'),"EMP.clear('m')",'k'));
 if(!total)return E.box('cal',T('Матчей пока нет','No matches yet'),T('Расписание появится, когда организаторы добавят матчи.','The schedule will appear once organizers add matches.'));
 var m={live:['bolt','Сейчас нет матчей в эфире','No live matches right now'],up:['cal','Скоро матчей нет','Nothing scheduled yet'],fin:['cup','Результатов пока нет','No results yet']}[f]||['cal','Матчей пока нет','No matches yet'];
 return E.box(m[0],T(m[1],m[2]),T('Загляни позже или посмотри остальные матчи.','Check back later or see the other matches.'),f&&f!='all'?E.btn(T('Показать все','Show all'),"EMP.clear('m')",'k'):'')
};
E.tourn=function(f,total){
 if(W.TSK_BUSY())return SKL.rows(3);
 if(!total)return E.box('cup',T('Турниров пока нет','No tournaments yet'),T('Анонсы турниров появятся здесь и в новостях.','Tournament announcements will appear here and in the news.'),E.btn(t('news'),"go('news')",'k'));
 return E.box('cup',T('В этой категории пусто','Nothing in this category'),'',f&&f!='all'?E.btn(T('Показать все','Show all'),"EMP.clear('t')",'k'):'')
};
E.news=function(cur){
 if(W.TSK_BUSY())return SKL.rows(3);
 if(cur)return E.box('news',T('В этой категории пока пусто','Nothing in this category yet'),'',E.btn(T('Показать все','Show all'),"EMP.clear('n')",'k'));
 return E.box('news',T('Новостей пока нет','No news yet'),T('Следи за обновлениями — здесь появятся анонсы и итоги.','Stay tuned — announcements and results will show up here.'))
};
E.lfg=function(k){
 if(W.TSK_BUSY())return SKL.rows(3);
 var act=E.btn(S.me?T('Мой профиль','My profile'):t('login'),'meBtn()');
 return k=='p'
  ?E.box('users',T('Пока никто не ищет команду.','Nobody is looking for a team yet.'),T('Ищешь команду? Включи отметку в «Мой профиль» — тебя увидят капитаны.','Looking for a team? Switch the mark on in “My profile” so captains can see you.'),act)
  :E.box('users',T('Ни одна команда не ведёт набор.','No team is recruiting right now.'),T('Капитан может открыть набор в «Мой профиль» — команда появится здесь.','A captain can open recruitment in “My profile” and the team will show up here.'),act)
};
})();
