/* ===== v10: карточки игроков выезжают при скролле (только телефоны/планшеты) ===== */
(()=>{
const v=document.getElementById('v');
if(!v||!('IntersectionObserver'in window)||!matchMedia('(pointer:coarse)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const SEL='.edge[onclick^="openP"]';
const io=new IntersectionObserver(es=>{let k=0;
 es.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top||a.boundingClientRect.left-b.boundingClientRect.left).forEach(e=>{
  const c=e.target;io.unobserve(c);
  c.style.setProperty('--d',Math.min(k++,6)*70+'ms'); /* лёгкая «волна» внутри одной пачки */
  c.classList.add('rv-go');c.classList.remove('rv');
  setTimeout(()=>{c.classList.remove('rv-go');c.style.removeProperty('--d')},1000)})},
 {threshold:.1,rootMargin:'0px 0px -5% 0px'});
const scan=()=>{v.querySelectorAll(SEL).forEach(c=>{if(c._rv)return;c._rv=1;
 const r=c.getBoundingClientRect();
 if(r.top<innerHeight*.95)return; /* то, что уже на экране, не прячем */
 const dx=r.left+r.width/2-innerWidth/2;
 c.style.animation='none'; /* отключаем стандартный fade, чтобы не конфликтовал */
 c.style.setProperty('--tx',(Math.abs(dx)<20?0:Math.sign(dx)*26)+'px'); /* левая колонка — слева, правая — справа */
 c.classList.add('rv');io.observe(c)})};
new MutationObserver(scan).observe(v,{childList:true,subtree:true});
scan();
})();
