"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Radar,
  Sparkles,
  Ghost,
  Store,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Bell,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Feature {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ElementType;
  status: "live" | "coming-soon" | "beta";
  benefits: string[];
  mockContent: React.ReactNode;
  stat: string;
  statLabel: string;
}

const features: Feature[] = [
  {
    id: "lead-radar",
    name: "Lead Radar",
    description: "Never miss a buying signal again",
    longDescription: "Most sales teams waste 80% of their time contacting people who aren't ready to buy. Lead Radar changes this completely.",
    icon: Radar,
    status: "coming-soon",
    benefits: [
      "Monitors LinkedIn, news, and job boards 24/7",
      "Detects funding announcements instantly",
      "Alerts you when a company hires a new VP",
      "Flags when prospects post about pain points",
    ],
    mockContent: (
      <div className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary text-sm font-medium">
          <Radar className="w-4 h-4 animate-pulse" />
          New signal detected
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">TechCorp just raised Series B - $12M</p>
          <p className="text-sm text-muted-foreground">CTO is actively hiring sales tools</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">High intent</Badge>
      </div>
    ),
    stat: "3x earlier",
    statLabel: "Catch buyers than competitors",
  },
  {
    id: "ai-deal-room",
    name: "AI Deal Room",
    description: "Your complete deal-closing command center",
    longDescription: "Stop going into deals blind. The AI Deal Room gives you a complete intelligence brief on every prospect before you say a single word.",
    icon: Sparkles,
    status: "live",
    benefits: [
      "Predicts exact deal size based on company data",
      "Generates first offer and walk-away price",
      "Lists every objection they will raise",
      "Tells you exactly how to overcome each one",
      "Writes your opening pitch line",
    ],
    mockContent: (
      <div className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-xs font-bold text-primary-foreground">AS</div>
            <div>
              <p className="font-medium text-foreground text-sm">Anna Schmidt</p>
              <p className="text-xs text-muted-foreground">CEO at SkyLayer Consulting</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground">Deal size: <span className="text-foreground font-medium">$20K-$30K</span></span>
          <span className="text-muted-foreground">Health: <span className="text-emerald-400 font-medium">92%</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary">
          <Target className="w-3.5 h-3.5" />
          <span>How to win: Offer phased rollout</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    ),
    stat: "3x more",
    statLabel: "Deals closed using AI Deal Room",
  },
  {
    id: "ghost-closer",
    name: "Ghost Closer",
    description: "A senior closer whispering in your ear",
    longDescription: "What if you had a world-class sales coach listening to every call and telling you exactly what to say in real time? That's Ghost Closer.",
    icon: Ghost,
    status: "coming-soon",
    benefits: [
      "Listens to your live sales call in real time",
      "Instantly suggests the perfect response to objections",
      "Detects buying signals in their voice",
      "Alerts you when to go for the close",
      "Drafts follow-up email as you speak",
    ],
    mockContent: (
      <div className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Ghost className="w-4 h-4" />
          Ghost Closer - Live
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Prospect: </span>
            <span className="text-foreground italic">{'"We\'re already using Apollo..."'}</span>
          </div>
          <div className="flex items-start gap-2 bg-primary/10 rounded-lg p-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5" />
            <p className="text-sm text-foreground">{'"Apollo cut data accuracy by 40% — ours is 3x more accurate."'}</p>
          </div>
        </div>
      </div>
    ),
    stat: "20% to 60%",
    statLabel: "Average close rate jump",
  },
  {
    id: "lead-marketplace",
    name: "Lead Marketplace",
    description: "Turn every lead into money - even useless ones",
    longDescription: "You spend hours finding leads. Some fit your business. Many don't. Right now those wasted leads make you $0. The marketplace changes that.",
    icon: Store,
    status: "coming-soon",
    benefits: [
      "AI detects when a lead doesn't fit your business",
      "Automatically lists it in the ZarvioAI marketplace",
      "Other users who sell to that type buy it",
      "You earn money passively while you sleep",
      "ZarvioAI takes a small 10% platform fee",
    ],
    mockContent: (
      <div className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">You find lead</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs text-muted-foreground">{"Doesn't fit"}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs text-muted-foreground">Listed</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground">You earn</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <span>$50 avg per lead</span>
          <span>48hr match</span>
          <span>10% fee</span>
        </div>
      </div>
    ),
    stat: "$50 avg",
    statLabel: "Per lead sold in marketplace",
  },
];

export function ComingSoonSection() {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          Roadmap
        </Badge>
        <h2 className="text-3xl font-bold text-foreground mb-3 text-balance">
          The Future of ZarvioAI
        </h2>
        <p className="text-muted-foreground">
          {"We're building the most powerful AI sales platform. Here's what's coming next."}
        </p>
      </div>

      {/* Subscribe for Updates */}
      <Card className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10 border-primary/20 max-w-xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Get Early Access</h3>
              <p className="text-sm text-muted-foreground">Be first to try new features</p>
            </div>
          </div>
          {emailSubscribed ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span>{"You're on the list! We'll notify you when features launch."}</span>
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
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isLive = feature.status === "live";

          return (
            <Card
              key={feature.id}
              className={cn(
                "bg-card border-border overflow-hidden transition-all duration-300 hover:border-primary/30 animate-in fade-in slide-in-from-bottom-4",
                isLive && "ring-1 ring-emerald-500/20"
              )}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isLive ? "bg-emerald-500/10" : "bg-primary/10"
                    )}>
                      <Icon className={cn(
                        "w-6 h-6",
                        isLive ? "text-emerald-400" : "text-primary"
                      )} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "border",
                    isLive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {isLive ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Live Now</>
                    ) : (
                      <><Clock className="w-3 h-3 mr-1" /> Coming Soon</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {feature.longDescription}
                </p>

                {/* Benefits List */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Mock Content Preview */}
                <div className="pt-2">
                  {feature.mockContent}
                </div>

                {/* Stat */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={cn(
                      "w-5 h-5",
                      isLive ? "text-emerald-400" : "text-primary"
                    )} />
                    <span className={cn(
                      "font-bold",
                      isLive ? "text-emerald-400" : "text-primary"
                    )}>{feature.stat}</span>
                    <span className="text-sm text-muted-foreground">{feature.statLabel}</span>
                  </div>
                  {isLive && (
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Try Now
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <Card className="bg-card border-border text-center p-8">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Have a Feature Request?
          </h3>
          <p className="text-muted-foreground mb-4">
            {"We're always looking for ways to make ZarvioAI better. Share your ideas with us."}
          </p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Mail className="w-4 h-4 mr-2" />
            Submit Feature Request
          </Button>
        </div>
      </Card>
    </div>
  );
}
