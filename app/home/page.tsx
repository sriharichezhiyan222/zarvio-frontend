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
  DollarSign,
  Mail,
  Linkedin,
  Twitter,
  Upload,
  Brain,
  Rocket,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hero3DScene } from "@/components/landing/hero-3d-scene";
import { CompanyLogos } from "@/components/landing/company-logos";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { cn } from "@/lib/utils";

const stats = [
  { value: "10,000+", label: "Leads Analyzed" },
  { value: "3x", label: "Higher Close Rate" },
  { value: "$2M+", label: "Pipeline Generated" },
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
    icon: Upload,
    iconBg: "from-blue-500 to-cyan-500",
    title: "Upload Your Leads",
    description: "Drop in your prospect list — names, companies, emails. ZarvioAI scores every single one.",
    features: ["AI reads every lead's title and company", "Scores each from 0–100", "Identifies decision makers"],
  },
  {
    icon: Brain,
    iconBg: "from-primary to-chart-2",
    title: "AI Builds Your Strategy",
    description: "For every lead, get a complete intelligence brief. Not just a score — a full game plan.",
    features: ["Exact deal size prediction", "Top 3 objections they'll raise", "Word-for-word responses"],
  },
  {
    icon: Rocket,
    iconBg: "from-emerald-500 to-teal-500",
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
    avatar: "JK",
  },
  {
    quote: "I used to spend 4 hours a day on outreach. Now I spend 20 minutes. ZarvioAI writes better emails than I ever could.",
    author: "Priya S.",
    role: "VP Sales, TechScale",
    rating: 5,
    avatar: "PS",
  },
  {
    quote: "The Deal Room told me exactly what my prospect would object to. I was prepared for everything. Closed a $35K deal.",
    author: "Marcus R.",
    role: "CEO, CloudBridge",
    rating: 5,
    avatar: "MR",
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

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ParallaxSection({ children, className, offset = 50 }: { children: React.ReactNode; className?: string; offset?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Zarvio Logo Component
function ZarvioLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-chart-2 to-primary flex items-center justify-center overflow-hidden shadow-lg shadow-primary/25">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
        <Bot className="w-5 h-5 text-primary-foreground relative z-10" />
      </div>
      <span className="font-bold text-xl tracking-tight text-foreground">
        Zarvio<span className="text-primary">AI</span>
      </span>
    </div>
  );
}

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, 100]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      <ScrollProgress />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <ZarvioLogo />
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
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
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
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 shadow-lg shadow-primary/10">
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
            <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
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
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base shadow-xl shadow-primary/30 transition-all hover:shadow-primary/40 hover:scale-[1.02]">
                Start for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border/50 h-12 px-8 text-base backdrop-blur-sm hover:bg-secondary/50">
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
              <motion.div 
                key={index} 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
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
            <motion.div 
              className="w-1 h-2 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Trusted By */}
      <section className="py-16 border-y border-border/50 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mb-8">
            Trusted by teams at leading companies
          </p>
          <CompanyLogos />
        </div>
      </section>

      {/* Live Activity Ticker */}
      <section className="py-4 bg-card/50 border-b border-border/50 overflow-hidden">
        <div className="relative">
          <motion.div 
            className="flex gap-8"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[
              { text: "Anna Schmidt just closed $25K deal", color: "text-orange-400" },
              { text: "Michael Chang replied in 2 hours", color: "text-amber-400" },
              { text: "Sarah Jenkins scored HIGH 90", color: "text-primary" },
              { text: "5 deals closed via ZarvioAI today", color: "text-emerald-400" },
              { text: "Pipeline up 40%", color: "text-blue-400" },
              { text: "Anna Schmidt just closed $25K deal", color: "text-orange-400" },
              { text: "Michael Chang replied in 2 hours", color: "text-amber-400" },
              { text: "Sarah Jenkins scored HIGH 90", color: "text-primary" },
              { text: "5 deals closed via ZarvioAI today", color: "text-emerald-400" },
              { text: "Pipeline up 40%", color: "text-blue-400" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ color: item.color.replace('text-', '') }} />
                <span className={cn("text-sm font-medium", item.color)}>{item.text}</span>
                <span className="text-muted-foreground/40">|</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Everything your revenue team does.
              <br />
              <span className="text-primary">Automated.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From lead discovery to deal closing, ZarvioAI handles every step of your sales process.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="bg-card/50 border-border/50 h-full hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-5">
                      <motion.div 
                        className={cn(
                          "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg",
                          feature.color
                        )}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <feature.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-foreground">{feature.stat}</span>
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

      {/* How It Works - Enhanced with icons instead of numbers */}
      <section id="how-it-works" className="py-24 px-6 bg-secondary/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Zero to closed deal in under
              <br />
              <span className="text-primary">60 minutes.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Upload your leads at 9am. Have a negotiation strategy by 9:05. Close the deal by lunch.
            </p>
          </AnimatedSection>

          <div className="space-y-6">
            {howItWorks.map((step, index) => (
              <AnimatedSection key={index} delay={index * 0.15}>
                <Card className="bg-card/80 border-border/50 overflow-hidden backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 p-8 bg-gradient-to-br from-secondary/50 to-secondary/20 flex items-center justify-center relative">
                        {/* Connection line */}
                        {index < howItWorks.length - 1 && (
                          <div className="hidden md:block absolute -bottom-6 left-1/2 w-px h-6 bg-gradient-to-b from-primary/50 to-transparent z-20" />
                        )}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className={cn(
                            "w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-xl",
                            step.iconBg
                          )}
                        >
                          <step.icon className="w-10 h-10 text-white" />
                        </motion.div>
                      </div>
                      <div className="md:w-2/3 p-8">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                            STEP {index + 1}
                          </span>
                        </div>
                        <h3 className="text-2xl font-semibold text-foreground mb-3">{step.title}</h3>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <ul className="space-y-2">
                          {step.features.map((feature, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-center gap-2 text-sm text-foreground"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              {feature}
                            </motion.li>
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
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              What founders say about
              <br />
              <span className="text-primary">ZarvioAI</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className="bg-card/50 border-border/50 h-full hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 italic leading-relaxed">{`"${testimonial.quote}"`}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-xs font-bold text-white">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Comparison</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              ZarvioAI vs. <span className="text-muted-foreground">the old way</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="bg-card/80 border-border/50 overflow-hidden backdrop-blur-sm">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Feature</th>
                      <th className="text-left p-4 text-sm font-medium text-destructive/70">Without ZarvioAI</th>
                      <th className="text-left p-4 text-sm font-medium text-primary">With ZarvioAI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row, index) => (
                      <motion.tr 
                        key={index} 
                        className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <td className="p-4 text-sm font-medium text-foreground">{row.feature}</td>
                        <td className="p-4 text-sm text-muted-foreground">{row.without}</td>
                        <td className="p-4 text-sm text-primary font-medium">{row.with}</td>
                      </motion.tr>
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
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Simple, <span className="text-primary">transparent</span> pricing
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <Card className={cn(
                  "bg-card/50 border-border/50 h-full relative backdrop-blur-sm hover:shadow-xl transition-all duration-500",
                  plan.popular && "border-primary ring-1 ring-primary shadow-xl shadow-primary/10"
                )}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-lg">Most Popular</Badge>
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
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={cn(
                        "w-full transition-all",
                        plan.popular 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
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
            <Card className="bg-gradient-to-br from-primary/20 via-card to-chart-2/20 border-primary/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.15),transparent_50%)]" />
              <CardContent className="p-12 text-center relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                    Your AI revenue team is waiting.
                  </h2>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Join thousands of founders replacing expensive sales teams with AI.
                  </p>
                  <Link href="/auth/signup">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/30 h-12 px-8 text-base">
                      Start for Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="inline-block mb-4">
                <ZarvioLogo />
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                The AI revenue team for every business on earth.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Roadmap</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ZarvioAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
