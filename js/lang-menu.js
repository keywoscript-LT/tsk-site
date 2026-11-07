/* выбор языка: список вместо перебора */
(function(){
function close(){var m=document.getElementById('lgm');if(m)m.remove();document.removeEventListener('click',out,true);document.removeEventListener('keydown',esc,true)}
function out(e){var m=document.getElementById('lgm'),b=document.getElementById('lg');if(m&&!m.contains(e.target)&&!(b&&b.contains(e.target)))close()}
function esc(e){if(e.key==='Escape')close()}
  addEventListener('resize',close);
window.langMenu=function(ev){
  if(document.getElementById('lgm')){close();return}
  var b=document.getElementById('lg'),r=b.getBoundingClientRect(),m=document.createElement('div');
  m.id='lgm';m.setAttribute('role','menu');
  m.style.cssText='position:fixed;z-index:120;visibility:hidden;top:0;left:0;width:min(300px,calc(100vw - 16px));max-height:min(70vh,520px);overflow:auto;overscroll-behavior:contain;padding:6px;border-radius:14px;background:var(--s2);border:1px solid var(--wd015);box-shadow:0 12px 40px rgba(0,0,0,.35);display:grid;grid-template-columns:1fr 1fr;gap:4px';
  LANGS.forEach(function(x){
    var a=document.createElement('button');a.type='button';a.setAttribute('role','menuitem');
    var on=x[0]===S.lang;
    a.style.cssText='text-align:left;padding:8px 10px;border-radius:9px;font-size:13px;font-weight:700;color:'+(on?'var(--cy)':'var(--t2)')+';background:'+(on?'color-mix(in srgb,var(--cy) 12%,transparent)':'transparent')+';border:1px solid '+(on?'color-mix(in srgb,var(--cy) 40%,transparent)':'transparent')+';cursor:pointer;display:flex;gap:8px;align-items:center';
    a.innerHTML='<span style="opacity:.55;font-size:11px;width:20px;text-transform:uppercase">'+x[0]+'</span><span>'+x[1]+'</span>';
    a.onmouseenter=function(){if(!on)a.style.background='var(--wb007)'};
    a.onmouseleave=function(){if(!on)a.style.background='transparent'};
    a.onclick=function(){close();S.lang=x[0];ui()};
    m.appendChild(a)});
  document.body.appendChild(m);
  (function(){var w=m.offsetWidth,h=m.offsetHeight,vw=document.documentElement.clientWidth,vh=innerHeight,g=6,
    left=Math.min(Math.max(8,r.left),vw-w-8),
    below=vh-r.bottom-g-8,above=r.top-g-8,top;
    if(h<=below||below>=above){top=r.bottom+g;if(h>below)m.style.maxHeight=Math.max(120,below)+'px'}
    else{if(h>above){m.style.maxHeight=Math.max(120,above)+'px';h=m.offsetHeight}top=r.top-g-h}
    m.style.left=Math.round(left)+'px';m.style.top=Math.round(Math.max(8,top))+'px';m.style.visibility='visible'})();
  setTimeout(function(){document.addEventListener('click',out,true);document.addEventListener('keydown',esc,true)},0)}
})();
