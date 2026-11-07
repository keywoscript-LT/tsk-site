/* анимация нижних вкладок: вкладки не пересоздаются, «таблетка» плавно едет за активной */
window.botSet=function(L){var b=document.getElementById('bot');if(!b)return;
var same=b.querySelector('#bp')&&[].map.call(b.querySelectorAll('.bn'),function(a){return a.dataset.k}).join()==L.map(function(x){return x[0]}).join();
if(!same){b.innerHTML='<i id="bp"></i>'+L.map(function(x){return '<a href="'+TSK_ROOT+(x[0]=='news'||x[0]=='more'||x[0]=='admin'?'':x[0]+'/')+'" data-k="'+x[0]+'" onclick="go(\''+x[0]+'\');return false" class="bn'+(x[1]?' on':'')+'">'+x[2]+'</a>'}).join('')}
else{[].forEach.call(b.querySelectorAll('.bn'),function(a,i){a.classList.toggle('on',!!L[i][1]);if(a._h!==L[i][2]){a.innerHTML=L[i][2];a._h=L[i][2]}})}
var f=function(){var a=b.querySelector('.bn.on'),p=b.querySelector('#bp');if(!p)return;if(!a){p.style.width='0px';return}p.style.width=a.offsetWidth+'px';p.style.transform='translateX('+a.offsetLeft+'px)'};
f();var t0=performance.now();(function r(){f();if(performance.now()-t0<500)requestAnimationFrame(r)})()};
addEventListener('resize',function(){var b=document.getElementById('bot'),a=b&&b.querySelector('.bn.on'),p=b&&b.querySelector('#bp');if(a&&p){p.style.width=a.offsetWidth+'px';p.style.transform='translateX('+a.offsetLeft+'px)'}});
