# 🚀 Strategie: Die Portable App (Multi-Instance)

Anstatt eine riesige, komplizierte "Multi-Tenant" App zu bauen, nutzen wir den Next.js/Vercel Stack für maximale Einfachheit: **Ein Code-Repo, viele Vercel-Projekte.**

## Das Konzept
Jeder Kunde deines Kumpels bekommt seine eigene, isolierte Instanz. 
- **1 GitHub Repo:** Enthält den gesamten Code (dieses Projekt).
- **X Vercel Projekte:** Für jeden Kunden wird ein neues Projekt in Vercel erstellt, das mit dem gleichen GitHub-Repo verknüpft ist.

## Warum das die beste Lösung ist:
1. **Totale Isolation:** Wenn Kunde A gehackt wird, sind die Daten von Kunde B absolut sicher (andere DB, andere Keys).
2. **Rechtliche Sicherheit:** Da die Daten physisch getrennt sind (eigene Supabase-Instanzen), gibt es keine Probleme mit der DSGVO bezüglich Datenvermischung.
3. **Einfache Updates:** Wenn du einen Bug im Code fixst und in GitHub pushst, aktualisieren sich (optional) alle Kunden-Dashboards automatisch.
4. **Kein Overhead:** Du brauchst keinen "Orchestrator". Die App "weiß" nur von den Keys, die ihr in Vercel mitgegeben wurden.

---

## Architektur-Fluss pro Kunde:

1. **Kunde A:** `kunde-a.vercel.app` -> Verbunden mit `Supabase Kunde A` & `n8n Kunde A`.
2. **Kunde B:** `kunde-b.vercel.app` -> Verbunden mit `Supabase Kunde B` & `n8n Kunde B`.

Dein Kumpel muss vor Ort nur die Keys des jeweiligen Kunden einsammeln.
