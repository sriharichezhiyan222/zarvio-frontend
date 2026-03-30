"use client";

import { useSyncExternalStore } from "react";
import type { ActionRecord, CampaignRecord, DealRecord, LeadRecord, DealStage } from "@/lib/crm";

interface CrmState {
  leads: LeadRecord[];
  campaigns: CampaignRecord[];
  actions: ActionRecord[];
  deals: DealRecord[];
  selectedLead?: LeadRecord;
  selectedCampaign?: CampaignRecord;
  loading: boolean;
}

type Listener = () => void;

const state: CrmState = {
  leads: [],
  campaigns: [],
  actions: [],
  deals: [],
  loading: false,
};

const listeners = new Set<Listener>();

const setState = (partial: Partial<CrmState>) => {
  Object.assign(state, partial);
  listeners.forEach((listener) => listener());
};

const upsertById = <T extends { id: string }>(items: T[], item: T) => {
  const index = items.findIndex((existing) => existing.id === item.id);
  if (index === -1) return [item, ...items];
  const next = [...items];
  next[index] = item;
  return next;
};

const actions = {
  setLoading: (loading: boolean) => setState({ loading }),
  setLeads: (leads: LeadRecord[]) => setState({ leads }),
  setCampaigns: (campaigns: CampaignRecord[]) => setState({ campaigns }),
  setActions: (items: ActionRecord[]) => setState({ actions: items }),
  setDeals: (deals: DealRecord[]) => setState({ deals }),
  upsertLead: (lead: LeadRecord) => setState({ leads: upsertById(state.leads, lead) }),
  upsertCampaign: (campaign: CampaignRecord) => setState({ campaigns: upsertById(state.campaigns, campaign) }),
  addAction: (action: ActionRecord) => setState({ actions: upsertById(state.actions, action) }),
  upsertDeal: (deal: DealRecord) => setState({ deals: upsertById(state.deals, deal) }),
  setSelectedLead: (selectedLead?: LeadRecord) => setState({ selectedLead }),
  setSelectedCampaign: (selectedCampaign?: CampaignRecord) => setState({ selectedCampaign }),
  assignLeadToCampaign: (leadId: string, campaignId: string) =>
    setState({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === campaignId && !campaign.leadIds.includes(leadId)
          ? { ...campaign, leadIds: [...campaign.leadIds, leadId] }
          : campaign
      ),
    }),
  moveDealStage: (dealId: string, stage: DealStage) =>
    setState({ deals: state.deals.map((deal) => (deal.id === dealId ? { ...deal, stage, updatedAt: new Date().toISOString() } : deal)) }),
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useCrmStore() {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => state);
  return { ...snapshot, ...actions };
}
