"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { WorkflowRun } from "@/app/dashboard/types";

const leadStatusEnum = z.enum([
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
]);

const updateLeadSchema = z.object({
  customer_id: z.number().int().positive(),
  status: leadStatusEnum,
});

const workflowTypeEnum = z.enum(["scraping", "outreach"]);

// ─── Auth helper ─────────────────────────────────────────────────────────────
async function requireAuth() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return { supabase, user };
}

// ─── Update Lead Status ───────────────────────────────────────────────────────
export async function updateLeadStatus(customer_id: number, status: string) {
  const { supabase } = await requireAuth();

  const parsed = updateLeadSchema.safeParse({ customer_id, status });
  if (!parsed.success) throw new Error("Ungültige Eingabedaten");

  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data.status })
    .eq("customer_id", parsed.data.customer_id);

  if (error) throw new Error("Datenbankfehler beim Aktualisieren des Status");

  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Internal: trigger a workflow and log it ─────────────────────────────────
async function triggerWorkflow(type: "scraping" | "outreach") {
  const { supabase, user } = await requireAuth();

  const webhookUrl =
    type === "scraping"
      ? process.env.N8N_WEBHOOK_SCRAPING_URL
      : process.env.N8N_WEBHOOK_OUTREACH_URL;

  if (!webhookUrl) {
    throw new Error(
      `${type === "scraping" ? "N8N_WEBHOOK_SCRAPING_URL" : "N8N_WEBHOOK_OUTREACH_URL"} ist nicht konfiguriert`
    );
  }

  // 1. Erstelle workflow_runs Eintrag mit Status "pending"
  const { data: runData, error: insertError } = await supabase
    .from("workflow_runs")
    .insert({
      workflow_type: type,
      status: "pending",
      triggered_by: user.email,
    })
    .select("id")
    .single();

  if (insertError || !runData) {
    throw new Error("Workflow-Run konnte nicht erstellt werden");
  }

  const runId = runData.id;

  // 2. POST an N8N mit run_id im Payload
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow_type: type,
        run_id: runId,
        triggered_by: user.email,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      // Markiere als failed wenn N8N nicht erreichbar
      await supabase
        .from("workflow_runs")
        .update({ status: "failed", error_message: `HTTP ${response.status}` })
        .eq("id", runId);
      throw new Error(`Webhook antwortete mit Status: ${response.status}`);
    }

    // 3. Setze auf "running" nach erfolgreicher Übermittlung
    await supabase
      .from("workflow_runs")
      .update({ status: "running" })
      .eq("id", runId);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Webhook")) throw err;
    await supabase
      .from("workflow_runs")
      .update({ status: "failed", error_message: String(err) })
      .eq("id", runId);
    throw new Error("Workflow konnte nicht gestartet werden");
  }

  revalidatePath("/dashboard/workflows");
  return { success: true, runId };
}

// ─── Public: Scraping ─────────────────────────────────────────────────────────
export async function triggerScraping() {
  return triggerWorkflow("scraping");
}

// ─── Public: Outreach ─────────────────────────────────────────────────────────
export async function triggerOutreach() {
  return triggerWorkflow("outreach");
}

// ─── Get Workflow Runs ────────────────────────────────────────────────────────
export async function getWorkflowRuns(): Promise<WorkflowRun[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workflow_runs")
    .select("*")
    .order("triggered_at", { ascending: false })
    .limit(50);

  if (error) return [];
  return (data ?? []) as WorkflowRun[];
}