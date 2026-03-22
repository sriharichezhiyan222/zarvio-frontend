"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  X,
  Plus,
  Send,
  Mic,
  FileUp,
  Brain,
  Mail,
  Search,
  BarChart3,
  Target,
  Clock,
  Lightbulb,
  MessageSquare,
  ChevronDown,
  File,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const agents: AgentOption[] = [
  { id: "outreach", name: "Outreach", description: "Write emails and sequences", icon: Mail, color: "text-blue-400" },
  { id: "research", name: "Research", description: "Find company intel", icon: Search, color: "text-emerald-400" },
  { id: "analytics", name: "Analytics", description: "Analyze your data", icon: BarChart3, color: "text-amber-400" },
  { id: "lead-explorer", name: "Lead Explorer", description: "Discover new leads", icon: Target, color: "text-purple-400" },
];

const quickPrompts = [
  { icon: Target, label: "Find Ideal Prospects", color: "text-amber-400 border-amber-400/20 bg-amber-400/10" },
  { icon: Zap, label: "Generate a Full Campaign", color: "text-primary border-primary/20 bg-primary/10" },
  { icon: MessageSquare, label: "Write a Sequence", color: "text-blue-400 border-blue-400/20 bg-blue-400/10" },
  { icon: Lightbulb, label: "Campaign Ideas", color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" },
  { icon: BarChart3, label: "Weekly Analytics", color: "text-amber-400 border-amber-400/20 bg-amber-400/10" },
  { icon: Brain, label: "Best Performing Campaigns", color: "text-purple-400 border-purple-400/20 bg-purple-400/10" },
];

export function ZarvioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentOption | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
    }
    setShowAddMenu(false);
  };

  const selectAgent = (agent: AgentOption) => {
    setSelectedAgent(agent);
    setShowAgentMenu(false);
    setShowAddMenu(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(inputValue, selectedAgent),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const getAIResponse = (query: string, agent: AgentOption | null): string => {
    if (agent?.id === "outreach") {
      return "I'll help you craft the perfect outreach sequence. Based on your target audience, I recommend a 5-email sequence with personalized subject lines. Would you like me to generate the first email draft?";
    }
    if (agent?.id === "research") {
      return "I've analyzed the company profile. Here are the key insights: They recently raised $12M in Series B, are actively hiring for sales roles, and their CTO has been posting about scaling challenges. This indicates high buying intent.";
    }
    if (agent?.id === "analytics") {
      return "Looking at your performance data from the last 30 days: Email open rate is 42% (industry avg: 21%), reply rate is 18%, and your best performing template has a 67% open rate. I recommend using that template more frequently.";
    }
    return "I understand you're looking for help with: " + query + ". Let me analyze your request and provide tailored recommendations. What specific aspect would you like me to focus on?";
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-chart-2 shadow-lg shadow-primary/25 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 z-50",
          isOpen && "rotate-90"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {/* Assistant Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-6 bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 transition-all duration-300 z-50 overflow-hidden",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
          isExpanded ? "w-[600px] h-[600px]" : "w-[420px] h-[520px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Zarvio AI</h3>
              <p className="text-xs text-muted-foreground">Your AI sales assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedAgent && (
              <Badge className={cn("border-0", selectedAgent.color, "bg-current/10")}>
                <selectedAgent.icon className="w-3 h-3 mr-1" />
                {selectedAgent.name}
              </Badge>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-56px)]">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <h4 className="text-xl font-semibold text-foreground mb-2">What can I help with?</h4>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Ask Zarvio AI or type / to see prompts...
              </p>

              {/* Quick Prompts */}
              <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.label)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all hover:scale-105",
                      prompt.color
                    )}
                  >
                    <prompt.icon className="w-3.5 h-3.5" />
                    {prompt.label}
                  </button>
                ))}
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 w-full max-w-sm">
                  <p className="text-xs text-muted-foreground mb-2">Uploaded files:</p>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg text-sm">
                        <File className="w-4 h-4 text-primary" />
                        <span className="text-foreground truncate">{file}</span>
                        <Check className="w-4 h-4 text-emerald-400 ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Messages */
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask Zarvio AI or type / to see prompts..."
                className="w-full h-12 pl-4 pr-28 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Add Menu Button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowAddMenu(!showAddMenu);
                      setShowAgentMenu(false);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Add Menu Dropdown */}
                  {showAddMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-10">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        multiple
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <FileUp className="w-4 h-4 text-primary" />
                        <div className="text-left">
                          <p className="font-medium">Upload CSV</p>
                          <p className="text-xs text-muted-foreground">Import lead data</p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setShowAgentMenu(!showAgentMenu);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <Brain className="w-4 h-4 text-emerald-400" />
                        <div className="text-left">
                          <p className="font-medium">Select AI Module</p>
                          <p className="text-xs text-muted-foreground">Choose agent type</p>
                        </div>
                      </button>

                      {/* Agent Submenu */}
                      {showAgentMenu && (
                        <div className="border-t border-border mt-2 pt-2">
                          {agents.map((agent) => (
                            <button
                              key={agent.id}
                              onClick={() => selectAgent(agent)}
                              className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors",
                                selectedAgent?.id === agent.id && "bg-secondary"
                              )}
                            >
                              <agent.icon className={cn("w-4 h-4", agent.color)} />
                              <div className="text-left">
                                <p className="font-medium text-foreground">{agent.name}</p>
                                <p className="text-xs text-muted-foreground">{agent.description}</p>
                              </div>
                              {selectedAgent?.id === agent.id && (
                                <Check className="w-4 h-4 text-primary ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* History Note */}
            {messages.length === 0 && (
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>No chat history yet</span>
                <span className="text-border">|</span>
                <span>Start a new chat to begin</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
