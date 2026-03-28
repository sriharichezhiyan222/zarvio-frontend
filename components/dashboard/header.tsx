"use client";

import { cn } from "@/lib/utils";
import type { Section } from "@/lib/types";
import { Bell, Search, Calendar, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiJson } from "@/lib/client-api";

interface HeaderProps {
  activeSection: Section;
}

const sectionTitles: Record<Section, string> = {
  overview: "Overview",
  campaign: "Campaign",
  deals: "Deals",
  "deal-room": "Deal Room",
  customers: "Customers",
  team: "Team Performance",
  forecasting: "Forecasting",
  reports: "Reports",
  settings: "Settings",
  outreach: "Outreach",
  "lead-explorer": "Lead Explorer",
  "coming-soon": "Coming Soon",
  "lead-radar": "Lead Radar",
  "ghost-closer": "Ghost Closer",
  "lead-marketplace": "Lead Marketplace",
};

export function Header({ activeSection }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [initials, setInitials] = useState("U");
  const router = useRouter();

  useEffect(() => {
    const loadMe = async () => {
      try {
        const me = await apiJson<any>("/auth/me");
        const name = me?.name || me?.email || "User";
        setInitials(
          name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        );
      } catch {
        setInitials("U");
      }
    };
    loadMe();
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("-auth-token")) localStorage.removeItem(key);
      });
    }
    router.push("/auth/signin");
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold text-foreground">
          {sectionTitles[activeSection]}
        </h1>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className={cn(
            "relative flex items-center transition-all duration-300",
            searchFocused ? "w-64" : "w-48"
          )}
        >
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </button>

        <button
          onClick={handleLogout}
          className="h-9 rounded-lg bg-secondary px-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
        {/* User avatar */}
        <button className="w-9 h-9 rounded-lg overflow-hidden bg-secondary ring-2 ring-transparent hover:ring-accent/50 transition-all duration-200">
          <div className="w-full h-full bg-gradient-to-br from-accent/80 to-chart-1 flex items-center justify-center text-xs font-semibold text-accent-foreground">
            {initials}
          </div>
        </button>
      </div>
    </header>
  );
}
