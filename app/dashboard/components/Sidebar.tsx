"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Users,
  BarChart3,
  Zap,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Activity,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Leads",
    icon: Users,
    description: "Lead-Übersicht & Details",
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "KPI & Charts",
  },
  {
    href: "/dashboard/workflows",
    label: "Workflows",
    icon: Zap,
    description: "N8N Automation",
  },
];

interface SidebarProps {
  userEmail?: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await fetch("/auth/signout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] flex flex-col border-r border-border bg-card z-40">
      {/* Logo / Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Activity className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">B2B Lead CRM</p>
          <p className="text-xs text-muted-foreground mt-0.5">Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Navigation
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-link group",
                active && "active"
              )}
            >
              <item.icon
                className={cn(
                  "sidebar-icon h-4 w-4 shrink-0 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", active ? "text-primary" : "")}>
                  {item.label}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
              {active && (
                <ChevronRight className="h-3 w-3 text-primary shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-4 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="sidebar-link w-full"
          suppressHydrationWarning
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 shrink-0 text-muted-foreground" />
            )
          ) : (
            <Moon className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="text-sm">
            {mounted ? (theme === "dark" ? "Light Mode" : "Dark Mode") : "Dark Mode"}
          </span>
        </button>

        {/* User + Signout */}
        {userEmail && (
          <div className="rounded-lg bg-muted/50 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground truncate mb-2">
              {userEmail}
            </p>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-3 w-3" />
              Abmelden
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
