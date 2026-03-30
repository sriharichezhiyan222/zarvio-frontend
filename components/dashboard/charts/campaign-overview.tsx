"use client";

import { useState, useEffect } from "react";

import { OverviewStats } from "@/lib/types";
import { Target } from "lucide-react";

interface CampaignOverviewProps {
  data: OverviewStats | null;
}

export function CampaignOverview({ data: stats }: CampaignOverviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalLeads = stats ? parseInt(stats.new_leads.value) : 0;
  const totalDeals = stats ? parseInt(stats.active_deals.value) : 0;
  
  const stages = [
    { 
      name: "Leads", 
      value: totalLeads > 0 ? 100 : 0, 
      count: totalLeads, 
      color: "bg-chart-1" 
    },
    { 
      name: "Active Deals", 
      value: totalLeads > 0 ? Math.round((totalDeals / totalLeads) * 100) : 0, 
      count: totalDeals, 
      color: "bg-accent" 
    },
  ];

  if (totalLeads === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 h-[380px] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Target className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Campaign is empty</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
          Start adding leads to see your campaign distribution
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">Campaign Stages</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Distribution by stage</p>
      </div>

      <div className="space-y-5">
        {stages.map((stage, index) => (
          <div key={stage.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{stage.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{stage.count}</span>
                <span className="text-sm font-semibold text-foreground">{stage.value}%</span>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${stage.color} rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: isLoaded ? `${stage.value}%` : "0%",
                  transitionDelay: `${index * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total campaign value */}
      <div className="mt-6 pt-5 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Active Conversion Rate</span>
          <span className="text-xl font-bold text-foreground">{stats?.conversion_rate.value || "0%"}</span>
        </div>
      </div>
    </div>
  );
}
