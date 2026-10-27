from pathlib import Path
import json,datetime,hashlib,re
from urllib.parse import urlsplit
SITE=Path(__file__).resolve().parents[1];ROOT=SITE.parent
research=ROOT/'dll-portal-research';merged={};sources=[];excluded=[]
def official(url):
 u=urlsplit(url);h=u.hostname or ''
 return u.scheme=='https' and not u.username and not u.password and (h=='aka.ms' or h=='microsoft.com' or h.endswith('.microsoft.com') or h in ['dotnetcli.azureedge.net','dotnetcli.blob.core.windows.net','www.nuget.org','api.nuget.org','globalcdn.nuget.org'] or h=='github.com' and u.path.startswith(('/microsoft/','/dotnet/','/PowerShell/')))
for group in ['dotnet','legacy','packages']:
 file=research/group/'entries.json';raw=file.read_bytes();rows=json.loads(raw)
 sources.append({'group':group,'sha256':hashlib.sha256(raw).hexdigest(),'rows':len(rows)})
 for row in rows:
  name=row['name'].lower()
  if name=='marshal.dll':excluded.append({'name':name,'reason':'First-party attribution not independently resolved; version resource unavailable.'});continue
  assert re.fullmatch(r'[a-z0-9][a-z0-9_.-]*\.dll',name),name
  target=merged.setdefault(name,{'name':name,'displayName':row['name'],'slug':name,'components':set(),'packages':{}})
  target['components'].add(row['component'])
  for source in row['packages']:
   if 'reference' in source.get('assemblyRole','').lower() or re.search(r'(?:^|[/!])ref/',source.get('evidenceMember','').lower()):
    excluded.append({'name':name,'package':source.get('id'),'member':source.get('evidenceMember'),'reason':'Reference assembly mapping; not an executable implementation.'})
    continue
   for key in ['downloadUrl','downloadPage','evidenceUrl']:assert official(source[key]),(name,key,source[key])
   assert source.get('evidenceMember'),name
   p={key:source.get(key,'') for key in ['id','name','architecture','version','downloadUrl','downloadPage','evidenceUrl','evidenceMember','assemblyRole','endOfSupport','versionNote']}
   p['kind']='runtime' if source.get('kind',row.get('kind'))=='runtime' else 'sdk'
   p['checkedAt']=source.get('checkedAt') or source.get('verifiedAt') or datetime.datetime.now(datetime.timezone.utc).isoformat()
   p['linkType']='file' if re.search(r'\.(?:exe|zip|msi|cab|msix|msixbundle|nupkg)(?:\?|$)',p['downloadUrl'],re.I) else 'page'
   key='|'.join([p['id'],p['architecture'],p['version'],p['downloadUrl']])
   target['packages'].setdefault(key,p)
files=[]
for name,target in sorted(merged.items()):
 if not target['packages']:continue
 target['components']=sorted(target['components'])
 target['packages']=sorted(target['packages'].values(),key=lambda p:(p['kind']!='runtime',p['id'],p['architecture']))
 target['kind']='runtime' if any(p['kind']=='runtime' for p in target['packages']) else 'sdk'
 files.append(target)
data={'schemaVersion':1,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'policy':'Official package inventory, not a missing-DLL or search-frequency ranking. No DLL binaries hosted. Local System32 metadata inventory is not used.','sourceInputs':sources,'count':len(files),'files':files}
(SITE/'src/catalog.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(research/'merged-summary.json').write_text(json.dumps({'count':len(files),'runtime':sum(x['kind']=='runtime' for x in files),'sdkOnly':sum(x['kind']=='sdk' for x in files),'packageMappings':sum(len(x['packages']) for x in files),'sourceInputs':sources,'excluded':excluded,'binariesHosted':0},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'files':len(files),'runtime':sum(x['kind']=='runtime' for x in files),'sdkOnly':sum(x['kind']=='sdk' for x in files),'mappings':sum(len(x['packages']) for x in files)}))
