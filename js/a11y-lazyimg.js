/* a11y и ленивые картинки: кликабельным div/span даём role=button и клавиатуру, img — alt/lazy */
(function(){var roots=[document.getElementById('v'),document.getElementById('m')].filter(Boolean),q=0;
function fix(){q=0;roots.forEach(function(r){
r.querySelectorAll('[onclick]:not(a):not(button):not(input):not(select):not(textarea):not(label):not([role]):not([tabindex])').forEach(function(e){e.setAttribute('role','button');e.tabIndex=0});
r.querySelectorAll('img:not([alt])').forEach(function(i){i.setAttribute('alt','')});
r.querySelectorAll('img:not([loading])').forEach(function(i){i.loading='lazy';i.decoding='async'})})}
function sched(){if(!q){q=1;requestAnimationFrame(fix)}}
roots.forEach(function(r){new MutationObserver(sched).observe(r,{childList:true,subtree:true});
r.addEventListener('keydown',function(e){var t=e.target;if((e.key==='Enter'||e.key===' ')&&t.getAttribute&&t.getAttribute('role')==='button'&&t.hasAttribute('onclick')&&t.tagName!=='BUTTON'){e.preventDefault();t.click()}})});
fix()})();
