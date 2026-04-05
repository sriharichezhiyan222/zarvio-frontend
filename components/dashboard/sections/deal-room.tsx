"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/types";
import {
  Building2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiJson } from "@/lib/client-api";
import { toast } from "@/hooks/use-toast";

interface DealRoomSectionProps {
  leadId?: string;
  onNavigateTo?: (section: Section) => void;
}

export function DealRoomSection({ leadId, onNavigateTo }: DealRoomSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dealRoomId, setDealRoomId] = useState<string | null>(null);
  const [row, setRow] = useState<Record<string, unknown> | null>(null);

  const loadSession = useCallback(async () => {
    if (!leadId) return;
    setLoading(true);
    setError(null);
    try {
      const created = await apiJson<{ deal_room_id: string; deal_room: Record<string, unknown> }>(
        "/api/deal-room/create",
        {
          method: "POST",
          body: JSON.stringify({ lead_id: leadId }),
        }
      );
      setDealRoomId(created.deal_room_id);
      setRow(created.deal_room);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not open deal room";
      setError(msg);
      toast({ variant: "destructive", title: "Deal room", description: msg });
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    if (!leadId) {
      setDealRoomId(null);
      setRow(null);
      setError(null);
      return;
    }
    void loadSession();
  }, [leadId, loadSession]);

  if (!leadId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
        <Building2 className="mb-4 h-10 w-10 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">No active deal room</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Open Deal Room from a specific lead in Lead Explorer or Campaigns. A session is created only when you choose a lead.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => onNavigateTo?.("lead-explorer")}>
          Go to Lead Explorer
        </Button>
      </div>
    );
  }

  if (loading && !row) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Creating deal room from your data…</p>
      </div>
    );
  }

  if (error && !row) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-destructive" />
        <p className="text-sm text-foreground">{error}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Ensure migrations are applied and the lead exists.{" "}
          <code className="rounded bg-secondary px-1">database/migrations/20260402_product_core.sql</code>
        </p>
        <Button className="mt-4" variant="outline" onClick={() => void loadSession()}>
          Retry
        </Button>
      </div>
    );
  }

  const ctx = (row?.generated_context as Record<string, unknown>) || {};
  const gaps = (row?.setup_gaps as string[]) || (ctx.gaps as string[]) || [];
  const sections = (ctx.sections as Record<string, Record<string, unknown>>) || {};
  const lead = (ctx.lead as Record<string, string>) || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => onNavigateTo?.("campaign")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-chart-2/30">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{lead.name || "Lead"}</h2>
            <p className="text-sm text-muted-foreground">
              {(lead.title || "—") + " · " + (lead.company || "—")}
            </p>
            {dealRoomId && (
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">Session {dealRoomId.slice(0, 8)}…</p>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => void loadSession()} disabled={loading}>
          <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {gaps.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Incomplete setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The following context is missing. We do not invent pricing or probabilities without it.
            </p>
            <ul className="mt-3 list-inside list-disc text-sm text-foreground">
              {gaps.map((g) => (
                <li key={g} className="capitalize">
                  {g.replace(/_/g, " ")}
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="mt-4" size="sm" onClick={() => onNavigateTo?.("lead-explorer")}>
              Configure workspace memory (Lead Explorer → Memory)
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(sections).map(([key, sec]) => {
          const status = String(sec?.status || "unknown");
          const data = sec?.data;
          const hint = sec?.hint as string | undefined;
          return (
            <Card key={key} className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      status === "ok" && "border-emerald-500/40 text-emerald-600",
                      status === "missing" && "border-destructive/40 text-destructive",
                      status === "incomplete" && "border-amber-500/40 text-amber-600",
                      status === "not_applicable" && "text-muted-foreground"
                    )}
                  >
                    {status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {data != null && typeof data === "object" ? (
                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-secondary/40 p-3 text-xs text-foreground">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                ) : data != null ? (
                  <p className="text-foreground">{String(data)}</p>
                ) : (
                  <p>{hint || "No data for this section."}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {typeof ctx.disclaimer === "string" && (
        <p className="text-center text-xs text-muted-foreground">{ctx.disclaimer}</p>
      )}

      <Card className="border-border bg-secondary/20">
        <CardContent className="flex items-start gap-3 py-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Real data only</p>
            <p className="mt-1">
              This view is built from your lead record, optional campaign link, workspace memory, and environment
              variables (e.g. ZARVIO_DEFAULT_OFFER_AMOUNT). Swarm votes and fabricated win rates are not shown here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
