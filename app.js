"use strict";
function localeText(key, params){return window.MVA_LOCALES?.t(key,params) ?? key;}
const KEY="mva_alpha12", OLD={entries:"pvd_entries",devices:"pvd_devices",game:"pvd_game"};
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
let localDb=get(KEY,{entries:get(OLD.entries,[]),devices:get(OLD.devices,[]),strains:[],photos:[],game:get(OLD.game,{xp:0,coins:0,quests:[],courses:{}})});
let db=localDb, storageMode="local", cloudSession=null, cloudKey=null, cloudSalt=null, cloudEnvelope=null, cloudTimer=null, cloudWritePromise=null, cloudSaveRevision=0, cloudSavedRevision=0;
const cloudRecoveryKey=()=>`mva_cloud_recovery_${cloudSession?.userId||"unknown"}`;
const put=()=>{if(storageMode==="local"){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){toast("Speicher fast voll. Exportiere ein Backup und verkleinere Fotos.")}}else scheduleCloudSave()};
for(const k of ["entries","devices","strains","photos"])if(!Array.isArray(db[k]))db[k]=[];
db.game ||= {xp:0,coins:0,quests:[],courses:{}}; db.game.quests ||= []; db.game.courses ||= {};
const defaults=[...["Venty","Mighty","Volcano","Dr. Dabber Switch2","TerpTorch","TerpHammer","Dynavap M7","Dynavap G3","Dynavap B2","The B","XMAX Qomo","Pax Flow","Cuboo Stick","Smono"].map(name=>({name,category:"vaporizer"})),...["GeekVape Legend 5","ELFX Mega"].map(name=>({name,category:"ecig"})),... ["IQOS","glo"].map(name=>({name,category:"heater"}))];
const names={vaporizer:"Vaporizer",ecig:"E-Zigarette",heater:"Tabakerhitzer"};
db.devices=db.devices.map(d=>typeof d==="string"?{name:d,category:"vaporizer"}:d);if(!db.devices.length)db.devices=defaults;else defaults.forEach(d=>{if(!db.devices.some(x=>x.name.toLowerCase()===d.name.toLowerCase()))db.devices.push(d)});
const $=s=>document.querySelector(s), esc=s=>String(s??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const now=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}, id=()=>crypto.randomUUID?.()||String(Date.now()+Math.random());
let page="home", pendingPhoto=null, csvPending=[], sortMode='desc', galleryIndex=0;
function toast(s){let t=document.createElement('div');t.className='toast';t.textContent=s;document.body.append(t);setTimeout(()=>t.remove(),2600)}
const cloudConfig=()=>window.MVA_CLOUD||{};
function cloudReady(){let c=cloudConfig();return /^https:\/\//.test(c.url||'')&&!!c.apiKey}
function b64(bytes){const a=new Uint8Array(bytes);let binary="";const chunk=0x8000;for(let i=0;i<a.length;i+=chunk)binary+=String.fromCharCode(...a.subarray(i,i+chunk));return btoa(binary)}
function unb64(s){return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
async function deriveCloudKey(password,salt){let material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:600000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function aesWrap(key,bytes){let iv=crypto.getRandomValues(new Uint8Array(12)),cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,bytes);return {iv:b64(iv),ciphertext:b64(cipher)}}
async function aesUnwrap(key,box){return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(box.iv)},key,unb64(box.ciphertext)))}
async function encryptCloud(data){if(!cloudKey)throw Error('Verschlüsselungsschlüssel fehlt');let iv=crypto.getRandomValues(new Uint8Array(12)),bytes=new TextEncoder().encode(JSON.stringify(data)),cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},cloudKey,bytes);return cloudEnvelope?{v:2,envelope:cloudEnvelope,iv:b64(iv),ciphertext:b64(cipher)}:{v:1,salt:b64(cloudSalt),iv:b64(iv),ciphertext:b64(cipher)}}
async function decryptCloud(box){if(box?.v===2&&box.envelope?.v===1){let env=box.envelope,salt=unb64(env.password.salt),kek=await deriveCloudKey(cloudPassword,salt),raw=await aesUnwrap(kek,env.password),rawKey=await crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['encrypt','decrypt']);cloudKey=rawKey;cloudEnvelope=env;let plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(box.iv)},cloudKey,unb64(box.ciphertext));return JSON.parse(new TextDecoder().decode(plain))}if(box?.v!==1)throw Error('Unbekanntes Cloud-Backup-Format');cloudSalt=unb64(box.salt);cloudKey=await deriveCloudKey(cloudPassword,cloudSalt);cloudEnvelope=null;let plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(box.iv)},cloudKey,unb64(box.ciphertext));return JSON.parse(new TextDecoder().decode(plain))}
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
async function cloudAuth(identifier,password){if(!cloudReady())throw Error('Cloud ist noch nicht eingerichtet. Folge der Anleitung in cloud-setup.md.');let loginEmail=identifier.includes('@')?identifier.trim().toLowerCase():`${identifier.trim().toLowerCase()}@mva.invalid`;let d=await cloudFetch('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:loginEmail,password})});return {token:d.access_token,refreshToken:d.refresh_token,userId:d.user.id,email:d.user.email}}
async function cloudSignup(email,password){if(!cloudReady())throw Error('Cloud ist noch nicht eingerichtet.');let d=await cloudFetch('/auth/v1/signup?redirect_to='+encodeURIComponent(location.origin+location.pathname),{method:'POST',body:JSON.stringify({email,password})});return d}
async function cloudResetEmail(email){let c=cloudConfig();let res=await fetch(`${c.url.replace(/\/$/,'')}/auth/v1/recover?redirect_to=${encodeURIComponent(location.origin+location.pathname)}`,{method:'POST',headers:{apikey:c.apiKey,'Content-Type':'application/json'},body:JSON.stringify({email})});let d=await res.json().catch(()=>({}));if(!res.ok)throw Error(d.msg||d.message||d.error_description||'E-Mail konnte nicht versendet werden')}
async function cloudRead(){let rows=await cloudFetch(`/rest/v1/mva_saves?select=payload&user_id=eq.${encodeURIComponent(cloudSession.userId)}&limit=1`,{headers:{Authorization:`Bearer ${cloudSession.token}`}});return rows?.[0]?.payload||null}
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
     const payload=await encryptCloud(snapshot);
     try{localStorage.setItem(cloudRecoveryKey(),JSON.stringify({savedAt:new Date().toISOString(),payload}))}catch(storageError){console.warn('Lokale verschlüsselte Wiederherstellungskopie konnte nicht aktualisiert werden:',storageError)}
     await cloudFetch('/rest/v1/mva_saves?on_conflict=user_id',{method:'POST',headers:{Authorization:`Bearer ${cloudSession.token}`,Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:cloudSession.userId,payload,updated_at:new Date().toISOString()})});
     cloudSavedRevision=revision;
     lastError=null;
     break;
    }catch(error){
     lastError=error;
     if(attempt<3)await new Promise(resolve=>setTimeout(resolve,[1000,3000,8000][attempt]));
    }
   }
   if(lastError)throw lastError;
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
function setCloudStatus(text){let el=$('#storage-status');if(el)el.innerHTML=`<i></i> ${esc(text)}`}

async function showLoginAnimation(){
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
   cloudSession={token:d.session.access_token,refreshToken:d.session.refresh_token,userId:d.user.id,email:d.user.email};
  }else cloudSession=await cloudAuth(email,password);
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
    cloudSession=null;cloudKey=null;cloudSalt=null;cloudEnvelope=null;cloudPassword='';storageMode='local';db=localDb;render();return;
   }
   db=localDb;storageMode='cloud';let recovery=await createCloudEnvelope(password);await cloudWrite();
   showRecoveryCode(recovery);
   if($('#cloud-pass'))$('#cloud-pass').value='';render();toast('Lokaler Spielstand sicher in die Cloud übertragen');
  }
 }catch(e){
  console.error(e);cloudSession=null;cloudKey=null;cloudSalt=null;cloudEnvelope=null;cloudPassword='';storageMode='local';db=localDb;setCloudStatus('Nur auf diesem Gerät');toast(e.message||'Cloud-Verbindung fehlgeschlagen');
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
 let localSnapshot;
 try{
  localSnapshot=JSON.parse(JSON.stringify(db));
  localStorage.setItem(KEY,JSON.stringify(localSnapshot));
 }catch(error){
  console.error('Lokaler Spielstand konnte vor dem Speicherwechsel nicht gesichert werden:',error);
  toast('Wechsel zum lokalen Speicher abgebrochen: Der aktuelle Spielstand konnte lokal nicht gesichert werden. Du bleibst angemeldet und deine Cloud-Daten bleiben erhalten.');
  return false;
 }
 localDb=localSnapshot;
 db=localDb;
 storageMode='local';
 cloudSession=null;cloudKey=null;cloudSalt=null;cloudEnvelope=null;cloudPassword='';
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
  ? `<h3 class="profile-title">Dein Profil</h3><div class="profile-name">${esc(name)}</div><div class="profile-email">${esc(email)}</div><div class="profile-state"><i></i> Verschlüsselte Cloud aktiv</div><div class="profile-actions"><button class="btn soft" data-profile-action="backup">Speicher & Backup öffnen →</button><button class="btn" data-profile-action="logout">Abmelden</button></div>`
  : `<h3 class="profile-title">Dein Profil</h3><div class="profile-name">Gastmodus</div><div class="profile-email">Du bist aktuell nicht mit einem Cloud-Konto angemeldet.</div><div class="profile-state"><i></i> Nur auf diesem Gerät gespeichert</div><div class="profile-actions"><button class="btn primary" data-profile-action="backup">Cloud-Konto verbinden →</button></div>`;
}
async function logoutProfile(){
 if(storageMode==='cloud'){await switchLocal();if(storageMode==='cloud')return}
 cloudSession=null;cloudKey=null;cloudSalt=null;cloudPassword='';
 const menu=$('#profile-menu'),trigger=$('#profile-trigger');if(menu)menu.hidden=true;if(trigger)trigger.setAttribute('aria-expanded','false');
 updateNav();toast('Du wurdest abgemeldet.');
}
function go(p){page=p;updateNav();render();window.scrollTo(0,0)}

const THEME_KEY="mva_theme";
const THEME_OPTIONS=[
 {id:"classic",name:"Original",desc:"Das bisherige vertraute Design"},
 {id:"forest",name:"Forest & Nature",desc:"Sattes Hanfgrün und helles Blattgrün"},
 {id:"ocean",name:"Ocean Blue",desc:"Meeresblau, Türkis und klare Flächen"},
 {id:"sunset",name:"Sunset",desc:"Warme Orange-, Korall- und Cremetöne"},
 {id:"midnight",name:"Midnight",desc:"Dunkles Nachtblau mit leuchtendem Akzent"}
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
  picker.innerHTML=`<div class="theme-picker-backdrop" data-theme-close></div><section class="theme-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="theme-picker-title"><div class="theme-picker-head"><div><span class="eyebrow">PERSONALISIERE DEIN ABENTEUER</span><h2 id="theme-picker-title">Design auswählen</h2><p>Wähle das Aussehen deiner persönlichen Vaping-Seite.</p></div><button class="theme-picker-close" type="button" data-theme-close aria-label="Schließen">×</button></div><div class="theme-choice-grid"><button type="button" class="theme-choice" data-theme-choice="classic"><span class="theme-mini" data-mini-theme="classic"><i></i><i></i><i></i></span><span class="theme-choice-copy"><b>Original</b><small>Das bisherige vertraute Design</small></span><span class="theme-choice-status">Auswählen</span></button><button type="button" class="theme-choice" data-theme-choice="forest"><span class="theme-mini" data-mini-theme="forest"><i></i><i></i><i></i></span><span class="theme-choice-copy"><b>Forest & Nature</b><small>Sattes Hanfgrün und helles Blattgrün</small></span><span class="theme-choice-status">Auswählen</span></button><button type="button" class="theme-choice" data-theme-choice="ocean"><span class="theme-mini" data-mini-theme="ocean"><i></i><i></i><i></i></span><span class="theme-choice-copy"><b>Ocean Blue</b><small>Meeresblau, Türkis und klare Flächen</small></span><span class="theme-choice-status">Auswählen</span></button><button type="button" class="theme-choice" data-theme-choice="sunset"><span class="theme-mini" data-mini-theme="sunset"><i></i><i></i><i></i></span><span class="theme-choice-copy"><b>Sunset</b><small>Warme Orange-, Korall- und Cremetöne</small></span><span class="theme-choice-status">Auswählen</span></button><button type="button" class="theme-choice" data-theme-choice="midnight"><span class="theme-mini" data-mini-theme="midnight"><i></i><i></i><i></i></span><span class="theme-choice-copy"><b>Midnight</b><small>Dunkles Nachtblau mit leuchtendem Akzent</small></span><span class="theme-choice-status">Auswählen</span></button></div><p class="theme-picker-note">Deine Auswahl wird auf diesem Gerät gespeichert.</p></section>`;
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
function render(){updateNav();let v=$('#view');v.className='main';({home:home,diary:diary,strains:strains,devices:devices,gallery:gallery,quests:quests,learn:learn,controlledVaping:controlledVaping,backup:backup,more:more,guestbook:guestbook,contact:contact}[page]||home)(v);const lang=window.MVA_I18N?.getLanguage?.()||'de';const supportLabel=lang==='fr'?'Nous soutenons :':lang==='en'?'We support:':'Wir unterstützen den:';v.insertAdjacentHTML('beforeend',`<footer class="support-footer"><p>${supportLabel}</p><a href="https://hanfverband.de/" target="_blank" rel="noopener noreferrer"><img src="https://raw.githubusercontent.com/AdventureVapor/vaping-adventure/main/Bilder/DHV_logo.jpg" alt="Deutscher Hanfverband"></a></footer>`);}

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
function more(v){const t=localeText;v.innerHTML=`${header(t('more.eyebrow'),t('more.title'),t('more.subtitle'),'')}<div class="grid cards2 more-grid"><button class="card more-link" data-page="devices"><span class="more-icon">▱</span><b>${t('page.devices.title')}</b><small>${t('more.devices')}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="gallery"><span class="more-icon">▧</span><b>${t('page.gallery.title')}</b><small>${t('more.gallery')}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="guestbook"><span class="more-icon">✉</span><b>${t('guestbook.title')}</b><small>${t('more.guestbook')}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="learn"><span class="more-icon">◉</span><b>${t('page.learn.title')}</b><small>${t('more.learn')}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="controlledVaping"><span class="more-icon">◷</span><b>Kontrolliertes Vapen</b><small>Phase 1 · Bestandsaufnahme</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="backup"><span class="more-icon">⇧</span><b>${t('storage.sidebar.link').replace(' →','')}</b><small>${t('more.backup')}</small><span class="more-arrow">${t('more.open')}</span></button><button class="card more-link" data-page="contact"><span class="more-icon">✉</span><b>${t('contact.title')}</b><small>${t('more.contact')}</small><span class="more-arrow">${t('more.open')}</span></button></div>`;bindGlobal()}
function home(v){const t=localeText;let last=[...db.entries].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,3),xp=Number(db.game.xp)||0,level=Math.floor(xp/100)+1;v.innerHTML=`${header(t('home.eyebrow'),t('home.title'),t('home.subtitle'),'<button class="btn primary" data-action="new">＋ '+t('action.newEntry')+'</button>')}<div class="hero"><div><div class="eyebrow">${t('home.heroEyebrow')}</div><h2>${t('home.heroTitle')}</h2><p>${t('home.heroText')}</p><button class="btn" data-page="diary">${t('home.toDiary')}</button></div><div class="hero-stat"><strong>Level ${level}</strong><small>${xp} ${t('home.xp')} · ${db.game.coins||0} Coins</small></div></div><div class="grid stats">${card(t('home.stats.entries'),db.entries.length,t('home.stats.entriesSub'))}${card(t('home.stats.devices'),db.devices.length,t('home.stats.devicesSub'))}${card(t('home.stats.puffs'),db.entries.reduce((a,x)=>a+(Number(x.puffs)||0),0).toLocaleString(),t('home.stats.puffsSub'))}${card(t('home.stats.strains'),db.strains.length,t('home.stats.strainsSub'))}</div><div class="grid split"><section><div class="row section-head"><h3>${t('home.recent')}</h3><a data-page="diary">${t('home.all')}</a></div>${last.length?`<div class="list">${last.map(entryRow).join('')}</div>`:empty(t('home.emptyTitle'),t('home.emptyText'),'<button class="btn soft" data-action="new">'+t('home.create')+'</button>')}</section><section><div class="row section-head"><h3>${t('home.next')}</h3><a data-page="quests">${t('home.quests')}</a></div><div class="card"><span class="pill">${t('home.knowledge')}</span><h3 style="font:700 15px Manrope;margin:12px 0 7px">${t('home.learn')}</h3><p class="subheading">${t('home.learnSub')}</p><button class="btn soft" style="margin-top:16px" data-page="learn">${t('home.courses')}</button></div></section></div>`;bindGlobal()}
function entryRow(x){return `<div class="item"><div class="item-icon">${x.category==='heater'?'♨':x.category==='ecig'?'◉':'✳'}</div><div class="item-content"><b>${esc(x.device||'Session')}</b><small>${esc(x.date||'')} · ${esc(x.strain||x.material||'Keine Sorte angegeben')} ${x.puffs?'· '+esc(x.puffs)+' Züge':''}</small></div><span class="pill">${esc(names[x.category]||x.category||'Session')}</span></div>`}
function diary(v){const diaryLang=window.MVA_I18N?.getLanguage?.()||'de';const diaryTitle=diaryLang==='fr'?'Journal de vapotage':'Vaping Diary';const diaryDescription=diaryLang==='fr'?(storageMode==='cloud'?'Vos sessions et impressions dans votre sauvegarde cloud chiffrée.':'Vos sessions et impressions, enregistrées localement sur cet appareil.'):(storageMode==='cloud'?'Deine Sessions und Eindrücke im verschlüsselten Cloud-Spielstand.':'Deine Sessions und Eindrücke, lokal auf diesem Gerät gespeichert.');let items=[...db.entries].filter(x=>{let q=($('#search')?.value||'').toLowerCase();return(!q||Object.values(x).join(' ').toLowerCase().includes(q))&&(!$('#df')?.value||x.device===$('#df').value)&&(!$('#dc')?.value||x.category===$('#dc').value)}).sort((a,b)=>(sortMode==='desc'?-1:1)*(a.date||'').localeCompare(b.date||''));v.innerHTML=`${header(localeText('page.diary.eyebrow'),localeText('page.diary.title'),localeText(storageMode==='cloud'?'page.diary.description.cloud':'page.diary.description.local'),`<button class="btn primary" data-action="new">${localeText('action.newEntry')}</button>`)}<div class="toolbar"><input class="field" type="search" id="search" placeholder="${localeText('diary.search')}" value="${esc($('#search')?.value||'')}"><select class="field" id="df"><option value="">${localeText('diary.allDevices')}</option>${db.devices.map(d=>`<option ${$('#df')?.value===d.name?'selected':''}>${esc(d.name)}</option>`).join('')}</select><select class="field" id="dc"><option value="">${localeText('diary.allCategories')}</option>${Object.entries(names).map(([k,n])=>`<option value="${k}" ${$('#dc')?.value===k?'selected':''}>${n}</option>`).join('')}</select><select class="field" id="sort"><option value="desc" ${sortMode==='desc'?'selected':''}>${localeText('diary.newest')}</option><option value="asc" ${sortMode==='asc'?'selected':''}>${localeText('diary.oldest')}</option></select></div><div class="list">${items.length?items.map(x=>`<div class="card"><div class="row"><div><b>${esc(x.device||'Session')}</b><div class="tagline">${esc(x.date||'')} · ${esc(x.time||'')} · ${esc(names[x.category]||x.category||'')}</div></div><div class="inline-actions"><button class="btn small" data-edit="${esc(x.id)}">${localeText('action.edit')}</button><button class="btn small" data-delete-entry="${esc(x.id)}">${localeText('action.delete')}</button></div></div><div class="tagline">${[x.strain,x.puffs&&`${x.puffs} Züge`,x.duration&&`${x.duration} min`,x.location,x.temp&&`${x.temp}°C`].filter(Boolean).map(esc).join(' · ')}</div>${x.notes?`<p class="subheading" style="margin-top:10px">${esc(x.notes)}</p>`:''}</div>`).join(''):empty(localeText('diary.noResults'),localeText('diary.noResultsHint'))}</div>`;
['search','df','dc','sort'].forEach(k=>$('#'+k)?.addEventListener(k==='search'?'input':'change',()=>{if(k==='sort')sortMode=$('#sort').value;let pos=$('#search')?.value;diary(v);if(pos){$('#search').focus();$('#search').setSelectionRange(pos.length,pos.length)}}));bindGlobal()}
function openModal(title,content,saveLabel=localeText('dialog.save'),fn){const t=localeText;$('#modal-root').innerHTML=`<div class="modal-backdrop"><div class="modal"><div class="row"><h2>${title}</h2><button class="btn small" data-close>${t('dialog.close')}</button></div>${content}<div class="modal-foot"><button class="btn" data-close>${t('dialog.cancel')}</button><button class="btn primary" id="modal-save">${saveLabel}</button></div></div></div>`;$('#modal-root').querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#modal-root').innerHTML='');$('#modal-root').querySelector('.modal-backdrop').onclick=e=>{if(e.target.classList.contains('modal-backdrop'))$('#modal-root').innerHTML=''};$('#modal-save').onclick=fn}

function selectDevice(cat,selected=''){let opts=db.devices.filter(x=>!cat||x.category===cat);return `<option value="">${localeText('device.selectOptional')}</option>${opts.map(d=>`<option value="${esc(d.name)}" ${d.name===selected?'selected':''}>${esc(d.name)}</option>`).join('')}`}
function entryForm(e={}){const t=localeText,editing=!!e.id;openModal(t(editing?'form.editEntry':'form.newSession'),`<div class="formgrid"><div class="formrow"><label>${t('form.date')}</label><input class="field" id="f-date" type="date" value="${esc(e.date||now())}"></div><div class="formrow"><label>${t('form.time')}</label><input class="field" id="f-time" type="time" value="${esc(e.time||new Date().toTimeString().slice(0,5))}"></div><div class="formrow"><label>${t('form.deviceClass')}</label><select class="field" id="f-cat">${Object.entries(names).map(([k,n])=>`<option value="${k}" ${e.category===k?'selected':''}>${n}</option>`).join('')}</select></div><div class="formrow"><label>${t('form.device')}</label><select class="field" id="f-device">${selectDevice(e.category||'vaporizer',e.device||'')}</select></div><div class="formrow"><label>${t('form.strain')}</label><input class="field" id="f-strain" list="strains-list" value="${esc(e.strain||'')}" placeholder="${t('form.strainPlaceholder')}"><datalist id="strains-list">${db.strains.map(s=>`<option>${esc(s.name)}</option>`).join('')}</datalist></div><div class="formrow"><label>${t('form.puffs')}</label><input class="field" id="f-puffs" type="number" min="0" value="${esc(e.puffs||'')}" placeholder="${t('form.optional')}"></div><div class="formrow"><label>${t('form.duration')}</label><input class="field" id="f-duration" type="number" min="0" value="${esc(e.duration||'')}"></div><div class="formrow"><label>${t('form.temperature')}</label><input class="field" id="f-temp" type="number" value="${esc(e.temp||'')}"></div><div class="formrow"><label>${t('form.location')}</label><input class="field" id="f-location" value="${esc(e.location||'')}"></div><div class="formrow"><label>${t('form.taste')}</label><select class="field" id="f-taste"><option value="">${t('form.noInfo')}</option>${[1,2,3,4,5].map(n=>`<option ${String(e.taste)===String(n)?'selected':''}>${n}</option>`).join('')}</select></div><div class="formrow full"><label>${t('form.notes')}</label><textarea class="field" id="f-notes">${esc(e.notes||'')}</textarea></div><div class="formrow full"><label><input type="checkbox" id="f-save-strain" style="width:auto" checked> ${t('form.autoSaveStrain')}</label></div></div>`,t(editing?'form.saveChanges':'form.saveEntry'),()=>{let x={...(e||{}),id:e.id||id(),date:$('#f-date').value,time:$('#f-time').value,category:$('#f-cat').value,device:$('#f-device').value,strain:$('#f-strain').value.trim(),puffs:$('#f-puffs').value,duration:$('#f-duration').value,temp:$('#f-temp').value,location:$('#f-location').value,taste:$('#f-taste').value,notes:$('#f-notes').value.trim()};let puffMatch=x.notes.match(/(?:anzahl\s*)?(?:züge|zuege|puffs?)\s*[:=]?\s*(\d+)/i);if(!x.puffs&&puffMatch)x.puffs=puffMatch[1];if($('#f-save-strain').checked&&x.strain&&!db.strains.some(s=>s.name.toLowerCase()===x.strain.toLowerCase()))db.strains.push({id:id(),name:x.strain,category:'',notes:''});if(e.id)db.entries=db.entries.map(a=>a.id===e.id?x:a);else{db.entries.unshift(x);db.game.xp+=3}put();$('#modal-root').innerHTML='';render();toast(t('form.entrySaved'))});$('#f-cat').onchange=()=>$('#f-device').innerHTML=selectDevice($('#f-cat').value)}

function strains(v){v.innerHTML=`${header(localeText('page.strains.eyebrow'),localeText('page.strains.title'),localeText('page.strains.description'),`<button class="btn primary" data-action="new-strain">${localeText('action.addStrain')}</button>`)}<div class="toolbar"><input class="field" id="strain-search" placeholder="${localeText('strains.search')}"></div><div class="grid cards2" id="strain-list">${strainCards()}</div>`;$('#strain-search').oninput=()=>$('#strain-list').innerHTML=strainCards($('#strain-search').value);bindGlobal()}
function strainCards(q=''){let a=db.strains.filter(s=>!q||JSON.stringify(s).toLowerCase().includes(q.toLowerCase()));return a.length?a.map(s=>`<div class="card"><div class="row"><div><span class="pill">${esc(s.category||'SAMMLUNG')}</span><h3 style="font:700 16px Manrope;margin:12px 0 3px">${esc(s.name)}</h3><div class="tagline">${esc(s.manufacturer||'Hersteller nicht angegeben')}</div></div><div class="inline-actions"><button class="btn small" data-edit-strain="${s.id}">Bearbeiten</button><button class="btn small" data-del-strain="${s.id}">Löschen</button></div></div>${s.notes?`<p class="subheading">${esc(s.notes)}</p>`:''}</div>`).join(''):empty('Noch keine Sorten','Füge deine erste Sorte hinzu.')}
function strainForm(s={}){const t=localeText;openModal(t(s.id?'strain.edit':'strain.add'),`<div class="formgrid"><div class="formrow"><label>${t('strain.name')}</label><input class="field" id="s-name" value="${esc(s.name||'')}"></div><div class="formrow"><label>${t('strain.manufacturer')}</label><input class="field" id="s-maker" value="${esc(s.manufacturer||'')}"></div><div class="formrow"><label>${t('strain.category')}</label><input class="field" id="s-cat" placeholder="${t('strain.categoryPlaceholder')}" value="${esc(s.category||'')}"></div><div class="formrow full"><label>${t('form.notes')}</label><textarea class="field" id="s-notes">${esc(s.notes||'')}</textarea></div></div>`,t('strain.save'),()=>{let x={id:s.id||id(),name:$('#s-name').value.trim(),manufacturer:$('#s-maker').value.trim(),category:$('#s-cat').value.trim(),notes:$('#s-notes').value.trim()};if(!x.name)return toast(t('strain.nameRequired'));if(s.id)db.strains=db.strains.map(a=>a.id===s.id?x:a);else db.strains.push(x);put();$('#modal-root').innerHTML='';render()})}

function devices(v){v.innerHTML=`${header(localeText('page.devices.eyebrow'),localeText('page.devices.title'),localeText('page.devices.description'),`<button class="btn primary" data-action="new-device">${localeText('action.addDevice')}</button>`)}<div class="grid cards2">${db.devices.length?db.devices.map(d=>`<div class="card"><div class="photo device-photo">${d.photo?`<img src="${d.photo}" alt="${esc(d.name)}">`:'▱'}</div><div class="row" style="margin-top:13px"><div><span class="pill">${names[d.category]||'Gerät'}</span><h3 style="font:700 15px Manrope;margin:8px 0 4px">${esc(d.name)}</h3></div><div class="inline-actions"><button class="btn small" data-edit-device="${esc(d.name)}">${localeText('action.edit')}</button><button class="btn small" data-del-device="${esc(d.name)}">${localeText('action.delete')}</button></div></div><p class="subheading">${esc(d.description||localeText('devices.noDescription'))}</p>${d.manualData?`<div class="manual-card-action"><span class="pill">PDF · ${localeText('device.manualAttached')}</span><button class="btn small soft" data-open-manual="${esc(d.name)}">▤ ${localeText('device.manualOpen')}</button></div>`:''}</div>`).join(''):empty(localeText('devices.none'),localeText('devices.noneHint'))}</div>`;bindGlobal()}
function deviceForm(d={}){const t=localeText;pendingPhoto=null;openModal(t(d.name?'device.edit':'device.add'),`<div class="formgrid"><div class="formrow"><label>${t('device.name')}</label><input class="field" id="d-name" value="${esc(d.name||'')}"></div><div class="formrow"><label>${t('form.deviceClass')}</label><select class="field" id="d-cat">${Object.entries(names).map(([k,n])=>`<option value="${k}" ${d.category===k?'selected':''}>${n}</option>`).join('')}</select></div><div class="formrow full"><label>${t('device.description')}</label><textarea class="field" id="d-desc">${esc(d.description||'')}</textarea></div><div class="formrow full"><label>${t('device.photo')}</label><input class="field" type="file" id="d-photo" accept="image/*"><small class="muted">${t('device.photoHint')}</small>${d.photo?`<div class="photo"><img src="${d.photo}"></div>`:''}</div><div class="formrow full manual-upload"><label for="d-manual">${t('device.manualLabel')}</label><input class="field" type="file" id="d-manual" accept="application/pdf,.pdf"><small class="muted">${t('device.manualHint')}</small>${d.manualName?`<p class="manual-current">📄 ${esc(d.manualName)}</p><label class="manual-remove"><input type="checkbox" id="d-manual-remove"> ${t('device.manualRemove')}</label>`:''}</div></div>`,t('device.save'),()=>{let name=$('#d-name').value.trim();if(!name)return toast(t('device.nameRequired'));let manualFile=$('#d-manual').files[0],removeManual=$('#d-manual-remove')?.checked;if(manualFile&&manualFile.size>3*1024*1024)return toast(t('device.manualTooLarge'));if(manualFile&&!(/\.pdf$/i.test(manualFile.name)||manualFile.type==='application/pdf'))return toast(t('device.manualPdfOnly'));const saveD=(photo,manualData,manualName)=>{let x={...d,name,category:$('#d-cat').value,description:$('#d-desc').value.trim(),photo:photo||d.photo||'',manualData:removeManual?'':manualData||d.manualData||'',manualName:removeManual?'':manualName||d.manualName||''};if(d.name)db.devices=db.devices.map(a=>a.name===d.name?x:a);else db.devices.push(x);put();$('#modal-root').innerHTML='';render()};const saveManual=photo=>{if(removeManual)return saveD(photo,'','');if(!manualFile)return saveD(photo,null,null);let reader=new FileReader();reader.onerror=()=>toast(t('device.manualReadError'));reader.onload=()=>{let data=String(reader.result||'');if(!data.startsWith('data:application/pdf;base64,'))return toast(t('device.manualPdfOnly'));const signature=atob(data.split(',')[1]).slice(0,5);if(signature!=='%PDF-')return toast(t('device.manualPdfOnly'));saveD(photo,data,manualFile.name)};reader.readAsDataURL(manualFile)};let photoFile=$('#d-photo').files[0];if(photoFile)compress(photoFile,saveManual);else saveManual(null)})}
function openDeviceManual(deviceName){
 const d=db.devices.find(x=>x.name===deviceName);
 if(!d?.manualData)return toast(localeText('device.manualMissing'));
 const root=$('#modal-root');let pdfDoc=null,renderTask=null,pageNumber=1,closed=false,bytes,zoom=1;
 try{const encoded=d.manualData.split(',')[1];if(!encoded)throw Error('PDF-Daten fehlen');const binary=atob(encoded);bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i)}catch(error){console.error(error);return toast(localeText('device.manualReadError'))}
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
function compress(file,done){let r=new FileReader();r.onerror=()=>toast('Foto konnte nicht gelesen werden.');r.onload=()=>{let im=new Image();im.onerror=()=>toast('Bildformat konnte nicht verarbeitet werden.');im.onload=()=>{let c=document.createElement('canvas'),scale=Math.min(1,900/Math.max(im.width,im.height));c.width=Math.max(1,Math.round(im.width*scale));c.height=Math.max(1,Math.round(im.height*scale));c.getContext('2d').drawImage(im,0,0,c.width,c.height);let src=c.toDataURL('image/jpeg',.60);if(src.length>700000){let c2=document.createElement('canvas'),scale2=.75;c2.width=Math.max(1,Math.round(c.width*scale2));c2.height=Math.max(1,Math.round(c.height*scale2));c2.getContext('2d').drawImage(c,0,0,c2.width,c2.height);src=c2.toDataURL('image/jpeg',.48)}done(src)};im.src=r.result};r.readAsDataURL(file)}
function gallery(v){const galleryDescription=localeText('page.gallery.description');v.innerHTML=`${header(localeText('page.gallery.eyebrow'),localeText('page.gallery.title'),galleryDescription,`<button class="btn primary" data-action="new-photo">${localeText('action.addPhoto')}</button>`)}<div class="grid gallery-grid">${db.photos.length?db.photos.map((p,i)=>`<article class="card gallery-card"><button class="gallery-thumb" type="button" data-gallery-open="${i}" aria-label="${localeText('gallery.openPhoto',{number:i+1})}"><img src="${p.src}" alt="${esc(p.title||localeText('gallery.moment'))}"></button><div class="row gallery-meta"><div class="gallery-caption"><b>${esc(p.title||localeText('gallery.moment'))}</b><div class="tagline">${esc(p.date||'')} · ${esc(p.device||p.entry||localeText('gallery.general'))}</div></div><button class="btn small" data-del-photo="${p.id}" aria-label="${localeText('gallery.deletePhoto')}">${localeText('action.delete')}</button></div></article>`).join(''):empty(localeText('gallery.empty'),localeText('gallery.emptyHint'))}</div>`;bindGlobal()}
function showGalleryLightbox(){if(!db.photos.length)return;galleryIndex=(galleryIndex+db.photos.length)%db.photos.length;const p=db.photos[galleryIndex];$('#modal-root').innerHTML=`<div class="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Foto-Großansicht"><div class="gallery-lightbox-panel"><div class="gallery-lightbox-top"><span>${esc(p.title||'Moment')}</span><button type="button" class="gallery-lightbox-close" data-lightbox-close aria-label="Großansicht schließen">×</button></div><div class="gallery-lightbox-stage"><button type="button" class="gallery-lightbox-nav" data-lightbox-prev aria-label="Vorheriges Bild">‹</button><img src="${p.src}" alt="${esc(p.title||'Galeriefoto')}"><button type="button" class="gallery-lightbox-nav" data-lightbox-next aria-label="Nächstes Bild">›</button></div><div class="gallery-lightbox-bottom"><span>${esc(p.date||'')} · ${esc(p.device||p.entry||'Allgemein')}</span><span>${galleryIndex+1} / ${db.photos.length}</span></div></div></div>`;document.body.style.overflow='hidden'}
function closeGalleryLightbox(){const root=$('#modal-root');if(root?.querySelector('.gallery-lightbox')){root.innerHTML='';document.body.style.overflow=''}}
document.addEventListener('click',e=>{const open=e.target.closest('[data-gallery-open]');if(open){galleryIndex=Number(open.dataset.galleryOpen)||0;showGalleryLightbox();return}if(e.target.closest('[data-lightbox-close]')||e.target.classList.contains('gallery-lightbox')){closeGalleryLightbox();return}if(e.target.closest('[data-lightbox-prev]')){galleryIndex--;showGalleryLightbox();return}if(e.target.closest('[data-lightbox-next]')){galleryIndex++;showGalleryLightbox()}});
document.addEventListener('keydown',e=>{if(!$('#modal-root .gallery-lightbox'))return;if(e.key==='Escape'){closeGalleryLightbox();e.preventDefault()}else if(e.key==='ArrowLeft'){galleryIndex--;showGalleryLightbox();e.preventDefault()}else if(e.key==='ArrowRight'){galleryIndex++;showGalleryLightbox();e.preventDefault()}});
function photoForm(){const t=localeText;openModal(t('photo.add'),`<div class="formgrid"><div class="formrow full"><label>${t('photo.file')}</label><input class="field" type="file" id="p-file" accept="image/*" required></div><div class="formrow"><label>${t('photo.title')}</label><input class="field" id="p-title" placeholder="${t('photo.titlePlaceholder')}"></div><div class="formrow"><label>${t('form.date')}</label><input class="field" id="p-date" type="date" value="${now()}"></div><div class="formrow full"><label>${t('photo.device')}</label><select class="field" id="p-device"><option value="">${t('photo.none')}</option>${db.devices.map(d=>`<option>${esc(d.name)}</option>`).join('')}</select></div><div class="formrow full"><label>${t('photo.entry')}</label><select class="field" id="p-entry"><option value="">${t('photo.none')}</option>${db.entries.map(e=>`<option value="${e.id}">${esc(e.date)} · ${esc(e.device||'Session')}</option>`).join('')}</select></div></div>`,t('photo.save'),()=>{let f=$('#p-file').files[0];if(!f)return toast(t('photo.required'));compress(f,src=>{db.photos.push({id:id(),src,title:$('#p-title').value,date:$('#p-date').value,device:$('#p-device').value,entry:$('#p-entry').value});put();$('#modal-root').innerHTML='';render()})})}

function quests(v){let xp=db.game.xp||0,lvl=Math.floor(xp/100)+1,week=db.entries.filter(e=>{let d=new Date(e.date),n=new Date();return d>=new Date(n-7*864e5)}).length;v.innerHTML=`${header(localeText('page.quests.eyebrow'),localeText('page.quests.title'),localeText('page.quests.description'),'')}<div class="grid stats">${card(localeText('quests.level'),lvl,localeText('quests.nextLevel',{xp:xp%100}))}${card(localeText('quests.xp'),xp,localeText('quests.xp'))}${card(localeText('quests.coins'),db.game.coins||0,localeText('quests.coins'))}${card(localeText('quests.weekGoal'),`${Math.min(week,3)} / 3`,localeText('quests.documentation'))}</div><div class="progress"><i style="width:${xp%100}%"></i></div><div class="section-head"><h3>${localeText('quests.title')}</h3></div><div class="grid cards2">${questData.map(q=>{let done=db.game.quests.includes(q.id),ready=q.check();return `<div class="card"><span class="pill">${done?localeText('quests.completed'):localeText('quests.quest')}</span><h3 style="font:700 16px Manrope">${q.name}</h3><p class="subheading">${q.desc}</p><div class="tagline">+${q.xp} XP · +${q.coins} Coins</div><button class="btn ${ready&&!done?'primary':'soft'} small" style="margin-top:14px" data-claim="${q.id}" ${done||!ready?'disabled':''}>${done?localeText('quests.done'):ready?localeText('quests.claim'):localeText('quests.notReached')}</button></div>`}).join('')}</div>`;bindGlobal()}
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
 const old=db.game.courses[c.id],lessons=courseLessons(c),questions=courseQuestions(c);
 const lessonMarkup=c.richLessons
  ? c.richLessons.map((lesson,i)=>`<section class="edu-lesson"><div class="edu-lesson-head"><span class="edu-lesson-number">0${i+1}</span><h3>${esc(lesson.title)}</h3></div><div class="edu-lesson-content">${lesson.html}</div></section>`).join('')
  : `<h3>${localeText('course.lessonHeading')}</h3><ol class="course-lessons">${lessons.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
 const sourceMarkup=c.id==="ecig-structure"&&c.richLessons ? "<hr style='border:0;border-top:1px solid var(--line);margin:22px 0'><h3>Quellen und fachliche Grundlage</h3><p>Die inhaltliche Grundlage bildet dein gewünschter Wikipedia-Artikel:</p><ul><li><a href='https://de.wikipedia.org/wiki/Elektrische_Zigarette?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Elektrische Zigarette – Wikipedia</a></li><li><a href='https://de.wikipedia.org/wiki/Aufbau_von_elektronischen_Zigaretten?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Aufbau von elektronischen Zigaretten – Wikipedia</a></li></ul><p>Für die gesundheitlichen und sicherheitsbezogenen Aussagen ergänze ich seriöse Fachquellen:</p><ul><li><a href='https://www.bfr.bund.de/veroeffentlichung/e-zigaretten-alles-andere-als-harmlos/?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Bundesinstitut für Risikobewertung (BfR) – E-Zigaretten</a></li><li><a href='https://www.dkfz.de/fileadmin/user_upload/Krebspraevention/Download/pdf/Buecher_und_Berichte/2023_Risiken-von-E-Zigaretten-und-Tabakerhitzern.pdf?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Deutsches Krebsforschungszentrum – Risiken von E-Zigaretten</a></li></ul><p>Wikipedia dient als technische Einstiegsquelle, nicht als alleinige wissenschaftliche oder medizinische Autorität.</p>" : "";
 const quizMarkup=questions.map((q,i)=>`<div class="formrow course-question" style="margin:14px 0"><label>${i+1}. ${esc(q[0])}</label>${q[1].map((a,j)=>`<label style="font-weight:400"><input type="radio" name="cq${i}" value="${j}" style="width:auto"> ${esc(a)}</label>`).join('')}</div>`).join('');
 const quizIntro=c.id==="ecig-structure"&&c.richLessons
  ? "<p class='subheading'><strong>Dein Wissenstest</strong> · /10 beantwortet<br>Der Test umfasst 10 Fragen. Pro Frage gibt es eine richtige Antwort. Als bestanden gilt der Test mit mindestens 8 richtigen Antworten.</p>"
  : `<p class="subheading">${localeText('course.quizHint')}</p>`;
 openModal(courseTitle(c),`<div class="course-intro">${c.richLessons?'<div class="edu-course-banner"><span class="pill">GRUNDLAGEN · 7 LEKTIONEN</span><p>My Vaping Education</p><small>Technik verstehen · Zusammenhänge erkennen · Sicherheit kennen</small></div>':''}<span class="pill">${courseLevel(c)}</span><p class="subheading">${c.descriptionKey?localeText(c.descriptionKey):esc(c.description||localeText('learn.learnBasics'))}</p>${lessonMarkup}<div class="course-note">${esc(c.disclaimer||localeText('course.smoking.disclaimer'))}</div><hr style="border:0;border-top:1px solid var(--line);margin:22px 0"><h3>${localeText('course.quizHeading')}</h3>${quizIntro}${quizMarkup}${sourceMarkup}</div>`,old?.passed?localeText('learn.viewResult'):localeText('course.submitQuiz'),()=>{
  let score=0;
  for(let i=0;i<questions.length;i++){let a=$('[name="cq'+i+'"]:checked');if(!a)return toast(localeText('course.answerAll'));if(+a.value===questions[i][2])score++}
  const pct=Math.round(score/questions.length*100),passed=pct>=80,was=old?.passed;
  if(passed&&!was){db.game.xp=(Number(db.game.xp)||0)+c.xp;db.game.coins=(Number(db.game.coins)||0)+c.coins}
  const bestScore=Math.max(Number(old?.score)||0,pct);
  db.game.courses[c.id]={passed:passed||was,score:bestScore,date:now(),...(old?.passed?{coins:old.coins}:passed?{coins:c.coins}:{})};
  put();$('#modal-root').innerHTML='';render();toast(`${passed?localeText('course.passed'):localeText('course.notPassed')} · ${pct}%`)
 });
}

function controlledVaping(v){
 const lang=window.MVA_I18N?.getLanguage?.()||'de';
 const dict={
 de:{eyebrow:'BEWUSST DOKUMENTIEREN',title:'Kontrolliertes Vapen',sub:'Phase 1 · Bestandsaufnahme',intro:'Zunächst wird nur beobachtet und dokumentiert. Es werden noch keine Reduktionsziele festgelegt.',start:'Start der Bestandsaufnahme',save:'Startdatum speichern',week:'Woche auswählen',prevWeek:'Vorherige Woche',nextWeek:'Nächste Woche',category:'Kategorie',time:'Uhrzeit',total:'Gesamtwoche',perDay:'Vaping-Sessions pro Tag',free:'Konsumfreie Tage',duration:'Dauer der Bestandsaufnahme',days:'Tage',left:'Noch',notStarted:'Lege das Startdatum fest, um deine Bestandsaufnahme zu beginnen.',noEntries:'Für diese Woche sind noch keine Tagebucheinträge vorhanden.',note:'Eine Session entspricht einem gespeicherten Tagebucheintrag. Die Tabelle wird automatisch aus deinen Tagebucheinträgen berechnet. Einträge ohne Uhrzeit zählen zur Tages- und Wochensumme, können aber keinem Zeitfenster zugeordnet werden.',slot:['0 bis 6','6 bis 12','12 bis 18','18 bis 24'],sessions:'Sessions',missing:'Einträge ohne Uhrzeit',avg:'Durchschnitt pro Kalendertag',of:'von 7 Tagen',reached:'30 Tage erreicht'},
 en:{eyebrow:'DOCUMENT YOUR PATTERNS',title:'Controlled Vaping',sub:'Phase 1 · Baseline',intro:'First, observe and document only. No reduction targets are set yet.',start:'Baseline start date',save:'Save start date',week:'Select week',prevWeek:'Previous week',nextWeek:'Next week',category:'Category',time:'Time',total:'Week total',perDay:'Vaping sessions per day',free:'Vape-free days',duration:'Baseline duration',days:'days',left:'Remaining',notStarted:'Set a start date to begin your baseline.',noEntries:'There are no diary entries for this week yet.',note:'One session equals one saved diary entry. The table is calculated automatically from your diary. Entries without a time count toward daily and weekly totals but cannot be assigned to a time slot.',slot:['0 to 6','6 to 12','12 to 18','18 to 24'],sessions:'Sessions',missing:'Entries without time',avg:'Average per calendar day',of:'of 7 days',reached:'30 days reached'},
 fr:{eyebrow:'OBSERVER ET DOCUMENTER',title:'Vapotage contrôlé',sub:'Phase 1 · État des lieux',intro:'Au début, on observe et on documente uniquement. Aucun objectif de réduction n’est encore fixé.',start:'Date de début',save:'Enregistrer la date',week:'Choisir la semaine',prevWeek:'Semaine précédente',nextWeek:'Semaine suivante',category:'Catégorie',time:'Heure',total:'Total semaine',perDay:'Sessions par jour',free:'Jours sans vapotage',duration:'Durée de l’observation',days:'jours',left:'Restants',notStarted:'Définis une date de début pour commencer.',noEntries:'Aucune entrée de journal pour cette semaine.',note:'Une session correspond à une entrée enregistrée dans le journal. Le tableau est calculé automatiquement. Les entrées sans heure comptent dans les totaux quotidiens et hebdomadaires, mais pas dans une plage horaire.',slot:['0 à 6','6 à 12','12 à 18','18 à 24'],sessions:'Sessions',missing:'Entrées sans heure',avg:'Moyenne par jour',of:'sur 7 jours',reached:'30 jours atteints'}
 };
 const t=dict[lang]||dict.de;
 const localDate=s=>{const p=s.split('-').map(Number);return new Date(p[0],p[1]-1,p[2])};
 const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 const fmt=d=>d.toLocaleDateString(lang==='fr'?'fr-FR':lang==='en'?'en-GB':'de-DE',{weekday:'short',day:'2-digit',month:'2-digit'});
 const weekInput=$('#cv-week')?.value||now(),chosen=localDate(weekInput),monday=new Date(chosen);
 monday.setDate(chosen.getDate()-(chosen.getDay()+6)%7);
 const days=Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return iso(d)});
 const entries=db.entries.filter(e=>days.includes(e.date));
 const categories=[['vaporizer',lang==='en'?'Vaporizer':lang==='fr'?'Vaporisateur':'Vaporizer'],['ecig',lang==='en'?'E-cigarette':lang==='fr'?'Cigarette électronique':'E-Zigarette'],['heater',lang==='en'?'Tobacco heater':lang==='fr'?'Tabac chauffé':'Tabakheater']];
 const bucket=e=>{const m=String(e.time||'').match(/^(\d{1,2}):(\d{2})$/);if(!m)return -1;const h=+m[1];return h<6?0:h<12?1:h<18?2:3};
 const count=(cat,slot,day)=>entries.filter(e=>(!cat||e.category===cat)&&(!day||e.date===day)&&(slot===-2||bucket(e)===slot)).length;
 const dayTotals=days.map(d=>count(null,-2,d)),weekTotal=dayTotals.reduce((x,y)=>x+y,0),freeDays=dayTotals.filter(x=>x===0).length,missing=entries.filter(e=>bucket(e)<0).length;
 const startDate=db.controlledVaping?.startDate||'',started=!!startDate,elapsed=started?Math.max(0,Math.floor((localDate(now())-localDate(startDate))/86400000)+1):0,remaining=Math.max(0,30-elapsed);
 let table='';
 categories.forEach(pair=>{for(let slot=0;slot<4;slot++){table+='<tr><td>'+(slot===0?'<strong>'+pair[1]+'</strong>':'')+'</td><td>'+t.slot[slot]+'</td>';days.forEach(d=>{const n=count(pair[0],slot,d);table+='<td class="cv-num">'+(n||'–')+'</td>'});const total=count(pair[0],slot,null);table+='<td class="cv-num cv-total">'+(total||'–')+'</td></tr>'}});
 const dayHeaders=days.map(d=>'<th>'+fmt(localDate(d))+'</th>').join('');
 const dayCells=dayTotals.map(n=>'<td class="cv-num">'+(n||'–')+'</td>').join('');
 const stats=card(t.sessions,weekTotal,t.total)+card(t.free,freeDays,t.of)+card(t.missing,missing,'')+card(t.perDay,(weekTotal/7).toFixed(1),t.avg);
 const progress=started?'<div class="cv-progress"><div class="row"><b>'+t.duration+': '+elapsed+'/30 '+t.days+'</b><span class="pill">'+(remaining?t.left+' '+remaining+' '+t.days:t.reached)+'</span></div><div class="progress"><i style="width:'+Math.min(100,elapsed/30*100)+'%"></i></div></div>':'<p class="tagline">'+t.notStarted+'</p>';
 v.innerHTML=header(t.eyebrow,t.title,t.sub,'')+
 '<section class="cv-intro card"><span class="pill">PHASE 1</span><p>'+t.intro+'</p><div class="cv-start-row"><label class="formrow"><span>'+t.start+'</span><input class="field" id="cv-start" type="date" value="'+esc(startDate||now())+'"></label><button class="btn primary" id="cv-save-start">'+t.save+'</button></div>'+progress+'</section>'+
 '<div class="row cv-week-row"><div><h3>'+t.category+' · '+t.weeks+'</h3><p class="subheading">'+t.note+'</p></div><div class="cv-week-picker"><button class="cv-week-arrow" id="cv-week-prev" type="button" aria-label="'+t.prevWeek+'" title="'+t.prevWeek+'">‹</button><label class="formrow"><span>'+t.week+'</span><input class="field" id="cv-week" type="date" value="'+esc(weekInput)+'"></label><button class="cv-week-arrow" id="cv-week-next" type="button" aria-label="'+t.nextWeek+'" title="'+t.nextWeek+'">›</button></div></div>'+
 '<div class="grid stats cv-stats">'+stats+'</div><div class="card cv-table-card"><div class="cv-table-wrap"><table class="cv-table"><thead><tr><th>'+t.category+'</th><th>'+t.time+'</th>'+dayHeaders+'<th>'+t.total+'</th></tr></thead><tbody>'+table+
 '<tr class="cv-day-total"><td colspan="2"><strong>'+t.perDay+'</strong></td>'+dayCells+'<td class="cv-num cv-total">'+weekTotal+'</td></tr></tbody></table></div></div>'+
 '<p class="tagline cv-note">'+t.note+'</p>'+(entries.length?'':'<div class="card empty">'+t.noEntries+'<div style="margin-top:12px"><button class="btn soft" data-page="diary">Zum Tagebuch</button></div></div>');
 $('#cv-week').addEventListener('change',()=>controlledVaping(v));
 const shiftWeek=delta=>{const input=$('#cv-week');const selected=localDate(input.value||now());selected.setDate(selected.getDate()+delta*7);input.value=iso(selected);controlledVaping(v)};
 $('#cv-week-prev').addEventListener('click',()=>shiftWeek(-1));
 $('#cv-week-next').addEventListener('click',()=>shiftWeek(1));
 $('#cv-save-start').onclick=()=>{const value=$('#cv-start').value;if(!value)return toast('Bitte ein Startdatum auswählen.');db.controlledVaping={...(db.controlledVaping||{}),startDate:value};put();controlledVaping(v);toast('Startdatum gespeichert.')};
}

function backup(v){const t=localeText,counts={entries:db.entries.length,devices:db.devices.length,strains:db.strains.length,photos:db.photos.length};const countText=t('storage.counts',counts);const cloudCard=storageMode==='cloud'? `<div class="card"><span class="pill">${t('storage.activeEncrypted')}</span><h3 style="font:700 16px Manrope">${t('storage.cloudAccount',{account:esc(cloudSession?.username||'')})}</h3><p class="subheading">${t('storage.encryption')}</p><div class="formrow" style="margin:14px 0"><label for="cloud-change-email">${t('storage.email')}</label><input class="field" id="cloud-change-email" type="email" autocomplete="email" maxlength="254" value="${esc(cloudSession?.email||'')}" placeholder="name@example.com"></div><button class="btn soft" data-action="cloud-change-email">${t('storage.emailRequest')}</button><p class="tagline">${t('storage.accountKept')}</p><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><h3 style="font:700 16px Manrope">${t('storage.changePassword')}</h3><p class="subheading">${t('storage.passwordDescription')}</p><div class="formrow" style="margin:12px 0"><label for="cloud-current-password">${t('storage.oldPassword')}</label><input class="field" id="cloud-current-password" type="password" autocomplete="current-password"></div><div class="formrow" style="margin:12px 0"><label for="cloud-new-password">${t('storage.newPassword')}</label><input class="field" id="cloud-new-password" type="password" autocomplete="new-password" minlength="8"></div><div class="formrow" style="margin:12px 0"><label for="cloud-confirm-password">${t('storage.repeatPassword')}</label><input class="field" id="cloud-confirm-password" type="password" autocomplete="new-password" minlength="8"></div><button class="btn primary" id="cloud-password-save" data-action="cloud-change-password">${t('storage.changePassword')}</button><button class="btn" data-action="switch-local">${t('storage.switchLocal')}</button></div>`:`<div class="card"><span class="pill">${t('storage.optional')}</span><h3 style="font:700 16px Manrope">${t('storage.encryptedCloud')}</h3><p class="subheading">${t('storage.cloudLoginDescription')}</p>${cloudReady()?'':`<p class="tagline" style="color:#9b5c27">${t('storage.setup')}</p>`}<div class="formrow" style="margin:13px 0 8px"><label for="cloud-email">${t('storage.emailLegacy')}</label><input class="field" id="cloud-email" type="text" autocomplete="username" maxlength="254" placeholder="name@example.com oder username" ${cloudReady()?'':'disabled'}></div><div class="formrow" style="margin:8px 0 12px"><label for="cloud-pass">${t('storage.password')}</label><input class="field" id="cloud-pass" type="password" autocomplete="current-password" minlength="8" ${cloudReady()?'':'disabled'}></div><button class="btn primary" id="cloud-connect" data-action="cloud-login" ${cloudReady()?'':'disabled'}>${t('storage.login')}</button> <button class="btn soft" data-action="cloud-signup" ${cloudReady()?'':'disabled'}>${t('storage.register')}</button> <button class="text-btn" data-action="cloud-reset" ${cloudReady()?'':'disabled'}>${t('storage.forgot')}</button><p class="tagline">${t('storage.confirmation')}</p></div>`;v.innerHTML=`${header(t('storage.eyebrow'),t('storage.title'),t('storage.subtitle'),'')}<div class="grid cards2" style="margin-top:23px"><div class="card" style="grid-column:1/-1;border:1px solid var(--accent);background:linear-gradient(135deg,var(--card),var(--surface))"><span class="pill">${storageMode==='cloud'?t('storage.cloudActive'):t('storage.localActive')}</span><h3 style="font:700 18px Manrope;margin:12px 0 6px">${t('storage.diary')}</h3><p class="subheading">${storageMode==='cloud'?t('storage.cloudDescription',{account:esc(cloudSession?.username||'your account')}):t('storage.localDescription')}</p><div class="tagline" style="font-weight:700;margin-top:12px">${countText}</div></div>${cloudCard}<div class="card"><span class="pill">${t('storage.recommended')}</span><h3 style="font:700 16px Manrope">${t('storage.json')}</h3><p class="subheading">${t('storage.jsonDescription')}</p><button class="btn primary" data-action="export-json">${t('storage.download')}</button></div><div class="card"><span class="pill">${t('storage.restore')}</span><h3 style="font:700 16px Manrope">${t('storage.restoreTitle')}</h3><p class="subheading">${t('storage.restoreDescription')}</p><input type="file" id="json-file" class="field" accept=".json,application/json"><button class="btn soft" data-action="import-json" style="margin-top:10px">${t('storage.selectJson')}</button></div><div class="card"><span class="pill">${t('storage.diaryPill')}</span><h3 style="font:700 16px Manrope">${t('storage.csv')}</h3><p class="subheading">${t('storage.csvDescription')}</p><button class="btn" data-action="export-csv">${t('storage.exportCsv')}</button><label class="btn soft" style="display:inline-block;margin:8px 0">${t('storage.importCsv')}<input id="csv-file" hidden type="file" accept=".csv,text/csv"></label><div id="csv-preview"></div></div><div class="card"><span class="pill">${storageMode==='cloud'?t('storage.cloud'):t('storage.local')}</span><h3 style="font:700 16px Manrope">${t('storage.activeSave')}</h3><p class="subheading">${storageMode==='cloud'?t('storage.cloudBadge'):t('storage.localBadge')}</p><div class="tagline">${countText}</div></div></div>`;bindGlobal();$('#csv-file').onchange=importCsv;$('#json-file').onchange=importJson}

function csvExport(){let cols=['date','time','category','device','duration','puffs','strain','temp','location','taste','notes'],labels=['Datum','Uhrzeit','Kategorie','Gerät','Dauer','Puffs','Sorte','Temperatur','Ort','Geschmack','Notizen'],csv=[labels,...db.entries.map(e=>cols.map(k=>e[k]||''))].map(r=>r.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(';')).join('\r\n');download(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),'my-vaping-diary.csv')}
function download(blob,name){let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function jsonExport(){download(new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),'my-vaping-adventure-backup.json')}
function validBackup(x){
 if(!x||typeof x!=='object'||Array.isArray(x))return false;
 if(['__proto__','prototype','constructor'].some(k=>Object.hasOwn(x,k)))return false;
 if(!Array.isArray(x.entries)||!Array.isArray(x.devices))return false;
 for(const k of ['strains','photos'])if(x[k]!==undefined&&!Array.isArray(x[k]))return false;
 for(const k of ['entries','devices','strains','photos']){
  if(!Array.isArray(x[k]))continue;
  if(x[k].some(v=>!v||(typeof v!=='object'&&!(k==='devices'&&typeof v==='string'))||Array.isArray(v)))return false;
 }
 if(x.devices.some(d=>typeof d==='string'?!d.trim():typeof d.name!=='string'||!d.name.trim()))return false;
 if((x.strains||[]).some(s=>typeof s.name!=='string'||!s.name.trim()))return false;
 if((x.photos||[]).some(p=>typeof p.src!=='string'||!p.src.trim()))return false;
 if(x.game!==undefined&&(!x.game||typeof x.game!=='object'||Array.isArray(x.game)))return false;
 return true;
}
function importJson(e){
 const f=e.target.files?.[0];if(!f)return;
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const x=JSON.parse(reader.result);
   if(!validBackup(x))throw Error('Ungültige Backup-Struktur');
   if(!confirm(localeText('confirm.backupReplace')))return;
   const base=emptyDb();
   const next={...base,...x,entries:x.entries,devices:x.devices.map(d=>typeof d==='string'?{name:d,category:'vaporizer'}:{...d,category:names[d.category]?d.category:'vaporizer'}),strains:x.strains||[],photos:x.photos||[],game:{...base.game,...(x.game||{})}};
   jsonExport();
   db=next;if(storageMode==='local')localDb=db;
   put();render();toast('Backup geprüft und wiederhergestellt');
  }catch(error){
   console.error('JSON-Backup konnte nicht importiert werden:',error);
   toast('Backup ungültig oder beschädigt. Deine bisherigen Daten wurden nicht ersetzt.');
  }finally{e.target.value=''}
 };
 reader.onerror=()=>toast('Backup-Datei konnte nicht gelesen werden');
 reader.readAsText(f);
}
function parseCsv(t){let delim=(t.split(/\r?\n/)[0].match(/;/g)||[]).length>=(t.split(/\r?\n/)[0].match(/,/g)||[]).length?';':',',rows=[],r=[],s='',q=false;t=t.replace(/^\uFEFF/,'');for(let i=0;i<t.length;i++){let c=t[i];if(c==='"'&&q&&t[i+1]==='"'){s+='"';i++}else if(c==='"')q=!q;else if(c===delim&&!q){r.push(s);s=''}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&t[i+1]==='\n')i++;r.push(s);s='';if(r.some(x=>x.trim()))rows.push(r);r=[]}else s+=c}r.push(s);if(r.some(x=>x.trim()))rows.push(r);return rows}
function importCsv(e){let f=e.target.files[0];if(!f)return;f.text().then(t=>{let rows=parseCsv(t),h=rows.shift().map(x=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,''));csvPending=rows.map(r=>{let o={};h.forEach((k,i)=>o[k]=r[i]||'');let pick=(...keys)=>keys.map(k=>o[k]).find(Boolean)||'';let notes=pick('notizen','notes','bemerkungen'),puffs=pick('puffs','zuege','anzahlzuege')||((notes.match(/(?:züge|zuege|puffs?)\s*[:=]?\s*(\d+)/i)||[])[1]||'');return {id:id(),date:pick('datum','date'),time:pick('uhrzeit','zeit','time'),category:pick('kategorie','category')||'vaporizer',device:pick('geraet','gerat','device'),strain:pick('sorte','strain','material'),duration:pick('dauer','duration'),puffs,notes,temp:pick('temperatur','temp'),location:pick('ort','location'),taste:pick('geschmack','taste')}}).filter(x=>x.device||x.date||x.notes);const normCsvValue=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toLowerCase();let csvFields=['date','time','category','device','duration','puffs','strain','temp','location','taste','notes'];let fingerprint=x=>csvFields.map(k=>normCsvValue(k==='category'?(x[k]||'vaporizer'):x[k])).join('¦');let dup=x=>db.entries.some(y=>fingerprint(y)===fingerprint(x));$('#csv-preview').innerHTML=`<p class="subheading">${csvPending.length} erkannt · ${csvPending.filter(x=>!dup(x)).length} neu · ${csvPending.filter(dup).length} mögliche Duplikate. ${csvPending.slice(0,10).map(x=>`<br>${esc(x.date)} · ${esc(x.device)} ${dup(x)?'· Duplikat':''}`).join('')}</p><button class="btn primary" id="csv-commit" ${csvPending.filter(x=>!dup(x)).length?'':'disabled'}>Neue Einträge übernehmen</button>`;$('#csv-commit').onclick=()=>{const imported=csvPending.filter(x=>!dup(x));imported.forEach(x=>{db.entries.push(x);if(x.device&&!db.devices.some(d=>d.name.toLowerCase()===x.device.toLowerCase()))db.devices.push({name:x.device,category:x.category})});put();render();toast(imported.length+' CSV-Einträge übernommen'+(storageMode==='cloud'?' – Cloud-Synchronisierung läuft mit automatischen Wiederholungen.':''))}}).catch(()=>toast('CSV konnte nicht gelesen werden'))}
function bindGlobal(){document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{switch(b.dataset.action){case'new':entryForm();break;case'new-strain':strainForm();break;case'new-device':deviceForm();break;case'new-photo':photoForm();break;case'export-json':jsonExport();break;case'export-csv':csvExport();break;case'import-json':$('#json-file').click();break;case'cloud-login':cloudLogin(false);break;case'cloud-signup':cloudLogin(true);break;case'cloud-reset':sendPasswordReset();break;case'cloud-change-email':changeCloudEmail();break;case'cloud-change-password':changeCloudPassword();break;case'switch-local':switchLocal();break}});document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>entryForm(db.entries.find(x=>x.id===b.dataset.edit)));document.querySelectorAll('[data-delete-entry]').forEach(b=>b.onclick=()=>{if(confirm(localeText('confirm.deleteEntry'))){db.entries=db.entries.filter(x=>x.id!==b.dataset.deleteEntry);put();render()}});document.querySelectorAll('[data-edit-strain]').forEach(b=>b.onclick=()=>strainForm(db.strains.find(x=>x.id===b.dataset.editStrain)));document.querySelectorAll('[data-del-strain]').forEach(b=>b.onclick=()=>{db.strains=db.strains.filter(x=>x.id!==b.dataset.delStrain);put();render()});document.querySelectorAll('[data-open-manual]').forEach(b=>b.onclick=()=>openDeviceManual(b.dataset.openManual));document.querySelectorAll('[data-edit-device]').forEach(b=>b.onclick=()=>deviceForm(db.devices.find(x=>x.name===b.dataset.editDevice)));document.querySelectorAll('[data-del-device]').forEach(b=>b.onclick=()=>{if(db.entries.some(x=>x.device===b.dataset.delDevice))return toast('Gerät wird noch verwendet');db.devices=db.devices.filter(x=>x.name!==b.dataset.delDevice);put();render()});document.querySelectorAll('[data-del-photo]').forEach(b=>b.onclick=()=>{db.photos=db.photos.filter(x=>x.id!==b.dataset.delPhoto);put();render()});document.querySelectorAll('[data-course]').forEach(b=>b.onclick=()=>courseView(courses.find(c=>c.id===b.dataset.course)));document.querySelectorAll('[data-claim]').forEach(b=>b.onclick=()=>{let q=questData.find(q=>q.id===b.dataset.claim);if(!q||db.game.quests.includes(q.id)||!q.check())return;db.game.quests.push(q.id);db.game.xp=(db.game.xp||0)+q.xp;db.game.coins=(db.game.coins||0)+q.coins;put();render()})}
function newBoot(){db.entries=db.entries.map(e=>{let m=String(e.notes||'').match(/(?:anzahl\s*)?(?:züge|zuege|puffs?)\s*[:=]?\s*(\d+)/i);if(!e.puffs&&m)e.puffs=m[1];return e});put();render()}
applyTheme();
newBoot();
handlePasswordRecovery();
