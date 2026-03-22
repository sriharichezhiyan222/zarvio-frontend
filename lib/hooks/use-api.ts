"use client";

import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import type {
  Lead,
  Deal,
  DealRoomData,
  RASData,
  ChatSession,
  Campaign,
  Customer,
  TeamMember,
  ForecastData,
  PipelineStage,
} from "../types";

// ==========================================
// SWR Fetcher
// ==========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${url}`);
  if (!res.ok) {
    throw new Error("API request failed");
  }
  const json = await res.json();
  return json.data;
};

const postFetcher = async <T>(
  url: string,
  { arg }: { arg: Record<string, unknown> }
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
  if (!res.ok) {
    throw new Error("API request failed");
  }
  const json = await res.json();
  return json.data;
};

// ==========================================
// Lead Hooks
// ==========================================

export function useLeads(page = 1, limit = 20, config?: SWRConfiguration) {
  return useSWR<Lead[]>(
    `/leads?page=${page}&limit=${limit}`,
    fetcher,
    config
  );
}

export function useLead(id: string | null, config?: SWRConfiguration) {
  return useSWR<Lead>(id ? `/leads/${id}` : null, fetcher, config);
}

export function useLeadSearch() {
  return useSWRMutation<Lead[], Error, string, { query: string; filters?: Record<string, string> }>(
    "/leads/search",
    (url, { arg }) => postFetcher(url, { arg })
  );
}

// ==========================================
// Deal Room Hooks
// ==========================================

export function useDealRoom(leadId: string | null, config?: SWRConfiguration) {
  return useSWR<DealRoomData>(
    leadId ? `/deal-room/lead/${leadId}` : null,
    fetcher,
    config
  );
}

export function useDealRoomByDeal(dealId: string | null, config?: SWRConfiguration) {
  return useSWR<DealRoomData>(
    dealId ? `/deal-room/deal/${dealId}` : null,
    fetcher,
    config
  );
}

export function useGeneratePricing() {
  return useSWRMutation<DealRoomData["pricing"], Error, string, { leadId: string }>(
    "/deal-room/generate-pricing",
    (url, { arg }) => postFetcher(url, { arg })
  );
}

export function useGenerateROI() {
  return useSWRMutation<DealRoomData["roi_calculator"], Error, string, { leadId: string; currentPipeline?: number }>(
    "/deal-room/generate-roi",
    (url, { arg }) => postFetcher(url, { arg })
  );
}

export function useSendPaymentLink() {
  return useSWRMutation<{ paymentLink: string }, Error, string, { leadId: string; amount: number; installments?: string }>(
    "/deal-room/send-payment",
    (url, { arg }) => postFetcher(url, { arg })
  );
}

// ==========================================
// Revenue Agent Swarm (RAS) Hooks
// ==========================================

export function useRAS(leadId: string | null, config?: SWRConfiguration) {
  return useSWR<RASData>(
    leadId ? `/ras/lead/${leadId}` : null,
    fetcher,
    config
  );
}

export function useRASByDeal(dealId: string | null, config?: SWRConfiguration) {
  return useSWR<RASData>(
    dealId ? `/ras/deal/${dealId}` : null,
    fetcher,
    config
  );
}

export function useRunSwarmAnalysis() {
  return useSWRMutation<RASData, Error, string, { leadId: string }>(
    "/ras/analyze",
    (url, { arg }) => postFetcher(url, { arg })
  );
}

export function useExecuteRecommendation() {
  return useSWRMutation<{ success: boolean; nextSteps: string[] }, Error, string, { leadId: string; action: string }>(
    "/ras/execute",
    (url, { arg }) => postFetcher(url, { arg })
  );
}

// ==========================================
// Chat / Sales Co-Pilot Hooks
// ==========================================

export function useChatSession(leadId: string | null, config?: SWRConfiguration) {
  return useSWR<ChatSession>(
    leadId ? `/chat/session/${leadId}` : null,
    fetcher,
    config
  );
}

export function useSendChatMessage() {
  return useSWRMutation<ChatSession["messages"][0], Error, string, { sessionId: string; message: string }>(
    "/chat/send",
    (url, { arg }) => postFetcher(url, { arg })
  );
}

export function useAiSuggestion() {
  return useSWRMutation<{ suggestion: string }, Error, string, { sessionId: string; context: string }>(
    "/chat/ai-suggest",
    (url, { arg }) => postFetcher(url, { arg })
  );
}

// ==========================================
// Campaign Hooks
// ==========================================

export function useCampaigns(page = 1, limit = 20, config?: SWRConfiguration) {
  return useSWR<Campaign[]>(
    `/campaigns?page=${page}&limit=${limit}`,
    fetcher,
    config
  );
}

export function useCampaign(id: string | null, config?: SWRConfiguration) {
  return useSWR<Campaign>(id ? `/campaigns/${id}` : null, fetcher, config);
}

export function useCampaignStats(id: string | null, config?: SWRConfiguration) {
  return useSWR<{ opened: number; replied: number; meetings: number; conversions: number }>(
    id ? `/campaigns/${id}/stats` : null,
    fetcher,
    config
  );
}

// ==========================================
// Deal Hooks
// ==========================================

export function useDeals(page = 1, limit = 20, config?: SWRConfiguration) {
  return useSWR<Deal[]>(
    `/deals?page=${page}&limit=${limit}`,
    fetcher,
    config
  );
}

export function useDeal(id: string | null, config?: SWRConfiguration) {
  return useSWR<Deal>(id ? `/deals/${id}` : null, fetcher, config);
}

export function usePipeline(config?: SWRConfiguration) {
  return useSWR<PipelineStage[]>("/deals/pipeline", fetcher, config);
}

export function useUpdateDealStage() {
  return useSWRMutation<Deal, Error, string, { id: string; stage: Deal["stage"] }>(
    "/deals/stage",
    (url, { arg }) => postFetcher(`/deals/${arg.id}/stage`, { arg: { stage: arg.stage } })
  );
}

// ==========================================
// Customer Hooks
// ==========================================

export function useCustomers(page = 1, limit = 20, config?: SWRConfiguration) {
  return useSWR<Customer[]>(
    `/customers?page=${page}&limit=${limit}`,
    fetcher,
    config
  );
}

export function useCustomer(id: string | null, config?: SWRConfiguration) {
  return useSWR<Customer>(id ? `/customers/${id}` : null, fetcher, config);
}

export function useAtRiskCustomers(config?: SWRConfiguration) {
  return useSWR<Customer[]>("/customers/at-risk", fetcher, config);
}

// ==========================================
// Team Hooks
// ==========================================

export function useTeam(config?: SWRConfiguration) {
  return useSWR<TeamMember[]>("/team", fetcher, config);
}

export function useTeamMember(id: string | null, config?: SWRConfiguration) {
  return useSWR<TeamMember>(id ? `/team/${id}` : null, fetcher, config);
}

export function useLeaderboard(config?: SWRConfiguration) {
  return useSWR<TeamMember[]>("/team/leaderboard", fetcher, config);
}

// ==========================================
// Forecast Hooks
// ==========================================

export function useForecast(
  period: "monthly" | "quarterly" = "monthly",
  count = 6,
  config?: SWRConfiguration
) {
  return useSWR<ForecastData[]>(
    `/forecast/${period}?${period === "monthly" ? "months" : "quarters"}=${count}`,
    fetcher,
    config
  );
}

export function useForecastPipeline(config?: SWRConfiguration) {
  return useSWR<PipelineStage[]>("/forecast/pipeline", fetcher, config);
}
