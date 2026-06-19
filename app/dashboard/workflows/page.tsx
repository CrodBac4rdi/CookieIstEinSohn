import { createClient } from "@/utils/supabase/server";
import type { WorkflowRun } from "@/app/dashboard/types";
import WorkflowPanel from "./components/WorkflowPanel";

export default async function WorkflowsPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("workflow_runs")
    .select("*")
    .order("triggered_at", { ascending: false })
    .limit(30);

  const runs = (data ?? []) as WorkflowRun[];

  // Last run per type
  const lastScraping = runs.find((r) => r.workflow_type === "scraping") ?? null;
  const lastOutreach = runs.find((r) => r.workflow_type === "outreach") ?? null;

  return (
    <WorkflowPanel
      initialRuns={runs}
      lastScraping={lastScraping}
      lastOutreach={lastOutreach}
    />
  );
}
