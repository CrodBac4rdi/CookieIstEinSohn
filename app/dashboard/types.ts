export type Lead = {
  customer_id: number;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  company_website: string | null;
  linkedin: string | null;
  job_title: string | null;
  industry: string | null;
  seniority_level: string | null;
  company_linkedin: string | null;
  country: string | null;
  company_description: string | null;
  summary: string | null;
  key_values: string | null;
  pain_points: string | null;
  age: string | null;
  staff: string | null;
  recent_events: string | null;
  company_fit_score: number | null;
  confidence_score: number | null;
  reason: string | null;
  outreach_recommendation: string | null;
  status: string;
  erstnachricht: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type KpiMonthly = {
  id: number;
  monat: string;
  leadanzahl: number | null;
  enriched_leads: number | null;
  scraping_kosten: number | null;
  enrichment_kosten: number | null;
  apify_kosten: number | null;
  kosten_pro_lead: number | null;
  kontaktierte_leads: number | null;
  interessierte_leads: number | null;
  kosten_pro_ersttermin: number | null;
  umgesetzte_leads: number | null;
  kosten_pro_umgesetzten_lead: number | null;
  pos_antworten: number | null;
  neg_antworten: number | null;
  ges_antworten: number | null;
  leadqualitaet: number | null;
};

export type WorkflowRun = {
  id: number;
  workflow_type: "scraping" | "outreach";
  status: "pending" | "running" | "completed" | "failed";
  triggered_by: string | null;
  triggered_at: string;
  completed_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
};

export const LEAD_STATUSES = [
  "Neu",
  "Disqualifiziert",
  "Bereit",
  "Kontaktiert",
  "Interessiert",
  "Kein Interesse",
  "Termin vereinbart",
  "Kunde",
  "Verloren",
  "Vernetzt - Wartezeit",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_COLORS: Record<string, string> = {
  Neu: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Disqualifiziert: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Bereit: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Kontaktiert: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  Interessiert: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Kein Interesse": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Termin vereinbart": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Kunde: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Verloren: "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  "Vernetzt - Wartezeit": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
};

export const WORKFLOW_STATUS_COLORS: Record<WorkflowRun["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  running: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};
