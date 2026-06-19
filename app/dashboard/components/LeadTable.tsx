"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import type { Lead } from "@/app/dashboard/types";
import { LEAD_STATUSES, STATUS_COLORS } from "@/app/dashboard/types";
import LeadDetailRow from "./LeadDetailRow";

interface LeadTableProps {
  initialLeads: Lead[];
  currentStatus?: string;
}

export default function LeadTable({ initialLeads, currentStatus }: LeadTableProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleStatusFilter = (value: string) => {
    if (value === "all") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard?status=${encodeURIComponent(value)}`);
    }
  };

  const toggleRow = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const fitScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400 font-bold";
    if (score >= 60) return "text-amber-600 dark:text-amber-400 font-semibold";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-3">
      {/* Filter Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter:</span>
          </div>
          <Select
            value={currentStatus || "all"}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[200px] h-8 text-sm">
              <SelectValue placeholder="Status wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentStatus && currentStatus !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => router.push("/dashboard")}
            >
              <X className="h-3 w-3 mr-1" />
              Filter zurücksetzen
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {initialLeads.length} Lead{initialLeads.length !== 1 ? "s" : ""}
          {currentStatus && currentStatus !== "all" && ` · gefiltert nach "${currentStatus}"`}
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-8" />
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Unternehmen</TableHead>
              <TableHead className="font-semibold">Branche</TableHead>
              <TableHead className="font-semibold text-right">Fit Score</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialLeads.map((lead) => {
              const isOpen = expandedId === lead.customer_id;
              return (
                <>
                  <TableRow
                    key={lead.customer_id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => toggleRow(lead.customer_id)}
                  >
                    <TableCell className="py-3">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="py-3 font-medium">
                      {lead.first_name ?? ""} {lead.last_name ?? ""}
                      {lead.job_title && (
                        <p className="text-xs text-muted-foreground">{lead.job_title}</p>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <p>{lead.company_name ?? "—"}</p>
                      {lead.country && (
                        <p className="text-xs text-muted-foreground">{lead.country}</p>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-sm">
                      {lead.industry ?? "—"}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <span className={fitScoreColor(lead.company_fit_score)}>
                        {lead.company_fit_score != null
                          ? `${lead.company_fit_score}`
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[lead.status] ??
                          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {lead.status || "—"}
                      </span>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Detail Row */}
                  {isOpen && (
                    <TableRow key={`detail-${lead.customer_id}`} className="bg-muted/10 hover:bg-muted/10">
                      <TableCell colSpan={6} className="p-0">
                        <LeadDetailRow lead={lead} />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}

            {initialLeads.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Keine Leads gefunden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}