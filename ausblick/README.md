# Ausblick: Dokumentations-Index

Hier findest du die modular aufgeteilten Infos für die Weiterentwicklung deines Dashboards.

### 📁 Dateien in diesem Ordner:

1.  **`01_DATENBANK_SETUP.sql`**
    - Die reinen SQL-Befehle für Supabase (Rollen & Kunden-Filter).
2.  **`02_CODE_LOGIK.md`**
    - Wie du in Next.js abfragst, wer gerade eingeloggt ist (Admin vs. User).
3.  **`03_UI_FEATURES.md`**
    - Tipps für dynamische Tabellenspalten und kunden-spezifische Aktionen.
4.  **`04_PORTABLE_APP_STRATEGIE.md`**
    - Warum die Trennung pro Kunde auf Vercel besser ist als ein Orchestrator.
5.  **`05_VERCEL_SETUP_ANLEITUNG.md`**
    - Die 5-Minuten-Anleitung für deinen Kumpel zum Einrichten neuer Kunden.

---

### 💡 Visualisierung (Kurz erklärt)

*   **Der Sicherheits-Filter:** Supabase fungiert als Türsteher. Wenn ein Kunde Daten anfragt, filtert die Datenbank (RLS) automatisch alles weg, was nicht seine `client_id` hat.
*   **Die Weiche:** Im Dashboard gibt es eine Weiche. Admins bekommen zusätzliche Knöpfe (Edit-Mode, Workflow-Settings), Kunden sehen nur die "Tracking-Ansicht".
