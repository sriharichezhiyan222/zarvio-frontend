"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Building2,
  ChevronDown,
  Filter,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/types";

// —— Types ——————————————————————————————————————————————————————————

export interface ExplorerLead {
  id: string;
  company: string;
  industry: string;
  location: string;
  fit_score: number;
  reason: string;
}

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "lead_grid"; leads: ExplorerLead[] }
  | {
      type: "campaign_summary";
      name: string;
      leads: number;
      status: string;
      note: string;
    }
  | { type: "outreach_draft"; company: string; industry: string; body: string }
  | {
      type: "insights";
      campaigns: number;
      leads: number;
      messages_generated: number;
      headline: string;
    };

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  createdAt: number;
  blocks?: ContentBlock[];
  text?: string;
}

type DrawerPanel =
  | { kind: "memory" }
  | { kind: "campaign"; campaignId: string }
  | { kind: "lead"; lead: ExplorerLead }
  | { kind: "filters" };

interface CampaignOption {
  id: string;
  name: string;
  leadCount: number;
}

interface LeadExplorerSectionProps {
  onOpenDealRoom?: (leadId: string) => void;
  onNavigateTo?: (section: Section) => void;
}

// —— Mock / helpers —————————————————————————————————————————————————

const MOCK_CAMPAIGNS: CampaignOption[] = [
  { id: "cmp-1", name: "Q2 Enterprise", leadCount: 14 },
  { id: "cmp-2", name: "SMB Sprint", leadCount: 9 },
  { id: "cmp-3", name: "Revival — Dormant", leadCount: 6 },
];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function mockLeadsFromPrompt(prompt: string): ExplorerLead[] {
  const seed = prompt.slice(0, 48) || "expansion";
  return [
    {
      id: `lead-${uid()}-a`,
      company: "Nimbus Analytics",
      industry: "SaaS",
      location: "Berlin",
      fit_score: 0.88,
      reason: `Strong signal for "${seed}" — growing product team and recent hiring in GTM roles.`,
    },
    {
      id: `lead-${uid()}-b`,
      company: "Helio Manufacturing",
      industry: "Industrial",
      location: "Munich",
      fit_score: 0.76,
      reason: "Mid-market manufacturer modernizing ops; fits your implementation playbook.",
    },
    {
      id: `lead-${uid()}-c`,
      company: "Lattice Commerce",
      industry: "E‑commerce",
      location: "Amsterdam",
      fit_score: 0.71,
      reason: "Scaling storefront infra — likely evaluating automation and outbound tooling.",
    },
  ];
}

function interpretPrompt(prompt: string): ContentBlock[] {
  const p = prompt.toLowerCase();
  const blocks: ContentBlock[] = [];

  if (p.includes("performance") || p.includes("analytics") || p.includes("insight")) {
    blocks.push({
      type: "text",
      text: "Here is a quick read on pipeline health based on your workspace activity.",
    });
    blocks.push({
      type: "insights",
      campaigns: 3,
      leads: 25,
      messages_generated: 18,
      headline: "Strong reply velocity on enterprise sequences; consider doubling down on Berlin SaaS.",
    });
    return blocks;
  }

  if (p.includes("campaign") || p.includes("summary")) {
    blocks.push({
      type: "text",
      text: "Snapshot of the campaign you have selected in the context bar.",
    });
    blocks.push({
      type: "campaign_summary",
      name: "Q2 Enterprise",
      leads: 14,
      status: "Active · 2 sequences running",
      note: "Highest engagement from VP-level titles in DACH. Warm leads trending +12% week over week.",
    });
    return blocks;
  }

  if (p.includes("outreach") || p.includes("email") || p.includes("draft")) {
    blocks.push({
      type: "text",
      text: "Draft aligned to your tone — personalize the opener with a specific trigger from news or hiring.",
    });
    blocks.push({
      type: "outreach_draft",
      company: "Nimbus Analytics",
      industry: "SaaS",
      body:
        "Hi {{company}} — I noticed you're scaling the data product team in {{industry}}. We've helped similar teams cut prospect research time by ~40% while lifting meeting book-rates. Open to a 15-min fit check next week?",
    });
    return blocks;
  }

  blocks.push({
    type: "text",
    text: "I surfaced a shortlist that matches your intent. You can add the best fits to your active campaign from each card.",
  });
  blocks.push({ type: "lead_grid", leads: mockLeadsFromPrompt(prompt) });
  return blocks;
}

function welcomeBlocks(): ContentBlock[] {
  return [
    {
      type: "text",
      text: "Ask in plain language — find accounts, draft outreach, summarize a campaign, or check performance. Your context bar shows the active campaign and memory state.",
    },
  ];
}

// —— Subcomponents ——————————————————————————————————————————————————

function LeadExplorerCard({
  lead,
  onAddToCampaign,
  onDraftEmail,
  onViewAnalysis,
  onGhostCaller,
}: {
  lead: ExplorerLead;
  onAddToCampaign: () => void;
  onDraftEmail: () => void;
  onViewAnalysis: () => void;
  onGhostCaller: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">{lead.company}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Building2 className="size-3 shrink-0" />
              {lead.industry}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3 shrink-0" />
              {lead.location}
            </span>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="shrink-0 border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          {Math.round(lead.fit_score * 100)}% fit
        </Badge>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lead.reason}</p>
      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" className="flex-1 gap-1.5" onClick={onAddToCampaign}>
          <Plus className="size-3.5" />
          Add to Campaign
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="shrink-0 px-2" aria-label="More actions">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              More actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDraftEmail}>
              <Mail className="mr-2 size-4" />
              Draft email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onViewAnalysis}>
              <Target className="mr-2 size-4" />
              View analysis
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGhostCaller}>
              <PhoneCall className="mr-2 size-4" />
              Send to Ghost Caller
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function BlockRenderer({
  block,
  onOpenLead,
  onAddLeadToCampaign,
  onOpenOutreach,
  onGhostCaller,
}: {
  block: ContentBlock;
  onOpenLead: (lead: ExplorerLead) => void;
  onAddLeadToCampaign: (lead: ExplorerLead) => void;
  onOpenOutreach: () => void;
  onGhostCaller: (lead: ExplorerLead) => void;
}) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{block.text}</p>
      );
    case "lead_grid":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {block.leads.map((lead) => (
            <LeadExplorerCard
              key={lead.id}
              lead={lead}
              onAddToCampaign={() => onAddLeadToCampaign(lead)}
              onDraftEmail={() => onOpenOutreach()}
              onViewAnalysis={() => onOpenLead(lead)}
              onGhostCaller={() => onGhostCaller(lead)}
            />
          ))}
        </div>
      );
    case "campaign_summary":
      return (
        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-foreground">{block.name}</p>
            <Badge variant="outline">{block.leads} leads</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{block.status}</p>
          <p className="mt-3 text-sm text-foreground/90">{block.note}</p>
        </div>
      );
    case "outreach_draft":
      return (
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Outreach draft
          </p>
          <p className="mt-2 text-sm text-foreground/90">{block.body}</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => onOpenOutreach()}
          >
            Open in Outreach
          </Button>
        </div>
      );
    case "insights":
      return (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BarChart3 className="size-4 text-primary" />
            Performance insights
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{block.headline}</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-secondary/50 py-3">
              <p className="text-lg font-semibold tabular-nums text-foreground">{block.campaigns}</p>
              <p className="text-[11px] text-muted-foreground">Campaigns</p>
            </div>
            <div className="rounded-lg bg-secondary/50 py-3">
              <p className="text-lg font-semibold tabular-nums text-foreground">{block.leads}</p>
              <p className="text-[11px] text-muted-foreground">Leads</p>
            </div>
            <div className="rounded-lg bg-secondary/50 py-3">
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {block.messages_generated}
              </p>
              <p className="text-[11px] text-muted-foreground">Messages</p>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

// —— Page ————————————————————————————————————————————————————————————

export function LeadExplorerSection({ onOpenDealRoom, onNavigateTo }: LeadExplorerSectionProps) {
  const [campaigns] = useState<CampaignOption[]>(MOCK_CAMPAIGNS);
  const [activeCampaignId, setActiveCampaignId] = useState(MOCK_CAMPAIGNS[0].id);
  const [memoryOn, setMemoryOn] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: "assistant",
      createdAt: Date.now(),
      blocks: welcomeBlocks(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [drawer, setDrawer] = useState<DrawerPanel | null>(null);
  const [filters, setFilters] = useState({ industry: "any", region: "any", minFit: 70 });
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) ?? campaigns[0];

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  const openDrawer = (panel: DrawerPanel) => setDrawer(panel);

  const handleNewChat = () => {
    setMessages([
      {
        id: uid(),
        role: "assistant",
        createdAt: Date.now(),
        blocks: welcomeBlocks(),
      },
    ]);
    setInput("");
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      createdAt: Date.now(),
      text: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsThinking(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const blocks = interpretPrompt(trimmed);
    setMessages((m) => [
      ...m,
      {
        id: uid(),
        role: "assistant",
        createdAt: Date.now(),
        blocks,
      },
    ]);
    setIsThinking(false);
  };

  const onAddLeadToCampaign = (lead: ExplorerLead) => {
    /* wire to POST /campaign/add-lead when auth is ready */
    void lead;
  };

  return (
    <div className="flex flex-col -mx-6 -mt-2 min-h-[calc(100dvh-7rem)] max-h-[calc(100dvh-7rem)]">
      {/* Slim context bar */}
      <div className="shrink-0 border-b border-border bg-background/95 px-6 py-3 backdrop-blur-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Lead Explorer</h2>
              <p className="text-xs text-muted-foreground">Conversational workspace</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 max-w-[220px] justify-between gap-2 border-border bg-secondary/40 font-normal"
                >
                  <span className="truncate">{activeCampaign.name}</span>
                  <ChevronDown className="size-3.5 shrink-0 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Active campaign
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {campaigns.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => setActiveCampaignId(c.id)}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.leadCount}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openDrawer({ kind: "campaign", campaignId: activeCampaignId })}>
                  Campaign details…
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={() => openDrawer({ kind: "memory" })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                memoryOn
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-border bg-secondary/60 text-muted-foreground"
              )}
            >
              <Brain className="size-3" />
              {memoryOn ? "Memory on" : "Memory paused"}
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground"
              onClick={() => openDrawer({ kind: "filters" })}
            >
              <Filter className="mr-1.5 size-3.5" />
              Filters
            </Button>
            <Button variant="secondary" size="sm" className="h-8" onClick={handleNewChat}>
              New chat
            </Button>
          </div>
        </div>
      </div>

      {/* Thread */}
      <ScrollArea className="min-h-0 flex-1 px-6">
        <div className="mx-auto max-w-3xl space-y-6 py-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "user" ? (
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
                  {msg.text}
                </div>
              ) : (
                <div className="w-full max-w-[min(100%,42rem)] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Sparkles className="size-3.5 text-primary" />
                    ZarvioAI
                  </div>
                  <div className="space-y-4 rounded-2xl rounded-bl-md border border-border/80 bg-card/80 px-4 py-4 shadow-sm">
                    {msg.blocks?.map((block, i) => (
                      <BlockRenderer
                        key={i}
                        block={block}
                        onOpenLead={(lead) => openDrawer({ kind: "lead", lead })}
                        onAddLeadToCampaign={onAddLeadToCampaign}
                        onOpenOutreach={() => onNavigateTo?.("outreach")}
                        onGhostCaller={() => onNavigateTo?.("ghost-closer")}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Sticky composer */}
      <div className="shrink-0 border-t border-border bg-background/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-secondary/20 p-2 shadow-sm sm:flex-row sm:items-end">
            <Textarea
              placeholder="Describe who you want to find, ask for a draft, or request a campaign summary…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              className="min-h-[52px] max-h-32 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              rows={2}
            />
            <Button
              type="button"
              size="sm"
              className="h-10 shrink-0 gap-2 sm:self-end"
              disabled={!input.trim() || isThinking}
              onClick={() => void handleSend()}
            >
              {isThinking ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Send
            </Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Memory {memoryOn ? "remembers" : "does not retain"} this thread for follow-ups.{" "}
            <button
              type="button"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => setMemoryOn((v) => !v)}
            >
              {memoryOn ? "Pause" : "Resume"}
            </button>
          </p>
        </div>
      </div>

      {/* Right drawer — single sheet, panel by kind */}
      <Sheet open={drawer !== null} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          {drawer?.kind === "memory" && (
            <>
              <SheetHeader>
                <SheetTitle>Memory</SheetTitle>
                <SheetDescription>
                  Thread context used to keep answers consistent with your workspace.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-4 px-4 pb-6">
                <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Current session</p>
                  <p className="mt-2">
                    Active campaign: <span className="text-foreground">{activeCampaign.name}</span>
                  </p>
                  <p className="mt-1">
                    Filters: industry {filters.industry}, region {filters.region}, min fit {filters.minFit}%
                  </p>
                </div>
                <Button variant="outline" onClick={() => setMemoryOn((v) => !v)}>
                  {memoryOn ? "Pause memory for this chat" : "Resume memory"}
                </Button>
              </div>
            </>
          )}
          {drawer?.kind === "campaign" && (
            <>
              <SheetHeader>
                <SheetTitle>Campaign details</SheetTitle>
                <SheetDescription>{activeCampaign.name}</SheetDescription>
              </SheetHeader>
              <div className="space-y-3 px-4 pb-6 text-sm">
                <p className="text-muted-foreground">
                  {activeCampaign.leadCount} leads in this campaign. Sequences and touchpoints stay in the
                  Campaign area for full editing.
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setDrawer(null);
                    onNavigateTo?.("campaign");
                  }}
                >
                  Open Campaign
                </Button>
              </div>
            </>
          )}
          {drawer?.kind === "lead" && drawer.lead && (
            <>
              <SheetHeader>
                <SheetTitle>{drawer.lead.company}</SheetTitle>
                <SheetDescription>
                  {drawer.lead.industry} · {drawer.lead.location}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="rounded-lg border border-border bg-secondary/20 p-3 text-sm">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Fit</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">
                    {Math.round(drawer.lead.fit_score * 100)}%
                  </p>
                  <p className="mt-3 text-muted-foreground">{drawer.lead.reason}</p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    onAddLeadToCampaign(drawer.lead);
                    setDrawer(null);
                  }}
                >
                  <Plus className="mr-2 size-4" />
                  Add to {activeCampaign.name}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setDrawer(null);
                    onOpenDealRoom?.(drawer.lead.id);
                  }}
                >
                  Open Deal Room
                </Button>
              </div>
            </>
          )}
          {drawer?.kind === "filters" && (
            <>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Applied to the next discovery turn in this chat.</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Industry</label>
                  <select
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                    value={filters.industry}
                    onChange={(e) => setFilters((f) => ({ ...f, industry: e.target.value }))}
                  >
                    <option value="any">Any</option>
                    <option value="saas">SaaS</option>
                    <option value="industrial">Industrial</option>
                    <option value="ecommerce">E‑commerce</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Region</label>
                  <select
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                    value={filters.region}
                    onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
                  >
                    <option value="any">Any</option>
                    <option value="dach">DACH</option>
                    <option value="benelux">Benelux</option>
                    <option value="nordics">Nordics</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Minimum fit %</label>
                  <input
                    type="range"
                    min={50}
                    max={95}
                    value={filters.minFit}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, minFit: Number.parseInt(e.target.value, 10) }))
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">{filters.minFit}%</p>
                </div>
                <Button className="w-full" onClick={() => setDrawer(null)}>
                  Done
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
