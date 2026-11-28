# Supabase-Einrichtung für My Vaping Adventure

Diese Anleitung beschreibt die optionale Cloud-Anbindung. Der lokale Tagebuchmodus funktioniert auch ohne Supabase.

## 1. Projekt und Browser-Konfiguration

1. Öffne dein Supabase-Projekt.
2. Unter **Project Settings → API** findest du die **Project URL** und den **publishable key** (bei älteren Projekten ggf. den anon key).
3. Trage ausschließlich diese beiden Werte in `cloud-config.js` ein:

```js
window.MVA_CLOUD = {
  url: "https://DEIN-PROJEKT.supabase.co",
  apiKey: "sb_publishable_DEIN_PUBLIC_KEY"
};
```

Der publishable/anon key ist für die Verwendung im Browser vorgesehen. **Niemals** einen `service_role`- oder Secret-Key, ein Datenbankpasswort oder andere Server-Zugangsdaten in diese Datei oder in sonstigen Browser-Code eintragen.

## 2. Tabelle für Cloud-Spielstände

Lege im Supabase SQL Editor eine Tabelle mit folgender Struktur an (nur falls sie noch nicht existiert):

```sql
create table if not exists public.mva_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
```

## 3. Row Level Security (RLS)

RLS muss für `public.mva_saves` aktiviert sein. Die Policies beschränken jeden angemeldeten Nutzer auf genau den eigenen Datensatz:

```sql
alter table public.mva_saves enable row level security;

create policy "Users can read own save"
on public.mva_saves for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own save"
on public.mva_saves for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own save"
on public.mva_saves for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

Wenn gleichnamige Policies bereits existieren, nicht erneut blind ausführen: erst im Supabase-Tab **Policies** prüfen. Die App benötigt keine öffentliche Schreib- oder Lesepolicy für `anon`.

## 4. Anmeldung und E-Mail

- In **Authentication → Providers** muss E-Mail-Anmeldung aktiviert sein.
- E-Mail-Bestätigung und Passwort-Zurücksetzen müssen aktiviert bzw. korrekt konfiguriert sein.
- Unter **Authentication → URL Configuration** müssen die tatsächlichen App-Adressen als erlaubte Redirect-URLs eingetragen sein (Preview und später Produktion getrennt).
- Für zuverlässige Bestätigungs- und Wiederherstellungs-E-Mails sollte ein eigener SMTP-Anbieter eingerichtet sein.

## 5. Sicherheits- und Betriebsregeln

- RLS eingeschaltet lassen und die drei nutzerbezogenen Policies regelmäßig prüfen.
- Keine Service-Role- oder Secret-Keys im Browser verwenden.
- Cloud-Spielstände werden im Browser mit AES-GCM verschlüsselt, bevor sie an Supabase gesendet werden.
- Neue Spielstände verwenden einen einmalig angezeigten Wiederherstellungscode. Diesen sicher und getrennt vom Gerät aufbewahren. Ohne Passwort und Wiederherstellungscode kann der verschlüsselte Spielstand nicht entschlüsselt werden.
- Zusätzlich regelmäßig ein JSON-Backup herunterladen und sicher aufbewahren.
- Vor Änderungen an Tabellen, Policies oder Auth-Einstellungen zuerst ein Backup erstellen und die Auswirkungen prüfen.

## 6. Funktionsprüfung

Nach der Einrichtung mit zwei getrennten Testkonten prüfen, dass jedes Konto ausschließlich seinen eigenen Spielstand lesen und ändern kann. Anschließend Registrierung, E-Mail-Bestätigung, Anmeldung, Passwort-Reset, Wiederherstellungscode und Synchronisierung zwischen Geräten testen.

## 7. Separater, verschlüsselter Medienspeicher (Vorbereitung – noch nicht aktiv)

Die Medienablage ist eine optionale Erweiterung und wird erst nach Einrichtung und Tests aktiviert. **Noch keine vorhandenen Fotos oder PDFs verschieben.**

Im SQL Editor kann der private Bucket samt benutzergebundenen Policies vorbereitet werden. Vorher vorhandene Policies im Storage-Bereich prüfen; gleichnamige Policies nicht blind duplizieren.

```sql
insert into storage.buckets (id, name, public)
values ('mva-private-media', 'mva-private-media', false)
on conflict (id) do update set public = false;

create policy "MVA media read own objects"
on storage.objects for select to authenticated
using (bucket_id = 'mva-private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "MVA media insert own objects"
on storage.objects for insert to authenticated
with check (bucket_id = 'mva-private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "MVA media update own objects"
on storage.objects for update to authenticated
using (bucket_id = 'mva-private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'mva-private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "MVA media delete own objects"
on storage.objects for delete to authenticated
using (bucket_id = 'mva-private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text);
```

Die Datei `cloud-media.js` stellt verschlüsselte Upload-, Download- und Löschfunktionen bereit. Verifizierte Uploads laden die Datei anschließend wieder herunter und vergleichen Größe sowie SHA-256-Prüfsumme. Diese Funktionen werden erst nach erfolgreicher Einrichtung und Migration mit Galerie und Geräteformularen verbunden. Bis dahin bleiben vorhandene Daten unverändert im bisherigen Cloud-Spielstand.


## 8. Getrennte, verschlüsselte Datengruppen (Vorbereitung – App-Migration folgt)

Damit Tagebucheinträge, Geräte, Sorten und Spielfortschritt künftig unabhängig voneinander synchronisiert werden können, wird eine zweite Tabelle vorbereitet. **Das Anlegen dieser Tabelle ändert noch keine vorhandenen Daten und aktiviert die neue Speicherung noch nicht.** Die App verwendet sie erst nach einem separaten, geprüften Update.

```sql
create table if not exists public.mva_data (
  user_id uuid not null references auth.users(id) on delete cascade,
  data_type text not null check (data_type in ('entries','devices','strains','photos','game','controlledVaping','settings')),
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  revision bigint not null default 1,
  primary key (user_id, data_type)
);

-- Für bereits zuvor angelegte Tabellen die Gruppenprüfung auf den aktuellen Stand bringen.
-- Die Constraint wird bewusst neu gesetzt, damit auch die Gruppe 'settings' erlaubt ist.
alter table public.mva_data drop constraint if exists mva_data_data_type_check;
alter table public.mva_data add constraint mva_data_data_type_check
  check (data_type in ('entries','devices','strains','photos','game','controlledVaping','settings'));

alter table public.mva_data enable row level security;

create policy "MVA data select own rows"
on public.mva_data for select to authenticated
using (auth.uid() = user_id);

create policy "MVA data insert own rows"
on public.mva_data for insert to authenticated
with check (auth.uid() = user_id);

create policy "MVA data update own rows"
on public.mva_data for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "MVA data delete own rows"
on public.mva_data for delete to authenticated
using (auth.uid() = user_id);
```

Die `payload`-Spalte enthält ausschließlich clientseitig AES-GCM-verschlüsselte Daten der jeweiligen Gruppe. Die App soll später nur tatsächlich geänderte Gruppen hochladen. Die bisherige Tabelle `mva_saves` bleibt während der gesamten Umstellung als Legacy-Quelle und Rückfallmöglichkeit bestehen; sie wird nicht automatisch gelöscht oder überschrieben, solange Migration und Wiederherstellung nicht nachweislich funktionieren.

**Wichtig:** Die App-Migration muss zuerst ein vollständiges JSON-Backup sichern, alle vorhandenen Medien einzeln verschlüsselt hochladen und durch erneutes Herunterladen/Entschlüsseln verifizieren. Erst danach dürfen die Datenbankverweise auf die Medien umgestellt werden. Originale in der bisherigen Sicherung bleiben erhalten, bis Anmeldung, Neuladen und Synchronisierung auf einem zweiten Gerät erfolgreich geprüft wurden.

## 9. Verbindliche Regeln für die spätere App-Umstellung

Die aktuelle App-Datenstruktur enthält diese sieben Datengruppen:
- `entries` – Tagebucheinträge
- `devices` – Geräte einschließlich ihrer Medienverweise
- `strains` – Sorten
- `photos` – Galerieeinträge einschließlich ihrer Medienverweise
- `game` – XP, Coins, Quests und Lernfortschritt
- `controlledVaping` – Startdatum und Daten der Funktion „Kontrolliertes Vapen“
- `settings` – persönliche App-Einstellungen, insbesondere die konfigurierbaren Vaping-Kategorien

Alle sieben Gruppen müssen vollständig übernommen werden. Unbekannte zusätzliche Felder eines älteren oder neueren Backups dürfen bei einer Migration nicht stillschweigend verworfen werden. Deshalb bleibt das ursprüngliche vollständige JSON-Backup die maßgebliche Rückfallkopie.

**Keine einfache Last-write-wins-Synchronisierung:** Das Feld `revision` allein verhindert noch keine Überschreibung durch ein zweites Gerät. Vor Aktivierung muss die App konkurrierende Änderungen pro Datengruppe erkennen (optimistischer Versionsvergleich/Compare-and-Swap oder gleichwertige atomare Lösung). Bei einem Konflikt darf die App nicht automatisch den neueren lokalen oder Cloud-Stand verwerfen; sie muss den Konflikt melden und eine sichere Zusammenführung bzw. bewusste Auswahl ermöglichen.

**Migrationsreihenfolge:**
1. Vollständiges JSON-Backup erzeugen und lokal zum Download anbieten.
2. Bestehenden Cloud-Spielstand entschlüsseln und unverändert als Legacy-Quelle behalten.
3. Alle Fotos und PDF-Anleitungen einzeln verschlüsselt hochladen und durch Download, Entschlüsselung, Größen- und SHA-256-Prüfung verifizieren.
4. Die sieben Datengruppen in die neue Tabelle schreiben und jede Gruppe nach dem Schreiben erneut lesen und entschlüsseln.
5. Erst nach vollständiger Prüfung den neuen Speicher als aktiv markieren. Bis dahin ausschließlich den Legacy-Speicher verwenden.
6. Anmeldung, Neuladen, Bearbeiten, Löschen, JSON-Export/-Import und Synchronisierung mit einem zweiten Gerät testen.
7. Legacy-Spielstand und ursprüngliche Medien erst nach ausdrücklicher Freigabe und erfolgreicher Wiederherstellungsprobe außer Betrieb nehmen.

Ein fehlgeschlagener Schritt bricht die Migration ab. Bereits hochgeladene neue Objekte dürfen dabei höchstens als unreferenzierte Dateien zurückbleiben; vorhandene Legacy-Daten und Medien werden niemals als Teil eines automatischen Rollbacks gelöscht.


## 10. Atomare Versionsprüfung für getrennte Datengruppen

Die Datei `cloud-data.js` ist inzwischen in `index.html` eingebunden. Die App stellt über `createCloudDataAccess()` einen isolierten Adapter bereit und nutzt ihn für die ausdrücklich gestartete Nur-Lese-Prüfung der sieben Gruppen. Die normale Tagebuchspeicherung und `cloudWrite()` verwenden weiterhin ausschließlich den bisherigen Legacy-Speicherweg; `sync()` und `write()` der Datengruppen sind nicht an Formulare oder automatische Speichervorgänge angeschlossen. Sie verschlüsselt jede Gruppe separat mit AES-GCM. Nutzerkennung, Gruppentyp und Versionsnummer sind zusätzlich als authentifizierte Zusatzdaten gebunden. Eine Änderung kann daher nicht einfach als andere Gruppe oder Version ausgegeben werden.

Damit gleichzeitige Änderungen auf zwei Geräten nicht unbemerkt überschrieben werden, benötigt die neue Tabelle zusätzlich diese atomare Datenbankfunktion. Sie schreibt nur, wenn die vom Gerät gelesene Version noch aktuell ist. Bei Abweichung meldet sie `MVA_REVISION_CONFLICT` und ändert keinen Datensatz.

Nach Prüfung der bestehenden Funktionen gleichen Namens im SQL Editor ausführen:

```sql
create or replace function public.mva_write_data(
  p_data_type text,
  p_payload jsonb,
  p_expected_revision bigint
)
returns bigint
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_revision bigint;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_data_type is null
     or p_data_type not in ('entries','devices','strains','photos','game','controlledVaping','settings')
     or p_expected_revision is null
     or p_expected_revision < 0 then
    raise exception 'Invalid data type or expected revision' using errcode = '22023';
  end if;

  -- Accept only the versioned AES-GCM envelope produced by cloud-data.js.
  -- Its authenticated revision must be exactly the revision this write creates.
  if p_payload is null
     or jsonb_typeof(p_payload) <> 'object'
     or p_payload->>'v' <> '1'
     or p_payload->>'algorithm' <> 'A256GCM'
     or p_payload->>'revision' is null
     or p_payload->>'revision' !~ '^[0-9]+$'
     or coalesce(p_payload->>'iv', '') = ''
     or coalesce(p_payload->>'ciphertext', '') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  -- The separate check ensures the numeric cast is reached only for digit-only input.
  if (p_payload->>'revision')::numeric <> p_expected_revision::numeric + 1 then
    raise exception 'Encrypted payload revision mismatch' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;

revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;
```

Die Funktion läuft mit den Rechten des angemeldeten Nutzers (`security invoker`) und unterliegt damit weiterhin der RLS-Policy der Tabelle. Der Browser muss bei jedem Lese- und Schreibaufruf das Bearer-Token der angemeldeten Sitzung mitsenden. `createCloudDataAccess()` in `app.js` stellt dafür einen isolierten Adapter bereit und nutzt `cloudFetch()` einschließlich Token-Erneuerung. Er verwendet `cloudFetch()`, einschließlich der vorhandenen einmaligen Token-Erneuerung bei HTTP 401, und übergibt Nutzerkennung sowie entschlüsselten AES-Schlüssel an `MVAEncryptedData.create()`. Der Adapter ist bewusst noch nicht an `put()` oder die bestehende `cloudWrite()`-Speicherung angeschlossen. Der neue Button „Datengruppen abgleichen (nur lesen)“ verwendet ausschließlich `readAll()` und den Vergleich mit dem entschlüsselten Legacy-Spielstand.

Das Datengruppenmodul kann jede Gruppe mit ihrer eigenen Revision lesen und schreiben; die Schreibfunktionen sind weiterhin nicht mit dem normalen Speichervorgang verbunden. `readAll()` liest alle sieben Gruppen parallel. Nach einem mehrdeutigen Netzwerkfehler prüft `write()` durch erneutes Lesen und Entschlüsseln, ob genau die erwartete neue Version mit identischem Inhalt bereits gespeichert wurde. Nur dann gilt der Schreibvorgang als bestätigt. Bei abweichendem Inhalt oder einer anderen Revision wird ein Versionskonflikt gemeldet; es erfolgt kein automatisches Überschreiben.

**Wichtig:** Das Modul ist noch nicht mit dem Tagebuch verbunden. Die bestehende Speicherung über `mva_saves` bleibt unverändert. Vor einer Aktivierung müssen zusätzlich Konfliktfälle, zwei gleichzeitig angemeldete Geräte, Wiederherstellung und vollständiger Medienimport getestet werden.



## 10. Atomarer Schreibvorgang für mehrere Datengruppen

Die Migration kann mehrere bislang fehlende Gruppen betreffen. Einzelne RPC-Aufrufe wären nicht gemeinsam atomar: Bei einem Netzwerkausfall könnten bereits einige Gruppen geschrieben sein, während andere fehlen. Deshalb verwendet die aktualisierte Preview-Migration den folgenden Batch-RPC. **Erst nach Prüfung der vorhandenen Funktion und Policies im SQL Editor ausführen.** Die Funktion schreibt alle übergebenen Gruppen in einer einzigen PostgreSQL-Transaktion. Wenn eine erwartete Revision nicht stimmt, wird die gesamte Transaktion zurückgerollt.

```sql
create or replace function public.mva_write_data_batch(p_groups jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $
declare
  v_item jsonb;
  v_type text;
  v_expected bigint;
  v_payload jsonb;
  v_revision bigint;
  v_results jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if jsonb_typeof(p_groups) is distinct from 'array' then
    raise exception 'Invalid batch payload' using errcode = '22023';
  end if;
  if jsonb_array_length(p_groups) < 1 or jsonb_array_length(p_groups) > 7 then
    raise exception 'Invalid batch size' using errcode = '22023';
  end if;
  if (select count(*) from jsonb_array_elements(p_groups)) <>
     (select count(distinct value->>'p_data_type') from jsonb_array_elements(p_groups)) then
    raise exception 'Duplicate data type in batch' using errcode = '22023';
  end if;

  for v_item in select value from jsonb_array_elements(p_groups)
  loop
    v_type := v_item->>'p_data_type';
    if v_type is null or v_type not in ('entries','devices','strains','photos','game','controlledVaping','settings')
       or coalesce(v_item->>'p_expected_revision','') !~ '^[0-9]+

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.

     or (p_payload->>'revision')::bigint <> p_expected_revision + 1
     or coalesce(p_payload->>'iv','') = ''
     or coalesce(p_payload->>'ciphertext','') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;

revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;
```

Die Funktion läuft mit den Rechten des angemeldeten Nutzers (`security invoker`) und unterliegt damit weiterhin der RLS-Policy der Tabelle. Der Browser darf nur über die angemeldete Sitzung aufrufen. Der Adapter für `cloud-data.js` muss dieselbe token-aktualisierende Request-Funktion wie die bestehende Cloud-Anmeldung verwenden.

**Wichtig:** Das Modul ist noch nicht mit dem Tagebuch verbunden. Die bestehende Speicherung über `mva_saves` bleibt unverändert. Vor einer Aktivierung müssen zusätzlich Konfliktfälle, zwei gleichzeitig angemeldete Geräte, Wiederherstellung und vollständiger Medienimport getestet werden.


## 11. Read-only inventory audit (new preparation module)

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.

            then (p_payload->>'revision')::numeric <> p_expected_revision::numeric + 1
          else true
        end
     or coalesce(p_payload->>'iv', '') = ''
     or coalesce(p_payload->>'ciphertext', '') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;

revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;
```

Die Funktion läuft mit den Rechten des angemeldeten Nutzers (`security invoker`) und unterliegt damit weiterhin der RLS-Policy der Tabelle. Der Browser darf nur über die angemeldete Sitzung aufrufen. `createCloudDataAccess()` in `app.js` stellt dafür inzwischen einen isolierten Adapter bereit. Er verwendet `cloudFetch()`, einschließlich der vorhandenen einmaligen Token-Erneuerung bei HTTP 401, und übergibt Nutzerkennung sowie entschlüsselten AES-Schlüssel an `MVAEncryptedData.create()`. Der Adapter ist bewusst noch nicht an `put()` oder die bestehende `cloudWrite()`-Speicherung angeschlossen.

Das Datengruppenmodul liest und schreibt jede Gruppe mit ihrer eigenen Revision. `readAll()` liest alle sechs Gruppen parallel. Nach einem mehrdeutigen Netzwerkfehler prüft `write()` durch erneutes Lesen und Entschlüsseln, ob genau die erwartete neue Version mit identischem Inhalt bereits gespeichert wurde. Nur dann gilt der Schreibvorgang als bestätigt. Bei abweichendem Inhalt oder einer anderen Revision wird ein Versionskonflikt gemeldet; es erfolgt kein automatisches Überschreiben.

**Wichtig:** Das Modul ist noch nicht mit dem Tagebuch verbunden. Die bestehende Speicherung über `mva_saves` bleibt unverändert. Vor einer Aktivierung müssen zusätzlich Konfliktfälle, zwei gleichzeitig angemeldete Geräte, Wiederherstellung und vollständiger Medienimport getestet werden.


## 11. Read-only inventory audit (new preparation module)

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.

     or (p_payload->>'revision')::bigint <> p_expected_revision + 1
     or coalesce(p_payload->>'iv','') = ''
     or coalesce(p_payload->>'ciphertext','') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;

revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;
```

Die Funktion läuft mit den Rechten des angemeldeten Nutzers (`security invoker`) und unterliegt damit weiterhin der RLS-Policy der Tabelle. Der Browser darf nur über die angemeldete Sitzung aufrufen. Der Adapter für `cloud-data.js` muss dieselbe token-aktualisierende Request-Funktion wie die bestehende Cloud-Anmeldung verwenden.

**Wichtig:** Das Modul ist noch nicht mit dem Tagebuch verbunden. Die bestehende Speicherung über `mva_saves` bleibt unverändert. Vor einer Aktivierung müssen zusätzlich Konfliktfälle, zwei gleichzeitig angemeldete Geräte, Wiederherstellung und vollständiger Medienimport getestet werden.


## 11. Read-only inventory audit (new preparation module)

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.
 then
      raise exception 'Invalid data type or expected revision' using errcode = '22023';
    end if;
    v_expected := (v_item->>'p_expected_revision')::bigint;
    v_payload := v_item->'p_payload';
    if jsonb_typeof(v_payload) <> 'object'
       or v_payload->>'v' <> '1'
       or v_payload->>'algorithm' <> 'A256GCM'
       or coalesce(v_payload->>'revision','') !~ '^[0-9]+

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.

     or (p_payload->>'revision')::bigint <> p_expected_revision + 1
     or coalesce(p_payload->>'iv','') = ''
     or coalesce(p_payload->>'ciphertext','') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;

revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;
```

Die Funktion läuft mit den Rechten des angemeldeten Nutzers (`security invoker`) und unterliegt damit weiterhin der RLS-Policy der Tabelle. Der Browser darf nur über die angemeldete Sitzung aufrufen. Der Adapter für `cloud-data.js` muss dieselbe token-aktualisierende Request-Funktion wie die bestehende Cloud-Anmeldung verwenden.

**Wichtig:** Das Modul ist noch nicht mit dem Tagebuch verbunden. Die bestehende Speicherung über `mva_saves` bleibt unverändert. Vor einer Aktivierung müssen zusätzlich Konfliktfälle, zwei gleichzeitig angemeldete Geräte, Wiederherstellung und vollständiger Medienimport getestet werden.


## 11. Read-only inventory audit (new preparation module)

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.

            then (p_payload->>'revision')::numeric <> p_expected_revision::numeric + 1
          else true
        end
     or coalesce(p_payload->>'iv', '') = ''
     or coalesce(p_payload->>'ciphertext', '') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;

revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;
```

Die Funktion läuft mit den Rechten des angemeldeten Nutzers (`security invoker`) und unterliegt damit weiterhin der RLS-Policy der Tabelle. Der Browser darf nur über die angemeldete Sitzung aufrufen. `createCloudDataAccess()` in `app.js` stellt dafür inzwischen einen isolierten Adapter bereit. Er verwendet `cloudFetch()`, einschließlich der vorhandenen einmaligen Token-Erneuerung bei HTTP 401, und übergibt Nutzerkennung sowie entschlüsselten AES-Schlüssel an `MVAEncryptedData.create()`. Der Adapter ist bewusst noch nicht an `put()` oder die bestehende `cloudWrite()`-Speicherung angeschlossen.

Das Datengruppenmodul liest und schreibt jede Gruppe mit ihrer eigenen Revision. `readAll()` liest alle sechs Gruppen parallel. Nach einem mehrdeutigen Netzwerkfehler prüft `write()` durch erneutes Lesen und Entschlüsseln, ob genau die erwartete neue Version mit identischem Inhalt bereits gespeichert wurde. Nur dann gilt der Schreibvorgang als bestätigt. Bei abweichendem Inhalt oder einer anderen Revision wird ein Versionskonflikt gemeldet; es erfolgt kein automatisches Überschreiben.

**Wichtig:** Das Modul ist noch nicht mit dem Tagebuch verbunden. Die bestehende Speicherung über `mva_saves` bleibt unverändert. Vor einer Aktivierung müssen zusätzlich Konfliktfälle, zwei gleichzeitig angemeldete Geräte, Wiederherstellung und vollständiger Medienimport getestet werden.


## 11. Read-only inventory audit (new preparation module)

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.

     or (p_payload->>'revision')::bigint <> p_expected_revision + 1
     or coalesce(p_payload->>'iv','') = ''
     or coalesce(p_payload->>'ciphertext','') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;

revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;
```

Die Funktion läuft mit den Rechten des angemeldeten Nutzers (`security invoker`) und unterliegt damit weiterhin der RLS-Policy der Tabelle. Der Browser darf nur über die angemeldete Sitzung aufrufen. Der Adapter für `cloud-data.js` muss dieselbe token-aktualisierende Request-Funktion wie die bestehende Cloud-Anmeldung verwenden.

**Wichtig:** Das Modul ist noch nicht mit dem Tagebuch verbunden. Die bestehende Speicherung über `mva_saves` bleibt unverändert. Vor einer Aktivierung müssen zusätzlich Konfliktfälle, zwei gleichzeitig angemeldete Geräte, Wiederherstellung und vollständiger Medienimport getestet werden.


## 11. Read-only inventory audit (new preparation module)

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.

       or coalesce(v_payload->>'iv','') = ''
       or coalesce(v_payload->>'ciphertext','') = ''
       or (v_payload->>'revision')::numeric <> v_expected::numeric + 1 then
      raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
    end if;
  end loop;

  for v_item in select value from jsonb_array_elements(p_groups)
  loop
    v_type := v_item->>'p_data_type';
    v_expected := (v_item->>'p_expected_revision')::bigint;
    v_payload := v_item->'p_payload';
    if v_expected = 0 then
      insert into public.mva_data (user_id,data_type,payload,revision,updated_at)
      values (auth.uid(),v_type,v_payload,1,now())
      on conflict (user_id,data_type) do nothing
      returning revision into v_revision;
      if not found then
        raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
      end if;
    else
      update public.mva_data
         set payload=v_payload, revision=revision+1, updated_at=now()
       where user_id=auth.uid() and data_type=v_type and revision=v_expected
       returning revision into v_revision;
      if not found then
        raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
      end if;
    end if;
    v_results := v_results || jsonb_build_array(jsonb_build_object('data_type',v_type,'revision',v_revision));
  end loop;
  return v_results;
end;
$;

revoke all on function public.mva_write_data_batch(jsonb) from public, anon;
grant execute on function public.mva_write_data_batch(jsonb) to authenticated;
```

Der RPC verwendet weiterhin `security invoker` und unterliegt der RLS-Policy von `mva_data`. Es werden ausschließlich die übergebenen Datengruppen des angemeldeten Nutzers geschrieben. Die bestehende Einzelgruppenfunktion bleibt für gezielte Reparaturen erhalten. Die reguläre App-Speicherung wird durch diese Vorbereitung ausdrücklich noch nicht umgestellt.


## 11. Read-only inventory audit (new preparation module)

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.

     or (p_payload->>'revision')::bigint <> p_expected_revision + 1
     or coalesce(p_payload->>'iv','') = ''
     or coalesce(p_payload->>'ciphertext','') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;

revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;
```

Die Funktion läuft mit den Rechten des angemeldeten Nutzers (`security invoker`) und unterliegt damit weiterhin der RLS-Policy der Tabelle. Der Browser darf nur über die angemeldete Sitzung aufrufen. Der Adapter für `cloud-data.js` muss dieselbe token-aktualisierende Request-Funktion wie die bestehende Cloud-Anmeldung verwenden.

**Wichtig:** Das Modul ist noch nicht mit dem Tagebuch verbunden. Die bestehende Speicherung über `mva_saves` bleibt unverändert. Vor einer Aktivierung müssen zusätzlich Konfliktfälle, zwei gleichzeitig angemeldete Geräte, Wiederherstellung und vollständiger Medienimport getestet werden.


## 11. Read-only inventory audit (new preparation module)

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.

            then (p_payload->>'revision')::numeric <> p_expected_revision::numeric + 1
          else true
        end
     or coalesce(p_payload->>'iv', '') = ''
     or coalesce(p_payload->>'ciphertext', '') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;

revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;
```

Die Funktion läuft mit den Rechten des angemeldeten Nutzers (`security invoker`) und unterliegt damit weiterhin der RLS-Policy der Tabelle. Der Browser darf nur über die angemeldete Sitzung aufrufen. `createCloudDataAccess()` in `app.js` stellt dafür inzwischen einen isolierten Adapter bereit. Er verwendet `cloudFetch()`, einschließlich der vorhandenen einmaligen Token-Erneuerung bei HTTP 401, und übergibt Nutzerkennung sowie entschlüsselten AES-Schlüssel an `MVAEncryptedData.create()`. Der Adapter ist bewusst noch nicht an `put()` oder die bestehende `cloudWrite()`-Speicherung angeschlossen.

Das Datengruppenmodul liest und schreibt jede Gruppe mit ihrer eigenen Revision. `readAll()` liest alle sechs Gruppen parallel. Nach einem mehrdeutigen Netzwerkfehler prüft `write()` durch erneutes Lesen und Entschlüsseln, ob genau die erwartete neue Version mit identischem Inhalt bereits gespeichert wurde. Nur dann gilt der Schreibvorgang als bestätigt. Bei abweichendem Inhalt oder einer anderen Revision wird ein Versionskonflikt gemeldet; es erfolgt kein automatisches Überschreiben.

**Wichtig:** Das Modul ist noch nicht mit dem Tagebuch verbunden. Die bestehende Speicherung über `mva_saves` bleibt unverändert. Vor einer Aktivierung müssen zusätzlich Konfliktfälle, zwei gleichzeitig angemeldete Geräte, Wiederherstellung und vollständiger Medienimport getestet werden.


## 11. Read-only inventory audit (new preparation module)

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.

     or (p_payload->>'revision')::bigint <> p_expected_revision + 1
     or coalesce(p_payload->>'iv','') = ''
     or coalesce(p_payload->>'ciphertext','') = '' then
    raise exception 'Invalid encrypted payload or revision' using errcode = '22023';
  end if;

  if p_expected_revision = 0 then
    insert into public.mva_data (user_id, data_type, payload, revision, updated_at)
    values (auth.uid(), p_data_type, p_payload, 1, now())
    on conflict (user_id, data_type) do nothing
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  else
    update public.mva_data
       set payload = p_payload,
           revision = revision + 1,
           updated_at = now()
     where user_id = auth.uid()
       and data_type = p_data_type
       and revision = p_expected_revision
    returning revision into v_revision;

    if found then
      return v_revision;
    end if;
  end if;

  raise exception 'MVA_REVISION_CONFLICT' using errcode = 'P0001';
end;
$$;

revoke all on function public.mva_write_data(text, jsonb, bigint) from public, anon;
grant execute on function public.mva_write_data(text, jsonb, bigint) to authenticated;
```

Die Funktion läuft mit den Rechten des angemeldeten Nutzers (`security invoker`) und unterliegt damit weiterhin der RLS-Policy der Tabelle. Der Browser darf nur über die angemeldete Sitzung aufrufen. Der Adapter für `cloud-data.js` muss dieselbe token-aktualisierende Request-Funktion wie die bestehende Cloud-Anmeldung verwenden.

**Wichtig:** Das Modul ist noch nicht mit dem Tagebuch verbunden. Die bestehende Speicherung über `mva_saves` bleibt unverändert. Vor einer Aktivierung müssen zusätzlich Konfliktfälle, zwei gleichzeitig angemeldete Geräte, Wiederherstellung und vollständiger Medienimport getestet werden.


## 11. Read-only inventory audit (new preparation module)

`cloud-migration.js` provides `window.MVACloudMigration.audit(db)`. It scans a supplied in-memory game state for inline data URLs and existing encrypted Storage references. For inline media it records the object path, MIME type, inferred media kind, byte size and SHA-256 hash; identical files are grouped by hash. Invalid data URLs are counted and reported.

This audit is deliberately read-only: it performs no network requests, uploads, database writes, reference replacements or deletions. It does not make a migration safe or activate the new storage. It is a preparation and diagnostic building block only. The module is loaded but is not called by the running app.


## 12. Einheitliche Medienauflösung und Cache-Lebenszyklus

`cloud-media-resolver.js` ergänzt die Mediengrundlage um einen Resolver. Inline-Data-URLs werden unverändert zurückgegeben; verschlüsselte Storage-Referenzen werden über einen ausdrücklich übergebenen Downloadadapter geladen, als Blob-URL bereitgestellt und begrenzt zwischengespeichert. `dispose()` widerruft alle erzeugten Blob-URLs und beendet die Cache-Generation. Ein noch laufender Download darf nach `dispose()` keine neue Blob-URL mehr im Cache hinterlassen; eine gegebenenfalls verspätet erzeugte URL wird sofort widerrufen.

Der Resolver ist inzwischen über `createCloudMediaResolver()` in `app.js` an die token-aktualisierende Cloud-Sitzung angebunden und wird von Galerie, Geräteansicht und PDF-Viewer verwendet. Beim Abmelden, beim Wechsel in den lokalen Modus und vor einer neuen Kontoanmeldung wird der Resolver freigegeben. Ein echter Supabase-Live-Test steht weiterhin aus.


## 13. Token-aktualisierender Storage-Requestadapter

`app.js` enthält jetzt `cloudStorageFetch()` als separaten Binär-Requestpfad. Anders als `cloudFetch()` verarbeitet er den Response-Body nicht als JSON, sondern gibt die rohe HTTP-Response zurück. Dadurch können verschlüsselte Storage-Objekte als `ArrayBuffer` gelesen werden.

Bei HTTP 401 versucht der Adapter einmal, das Sitzungstoken über das gespeicherte Refresh-Token zu erneuern. Bei Erfolg wird der Storage-Aufruf mit dem neuen Zugriffstoken wiederholt. Der Adapter verwendet dieselbe angemeldete `cloudSession` wie die übrigen Cloud-Funktionen und hat ein 90-Sekunden-Zeitlimit.

`cloud-media.js` akzeptiert dafür optional eine injizierte `request`-Funktion. `createCloudMediaResolver()` in `app.js` verbindet diese Funktion mit `MVAEncryptedMedia` und `MVACloudMediaResolver`. Es wird bei Aufruf eine aktive Cloud-Anmeldung und der entschlüsselte AES-Schlüssel benötigt.

**Status und Grenze:** Der Adapter wird von der Medienauflösung der App verwendet. Es wurden keine Medien hochgeladen und keine bestehenden Daten oder Speicherverweise verändert. Ein echter Test gegen Supabase steht aus.


## 14. Medienanzeige und portable JSON-Backups (UI-Vorbereitung)

`app.js` kann jetzt vorhandene Inline-Medien und bereits vorhandene verschlüsselte Storage-Referenzen in den folgenden Bereichen verarbeiten:
- Geräteübersicht und Geräteformular-Vorschau für Gerätefotos
- Galerie-Miniaturen und Foto-Großansicht
- integrierter PDF-Viewer für Bedienungsanleitungen

Der PDF-Viewer lädt eine Storage-Referenz über den entschlüsselnden Medienadapter als Blob und übergibt die Bytes an PDF.js. Die Datenbankwerte werden dabei nicht verändert.

Der JSON-Export erstellt vor dem Download eine Kopie des Spielstands. Erkannte Storage-Referenzen in Galerie-Fotos, Gerätefotos und PDF-Anleitungen werden in dieser Exportkopie heruntergeladen und wieder als vollständige Data-URLs eingebettet. Das Backup bleibt dadurch unabhängig vom Supabase-Bucket und kann die Medien weiterhin mitnehmen. Der laufende Spielstand wird für den Export nicht umgeschrieben. Der JSON-Import akzeptiert Inline-Medien und formal gültige Storage-Referenzen. Vor dem Ersetzen des aktiven Spielstands werden alle referenzierten Medien vollständig heruntergeladen und entschlüsselt. Schlägt ein Abruf fehl, wird der Import abgebrochen und der bisherige Spielstand nicht ersetzt. Vor einer erfolgreichen Wiederherstellung wird außerdem eine portable Sicherheitskopie des aktuellen Spielstands zum Download erstellt.

Beim Wechsel vom Cloud- in den lokalen Modus werden Cloud-Medien ebenfalls zunächst in vollständige Data-URLs materialisiert, bevor der lokale Spielstand gespeichert und die Cloud-Sitzung beendet wird.

**Wichtige Einschränkung:** Das ist noch keine Bestandsmigration und kein Live-Test. Die aktuelle App legt neue Medien weiterhin inline ab; es wurden keine bestehenden Medien umgestellt. Vor einer echten Migration müssen insbesondere vollständige Export-/Import-Wiederherstellung, Fehlerfälle bei fehlenden Dateien, mehrere Geräte und das Speicher-/Versionskonzept getestet werden. Die lokale Anzeige von Inline-Medien bleibt unverändert.
