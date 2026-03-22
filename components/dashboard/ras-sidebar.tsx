"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { RASData, SwarmAgent, AgentVote } from "@/lib/types";
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  Zap,
  ArrowUpRight,
  Briefcase,
  Shield,
  Award,
  ChevronRight,
  ChevronLeft,
  Bot,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Agent icon mapping
const agentIcons: Record<SwarmAgent["iconType"], typeof DollarSign> = {
  pricing: DollarSign,
  risk: AlertTriangle,
  upsell: TrendingUp,
  timing: Clock,
  competition: Target,
  capacity: Zap,
  momentum: ArrowUpRight,
  budget: Briefcase,
  authority: Shield,
  fit: Award,
};

// Default RAS data for when no active deal is selected
const defaultRASData: RASData = {
  id: "default",
  leadId: "",
  dealId: "",
  approveCount: 4,
  holdCount: 1,
  rejectCount: 0,
  decision: "close_now",
  recommendedAction: "SEND $25K PROPOSAL",
  agents: [
    {
      id: "pricing",
      name: "Pricing Agent",
      shortName: "P",
      iconType: "pricing",
      vote: "approve",
      confidence: 94,
      reason: "$25K",
      detail: "Price point optimal for company size",
    },
    {
      id: "risk",
      name: "Risk Agent",
      shortName: "R",
      iconType: "risk",
      vote: "approve",
      confidence: 88,
      reason: "low risk",
      detail: "Low churn probability (8%)",
    },
    {
      id: "upsell",
      name: "Upsell Agent",
      shortName: "U",
      iconType: "upsell",
      vote: "approve",
      confidence: 91,
      reason: "+$5K",
      detail: "Enterprise upgrade likely in Q3",
    },
    {
      id: "competition",
      name: "Competition Agent",
      shortName: "C",
      iconType: "competition",
      vote: "hold",
      confidence: 67,
      reason: "watch budget",
      detail: "Competitor demo scheduled",
    },
    {
      id: "momentum",
      name: "Momentum Agent",
      shortName: "M",
      iconType: "momentum",
      vote: "approve",
      confidence: 95,
      reason: "email now",
      detail: "4 touchpoints this week",
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const voteColors: Record<AgentVote, string> = {
  approve: "text-emerald-400",
  hold: "text-amber-400",
  reject: "text-red-400",
};

const voteBgColors: Record<AgentVote, string> = {
  approve: "bg-emerald-500/10 border-emerald-500/30",
  hold: "bg-amber-500/10 border-amber-500/30",
  reject: "bg-red-500/10 border-red-500/30",
};

interface RASSidebarProps {
  rasData?: RASData | null;
  isLoading?: boolean;
  onExecute?: (action: string) => void;
  className?: string;
}

export function RASSidebar({
  rasData,
  isLoading = false,
  onExecute,
  className,
}: RASSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Use provided data or default
  const data = rasData || defaultRASData;

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const approveCount = data.approveCount;
  const totalAgents = data.agents.length;

  // Determine status color based on approve count
  const getStatusColor = () => {
    if (approveCount >= 4) return "text-emerald-400";
    if (approveCount >= 3) return "text-amber-400";
    return "text-red-400";
  };

  const getStatusBgColor = () => {
    if (approveCount >= 4) return "bg-emerald-500/20 border-emerald-500/30";
    if (approveCount >= 3) return "bg-amber-500/20 border-amber-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  if (collapsed) {
    return (
      <aside
        className={cn(
          "fixed right-0 top-0 z-30 h-screen w-12 bg-gradient-to-b from-primary/20 via-background to-chart-2/20 border-l border-border flex flex-col items-center py-4 transition-all duration-300",
          className
        )}
      >
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors mb-4"
          aria-label="Expand RAS sidebar"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <Badge
            className={cn(
              "text-xs px-1.5 py-0.5 border",
              getStatusBgColor(),
              getStatusColor()
            )}
          >
            {approveCount}/{totalAgents}
          </Badge>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-2 my-4">
          {data.agents.slice(0, 5).map((agent) => {
            const Icon = agentIcons[agent.iconType];
            return (
              <div
                key={agent.id}
                className={cn(
                  "w-8 h-8 rounded-lg border flex items-center justify-center transition-all",
                  voteBgColors[agent.vote]
                )}
                title={`${agent.name}: ${agent.vote.toUpperCase()} ${agent.confidence}%`}
              >
                <Icon className={cn("w-4 h-4", voteColors[agent.vote])} />
              </div>
            );
          })}
        </div>

        <Button
          size="sm"
          className="w-8 h-8 p-0 bg-gradient-to-r from-emerald-500 to-primary"
          onClick={() => onExecute?.(data.recommendedAction)}
          title="Execute recommendation"
        >
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </Button>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 z-30 h-screen w-[300px] bg-gradient-to-b from-primary/10 via-background to-chart-2/10 border-l border-border flex flex-col transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">RAS</span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Collapse RAS sidebar"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Status Badge */}
        <div
          className={cn(
            "flex items-center justify-center gap-2 p-2 rounded-lg border",
            getStatusBgColor()
          )}
        >
          <span className={cn("text-lg font-bold", getStatusColor())}>
            {approveCount}/{totalAgents} APPROVE
          </span>
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-secondary/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          data.agents.map((agent) => {
            const Icon = agentIcons[agent.iconType];
            return (
              <div
                key={agent.id}
                className={cn(
                  "p-3 rounded-lg border transition-all hover:scale-[1.02]",
                  voteBgColors[agent.vote]
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shrink-0">
                    <Icon className={cn("w-4 h-4", voteColors[agent.vote])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate">
                        {agent.shortName}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-semibold uppercase",
                          voteColors[agent.vote]
                        )}
                      >
                        {agent.vote} {agent.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      ({agent.reason})
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Recommended Action */}
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">
              {data.recommendedAction}
            </span>
          </div>
        </div>

        {/* Execute Button */}
        <Button
          className="w-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90 transition-opacity"
          onClick={() => onExecute?.(data.recommendedAction)}
          disabled={isLoading}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          EXECUTE
        </Button>
      </div>
    </aside>
  );
}
