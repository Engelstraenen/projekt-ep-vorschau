/* Browser-only test model. No network, payment, email or production ledger. */
(function(root){
'use strict';
const money = n => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(n/100);
function amounts(net, deletion){
 if(!Number.isSafeInteger(net)||net<0||net>100000000) throw Error('Ungültiger Testbetrag');
 const tax=Math.round(net*19/100),gross=net+tax;
 const depositNet=deletion?0:Math.round(net*30/100),depositTax=deletion?0:Math.round(depositNet*19/100);
 return {net,tax,gross,depositNet,depositTax,deposit:depositNet+depositTax,rest:gross-depositNet-depositTax};
}
function create(id,net,deletion){return {id,net,deletion,paid:false,closed:false,docs:[],mails:[],events:[]};}
function apply(state,event){
 const s=JSON.parse(JSON.stringify(state));
 const key=s.id+':'+event;
 if(s.events.includes(key)) return {state:s,note:'Doppelereignis erkannt: keine neue Rechnung und keine neue Mailvorschau.'};
 const a=amounts(s.net,s.deletion);
 const add=(kind,net,tax,credit)=>{
  const id='TEST-'+s.id+'-'+kind;
  s.docs.push({id,kind,net,tax,credit:credit||0,creditNet:credit?a.depositNet:0,creditTax:credit?a.depositTax:0});
  s.mails.push({id:id+':email:v1',invoice:id});
 };
 if(event==='order.confirmed'){
  if(!s.deletion) add('ANZ',a.depositNet,a.depositTax,0);
 }else if(event==='payment.confirmed'){
  if(s.deletion||!s.events.includes(s.id+':order.confirmed')) return {state:s,note:'Erst einen regulären Testauftrag bestätigen.'};
  s.paid=true;
 }else if(event==='service.completed'){
  if(s.deletion||!s.paid) return {state:s,note:'Zuerst den Eingang der Anzahlung simulieren. Das legt keinen echten Leistungsbeginn fest.'};
  add('SCHLUSS',a.net,a.tax,a.deposit);s.closed=true;
 }else if(event==='period.closed:TEST-14-TAGE'){
  if(!s.deletion||!s.events.includes(s.id+':order.confirmed')) return {state:s,note:'Erst einen Testauftrag für den Löschservice bestätigen.'};
  if(s.net>0)add('SAMMEL',a.net,a.tax,0);s.closed=true;
 }else return {state:s,note:'Unbekanntes Testereignis.'};
 s.events.push(key);
 return {state:s,note:'Testereignis verarbeitet. Nur lokale Muster, kein Versand und keine Zahlung.'};
}
const api={money,amounts,create,apply};
if(typeof module!=='undefined')module.exports=api;else root.OrderPreview=api;
})(typeof window!=='undefined'?window:globalThis);
