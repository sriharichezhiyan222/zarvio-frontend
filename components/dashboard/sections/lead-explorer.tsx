"use client";

import { useMemo, useState } from "react";
import { Upload, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCrmStore } from "@/lib/stores/crm-store";
import { normalizeLead } from "@/lib/crm";
import { useApi } from "@/lib/hooks/use-api";
import { toast } from "sonner";

export function LeadExplorerSection() {
  const api = useApi();
  const { leads, setLeads, upsertLead, setSelectedLead, loading, setLoading } = useCrmStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => leads.filter((lead) => `${lead.name} ${lead.company}`.toLowerCase().includes(query.toLowerCase())),
    [leads, query]
  );

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await api.getLeads();
      setLeads((Array.isArray(data) ? data : []).map((item) => normalizeLead(item, "explorer")));
      toast.success("Leads synced from backend");
    } catch {
      toast.error("Failed to sync leads");
    } finally {
      setLoading(false);
    }
  };

  const addManualLead = async () => {
    const payload = normalizeLead({ name: "New Lead", company: "New Company" }, "manual");
    upsertLead(payload);
    try {
      await api.createLead(payload);
      toast.success("Lead created");
    } catch {
      toast.error("Lead queued locally (sync failed)");
    }
  };

  const importCsvSample = async () => {
    const csvLeads = [
      normalizeLead({ name: "Avery Stone", email: "avery@luma.io", company: "Luma", score: 73 }, "csv"),
      normalizeLead({ name: "Noah Reed", email: "noah@brio.ai", company: "Brio", score: 67 }, "csv"),
    ];
    setLeads([...csvLeads, ...leads]);
    toast.success("CSV leads imported to global pipeline");
    for (const lead of csvLeads) {
      api.createLead(lead).catch(() => undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button onClick={fetchLeads} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Sync Leads
        </Button>
        <Button variant="secondary" onClick={importCsvSample}><Upload className="w-4 h-4 mr-2" />Import CSV</Button>
        <Button variant="outline" onClick={addManualLead}><Plus className="w-4 h-4 mr-2" />Add Lead</Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Lead Explorer</CardTitle>
          <Input placeholder="Search leads" value={query} onChange={(e) => setQuery(e.target.value)} />
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="w-full text-left rounded-lg border border-border p-3 hover:bg-secondary/50"
            >
              <p className="font-medium">{lead.name}</p>
              <p className="text-sm text-muted-foreground">{lead.company} • {lead.source} • score {lead.score}</p>
            </button>
          ))}
          {!filtered.length && <p className="text-sm text-muted-foreground">No leads yet. Sync or import CSV.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
