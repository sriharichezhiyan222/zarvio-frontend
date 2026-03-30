"use client";

import { useState } from "react";
import { Radar, Bell, CheckCircle2, TrendingUp, Mail, Target, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Section } from "@/lib/types";

export function LeadRadarSection({ onNavigateTo }: { onNavigateTo?: (section: Section) => void }) {
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmailSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col items-center text-center space-y-4 pt-12 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
          <Radar className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-semibold">
          Coming Soon
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Lead Radar
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Never miss a buying signal. Monitor LinkedIn, news, and job boards 24/7 to catch signals early.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Visual/Mockup */}
        <div className="space-y-6">
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-secondary/30 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <CardTitle className="text-sm font-medium">Live Signal Feed Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[
                  { title: "TechCorp just raised Series B - $12M", detail: "CTO is actively hiring sales tools", badge: "Funding Event", intent: "High" },
                  { title: "Acme Inc. hired new VP of Sales", detail: "Historically, VP changes trigger new software purchases in 90 days", badge: "Leadership Change", intent: "Critical" },
                  { title: "Competitor outage detected", detail: "3 prospects complaining on LinkedIn about downtime", badge: "Pain Point", intent: "Medium" }
                ].map((signal, i) => (
                  <div key={i} className="p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs text-primary border-primary/30">
                        {signal.badge}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Target className="w-3 h-3 text-emerald-400" />
                        Intent: {signal.intent}
                      </span>
                    </div>
                    <p className="font-medium text-sm text-foreground mb-1">{signal.title}</p>
                    <p className="text-xs text-muted-foreground">{signal.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Value Prop & Waitlist */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">3× earlier than competitors</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified the exact moment a prospect enters the buying window. Engage when they are most susceptible to change, before they even start evaluating other vendors.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-primary font-bold text-2xl">24/7</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Monitoring</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-emerald-400 font-bold text-2xl">LinkedIn</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Integration</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Join the private beta waitlist</h4>
                {emailSubscribed ? (
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="text-sm">You're on the list! We'll notify you when Lead Radar drops.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        required
                      />
                    </div>
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Notify Me
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
