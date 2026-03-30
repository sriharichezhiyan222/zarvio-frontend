"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Building2, User, Plus, MessageSquare, PhoneCall, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  location?: string;
}

export function LeadExplorerSection() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/leads`);
        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }
        const data = await response.json();
        setLeads(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 rounded-xl border border-destructive/20 mt-6">
        <p className="text-destructive font-medium">Error: {error}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lead Explorer</h2>
          <p className="text-muted-foreground mt-1">
            Browse and manage your discovered prospects.
          </p>
        </div>
        <div className="text-sm font-medium px-3 py-1 bg-secondary rounded-lg border border-border">
          Total Leads: {leads.length}
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No leads found</h3>
          <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
            You haven't added any leads yet. Import a CSV or use the Lead Radar to find prospects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <div 
              key={lead.id} 
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/50 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground truncate max-w-[140px]">{lead.name}</h3>
                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">{lead.role || "Prospect"}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0">
                  4/5 APPROVE
                </Badge>
              </div>

              <div className="space-y-2 mb-6 flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate">{lead.company || "Unknown Company"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{lead.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="truncate">{lead.phone || "No phone"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-[11px] h-8 justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => console.log("Add to Campaign lead ID:", lead.id)}
                >
                  <Plus className="w-3.5 h-3.5 mr-2" />
                  Add to Campaign
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-[11px] h-8 justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => console.log("Send Email lead ID:", lead.id)}
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-2" />
                  Send Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-[11px] h-8 justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => console.log("Send to Ghost Caller lead ID:", lead.id)}
                >
                  <PhoneCall className="w-3.5 h-3.5 mr-2" />
                  Send to Ghost Caller
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
