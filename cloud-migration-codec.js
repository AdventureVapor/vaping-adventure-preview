/* Reine Umwandlung zwischen dem bisherigen Gesamt-Spielstand und sechs Cloud-Datengruppen.
 * Keine Netzwerkzugriffe, keine Speicherung und keine Änderung am übergebenen Objekt.
 */
(function(){
"use strict";
const TYPES=Object.freeze(["entries","devices","strains","photos","game","controlledVaping"]);
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
function split(db){
 if(!db||typeof db!=="object"||Array.isArray(db))throw Error("Ungültiger Spielstand für die Cloud-Aufteilung.");
 const result={};
 for(const type of TYPES){
  const value=db[type];
  if(type==="entries"||type==="devices"||type==="strains"||type==="photos"){
   if(value!==undefined&&!Array.isArray(value))throw Error("Ungültige Datengruppe: "+type);
   result[type]=clone(value===undefined?[]:value);
  }else if(type==="game"){
   if(value!==undefined&&(!value||typeof value!=="object"||Array.isArray(value)))throw Error("Ungültige Datengruppe: game");
   result.game=clone(value===undefined?{xp:0,coins:0,quests:[],courses:{}}:value);
  }else{
   if(value!==undefined&&(!value||typeof value!=="object"||Array.isArray(value)))throw Error("Ungültige Datengruppe: controlledVaping");
   result.controlledVaping=clone(value===undefined?{}:value);
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
   else result.controlledVaping={};
   continue;
  }
  if(type==="entries"||type==="devices"||type==="strains"||type==="photos"){
   if(!Array.isArray(value))throw Error("Ungültige Cloud-Datengruppe: "+type);
  }else if(!value||typeof value!=="object"||Array.isArray(value))throw Error("Ungültige Cloud-Datengruppe: "+type);
  result[type]=clone(value);
 }
 return result;
}
window.MVACloudMigrationCodec=Object.freeze({types:TYPES,split,join});
})();
