# Dynamisches Dashboard (Multi-Client)

Das Ziel: Alle Kunden nutzen die gleiche Seite, sehen aber unterschiedliche Dinge.

## 1. Dynamische Spalten
Anstatt Spalten hart zu codieren, kannst du sie in einem Array definieren:

```typescript
const columns = [
  { key: 'vorname', label: 'Vorname', access: 'BOTH' },
  { key: 'firma', label: 'Firma', access: 'BOTH' },
  { key: 'interne_notiz', label: 'Interne Notiz', access: 'ADMIN' }, // Nur für euch
];
```

## 2. Dynamische Webhooks
Du kannst in der Datenbank (oder einer Config-Datei) hinterlegen, welche `webhook_url` für welchen Kunden gilt.
Die Server Action `triggerN8nWebhook` nimmt sich dann die URL passend zur `client_id` des Leads.

## 3. Detail-Ansicht (Sheets)
Nutze die `Sheet`-Komponente von shadcn, um beim Klick auf einen Lead alle Details anzuzeigen.
- Admins können in diesem Sheet Felder **editieren**.
- User (Kunden) können die Felder dort nur **lesen**.
