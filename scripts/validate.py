from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit,unquote
import json,re,xml.etree.ElementTree as ET,hashlib
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist'
cfg=json.loads((ROOT/'APP.json').read_text(encoding='utf-8'));cat=json.loads((ROOT/'src/catalog.json').read_text(encoding='utf-8'));locales=json.loads((ROOT/'src/locales.json').read_text(encoding='utf-8'))
assert cat['count']==len(cat['files'])==1083
assert len({f['name'] for f in cat['files']})==1083
assert all(len(f['packages'])>0 for f in cat['files'])
assert set(locales)==set(cfg['languages']) and len({frozenset(x) for x in locales.values()})==1
for t in locales.values():assert all(isinstance(x,str) and x.strip() for x in t.values())
class Document(HTMLParser):
 def __init__(self,text):super().__init__();self.ids=[];self.links=[];self.assets=[];self.canonical=[];self.alternates={};self.h1=0;self.rows=0;self.downloads=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  if 'data-dll-row' in a:self.rows+=1
  if tag=='a':
   self.links.append(a.get('href',''))
   if a.get('class')=='download':self.downloads+=1
  if tag=='link':
   if a.get('rel')=='canonical':self.canonical.append(a.get('href'))
   if a.get('rel')=='alternate':self.alternates[a.get('hreflang')]=a.get('href')
   if a.get('rel') in ['stylesheet','icon']:self.assets.append(a.get('href'))
  if tag=='script' and a.get('src') and not a['src'].startswith('https:'):self.assets.append(a['src'])
ns='{http://www.sitemaps.org/schemas/sitemap/0.9}';sitemap=ET.parse(DIST/'sitemap.xml').getroot();urls=[x.text for x in sitemap.findall(ns+'url/'+ns+'loc')]
assert len(urls)==len(set(urls))==6*(cat['count']+1)
assert cfg['public'] and cfg['origin']=='https://nanalab.kr/dll-directory'
assert hashlib.sha256((ROOT/'src/catalog.json').read_bytes()).hexdigest()=='e42952744695eb9f1934ca7f12b81745f5a94c417dcc14fbb524a754bb1aedbd','Catalog changed during presentation update'
base_path=urlsplit(cfg['origin']).path.rstrip('/')+'/'
xhtml='{http://www.w3.org/1999/xhtml}'
for item in sitemap.findall(ns+'url'):
 actual={link.get('hreflang'):link.get('href') for link in item.findall(xhtml+'link')}
 current=item.findtext(ns+'loc')
 local_route=current.removeprefix(cfg['origin']+'/')
 detail=local_route[local_route.index('dll/'):] if 'dll/' in local_route else ''
 expected={lang:cfg['origin']+'/'+('' if lang=='ko' else lang+'/')+detail for lang in cfg['languages']}
 expected['x-default']=expected['ko']
 assert actual==expected,('sitemap alternates',current)
pages=0;links=0;bytes_total=0
for lang in cfg['languages']:
 prefix='' if lang=='ko' else lang+'/'
 for f in [None]+cat['files']:
  route=prefix+('dll/'+f['slug']+'/' if f else '')
  path=DIST/route/'index.html';s=path.read_text(encoding='utf-8');d=Document(s);pages+=1;bytes_total+=path.stat().st_size
  expected=cfg['origin']+'/'+route
  assert d.canonical==[expected] and expected in urls,(route,'canonical')
  assert d.h1==1 and len(d.ids)==len(set(d.ids)),route
  assert set(d.alternates)==set(cfg['languages'])|{'x-default'},route
  for target_lang in cfg['languages']:
   target_route=('' if target_lang=='ko' else target_lang+'/')+('dll/'+f['slug']+'/' if f else '')
   assert d.alternates[target_lang]==cfg['origin']+'/'+target_route
  assert 'index,follow' in s and 'noindex' not in s and '<html lang="'+lang+'"' in s
  assert not re.search(r'class="(?:intro|search-help|quality-note|download-note|sdk-note|eyebrow)"',s),route
  assert 'DLL 이름으로 검색하고' not in s,route
  for marker in ['ca-pub-9767176956440077','GTM-NV2WWQXB','G-2ZYSF0173P','static.cloudflareinsights.com/beacon.min.js','https://nanalab.kr/apps/']:assert marker in s,(route,marker)
  if f:
   assert d.downloads==len(f['packages']) and d.rows==0
   assert s.index('<h1>')<s.index('<aside class="ad"')<s.index('<a class="download"'),route
  else:assert d.rows==cat['count'] and 'id="dll-search"' in s
  for value in d.links+d.assets:
   u=urlsplit(urljoin(expected,value));links+=1
   if u.netloc!=urlsplit(cfg['origin']).netloc:continue
   if not u.path.startswith(base_path):continue
   local=DIST/unquote(u.path.removeprefix(base_path))
   if u.path.endswith('/'):local=local/'index.html'
   assert local.is_file(),(route,value,str(local))
assert len(list(DIST.rglob('*.html')))==pages
for p in ROOT.rglob('*'):
 if p.is_file() and '.git' not in p.parts:
  assert p.suffix.lower() not in ['.dll','.exe','.msi','.cab','.nupkg','.msix','.zip','.pdb'],str(p)
for f in cat['files']:
 assert f['name']!='marshal.dll'
 for p in f['packages']:assert not re.search(r'(?:^|[/!])ref/',p['evidenceMember'].lower())
out={'pass':True,'dlls':cat['count'],'runtime':sum(f['kind']=='runtime' for f in cat['files']),'sdkOnly':sum(f['kind']=='sdk' for f in cat['files']),'packageMappings':sum(len(f['packages']) for f in cat['files']),'languages':len(cfg['languages']),'homePages':6,'downloadPages':6*cat['count'],'pages':pages,'linksAndAssetsChecked':links,'htmlBytes':bytes_total,'binariesHosted':0,'catalogSha256':hashlib.sha256((ROOT/'src/catalog.json').read_bytes()).hexdigest(),'browserQA':'Separate responsive browser evidence is recorded in BROWSER_QA.json; this validator does not claim visual inspection.'}
(ROOT/'VALIDATION.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(out))
