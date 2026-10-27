export function normalizeQuery(value){
 const text=String(value??'').normalize('NFKC').toLowerCase().trim().slice(0,500);
 const file=text.match(/[a-z0-9][a-z0-9_.-]*\.dll\b/);
 return file?file[0]:text;
}
export function matches(searchText,kind,query,selectedKind='all'){
 if(selectedKind!=='all'&&selectedKind!==kind)return false;
 const terms=normalizeQuery(query).split(/\s+/).filter(Boolean);
 const haystack=String(searchText).toLowerCase();
 return terms.every(word=>haystack.includes(word));
}
