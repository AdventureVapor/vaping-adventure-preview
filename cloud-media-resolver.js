/* My Vaping Adventure – Auflösung verschlüsselter Cloud-Medien mit sicherem Cache-Lebenszyklus. */
(function(){
"use strict";
function create({media,maxEntries=24}={}){
 if(!media||typeof media.download!=="function")throw Error("Medien-Downloadadapter fehlt.");
 const cache=new Map(),pending=new Map();let disposed=false,generation=0;
 function isRef(value){return !!value&&typeof value==="object"&&value.v===1&&value.storage==="supabase"&&typeof value.path==="string"}
 async function resolve(value){
  if(disposed)throw Error("Der Medienzugriff wurde beendet. Bitte erneut anmelden.");
  if(typeof value==="string")return value;
  if(!isRef(value))throw Error("Unbekannte Medienreferenz.");
  const key=value.bucket+"/"+value.path;
  if(cache.has(key)){const hit=cache.get(key);cache.delete(key);cache.set(key,hit);return hit.url}
  if(pending.has(key))return pending.get(key);
  const taskGeneration=generation;
  const task=(async()=>{
   const blob=await media.download(value);
   if(!(blob instanceof Blob))throw Error("Der Mediendownload lieferte keine Datei.");
   if(Number.isFinite(value.size)&&blob.size!==value.size)throw Error("Die heruntergeladene Mediendatei hat eine unerwartete Größe.");
   const url=URL.createObjectURL(blob);
   if(disposed||taskGeneration!==generation){URL.revokeObjectURL(url);throw Error("Der Medienzugriff wurde während des Downloads beendet.")}
   cache.set(key,{url,size:blob.size});
   while(cache.size>Math.max(1,maxEntries)){const oldest=cache.keys().next().value,item=cache.get(oldest);URL.revokeObjectURL(item.url);cache.delete(oldest)}
   return url;
  })();
  pending.set(key,task);
  try{return await task}finally{pending.delete(key)}
 }
 function dispose(){if(disposed)return;disposed=true;generation++;for(const item of cache.values())URL.revokeObjectURL(item.url);cache.clear();pending.clear()}
 return Object.freeze({resolve,dispose,isReference:isRef});
}
window.MVACloudMediaResolver=Object.freeze({create});
})();