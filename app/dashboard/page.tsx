import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeadTable from "./components/LeadTable";
import { Users, UserCheck, MessageSquare, Briefcase, LogOut } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch leads
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .order("id", { ascending: false });

  if (leadsError) {
    console.error("Error fetching leads:", leadsError);
  }

  const safeLeads = leads || [];

  // Calculate KPIs
  const totalLeads = safeLeads.length;
  const angesprochen = safeLeads.filter(l => l.status !== "Neu").length;
  const kontaktiert = safeLeads.filter(l => ["Kontaktiert", "Interessiert", "Termin vereinbart", "Kunde"].includes(l.status)).length;
  const vernetzt = safeLeads.filter(l => l.status === "Vernetzt - Wartezeit").length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-muted/20 min-h-screen">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            Eingeloggt als: <span className="font-medium text-foreground">{user.email}</span>
          </span>
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-4 w-4" />
              <span>Abmelden</span>
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Angesprochen</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{angesprochen}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kontaktiert / Aktiv</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kontaktiert}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vernetzt - Wartezeit</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vernetzt}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 tracking-tight">Ihre Leads</h3>
        <LeadTable initialLeads={safeLeads} />
      </div>
    </div>
  );
}