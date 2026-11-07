/* ===== ОБЩАЯ БАЗА: впишите данные проекта Supabase (Settings → API). Пусто = локальный демо-режим ===== */
const SB_URL='https://eqbrylfbhscxjslarsph.supabase.co',SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxYnJ5bGZiaHNjeGpzbGFyc3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NTE2MDUsImV4cCI6MjEwOTEyNzYwNX0.sOkSQEQPnhe2yvkS2I2QWQPgjVasvdNKkq5BB3rrHvY';
const sb=SB_URL&&SB_KEY&&window.supabase?supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storage:(()=>{const mem={};let ok=false;try{localStorage.setItem('__t','1');localStorage.removeItem('__t');ok=true}catch{}return{getItem:k=>{try{const v=ok?localStorage.getItem(k):null;return v!=null?v:(mem[k]??null)}catch{return mem[k]??null}},setItem:(k,v)=>{mem[k]=v;try{ok&&localStorage.setItem(k,v)}catch{}},removeItem:k=>{delete mem[k];try{ok&&localStorage.removeItem(k)}catch{}}}})(),lock:(()=>{let q=Promise.resolve();return(n,t,f)=>{const r=q.then(()=>f(),()=>f());q=Promise.race([r.then(()=>{},()=>{}),new Promise(z=>setTimeout(z,8000))]);return r}})()}}):null;
/* ===== SECURITY LAYER: rate limit / sanitize / safe URLs ===== */
const RL=(()=>{const h={};return(k,max,ms)=>{const n=Date.now(),a=h[k]=(h[k]||[]).filter(t=>n-t<ms);if(a.length>=max)return false;a.push(n);return true}})();
const dbn=(f,ms=150)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),ms)}};
const su=u=>{u=String(u||'');return /^https:\/\/[^\s"'<>]+$/i.test(u)||/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+\/=]+$/.test(u)?u:''};
const clean=v=>String(v??'').replace(/[<>]/g,'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u202E]/g,'').replace(/\s+/g,' ').trim();
const _blk=msg=>{const e={data:null,error:{message:msg}},p=new Proxy(function(){},{get:(_,k)=>k==='then'?(r=>Promise.resolve(e).then(r)):k==='catch'?(()=>Promise.resolve(e)):()=>p,apply:()=>p});return p};
if(sb){const M='Слишком много запросов. Подожди несколько секунд / Too many requests';
const _from=sb.from.bind(sb);sb.from=t=>{const q=_from(t);['insert','update','upsert','delete'].forEach(m=>{const o=q[m].bind(q);q[m]=(...a)=>RL('w:'+t,15,10000)?o(...a):_blk(M)});return q};
const _rpc=sb.rpc.bind(sb);sb.rpc=(...a)=>RL('rpc:'+a[0],10,10000)?_rpc(...a):_blk(M);
['signInWithPassword','signUp'].forEach(m=>{const o=sb.auth[m].bind(sb.auth);sb.auth[m]=async(...a)=>RL('auth',5,60000)?o(...a):{data:null,error:{message:'Слишком много попыток входа. Подожди минуту / Too many attempts, wait a minute'}}})}
/* санитизация текстовых полей + защита от двойной отправки любых форм */
document.addEventListener('submit',e=>{const f=e.target;if(!f||f.tagName!=='FORM')return;const n=Date.now();if(f._t&&n-f._t<1500){e.preventDefault();e.stopImmediatePropagation();return}f._t=n;f.querySelectorAll('input,textarea').forEach(i=>{if(/^(text|search|url|email|)$/i.test(i.type||'')&&i.type!=='password'){const c=clean(i.value);if(c!==i.value)i.value=c}})},true);
