"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Bot, User, ArrowRight } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I am your Nexora AI Financial Advisor. How can I help you improve your cash flow today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });
      
      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response || "Sorry, I ran into an error.",
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAdvice = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: "Please generate my Strategic Financial Report based on my recent transactions." }
    ]);

    try {
      const response = await fetch("/api/advice", {
        method: "POST",
      });
      
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "ai", content: data.advice || data.error || "Failed to generate advice." }
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Sparkles className="text-amber-400 mr-2 h-6 w-6" />
            AI Advisor
          </h2>
          <p className="text-muted-foreground">Ask questions or request a strategic financial overview.</p>
        </div>
        <Button onClick={handleGenerateAdvice} disabled={isLoading} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
          Generate Strategy Report <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden glass-card border-white/10">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-sky-500/20" : "bg-primary/20"}`}>
                  {msg.role === "user" ? <User className="h-4 w-4 text-sky-400" /> : <Bot className="h-4 w-4 text-primary" />}
                </div>
                <div className={`p-4 rounded-2xl whitespace-pre-wrap text-sm ${msg.role === "user" ? "bg-sky-500 text-white rounded-tr-sm" : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-sm"}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%] flex-row">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-primary/20">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 text-slate-400 border border-white/10 rounded-tl-sm flex items-center gap-1">
                  <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t border-white/10 bg-black/20">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input 
              placeholder="Ask me about optimizing your expenses..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-amber-500"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="bg-amber-500 hover:bg-amber-600 text-white px-4">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
