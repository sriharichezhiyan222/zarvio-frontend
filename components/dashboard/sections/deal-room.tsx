"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Users,
  Clock,
  FileText,
  Video,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  Building2,
  Mail,
  Phone,
  Paperclip,
  Send,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: "discovery" | "proposal" | "negotiation" | "closing";
  probability: number;
  closeDate: string;
  contacts: { name: string; role: string; avatar?: string }[];
  activities: { type: string; description: string; date: string }[];
  documents: { name: string; type: string }[];
  nextSteps: string[];
}

const mockDeal: Deal = {
  id: "1",
  name: "Enterprise Platform Implementation",
  company: "TechCorp Industries",
  value: 250000,
  stage: "negotiation",
  probability: 75,
  closeDate: "Apr 15, 2026",
  contacts: [
    { name: "Sarah Chen", role: "VP of Engineering", avatar: "" },
    { name: "Michael Ross", role: "CTO", avatar: "" },
    { name: "Emily Davis", role: "Procurement Lead", avatar: "" },
  ],
  activities: [
    { type: "call", description: "Demo call with engineering team", date: "2 hours ago" },
    { type: "email", description: "Sent pricing proposal v2", date: "Yesterday" },
    { type: "meeting", description: "Technical requirements review", date: "Mar 18, 2026" },
    { type: "document", description: "Contract draft shared", date: "Mar 15, 2026" },
  ],
  documents: [
    { name: "Pricing Proposal v2.pdf", type: "pdf" },
    { name: "Technical Requirements.docx", type: "doc" },
    { name: "Contract Draft.pdf", type: "pdf" },
    { name: "Implementation Timeline.xlsx", type: "xlsx" },
  ],
  nextSteps: [
    "Schedule final stakeholder meeting",
    "Address security compliance questions",
    "Prepare implementation roadmap",
    "Negotiate final pricing terms",
  ],
};

const stageColors = {
  discovery: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  proposal: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  negotiation: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  closing: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Video,
  document: FileText,
};

export function DealRoomSection() {
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "documents" | "ai-insights">("overview");
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="space-y-6">
      {/* Deal Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{mockDeal.name}</h2>
              <p className="text-sm text-muted-foreground">{mockDeal.company}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn("border capitalize", stageColors[mockDeal.stage])}>
            {mockDeal.stage}
          </Badge>
          <Button variant="outline" className="border-border">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deal Value</p>
                <p className="text-2xl font-bold text-foreground">
                  ${mockDeal.value.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Probability</p>
                <p className="text-2xl font-bold text-foreground">{mockDeal.probability}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Close Date</p>
                <p className="text-2xl font-bold text-foreground">{mockDeal.closeDate}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stakeholders</p>
                <p className="text-2xl font-bold text-foreground">{mockDeal.contacts.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
        {(["overview", "activity", "documents", "ai-insights"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all capitalize",
              activeTab === tab
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "ai-insights" ? "AI Insights" : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === "overview" && (
          <>
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Next Steps */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockDeal.nextSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full border-2 border-primary/50 flex items-center justify-center text-xs text-primary font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm text-foreground">{step}</span>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed border-border mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDeal.activities.map((activity, index) => {
                      const Icon = activityIcons[activity.type as keyof typeof activityIcons] || MessageSquare;
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stakeholders */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Stakeholders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockDeal.contacts.map((contact, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {contact.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.role}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed border-border mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-border">
                    <Video className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-border">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-border">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Proposal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === "activity" && (
          <div className="lg:col-span-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-6">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  {[...mockDeal.activities, ...mockDeal.activities].map((activity, index) => {
                    const Icon = activityIcons[activity.type as keyof typeof activityIcons] || MessageSquare;
                    return (
                      <div key={index} className="relative flex items-start gap-4 pl-10">
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 p-4 rounded-lg bg-secondary/50">
                          <p className="text-sm font-medium text-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="lg:col-span-3">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Documents</CardTitle>
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockDeal.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground uppercase mt-1">{doc.type}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "ai-insights" && (
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-chart-2/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Deal Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-medium text-foreground mb-2">Deal Health Score</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full" style={{ width: "75%" }} />
                    </div>
                    <span className="text-lg font-bold text-primary">75%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This deal shows strong engagement signals. Key stakeholders are responsive and timeline aligns with their budget cycle.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-medium text-emerald-400">Positive Signals</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-foreground">
                      <li>- Multiple stakeholder engagement</li>
                      <li>- Fast response times (avg 2.5 hours)</li>
                      <li>- Requested detailed pricing</li>
                      <li>- Mentioned budget approval timeline</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <h4 className="font-medium text-amber-400">Risk Factors</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-foreground">
                      <li>- Security compliance not yet addressed</li>
                      <li>- Competitor mentioned in calls</li>
                      <li>- Procurement process unclear</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-card/50 border border-border">
                  <h4 className="font-medium text-foreground mb-2">Recommended Actions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 rounded bg-primary/5 border border-primary/20">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">1</span>
                      <span className="text-sm">Schedule a security compliance review with their IT team</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded bg-primary/5 border border-primary/20">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">2</span>
                      <span className="text-sm">Prepare competitive differentiation talking points</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded bg-primary/5 border border-primary/20">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">3</span>
                      <span className="text-sm">Request introduction to procurement contact</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Chat Interface */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Ask AI About This Deal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Ask anything about this deal..."
                    className="w-full min-h-[80px] px-4 py-3 pr-24 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button className="w-8 h-8 rounded-lg hover:bg-card flex items-center justify-center transition-colors text-muted-foreground">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
