# My Vaping Adventure · Alpha 1.2.2

Static website for GitHub Pages. Local storage works without a server. Optional encrypted cloud storage uses the user's own Supabase project; the app itself does not operate a cloud service.

## Storage and privacy

- Local mode keeps entries, devices, strains, photos, quests, and course progress in this browser's local storage.
- Optional cloud mode uses Supabase Auth and a user-owned database table. The browser encrypts the complete save, including photos, with AES-GCM before upload. Supabase receives ciphertext, not the diary content.
- Cloud saves use a random data-encryption key (AES-GCM). The key is wrapped client-side with a key derived from the login password (PBKDF2, SHA-256, 600,000 iterations).
- New-format (v2) saves also wrap the data key with a one-time recovery code. Store that 48-character code safely and separately; it is required to restore access to the encrypted save after a password reset. The app displays it only once.
- Existing v1 saves remain readable. They are migrated to v2 the next time the user signs in and explicitly chooses which save to keep; the recovery code is then displayed.
- Keep an additional JSON backup. The recovery code does not replace a backup, and losing both the login credentials and recovery code can make the encrypted save inaccessible.

The project uses the Supabase publishable/anon key in the browser and relies on row-level security. Never add a `service_role` key or database password to `cloud-config.js`.

## Included

- Diary with filters, search, sorting, editing, and deletion.
- Device library and local device photos.
- Strain collection and local photo gallery.
- CSV import/export and JSON backup/restore.
- Quests and courses for learning, equipment care, and documentation.
- Optional encrypted cloud save, username/password sign-in, and explicit switching between local and cloud saves.

The app can read the existing `pvd_entries`, `pvd_devices`, and `pvd_game` local-storage records when opened on the same site origin as the earlier Alpha 1.2 app.
