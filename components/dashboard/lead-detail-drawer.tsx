"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useCrmStore } from "@/lib/stores/crm-store";

export function LeadDetailDrawer() {
  const { selectedLead, setSelectedLead, actions, campaigns, deals } = useCrmStore();

  const leadActions = selectedLead ? actions.filter((item) => item.leadId === selectedLead.id) : [];
  const leadCampaigns = selectedLead
    ? campaigns.filter((campaign) => campaign.leadIds.includes(selectedLead.id))
    : [];
  const deal = selectedLead ? deals.find((item) => item.leadId === selectedLead.id) : undefined;

  return (
    <Dialog open={Boolean(selectedLead)} onOpenChange={(open) => !open && setSelectedLead(undefined)}>
      <DialogContent className="max-w-2xl bg-card border-border">
        {selectedLead && (
          <>
            <DialogHeader>
              <DialogTitle>{selectedLead.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {selectedLead.company} • {selectedLead.email || "No email"}
              </p>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <section>
                <h4 className="font-medium mb-2">Campaigns</h4>
                <div className="flex flex-wrap gap-2">
                  {leadCampaigns.length === 0 ? (
                    <span className="text-muted-foreground">Not assigned to campaigns.</span>
                  ) : (
                    leadCampaigns.map((campaign) => <Badge key={campaign.id}>{campaign.name}</Badge>)
                  )}
                </div>
              </section>

              <section>
                <h4 className="font-medium mb-2">Deal Status</h4>
                <p className="text-muted-foreground">
                  {deal ? `${deal.stage.toUpperCase()} • $${deal.value.toLocaleString()}` : "No deal yet."}
                </p>
              </section>

              <section>
                <h4 className="font-medium mb-2">Activity Timeline</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {leadActions.length === 0 ? (
                    <p className="text-muted-foreground">No activity yet.</p>
                  ) : (
                    leadActions.map((action) => (
                      <div key={action.id} className="rounded-md border border-border px-3 py-2">
                        <p className="font-medium capitalize">{action.type} • {action.status}</p>
                        <p className="text-muted-foreground">{action.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
