"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Building2,
  ChevronDown,
  Copy,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  PhoneCall,
  Plus,
  Send,
  Sparkles,
  Target,
  Brain,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { apiJson } from "@/lib/client-api";
import { toast } from "@/hooks/use-toast";
import type { Section } from "@/lib/types";

// —— Types ——————————————————————————————————————————————————————————

export interface ExplorerLead {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  fit_score: number;
  why_this_lead: string[];
  recommended_action: string;
  outreach_angle: string;
}

export type ChatMessage =
  | { id: string; role: "user"; content: string }
  | {
      id: string;
      role: "assistant";
      content: string;
      leads?: ExplorerLead[];
      threadId?: string | null;
    };

interface CampaignOption {
  id: string;
  name: string;
  lead_count: number;
}

interface LeadExplorerSectionProps {
  onOpenDealRoom?: (leadId: string) => void;
  onNavigateTo?: (section: Section) => void;
}

interface SearchResponse {
  thread_id?: string | null;
  message: string;
  leads: ExplorerLead[];
}

interface DraftEmailResponse {
  subject: string;
  body: string;
}

const FALLBACK_CAMPAIGNS: CampaignOption[] = [
  { id: "cmp-1", name: "Q2 Enterprise", lead_count: 0 },
  { id: "cmp-2", name: "SMB Sprint", lead_count: 0 },
  { id: "cmp-3", name: "Revival — Dormant", lead_count: 0 },
];

const SUGGESTED_PROMPTS = [
  "Find 10 SaaS founders in Chennai who might need outbound automation",
  "Find ecommerce leads in Bangalore for cold email outreach",
  "Draft a founder-style email for fintech prospects",
  "Find B2B leads in Mumbai for sales engagement",
];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function displayOrDash(v: string | undefined | null) {
  const s = (v || "").trim();
  return s || "—";
}

// —— Lead card ——————————————————————————————————————————————————————

function LeadExplorerLeadCard({
  lead,
  added,
  addLoading,
  draftLoading,
  onAddClick,
  onDraftEmail,
  onViewAnalysis,
  onGhostCaller,
}: {
  lead: ExplorerLead;
  added: boolean;
  addLoading: boolean;
  draftLoading: boolean;
  onAddClick: () => void;
  onDraftEmail: () => void;
  onViewAnalysis: () => void;
  onGhostCaller: () => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-semibold text-foreground">{displayOrDash(lead.name)}</p>
          <p className="truncate text-xs text-muted-foreground">{displayOrDash(lead.role)}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex min-w-0 items-center gap-1">
              <Building2 className="size-3 shrink-0 opacity-70" />
              <span className="truncate">{displayOrDash(lead.company)}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3 shrink-0 opacity-70" />
              <span className="truncate">{displayOrDash(lead.location)}</span>
            </span>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="shrink-0 border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        >
          {Math.min(100, Math.max(0, Math.round(lead.fit_score)))}% fit
        </Badge>
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        <p className="font-medium text-foreground/80">Contact</p>
        <p className="truncate">Email: {displayOrDash(lead.email)}</p>
        <p className="truncate">Phone: {displayOrDash(lead.phone)}</p>
      </div>

      <div className="mt-3 min-h-[3rem] flex-1 space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Why this lead</p>
        <ul className="list-inside list-disc space-y-0.5 text-xs leading-relaxed text-muted-foreground">
          {(lead.why_this_lead?.length ? lead.why_this_lead : ["Strong profile match for your query"]).map(
            (line, i) => (
              <li key={i} className="marker:text-primary/50">
                {line}
              </li>
            )
          )}
        </ul>
      </div>

      <div className="mt-3 rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/90">What to do: </span>
        {displayOrDash(lead.recommended_action)}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3">
        <Button
          size="sm"
          className="min-w-0 flex-1 gap-1.5"
          disabled={addLoading || added}
          onClick={onAddClick}
        >
          {addLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
          {added ? "Added" : "Add to Campaign"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 px-2"
              disabled={draftLoading}
              aria-label="More actions"
            >
              {draftLoading ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">More</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onViewAnalysis}>
              <Target className="mr-2 size-4" />
              View analysis
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDraftEmail}>
              <Mail className="mr-2 size-4" />
              Draft email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGhostCaller}>
              <PhoneCall className="mr-2 size-4" />
              Send to Ghost Caller
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {added && (
        <p className="mt-2 text-center text-[11px] text-emerald-600 dark:text-emerald-400">Added to campaign</p>
      )}
    </div>
  );
}

// —— Page ————————————————————————————————————————————————————————————

export function LeadExplorerSection({ onOpenDealRoom, onNavigateTo }: LeadExplorerSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: "assistant",
      content:
        "Describe the leads you want — role, geography, industry. I’ll search your workspace and return ranked results you can add to a campaign or draft against.",
    },
  ]);
  const [composerValue, setComposerValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignOption[]>(FALLBACK_CAMPAIGNS);
  const [selectedCampaignId, setSelectedCampaignId] = useState(FALLBACK_CAMPAIGNS[0].id);
  const [memoryOn, setMemoryOn] = useState(true);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [addToCampaignLoadingByLeadId, setAddToCampaignLoadingByLeadId] = useState<Record<string, boolean>>({});
  const [draftLoadingByLeadId, setDraftLoadingByLeadId] = useState<Record<string, boolean>>({});
  const [addedLeadIds, setAddedLeadIds] = useState<Set<string>>(() => new Set());
  const [activeDraft, setActiveDraft] = useState<{
    subject: string;
    body: string;
    leadLabel: string;
  } | null>(null);
  const [analysisLead, setAnalysisLead] = useState<ExplorerLead | null>(null);
  const [campaignPicker, setCampaignPicker] = useState<{ lead: ExplorerLead } | null>(null);
  const [memoryOpen, setMemoryOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) ?? campaigns[0];

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiJson<{ campaigns: CampaignOption[] }>("/api/lead-explorer/campaigns");
        if (!cancelled && res.campaigns?.length) {
          setCampaigns(res.campaigns);
          setSelectedCampaignId((prev) =>
            res.campaigns!.some((c) => c.id === prev) ? prev : res.campaigns![0].id
          );
        }
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = async () => {
    const query = composerValue.trim();
    if (!query || isLoading) return;

    setMessages((m) => [...m, { id: uid(), role: "user", content: query }]);
    setComposerValue("");
    setIsLoading(true);

    try {
      const res = await apiJson<SearchResponse>("/api/lead-explorer/search", {
        method: "POST",
        body: JSON.stringify({ query }),
      });
      setThreadId(res.thread_id ?? null);
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          content: res.message || "Here are leads that match.",
          leads: Array.isArray(res.leads) ? res.leads : [],
          threadId: res.thread_id,
        },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Search failed";
      toast({ variant: "destructive", title: "Search failed", description: msg });
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          content: `I couldn’t complete that search: ${msg}. Check your connection and try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const runAddToCampaign = async (lead: ExplorerLead, campaignId: string) => {
    setAddToCampaignLoadingByLeadId((s) => ({ ...s, [lead.id]: true }));
    try {
      await apiJson(`/api/leads/${encodeURIComponent(lead.id)}/add-to-campaign`, {
        method: "POST",
        body: JSON.stringify({ campaign_id: campaignId }),
      });
      setAddedLeadIds((prev) => new Set(prev).add(lead.id));
      toast({
        title: "Added to campaign",
        description: `${lead.name || lead.company} → ${campaigns.find((c) => c.id === campaignId)?.name || campaignId}`,
      });
      setCampaignPicker(null);
      try {
        const res = await apiJson<{ campaigns: CampaignOption[] }>("/api/lead-explorer/campaigns");
        if (res.campaigns?.length) setCampaigns(res.campaigns);
      } catch {
        /* ignore */
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed";
      toast({ variant: "destructive", title: "Could not add lead", description: msg });
    } finally {
      setAddToCampaignLoadingByLeadId((s) => {
        const n = { ...s };
        delete n[lead.id];
        return n;
      });
    }
  };

  const handleDraftEmail = async (lead: ExplorerLead) => {
    setDraftLoadingByLeadId((s) => ({ ...s, [lead.id]: true }));
    try {
      const res = await apiJson<DraftEmailResponse>("/api/outreach/draft-email", {
        method: "POST",
        body: JSON.stringify({ lead_id: lead.id, campaign_id: selectedCampaignId }),
      });
      setActiveDraft({
        subject: res.subject || "Draft",
        body: res.body || "",
        leadLabel: lead.name || lead.company || lead.id,
      });
      toast({ title: "Draft ready", description: "Review below — nothing was sent." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Draft failed";
      toast({ variant: "destructive", title: "Draft failed", description: msg });
    } finally {
      setDraftLoadingByLeadId((s) => {
        const n = { ...s };
        delete n[lead.id];
        return n;
      });
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: uid(),
        role: "assistant",
        content:
          "Describe the leads you want — role, geography, industry. I’ll search your workspace and return ranked results you can add to a campaign or draft against.",
      },
    ]);
    setThreadId(null);
    setComposerValue("");
    setAddedLeadIds(new Set());
  };

  const workspaceHeightClass = "h-[min(100dvh-7rem,calc(100vh-7.5rem))]";

  return (
    <div className={cn("flex min-h-0 flex-col", workspaceHeightClass, "-mx-6")}>
      {/* 1. Top */}
      <header className="shrink-0 border-b border-border px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Lead Explorer</h2>
            <p className="text-sm text-muted-foreground">
              Ask in natural language — results stay in the thread; composer stays at the bottom.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 max-w-[220px] justify-between gap-2 font-normal">
                  <span className="truncate">{activeCampaign?.name ?? "Campaign"}</span>
                  <ChevronDown className="size-3.5 shrink-0 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Default campaign</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {campaigns.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => setSelectedCampaignId(c.id)}
                    className="flex justify-between gap-2"
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.lead_count}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={() => setMemoryOpen(true)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                memoryOn
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-border bg-secondary/60 text-muted-foreground"
              )}
            >
              <Brain className="size-3" />
              {memoryOn ? "Memory on" : "Paused"}
            </button>
            <Button variant="secondary" size="sm" className="h-9" onClick={handleNewChat}>
              New chat
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Thread (scroll) — pb leaves room for composer */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-40">
        <div className="mx-auto max-w-3xl space-y-6 py-6">
          {messages.length === 1 && (
            <div className="rounded-xl border border-dashed border-border/80 bg-secondary/20 px-4 py-5">
              <p className="text-sm font-medium text-foreground">Try one of these</p>
              <div className="mt-3 flex flex-col gap-2">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setComposerValue(p);
                    }}
                    className="rounded-lg border border-border/60 bg-background px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground disabled:opacity-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "user" ? (
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
                  {msg.content}
                </div>
              ) : (
                <div className="w-full max-w-[min(100%,42rem)] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Sparkles className="size-3.5 text-primary" />
                    ZarvioAI
                    {msg.threadId ? (
                      <span className="font-mono text-[10px] font-normal normal-case text-muted-foreground/70">
                        {msg.threadId.slice(0, 8)}…
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-4 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-4 shadow-sm">
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{msg.content}</p>
                    {msg.leads && msg.leads.length > 0 && (
                      <div className="border-t border-border/60 pt-4">
                        <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Results ({msg.leads.length})
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {msg.leads.map((lead) => (
                            <LeadExplorerLeadCard
                              key={lead.id}
                              lead={lead}
                              added={addedLeadIds.has(lead.id)}
                              addLoading={!!addToCampaignLoadingByLeadId[lead.id]}
                              draftLoading={!!draftLoadingByLeadId[lead.id]}
                              onAddClick={() => setCampaignPicker({ lead })}
                              onDraftEmail={() => void handleDraftEmail(lead)}
                              onViewAnalysis={() => setAnalysisLead(lead)}
                              onGhostCaller={() => onNavigateTo?.("ghost-closer")}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Searching leads…
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
        </div>
      </div>

      {/* 3. Composer — pinned to workspace bottom, never inside thread flow */}
      <div className="shrink-0 border-t border-border bg-background/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-secondary/15 p-2 shadow-sm sm:flex-row sm:items-end">
            <Textarea
              placeholder="e.g. Find fintech founders in Chennai who need outbound automation…"
              value={composerValue}
              onChange={(e) => setComposerValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSearch();
                }
              }}
              disabled={isLoading}
              className="min-h-[52px] max-h-32 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              rows={2}
            />
            <Button
              type="button"
              size="sm"
              className="h-10 shrink-0 gap-2 sm:self-end"
              disabled={!composerValue.trim() || isLoading}
              onClick={() => void handleSearch()}
            >
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Search
            </Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Memory {memoryOn ? "on" : "off"} for this thread ·{" "}
            <button type="button" className="underline underline-offset-2 hover:text-foreground" onClick={() => setMemoryOn((v) => !v)}>
              {memoryOn ? "Pause" : "Resume"}
            </button>
            {threadId ? ` · Session ${threadId.slice(0, 8)}…` : ""}
          </p>
        </div>
      </div>

      {/* Campaign picker */}
      <Dialog open={!!campaignPicker} onOpenChange={(o) => !o && setCampaignPicker(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to campaign</DialogTitle>
            <DialogDescription>
              {campaignPicker ? `${campaignPicker.lead.name || campaignPicker.lead.company}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            {campaigns.map((c) => (
              <Button
                key={c.id}
                variant={selectedCampaignId === c.id ? "secondary" : "outline"}
                className="justify-between"
                onClick={() => setSelectedCampaignId(c.id)}
              >
                <span className="truncate">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.lead_count} leads</span>
              </Button>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setCampaignPicker(null)}>
              Cancel
            </Button>
            <Button
              disabled={!campaignPicker || !!addToCampaignLoadingByLeadId[campaignPicker.lead.id]}
              onClick={() => campaignPicker && void runAddToCampaign(campaignPicker.lead, selectedCampaignId)}
            >
              {campaignPicker && addToCampaignLoadingByLeadId[campaignPicker.lead.id] ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email draft */}
      <Sheet open={!!activeDraft} onOpenChange={(o) => !o && setActiveDraft(null)}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Email draft</SheetTitle>
            <SheetDescription>{activeDraft?.leadLabel} — not sent</SheetDescription>
          </SheetHeader>
          {activeDraft && (
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Subject</p>
                <p className="mt-1 text-sm font-medium text-foreground">{activeDraft.subject}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">Body</p>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3 text-sm text-foreground">
                  {activeDraft.body}
                </pre>
              </div>
              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `Subject: ${activeDraft.subject}\n\n${activeDraft.body}`
                  );
                  toast({ title: "Copied to clipboard" });
                }}
              >
                <Copy className="size-4" />
                Copy draft
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* View analysis */}
      <Sheet open={!!analysisLead} onOpenChange={(o) => !o && setAnalysisLead(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{analysisLead?.name || "Lead"}</SheetTitle>
            <SheetDescription>
              {analysisLead?.role} · {analysisLead?.company}
            </SheetDescription>
          </SheetHeader>
          {analysisLead && (
            <div className="space-y-4 px-4 pb-6 text-sm">
              <div className="rounded-lg border border-border bg-secondary/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Outreach angle</p>
                <p className="mt-2 text-foreground/90">{analysisLead.outreach_angle || "—"}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4" />
                {displayOrDash(analysisLead.email)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4" />
                {displayOrDash(analysisLead.phone)}
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setAnalysisLead(null);
                  onOpenDealRoom?.(analysisLead.id);
                }}
              >
                Open Deal Room
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Memory */}
      <Sheet open={memoryOpen} onOpenChange={setMemoryOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Memory</SheetTitle>
            <SheetDescription>Session context for follow-up turns in this chat.</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-6 text-sm text-muted-foreground">
            <p>
              Default campaign: <span className="text-foreground">{activeCampaign?.name}</span>
            </p>
            {threadId && (
              <p className="font-mono text-xs">
                Thread: {threadId}
              </p>
            )}
            <Button variant="outline" className="w-full" onClick={() => setMemoryOn((v) => !v)}>
              {memoryOn ? "Pause memory" : "Resume memory"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
