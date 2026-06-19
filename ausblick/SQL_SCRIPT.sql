CREATE TABLE IF NOT EXISTS leads (
  customer_id             INTEGER PRIMARY KEY,
  first_name              TEXT,
  last_name               TEXT,
  company_name            TEXT,
  company_website         TEXT,
  linkedin                TEXT UNIQUE,
  job_title               TEXT,
  industry                TEXT,
  seniority_level         TEXT,
  company_linkedin        TEXT,
  country                 TEXT,
  company_description     TEXT,
  summary                 TEXT,
  key_values              TEXT,
  pain_points             TEXT,
  age                     TEXT,
  staff                   TEXT,
  recent_events           TEXT,
  company_fit_score       NUMERIC,
  confidence_score        NUMERIC,
  reason                  TEXT,
  outreach_recommendation TEXT,
  status                  TEXT DEFAULT '',
  erstnachricht           TEXT,
  created_at              TIMESTAMPTZ,
  updated_at              TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS kpi_monthly (
  id                          SERIAL PRIMARY KEY,
  monat                       TEXT UNIQUE,
  leadanzahl                  NUMERIC,
  enriched_leads              NUMERIC,
  scraping_kosten             NUMERIC,
  enrichment_kosten           NUMERIC,
  apify_kosten                NUMERIC,
  kosten_pro_lead             NUMERIC,
  kontaktierte_leads          NUMERIC,
  interessierte_leads         NUMERIC,
  kosten_pro_ersttermin       NUMERIC,
  umgesetzte_leads            NUMERIC,
  kosten_pro_umgesetzten_lead NUMERIC,
  pos_antworten               NUMERIC,
  neg_antworten               NUMERIC,
  ges_antworten               NUMERIC,
  leadqualitaet               NUMERIC
);

CREATE TABLE IF NOT EXISTS lead_log (
  id         SERIAL PRIMARY KEY,
  linkedin   TEXT UNIQUE,
  scraped_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS error_log (
  id             SERIAL PRIMARY KEY,
  timestamp      TEXT,
  error_type     TEXT,
  error_message  TEXT,
  failed_company TEXT,
  failed_step    TEXT,
  stack_trace    TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_leads" ON leads FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_kpi" ON kpi_monthly FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_lead_log" ON lead_log FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_error_log" ON error_log FOR ALL TO anon USING (true) WITH CHECK (true);