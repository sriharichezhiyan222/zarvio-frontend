"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  description?: string;
}

interface ThreadSummary {
  id: string;
  title: string;
  updated_at?: string;
}

interface ThreadMessageApi {
  id: string;
  role: string;
  content: string;
  payload?: { leads?: ExplorerLead[] } | null;
}

const THREAD_STORAGE_KEY = "zarvio_le_active_thread";

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
        {lead.why_this_lead?.length ? (
          <ul className="list-inside list-disc space-y-0.5 text-xs leading-relaxed text-muted-foreground">
            {lead.why_this_lead.map((line, i) => (
              <li key={i} className="marker:text-primary/50">
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">No extra signals beyond your search match.</p>
        )}
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
  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [memoryOn, setMemoryOn] = useState(true);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [memoryRecord, setMemoryRecord] = useState<{
    company_name: string;
    what_you_sell: string;
    target_icp: string;
    preferred_tone: string;
    target_geographies: string;
    cta: string;
    notes: string;
    configured?: boolean;
  } | null>(null);
  const [memorySaving, setMemorySaving] = useState(false);
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
  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) ?? null;

  const refreshCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    try {
      const list = await apiJson<CampaignOption[]>("/api/campaigns");
      const arr = Array.isArray(list) ? list : [];
      setCampaigns(arr);
      setSelectedCampaignId((prev) => {
        if (prev && arr.some((c) => c.id === prev)) return prev;
        return arr[0]?.id ?? null;
      });
    } catch {
      setCampaigns([]);
      setSelectedCampaignId(null);
    } finally {
      setCampaignsLoading(false);
    }
  }, []);

  const refreshThreads = useCallback(async () => {
    try {
      const list = await apiJson<ThreadSummary[]>("/api/lead-explorer/threads");
      setThreads(Array.isArray(list) ? list : []);
    } catch {
      setThreads([]);
    }
  }, []);

  const hydrateThread = useCallback(async (tid: string) => {
    try {
      const detail = await apiJson<{
        thread: ThreadSummary;
        messages: ThreadMessageApi[];
      }>(`/api/lead-explorer/threads/${encodeURIComponent(tid)}`);
      setThreadId(detail.thread.id);
      const restored: ChatMessage[] = [];
      for (const m of detail.messages || []) {
        if (m.role === "user") {
          restored.push({ id: m.id, role: "user", content: m.content });
        } else if (m.role === "assistant") {
          restored.push({
            id: m.id,
            role: "assistant",
            content: m.content,
            leads: m.payload?.leads,
            threadId: detail.thread.id,
          });
        }
      }
      if (restored.length) setMessages(restored);
      else {
        setMessages([
          {
            id: uid(),
            role: "assistant",
            content: "Continue this conversation or start a new search.",
          },
        ]);
      }
    } catch {
      toast({ variant: "destructive", title: "Could not load thread" });
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    void refreshCampaigns();
    void refreshThreads();
    try {
      const stored = sessionStorage.getItem(THREAD_STORAGE_KEY);
      if (stored) void hydrateThread(stored);
    } catch {
      /* ignore */
    }
    // Intentionally run once on mount for thread restore
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        body: JSON.stringify({
          query,
          thread_id: memoryOn ? threadId ?? undefined : undefined,
        }),
      });
      const tid = res.thread_id ?? null;
      setThreadId(tid);
      if (tid) {
        try {
          sessionStorage.setItem(THREAD_STORAGE_KEY, tid);
        } catch {
          /* ignore */
        }
      }
      void refreshThreads();
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
        body: JSON.stringify({
          campaign_id: campaignId,
          source_thread_id: threadId ?? undefined,
        }),
      });
      setAddedLeadIds((prev) => new Set(prev).add(lead.id));
      toast({
        title: "Added to campaign",
        description: `${lead.name || lead.company} → ${campaigns.find((c) => c.id === campaignId)?.name || campaignId}`,
      });
      setCampaignPicker(null);
      await refreshCampaigns();
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
    const cid = selectedCampaignId || campaigns[0]?.id;
    if (!cid) {
      toast({ variant: "destructive", title: "Create a campaign first", description: "Drafts need a campaign context." });
      return;
    }
    setDraftLoadingByLeadId((s) => ({ ...s, [lead.id]: true }));
    try {
      const res = await apiJson<DraftEmailResponse>("/api/outreach/draft-email", {
        method: "POST",
        body: JSON.stringify({
          lead_id: lead.id,
          campaign_id: cid,
        }),
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
    try {
      sessionStorage.removeItem(THREAD_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const handleCreateCampaign = async () => {
    const name = newCampaignName.trim();
    if (!name || creatingCampaign) return;
    setCreatingCampaign(true);
    try {
      const created = await apiJson<CampaignOption>("/api/campaigns", {
        method: "POST",
        body: JSON.stringify({ name, description: "" }),
      });
      setNewCampaignName("");
      await refreshCampaigns();
      if (created?.id) setSelectedCampaignId(created.id);
      toast({ title: "Campaign created" });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Could not create campaign",
        description: e instanceof Error ? e.message : "Error",
      });
    } finally {
      setCreatingCampaign(false);
    }
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
                <Button variant="outline" size="sm" className="h-9 max-w-[200px] justify-between gap-2 font-normal">
                  <span className="truncate">
                    {campaignsLoading ? "Loading…" : activeCampaign?.name ?? "No campaign"}
                  </span>
                  <ChevronDown className="size-3.5 shrink-0 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Default campaign</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!campaigns.length && !campaignsLoading ? (
                  <div className="px-2 py-3 text-xs text-muted-foreground">No campaigns yet — create one when adding a lead.</div>
                ) : (
                  campaigns.map((c) => (
                    <DropdownMenuItem
                      key={c.id}
                      onClick={() => setSelectedCampaignId(c.id)}
                      className="flex justify-between gap-2"
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.lead_count}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 font-normal">
                  Threads
                  <ChevronDown className="ml-1 size-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Recent conversations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!threads.length ? (
                  <div className="px-2 py-2 text-xs text-muted-foreground">No saved threads yet. Run a search to create one.</div>
                ) : (
                  threads.map((t) => (
                    <DropdownMenuItem
                      key={t.id}
                      onClick={() => {
                        void hydrateThread(t.id);
                        try {
                          sessionStorage.setItem(THREAD_STORAGE_KEY, t.id);
                        } catch {
                          /* ignore */
                        }
                      }}
                      className="flex flex-col items-start gap-0.5"
                    >
                      <span className="truncate text-sm">{t.title || "Untitled"}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{t.id.slice(0, 8)}…</span>
                    </DropdownMenuItem>
                  ))
                )}
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
          {!campaigns.length ? (
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">You don’t have any campaigns yet. Create one to add this lead.</p>
              <div className="space-y-2">
                <Label htmlFor="new-camp" className="text-xs">
                  Campaign name
                </Label>
                <Input
                  id="new-camp"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="e.g. Chennai outbound Q2"
                />
                <Button type="button" className="w-full" disabled={creatingCampaign} onClick={() => void handleCreateCampaign()}>
                  {creatingCampaign ? <Loader2 className="size-4 animate-spin" /> : null}
                  Create campaign
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid max-h-56 gap-2 overflow-y-auto py-2">
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
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setCampaignPicker(null)}>
              Cancel
            </Button>
            <Button
              disabled={
                !campaignPicker ||
                !campaigns.length ||
                !selectedCampaignId ||
                !!addToCampaignLoadingByLeadId[campaignPicker.lead.id]
              }
              onClick={() =>
                campaignPicker && selectedCampaignId && void runAddToCampaign(campaignPicker.lead, selectedCampaignId)
              }
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

      {/* Memory — persisted workspace profile */}
      <Sheet
        open={memoryOpen}
        onOpenChange={(o) => {
          setMemoryOpen(o);
          if (o) {
            void (async () => {
              try {
                const m = await apiJson<{
                  company_name?: string;
                  what_you_sell?: string;
                  target_icp?: string;
                  preferred_tone?: string;
                  target_geographies?: string;
                  cta?: string;
                  notes?: string;
                  configured?: boolean;
                }>("/api/memory");
                setMemoryRecord({
                  company_name: m.company_name || "",
                  what_you_sell: m.what_you_sell || "",
                  target_icp: m.target_icp || "",
                  preferred_tone: m.preferred_tone || "",
                  target_geographies: m.target_geographies || "",
                  cta: m.cta || "",
                  notes: m.notes || "",
                  configured: m.configured,
                });
              } catch {
                setMemoryRecord({
                  company_name: "",
                  what_you_sell: "",
                  target_icp: "",
                  preferred_tone: "",
                  target_geographies: "",
                  cta: "",
                  notes: "",
                  configured: false,
                });
              }
            })();
          }
        }}
      >
        <SheetContent side="right" className="w-full max-w-md sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Workspace memory</SheetTitle>
            <SheetDescription>
              Saved to your account. Used for drafts and deal context.{" "}
              {memoryRecord && !memoryRecord.configured ? (
                <span className="text-amber-600 dark:text-amber-400">Not fully configured yet.</span>
              ) : null}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-3 overflow-y-auto px-4 pb-6">
            {memoryRecord && (
              <div className="space-y-3 text-sm">
                {(["company_name", "what_you_sell", "target_icp", "preferred_tone", "target_geographies", "cta", "notes"] as const).map(
                  (field) => (
                    <div key={field}>
                      <Label className="text-xs capitalize text-muted-foreground">{field.replace(/_/g, " ")}</Label>
                      <Input
                        className="mt-1"
                        value={memoryRecord[field]}
                        onChange={(e) =>
                          setMemoryRecord((prev) =>
                            prev ? { ...prev, [field]: e.target.value } : prev
                          )
                        }
                      />
                    </div>
                  )
                )}
                <Button
                  className="w-full"
                  disabled={memorySaving}
                  onClick={async () => {
                    if (!memoryRecord) return;
                    setMemorySaving(true);
                    try {
                      const { configured: _c, ...rest } = memoryRecord;
                      await apiJson("/api/memory", {
                        method: "POST",
                        body: JSON.stringify(rest),
                      });
                      toast({ title: "Memory saved" });
                    } catch (e) {
                      toast({
                        variant: "destructive",
                        title: "Save failed",
                        description: e instanceof Error ? e.message : "Error",
                      });
                    } finally {
                      setMemorySaving(false);
                    }
                  }}
                >
                  {memorySaving ? <Loader2 className="size-4 animate-spin" /> : null}
                  Save memory
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Default campaign: <span className="text-foreground">{activeCampaign?.name ?? "—"}</span>
            </p>
            {threadId && <p className="font-mono text-[10px] text-muted-foreground">Thread: {threadId}</p>}
            <Button variant="outline" className="w-full" onClick={() => setMemoryOn((v) => !v)}>
              {memoryOn ? "Pause thread chaining" : "Resume thread chaining"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
