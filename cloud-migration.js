/* Nicht-destruktive Bestandsprüfung. Keine Uploads, Änderungen oder Löschungen. */
(function(){
"use strict";
const enc=new TextEncoder();
function parseDataUrl(value){
 const m=/^data:([^;,]+)?(;base64)?,([\s\S]*)$/i.exec(value);
 if(!m)throw Error("Ungültige Data-URL");
 const mime=(m[1]||"application/octet-stream").toLowerCase();
 let bytes;
 if(m[2]){const bin=atob(m[3].replace(/\s/g,""));bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i)}
 else bytes=enc.encode(decodeURIComponent(m[3]));
 return {mime,bytes};
}
function kind(path,mime){if(mime==="application/pdf"||/manual|anleitung/i.test(path))return "pdf";if(mime.startsWith("image/"))return "photo";return "other"}
function b64(bytes){let s="";for(let i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(s)}
async function audit(db){
 if(!db||typeof db!=="object")throw Error("Kein gültiger Spielstand übergeben.");
 const media=[],references=[],seen=new WeakSet();
 async function walk(v,path){
  if(typeof v==="string"){
   if(!v.startsWith("data:"))return;
   try{const p=parseDataUrl(v),hash=b64(await crypto.subtle.digest("SHA-256",p.bytes));media.push({path,mime:p.mime,kind:kind(path,p.mime),size:p.bytes.byteLength,sha256:hash})}
   catch(e){media.push({path,mime:"unbekannt",kind:"invalid",size:null,sha256:null,error:String(e.message||e)})}
   return;
  }
  if(!v||typeof v!=="object"||seen.has(v))return;
  seen.add(v);
  if(v.storage==="supabase"&&v.v===1&&typeof v.path==="string"){references.push({path,bucket:v.bucket,kind:v.kind,size:Number(v.size)||0});return}
  if(Array.isArray(v)){for(let i=0;i<v.length;i++)await walk(v[i],path+"["+i+"]")}
  else for(const k of Object.keys(v))await walk(v[k],path+"."+k);
 }
 await walk(db,"db");
 const groups=new Map();
 for(const m of media)if(m.sha256){const a=groups.get(m.sha256)||[];a.push(m.path);groups.set(m.sha256,a)}
 const duplicateGroups=[...groups].filter(([,p])=>p.length>1).map(([sha256,paths])=>({sha256,paths,count:paths.length}));
 return Object.freeze({readOnly:true,safeToMigrate:false,inlineMediaCount:media.length,existingCloudReferenceCount:references.length,invalidMediaCount:media.filter(x=>x.kind==="invalid").length,totalInlineBytes:media.reduce((n,x)=>n+(x.size||0),0),duplicateGroups,media,references,note:"Nur Bestandsprüfung. Keine Uploads, Änderungen oder Löschungen; keine Freigabe zur Migration."});
}
window.MVACloudMigration=Object.freeze({audit});
})();