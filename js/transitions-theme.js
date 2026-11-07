/* ===== v11: плавные переходы вкладок + переключатель темы ===== */
(()=>{
const H=document.documentElement,rm=matchMedia('(prefers-reduced-motion:reduce)'),K='tsk-theme',VT=!!document.startViewTransition,
 L=(a,b)=>typeof R=='function'?R(a,b):(S.lang==='en'?b:a);
/* --- тема: по умолчанию тёмная, выбор хранится в localStorage --- */
const sun='<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 moon='<svg class="ic" viewBox="0 0 24 24"><path d="M21 14.5A9 9 0 0 1 9.5 3a9 9 0 1 0 11.5 11.5z"/></svg>',
 b=document.createElement('button'),lg=document.getElementById('lg');
b.className='btn k !px-2.5';b.id='thm';
const set=(l,save)=>{H.classList.toggle('light',l);
 try{save&&localStorage.setItem(K,l?'light':'dark')}catch(e){}
 document.querySelector('meta[name=theme-color]').content=l?'#f3f5f9':'#07090E';
 document.querySelector('meta[name=color-scheme]').content=l?'light':'dark';
 b.innerHTML=l?moon:sun;const t=l?L('Тёмная тема','Dark theme'):L('Светлая тема','Light theme');b.title=t;b.setAttribute('aria-label',t)};
b.onclick=()=>{const l=!H.classList.contains('light'),f=()=>set(l,true);VT&&!rm.matches?document.startViewTransition(f):f()};
if(lg)lg.insertAdjacentElement('afterend',b);else document.body.appendChild(b);
set(H.classList.contains('light'),false);
})();
