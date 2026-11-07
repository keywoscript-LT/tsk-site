/* ===== v7: регистрация только с подпиской на t.me/TSKesports ===== */
const TGE={not_subscribed:['Ты не подписан на канал @TSKesports — подпишись и повтори','You are not subscribed to @TSKesports — subscribe and retry'],tg_used:['Этот Telegram уже привязан к другому аккаунту','This Telegram is already linked to another account'],nick_taken:['Этот ник уже занят','This nickname is already taken'],bot:['Бот не может проверить подписку (он должен быть админом канала)','The bot cannot check subscriptions (it must be a channel admin)'],proof:['Подтверждение истекло — повтори','Verification expired — try again'],invalid:['Проверь ник и пароль (минимум 8 символов)','Check nickname and password (8+ chars)']};
const tgErr=k=>{const e=TGE[k]||['Не удалось подтвердить Telegram, попробуй ещё раз','Telegram verification failed, try again'];return R(e[0],e[1])};
const tgBox=()=>{const ok=!!sessionStorage.getItem('tsk_tgp');return`<div class="g p-3 text-[13px] grid gap-2"><div class="font-bold">${ok?'✅ '+R('Подписка подтверждена','Subscription verified'):'📢 '+R('Нужна подписка на канал','Channel subscription required')}</div>${ok?'':`<div class="k-t4">${R('Подпишись на','Subscribe to')} <a class="underline kc-cy" href="https://t.me/TSKesports" target="_blank" rel="noopener noreferrer">t.me/TSKesports</a> ${R('и нажми кнопку — войдём через Telegram и проверим подписку.','then tap the button — we will sign in with Telegram and check it.')}</div><div class="text-[11px] k-t5 leading-snug">${R('Мы используем Telegram только чтобы убедиться, что вы подписаны на @TSKesports. Сохраняется лишь числовой ID, имя и фото мы не храним. Вход нужен один раз, при регистрации.','We use Telegram only to check that you are subscribed to @TSKesports. Only your numeric ID is stored; we do not keep your name or photo. This is needed once, at sign-up.')}</div><button type="button" class="btn w-full" onclick="tgStart()">Telegram: ${R('подтвердить подписку','verify subscription')}</button>`}</div>`};
async function tgStart(){let w=null; /* попап убран: вход через Telegram всегда редиректом в этой же вкладке */
const c=await sb.functions.invoke('tg-auth',{body:{a:'config'}}),id=c.data&&c.data.client_id;if(!id){if(w)try{w.close()}catch(_){}return toast(tgErr())}
const rnd=n=>[...crypto.getRandomValues(new Uint8Array(n))].map(x=>x.toString(16).padStart(2,'0')).join(''),v=rnd(32),st=(w?'p':'')+rnd(12),h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)),ch=btoa(String.fromCharCode(...new Uint8Array(h))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
sessionStorage.setItem('tsk_tgv',v);sessionStorage.setItem('tsk_tgs',st);try{sessionStorage.setItem('tsk_tgc',JSON.stringify({nx:S.nx||null,rt:S.rt||null,tab:S.tab||'news',nick:(document.querySelector('#AF [name=e]')||{}).value||''}))}catch(_){}
const u='https://oauth.telegram.org/auth?'+new URLSearchParams({client_id:id,redirect_uri:location.origin+TSK_ROOT,response_type:'code',scope:'openid',state:st,code_challenge:ch,code_challenge_method:'S256'});if(w){try{w.location.href=u;tgWait()}catch(_){location.href=u}}else location.href=u}
const tgNote=(m,c)=>{const bx=document.getElementById('TGB');if(bx)bx.innerHTML=tgBox()+(m?`<p class="text-[12px] ${c||'kc-rd'} mt-1.5 break-words">${esc(m)}</p>`:'')};
let _tgPoll=0;
function tgPick(){let raw;try{raw=localStorage.getItem('tsk_tgmsg')}catch(_){return}if(!raw)return;let m;try{m=JSON.parse(raw)}catch(_){return}if(!m||m.state!==sessionStorage.getItem('tsk_tgs'))return;try{localStorage.removeItem('tsk_tgmsg')}catch(_){}clearInterval(_tgPoll);tgFinish(m.code,m.error)}
function tgWait(){clearInterval(_tgPoll);tgNote(R('Ждём подтверждение в Telegram…','Waiting for Telegram confirmation…'),'k-t4');const t0=Date.now();_tgPoll=setInterval(()=>{if(!sessionStorage.getItem('tsk_tgs')||Date.now()-t0>3e5)return clearInterval(_tgPoll);tgPick()},500)}
async function tgFinish(code,errp){if(errp)return tgNote(R('Вход через Telegram отменён','Telegram sign-in cancelled'));
tgNote(R('Проверяем подписку…','Checking subscription…'),'k-t4');
try{const r=await sb.functions.invoke('tg-auth',{body:{a:'check',code,verifier:sessionStorage.getItem('tsk_tgv'),redirect_uri:location.origin+TSK_ROOT}});
const er=r.error&&await(r.error.context&&r.error.context.json?r.error.context.json().catch(()=>null):null);
sessionStorage.removeItem('tsk_tgv');sessionStorage.removeItem('tsk_tgs');
if(r.error||!r.data||!r.data.proof){const c=er&&er.error;console.warn('tg check failed',r.error,er);return tgNote(tgErr(c)+' ['+(c||(r.error&&r.error.message)||'no proof')+']'+(er&&er.detail?' — '+er.detail:'')+(er&&er.bot_id?' (bot '+er.bot_id+', '+er.channel+')':''))}
sessionStorage.setItem('tsk_tgp',r.data.proof);sessionStorage.removeItem('tsk_tgc');tgNote('');toast(R('Подписка подтверждена','Subscription verified'))}
catch(e){console.warn(e);tgNote(tgErr()+' ['+((e&&e.message)||e)+']')}}
addEventListener('storage',e=>{if(e.key==='tsk_tgmsg')tgPick()});
(async()=>{const q=new URLSearchParams(location.search),code=q.get('code'),st=q.get('state'),errp=q.get('error');if(!(code&&st)&&!errp)return;
if(st&&st[0]=='p'){try{localStorage.setItem('tsk_tgmsg',JSON.stringify({code,state:st,error:errp,t:Date.now()}))}catch(_){}document.body.innerHTML='<div style="font:16px system-ui;color:#fff;background:#07090E;min-height:100vh;display:grid;place-items:center;text-align:center;padding:24px">Готово! Это окно можно закрыть и вернуться на сайт.<br>Done! You can close this window and go back to the site.</div>';setTimeout(()=>{try{window.close()}catch(_){}},400);return}
if(!sb)return;history.replaceState(null,'',location.pathname+location.hash);
let cx={};try{cx=JSON.parse(sessionStorage.getItem('tsk_tgc')||'{}')}catch(_){}sessionStorage.removeItem('tsk_tgc');
/* вернуть человека туда, где он был, и заново открыть форму регистрации (ник подставляем, пароль вводится заново) */
const back=()=>{if(cx.rt)S.rt=cx.rt;if(cx.nx)S.nx=cx.nx;if(cx.tab&&cx.tab!='news'){try{go(cx.tab)}catch(_){}}setTimeout(()=>{try{authModal('up');const i=document.querySelector('#AF [name=e]');if(i&&cx.nick)i.value=cx.nick}catch(_){}},700)};
if(errp){back();return toast(R('Вход через Telegram отменён','Telegram sign-in cancelled'))}
if(st!==sessionStorage.getItem('tsk_tgs')){back();return toast(tgErr('proof'))}
const r=await sb.functions.invoke('tg-auth',{body:{a:'check',code,verifier:sessionStorage.getItem('tsk_tgv'),redirect_uri:location.origin+TSK_ROOT}});
sessionStorage.removeItem('tsk_tgv');sessionStorage.removeItem('tsk_tgs');
const er=r.error&&await(r.error.context&&r.error.context.json?r.error.context.json().catch(()=>null):null);
if(r.error||!r.data||!r.data.proof){back();return toast(tgErr(er&&er.error))}
sessionStorage.setItem('tsk_tgp',r.data.proof);back();toast(R('Подписка подтверждена','Subscription verified'))})();
