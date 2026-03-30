"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import type {
  Lead,
  DealRoomData,
  RASData,
  ChatMessage,
  SwarmAgent,
  AgentVote,
} from "@/lib/types";
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
  Award,
  Star,
  CheckCircle2,
  XCircle,
  Pause,
  Send,
  Sparkles,
  MessageSquare,
  Building2,
  ChevronRight,
  BarChart3,
  ArrowUpRight,
  Timer,
  BadgeCheck,
  CircleDollarSign,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// ==========================================
// API Integration Hooks (Ready for Backend)
// ==========================================
import { useLead, useDealRoom, useRAS, useChatSession, useSendChatMessage, useLeadScoring, useEnrichLead } from "@/lib/hooks/use-api";

// ==========================================
// Mock Data (Replace with API responses)
// ==========================================

const mockLead: Lead = {
  id: "lead-001",
  name: "Rahul Sharma",
  company: "TechFlow Solutions",
  title: "Head of Sales",
  industry: "SaaS",
  companySize: "50-200",
  email: "rahul@techflow.io",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockDealRoomData: DealRoomData = {
  id: "dr-001",
  leadId: "lead-001",
  pricing: {
    recommended_offer: 25000,
    win_probability: 92,
    installments: "3x ₹8333",
    competitor_comparison: "Apollo = ₹40K, less AI",
    currency: "INR",
  },
  roi_calculator: {
    pipeline_increase: "150K → 630K (4.2x)",
    timeframe: "90 days",
    break_even: "Month 2",
    roi_multiplier: 4.2,
  },
  case_studies: [
    { id: "cs-1", company: "CloudScale SaaS", closed: "₹28K", result: "3x pipeline in 60 days", industry: "SaaS" },
    { id: "cs-2", company: "DataDrive Startup", closed: "₹22K", result: "42% faster closes", industry: "Tech" },
    { id: "cs-3", company: "GrowthHub Tech", closed: "₹30K", result: "5.2x ROI in Q1", industry: "SaaS" },
  ],
  objection_responses: [
    { key: "too_expensive", label: "Too Expensive", response: "₹20K = $30K SDR team. Competitors pay 2x more." },
    { key: "need_time", label: "Need Time", response: "24hr onboarding, ROI in 30 days." },
    { key: "competitors", label: "Competitors", response: "Apollo finds leads. We close them." },
    { key: "integration", label: "Integration", response: "HubSpot/Pipedrive in 5 mins. Onboard tomorrow." },
  ],
  urgency_close: {
    limited_spots: "Only 3 Pro slots left this month",
    social_proof: "Acme closed yesterday at ₹25K",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockSwarmAgents: SwarmAgent[] = [
  { id: "pricing", name: "Pricing Agent", shortName: "P", iconType: "pricing", vote: "approve", confidence: 94, reason: "Price point optimal for company size" },
  { id: "risk", name: "Risk Agent", shortName: "R", iconType: "risk", vote: "approve", confidence: 88, reason: "Low churn probability (8%)" },
  { id: "upsell", name: "Upsell Agent", shortName: "U", iconType: "upsell", vote: "approve", confidence: 91, reason: "Enterprise upgrade likely in Q3" },
  { id: "timing", name: "Timing Agent", shortName: "T", iconType: "timing", vote: "approve", confidence: 85, reason: "Budget cycle ends next week" },
  { id: "competition", name: "Competition Agent", shortName: "C", iconType: "competition", vote: "hold", confidence: 67, reason: "Competitor demo scheduled" },
  { id: "capacity", name: "Capacity Agent", shortName: "Ca", iconType: "capacity", vote: "approve", confidence: 92, reason: "Onboarding slots available" },
  { id: "momentum", name: "Momentum Agent", shortName: "M", iconType: "momentum", vote: "approve", confidence: 95, reason: "4 touchpoints this week" },
  { id: "budget", name: "Budget Agent", shortName: "B", iconType: "budget", vote: "approve", confidence: 89, reason: "Company raised Series A" },
  { id: "authority", name: "Authority Agent", shortName: "A", iconType: "authority", vote: "approve", confidence: 93, reason: "Decision maker engaged" },
  { id: "fit", name: "Fit Agent", shortName: "F", iconType: "fit", vote: "approve", confidence: 95, reason: "95% ICP match score" },
];

const mockRASData: RASData = {
  id: "ras-001",
  leadId: "lead-001",
  dealId: "deal-001",
  approveCount: 9,
  holdCount: 1,
  rejectCount: 0,
  agents: mockSwarmAgents,
  recommendedAction: "SEND $25K PROPOSAL",
  decision: "close_now",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const initialMessages: ChatMessage[] = [
  {
    id: "msg-001",
    role: "lead",
    message: "Hi, I saw your demo. The AI looks impressive but honestly the pricing seems a bit steep for us.",
    time: "2 min ago",
    timestamp: new Date().toISOString(),
  },
];

// ==========================================
// Agent Icon Mapping
// ==========================================

const agentIcons: Record<SwarmAgent["iconType"], typeof DollarSign> = {
  pricing: DollarSign,
  risk: AlertTriangle,
  upsell: TrendingUp,
  timing: Clock,
  competition: Target,
  capacity: Zap,
  momentum: ArrowUpRight,
  budget: Briefcase,
  authority: Shield,
  fit: Award,
};

const voteColors: Record<AgentVote, string> = {
  approve: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  hold: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  reject: "text-red-400 bg-red-500/10 border-red-500/30",
};

const voteIcons: Record<AgentVote, typeof CheckCircle2> = {
  approve: CheckCircle2,
  hold: Pause,
  reject: XCircle,
};

// ==========================================
// Component Props Interface
// ==========================================

interface DealRoomSectionProps {
  leadId?: string;
  // TODO: These will come from API when backend is connected
  // lead?: Lead;
  // dealRoomData?: DealRoomData;
  // rasData?: RASData;
}

export function DealRoomSection({ leadId }: DealRoomSectionProps) {
  // ==========================================
  // State Management
  // ==========================================
  const [activeTab, setActiveTab] = useState<"deal-room" | "chat" | "swarm">("deal-room");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingPayment, setIsSendingPayment] = useState(false);

  // ==========================================
  // API Data
  // ==========================================
  const defaultLeadId = leadId?.replace("lead-", "") || "1";
  const { data: lead, isLoading: leadLoading } = useLead(defaultLeadId);
  const { data: dealRoom, isLoading: dealRoomLoading, mutate: mutateDealRoom } = useDealRoom(defaultLeadId);
  const { data: ras, isLoading: rasLoading, mutate: mutateRas } = useRAS(defaultLeadId);
  const { data: chatSession } = useChatSession(defaultLeadId);
  const { data: scoreData, isMutating: isScoring, trigger: triggerScore } = useLeadScoring();
  const { data: enrichmentData, isMutating: isEnriching, trigger: triggerEnrich } = useEnrichLead();

  useEffect(() => {
    if (lead && !scoreData && !isScoring) {
      triggerScore({
        leadData: {
          company: lead.company,
          title: lead.title,
          industry: lead.industry,
          companySize: lead.companySize,
        }
      });
    }
    
    if (defaultLeadId && !enrichmentData && !isEnriching) {
      triggerEnrich({ leadId: defaultLeadId });
    }
  }, [lead, scoreData, isScoring, triggerScore, defaultLeadId, enrichmentData, isEnriching, triggerEnrich]);

  // Safe Parsing of API Response (API returns different shape than TypeScript types)
  const rawDealRoom = dealRoom as any;
  const rawRas = ras as any;
  const analytics = rawDealRoom?.analytics || {};
  const copywriting = rawDealRoom?.copywriting || {};
  const safeWinProb = analytics?.win_probability ?? mockDealRoomData.pricing.win_probability;
  const safePrice = analytics?.recommended_price ?? mockDealRoomData.pricing.recommended_offer;
  const safeRoiStr = analytics?.roi_prediction ?? mockDealRoomData.roi_calculator.pipeline_increase;
  const rawCompetitorComparison = copywriting?.competitor_comparison;
  const formattedCompetitors = Array.isArray(rawCompetitorComparison) && rawCompetitorComparison.length > 0 
    ? rawCompetitorComparison.map((c: any) => `${c.competitor_name}: ${c.our_advantage}`).join(', ') 
    : mockDealRoomData.pricing.competitor_comparison;
  
  const rawObjections = analytics?.objection_playbook || mockDealRoomData.objection_responses;

  // Safe parsing for RAS
  const rasDimensions = rawRas?.dimensions || {};
  const rasApproveCount = rawRas?.status === "approve" ? 8 : (rawRas?.average_score > 50 ? 6 : 4);
  const rasAverage = rawRas?.average_score || 0;
  
  const leadScore = scoreData?.score !== undefined ? scoreData.score : safeWinProb;

  // ==========================================
  // Smart Fallback: use API data or mock data
  // ==========================================
  // If API is still loading, show skeleton; if data fails/not available, use mocks
  const isDataLoading = leadLoading || dealRoomLoading || rasLoading;
  
  // Resolve actual lead — prefer API, fallback to mock
  const activeLead: Lead = (lead && !leadLoading) ? {
    ...mockLead,
    id: String((lead as any).id || (lead as any).lead_id || mockLead.id),
    name: `${(lead as any).first_name || ''} ${(lead as any).last_name || ''}`.trim() || (lead as any).name || mockLead.name,
    company: (lead as any).company || mockLead.company,
    title: (lead as any).title || mockLead.title,
    industry: (lead as any).industry || mockLead.industry,
    companySize: (lead as any).company_size || mockLead.companySize,
    email: (lead as any).email || mockLead.email,
    createdAt: (lead as any).created_at || mockLead.createdAt,
    updatedAt: (lead as any).updated_at || mockLead.updatedAt,
  } : mockLead;

  // ==========================================
  // Event Handlers (Ready for API Integration)
  // ==========================================

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      message: chatInput,
      time: "Just now",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    setIsTyping(true);

    // TODO: Replace with API call
    // await sendMessage({ sessionId: chatSession?.id, message: chatInput });
    
    // Simulate AI response (remove when API is connected)
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "ai",
        message: `₹20K = $30K SDR team. ${activeLead.company} can see 4.2x pipeline growth in 90 days. Acme closed at the same price yesterday. Want me to send the payment link?`,
        time: "Just now",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  }, [chatInput, activeLead.company]);

  const handleSendPaymentLink = useCallback(async () => {
    setIsSendingPayment(true);
    
    // TODO: Replace with API call
    // await dealRoomApi.sendPaymentLink(leadId, dealRoom.pricing.recommended_offer);
    
    // Simulate API call
    setTimeout(() => {
      setIsSendingPayment(false);
      // Show success toast or notification
      console.log("[v0] Payment link sent successfully");
    }, 1500);
  }, []);

  const handleRefreshData = useCallback(async () => {
    setIsLoading(true);
    
    // TODO: Replace with SWR mutate to refetch data
    // await mutate(`/deal-room/lead/${leadId}`);
    // await mutate(`/ras/lead/${leadId}`);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleQuickResponse = useCallback((response: string) => {
    setChatInput(response);
  }, []);

  // Now we can safely perform our early return
  if (isDataLoading && !lead && !dealRoom && !ras) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading deal room data...</p>
      </div>
    );
  }

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="space-y-6">
      {/* Lead Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{activeLead.name}</h2>
            <p className="text-sm text-muted-foreground">
              {activeLead.title} at {activeLead.company}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs border-border">
                {activeLead.industry}
              </Badge>
              <Badge variant="outline" className="text-xs border-border">
                {activeLead.companySize} employees
              </Badge>
              {(!leadId || defaultLeadId === "1") && (
                <Badge className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/20">
                  Demo Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefreshData}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Deal Health</p>
            <p className="text-2xl font-bold text-emerald-400">{isScoring ? "..." : leadScore}%</p>
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
            {tab === "deal-room" ? "Deal Room" : tab === "chat" ? "Sales Co-Pilot" : `Swarm (${rasApproveCount}/10)`}
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
                    <p className="text-2xl font-bold text-foreground">
                      {mockDealRoomData.pricing.currency === "INR" ? "₹" : "$"}
                      {safePrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">/month</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Win Probability</p>
                    <p className="text-2xl font-bold text-emerald-400">{isScoring ? "..." : leadScore}%</p>
                    <Progress value={leadScore} className="mt-2 h-1.5" />
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Installments</p>
                    <p className="text-xl font-bold text-foreground">{mockDealRoomData.pricing.installments}</p>
                    <p className="text-xs text-emerald-400 mt-1">Available</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">vs Competitors</p>
                    <p className="text-sm font-medium text-foreground line-clamp-2">{formattedCompetitors}</p>
                    <p className="text-xs text-emerald-400 mt-1">Based on Analysis</p>
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
                      <p className="text-sm font-medium text-emerald-400">ROI Prediction</p>
                    </div>
                    <p className="text-lg font-bold text-foreground line-clamp-2">{safeRoiStr}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium text-primary">Timeframe</p>
                    </div>
                    <p className="text-xl font-bold text-foreground">{mockDealRoomData.roi_calculator.timeframe}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeCheck className="w-5 h-5 text-amber-400" />
                      <p className="text-sm font-medium text-amber-400">Break Even</p>
                    </div>
                    <p className="text-xl font-bold text-foreground">{mockDealRoomData.roi_calculator.break_even}</p>
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
                  {mockDealRoomData.case_studies.map((study) => (
                    <div
                      key={study.id}
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
                {rawObjections.map((objection: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-xs font-medium text-amber-400 mb-1 capitalize">
                      {objection.label || objection.objection}
                    </p>
                    <p className="text-sm text-foreground">{objection.response}</p>
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
                  <p className="text-sm text-foreground">{mockDealRoomData.urgency_close.limited_spots}</p>
                </div>
                <div className="p-3 rounded-lg bg-card/50 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    <p className="text-sm font-medium text-emerald-400">Social Proof</p>
                  </div>
                  <p className="text-sm text-foreground">{mockDealRoomData.urgency_close.social_proof}</p>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground"
                  onClick={handleSendPaymentLink}
                  disabled={isSendingPayment}
                >
                  {isSendingPayment ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isSendingPayment ? "Sending..." : "Send Payment Link"}
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
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
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
                          {msg.role === "lead" ? activeLead.name[0] : msg.role === "ai" ? "AI" : "You"}
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
                    <Button onClick={handleSendMessage} className="bg-primary text-primary-foreground" disabled={isTyping}>
                      {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
                {rawObjections.map((objection: any, i: number) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 border-border"
                    onClick={() => handleQuickResponse(objection.response)}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs line-clamp-2">{objection.response}</span>
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
                  <span className="font-medium text-foreground">
                    {mockDealRoomData.pricing.currency === "INR" ? "₹" : "$"}
                    {safePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Health</span>
                  <span className="font-medium text-emerald-400">{isScoring ? "..." : leadScore}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Swarm Vote</span>
                  <span className="font-medium text-foreground">{rasApproveCount}/10 AGREE</span>
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
                      {rasApproveCount} Approve
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(rasDimensions).map(([key, value]) => {
                    const agentName = key.replace("_score", "").toUpperCase() + " AGENT";
                    const Confidence = Number(value) || 0;
                    return (
                      <div
                        key={key}
                        className={cn(
                          "p-4 rounded-lg border transition-all",
                          Confidence >= 70 ? voteColors.approve : voteColors.hold
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                              <Star className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="font-medium text-sm">{agentName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold">{Confidence}%</span>
                            {Confidence >= 70 ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                               <Pause className="w-5 h-5 text-amber-400" />
                            )}
                          </div>
                        </div>
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
                    <span className="text-3xl font-bold text-emerald-400">{rasAverage.toFixed(0)}</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-400">
                    {rawRas?.status === "approve" ? "APPROVE DEAL" : "HOLD DEAL"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Based on deepseek analysis</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Approve Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={rasAverage} className="w-24 h-2" />
                      <span className="font-medium text-emerald-400">{rasAverage.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-primary text-primary-foreground"
                  onClick={handleSendPaymentLink}
                  disabled={isSendingPayment}
                >
                  {isSendingPayment ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
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
                  <p className="text-sm text-foreground">
                    Based on {safeWinProb}% win probability, proceed to close sequence with deepseek generated value props.
                  </p>
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
