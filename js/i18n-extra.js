/* список языков и названия стран; сами языковые пакеты — в lang/*.js */

/* ещё языки: pl de es pt fr it tr ja ko zh (интерфейс; редкие админ-строки — на английском) */
(function(){try{
window.INTN={};window.LGPACKS=["pl","de","es","pt","fr","it","tr","ja","ko","zh"];
var DNC={};window.dnl=function(l,c){try{return(DNC[l]||(DNC[l]=new Intl.DisplayNames([l],{type:'region'}))).of(c)}catch(e){}};
window.LANGS=[["ru", "Русский"], ["en", "English"], ["uk", "Українська"], ["kk", "Қазақша"], ["pl", "Polski"], ["de", "Deutsch"], ["es", "Español"], ["pt", "Português"], ["fr", "Français"], ["it", "Italiano"], ["tr", "Türkçe"], ["ja", "日本語"], ["ko", "한국어"], ["zh", "中文"]];
}catch(e){console.error('i18n',e)}})();
