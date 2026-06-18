"use client";

import { useTransition } from "react";
import { updateLeadStatus, triggerN8nWebhook } from "@/app/actions/leadActions";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Lead = {
  id: number;
  vorname: string;
  nachname: string;
  firma: string;
  branche: string;
  empfehlung: string;
  fit_score: number;
  status: string;
};

const leadStatuses = [
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
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Neu":
      return "bg-blue-100 text-blue-800";
    case "Kunde":
      return "bg-green-100 text-green-800";
    case "Verloren":
    case "Disqualifiziert":
    case "Kein Interesse":
      return "bg-red-100 text-red-800";
    case "Interessiert":
    case "Termin vereinbart":
    case "Bereit":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function LeadTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStatusChange = async (id: number, newStatus: string) => {
    startTransition(async () => {
      try {
        await updateLeadStatus(id, newStatus);
        toast({
          title: "Status aktualisiert",
          description: "Der Lead-Status wurde erfolgreich gespeichert.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Fehler",
          description: "Status konnte nicht aktualisiert werden.",
        });
      }
    });
  };

  const handleTriggerWorkflow = async (id: number, status: string) => {
    try {
      await triggerN8nWebhook(id, status);
      toast({
        title: "Workflow gestartet",
        description: "Der n8n Workflow wurde erfolgreich getriggert.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Workflow konnte nicht gestartet werden.",
      });
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Firma</TableHead>
            <TableHead>Branche</TableHead>
            <TableHead>Empfehlung</TableHead>
            <TableHead className="text-right">Fit Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">
                {lead.vorname} {lead.nachname}
              </TableCell>
              <TableCell>{lead.firma}</TableCell>
              <TableCell>{lead.branche}</TableCell>
              <TableCell className="truncate max-w-[150px]" title={lead.empfehlung}>
                {lead.empfehlung}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">{lead.fit_score}</Badge>
              </TableCell>
              <TableCell>
                <Select
                  disabled={isPending}
                  defaultValue={lead.status}
                  onValueChange={(val) => handleStatusChange(lead.id, val)}
                >
                  <SelectTrigger className={`w-[180px] border-none font-medium ${getStatusColor(lead.status)}`}>
                    <SelectValue placeholder="Status wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTriggerWorkflow(lead.id, lead.status)}
                >
                  Workflow starten
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {initialLeads.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Keine Leads gefunden.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}