"use client";

import { useSyncExternalStore } from "react";
import type { ActionRecord, CampaignRecord, DealRecord, DealStage, LeadRecord } from "@/lib/crm";

type State = {
  leads: LeadRecord[];
  campaigns: CampaignRecord[];
  actions: ActionRecord[];
  deals: DealRecord[];
  selectedLead?: LeadRecord;
  selectedCampaign?: CampaignRecord;
};

const state: State = { leads: [], campaigns: [], actions: [], deals: [] };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());
const set = (patch: Partial<State>) => { Object.assign(state, patch); emit(); };

const upsert = <T extends { id: string }>(arr: T[], item: T) => {
  const idx = arr.findIndex((x) => x.id === item.id);
  if (idx === -1) return [item, ...arr];
  const next = [...arr];
  next[idx] = item;
  return next;
};

const actions = {
  setLeads: (leads: LeadRecord[]) => set({ leads }),
  upsertLead: (lead: LeadRecord) => set({ leads: upsert(state.leads, lead) }),
  setCampaigns: (campaigns: CampaignRecord[]) => set({ campaigns }),
  upsertCampaign: (campaign: CampaignRecord) => set({ campaigns: upsert(state.campaigns, campaign) }),
  addAction: (action: ActionRecord) => set({ actions: upsert(state.actions, action) }),
  setDeals: (deals: DealRecord[]) => set({ deals }),
  upsertDeal: (deal: DealRecord) => set({ deals: upsert(state.deals, deal) }),
  moveDealStage: (id: string, stage: DealStage) => set({ deals: state.deals.map((d) => d.id === id ? { ...d, stage } : d) }),
  setSelectedLead: (selectedLead?: LeadRecord) => set({ selectedLead }),
  assignLeadToCampaign: (leadId: string, campaignId: string) =>
    set({ campaigns: state.campaigns.map((c) => c.id === campaignId && !c.leadIds.includes(leadId) ? { ...c, leadIds: [...c.leadIds, leadId] } : c) }),
};

export function useCrmStore() {
  const snap = useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
    () => state
  );

  return { ...snap, ...actions };
}
