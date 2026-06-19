"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/app/actions/leadActions";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/app/dashboard/types";
import { LEAD_STATUSES } from "@/app/dashboard/types";
import {
  Building2,
  Globe,
  Linkedin,
  Briefcase,
  Users,
  MapPin,
  Calendar,
  Target,
  MessageSquare,
  FileText,
  Lightbulb,
  TrendingUp,
  Hash,
} from "lucide-react";

interface LeadDetailRowProps {
  lead: Lead;
}

function DetailSection({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2.5 py-1">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}:</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}

export default function LeadDetailRow({ lead }: LeadDetailRowProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      try {
        await updateLeadStatus(lead.customer_id, newStatus);
        toast({
          title: "✓ Status aktualisiert",
          description: `Status wurde auf "${newStatus}" gesetzt.`,
        });
      } catch {
        toast({
          variant: "destructive",
          title: "Fehler",
          description: "Status konnte nicht aktualisiert werden.",
        });
      }
    });
  };

  return (
    <div className="px-6 py-5 border-t border-border/50">
      {/* Header row: Meta-Infos + Status-Änderung */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex flex-wrap gap-2">
          <InfoChip label="Seniority" value={lead.seniority_level} />
          <InfoChip label="Land" value={lead.country} />
          <InfoChip label="Mitarbeiter" value={lead.staff} />
          <InfoChip label="Alter" value={lead.age} />
          {lead.company_fit_score != null && (
            <InfoChip label="Fit Score" value={`${lead.company_fit_score}`} />
          )}
          {lead.confidence_score != null && (
            <InfoChip label="Confidence" value={`${lead.confidence_score}`} />
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Status:</span>
          <Select
            defaultValue={lead.status}
            onValueChange={handleStatusChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-[190px] h-8 text-sm" id={`status-${lead.customer_id}`}>
              <SelectValue placeholder="Status wählen" />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3 mb-5">
        {lead.company_website && (
          <a
            href={lead.company_website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Globe className="h-3 w-3" />
            Website
          </a>
        )}
        {lead.linkedin && (
          <a
            href={lead.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Linkedin className="h-3 w-3" />
            LinkedIn
          </a>
        )}
        {lead.company_linkedin && (
          <a
            href={lead.company_linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Building2 className="h-3 w-3" />
            Firmen-LinkedIn
          </a>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DetailSection icon={Building2} label="Unternehmens-Beschreibung" value={lead.company_description} />
        <DetailSection icon={Target} label="Pain Points" value={lead.pain_points} />
        <DetailSection icon={FileText} label="Zusammenfassung" value={lead.summary} />
        <DetailSection icon={Lightbulb} label="Kernwerte" value={lead.key_values} />
        <DetailSection icon={TrendingUp} label="Aktuelle Ereignisse" value={lead.recent_events} />
        <DetailSection icon={Hash} label="Qualifizierungsgrund" value={lead.reason} />
        <DetailSection icon={MessageSquare} label="Outreach-Empfehlung" value={lead.outreach_recommendation} />
        <DetailSection icon={Calendar} label="Erstnachricht" value={lead.erstnachricht} />
      </div>
    </div>
  );
}
