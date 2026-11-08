'use strict';
document.addEventListener('submit', event => {event.preventDefault();event.stopImmediatePropagation()},true);
document.querySelectorAll('form').forEach(form=>{form.querySelectorAll('input,textarea,select,button').forEach(control=>{control.disabled=true});form.setAttribute('aria-label','Formular in dieser Vorschau deaktiviert')});
