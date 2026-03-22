"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Target,
  Megaphone,
  PenLine,
  Lightbulb,
  BarChart3,
  Trophy,
  HelpCircle,
  ClipboardCheck,
  Clock,
  Mic,
  ArrowUp,
  Plus,
  Brain,
  MessageSquare,
  Settings,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const quickActions: QuickAction[] = [
  { id: "find-prospects", label: "Find Ideal Prospects", icon: Target, color: "text-amber-400" },
  { id: "generate-campaign", label: "Generate a Full Campaign", icon: Megaphone, color: "text-blue-400" },
  { id: "write-sequence", label: "Write a Sequence", icon: PenLine, color: "text-purple-400" },
  { id: "campaign-ideas", label: "Campaign Ideas", icon: Lightbulb, color: "text-cyan-400" },
  { id: "weekly-analytics", label: "Weekly Analytics", icon: BarChart3, color: "text-green-400" },
  { id: "best-campaigns", label: "Best Performing Campaigns", icon: Trophy, color: "text-orange-400" },
  { id: "get-advice", label: "Get Advice", icon: HelpCircle, color: "text-red-400" },
  { id: "audit-workspace", label: "Audit My Workspace", icon: ClipboardCheck, color: "text-indigo-400" },
];

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const sidebarItems = [
  { id: "new-chat", label: "New chat", icon: Plus },
  { id: "memory", label: "Memory", icon: Brain },
  { id: "tasks", label: "Tasks", icon: Clock },
  { id: "settings", label: "Settings", icon: Settings },
];

export function LeadExplorerSection() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState("new-chat");
  const [chatHistories] = useState<ChatHistory[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm analyzing your request. Let me help you find the best prospects based on your criteria...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: QuickAction) => {
    setInputValue(action.label);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [inputValue]);

  return (
    <div className="flex h-[calc(100vh-64px)] -m-6 bg-background">
      {/* Left Sidebar */}
      <div className="w-72 border-r border-border flex flex-col bg-card">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-lg text-foreground italic">Zarvio Copilot</h2>
          <button className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebarItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSidebarItem(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Chat History */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          {chatHistories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No chat history yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatHistories.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary text-left transition-colors"
                >
                  <p className="text-sm font-medium text-foreground truncate">{chat.title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          /* Empty State - Show Quick Actions */
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <h1 className="text-3xl font-semibold text-primary mb-12">
              What can I help with?
            </h1>

            {/* Input Area */}
            <div className="w-full max-w-2xl mb-8">
              <div className="relative bg-card border border-border rounded-xl shadow-lg">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Zarvio AI or type / to see prompts..."
                  className="w-full min-h-[100px] max-h-[120px] px-4 pt-4 pb-12 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                  rows={3}
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
                    <History className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!inputValue.trim()}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                        inputValue.trim()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="w-full max-w-2xl">
              <div className="flex flex-wrap justify-center gap-2">
                {quickActions.slice(0, 3).map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary hover:border-primary/50 transition-all text-sm"
                    >
                      <Icon className={cn("w-4 h-4", action.color)} />
                      <span className="text-foreground">{action.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {quickActions.slice(3, 6).map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary hover:border-primary/50 transition-all text-sm"
                    >
                      <Icon className={cn("w-4 h-4", action.color)} />
                      <span className="text-foreground">{action.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {quickActions.slice(6).map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary hover:border-primary/50 transition-all text-sm"
                    >
                      <Icon className={cn("w-4 h-4", action.color)} />
                      <span className="text-foreground">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-3 rounded-xl",
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-card border border-border rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Input for Chat Mode */}
        {messages.length > 0 && (
          <div className="border-t border-border p-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-card border border-border rounded-xl">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Continue the conversation..."
                  className="w-full min-h-[60px] max-h-[120px] px-4 pt-3 pb-10 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                  rows={2}
                />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
                    <Plus className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground">
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!inputValue.trim()}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                        inputValue.trim()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
