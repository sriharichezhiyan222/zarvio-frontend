"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import type { Section, OutreachTab, ComingSoonTab } from "@/lib/types";
import {
  LayoutDashboard,
  Megaphone,
  Handshake,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  TrendingUp,
  Settings,
  Mail,
  Phone,
  MessageSquare,
  Search,
  Rocket,
  ChevronDown,
  DoorOpen,
  Radar,
  Ghost,
  Store,
  Bot,
} from "lucide-react";

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  outreachTab?: OutreachTab;
  onOutreachTabChange?: (tab: OutreachTab) => void;
  comingSoonTab?: ComingSoonTab;
  onComingSoonTabChange?: (tab: ComingSoonTab) => void;
}

const mainNavItems: { id: Section; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "campaign", label: "Campaign", icon: Megaphone },
  { id: "deals", label: "Deals", icon: Handshake },
  { id: "deal-room", label: "Deal Room", icon: DoorOpen },
  { id: "ras", label: "RAS", icon: Bot, badge: "AI" },
  { id: "lead-explorer", label: "Lead Explorer", icon: Search },
  { id: "customers", label: "Customers", icon: Building2 },
  { id: "team", label: "Team", icon: Users },
  { id: "forecasting", label: "Forecasting", icon: TrendingUp },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

const outreachTabs: { id: OutreachTab; label: string; icon: React.ElementType }[] = [
  { id: "emails", label: "Emails", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

const comingSoonItems: { id: ComingSoonTab; label: string; icon: React.ElementType }[] = [
  { id: "lead-radar", label: "Lead Radar", icon: Radar },
  { id: "ghost-closer", label: "Ghost Closer", icon: Ghost },
  { id: "lead-marketplace", label: "Lead Marketplace", icon: Store },
];

export function Sidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onCollapsedChange,
  outreachTab = "emails",
  onOutreachTabChange,
  comingSoonTab,
  onComingSoonTabChange,
}: SidebarProps) {
  const [outreachExpanded, setOutreachExpanded] = useState(true);
  const [comingSoonExpanded, setComingSoonExpanded] = useState(false);

  const isComingSoonActive = activeSection === "lead-radar" || activeSection === "ghost-closer" || activeSection === "lead-marketplace";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out flex flex-col",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-primary to-chart-2">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span
            className={cn(
              "font-semibold text-lg text-sidebar-foreground whitespace-nowrap transition-all duration-300",
              collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
          >
            ZarvioAI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {/* Main Navigation */}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                item.id === "ras" && "bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200",
                  isActive ? "text-primary" : "group-hover:scale-110",
                  item.id === "ras" && "text-primary"
                )}
              />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300 flex items-center gap-2",
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}
              >
                {item.label}
                {item.badge && !collapsed && (
                  <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] rounded font-semibold">
                    {item.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}

        {/* Outreach Section */}
        {!collapsed && (
          <div className="pt-4 mt-4 border-t border-sidebar-border">
            <button
              onClick={() => setOutreachExpanded(!outreachExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              <span>Outreach</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200",
                outreachExpanded ? "rotate-0" : "-rotate-90"
              )} />
            </button>
            
            {outreachExpanded && (
              <div className="mt-1 space-y-1">
                {outreachTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSection === "outreach" && outreachTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onSectionChange("outreach");
                        onOutreachTabChange?.(tab.id);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary transition-all duration-300",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-transform duration-200",
                          isActive ? "text-primary" : "group-hover:scale-110"
                        )}
                      />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Coming Soon Section */}
        {!collapsed && (
          <div className="pt-4 mt-4 border-t border-sidebar-border">
            <button
              onClick={() => setComingSoonExpanded(!comingSoonExpanded)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                isComingSoonActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                <span>Coming Soon</span>
                <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] rounded font-medium">
                  New
                </span>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200",
                comingSoonExpanded ? "rotate-0" : "-rotate-90"
              )} />
            </button>
            
            {comingSoonExpanded && (
              <div className="mt-1 space-y-1">
                {comingSoonItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSectionChange(item.id);
                        onComingSoonTabChange?.(item.id);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "bg-gradient-to-r from-primary/20 to-chart-2/20 text-sidebar-foreground border border-primary/30"
                          : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary transition-all duration-300",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-transform duration-200",
                          isActive ? "text-primary" : "group-hover:scale-110"
                        )}
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        <div className={cn(!collapsed && "pt-4 mt-4 border-t border-sidebar-border")}>
          <button
            onClick={() => onSectionChange("settings")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
              activeSection === "settings"
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary transition-all duration-300",
                activeSection === "settings" ? "opacity-100" : "opacity-0"
              )}
            />
            <Settings
              className={cn(
                "w-5 h-5 shrink-0 transition-transform duration-200",
                activeSection === "settings" ? "text-primary" : "group-hover:scale-110"
              )}
            />
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300",
                collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}
            >
              Settings
            </span>
          </button>
        </div>
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
