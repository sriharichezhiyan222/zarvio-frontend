import type {
  ApiResponse,
  PaginatedResponse,
  Lead,
  Deal,
  DealRoomData,
  RASData,
  ChatSession,
  ChatMessage,
  Campaign,
  Customer,
  TeamMember,
  ForecastData,
  PipelineStage,
  OutreachEmail,
  OutreachCall,
  OutreachMessage,
  ReportMetric,
  OverviewStats,
  ForecastSummary,
} from "./types";

// ==========================================
// API Configuration
// ==========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ==========================================
// Lead API
// ==========================================

export const leadApi = {
  getAll: (page = 1, limit = 20) =>
    apiRequest<PaginatedResponse<Lead>>(`/leads?page=${page}&limit=${limit}`),

  getById: (id: string) => apiRequest<Lead>(`/leads/${id}`),

  create: (data: Partial<Lead>) =>
    apiRequest<Lead>("/leads", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Lead>) =>
    apiRequest<Lead>(`/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/leads/${id}`, {
      method: "DELETE",
    }),

  search: (query: string, filters?: Record<string, string>) =>
    apiRequest<Lead[]>(`/leads/search?q=${query}`, {
      method: "POST",
      body: JSON.stringify(filters || {}),
    }),
};

// ==========================================
// Deal Room API
// ==========================================

export const dealRoomApi = {
  getByLeadId: (leadId: string) =>
    apiRequest<DealRoomData>(`/deal-room/lead/${leadId}`),

  getByDealId: (dealId: string) =>
    apiRequest<DealRoomData>(`/deal-room/deal/${dealId}`),

  generatePricing: (leadId: string) =>
    apiRequest<DealRoomData["pricing"]>(`/deal-room/generate-pricing`, {
      method: "POST",
      body: JSON.stringify({ leadId }),
    }),

  generateROI: (leadId: string, inputs?: { currentPipeline?: number }) =>
    apiRequest<DealRoomData["roi_calculator"]>(`/deal-room/generate-roi`, {
      method: "POST",
      body: JSON.stringify({ leadId, ...inputs }),
    }),

  getCaseStudies: (industry: string, companySize: string) =>
    apiRequest<DealRoomData["case_studies"]>(
      `/deal-room/case-studies?industry=${industry}&companySize=${companySize}`
    ),

  getObjectionResponses: (leadId: string) =>
    apiRequest<DealRoomData["objection_responses"]>(
      `/deal-room/objections/${leadId}`
    ),

  sendPaymentLink: (leadId: string, amount: number, installments?: string) =>
    apiRequest<{ paymentLink: string }>(`/deal-room/send-payment`, {
      method: "POST",
      body: JSON.stringify({ leadId, amount, installments }),
    }),
};

// ==========================================
// Revenue Agent Swarm (RAS) API
// ==========================================

export const rasApi = {
  getByLeadId: (leadId: string) => apiRequest<RASData>(`/ras/lead/${leadId}`),

  getByDealId: (dealId: string) => apiRequest<RASData>(`/ras/deal/${dealId}`),

  runSwarmAnalysis: (leadId: string) =>
    apiRequest<RASData>(`/ras/analyze`, {
      method: "POST",
      body: JSON.stringify({ leadId }),
    }),

  getAgentDetails: (leadId: string, agentId: string) =>
    apiRequest<RASData["agents"][0]>(`/ras/lead/${leadId}/agent/${agentId}`),

  executeRecommendation: (leadId: string, action: string) =>
    apiRequest<{ success: boolean; nextSteps: string[] }>(`/ras/execute`, {
      method: "POST",
      body: JSON.stringify({ leadId, action }),
    }),
};

// ==========================================
// Chat / Sales Co-Pilot API
// ==========================================

export const chatApi = {
  getSession: (leadId: string) =>
    apiRequest<ChatSession>(`/chat/session/${leadId}`),

  getMessages: (sessionId: string) =>
    apiRequest<ChatMessage[]>(`/chat/messages/${sessionId}`),

  sendMessage: (sessionId: string, message: string) =>
    apiRequest<ChatMessage>(`/chat/send`, {
      method: "POST",
      body: JSON.stringify({ sessionId, message }),
    }),

  getAiSuggestion: (sessionId: string, context: string) =>
    apiRequest<{ suggestion: string }>(`/chat/ai-suggest`, {
      method: "POST",
      body: JSON.stringify({ sessionId, context }),
    }),

  generateResponse: (sessionId: string, objectionType: string) =>
    apiRequest<{ response: string }>(`/chat/generate-response`, {
      method: "POST",
      body: JSON.stringify({ sessionId, objectionType }),
    }),
};

// ==========================================
// Campaign API
// ==========================================

export const campaignApi = {
  getAll: (page = 1, limit = 20) =>
    apiRequest<PaginatedResponse<Campaign>>(
      `/campaigns?page=${page}&limit=${limit}`
    ),

  getById: (id: string) => apiRequest<Campaign>(`/campaigns/${id}`),

  create: (data: Partial<Campaign>) =>
    apiRequest<Campaign>("/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Campaign>) =>
    apiRequest<Campaign>(`/campaigns/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  pause: (id: string) =>
    apiRequest<Campaign>(`/campaigns/${id}/pause`, {
      method: "POST",
    }),

  resume: (id: string) =>
    apiRequest<Campaign>(`/campaigns/${id}/resume`, {
      method: "POST",
    }),

  getStats: (id: string) =>
    apiRequest<{
      opened: number;
      replied: number;
      meetings: number;
      conversions: number;
    }>(`/campaigns/${id}/stats`),
};

// ==========================================
// Deal API
// ==========================================

export const dealApi = {
  getAll: (page = 1, limit = 20) =>
    apiRequest<PaginatedResponse<Deal>>(`/deals?page=${page}&limit=${limit}`),

  getById: (id: string) => apiRequest<Deal>(`/deals/${id}`),

  create: (data: Partial<Deal>) =>
    apiRequest<Deal>("/deals", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Deal>) =>
    apiRequest<Deal>(`/deals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  updateStage: (id: string, stage: Deal["stage"]) =>
    apiRequest<Deal>(`/deals/${id}/stage`, {
      method: "PATCH",
      body: JSON.stringify({ stage }),
    }),

  getByStage: (stage: Deal["stage"]) =>
    apiRequest<Deal[]>(`/deals/stage/${stage}`),

  getPipeline: () => apiRequest<PipelineStage[]>(`/deals/pipeline`),

  getStats: () => apiRequest<OverviewStats>("/stats/overview"),
};

// ==========================================
// Customer API
// ==========================================

export const customerApi = {
  getAll: (page = 1, limit = 20) =>
    apiRequest<PaginatedResponse<Customer>>(
      `/customers?page=${page}&limit=${limit}`
    ),

  getById: (id: string) => apiRequest<Customer>(`/customers/${id}`),

  getAtRisk: () => apiRequest<Customer[]>(`/customers/at-risk`),

  updateHealthScore: (id: string, score: number) =>
    apiRequest<Customer>(`/customers/${id}/health`, {
      method: "PATCH",
      body: JSON.stringify({ healthScore: score }),
    }),
};

// ==========================================
// Team API
// ==========================================

export const teamApi = {
  getAll: () => apiRequest<TeamMember[]>(`/team`),

  getById: (id: string) => apiRequest<TeamMember>(`/team/${id}`),

  getPerformance: (id: string, period: "week" | "month" | "quarter" | "year") =>
    apiRequest<ReportMetric[]>(`/team/${id}/performance?period=${period}`),

  getLeaderboard: () =>
    apiRequest<TeamMember[]>(`/team/leaderboard`),
};

// ==========================================
// Forecasting API
// ==========================================

export const forecastApi = {
  getSummary: () => apiRequest<ForecastSummary>("/forecast"),
  
  getMonthly: (months = 6) =>
    apiRequest<ForecastData[]>(`/forecast/monthly?months=${months}`),

  getQuarterly: (quarters = 4) =>
    apiRequest<ForecastData[]>(`/forecast/quarterly?quarters=${quarters}`),

  getPipeline: () => apiRequest<PipelineStage[]>(`/forecast/pipeline`),

  updateTarget: (period: string, target: number) =>
    apiRequest<ForecastData>(`/forecast/target`, {
      method: "PATCH",
      body: JSON.stringify({ period, target }),
    }),
};

// ==========================================
// Outreach API
// ==========================================

export const outreachApi = {
  // Emails
  getEmails: (page = 1, limit = 20) =>
    apiRequest<PaginatedResponse<OutreachEmail>>(
      `/outreach/emails?page=${page}&limit=${limit}`
    ),

  sendEmail: (data: { to: string; subject: string; body: string }) =>
    apiRequest<OutreachEmail>(`/outreach/emails/send`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Calls
  getCalls: (page = 1, limit = 20) =>
    apiRequest<PaginatedResponse<OutreachCall>>(
      `/outreach/calls?page=${page}&limit=${limit}`
    ),

  logCall: (data: Partial<OutreachCall>) =>
    apiRequest<OutreachCall>(`/outreach/calls/log`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Messages
  getMessages: (page = 1, limit = 20) =>
    apiRequest<PaginatedResponse<OutreachMessage>>(
      `/outreach/messages?page=${page}&limit=${limit}`
    ),

  sendMessage: (data: { platform: string; to: string; content: string }) =>
    apiRequest<OutreachMessage>(`/outreach/messages/send`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ==========================================
// Reports API
// ==========================================

export const reportsApi = {
  getOverview: (period: "week" | "month" | "quarter" | "year") =>
    apiRequest<ReportMetric[]>(`/reports/overview?period=${period}`),

  getRevenue: (period: "week" | "month" | "quarter" | "year") =>
    apiRequest<{ data: { date: string; revenue: number }[] }>(
      `/reports/revenue?period=${period}`
    ),

  getConversions: (period: "week" | "month" | "quarter" | "year") =>
    apiRequest<{ data: { stage: string; count: number; rate: number }[] }>(
      `/reports/conversions?period=${period}`
    ),

  export: (
    type: "csv" | "pdf",
    report: string,
    period: "week" | "month" | "quarter" | "year"
  ) =>
    apiRequest<{ downloadUrl: string }>(
      `/reports/export?type=${type}&report=${report}&period=${period}`
    ),
};
