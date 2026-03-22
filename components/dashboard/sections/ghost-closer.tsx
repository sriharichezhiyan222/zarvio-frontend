"use client";

import {
  Ghost,
  MessageSquare,
  Clock,
  Zap,
  Brain,
  Target,
  BarChart3,
  Sparkles,
  ArrowRight,
  Check,
  Mail,
  Bot,
  Repeat,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Follow-ups",
    description: "Automatically re-engage cold leads with personalized, context-aware messages that feel human-written.",
  },
  {
    icon: Clock,
    title: "Perfect Timing",
    description: "Our AI determines the optimal time to reach out based on past engagement patterns and industry benchmarks.",
  },
  {
    icon: Brain,
    title: "Smart Objection Handling",
    description: "Pre-trained on millions of sales conversations to handle common objections and keep deals moving forward.",
  },
  {
    icon: Repeat,
    title: "Multi-Channel Sequences",
    description: "Coordinate follow-ups across email, LinkedIn, and SMS to maximize response rates.",
  },
  {
    icon: MessageSquare,
    title: "Conversation Memory",
    description: "Ghost Closer remembers every interaction, ensuring continuity and relevance in every message.",
  },
  {
    icon: Target,
    title: "Win-Back Campaigns",
    description: "Automatically identify and re-engage lost opportunities with targeted win-back sequences.",
  },
];

const stats = [
  { value: "47%", label: "Higher Response Rate" },
  { value: "3.2x", label: "More Meetings Booked" },
  { value: "68%", label: "Ghosted Leads Recovered" },
  { value: "15min", label: "Setup Time" },
];

const useCases = [
  "Re-engage leads that went cold",
  "Follow up on no-shows automatically",
  "Revive old pipeline opportunities",
  "Maintain relationships at scale",
  "Handle objections instantly",
  "Book meetings while you sleep",
];

export function GhostCloserSection() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-chart-2/20 via-card to-primary/20 border border-chart-2/20 p-8 md:p-12">
        <div className="absolute top-0 left-0 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-4 bg-chart-2/20 text-chart-2 border-chart-2/30">
            Coming Soon
          </Badge>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-2 to-primary flex items-center justify-center">
              <Ghost className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Ghost Closer</h1>
              <p className="text-lg text-muted-foreground">Never lose a deal to silence again</p>
            </div>
          </div>

          <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
            Ghost Closer is your AI sales assistant that automatically re-engages ghosted leads, 
            handles objections, and books meetings - all while you focus on closing deals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-chart-2 text-primary-foreground hover:bg-chart-2/90">
              <Mail className="w-4 h-4 mr-2" />
              Join the Waitlist
            </Button>
            <Button variant="outline" className="border-border">
              Watch Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Ghost Animation */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative">
            <div className="w-48 h-48 relative">
              {/* Ghost body */}
              <div className="absolute inset-0 animate-bounce" style={{ animationDuration: "3s" }}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="oklch(0.7 0.2 270)" />
                      <stop offset="100%" stopColor="oklch(0.65 0.25 285)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M50 10 C25 10 10 30 10 55 L10 85 Q17.5 75 25 85 Q32.5 95 40 85 Q47.5 75 55 85 Q62.5 95 70 85 Q77.5 75 85 85 Q92.5 95 90 85 L90 55 C90 30 75 10 50 10 Z"
                    fill="url(#ghostGradient)"
                    opacity="0.9"
                  />
                  {/* Eyes */}
                  <circle cx="35" cy="45" r="6" fill="white" />
                  <circle cx="65" cy="45" r="6" fill="white" />
                  <circle cx="37" cy="45" r="3" fill="#1a1a2e" />
                  <circle cx="67" cy="45" r="3" fill="#1a1a2e" />
                </svg>
              </div>
              {/* Message bubbles */}
              <div className="absolute -right-4 top-8 animate-ping" style={{ animationDuration: "2s" }}>
                <Send className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute -left-4 bottom-8 animate-pulse">
                <MessageSquare className="w-5 h-5 text-chart-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-card border-border hover:border-chart-2/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-chart-2" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Use Cases */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-chart-2" />
            Perfect For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="w-6 h-6 rounded-full bg-chart-2/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-chart-2" />
                </div>
                <span className="text-sm font-medium text-foreground">{useCase}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Conversation */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader>
          <CardTitle>See It In Action</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-secondary/30 p-6 space-y-4">
            {/* Original message */}
            <div className="flex justify-end">
              <div className="max-w-md bg-primary/20 border border-primary/30 rounded-lg rounded-tr-none p-4">
                <p className="text-sm text-foreground">
                  Hi Sarah, just checking in on our proposal. Would love to schedule a call this week to discuss next steps.
                </p>
                <p className="text-xs text-muted-foreground mt-2">Sent 5 days ago - No response</p>
              </div>
            </div>
            
            {/* Ghost Closer follow-up */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chart-2 to-primary flex items-center justify-center shrink-0">
                <Ghost className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="max-w-md bg-card border border-border rounded-lg rounded-tl-none p-4">
                <Badge className="mb-2 bg-chart-2/20 text-chart-2 border-chart-2/30 text-xs">
                  Ghost Closer
                </Badge>
                <p className="text-sm text-foreground">
                  Hi Sarah, I noticed you had some questions about the implementation timeline last time. 
                  I put together a quick case study from a similar company that might address those concerns. 
                  Worth a 10-minute call?
                </p>
                <p className="text-xs text-emerald-400 mt-2">Reply received 2 hours later</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-chart-2/10 to-primary/10 border-chart-2/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">Stop Losing Deals to Silence</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Be among the first to use Ghost Closer and transform your sales follow-up game.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-11 px-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-chart-2/20"
            />
            <Button className="bg-chart-2 text-primary-foreground hover:bg-chart-2/90 h-11">
              Get Early Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
