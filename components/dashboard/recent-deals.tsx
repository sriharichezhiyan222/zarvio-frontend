"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock, CheckCircle2, XCircle } from "lucide-react";

interface RecentDealsProps {
  deals: any[];
  isLoading: boolean;
}

const statusConfig = {
  won: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    label: "Won",
  },
  pending: {
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Pending",
  },
  lost: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    label: "Lost",
  },
};

export function RecentDeals({ deals, isLoading }: RecentDealsProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 animate-pulse h-[400px]">
        <div className="h-6 w-32 bg-secondary rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-secondary rounded" />
                  <div className="h-3 w-32 bg-secondary rounded" />
                </div>
              </div>
              <div className="h-4 w-16 bg-secondary rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center text-center h-[400px] animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No deals yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
          Convert your first lead to start tracking deals
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recent Deals</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Latest activity</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 font-medium transition-colors group">
          View all
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div className="space-y-3">
        {deals.map((deal, index) => {
          // Map backend category to status
          const statusKey = deal.category === 'high' ? 'won' : 'pending';
          const status = statusConfig[statusKey as keyof typeof statusConfig];
          const StatusIcon = status.icon;
          const companyName = deal.leads?.company || "Unknown Company";
          const repName = deal.leads?.name || "AI Agent";

          return (
            <div
              key={deal.id || index}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${(index + 3) * 100}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-semibold text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-all duration-200">
                  {companyName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{companyName}</p>
                  <p className="text-xs text-muted-foreground">{repName} • Just now</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">Score: {deal.score}</span>
                <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", status.bg, status.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
