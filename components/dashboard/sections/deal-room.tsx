"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCrmStore } from "@/lib/stores/crm-store";
import type { DealStage } from "@/lib/crm";
import { useApi } from "@/lib/hooks/use-api";

const stages: DealStage[] = ["new", "contacted", "interested", "closed"];

export function DealRoomSection() {
  const api = useApi();
  const { leads, deals, setDeals, upsertDeal, moveDealStage, setSelectedLead } = useCrmStore();

  useEffect(() => {
    api.getDeals().then((data) => setDeals(Array.isArray(data) ? data : [])).catch(() => undefined);
  }, [api, setDeals]);

  const convertLead = (leadId: string) => {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) return;
    upsertDeal({
      id: crypto.randomUUID(),
      leadId: lead.id,
      company: lead.company,
      value: 5000 + lead.score * 100,
      stage: "new",
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader><CardTitle>Convert Leads to Deals</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {leads.map((lead) => (
            <Button key={lead.id} variant="outline" onClick={() => convertLead(lead.id)}>{lead.name}</Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        {stages.map((stage) => (
          <Card key={stage} className="bg-card border-border">
            <CardHeader><CardTitle className="capitalize">{stage}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {deals.filter((deal) => deal.stage === stage).map((deal) => (
                <div key={deal.id} className="rounded-md border border-border p-2">
                  <button className="font-medium text-left" onClick={() => setSelectedLead(leads.find((l) => l.id === deal.leadId))}>{deal.company}</button>
                  <p className="text-xs text-muted-foreground">${deal.value.toLocaleString()}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {stages.filter((next) => next !== stage).map((next) => (
                      <Button key={next} size="sm" variant="ghost" onClick={() => moveDealStage(deal.id, next)}>{next}</Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
