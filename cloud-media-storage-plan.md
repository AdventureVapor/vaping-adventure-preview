# Konzept: Getrennte, clientseitig verschlüsselte Medienablage

Status: Architekturvorschlag für Preview – **noch nicht aktiviert**.

## Ausgangslage

Der aktuelle Cloud-Spielstand wird in `public.mva_saves.payload` als ein JSONB-Datensatz gespeichert. `encryptCloud()` serialisiert das komplette `db`-Objekt, verschlüsselt es mit AES-GCM und sendet den Base64-Umschlag an `mva_saves`. Fotos (`photos[].src`), Gerätebilder (`devices[].photo`) und PDF-Anleitungen (`devices[].manualData`) stecken als Data-URLs im selben Objekt. Daher wächst jede vollständige Synchronisierung mit der gesamten Mediensammlung.

Die App besitzt bereits einen zufälligen Datenverschlüsselungsschlüssel (DEK) für Cloud-Spielstände. Bei neuen Konten wird dieser DEK mit Passwort und Wiederherstellungscode verpackt; beim Laden wird derselbe Schlüssel wiederhergestellt. Der DEK ist im laufenden Browser als nicht exportierbarer AES-GCM-Schlüssel verfügbar. Er kann deshalb auch für die clientseitige Verschlüsselung einzelner Medienobjekte verwendet werden, ohne einen zusätzlichen Klartextschlüssel einzuführen.

## Zielarchitektur

- Tagebuch, Gerätestammdaten, Sorten, Fortschritt/Einstellungen und Medienverweise bleiben zunächst gemeinsam im verschlüsselten `mva_saves.payload`. Diese strukturierten Datensätze bleiben bewusst zusammen, damit zusammengehörige Änderungen atomar und konsistent gespeichert werden.
- Nur große Binärinhalte (Galeriefotos, Gerätebilder und PDF-Anleitungen) werden separat als einzelne verschlüsselte Storage-Objekte gespeichert.
- Binäre Foto- und PDF-Inhalte liegen in einem **privaten Supabase-Storage-Bucket** `mva-private-media`.
- Der Browser verschlüsselt jede Datei vor dem Upload mit dem vorhandenen AES-GCM-DEK und einem frischen zufälligen 96-Bit-IV.
- Der Storage erhält ausschließlich Ciphertext. Originaldateiname, MIME-Typ, Größe und IV werden in der verschlüsselten Tagebuch-Nutzlast als Metadaten abgelegt.
- Objektpfad ist eine zufällige UUID unter dem Benutzerordner: `<auth.uid()>/<media-uuid>.bin`. Keine Namen, E-Mail-Adressen oder Dateitypen im Pfad.
- Der Browser lädt bei Bedarf die verschlüsselte Datei herunter, entschlüsselt sie lokal und erzeugt daraus eine temporäre Blob-URL. Blob-URLs werden beim Schließen/Wechsel der Ansicht widerrufen.

## Vorgeschlagene verschlüsselte Referenz

Beispielstruktur innerhalb von `db` (die gesamte Struktur bleibt zusätzlich durch `encryptCloud()` verschlüsselt):

```json
{
  "id": "media-uuid",
  "storage": "supabase",
  "path": "<user-uuid>/<media-uuid>.bin",
  "iv": "<base64-12-byte-iv>",
  "kind": "photo",
  "name": "optional-original-name.jpg",
  "mime": "image/jpeg",
  "size": 123456
}
```

`kind`, `name`, `mime`, `size`, `path` und `iv` sind nur innerhalb des bereits verschlüsselten Cloud-Spielstands sichtbar. Die Storage-Objekte selbst enthalten nur AES-GCM-Ciphertext. Die App muss bei jedem Objekt einen neuen IV erzeugen und darf niemals denselben IV mit demselben Schlüssel wiederverwenden.

## Storage-Bucket und Zugriffsschutz

Bucket: `mva-private-media`, `public = false`. Keine öffentliche URL und kein Service-Role-Key im Browser. Zugriff ausschließlich über die angemeldete Supabase-Sitzung und RLS auf `storage.objects`.

Vorgeschlagene Policies (im Supabase SQL Editor nach Prüfung ausführen; nicht automatisch durch diese App-Änderung ausgeführt):

```sql
insert into storage.buckets (id, name, public)
values ('mva-private-media', 'mva-private-media', false)
on conflict (id) do update set public = false;

drop policy if exists "MVA media read own objects" on storage.objects;
create policy "MVA media read own objects"
on storage.objects for select to authenticated
using (
  bucket_id = 'mva-private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "MVA media insert own objects" on storage.objects;
create policy "MVA media insert own objects"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'mva-private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "MVA media update own objects" on storage.objects;
create policy "MVA media update own objects"
on storage.objects for update to authenticated
using (
  bucket_id = 'mva-private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'mva-private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "MVA media delete own objects" on storage.objects;
create policy "MVA media delete own objects"
on storage.objects for delete to authenticated
using (
  bucket_id = 'mva-private-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
```

Vor Ausführung muss geprüft werden, ob gleichnamige Policies bereits vorhanden sind und ob die Supabase-Storage-RLS im Projekt wie erwartet aktiviert ist. Die Policies beschränken den Zugriff auf den eigenen ersten Ordnerpfad. Bucket bleibt privat.

## Upload- und Speichervorgang

1. Datei lokal validieren (Foto/PDF, zulässige Größe und Signatur).
2. Medien-ID und Objektpfad erzeugen; frischen IV generieren.
3. Datei-Bytes mit AES-GCM-DEK verschlüsseln.
4. Ciphertext in den privaten Storage-Bucket hochladen.
5. Erst nach erfolgreichem Upload den verschlüsselten Tagebuchdatensatz um die Medienreferenz ergänzen und `cloudWrite()` ausführen.
6. Wenn das Speichern des Tagebuchdatensatzes fehlschlägt, Objekt nicht sofort löschen. Es als verwaistes Objekt protokollieren bzw. später sicher bereinigen, damit kein bereits hochgeladenes Medium verloren geht.

## Laden, Löschen und Fehlerfälle

- Fotos/Galerie und PDF-Viewer müssen asynchron laden und entschlüsseln; bis dahin Platzhalter/Ladezustand zeigen.
- Bei Netzwerkfehlern Originalreferenz behalten und erneuten Versuch ermöglichen. Niemals die Referenz entfernen, nur weil die Vorschau gerade nicht lädt.
- Beim Löschen eines Mediums zuerst Referenzänderung erfolgreich in der verschlüsselten Cloud speichern; Storage-Löschung danach ausführen. Fehlgeschlagene Löschung erzeugt ein später bereinigbares verwaistes Objekt.
- Beim Konto-/Gerätewechsel nie Medien des vorherigen Benutzers im Speicher oder in Blob-URLs wiederverwenden.
- Synchronisierung über mehrere Geräte lädt nur benötigte Medienobjekte nach; Tagebuchänderungen übertragen keine Bild-/PDF-Bytes mehr.

## JSON-Backups und Migration (kritisch)

- JSON-Export muss weiterhin ein portables Backup enthalten. Daher beim Export alle referenzierten Medien herunterladen, entschlüsseln und als eingebettete Data-URLs oder in einem versionierten ZIP-Backup verpacken. Ein Backup nur mit Storage-Pfaden wäre außerhalb des Cloud-Kontos unvollständig.
- JSON-Import muss alte Data-URLs weiterhin akzeptieren und neue Medienreferenzen validieren.
- Bestehende Nutzer behalten ihre eingebetteten Data-URLs zunächst unverändert. Eine Migration erfolgt pro Medium: hochladen, Upload verifizieren, Referenz speichern, Download/Entschlüsselung prüfen. Erst danach darf die eingebettete Kopie aus dem Cloud-Datensatz entfernt werden.
- Während der Migration müssen alte und neue Formate gleichzeitig lesbar sein. Bei Unterbrechung bleibt das alte Medium verwendbar.
- Passwortwechsel und Wiederherstellungscode ändern den DEK nicht; daher bleiben Medien entschlüsselbar. Schlüsselrotation müsste alle Medien neu verschlüsseln und ist eine eigene spätere Funktion.

## Implementierungsstand

- [x] Isoliertes Modul `cloud-media.js` mit AES-GCM-Verschlüsselung, zufälligem IV und zufälligem Objektpfad angelegt.
- [x] Upload-/Download-/Löschfunktionen auf den eigenen Benutzerordner begrenzt; AAD bindet Ciphertext an Pfad, Medientyp und MIME-Typ.
- [x] Modul eingebunden, aber noch nicht mit der App-Oberfläche verbunden. Es verändert keine bestehenden Daten und führt keine Migration aus.
- [ ] Storage-Bucket und RLS-Policies in einem separaten Testprojekt einrichten und mit zwei Konten isoliert testen.
- [ ] Modul mit echten Testdateien und Byte-/Hashvergleich testen.

## Rollout in kleinen, überprüfbaren Schritten

1. Supabase-Storage-Bucket und Policies im separaten Testprojekt einrichten; zwei Konten gegeneinander testen.
2. Reine Crypto-/Storage-Hilfsfunktionen und Upload-/Download-Prototyp bauen, ohne bestehende Datenstruktur zu ändern.
3. Ein neues Testmedium hochladen, herunterladen, entschlüsseln und Hash/Bytes vergleichen.
4. Neue Medienreferenz-Version ergänzen; alte Data-URLs weiter unterstützen.
5. Galerie, Gerätebilder und PDF-Viewer auf asynchrones Laden umstellen.
6. Backup-Export/-Import einschließlich Offline-Portabilität anpassen.
7. Löschen, Abbruch, Timeout, Offline-Verhalten, mehrere Geräte und getrennte Konten testen.
8. Erst nach erfolgreichem Test mit einem Konto freiwillige Migration einzelner Medien ermöglichen.

## Nicht-Ziele / Sicherheitsgrenzen

- Keine öffentlichen Buckets, keine öffentlichen Objekt-URLs.
- Keine Service-Role-/Secret-Keys im Frontend.
- Keine automatische Löschung alter eingebetteter Medien während des Rollouts.
- Keine pauschale Änderung an bestehenden Cloud-Datensätzen.
- Kein Versprechen, dass Storage allein die Synchronisierung beschleunigt: Download/Upload und Entschlüsselung müssen separat gemessen werden.
- Die SQL-Policies sind ein Einrichtungsvorschlag, keine ausgeführte Änderung an deinem Supabase-Projekt.

## Akzeptanzkriterien vor Freigabe

- Konto A kann weder Metadaten noch Objekte von Konto B lesen, überschreiben oder löschen.
- Storage enthält ausschließlich Ciphertext; MIME/Dateiname sind ohne Entschlüsselung nicht sichtbar.
- Upload/Download mit beschädigtem Ciphertext schlägt sicher fehl und lässt die bestehende Referenz intakt.
- JSON-Backup bleibt vollständig und offline wiederherstellbar.
- Altbestände mit Data-URLs funktionieren weiterhin.
- Abmelden, Gerätewechsel, Wiederherstellung und Passwortwechsel verlieren keine Medien.
- Große Foto-/PDF-Sammlungen synchronisieren Tagebuchmetadaten unabhängig von Medienbytes.
