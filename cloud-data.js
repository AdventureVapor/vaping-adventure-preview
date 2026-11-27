/* My Vaping Adventure – getrennte, clientseitig verschlüsselte Datengruppen.
 * Vorbereitungsmodul: wird noch NICHT von app.js aufgerufen.
 * Voraussetzung: SQL-RPC mva_write_data aus cloud-setup.md ist eingerichtet.
 */
(function(){
  "use strict";
  const TYPES=Object.freeze(["entries","devices","strains","photos","game","controlledVaping","settings"]);
  const enc=new TextEncoder(), dec=new TextDecoder();
  const b64=bytes=>{let s="";const a=new Uint8Array(bytes);for(let i=0;i<a.length;i+=0x8000)s+=String.fromCharCode(...a.subarray(i,i+0x8000));return btoa(s)};
  const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  const aad=(userId,type,revision)=>enc.encode("MVA-DATA-v1|"+userId+"|"+type+"|"+revision);
  function assertType(type){if(!TYPES.includes(type))throw Error("Unbekannte Datengruppe: "+type)}
  function canonical(value){
    if(Array.isArray(value))return value.map(canonical);
    if(value&&typeof value==="object"){
      const result={};
      for(const key of Object.keys(value).sort())result[key]=canonical(value[key]);
      return result;
    }
    return value;
  }
  function sameData(a,b){return JSON.stringify(canonical(a))===JSON.stringify(canonical(b))}
  function make({request,userId,key}){
    if(typeof request!=="function"||!userId||typeof CryptoKey==="undefined"||!(key instanceof CryptoKey))throw Error("Datengruppen-Cloud: Request-Funktion, Nutzer oder AES-Schlüssel fehlt.");
    async function seal(type,value,revision){
      const iv=crypto.getRandomValues(new Uint8Array(12));
      const plain=enc.encode(JSON.stringify(value));
      const cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv,additionalData:aad(userId,type,revision)},key,plain);
      return {v:1,algorithm:"A256GCM",revision,iv:b64(iv),ciphertext:b64(cipher)};
    }
    async function open(type,box,revision){
      if(!box||box.v!==1||box.algorithm!=="A256GCM"||box.revision!==revision)throw Error("Ungültiges oder nicht unterstütztes Format für "+type+".");
      const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(box.iv),additionalData:aad(userId,type,revision)},key,unb64(box.ciphertext));
      return JSON.parse(dec.decode(plain));
    }
    async function read(type){
      assertType(type);
      const rows=await request("/rest/v1/mva_data?select=data_type,payload,revision&user_id=eq."+encodeURIComponent(userId)+"&data_type=eq."+encodeURIComponent(type)+"&limit=1");
      const row=rows?.[0];
      if(!row)return {type,revision:0,data:null,exists:false};
      const revision=Number(row.revision);
      if(!Number.isSafeInteger(revision)||revision<1)throw Error("Ungültige Versionsnummer für "+type+".");
      return {type,revision,data:await open(type,row.payload,revision),exists:true};
    }
    async function readAll(){
      const records=await Promise.all(TYPES.map(type=>read(type)));
      return Object.fromEntries(records.map(record=>[record.type,record]));
    }
    // Prüft zuerst den entschlüsselten Ist-Stand. Unveränderte Gruppen
    // erzeugen weder eine neue Revision noch einen unnötigen Cloud-Schreibvorgang.
    // Geänderte Gruppen werden mit der gerade gelesenen Revision geschrieben;
    // ein paralleler Schreibvorgang wird durch die RPC-Revisionserwartung abgefangen.
    async function sync(type,value){
      assertType(type);
      const current=await read(type);
      if(current.exists&&sameData(current.data,value)){
        return {...current,unchanged:true};
      }
      const saved=await write(type,value,current.revision);
      return {...saved,unchanged:false};
    }
    async function write(type,value,expectedRevision){
      assertType(type);
      if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0)throw Error("Für "+type+" fehlt eine gültige erwartete Version.");
      const nextRevision=expectedRevision+1;
      const payload=await seal(type,value,nextRevision);
      try{
        const result=await request("/rest/v1/rpc/mva_write_data",{method:"POST",body:JSON.stringify({p_data_type:type,p_payload:payload,p_expected_revision:expectedRevision})});
        const actual=Array.isArray(result)?Number(result[0]):Number(result);
        if(actual!==nextRevision)throw Error("Die Cloud hat keine bestätigte neue Version zurückgegeben.");
        return {type,revision:actual,data:value,exists:true};
      }catch(error){
        // Bei einem Verbindungsabbruch kann die Datenbank den Schreibvorgang
        // bereits bestätigt haben. Nur ein entschlüsselter Read-back derselben
        // Version und desselben Inhalts gilt dann als sichere Bestätigung.
        const latest=await read(type).catch(()=>null);
        if(latest&&latest.revision===nextRevision&&sameData(latest.data,value))return latest;
        const message=String(error?.message||error);
        if(/MVA_REVISION_CONFLICT|revision conflict|versionskonflikt/i.test(message)){
          const conflict=Error("Versionskonflikt bei „"+type+"“: Auf einem anderen Gerät wurden zwischenzeitlich Änderungen gespeichert. Es wurde nichts überschrieben.");
          conflict.code="MVA_REVISION_CONFLICT";
          throw conflict;
        }
        throw error;
      }
    }
    return Object.freeze({types:TYPES,read,readAll,write,sync});
  }
  window.MVAEncryptedData={create:make,types:TYPES};
})();
