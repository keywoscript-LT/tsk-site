/* ===== Команды и игроки не с сайта (ext) ===== */
(()=>{
try{Object.assign(XL.uk,{'Иконка бравлера':'Іконка бравлера','Выбрать':'Обрати','Случайная':'Випадкова','Убрать':'Прибрати','Поиск бравлера…':'Пошук бравлера…','Не выбрана — выдадим случайную':'Не обрано — видамо випадкову','Свой файл выше важнее иконки':'Власний файл вище важливіший за іконку','Ничего не найдено':'Нічого не знайдено','Не на сайте':'Не на сайті','Команда не с сайта':'Команда не з сайту','Новая команда не с сайта':'Нова команда не з сайту','Команда не с сайта + состав':'Команда не з сайту + склад','Изменить команду и состав':'Змінити команду і склад','Состав':'Склад','Сохранено':'Збережено'});Object.assign(XL.kk,{'Иконка бравлера':'Бравлер белгішесі','Выбрать':'Таңдау','Случайная':'Кездейсоқ','Убрать':'Алып тастау','Поиск бравлера…':'Бравлерді іздеу…','Не выбрана — выдадим случайную':'Таңдалмаған — кездейсоқ беріледі','Свой файл выше важнее иконки':'Өз файлыңыз белгішеден маңыздырақ','Ничего не найдено':'Ештеңе табылмады','Не на сайте':'Сайтта жоқ','Команда не с сайта':'Сайтта жоқ команда','Новая команда не с сайта':'Сайтта жоқ жаңа команда','Команда не с сайта + состав':'Сайтта жоқ команда + құрам','Изменить команду и состав':'Команда мен құрамды өзгерту','Состав':'Құрам','Сохранено':'Сақталды'})}catch(e){}
const xm=h=>{let e=document.getElementById('xm');if(!e){e=document.createElement('div');e.id='xm';document.body.appendChild(e)}e.innerHTML=`<div class="fixed inset-0 z-[70] flex items-end md:items-center justify-center k-ov backdrop-blur-sm fd" onclick="if(event.target==this)xClose()"><div class="su md:zi w-full md:max-w-lg max-h-[90dvh] overflow-auto rounded-t-3xl md:rounded-2xl border bd-10 k-pan p-4" style="padding-bottom:calc(1rem + env(safe-area-inset-bottom))"><div class="md:hidden mx-auto w-10 h-1 rounded bw-20 mb-3"></div>${h}</div></div>`};
window.xClose=()=>{const e=document.getElementById('xm');if(e)e.innerHTML='';window.XS=null};
const LB='class="text-[11px] k-t4"';
function xRows(){const b=document.getElementById('xP');if(!b||!XS)return;
 b.innerHTML=XS.pl.map((r,i)=>`<div class="grid grid-cols-[2.25rem_1fr_4.4rem_3.6rem_auto] gap-1.5 items-center"><button type="button" class="h-9 w-9 grid place-items-center rounded-lg font-black text-[12px] ${XS.cap==r.id?'kb-gd text-black':'bw-06 k-t4'}" title="${R('Капитан','Captain')}" onclick="xCap('${r.id}')">C</button><input class="inp !mt-0 !py-1.5" maxlength="24" placeholder="${R('Ник','Nick')}" value="${esc(r.nick)}" oninput="XS.pl[${i}].nick=this.value"><input class="inp !mt-0 !py-1.5 !px-2 uppercase" list="xcl" maxlength="40" placeholder="${R('Страна','Country')}" value="${esc(r.country)}" oninput="XS.pl[${i}].country=this.value"><input type="number" min="0" max="99" inputmode="numeric" class="inp !mt-0 !py-1.5 !px-2 text-center" placeholder="${R('Возр.','Age')}" value="${esc(r.age)}" oninput="XS.pl[${i}].age=this.value"><button type="button" class="btn r !px-2.5" onclick="xDel(${i})">${ic('x')}</button></div>`).join('')+`<button type="button" class="btn k" onclick="xAdd()">${ic('plus')} ${R('Игрок','Player')}</button>`}
window.xCap=id=>{XS.cap=XS.cap==id?'':id;xRows()};
window.xAdd=()=>{if(XS.pl.length>=15)return toast(R('Слишком много игроков','Too many players'));XS.pl.push({id:uid(),nick:'',country:'',age:'',nw:1});xRows()};
window.xDel=i=>{const r=XS.pl[i];if(XS.cap==r.id)XS.cap='';XS.pl.splice(i,1);xRows()};
window.extTeamForm=(id,ctx)=>{
 if(!canExt())return;const t0=id?DB.teams.find(z=>z.id==id):null;if(id&&!t0)return;
 const pls=id?DB.players.filter(p=>p.team==id).sort((a,b)=>(b.id==t0.captain)-(a.id==t0.captain)):[];
 window.XS={id:id||'',ctx:ctx||'',cap:(t0&&t0.captain)||'',pl:pls.map(p=>({id:p.id,nick:p.nick||'',country:p.country?cval(p.country):'',age:p.age||''})),old:t0?t0.name:''};
 if(!XS.pl.length)for(let i=0;i<3;i++)XS.pl.push({id:uid(),nick:'',country:'',age:'',nw:1});
 const v=t0||{};
 xm(`<form id="XF" class="grid gap-3" autocomplete="off"><h3 class="font-head font-extrabold uppercase kc-or">${id?R('Команда не с сайта: изменить','Off-site team: edit'):R('Новая команда не с сайта','New off-site team')}</h3>
 <div class="rounded-lg kb-or-10 border ko-or-30 px-2.5 py-1.5 text-[11px] kc-or2">${R('Команда и игроки покажутся на сайте с меткой «Не на сайте». Профиль можно менять как у обычной команды.','The team and players are shown with a “Not on site” label. The profile can be edited like a regular team.')}</div>
 <div class="grid grid-cols-2 gap-2"><label ${LB}>${R('Название','Name')}<input class="inp" name="name" maxlength="60" value="${esc(v.name||'')}"></label><label ${LB}>${R('Страна','Country')}<input class="inp" name="country" list="xcl" value="${esc(v.country?cval(v.country):'')}" placeholder="KZ / Казахстан" onfocus="this.select()"></label></div>
 <datalist id="xcl">${CL.map(x=>`<option value="${x[0]} — ${esc(x[1])}${x[2]!=x[1]?' / '+esc(x[2]):''}">`).join('')}</datalist>
 <div class="grid grid-cols-2 gap-2"><label ${LB}>${R('Менеджер','Manager')}<input class="inp" name="manager" maxlength="60" value="${esc(v.manager||'')}"></label><label ${LB}>${R('Академия','Academy')}<input class="inp" name="academy" maxlength="60" value="${esc(v.academy||'')}"></label></div>
 <label ${LB}>${R('Логотип (файл)','Logo (file)')}<input class="inp" type="file" name="logo" accept="image/*"></label>
 <div class="grid grid-cols-3 gap-2"><label ${LB}>PPS<input class="inp" type="number" step="any" name="pps" value="${esc(v.pps||0)}"></label><label ${LB}>${R('Победы','Wins')}<input class="inp" type="number" min="0" name="w" value="${esc(v.w||0)}"></label><label ${LB}>${R('Поражения','Losses')}<input class="inp" type="number" min="0" name="l" value="${esc(v.l||0)}"></label></div>
 <div class="pt-2 text-[10px] font-black uppercase tracking-[.18em] kc-cy border-b bd-10 pb-1">${R('Состав','Roster')} <span class="normal-case tracking-normal k-t5 font-semibold">· C = ${R('капитан','captain')}</span></div>
 <div id="xP" class="grid gap-1.5"></div>
 ${id?`<button type="button" class="btn k w-full" onclick="xClose();ed('teams','${id}',1)">${ic('cog')} ${R('Все поля (плашка, капитан и др.)','All fields (badge, captain, etc.)')}</button>`:''}<div class="sticky bottom-0 -mx-4 px-4 pt-2 pb-1 k-pan border-t bd-10 grid grid-cols-[1fr_2fr] gap-2"><button type="button" class="btn k" onclick="xClose()">${R('Отмена','Cancel')}</button><button class="btn">${R('Сохранить','Save')}</button></div></form>`);
 xRows();document.getElementById('XF').onsubmit=xSave};
async function xSave(e){e.preventDefault();if(!XS)return;const fd=new FormData(e.target),S0=XS,bad=s=>/[<>\x00-\x08\x0B\x0C\x0E-\x1F]/.test(s);
 let name=String(fd.get('name')||'').trim();const manager=String(fd.get('manager')||'').trim(),academy=String(fd.get('academy')||'').trim();
 const free=(base,ok)=>{let n=base,i=2;while(!ok(n))n=base+' '+i++;return n};
 if(!name)name=R('Неизвестная команда','Unknown team');
 if([name,manager,academy].some(bad))return toast(R('Нельзя использовать символы < и >','Characters < and > are not allowed'));
 
 name=free(name,n=>!DB.teams.some(z=>z.id!=S0.id&&String(z.name).trim().toLowerCase()==n.toLowerCase()));
 const country=cparse(fd.get('country'))||'';
 const rows=S0.pl.map(r=>({...r,nick:String(r.nick||'').trim()})).filter(r=>r.nick||String(r.age||'').trim()||String(r.country||'').trim()),seen=new Set();
 for(const r of rows){if(!r.nick)r.nick=R('Неизвестный','Unknown');r.nick=r.nick.replace(/[<>]/g,'').slice(0,24)||R('Неизвестный','Unknown');r.nick=free(r.nick,n=>{const k=n.toLowerCase();return!seen.has(k)&&!DB.players.some(p=>p.id!=r.id&&String(p.nick).trim().toLowerCase()==k)});seen.add(r.nick.toLowerCase())}
 const t0=S0.id?DB.teams.find(z=>z.id==S0.id):null,tid=S0.id||uid();
 let logo=(t0&&t0.logo)||'';const f=fd.get('logo');
 if(f&&f.size){const v=await imgPack(f,900);if(sb){const pth='teams/'+uid()+'-'+v.name.replace(/[^\w.]/g,'_'),u=await sb.storage.from('media').upload(pth,v);if(u.error)return toast(u.error.message);logo=sb.storage.from('media').getPublicUrl(pth).data.publicUrl}else logo=await new Promise(y=>{const fr=new FileReader();fr.onload=()=>y(fr.result);fr.readAsDataURL(v)})}
 const keep=new Set(rows.map(r=>r.id)),team={...(t0||{}),id:tid,name,country,manager,academy,logo,pps:+fd.get('pps')||0,w:Math.max(0,+fd.get('w')||0),l:Math.max(0,+fd.get('l')||0),ext:true,captain:keep.has(S0.cap)?S0.cap:''};
 if(!logo)delete team.logo;
 const today=new Date().toISOString().slice(0,10),pl=rows.map(r=>{const p0=DB.players.find(p=>p.id==r.id);const base=p0?{...p0}:{id:r.id,pps:0,kd:0,wr:0};return{...base,nick:r.nick,country:cparse(r.country)||country,age:(+r.age>0?+r.age:'?'),team:tid,ext:p0&&p0.uid?!!p0.ext:true}});
 const gone=DB.players.filter(p=>p.team==tid&&!keep.has(p.id)),del=gone.filter(p=>p.ext&&!p.uid),unteam=gone.filter(p=>!(p.ext&&!p.uid)).map(p=>({...p,team:''}));
 let tr=[];if(t0&&S0.old&&S0.old!==name)tr=DB.tourn.map(x=>{const g=(x.groups||[]).map(q=>({...q,teams:(q.teams||[]).map(n=>n==S0.old?name:n)})),po=(x.po||[]).map(m=>({...m,a:m.a==S0.old?name:m.a,b:m.b==S0.old?name:m.b}));return JSON.stringify([g,po])==JSON.stringify([x.groups||[],x.po||[]])?null:{...x,groups:g,po}}).filter(Boolean);
 const strip=({id,...d})=>d;
 if(sb){const up=[{kind:'teams',id:tid,data:strip(team)},...pl.concat(unteam).filter(p=>{const o=DB.players.find(y=>y.id==p.id);return!o||JSON.stringify(strip(o))!==JSON.stringify(strip(p))}).map(p=>({kind:'players',id:p.id,data:strip(p)})),...tr.map(x=>({kind:'tourn',id:x.id,data:strip(x)}))];
  let r=await sb.from('records').upsert(up);if(r.error)return toast(r.error.message,6000);
  if(del.length){r=await sb.from('records').delete().eq('kind','players').in('id',del.map(p=>p.id));if(r.error)return toast(r.error.message,6000)}
  await load()}
 else{const put_=(a,x)=>{const i=a.findIndex(y=>y.id==x.id);i<0?a.push(x):a[i]=x};put_(DB.teams,team);pl.concat(unteam).forEach(p=>put_(DB.players,p));tr.forEach(x=>put_(DB.tourn,x));DB.players=DB.players.filter(p=>!del.some(d=>d.id==p.id));if(save()===false)return}
 const ctx=S0.ctx;xClose();extDone(tid,ctx);toast(R('Сохранено','Saved'))}
function extDone(tid,ctx){const T=DB.teams.find(z=>z.id==tid);if(!T)return render();const F=document.getElementById('F');
 if(F)F.querySelectorAll('select[name=a],select[name=b],select[name=team],select[name=winner]').forEach(s=>{let o=[...s.options].find(x=>x.value==tid);if(!o){o=new Option(T.name,tid);s.add(o)}else o.text=T.name;if(ctx==s.name)s.value=tid});
 if(/^g\d+$/.test(ctx)&&typeof TE!='undefined'){const i=+ctx.slice(1);if(TE.g[i]&&!TE.g[i].teams.includes(T.name))TE.g[i].teams.push(T.name)}
 if(ctx=='te'||/^g\d+$/.test(ctx)){if(document.getElementById('teG'))teRender();return}
 if(!F)render()}
})();
