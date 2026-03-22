export type Section = 
  | "overview" 
  | "campaign" 
  | "deals" 
  | "deal-room"
  | "ras"
  | "customers" 
  | "team" 
  | "forecasting" 
  | "reports" 
  | "settings"
  | "outreach"
  | "lead-explorer"
  | "coming-soon"
  | "lead-radar"
  | "ghost-closer"
  | "lead-marketplace";

export type OutreachTab = "emails" | "phone" | "messages";

export type ComingSoonTab = "lead-radar" | "ghost-closer" | "lead-marketplace";

// ==========================================
// API-Ready Types for Backend Integration
// ==========================================

// Lead Types
export interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  industry: string;
  companySize: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Deal Room Types
export interface DealRoomPricing {
  recommended_offer: number;
  win_probability: number;
  installments: string;
  competitor_comparison: string;
  currency: string;
}

export interface DealRoomROI {
  pipeline_increase: string;
  timeframe: string;
  break_even: string;
  roi_multiplier: number;
}

export interface CaseStudy {
  id: string;
  company: string;
  closed: string;
  result: string;
  industry: string;
}

export interface ObjectionResponse {
  key: string;
  label: string;
  response: string;
}

export interface UrgencyClose {
  limited_spots: string;
  social_proof: string;
  deadline?: string;
}

export interface DealRoomData {
  id: string;
  leadId: string;
  pricing: DealRoomPricing;
  roi_calculator: DealRoomROI;
  case_studies: CaseStudy[];
  objection_responses: ObjectionResponse[];
  urgency_close: UrgencyClose;
  createdAt: string;
  updatedAt: string;
}

// Revenue Agent Swarm (RAS) Types
export type AgentVote = "approve" | "hold" | "reject";

export interface SwarmAgent {
  id: string;
  name: string;
  shortName: string;
  iconType: "pricing" | "risk" | "upsell" | "timing" | "competition" | "capacity" | "momentum" | "budget" | "authority" | "fit";
  vote: AgentVote;
  confidence: number;
  reason: string;
  detail?: string;
}

export interface RASData {
  id: string;
  leadId: string;
  dealId: string;
  approveCount: number;
  holdCount: number;
  rejectCount: number;
  agents: SwarmAgent[];
  recommendedAction: string;
  decision: "close_now" | "hold" | "nurture" | "disqualify";
  createdAt: string;
  updatedAt: string;
}

// Chat / Sales Co-Pilot Types
export type ChatMessageRole = "lead" | "user" | "ai";

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  message: string;
  time: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  leadId: string;
  dealId: string;
  messages: ChatMessage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  type: "email" | "linkedin" | "multi-channel";
  leads: number;
  opened: number;
  replied: number;
  meetings: number;
  createdAt: string;
  updatedAt: string;
}

// Deal Types
export interface Deal {
  id: string;
  leadId: string;
  name: string;
  company: string;
  value: number;
  currency: string;
  stage: "discovery" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  totalValue: number;
  currency: string;
  status: "active" | "churned" | "at_risk";
  healthScore: number;
  joinedAt: string;
  lastActivityAt: string;
}

// Team Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "sales_rep";
  avatar?: string;
  deals: number;
  revenue: number;
  currency: string;
  quota: number;
  quotaProgress: number;
  status: "online" | "offline" | "away";
}

// Forecasting Types
export interface ForecastData {
  period: string;
  actual: number;
  forecast: number;
  target: number;
  currency: string;
}

export interface PipelineStage {
  name: string;
  value: number;
  count: number;
  currency: string;
}

// Report Types
export interface ReportMetric {
  label: string;
  value: number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  currency?: string;
}

// Outreach Types
export interface OutreachEmail {
  id: string;
  subject: string;
  recipient: string;
  company: string;
  status: "sent" | "opened" | "replied" | "bounced";
  sentAt: string;
  openedAt?: string;
  repliedAt?: string;
}

export interface OutreachCall {
  id: string;
  contact: string;
  company: string;
  duration: number;
  outcome: "connected" | "voicemail" | "no_answer" | "scheduled";
  calledAt: string;
  notes?: string;
}

export interface OutreachMessage {
  id: string;
  platform: "linkedin" | "whatsapp" | "sms";
  recipient: string;
  company: string;
  status: "sent" | "read" | "replied";
  sentAt: string;
  content: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
