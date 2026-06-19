-- ============================================================
-- MIGRATION: workflow_runs Tabelle
-- Einzuspielen in: Supabase → SQL Editor
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

-- RLS aktivieren
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;

-- Policy: anon darf alles (konsistent mit bestehenden Tabellen)
CREATE POLICY "anon_all_workflow_runs" ON workflow_runs
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- N8N CALLBACK ENDPOINT:
-- Am Ende jedes N8N Workflows einen HTTP-Request-Node einfügen:
--
-- URL:    POST https://<project>.supabase.co/rest/v1/workflow_runs?id=eq.{{$json.run_id}}
-- Method: PATCH
-- Headers:
--   apikey:        <SUPABASE_ANON_KEY>
--   Authorization: Bearer <SUPABASE_ANON_KEY>
--   Content-Type:  application/json
-- Body:
--   { "status": "completed", "completed_at": "{{$now}}" }
--
-- Für den Fehlerfall (Error-Handler-Node):
-- Body:
--   { "status": "failed", "error_message": "{{$json.error}}", "completed_at": "{{$now}}" }
-- ============================================================
