"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  AlertTriangle,
  Target,
  Zap,
  Shield,
  Calendar,
  Briefcase,
  Scale,
  Award,
  CheckCircle2,
  XCircle,
  Pause,
  Send,
  Sparkles,
  MessageSquare,
  Building2,
  ChevronRight,
  BarChart3,
  Percent,
  ArrowUpRight,
  Timer,
  BadgeCheck,
  CircleDollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// Mock lead data
const mockLead = {
  name: "Rahul Sharma",
  company: "TechFlow Solutions",
  title: "Head of Sales",
  industry: "SaaS",
  companySize: "50-200",
  email: "rahul@techflow.io",
};

// AI Generated Deal Room Data
const dealRoomData = {
  pricing: {
    recommended_offer: 25000,
    win_probability: 92,
    installments: "3x ₹8333",
    competitor_comparison: "Apollo = ₹40K, less AI",
  },
  roi_calculator: {
    pipeline_increase: "150K → 630K (4.2x)",
    timeframe: "90 days",
    break_even: "Month 2",
  },
  case_studies: [
    { company: "CloudScale SaaS", closed: "₹28K", result: "3x pipeline in 60 days" },
    { company: "DataDrive Startup", closed: "₹22K", result: "42% faster closes" },
    { company: "GrowthHub Tech", closed: "₹30K", result: "5.2x ROI in Q1" },
  ],
  objection_responses: {
    too_expensive: "₹20K = $30K SDR team. Competitors pay 2x more.",
    need_time: "24hr onboarding, ROI in 30 days.",
    competitors: "Apollo finds leads. We close them.",
    integration: "HubSpot/Pipedrive in 5 mins. Onboard tomorrow.",
  },
  urgency_close: {
    limited_spots: "Only 3 Pro slots left this month",
    social_proof: "Acme closed yesterday at ₹25K",
  },
};

// Swarm Agents
const swarmAgents = [
  { id: "pricing", name: "Pricing Agent", icon: DollarSign, vote: "approve", reason: "Price point optimal for company size" },
  { id: "risk", name: "Risk Agent", icon: AlertTriangle, vote: "approve", reason: "Low churn probability (8%)" },
  { id: "upsell", name: "Upsell Agent", icon: TrendingUp, vote: "approve", reason: "Enterprise upgrade likely in Q3" },
  { id: "timing", name: "Timing Agent", icon: Clock, vote: "approve", reason: "Budget cycle ends next week" },
  { id: "competition", name: "Competition Agent", icon: Target, vote: "hold", reason: "Competitor demo scheduled" },
  { id: "capacity", name: "Capacity Agent", icon: Zap, vote: "approve", reason: "Onboarding slots available" },
  { id: "momentum", name: "Momentum Agent", icon: ArrowUpRight, vote: "approve", reason: "4 touchpoints this week" },
  { id: "budget", name: "Budget Agent", icon: Briefcase, vote: "approve", reason: "Company raised Series A" },
  { id: "authority", name: "Authority Agent", icon: Shield, vote: "approve", reason: "Decision maker engaged" },
  { id: "fit", name: "Fit Agent", icon: Award, vote: "approve", reason: "95% ICP match score" },
];

// Chat messages
const initialMessages = [
  {
    role: "lead",
    message: "Hi, I saw your demo. The AI looks impressive but honestly the pricing seems a bit steep for us.",
    time: "2 min ago",
  },
];

const voteColors = {
  approve: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  hold: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  reject: "text-red-400 bg-red-500/10 border-red-500/30",
};

const voteIcons = {
  approve: CheckCircle2,
  hold: Pause,
  reject: XCircle,
};

export function DealRoomSection() {
  const [activeTab, setActiveTab] = useState<"deal-room" | "chat" | "swarm">("deal-room");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const approveCount = swarmAgents.filter((a) => a.vote === "approve").length;

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    setMessages([...messages, { role: "user", message: chatInput, time: "Just now" }]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          message: `₹20K = $30K SDR team. ${mockLead.company} can see 4.2x pipeline growth in 90 days. Acme closed at the same price yesterday. Want me to send the payment link?`,
          time: "Just now",
        },
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Lead Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{mockLead.name}</h2>
            <p className="text-sm text-muted-foreground">
              {mockLead.title} at {mockLead.company}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs border-border">
                {mockLead.industry}
              </Badge>
              <Badge variant="outline" className="text-xs border-border">
                {mockLead.companySize} employees
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Deal Health</p>
            <p className="text-2xl font-bold text-emerald-400">{dealRoomData.pricing.win_probability}%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
        {(["deal-room", "chat", "swarm"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all capitalize flex items-center gap-2",
              activeTab === tab
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "deal-room" && <Target className="w-4 h-4" />}
            {tab === "chat" && <MessageSquare className="w-4 h-4" />}
            {tab === "swarm" && <Users className="w-4 h-4" />}
            {tab === "deal-room" ? "Deal Room" : tab === "chat" ? "Sales Co-Pilot" : `Swarm (${approveCount}/10)`}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "deal-room" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pricing Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-chart-2/10 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CircleDollarSign className="w-5 h-5 text-primary" />
                  AI Recommended Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Recommended Offer</p>
                    <p className="text-2xl font-bold text-foreground">₹{dealRoomData.pricing.recommended_offer.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">/month</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Win Probability</p>
                    <p className="text-2xl font-bold text-emerald-400">{dealRoomData.pricing.win_probability}%</p>
                    <Progress value={dealRoomData.pricing.win_probability} className="mt-2 h-1.5" />
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Installments</p>
                    <p className="text-xl font-bold text-foreground">{dealRoomData.pricing.installments}</p>
                    <p className="text-xs text-emerald-400 mt-1">Available</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">vs Competitors</p>
                    <p className="text-sm font-medium text-foreground">{dealRoomData.pricing.competitor_comparison}</p>
                    <p className="text-xs text-emerald-400 mt-1">50% better value</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROI Calculator */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  ROI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <p className="text-sm font-medium text-emerald-400">Pipeline Increase</p>
                    </div>
                    <p className="text-xl font-bold text-foreground">{dealRoomData.roi_calculator.pipeline_increase}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium text-primary">Timeframe</p>
                    </div>
                    <p className="text-xl font-bold text-foreground">{dealRoomData.roi_calculator.timeframe}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeCheck className="w-5 h-5 text-amber-400" />
                      <p className="text-sm font-medium text-amber-400">Break Even</p>
                    </div>
                    <p className="text-xl font-bold text-foreground">{dealRoomData.roi_calculator.break_even}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Studies */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Similar Wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dealRoomData.case_studies.map((study, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{study.company}</p>
                          <p className="text-sm text-muted-foreground">Closed at {study.closed}</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        {study.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Objection Responses */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Objection Playbook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(dealRoomData.objection_responses).map(([key, response]) => (
                  <div key={key} className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-xs font-medium text-amber-400 mb-1 capitalize">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-foreground">{response}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Urgency Close */}
            <Card className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border-amber-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Close Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-card/50 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Timer className="w-4 h-4 text-amber-400" />
                    <p className="text-sm font-medium text-amber-400">Limited Spots</p>
                  </div>
                  <p className="text-sm text-foreground">{dealRoomData.urgency_close.limited_spots}</p>
                </div>
                <div className="p-3 rounded-lg bg-card/50 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    <p className="text-sm font-medium text-emerald-400">Social Proof</p>
                  </div>
                  <p className="text-sm text-foreground">{dealRoomData.urgency_close.social_proof}</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground">
                  <Send className="w-4 h-4 mr-2" />
                  Send Payment Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border h-[600px] flex flex-col">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Sales Co-Pilot
                  </CardTitle>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    AI Powered
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3",
                        msg.role === "user" ? "flex-row-reverse" : ""
                      )}
                    >
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback
                          className={cn(
                            "text-xs",
                            msg.role === "lead"
                              ? "bg-secondary text-foreground"
                              : msg.role === "ai"
                              ? "bg-primary/20 text-primary"
                              : "bg-emerald-500/20 text-emerald-400"
                          )}
                        >
                          {msg.role === "lead" ? mockLead.name[0] : msg.role === "ai" ? "AI" : "You"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[80%] p-3 rounded-lg",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : msg.role === "ai"
                            ? "bg-gradient-to-r from-primary/20 to-chart-2/20 border border-primary/30"
                            : "bg-secondary"
                        )}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-gradient-to-r from-primary/20 to-chart-2/20 border border-primary/30 p-3 rounded-lg">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your response..."
                      className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button onClick={handleSendMessage} className="bg-primary text-primary-foreground">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Responses */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Quick Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(dealRoomData.objection_responses).map(([key, response]) => (
                  <Button
                    key={key}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 border-border"
                    onClick={() => setChatInput(response)}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs line-clamp-2">{response}</span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-chart-2/10 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Deal Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Deal Size</span>
                  <span className="font-medium text-foreground">₹{dealRoomData.pricing.recommended_offer.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Health</span>
                  <span className="font-medium text-emerald-400">{dealRoomData.pricing.win_probability}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Swarm Vote</span>
                  <span className="font-medium text-foreground">{approveCount}/10 CLOSE NOW</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "swarm" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Swarm Overview */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    10 Revenue Agents Voting
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      {approveCount} Approve
                    </Badge>
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                      {swarmAgents.filter((a) => a.vote === "hold").length} Hold
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {swarmAgents.map((agent) => {
                    const Icon = agent.icon;
                    const VoteIcon = voteIcons[agent.vote as keyof typeof voteIcons];
                    return (
                      <div
                        key={agent.id}
                        className={cn(
                          "p-4 rounded-lg border transition-all",
                          voteColors[agent.vote as keyof typeof voteColors]
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-sm">{agent.name}</span>
                          </div>
                          <VoteIcon className="w-5 h-5" />
                        </div>
                        <p className="text-xs text-foreground/80">{agent.reason}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Swarm Decision */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-primary/10 border-emerald-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Swarm Decision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-4 border-emerald-500/40 flex items-center justify-center mb-3">
                    <span className="text-3xl font-bold text-emerald-400">{approveCount}/10</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-400">CLOSE NOW</p>
                  <p className="text-sm text-muted-foreground mt-1">High confidence deal</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Approve</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(approveCount / 10) * 100} className="w-24 h-2" />
                      <span className="font-medium text-emerald-400">{approveCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hold</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(swarmAgents.filter((a) => a.vote === "hold").length / 10) * 100} className="w-24 h-2 [&>div]:bg-amber-400" />
                      <span className="font-medium text-amber-400">{swarmAgents.filter((a) => a.vote === "hold").length}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-emerald-500 to-primary text-primary-foreground">
                  <Send className="w-4 h-4 mr-2" />
                  Execute Close Sequence
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Recommended Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-foreground">Send payment link with ₹25K offer and 3x installment option. Mention limited Pro slots.</p>
                </div>
                <Button variant="outline" className="w-full border-border">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Demo Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
