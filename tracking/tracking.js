(function(){
  'use strict';
  var ST=[['eingegangen','Auftrag eingegangen','Bestätigung und Ansprechpartner'],['konzept','Konzept','Ziele, Struktur, Inhalte'],['design','Design','Entwürfe und Favorit'],['umsetzung','Umsetzung','Entwicklung und Inhalte'],['pruefung','Prüfung','Test auf allen Geräten, Freigabe'],['live','Live','Ihr Projekt ist online']];
  var TYP={website:'Website',app:'App',shop:'Online-Shop',system:'System',design:'Design',video:'Werbeclip'};
  var $=function(i){return document.getElementById(i)};
  function err(){$('tp-card').hidden=true;$('tp-err').hidden=false;document.title='Link nicht gefunden · PROJEKT EX'}
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  function fmt(d){if(!d)return'';var p=d.split('-');return p.length===3?p[2]+'.'+p[1]+'.'+p[0]:d}
  function safeUrl(u){try{var x=new URL(u,location.href);return(x.protocol==='https:'||x.origin===location.origin)?x.href:null}catch(e){return null}}
  var id=new URLSearchParams(location.search).get('id')||'';
  if(!/^[A-Za-z0-9_-]{24,64}$/.test(id))return err();
  fetch('p/'+id+'.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
    var idx=ST.findIndex(function(s){return s[0]===d.station});if(idx<0)idx=0;
    var pct=d.station==='live'?100:Math.round(idx/(ST.length-1)*100);
    $('tp-nr').textContent='Projekt '+(d.projekt||'');
    $('tp-h').textContent=d.titel||('Projekt '+(d.projekt||''));
    if(d.typ){$('tp-typ').textContent=TYP[d.typ]||d.typ;$('tp-typ').hidden=false}
    $('tp-pct').textContent=pct+' %';$('tp-now').textContent=ST[idx][1];
    $('tp-fill').style.setProperty('--p',Math.max(pct/100,.02));
    var ol=$('tp-steps'),h=d.stationen||{};
    ST.forEach(function(s,i){
      var li=el('li',i<idx||pct===100?'done':i===idx?'now':'open'),info=h[s[0]]||{};
      var dot=el('span','trk-dot');dot.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var tx=el('span');tx.appendChild(el('b',null,s[1]));tx.appendChild(el('small',null,s[2]));
      if(info.notiz)tx.appendChild(el('p',null,info.notiz));
      var u=info.link&&safeUrl(info.link);if(u){var a=el('a','tp-link','Ansehen →');a.href=u;a.target='_blank';a.rel='noopener noreferrer';tx.appendChild(a)}
      var b=info.bild&&safeUrl(info.bild);if(b){var im=el('img');im.src=b;im.alt='Vorschau '+s[1];im.loading='lazy';tx.appendChild(im)}
      li.appendChild(dot);li.appendChild(tx);li.appendChild(el('em',null,i===idx&&pct<100?'Aktuell':fmt(info.datum)));
      if(i===idx)li.setAttribute('aria-current','step');ol.appendChild(li);
    });
    if(d.aktualisiert)$('tp-upd').textContent='Zuletzt aktualisiert: '+fmt(d.aktualisiert);
  }).catch(err);
})();
