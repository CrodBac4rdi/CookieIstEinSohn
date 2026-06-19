-- ############################################################
-- 1. ROLLEN-SYSTEM (ADMIN vs USER)
-- ############################################################

-- Tabelle für Rollen erstellen
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('ADMIN', 'USER')) DEFAULT 'USER',
  UNIQUE(user_id)
);

-- ############################################################
-- 2. MANDANTENFÄHIGKEIT (Kunden-Trennung)
-- ############################################################

-- Leads-Tabelle um client_id erweitern
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES auth.users(id);

-- Row Level Security (RLS) aktivieren
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- POLICY: Wer darf was sehen?
-- ADMINs dürfen alles.
-- USER sehen nur Leads, wo client_id ihrer eigenen ID entspricht.
CREATE POLICY "Leads Zugriffsberechtigung" ON public.leads
FOR ALL TO authenticated
USING (
  (SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'ADMIN' 
  OR 
  client_id = auth.uid()
);

-- ############################################################
-- 3. TEST-DATEN (Optional)
-- ############################################################
-- Einem Lead einen Kunden zuweisen:
-- UPDATE leads SET client_id = 'USER_ID_HIER' WHERE id = 1;
