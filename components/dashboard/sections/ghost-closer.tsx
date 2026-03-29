"use client";

import { useState } from "react";
import { Ghost, Sparkles, CheckCircle2, TrendingUp, Mail, Activity, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GhostCloserSection() {
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
          <Ghost className="w-8 h-8 text-primary" />
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-semibold">
          Coming Soon
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Ghost Closer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A senior closer whispering in your ear during live sales calls.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Visual/Mockup */}
        <div className="space-y-6">
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-secondary/30 pb-4">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
                <CardTitle className="text-sm font-medium">Live Call Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold">P</span>
                    </div>
                    <div className="bg-secondary/50 rounded-lg rounded-tl-none p-3 text-sm">
                      <p className="text-muted-foreground mb-1 font-medium text-xs">Prospect</p>
                      <p>Your platform looks great, but we've always used Salesforce and migrations are just too painful right now.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 p-3 rounded-xl shadow-sm relative">
                    <div className="absolute -left-1 -top-1 w-3 h-3 bg-primary rounded-full animate-ping" />
                    <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">Suggested Rebuttal</p>
                      <p className="text-sm text-foreground">
                        "I completely understand. That's actually why we built our 1-click Salesforce Sync. You don't migrate—you just connect the APIs in 60 seconds and keep using Salesforce as your database."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Value Prop & Waitlist */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">60% close rate vs typical averages</h3>
                <p className="text-sm text-muted-foreground">
                  Gets real-time guidance, objection-handling, and next-step nudges from AI. Never get stumped by a tough question or forget to map out concrete next steps.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-emerald-400 font-bold text-2xl">Real-Time</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Objection Handling</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-primary font-bold text-2xl">60%</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Win Rate Jump</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Join the private beta waitlist</h4>
                {emailSubscribed ? (
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="text-sm">You're on the list! We'll notify you when Ghost Closer drops.</span>
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
