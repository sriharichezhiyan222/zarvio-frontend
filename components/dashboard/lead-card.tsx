"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Send, CheckCircle, AlertCircle, TrendingUp, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export interface DemoLead {
  id: string | number;
  name: string;
  company: string;
  title: string;
  email: string;
  score: number;
  category: string;
  source: string;
  location: string;
  signals: string[];
  deal_size: string;
  health_score: number;
  email_verified: boolean;
}

export function LeadCard({ 
  lead,
  onOpenDealRoom,
  onNavigateTo
}: { 
  lead: DemoLead,
  onOpenDealRoom?: (id: string) => void,
  onNavigateTo?: (page: string) => void
}) {
  const [expanded, setExpanded] = useState(false);

  // Colors based on score
  const scoreColor = lead.score >= 70 ? "bg-green-500 text-white" : "bg-yellow-500 text-white";
  const progressColor = lead.score >= 70 ? "bg-green-500" : "bg-yellow-500";

  // Initials
  const initials = lead.name.split(" ").map(n => n[0]).join("").toUpperCase();

  // Generated logic rules
  const isFounder = lead.title.toLowerCase().includes("ceo") || lead.title.toLowerCase().includes("founder");
  const isFunded = lead.signals.some(s => s.toLowerCase().includes("funded"));

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm hover:border-primary/30 transition-all font-sans">
      {/* Collapsed State */}
      <div 
        className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Avatar & Basics */}
        <div className="flex items-center gap-3 md:w-1/3">
          <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-semibold shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-sm">{lead.name}</h3>
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", scoreColor)}>
                {lead.score}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">
              {lead.title} · {lead.company} · {lead.location}
            </p>
          </div>
        </div>

        {/* Source & Signals */}
        <div className="flex flex-col gap-1.5 md:w-1/3">
           <div className="flex gap-2">
             <span className="text-[10px] px-2 py-0.5 border border-border rounded-md bg-secondary text-foreground">
               {lead.source}
             </span>
             {lead.signals[0] && (
               <span className="text-[10px] px-2 py-0.5 border border-primary/20 rounded-md bg-primary/10 text-primary truncate max-w-[120px]">
                 {lead.signals[0]}
               </span>
             )}
           </div>
        </div>

        {/* Confidence Progress & Expand */}
        <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3 w-full">
           <div className="flex-1 max-w-[120px]">
             <div className="flex justify-between text-[10px] mb-1">
               <span className="text-muted-foreground">Confidence</span>
               <span className="font-semibold">{lead.score}%</span>
             </div>
             <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
               <div className={cn("h-full", progressColor)} style={{ width: `${lead.score}%` }} />
             </div>
           </div>
           <button className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground">
             {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
           </button>
        </div>
      </div>

      {/* Expanded State */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border bg-card/50">
          <Tabs defaultValue="approach" className="w-full">
            <TabsList className="w-full justify-start h-9 bg-transparent border-b border-border rounded-none p-0 space-x-4">
              <TabsTrigger value="approach" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-xs">How to approach</TabsTrigger>
              <TabsTrigger value="why" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-xs">Why this lead</TabsTrigger>
              <TabsTrigger value="outreach" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-xs">Outreach</TabsTrigger>
              <TabsTrigger value="signals" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 text-xs">Signals</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <TabsContent value="why" className="mt-0 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    {isFounder ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-yellow-500" />}
                    <span>{isFounder ? "Decision maker, no approval needed" : "Requires director/VP buy-in"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    {lead.score > 80 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <TrendingUp className="w-4 h-4 text-primary" />}
                    <span>{lead.score > 80 ? "High close probability (>80%)" : "Average close probability"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    {isFunded ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Briefcase className="w-4 h-4 text-muted-foreground" />}
                    <span>{isFunded ? "Recently funded (High buying intent)" : "Standard operational budget"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    {lead.email_verified ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-yellow-500" />}
                    <span>{lead.email_verified ? "Verified contact info" : "Catch-all email (Bounces possible)"}</span>
                  </div>
                </TabsContent>

                <TabsContent value="approach" className="mt-0 space-y-3 text-sm">
                  <div className="flex gap-2">
                    <span className="font-bold text-primary shrink-0">1.</span>
                    <p><strong>Opening Hook:</strong> Reference {lead.signals[0]?.toLowerCase() || 'their recent activity'} immediately in line 1.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-primary shrink-0">2.</span>
                    <p><strong>Pain Point:</strong> Address their manual outreach limitations and scaling challenges for the {lead.title} role.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-primary shrink-0">3.</span>
                    <p><strong>Soft Ask:</strong> Propose a quick 5-min async demo rather than a hard 30-min discovery call.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-primary shrink-0">4.</span>
                    <p><strong>Deal Range:</strong> Target {lead.deal_size}. Walk away if under $10K.</p>
                  </div>
                </TabsContent>

                <TabsContent value="outreach" className="mt-0">
                  <div className="bg-secondary/50 rounded-md p-3 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Subject: Solving outreach scaling for {lead.company}</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {`Hi ${lead.name.split(' ')[0]},\n\nSaw that you're ${lead.signals[0]?.toLowerCase() || 'growing the team at ' + lead.company}. I know as a ${lead.title}, scaling manual outreach is a massive bottleneck.\n\nWe built an integration that automates this entirely. Mind if I send over a 2-min video showing how it works?`}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded hover:opacity-90">
                      <Send className="w-3.5 h-3.5" /> Send now
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card text-foreground text-xs font-semibold rounded hover:bg-secondary">
                      <Copy className="w-3.5 h-3.5" /> Copy email
                    </button>
                  </div>
                </TabsContent>

                <TabsContent value="signals" className="mt-0 flex gap-2 flex-wrap">
                  {lead.signals.map((s, i) => {
                    const l = s.toLowerCase();
                    let color = "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
                    if (l.includes("funded")) color = "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
                    if (l.includes("hiring")) color = "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
                    if (l.includes("contract")) color = "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400";
                    if (l.includes("cold") || l.includes("no reply")) color = "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
                    
                    return (
                      <div key={i} className={cn("px-3 py-1.5 text-xs font-medium rounded-md border", color)}>
                        {s}
                      </div>
                    )
                  })}
                </TabsContent>
              </div>

              {/* Deal Stats & Actions Right Sidebar */}
              <div className="lg:w-64 flex flex-col gap-4 border-l border-border pl-6">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Deal Intelligence</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Deal Size</span>
                      <span className="font-semibold">{lead.deal_size}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Health Score</span>
                      <span className="font-semibold">{lead.health_score}/100</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Verification</span>
                      <span className={lead.email_verified ? "text-green-500 font-semibold" : "text-yellow-500 font-semibold"}>
                        {lead.email_verified ? "Passed" : "Catch-all"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Quick Actions</p>
                  <div className="flex flex-col gap-1.5">
                    <button className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary text-foreground transition-colors">
                      🚀 Drop into Deal Room
                    </button>
                    <button className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary text-foreground transition-colors">
                      ✉️ Add to Sales Campaign
                    </button>
                    <button className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary text-foreground transition-colors">
                      🔗 Send LinkedIn Connect
                    </button>
                    <button className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-secondary text-foreground transition-colors">
                      🔄 Sync to HubSpot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
}
