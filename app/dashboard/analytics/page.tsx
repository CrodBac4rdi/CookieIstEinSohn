import { createClient } from "@/utils/supabase/server";
import type { KpiMonthly, Lead } from "@/app/dashboard/types";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

export default async function AnalyticsPage() {
  const supabase = createClient();

  // KPI monthly data
  const { data: kpiData } = await supabase
    .from("kpi_monthly")
    .select("*")
    .order("monat", { ascending: true });

  // All leads for status/industry distribution
  const { data: leadsData } = await supabase
    .from("leads")
    .select("customer_id, status, industry, company_fit_score");

  const kpiMonthly = (kpiData ?? []) as KpiMonthly[];
  const leads = (leadsData ?? []) as Pick<Lead, "customer_id" | "status" | "industry" | "company_fit_score">[];

  // Compute status distribution
  const statusMap: Record<string, number> = {};
  for (const lead of leads) {
    const s = lead.status || "Unbekannt";
    statusMap[s] = (statusMap[s] ?? 0) + 1;
  }
  const statusDistribution = Object.entries(statusMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Compute industry distribution
  const industryMap: Record<string, number> = {};
  for (const lead of leads) {
    if (lead.industry) {
      industryMap[lead.industry] = (industryMap[lead.industry] ?? 0) + 1;
    }
  }
  const industryDistribution = Object.entries(industryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  // KPI totals from all leads
  const totalLeads = leads.length;
  const angesprochen = leads.filter((l) => l.status !== "Neu" && l.status !== "").length;
  const kontaktiert = leads.filter((l) =>
    ["Kontaktiert", "Interessiert", "Termin vereinbart", "Kunde"].includes(l.status)
  ).length;
  const vernetzt = leads.filter((l) => l.status === "Vernetzt - Wartezeit").length;

  return (
    <AnalyticsDashboard
      kpiMonthly={kpiMonthly}
      statusDistribution={statusDistribution}
      industryDistribution={industryDistribution}
      totals={{ totalLeads, angesprochen, kontaktiert, vernetzt }}
    />
  );
}
