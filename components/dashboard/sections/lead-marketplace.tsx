"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Store,
  Users,
  Building2,
  Globe,
  Filter,
  Search,
  Star,
  ShoppingCart,
  Check,
  ArrowRight,
  Mail,
  Shield,
  Zap,
  Award,
  DollarSign,
  TrendingUp,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const leadPackages = [
  {
    id: "1",
    name: "Tech Startup Decision Makers",
    description: "CEOs, CTOs, and VPs from Series A-C funded startups",
    leads: 5000,
    price: 499,
    rating: 4.9,
    reviews: 128,
    categories: ["Technology", "Startups", "SaaS"],
    seller: "DataVault Pro",
    verified: true,
    freshness: "Updated daily",
  },
  {
    id: "2",
    name: "Enterprise Marketing Leaders",
    description: "CMOs and VP Marketing from Fortune 1000 companies",
    leads: 2500,
    price: 799,
    rating: 4.8,
    reviews: 89,
    categories: ["Marketing", "Enterprise", "B2B"],
    seller: "LeadGenix",
    verified: true,
    freshness: "Updated weekly",
  },
  {
    id: "3",
    name: "Healthcare Industry Contacts",
    description: "Hospital administrators and healthcare IT directors",
    leads: 3000,
    price: 649,
    rating: 4.7,
    reviews: 56,
    categories: ["Healthcare", "IT", "Decision Makers"],
    seller: "MedLeads Inc",
    verified: true,
    freshness: "Updated weekly",
  },
  {
    id: "4",
    name: "E-commerce Store Owners",
    description: "Shopify and WooCommerce store owners with $1M+ revenue",
    leads: 8000,
    price: 599,
    rating: 4.6,
    reviews: 203,
    categories: ["E-commerce", "Retail", "SMB"],
    seller: "CommerceData",
    verified: false,
    freshness: "Updated monthly",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Data Quality",
    description: "Every lead list is verified for accuracy with 95%+ deliverability guarantee.",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Download leads immediately after purchase. No waiting, no delays.",
  },
  {
    icon: Award,
    title: "Seller Ratings",
    description: "Transparent seller ratings and reviews from real buyers.",
  },
  {
    icon: DollarSign,
    title: "Fair Pricing",
    description: "Competitive marketplace pricing with no hidden fees.",
  },
];

const categories = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Real Estate",
  "Manufacturing",
  "Education",
  "Legal",
];

export function LeadMarketplaceSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 via-card to-primary/20 border border-emerald-500/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            Coming Soon
          </Badge>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-primary flex items-center justify-center">
              <Store className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Lead Marketplace</h1>
              <p className="text-lg text-muted-foreground">Buy and sell quality leads</p>
            </div>
          </div>

          <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
            The first peer-to-peer marketplace for B2B leads. Buy verified lead lists from trusted sellers 
            or monetize your own data - all with complete transparency and quality guarantees.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-emerald-500 text-white hover:bg-emerald-600">
              <Mail className="w-4 h-4 mr-2" />
              Join the Waitlist
            </Button>
            <Button variant="outline" className="border-border">
              Become a Seller
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Marketplace Visual */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative w-64 h-64">
            {/* Shopping items floating */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-card border border-border rounded-xl flex items-center justify-center animate-bounce" style={{ animationDuration: "3s" }}>
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute top-16 left-0 w-14 h-14 bg-card border border-border rounded-xl flex items-center justify-center animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}>
              <Building2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="absolute bottom-8 right-8 w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
              <Globe className="w-6 h-6 text-chart-2" />
            </div>
            <div className="absolute bottom-0 left-8 w-20 h-20 bg-gradient-to-br from-emerald-500 to-primary rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Category Filters */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Browse by Industry</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                selectedCategory === category
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-emerald-500/30"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sample Listings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Featured Lead Packages</h2>
          <Badge variant="outline" className="border-muted text-muted-foreground">
            Preview
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leadPackages.map((pkg) => (
            <Card key={pkg.id} className="bg-card border-border hover:border-emerald-500/50 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{pkg.seller}</span>
                    {pkg.verified && (
                      <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-foreground">{pkg.rating}</span>
                    <span className="text-xs text-muted-foreground">({pkg.reviews})</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {pkg.categories.map((cat) => (
                    <Badge key={cat} variant="outline" className="text-xs border-border text-muted-foreground">
                      {cat}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-2xl font-bold text-foreground">${pkg.price}</p>
                    <p className="text-xs text-muted-foreground">{pkg.leads.toLocaleString()} leads</p>
                  </div>
                  <Button className="bg-emerald-500 text-white hover:bg-emerald-600" disabled>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Seller CTA */}
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  For Sellers
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Monetize Your Lead Data</h3>
              <p className="text-muted-foreground mb-4">
                Have quality leads you are not using? List them on the marketplace and earn recurring revenue. 
                Set your own prices and reach thousands of potential buyers.
              </p>
              <ul className="space-y-2 mb-6">
                {["Keep 85% of every sale", "Verified seller badges", "Analytics dashboard", "Instant payouts"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                Apply to Become a Seller
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-primary/20 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-24 h-24 text-emerald-400/50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-primary/10 border-emerald-500/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">Get Early Access</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Be the first to buy or sell leads on the marketplace. Join our waitlist for exclusive early access.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-11 px-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <Button className="bg-emerald-500 text-white hover:bg-emerald-600 h-11">
              Join Waitlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
