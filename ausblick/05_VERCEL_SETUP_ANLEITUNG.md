# 🛠️ Schritt-für-Schritt: Kunden-Setup (Vercel)

Diese Anleitung ist für deinen Kumpel gedacht, damit er das System vor Ort beim Kunden in 5 Minuten einrichten kann.

## Voraussetzungen
- Zugriff auf das GitHub Repository.
- Die Supabase Keys des Kunden (URL & Anon Key).
- Die n8n Webhook-URL des Kunden.

---

## Schritt 1: Neues Projekt in Vercel
1. Logge dich in Vercel ein.
2. Klicke auf **"Add New..."** -> **"Project"**.
3. Wähle das Repository `CookiesDashboard` aus und klicke auf **"Import"**.

## Schritt 2: Umgebungsvariablen (Der wichtigste Teil)
Bevor du auf "Deploy" klickst, klappe den Bereich **"Environment Variables"** auf und füge folgende 3 Variablen hinzu:

1. `NEXT_PUBLIC_SUPABASE_URL` = (URL von Supabase)
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Anon Key von Supabase)
3. `N8N_WEBHOOK_URL` = (Die Webhook-URL der lokalen n8n Instanz)

## Schritt 3: Deployment
Klicke auf **"Deploy"**. Vercel baut die App nun in ca. 1-2 Minuten.

## Schritt 4: Datenbank-Initialisierung
1. Öffne das Supabase Dashboard des Kunden.
2. Gehe zum **SQL Editor**.
3. Kopiere den Inhalt aus deiner Datei `ausblick/01_DATENBANK_SETUP.sql` hinein und führe ihn aus.

## Schritt 5: Redirect URL in Supabase
Damit der Login klappt, muss Supabase wissen, dass die neue Vercel-URL sicher ist:
1. Gehe in Supabase zu **Authentication** -> **URL Configuration**.
2. Trage bei **Site URL** die neue Domain von Vercel ein (z.B. `https://kunde-x.vercel.app`).

---

**Fertig!** Das Dashboard ist nun für diesen spezifischen Kunden einsatzbereit.
