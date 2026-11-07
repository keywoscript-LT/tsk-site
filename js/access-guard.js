/* ===== доступ только для зарегистрированных: мини-игры, приватные лиги (+ защита обработчиков) ===== */
(()=>{
const need=()=>!!(sb&&!S.me);
Object.assign(XL.uk,{"Мини-игры":"Міні-ігри","Мини-игры доступны только зарегистрированным. Войди или создай аккаунт.":"Міні-ігри доступні лише зареєстрованим. Увійди або створи акаунт."});
Object.assign(XL.kk,{"Мини-игры":"Мини-ойындар","Мини-игры доступны только зарегистрированным. Войди или создай аккаунт.":"Мини-ойындар тек тіркелгендерге қолжетімді. Кір немесе аккаунт жаса."});
const lock=()=>`<div class="g p-5 text-center mt-2"><h1 class="font-head font-black text-xl">${R('Мини-игры','Mini-games')}</h1><p class="text-sm k-t3 mt-2">${R('Мини-игры доступны только зарегистрированным. Войди или создай аккаунт.','Mini-games are for registered users only. Sign in or create an account.')}</p><div class="mt-3">${perksBox()}</div><button class="btn mt-3 w-full" onclick="authModal('up')">${R('Создать аккаунт','Create account')}</button><button class="btn k mt-2 w-full" onclick="authModal()">${t('login')}</button></div>`;
const vg=V.games;V.games=()=>need()?lock():vg();
for(const k of ['gmOpen','xOpen','lgNew','lgJoin','lgOpen']){const f=window[k];if(typeof f!='function')continue;window[k]=(...a)=>need()?authModal():f(...a)}
})();
