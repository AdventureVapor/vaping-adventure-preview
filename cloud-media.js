/* My Vaping Adventure – clientseitig verschlüsselte Medienablage.
 * Noch nicht automatisch mit Formularen/Galerie verbunden.
 * Aktivierung erst nach Bucket-/RLS-Einrichtung und erfolgreicher Bestandsmigration.
 */
(function(){
  "use strict";
  const DEFAULT_BUCKET="mva-private-media";
  const enc=new TextEncoder();
  const b64=bytes=>{let s="";const a=new Uint8Array(bytes);for(let i=0;i<a.length;i+=0x8000)s+=String.fromCharCode(...a.subarray(i,i+0x8000));return btoa(s)};
  const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  const uuid=()=>crypto.randomUUID();
  const safeSegment=s=>String(s).split("/").map(encodeURIComponent).join("/");
  async function digest(blob){return b64(await crypto.subtle.digest("SHA-256",await blob.arrayBuffer()))}
  function make({url,apiKey,token,userId,key,bucket=DEFAULT_BUCKET,timeoutMs=90000,request:requestOverride=null}){
    if(!/^https:\/\//.test(url||"")||!apiKey||(!token&&typeof requestOverride!=="function")||!userId||!key)throw Error("Medien-Cloud: Konfiguration oder Sitzung fehlt.");
    if(!(key instanceof CryptoKey))throw Error("Medien-Cloud: AES-Schlüssel fehlt.");
    const base=url.replace(/\/$/,"")+"/storage/v1/object";
    const headers={"apikey":apiKey,...(token?{"Authorization":"Bearer "+token}:{})};
    async function request(path,options={}){
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
      try{
        const requestOptions={...options,signal:controller.signal,headers:{...headers,...(options.headers||{})}};
        const res=typeof requestOverride==="function"?await requestOverride(path,requestOptions):await fetch(base+"/"+safeSegment(path),requestOptions);
        if(!res.ok){const body=await res.text().catch(()=>"");let detail=body;try{const parsed=JSON.parse(body);detail=parsed.message||parsed.error||body}catch{}throw Error("Medien-Cloud ("+res.status+"): "+String(detail||"Anfrage fehlgeschlagen").slice(0,240))}
        return res;
      }catch(error){
        if(controller.signal.aborted)throw Error("Medien-Cloud: Zeitüberschreitung nach "+Math.round(timeoutMs/1000)+" Sekunden.");
        throw error;
      }finally{clearTimeout(timer)}
    }
    function aad(path,kind,mime){return enc.encode("MVA-MEDIA-v1|"+path+"|"+kind+"|"+mime)}
    async function upload(blob,{kind="photo",name="",mime=blob?.type||"application/octet-stream"}={}){
      if(!(blob instanceof Blob))throw Error("Ungültige Mediendatei.");
      if(!["photo","device-photo","pdf"].includes(kind))throw Error("Unbekannter Medientyp.");
      if(kind==="pdf"&&mime!=="application/pdf")throw Error("Die Anleitung muss eine PDF-Datei sein.");
      const mediaId=uuid(),path=userId+"/"+mediaId+".bin",iv=crypto.getRandomValues(new Uint8Array(12));
      const plain=await blob.arrayBuffer();
      const cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv,additionalData:aad(path,kind,mime)},key,plain);
      await request(bucket+"/"+path,{method:"POST",headers:{"Content-Type":"application/octet-stream","x-upsert":"false"},body:cipher});
      return {v:1,storage:"supabase",bucket,path,iv:b64(iv),kind,name:String(name||"").slice(0,180),mime,size:blob.size};
    }
    async function download(ref){
      if(!ref||ref.v!==1||ref.storage!=="supabase"||ref.bucket!==bucket||typeof ref.path!=="string"||!ref.path.startsWith(userId+"/"))throw Error("Ungültige oder fremde Medienreferenz.");
      const res=await request(bucket+"/"+ref.path,{method:"GET"});
      const cipher=await res.arrayBuffer();
      const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(ref.iv),additionalData:aad(ref.path,ref.kind,ref.mime)},key,cipher);
      const blob=new Blob([plain],{type:ref.mime||"application/octet-stream"});
      if(Number.isFinite(ref.size)&&blob.size!==ref.size)throw Error("Medienprüfung fehlgeschlagen: Die Dateigröße stimmt nicht überein.");
      return blob;
    }
    async function uploadVerified(blob,options={}){
      const ref=await upload(blob,options);
      try{
        const check=await download(ref);
        if(check.size!==blob.size||await digest(check)!==await digest(blob))throw Error("Medienprüfung fehlgeschlagen: Die hochgeladene Datei stimmt nicht mit dem Original überein.");
        return ref;
      }catch(error){
        try{await remove(ref)}catch(cleanupError){console.warn("Nicht verifizierte Mediendatei konnte nicht entfernt werden:",cleanupError)}
        throw error;
      }
    }
    async function remove(ref){
      if(!ref||ref.storage!=="supabase"||ref.bucket!==bucket||typeof ref.path!=="string"||!ref.path.startsWith(userId+"/"))throw Error("Ungültige oder fremde Medienreferenz.");
      await request(bucket+"/"+ref.path,{method:"DELETE"});
    }
    return Object.freeze({upload,uploadVerified,download,remove});
  }
  window.MVAEncryptedMedia={create:make,bucket:DEFAULT_BUCKET};
})();
