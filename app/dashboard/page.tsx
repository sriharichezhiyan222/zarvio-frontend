"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { OverviewSection } from "@/components/dashboard/sections/overview";
import { CampaignSection } from "@/components/dashboard/sections/campaign";
import { DealsSection } from "@/components/dashboard/sections/deals";
import { CustomersSection } from "@/components/dashboard/sections/customers";
import { TeamSection } from "@/components/dashboard/sections/team";
import { ForecastingSection } from "@/components/dashboard/sections/forecasting";
import { ReportsSection } from "@/components/dashboard/sections/reports";
import { SettingsSection } from "@/components/dashboard/sections/settings";
import { OutreachSection } from "@/components/dashboard/sections/outreach";
import { LeadExplorerSection } from "@/components/dashboard/sections/lead-explorer";
import { ComingSoonSection } from "@/components/dashboard/sections/coming-soon";
import { ZarvioAssistant } from "@/components/dashboard/zarvio-assistant";
import type { Section, OutreachTab } from "@/lib/types";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [outreachTab, setOutreachTab] = useState<OutreachTab>("emails");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "campaign":
        return <CampaignSection />;
      case "deals":
        return <DealsSection />;
      case "customers":
        return <CustomersSection />;
      case "team":
        return <TeamSection />;
      case "forecasting":
        return <ForecastingSection />;
      case "reports":
        return <ReportsSection />;
      case "settings":
        return <SettingsSection />;
      case "outreach":
        return <OutreachSection activeTab={outreachTab} onTabChange={setOutreachTab} />;
      case "lead-explorer":
        return <LeadExplorerSection />;
      case "coming-soon":
        return <ComingSoonSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        outreachTab={outreachTab}
        onOutreachTabChange={setOutreachTab}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-out ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[280px]"
        }`}
      >
        <Header activeSection={activeSection} />
        <main className="flex-1 p-6 overflow-auto">
          <div
            key={activeSection}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {renderSection()}
          </div>
        </main>
      </div>
      <ZarvioAssistant />
    </div>
  );
}
