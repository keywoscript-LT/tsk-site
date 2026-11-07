/* ===== v8: параллакс-наклон карточек игроков ===== */
(()=>{
const SEL='.edge[onclick^="openP"]',MAX=14;
const fine=matchMedia('(hover:hover) and (pointer:fine)'),rm=matchMedia('(prefers-reduced-motion:reduce)');
let cur=null,raf=0,last=null;
const parts=c=>c._p||(c._p=(()=>{const hero=c.querySelector('[class*="aspect-"]');if(!hero)return{};
 const av=hero.firstElementChild,nm=hero.querySelector('.bg-gradient-to-t'),bd=hero.querySelector('span.absolute'),g=hero.querySelector('.glare')||document.createElement('div');
 if(!g.parentNode){g.className='glare';hero.appendChild(g)}[av,nm,bd].forEach(e=>e&&e.classList.add('tl-l'));return{av,nm,bd,g}})());
const reset=c=>{if(!c)return;c.classList.remove('mv');c.style.transition='transform .6s cubic-bezier(.2,.8,.2,1),filter .2s';c.style.transform='';
 const q=parts(c);[q.av,q.nm,q.bd].forEach(e=>e&&(e.style.transform=''));if(q.g)q.g.style.opacity=0;c._r=null};
const draw=()=>{raf=0;const c=cur,e=last;if(!c||!e)return;
 const r=c._r||(c._r=c.getBoundingClientRect()),x=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),y=Math.min(1,Math.max(0,(e.clientY-r.top)/r.height)),
  dx=(x-.5)*2,dy=(y-.5)*2,sc=(c._dn?.96:1.04-.03*Math.min(1,Math.hypot(dx,dy)));
 /* курсор внизу -> низ карточки уходит ОТ тебя; справа -> правый край уходит */
 c.style.transform=`perspective(700px) rotateX(${(-dy*MAX).toFixed(2)}deg) rotateY(${(dx*MAX).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
 const q=parts(c);
 if(q.av)q.av.style.transform=`translate(${(-dx*9).toFixed(1)}px,${(-dy*7).toFixed(1)}px) scale(1.08)`;
 if(q.nm)q.nm.style.transform=`translate(${(dx*5).toFixed(1)}px,${(dy*4).toFixed(1)}px)`;
 if(q.bd)q.bd.style.transform=`translate(${(dx*7).toFixed(1)}px,${(dy*5).toFixed(1)}px)`;
 if(q.g){q.g.style.opacity=1;q.g.style.background=`radial-gradient(circle at ${(x*100).toFixed(0)}% ${(y*100).toFixed(0)}%,rgba(255,255,255,.55),transparent 55%)`}};
addEventListener('pointermove',e=>{
 if(!fine.matches||rm.matches||e.pointerType!=='mouse')return;
 const c=e.target.closest&&e.target.closest(SEL);
 if(c!==cur){reset(cur);cur=c;if(c){c.classList.add('tilt','mv');c.style.animation='none';c.style.transition='transform .12s ease-out,filter .2s';c._r=null}}
 if(!c)return;last=e;raf||(raf=requestAnimationFrame(draw))},{passive:true});
document.addEventListener('pointerdown',e=>{if(cur&&e.target.closest(SEL)===cur){cur._dn=1;last=e;draw()}});
['pointerup','pointercancel'].forEach(t=>addEventListener(t,()=>{if(cur){cur._dn=0;draw()}}));
document.documentElement.addEventListener('mouseleave',()=>{reset(cur);cur=null});
addEventListener('scroll',()=>{if(cur)cur._r=null},{passive:true});
})();

/* ===== v8: клавиатурная доступность карточек ===== */
(()=>{
const v=document.getElementById('v');if(!v)return;let t=0;
const fix=()=>{t=0;v.querySelectorAll('.edge[onclick],.g.r[onclick]').forEach(el=>{if(el.tabIndex<0&&el.tagName!=='BUTTON'){el.tabIndex=0;el.setAttribute('role','button')}})};
new MutationObserver(()=>{t||(t=requestAnimationFrame(fix))}).observe(v,{childList:true,subtree:true});fix();
v.addEventListener('keydown',e=>{const el=e.target;if((e.key==='Enter'||e.key===' ')&&el.getAttribute&&el.getAttribute('role')==='button'&&el.tagName!=='BUTTON'){e.preventDefault();el.click()}});
})();
