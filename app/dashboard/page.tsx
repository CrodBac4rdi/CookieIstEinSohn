import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeadTable from "./components/LeadTable";
import { Users, MessageSquare, UserCheck, Link2 } from "lucide-react";
import type { Lead } from "./types";

interface DashboardPageProps {
  searchParams: { status?: string };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const supabase = createClient();
  const statusFilter = searchParams?.status;

  // Always fetch all leads for KPIs
  const { data: allLeads } = await supabase
    .from("leads")
    .select("customer_id, status")
    .order("customer_id", { ascending: false });

  // Fetch filtered leads for the table
  let query = supabase
    .from("leads")
    .select("*")
    .order("customer_id", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: leads, error: leadsError } = await query;

  if (leadsError) {
    console.error("Error fetching leads:", leadsError);
  }

  const safeAll = allLeads ?? [];
  const safeLeads = (leads ?? []) as Lead[];

  // KPIs always based on ALL leads
  const totalLeads = safeAll.length;
  const angesprochen = safeAll.filter((l) => l.status !== "Neu" && l.status !== "").length;
  const kontaktiert = safeAll.filter((l) =>
    ["Kontaktiert", "Interessiert", "Termin vereinbart", "Kunde"].includes(l.status)
  ).length;
  const vernetzt = safeAll.filter((l) => l.status === "Vernetzt - Wartezeit").length;

  const kpis = [
    {
      title: "Gesamt Leads",
      value: totalLeads,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Angesprochen",
      value: angesprochen,
      icon: MessageSquare,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/20",
    },
    {
      title: "Kontaktiert / Aktiv",
      value: kontaktiert,
      icon: UserCheck,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-100 dark:bg-violet-900/20",
    },
    {
      title: "Vernetzt - Wartezeit",
      value: vernetzt,
      icon: Link2,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-100 dark:bg-cyan-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lead-Übersicht</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Alle qualifizierten Leads im Überblick. KPI-Werte beziehen sich immer auf alle Leads.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="kpi-card-glow border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                von {totalLeads} gesamt
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lead Table */}
      <div>
        <LeadTable initialLeads={safeLeads} currentStatus={statusFilter} />
      </div>
    </div>
  );
}