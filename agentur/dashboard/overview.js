
(function(){
 const D=window.EX_AGENTUR, nf=new Intl.NumberFormat('de-DE'), eu=n=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
 document.getElementById('badge').textContent=D.label;
 document.getElementById('hinweis').textContent=D.hinweis;
 const o=D.overview;
 document.getElementById('kpis').innerHTML=`
  <article class="glass stat"><div class="stat-label">E-Mail-Akquise</div><div class="stat-value">${nf.format(o.emailSent)}</div><div class="stat-meta"><strong>Beispiel</strong> · Öffnung ${o.openRate} % · Klick ${o.clickRate} %</div></article>
  <article class="glass stat"><div class="stat-label">Aufträge</div><div class="stat-value">${o.ordersOpen+o.ordersWork+o.ordersDone}</div><div class="stat-meta"><strong>Beispiel</strong> · ${o.ordersOpen} offen · ${o.ordersWork} in Arbeit · ${o.ordersDone} fertig</div></article>
  <article class="glass stat"><div class="stat-label">Umsatz</div><div class="stat-value">${eu(o.revenue)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>`;
 document.getElementById('botgrid').innerHTML=`
  <article class="glass stat"><div class="stat-label">WhatsApp</div><div class="stat-value">${nf.format(o.wa)}</div><div class="stat-meta"><strong>Beispiel</strong> · Kontakte</div></article>
  <article class="glass stat"><div class="stat-label">Telefon</div><div class="stat-value">${nf.format(o.phone)}</div><div class="stat-meta"><strong>Beispiel</strong> · Kontakte</div></article>
  <article class="glass stat"><div class="stat-label">Website-Chat</div><div class="stat-value">${nf.format(o.chat)}</div><div class="stat-meta"><strong>Beispiel</strong> · ${o.chatLeads} Leads</div></article>`;
 document.getElementById('leads').innerHTML=D.leads.map(l=>`<article class="item lead"><div><span class="who">${l.name}</span><p>${D.channels[l.channel].name} · ${l.interest}<br>${l.note} · Status: ${l.status}</p></div><a href="./social/">${l.crm}</a></article>`).join('');
})();