"use strict";
function localeText(key, params){return window.MVA_LOCALES?.t(key,params) ?? key;}
const KEY="mva_alpha12", OLD={entries:"pvd_entries",devices:"pvd_devices",game:"pvd_game"};
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
let localDb=get(KEY,{entries:get(OLD.entries,[]),devices:get(OLD.devices,[]),strains:[],photos:[],game:get(OLD.game,{xp:0,coins:0,quests:[],courses:{}})});
let db=localDb, storageMode="local", cloudSession=null, cloudKey=null, cloudSalt=null, cloudEnvelope=null, cloudTimer=null, cloudWritePromise=null, cloudSaveRevision=0, cloudSavedRevision=0, cloudRecoveryWarningShown=false, cloudMediaAccess=null;
const cloudRecoveryKey=()=>`mva_cloud_recovery_${cloudSession?.userId||"unknown"}`;
const cloudRecoveryDbName="mva_secure_recovery";
function openCloudRecoveryDb(){
 return new Promise((resolve,reject)=>{
  if(!("indexedDB" in window))return reject(Error("IndexedDB wird von diesem Browser nicht unterstützt."));
  const request=indexedDB.open(cloudRecoveryDbName,1);
  request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains("copies"))db.createObjectStore("copies")};
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error||Error("Lokale Sicherungsdatenbank konnte nicht geöffnet werden."));
  request.onblocked=()=>reject(Error("Die lokale Sicherungsdatenbank ist noch durch einen anderen Tab blockiert."));
 });
}
async function saveCloudRecoveryCopy(payload){
 const recoveryDb=await openCloudRecoveryDb();
 try{
  await new Promise((resolve,reject)=>{
   const tx=recoveryDb.transaction("copies","readwrite");
   tx.objectStore("copies").put({savedAt:new Date().toISOString(),payload},cloudSession.userId);
   tx.oncomplete=resolve;
   tx.onerror=()=>reject(tx.error||Error("Notfallkopie konnte nicht gespeichert werden."));
   tx.onabort=()=>reject(tx.error||Error("Speichern der Notfallkopie wurde abgebrochen."));
  });
 }finally{recoveryDb.close()}
}

/* Größere lokale Spielstände liegen in IndexedDB statt im kleinen localStorage-Kontingent. */
const localStoreDbName="mva_local_store";
function openLocalStoreDb(){
 return new Promise((resolve,reject)=>{
  if(!("indexedDB" in window))return reject(Error("IndexedDB wird von diesem Browser nicht unterstützt."));
  const request=indexedDB.open(localStoreDbName,1);
  request.onupgradeneeded=()=>{const database=request.result;if(!database.objectStoreNames.contains("snapshots"))database.createObjectStore("snapshots")};
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error||Error("Lokale Datenbank konnte nicht geöffnet werden."));
  request.onblocked=()=>reject(Error("Die lokale Datenbank ist noch durch einen anderen Tab blockiert."));
 });
}
async function saveLocalSnapshot(snapshotOrSerialized){
 const serialized=typeof snapshotOrSerialized==="string"?snapshotOrSerialized:JSON.stringify(snapshotOrSerialized);
 if(typeof serialized!=="string")throw Error("Der Spielstand konnte nicht serialisiert werden.");
 const database=await openLocalStoreDb();
 try{
  await new Promise((resolve,reject)=>{
   const tx=database.transaction("snapshots","readwrite");
   tx.objectStore("snapshots").put(serialized,"current");
   tx.oncomplete=resolve;
   tx.onerror=()=>reject(tx.error||Error("Lokaler Spielstand konnte nicht geschrieben werden."));
   tx.onabort=()=>reject(tx.error||Error("Schreiben des lokalen Spielstands wurde abgebrochen."));
  });
  const verified=await new Promise((resolve,reject)=>{
   const tx=database.transaction("snapshots","readonly");
   const request=tx.objectStore("snapshots").get("current");
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error||Error("Lokale Sicherung konnte nicht überprüft werden."));
   tx.onabort=()=>reject(tx.error||Error("Überprüfung der lokalen Sicherung wurde abgebrochen."));
  });
  if(verified!==serialized)throw Error("Die lokale Sicherung konnte nach dem Schreiben nicht vollständig bestätigt werden.");
 }finally{database.close()}
}
async function loadLocalSnapshot(){
 const database=await openLocalStoreDb();
 try{
  const stored=await new Promise((resolve,reject)=>{
   const tx=database.transaction("snapshots","readonly");
   const request=tx.objectStore("snapshots").get("current");
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error||Error("Lokaler Spielstand konnte nicht gelesen werden."));
   tx.onabort=()=>reject(tx.error||Error("Lesen des lokalen Spielstands wurde abgebrochen."));
  });
  if(stored===undefined)return null;
  const snapshot=typeof stored==="string"?JSON.parse(stored):stored;
  if(!snapshot||typeof snapshot!=="object"||!Array.isArray(snapshot.entries)||!Array.isArray(snapshot.devices))throw Error("Der lokale Spielstand in IndexedDB ist ungültig.");
  return snapshot;
 }finally{database.close()}
}
let localSaveQueue=Promise.resolve();
const put=()=>{
 if(storageMode!=="local"){scheduleCloudSave();return}
 let serialized;
 try{serialized=JSON.stringify(db)}catch(error){toast("Lokaler Spielstand konnte nicht vorbereitet werden: "+(error?.message||error));return}
 localSaveQueue=localSaveQueue.catch(()=>{}).then(()=>saveLocalSnapshot(serialized)).then(()=>{localDb=db}).catch(error=>{
  console.error("Lokale IndexedDB-Sicherung fehlgeschlagen:",error);
  toast("Lokale Speicherung fehlgeschlagen. Bitte jetzt ein JSON-Backup herunterladen. "+(error?.message||""));
 });
};
for(const k of ["entries","devices","strains","photos"])if(!Array.isArray(db[k]))db[k]=[];
db.game ||= {xp:0,coins:0,quests:[],courses:{}}; db.game.quests ||= []; db.game.courses ||= {};
const defaults=[...["Venty","Mighty","Volcano","Dr. Dabber Switch2","TerpTorch","TerpHammer","Dynavap M7","Dynavap G3","Dynavap B2","The B","XMAX Qomo","Pax Flow","Cuboo Stick","Smono"].map(name=>({name,category:"vaporizer"})),...["GeekVape Legend 5","ELFX Mega"].map(name=>({name,category:"ecig"})),... ["IQOS","glo"].map(name=>({name,category:"heater"}))];
const names={vaporizer:"Vaporizer",ecig:"E-Zigarette",heater:"Tabakheater",cigarette:"Zigarette",joint:"Joint",bong:"Bong"};
db.devices=db.devices.map(d=>typeof d==="string"?{name:d,category:"vaporizer"}:d);if(!db.devices.length)db.devices=defaults;else defaults.forEach(d=>{if(!db.devices.some(x=>x.name.toLowerCase()===d.name.toLowerCase()))db.devices.push(d)});
const $=s=>document.querySelector(s), esc=s=>String(s??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const now=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}, id=()=>crypto.randomUUID?.()||String(Date.now()+Math.random());
function entryDateTimeValue(entry){
 const raw=String(entry?.date||'').trim();
 let year,month,day,match=raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
 if(match){year=+match[1];month=+match[2];day=+match[3]}
 else if((match=raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/))){day=+match[1];month=+match[2];year=+match[3]}
 else {const parsed=Date.parse(raw);if(Number.isFinite(parsed)){const d=new Date(parsed);year=d.getFullYear();month=d.getMonth()+1;day=d.getDate()}}
 if(!year||month<1||month>12||day<1||day>31)return Number.NEGATIVE_INFINITY;
 const time=String(entry?.time||'').trim();
 const tm=time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
 const hour=tm?Math.min(23,+tm[1]):0,minute=tm?Math.min(59,+tm[2]):0,second=tm?Math.min(59,+(tm[3]||0)):0;
 return Date.UTC(year,month-1,day,hour,minute,second);
}
function compareDiaryEntries(a,b){
 const diff=entryDateTimeValue(a)-entryDateTimeValue(b);
 if(diff)return diff;
 return String(a?.id||'').localeCompare(String(b?.id||''));
}
let page="home", selectedForumTopic=null, pendingPhoto=null, csvPending=[], sortMode='desc', galleryIndex=0;
const DIARY_PAGE_SIZE=25;
let diaryCurrentPage=1;

/* Wichtige Fehler- und Warnmeldungen bleiben bis zum manuellen Schließen sichtbar. */
const persistentToastStyles=document.createElement('style');
persistentToastStyles.textContent='.toast-persistent{position:fixed;left:50%;bottom:max(82px,calc(env(safe-area-inset-bottom) + 76px));transform:translateX(-50%);z-index:100001;width:min(560px,calc(100vw - 28px));max-height:min(70vh,560px);overflow:auto;display:flex;flex-direction:column;gap:14px;white-space:pre-wrap;overflow-wrap:anywhere;background:#542b27;color:#fff;border:1px solid #a85c50;border-radius:14px;padding:18px;box-shadow:0 18px 55px #0005;font-size:14px;line-height:1.55}.toast-persistent .toast-message{max-height:48vh;overflow:auto}.toast-persistent .toast-close{align-self:flex-end;min-width:112px;padding:10px 18px;border:1px solid #ffffff80;border-radius:9px;background:#fff;color:#542b27;font-weight:800;font-size:13px}.toast-persistent .toast-close:focus-visible{outline:3px solid #fff;outline-offset:3px}';
document.head.appendChild(persistentToastStyles);
const diaryPaginationStyles=document.createElement('style');
diaryPaginationStyles.textContent='.diary-pagination{display:flex;flex-direction:column;align-items:center;gap:12px;margin:22px 0 8px}.diary-page-summary{font-size:12px;color:var(--muted);text-align:center}.diary-page-buttons{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap}.diary-page-buttons .btn{min-width:38px}.diary-page-buttons .btn:disabled{opacity:.4;cursor:not-allowed}.diary-page-ellipsis{padding:0 3px;color:var(--muted)}@media(max-width:480px){.diary-page-buttons{gap:4px}.diary-page-buttons .btn{min-width:34px;padding:7px 9px}}';
document.head.appendChild(diaryPaginationStyles);
function toast(s, persistent){
 const message=String(s??'');
 const keepOpen=persistent===true||/fehlgeschlagen|fehlgeschlag|fehler|abgebrochen|konnte nicht|ungültig|nicht gespeichert|nicht bestätigt|speicher fast voll|bitte nicht abmelden/i.test(message);
 const t=document.createElement('div');
 t.className='toast'+(keepOpen?' toast-persistent':'');
 if(keepOpen){
  t.setAttribute('role','alertdialog');t.setAttribute('aria-modal','true');t.setAttribute('aria-label','Wichtige Meldung');
  const text=document.createElement('div');text.className='toast-message';text.textContent=message;
  const close=document.createElement('button');close.type='button';close.className='toast-close';close.textContent='Schließen';
  close.addEventListener('click',()=>t.remove());
  t.append(text,close);
  const previous=document.querySelector('.toast-persistent');if(previous)previous.remove();
 }else t.textContent=message;
 document.body.append(t);
 if(!keepOpen)setTimeout(()=>t.remove(),2600);
}
const cloudConfig=()=>window.MVA_CLOUD||{};
function cloudReady(){let c=cloudConfig();return /^https:\/\//.test(c.url||'')&&!!c.apiKey}
function b64(bytes){const a=new Uint8Array(bytes);let binary="";const chunk=0x8000;for(let i=0;i<a.length;i+=chunk)binary+=String.fromCharCode(...a.subarray(i,i+chunk));return btoa(binary)}
function unb64(s){return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
async function deriveCloudKey(password,salt){let material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:600000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function aesWrap(key,bytes){let iv=crypto.getRandomValues(new Uint8Array(12)),cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,bytes);return {iv:b64(iv),ciphertext:b64(cipher)}}
async function aesUnwrap(key,box){return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(box.iv)},key,unb64(box.ciphertext)))}
async function encryptCloud(data){if(!cloudKey)throw Error('Verschlüsselungsschlüssel fehlt');let iv=crypto.getRandomValues(new Uint8Array(12)),bytes=new TextEncoder().encode(JSON.stringify(data)),cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},cloudKey,bytes);return cloudEnvelope?{v:2,envelope:cloudEnvelope,iv:b64(iv),ciphertext:b64(cipher)}:{v:1,salt:b64(cloudSalt),iv:b64(iv),ciphertext:b64(cipher)}}
async function decryptCloud(box){
 if(box?.v===2&&box.envelope?.v===1){
  const env=box.envelope;
  const cachedEnvelopeMatches=!!cloudKey&&!!cloudEnvelope&&JSON.stringify(cloudEnvelope)===JSON.stringify(env);
  if(!cachedEnvelopeMatches){
   const salt=unb64(env.password.salt);
   const kek=await deriveCloudKey(cloudPassword,salt);
   const raw=await aesUnwrap(kek,env.password);
   cloudKey=await crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['encrypt','decrypt']);
   cloudEnvelope=env;
  }
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(box.iv)},cloudKey,unb64(box.ciphertext));
  return JSON.parse(new TextDecoder().decode(plain));
 }
 if(box?.v!==1)throw Error('Unbekanntes Cloud-Backup-Format');
 const cachedLegacyKeyMatches=!!cloudKey&&!!cloudSalt&&b64(cloudSalt)===box.salt;
 if(!cachedLegacyKeyMatches){
  cloudSalt=unb64(box.salt);
  cloudKey=await deriveCloudKey(cloudPassword,cloudSalt);
 }
 cloudEnvelope=null;
 const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(box.iv)},cloudKey,unb64(box.ciphertext));
 return JSON.parse(new TextDecoder().decode(plain));
}
async function createCloudEnvelope(password){let raw=crypto.getRandomValues(new Uint8Array(32)),dek=await crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['encrypt','decrypt']);let ps=crypto.getRandomValues(new Uint8Array(16)),pk=await deriveCloudKey(password,ps),pw=await aesWrap(pk,raw);let recovery=Array.from(crypto.getRandomValues(new Uint8Array(24)),x=>x.toString(16).padStart(2,'0')).join('');let rs=crypto.getRandomValues(new Uint8Array(16)),rk=await deriveCloudKey(recovery,rs),rw=await aesWrap(rk,raw);cloudKey=dek;cloudEnvelope={v:1,password:{salt:b64(ps),...pw},recovery:{salt:b64(rs),...rw}};return recovery}
let cloudPassword='';
async function timedCloudFetch(url,options={},timeoutMs=20000){
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{return await fetch(url,{...options,signal:controller.signal})}
 catch(error){
  if(controller.signal.aborted)throw Error('Cloud-Verbindung nach 20 Sekunden ohne Antwort abgebrochen. Bitte Internetverbindung prüfen und erneut versuchen.');
  throw error;
 }finally{clearTimeout(timer)}
}
async function cloudFetch(path,options={},retry=true){
 let c=cloudConfig(),base=c.url.replace(/\/$/,'');
 let res=await timedCloudFetch(`${base}${path}`,{...options,headers:{apikey:c.apiKey,'Content-Type':'application/json',...(options.headers||{})}});
 if(res.status===401&&retry&&cloudSession?.refreshToken&&!path.startsWith('/auth/')){
  let rr=await timedCloudFetch(`${base}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:c.apiKey,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:cloudSession.refreshToken})});
  let rd=await rr.json().catch(()=>({}));
  if(rr.ok){cloudSession.token=rd.access_token;cloudSession.refreshToken=rd.refresh_token;let headers={...(options.headers||{}),Authorization:`Bearer ${cloudSession.token}`};return cloudFetch(path,{...options,headers},false)}
 }
 let body=await res.text(),data=null;
 if(body){try{data=JSON.parse(body)}catch{data={message:body.slice(0,500)}}}
 if(!res.ok)throw Error(data?.msg||data?.message||data?.error_description||data?.hint||`Cloud-Fehler (${res.status})`);
 return data;
}
// Erstellt einen isolierten Zugriff auf die vorbereiteten Datengruppen.
// Absichtlich noch nicht mit put()/cloudWrite() verbunden: Legacy-Speicherung bleibt aktiv.
function createCloudDataAccess(){
 if(storageMode!=="cloud"||!cloudSession||!cloudKey)throw Error("Bitte zuerst mit einem Cloud-Konto anmelden.");
 if(!window.MVAEncryptedData?.create)throw Error("Das Modul für getrennte Cloud-Datengruppen wurde nicht geladen.");
 return window.MVAEncryptedData.create({
  request:(path,options={})=>cloudFetch(path,{...options,headers:{...(options.headers||{}),Authorization:`Bearer ${cloudSession.token}`}}),
  userId:cloudSession.userId,
  key:cloudKey
 });
}
// Binärer Storage-Zugriff mit derselben Sitzung wie die übrigen Cloud-Aufrufe.
 // Gibt die rohe Response zurück, damit verschlüsselte Dateien als ArrayBuffer gelesen werden können.
async function cloudStorageFetch(path,options={},retry=true){
 if(!cloudSession?.token)throw Error('Medien-Cloud: Keine aktive Anmeldung.');
 const c=cloudConfig(),base=c.url.replace(/\/$/,'');
 const headers={apikey:c.apiKey,Authorization:`Bearer ${cloudSession.token}`,...(options.headers||{})};
 const res=await timedCloudFetch(`${base}/storage/v1/object/${path.split('/').map(encodeURIComponent).join('/')}`,{...options,headers},90000);
 if(res.status===401&&retry&&cloudSession.refreshToken){
  const rr=await timedCloudFetch(`${base}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:c.apiKey,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:cloudSession.refreshToken})},20000);
  const rd=await rr.json().catch(()=>({}));
  if(rr.ok&&rd.access_token&&rd.refresh_token){
   cloudSession.token=rd.access_token;cloudSession.refreshToken=rd.refresh_token;
   return cloudStorageFetch(path,options,false);
  }
 }
 return res;
}
function clearCloudMediaAccess(){
 if(cloudMediaAccess?.resolver&&typeof cloudMediaAccess.resolver.dispose==='function')cloudMediaAccess.resolver.dispose();
 cloudMediaAccess=null;
}
function createCloudMediaResolver(){
 if(storageMode!=='cloud'||!cloudSession||!cloudKey)throw Error('Medien-Cloud: Bitte zuerst mit dem Cloud-Konto anmelden.');
 if(cloudMediaAccess?.userId===cloudSession.userId)return cloudMediaAccess;
 if(!window.MVAEncryptedMedia||!window.MVACloudMediaResolver)throw Error('Medienmodule sind nicht geladen.');
 const config=cloudConfig();
 const media=window.MVAEncryptedMedia.create({
  url:config.url,apiKey:config.apiKey,userId:cloudSession.userId,key:cloudKey,
  request:(path,options)=>cloudStorageFetch(path,options)
 });
 const resolver=window.MVACloudMediaResolver.create({media});
 cloudMediaAccess=Object.freeze({media,resolver,userId:cloudSession.userId});
 return cloudMediaAccess;
}
function isCloudMediaReference(value){return !!value&&typeof value==='object'&&value.v===1&&value.storage==='supabase'&&typeof value.path==='string'}
async function resolveMediaImage(img,value){
 if(typeof value==='string'){img.src=value;return}
 if(!isCloudMediaReference(value))return;
 try{img.src=await createCloudMediaResolver().resolver.resolve(value)}catch(error){console.error('Foto konnte nicht aus der Cloud geladen werden:',error);img.alt=(img.alt||'Foto')+' – konnte nicht geladen werden';img.classList.add('media-load-error')}
}
async function mediaValueAsBlob(value){
 if(typeof value==='string'&&value.startsWith('data:'))return (await fetch(value)).blob();
 if(isCloudMediaReference(value))return createCloudMediaResolver().media.download(value);
 throw Error('Unbekanntes Medienformat.');
}
async function mediaToPortableDataUrl(value){
 if(typeof value==='string')return value;
 if(!isCloudMediaReference(value))throw Error('Unbekannte Medienreferenz im Backup.');
 const blob=await mediaValueAsBlob(value),bytes=new Uint8Array(await blob.arrayBuffer());
 return 'data:'+(blob.type||value.mime||'application/octet-stream')+';base64,'+b64(bytes);
}
async function createPortableBackupSnapshot(){
 const snapshot=JSON.parse(JSON.stringify(db));
 for(const photo of snapshot.photos||[])if(isCloudMediaReference(photo.src))photo.src=await mediaToPortableDataUrl(photo.src);
 for(const device of snapshot.devices||[]){if(isCloudMediaReference(device.photo))device.photo=await mediaToPortableDataUrl(device.photo);if(isCloudMediaReference(device.manualData))device.manualData=await mediaToPortableDataUrl(device.manualData)}
 return snapshot;
}
async function cloudAuth(identifier,password){if(!cloudReady())throw Error('Cloud ist noch nicht eingerichtet. Folge der Anleitung in cloud-setup.md.');let loginEmail=identifier.includes('@')?identifier.trim().toLowerCase():`${identifier.trim().toLowerCase()}@mva.invalid`;let d=await cloudFetch('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:loginEmail,password})});return {token:d.access_token,refreshToken:d.refresh_token,userId:d.user.id,email:d.user.email}}
async function cloudSignup(email,password){if(!cloudReady())throw Error('Cloud ist noch nicht eingerichtet.');let d=await cloudFetch('/auth/v1/signup?redirect_to='+encodeURIComponent(location.origin+location.pathname),{method:'POST',body:JSON.stringify({email,password})});return d}
async function cloudResetEmail(email){let c=cloudConfig();let res=await fetch(`${c.url.replace(/\/$/,'')}/auth/v1/recover?redirect_to=${encodeURIComponent(location.origin+location.pathname)}`,{method:'POST',headers:{apikey:c.apiKey,'Content-Type':'application/json'},body:JSON.stringify({email})});let d=await res.json().catch(()=>({}));if(!res.ok)throw Error(d.msg||d.message||d.error_description||'E-Mail konnte nicht versendet werden')}
async function cloudRead(){let rows=await cloudFetch(`/rest/v1/mva_saves?select=payload&user_id=eq.${encodeURIComponent(cloudSession.userId)}&limit=1`,{headers:{Authorization:`Bearer ${cloudSession.token}`}});return rows?.[0]?.payload||null}
// Kanonischer Vergleich des entschlüsselten Spielstands: Schlüsselreihenfolge
// spielt keine Rolle. Medien-Data-URLs werden bytegenau mitverglichen.
function canonicalCloudValue(value){
 if(Array.isArray(value))return value.map(canonicalCloudValue);
 if(value&&typeof value==='object'){
  const result={};
  for(const key of Object.keys(value).sort())result[key]=canonicalCloudValue(value[key]);
  return result;
 }
 return value;
}
function cloudSnapshotsEqual(a,b){
 return JSON.stringify(canonicalCloudValue(a))===JSON.stringify(canonicalCloudValue(b));
}
async function cloudWrite(){
 if(!cloudSession||!cloudKey)return;
 cloudSaveRevision++;
 if(cloudWritePromise)return cloudWritePromise;
 cloudWritePromise=(async()=>{
  while(cloudSavedRevision<cloudSaveRevision){
   const revision=cloudSaveRevision;
   const snapshot=JSON.parse(JSON.stringify(db));
   let lastError=null;
   for(let attempt=0;attempt<4;attempt++){
    try{
     // Erst den aktuellen Cloud-Stand lesen und entschlüsselt vergleichen.
     // Bei identischen Daten wird kein neuer Upload ausgelöst. Ein Lesefehler
     // bricht sicher ab: niemals ungeprüft einen möglicherweise neueren Stand überschreiben.
     setCloudStatus('Cloud-Sicherung: vorhandene Daten werden abgeglichen …');
     const cloudPayload=await cloudRead();
     if(cloudPayload){
      const cloudSnapshot=await decryptCloud(cloudPayload);
      if(cloudSnapshotsEqual(snapshot,cloudSnapshot)){
       try{await saveCloudRecoveryCopy(cloudPayload);cloudRecoveryWarningShown=false}catch(storageError){console.warn('Lokale verschlüsselte Wiederherstellungskopie konnte nicht aktualisiert werden:',storageError)}
       cloudSavedRevision=revision;
       lastError=null;
       setCloudStatus('Cloud ist bereits aktuell – keine Übertragung erforderlich');
       break;
      }
     }
     setCloudStatus('Cloud-Sicherung: Daten werden verschlüsselt …');
     const payload=await encryptCloud(snapshot);
     setCloudStatus('Cloud-Sicherung: lokale verschlüsselte Notfallkopie wird geschrieben …');
     try{await saveCloudRecoveryCopy(payload);cloudRecoveryWarningShown=false}catch(storageError){console.warn('Lokale verschlüsselte Wiederherstellungskopie konnte nicht aktualisiert werden:',storageError);if(!cloudRecoveryWarningShown){cloudRecoveryWarningShown=true;toast('Cloud-Speicherung läuft, aber die lokale verschlüsselte Notfallkopie konnte nicht gespeichert werden. Bitte zusätzlich ein JSON-Backup herunterladen.')}}
     setCloudStatus(`Cloud-Sicherung: Übertragung läuft (Versuch ${attempt+1} von 4) …`);
     await cloudFetch('/rest/v1/mva_saves?on_conflict=user_id',{method:'POST',headers:{Authorization:`Bearer ${cloudSession.token}`,Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:cloudSession.userId,payload,updated_at:new Date().toISOString()})});
     cloudSavedRevision=revision;
     lastError=null;
     break;
    }catch(error){
     lastError=error;
     setCloudStatus(`Cloud-Sicherung: Versuch ${attempt+1} von 4 fehlgeschlagen – erneuter Versuch folgt …`);
     if(attempt<3)await new Promise(resolve=>setTimeout(resolve,[1000,3000,8000][attempt]));
    }
   }
   if(lastError)throw Error(`Cloud-Speicherung nach 4 Versuchen fehlgeschlagen. Letzter Fehler: ${lastError.message||lastError}`);
   if(cloudSavedRevision===cloudSaveRevision)setCloudStatus('Cloud gespeichert');
   else setCloudStatus('Weitere Änderungen werden gespeichert …');
  }
 })().finally(()=>{cloudWritePromise=null});
 return cloudWritePromise;
}
function scheduleCloudSave(){
 if(!cloudSession||!cloudKey)return;
 setCloudStatus('Änderungen werden gespeichert …');
 clearTimeout(cloudTimer);
 cloudTimer=setTimeout(()=>cloudWrite().catch(e=>{
  console.error(e);
  setCloudStatus('Cloud-Speicherung fehlgeschlagen');
  toast('Cloud-Speicherung nach mehreren Versuchen fehlgeschlagen: '+(e.message||'Bitte Verbindung prüfen. Deine letzte verschlüsselte lokale Sicherung bleibt erhalten, sofern lokaler Speicher verfügbar ist.'));
 }),700);
}
function setCloudStatus(text){let el=$('#storage-status');if(el)el.innerHTML=`<i></i> ${esc(text)}`;let feedback=$('#modal-save-feedback');if(feedback&&feedback.dataset.error!=='true'){feedback.style.display='block';feedback.textContent=text}}

async function showLoginAnimation(){
 if(localStorage.getItem('mva_login_animation')==='false'||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 const src='Bilder/vaanimat.gif';
 const overlay=document.createElement('div');
 overlay.id='mva-login-animation';
 overlay.setAttribute('role','dialog');
 overlay.setAttribute('aria-modal','true');
 overlay.setAttribute('aria-label','My Vaping Adventure');
 overlay.style.cssText='position:fixed;inset:0;z-index:100000;background:#090d0b;display:flex;align-items:center;justify-content:center;padding:18px;opacity:1;transition:opacity .35s ease';
 const img=document.createElement('img');
 img.src=src+'?v=login-animation-1';
 img.alt='My Vaping Adventure – Startanimation';
 img.style.cssText='display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;border-radius:16px';
 overlay.appendChild(img);
 document.body.appendChild(overlay);
 let duration=8000;
 try{
  const response=await fetch(src,{cache:'no-store'});
  if(response.ok){
   const bytes=new Uint8Array(await response.arrayBuffer());
   let p=13,packed=bytes[10];
   if(packed&0x80)p+=3*(1<<((packed&7)+1));
   let total=0,frames=0;
   const skipBlocks=()=>{while(p<bytes.length){const n=bytes[p++];if(!n)break;p+=n}};
   while(p<bytes.length){
    const marker=bytes[p++];
    if(marker===0x3b)break;
    if(marker===0x21){
     const label=bytes[p++];
     if(label===0xf9){const n=bytes[p++];if(n>=4){p++;const delay=bytes[p]|(bytes[p+1]<<8);p+=2;p++;total+=delay*10;frames++}if(bytes[p]===0)p++}
     else skipBlocks();
    }else if(marker===0x2c){
     p+=8;const imagePacked=bytes[p++];
     if(imagePacked&0x80)p+=3*(1<<((imagePacked&7)+1));
     p++;skipBlocks();
    }else break;
   }
   if(frames&&total>0)duration=total;
  }
 }catch(error){console.warn('GIF-Dauer konnte nicht ermittelt werden; Fallback wird verwendet.',error)}
 const close=()=>{overlay.style.opacity='0';setTimeout(()=>overlay.remove(),380)};
 window.setTimeout(close,duration+250);
}

function authEmail(){return $('#cloud-email')?.value.trim().toLowerCase()||''}
function showRecoveryCode(code){const t=localeText;openModal(t('recovery.title'),`<p class="subheading">${t('recovery.description')}</p><div class="formrow" style="margin:16px 0"><label for="recovery-code-value">${t('recovery.label')}</label><input class="field" id="recovery-code-value" type="text" readonly value="${esc(code)}" style="font-family:monospace;font-size:15px;letter-spacing:.04em"></div><button class="btn soft" type="button" id="copy-recovery-code" style="width:100%">${t('recovery.copy')}</button><p class="tagline" id="recovery-copy-status" aria-live="polite">${t('recovery.once')}</p>`,t('dialog.save'),()=>{$('#modal-root').innerHTML='';showLoginAnimation()});let input=$('#recovery-code-value'),copy=$('#copy-recovery-code'),status=$('#recovery-copy-status');copy.onclick=async()=>{try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(code)}else{input.focus();input.select();if(!document.execCommand('copy'))throw Error('copy failed')}status.textContent=t('recovery.copied');copy.textContent=t('recovery.copySuccess')}catch{input.focus();input.select();status.textContent=t('recovery.copyHint')}};input.addEventListener('click',()=>input.select())}
async function cloudLogin(signup){
 let email=authEmail(),password=$('#cloud-pass')?.value;
 if(signup&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return toast('Für ein neues Konto bitte eine gültige E-Mail-Adresse eingeben.');
 if(!signup&&!email)return toast('Bitte deine E-Mail-Adresse oder deinen bisherigen Benutzernamen eingeben.');
 if(!password||password.length<8)return toast('Das Kennwort muss mindestens 8 Zeichen haben.');
 let button=$('#cloud-connect');if(button){button.disabled=true;button.textContent='Einen Moment …'}
 try{
  if(signup){
   let d=await cloudSignup(email,password);
   if(!d.session){toast('Registrierung gestartet. Bitte bestätige zuerst den Link in deiner E-Mail.');return}
   clearCloudMediaAccess();cloudSession={token:d.session.access_token,refreshToken:d.session.refresh_token,userId:d.user.id,email:d.user.email};
  }else{clearCloudMediaAccess();cloudSession=await cloudAuth(email,password);}
  cloudPassword=password;
  let box=await cloudRead();
  if(box){
   let cloudData=await decryptCloud(box);
   openModal(localeText('cloud.choiceTitle'),`
    <p class="subheading">${localeText('cloud.choiceIntro')}</p>
    <label class="card" style="display:block;margin:12px 0;cursor:pointer"><input type="radio" name="cloud-choice" value="local" style="width:auto;margin-right:8px"> <b>${localeText('cloud.uploadLocal')}</b><div class="tagline" style="margin:7px 0 0">${localDb.entries.length} · ${localDb.devices.length} · ${localDb.strains.length} · ${localDb.photos.length}</div><p class="tagline">${localeText('cloud.localReplaces')}</p></label>
    <label class="card" style="display:block;margin:12px 0;cursor:pointer"><input type="radio" name="cloud-choice" value="cloud" checked style="width:auto;margin-right:8px"> <b>${localeText('cloud.downloadCloud')}</b><div class="tagline" style="margin:7px 0 0">${cloudData.entries?.length||0} · ${cloudData.devices?.length||0} · ${cloudData.strains?.length||0} · ${cloudData.photos?.length||0}</div><p class="tagline">${localeText('cloud.cloudReplaces')}</p></label>
    <p class="tagline">${localeText('cloud.backupUnaffected')}</p>
   `,localeText('cloud.applyChoice'),async()=>{
    let choice=$('[name="cloud-choice"]:checked')?.value;
    if(choice==='local'){
     if(!confirm(localeText('confirm.cloudReplace')))return;
     try{
      db=localDb;storageMode='cloud';await cloudWrite();
      setCloudStatus('Verschlüsselte Cloud · '+(cloudSession.email||''));
      $('#modal-root').innerHTML='';if($('#cloud-pass'))$('#cloud-pass').value='';render();showLoginAnimation();toast('Lokaler Spielstand sicher in die Cloud übertragen');
     }catch(error){
      db=localDb;storageMode='local';setCloudStatus('Nur auf diesem Gerät');
      toast(error.message||'Upload fehlgeschlagen. Deine lokalen Daten bleiben erhalten.');
     }
    }else{
     db=cloudData;storageMode='cloud';setCloudStatus('Verschlüsselte Cloud · '+(cloudSession.email||''));
     $('#modal-root').innerHTML='';if($('#cloud-pass'))$('#cloud-pass').value='';render();showLoginAnimation();toast('Cloud-Spielstand geladen');
    }
   });
  }else{
   if(!confirm('Dein Cloud-Konto ist noch leer. Soll der lokale Spielstand jetzt verschlüsselt hochgeladen werden?\\n\\n'+localDb.entries.length+' Einträge · '+localDb.devices.length+' Geräte · '+localDb.strains.length+' Sorten · '+localDb.photos.length+' Fotos')){
    clearCloudMediaAccess();cloudSession=null;cloudKey=null;cloudSalt=null;cloudEnvelope=null;cloudPassword='';storageMode='local';db=localDb;render();return;
   }
   db=localDb;storageMode='cloud';let recovery=await createCloudEnvelope(password);await cloudWrite();
   showRecoveryCode(recovery);
   if($('#cloud-pass'))$('#cloud-pass').value='';render();toast('Lokaler Spielstand sicher in die Cloud übertragen');
  }
 }catch(e){
  console.error(e);clearCloudMediaAccess();cloudSession=null;cloudKey=null;cloudSalt=null;cloudEnvelope=null;cloudPassword='';storageMode='local';db=localDb;setCloudStatus('Nur auf diesem Gerät');toast(e.message||'Cloud-Verbindung fehlgeschlagen');
 }finally{
  cloudPassword='';
  if(button){button.disabled=false;button.textContent='Anmelden'}
 }
}
async function sendPasswordReset(){let email=authEmail();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return toast('Bitte zuerst deine E-Mail-Adresse eingeben.');try{await cloudResetEmail(email);toast('Wenn das Konto existiert, wurde eine E-Mail zum Zurücksetzen versendet.')}catch(e){toast(e.message||'Versand fehlgeschlagen')}}
async function changeCloudEmail(){
 if(!cloudSession||storageMode!=='cloud')return toast('Bitte zuerst anmelden.');
 const email=$('#cloud-change-email')?.value.trim().toLowerCase()||'';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return toast('Bitte eine gültige E-Mail-Adresse eingeben.');
 if(email===String(cloudSession.email||'').toLowerCase())return toast('Diese E-Mail-Adresse ist bereits hinterlegt.');
 try{
  const redirectTo=location.origin+location.pathname;
  await cloudFetch('/auth/v1/user?redirect_to='+encodeURIComponent(redirectTo),{method:'PUT',headers:{Authorization:'Bearer '+cloudSession.token},body:JSON.stringify({email})});
  toast('Bestätigungslink wurde angefordert. Bitte prüfe dein E-Mail-Postfach und bestätige die neue Adresse.');
 }catch(error){toast(error.message||'E-Mail-Adresse konnte nicht geändert werden.')}
}
async function changeCloudPassword(){
 if(!cloudSession||storageMode!=='cloud')return toast('Bitte zuerst anmelden.');
 if(!cloudEnvelope?.password)return toast('Dieser ältere Cloud-Spielstand unterstützt den direkten Passwortwechsel noch nicht. Bitte nutze vorerst „Passwort vergessen“.');
 const current=$('#cloud-current-password')?.value||'',next=$('#cloud-new-password')?.value||'',confirmNext=$('#cloud-confirm-password')?.value||'';
 if(!current)return toast('Bitte dein bisheriges Passwort eingeben.');
 if(next.length<8)return toast('Das neue Passwort muss mindestens 8 Zeichen haben.');
 if(next!==confirmNext)return toast('Die neuen Passwörter stimmen nicht überein.');
 if(next===current)return toast('Bitte wähle ein anderes Passwort.');
 const button=$('#cloud-password-save');if(button){button.disabled=true;button.textContent='Wird geändert …'}
 try{
  const verified=await cloudAuth(cloudSession.email,current);
  if(verified.userId!==cloudSession.userId)throw Error('Die Kontoüberprüfung ist fehlgeschlagen.');
  const oldSalt=unb64(cloudEnvelope.password.salt),oldKek=await deriveCloudKey(current,oldSalt),raw=await aesUnwrap(oldKek,cloudEnvelope.password);
  const newSalt=crypto.getRandomValues(new Uint8Array(16)),newKek=await deriveCloudKey(next,newSalt),wrapped=await aesWrap(newKek,raw);
  const updatedEnvelope={...cloudEnvelope,password:{salt:b64(newSalt),...wrapped}};
  await cloudFetch('/auth/v1/user',{method:'PUT',headers:{Authorization:'Bearer '+cloudSession.token},body:JSON.stringify({password:next})});
  cloudEnvelope=updatedEnvelope;
  await cloudWrite();
  $('#cloud-current-password').value='';$('#cloud-new-password').value='';$('#cloud-confirm-password').value='';
  toast('Passwort geändert und Cloud-Verschlüsselung aktualisiert. Bitte künftig das neue Passwort verwenden.');
 }catch(error){console.error(error);toast(error.message||'Passwort konnte nicht geändert werden.')}
 finally{if(button){button.disabled=false;button.textContent='Passwort ändern'}}
}
async function handlePasswordRecovery(){let hash=new URLSearchParams(location.hash.slice(1));if(hash.get('type')!=='recovery'||!hash.get('access_token'))return;let token=hash.get('access_token');history.replaceState(null,'',location.pathname+location.search);let recovery=prompt('Bitte gib deinen Vaping-Adventure-Wiederherstellungscode ein.');if(!recovery)return toast('Wiederherstellung abgebrochen.');let newPass=prompt('Bitte lege dein neues Passwort fest (mindestens 8 Zeichen).');if(!newPass||newPass.length<8)return toast('Passwort muss mindestens 8 Zeichen haben.');try{let c=cloudConfig(),headers={apikey:c.apiKey,'Content-Type':'application/json',Authorization:'Bearer '+token};let rr=await fetch(c.url.replace(/\/$/,'')+'/rest/v1/mva_saves?select=payload&limit=1',{headers});let rows=await rr.json();let box=rows?.[0]?.payload;if(!box||box.v!==2)throw Error('Für dieses Konto ist kein kompatibler Wiederherstellungsschlüssel vorhanden.');let env=box.envelope,rs=unb64(env.recovery.salt),rk=await deriveCloudKey(recovery,rs),raw=await aesUnwrap(rk,env.recovery),dek=await crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['encrypt','decrypt']);let ps=crypto.getRandomValues(new Uint8Array(16)),pk=await deriveCloudKey(newPass,ps),pw=await aesWrap(pk,raw);env.password={salt:b64(ps),...pw};let up=await fetch(c.url.replace(/\/$/,'')+'/auth/v1/user',{method:'PUT',headers,body:JSON.stringify({password:newPass})});if(!up.ok)throw Error('Neues Passwort konnte nicht gespeichert werden.');box.envelope=env;let ur=await fetch(c.url.replace(/\/$/,'')+'/auth/v1/user',{headers});let ud=await ur.json();if(!ur.ok||!ud.id)throw Error('Konto konnte nicht bestätigt werden.');let wr=await fetch(c.url.replace(/\/$/,'')+'/rest/v1/mva_saves?on_conflict=user_id',{method:'POST',headers:{...headers,Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:ud.id,payload:box,updated_at:new Date().toISOString()})});if(!wr.ok)throw Error('Verschlüsselungsschlüssel konnte nicht aktualisiert werden. Bitte den Support kontaktieren.');toast('Passwort geändert. Bitte melde dich jetzt mit dem neuen Passwort an.')}catch(e){console.error(e);toast(e.message||'Wiederherstellung fehlgeschlagen. Prüfe den Code.')}}

function emptyDb(){return {entries:[],devices:defaults.map(x=>({...x})),strains:[],photos:[],game:{xp:0,coins:0,quests:[],courses:{}}}}
async function flushCloudSave(){
 if(storageMode!=='cloud'||!cloudSession||!cloudKey)return true;
 clearTimeout(cloudTimer);
 cloudTimer=null;
 try{
  await cloudWrite();
  if(cloudSavedRevision<cloudSaveRevision)throw Error('Die letzte Änderung wurde noch nicht bestätigt.');
  setCloudStatus('Cloud gespeichert');
  return true;
 }catch(error){
  console.error('Cloud-Speicherung vor dem Abmelden fehlgeschlagen:',error);
  setCloudStatus('Cloud-Speicherung fehlgeschlagen');
  toast('Abmeldung abgebrochen: Cloud-Speicherung fehlgeschlagen – '+(error?.message||'Unbekannter Fehler')+'. Deine Daten bleiben angemeldet; bitte erneut versuchen.');
  return false;
 }
}
async function switchLocal(){
 if(storageMode==='local')return true;
 const saved=await flushCloudSave();
 if(!saved)return false;
 // Keep the currently loaded cloud data when switching to local mode.
 // The previous implementation restored the stale localDb object here,
 // which could make newer cloud entries disappear from the active session.
 let localSnapshot, serializedSnapshot, localSaveStage='Vorbereitung der lokalen Sicherung';
 try{
  localSaveStage='Übertragen von Fotos und PDF-Anleitungen in die lokale Sicherung';
  localSnapshot=await createPortableBackupSnapshot();
  localSaveStage='Umwandeln des Spielstands in das lokale Speicherformat';
  serializedSnapshot=JSON.stringify(localSnapshot);
  if(typeof serializedSnapshot!=='string')throw Error('Der Spielstand konnte nicht in ein speicherbares Format umgewandelt werden.');
  localSaveStage='Schreiben und Überprüfen in der lokalen IndexedDB';
  await saveLocalSnapshot(serializedSnapshot);
 }catch(error){
  console.error('Lokaler Spielstand konnte vor dem Speicherwechsel nicht gesichert werden:',{stage:localSaveStage,error});
  const errorName=String(error?.name||'Unbekannter Fehler');
  const errorMessage=String(error?.message||error||'Keine technischen Details verfügbar.');
  const isQuotaError=errorName==='QuotaExceededError'||/quota|storage full|disk full|speicher.*voll/i.test(errorMessage);
  const sizeInfo=typeof serializedSnapshot==='string'
   ? ' Größe der lokalen Sicherung: ca. '+(new Blob([serializedSnapshot]).size/1024/1024).toFixed(2)+' MB.'
   : '';
  const reason=isQuotaError
   ? 'Der verfügbare Speicher dieser Website auf deinem iPhone reicht wahrscheinlich nicht aus. Bitte nichts löschen, bevor ein zusätzliches JSON-Backup vorhanden ist.'
   : 'Technischer Fehler ('+errorName+'): '+errorMessage;
  toast('Wechsel zum lokalen Speicher abgebrochen. Schritt: '+localSaveStage+'. '+reason+sizeInfo+' Du bleibst angemeldet; deine Cloud-Daten bleiben erhalten.');
  return false;
 }
 localDb=localSnapshot;
 db=localDb;
 storageMode='local';
 clearCloudMediaAccess();cloudSession=null;cloudKey=null;cloudSalt=null;cloudEnvelope=null;cloudPassword='';
 setCloudStatus('Nur auf diesem Gerät');render();toast('Cloud-Spielstand lokal gesichert und aktiviert');
 return true;
}
function updateNav(){document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===page));document.querySelector('#diary-count').textContent=db.entries.length;setCloudStatus(storageMode==='cloud'?`Verschlüsselte Cloud · ${cloudSession?.email||''}`:'Nur auf diesem Gerät');updateProfile()}
function updateProfile(){
 const trigger=$('#profile-trigger'),menu=$('#profile-menu'),initial=$('#profile-initial');
 if(!trigger||!menu||!initial)return;
 const active=!!cloudSession&&storageMode==='cloud';
 const name=active?(cloudSession.username||'Dein Profil'):'Gastmodus';
 const email=active?(cloudSession.email||''):'';
 initial.textContent=active?String(name).trim().charAt(0).toUpperCase()||'P':'G';
 trigger.setAttribute('aria-label',active?'Profil von '+name+' öffnen':'Profilmenü öffnen');
 menu.innerHTML=active
  ? `<h3 class="profile-title">Dein Profil</h3><div class="profile-name">${esc(name)}</div><div class="profile-email">${esc(email)}</div><div class="profile-state"><i></i> Verschlüsselte Cloud aktiv</div><div class="profile-actions"><button class="btn primary" data-profile-action="settings">⚙ Einstellungen öffnen</button><button class="btn soft" data-profile-action="backup">Speicher & Backup öffnen →</button><button class="btn" data-profile-action="logout">Abmelden</button></div>`
  : `<h3 class="profile-title">Dein Profil</h3><div class="profile-name">Gastmodus</div><div class="profile-email">Du bist aktuell nicht mit einem Cloud-Konto angemeldet.</div><div class="profile-state"><i></i> Nur auf diesem Gerät gespeichert</div><div class="profile-actions"><button class="btn primary" data-profile-action="settings">⚙ Einstellungen öffnen</button><button class="btn soft" data-profile-action="backup">Cloud-Konto verbinden →</button></div>`;
}
async function logoutProfile(){
 if(storageMode==='cloud'){await switchLocal();if(storageMode==='cloud')return}
 clearCloudMediaAccess();cloudSession=null;cloudKey=null;cloudSalt=null;cloudPassword='';
 const menu=$('#profile-menu'),trigger=$('#profile-trigger');if(menu)menu.hidden=true;if(trigger)trigger.setAttribute('aria-expanded','false');
 updateNav();toast('Du wurdest abgemeldet.');
}
function go(p){page=p;updateNav();render();window.scrollTo(0,0)}
function getAppSettings(){
 if(!db.settings||typeof db.settings!=='object'||Array.isArray(db.settings))db.settings={};
 const defaults={vaporizer:true,ecig:true,heater:true,cigarette:true,joint:true,bong:true};
 db.settings.vapingCategories={...defaults,...(db.settings.vapingCategories||{})};
 return db.settings;
}
function isCategoryEnabled(category){return getAppSettings().vapingCategories[category]!==false}

const THEME_KEY="mva_theme";
const THEME_OPTIONS=[
 {id:"classic",name:"Original",desc:"Klares, ruhiges Grün – jetzt harmonischer und kontrastreicher",swatches:["#f4f6f1","#ffffff","#315b4a"]},
 {id:"forest",name:"Forest & Nature",desc:"Tiefes Waldgrün, Salbei und frisches Blattgrün",swatches:["#eaf2e7","#f8fbf6","#286443"]},
 {id:"ocean",name:"Ocean Blue",desc:"Kühles Meeresblau mit hellem Aqua und Türkis",swatches:["#e7f3f5","#f8fcfd","#176477"]},
 {id:"sunset",name:"Sunset",desc:"Warmer Terrakotta-Akzent auf sanftem Sand",swatches:["#fbefe5","#fffaf5","#a94f37"]},
 {id:"midnight",name:"Midnight",desc:"Elegantes dunkles Navy mit eisblauem Fokus",swatches:["#172235","#26344b","#83bfff"]},
 {id:"sakura",name:"Sakura",desc:"Zartes Kirschblütenrosa mit Beerenton",swatches:["#f8edf2","#fff9fb","#a64f75"]},
 {id:"graphite",name:"Graphite",desc:"Reduziertes Graphit, Stahlgrau und klares Silber",swatches:["#e9edf1","#f8fafc","#46586d"]},
 {id:"lavender",name:"Lavender",desc:"Sanftes Flieder mit dunklem Violett",swatches:["#f0edfa","#fbfaff","#6654a3"]},
 {id:"desert",name:"Desert",desc:"Natürliches Sandbeige, Lehm und dunkles Ocker",swatches:["#f4eee2","#fffaf0","#8c6035"]},
 {id:"aurora",name:"Aurora",desc:"Nordlicht-inspiriertes Petrol mit Mint-Akzent",swatches:["#e8f3f0","#f8fcfa","#176b61"]}
];
function applyTheme(){
 const saved=localStorage.getItem(THEME_KEY)||"classic";
 const theme=THEME_OPTIONS.some(t=>t.id===saved)?saved:"classic";
 document.body.dataset.theme=theme;
 const button=$("#theme-switch");
 if(button){button.textContent="🎨 Design";button.setAttribute("aria-label","Design auswählen");}
 document.querySelectorAll("[data-theme-choice]").forEach(b=>{
  const active=b.dataset.themeChoice===theme;
  b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active));
  const status=b.querySelector(".theme-choice-status");if(status)status.textContent=active?"Aktiv":"Auswählen";
 });
}
function openThemePicker(){
 let picker=$("#theme-picker");
 if(!picker){
  picker=document.createElement("div");picker.id="theme-picker";picker.className="theme-picker";
  picker.innerHTML=`<div class="theme-picker-backdrop" data-theme-close></div><section class="theme-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="theme-picker-title"><div class="theme-picker-head"><div><span class="eyebrow">PERSONALISIERE DEIN ABENTEUER</span><h2 id="theme-picker-title">Design auswählen</h2><p>Wähle das Aussehen deiner persönlichen Vaping-Seite.</p></div><button class="theme-picker-close" type="button" data-theme-close aria-label="Schließen">×</button></div><div class="theme-choice-grid">${THEME_OPTIONS.map(t=>`<button type="button" class="theme-choice" data-theme-choice="${t.id}" style="--choice-accent:${t.swatches[2]}" aria-pressed="false"><span class="theme-mini" data-mini-theme="${t.id}" style="--mini-bg:${t.swatches[0]};--mini-paper:${t.swatches[1]};--mini-accent:${t.swatches[2]}"><i></i><i></i><i></i></span><span class="theme-choice-copy"><b>${t.name}</b><small>${t.desc}</small></span><span class="theme-choice-status">Auswählen</span></button>`).join("")}</div><p class="theme-picker-note">Deine Auswahl wird auf diesem Gerät gespeichert.</p></section>`;
  document.body.appendChild(picker);
 }
 picker.classList.add("open");applyTheme();
}
document.addEventListener("click",e=>{
 if(e.target.closest("[data-theme-picker]")){openThemePicker();return;}
 const choice=e.target.closest("[data-theme-choice]");
 if(choice){localStorage.setItem(THEME_KEY,choice.dataset.themeChoice);applyTheme();return;}
 if(e.target.closest("[data-theme-close]"))$("#theme-picker")?.classList.remove("open");
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#theme-picker")?.classList.remove("open");});
document.addEventListener('click',e=>{
 const trigger=e.target.closest('#profile-trigger');
 const menu=$('#profile-menu');
 if(trigger&&menu){
  const opening=menu.hidden;
  updateProfile();
  menu.hidden=!opening;
  trigger.setAttribute('aria-expanded',String(opening));
  return;
 }
 const action=e.target.closest('[data-profile-action]');
 if(action){
  if(menu)menu.hidden=true;
  $('#profile-trigger')?.setAttribute('aria-expanded','false');
  if(action.dataset.profileAction==='settings')go('settings');
  if(action.dataset.profileAction==='backup')go('backup');
  if(action.dataset.profileAction==='logout')logoutProfile();
  return;
 }
 if(menu&&!menu.hidden&&!e.target.closest('#profile-menu')){
  menu.hidden=true;
  $('#profile-trigger')?.setAttribute('aria-expanded','false');
 }
});

document.addEventListener('click',e=>{let n=e.target.closest('[data-page]');if(n){e.preventDefault();go(n.dataset.page)}});
const header=(eyebrow,title,sub,action='')=>`<div class="row mobile-stack"><div><div class="eyebrow">${eyebrow}</div><h1 class="heading">${title}</h1><p class="subheading">${sub}</p></div>${action}</div>`;
const card=(label,value,note)=>`<div class="card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-caption">${note}</div></div>`;
const empty=(title,desc,button)=>`<div class="card empty">✳<b>${title}</b>${desc}<div style="margin-top:12px">${button||''}</div></div>`;
window.MVA_ON_LANGUAGE_CHANGE=()=>{if(document.querySelector('#modal-root .modal'))return;render()};
function render(){updateNav();let v=$('#view');v.className='main';if(/^cvStep(?:[1-9]|1[0-2])$/.test(page))controlledVapingStep(v,Number(page.slice(6)));else ({home:home,diary:diary,strains:strains,devices:devices,gallery:gallery,quests:quests,plantCatalog:plantCatalog,learn:learn,controlledVaping:controlledVaping,settings:settings,backup:backup,more:more,guestbook:guestbook,forum:forumPage,contact:contact}[page]||home)(v);const lang=window.MVA_I18N?.getLanguage?.()||'de';const supportLabel=lang==='fr'?'Nous soutenons :':lang==='en'?'We support:':'Wir unterstützen den:';v.insertAdjacentHTML('beforeend',`<footer class="support-footer"><p>${supportLabel}</p><a href="https://hanfverband.de/" target="_blank" rel="noopener noreferrer"><img src="https://raw.githubusercontent.com/AdventureVapor/vaping-adventure/main/Bilder/DHV_logo.jpg" alt="Deutscher Hanfverband"></a></footer>`);}


const FORUM_CATEGORIES=[{id:'general',de:'Allgemeines',en:'General',fr:'Général'},{id:'devices',de:'Vaporizer & Geräte',en:'Vaporizers & devices',fr:'Vaporisateurs et appareils'},{id:'exchange',de:'Erfahrungen & Austausch',en:'Experiences & exchange',fr:'Expériences et échanges'}];
function forumText(de,en,fr){const l=window.MVA_I18N?.getLanguage?.()||'de';return l==='en'?en:l==='fr'?fr:de}
function forumDate(x){const l=window.MVA_I18N?.getLanguage?.()||'de';return new Date(x).toLocaleString(l==='fr'?'fr-FR':l==='en'?'en-GB':'de-DE',{dateStyle:'medium',timeStyle:'short'})}
function forumAuthor(){return String(cloudSession?.username||cloudSession?.user_metadata?.nickname||cloudSession?.email?.split('@')[0]||'Mitglied').slice(0,40)}
async function forumPage(v){
 const t=forumText,signed=!!cloudSession&&storageMode==='cloud';
 const catName=id=>{const c=FORUM_CATEGORIES.find(x=>x.id===id);return c?(c[window.MVA_I18N?.getLanguage?.()||'de']||c.de):id};
 v.innerHTML=header('COMMUNITY',t('Forum','Forum','Forum'),t('Der Austausch rund um My Vaping Adventure.','The community space for My Vaping Adventure.','L’espace d’échange autour de My Vaping Adventure.'),'')+'<section class="forum-wrap"><div class="card forum-intro"><b>'+t('Willkommen im Forum','Welcome to the forum','Bienvenue sur le forum')+'</b><p class="subheading">'+t('Alle dürfen mitlesen. Zum Schreiben brauchst du ein angemeldetes Cloud-Konto. Neue Beiträge werden vor der Veröffentlichung geprüft.','Everyone can read. A cloud account is required to post. New contributions are reviewed before publication.','La lecture est ouverte à tous. Un compte cloud est nécessaire pour publier. Les contributions sont vérifiées avant publication.')+'</p></div><div class="row forum-toolbar"><div><h2>'+t('Themen','Topics','Sujets')+'</h2><p class="subheading">'+t('Drei Bereiche zum Start.','Three sections to get started.','Trois espaces pour commencer.')+'</p></div>'+(signed?'<button class="btn primary" id="forum-new-topic">＋ '+t('Neues Thema','New topic','Nouveau sujet')+'</button>':'')+'</div><div id="forum-content"><div class="card empty">'+t('Forum wird geladen …','Loading forum …','Chargement du forum …')+'</div></div></section>';
 try{
  if(!cloudReady())throw Error('setup');
  const topics=await cloudFetch('/rest/v1/mva_forum_topics?select=id,category,title,body,display_name,created_at&status=eq.approved&order=created_at.desc&limit=100');
  const content=$('#forum-content');
  if(selectedForumTopic){
   const topic=topics.find(x=>x.id===selectedForumTopic);
   if(!topic){selectedForumTopic=null}else{
    const replies=await cloudFetch('/rest/v1/mva_forum_replies?select=id,body,display_name,created_at&topic_id=eq.'+encodeURIComponent(topic.id)+'&status=eq.approved&order=created_at.asc&limit=100');
    content.innerHTML='<button class="btn soft" id="forum-back">← '+t('Alle Themen','All topics','Tous les sujets')+'</button><article class="card forum-topic-detail"><div class="forum-category">'+esc(catName(topic.category))+'</div><h2>'+esc(topic.title)+'</h2><span class="forum-meta">'+esc(topic.display_name)+' · '+forumDate(topic.created_at)+'</span><p class="forum-body">'+esc(topic.body).replace(/\\n/g,'<br>')+'</p></article><h3 class="forum-reply-heading">'+t('Antworten','Replies','Réponses')+' ('+replies.length+')</h3>'+(replies.length?replies.map(r=>'<article class="card forum-reply"><span class="forum-meta">'+esc(r.display_name)+' · '+forumDate(r.created_at)+'</span><p>'+esc(r.body).replace(/\\n/g,'<br>')+'</p></article>').join(''):'<div class="forum-empty">'+t('Noch keine veröffentlichten Antworten.','No published replies yet.','Pas encore de réponses publiées.')+'</div>')+(signed?'<form class="card forum-form" id="forum-reply-form"><label for="forum-reply-body">'+t('Deine Antwort','Your reply','Votre réponse')+'</label><textarea class="field" id="forum-reply-body" rows="4" maxlength="3000" required></textarea><button class="btn primary" type="submit">'+t('Antwort einreichen','Submit reply','Envoyer la réponse')+'</button><p class="tagline" id="forum-reply-feedback" aria-live="polite"></p></form>':'');
    $('#forum-back').onclick=()=>{selectedForumTopic=null;forumPage(v)};
    const replyForm=$('#forum-reply-form');if(replyForm)replyForm.onsubmit=async e=>{e.preventDefault();const body=$('#forum-reply-body').value.trim(),button=replyForm.querySelector('button');if(!body)return;button.disabled=true;try{await cloudFetch('/rest/v1/mva_forum_replies',{method:'POST',headers:{Authorization:'Bearer '+cloudSession.token,Prefer:'return=minimal'},body:JSON.stringify({topic_id:topic.id,author_id:cloudSession.userId,display_name:forumAuthor(),body,status:'pending'})});$('#forum-reply-feedback').textContent=t('Danke! Deine Antwort wartet auf Freigabe.','Thanks! Your reply is awaiting approval.','Merci ! Votre réponse attend sa validation.');replyForm.reset()}catch(err){$('#forum-reply-feedback').textContent=t('Antwort konnte nicht eingereicht werden.','Could not submit reply.','Impossible d’envoyer la réponse.')}finally{button.disabled=false}};
    return;
   }
  }
  content.innerHTML=FORUM_CATEGORIES.map(c=>{const items=topics.filter(x=>x.category===c.id);return '<section class="forum-category-section"><div class="forum-category-head"><h3>'+esc(catName(c.id))+'</h3><span>'+items.length+'</span></div>'+(items.length?items.map(x=>'<button type="button" class="card forum-topic-row" data-forum-topic="'+esc(x.id)+'"><b>'+esc(x.title)+'</b><span class="forum-meta">'+esc(x.display_name)+' · '+forumDate(x.created_at)+'</span><p>'+esc(x.body.slice(0,160))+(x.body.length>160?'…':'')+'</p></button>').join(''):'<div class="forum-empty">'+t('Noch keine Themen in diesem Bereich.','No topics in this section yet.','Aucun sujet pour le moment.')+'</div>')+'</section>'}).join('');
  document.querySelectorAll('[data-forum-topic]').forEach(button=>button.onclick=()=>{selectedForumTopic=button.dataset.forumTopic;forumPage(v)});
  const create=$('#forum-new-topic');
  if(create)create.onclick=()=>{const opts=FORUM_CATEGORIES.map(c=>'<option value="'+c.id+'">'+esc(catName(c.id))+'</option>').join('');openModal(t('Neues Thema erstellen','Create a topic','Créer un sujet'),'<form id="forum-topic-form"><div class="formrow"><label for="forum-category">'+t('Bereich','Section','Espace')+'</label><select class="field" id="forum-category">'+opts+'</select></div><div class="formrow"><label for="forum-title">'+t('Titel','Title','Titre')+'</label><input class="field" id="forum-title" maxlength="120" required></div><div class="formrow"><label for="forum-body">'+t('Dein Beitrag','Your post','Votre message')+'</label><textarea class="field" id="forum-body" rows="6" maxlength="5000" required></textarea></div><p class="tagline">'+t('Dein Beitrag wird vor der Veröffentlichung geprüft.','Your post will be reviewed before publication.','Votre message sera vérifié avant publication.')+'</p></form>',t('Einreichen','Submit','Envoyer'),async()=>{const title=$('#forum-title').value.trim(),body=$('#forum-body').value.trim(),category=$('#forum-category').value;if(!title||!body)return;await cloudFetch('/rest/v1/mva_forum_topics',{method:'POST',headers:{Authorization:'Bearer '+cloudSession.token,Prefer:'return=minimal'},body:JSON.stringify({author_id:cloudSession.userId,display_name:forumAuthor(),category,title,body,status:'pending'})});$('#modal-root').innerHTML='';toast(t('Danke! Dein Thema wartet auf Freigabe.','Thanks! Your topic is awaiting approval.','Merci ! Votre sujet attend sa validation.'))})};
 }catch(error){$('#forum-content').innerHTML='<div class="card empty">'+(error.message==='setup'?t('Die Cloud-Verbindung ist noch nicht eingerichtet.','Cloud connection is not configured yet.','La connexion cloud n’est pas configurée.'):t('Das Forum ist gerade nicht erreichbar. Bitte später erneut versuchen.','The forum is temporarily unavailable. Please try again later.','Le forum est temporairement indisponible. Réessayez plus tard.'))+'</div>';console.error('Forum load error',error)}
}

async function guestbook(v){
 const signedIn=!!cloudSession&&storageMode==='cloud',t=localeText;
 v.innerHTML=`${header(t('guestbook.eyebrow'),t('guestbook.title'),t('guestbook.subtitle'),'')}<section class="guestbook-wrap"><div class="card guestbook-intro"><p>${t('guestbook.rules')}</p></div>${signedIn?`<form class="card guestbook-form" id="guestbook-form"><div class="formrow"><label for="guestbook-name">${t('guestbook.name')}</label><input class="field" id="guestbook-name" name="display_name" maxlength="40" required autocomplete="nickname" placeholder="${t('guestbook.name')}"></div><div class="formrow"><label for="guestbook-message">${t('guestbook.message')}</label><textarea class="field" id="guestbook-message" name="message" rows="4" maxlength="1000" required placeholder="${t('guestbook.message')}"></textarea></div><div class="guestbook-trap" aria-hidden="true"><label>${t('guestbook.website')}<input name="website" tabindex="-1" autocomplete="off"></label></div><button class="btn primary" type="submit">${t('guestbook.submit')}</button><p class="tagline guestbook-feedback" id="guestbook-feedback" aria-live="polite"></p></form>`:`<div class="card guestbook-login"><p>${t('guestbook.login')}</p><button class="btn primary" data-page="backup">${t('guestbook.connect')}</button></div>`}<div class="guestbook-list" id="guestbook-list"><div class="card empty">${t('guestbook.loading')}</div></div></section>`;
 const list=$('#guestbook-list');
 try{if(!cloudReady())throw Error('setup');const rows=await cloudFetch('/rest/v1/mva_guestbook?select=id,display_name,message,created_at&status=eq.approved&order=created_at.desc&limit=100');const lang=window.MVA_LOCALES?.getLanguage()||'de';list.innerHTML=rows.length?rows.map(row=>`<article class="card guestbook-entry"><div class="guestbook-entry-head"><b>${esc(row.display_name)}</b><time datetime="${esc(row.created_at)}">${new Date(row.created_at).toLocaleDateString(lang==='fr'?'fr-FR':lang==='en'?'en-GB':'de-DE')}</time></div><p>${esc(row.message).replace(/\\n/g,'<br>')}</p></article>`).join(''):`<div class="card empty">${t('guestbook.empty')}</div>`;}catch(error){list.innerHTML=`<div class="card empty">${error.message==='setup'?t('guestbook.setup'):t('guestbook.error')}</div>`;}
 const form=$('#guestbook-form');if(form)form.addEventListener('submit',async event=>{event.preventDefault();const feedback=$('#guestbook-feedback'),button=form.querySelector('button[type="submit"]'),data=new FormData(form),name=String(data.get('display_name')||'').trim(),message=String(data.get('message')||'').trim();if(data.get('website')||!name||!message||name.length>40||message.length>1000)return;if(Date.now()-Number(localStorage.getItem('mva_guestbook_last_submit')||0)<60000){feedback.textContent=t('guestbook.limit');return}button.disabled=true;button.textContent=t('guestbook.submitting');try{await cloudFetch('/rest/v1/mva_guestbook',{method:'POST',headers:{Authorization:`Bearer ${cloudSession.token}`,Prefer:'return=minimal'},body:JSON.stringify({author_id:cloudSession.userId,display_name:name,message,status:'pending'})});localStorage.setItem('mva_guestbook_last_submit',String(Date.now()));form.reset();feedback.textContent=t('guestbook.pending')}catch(error){feedback.textContent=t('guestbook.submitError')}finally{button.disabled=false;button.textContent=t('guestbook.submit')}});
}
function contact(v){
 const t=localeText;
 v.innerHTML=`${header(t('contact.eyebrow'),t('contact.title'),t('contact.subtitle'),'<button class="btn soft" data-page="more">← '+t('mobile.more')+'</button>')}
 <div class="contact-layout">
  <form class="card contact-form" id="contact-form">
   <div class="formgrid">
    <div class="formrow"><label for="contact-name">${t('contact.name')}</label><input class="field" id="contact-name" name="name" autocomplete="name" maxlength="100" required placeholder="${t('contact.namePlaceholder')}"></div>
    <div class="formrow"><label for="contact-email">${t('contact.email')}</label><input class="field" id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="name@example.com"></div>
    <div class="formrow full"><label for="contact-topic">${t('contact.topic')}</label><select class="field" id="contact-topic" name="topic" required><option value="">${t('contact.choose')}</option><option>${t('contact.general')}</option><option>${t('contact.technical')}</option><option>${t('contact.idea')}</option><option>${t('contact.course')}</option><option>${t('contact.account')}</option><option>${t('contact.other')}</option></select></div>
    <div class="formrow full"><label for="contact-subject">${t('contact.subject')}</label><input class="field" id="contact-subject" name="subject" maxlength="120" required placeholder="${t('contact.subjectPlaceholder')}"></div>
    <div class="formrow full"><label for="contact-message">${t('contact.message')}</label><textarea class="field" id="contact-message" name="message" rows="7" minlength="10" maxlength="3000" required placeholder="${t('contact.messagePlaceholder')}"></textarea></div>
   </div>
   <div class="contact-actions"><button class="btn primary" type="submit">${t('contact.prepare')}</button><a class="contact-direct" href="mailto:myvapingadventure@gmail.com">myvapingadventure@gmail.com</a></div>
   <p class="contact-note">${t('contact.notice')}</p>
  </form>
  <aside class="card contact-aside"><span class="more-icon">✉</span><h3>My Vaping Adventure</h3><p class="subheading">${t('contact.aside')}</p><a href="mailto:myvapingadventure@gmail.com">myvapingadventure@gmail.com</a></aside>
 </div>`;
 const form=$('#contact-form');
 form?.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const name=$('#contact-name').value.trim(),email=$('#contact-email').value.trim(),topic=$('#contact-topic').value,subject=$('#contact-subject').value.trim(),message=$('#contact-message').value.trim();
  const body=[message,'','---',t('contact.name')+': '+name,t('contact.email')+': '+email,t('contact.topic')+': '+topic].join('\n');
  const url='mailto:myvapingadventure@gmail.com?subject='+encodeURIComponent('[My Vaping Adventure] '+subject)+'&body='+encodeURIComponent(body);
  window.location.href=url;
  toast(t('contact.opening'));
 });
}

function settings(v){
 const lang=window.MVA_I18N?.getLanguage?.()||'de',t={
 de:{eyebrow:'DEIN PERSÖNLICHER BEREICH',title:'Einstellungen',intro:'Passe My Vaping Adventure an deine Nutzung an.',
 vaping:'Vaping-Konfiguration',what:'Was vapest du?',hint:'Wähle aus, welche Kategorien du im Tagebuch und in der Auswertung verwenden möchtest. Ausgeblendete Kategorien und ihre bisherigen Einträge werden nicht gelöscht.',
 language:'Sprache',design:'Design',designHint:'Wähle eines der fünf App-Designs.',choose:'Design auswählen',
 login:'Anmeldung konfigurieren',guest:'Du nutzt My Vaping Adventure derzeit ohne Cloud-Anmeldung.',signed:'Du bist mit deinem Cloud-Konto angemeldet.',account:'Anmelden, registrieren oder Kontoeinstellungen öffnen',logout:'Abmelden',
 animation:'Startanimation',animationHint:'Die Startanimation nach der Anmeldung anzeigen.',profile:'Profil / Daten',profileHint:'Dein Konto und dein aktiver Speicherort.',guestMode:'Gastmodus · nur auf diesem Gerät',cloud:'Verschlüsselte Cloud',email:'E-Mail-Adresse',entries:'Tagebucheinträge',devices:'Geräte',materials:'Materialien',photos:'Fotos',backup:'Speicher & Backup öffnen',on:'Aktiv',off:'Aus'
 },
 en:{eyebrow:'YOUR PERSONAL SPACE',title:'Settings',intro:'Personalize My Vaping Adventure to suit how you use it.',
 vaping:'Vaping configuration',what:'What do you use?',hint:'Choose which categories you want to use in your diary and reports. Hidden categories and their existing entries are never deleted.',
 language:'Language',design:'Design',designHint:'Choose one of the five app themes.',choose:'Choose design',
 login:'Sign-in configuration',guest:'You are currently using My Vaping Adventure without a cloud sign-in.',signed:'You are signed in to your cloud account.',account:'Sign in, register or manage account settings',logout:'Sign out',
 animation:'Start animation',animationHint:'Show the start animation after signing in.',profile:'Profile / Data',profileHint:'Your account and active storage location.',guestMode:'Guest mode · this device only',cloud:'Encrypted cloud',email:'Email address',entries:'Diary entries',devices:'Devices',materials:'Materials',photos:'Photos',backup:'Open Storage & Backup',on:'On',off:'Off'
 },
 fr:{eyebrow:'VOTRE ESPACE PERSONNEL',title:'Paramètres',intro:'Personnalisez My Vaping Adventure selon votre utilisation.',
 vaping:'Configuration du vapotage',what:'Qu’utilisez-vous ?',hint:'Choisissez les catégories à utiliser dans votre journal et vos rapports. Les catégories masquées et leurs anciennes entrées ne sont jamais supprimées.',
 language:'Langue',design:'Thème',designHint:'Choisissez l’un des cinq thèmes de l’application.',choose:'Choisir le thème',
 login:'Configuration de la connexion',guest:'Vous utilisez actuellement My Vaping Adventure sans connexion cloud.',signed:'Vous êtes connecté à votre compte cloud.',account:'Se connecter, créer un compte ou gérer le compte',logout:'Se déconnecter',
 animation:'Animation de démarrage',animationHint:'Afficher l’animation après la connexion.',profile:'Profil / Données',profileHint:'Votre compte et votre emplacement de stockage actif.',guestMode:'Mode invité · cet appareil uniquement',cloud:'Cloud chiffré',email:'Adresse e-mail',entries:'Entrées du journal',devices:'Appareils',materials:'Matériaux',photos:'Photos',backup:'Ouvrir Stockage et sauvegarde',on:'Activée',off:'Désactivée'
 }};
 const x=t[lang]||t.de, categories={
 vaporizer:{de:'Vaporizer',en:'Dry herb vaporizer',fr:'Vaporisateur'},
 ecig:{de:'E-Zigarette',en:'E-cigarette',fr:'Cigarette électronique'},
 heater:{de:'Tabakheater',en:'Tobacco heater',fr:'Chauffe-tabac'},
 cigarette:{de:'Zigarette',en:'Cigarette',fr:'Cigarette'},
 joint:{de:'Joint',en:'Joint',fr:'Joint'},
 bong:{de:'Bong',en:'Bong',fr:'Bang'}
 };
 const cfg=getAppSettings(),active=!!cloudSession&&storageMode==='cloud',animation=localStorage.getItem('mva_login_animation')!=='false';
 const status=active?x.signed:x.guest;
 v.innerHTML=`${header(x.eyebrow,x.title,x.intro,'')}
 <div class="settings-layout">
  <section class="card settings-card"><div class="settings-section-head"><span class="settings-icon">◉</span><div><h2>${x.vaping}</h2><p>${x.what}</p></div></div>
   <p class="settings-hint">${x.hint}</p><div class="settings-options">${Object.entries(categories).map(([key,label])=>`<label class="settings-option"><span><b>${label[lang]||label.de}</b></span><input type="checkbox" data-vaping-category="${key}" ${cfg.vapingCategories[key]?'checked':''}><i></i></label>`).join('')}</div>
  </section>
  <section class="card settings-card"><div class="settings-section-head"><span class="settings-icon">🌐</span><div><h2>${x.language}</h2><p>Deutsch · English · Français</p></div></div>
   <select class="field settings-select" id="settings-language"><option value="de" ${lang==='de'?'selected':''}>Deutsch</option><option value="en" ${lang==='en'?'selected':''}>English</option><option value="fr" ${lang==='fr'?'selected':''}>Français</option></select>
  </section>
  <section class="card settings-card"><div class="settings-section-head"><span class="settings-icon">🎨</span><div><h2>${x.design}</h2><p>${x.designHint}</p></div></div>
   <button class="btn soft" type="button" data-theme-picker>${x.choose}</button>
  </section>
  <section class="card settings-card"><div class="settings-section-head"><span class="settings-icon">🔐</span><div><h2>${x.login}</h2><p>${status}</p></div></div>
   <div class="settings-actions"><button class="btn primary" data-page="backup">${x.account}</button>${active?`<button class="btn" data-action="settings-logout">${x.logout}</button>`:''}</div>
  </section>
  <section class="card settings-card"><div class="settings-section-head"><span class="settings-icon">✨</span><div><h2>${x.animation}</h2><p>${x.animationHint}</p></div></div>
   <label class="settings-option"><span><b>${animation?x.on:x.off}</b></span><input type="checkbox" id="settings-animation" ${animation?'checked':''}><i></i></label>
  </section>
  <section class="card settings-card"><div class="settings-section-head"><span class="settings-icon">👤</span><div><h2>${x.profile}</h2><p>${x.profileHint}</p></div></div>
   <div class="settings-data-grid"><div><small>${x.email}</small><b>${active?esc(cloudSession.email||'—'):x.guestMode}</b></div><div><small>${active?x.cloud:x.guestMode}</small><b>${active?'✓':'—'}</b></div><div><small>${x.entries}</small><b>${db.entries.length}</b></div><div><small>${x.devices}</small><b>${db.devices.length}</b></div><div><small>${x.materials}</small><b>${db.strains.length}</b></div><div><small>${x.photos}</small><b>${db.photos.length}</b></div></div>
   <button class="btn soft" data-page="backup">${x.backup}</button>
  </section>
 </div>`;
 bindGlobal();
 v.querySelectorAll('[data-vaping-category]').forEach(input=>input.addEventListener('change',()=>{
  getAppSettings().vapingCategories[input.dataset.vapingCategory]=input.checked;put();
 }));
 $('#settings-language').addEventListener('change',event=>{window.MVA_I18N?.setLanguage(event.target.value);go('settings')});
 $('#settings-animation').addEventListener('change',event=>{localStorage.setItem('mva_login_animation',event.target.checked?'true':'false');const label=event.target.closest('.settings-option')?.querySelector('b');if(label)label.textContent=event.target.checked?x.on:x.off});
}

function more(v){const t=localeText;v.innerHTML=`${header(t('more.eyebrow'),t('more.title'),t('more.subtitle'),'')}<div class="grid cards2 more-grid"><button class="card more-link" data-page="settings"><span class="more-icon">⚙</span><b>${localeText("nav.settings")}</b><small>${localeText("settings.moreDescription")}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="devices"><span class="more-icon">▱</span><b>${t('page.devices.title')}</b><small>${t('more.devices')}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="gallery"><span class="more-icon">▧</span><b>${t('page.gallery.title')}</b><small>${t('more.gallery')}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="forum"><span class="more-icon">☷</span><b>Forum</b><small>Community & Austausch</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="guestbook"><span class="more-icon">✉</span><b>${t('guestbook.title')}</b><small>${t('more.guestbook')}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="learn"><span class="more-icon">◉</span><b>${t('page.learn.title')}</b><small>${t('more.learn')}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="controlledVaping"><span class="more-icon">◷</span><b>Kontrolliertes Vapen</b><small>Phase 1 · Bestandsaufnahme</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="backup"><span class="more-icon">⇧</span><b>${t('storage.sidebar.link').replace(' →','')}</b><small>${t('more.backup')}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="contact"><span class="more-icon">✉</span><b>${t('contact.title')}</b><small>${t('more.contact')}</small><span class="more-arrow">${t('more.open')}</span></button></div>`;bindGlobal()}
function home(v){const t=localeText;let last=[...db.entries].sort((a,b)=>compareDiaryEntries(b,a)).slice(0,3),xp=Number(db.game.xp)||0,level=Math.floor(xp/100)+1;v.innerHTML=`${header(t('home.eyebrow'),t('home.title'),t('home.subtitle'),'<button class="btn primary" data-action="new">＋ '+t('action.newEntry')+'</button>')}<div class="hero"><div><div class="eyebrow">${t('home.heroEyebrow')}</div><h2>${t('home.heroTitle')}</h2><p>${t('home.heroText')}</p><button class="btn" data-page="diary">${t('home.toDiary')}</button></div><div class="hero-stat"><strong>Level ${level}</strong><small>${xp} ${t('home.xp')} · ${db.game.coins||0} Coins</small></div></div><div class="grid stats">${card(t('home.stats.entries'),db.entries.length,t('home.stats.entriesSub'))}${card(t('home.stats.devices'),db.devices.length,t('home.stats.devicesSub'))}${card(t('home.stats.puffs'),db.entries.reduce((a,x)=>a+(Number(x.puffs)||0),0).toLocaleString(),t('home.stats.puffsSub'))}${card(t('home.stats.strains'),db.strains.length,t('home.stats.strainsSub'))}</div><div class="grid split"><section><div class="row section-head"><h3>${t('home.recent')}</h3><a data-page="diary">${t('home.all')}</a></div>${last.length?`<div class="list">${last.map(entryRow).join('')}</div>`:empty(t('home.emptyTitle'),t('home.emptyText'),'<button class="btn soft" data-action="new">'+t('home.create')+'</button>')}</section><section><div class="row section-head"><h3>${t('home.next')}</h3><a data-page="quests">${t('home.quests')}</a></div><div class="card"><span class="pill">${t('home.knowledge')}</span><h3 style="font:700 15px Manrope;margin:12px 0 7px">${t('home.learn')}</h3><p class="subheading">${t('home.learnSub')}</p><button class="btn soft" style="margin-top:16px" data-page="learn">${t('home.courses')}</button></div></section></div>`;bindGlobal()}
function entryRow(x){return `<div class="item"><div class="item-icon">${x.category==='heater'?'♨':x.category==='ecig'?'◉':'✳'}</div><div class="item-content"><b>${esc(x.category==='cigarette'?(x.brand||'Zigarette'):(x.device||names[x.category]||'Session'))}</b><small>${esc(x.date||'')} · ${esc(x.strain||x.material||'Keine Sorte angegeben')} ${x.puffs?'· '+esc(x.puffs)+' Züge':''}</small></div><span class="pill">${esc(names[x.category]||x.category||'Session')}</span></div>`}
function diary(v){
 const searchValue=$('#search')?.value||'',deviceValue=$('#df')?.value||'',categoryValue=$('#dc')?.value||'';
 let items=[...db.entries].filter(x=>{
  const q=searchValue.toLowerCase();
  return(!q||Object.values(x).join(' ').toLowerCase().includes(q))&&(!deviceValue||(x.device||x.brand)===deviceValue)&&(!categoryValue||x.category===categoryValue);
 }).sort((a,b)=>(sortMode==='desc'?-1:1)*compareDiaryEntries(a,b));
 const totalPages=Math.max(1,Math.ceil(items.length/DIARY_PAGE_SIZE));
 diaryCurrentPage=Math.min(Math.max(1,diaryCurrentPage),totalPages);
 const startIndex=(diaryCurrentPage-1)*DIARY_PAGE_SIZE;
 const visibleItems=items.slice(startIndex,startIndex+DIARY_PAGE_SIZE);
 const firstEntry=items.length?startIndex+1:0,lastEntry=Math.min(startIndex+DIARY_PAGE_SIZE,items.length);
 const pageButtons=[];
 if(totalPages<=7){for(let n=1;n<=totalPages;n++)pageButtons.push(n)}
 else{
  pageButtons.push(1);
  if(diaryCurrentPage>3)pageButtons.push('…');
  for(let n=Math.max(2,diaryCurrentPage-1);n<=Math.min(totalPages-1,diaryCurrentPage+1);n++)pageButtons.push(n);
  if(diaryCurrentPage<totalPages-2)pageButtons.push('…');
  pageButtons.push(totalPages);
 }
 const pagination=items.length>DIARY_PAGE_SIZE?`<div class="diary-pagination" aria-label="Seitennavigation"><div class="diary-page-summary">${firstEntry}–${lastEntry} von ${items.length} Einträgen · Seite ${diaryCurrentPage} von ${totalPages}</div><div class="diary-page-buttons"><button class="btn small" data-diary-page="${diaryCurrentPage-1}" ${diaryCurrentPage===1?'disabled':''}>Zurück</button>${pageButtons.map(n=>n==='…'?'<span class="diary-page-ellipsis">…</span>':`<button class="btn small ${n===diaryCurrentPage?'primary':''}" data-diary-page="${n}" ${n===diaryCurrentPage?'aria-current="page"':''}>${n}</button>`).join('')}<button class="btn small" data-diary-page="${diaryCurrentPage+1}" ${diaryCurrentPage===totalPages?'disabled':''}>Weiter</button></div></div>`:'<div class="diary-page-summary">'+(items.length?`Alle ${items.length} Einträge`:'')+'</div>';
 v.innerHTML=`${header(localeText('page.diary.eyebrow'),localeText('page.diary.title'),localeText(storageMode==='cloud'?'page.diary.description.cloud':'page.diary.description.local'),`<button class="btn primary" data-action="new">${localeText('action.newEntry')}</button>`)}<div class="toolbar"><input class="field" type="search" id="search" placeholder="${localeText('diary.search')}" value="${esc(searchValue)}"><select class="field" id="df"><option value="">${localeText('diary.allDevices')}</option>${db.devices.map(d=>`<option ${deviceValue===d.name?'selected':''}>${esc(d.name)}</option>`).join('')}</select><select class="field" id="dc"><option value="">${localeText('diary.allCategories')}</option>${Object.entries(names).map(([k,n])=>`<option value="${k}" ${categoryValue===k?'selected':''}>${n}</option>`).join('')}</select><select class="field" id="sort"><option value="desc" ${sortMode==='desc'?'selected':''}>${localeText('diary.newest')}</option><option value="asc" ${sortMode==='asc'?'selected':''}>${localeText('diary.oldest')}</option></select></div><div class="list">${visibleItems.length?visibleItems.map(x=>`<div class="card"><div class="row"><div><b>${esc(x.category==='cigarette'?(x.brand||'Zigarette'):(x.device||names[x.category]||'Session'))}</b><div class="tagline">${esc(x.date||'')} · ${esc(x.time||'')} · ${esc(names[x.category]||x.category||'')}</div></div><div class="inline-actions"><button class="btn small" data-edit="${esc(x.id)}">${localeText('action.edit')}</button><button class="btn small" data-delete-entry="${esc(x.id)}">${localeText('action.delete')}</button></div></div><div class="tagline">${[x.strain,x.puffs&&`${x.puffs} Züge`,x.duration&&`${x.duration} min`,x.location,x.category==='vaporizer'&&x.temp&&`${x.temp}°C`,x.category==='ecig'&&x.wattage&&`${x.wattage} W`,x.category==='ecig'&&x.nicotine&&`${x.nicotine} mg/ml`,x.category==='ecig'&&x.vg&&`VG ${x.vg}%`,x.category==='ecig'&&x.pg&&`PG ${x.pg}%`,x.pure==='yes'?'Pur':x.pure==='no'?'Gemischt':''].filter(Boolean).map(esc).join(' · ')}</div>${x.notes?`<p class="subheading" style="margin-top:10px">${esc(x.notes)}</p>`:''}</div>`).join(''):empty(localeText('diary.noResults'),localeText('diary.noResultsHint'))}</div>${pagination}`;
 ['search','df','dc','sort'].forEach(k=>$('#'+k)?.addEventListener(k==='search'?'input':'change',()=>{
  if(k==='sort')sortMode=$('#sort').value;
  diaryCurrentPage=1;
  const pos=$('#search')?.value;
  diary(v);
  if(k==='search'&&pos){$('#search').focus();$('#search').setSelectionRange(pos.length,pos.length)}
 }));
 v.querySelectorAll('[data-diary-page]').forEach(button=>button.addEventListener('click',()=>{
  const next=Number(button.dataset.diaryPage);
  if(Number.isInteger(next)&&next>=1&&next<=totalPages&&next!==diaryCurrentPage){diaryCurrentPage=next;diary(v);v.scrollIntoView({behavior:'smooth',block:'start'})}
 }));
 bindGlobal();
}
function openModal(title,content,saveLabel=localeText('dialog.save'),fn){const t=localeText;$('#modal-root').innerHTML=`<div class="modal-backdrop"><div class="modal"><div class="row"><h2>${title}</h2><button type="button" class="btn small" data-close>${t('dialog.close')}</button></div>${content}<div id="modal-save-feedback" class="tagline" role="status" aria-live="polite" style="display:none;margin:12px 0;padding:10px;border-radius:10px;white-space:pre-wrap"></div><div class="modal-foot"><button type="button" class="btn" data-close>${t('dialog.cancel')}</button><button type="button" class="btn primary" id="modal-save">${saveLabel}</button></div></div></div>`;$('#modal-root').querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#modal-root').innerHTML='');$('#modal-root').querySelector('.modal-backdrop').onclick=e=>{if(e.target.classList.contains('modal-backdrop'))$('#modal-root').innerHTML=''};const saveButton=$('#modal-save');saveButton.onclick=async event=>{event.preventDefault();if(saveButton.disabled)return;saveButton.disabled=true;const originalLabel=saveButton.textContent;saveButton.textContent='Speichert …';saveButton.setAttribute('aria-busy','true');const feedback=$('#modal-save-feedback');if(feedback){feedback.style.display='block';feedback.textContent='Speichervorgang wird gestartet …';feedback.dataset.error='false'}try{await fn()}catch(error){console.error('Dialog-Speichern fehlgeschlagen:',error);if(feedback){feedback.style.display='block';feedback.dataset.error='true';feedback.textContent='Speichern fehlgeschlagen. Deine Änderung ist noch nicht bestätigt.\n\n'+(error?.message||'Unbekannter Fehler')+'\n\nBitte das Fenster geöffnet lassen und die Fehlermeldung notieren.'}toast(error?.message||'Änderung konnte nicht gespeichert werden.')}finally{if(saveButton.isConnected){saveButton.disabled=false;saveButton.textContent=originalLabel;saveButton.removeAttribute('aria-busy')}}}}

function selectDevice(cat,selected=''){let opts=db.devices.filter(x=>!cat||x.category===cat);return `<option value="">${localeText('device.selectOptional')}</option>${opts.map(d=>`<option value="${esc(d.name)}" ${d.name===selected?'selected':''}>${esc(d.name)}</option>`).join('')}`}
function entryForm(e={}){const t=localeText,editing=!!e.id,lang=window.MVA_I18N?.getLanguage?.()||'de';const fillQuestion={de:'Vaporizer gefüllt mit …',en:'Vaporizer filled with …',fr:'Vaporisateur rempli avec …'},medicalFill={de:'Medizinischem Cannabis',en:'Medical cannabis',fr:'Cannabis médical'},herbsFill={de:'Kräutern',en:'Herbs',fr:'Herbes'};openModal(t(editing?'form.editEntry':'form.newSession'),`<div class="formgrid"><div class="formrow"><label>${t('form.date')}</label><input class="field" id="f-date" type="date" value="${esc(e.date||now())}"></div><div class="formrow"><label>${t('form.time')}</label><input class="field" id="f-time" type="time" value="${esc(e.time||new Date().toTimeString().slice(0,5))}"></div><div class="formrow"><label>${t('form.deviceClass')}</label><select class="field" id="f-cat">${Object.entries(names).filter(([k])=>isCategoryEnabled(k)||k===(e.category||'vaporizer')).map(([k,n])=>`<option value="${k}" ${e.category===k?'selected':''}>${n}</option>`).join('')}</select></div><div class="formrow" id="f-device-row"><label>${t('form.device')}</label><select class="field" id="f-device">${selectDevice(e.category||'vaporizer',e.device||'')}</select></div><div class="formrow" id="f-vaporizer-fill-row"><label for="f-vaporizer-fill">${fillQuestion[lang]||fillQuestion.de}</label><input type="hidden" id="f-vaporizer-fill" value="${e.vaporizerFill==='herbs'?'herbs':'medical'}"><div class="mva-fill-switch" role="group" aria-label="${fillQuestion[lang]||fillQuestion.de}" style="display:flex;gap:6px;padding:4px;border:1px solid var(--border);border-radius:12px;background:var(--surface-2,rgba(127,127,127,.10))"><button type="button" class="btn small ${e.vaporizerFill==='herbs'?'':'primary'}" data-vaporizer-fill="medical" aria-pressed="${e.vaporizerFill==='herbs'?'false':'true'}" style="flex:1">${medicalFill[lang]||medicalFill.de}</button><button type="button" class="btn small ${e.vaporizerFill==='herbs'?'primary':''}" data-vaporizer-fill="herbs" aria-pressed="${e.vaporizerFill==='herbs'?'true':'false'}" style="flex:1">${herbsFill[lang]||herbsFill.de}</button></div></div><div class="formrow" id="f-material-row"><label id="f-material-label">${t('form.strain')}</label><input class="field" id="f-strain" list="strains-list" value="${esc(e.strain||'')}" placeholder="${t('form.strainPlaceholder')}"><div id="f-herb-suggestions" class="herb-autocomplete" role="listbox" aria-label="Passende Kräuter" style="display:none;max-height:220px;overflow:auto;margin-top:6px;padding:4px;border:1px solid var(--line);border-radius:10px;background:var(--card)"></div><datalist id="strains-list">${(e.category==='vaporizer'&&e.vaporizerFill==='herbs'?(window.MVA_PLANT_CATALOG||[]).map(r=>r[0]).sort((a,b)=>String(a).localeCompare(String(b),lang,{sensitivity:'base'})):db.strains.filter(s=>!s.category||s.category===(e.category||'vaporizer')).map(s=>s.name)).map(name=>`<option>${esc(name)}</option>`).join('')}</datalist></div><div class="formrow"><label>${t('form.puffs')}</label><input class="field" id="f-puffs" type="number" min="0" value="${esc(e.puffs||'')}" placeholder="${t('form.optional')}"></div><div class="formrow"><label>${t('form.duration')}</label><input class="field" id="f-duration" type="number" min="0" value="${esc(e.duration||'')}"></div><div class="formrow" id="f-temp-row"><label>${t('form.temperature')}</label><input class="field" id="f-temp" type="number" value="${esc(e.temp||'')}"></div><div class="formrow" id="f-wattage-row"><label for="f-wattage">Leistung · Watt</label><input class="field" id="f-wattage" type="number" min="0" step="0.1" value="${esc(e.wattage||'')}"></div><div class="formrow" id="f-nicotine-row"><label for="f-nicotine">Nikotingehalt · mg/ml</label><input class="field" id="f-nicotine" type="number" min="0" step="0.1" value="${esc(e.nicotine||'')}"></div><div class="formrow" id="f-vg-row"><label for="f-vg">VG · %</label><input class="field" id="f-vg" type="number" min="0" max="100" step="0.1" value="${esc(e.vg||'')}"></div><div class="formrow" id="f-pg-row"><label for="f-pg">PG · %</label><input class="field" id="f-pg" type="number" min="0" max="100" step="0.1" value="${esc(e.pg||'')}"></div><div class="formrow" id="f-brand-row"><label for="f-brand">Zigarettenmarke</label><input class="field" id="f-brand" value="${esc(e.brand||'')}"></div><div class="formrow" id="f-pure-row"><label for="f-pure">Rauchst du pur?</label><select class="field" id="f-pure"><option value="">Bitte auswählen</option><option value="yes" ${e.pure==='yes'?'selected':''}>Ja, pur</option><option value="no" ${e.pure==='no'?'selected':''}>Nein, gemischt</option></select></div><div class="formrow"><label>${t('form.location')}</label><input class="field" id="f-location" value="${esc(e.location||'')}"></div><div class="formrow"><label>${t('form.taste')}</label><select class="field" id="f-taste"><option value="">${t('form.noInfo')}</option>${[1,2,3,4,5].map(n=>`<option ${String(e.taste)===String(n)?'selected':''}>${n}</option>`).join('')}</select></div><div class="formrow full"><label>${t('form.notes')}</label><textarea class="field" id="f-notes">${esc(e.notes||'')}</textarea></div><div class="formrow full" id="f-save-strain-row"><label><input type="checkbox" id="f-save-strain" style="width:auto" checked> ${t('form.autoSaveStrain')}</label></div></div>`,t(editing?'form.saveChanges':'form.saveEntry'),async()=>{let selectedDate=$('#f-date').value;if(!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)||Number.isNaN(new Date(selectedDate+'T12:00:00').getTime()))throw Error('Bitte ein gültiges Datum auswählen.');let x={...(e||{}),id:e.id||id(),date:selectedDate,time:$('#f-time').value,category:$('#f-cat').value,vaporizerFill:$('#f-cat').value==='vaporizer'?$('#f-vaporizer-fill').value:'',device:$('#f-device').value,strain:$('#f-strain').value.trim(),puffs:$('#f-puffs').value,duration:$('#f-duration').value,temp:$('#f-temp').value,wattage:$('#f-wattage').value,nicotine:$('#f-nicotine').value,vg:$('#f-vg').value,pg:$('#f-pg').value,liquid:'',brand:$('#f-brand').value.trim(),pure:$('#f-pure').value,location:$('#f-location').value,taste:$('#f-taste').value,notes:$('#f-notes').value.trim()};let puffMatch=x.notes.match(/(?:anzahl\s*)?(?:züge|zuege|puffs?)\s*[:=]?\s*(\d+)/i);if(!x.puffs&&puffMatch)x.puffs=puffMatch[1];if(x.category==='cigarette')x.device='';if(x.category==='joint')x.device='';if(x.category!=='vaporizer')x.temp='';if(x.category!=='ecig'){x.wattage='';x.nicotine='';x.vg='';x.pg=''}if(!['joint','bong'].includes(x.category))x.pure='';if(x.category!=='cigarette')x.brand='';if(x.category==='ecig')x.liquid=x.strain;if(x.category==='heater')x.stickType=x.strain;if(x.strain&&!(x.category==='vaporizer'&&x.vaporizerFill==='herbs')){const materialName=x.strain.trim().toLocaleLowerCase();let materialRecord=db.strains.find(s=>String(s.name||'').trim().toLocaleLowerCase()===materialName&&(!s.category||s.category===x.category));if($('#f-save-strain').checked){if(materialRecord){if(!materialRecord.category)materialRecord.category=x.category}else{materialRecord={id:id(),name:x.strain,category:x.category};db.strains.push(materialRecord)}}x.materialId=materialRecord?.id||''}else x.materialId='';if(e.id)db.entries=db.entries.map(a=>a.id===e.id?x:a);else{db.entries.unshift(x);db.game.xp+=3}if(storageMode==='cloud'){clearTimeout(cloudTimer);setCloudStatus('Tagebucheintrag wird in der Cloud gespeichert …');await cloudWrite()}else put();$('#modal-root').innerHTML='';if(!e.id)diaryCurrentPage=1;render();toast(t('form.entrySaved'))});const herbNames=()=>Array.from(new Set((window.MVA_PLANT_CATALOG||[]).map(r=>String(r[0]||'').trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b,lang,{sensitivity:'base'}));const renderHerbSuggestions=()=>{const box=$('#f-herb-suggestions'),input=$('#f-strain');if(!box||!input)return;const query=input.value.trim();if($('#f-cat').value!=='vaporizer'||$('#f-vaporizer-fill')?.value!=='herbs'||!query){box.innerHTML='';box.style.display='none';return}const matches=herbNames().filter(name=>name.toLocaleLowerCase(lang).startsWith(query.toLocaleLowerCase(lang)));box.innerHTML=matches.map(name=>`<button type="button" class="btn small" role="option" aria-selected="false" data-herb-choice="${esc(name)}" style="display:block;width:100%;text-align:left;margin:2px 0">${esc(name)}</button>`).join('');box.style.display=matches.length?'block':'none'};const updateMaterialOptions=()=>{const cat=$('#f-cat').value,fill=$('#f-vaporizer-fill')?.value||'medical';const options=cat==='vaporizer'&&fill==='herbs'?herbNames():db.strains.filter(s=>!s.category||s.category===cat).map(s=>s.name);$('#strains-list').innerHTML=options.map(name=>`<option>${esc(name)}</option>`).join('');renderHerbSuggestions()};const updateMaterialLabel=()=>{const lang=window.MVA_I18N?.getLanguage?.()||'de';const labels={vaporizer:{de:'Sorte / Material',en:'Strain / material',fr:'Variété / matériau'},ecig:{de:'Liquid / Aroma',en:'E-liquid / flavour',fr:'E-liquide / arôme'},heater:{de:'Sticksorte',en:'Stick type',fr:'Type de stick'},cigarette:{de:'Sorte der Marke',en:'Brand variant',fr:'Variante de marque'},joint:{de:'Grassorte',en:'Cannabis strain',fr:'Variété de cannabis'},bong:{de:'Grassorte',en:'Cannabis strain',fr:'Variété de cannabis'}};const cat=$('#f-cat').value;const fill=$('#f-vaporizer-fill')?.value||'medical';const label=$('#f-material-label');if(label)label.textContent=cat==='vaporizer'&&fill==='herbs'?({de:'Kraut / eigene Angabe',en:'Herb / custom entry',fr:'Herbe / saisie libre'}[lang]||'Kraut / eigene Angabe'):(labels[cat]?.[lang]||labels.vaporizer[lang]);const show=(id,yes)=>{const el=$('#'+id);if(el)el.style.display=yes?'':'none'};show('f-vaporizer-fill-row',cat==='vaporizer');show('f-save-strain-row',!(cat==='vaporizer'&&fill==='herbs'));show('f-device-row',!['joint','cigarette'].includes(cat));show('f-brand-row',cat==='cigarette');show('f-temp-row',cat==='vaporizer');['f-wattage-row','f-nicotine-row','f-vg-row','f-pg-row'].forEach(id=>show(id,cat==='ecig'));show('f-pure-row',['joint','bong'].includes(cat));};updateMaterialOptions();updateMaterialLabel();$('#f-strain').addEventListener('input',renderHerbSuggestions);$('#f-herb-suggestions').addEventListener('click',event=>{const choice=event.target.closest('[data-herb-choice]');if(!choice)return;$('#f-strain').value=choice.dataset.herbChoice;$('#f-herb-suggestions').innerHTML='';$('#f-herb-suggestions').style.display='none'});$('#f-strain').addEventListener('focus',renderHerbSuggestions);$('#modal-root').querySelectorAll('[data-vaporizer-fill]').forEach(button=>button.onclick=()=>{const value=button.dataset.vaporizerFill;$('#f-vaporizer-fill').value=value;$('#modal-root').querySelectorAll('[data-vaporizer-fill]').forEach(item=>{const active=item.dataset.vaporizerFill===value;item.classList.toggle('primary',active);item.setAttribute('aria-pressed',String(active))});updateMaterialOptions();updateMaterialLabel()});$('#f-cat').onchange=()=>{$('#f-device').innerHTML=selectDevice($('#f-cat').value);updateMaterialLabel();updateMaterialOptions()}}

function strains(v){v.innerHTML=`${header(localeText('page.strains.eyebrow'),localeText('page.strains.title'),localeText('page.strains.description'),`<button class="btn primary" data-action="new-strain">${localeText('action.addStrain')}</button>`)}<div class="toolbar"><input class="field" id="strain-search" placeholder="${localeText('strains.search')}"></div><div class="grid cards2" id="strain-list">${strainCards()}</div>`;$('#strain-search').oninput=()=>$('#strain-list').innerHTML=strainCards($('#strain-search').value);bindGlobal()}
function strainCards(q=''){let a=db.strains.filter(s=>!q||JSON.stringify(s).toLowerCase().includes(q.toLowerCase()));return a.length?a.map(s=>`<div class="card"><div class="row"><div><span class="pill">${esc(s.category||'SAMMLUNG')}</span><h3 style="font:700 16px Manrope;margin:12px 0 3px">${esc(s.name)}</h3><div class="tagline">${esc(s.manufacturer||'Hersteller nicht angegeben')}</div></div><div class="inline-actions"><button class="btn small" data-edit-strain="${s.id}">Bearbeiten</button><button class="btn small" data-del-strain="${s.id}">Löschen</button></div></div>${s.notes?`<p class="subheading">${esc(s.notes)}</p>`:''}</div>`).join(''):empty('Noch keine Sorten','Füge deine erste Sorte hinzu.')}
function strainForm(s={}){const t=localeText;const categoryOptions=Object.entries(names).map(([key,label])=>`<option value="${key}" ${s.category===key?'selected':''}>${label}</option>`).join('');const legacyCategory=s.category&&!names[s.category]? `<option value="${esc(s.category)}" selected>Bisherige Angabe: ${esc(s.category)}</option>`:'';openModal(t(s.id?'strain.edit':'strain.add'),`<div class="formgrid"><div class="formrow full"><label>${t('strain.category')}</label><select class="field" id="s-cat"><option value="">Kategorie auswählen …</option>${categoryOptions}${legacyCategory}</select></div><div class="formrow"><label>${t('strain.name')}</label><input class="field" id="s-name" value="${esc(s.name||'')}"></div><div class="formrow"><label>${t('strain.manufacturer')}</label><input class="field" id="s-maker" value="${esc(s.manufacturer||'')}"></div><div class="formrow full"><label>${t('form.notes')}</label><textarea class="field" id="s-notes">${esc(s.notes||'')}</textarea></div></div>`,t('strain.save'),()=>{let x={id:s.id||id(),name:$('#s-name').value.trim(),manufacturer:$('#s-maker').value.trim(),category:$('#s-cat').value,notes:$('#s-notes').value.trim()};if(!x.category)return toast('Bitte zuerst eine Kategorie auswählen.');if(!x.name)return toast(t('strain.nameRequired'));if(s.id)db.strains=db.strains.map(a=>a.id===s.id?x:a);else db.strains.push(x);put();$('#modal-root').innerHTML='';render()})}

function devices(v){v.innerHTML=`${header(localeText('page.devices.eyebrow'),localeText('page.devices.title'),localeText('page.devices.description'),`<button class="btn primary" data-action="new-device">${localeText('action.addDevice')}</button>`)}<div class="grid cards2">${db.devices.length?db.devices.map((d,i)=>`<div class="card"><div class="photo device-photo">${d.photo?`<img data-mva-device-photo="${i}" src="${typeof d.photo==='string'?esc(d.photo):''}" alt="${esc(d.name)}">`:'▱'}</div><div class="row" style="margin-top:13px"><div><span class="pill">${names[d.category]||'Gerät'}</span><h3 style="font:700 15px Manrope;margin:8px 0 4px">${esc(d.name)}</h3></div><div class="inline-actions"><button class="btn small" data-edit-device="${esc(d.name)}">${localeText('action.edit')}</button><button class="btn small" data-del-device="${esc(d.name)}">${localeText('action.delete')}</button></div></div><p class="subheading">${esc(d.description||localeText('devices.noDescription'))}</p>${d.manualData?`<div class="manual-card-action"><span class="pill">PDF · ${localeText('device.manualAttached')}</span><button class="btn small soft" data-open-manual="${esc(d.name)}">▤ ${localeText('device.manualOpen')}</button></div>`:''}</div>`).join(''):empty(localeText('devices.none'),localeText('devices.noneHint'))}</div>`;bindGlobal();v.querySelectorAll('[data-mva-device-photo]').forEach(img=>resolveMediaImage(img,db.devices[Number(img.dataset.mvaDevicePhoto)]?.photo))}
function deviceForm(d={}){const t=localeText;pendingPhoto=null;openModal(t(d.name?'device.edit':'device.add'),`<div class="formgrid"><div class="formrow"><label>${t('device.name')}</label><input class="field" id="d-name" value="${esc(d.name||'')}"></div><div class="formrow"><label>${t('form.deviceClass')}</label><select class="field" id="d-cat">${Object.entries(names).map(([k,n])=>`<option value="${k}" ${d.category===k?'selected':''}>${n}</option>`).join('')}</select></div><div class="formrow full"><label>${t('device.description')}</label><textarea class="field" id="d-desc">${esc(d.description||'')}</textarea></div><div class="formrow full"><label>${t('device.photo')}</label><input class="field" type="file" id="d-photo" accept="image/*"><small class="muted">${t('device.photoHint')}</small>${d.photo?`<div class="photo"><img data-mva-device-form-photo src="${typeof d.photo==='string'?esc(d.photo):''}"></div>`:''}</div><div class="formrow full manual-upload"><label for="d-manual">${t('device.manualLabel')}</label><input class="field" type="file" id="d-manual" accept="application/pdf,.pdf"><small class="muted">${t('device.manualHint')}</small>${d.manualName?`<p class="manual-current">📄 ${esc(d.manualName)}</p><label class="manual-remove"><input type="checkbox" id="d-manual-remove"> ${t('device.manualRemove')}</label>`:''}</div></div>`,t('device.save'),()=>{let name=$('#d-name').value.trim();if(!name)return toast(t('device.nameRequired'));let manualFile=$('#d-manual').files[0],removeManual=$('#d-manual-remove')?.checked;if(manualFile&&manualFile.size>3*1024*1024)return toast(t('device.manualTooLarge'));if(manualFile&&!(/\.pdf$/i.test(manualFile.name)||manualFile.type==='application/pdf'))return toast(t('device.manualPdfOnly'));const saveD=(photo,manualData,manualName)=>{let x={...d,name,category:$('#d-cat').value,description:$('#d-desc').value.trim(),photo:photo||d.photo||'',manualData:removeManual?'':manualData||d.manualData||'',manualName:removeManual?'':manualName||d.manualName||''};if(d.name)db.devices=db.devices.map(a=>a.name===d.name?x:a);else db.devices.push(x);put();$('#modal-root').innerHTML='';render()};const saveManual=photo=>{if(removeManual)return saveD(photo,'','');if(!manualFile)return saveD(photo,null,null);let reader=new FileReader();reader.onerror=()=>toast(t('device.manualReadError'));reader.onload=()=>{let data=String(reader.result||'');if(!data.startsWith('data:application/pdf;base64,'))return toast(t('device.manualPdfOnly'));const signature=atob(data.split(',')[1]).slice(0,5);if(signature!=='%PDF-')return toast(t('device.manualPdfOnly'));saveD(photo,data,manualFile.name)};reader.readAsDataURL(manualFile)};let photoFile=$('#d-photo').files[0];if(photoFile)compress(photoFile,saveManual);else saveManual(null)});if(isCloudMediaReference(d.photo)){const preview=$('#modal-root [data-mva-device-form-photo]');if(preview)resolveMediaImage(preview,d.photo)}}
async function openDeviceManual(deviceName){
 const d=db.devices.find(x=>x.name===deviceName);
 if(!d?.manualData)return toast(localeText('device.manualMissing'));
 const root=$('#modal-root');let pdfDoc=null,renderTask=null,pageNumber=1,closed=false,bytes,zoom=1;
 try{const blob=await mediaValueAsBlob(d.manualData);bytes=new Uint8Array(await blob.arrayBuffer());if(!bytes.length)throw Error('PDF-Daten fehlen')}catch(error){console.error(error);return toast(localeText('device.manualReadError'))}
 root.innerHTML=`<div class="modal-backdrop manual-backdrop"><section class="modal manual-modal" role="dialog" aria-modal="true" aria-label="${esc(d.manualName||localeText('device.manualTitle'))}"><div class="row manual-viewer-head"><div><h2>${esc(d.manualName||localeText('device.manualTitle'))}</h2><p class="tagline">${esc(d.name)}</p></div><button class="btn small" type="button" data-manual-close>${localeText('dialog.close')}</button></div><div class="manual-page-controls"><div class="manual-zoom-controls"><button class="btn soft small" type="button" data-manual-zoom-out aria-label="${localeText('device.manualZoomOut')}">−</button><button class="btn soft small" type="button" data-manual-zoom-reset>100 %</button><button class="btn soft small" type="button" data-manual-zoom-in aria-label="${localeText('device.manualZoomIn')}">＋</button></div><button class="btn soft small" type="button" data-manual-prev disabled>‹ ${localeText('device.manualPrevious')}</button><span class="manual-page-count" data-manual-count aria-live="polite">${localeText('device.manualLoading')}</span><button class="btn soft small" type="button" data-manual-next disabled>${localeText('device.manualNext')} ›</button></div><div class="manual-scroll-area"><canvas class="manual-page-canvas" aria-label="${localeText('device.manualPage')}"></canvas></div><p class="manual-viewer-status" data-manual-status role="status" aria-live="polite"></p></section></div>`;
 const canvas=root.querySelector('.manual-page-canvas'),ctx=canvas.getContext('2d'),zoomOut=root.querySelector('[data-manual-zoom-out]'),zoomIn=root.querySelector('[data-manual-zoom-in]'),zoomReset=root.querySelector('[data-manual-zoom-reset]'),prev=root.querySelector('[data-manual-prev]'),next=root.querySelector('[data-manual-next]'),count=root.querySelector('[data-manual-count]'),status=root.querySelector('[data-manual-status]'),area=root.querySelector('.manual-scroll-area');
 const updateControls=()=>{count.textContent=localeText('device.manualPageCount',{current:pageNumber,total:pdfDoc.numPages});prev.disabled=pageNumber<=1;next.disabled=pageNumber>=pdfDoc.numPages;zoomOut.disabled=zoom<=.5;zoomIn.disabled=zoom>=3;zoomReset.textContent=Math.round(zoom*100)+' %'};
 async function showPage(n){if(closed||!pdfDoc)return;pageNumber=Math.max(1,Math.min(pdfDoc.numPages,n));if(renderTask){try{renderTask.cancel()}catch{}}const page=await pdfDoc.getPage(pageNumber);if(closed)return;const base=page.getViewport({scale:1}),available=Math.max(240,area.clientWidth-28),fit=Math.min(2,available/base.width)*zoom,output=window.devicePixelRatio||1,viewport=page.getViewport({scale:fit*output});canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);canvas.style.width=Math.ceil(base.width*fit)+'px';canvas.style.height=Math.ceil(base.height*fit)+'px';updateControls();area.scrollTop=0;area.scrollLeft=0;try{renderTask=page.render({canvasContext:ctx,viewport});await renderTask.promise;renderTask=null}catch(error){if(error?.name!=='RenderingCancelledException')throw error}}
 const onKey=e=>{if(closed)return;if(e.key==='ArrowLeft'&&!prev.disabled){showPage(pageNumber-1).catch(err=>{console.error(err);status.textContent=localeText('device.manualReadError')});e.preventDefault()}else if(e.key==='ArrowRight'&&!next.disabled){showPage(pageNumber+1).catch(err=>{console.error(err);status.textContent=localeText('device.manualReadError')});e.preventDefault()}};
 const close=()=>{if(closed)return;closed=true;if(renderTask){try{renderTask.cancel()}catch{}}if(pdfDoc)pdfDoc.destroy().catch(()=>{});root.innerHTML='';document.removeEventListener('keydown',onKey)};
 root.querySelector('[data-manual-close]').onclick=close;root.querySelector('.manual-backdrop').onclick=e=>{if(e.target.classList.contains('manual-backdrop'))close()};
 zoomOut.onclick=()=>{zoom=Math.max(.5,Math.round((zoom-.25)*100)/100);showPage(pageNumber).catch(err=>{console.error(err);status.textContent=localeText('device.manualReadError')})};zoomIn.onclick=()=>{zoom=Math.min(3,Math.round((zoom+.25)*100)/100);showPage(pageNumber).catch(err=>{console.error(err);status.textContent=localeText('device.manualReadError')})};zoomReset.onclick=()=>{zoom=1;showPage(pageNumber).catch(err=>{console.error(err);status.textContent=localeText('device.manualReadError')})};prev.onclick=()=>showPage(pageNumber-1).catch(err=>{console.error(err);status.textContent=localeText('device.manualReadError')});next.onclick=()=>showPage(pageNumber+1).catch(err=>{console.error(err);status.textContent=localeText('device.manualReadError')});document.addEventListener('keydown',onKey);
 (async()=>{try{const pdfjs=await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs');pdfjs.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';pdfDoc=await pdfjs.getDocument({data:bytes}).promise;if(closed){pdfDoc.destroy();return}updateControls();await showPage(1)}catch(error){console.error(error);if(!closed){status.textContent=localeText('device.manualReadError');count.textContent=localeText('device.manualUnavailable')}}})();
}
function compress(file,done){
 let reader=new FileReader();
 reader.onerror=()=>toast('Foto konnte nicht gelesen werden.');
 reader.onload=()=>{
  let image=new Image();
  image.onerror=()=>toast('Bildformat konnte nicht verarbeitet werden.');
  image.onload=()=>{
   try{
    const canvas=document.createElement('canvas'),context=canvas.getContext('2d');
    if(!context)throw Error('Canvas nicht verfügbar');
    const initialScale=Math.min(1,900/Math.max(image.width,image.height));
    canvas.width=Math.max(1,Math.round(image.width*initialScale));
    canvas.height=Math.max(1,Math.round(image.height*initialScale));
    context.drawImage(image,0,0,canvas.width,canvas.height);
    let src='';
    for(let attempt=0;attempt<8;attempt++){
     const quality=attempt===0?.62:Math.max(.38,.58-attempt*.035);
     src=canvas.toDataURL('image/jpeg',quality);
     if(src.length<=700000)break;
     if(Math.max(canvas.width,canvas.height)<=320)break;
     const scale=.82;
     const next=document.createElement('canvas');
     next.width=Math.max(1,Math.round(canvas.width*scale));
     next.height=Math.max(1,Math.round(canvas.height*scale));
     const nextContext=next.getContext('2d');
     if(!nextContext)throw Error('Canvas nicht verfügbar');
     nextContext.drawImage(canvas,0,0,next.width,next.height);
     canvas.width=next.width;canvas.height=next.height;
     context.clearRect(0,0,canvas.width,canvas.height);
     context.drawImage(next,0,0);
    }
    if(!src||src.length>700000){toast('Foto konnte nicht ausreichend verkleinert werden. Bitte ein kleineres Bild auswählen.');return}
    done(src);
   }catch(error){console.error(error);toast('Foto konnte nicht komprimiert werden. Bitte ein anderes Bild auswählen.')}
  };
  image.src=reader.result;
 };
 reader.readAsDataURL(file);
}
function gallery(v){const galleryDescription=localeText('page.gallery.description');v.innerHTML=`${header(localeText('page.gallery.eyebrow'),localeText('page.gallery.title'),galleryDescription,`<button class="btn primary" data-action="new-photo">${localeText('action.addPhoto')}</button>`)}<div class="grid gallery-grid">${db.photos.length?db.photos.map((p,i)=>`<article class="card gallery-card"><button class="gallery-thumb" type="button" data-gallery-open="${i}" aria-label="${localeText('gallery.openPhoto',{number:i+1})}"><img data-mva-gallery-photo="${i}" src="${typeof p.src==='string'?esc(p.src):''}" alt="${esc(p.title||localeText('gallery.moment'))}"></button><div class="row gallery-meta"><div class="gallery-caption"><b>${esc(p.title||localeText('gallery.moment'))}</b><div class="tagline">${esc(p.date||'')} · ${esc(p.device||p.entry||localeText('gallery.general'))}</div></div><button class="btn small" data-del-photo="${p.id}" aria-label="${localeText('gallery.deletePhoto')}">${localeText('action.delete')}</button></div></article>`).join(''):empty(localeText('gallery.empty'),localeText('gallery.emptyHint'))}</div>`;bindGlobal();v.querySelectorAll('[data-mva-gallery-photo]').forEach(img=>resolveMediaImage(img,db.photos[Number(img.dataset.mvaGalleryPhoto)]?.src))}
function showGalleryLightbox(){if(!db.photos.length)return;galleryIndex=(galleryIndex+db.photos.length)%db.photos.length;const p=db.photos[galleryIndex];$('#modal-root').innerHTML=`<div class="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Foto-Großansicht"><div class="gallery-lightbox-panel"><div class="gallery-lightbox-top"><span>${esc(p.title||'Moment')}</span><button type="button" class="gallery-lightbox-close" data-lightbox-close aria-label="Großansicht schließen">×</button></div><div class="gallery-lightbox-stage"><button type="button" class="gallery-lightbox-nav" data-lightbox-prev aria-label="Vorheriges Bild">‹</button><img data-mva-lightbox-photo src="${typeof p.src==='string'?esc(p.src):''}" alt="${esc(p.title||'Galeriefoto')}"><button type="button" class="gallery-lightbox-nav" data-lightbox-next aria-label="Nächstes Bild">›</button></div><div class="gallery-lightbox-bottom"><span>${esc(p.date||'')} · ${esc(p.device||p.entry||'Allgemein')}</span><span>${galleryIndex+1} / ${db.photos.length}</span></div></div></div>`;document.body.style.overflow='hidden';const image=$('#modal-root [data-mva-lightbox-photo]');if(image)resolveMediaImage(image,p.src)}
function closeGalleryLightbox(){const root=$('#modal-root');if(root?.querySelector('.gallery-lightbox')){root.innerHTML='';document.body.style.overflow=''}}
document.addEventListener('click',e=>{const open=e.target.closest('[data-gallery-open]');if(open){galleryIndex=Number(open.dataset.galleryOpen)||0;showGalleryLightbox();return}if(e.target.closest('[data-lightbox-close]')||e.target.classList.contains('gallery-lightbox')){closeGalleryLightbox();return}if(e.target.closest('[data-lightbox-prev]')){galleryIndex--;showGalleryLightbox();return}if(e.target.closest('[data-lightbox-next]')){galleryIndex++;showGalleryLightbox()}});
document.addEventListener('keydown',e=>{if(!$('#modal-root .gallery-lightbox'))return;if(e.key==='Escape'){closeGalleryLightbox();e.preventDefault()}else if(e.key==='ArrowLeft'){galleryIndex--;showGalleryLightbox();e.preventDefault()}else if(e.key==='ArrowRight'){galleryIndex++;showGalleryLightbox();e.preventDefault()}});
function photoForm(){const t=localeText;openModal(t('photo.add'),`<div class="formgrid"><div class="formrow full"><label>${t('photo.file')}</label><input class="field" type="file" id="p-file" accept="image/*" required></div><div class="formrow"><label>${t('photo.title')}</label><input class="field" id="p-title" placeholder="${t('photo.titlePlaceholder')}"></div><div class="formrow"><label>${t('form.date')}</label><input class="field" id="p-date" type="date" value="${now()}"></div><div class="formrow full"><label>${t('photo.device')}</label><select class="field" id="p-device"><option value="">${t('photo.none')}</option>${db.devices.map(d=>`<option>${esc(d.name)}</option>`).join('')}</select></div><div class="formrow full"><label>${t('photo.entry')}</label><select class="field" id="p-entry"><option value="">${t('photo.none')}</option>${db.entries.map(e=>`<option value="${e.id}">${esc(e.date)} · ${esc(e.device||'Session')}</option>`).join('')}</select></div></div>`,t('photo.save'),()=>{let f=$('#p-file').files[0];if(!f)return toast(t('photo.required'));compress(f,src=>{db.photos.push({id:id(),src,title:$('#p-title').value,date:$('#p-date').value,device:$('#p-device').value,entry:$('#p-entry').value});put();$('#modal-root').innerHTML='';render()})})}


function plantCatalog(v){
 // Die Tabelle wird nach dem deutschen Pflanzennamen (erste Spalte) sortiert – nicht nach botanischer Bezeichnung oder Temperatur.
 const rows=[...(window.MVA_PLANT_CATALOG||[])].sort((a,b)=>String(a[0]||'').localeCompare(String(b[0]||''),'de',{sensitivity:'base'}));
 v.innerHTML=`${header('PFLANZENWISSEN','Pflanzen & Kräuter','Temperaturübersicht aus der bereitgestellten PDF – vollständig als durchsuchbare Tabelle übertragen.','')}
 <div class="card plant-intro"><span class="pill">QUELLENÜBERTRAGUNG</span><p>${esc(window.MVA_PLANT_CATALOG_NOTICE||'')}</p><p class="tagline">Hinweis: Die nachfolgenden Angaben geben den Inhalt der bereitgestellten Vorlage wieder und sind keine medizinische Empfehlung oder Anleitung zur Anwendung.</p></div>
 <div class="row mobile-stack plant-tools"><div><h3>Vaporisierbare Pflanzen</h3><p class="subheading">${rows.length} Einträge · Originalspalten beibehalten</p></div><input class="field" id="plant-search" type="search" placeholder="Pflanze, botanischer Name oder Wirkung suchen…" aria-label="Pflanzentabelle durchsuchen"></div>
 <div class="plant-table-wrap"><table class="plant-table"><thead><tr><th>Pflanze</th><th>Botanische Bezeichnung</th><th>Temperatur</th><th>Wirkung / Anwendungsgebiete</th></tr></thead><tbody id="plant-table-body">${rows.map((r,i)=>`<tr data-plant-row><td><strong>${esc(r[0])}</strong></td><td><i>${esc(r[1])}</i></td><td class="plant-temp">${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table><div class="plant-no-results" id="plant-no-results" hidden>Keine passenden Einträge gefunden.</div></div>
 <p class="plant-credit">* von <a href="https://magische-pflanzen.de/" target="_blank" rel="noopener noreferrer">Magische Pflanzen.de</a> dankend zur Verfügung gestellt.</p>`;
 const input=$('#plant-search'), body=$('#plant-table-body'), emptyState=$('#plant-no-results');
 input?.addEventListener('input',()=>{const q=input.value.trim().toLocaleLowerCase('de');let visible=0;body.querySelectorAll('tr').forEach(row=>{const match=row.textContent.toLocaleLowerCase('de').includes(q);row.hidden=!match;if(match)visible++});emptyState.hidden=visible!==0});
}

function quests(v){let xp=db.game.xp||0,lvl=Math.floor(xp/100)+1,week=db.entries.filter(e=>{let d=new Date(e.date),n=new Date();return d>=new Date(n-7*864e5)}).length;v.innerHTML=`${header(localeText('page.quests.eyebrow'),localeText('page.quests.title'),localeText('page.quests.description'),'')}<div class="grid stats">${card(localeText('quests.level'),lvl,localeText('quests.nextLevel',{xp:xp%100}))}${card(localeText('quests.xp'),xp,localeText('quests.xp'))}${card(localeText('quests.coins'),db.game.coins||0,localeText('quests.coins'))}${card(localeText('quests.weekGoal'),`${Math.min(week,3)} / 3`,localeText('quests.documentation'))}</div><div class="progress"><i style="width:${xp%100}%"></i></div><div class="section-head"><h3>${localeText('quests.title')}</h3></div><div class="grid cards2">${questData.map(q=>{let done=db.game.quests.includes(q.id),ready=q.check();return `<div class="card"><span class="pill">${done?localeText('quests.completed'):localeText('quests.quest')}</span><h3 style="font:700 16px Manrope">${q.name}</h3><p class="subheading">${q.desc}</p><div class="tagline">+${q.xp} XP · +${q.coins} Coins</div><button class="btn ${ready&&!done?'primary':'soft'} small" style="margin-top:14px" data-claim="${q.id}" ${done||!ready?'disabled':''}>${done?localeText('quests.done'):ready?localeText('quests.claim'):localeText('quests.notReached')}</button></div>`}).join('')}</div>`;bindGlobal()}
const questData=[
 {id:"first-entry",name:"Erster Tagebucheintrag",desc:"Lege deinen ersten Eintrag im Vaping-Tagebuch an.",xp:20,coins:10,check:()=>db.entries.length>=1},
 {id:"five-entries",name:"Dranbleiben",desc:"Dokumentiere fünf Einträge in deinem Tagebuch.",xp:40,coins:20,check:()=>db.entries.length>=5},
 {id:"ten-entries",name:"Routine entwickeln",desc:"Erreiche zehn Tagebucheinträge.",xp:60,coins:30,check:()=>db.entries.length>=10},
 {id:"first-device",name:"Gerät kennenlernen",desc:"Füge mindestens ein Gerät zu deiner Sammlung hinzu.",xp:20,coins:10,check:()=>db.devices.length>=1},
 {id:"first-material",name:"Materialsammlung starten",desc:"Lege den ersten Eintrag in deiner Strain Collection an.",xp:20,coins:10,check:()=>db.strains.length>=1}
];
const courses=[{id:'battery',title:'Akkusicherheit',level:'Grundlagen',xp:30,coins:25,lessons:['Beschädigte Akkus nicht weiterverwenden.','Lose Lithium-Ionen-Akkus gegen Kurzschluss schützen.','Nur passende Ladegeräte nach Herstellerangaben nutzen.','Akkus trocken und geschützt lagern.'],questions:[['Was machst du mit einem beschädigten Akku?',['Weiterverwenden','Nicht weiterverwenden','Mit Klebeband reparieren'],1],['Wie transportierst du lose Akkus?',['Ungeschützt','Mit Schlüsseln zusammen','In einer geeigneten Schutzhülle'],2],['Welches Ladegerät nutzt du?',['Geeignet nach Herstellerangaben','Irgendein Netzteil','Beschädigtes Kabel'],0]]},{id:'clean',title:'Reinigung & Pflege',level:'Grundlagen',xp:20,coins:15,lessons:['Gerät vor der Reinigung ausschalten und abkühlen lassen.','Anweisungen des Herstellers beachten.','Keine Flüssigkeit in Elektronik oder Akkuöffnungen bringen.'],questions:[['Wann reinigst du ein Gerät?',['Eingeschaltet','Ausgeschaltet und abgekühlt','Während des Ladens'],1],['Was vermeidest du?',['Herstellerhinweise','Flüssigkeit in Elektronik','Abkühlen lassen'],1]]},{id:'device-basics',title:'Gerätekunde',level:'Einführung',xp:20,coins:15,lessons:['Lies Bedienungsanleitung und Warnhinweise.','Prüfe Gerät und Zubehör regelmäßig.','Nutze nur kompatible Teile.'],questions:[['Wo findest du passende Nutzungshinweise?',['Bedienungsanleitung','Beliebige Werbung','Nirgends'],0]]},...(window.MVA_ACADEMY_COURSES?.getCourses?.()||[]),{
 id:'smoking-to-vaping',
 titleKey:'course.smoking.title',
 levelKey:'course.smoking.level',
 descriptionKey:'course.smoking.description',
 xp:40,coins:30,
 lessonsKey:[
  'course.smoking.lesson1','course.smoking.lesson2','course.smoking.lesson3',
  'course.smoking.lesson4','course.smoking.lesson5','course.smoking.lesson6',
  'course.smoking.lesson7','course.smoking.lesson8'
 ],
 questionsKey:[
  ['course.smoking.q1',['course.smoking.q1a','course.smoking.q1b','course.smoking.q1c'],1],
  ['course.smoking.q2',['course.smoking.q2a','course.smoking.q2b','course.smoking.q2c'],2],
  ['course.smoking.q3',['course.smoking.q3a','course.smoking.q3b','course.smoking.q3c'],0],
  ['course.smoking.q4',['course.smoking.q4a','course.smoking.q4b','course.smoking.q4c'],1],
  ['course.smoking.q5',['course.smoking.q5a','course.smoking.q5b','course.smoking.q5c'],2]
 ]
}];
function courseTitle(c){return c.titleKey?localeText(c.titleKey):c.title}
function courseLevel(c){return c.levelKey?localeText(c.levelKey):c.level}
function courseLessons(c){return c.lessonsKey?c.lessonsKey.map(k=>localeText(k)):c.lessons}
function courseQuestions(c){return c.questionsKey?c.questionsKey.map(q=>[localeText(q[0]),q[1].map(k=>localeText(k)),q[2]]):c.questions}
function learn(v){let done=Object.values(db.game.courses).filter(c=>c.passed).length;v.innerHTML=`${header(localeText('page.learn.eyebrow'),localeText('page.learn.title'),localeText('page.learn.description'),'')}<div class="card" style="margin:20px 0"><div class="row"><div><span class="eyebrow">${localeText('learn.progress')}</span><h3 style="font:700 16px Manrope;margin:8px 0">${localeText('learn.passed',{done,total:courses.length})}</h3></div><span class="pill">${db.game.coins||0} COINS</span></div><div class="progress"><i style="width:${done/courses.length*100}%"></i></div></div><div class="grid cards2">${courses.map(c=>{let r=db.game.courses[c.id],lessons=courseLessons(c);return `<article class="card course"><span class="pill">${courseLevel(c).toUpperCase()} · ${lessons.length} ${localeText('learn.lessons')}</span><h3 style="font:700 17px Manrope;margin:13px 0 6px">${esc(courseTitle(c))}</h3><p class="subheading">${c.descriptionKey?localeText(c.descriptionKey):localeText('learn.learnBasics')}</p><div class="tagline" style="margin:12px 0">${r?.passed?localeText('learn.passedLabel',{score:r.score}):localeText('learn.reward',{xp:c.xp,coins:c.coins})}</div><button class="btn soft" data-course="${c.id}">${r?.passed?localeText('learn.viewResult'):localeText('learn.openCourse')} →</button></article>`}).join('')}</div><p class="tagline" style="margin-top:20px">${localeText('learn.disclaimer')}</p>`;bindGlobal()}
function courseView(c){
 if(c.id==='cannabis-teillegalisierung'){renderCannabisCourse(c,0);return}
 const old=db.game.courses[c.id],lessons=courseLessons(c),questions=courseQuestions(c);
 const lessonMarkup=c.richLessons
  ? c.richLessons.map((lesson,i)=>`<section class="edu-lesson"><div class="edu-lesson-head"><span class="edu-lesson-number">0${i+1}</span><h3>${esc(lesson.title)}</h3></div><div class="edu-lesson-content">${lesson.html}</div></section>`).join('')
  : `<h3>${localeText('course.lessonHeading')}</h3><ol class="course-lessons">${lessons.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
 const sourceMarkup=c.id==="ecig-structure"&&c.richLessons ? "<hr style='border:0;border-top:1px solid var(--line);margin:22px 0'><h3>Quellen und fachliche Grundlage</h3><p>Die inhaltliche Grundlage bildet dein gewünschter Wikipedia-Artikel:</p><ul><li><a href='https://de.wikipedia.org/wiki/Elektrische_Zigarette?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Elektrische Zigarette – Wikipedia</a></li><li><a href='https://de.wikipedia.org/wiki/Aufbau_von_elektronischen_Zigaretten?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Aufbau von elektronischen Zigaretten – Wikipedia</a></li></ul><p>Für die gesundheitlichen und sicherheitsbezogenen Aussagen ergänze ich seriöse Fachquellen:</p><ul><li><a href='https://www.bfr.bund.de/veroeffentlichung/e-zigaretten-alles-andere-als-harmlos/?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Bundesinstitut für Risikobewertung (BfR) – E-Zigaretten</a></li><li><a href='https://www.dkfz.de/fileadmin/user_upload/Krebspraevention/Download/pdf/Buecher_und_Berichte/2023_Risiken-von-E-Zigaretten-und-Tabakerhitzern.pdf?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Deutsches Krebsforschungszentrum – Risiken von E-Zigaretten</a></li></ul><p>Wikipedia dient als technische Einstiegsquelle, nicht als alleinige wissenschaftliche oder medizinische Autorität.</p>" : "";
 const quizMarkup=questions.map((q,i)=>`<div class="formrow course-question" style="margin:14px 0"><label>${i+1}. ${esc(q[0])}</label>${q[1].map((a,j)=>`<label style="font-weight:400"><input type="radio" name="cq${i}" value="${j}" style="width:auto"> ${esc(a)}</label>`).join('')}</div>`).join('');
 const quizIntro=c.quizIntro
  ? "<p class='subheading'>"+esc(c.quizIntro)+"</p>"
  : c.id==="ecig-structure"&&c.richLessons
    ? "<p class='subheading'><strong>Dein Wissenstest</strong> · /10 beantwortet<br>Der Test umfasst 10 Fragen. Pro Frage gibt es eine richtige Antwort. Als bestanden gilt der Test mit mindestens 8 richtigen Antworten.</p>"
    : "<p class=\"subheading\">"+localeText('course.quizHint')+"</p>";
 openModal(courseTitle(c),`<div class="course-intro">${c.richLessons?'<div class="edu-course-banner"><span class="pill">'+esc(c.bannerLabel||('GRUNDLAGEN · '+lessons.length+' LEKTIONEN'))+'</span><p>'+esc(c.bannerTitle||'My Vaping Education')+'</p><small>'+esc(c.bannerSubtitle||'Technik verstehen · Zusammenhänge erkennen · Sicherheit kennen')+'</small></div>':''}<span class="pill">${courseLevel(c)}</span><p class="subheading">${c.descriptionKey?localeText(c.descriptionKey):esc(c.description||localeText('learn.learnBasics'))}</p>${lessonMarkup}<div class="course-note">${esc(c.disclaimer||localeText('course.smoking.disclaimer'))}</div><hr style="border:0;border-top:1px solid var(--line);margin:22px 0"><h3>${localeText('course.quizHeading')}</h3>${quizIntro}${quizMarkup}${sourceMarkup}</div>`,old?.passed?localeText('learn.viewResult'):localeText('course.submitQuiz'),()=>{
  let score=0;
  for(let i=0;i<questions.length;i++){let a=$('[name="cq'+i+'"]:checked');if(!a)return toast(localeText('course.answerAll'));if(+a.value===questions[i][2])score++}
  const pct=Math.round(score/questions.length*100),passed=pct>=80,was=old?.passed;
  if(passed&&!was){db.game.xp=(Number(db.game.xp)||0)+c.xp;db.game.coins=(Number(db.game.coins)||0)+c.coins}
  const bestScore=Math.max(Number(old?.score)||0,pct);
  db.game.courses[c.id]={passed:passed||was,score:bestScore,date:now(),...(old?.passed?{coins:old.coins}:passed?{coins:c.coins}:{})};
  put();$('#modal-root').innerHTML='';render();toast(`${passed?localeText('course.passed'):localeText('course.notPassed')} · ${pct}%`)
 });
}


const cannabisPanelCache={};
async function renderCannabisCourse(c,step){
 const v=$('#view');if(!v)return;
 const total=18,questions=courseQuestions(c),old=db.game.courses[c.id],title=courseTitle(c),isQuiz=step===total;
 const nav='<div class="cang-course-toolbar"><button type="button" class="btn soft" id="cang-overview">← Zur Kursübersicht</button><span class="pill">CANNABISRECHT · '+(isQuiz?'WISSENSTEST':('TAFEL '+(step+1)+' / '+total))+'</span></div>';
 if(isQuiz){
  const quizMarkup=questions.map((q,i)=>'<fieldset class="formrow course-question cang-question"><legend>'+(i+1)+'. '+esc(q[0])+'</legend>'+q[1].map((a,j)=>'<label><input type="radio" name="cq'+i+'" value="'+j+'"> '+esc(a)+'</label>').join('')+'</fieldset>').join('');
  v.innerHTML=header('MY VAPING EDUCATION',title,'Abschlusstest · 18 Fragen · mindestens 80 % zum Bestehen','')+nav+'<section class="card cang-lesson-card"><div class="cang-progress"><span style="width:100%"></span></div><h2>Wissenstest</h2><p class="subheading">'+esc(c.quizIntro)+'</p><form id="cang-quiz-form">'+quizMarkup+'<div class="cang-course-actions"><button type="button" class="btn" id="cang-quiz-back">← Zurück zu Tafel 18</button><button type="submit" class="btn primary">Test auswerten</button></div></form></section><p class="tagline">'+esc(c.disclaimer)+'</p>';
  $('#cang-overview').onclick=()=>learn(v);
  $('#cang-quiz-back').onclick=()=>renderCannabisCourse(c,total-1);
  $('#cang-quiz-form').onsubmit=e=>{
   e.preventDefault();let score=0;
   for(let i=0;i<questions.length;i++){const a=$('[name="cq'+i+'"]:checked');if(!a)return toast(localeText('course.answerAll'));if(+a.value===questions[i][2])score++}
   const pct=Math.round(score/questions.length*100),passed=pct>=80,was=old?.passed;
   if(passed&&!was){db.game.xp=(Number(db.game.xp)||0)+c.xp;db.game.coins=(Number(db.game.coins)||0)+c.coins}
   const bestScore=Math.max(Number(old?.score)||0,pct);
   db.game.courses[c.id]={passed:passed||was,score:bestScore,date:now(),...(old?.passed?{coins:old.coins}:passed?{coins:c.coins}:{})};
   put();render();toast((passed?localeText('course.passed'):localeText('course.notPassed'))+' · '+pct+'%');
  };
  return;
 }
 const number=step+1;
 v.innerHTML=header('MY VAPING EDUCATION',title,'Originalausstellung · Tafel '+number+' von '+total,'')+nav+'<section class="card cang-lesson-card"><div class="cang-progress"><span style="width:'+((number/total)*100)+'%"></span></div><div class="cang-panel-loading">Tafel '+number+' wird geladen …</div></section><div class="cang-course-actions"><button type="button" class="btn" id="cang-prev" '+(step===0?'disabled':'')+'>← Vorherige Tafel</button><span class="tagline">Tafel '+number+' / '+total+'</span><button type="button" class="btn primary" id="cang-next">'+(step===total-1?'Zum Wissenstest →':'Nächste Tafel →')+'</button></div>';
 $('#cang-overview').onclick=()=>learn(v);
 const previous=$('#cang-prev'),next=$('#cang-next');
 if(previous)previous.onclick=()=>renderCannabisCourse(c,step-1);
 next.onclick=()=>renderCannabisCourse(c,step===total-1?total:step+1);
 try{
  if(!cannabisPanelCache[number]){
   const response=await fetch('websitecang/Tafel'+number+'.html');
   if(!response.ok)throw new Error('HTTP '+response.status);
   const source=await response.text(),doc=new DOMParser().parseFromString(source,'text/html'),article=doc.querySelector('article.tafel, section.tafel');
   if(!article)throw new Error('Tafelinhalt nicht gefunden');
   article.querySelectorAll('[style]').forEach(node=>node.removeAttribute('style'));
   article.querySelectorAll('script,style,iframe,form').forEach(node=>node.remove());
   cannabisPanelCache[number]=article.innerHTML;
  }
  if(page!=='learn'||!v.isConnected)return;
  const loading=v.querySelector('.cang-panel-loading');if(loading)loading.outerHTML='<article class="cang-original-content">'+cannabisPanelCache[number]+'</article>';
 }catch(error){
  const loading=v.querySelector('.cang-panel-loading');
  if(loading)loading.innerHTML='Die Originaltafel konnte nicht geladen werden. Bitte prüfe deine Internetverbindung. <button type="button" class="btn soft" id="cang-retry">Erneut versuchen</button>';
  $('#cang-retry')?.addEventListener('click',()=>{delete cannabisPanelCache[number];renderCannabisCourse(c,step)});
 }
}

function controlledVapingStep(v,n){
 const lang=window.MVA_I18N?.getLanguage?.()||'de';
 const titles={
 de:['Vaping-Grundwissen aneignen','Pro / Kontra Veränderung','Bilanz ziehen','Vapingkonsumziele festlegen','Strategien zur Zielerreichung erarbeiten','Risikosituationen erkennen','Ausrutscher meistern','Freizeit geniessen','Belastungen erkennen','Belastungen abbauen','Nein-Sagen lernen','Erfolge sichern'],
 en:['Learn the basics of vaping','Pros and cons of change','Take stock','Set vaping goals','Develop strategies to reach your goals','Recognise risky situations','Manage lapses','Enjoy leisure time','Recognise stressors','Reduce stressors','Learn to say no','Maintain your achievements'],
 fr:['Acquérir les bases du vapotage','Pour et contre le changement','Faire le bilan','Définir des objectifs de consommation','Élaborer des stratégies pour atteindre ses objectifs','Identifier les situations à risque','Gérer les écarts','Profiter de son temps libre','Identifier les sources de stress','Réduire les sources de stress','Apprendre à dire non','Consolider ses réussites']
 };
 const t=(titles[lang]||titles.de)[n-1];
 const nav=lang==='en'?{back:'← Programme overview',prev:'← Previous',next:'Next →'}:lang==='fr'?{back:'← Aperçu du programme',prev:'← Précédent',next:'Suivant →'}:{back:'← Programmübersicht',prev:'← Zurück',next:'Weiter →'};
 const fourLang=lang==='en'?{left:'Continue consuming as before',right:'Change consumption',adv:'Advantage',dis:'Disadvantage',save:'Save answers',saved:'Your answers have been saved.',hint:'You can edit your answers at any time and save them again.'}:lang==='fr'?{left:'Continuer comme avant',right:'Changer sa consommation',adv:'Avantage',dis:'Inconvénient',save:'Enregistrer les réponses',saved:'Vos réponses ont été enregistrées.',hint:'Vous pouvez modifier vos réponses à tout moment et les enregistrer à nouveau.'}:{left:'Weiter konsumieren wie bisher',right:'Konsum ändern',adv:'Vorteil',dis:'Nachteil',save:'Antworten speichern',saved:'Deine Antworten wurden gespeichert.',hint:'Du kannst deine Antworten jederzeit ändern und erneut speichern.'};
 const saved=db.controlledVaping?.step2FourField||{};
 const fields=[['continueAdv',fourLang.left,fourLang.adv],['changeAdv',fourLang.right,fourLang.adv],['continueDis',fourLang.left,fourLang.dis],['changeDis',fourLang.right,fourLang.dis]];
 const table=n===2?'<section class="card cv-step-card"><h2>'+(lang==='en'?'Pros and cons of change':lang==='fr'?'Avantages et inconvénients du changement':'Pro / Kontra Veränderung')+'</h2><p class="muted">'+fourLang.hint+'</p><div class="cv-four-grid">'+fields.map(([key,col,row])=>'<label class="cv-four-cell"><span class="cv-four-col">'+col+'</span><strong>'+row+'</strong><textarea class="field" rows="5" maxlength="5000" data-cv-four="'+key+'" placeholder="'+(lang==='en'?'Write your thoughts here…':lang==='fr'?'Écrivez vos réflexions ici…':'Hier deine Gedanken eintragen …')+'">'+esc(saved[key]||'')+'</textarea></label>').join('')+'</div><div class="row" style="justify-content:flex-end;margin-top:16px"><button type="button" class="btn primary" id="cv-four-save">'+fourLang.save+'</button></div></section>' : '';
 let balance='';
 if(n===8){
  const leisureTitle=lang==='en'?'Possible leisure activities':lang==='fr'?'Activités de loisirs possibles':'Mögliche Freizeitaktivitäten';
  const leisureIntro=lang==='en'?'Choose activities that bring you joy. Invite other people to join you – it often makes things easier!':lang==='fr'?'Faites des activités qui vous font plaisir. Proposez à d’autres personnes de vous accompagner – cela facilite souvent les choses !':'Unternehmen Sie Dinge, die Ihnen Freude bereiten. Sprechen Sie dazu andere Leute an – das macht es oft einfacher!';
  const activities=["Ausflüge","Flohmarkt","Kraftsport","Musik machen","Bad nehmen","Fremdsprachen","Kreuzworträtsel","Puzzeln","Billard","Fussball","Laufen","Zeichnen","Boccia","Gartenarbeit","Lesen","Schach","Brettspiele","Grillen","Meditieren","Schwimmen","Entspannen","Tagebuch","Malen","Spiritualität","PC, Internet","Karten spielen","Minigolf","Tanzen","Darts","Kegeln","Sonnenbaden","Tischtennis","Fahrrad fahren","Kinobesuch","Museumbesuch","Wandern","Fotografieren","Kochen","Zukunftspläne schmieden","Sich schick anziehen"];
  const custom=db.controlledVaping?.step8CustomActivities||['','','',''];
  const customTitle=lang==='en'?'My own activities':lang==='fr'?'Mes propres activités':'Meine eigenen Aktivitäten';
  const customHint=lang==='en'?'Add up to four activities of your own and save them. They will remain here when you return to this step.':lang==='fr'?'Ajoutez jusqu’à quatre activités personnelles et enregistrez-les. Elles resteront disponibles lorsque vous reviendrez à cette étape.':'Tragen Sie bis zu vier eigene Aktivitäten ein und speichern Sie diese. Sie bleiben erhalten, wenn Sie zu diesem Schritt zurückkehren.';
  const customSave=lang==='en'?'Save my activities':lang==='fr'?'Enregistrer mes activités':'Eigene Aktivitäten speichern';
  balance='<section class="card cv-step-card cv-leisure-card"><h2>'+leisureTitle+'</h2><div class="cv-leisure-grid">'+activities.map((activity,index)=>'<div class="cv-leisure-item"><span class="cv-leisure-number">'+(index+1)+'</span><span>'+activity+'</span></div>').join('')+'</div><section class="cv-own-leisure"><h3>'+customTitle+'</h3><p class="muted">'+customHint+'</p><div class="cv-own-leisure-grid">'+[0,1,2,3].map(index=>'<label class="cv-own-leisure-field"><span>'+(index+1)+'.</span><input class="field" type="text" maxlength="100" data-cv8-custom="'+index+'" value="'+esc(custom[index]||'')+'" placeholder="'+(lang==='en'?'Enter an activity…':lang==='fr'?'Saisissez une activité…':'Eigene Aktivität eintragen …')+'"></label>').join('')+'</div><div class="row" style="justify-content:flex-end;margin-top:14px"><button type="button" class="btn primary" id="cv8-custom-save">'+customSave+'</button></div></section><p class="cv-leisure-note">'+leisureIntro+'</p></section>';
 }
 if(n===3){
  const copy=lang==='en'?{
   intro:'You have now recorded your current vaping consumption in your vaping diary. If you have documented your sessions for at least seven days, you can take stock for the first time. The following questions will help you.',
   checklist:'Checklist: Review of my category consumption',save:'Save answers',saved:'Your balance sheet has been saved.',hint:'Complete the questions separately for each active category. You can edit and save your answers again at any time.',
   a:'How many vaping sessions in this category did you have in total last week?',b:'How many sessions did you have on the day with the most sessions?',c:'Were there any days when you did not vape?',d:'Were there days when you vaped noticeably less?',e:'Were there times of day when you vaped particularly much or particularly little?',f:'Were there recurring triggers for vaping (e.g. certain people, withdrawal symptoms, low mood)?',g:'What experiences did you have while keeping the vaping diary? When did it go well? What made it easier?',
   yes:'Yes',no:'No',days:'If yes: on how many days?',cwhy:'If yes, how did you manage not to vape every day? If no, what was the reason there were no vape-free days?',
   dwhy:'If yes, what were the reasons?',number:'Number of sessions',placeholder:'Write your answer here…',category:'Category'
  }:lang==='fr'?{
   intro:'Vous avez maintenant consigné votre consommation actuelle dans votre journal de vapotage. Si vous avez documenté vos sessions pendant au moins sept jours, vous pouvez faire un premier bilan. Les questions suivantes vous aideront.',
   checklist:'Liste de contrôle : bilan de ma consommation par catégorie',save:'Enregistrer les réponses',saved:'Votre bilan a été enregistré.',hint:'Répondez séparément pour chaque catégorie active. Vous pouvez modifier et enregistrer vos réponses à tout moment.',
   a:'Combien de sessions de vapotage de cette catégorie avez-vous effectuées au total la semaine dernière ?',b:'Combien de sessions avez-vous effectuées le jour où vous en avez eu le plus ?',c:'Y a-t-il eu des jours sans vapotage ?',d:'Y a-t-il eu des jours où vous avez vapoté nettement moins ?',e:'Y a-t-il eu des moments de la journée où vous vapotiez particulièrement beaucoup ou peu ?',f:'Y avait-il des déclencheurs récurrents du vapotage (p. ex. certaines personnes, symptômes de manque, mauvaise humeur) ?',g:'Quelle expérience avez-vous faite en tenant le journal ? Quand cela s’est-il bien passé ? Qu’est-ce qui a facilité les choses ?',
   yes:'Oui',no:'Non',days:'Si oui : combien de jours ?',cwhy:'Si oui, comment avez-vous réussi à ne pas vapoter tous les jours ? Si non, pourquoi n’y a-t-il pas eu de jour sans vapotage ?',
   dwhy:'Si oui, quelles en étaient les raisons ?',number:'Nombre de sessions',placeholder:'Saisissez votre réponse ici…',category:'Catégorie'
  }:{
   intro:'Nun hast du deinen derzeitigen Vapingkonsum im Vaping-Tagebuch festgehalten. Wenn du deine Sessions mindestens sieben Tage lang größtenteils dokumentiert hast, kannst du eine erste Bilanz ziehen. Dabei helfen dir die folgenden Fragen.',
   checklist:'Checkliste: Bilanz meines Kategorie-Konsums',save:'Antworten speichern',saved:'Deine Bilanz wurde gespeichert.',hint:'Beantworte die Fragen für jede aktive Kategorie getrennt. Du kannst deine Antworten jederzeit wieder öffnen, ändern und erneut speichern.',
   a:'Wie viele Vaping-Sessions dieser Kategorie hattest du insgesamt in der vergangenen Woche?',b:'Wie viele Sessions hattest du an dem Tag mit den meisten Sessions?',c:'Gab es Tage, an denen du vapingfrei warst?',d:'Gab es Tage, an denen du deutlich weniger gevapet hast?',e:'Gab es Tageszeiten, zu denen du besonders viel oder besonders wenig gevapet hast?',f:'Gab es wiederkehrende Auslöser fürs Vapen (z. B. bestimmte Personen, Entzugserscheinungen oder schlechte Stimmung)?',g:'Welche Erfahrungen hast du beim Führen des Vaping-Tagebuchs gemacht? Wann ging es gut? Was hat es erleichtert?',
   yes:'Ja',no:'Nein',days:'Falls ja: An wie vielen Tagen?',cwhy:'Falls ja: Wie hast du es geschafft, nicht täglich zu vapen? Falls nein: Woran lag es, dass es keinen vapingfreien Tag gab?',
   dwhy:'Falls ja: Was waren die Gründe?',number:'Anzahl der Sessions',placeholder:'Hier deine Antwort eintragen …',category:'Kategorie'
  };
  const categoryNames={vaporizer:lang==='en'?'Vaporizer':lang==='fr'?'Vaporisateur':'Vaporizer',ecig:lang==='en'?'E-cigarette':lang==='fr'?'Cigarette électronique':'E-Zigarette',heater:lang==='en'?'Tobacco heater':lang==='fr'?'Tabac chauffé':'Tabakheater',cigarette:lang==='en'?'Cigarette':'Zigarette',joint:'Joint',bong:'Bong'};
  const activeCategories=Object.keys(categoryNames).filter(isCategoryEnabled);
  const answers=db.controlledVaping?.step3Balance||{};
  const textarea=(cat,key,label,value)=>'<label class="cv-balance-field"><span>'+label+'</span><textarea class="field" rows="3" maxlength="5000" data-cv3-cat="'+cat+'" data-cv3-field="'+key+'" placeholder="'+copy.placeholder+'">'+esc(value||'')+'</textarea></label>';
  const number=(cat,key,label,value)=>'<label class="cv-balance-field"><span>'+label+'</span><input class="field" type="number" min="0" step="1" inputmode="numeric" data-cv3-cat="'+cat+'" data-cv3-field="'+key+'" value="'+esc(value??'')+'" placeholder="0"></label>';
  const choices=(cat,key,value)=>'<div class="cv-balance-choice" role="group" aria-label="'+(key==='c'?copy.c:copy.d)+'"><label><input type="checkbox" data-cv3-choice="'+key+'" data-cv3-cat="'+cat+'" value="yes" '+(value==='yes'?'checked':'')+'> '+copy.yes+'</label><label><input type="checkbox" data-cv3-choice="'+key+'" data-cv3-cat="'+cat+'" value="no" '+(value==='no'?'checked':'')+'> '+copy.no+'</label></div>';
  balance='<section class="card cv-step-card"><p class="cv-balance-intro">'+copy.intro+'</p><h2>'+copy.checklist+'</h2><p class="muted">'+copy.hint+'</p>'+
   (activeCategories.length?activeCategories.map(cat=>{
    const data=answers[cat]||{};
    return '<section class="cv-balance-category"><h3>'+copy.category+': '+categoryNames[cat]+'</h3>'+
     '<div class="cv-balance-question"><h4>(a) '+copy.a+'</h4>'+number(cat,'a',copy.number,data.a)+'</div>'+
     '<div class="cv-balance-question"><h4>(b) '+copy.b+'</h4>'+number(cat,'b',copy.number,data.b)+'</div>'+
     '<div class="cv-balance-question"><h4>(c) '+copy.c+'</h4>'+choices(cat,'c',data.cChoice)+
      '<label class="cv-balance-field"><span>'+copy.days+'</span><input class="field" type="number" min="0" max="7" step="1" inputmode="numeric" data-cv3-cat="'+cat+'" data-cv3-field="cDays" value="'+esc(data.cDays??'')+'" placeholder="0"></label>'+textarea(cat,'cWhy',copy.cwhy,data.cWhy)+'</div>'+
     '<div class="cv-balance-question"><h4>(d) '+copy.d+'</h4>'+choices(cat,'d',data.dChoice)+textarea(cat,'dWhy',copy.dwhy,data.dWhy)+'</div>'+
     '<div class="cv-balance-question"><h4>(e) '+copy.e+'</h4>'+textarea(cat,'e',copy.e,data.e)+'</div>'+
     '<div class="cv-balance-question"><h4>(f) '+copy.f+'</h4>'+textarea(cat,'f',copy.f,data.f)+'</div>'+
     '<div class="cv-balance-question"><h4>(g) '+copy.g+'</h4>'+textarea(cat,'g',copy.g,data.g)+'</div></section>';
   }).join(''):'<p class="muted">'+(lang==='en'?'No categories are currently active.':lang==='fr'?'Aucune catégorie n’est actuellement active.':'Aktuell ist keine Konsumkategorie aktiviert.')+'</p>')+
   '<div class="row" style="justify-content:flex-end;margin-top:18px"><button type="button" class="btn primary" id="cv3-save">'+copy.save+'</button></div></section>';
 }
 v.innerHTML=header('KONTROLLIERT VAPEN','Schritt '+n+': '+t,'12-Schritte-Programm','')+table+balance+
 '<div class="row mobile-stack" style="max-width:900px;margin:24px auto;justify-content:space-between;gap:10px"><button class="btn soft" data-page="controlledVaping">'+nav.back+'</button><div class="row" style="gap:8px">'+(n>1?'<button class="btn" data-page="cvStep'+(n-1)+'">'+nav.prev+'</button>':'')+(n<12?'<button class="btn primary" data-page="cvStep'+(n+1)+'">'+nav.next+'</button>':'')+'</div></div>';
 if(n===2){
  v.querySelector('#cv-four-save')?.addEventListener('click',()=>{
   db.controlledVaping ||= {};
   db.controlledVaping.step2FourField={};
   v.querySelectorAll('[data-cv-four]').forEach(field=>{db.controlledVaping.step2FourField[field.dataset.cvFour]=field.value.trim()});
   put();toast(fourLang.saved);
  });
 }
 if(n===3){
  v.querySelectorAll('[data-cv3-choice]').forEach(box=>box.addEventListener('change',()=>{
   if(box.checked)v.querySelectorAll('[data-cv3-choice="'+box.dataset.cv3Choice+'"][data-cv3-cat="'+box.dataset.cv3Cat+'"]').forEach(other=>{if(other!==box)other.checked=false});
  }));
  v.querySelector('#cv3-save')?.addEventListener('click',()=>{
   db.controlledVaping ||= {};
   const current=db.controlledVaping.step3Balance||{};
   v.querySelectorAll('[data-cv3-cat][data-cv3-field]').forEach(field=>{
    const cat=field.dataset.cv3Cat,key=field.dataset.cv3Field;
    current[cat] ||= {};
    current[cat][key]=field.value.trim();
   });
   v.querySelectorAll('[data-cv3-choice]').forEach(box=>{
    const cat=box.dataset.cv3Cat,key=box.dataset.cv3Choice;
    current[cat] ||= {};
    if(box.checked)current[cat][key+'Choice']=box.value;
    else if(current[cat][key+'Choice']===box.value)delete current[cat][key+'Choice'];
   });
   db.controlledVaping.step3Balance=current;
   put();toast(copy.saved);
  });
 }
 if(n===8){
  v.querySelector('#cv8-custom-save')?.addEventListener('click',()=>{
   db.controlledVaping ||= {};
   db.controlledVaping.step8CustomActivities=[0,1,2,3].map(index=>v.querySelector('[data-cv8-custom="'+index+'"]')?.value.trim()||'');
   put();
   toast(lang==='en'?'Your own activities have been saved.':lang==='fr'?'Vos activités ont été enregistrées.':'Deine eigenen Aktivitäten wurden gespeichert.');
  });
 }
}
function controlledVaping(v){
 const lang=window.MVA_I18N?.getLanguage?.()||'de';
 const dict={
 de:{eyebrow:'BEWUSST DOKUMENTIEREN',title:'Kontrolliertes Vapen',sub:'Phase 1 · Bestandsaufnahme',purpose:'Ziel von Kontrolliert Vapen ist es, Sie darin zu unterstützen, Kontrolle zurückzugewinnen und Ihr Leben so einzurichten, dass Sie damit zufrieden sind!',whatTitle:'Was ist Kontrolliertes Vapen?',whatIntro:'Beim kontrollierten Vapen halten Sie sich an einen zuvor von Ihnen selbst festgelegten Plan. In diesem Plan legen Sie für jede Woche drei Dinge fest:',dailyTitle:'Tägliche Höchstmenge',dailyText:'Wie viel möchten Sie von der jeweiligen Kategorie an einem Vapetag höchstens vapen?',weeklyTitle:'Wöchentliche Höchstmenge',weeklyText:'Wie viele Vaping-Sessions möchten Sie je Kategorie höchstens pro Woche haben?',freeTitle:'Anzahl der vapefreien Tage',freeText:'An wie vielen Tagen möchten Sie nicht vapen?',moreTitle:'Weitere persönliche Regeln',moreText:'Darüber hinaus können Sie weitere Dinge festlegen – zum Beispiel, zu welchen Uhrzeiten Sie vapen möchten.',overviewTitle:'Übersicht über Kontrolliert Vapen',foundation:'Grundlage: Führen des Vaping-Tagebuchs',program:'Das 12-Schritte-Programm',afterEnd:'Nach Ende',afterText:'Periodische Selbstüberprüfung des Vapingkonsums',asNeeded:'Nach Bedarf',support:'Weitergehende Unterstützungsangebote',steps:['Vaping-Grundwissen aneignen','Pro / Kontra Veränderung','Bilanz ziehen','Vapingkonsumziele festlegen','Strategien zur Zielerreichung erarbeiten','Risikosituationen erkennen','Ausrutscher meistern','Freizeit geniessen','Belastungen erkennen','Belastungen abbauen','Nein-Sagen lernen','Erfolge sichern'],intro:'Zunächst wird nur beobachtet und dokumentiert. Es werden noch keine Reduktionsziele festgelegt.',start:'Start der Bestandsaufnahme',save:'Startdatum speichern',week:'Woche auswählen',prevWeek:'Vorherige Woche',nextWeek:'Nächste Woche',category:'Kategorie',time:'Uhrzeit',total:'Gesamtwoche',perDay:'Sessions pro Tag',overall:'Gesamt Vaping-Sessions pro Tag',free:'Konsumfreie Tage',duration:'Dauer der Bestandsaufnahme',days:'Tage',left:'Noch',notStarted:'Lege das Startdatum fest, um deine Bestandsaufnahme zu beginnen.',noEntries:'Für diese Woche sind noch keine Tagebucheinträge vorhanden.',note:'Eine Session entspricht einem gespeicherten Tagebucheintrag. Die Tabelle wird automatisch aus deinen Tagebucheinträgen berechnet. Einträge ohne Uhrzeit zählen zur Tages- und Wochensumme, können aber keinem Zeitfenster zugeordnet werden.',slot:['0 bis 6','6 bis 12','12 bis 18','18 bis 24'],sessions:'Sessions',missing:'Einträge ohne Uhrzeit',avg:'Durchschnitt pro Kalendertag',of:'von 7 Tagen',reached:'30 Tage erreicht'},
 en:{eyebrow:'DOCUMENT YOUR PATTERNS',title:'Controlled Vaping',sub:'Phase 1 · Baseline',purpose:'The goal of Controlled Vaping is to support you in regaining control and shaping your life in a way that makes you happy.',whatTitle:'What is Controlled Vaping?',whatIntro:'With controlled vaping, you follow a plan that you have created yourself in advance. Each week, you set three limits in this plan:',dailyTitle:'Daily maximum amount',dailyText:'What is the maximum amount you want to vape from each category on a day when you vape?',weeklyTitle:'Weekly maximum',weeklyText:'How many vaping sessions per category do you want to have at most each week?',freeTitle:'Number of vape-free days',freeText:'On how many days would you like not to vape?',moreTitle:'Additional personal rules',moreText:'You can also set other rules – for example, the times of day when you want to vape.',overviewTitle:'Controlled Vaping overview',foundation:'Foundation: Keeping a vaping diary',program:'The 12-step programme',afterEnd:'After completion',afterText:'Periodic self-review of vaping habits',asNeeded:'As needed',support:'Further support options',steps:['Learn the basics of vaping','Pros and cons of change','Take stock','Set vaping goals','Develop strategies to reach your goals','Recognise risky situations','Manage lapses','Enjoy leisure time','Recognise stressors','Reduce stressors','Learn to say no','Maintain your achievements'],intro:'First, observe and document only. No reduction targets are set yet.',start:'Baseline start date',save:'Save start date',week:'Select week',prevWeek:'Previous week',nextWeek:'Next week',category:'Category',time:'Time',total:'Week total',perDay:'Sessions per day',overall:'Total vaping sessions per day',free:'Vape-free days',duration:'Baseline duration',days:'days',left:'Remaining',notStarted:'Set a start date to begin your baseline.',noEntries:'There are no diary entries for this week yet.',note:'One session equals one saved diary entry. The table is calculated automatically. Entries without a time count toward daily and weekly totals but cannot be assigned to a time slot.',slot:['0 to 6','6 to 12','12 to 18','18 to 24'],sessions:'Sessions',missing:'Entries without time',avg:'Average per calendar day',of:'of 7 days',reached:'30 days reached'},
 fr:{eyebrow:'OBSERVER ET DOCUMENTER',title:'Vapotage contrôlé',sub:'Phase 1 · État des lieux',purpose:'L’objectif du vapotage contrôlé est de vous aider à reprendre le contrôle et à organiser votre vie de manière à en être satisfait.',whatTitle:'Qu’est-ce que le vapotage contrôlé ?',whatIntro:'Avec le vapotage contrôlé, vous suivez un plan que vous avez défini vous-même à l’avance. Chaque semaine, ce plan fixe trois éléments :',dailyTitle:'Quantité maximale quotidienne',dailyText:'Quelle quantité maximale souhaitez-vous vapoter dans chaque catégorie les jours où vous vapotez ?',weeklyTitle:'Maximum hebdomadaire',weeklyText:'Combien de sessions de vapotage souhaitez-vous effectuer au maximum par catégorie chaque semaine ?',freeTitle:'Nombre de jours sans vapotage',freeText:'Combien de jours souhaitez-vous ne pas vapoter ?',moreTitle:'Autres règles personnelles',moreText:'Vous pouvez également définir d’autres règles, par exemple les heures auxquelles vous souhaitez vapoter.',overviewTitle:'Aperçu du vapotage contrôlé',foundation:'Base : tenir un journal de vapotage',program:'Le programme en 12 étapes',afterEnd:'Après la fin',afterText:'Auto-évaluation périodique de sa consommation de vapotage',asNeeded:'Si nécessaire',support:'Offres de soutien complémentaires',steps:['Acquérir les bases du vapotage','Pour et contre le changement','Faire le bilan','Définir des objectifs de consommation','Élaborer des stratégies pour atteindre ses objectifs','Identifier les situations à risque','Gérer les écarts','Profiter de son temps libre','Identifier les sources de stress','Réduire les sources de stress','Apprendre à dire non','Consolider ses réussites'],intro:'Au début, on observe et on documente uniquement. Aucun objectif de réduction n’est encore fixé.',start:'Date de début',save:'Enregistrer la date',week:'Choisir la semaine',prevWeek:'Semaine précédente',nextWeek:'Semaine suivante',category:'Catégorie',time:'Heure',total:'Total semaine',perDay:'Sessions par jour',overall:'Total des sessions par jour',free:'Jours sans vapotage',duration:'Durée de l’observation',days:'jours',left:'Restants',notStarted:'Définis une date de début pour commencer.',noEntries:'Aucune entrée de journal pour cette semaine.',note:'Une session correspond à une entrée enregistrée dans le journal. Les entrées sans heure comptent dans les totaux quotidiens et hebdomadaires, mais pas dans une plage horaire.',slot:['0 à 6','6 à 12','12 à 18','18 à 24'],sessions:'Sessions',missing:'Entrées sans heure',avg:'Moyenne par jour',of:'sur 7 jours',reached:'30 jours atteints'}
 };
 const t=dict[lang]||dict.de;
 const roadmapSteps=t.steps.map((label,i)=>'<button type="button" class="card" data-page="cvStep'+(i+1)+'" style="padding:18px;display:flex;gap:14px;align-items:center;text-align:left;width:100%;cursor:pointer"><span style="flex:0 0 38px;height:38px;border-radius:50%;display:grid;place-items:center;background:var(--primary,#6b9b76);color:white;font-weight:700">'+(i+1)+'</span><strong style="line-height:1.45">'+label+'</strong><span style="margin-left:auto">→</span></button>').join('');
 const localDate=s=>{const p=s.split('-').map(Number);return new Date(p[0],p[1]-1,p[2])};
 const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 const fmt=d=>d.toLocaleDateString(lang==='fr'?'fr-FR':lang==='en'?'en-GB':'de-DE',{weekday:'short',day:'2-digit',month:'2-digit'});
 const weekInput=$('#cv-week')?.value||now(),chosen=localDate(weekInput),monday=new Date(chosen);
 monday.setDate(chosen.getDate()-(chosen.getDay()+6)%7);
 const days=Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return iso(d)});
 const entries=db.entries.filter(e=>days.includes(e.date));
 const categories=[['vaporizer',lang==='en'?'Vaporizer':lang==='fr'?'Vaporisateur':'Vaporizer'],['ecig',lang==='en'?'E-cigarette':lang==='fr'?'Cigarette électronique':'E-Zigarette'],['heater',lang==='en'?'Tobacco heater':lang==='fr'?'Tabac chauffé':'Tabakheater'],['cigarette',lang==='en'?'Cigarette':lang==='fr'?'Cigarette':'Zigarette'],['joint','Joint'],['bong','Bong']].filter(([key])=>isCategoryEnabled(key));
 const bucket=e=>window.MVAControlledVapingUtils.timeBucket(e.time);
 const count=(cat,slot,day)=>entries.filter(e=>(!cat||e.category===cat)&&(!day||e.date===day)&&(slot===-2||bucket(e)===slot)).length;
 const categoryTotals=Object.fromEntries(categories.map(([key])=>[key,days.map(d=>count(key,-2,d))]));
 const dayTotals=days.map(d=>count(null,-2,d)),weekTotal=dayTotals.reduce((x,y)=>x+y,0),freeDays=dayTotals.filter(x=>x===0).length,missing=entries.filter(e=>bucket(e)<0).length;
 const startDate=db.controlledVaping?.startDate||'',started=!!startDate,elapsed=started?Math.max(0,Math.floor((localDate(now())-localDate(startDate))/86400000)+1):0,remaining=Math.max(0,30-elapsed);
 const cells=(values,showZero=false)=>values.map(n=>'<td class="cv-num">'+(n===0&&!showZero?'–':n)+'</td>').join('');
 let table='';
 categories.forEach(([key,label])=>{
  for(let slot=0;slot<4;slot++){
   table+='<tr><td>'+(slot===0?'<strong>'+label+'</strong>':'')+'</td><td>'+t.slot[slot]+'</td>';
   days.forEach(d=>{const n=count(key,slot,d);table+='<td class="cv-num">'+(n||'–')+'</td>'});
   const total=count(key,slot,null);table+='<td class="cv-num cv-total">'+(total||'–')+'</td></tr>';
  }
  const totals=categoryTotals[key],sum=totals.reduce((a,b)=>a+b,0);
  table+='<tr class="cv-category-total"><td colspan="2"><strong>'+label+' '+t.perDay+'</strong></td>'+cells(totals)+'<td class="cv-num cv-total">'+(sum||'–')+'</td></tr><tr class="cv-spacer"><td colspan="10"></td></tr>';
 });
 table+='<tr class="cv-summary-heading"><td colspan="10"><strong>'+t.perDay+' · '+(lang==='en'?'By category':lang==='fr'?'Par catégorie':'nach Kategorie')+'</strong></td></tr>';
 categories.forEach(([key,label])=>{const totals=categoryTotals[key],sum=totals.reduce((a,b)=>a+b,0);table+='<tr class="cv-summary-row"><td colspan="2">'+label+' '+t.perDay+'</td>'+cells(totals)+'<td class="cv-num cv-total">'+(sum||'–')+'</td></tr>'});
 table+='<tr class="cv-day-total"><td colspan="2"><strong>'+t.overall+'</strong></td>'+cells(dayTotals,true)+'<td class="cv-num cv-total">'+weekTotal+'</td></tr>';
 const dayHeaders=days.map(d=>'<th>'+fmt(localDate(d))+'</th>').join('');
 const stats=card(t.sessions,weekTotal,t.total)+card(t.free,freeDays,t.of)+card(t.missing,missing,'')+card(t.perDay,(weekTotal/7).toFixed(1),t.avg);
 const progress=started?'<div class="cv-progress"><div class="row"><b>'+t.duration+': '+elapsed+'/30 '+t.days+'</b><span class="pill">'+(remaining?t.left+' '+remaining+' '+t.days:t.reached)+'</span></div><div class="progress"><i style="width:'+Math.min(100,elapsed/30*100)+'%"></i></div></div>':'<p class="tagline">'+t.notStarted+'</p>';
 v.innerHTML=header(t.eyebrow,t.title,t.sub,'')+
 '<section class="card cv-purpose" style="max-width:780px;margin:22px auto;text-align:center;padding:24px 28px;font-size:16px;font-weight:600;line-height:1.65">'+t.purpose+'</section>'+
 '<section class="cv-what" style="max-width:980px;margin:0 auto 28px"><h2 style="text-align:center;margin:0 0 10px">'+t.whatTitle+'</h2><p style="text-align:center;max-width:780px;margin:0 auto 20px;line-height:1.65">'+t.whatIntro+'</p><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px"><article class="card" style="padding:20px"><div style="font-size:25px;margin-bottom:8px">☀️</div><h3 style="margin:0 0 8px">'+t.dailyTitle+'</h3><p style="margin:0;line-height:1.55">'+t.dailyText+'</p></article><article class="card" style="padding:20px"><div style="font-size:25px;margin-bottom:8px">📅</div><h3 style="margin:0 0 8px">'+t.weeklyTitle+'</h3><p style="margin:0;line-height:1.55">'+t.weeklyText+'</p></article><article class="card" style="padding:20px"><div style="font-size:25px;margin-bottom:8px">🌿</div><h3 style="margin:0 0 8px">'+t.freeTitle+'</h3><p style="margin:0;line-height:1.55">'+t.freeText+'</p></article></div><div class="card" style="max-width:780px;margin:14px auto 0;padding:18px 22px;line-height:1.6"><strong>'+t.moreTitle+'</strong><p style="margin:6px 0 0">'+t.moreText+'</p></div></section>'+
 '<section class="cv-roadmap" style="max-width:980px;margin:0 auto 30px"><h2 style="text-align:center;margin:0 0 18px">'+t.overviewTitle+'</h2><div class="card" style="text-align:center;padding:16px 20px;margin-bottom:18px"><strong>📓 '+t.foundation+'</strong></div><h3 style="text-align:center;margin:0 0 14px">'+t.program+'</h3><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">'+roadmapSteps+'</div><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:18px"><div class="card" style="padding:18px"><strong>🔄 '+t.afterEnd+'</strong><p style="margin:7px 0 0;line-height:1.5">'+t.afterText+'</p></div><div class="card" style="padding:18px"><strong>🤝 '+t.asNeeded+'</strong><p style="margin:7px 0 0;line-height:1.5">'+t.support+'</p></div></div></section>'+
 '<section class="cv-intro card"><span class="pill">PHASE 1</span><p>'+t.intro+'</p><div class="cv-start-row"><label class="formrow"><span>'+t.start+'</span><input class="field" id="cv-start" type="date" value="'+esc(startDate||now())+'"></label><button class="btn primary" id="cv-save-start">'+t.save+'</button></div>'+progress+'</section>'+
 '<div class="row cv-week-row"><div><h3>'+t.category+' · '+t.week+'</h3><p class="subheading">'+t.note+'</p></div><div class="cv-week-picker"><button class="cv-week-arrow" id="cv-week-prev" type="button" aria-label="'+t.prevWeek+'" title="'+t.prevWeek+'">‹</button><label class="formrow"><span>'+t.week+'</span><input class="field" id="cv-week" type="date" value="'+esc(weekInput)+'"></label><button class="cv-week-arrow" id="cv-week-next" type="button" aria-label="'+t.nextWeek+'" title="'+t.nextWeek+'">›</button></div></div>'+
 '<div class="grid stats cv-stats">'+stats+'</div><div class="card cv-table-card"><div class="cv-table-wrap"><table class="cv-table"><thead><tr><th>'+t.category+'</th><th>'+t.time+'</th>'+dayHeaders+'<th>'+t.total+'</th></tr></thead><tbody>'+table+'</tbody></table></div></div>'+
 '<p class="tagline cv-note">'+t.note+'</p>'+(entries.length?'':'<div class="card empty">'+t.noEntries+'<div style="margin-top:12px"><button class="btn soft" data-page="diary">Zum Tagebuch</button></div></div>');

 // Phase 2 bleibt parallel zur Bestandsaufnahme sichtbar und ist sofort bearbeitbar.
 const cv=db.controlledVaping||(db.controlledVaping={});
 const p2=cv.phase2||(cv.phase2={categories:Object.fromEntries(['vaporizer','ecig','heater','cigarette','joint','bong'].map(k=>[k,{enabled:true,maxPerDay:0,maxPerWeek:0,freeDays:0}])),ratings:{}});
 const weekKey=days[0];
 const p2ActiveKeys=categories.filter(([key])=>p2.categories[key]?.enabled).map(([key])=>key);
 const p2WeekTotal=entries.filter(e=>p2ActiveKeys.includes(e.category)).length;
 const p2DayTotals=days.map(d=>entries.filter(e=>e.date===d&&p2ActiveKeys.includes(e.category)).length);
 const p2FreeDays=p2DayTotals.filter(n=>n===0).length;
 const mappings={vaporizer:'Sorte / Material',ecig:'Liquid',heater:'Sticks',cigarette:'Marke',joint:'Mischung',bong:'Sorte / Mischung'};
 const p2Rows=categories.map(([key,label])=>{
  const cfg=p2.categories[key]||(p2.categories[key]={enabled:true,maxPerDay:0,maxPerWeek:0,freeDays:0});
  const selected=entries.filter(e=>e.category===key),total=selected.length,perDay=days.map(d=>selected.filter(e=>e.date===d).length),free=perDay.filter(n=>n===0).length;
  const namesUsed=selected.map(e=>String(e.strain||e.material||'').trim()).filter(Boolean);
  const missingNames=selected.length-namesUsed.length;
  const rating=p2.ratings[weekKey]?.[key]||'';
  return '<div class="card" data-p2-row="'+key+'" style="margin:10px 0;'+(cfg.enabled?'':'display:none')+'"><div class="row"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-p2-enabled="'+key+'" '+(cfg.enabled?'checked':'')+'><strong>'+label+'</strong></label><span class="pill">'+total+' Sessions</span></div><p class="subheading">Erfasste Kategorie: '+mappings[key]+' · '+(namesUsed.length?namesUsed.length+' benannte Sessions':'Noch keine benannten Sessions')+(missingNames?' · '+missingNames+' ohne Angabe':'')+'</p><div class="formgrid"><label class="formrow"><span>Max. Sessions pro Tag</span><input class="field" type="number" min="0" data-p2-day="'+key+'" value="'+Number(cfg.maxPerDay||0)+'"></label><label class="formrow"><span>Max. Sessions pro Woche</span><input class="field" type="number" min="0" data-p2-week="'+key+'" value="'+Number(cfg.maxPerWeek||0)+'"></label><label class="formrow"><span>Ziel: konsumfreie Tage / Woche</span><input class="field" type="number" min="0" max="7" data-p2-free="'+key+'" value="'+Number(cfg.freeDays||0)+'"></label><label class="formrow"><span>Zufriedenheit (1 sehr zufrieden – 7 sehr unzufrieden)</span><select class="field" data-p2-rating="'+key+'"><option value="">Noch nicht bewertet</option>'+Array.from({length:7},(_,i)=>'<option value="'+(i+1)+'" '+(String(rating)===String(i+1)?'selected':'')+'>'+(i+1)+'</option>').join('')+'</select></label></div><p class="tagline">Diese Woche: '+(cfg.maxPerWeek?total+' / '+cfg.maxPerWeek+' Sessions':'Wochenlimit noch nicht gesetzt')+' · '+(cfg.maxPerDay?perDay.filter(n=>n<=cfg.maxPerDay).length+'/7 Tage im Tageslimit':'Tageslimit noch nicht gesetzt')+' · '+free+'/7 konsumfreie Tage (Ziel '+cfg.freeDays+')</p></div>';
 }).join('');
 const phase2Html='<section class="card cv-intro" style="margin-top:18px"><span class="pill">PHASE 2 · AKTIV</span><h2>Zielsetzung & kontrollierter Konsum</h2><p>Lege pro Kategorie realistische Session-Grenzen und konsumfreie Tage fest. Eine Session entspricht einem Tagebucheintrag. Der Gesamtkonsum wird als Anzahl der Sessions gezählt – nicht in Gramm oder Millilitern. Beide Phasen bleiben geöffnet.</p><div class="grid stats"><div class="stat"><small>Sessions diese Woche</small><b>'+p2WeekTotal+'</b></div><div class="stat"><small>Konsumfreie Tage</small><b>'+p2FreeDays+'/7</b></div><div class="stat"><small>Kategorien</small><b>'+categories.length+'</b></div></div>'+p2Rows+'<button class="btn primary" id="cv-p2-save" type="button">Ziele & Bewertungen speichern</button></section>';
 v.insertAdjacentHTML('beforeend',phase2Html);
 $('#cv-p2-save').addEventListener('click',()=>{
  for(const [key] of categories){
   const cfg=p2.categories[key]||(p2.categories[key]={});
   cfg.enabled=$('[data-p2-enabled="'+key+'"]').checked;
   cfg.maxPerDay=Math.max(0,Number($('[data-p2-day="'+key+'"]').value)||0);
   cfg.maxPerWeek=Math.max(0,Number($('[data-p2-week="'+key+'"]').value)||0);
   cfg.freeDays=Math.min(7,Math.max(0,Number($('[data-p2-free="'+key+'"]').value)||0));
   const rating=$('[data-p2-rating="'+key+'"]').value;
   p2.ratings[weekKey]=p2.ratings[weekKey]||{};
   if(rating)p2.ratings[weekKey][key]=Number(rating);else delete p2.ratings[weekKey][key];
  }
  cv.phase2=p2;db.controlledVaping=cv;put();controlledVaping(v);toast('Phase-2-Ziele gespeichert.');
 });
 for(const [key] of categories){
  const toggle=$('[data-p2-enabled="'+key+'"]');
  toggle?.addEventListener('change',()=>{p2.categories[key].enabled=toggle.checked;const row=$('[data-p2-row="'+key+'"]');if(row)row.style.display=toggle.checked?'':'none';db.controlledVaping=cv;put();});
 }
 $('#cv-week').addEventListener('change',()=>controlledVaping(v));
 const shiftWeek=delta=>{const input=$('#cv-week');const selected=localDate(input.value||now());selected.setDate(selected.getDate()+delta*7);input.value=iso(selected);controlledVaping(v)};
 $('#cv-week-prev').addEventListener('click',()=>shiftWeek(-1));
 $('#cv-week-next').addEventListener('click',()=>shiftWeek(1));
 $('#cv-save-start').onclick=()=>{const value=$('#cv-start').value;if(!value)return toast('Bitte ein Startdatum auswählen.');db.controlledVaping={...(db.controlledVaping||{}),startDate:value};put();controlledVaping(v);toast('Startdatum gespeichert.')};
}
async function runCloudAudit(){
 const result=$('#cloud-audit-result'),button=$('#cloud-audit');
 if(!result||!button)return;
 if(!window.MVACloudMigration?.audit){result.textContent='Prüfmodul konnte nicht geladen werden.';return}
 button.disabled=true;result.textContent='Bestand wird lokal und ausschließlich lesend geprüft …';
 try{
  let auditSnapshot=db,sourceLabel='Aktueller lokaler Spielstand',cloudDiffers=false;
  if(storageMode==='cloud'){
   const payload=await cloudRead();
   if(!payload)throw Error('Für dieses Konto wurde noch kein gespeicherter Cloud-Spielstand gefunden.');
   auditSnapshot=await decryptCloud(payload);
   if(!auditSnapshot||typeof auditSnapshot!=='object'||!Array.isArray(auditSnapshot.entries)||!Array.isArray(auditSnapshot.devices))throw Error('Der gespeicherte Cloud-Spielstand hat keine gültige Struktur.');
   sourceLabel='Zuletzt gespeicherter Cloud-Spielstand';
   cloudDiffers=!cloudSnapshotsEqual(auditSnapshot,db);
  }
  const report=await window.MVACloudMigration.audit(auditSnapshot);
  const fmt=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';
  const duplicateText=report.duplicateGroups.length
   ?report.duplicateGroups.slice(0,5).map(group=>group.count+' identische Dateien: '+group.paths.map(path=>path.replace(/^db\./,'')).join(', ')).join(' · ')
   :'Keine byteidentischen Inline-Dateien gefunden.';
  result.innerHTML='<strong>Prüfung abgeschlossen – keine Daten verändert.</strong><br>'+
   esc(sourceLabel)+'<br>'+
   (cloudDiffers?'<span style="color:var(--danger,#b44)">Achtung: Der gespeicherte Cloud-Stand unterscheidet sich vom aktuell angezeigten Spielstand.</span><br>':'')+
   report.inlineMediaCount+' eingebettete Dateien · '+fmt(report.totalInlineBytes)+' Gesamtgröße<br>'+
   report.existingCloudReferenceCount+' vorhandene Cloud-Referenzen · '+report.duplicateGroups.length+' Gruppen mit identischen Dateien<br>'+
   (report.invalidMediaCount?'<span style="color:var(--danger,#b44)">'+report.invalidMediaCount+' ungültige Medienangaben – bitte prüfen.</span><br>':'')+
   '<span>'+esc(duplicateText)+'</span><br><span>Die Prüfung lädt nichts hoch, löscht nichts und ändert keine Referenzen.</span>';
 }catch(error){
  console.error('Lesende Medienprüfung fehlgeschlagen:',error);
  result.textContent='Prüfung fehlgeschlagen: '+(error?.message||'Unbekannter Fehler');
 }finally{button.disabled=false}
}
let cloudMigrationBackupReady=false;
let cloudMigrationBackupLegacySnapshot=null;
async function prepareCloudGroupsMigrationBackup(){
 const result=$('#cloud-groups-migration-result'),button=$('#cloud-groups-backup');
 if(!result||!button)return;
 if(storageMode!=='cloud'||!cloudSession||!cloudKey){result.textContent='Bitte zuerst mit deinem Cloud-Konto anmelden.';return}
 button.disabled=true;result.textContent='Der bisherige Cloud-Spielstand wird gelesen und das vollständige JSON-Backup vorbereitet …';
 try{
  const payload=await cloudRead();
  if(!payload)throw Error('Kein bisheriger Cloud-Spielstand gefunden.');
  let legacy=await decryptCloud(payload);
  const portable=await materializeBackupMedia(legacy);
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  download(new Blob([JSON.stringify(portable,null,2)],{type:'application/json'}),'my-vaping-adventure-vor-cloud-migration-'+stamp+'.json');
  cloudMigrationBackupLegacySnapshot=JSON.parse(JSON.stringify(legacy));
  cloudMigrationBackupReady=true;
  const proceed=$('#cloud-groups-migration-start');
  if(proceed){proceed.hidden=false;proceed.style.display='inline-flex';}
  const entryMerge=$('#cloud-groups-entries-merge');
  if(entryMerge){entryMerge.hidden=false;entryMerge.style.display='inline-flex';}
  const gameXpMerge=$('#cloud-groups-game-xp-merge');
  if(gameXpMerge){gameXpMerge.hidden=false;gameXpMerge.style.display='inline-flex';}
  result.textContent='JSON-Backup wurde zum Download angeboten. Bitte sichere die Datei auf deinem Gerät. Erst danach kannst du ausdrücklich die Migrationsprüfung starten.';
 }catch(error){
  cloudMigrationBackupReady=false;cloudMigrationBackupLegacySnapshot=null;
  result.textContent='Backup konnte nicht erstellt werden: '+(error?.message||'Unbekannter Fehler')+'. Es wurde nichts migriert.';
 }finally{button.disabled=false}
}
async function mergeMissingDiaryEntries(){
 const result=$('#cloud-groups-migration-result'),button=$('#cloud-groups-entries-merge');
 if(!result||!button)return;
 if(!cloudMigrationBackupReady||!cloudMigrationBackupLegacySnapshot){result.textContent='Bitte zuerst erneut ein vollständiges JSON-Backup erstellen und auf deinem Gerät sichern.';return}
 if(storageMode!=='cloud'||!cloudSession||!cloudKey){result.textContent='Bitte zuerst mit deinem Cloud-Konto angemeldet bleiben.';return}
 button.disabled=true;result.textContent='Sicherheitsprüfung läuft. Es werden noch keine Daten geschrieben …';
 try{
  const payload=await cloudRead();
  if(!payload)throw Error('Der bisherige Cloud-Spielstand ist nicht mehr vorhanden.');
  const legacy=await decryptCloud(payload);
  if(!cloudSnapshotsEqual(legacy,cloudMigrationBackupLegacySnapshot)){
   cloudMigrationBackupReady=false;cloudMigrationBackupLegacySnapshot=null;
   throw Error('Der alte Cloud-Spielstand hat sich seit dem Backup geändert. Bitte zuerst ein neues JSON-Backup erstellen.');
  }
  const oldEntries=legacy.entries;
  if(!Array.isArray(oldEntries))throw Error('Die Tagebucheinträge im alten Spielstand sind keine gültige Liste.');
  const access=createCloudDataAccess();
  const current=await access.read('entries');
  if(!current.exists||!Array.isArray(current.data))throw Error('Die getrennte Tagebuchgruppe fehlt oder ist ungültig. Es wird nichts angelegt.');
  const idOf=e=>e&&e.id!==undefined&&e.id!==null&&String(e.id)!==''?String(e.id):null;
  const oldIds=oldEntries.map(idOf),newIds=current.data.map(idOf);
  if(oldIds.some(x=>x===null)||newIds.some(x=>x===null))throw Error('Mindestens ein Eintrag besitzt keine eindeutige ID. Bitte keine automatische Übernahme.');
  if(new Set(oldIds).size!==oldIds.length||new Set(newIds).size!==newIds.length)throw Error('Doppelte Eintrags-IDs gefunden. Sicherheitsstopp.');
  const oldMap=new Map(oldEntries.map(e=>[idOf(e),e]));
  const newMap=new Map(current.data.map(e=>[idOf(e),e]));
  const changed=[...newMap.keys()].filter(id=>!oldMap.has(id)||!cloudSnapshotsEqual(oldMap.get(id),newMap.get(id)));
  if(changed.length)throw Error('Die getrennte Tagebuchgruppe enthält eigene oder abweichende Einträge ('+changed.length+'). Es wird nichts überschrieben.');
  const missing=oldEntries.filter(e=>!newMap.has(idOf(e)));
  if(!missing.length){result.textContent='Alle Tagebucheinträge sind bereits vorhanden. Es wurde nichts geschrieben.';return}
  if(oldEntries.length!==78||current.data.length!==70||missing.length!==8)throw Error('Der Bestand hat sich seit der letzten Prüfung verändert (Altbestand '+oldEntries.length+', getrennt '+current.data.length+', fehlend '+missing.length+'). Bitte zuerst erneut prüfen.');
  const merged=[...missing,...current.data];
  if(!confirm('Es werden genau '+missing.length+' fehlende Tagebucheinträge ergänzt. Die '+current.data.length+' vorhandenen Einträge bleiben unverändert. Andere Datengruppen und XP werden nicht verändert. Fortfahren?')){result.textContent='Übernahme abgebrochen. Es wurde nichts geschrieben.';return}
  result.textContent='Die acht fehlenden Einträge werden verschlüsselt ergänzt und anschließend erneut gelesen …';
  await access.write('entries',merged,current.revision);
  const verified=await access.read('entries');
  if(!verified.exists||!Array.isArray(verified.data)||verified.data.length!==oldEntries.length||!cloudSnapshotsEqual(verified.data,merged)){
   throw Error('Die Rückleseprüfung der Tagebuchgruppe ist fehlgeschlagen. Bitte nicht erneut starten; zuerst den Status prüfen.');
  }
  result.textContent='Erfolgreich: 8 fehlende Tagebucheinträge wurden ergänzt. Alle 78 Einträge wurden erneut entschlüsselt und geprüft. Die 70 vorhandenen Einträge blieben inhaltlich unverändert. Alter Cloud-Spielstand, Medien, XP und alle anderen Datengruppen wurden nicht verändert.';
 }catch(error){
  console.error('Sichere Ergänzung fehlender Tagebucheinträge fehlgeschlagen:',error);
  result.textContent='Übernahme gestoppt: '+(error?.message||'Unbekannter Fehler')+'. Der alte Cloud-Spielstand wurde nicht überschrieben.';
 }finally{button.disabled=false}
}
async function mergeLegacyGameXpOnly(){
 const result=$('#cloud-groups-migration-result'),button=$('#cloud-groups-game-xp-merge');
 if(!result||!button)return;
 if(!cloudMigrationBackupReady||!cloudMigrationBackupLegacySnapshot){result.textContent='Bitte zuerst über „JSON-Backup erstellen“ ein neues vollständiges Backup erstellen und sichern.';return}
 if(storageMode!=='cloud'||!cloudSession||!cloudKey){result.textContent='Bitte zuerst mit deinem Cloud-Konto angemeldet bleiben.';return}
 button.disabled=true;result.textContent='XP-Sicherheitsprüfung läuft. Es werden zunächst ausschließlich Daten gelesen …';
 try{
  const payload=await cloudRead();
  if(!payload)throw Error('Der bisherige Cloud-Spielstand ist nicht mehr vorhanden.');
  const legacy=await decryptCloud(payload);
  if(!cloudSnapshotsEqual(legacy,cloudMigrationBackupLegacySnapshot)){
   cloudMigrationBackupReady=false;cloudMigrationBackupLegacySnapshot=null;
   throw Error('Der alte Cloud-Spielstand hat sich seit dem Backup geändert. Bitte zuerst ein neues JSON-Backup erstellen.');
  }
  const oldGame=legacy.game;
  if(!oldGame||typeof oldGame!=='object'||Array.isArray(oldGame)||!Number.isFinite(oldGame.xp))throw Error('Der XP-Wert im alten Spielstand fehlt oder ist ungültig.');
  const access=createCloudDataAccess();
  const current=await access.read('game');
  if(!current.exists||!current.data||typeof current.data!=='object'||Array.isArray(current.data)||!Number.isFinite(current.data.xp))throw Error('Die getrennte Spielgruppe fehlt oder ihr XP-Wert ist ungültig.');
  const withoutXp=value=>{const copy=JSON.parse(JSON.stringify(value));delete copy.xp;return copy};
  if(!cloudSnapshotsEqual(withoutXp(oldGame),withoutXp(current.data)))throw Error('Außer XP unterscheiden sich weitere Felder in „game“. Sicherheitsstopp: Es wird nichts geschrieben.');
  if(current.data.xp===oldGame.xp){result.textContent='Die XP-Werte stimmen bereits überein ('+current.data.xp+'). Es wurde nichts geschrieben.';return}
  if(oldGame.xp!==123||current.data.xp!==96)throw Error('Die erwarteten Werte haben sich geändert (Altbestand '+oldGame.xp+', getrennt '+current.data.xp+'). Bitte zuerst den Nur-Lese-Abgleich erneut ausführen.');
  const merged={...current.data,xp:oldGame.xp};
  if(!confirm('Es wird ausschließlich der XP-Wert von '+current.data.xp+' auf '+oldGame.xp+' gesetzt. Coins, Quests, Kurse und alle anderen Felder bleiben unverändert. Fortfahren?')){result.textContent='XP-Korrektur abgebrochen. Es wurde nichts geschrieben.';return}
  result.textContent='Nur der XP-Wert wird verschlüsselt gespeichert und anschließend erneut gelesen …';
  await access.write('game',merged,current.revision);
  const verified=await access.read('game');
  if(!verified.exists||!cloudSnapshotsEqual(verified.data,merged))throw Error('Die Rückleseprüfung der Spielgruppe ist fehlgeschlagen. Bitte nicht erneut starten; zuerst den Status prüfen.');
  result.textContent='Erfolgreich: XP wurde von 96 auf 123 korrigiert und erneut entschlüsselt geprüft. Coins, Quests, Kurse und alle anderen Felder der Spielgruppe blieben unverändert. Alter Cloud-Spielstand, Tagebuch, Medien und alle anderen Datengruppen wurden nicht verändert.';
 }catch(error){
  console.error('Gezielte XP-Korrektur fehlgeschlagen:',error);
  result.textContent='XP-Korrektur gestoppt: '+(error?.message||'Unbekannter Fehler')+'. Der alte Cloud-Spielstand wurde nicht überschrieben.';
 }finally{button.disabled=false}
}
async function runCloudGroupsMigration(){
 const result=$('#cloud-groups-migration-result'),button=$('#cloud-groups-migration-start');
 if(!result||!button)return;
 if(!cloudMigrationBackupReady||!cloudMigrationBackupLegacySnapshot){result.textContent='Bitte zuerst ein vollständiges JSON-Backup erstellen und sichern.';return}
 if(storageMode!=='cloud'||!cloudSession||!cloudKey){result.textContent='Bitte zuerst mit deinem Cloud-Konto anmelden.';return}
 if(!window.MVACloudMigrationCodec?.split||!window.MVACloudMigration?.audit){result.textContent='Die Migrationsmodule wurden nicht vollständig geladen.';return}
 button.disabled=true;result.textContent='Sicherheitsprüfung läuft. Es werden zunächst nur Daten gelesen …';
 try{
  const payload=await cloudRead();
  if(!payload)throw Error('Der bisherige Cloud-Spielstand ist nicht mehr vorhanden.');
  let legacy=await decryptCloud(payload);
  if(!cloudSnapshotsEqual(legacy,cloudMigrationBackupLegacySnapshot)){
   cloudMigrationBackupReady=false;cloudMigrationBackupLegacySnapshot=null;
   throw Error('Der bisherige Cloud-Spielstand hat sich seit dem Backup geändert. Bitte zuerst ein neues Backup erstellen.');
  }
  let media=await window.MVACloudMigration.audit(legacy);
  if(media.invalidMediaCount>0)throw Error('Das Backup enthält '+media.invalidMediaCount+' ungültige Medienangabe(n). Bitte zuerst den Medienbestand prüfen.');
  if(media.inlineMediaCount>0){
   if(!window.MVACloudMediaMigration?.migrate)throw Error('Das Medienmigrationsmodul wurde nicht geladen. Es wurde noch nichts übertragen.');
   result.textContent=media.inlineMediaCount+' eingebettete Foto-/PDF-Datei(en) werden jetzt einzeln clientseitig verschlüsselt hochgeladen und durch entschlüsseltes Zurücklesen geprüft …';
   const mediaAccess=createCloudMediaResolver();
   const migrated=await window.MVACloudMediaMigration.migrate(legacy,(blob,options)=>mediaAccess.media.uploadVerified(blob,options));
   legacy=migrated.snapshot;
   media=await window.MVACloudMigration.audit(legacy);
   if(media.invalidMediaCount>0||media.inlineMediaCount>0)throw Error('Nach dem Medienupload sind noch '+media.inlineMediaCount+' eingebettete und '+media.invalidMediaCount+' ungültige Medienangabe(n) vorhanden. Datengruppen werden nicht geschrieben.');
   result.textContent=migrated.stats.uploadedCount+' Mediendatei(en) verschlüsselt hochgeladen und verifiziert; '+migrated.stats.reusedCount+' byteidentische Datei(en) wiederverwendet. Die Datengruppen werden jetzt geprüft …';
  }
  const expected=window.MVACloudMigrationCodec.split(legacy);
  const access=createCloudDataAccess();
  const before=await access.readAll();
  const comparison=window.MVACloudMigrationCodec.compare(legacy,before);
  if(comparison.mismatched.length){
   throw Error('Sicherheitsstopp: Bereits vorhandene getrennte Datengruppen weichen vom bisherigen Spielstand ab ('+comparison.mismatched.join(', ')+'). Diese möglichen neueren Daten werden nicht überschrieben. Bitte erst einzeln prüfen.');
  }
  const toCreate=comparison.missing;
  if(!toCreate.length){
   result.textContent='Alle sieben Datengruppen sind bereits vorhanden und stimmen überein. Es wurde nichts geschrieben.';
   return;
  }
  result.textContent=toCreate.length+' fehlende Datengruppe(n) werden einzeln verschlüsselt übertragen und direkt überprüft …';
  for(const type of toCreate){
   // Die Vorprüfung hat diese Gruppe als fehlend erkannt. Schreibe atomar nur
   // mit erwarteter Revision 0: Ein zwischenzeitlich angelegter Datensatz
   // muss einen Versionskonflikt auslösen und darf niemals überschrieben werden.
   await access.write(type,expected[type],0);
   const verified=await access.read(type);
   if(!verified.exists||!cloudSnapshotsEqual(verified.data,expected[type])){
    throw Error('Read-back-Prüfung für „'+type+'“ fehlgeschlagen. Die Legacy-Sicherung bleibt unverändert; bitte Status prüfen, bevor du erneut startest.');
   }
  }
  const after=await access.readAll();
  const finalReport=window.MVACloudMigrationCodec.compare(legacy,after);
  if(!finalReport.complete)throw Error('Nachprüfung unvollständig. Fehlend: '+finalReport.missing.join(', ')+'; abweichend: '+finalReport.mismatched.join(', ')+'. Der bisherige Cloud-Spielstand bleibt erhalten.');
  result.textContent='Erfolgreich: Alle sieben Datengruppen stimmen nach erneutem Lesen und Entschlüsseln mit dem bisherigen Cloud-Spielstand überein. Die Legacy-Sicherung wurde nicht verändert.';
 }catch(error){
  console.error('Sichere Migration der Cloud-Datengruppen fehlgeschlagen:',error);
  result.textContent='Migration gestoppt: '+(error?.message||'Unbekannter Fehler')+'. Der bisherige Cloud-Spielstand wurde nicht gelöscht oder überschrieben.';
 }finally{button.disabled=false}
}
function cloudGroupDifferencePaths(a,b,limit=10){
 const paths=[];
 const walk=(left,right,path)=>{
  if(paths.length>=limit)return;
  if(Array.isArray(left)||Array.isArray(right)){
   if(!Array.isArray(left)||!Array.isArray(right)){paths.push(path+" (unterschiedlicher Datentyp)");return}
   if(left.length!==right.length)paths.push(path+".length ("+left.length+" / "+right.length+")");
   const n=Math.min(left.length,right.length);
   for(let i=0;i<n&&paths.length<limit;i++)walk(left[i],right[i],path+"["+i+"]");
   return;
  }
  const lo=left&&typeof left==="object",ro=right&&typeof right==="object";
  if(lo||ro){
   if(!lo||!ro){paths.push(path+" (unterschiedlicher Datentyp)");return}
   const keys=[...new Set([...Object.keys(left),...Object.keys(right)])].sort();
   for(const key of keys){
    if(paths.length>=limit)break;
    if(!Object.prototype.hasOwnProperty.call(left,key)||!Object.prototype.hasOwnProperty.call(right,key)){paths.push(path+"."+key+" (fehlt auf einer Seite)");continue}
    walk(left[key],right[key],path+"."+key);
   }
   return;
  }
  if(left!==right)paths.push(path+" (Wert weicht ab)");
 };
 walk(a,b,"$");
 return paths;
}
function cloudGameDifferenceDetails(a,b,limit=16){
 const details=[];
 const format=value=>{
  let text=JSON.stringify(value);
  if(text===undefined)text=String(value);
  return text.length>120?text.slice(0,117)+"…":text;
 };
 const walk=(left,right,path)=>{
  if(details.length>=limit)return;
  const lo=left&&typeof left==="object",ro=right&&typeof right==="object";
  if(lo||ro){
   if(!lo||!ro||Array.isArray(left)!==Array.isArray(right)){
    details.push(path+": Altbestand "+format(left)+" / getrennt "+format(right));return;
   }
   if(Array.isArray(left)){
    if(left.length!==right.length)details.push(path+".length: Altbestand "+left.length+" / getrennt "+right.length);
    const n=Math.min(left.length,right.length);
    for(let i=0;i<n&&details.length<limit;i++)walk(left[i],right[i],path+"["+i+"]");
    return;
   }
   const keys=[...new Set([...Object.keys(left),...Object.keys(right)])].sort();
   for(const key of keys){
    if(details.length>=limit)break;
    if(!Object.prototype.hasOwnProperty.call(left,key)||!Object.prototype.hasOwnProperty.call(right,key)){
     details.push(path+"."+key+": fehlt "+(!Object.prototype.hasOwnProperty.call(left,key)?"im Altbestand":"in der getrennten Gruppe"));
    }else walk(left[key],right[key],path+"."+key);
   }
   return;
  }
  if(left!==right)details.push(path+": Altbestand "+format(left)+" / getrennt "+format(right));
 };
 walk(a,b,"game");
 return details;
}
function cloudGroupSize(value){
 if(Array.isArray(value))return value.length+" Einträge";
 if(value&&typeof value==="object")return Object.keys(value).length+" Felder";
 return typeof value;
}
function cloudEntryAudit(oldEntries,newEntries){
 const identity=e=>e&&e.id!==undefined&&e.id!==null&&String(e.id)!=="";
 const oldIds=oldEntries.filter(identity),newIds=newEntries.filter(identity);
 const oldMap=new Map(oldIds.map(e=>[String(e.id),e])),newMap=new Map(newIds.map(e=>[String(e.id),e]));
 const onlyOld=[...oldMap.keys()].filter(id=>!newMap.has(id));
 const onlyNew=[...newMap.keys()].filter(id=>!oldMap.has(id));
 const changed=[];
 for(const [id,oldEntry] of oldMap){
  if(!newMap.has(id))continue;
  const paths=cloudGroupDifferencePaths(oldEntry,newMap.get(id),6);
  if(paths.length)changed.push({paths});
 }
 const duplicateCount=arr=>arr.length-new Set(arr.map(e=>String(e.id))).size;
 return {
  oldCount:oldEntries.length,newCount:newEntries.length,
  oldWithId:oldIds.length,newWithId:newIds.length,
  oldWithoutId:oldEntries.length-oldIds.length,newWithoutId:newEntries.length-newIds.length,
  oldDuplicates:duplicateCount(oldIds),newDuplicates:duplicateCount(newIds),
  onlyOld:onlyOld.length,onlyNew:onlyNew.length,changed:changed.length,
  onlyOldDetails:onlyOld.map(id=>oldMap.get(id)).map(entry=>{
   const fields=["device","strain","puffs","duration","temp","wattage","nicotine","vg","pg","liquid","brand","pure","location","taste","notes","vaporizerFill","materialId","stickType"];
   const populated=fields.filter(key=>entry[key]!==undefined&&entry[key]!==null&&String(entry[key]).trim()!=="");
   const dateValues=[];
   const scan=value=>{
    if(!value||typeof value!=="object")return;
    for(const [key,item] of Object.entries(value)){
     if(/date|created|timestamp|time|datum/i.test(key)){
      if(typeof item==="string"){
       const match=item.match(/\d{4}-\d{2}-\d{2}/)||item.match(/\d{2}\.\d{2}\.\d{4}/);
       if(match)dateValues.push(match[0]);
       else {const parsed=Date.parse(item);if(!Number.isNaN(parsed))dateValues.push(new Date(parsed).toISOString().slice(0,10))}
      }else if(typeof item==="number"&&item>1000000000){
       const parsed=new Date(item>99999999999?item:item*1000);
       if(!Number.isNaN(parsed.getTime()))dateValues.push(parsed.toISOString().slice(0,10));
      }else if(item&&typeof item==="object")scan(item);
     }else if(item&&typeof item==="object")scan(item);
    }
   };
   scan(entry);
   const textLength=typeof entry.notes==="string"?entry.notes.trim().length:0;
   return {
    date:[...new Set(dateValues)].join("/")||"kein lesbares Datum",
    time:typeof entry.time==="string"&&entry.time.trim()?entry.time:"keine Uhrzeit",
    category:typeof entry.category==="string"&&entry.category.trim()?entry.category:"keine Kategorie",
    filledDetailFields:populated.length,
    presentFields:populated,
    notesLength:textLength,
    hasDevice:!!String(entry.device||"").trim(),
    hasMaterial:!!String(entry.strain||entry.liquid||entry.brand||entry.stickType||"").trim(),
    hasUsageMeasure:!!String(entry.duration||entry.puffs||"").trim(),
    hasNotes:textLength>0
   };
  }),
  samplePaths:changed[0]?.paths||[]
 };
}
function cloudMediaKind(value){
 if(value===null||value===undefined||value==="")return "leer";
 if(isCloudMediaReference(value))return "Cloud-Referenz";
 if(typeof value==="string"&&value.startsWith("data:")){
  const mime=value.slice(5,value.indexOf(";")>0?value.indexOf(";"):value.indexOf(",")).toLowerCase();
  if(mime.startsWith("image/"))return "eingebettetes Bild";
  if(mime==="application/pdf")return "eingebettetes PDF";
  return "eingebettete Datei";
 }
 if(typeof value==="string")return "sonstige Zeichenkette";
 if(typeof value==="object")return "sonstiges Objekt";
 return "anderer Datentyp";
}
function cloudMediaAudit(snapshot){
 const counts={"eingebettetes Bild":0,"eingebettetes PDF":0,"eingebettete Datei":0,"Cloud-Referenz":0,"sonstige Zeichenkette":0,"sonstiges Objekt":0,"anderer Datentyp":0};
 const fields=[],seen=new WeakSet();
 const walk=(value,path)=>{
  if(value===null||value===undefined||value==="")return;
  if(isCloudMediaReference(value)){
   counts["Cloud-Referenz"]++;fields.push(path+" = Cloud-Referenz");return;
  }
  if(typeof value==="string"){
   if(value.startsWith("data:")){
    const semicolon=value.indexOf(";"),comma=value.indexOf(",");
    const stop=semicolon>0?semicolon:comma;
    const mime=(stop>0?value.slice(5,stop):"").toLowerCase();
    const kind=mime.startsWith("image/")?"eingebettetes Bild":mime==="application/pdf"?"eingebettetes PDF":"eingebettete Datei";
    counts[kind]++;fields.push(path+" = "+kind);
   }else if(value.length>0&&/(photo|image|manual|pdf|src|media)/i.test(path)){
    counts["sonstige Zeichenkette"]++;fields.push(path+" = sonstige Zeichenkette");
   }
   return;
  }
  if(!value||typeof value!=="object"||seen.has(value))return;
  seen.add(value);
  if(Array.isArray(value)){value.forEach((item,index)=>walk(item,path+"["+index+"]"));return}
  for(const [key,item] of Object.entries(value))walk(item,path+"."+key);
 };
 walk(snapshot,"$");
 return {counts,fields:fields.slice(0,12),total:Object.values(counts).reduce((sum,n)=>sum+n,0)};
}
async function runCloudGroupsAudit(){
 const result=$('#cloud-groups-audit-result'),button=$('#cloud-groups-audit');
 if(!result||!button)return;
 if(storageMode!=='cloud'||!cloudSession||!cloudKey){result.textContent='Bitte zuerst mit deinem Cloud-Konto anmelden.';return}
 if(!window.MVACloudMigrationCodec?.compare){result.textContent='Prüfmodul für Datengruppen wurde nicht geladen.';return}
 button.disabled=true;result.textContent='Vergleich läuft – es werden ausschließlich Daten gelesen …';
 let auditStage='Cloud-Spielstand lesen';
 try{
  const legacyPayload=await cloudRead();
  if(!legacyPayload)throw Error('Kein bisheriger Cloud-Spielstand gefunden.');
  let legacySnapshot;
  auditStage='Bisherigen Cloud-Spielstand entschlüsseln';
  try{legacySnapshot=await decryptCloud(legacyPayload)}
  catch(error){throw Error('Entschlüsselung des bisherigen Cloud-Spielstands fehlgeschlagen: '+(error?.message||'Unbekannter Fehler'))}
  auditStage='Getrennte Datengruppen lesen';
  const records=await createCloudDataAccess().readAll();
  auditStage='Datengruppen vergleichen';
  const report=window.MVACloudMigrationCodec.compare(legacySnapshot,records);
  if(!report||!Array.isArray(report.mismatched)||!Array.isArray(report.missing))throw Error('Das Prüfmodul hat keine vollständige Vergleichsliste geliefert.');
  if(report.existingCount===0){
   result.textContent='Noch keine getrennten Datengruppen gefunden. Der bisherige Cloud-Spielstand bleibt unverändert; es wurde nichts migriert.';
  }else if(report.complete){
   result.textContent='Alle sieben Datengruppen stimmen vollständig mit dem bisherigen Cloud-Spielstand überein. Nur-Lese-Prüfung erfolgreich – keine Daten wurden geschrieben.';
  }else{
   auditStage='Medienbestand und Datengruppen auswerten';
   const expected=window.MVACloudMigrationCodec.split(legacySnapshot),lines=[];
   const separateSnapshot=window.MVACloudMigrationCodec.join(records);
   const legacyMedia=cloudMediaAudit(legacySnapshot),separateMedia=cloudMediaAudit(separateSnapshot);
   const mediaSummary=obj=>Object.entries(obj.counts).filter(([,n])=>n).map(([k,n])=>n+" "+k).join(", ")||"keine eingebetteten Medienwerte";
   lines.push("Medien gesamt – Altbestand: "+mediaSummary(legacyMedia)+"; getrennte Gruppen: "+mediaSummary(separateMedia)+". "+(legacyMedia.fields.length?"Pfade Altbestand: "+legacyMedia.fields.join("; ")+". ":"")+(separateMedia.fields.length?"Pfade getrennte Gruppen: "+separateMedia.fields.join("; ")+".":""));
   for(const type of report.mismatched){
    const legacy=expected[type],current=records[type]?.data;
    if(type==='entries'){
     if(!Array.isArray(legacy)||!Array.isArray(current))throw Error('Die Eintragsgruppe liegt nicht als gültige Liste vor (Altbestand: '+(Array.isArray(legacy)?'Liste':'kein Listenwert')+', getrennte Gruppe: '+(Array.isArray(current)?'Liste':'kein Listenwert')+').');
     const d=cloudEntryAudit(legacy,current);
      const details=(d.onlyOldDetails||[]).map((item,index)=>'Nr. '+(index+1)+' ['+item.date+', '+item.time+', '+item.category+']: '+item.filledDetailFields+' ausgefüllte Detailfelder ('+item.presentFields.join(', ')+'); Gerät '+(item.hasDevice?'ja':'nein')+', Material '+(item.hasMaterial?'ja':'nein')+', Dauer/Züge '+(item.hasUsageMeasure?'ja':'nein')+', Notizen '+(item.hasNotes?'ja ('+item.notesLength+' Zeichen)':'nein')).join(' | ');
      lines.push('Einträge: Altbestand '+d.oldCount+', getrennte Gruppe '+d.newCount+'. ID-Abgleich: '+d.oldWithId+'/'+d.oldCount+' und '+d.newWithId+'/'+d.newCount+' mit ID; nur im Altbestand '+d.onlyOld+', nur in der getrennten Gruppe '+d.onlyNew+', gleiche ID aber andere Felder '+d.changed+'. Ohne ID: '+d.oldWithoutId+'/'+d.newWithoutId+'; doppelte IDs: '+d.oldDuplicates+'/'+d.newDuplicates+'.'+(details?' Details der fehlenden Alt-Einträge: '+details+'.':'')+(d.samplePaths?.length?' Beispiel abweichender Felder bei einer gleichen ID: '+d.samplePaths.join('; ')+'.':''));
    }else if(type==='devices'||type==='photos'){
     lines.push(type+': Altbestand '+cloudGroupSize(legacy)+', getrennte Gruppe '+cloudGroupSize(current)+'.');
    }else if(type==='game'){
     const oldXp=legacy?.xp,newXp=current?.xp;
     const gameDetails=cloudGameDifferenceDetails(legacy,current);
     lines.push('game: XP Altbestand '+String(oldXp??'nicht vorhanden')+', getrennte Gruppe '+String(newXp??'nicht vorhanden')+'. Vollständige Feldabweichungen: '+(gameDetails.join('; ')||'keine weiteren Feldabweichungen')+'.');
    }else{
     const paths=cloudGroupDifferencePaths(legacy,current);
     lines.push(type+': Altbestand '+cloudGroupSize(legacy)+', getrennte Gruppe '+cloudGroupSize(current)+'. Unterschiede: '+(paths.join('; ')||'Inhalt weicht ab')+'.');
    }
   }
   const missing=report.missing.length?'Fehlende Gruppen: '+report.missing.join(', ')+'. ':'';
   result.textContent='Noch keine vollständige Übereinstimmung. '+missing+lines.join(' ')+' Der bisherige Cloud-Spielstand wurde nicht verändert. Diese Detailprüfung hat ausschließlich gelesen.';
  }
 }catch(error){
  console.error('Read-only-Abgleich der Cloud-Datengruppen fehlgeschlagen:',error);
  result.textContent='Datengruppen konnten nicht geprüft werden (Schritt: '+auditStage+'): '+(error?.message||'Unbekannter Fehler')+'. Es wurde nichts geschrieben.';
 }finally{button.disabled=false}
}
function backup(v){const t=localeText,counts={entries:db.entries.length,devices:db.devices.length,strains:db.strains.length,photos:db.photos.length};const countText=t('storage.counts',counts);const dataBytes=new Blob([JSON.stringify(db)]).size;const mediaValues=[...db.photos.map(p=>p.src||''),...db.devices.map(d=>d.photo||''),...db.devices.map(d=>d.manualData||'')];const mediaBytes=mediaValues.reduce((sum,value)=>{if(isCloudMediaReference(value))return sum+(Number(value.size)||0);const base64=String(value).split(',')[1]||'';return sum+(base64.length?Math.max(0,Math.floor(base64.length*3/4)-(base64.endsWith('==')?2:base64.endsWith('=')?1:0)):0)},0);const formatBytes=value=>value<1024?`${value} B`:value<1048576?`${(value/1024).toFixed(1)} KB`:`${(value/1048576).toFixed(2)} MB`;const payloadTemplate=cloudEnvelope?{v:2,envelope:cloudEnvelope,iv:'A'.repeat(16),ciphertext:''}:{v:1,salt:b64(cloudSalt||new Uint8Array(16)),iv:'A'.repeat(16),ciphertext:''};const encryptedEstimate=JSON.stringify(payloadTemplate).length+4*Math.ceil((dataBytes+16)/3);const mediaSummary=t('storage.mediaSummary',{total:formatBytes(dataBytes),media:formatBytes(mediaBytes),files:mediaValues.filter(Boolean).length,encrypted:formatBytes(encryptedEstimate)});const cloudCard=storageMode==='cloud'? `<div class="card"><span class="pill">${t('storage.activeEncrypted')}</span><h3 style="font:700 16px Manrope">${t('storage.cloudAccount',{account:esc(cloudSession?.username||'')})}</h3><p class="subheading">${t('storage.encryption')}</p><div class="formrow" style="margin:14px 0"><label for="cloud-change-email">${t('storage.email')}</label><input class="field" id="cloud-change-email" type="email" autocomplete="email" maxlength="254" value="${esc(cloudSession?.email||'')}" placeholder="name@example.com"></div><button class="btn soft" data-action="cloud-change-email">${t('storage.emailRequest')}</button><p class="tagline">${t('storage.accountKept')}</p><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><h3 style="font:700 16px Manrope">${t('storage.changePassword')}</h3><p class="subheading">${t('storage.passwordDescription')}</p><div class="formrow" style="margin:12px 0"><label for="cloud-current-password">${t('storage.oldPassword')}</label><input class="field" id="cloud-current-password" type="password" autocomplete="current-password"></div><div class="formrow" style="margin:12px 0"><label for="cloud-new-password">${t('storage.newPassword')}</label><input class="field" id="cloud-new-password" type="password" autocomplete="new-password" minlength="8"></div><div class="formrow" style="margin:12px 0"><label for="cloud-confirm-password">${t('storage.repeatPassword')}</label><input class="field" id="cloud-confirm-password" type="password" autocomplete="new-password" minlength="8"></div><button class="btn primary" id="cloud-password-save" data-action="cloud-change-password">${t('storage.changePassword')}</button><button class="btn" data-action="switch-local">${t('storage.switchLocal')}</button></div>`:`<div class="card"><span class="pill">${t('storage.optional')}</span><h3 style="font:700 16px Manrope">${t('storage.encryptedCloud')}</h3><p class="subheading">${t('storage.cloudLoginDescription')}</p>${cloudReady()?'':`<p class="tagline" style="color:#9b5c27">${t('storage.setup')}</p>`}<div class="formrow" style="margin:13px 0 8px"><label for="cloud-email">${t('storage.emailLegacy')}</label><input class="field" id="cloud-email" type="text" autocomplete="username" maxlength="254" placeholder="name@example.com oder username" ${cloudReady()?'':'disabled'}></div><div class="formrow" style="margin:8px 0 12px"><label for="cloud-pass">${t('storage.password')}</label><input class="field" id="cloud-pass" type="password" autocomplete="current-password" minlength="8" ${cloudReady()?'':'disabled'}></div><button class="btn primary" id="cloud-connect" data-action="cloud-login" ${cloudReady()?'':'disabled'}>${t('storage.login')}</button> <button class="btn soft" data-action="cloud-signup" ${cloudReady()?'':'disabled'}>${t('storage.register')}</button> <button class="text-btn" data-action="cloud-reset" ${cloudReady()?'':'disabled'}>${t('storage.forgot')}</button><p class="tagline">${t('storage.confirmation')}</p></div>`;v.innerHTML=`${header(t('storage.eyebrow'),t('storage.title'),t('storage.subtitle'),'')}<div class="grid cards2" style="margin-top:23px"><div class="card" style="grid-column:1/-1;border:1px solid var(--accent);background:linear-gradient(135deg,var(--card),var(--surface))"><span class="pill">${storageMode==='cloud'?t('storage.cloudActive'):t('storage.localActive')}</span><h3 style="font:700 18px Manrope;margin:12px 0 6px">${t('storage.diary')}</h3><p class="subheading">${storageMode==='cloud'?t('storage.cloudDescription',{account:esc(cloudSession?.username||'your account')}):t('storage.localDescription')}</p><div class="tagline" style="font-weight:700;margin-top:12px">${countText}</div></div><div class="card"><span class="pill">${t('storage.mediaPill')}</span><h3 style="font:700 16px Manrope">${t('storage.mediaTitle')}</h3><p class="subheading">${mediaSummary}</p><p class="tagline">${t('storage.mediaHint')}</p></div><div class="card"><span class="pill">VORBEREITUNG 1.4.2</span><h3 style="font:700 16px Manrope">Medienbestand prüfen</h3><p class="subheading">Prüft den zuletzt gespeicherten Cloud-Spielstand direkt oder – ohne Cloud-Anmeldung – den lokalen Spielstand. Fotos, Gerätebilder und PDF-Anleitungen werden gezählt und verglichen; es wird nichts verändert.</p><button class="btn soft" id="cloud-audit" type="button">Bestand jetzt prüfen</button><div id="cloud-audit-result" class="tagline" role="status" aria-live="polite" style="margin-top:12px"></div><button class="btn soft" id="cloud-groups-audit" type="button">Datengruppen abgleichen (nur lesen)</button><div id="cloud-groups-audit-result" class="tagline" role="status" aria-live="polite" style="margin-top:10px"></div><hr style="border:0;border-top:1px solid var(--line);margin:18px 0"><h3 style="font:700 16px Manrope">Getrennte Cloud-Datengruppen sicher übernehmen</h3><p class="subheading">Erstellt zuerst ein vollständiges JSON-Backup. Danach werden alle Gruppen geprüft. Bereits identische Gruppen bleiben unberührt; abweichende vorhandene Gruppen lösen einen Sicherheitsstopp aus. Eingebettete Fotos/PDFs müssen vorher separat migriert werden.</p><button class="btn soft" id="cloud-groups-backup" type="button">1. JSON-Backup erstellen</button><button class="btn primary" id="cloud-groups-migration-start" type="button" hidden style="display:none;margin-top:10px">2. Gesichertes Backup bestätigen & Migration starten</button><button class="btn primary" id="cloud-groups-entries-merge" type="button" hidden style="display:none;margin-top:10px">2. Acht fehlende Tagebucheinträge sicher ergänzen</button><button class="btn primary" id="cloud-groups-game-xp-merge" type="button" hidden style="display:none;margin-top:10px">3. Nur XP sicher korrigieren (96 → 123)</button><div id="cloud-groups-migration-result" class="tagline" role="status" aria-live="polite" style="margin-top:10px"></div></div>${cloudCard}<div class="card"><span class="pill">${t('storage.recommended')}</span><h3 style="font:700 16px Manrope">${t('storage.json')}</h3><p class="subheading">${t('storage.jsonDescription')}</p><button class="btn primary" data-action="export-json">${t('storage.download')}</button></div><div class="card"><span class="pill">${t('storage.restore')}</span><h3 style="font:700 16px Manrope">${t('storage.restoreTitle')}</h3><p class="subheading">${t('storage.restoreDescription')}</p><input type="file" id="json-file" class="field" accept=".json,application/json"><button class="btn soft" data-action="import-json" style="margin-top:10px">${t('storage.selectJson')}</button></div><div class="card"><span class="pill">${t('storage.diaryPill')}</span><h3 style="font:700 16px Manrope">${t('storage.csv')}</h3><p class="subheading">${t('storage.csvDescription')}</p><button class="btn" data-action="export-csv">${t('storage.exportCsv')}</button><label class="btn soft" style="display:inline-block;margin:8px 0">${t('storage.importCsv')}<input id="csv-file" hidden type="file" accept=".csv,text/csv"></label><div id="csv-preview"></div></div><div class="card"><span class="pill">${storageMode==='cloud'?t('storage.cloud'):t('storage.local')}</span><h3 style="font:700 16px Manrope">${t('storage.activeSave')}</h3><p class="subheading">${storageMode==='cloud'?t('storage.cloudBadge'):t('storage.localBadge')}</p><div class="tagline">${countText}</div></div></div>`;bindGlobal();$('#csv-file').onchange=importCsv;$('#json-file').onchange=importJson;$('#cloud-audit').onclick=runCloudAudit;$('#cloud-groups-audit').onclick=runCloudGroupsAudit;$('#cloud-groups-backup').onclick=prepareCloudGroupsMigrationBackup;$('#cloud-groups-migration-start').onclick=runCloudGroupsMigration;$('#cloud-groups-entries-merge').onclick=mergeMissingDiaryEntries;$('#cloud-groups-game-xp-merge').onclick=mergeLegacyGameXpOnly}

function csvExport(){let cols=['date','time','category','device','duration','puffs','strain','temp','location','taste','notes'],labels=['Datum','Uhrzeit','Kategorie','Gerät','Dauer','Puffs','Sorte','Temperatur','Ort','Geschmack','Notizen'],csv=[labels,...db.entries.map(e=>cols.map(k=>e[k]||''))].map(r=>r.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(';')).join('\r\n');download(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),'my-vaping-diary.csv')}
function download(blob,name){let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
async function jsonExport(){try{const snapshot=await createPortableBackupSnapshot();download(new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'}),'my-vaping-adventure-backup.json')}catch(error){console.error('JSON-Export fehlgeschlagen:',error);toast('JSON-Backup konnte nicht vollständig erstellt werden: '+(error?.message||'Medienabruf fehlgeschlagen'))}}
function validOptionalMediaValue(value){
 return value===undefined||value===null||value===''||typeof value==='string'||isCloudMediaReference(value);
}
function hasUnsafeBackupKeys(value){
 if(!value||typeof value!=='object')return false;
 for(const key of Object.keys(value)){
  if(key==='__proto__'||key==='prototype'||key==='constructor')return true;
  if(hasUnsafeBackupKeys(value[key]))return true;
 }
 return false;
}
function validBackup(x){
 if(!x||typeof x!=='object'||Array.isArray(x)||hasUnsafeBackupKeys(x))return false;
 if(!Array.isArray(x.entries)||!Array.isArray(x.devices))return false;
 for(const k of ['strains','photos'])if(x[k]!==undefined&&!Array.isArray(x[k]))return false;
 const isRecord=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
 for(const entry of x.entries){
  if(!isRecord(entry))return false;
  for(const key of ['id','date','time','category','device','duration','puffs','strain','temp','location','taste','notes']){
   if(entry[key]!==undefined&&entry[key]!==null&&!['string','number'].includes(typeof entry[key]))return false;
  }
  if(entry.date!==undefined&&typeof entry.date!=='string')return false;
  if(entry.time!==undefined&&typeof entry.time!=='string')return false;
 }
 for(const device of x.devices){
  if(typeof device==='string'){if(!device.trim())return false;continue}
  if(!isRecord(device)||typeof device.name!=='string'||!device.name.trim())return false;
  for(const key of ['category','description','manualName'])if(device[key]!==undefined&&device[key]!==null&&typeof device[key]!=='string')return false;
  if(!validOptionalMediaValue(device.photo)||!validOptionalMediaValue(device.manualData))return false;
 }
 for(const strain of x.strains||[]){
  if(!isRecord(strain)||typeof strain.name!=='string'||!strain.name.trim())return false;
  for(const key of ['id','manufacturer','category','notes'])if(strain[key]!==undefined&&strain[key]!==null&&typeof strain[key]!=='string')return false;
 }
 for(const photo of x.photos||[]){
  if(!isRecord(photo)||(!(typeof photo.src==='string'&&photo.src.trim())&&!isCloudMediaReference(photo.src)))return false;
  for(const key of ['id','title','date','device','entry'])if(photo[key]!==undefined&&photo[key]!==null&&typeof photo[key]!=='string')return false;
 }
 if(x.game!==undefined){
  if(!isRecord(x.game))return false;
  for(const key of ['xp','coins'])if(x.game[key]!==undefined&&(!Number.isFinite(x.game[key])||x.game[key]<0))return false;
  if(x.game.quests!==undefined&&(!Array.isArray(x.game.quests)||x.game.quests.some(q=>typeof q!=='string')))return false;
  if(x.game.courses!==undefined&&!isRecord(x.game.courses))return false;
  if(x.game.courses&&Object.values(x.game.courses).some(v=>!isRecord(v)||
   (v.passed!==undefined&&typeof v.passed!=='boolean')||
   (v.score!==undefined&&(!Number.isFinite(v.score)||v.score<0||v.score>100))||
   (v.date!==undefined&&typeof v.date!=='string')))return false;
 }
 if(x.controlledVaping!==undefined&&!isRecord(x.controlledVaping))return false;
 return true;
}
async function materializeBackupMedia(snapshot){
 const next=JSON.parse(JSON.stringify(snapshot));
 const convert=async value=>isCloudMediaReference(value)?await mediaToPortableDataUrl(value):value;
 const tasks=[];
 for(const photo of next.photos||[])if(photo?.src)tasks.push((async()=>{photo.src=await convert(photo.src)})());
 for(const device of next.devices||[])if(device&&typeof device==='object'){
  if(device.photo)tasks.push((async()=>{device.photo=await convert(device.photo)})());
  if(device.manualData)tasks.push((async()=>{device.manualData=await convert(device.manualData)})());
 }
 await Promise.all(tasks);
 return next;
}
function importJson(e){
 const file=e.target.files?.[0];if(!file)return;
 const reader=new FileReader();
 reader.onload=async()=>{
  try{
   const parsed=JSON.parse(reader.result);
   if(!validBackup(parsed))throw Error('Ungültige Backup-Struktur');
   if(!confirm(localeText('confirm.backupReplace')))return;
   // Resolve every cloud reference before changing the active save. If even one
   // download/decryption fails, the current diary remains completely untouched.
   const x=await materializeBackupMedia(parsed);
   if(!validBackup(x))throw Error('Backup-Medien konnten nicht vollständig wiederhergestellt werden.');
   // Finish pending cloud writes before capturing the pre-restore state.
   if(storageMode==='cloud'&&!await flushCloudSave())throw Error('Import abgebrochen: Der bisherige Cloud-Spielstand konnte vorher nicht zuverlässig gesichert werden.');
   // Keep a portable safety copy of the current save before replacing it.
   const safetySnapshot=await createPortableBackupSnapshot();
   download(new Blob([JSON.stringify(safetySnapshot,null,2)],{type:'application/json'}),'my-vaping-adventure-before-restore.json');
   const base=emptyDb();
   const next={...base,...x,entries:x.entries,devices:x.devices.map(d=>typeof d==='string'?{name:d,category:'vaporizer'}:{...d,category:names[d.category]?d.category:'vaporizer'}),strains:x.strains||[],photos:x.photos||[],game:{...base.game,...(x.game||{})}};
   if(storageMode==='cloud'){
    const previous=db;
    db=next;
    try{
     await cloudWrite();
     if(cloudSavedRevision<cloudSaveRevision)throw Error('Die Cloud hat die Wiederherstellung noch nicht bestätigt.');
    }catch(writeError){
     db=previous;
     try{
      await cloudWrite();
      if(cloudSavedRevision<cloudSaveRevision)throw Error('Der vorherige Cloud-Spielstand wurde nicht bestätigt.');
     }catch(rollbackError){
      setCloudStatus('Cloud-Speicherstatus unklar – bitte nicht abmelden.');
      throw Error('Cloud-Import fehlgeschlagen. Auch die erneute Sicherung des vorherigen Spielstands wurde nicht bestätigt. Bitte angemeldet bleiben und den heruntergeladenen Sicherheits-Backup aufbewahren. Ursache: '+(rollbackError?.message||writeError?.message||'unbekannter Cloud-Fehler'));
     }
     throw Error('Cloud-Import fehlgeschlagen. Der vorherige Cloud-Spielstand wurde erneut gespeichert. '+(writeError?.message||''));
    }
   }else{
    // Commit and verify the complete imported save before changing the active in-memory state.
    await saveLocalSnapshot(next);
    db=next;
    localDb=next;
   }
   render();toast('Backup geprüft, gespeichert und wiederhergestellt');
  }catch(error){
   console.error('JSON-Backup konnte nicht importiert werden:',error);
   toast('Backup konnte nicht vollständig wiederhergestellt werden: '+(error?.message||'Datei ungültig')+'. Deine bisherigen Daten wurden nicht ersetzt.');
  }finally{e.target.value=''}
 };
 reader.onerror=()=>{toast('Backup-Datei konnte nicht gelesen werden');e.target.value=''};
 reader.readAsText(file);
}
function parseCsv(t){let delim=(t.split(/\r?\n/)[0].match(/;/g)||[]).length>=(t.split(/\r?\n/)[0].match(/,/g)||[]).length?';':',',rows=[],r=[],s='',q=false;t=t.replace(/^\uFEFF/,'');for(let i=0;i<t.length;i++){let c=t[i];if(c==='"'&&q&&t[i+1]==='"'){s+='"';i++}else if(c==='"')q=!q;else if(c===delim&&!q){r.push(s);s=''}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&t[i+1]==='\n')i++;r.push(s);s='';if(r.some(x=>x.trim()))rows.push(r);r=[]}else s+=c}r.push(s);if(r.some(x=>x.trim()))rows.push(r);return rows}
function importCsv(e){let f=e.target.files[0];if(!f)return;f.text().then(t=>{let rows=parseCsv(t),h=rows.shift().map(x=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,''));csvPending=rows.map(r=>{let o={};h.forEach((k,i)=>o[k]=r[i]||'');let pick=(...keys)=>keys.map(k=>o[k]).find(Boolean)||'';let notes=pick('notizen','notes','bemerkungen'),puffs=pick('puffs','zuege','anzahlzuege')||((notes.match(/(?:züge|zuege|puffs?)\s*[:=]?\s*(\d+)/i)||[])[1]||'');return {id:id(),date:pick('datum','date'),time:pick('uhrzeit','zeit','time'),category:pick('kategorie','category')||'vaporizer',device:pick('geraet','gerat','device'),strain:pick('sorte','strain','material'),duration:pick('dauer','duration'),puffs,notes,temp:pick('temperatur','temp'),location:pick('ort','location'),taste:pick('geschmack','taste')}}).filter(x=>x.device||x.date||x.notes);const normCsvValue=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toLowerCase();let csvFields=['date','time','category','device','duration','puffs','strain','temp','location','taste','notes'];let fingerprint=x=>csvFields.map(k=>normCsvValue(k==='category'?(x[k]||'vaporizer'):x[k])).join('¦');let dup=x=>db.entries.some(y=>fingerprint(y)===fingerprint(x));$('#csv-preview').innerHTML=`<p class="subheading">${csvPending.length} erkannt · ${csvPending.filter(x=>!dup(x)).length} neu · ${csvPending.filter(dup).length} mögliche Duplikate. ${csvPending.slice(0,10).map(x=>`<br>${esc(x.date)} · ${esc(x.device)} ${dup(x)?'· Duplikat':''}`).join('')}</p><button class="btn primary" id="csv-commit" ${csvPending.filter(x=>!dup(x)).length?'':'disabled'}>Neue Einträge übernehmen</button>`;$('#csv-commit').onclick=()=>{const imported=csvPending.filter(x=>!dup(x));imported.forEach(x=>{db.entries.push(x);if(x.device&&!db.devices.some(d=>d.name.toLowerCase()===x.device.toLowerCase()))db.devices.push({name:x.device,category:x.category})});put();render();toast(imported.length+' CSV-Einträge übernommen'+(storageMode==='cloud'?' – Cloud-Synchronisierung läuft mit automatischen Wiederholungen.':''))}}).catch(()=>toast('CSV konnte nicht gelesen werden'))}
function bindGlobal(){document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{switch(b.dataset.action){case'new':entryForm();break;case'new-strain':strainForm();break;case'new-device':deviceForm();break;case'new-photo':photoForm();break;case'export-json':jsonExport();break;case'export-csv':csvExport();break;case'import-json':$('#json-file').click();break;case'cloud-login':cloudLogin(false);break;case'cloud-signup':cloudLogin(true);break;case'cloud-reset':sendPasswordReset();break;case'cloud-change-email':changeCloudEmail();break;case'cloud-change-password':changeCloudPassword();break;case'switch-local':switchLocal();break;case'settings-logout':logoutProfile();break}});document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>entryForm(db.entries.find(x=>x.id===b.dataset.edit)));document.querySelectorAll('[data-delete-entry]').forEach(b=>b.onclick=()=>{if(confirm(localeText('confirm.deleteEntry'))){db.entries=db.entries.filter(x=>x.id!==b.dataset.deleteEntry);put();render()}});document.querySelectorAll('[data-edit-strain]').forEach(b=>b.onclick=()=>strainForm(db.strains.find(x=>x.id===b.dataset.editStrain)));document.querySelectorAll('[data-del-strain]').forEach(b=>b.onclick=()=>{db.strains=db.strains.filter(x=>x.id!==b.dataset.delStrain);put();render()});document.querySelectorAll('[data-open-manual]').forEach(b=>b.onclick=()=>openDeviceManual(b.dataset.openManual));document.querySelectorAll('[data-edit-device]').forEach(b=>b.onclick=()=>deviceForm(db.devices.find(x=>x.name===b.dataset.editDevice)));document.querySelectorAll('[data-del-device]').forEach(b=>b.onclick=()=>{if(db.entries.some(x=>x.device===b.dataset.delDevice))return toast('Gerät wird noch verwendet');db.devices=db.devices.filter(x=>x.name!==b.dataset.delDevice);put();render()});document.querySelectorAll('[data-del-photo]').forEach(b=>b.onclick=()=>{db.photos=db.photos.filter(x=>x.id!==b.dataset.delPhoto);put();render()});document.querySelectorAll('[data-course]').forEach(b=>b.onclick=()=>courseView(courses.find(c=>c.id===b.dataset.course)));document.querySelectorAll('[data-claim]').forEach(b=>b.onclick=()=>{let q=questData.find(q=>q.id===b.dataset.claim);if(!q||db.game.quests.includes(q.id)||!q.check())return;db.game.quests.push(q.id);db.game.xp=(db.game.xp||0)+q.xp;db.game.coins=(db.game.coins||0)+q.coins;put();render()})}
function newBoot(){db.entries=db.entries.map(e=>{let m=String(e.notes||'').match(/(?:anzahl\s*)?(?:züge|zuege|puffs?)\s*[:=]?\s*(\d+)/i);if(!e.puffs&&m)e.puffs=m[1];if(!e.materialId&&e.strain){const name=String(e.strain).trim().toLocaleLowerCase();const material=db.strains.find(s=>String(s.name||'').trim().toLocaleLowerCase()===name&&(!s.category||s.category===e.category));if(material)e.materialId=material.id}return e});put();render()}
async function initializeLocalApp(){
 try{
  const indexedSnapshot=await loadLocalSnapshot();
  if(indexedSnapshot){localDb=indexedSnapshot;db=indexedSnapshot}
  else{
   // Migrate the existing localStorage save once; leave the original copy untouched as a fallback.
   await saveLocalSnapshot(localDb);
  }
 }catch(error){
  console.error("IndexedDB-Initialisierung fehlgeschlagen; vorhandener lokaler Spielstand bleibt aktiv:",error);
  toast("Der vorhandene Spielstand wurde geladen, aber der größere lokale Speicher konnte nicht aktiviert werden. Bitte vor Änderungen ein JSON-Backup herunterladen. "+(error?.message||""));
 }
 applyTheme();
 newBoot();
 handlePasswordRecovery();
}
initializeLocalApp();