"use client";

import { useMemo } from "react";
import type { OutreachTab } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCrmStore } from "@/lib/stores/crm-store";
import { useApi } from "@/lib/hooks/use-api";
import { toast } from "sonner";

interface OutreachSectionProps {
  activeTab: OutreachTab;
  onTabChange: (tab: OutreachTab) => void;
}

export function OutreachSection({ activeTab, onTabChange }: OutreachSectionProps) {
  const api = useApi();
  const { leads, actions, addAction, setSelectedLead } = useCrmStore();

  const filtered = useMemo(() => {
    const type = activeTab === "emails" ? "email" : activeTab === "phone" ? "call" : "message";
    return actions.filter((action) => action.type === type);
  }, [actions, activeTab]);

  const logAction = async (leadId: string) => {
    const type = activeTab === "emails" ? "email" : activeTab === "phone" ? "call" : "message";
    const record = {
      id: crypto.randomUUID(),
      leadId,
      type,
      status: type === "call" ? "scheduled" : "sent",
      note: `${type} activity from ${activeTab} module`,
      createdAt: new Date().toISOString(),
    } as const;

    addAction(record);
    try {
      await api.createAction(record);
      toast.success("Action synced");
    } catch {
      toast.error("Action saved optimistically");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button variant={activeTab === "emails" ? "default" : "secondary"} onClick={() => onTabChange("emails")}>Emails</Button>
        <Button variant={activeTab === "phone" ? "default" : "secondary"} onClick={() => onTabChange("phone")}>Calls</Button>
        <Button variant={activeTab === "messages" ? "default" : "secondary"} onClick={() => onTabChange("messages")}>Messages</Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle>Action Pipeline Timeline</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <button className="font-medium" onClick={() => setSelectedLead(lead)}>{lead.name}</button>
                <Button size="sm" variant="outline" onClick={() => logAction(lead.id)}>Log {activeTab}</Button>
              </div>
              <div className="mt-2 space-y-1">
                {actions.filter((action) => action.leadId === lead.id).slice(0, 3).map((action) => (
                  <p key={action.id} className="text-xs text-muted-foreground capitalize">{action.type} • {action.status} • {action.note}</p>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">No {activeTab} actions yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
