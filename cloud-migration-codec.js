/* Reine Umwandlung zwischen dem bisherigen Gesamt-Spielstand und sieben Cloud-Datengruppen.
 * Keine Netzwerkzugriffe, keine Speicherung und keine Änderung am übergebenen Objekt.
 */
(function(){
"use strict";
const TYPES=Object.freeze(["entries","devices","strains","photos","game","controlledVaping","settings"]);
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
function split(db){
 if(!db||typeof db!=="object"||Array.isArray(db))throw Error("Ungültiger Spielstand für die Cloud-Aufteilung.");
 const unknown=Object.keys(db).filter(key=>!TYPES.includes(key));
 if(unknown.length)throw Error("Unbekannte Spielstand-Felder werden noch nicht migriert: "+unknown.join(", ")+". Die Migration wurde sicherheitshalber abgebrochen.");
 const result={};
 for(const type of TYPES){
  const value=db[type];
  if(type==="entries"||type==="devices"||type==="strains"||type==="photos"){
   if(value!==undefined&&!Array.isArray(value))throw Error("Ungültige Datengruppe: "+type);
   result[type]=clone(value===undefined?[]:value);
  }else if(type==="game"){
   if(value!==undefined&&(!value||typeof value!=="object"||Array.isArray(value)))throw Error("Ungültige Datengruppe: game");
   result.game=clone(value===undefined?{xp:0,coins:0,quests:[],courses:{}}:value);
  }else if(type==="controlledVaping"||type==="settings"){
   if(value!==undefined&&(!value||typeof value!=="object"||Array.isArray(value)))throw Error("Ungültige Datengruppe: "+type);
   result[type]=clone(value===undefined?{}:value);
  }
 }
 return result;
}
function join(groups){
 if(!groups||typeof groups!=="object"||Array.isArray(groups))throw Error("Ungültige Cloud-Datengruppen.");
 const result={};
 for(const type of TYPES){
  const record=groups[type];
  const value=record&&typeof record==="object"&&!Array.isArray(record)&&Object.prototype.hasOwnProperty.call(record,"data")?record.data:record;
  if(value===null||value===undefined){
   if(type==="entries"||type==="devices"||type==="strains"||type==="photos")result[type]=[];
   else if(type==="game")result.game={xp:0,coins:0,quests:[],courses:{}};
   else result[type]={};
   continue;
  }
  if(type==="entries"||type==="devices"||type==="strains"||type==="photos"){
   if(!Array.isArray(value))throw Error("Ungültige Cloud-Datengruppe: "+type);
  }else if(!value||typeof value!=="object"||Array.isArray(value))throw Error("Ungültige Cloud-Datengruppe: "+type);
  result[type]=clone(value);
 }
 return result;
}
function canonical(value){
 if(Array.isArray(value))return value.map(canonical);
 if(value&&typeof value==="object"){
  const result={};
  for(const key of Object.keys(value).sort())result[key]=canonical(value[key]);
  return result;
 }
 return value;
}
function mergeEntriesById(legacyEntries,separateEntries){
 if(!Array.isArray(legacyEntries)||!Array.isArray(separateEntries))throw Error("Beide Tagebuchbestände müssen gültige Listen sein.");
 const idOf=entry=>entry&&entry.id!==undefined&&entry.id!==null&&String(entry.id)!==""?String(entry.id):null;
 const legacyIds=legacyEntries.map(idOf),separateIds=separateEntries.map(idOf);
 if(legacyIds.some(id=>id===null)||separateIds.some(id=>id===null))throw Error("Mindestens ein Tagebucheintrag besitzt keine eindeutige ID. Sicherheitsstopp.");
 if(new Set(legacyIds).size!==legacyIds.length||new Set(separateIds).size!==separateIds.length)throw Error("Doppelte Tagebuch-IDs gefunden. Sicherheitsstopp.");
 const legacyMap=new Map(legacyEntries.map(entry=>[idOf(entry),entry]));
 const separateMap=new Map(separateEntries.map(entry=>[idOf(entry),entry]));
 for(const [id,entry] of separateMap){
  if(!legacyMap.has(id))throw Error("Die getrennte Tagebuchgruppe enthält einen zusätzlichen Eintrag. Es wird nichts überschrieben.");
  if(JSON.stringify(canonical(legacyMap.get(id)))!==JSON.stringify(canonical(entry)))throw Error("Ein vorhandener Tagebucheintrag weicht inhaltlich ab. Es wird nichts überschrieben.");
 }
 const missingCount=legacyEntries.length-separateEntries.length;
 const merged=legacyEntries.map(entry=>separateMap.get(idOf(entry))||clone(entry));
 return Object.freeze({merged,missingCount,existingCount:separateEntries.length,totalCount:legacyEntries.length});
}
function compare(legacySnapshot,records){
 const expected=split(legacySnapshot);
 const status=TYPES.map(type=>{
  const record=records&&records[type];
  const exists=!!record&&record.exists===true;
  return {type,exists,matches:exists&&JSON.stringify(canonical(expected[type]))===JSON.stringify(canonical(record.data))};
 });
 const existingCount=status.filter(item=>item.exists).length;
 const matchingCount=status.filter(item=>item.matches).length;
 const missing=status.filter(item=>!item.exists).map(item=>item.type);
 const mismatched=status.filter(item=>item.exists&&!item.matches).map(item=>item.type);
 return {readOnly:true,total:TYPES.length,existingCount,matchingCount,missing,mismatched,complete:existingCount===TYPES.length&&matchingCount===TYPES.length};
}
window.MVACloudMigrationCodec=Object.freeze({types:TYPES,split,join,compare,mergeEntriesById});
})();
