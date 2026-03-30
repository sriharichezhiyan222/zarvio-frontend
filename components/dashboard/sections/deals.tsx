"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { apiJson } from "@/lib/client-api";
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

import type { Section } from "@/lib/types";

interface Deal {
  id: string;
  company: string;
  contact: string;
  email?: string;
  value: number;
  stage: string;
  status: "won" | "pending" | "lost";
  closeDate?: string;
  rep?: string;
}

const statusConfig = {
  won: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Won" },
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
  lost: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Lost" },
};

export function DealsSection({ onOpenDealRoom, onNavigateTo }: { onOpenDealRoom?: (leadId: string) => void, onNavigateTo?: (section: Section) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDeals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Load from prospects endpoint (now returns flat array after our fix)
        const raw = await apiJson<any>("/prospects");
        // Handle both flat array and wrapped {prospects: [...]} format
        const data: any[] = Array.isArray(raw) ? raw : (Array.isArray(raw?.prospects) ? raw.prospects : []);
        
        const normalized: Deal[] = data.map((deal, idx) => {
          const stageRaw = String(deal.stage || deal.status || deal.category || "pending").toLowerCase();
          const status: Deal["status"] = stageRaw.includes("won") || stageRaw === "high"
            ? "won"
            : stageRaw.includes("lost") || stageRaw === "low"
            ? "lost"
            : "pending";
          return {
            id: String(deal.id ?? deal.lead_id ?? idx),
            company: deal.company || deal.company_name || deal.leads?.company || "Unknown company",
            contact: deal.contact || deal.name || deal.leads?.first_name || "Unknown contact",
            email: deal.email || deal.leads?.email || "",
            value: Number(deal.value || deal.amount || deal.score || 0),
            stage: deal.category || deal.stage || "Pipeline",
            status,
            closeDate: deal.close_date || deal.expected_close_date || "",
            rep: deal.owner_name || deal.assigned_to || "",
          };
        });
        setDeals(normalized);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load deals");
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();
  }, []);

  const filteredDeals = useMemo(
    () =>
      deals.filter((deal) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          deal.company.toLowerCase().includes(q) || deal.contact.toLowerCase().includes(q);
        const matchesFilter = selectedFilter === "all" || deal.status === selectedFilter;
        return matchesSearch && matchesFilter;
      }),
    [deals, searchQuery, selectedFilter]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">View and manage all your deals in one place</p>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "won", "pending", "lost"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  selectedFilter === filter
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
          <Filter className="w-4 h-4" />
          More filters
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load deals: {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Company
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Value
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stage</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rep</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Close Date</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-b border-border">
                    <td className="py-4 px-4" colSpan={8}>
                      <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                    </td>
                  </tr>
                ))}
              {filteredDeals.map((deal, index) => {
                const status = statusConfig[deal.status];
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={deal.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors duration-150 cursor-pointer animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
                          {deal.company.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{deal.company}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-foreground">{deal.contact}</p>
                        <p className="text-xs text-muted-foreground">{deal.email || "-"}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-foreground">
                        ${deal.value.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium text-foreground">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", status.bg, status.color)}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{deal.rep || "-"}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{deal.closeDate || "-"}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        {onOpenDealRoom && (
                          <button
                            onClick={() => onOpenDealRoom(deal.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-primary hover:bg-primary/10 transition-colors"
                          >
                            Deal Room
                          </button>
                        )}
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filteredDeals.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    Add your first lead to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/30">
          <span className="text-sm text-muted-foreground">
            Showing {filteredDeals.length} of {deals.length} deals
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm bg-accent text-accent-foreground font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
