"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { apiJson, getAuthContext } from "@/lib/client-api";
import {
  Plus,
  Megaphone,
  Mail,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  DoorOpen,
  ChevronRight,
  Send,
  Loader2,
  Target,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import type { Section } from "@/lib/types";

interface Lead {
  id: string | number;
  first_name?: string;
  name?: string;
  company?: string;
  email?: string;
  score?: number;
  category?: string;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: "active" | "paused" | "completed" | "draft";
  lead_count: number;
  created_at?: string;
  updated_at?: string;
}

interface CampaignLeadRow {
  lead_id: string;
  lead?: Record<string, unknown> | null;
  added_at?: string;
}

interface CampaignSectionProps {
  onOpenDealRoom?: (leadId: string) => void;
  onNavigateTo?: (section: Section) => void;
}

const statusColors = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  draft: "bg-secondary text-muted-foreground border-border",
};

const statusIcons = {
  active: Play,
  paused: Pause,
  completed: CheckCircle2,
  draft: Clock,
};

export function CampaignSection({ onOpenDealRoom, onNavigateTo }: CampaignSectionProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
  const [campaignLeads, setCampaignLeads] = useState<CampaignLeadRow[]>([]);
  const [loadingCampaignLeads, setLoadingCampaignLeads] = useState(false);
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<{ leadId: string; subject: string; body: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "campaigns">("leads");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  const refreshCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    try {
      const data = await apiJson<Campaign[]>("/api/campaigns");
      setCampaigns(Array.isArray(data) ? data : []);
    } catch {
      setCampaigns([]);
    } finally {
      setCampaignsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCampaigns();
  }, [refreshCampaigns]);

  useEffect(() => {
    const load = async () => {
      setIsLoadingLeads(true);
      try {
        const [leadsData, prospectsData] = await Promise.all([
          apiJson<any[]>("/api/leads").catch(() => []),
          apiJson<any[]>("/prospects").catch(() => []),
        ]);

        const rawLeads = Array.isArray(leadsData) ? leadsData : [];
        const rawProspects = Array.isArray(prospectsData) ? prospectsData : [];

        const scoreMap: Record<string, any> = {};
        rawProspects.forEach((p: any) => {
          if (p.lead_id) scoreMap[String(p.lead_id)] = p;
        });

        const merged: Lead[] = rawLeads.map((l: any) => ({
          id: String(l.id),
          first_name: l.first_name || l.name || "Unknown",
          name: l.name || `${l.first_name || ""} ${l.last_name || ""}`.trim() || "Unknown",
          company: l.company || "—",
          email: l.email || "",
          score: scoreMap[String(l.id)]?.score ?? null,
          category: scoreMap[String(l.id)]?.category ?? null,
        }));

        setLeads(merged);
      } finally {
        setIsLoadingLeads(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!expandedCampaignId) {
      setCampaignLeads([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingCampaignLeads(true);
      try {
        const rows = await apiJson<CampaignLeadRow[]>(
          `/api/campaigns/${encodeURIComponent(expandedCampaignId)}/leads`
        );
        if (!cancelled) setCampaignLeads(Array.isArray(rows) ? rows : []);
      } catch {
        if (!cancelled) setCampaignLeads([]);
      } finally {
        if (!cancelled) setLoadingCampaignLeads(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [expandedCampaignId]);

  const handleGenerateOutreach = async (lead: Lead) => {
    const leadId = String(lead.id);
    setGeneratingFor(leadId);
    setGeneratedEmail(null);
    try {
      // Call backend copilot with a prompt for outreach
      const { userId } = getAuthContext();
      const res = await apiJson<any>("/api/copilot", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Write a short, personalized cold outreach email for ${lead.first_name || lead.name} at ${lead.company}. Include subject line and body. Keep it under 100 words.`,
            },
          ],
          user_id: userId || "anonymous",
        }),
      });

      const text = typeof res === "string" ? res : res?.response || res?.content || JSON.stringify(res);
      const lines = text.split("\n");
      const subjectLine = lines.find((l: string) => l.toLowerCase().startsWith("subject:")) || `Re: ${lead.company} - Let's connect`;
      const body = lines.filter((l: string) => !l.toLowerCase().startsWith("subject:")).join("\n").trim();

      setGeneratedEmail({
        leadId,
        subject: subjectLine.replace(/^subject:\s*/i, ""),
        body,
      });
    } catch (err) {
      setGeneratedEmail({
        leadId,
        subject: `Quick question for ${lead.first_name || lead.name}`,
        body: `Hi ${lead.first_name || lead.name},\n\nI noticed ${lead.company} and thought ZarvioAI could help you scale your campaign significantly.\n\nWould you have 15 minutes to chat this week?\n\nBest,\nThe Zarvio Team`,
      });
    } finally {
      setGeneratingFor(null);
    }
  };

  const toggleLeadSelect = (id: string) => {
    setSelectedLeads(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedLeadObjects = leads.filter(l => selectedLeads.has(String(l.id)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            AI-powered outreach campaigns connected to your lead campaign
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedLeads.size > 0 && (
            <Button
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => {
                if (selectedLeads.size > 0 && onOpenDealRoom) {
                  const firstId = Array.from(selectedLeads)[0];
                  onOpenDealRoom(firstId);
                }
              }}
            >
              <DoorOpen className="w-4 h-4 mr-2" />
              Open {selectedLeads.size} in Deal Room
            </Button>
          )}
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setNewCampaignOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: leads.length, icon: Users, color: "text-primary" },
          { label: "High Intent", value: leads.filter(l => l.category === "high" || (l.score !== null && (l.score as number) >= 70)).length, icon: Target, color: "text-emerald-400" },
          { label: "Campaigns", value: campaigns.length, icon: Megaphone, color: "text-blue-400" },
          {
            label: "Leads in campaigns",
            value: campaigns.reduce((s, c) => s + (c.lead_count || 0), 0),
            icon: TrendingUp,
            color: "text-amber-400",
          },
        ].map(stat => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {isLoadingLeads ? <span className="animate-pulse">--</span> : stat.value}
                  </p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-secondary", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
        {(["leads", "campaigns"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all capitalize",
              activeTab === tab
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "leads" ? `All leads (${leads.length})` : `Campaigns (${campaignsLoading ? "…" : campaigns.length})`}
          </button>
        ))}
      </div>

      {/* Leads Tab */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          {/* Selected leads action bar */}
          {selectedLeads.size > 0 && (
            <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-top-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{selectedLeads.size} lead{selectedLeads.size > 1 ? "s" : ""} selected</span>
              <div className="flex-1" />
              <Button
                size="sm"
                variant="outline"
                className="border-primary/30 text-primary"
                onClick={() => handleGenerateOutreach(selectedLeadObjects[0])}
                disabled={generatingFor !== null}
              >
                {generatingFor ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                AI Compose Outreach
              </Button>
              {onOpenDealRoom && (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground"
                  onClick={() => {
                    const firstId = Array.from(selectedLeads)[0];
                    onOpenDealRoom(firstId);
                  }}
                >
                  <DoorOpen className="w-3 h-3 mr-1" />
                  Open in Deal Room
                </Button>
              )}
              <button
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedLeads(new Set())}
              >
                Clear
              </button>
            </div>
          )}

          {/* Generated email preview */}
          {generatedEmail && (
            <Card className="bg-gradient-to-br from-primary/10 to-chart-2/10 border-primary/20 animate-in fade-in slide-in-from-bottom-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    AI-Generated Outreach
                  </CardTitle>
                  <button
                    onClick={() => setGeneratedEmail(null)}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-card rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Subject</p>
                  <p className="text-sm font-medium">{generatedEmail.subject}</p>
                </div>
                <div className="p-3 bg-card rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Body</p>
                  <p className="text-sm whitespace-pre-wrap">{generatedEmail.body}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-primary text-primary-foreground flex-1">
                    <Send className="w-3 h-3 mr-1" />
                    Send Email
                  </Button>
                  {onOpenDealRoom && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/30 text-primary"
                      onClick={() => onOpenDealRoom(generatedEmail.leadId)}
                    >
                      <DoorOpen className="w-3 h-3 mr-1" />
                      Deal Room
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leads table */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Lead Campaign</CardTitle>
                <span className="text-xs text-muted-foreground">Select leads to compose outreach or open in Deal Room</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {isLoadingLeads &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                      <div className="w-4 h-4 bg-secondary rounded" />
                      <div className="w-10 h-10 rounded-lg bg-secondary" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-secondary rounded w-1/3" />
                        <div className="h-3 bg-secondary rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                {!isLoadingLeads && leads.length === 0 && (
                  <div className="p-10 text-center">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No leads found. Add your first lead to get started.</p>
                  </div>
                )}
                {leads.map((lead, i) => {
                  const id = String(lead.id);
                  const isSelected = selectedLeads.has(id);
                  const isGenerating = generatingFor === id;
                  const score = lead.score ?? null;
                  const scoreColor =
                    score === null ? "text-muted-foreground" :
                    score >= 70 ? "text-emerald-400" :
                    score >= 40 ? "text-amber-400" : "text-red-400";

                  return (
                    <div
                      key={id}
                      className={cn(
                        "flex items-center gap-4 p-4 transition-all duration-150 animate-in fade-in slide-in-from-bottom-2",
                        isSelected ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-secondary/30"
                      )}
                      style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleLeadSelect(id)}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center text-sm font-semibold text-primary">
                        {(lead.first_name || lead.name || "?")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {lead.first_name || lead.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
                      </div>
                      {score !== null && score !== undefined ? (
                        <div className="flex items-center gap-1">
                          <BarChart3 className={cn("w-4 h-4", scoreColor)} />
                          <span className={cn("text-sm font-semibold", scoreColor)}>{score}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unscored</span>
                      )}
                      {lead.category && (
                        <Badge className={cn(
                          "text-xs border",
                          lead.category === "high" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          lead.category === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                          {lead.category}
                        </Badge>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => handleGenerateOutreach(lead)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI Outreach
                            </>
                          )}
                        </Button>
                        {onOpenDealRoom && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
                            onClick={() => onOpenDealRoom(id)}
                          >
                            <DoorOpen className="w-3 h-3 mr-1" />
                            Deal Room
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div className="space-y-4">
          {campaignsLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading campaigns…
            </div>
          )}
          {!campaignsLoading && campaigns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Megaphone className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Create a campaign from here or add leads to one from Lead Explorer. Nothing is shown until you create real campaigns.
              </p>
              <Button className="bg-primary text-primary-foreground" onClick={() => setNewCampaignOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          )}
          {!campaignsLoading &&
            campaigns.map((campaign, i) => {
              const StatusIcon = statusIcons[campaign.status] || Play;
              const expanded = expandedCampaignId === campaign.id;

              return (
                <Card
                  key={campaign.id}
                  className="bg-card border-border hover:border-primary/30 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center">
                          <Megaphone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                          {campaign.description ? (
                            <p className="text-xs text-muted-foreground mt-0.5">{campaign.description}</p>
                          ) : null}
                        </div>
                      </div>
                      <Badge className={cn("border", statusColors[campaign.status] || statusColors.active)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-muted-foreground">Leads attached</span>
                        </div>
                        <p className="text-xl font-bold text-foreground">{campaign.lead_count ?? 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border text-sm h-8"
                        onClick={() => setExpandedCampaignId(expanded ? null : campaign.id)}
                      >
                        {expanded ? "Hide leads" : "View leads"}
                        <ChevronRight className={cn("w-3 h-3 ml-1 transition-transform", expanded && "rotate-90")} />
                      </Button>
                      <div className="flex-1" />
                    </div>

                    {expanded && (
                      <div className="mt-4 rounded-lg border border-border bg-secondary/20 p-4">
                        {loadingCampaignLeads ? (
                          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        ) : campaignLeads.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No leads in this campaign yet.</p>
                        ) : (
                          <ul className="space-y-2">
                            {campaignLeads.map((row) => {
                              const L = row.lead as Record<string, string> | null | undefined;
                              const name =
                                L?.name ||
                                `${L?.first_name || ""} ${L?.last_name || ""}`.trim() ||
                                row.lead_id;
                              const company = L?.company || "—";
                              return (
                                <li
                                  key={row.lead_id}
                                  className="flex items-center justify-between gap-2 text-sm border-b border-border/50 pb-2 last:border-0"
                                >
                                  <div>
                                    <p className="font-medium text-foreground">{name}</p>
                                    <p className="text-xs text-muted-foreground">{company}</p>
                                  </div>
                                  {onOpenDealRoom && (
                                    <Button size="sm" variant="ghost" className="h-8 shrink-0" onClick={() => onOpenDealRoom(row.lead_id)}>
                                      <DoorOpen className="w-3 h-3 mr-1" />
                                      Deal Room
                                    </Button>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      <Dialog open={newCampaignOpen} onOpenChange={setNewCampaignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New campaign</DialogTitle>
            <DialogDescription>Creates a real campaign you can attach leads to from Lead Explorer.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="camp-name">Name</Label>
            <Input
              id="camp-name"
              value={newCampaignName}
              onChange={(e) => setNewCampaignName(e.target.value)}
              placeholder="Campaign name"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewCampaignOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={creatingCampaign || !newCampaignName.trim()}
              onClick={async () => {
                setCreatingCampaign(true);
                try {
                  await apiJson("/api/campaigns", {
                    method: "POST",
                    body: JSON.stringify({ name: newCampaignName.trim(), description: "" }),
                  });
                  setNewCampaignName("");
                  setNewCampaignOpen(false);
                  await refreshCampaigns();
                  toast({ title: "Campaign created" });
                } catch (e) {
                  toast({
                    variant: "destructive",
                    title: "Failed",
                    description: e instanceof Error ? e.message : "Error",
                  });
                } finally {
                  setCreatingCampaign(false);
                }
              }}
            >
              {creatingCampaign ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
