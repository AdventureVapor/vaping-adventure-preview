/* Sichere Übertragung eingebetteter Medien in den clientseitig verschlüsselten Supabase-Storage. */
(function(){
"use strict";
const enc=new TextEncoder();
function parseDataUrl(value){
 const match=/^data:([^;,]+)?(;base64)?,([\s\S]*)$/i.exec(value);
 if(!match)throw Error("Ungültige eingebettete Mediendatei.");
 const mime=(match[1]||"application/octet-stream").toLowerCase();
 let bytes;
 if(match[2]){
  const raw=atob(match[3].replace(/\s/g,""));
  bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 }else bytes=enc.encode(decodeURIComponent(match[3]));
 if(!mime.startsWith("image/")&&mime!=="application/pdf")throw Error("Nicht unterstützter Medientyp: "+mime);
 return {mime,bytes};
}
function mediaKind(path,mime){
 if(mime==="application/pdf")return "pdf";
 return "photo";
}
function fileName(path,kind){
 const leaf=String(path).slice(-120).replace(/[^a-zA-Z0-9_-]/g,"_");
 return (leaf||(kind==="pdf"?"Anleitung":"Foto"))+(kind==="pdf"?".pdf":".jpg");
}
async function migrate(snapshot,uploadVerified){
 if(!snapshot||typeof snapshot!=="object"||typeof uploadVerified!=="function")throw Error("Medienmigration: Spielstand oder Upload-Funktion fehlt.");
 const result=JSON.parse(JSON.stringify(snapshot));
 const byHash=new Map();
 const stats={inlineCount:0,uploadedCount:0,reusedCount:0,totalBytes:0,cloudReferenceCount:0};
 async function walk(value,path,parent,key){
  if(typeof value==="string"&&value.startsWith("data:")){
   const parsed=parseDataUrl(value);
   const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",parsed.bytes));
   const hash=parsed.mime+":"+Array.from(digest,x=>x.toString(16).padStart(2,"0")).join("");
   stats.inlineCount++;stats.totalBytes+=parsed.bytes.byteLength;
   if(byHash.has(hash)){stats.reusedCount++;parent[key]=byHash.get(hash);return;}
   const kind=mediaKind(path,parsed.mime);
   const blob=new Blob([parsed.bytes],{type:parsed.mime});
   const ref=await uploadVerified(blob,{kind,name:fileName(path,kind),mime:parsed.mime});
   if(!ref||ref.storage!=="supabase"||ref.v!==1)throw Error("Upload lieferte keine gültige Cloud-Medienreferenz für "+path+".");
   byHash.set(hash,ref);parent[key]=ref;stats.uploadedCount++;
   return;
  }
  if(!value||typeof value!=="object")return;
  if(Array.isArray(value)){for(let i=0;i<value.length;i++)await walk(value[i],path+"["+i+"]",value,i);}
  else for(const childKey of Object.keys(value))await walk(value[childKey],path+"."+childKey,value,childKey);
 }
 for(const key of Object.keys(result))await walk(result[key],"db."+key,result,key);
 stats.cloudReferenceCount=byHash.size;
 return {snapshot:result,stats};
}

async function verifyExistingReferences(snapshot,groups,download){
 if(!snapshot||typeof snapshot!=="object"||!groups||typeof groups!=="object"||typeof download!=="function")throw Error("Medienprüfung: Spielstand, Datengruppen oder Downloadfunktion fehlen.");
 const enc=new TextEncoder(),items=[];
 const bytesOf=async value=>parseDataUrl(value).bytes;
 const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",bytes)),x=>x.toString(16).padStart(2,"0")).join("");
 function atPath(root,path){
  const parts=path.replace(/\\[(\\d+)\\]/g,".$1").split(".").filter(Boolean);
  let value=root;for(const part of parts)value=value==null?undefined:value[part];return value;
 }
 async function walk(value,path){
  if(typeof value==="string"&&value.startsWith("data:")){
   const group=path.split(".")[1],relative=path.slice(3),record=groups[group];
   const groupData=record&&Object.prototype.hasOwnProperty.call(record,"data")?record.data:record;
   const ref=atPath(groupData,relative);
   if(!ref||ref.storage!=="supabase"||ref.v!==1){items.push({path,status:"missing"});return}
   try{
    const source=await bytesOf(value),blob=await download(ref);
    if(!(blob instanceof Blob))throw Error("Kein gültiger Dateiinhalt zurückgegeben.");
    const actual=new Uint8Array(await blob.arrayBuffer());
    if(source.byteLength!==actual.byteLength||await digest(source)!==await digest(actual)){items.push({path,status:"different"});return}
    items.push({path,status:"verified",size:source.byteLength});
   }catch(error){items.push({path,status:"unavailable",error:String(error?.message||error).slice(0,180)})}
   return;
  }
  if(!value||typeof value!=="object")return;
  if(Array.isArray(value)){for(let i=0;i<value.length;i++)await walk(value[i],path+"["+i+"]")}
  else for(const key of Object.keys(value))await walk(value[key],path+"."+key);
 }
 for(const key of Object.keys(snapshot))await walk(snapshot[key],"db."+key);
 return Object.freeze({readOnly:true,total:items.length,verified:items.filter(x=>x.status==="verified").length,missing:items.filter(x=>x.status==="missing").length,different:items.filter(x=>x.status==="different").length,unavailable:items.filter(x=>x.status==="unavailable").length,items});
}
window.MVACloudMediaMigration=Object.freeze({migrate,verifyExistingReferences});
})();