export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "disqualified";
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

export interface CampaignRecord {
  id: string;
  name: string;
  leadIds: string[];
}

export interface ActionRecord {
  id: string;
  leadId: string;
  type: "email" | "message" | "call";
  status: "sent" | "scheduled" | "completed";
  note: string;
  createdAt: string;
}

export interface DealRecord {
  id: string;
  leadId: string;
  company: string;
  value: number;
  stage: DealStage;
}

export function normalizeLead(input: any, source: LeadRecord["source"] = "manual"): LeadRecord {
  return {
    id: String(input.id ?? input.lead_id ?? crypto.randomUUID()),
    name: input.name || `${input.first_name || ""} ${input.last_name || ""}`.trim() || input.company_name || "Unknown",
    email: String(input.email || ""),
    phone: String(input.phone || ""),
    company: String(input.company || input.company_name || "Unknown"),
    source,
    status: "new",
    tags: Array.isArray(input.tags) ? input.tags.map(String) : [],
    score: Number(input.score ?? 0),
  };
}
