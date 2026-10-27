import {matches} from './core.js';
const root=document.documentElement,ui=JSON.parse(document.getElementById('page-ui').textContent);
const search=document.getElementById('dll-search'),rows=[...document.querySelectorAll('[data-dll-row]')];
let selected='all';
function refresh(){
 let count=0;
 for(const row of rows){const show=matches(row.dataset.search,row.dataset.kind,search.value,selected);row.hidden=!show;if(show)count++;}
 document.getElementById('result-count').textContent=ui.count.replace('{n}',count.toLocaleString(root.lang));
 document.getElementById('no-results').hidden=count!==0;
 document.getElementById('search-clear').hidden=!search.value;
}
if(search){
 search.addEventListener('input',refresh);
 search.addEventListener('keydown',event=>{if(event.key==='Escape'){search.value='';refresh();}});
 document.getElementById('search-clear').addEventListener('click',()=>{search.value='';refresh();search.focus();});
 for(const button of document.querySelectorAll('[data-filter]'))button.addEventListener('click',()=>{
  selected=button.dataset.filter;for(const item of document.querySelectorAll('[data-filter]'))item.setAttribute('aria-pressed',String(item===button));refresh();
 });
 refresh();
}
const copy=document.getElementById('copy-name');
if(copy)copy.addEventListener('click',async()=>{
 const status=document.getElementById('copy-status');
 try{await navigator.clipboard.writeText(copy.dataset.name);status.textContent=ui.copied;}
 catch{status.textContent=ui.copyFail;}
});
document.documentElement.classList.add('app-ready');
