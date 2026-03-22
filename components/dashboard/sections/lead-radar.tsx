"use client";

import { cn } from "@/lib/utils";
import {
  Radar,
  Target,
  Bell,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  Check,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Target,
    title: "Real-Time Lead Detection",
    description: "Instantly identify when a company matches your ideal customer profile based on intent signals, hiring patterns, and market movements.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified the moment a high-value lead enters your target market. Never miss a sales opportunity again.",
  },
  {
    icon: Zap,
    title: "Automated Enrichment",
    description: "Automatically enrich lead data with company info, decision-makers, tech stack, and buying signals.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Monitor leads across 195+ countries with real-time data from millions of company sources.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Scoring",
    description: "AI-powered scoring predicts which leads are most likely to convert, helping you prioritize your outreach.",
  },
  {
    icon: Users,
    title: "Stakeholder Mapping",
    description: "Automatically identify all relevant decision-makers and influencers within target organizations.",
  },
];

const benefits = [
  "10x faster lead discovery",
  "95% data accuracy",
  "Real-time intent signals",
  "Unlimited lead alerts",
  "API integrations",
  "CRM sync",
];

export function LeadRadarSection() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-chart-2/20 border border-primary/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-chart-2/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            Coming Soon
          </Badge>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <Radar className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Lead Radar</h1>
              <p className="text-lg text-muted-foreground">Real-time lead intelligence</p>
            </div>
          </div>

          <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
            Lead Radar uses AI-powered signals to detect and alert you to high-intent prospects in real-time. 
            Stop searching for leads manually - let them come to you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Mail className="w-4 h-4 mr-2" />
              Join the Waitlist
            </Button>
            <Button variant="outline" className="border-border">
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Animated Radar Visual */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full border border-primary/20" />
            <div className="absolute inset-8 rounded-full border border-primary/30" />
            <div className="absolute inset-16 rounded-full border border-primary/40" />
            <div className="absolute inset-24 rounded-full bg-primary/20 animate-pulse" />
            <div className="absolute inset-0 origin-center animate-spin" style={{ animationDuration: "8s" }}>
              <div className="w-1/2 h-0.5 bg-gradient-to-r from-primary to-transparent absolute top-1/2 left-1/2 -translate-y-1/2" />
            </div>
            {/* Dots representing leads */}
            <div className="absolute top-8 right-12 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            <div className="absolute bottom-16 right-8 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute top-24 left-8 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            What You Get
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-chart-2/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">Be the First to Know</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join our early access list and get exclusive access to Lead Radar when it launches.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-11 px-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-11">
              Join Waitlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
