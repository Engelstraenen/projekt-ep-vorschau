(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Kopfzeile: beim Runterscrollen ausblenden */
var head=$('[data-head]'),last=0;
if(head){window.addEventListener('scroll',function(){var y=window.scrollY;var open=$('.nav.is-open');head.classList.toggle('is-up',!reduce&&!open&&y>240&&y>last+4);if(y<last-4||y<240)head.classList.remove('is-up');last=y;},{passive:true});}

/* Mobil-Menü */
var btn=$('[data-menu]'),nav=$('#nav');
function setMenu(o){if(!btn)return;btn.setAttribute('aria-expanded',String(o));nav.classList.toggle('is-open',o);$('.menu-btn__t',btn).textContent=o?'Schließen':'Menü';}
if(btn){btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true');});
 nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false);});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&btn.getAttribute('aria-expanded')==='true'){setMenu(false);btn.focus();}});}

/* Navigation: aktueller Abschnitt */
if('IntersectionObserver' in window){
 var links=$$('.nav a[href^="#"]');
 var secs=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1));}).filter(Boolean);
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.toggleAttribute('aria-current',false);if(a.getAttribute('href')==='#'+e.target.id)a.setAttribute('aria-current','true');});}});},{rootMargin:'-45% 0px -50% 0px'});
 secs.forEach(function(s){io.observe(s);});
 var idx=$$('[data-idx]');
 var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){idx.forEach(function(a){a.classList.toggle('is-on',a.dataset.idx===e.target.dataset.svc);});}});},{rootMargin:'-40% 0px -55% 0px'});
 $$('[data-svc]').forEach(function(s){io2.observe(s);});
 var dock=$('[data-dock]'),hero=$('.hero'),erst=$('#erstgespraech');
 if(dock&&hero&&erst){var st={h:true,e:false};var upd=function(){dock.classList.toggle('is-on',!st.h&&!st.e);};
  new IntersectionObserver(function(es){st.h=es[0].isIntersecting;upd();}).observe($('.hero__row'));
  new IntersectionObserver(function(es){st.e=es[0].isIntersecting;upd();}).observe(erst);}
}

/* Thema vorwählen */
$$('[data-topic]').forEach(function(a){a.addEventListener('click',function(){var r=$('input[name="thema"][value="'+a.dataset.topic+'"]');if(r)r.checked=true;});});

/* Steuertermine: nächste drei ab heute */
var dl=$('[data-dates]');
if(dl){
 var WD=['So','Mo','Di','Mi','Do','Fr','Sa'];
 var shift=function(d){while(d.getDay()===0||d.getDay()===6)d.setDate(d.getDate()+1);return d;};
 var today=new Date();today.setHours(0,0,0,0);var out=[];
 for(var i=0;i<14&&out.length<4;i++){
  var y=today.getFullYear(),m=today.getMonth()+i,base=new Date(y,m,1);
  var d10=shift(new Date(base.getFullYear(),base.getMonth(),10)),mo=base.getMonth()+1;
  var t='Umsatzsteuer-Voranmeldung, Lohnsteuer-Anmeldung';
  if(mo%3===0)t='Umsatzsteuer, Lohnsteuer, Einkommen- und Körperschaftsteuer, Vorauszahlung';
  out.push([d10,t]);
  if(mo%3===2)out.push([shift(new Date(base.getFullYear(),base.getMonth(),15)),'Gewerbesteuer und Grundsteuer, Vorauszahlung']);
 }
 out=out.filter(function(x){return x[0]>=today;}).sort(function(a,b){return a[0]-b[0];}).slice(0,3);
 var p=function(n){return (n<10?'0':'')+n;};
 dl.textContent='';
 out.forEach(function(x){var d=x[0],li=document.createElement('li'),tm=document.createElement('time'),sp=document.createElement('span');
  tm.dateTime=d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());tm.textContent=WD[d.getDay()]+', '+p(d.getDate())+'.'+p(d.getMonth()+1)+'.'+d.getFullYear();sp.textContent=x[1];li.appendChild(tm);li.appendChild(sp);dl.appendChild(li);});
}

/* Formular */
var form=$('[data-form]');
if(form){form.addEventListener('submit',function(e){
 var bad=[];
 var chk=function(el,ok,err){el.setAttribute('aria-invalid',ok?'false':'true');$('#'+err).hidden=ok;if(!ok)bad.push(el);};
 var n=$('#f-name'),m=$('#f-mail'),ds=$('input[name="datenschutz"]',form);
 chk(n,n.value.trim().length>1,'e-name');
 chk(m,/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim()),'e-mail');
 chk(ds,ds.checked,'e-ds');
 if(bad.length){e.preventDefault();bad[0].focus();}
});}

/* Danke-Seite */
var sum=$('[data-sum]');
if(sum){var q=new URLSearchParams(location.search);var L={laufend:'Laufende Steuerberatung',nachfolge:'Unternehmensnachfolge',erbschaft:'Erbschaft und Schenkung',gruendung:'Gründung und Rechtsform',pruefung:'Betriebsprüfung',frage:'Eine konkrete Frage',kanzlei:'In der Kanzlei',video:'Per Video',telefon:'Am Telefon'};
 var any=false;$$('[data-k]',sum).forEach(function(dd){var v=q.get(dd.dataset.k);if(v){any=true;dd.textContent=L[v]||v.slice(0,80);}else dd.parentNode.hidden=true;});sum.hidden=!any;}

/* Bewegung */
if(reduce||!window.gsap||!window.ScrollTrigger)return;
var gsap=window.gsap;gsap.registerPlugin(window.ScrollTrigger);
var lines=$$('.hero__h .ln>span');
if(lines.length)gsap.fromTo(lines,{yPercent:105},{yPercent:0,duration:1.1,ease:'expo.out',stagger:.09,delay:.1});
var fig=$('[data-hero-fig] .hero__img');
if(fig){gsap.fromTo(fig,{clipPath:'inset(2% 2% 0% 2%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',scrollTrigger:{trigger:fig,start:'top 85%',end:'top 25%',scrub:.6}});
 gsap.fromTo($('img',fig),{scale:1.04},{scale:1,ease:'none',scrollTrigger:{trigger:fig,start:'top bottom',end:'bottom top',scrub:true}});}
/* Haarlinien ziehen sich auf */
$$('.svc,.partner,.art,.faq__i,.lead-art,.dates,.kanzlei__txt,.staff,.team__head,.rg__head').forEach(function(el){gsap.from(el,{y:24,opacity:0,duration:.9,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});});
/* Leitsatz Wort für Wort */
var qt=$('[data-quote]');
if(qt){var words=qt.textContent.trim().split(/\s+/);qt.textContent='';words.forEach(function(w,i){var s=document.createElement('span');s.className='w';s.textContent=w;qt.appendChild(s);if(i<words.length-1)qt.appendChild(document.createTextNode(' '));});
 gsap.fromTo($$('.w',qt),{opacity:.16},{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:qt,start:'top 80%',end:'bottom 45%',scrub:.5}});}
/* Zeitleiste */
var rule=$('[data-steps] .steps__rule i');
if(rule)gsap.fromTo(rule,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:'[data-steps]',start:'top 80%',end:'bottom 60%',scrub:.6}});
/* Zahlen */
$$('[data-count]').forEach(function(el){var n=+el.dataset.count,o={v:0};gsap.to(o,{v:n,duration:1.6,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 90%',once:true},onUpdate:function(){el.textContent=Math.round(o.v);}});});
/* Wortmarke */
var fw=$('[data-foot] text');
if(fw)gsap.from(fw,{yPercent:60,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'[data-foot]',start:'top 95%',once:true}});
window.addEventListener('load',function(){window.ScrollTrigger.refresh();if(location.hash){var t=document.getElementById(location.hash.slice(1));if(t)t.scrollIntoView();}});
})();
