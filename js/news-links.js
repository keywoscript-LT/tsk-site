/* новости и логотип: реальные ссылки */
(function(){
var on=window.openNews;
if(on&&window.TSKR){window.openNews=function(id){on(id);var n=(DB.news||[]).find(function(x){return x.id==id});if(n){TSKR.ent({k:'news',id:id});TSKR.setH('#/news/'+encodeURIComponent(id));TSKR.seo()}}}
var a=document.querySelector('header>div>a');if(a)a.href=TSK_ROOT;
})();
