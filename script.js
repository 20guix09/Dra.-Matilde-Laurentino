'use strict';
const waBase='https://wa.me/5543991664265';
document.querySelectorAll('[data-wa]').forEach(a=>{a.href=waBase+'?text='+encodeURIComponent(a.dataset.wa)});
const toggle=document.querySelector('.menu-toggle');
const menu=document.querySelector('#menu');
function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu')}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){closeMenu();toggle.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
window.matchMedia('(min-width:801px)').addEventListener('change',closeMenu);
const tabs=[...document.querySelectorAll('[role="tab"]')];
function activateTab(tab){tabs.forEach(t=>{const active=t===tab;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active})}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activateTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(index+1)%tabs.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activateTab(tabs[next]);tabs[next].focus()}})});
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();const name=document.querySelector('#name').value.trim();if(!name){document.querySelector('#name').focus();return}const interest=document.querySelector('#interest').value;const text=`Olá, Matilde! Meu nome é ${name}. Vim pelo site e gostaria de saber mais sobre ${interest} e consultar a disponibilidade para um atendimento.`;window.location.assign(waBase+'?text='+encodeURIComponent(text))});
document.querySelector('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}
// Keep the native select as a no-JavaScript fallback and the form's value source.
const careSelect=document.querySelector('#interest');
const careWrapper=document.createElement('div');
careWrapper.className='care-select';
const careTrigger=document.createElement('button');
careTrigger.type='button';
careTrigger.id='interest-trigger';
careTrigger.className='care-select-trigger';
careTrigger.setAttribute('role','combobox');
careTrigger.setAttribute('aria-expanded','false');
careTrigger.setAttribute('aria-haspopup','listbox');
careTrigger.setAttribute('aria-controls','interest-options');
const careLabel=document.querySelector('label[for="interest"]');
careLabel.id='interest-label';
careLabel.htmlFor=careTrigger.id;
careTrigger.setAttribute('aria-labelledby','interest-label interest-trigger');
const careList=document.createElement('div');
careList.id='interest-options';
careList.className='care-select-options';
careList.setAttribute('role','listbox');
careList.setAttribute('aria-labelledby','interest-label');
careList.hidden=true;
const careOptions=[...careSelect.options].map((option,index)=>{
 const el=document.createElement('div');
 el.id='interest-option-'+index;
 el.className='care-select-option';
 el.setAttribute('role','option');
 el.textContent=option.textContent;
 el.addEventListener('pointerdown',event=>event.preventDefault());
 el.addEventListener('click',()=>chooseCare(index));
 el.addEventListener('pointermove',()=>highlightCare(index));
 careList.append(el);
 return el;
});
careWrapper.append(careTrigger,careList);
careSelect.after(careWrapper);
careSelect.hidden=true;
let careActive=careSelect.selectedIndex;
function syncCare(){careTrigger.textContent=careSelect.options[careSelect.selectedIndex].textContent;careOptions.forEach((el,i)=>el.setAttribute('aria-selected',String(i===careSelect.selectedIndex)))}
function highlightCare(index){careActive=index;careOptions.forEach((el,i)=>el.classList.toggle('is-active',i===index));careTrigger.setAttribute('aria-activedescendant',careOptions[index].id)}
function closeCare(){careList.hidden=true;careTrigger.setAttribute('aria-expanded','false');careTrigger.removeAttribute('aria-activedescendant')}
function openCare(){careList.hidden=false;careTrigger.setAttribute('aria-expanded','true');highlightCare(careSelect.selectedIndex)}
function chooseCare(index){careSelect.selectedIndex=index;careSelect.dispatchEvent(new Event('change',{bubbles:true}));syncCare();closeCare();careTrigger.focus()}
careTrigger.addEventListener('click',()=>careList.hidden?openCare():closeCare());
let careSearch='',careSearchTimer;
careTrigger.addEventListener('keydown',event=>{
 const key=event.key;
 if(key==='Tab'){closeCare();return}
 if(key==='Escape'){event.preventDefault();closeCare();return}
 if(['ArrowDown','ArrowUp','Home','End'].includes(key)){
  event.preventDefault();
  const wasClosed=careList.hidden;
  if(wasClosed)openCare();
  if(key==='Home')highlightCare(0);
  else if(key==='End')highlightCare(careOptions.length-1);
  else if(!wasClosed)highlightCare((careActive+(key==='ArrowDown'?1:-1)+careOptions.length)%careOptions.length);
  careOptions[careActive].scrollIntoView({block:'nearest'});
  return;
 }
 if(key==='Enter'||key===' '){event.preventDefault();if(careList.hidden)openCare();else chooseCare(careActive);return}
 if(key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
  event.preventDefault();careSearch+=key.toLocaleLowerCase('pt-BR');clearTimeout(careSearchTimer);careSearchTimer=setTimeout(()=>{careSearch=''},650);
  const index=careOptions.findIndex(el=>el.textContent.toLocaleLowerCase('pt-BR').startsWith(careSearch));
  if(index>=0){if(careList.hidden)openCare();highlightCare(index)}
 }
});
careSelect.addEventListener('change',syncCare);
document.addEventListener('click',event=>{if(!careWrapper.contains(event.target))closeCare()});
careWrapper.addEventListener('focusout',()=>{queueMicrotask(()=>{if(!careWrapper.contains(document.activeElement))closeCare()})});
syncCare();
