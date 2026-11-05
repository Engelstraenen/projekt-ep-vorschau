/* Projekt-Tracking: Fortschritt füllt sich beim Scrollen (GSAP ScrollTrigger) */
(function(){
  var sec=document.querySelectorAll('[data-trk]'); if(!sec.length) return;
  sec.forEach(function(s){
    var items=[].slice.call(s.querySelectorAll('.trk-steps li')), fill=s.querySelector('.trk-fill'), pct=s.querySelector('[data-trk-pct]'), st=s.querySelector('[data-trk-state]');
    var n=items.length;
    function set(p){ // p 0..1
      var idx=Math.min(n-1,Math.floor(p*(n-1)+0.0001)), shown=Math.round(p*100);
      fill.style.setProperty('--p',Math.max(.02,p));
      if(pct) pct.textContent=shown+' %';
      items.forEach(function(li,i){li.classList.toggle('done',i<idx||p>=1);li.classList.toggle('now',i===idx&&p<1);var em=li.querySelector('em');if(em)em.textContent=(i<idx||p>=1)?'erledigt':(i===idx?'in Arbeit':'');});
      if(st) st.textContent=p>=1?'Live':items[idx].querySelector('b').textContent;
    }
    var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(rm||!window.gsap||!window.ScrollTrigger){ set(0.6); return; }
    gsap.registerPlugin(ScrollTrigger);
    var o={p:0}; set(0);
    gsap.to(o,{p:1,ease:'none',onUpdate:function(){set(o.p);},scrollTrigger:{trigger:s.querySelector('.trk-page'),start:'top 75%',end:'bottom 30%',scrub:0.6}});
    gsap.from(s.querySelectorAll('.trk-glass'),{y:40,opacity:0,duration:1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:s,start:'top 80%'}});
  });
})();
