export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "disqualified";
export type ActionType = "email" | "message" | "call";
export type DealStage = "new" | "contacted" | "interested" | "closed";

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: "csv" | "explorer" | "manual";
  status: LeadStatus;
  tags: string[];
  score: number;
}

export interface CampaignStep {
  id: string;
  channel: ActionType;
  label: string;
}

export interface CampaignRecord {
  id: string;
  name: string;
  leadIds: string[];
  steps: CampaignStep[];
  status: "draft" | "active" | "paused";
  createdAt: string;
}

export interface ActionRecord {
  id: string;
  leadId: string;
  campaignId?: string;
  type: ActionType;
  status: "queued" | "sent" | "scheduled" | "completed";
  note: string;
  createdAt: string;
}

export interface DealRecord {
  id: string;
  leadId: string;
  company: string;
  value: number;
  stage: DealStage;
  updatedAt: string;
}

export function normalizeLead(input: any, source: LeadRecord["source"] = "manual"): LeadRecord {
  return {
    id: String(input.id ?? crypto.randomUUID()),
    name: input.name || `${input.first_name || ""} ${input.last_name || ""}`.trim() || "Unknown",
    email: String(input.email || ""),
    phone: String(input.phone || input.mobile || ""),
    company: String(input.company || input.company_name || "Unknown"),
    source,
    status: (input.status as LeadStatus) || "new",
    tags: Array.isArray(input.tags) ? input.tags.map(String) : [],
    score: Number(input.score ?? 0),
  };
}
