"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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
  id: z.number().int().positive(),
  status: leadStatusEnum,
});

export async function updateLeadStatus(id: number, status: string) {
  // 1. Zod Validation
  const parsed = updateLeadSchema.safeParse({ id, status });
  if (!parsed.success) {
    throw new Error("Invalid input data");
  }

  // 2. Auth Check
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // 3. Supabase Update
  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    throw new Error("Database error updating lead status");
  }

  // 4. Revalidate
  revalidatePath("/dashboard");
  return { success: true };
}

export async function triggerN8nWebhook(id: number, status: string) {
  // 1. Zod Validation
  const parsed = updateLeadSchema.safeParse({ id, status });
  if (!parsed.success) {
    throw new Error("Invalid input data");
  }

  // 2. Auth Check
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // 3. Trigger Webhook
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("N8N_WEBHOOK_URL is not configured");
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadId: parsed.data.id,
        status: parsed.data.status,
        triggeredBy: user.email,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Webhook trigger failed:", error);
    throw new Error("Failed to trigger workflow");
  }
}