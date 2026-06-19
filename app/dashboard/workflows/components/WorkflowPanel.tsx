"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  triggerScraping,
  triggerOutreach,
} from "@/app/actions/leadActions";
import type { WorkflowRun } from "@/app/dashboard/types";
import { WORKFLOW_STATUS_COLORS } from "@/app/dashboard/types";
import {
  Search,
  Mail,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Hourglass,
  Calendar,
} from "lucide-react";

interface WorkflowPanelProps {
  initialRuns: WorkflowRun[];
  lastScraping: WorkflowRun | null;
  lastOutreach: WorkflowRun | null;
}

const STATUS_ICONS: Record<WorkflowRun["status"], React.ElementType> = {
  pending: Hourglass,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
};

const STATUS_LABELS: Record<WorkflowRun["status"], string> = {
  pending: "Ausstehend",
  running: "Läuft...",
  completed: "Abgeschlossen",
  failed: "Fehlgeschlagen",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatDuration(start: string, end: string | null) {
  if (!end) return "—";
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const secs = Math.round(diff / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  return `${mins}m ${secs % 60}s`;
}

function WorkflowCard({
  title,
  description,
  icon: Icon,
  color,
  bg,
  lastRun,
  onTrigger,
  isPending,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  lastRun: WorkflowRun | null;
  onTrigger: () => void;
  isPending: boolean;
}) {
  const StatusIcon = lastRun ? STATUS_ICONS[lastRun.status] : null;

  return (
    <Card className="border-border/50 overflow-hidden">
      <div className={`h-1 w-full ${bg.replace("bg-", "bg-")}`} />
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-3 ${bg}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="mt-0.5 text-xs">{description}</CardDescription>
            </div>
          </div>

          {lastRun && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                WORKFLOW_STATUS_COLORS[lastRun.status]
              }`}
            >
              {StatusIcon && (
                <StatusIcon
                  className={`h-3 w-3 ${lastRun.status === "running" ? "animate-spin" : ""}`}
                />
              )}
              {STATUS_LABELS[lastRun.status]}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {lastRun && (
          <div className="rounded-lg bg-muted/40 px-4 py-3 text-xs space-y-1">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Letzter Run:</span>{" "}
              {formatDate(lastRun.triggered_at)}
            </p>
            {lastRun.triggered_by && (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Gestartet von:</span>{" "}
                {lastRun.triggered_by}
              </p>
            )}
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Dauer:</span>{" "}
              {formatDuration(lastRun.triggered_at, lastRun.completed_at)}
            </p>
            {lastRun.error_message && (
              <p className="text-destructive">{lastRun.error_message}</p>
            )}
          </div>
        )}

        <Button
          onClick={onTrigger}
          disabled={isPending || lastRun?.status === "running"}
          className="w-full gap-2"
          id={`btn-trigger-${title.toLowerCase().replace(/\s/g, "-")}`}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isPending ? "Wird gestartet..." : "Workflow starten"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function WorkflowPanel({
  initialRuns,
  lastScraping,
  lastOutreach,
}: WorkflowPanelProps) {
  const [runs, setRuns] = useState(initialRuns);
  const [lastScrapingRun, setLastScrapingRun] = useState(lastScraping);
  const [lastOutreachRun, setLastOutreachRun] = useState(lastOutreach);
  const [isScrapingPending, startScraping] = useTransition();
  const [isOutreachPending, startOutreach] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleScraping = () => {
    startScraping(async () => {
      try {
        await triggerScraping();
        toast({
          title: "🔍 Scraping gestartet",
          description: "Der Scraping-Workflow wurde erfolgreich getriggert.",
        });
        router.refresh();
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Fehler",
          description: err instanceof Error ? err.message : "Unbekannter Fehler",
        });
      }
    });
  };

  const handleOutreach = () => {
    startOutreach(async () => {
      try {
        await triggerOutreach();
        toast({
          title: "✉️ Outreach gestartet",
          description: "Der Outreach-Workflow wurde erfolgreich getriggert.",
        });
        router.refresh();
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Fehler",
          description: err instanceof Error ? err.message : "Unbekannter Fehler",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground text-sm mt-1">
            N8N-Automatisierungen starten und Status verfolgen.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => router.refresh()}
          id="btn-refresh-workflows"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Aktualisieren
        </Button>
      </div>

      {/* Workflow Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <WorkflowCard
          title="Lead Scraping"
          description="Neue Leads aus LinkedIn und anderen Quellen scrapen und in die Datenbank importieren."
          icon={Search}
          color="text-violet-600 dark:text-violet-400"
          bg="bg-violet-100 dark:bg-violet-900/20"
          lastRun={lastScrapingRun}
          onTrigger={handleScraping}
          isPending={isScrapingPending}
        />
        <WorkflowCard
          title="Lead Outreach"
          description="Für alle Leads ohne Erstnachricht eine personalisierte Anschreibe-Nachricht generieren."
          icon={Mail}
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-100 dark:bg-emerald-900/20"
          lastRun={lastOutreachRun}
          onTrigger={handleOutreach}
          isPending={isOutreachPending}
        />
      </div>

      {/* Run History */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Run-History
          </CardTitle>
          <CardDescription>Die letzten 30 Workflow-Ausführungen</CardDescription>
        </CardHeader>
        <CardContent>
          {initialRuns.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
              Noch keine Workflows gestartet.
            </div>
          ) : (
            <div className="space-y-2">
              {initialRuns.map((run) => {
                const StatusIcon = STATUS_ICONS[run.status];
                return (
                  <div
                    key={run.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${
                          run.workflow_type === "scraping"
                            ? "bg-violet-100 dark:bg-violet-900/30"
                            : "bg-emerald-100 dark:bg-emerald-900/30"
                        }`}
                      >
                        {run.workflow_type === "scraping" ? (
                          <Search className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        ) : (
                          <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {run.workflow_type === "scraping" ? "Lead Scraping" : "Lead Outreach"}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(run.triggered_at)}
                          {run.triggered_by && ` · ${run.triggered_by}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">
                        {formatDuration(run.triggered_at, run.completed_at)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          WORKFLOW_STATUS_COLORS[run.status]
                        }`}
                      >
                        <StatusIcon
                          className={`h-3 w-3 ${run.status === "running" ? "animate-spin" : ""}`}
                        />
                        {STATUS_LABELS[run.status]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
