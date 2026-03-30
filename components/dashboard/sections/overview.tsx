"use client";

import { useState, useEffect } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart";
import { PipelineOverview } from "@/components/dashboard/charts/pipeline-overview";
import { RecentDeals } from "@/components/dashboard/recent-deals";
import { TopPerformers } from "@/components/dashboard/top-performers";
import { DollarSign, TrendingUp, Users, Target, LayoutDashboard } from "lucide-react";
import { apiJson } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import type { OverviewStats, ForecastSummary, Section } from "@/lib/types";

interface OverviewSectionProps {
  onOpenDealRoom?: (leadId: string) => void;
  onNavigateTo?: (section: Section) => void;
}

export function OverviewSection({ onOpenDealRoom, onNavigateTo }: OverviewSectionProps) {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [forecast, setForecast] = useState<ForecastSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Use the optimized stats endpoint that aggregates everything server-side
        const [statsData, forecastData] = await Promise.all([
          apiJson<any>("/api/stats/overview").catch(() => null),
          apiJson<any>("/api/forecast").catch(() => null),
        ]);
        
        setForecast(forecastData);
        
        if (statsData) {
          setStats({
            new_leads: statsData.new_leads || { value: "0", change: "0%", type: "neutral" },
            active_deals: statsData.active_deals || { value: "0", change: "0", type: "neutral" },
            conversion_rate: statsData.conversion_rate || { value: "0%", change: "0%", type: "neutral" },
            recent_deals: statsData.recent_deals || [],
          });
        } else {
          // Fallback: fetch separately
          const [prospects, leads] = await Promise.all([
            apiJson<any[]>("/prospects").catch(() => []),
            apiJson<any[]>("/leads").catch(() => []),
          ]);
          const dealsCount = Array.isArray(prospects) ? prospects.length : 0;
          const leadsCount = Array.isArray(leads) ? leads.length : 0;
          setStats({
            new_leads: { value: String(leadsCount), change: "0%", type: "neutral" },
            active_deals: { value: String(dealsCount), change: "0%", type: "neutral" },
            conversion_rate: {
              value: leadsCount > 0 ? `${Math.round((dealsCount / leadsCount) * 100)}%` : "0%",
              change: "0%",
              type: "neutral",
            },
            recent_deals: (Array.isArray(prospects) ? prospects : []).slice(0, 5),
          });
        }
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || val === 0) return "$0";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  const hasData = stats && (parseInt(stats.new_leads.value) > 0 || parseInt(stats.active_deals.value) > 0);

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(forecast?.breakdown.committed)}
          change="+0%"
          changeType="neutral"
          icon={DollarSign}
          delay={0}
          isLoading={isLoading}
        />
        <MetricCard
          title="Conversion Rate"
          value={stats?.conversion_rate.value || "0%"}
          change={stats?.conversion_rate.change || "0%"}
          changeType={stats?.conversion_rate.type || "neutral"}
          icon={TrendingUp}
          delay={1}
          isLoading={isLoading}
        />
        <MetricCard
          title="Active Deals"
          value={stats?.active_deals.value || "0"}
          change={stats?.active_deals.change || "0"}
          changeType={stats?.active_deals.type || "neutral"}
          icon={Target}
          delay={2}
          isLoading={isLoading}
        />
        <MetricCard
          title="New Leads"
          value={stats?.new_leads.value || "0"}
          change={stats?.new_leads.change || "0%"}
          changeType={stats?.new_leads.type || "neutral"}
          icon={Users}
          delay={3}
          isLoading={isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {hasData ? (
             <RevenueChart data={forecast} />
          ) : (
            <div className="bg-card border border-border border-dashed rounded-xl p-8 h-[380px] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <LayoutDashboard className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No revenue data yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-4">
                Add your first lead to get started with revenue forecasting
              </p>
              <Button 
                onClick={() => onNavigateTo?.("lead-explorer")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Target className="w-4 h-4 mr-2" />
                Find Your First Lead
              </Button>
            </div>
          )}
        </div>
        <PipelineOverview data={stats} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDeals deals={stats?.recent_deals || []} isLoading={isLoading} />
        <TopPerformers />
      </div>
    </div>
  );
}
