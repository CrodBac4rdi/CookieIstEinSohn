import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userEmail={user.email} />
      <main className="ml-[260px] min-h-screen">
        <div className="h-full p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
