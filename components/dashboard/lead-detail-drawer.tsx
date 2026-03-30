"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useCrmStore } from "@/lib/stores/crm-store";

export function LeadDetailDrawer() {
  const { selectedLead, setSelectedLead, campaigns, actions, deals } = useCrmStore();

  const assignedCampaigns = selectedLead ? campaigns.filter((c) => c.leadIds.includes(selectedLead.id)) : [];
  const timeline = selectedLead ? actions.filter((a) => a.leadId === selectedLead.id) : [];
  const deal = selectedLead ? deals.find((d) => d.leadId === selectedLead.id) : undefined;

  return (
    <Dialog open={Boolean(selectedLead)} onOpenChange={(open) => !open && setSelectedLead(undefined)}>
      <DialogContent className="bg-card border-border max-w-2xl">
        {selectedLead && (
          <>
            <DialogHeader>
              <DialogTitle>{selectedLead.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{selectedLead.company} · {selectedLead.email || "No email"}</p>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium mb-2">Campaigns assigned</p>
                <div className="flex flex-wrap gap-2">
                  {assignedCampaigns.length ? assignedCampaigns.map((c) => <Badge key={c.id}>{c.name}</Badge>) : <span className="text-muted-foreground">No campaign</span>}
                </div>
              </div>
              <div>
                <p className="font-medium mb-1">Deal status</p>
                <p className="text-muted-foreground">{deal ? `${deal.stage} · $${deal.value.toLocaleString()}` : "No deal"}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Activity timeline</p>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {timeline.length ? timeline.map((item) => (
                    <div key={item.id} className="rounded-md border border-border px-3 py-2">
                      <p className="capitalize">{item.type} · {item.status}</p>
                      <p className="text-muted-foreground">{item.note}</p>
                    </div>
                  )) : <p className="text-muted-foreground">No actions yet.</p>}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
