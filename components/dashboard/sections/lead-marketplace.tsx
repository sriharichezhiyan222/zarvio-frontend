"use client";

import { useState } from "react";
import { Store, CheckCircle2, DollarSign, Mail, ArrowRight, Wallet, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LeadMarketplaceSection() {
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
          <Store className="w-8 h-8 text-primary" />
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-semibold">
          Coming Soon
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Lead Marketplace
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Turn every lead into money — even the ones that don't fit your business.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Visual/Mockup */}
        <div className="space-y-6">
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-secondary/30 pb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <CardTitle className="text-sm font-medium">Marketplace Exchange</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {/* Sale Row */}
                <div className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Sold: Logistics Lead</p>
                      <p className="text-xs text-muted-foreground">Purchased by FreightFlow AI</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">+$65.00</p>
                    <Badge variant="outline" className="text-[10px] mt-1">Completed</Badge>
                  </div>
                </div>
                {/* Buy Row */}
                <div className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400">
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Bought: EdTech CTO</p>
                      <p className="text-xs text-muted-foreground">High-intent intent signal</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">-$40.00</p>
                    <Badge variant="outline" className="text-[10px] mt-1 border-primary/30 text-primary">In Deal Room</Badge>
                  </div>
                </div>
                {/* Listed Row */}
                <div className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-muted-foreground">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Listed: Healthcare Admin</p>
                      <p className="text-xs text-muted-foreground">Waiting for buyer...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-muted-foreground">Est. $55.00</p>
                    <Badge variant="outline" className="text-[10px] mt-1">Listed</Badge>
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
                <h3 className="text-2xl font-bold">$50 avg per lead</h3>
                <p className="text-sm text-muted-foreground">
                  Buy, sell, and trade pre-qualified leads across industries. Never let hard work go to waste—if a prospect isn't right for your business, someone else will pay you for the introduction. 
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-emerald-400 font-bold text-2xl">High Intent</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Verified Buyers</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-primary font-bold text-2xl">RAS Scored</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Quality Control</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Join the private beta waitlist</h4>
                {emailSubscribed ? (
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="text-sm">You're on the list! We'll notify you when the Marketplace drops.</span>
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
