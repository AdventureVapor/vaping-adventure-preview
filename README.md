# My Vaping Adventure · Alpha 1.3

My Vaping Adventure is a static web app hosted with GitHub Pages. The diary can be used locally in one browser or, optionally, with an encrypted cloud save that synchronizes between devices.

## Getting started

1. Open the published app in a modern browser.
2. You can start immediately in local mode; no account is required.
3. To use cloud synchronization, create an account with your email address and password, then confirm your email address using the message sent to you.
4. Choose the cloud save in **Speicher & Backup** (Storage & Backup) when you want to work with your synchronized data.

The interface currently supports German and English. The language selector changes the app's interface language; it does not translate diary entries or other personal content.

## Storage modes

### Local save

- Entries, devices, strains, photos, quests, and learning progress are stored in this browser on this device.
- Local data is not automatically synchronized to other devices.
- Clearing browser data or changing devices can remove access to a local save. Export a JSON backup regularly.

### Encrypted cloud save

- Cloud access uses Supabase Auth with email address and password, including email confirmation and password reset.
- The browser encrypts the save with AES-GCM before uploading it. The database stores encrypted save data, not readable diary content.
- The encryption key is protected client-side using a key derived from the account password (PBKDF2 with SHA-256, 600,000 iterations).
- New-format (v2) saves also protect the encryption key with a one-time recovery code. Store this 48-character code safely and separately; it is needed to regain access to the encrypted save after a password reset. The app displays the code only once.
- Keep an additional JSON backup. The recovery code is not a substitute for a backup.
- Choose the intended save carefully when switching between local and cloud storage. Loading or restoring a backup can replace the active save.

## Backup and import/export

- **JSON backup** saves and restores the complete active game save. Restoring a JSON backup replaces the active save, so download a backup of the current data first.
- **CSV** imports and exports diary entries. CSV is not a complete backup of devices, photos, quests, or other app data.
- When importing a CSV, existing matching entries are identified as duplicates and are not imported again.

## Main features

- Diary entries with search, filters, editing, and deletion.
- Device library and device photos.
- Strain collection and photo gallery.
- Quests, goals, courses, and learning progress.
- German and English interface.
- Local storage and optional encrypted cloud synchronization.
- JSON backup/restore and CSV diary import/export.

## Supabase configuration and security

See [cloud-setup.md](cloud-setup.md) for the Supabase project, table, RLS, authentication, and email setup steps.

The browser configuration uses the Supabase project URL and a publishable key (or legacy anon key). Row Level Security (RLS) must remain enabled on the save table, with policies restricting each authenticated user to their own row.

**Never put a Supabase secret/service-role key, database password, or other server-side credential in browser code or in `cloud-config.js`.** Browser-side keys are public by design; access control must be enforced by Supabase RLS policies.

## Development and deployment

- The Preview project is maintained in the `AdventureVapor/vaping-adventure-preview` repository.
- The production project is maintained separately in `AdventureVapor/vaping-adventure`.
- Make and test changes in Preview first. Do not deploy to production until the release checks are complete and an explicit release approval has been given.

## Legacy data

The app can read the existing `pvd_entries`, `pvd_devices`, and `pvd_game` local-storage records when opened on the same site origin as the earlier Alpha 1.2 app.
