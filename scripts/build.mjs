import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {completeTracking} from './publisher-tracking.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'dist');
const cfg=JSON.parse(fs.readFileSync(path.join(root,'APP.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'src/catalog.json'),'utf8'));
const locales=JSON.parse(fs.readFileSync(path.join(root,'src/locales.json'),'utf8'));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
fs.mkdirSync(path.join(out,'assets'),{recursive:true});
for(const f of ['style.css','app.js','core.js'])fs.copyFileSync(path.join(root,'src',f),path.join(out,'assets',f));
fs.writeFileSync(path.join(out,'assets/icon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="18" fill="#14243b"/><path d="M23 18h24l12 12v32H23z" fill="none" stroke="#fff" stroke-width="3"/><path d="M47 18v14h12M29 42h23M29 50h17" fill="none" stroke="#fff" stroke-width="3"/></svg>');
const languageNames={ko:'한국어',en:'English',es:'Español',zh:'中文',ja:'日本語',de:'Deutsch'};
const relative=(lang,filename)=>{const depth=(lang==='ko'?0:1)+(filename?2:0);return depth?'../'.repeat(depth):'./';};
const route=(lang,filename)=> (lang==='ko'?'':lang+'/')+(filename?'dll/'+filename+'/':'');
const url=(lang,filename)=>cfg.origin.replace(/\/$/,'')+'/'+route(lang,filename);
function shell(lang,filename,body){
 const t=locales[lang],prefix=relative(lang,filename),title=filename?filename+' · '+t.downloads:t.title;
 const menu=cfg.languages.map(l=>`<a href="${prefix+route(l,filename)}" lang="${l}"${l===lang?' aria-current="page"':''}>${languageNames[l]}</a>`).join('');
 const description=filename?filename+' — '+t.description:t.description;
 const alternates=cfg.languages.map(l=>`<link rel="alternate" hreflang="${l}" href="${url(l,filename)}">`).join('')+`<link rel="alternate" hreflang="x-default" href="${url('ko',filename)}">`;
 let html=`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#14243b"><meta name="robots" content="${cfg.public?'index,follow':'noindex,nofollow'}"><title>${esc(title)} · NaNa Lab</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url(lang,filename)}">${alternates}<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url(lang,filename)}"><link rel="icon" type="image/svg+xml" href="${prefix}assets/icon.svg"><link rel="stylesheet" href="${prefix}assets/style.css"></head><body><a class="skip" href="#main">${t.skip}</a><header class="topbar"><div class="shell"><a class="brand" href="${prefix+route(lang)}"><span class="brand-icon">.dll</span><strong>DLL DIRECTORY</strong></a><nav class="languages" aria-label="Language">${menu}</nav></div></header><main class="shell" id="main">${body}</main><footer class="footer"><div class="shell">© 2026 NaNa Lab</div></footer><a class="more-apps" href="https://nanalab.kr/apps/">More Apps</a><script id="page-ui" type="application/json">${JSON.stringify({count:t.count,copied:t.copied,copyFail:t.copyFail}).replaceAll('<','\\u003c')}</script><script type="module" src="${prefix}assets/app.js"></script></body></html>`;
 html=completeTracking(html).split(/\r?\n/).map(x=>x.replace(/[\t ]+$/,'')).join('\n').trimEnd()+'\n';
 const file=path.join(out,route(lang,filename),'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html);
}
for(const lang of cfg.languages){
 const t=locales[lang],date=new Intl.DateTimeFormat(lang,{dateStyle:'medium',timeZone:'Asia/Seoul'}).format(new Date(catalog.checkedAt));
 const total=new Intl.NumberFormat(lang).format(catalog.count);
 const rows=catalog.files.map(f=>`<a class="dll-row" href="${relative(lang)+route(lang,f.slug)}" data-dll-row data-kind="${f.kind}" data-search="${esc(f.name+' '+f.components.join(' '))}"><span class="filename">${esc(f.displayName)}</span><span class="component">${esc(f.components.join(' · '))}</span><span class="kind ${f.kind}">${t[f.kind]}</span><span class="arrow" aria-hidden="true">↗</span></a>`).join('');
 shell(lang,null,`<section class="hero"><h1>${t.title}</h1><div class="facts"><span><i></i>${t.verified}</span><span>${t.count.replace('{n}',total)}</span><span>${t.updated} ${date}</span></div></section><section class="search-panel"><label class="search-label" for="dll-search">${t.label}</label><div class="search-box"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="1.8"/></svg><input type="search" id="dll-search" autocomplete="off" spellcheck="false" maxlength="500" placeholder="${esc(t.placeholder)}"><button id="search-clear" type="button" aria-label="${esc(t.all)}" hidden>×</button></div></section><div class="toolbar"><div class="filters" role="group" aria-label="${esc(t.type)}">${['all','runtime','sdk'].map(k=>`<button type="button" data-filter="${k}" aria-pressed="${k==='all'}">${t[k]}</button>`).join('')}</div><span class="result-count" id="result-count" role="status" aria-live="polite">${t.count.replace('{n}',total)}</span></div><section class="list-wrap" aria-label="${esc(t.filename)}"><div class="list-head" aria-hidden="true"><span>${t.filename}</span><span>${t.component}</span><span>${t.type}</span><span></span></div>${rows}<div class="empty" id="no-results" hidden><strong>${t.empty}</strong></div></section>`);
 for(const f of catalog.files){
  const prefix=relative(lang,f.slug);
  const cards=f.packages.map(p=>`<article class="package-card"><div class="package-top"><h3>${esc(p.name)}</h3><span class="kind ${p.kind}">${t[p.kind]}</span></div><div class="package-meta"><span>${esc(p.architecture)}</span>${p.version?`<span>${esc(p.version)}</span>`:''}</div><a class="download" href="${esc(p.downloadUrl)}" target="_blank" rel="noopener noreferrer"><span>${p.linkType==='file'?t.direct:t.page}</span><span aria-hidden="true">↗</span></a><p class="link-host">${esc(new URL(p.downloadUrl).hostname)}</p><details class="proof"><summary>${t.proof}</summary><dl><dt>${t.member}</dt><dd>${esc(p.evidenceMember)}</dd><dt>${t.source}</dt><dd><a href="${esc(p.evidenceUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.evidenceUrl)}</a></dd><dt>${t.product}</dt><dd><a href="${esc(p.downloadPage)}" target="_blank" rel="noopener noreferrer">${esc(p.downloadPage)}</a></dd></dl></details></article>`).join('');
  shell(lang,f.slug,`<p class="breadcrumb"><a href="${prefix+route(lang)}">DLL DIRECTORY</a> / ${esc(f.displayName)}</p><section class="detail-hero"><h1>${esc(f.displayName)}</h1><div class="detail-actions"><span class="kind ${f.kind}">${t[f.kind]}</span><button id="copy-name" class="copy" type="button" data-name="${esc(f.displayName)}">${t.copy}</button><span id="copy-status" class="copy-status" role="status" aria-live="polite"></span></div></section><aside class="ad" aria-label="${esc(t.ad)}" data-nosnippet><span>${t.ad}</span></aside><div class="detail-layout"><section><h2 class="section-title">${t.downloads}</h2>${cards}<a class="back-link" href="${prefix+route(lang)}">← ${t.home}</a></section><aside class="sidebar"><h2>${t.about}</h2><dl><dt>${t.filename}</dt><dd class="filename">${esc(f.displayName)}</dd><dt>${t.component}</dt><dd>${esc(f.components.join(' · '))}</dd><dt>${t.packageCount}</dt><dd>${f.packages.length}</dd><dt>${t.updated}</dt><dd>${date}</dd></dl></aside></div>`);
 }
}
const sitemapEntries=cfg.languages.flatMap(lang=>[null,...catalog.files].map(file=>{
 const filename=file?.slug;
 const links=cfg.languages.map(l=>'<xhtml:link rel="alternate" hreflang="'+l+'" href="'+esc(url(l,filename))+'"/>').join('')+'<xhtml:link rel="alternate" hreflang="x-default" href="'+esc(url('ko',filename))+'"/>';
 return {url:url(lang,filename),xml:'<url><loc>'+esc(url(lang,filename))+'</loc>'+links+'</url>'};
}));
const urls=sitemapEntries.map(entry=>entry.url);
fs.writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'+sitemapEntries.map(entry=>entry.xml).join('')+'</urlset>\n');
fs.writeFileSync(path.join(out,'robots.txt'),`User-agent: *\n${cfg.public?'Allow: /':'Disallow: /'}\nSitemap: ${cfg.origin}/sitemap.xml\n`);
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.writeFileSync(path.join(root,'BUILD.json'),JSON.stringify({builtAt:new Date().toISOString(),files:catalog.count,languages:cfg.languages,homePages:cfg.languages.length,downloadPages:cfg.languages.length*catalog.count,pages:urls.length,public:cfg.public,origin:cfg.origin,binariesHosted:0},null,2)+'\n');
console.log(JSON.stringify({dlls:catalog.count,pages:urls.length,languages:cfg.languages.length}));
