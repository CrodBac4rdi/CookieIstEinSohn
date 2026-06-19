"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  MessageSquare,
  UserCheck,
  Link2,
  BarChart2,
  TrendingUp,
  PieChartIcon,
  Activity,
} from "lucide-react";
import type { KpiMonthly } from "@/app/dashboard/types";
import { cn } from "@/lib/utils";

type ChartType = "bar" | "line" | "area" | "pie";

type MetricKey =
  | "leadanzahl"
  | "enriched_leads"
  | "kosten_pro_lead"
  | "kontaktierte_leads"
  | "interessierte_leads"
  | "pos_antworten"
  | "neg_antworten"
  | "leadqualitaet";

const METRICS: { key: MetricKey; label: string; unit?: string }[] = [
  { key: "leadanzahl", label: "Leads pro Monat" },
  { key: "enriched_leads", label: "Enriched Leads" },
  { key: "kosten_pro_lead", label: "Kosten pro Lead", unit: "€" },
  { key: "kontaktierte_leads", label: "Kontaktierte Leads" },
  { key: "interessierte_leads", label: "Interessierte Leads" },
  { key: "pos_antworten", label: "Positive Antworten" },
  { key: "neg_antworten", label: "Negative Antworten" },
  { key: "leadqualitaet", label: "Lead-Qualität (Ø)" },
];

const CHART_COLORS = [
  "hsl(231, 90%, 65%)",
  "hsl(160, 60%, 50%)",
  "hsl(30, 80%, 60%)",
  "hsl(280, 65%, 65%)",
  "hsl(340, 75%, 60%)",
  "hsl(197, 37%, 50%)",
  "hsl(43, 74%, 60%)",
  "hsl(12, 76%, 61%)",
];

const CHART_TYPE_OPTIONS: { type: ChartType; label: string; icon: React.ElementType }[] = [
  { type: "bar", label: "Balken", icon: BarChart2 },
  { type: "line", label: "Linie", icon: TrendingUp },
  { type: "area", label: "Fläche", icon: Activity },
  { type: "pie", label: "Pie/Donut", icon: PieChartIcon },
];

interface Props {
  kpiMonthly: KpiMonthly[];
  statusDistribution: { name: string; value: number }[];
  industryDistribution: { name: string; value: number }[];
  totals: {
    totalLeads: number;
    angesprochen: number;
    kontaktiert: number;
    vernetzt: number;
  };
}

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
  fontSize: "12px",
};

export default function AnalyticsDashboard({
  kpiMonthly,
  statusDistribution,
  industryDistribution,
  totals,
}: Props) {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [metric, setMetric] = useState<MetricKey>("leadanzahl");

  const selectedMetric = METRICS.find((m) => m.key === metric)!;

  const kpis = [
    { title: "Gesamt Leads", value: totals.totalLeads, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Angesprochen", value: totals.angesprochen, icon: MessageSquare, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
    { title: "Kontaktiert / Aktiv", value: totals.kontaktiert, icon: UserCheck, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/20" },
    { title: "Vernetzt - Wartezeit", value: totals.vernetzt, icon: Link2, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/20" },
  ];

  const renderMainChart = () => {
    const data = kpiMonthly.map((d) => ({
      monat: d.monat,
      value: d[metric] ?? 0,
    }));

    const color = CHART_COLORS[0];
    const label = selectedMetric.label;

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="monat"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={130}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="monat" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="value" name={label} stroke={color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="monat" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="value" name={label} stroke={color} fill="url(#colorValue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // default: bar
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="monat" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" name={label} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics & KPI</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monatliche KPI-Entwicklung und Lead-Verteilungen auf einen Blick.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className={`rounded-lg p-2 ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">{selectedMetric.label}</CardTitle>
              <CardDescription>Monatliche Entwicklung</CardDescription>
            </div>

            <div className="flex flex-col gap-3">
              {/* Chart Type Selector */}
              <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
                {CHART_TYPE_OPTIONS.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                      chartType === type
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Metric Selector */}
              <div className="flex flex-wrap gap-1">
                {METRICS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMetric(m.key)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium transition-all",
                      metric === m.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {kpiMonthly.length === 0 ? (
            <div className="flex h-[320px] items-center justify-center text-muted-foreground text-sm">
              Noch keine Monatsdaten in der kpi_monthly Tabelle vorhanden.
            </div>
          ) : (
            renderMainChart()
          )}
        </CardContent>
      </Card>

      {/* Bottom Row: Status + Industry Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Status Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Status-Verteilung</CardTitle>
            <CardDescription>Alle Leads nach aktuellem Status</CardDescription>
          </CardHeader>
          <CardContent>
            {statusDistribution.length === 0 ? (
              <div className="flex h-52 items-center justify-center text-muted-foreground text-sm">
                Keine Daten
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {statusDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Industry Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Top-Branchen</CardTitle>
            <CardDescription>Leads nach Branche (Top 10)</CardDescription>
          </CardHeader>
          <CardContent>
            {industryDistribution.length === 0 ? (
              <div className="flex h-52 items-center justify-center text-muted-foreground text-sm">
                Keine Daten
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={industryDistribution}
                  layout="vertical"
                  margin={{ top: 0, right: 20, bottom: 0, left: 80 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    width={75}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" name="Leads" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
