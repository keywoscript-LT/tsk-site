/* свёртываемые блоки на странице «Матчи»: приватные лиги, MVP, прогнозы, серия */
(()=>{
const K='tsk_cz',st=(()=>{try{return JSON.parse(localStorage.getItem(K))||{}}catch{return{}}})(),save=()=>{try{localStorage.setItem(K,JSON.stringify(st))}catch{}};
const css=document.createElement('style');
css.textContent='.cz-b{flex-shrink:0;margin-left:auto;width:32px;height:32px;border-radius:10px;display:inline-grid;place-items:center;background:rgba(127,127,127,.16);color:inherit;transition:background .2s,transform .2s}.cz-b:active{transform:scale(.92)}.cz-b svg{width:16px;height:16px;transition:transform .25s}.cz-c .cz-b svg{transform:rotate(-90deg)}.cz-c>:not(:first-child){display:none!important}section[data-cz=mvp]>:first-child{display:flex;align-items:center;gap:8px}';
document.head.appendChild(css);
const chev='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
window.czT=b=>{const s=b.closest('section'),k=s.dataset.cz,c=s.classList.toggle('cz-c');st[k]=c?1:0;save();b.setAttribute('aria-expanded',c?'false':'true')};
const keyOf=(t,i)=>{t=t.slice(0,80).toLowerCase();return /приват|private/.test(t)?'lg':/mvp/.test(t)?'mvp':/серия|streak/.test(t)?'streak':/прогноз|predict/.test(t)?'pred':'x'+i};
const wrap=html=>{let i=html.indexOf('</h1>');if(i<0)return html;i+=5;const head=html.slice(0,i);let out='',n=0,rest=html.slice(i);
 for(;;){const m=rest.match(/^\s*<section class="g mb-3/);if(!m)break;const e=rest.indexOf('</section>');if(e<0)break;const blk=rest.slice(0,e+10);rest=rest.slice(e+10);
  const t=document.createElement('template');t.innerHTML=blk.trim();const sec=t.content.firstElementChild;if(!sec){out+=blk;continue}
  const k=keyOf(sec.textContent.trim(),n++);sec.dataset.cz=k;const f=sec.firstElementChild;
  if(f){if(k=='mvp'){const w=document.createElement('div');w.className='min-w-0 flex-1';while(f.firstChild)w.appendChild(f.firstChild);f.appendChild(w)}
   const b=document.createElement('button');b.type='button';b.className='cz-b';b.setAttribute('aria-label','Свернуть / развернуть');b.setAttribute('aria-expanded',st[k]?'false':'true');b.setAttribute('onclick','czT(this)');b.innerHTML=chev;f.appendChild(b)}
  if(st[k])sec.classList.add('cz-c');out+=sec.outerHTML}
 return head+out+rest};
const _m=V.matches;V.matches=q=>wrap(_m(q));
})();
