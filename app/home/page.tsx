"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Check, 
  Star,
  Zap,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Clock,
  DollarSign,
  ChevronRight,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hero3DScene } from "@/components/landing/hero-3d-scene";
import { cn } from "@/lib/utils";

const stats = [
  { value: "10,000+", label: "Leads Analyzed" },
  { value: "3x", label: "Higher Close Rate" },
  { value: "$2M+", label: "Pipeline Generated" },
];

const trustedBy = [
  "SaaS Startups",
  "Consulting Agencies",
  "Fintech Companies",
  "IT Services",
  "Marketing Agencies",
  "E-commerce Brands",
  "Healthcare Tech",
  "AI Companies",
];

const features = [
  {
    icon: Target,
    title: "Lead Radar",
    description: "Never miss a buying signal. Monitor LinkedIn, news, and job boards 24/7.",
    color: "from-amber-500 to-orange-500",
    stat: "3x earlier",
    statLabel: "than competitors",
  },
  {
    icon: Sparkles,
    title: "AI Deal Room",
    description: "Your complete deal-closing command center with AI-powered insights.",
    color: "from-primary to-chart-2",
    stat: "3x more",
    statLabel: "deals closed",
  },
  {
    icon: Zap,
    title: "Ghost Closer",
    description: "A senior closer whispering in your ear during live sales calls.",
    color: "from-emerald-500 to-teal-500",
    stat: "60%",
    statLabel: "close rate",
  },
  {
    icon: DollarSign,
    title: "Lead Marketplace",
    description: "Turn every lead into money - even the ones that don't fit your business.",
    color: "from-blue-500 to-indigo-500",
    stat: "$50",
    statLabel: "avg per lead",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Upload Your Leads",
    description: "Drop in your prospect list — names, companies, emails. ZarvioAI scores every single one.",
    features: ["AI reads every lead's title and company", "Scores each from 0–100", "Identifies decision makers"],
  },
  {
    step: "02",
    title: "AI Builds Your Strategy",
    description: "For every lead, get a complete intelligence brief. Not just a score — a full game plan.",
    features: ["Exact deal size prediction", "Top 3 objections they'll raise", "Word-for-word responses"],
  },
  {
    step: "03",
    title: "Enter the Deal Room",
    description: "Armed with your complete AI strategy, open the Deal Room and execute.",
    features: ["Live deal health score", "One-click outreach", "AI reply suggestions"],
  },
];

const testimonials = [
  {
    quote: "ZarvioAI found me 3 high-intent prospects in the first hour. I closed one of them for $18K the same week.",
    author: "James K.",
    role: "Founder, DevFlow Agency",
    rating: 5,
  },
  {
    quote: "I used to spend 4 hours a day on outreach. Now I spend 20 minutes. ZarvioAI writes better emails than I ever could.",
    author: "Priya S.",
    role: "VP Sales, TechScale",
    rating: 5,
  },
  {
    quote: "The Deal Room told me exactly what my prospect would object to. I was prepared for everything. Closed a $35K deal.",
    author: "Marcus R.",
    role: "CEO, CloudBridge",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for solo founders getting started",
    features: ["50 leads per month", "AI Deal Room (3/month)", "Lead scoring", "Basic analytics", "CSV import"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    description: "For founders serious about closing deals",
    features: ["Unlimited leads", "Unlimited AI Deal Rooms", "Email sending via Resend", "Lead Marketplace access", "Priority support", "Early access to new features"],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Agency",
    price: "$149",
    description: "For teams and agencies scaling fast",
    features: ["AI Board Member reports", "White label solution", "5 team member seats", "API access (10K/day)", "Ghost Closer access", "Dedicated account manager"],
    cta: "Contact Sales",
    popular: false,
  },
];

const comparison = [
  { feature: "Finding leads", without: "Manual research 4hrs/day", with: "Automated, instant" },
  { feature: "Who to call first", without: "Guessing based on gut", with: "AI ranked by probability" },
  { feature: "Deal size prediction", without: "Random number", with: "AI calculated from data" },
  { feature: "Handling objections", without: "Wing it and hope", with: "Pre-prepared responses" },
  { feature: "Writing outreach", without: "1 hour per email", with: "AI personalized in 4 sec" },
  { feature: "Cost", without: "$30K+/month for team", with: "From $0/month" },
];

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">ZarvioAI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Sign in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center pt-16"
      >
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Hero3DScene />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background z-10" />

        {/* Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              The AI Revenue Team for Every Business
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight text-balance"
          >
            Your AI Revenue Team.
            <br />
            <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
              Always Closing.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty"
          >
            Join thousands of founders replacing expensive sales teams with AI. 
            Find leads, negotiate deals, and close revenue automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center gap-4"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base">
                Start for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border h-12 px-8 text-base">
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-12 mt-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Trusted By Marquee */}
      <section className="py-12 border-y border-border overflow-hidden bg-secondary/30">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mb-6">Trusted by founders at</p>
        <div className="relative">
          <div className="flex animate-marquee gap-12">
            {[...trustedBy, ...trustedBy].map((company, index) => (
              <span key={index} className="text-lg font-medium text-muted-foreground whitespace-nowrap">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Ticker */}
      <section className="py-4 bg-card border-b border-border overflow-hidden">
        <div className="relative">
          <div className="flex animate-marquee-slow gap-8">
            {[
              { icon: "fire", text: "Anna Schmidt just closed $25K deal", color: "text-orange-400" },
              { icon: "zap", text: "Michael Chang replied in 2 hours", color: "text-amber-400" },
              { icon: "target", text: "Sarah Jenkins scored HIGH 90", color: "text-primary" },
              { icon: "dollar", text: "5 deals closed via ZarvioAI today", color: "text-emerald-400" },
              { icon: "chart", text: "Pipeline up 40%", color: "text-blue-400" },
              { icon: "fire", text: "Anna Schmidt just closed $25K deal", color: "text-orange-400" },
              { icon: "zap", text: "Michael Chang replied in 2 hours", color: "text-amber-400" },
              { icon: "target", text: "Sarah Jenkins scored HIGH 90", color: "text-primary" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                <span className={cn("text-sm", item.color)}>{item.text}</span>
                <span className="text-muted-foreground">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Features</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Everything your revenue team does. Automated.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From lead discovery to deal closing, ZarvioAI handles every step of your sales process.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={index}>
                <Card className="bg-card border-border h-full hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0",
                        feature.color
                      )}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-foreground">{feature.stat}</span>
                          <span className="text-sm text-muted-foreground">{feature.statLabel}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">How It Works</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Zero to closed deal in under 60 minutes.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your leads at 9am. Have a negotiation strategy by 9:05. Close the deal by lunch.
            </p>
          </AnimatedSection>

          <div className="space-y-8">
            {howItWorks.map((step, index) => (
              <AnimatedSection key={index}>
                <Card className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 p-8 bg-gradient-to-br from-primary/10 to-chart-2/10 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-6xl font-bold text-primary/30">{step.step}</span>
                        </div>
                      </div>
                      <div className="md:w-2/3 p-8">
                        <h3 className="text-2xl font-semibold text-foreground mb-3">{step.title}</h3>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <ul className="space-y-2">
                          {step.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <Check className="w-4 h-4 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What founders say about ZarvioAI
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index}>
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 italic">{`"${testimonial.quote}"`}</p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Comparison</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              ZarvioAI vs. the old way
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Feature</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Without ZarvioAI</th>
                      <th className="text-left p-4 text-sm font-medium text-primary">With ZarvioAI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="p-4 text-sm font-medium text-foreground">{row.feature}</td>
                        <td className="p-4 text-sm text-muted-foreground">{row.without}</td>
                        <td className="p-4 text-sm text-primary font-medium">{row.with}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Pricing</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <AnimatedSection key={index}>
                <Card className={cn(
                  "bg-card border-border h-full relative",
                  plan.popular && "border-primary ring-1 ring-primary"
                )}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                          <Check className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={cn(
                        "w-full",
                        plan.popular 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      )}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <Card className="bg-gradient-to-br from-primary/20 via-card to-chart-2/20 border-primary/20">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Your AI revenue team is waiting.
                </h2>
                <p className="text-muted-foreground mb-8">
                  Join thousands of founders replacing expensive sales teams with AI.
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Start for Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">ZarvioAI</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                The AI revenue team for every business on earth.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ZarvioAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-slow {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
