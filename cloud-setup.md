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
  data_type text not null check (data_type in ('entries','devices','strains','photos','game','controlledVaping')),
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  revision bigint not null default 1,
  primary key (user_id, data_type)
);

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