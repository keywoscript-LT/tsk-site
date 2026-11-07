/* язык: выбор пользователя запоминается (tsk-lang); пояс матчей */
(function(){var cur=S.lang,H=document.documentElement;H.lang=cur;
Object.defineProperty(S,'lang',{configurable:true,enumerable:true,get:function(){return cur},set:function(v){if(window.LGPACKS&&LGPACKS.indexOf(v)>-1&&!(window.LGOK&&LGOK[v])){langLoad(v,function(){cur=v;H.lang=v;try{localStorage.setItem('tsk-lang',v)}catch(e){}try{ui()}catch(e){}});return}cur=v;H.lang=v;try{localStorage.setItem('tsk-lang',v)}catch(e){}}});
window.tzs=function(iso){try{var p=new Intl.DateTimeFormat(S.lang,{timeZoneName:'short'}).formatToParts(new Date(iso)).filter(function(x){return x.type==='timeZoneName'})[0];return p?p.value:''}catch(e){return''}};
window.tzn=function(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone+' ('+tzs(Date.now())+')'}catch(e){return tzs(Date.now())}};
})();
