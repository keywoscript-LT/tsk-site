/* ===== v6: редактор новостей (Rich Text), предпросмотр, черновики ===== */
(function(){
const st=document.createElement('style');st.textContent=`
.nbody{line-height:1.65;font-size:15px;color:#cbd5e1;word-break:break-word}
.nbody>*+*{margin-top:.8em}.nbody h2{font-family:inherit;font-weight:900;font-size:1.45em;line-height:1.2;color:#fff;margin-top:1.3em;padding-left:.6em;border-left:3px solid #FF2E63;text-transform:uppercase;letter-spacing:.02em}
.nbody h3{font-weight:800;font-size:1.15em;color:#00F0FF;margin-top:1.1em}.nbody p{margin:0}.nbody b,.nbody strong{color:#fff}
.nbody ul,.nbody ol{padding-left:1.4em}.nbody ul{list-style:disc}.nbody ol{list-style:decimal}.nbody li{margin:.25em 0}.nbody li::marker{color:#FF2E63}
.nbody hr{border:0;height:1px;margin:1.4em 0;background:linear-gradient(90deg,transparent,#00F0FF,#FF2E63,transparent)}
.nbody a{color:#00F0FF;text-decoration:underline;text-underline-offset:2px}
.rte{min-height:220px;max-height:55vh;overflow:auto;padding:12px;border-radius:12px;background:rgba(7,9,14,.9);border:1px solid rgba(255,255,255,.12);outline:0}
.rte:focus{border-color:#00F0FF;box-shadow:0 0 0 2px rgba(0,240,255,.2)}
.rtb{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;padding:6px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
.rtb button{min-width:32px;height:32px;padding:0 8px;border-radius:8px;background:rgba(255,255,255,.06);color:#e2e8f0;font-weight:800;font-size:12px}
.rtb button:hover{background:rgba(0,240,255,.15);color:#00F0FF}.rtb i{width:1px;background:rgba(255,255,255,.12);margin:2px 2px}
.nimg{background-size:cover;background-position:center top;filter:saturate(1.15) brightness(1.05);-webkit-mask-image:linear-gradient(to bottom,#000 0,#000 40%,rgba(0,0,0,.55) 70%,transparent 100%);mask-image:linear-gradient(to bottom,#000 0,#000 40%,rgba(0,0,0,.55) 70%,transparent 100%)}
.nimg-s{position:relative;z-index:0}.nimg-s~*:not(i){position:relative;z-index:1}
.nimg-s~h1,.nimg-s~h3{text-shadow:0 2px 14px rgba(0,0,0,.85)}
main,main#v,#v{min-width:0;max-width:100%}main#v>*,#v>*{min-width:0;max-width:100%}
.hs{min-width:0;max-width:100%;-webkit-overflow-scrolling:touch}.hs>*{flex-shrink:0}
.flex>.inp,.flex>input,.flex>select{min-width:0}#admL,#admL>*{min-width:0;max-width:100%}#admL .g{overflow:hidden}
@media(max-width:480px){main .flex.gap-2.mb-2>.btn{padding-left:.7rem;padding-right:.7rem}}
.nbody,.nbody *{overflow-wrap:anywhere;max-width:100%}.nbody{min-width:0}
#F{grid-template-columns:minmax(0,1fr)}#F>*,#F label{min-width:0}#F input,#F select,#F textarea{max-width:100%;min-width:0;box-sizing:border-box}
#F input[type=datetime-local],#F input[type=file]{width:100%;font-size:16px}
.nbtns{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-top:8px}.nbtns .btn{white-space:normal;line-height:1.2;padding:.55rem .6rem;justify-content:center;text-align:center}
#nprev{overflow-x:hidden;max-width:100vw}#nprev .bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:10px;padding-top:calc(10px + env(safe-area-inset-top,0px))}#nprev .bar .btn{padding:.45rem .7rem}#nprev article{overflow:hidden}
@media(max-width:640px){#nprev .bar [data-m] span{display:none}#nprev .bar b{flex:1 0 100%}.rtb button{min-width:30px;height:34px;padding:0 6px}.nbody{font-size:14.5px}.nbody h2{font-size:1.25em}}
`;document.head.appendChild(st);
const NA={P:1,H2:1,H3:1,B:1,STRONG:1,I:1,EM:1,U:1,UL:1,OL:1,LI:1,HR:1,A:1,BR:1,DIV:1},BAD=/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|TEMPLATE|NOSCRIPT)$/;
window.nsan=h=>{const d=new DOMParser().parseFromString('<body>'+String(h||'')+'</body>','text/html'),o=document.createElement('div');
const w=(s,t)=>s.childNodes.forEach(c=>{if(c.nodeType==3)t.appendChild(document.createTextNode(c.nodeValue));else if(c.nodeType==1){const g=c.tagName;if(BAD.test(g))return;if(!NA[g]){w(c,t);return}
if(g=='A'){const u=(c.getAttribute('href')||'').trim();if(!/^(https?:\/\/|mailto:|tg:\/\/)/i.test(u)){w(c,t);return}const e=document.createElement('a');e.href=u;e.target='_blank';e.rel='noopener noreferrer nofollow';w(c,e);t.appendChild(e);return}
const e=document.createElement(g=='DIV'?'p':g.toLowerCase());if(g!='HR'&&g!='BR')w(c,e);t.appendChild(e)}});w(d.body,o);return o.innerHTML};
const TAGS=/<\/?(p|h2|h3|ul|ol|li|b|i|u|strong|em|a|hr|br|div)\b/i;
const BB=/\[(\/?)(p|h2|h3|ul|ol|li|b|i|u|a|hr|br)(?:=([^\]]*))?\]/gi,BBT=/\[(\/?)(p|h2|h3|ul|ol|li|b|i|u|a|hr|br)(?:=([^\]]*))?\]/i;
window.nenc=h=>{const d=new DOMParser().parseFromString('<body>'+String(h||'')+'</body>','text/html'),tx=t=>t.replace(/\\/g,'\\\\').replace(/\[/g,'\\[').replace(/</g,'‹').replace(/>/g,'›'),M={P:'p',H2:'h2',H3:'h3',UL:'ul',OL:'ol',LI:'li',B:'b',STRONG:'b',I:'i',EM:'i',U:'u'},w=n=>[...n.childNodes].map(c=>{if(c.nodeType==3)return tx(c.nodeValue);if(c.nodeType!=1)return'';const g=c.tagName;if(g=='BR')return'[br]';if(g=='HR')return'[hr]';if(g=='A')return'[a='+(c.getAttribute('href')||'').replace(/\]/g,'%5D').replace(/</g,'%3C').replace(/>/g,'%3E')+']'+w(c)+'[/a]';const m=M[g];return m?'['+m+']'+w(c)+'[/'+m+']':w(c)}).join('');return w(d.body)};
window.ndec=b=>{let o='',i=0,m;BB.lastIndex=0;const tx=t=>esc(t.replace(/\\([\\\[])/g,'$1'));while((m=BB.exec(b))){o+=tx(b.slice(i,m.index));i=BB.lastIndex;const c=m[1],g=m[2].toLowerCase();o+=g=='a'?(c?'</a>':'<a href="'+esc(m[3]||'')+'">'):(g=='br'||g=='hr')?'<'+g+'>':'<'+(c?'/':'')+g+'>'}o+=tx(b.slice(i));return nsan(o)};
window.nconv=b=>{b=String(b||'');if(!TAGS.test(b)&&BBT.test(b))return ndec(b);if(TAGS.test(b))return nsan(b);return b.split(/\n{2,}/).filter(x=>x.trim()).map(x=>'<p>'+esc(x.trim()).replace(/\n/g,'<br>')+'</p>').join('')};
const ntx=h=>{const d=document.createElement('div');d.innerHTML=nsan(h);return(d.textContent||'').replace(/\s+/g,' ').trim()};
window.nex=(n,cls)=>{const h=nconv(n.body),tx=ntx(h),sm=String(n.summary||'').trim(),ex=sm||(tx.length>180?tx.slice(0,180).replace(/\s\S*$/,'')+'…':tx),more=(sm&&tx&&tx!==sm)||tx.length>180||/<(h2|h3|ul|ol|hr)/.test(h);
return`<p class="${cls} mt-1.5 leading-snug break-words">${esc(ex)}</p>${more?`<button class="btn k !py-1 !px-3 mt-2 text-[12px]" onclick="openNews('${esc(n.id)}')">${R('Читать полностью','Read more')}</button>`:''}`};
window.nart=(n,img)=>{const im=img||(/^(https?:|data:image\/|blob:)/.test(n.img||'')?n.img:'');return`<article>${im?`<div class="nimg nimg-s -mx-4 -mt-1 md:-mt-4 -mb-10 h-56 md:h-72 rounded-t-2xl" style="background-image:url('${esc(im)}')"></div>`:''}<div class="text-[10px] uppercase tracking-wider font-bold kc-cy">${esc(n.cat||'')}${n.when?` <span class="k-t5 normal-case tracking-normal font-medium">· ${dt(n.when)}</span>`:''}</div><h1 class="font-head font-black text-2xl md:text-3xl leading-tight mt-1 mb-3 break-words">${esc(n.title||'')}</h1>${n.summary?`<p class="k-t3 mb-3 italic">${esc(n.summary)}</p>`:''}<div class="nbody">${nconv(n.body)}</div></article>`};
window.openNews=id=>{const n=DB.news.find(x=>x.id==id);if(!n)return;modal(nart(n)+`<button class="btn k w-full mt-4" onclick="closeM()">${R('Закрыть','Close')}</button>`,'md:max-w-2xl')};
const E=['🔥','🏆','🎮','⚡','🎉','👑','💥','⭐','📢','✅','❗','🚀','💪','🤝','❤️','😎','👏','🥇','📅','🔴'];
window.nfmt=(c,v)=>{const e=document.getElementById('rte');e.focus();document.execCommand(c,false,v||null);nsync()};
window.nsync=()=>{const e=document.getElementById('rte'),h=document.getElementById('rte-v');if(e&&h)h.value=nsan(e.innerHTML)};
window.nlink=()=>{const u=(prompt('URL (https://…)')||'').trim();if(!/^(https?:\/\/|mailto:|tg:\/\/)/i.test(u))return u&&toast(R('Нужна ссылка https://…','Need an https:// link'));nfmt('createLink',u)};
window.nemo=b=>{const p=document.getElementById('rte-e');p.hidden=!p.hidden};
window.nins=x=>{nfmt('insertText',x)};
window.ndraft=()=>{const f=document.getElementById('F');f.elements.status.value='draft';f.requestSubmit()};
window.nprev=()=>{nsync();const f=document.getElementById('F'),g=k=>f.elements[k]?f.elements[k].value:'',fi=f.elements.img&&f.elements.img.files&&f.elements.img.files[0],o=(DB.news.find(x=>x.id==S.eid)||{}),
n={title:g('title'),cat:g('cat'),summary:g('summary'),body:g('body'),when:g('when')?new Date(g('when')).toISOString():new Date().toISOString(),img:o.img};
const ov=document.createElement('div');ov.id='nprev';ov.className='fixed inset-0 z-[70] flex flex-col min-w-0';ov.style.background='rgba(4,6,10,.96)';
const draw=m=>{ov.querySelector('#npf').style.width=m=='m'?'390px':'100%';ov.querySelector('#npf').style.maxWidth=m=='m'?'100%':'820px';ov.querySelectorAll('[data-m]').forEach(b=>b.classList.toggle('k',b.dataset.m!=m))};
ov.innerHTML=`<div class="bar border-b bd-10"><b class="font-head kc-cy uppercase flex-1">${R('Предпросмотр','Preview')}</b><button class="btn" data-m="m">📱<span> ${R('Телефон','Mobile')}</span></button><button class="btn" data-m="d">🖥<span> ${R('Компьютер','Desktop')}</span></button><button class="btn k" id="npx">✕</button></div><div class="flex-1 overflow-auto p-3 min-w-0"><div id="npf" class="mx-auto g p-4 rounded-2xl" style="transition:width .25s;border:1px solid rgba(0,240,255,.25)">${nart(n,fi?URL.createObjectURL(fi):'')}</div></div>`;
document.body.appendChild(ov);ov.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>draw(b.dataset.m));ov.querySelector('#npx').onclick=()=>ov.remove();draw('d')};
const oi=window.inp;
window.inp=function(n,ty,v){
if(ty=='nsum')return`<textarea class="inp" name="${n}" rows="2" maxlength="300" placeholder="${R('1–2 предложения для карточки','1–2 sentences for the card')}">${esc(v||'')}</textarea>`;
if(ty=='nstat')return`<select class="inp" name="${n}"><option value="published" ${v!='draft'?'selected':''}>${R('Опубликовано','Published')}</option><option value="draft" ${v=='draft'?'selected':''}>${R('Черновик (скрыто с сайта)','Draft (hidden)')}</option></select>`;
if(ty=='rte'){const B=(c,l,t,x)=>`<button type="button" title="${t}" onmousedown="event.preventDefault()" onclick="${c}">${l}</button>`;
return`<div class="rtb">${B("nfmt('bold')",'<b>B</b>',R('Жирный','Bold'))}${B("nfmt('italic')",'<i>I</i>',R('Курсив','Italic'))}${B("nfmt('underline')",'<u>U</u>',R('Подчёркнутый','Underline'))}<i></i>${B("nfmt('formatBlock','<h2>')",'H2','H2')}${B("nfmt('formatBlock','<h3>')",'H3','H3')}${B("nfmt('formatBlock','<p>')",'¶',R('Абзац','Paragraph'))}<i></i>${B("nfmt('insertUnorderedList')",'• '+R('Список','List'),R('Маркированный список','Bullet list'))}${B("nfmt('insertOrderedList')",'1. '+R('Список','List'),R('Нумерованный список','Numbered list'))}${B("nfmt('insertHorizontalRule')",'―',R('Разделитель','Divider'))}<i></i>${B("nlink()",'🔗',R('Ссылка','Link'))}${B("nfmt('unlink')",'⛓‍💥',R('Убрать ссылку','Unlink'))}${B("nemo(this)",'😀',R('Эмодзи','Emoji'))}${B("nfmt('removeFormat')",'Tx',R('Очистить формат','Clear format'))}</div><div id="rte-e" hidden class="flex flex-wrap gap-1 mb-2 p-2 rounded-xl bw-05">${E.map(x=>`<button type="button" class="text-xl px-1" onmousedown="event.preventDefault()" onclick="nins('${x}')">${x}</button>`).join('')}</div><div id="rte" class="rte nbody" contenteditable="true" oninput="nsync()" onpaste="event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain'))">${nconv(v)}</div><input type="hidden" id="rte-v" name="${n}" value="${esc(nconv(v))}"><div class="nbtns"><button type="button" class="btn k" onclick="nprev()">👁 ${R('Предпросмотр','Preview')}</button><button type="button" class="btn k" onclick="ndraft()">💾 ${R('Сохранить как черновик','Save as draft')}</button></div>`}
return oi(n,ty,v)};
BIGT.add('rte');
setTimeout(()=>{try{if(typeof render=='function'&&S.tab=='news')render(true)}catch(e){}},0);
SC.news=[['title',R('Заголовок','Title')],['cat','Категория / Category','cat'],['summary',R('Краткое описание','Short description'),'nsum'],['body',R('Основной текст','Body'),'rte'],['img',R('Обложка (необязательно)','Cover (optional)'),'file'],['status',R('Статус публикации','Status'),'nstat'],['when','Date','dt']];
})();
