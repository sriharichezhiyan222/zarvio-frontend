"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCrmStore } from "@/lib/stores/crm-store";
import type { CampaignStep } from "@/lib/crm";
import { useApi } from "@/lib/hooks/use-api";
import { toast } from "sonner";

const defaultSteps: CampaignStep[] = [
  { id: "s1", channel: "email", label: "Step 1: Email" },
  { id: "s2", channel: "message", label: "Step 2: WhatsApp/SMS" },
  { id: "s3", channel: "call", label: "Step 3: Ghost Caller" },
];

export function CampaignSection() {
  const api = useApi();
  const { leads, campaigns, setCampaigns, upsertCampaign, assignLeadToCampaign, setSelectedLead } = useCrmStore();
  const [name, setName] = useState("Outbound Sequence");
  const [selected, setSelected] = useState<string[]>([]);

  const selectedLeads = useMemo(() => leads.filter((lead) => selected.includes(lead.id)), [leads, selected]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const createCampaign = async () => {
    const campaign = {
      id: crypto.randomUUID(),
      name,
      leadIds: selected,
      steps: defaultSteps,
      status: "active" as const,
      createdAt: new Date().toISOString(),
    };

    upsertCampaign(campaign);
    selected.forEach((leadId) => assignLeadToCampaign(leadId, campaign.id));

    try {
      await api.createCampaign(campaign);
      toast.success("Campaign created");
    } catch {
      toast.error("Campaign saved locally (API failed)");
    }
  };

  const syncCampaigns = async () => {
    const data = await api.getCampaigns().catch(() => []);
    setCampaigns(Array.isArray(data) ? data : []);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader><CardTitle>Campaign Builder</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <input className="w-full rounded-md border border-border bg-background px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="space-y-2">
            {defaultSteps.map((step) => <Badge key={step.id} variant="secondary" className="mr-2">{step.label}</Badge>)}
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {leads.map((lead) => (
              <button key={lead.id} onClick={() => toggle(lead.id)} className={`rounded-md border p-2 text-left ${selected.includes(lead.id) ? "border-primary" : "border-border"}`}>
                <p>{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.company}</p>
              </button>
            ))}
          </div>
          <Button onClick={createCampaign}>Save Campaign ({selected.length} leads)</Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Campaigns</CardTitle>
          <Button variant="outline" onClick={syncCampaigns}>Refresh</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-lg border border-border p-3">
              <p className="font-medium">{campaign.name}</p>
              <p className="text-xs text-muted-foreground">{campaign.leadIds.length} assigned leads</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedLeads.filter((lead) => campaign.leadIds.includes(lead.id)).map((lead) => (
                  <Badge key={lead.id} className="cursor-pointer" onClick={() => setSelectedLead(lead)}>{lead.name}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
