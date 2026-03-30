"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { OutreachTab, Section } from "@/lib/types";
import { apiJson } from "@/lib/client-api";
import {
  Mail,
  Phone,
  MessageSquare,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Sparkles,
  Calendar,
  User,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OutreachSectionProps {
  activeTab: OutreachTab;
  onTabChange: (tab: OutreachTab) => void;
  onNavigateTo?: (section: Section) => void;
}

interface EmailOutreach {
  id: string;
  recipient: string;
  company: string;
  subject: string;
  status: "sent" | "opened" | "replied" | "bounced" | "scheduled";
  sentAt?: string;
  scheduledFor?: string;
  openRate?: number;
}

interface PhoneOutreach {
  id: string;
  contact: string;
  company: string;
  status: "completed" | "no-answer" | "scheduled" | "voicemail";
  duration?: string;
  scheduledFor?: string;
  notes?: string;
}

interface MessageOutreach {
  id: string;
  contact: string;
  company: string;
  platform: "linkedin" | "whatsapp" | "sms";
  status: "sent" | "read" | "replied" | "pending";
  message: string;
  sentAt?: string;
}

const statusColors = {
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  opened: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  replied: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  bounced: "bg-red-500/10 text-red-400 border-red-500/20",
  scheduled: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "no-answer": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  voicemail: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  read: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pending: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const statusIcons = {
  sent: Send,
  opened: ArrowUpRight,
  replied: CheckCircle2,
  bounced: XCircle,
  scheduled: Clock,
  completed: CheckCircle2,
  "no-answer": Phone,
  voicemail: Phone,
  read: CheckCircle2,
  pending: Clock,
};

const platformIcons = {
  linkedin: "in",
  whatsapp: "wa",
  sms: "sms",
};

export function OutreachSection({ activeTab, onTabChange, onNavigateTo }: OutreachSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [emails, setEmails] = useState<EmailOutreach[]>([]);
  const [calls, setCalls] = useState<PhoneOutreach[]>([]);
  const [messages, setMessages] = useState<MessageOutreach[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const leads = await apiJson<any[]>("/leads");
        const normalized = (Array.isArray(leads) ? leads : []).slice(0, 20);
        setEmails(
          normalized.map((lead, idx) => ({
            id: String(lead.id ?? idx),
            recipient: lead.name || "Unknown",
            company: lead.company || "Unknown",
            subject: lead.subject || `Intro for ${lead.company || "your company"}`,
            status: "sent",
            sentAt: lead.updated_at || "recently",
          }))
        );
        setCalls(
          normalized.map((lead, idx) => ({
            id: String(lead.id ?? idx),
            contact: lead.name || "Unknown",
            company: lead.company || "Unknown",
            status: "scheduled",
            scheduledFor: "Pending",
          }))
        );
        setMessages(
          normalized.map((lead, idx) => ({
            id: String(lead.id ?? idx),
            contact: lead.name || "Unknown",
            company: lead.company || "Unknown",
            platform: "linkedin",
            status: "pending",
            message: "Draft pending generation",
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const tabs = [
    { id: "emails" as OutreachTab, label: "Emails", icon: Mail, count: emails.length },
    { id: "phone" as OutreachTab, label: "Phone", icon: Phone, count: calls.length },
    { id: "messages" as OutreachTab, label: "Messages", icon: MessageSquare, count: messages.length },
  ];

  const stats = {
    emails: {
      sent: emails.filter(e => e.status === "sent" || e.status === "opened" || e.status === "replied").length,
      opened: emails.filter(e => e.status === "opened" || e.status === "replied").length,
      replied: emails.filter(e => e.status === "replied").length,
    },
    phone: {
      completed: calls.filter(c => c.status === "completed").length,
      scheduled: calls.filter(c => c.status === "scheduled").length,
      total: calls.length || 1,
    },
    messages: {
      sent: messages.filter(m => m.status !== "pending").length,
      replied: messages.filter(m => m.status === "replied").length,
      pending: messages.filter(m => m.status === "pending").length,
    },
  };

  const filteredEmails = useMemo(
    () =>
      emails.filter((e) =>
        `${e.recipient} ${e.company}`.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [emails, searchQuery]
  );
  const filteredCalls = useMemo(
    () =>
      calls.filter((c) =>
        `${c.contact} ${c.company}`.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [calls, searchQuery]
  );
  const filteredMessages = useMemo(
    () =>
      messages.filter((m) =>
        `${m.contact} ${m.company}`.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [messages, searchQuery]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Manage your multi-channel outreach campaigns
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Sequence
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-card border border-border rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                activeTab === tab.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeTab === "emails" && (
          <>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Emails Sent</p>
                    <p className="text-2xl font-bold text-foreground">{stats.emails.sent}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Rate</p>
                    <p className="text-2xl font-bold text-foreground">{Math.round((stats.emails.opened / stats.emails.sent) * 100)}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Reply Rate</p>
                    <p className="text-2xl font-bold text-foreground">{Math.round((stats.emails.replied / stats.emails.sent) * 100)}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        {activeTab === "phone" && (
          <>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Calls Completed</p>
                    <p className="text-2xl font-bold text-foreground">{stats.phone.completed}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled</p>
                    <p className="text-2xl font-bold text-foreground">{stats.phone.scheduled}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold text-foreground">{Math.round((stats.phone.completed / stats.phone.total) * 100)}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        {activeTab === "messages" && (
          <>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Messages Sent</p>
                    <p className="text-2xl font-bold text-foreground">{stats.messages.sent}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Replied</p>
                    <p className="text-2xl font-bold text-foreground">{stats.messages.replied}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-foreground">{stats.messages.pending}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contacts, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <Button variant="outline" className="border-border">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" className="border-border">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Compose
        </Button>
      </div>

      {/* Content List */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base font-medium">
            {activeTab === "emails" && "Email Sequences"}
            {activeTab === "phone" && "Call Log"}
            {activeTab === "messages" && "Direct Messages"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {activeTab === "emails" && filteredEmails.map((email, index) => {
              const StatusIcon = statusIcons[email.status];
              return (
                <div
                  key={email.id}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{email.recipient}</span>
                      <span className="text-sm text-muted-foreground">at {email.company}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{email.subject}</p>
                  </div>
                  <Badge className={cn("border", statusColors[email.status])}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {email.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {email.sentAt || email.scheduledFor}
                  </span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {activeTab === "phone" && filteredCalls.map((call, index) => {
              const StatusIcon = statusIcons[call.status];
              return (
                <div
                  key={call.id}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{call.contact}</span>
                      <span className="text-sm text-muted-foreground">at {call.company}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{call.notes || `Duration: ${call.duration}`}</p>
                  </div>
                  <Badge className={cn("border", statusColors[call.status])}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {call.status.replace("-", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {call.duration || call.scheduledFor}
                  </span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {activeTab === "messages" && filteredMessages.map((message, index) => {
              const StatusIcon = statusIcons[message.status];
              return (
                <div
                  key={message.id}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                    {platformIcons[message.platform]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{message.contact}</span>
                      <span className="text-sm text-muted-foreground">at {message.company}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                  </div>
                  <Badge className={cn("border", statusColors[message.status])}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {message.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {message.sentAt || "Pending"}
                  </span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {!isLoading &&
              ((activeTab === "emails" && filteredEmails.length === 0) ||
                (activeTab === "phone" && filteredCalls.length === 0) ||
                (activeTab === "messages" && filteredMessages.length === 0)) && (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  Add your first lead to get started.
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
