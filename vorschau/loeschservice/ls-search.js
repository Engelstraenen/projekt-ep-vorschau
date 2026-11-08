'use strict';
(function(){var f=document.getElementById('ls-search');if(!f)return;var q=document.getElementById('ls-q');
f.addEventListener('submit',function(e){e.preventDefault();var v=q.value.trim();if(v.length<2){q.setAttribute('aria-invalid','true');q.focus();return}
location.href='/projekt-ep-vorschau/kontakt.html?leistung='+encodeURIComponent('Bewertungs-Löschservice')+'&profil='+encodeURIComponent(v.slice(0,300))+'#contact-form'});})();
