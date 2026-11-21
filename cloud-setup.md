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
