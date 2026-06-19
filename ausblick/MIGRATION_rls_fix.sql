-- ============================================================
-- MIGRATION: RLS Fix für authenticated User + workflow_runs
-- Einzuspielen in: Supabase → SQL Editor
-- ============================================================
-- Problem: Bestehende Policies erlauben nur 'anon'-Rolle.
-- Wenn man eingeloggt ist, nutzt Supabase die 'authenticated'-Rolle.
-- Daher sieht ein eingeloggter User KEINE Daten.
-- Diese Migration fügt authenticated-Policies hinzu.
-- ============================================================

-- 1. LEADS: authenticated Policy hinzufügen
CREATE POLICY "authenticated_all_leads" ON leads
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. KPI_MONTHLY: authenticated Policy hinzufügen
CREATE POLICY "authenticated_all_kpi" ON kpi_monthly
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. LEAD_LOG: authenticated Policy hinzufügen
CREATE POLICY "authenticated_all_lead_log" ON lead_log
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. ERROR_LOG: authenticated Policy hinzufügen
CREATE POLICY "authenticated_all_error_log" ON error_log
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 5. WORKFLOW_RUNS Tabelle erstellen (falls noch nicht gemacht)
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_runs (
  id              SERIAL PRIMARY KEY,
  workflow_type   TEXT NOT NULL CHECK (workflow_type IN ('scraping', 'outreach')),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  triggered_by    TEXT,
  triggered_at    TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  error_message   TEXT,
  metadata        JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_workflow_runs" ON workflow_runs
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_all_workflow_runs" ON workflow_runs
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- WARUM DAS PASSIERT:
-- @supabase/ssr sendet den User-JWT-Token mit jedem Request mit.
-- Supabase interpretiert authentifizierte Requests als 'authenticated'
-- statt 'anon'. Da die bestehenden Policies nur 'anon' erlauben,
-- sieht ein eingeloggter User keine Daten (leere Tabelle).
-- ============================================================
