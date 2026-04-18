"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, DollarSign, Send, Loader2, 
  Sparkles, ShieldCheck, Terminal, BrainCircuit,
  TrendingUp, TrendingDown, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function NegotiatorPage() {
  const [messages, setMessages] = useState<any[]>([
    { 
      role: "assistant", 
      content: "Welcome to the War Room. I am your Lead Negotiator. What offer are we looking at, or what negotiation hurdle are you facing? Give me the numbers and the context." 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/negotiator/chat", {
        method: "POST",
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          userProfile: "Senior Software Engineer" 
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch (err) {
      toast.error("Negotiator went silent. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-600/10 flex items-center justify-center text-green-500 shadow-lg shadow-green-500/10 border border-green-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white italic tracking-tighter uppercase">Negotiation War Room</h1>
            <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Secure your maximum market value.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
           <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 py-1.5 px-4 font-black text-[10px] tracking-widest uppercase italic">Strategy: Assertive</Badge>
           <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/20 py-1.5 px-4 font-black text-[10px] tracking-widest uppercase italic">Leverage: High</Badge>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-8 overflow-hidden">
        {/* Chat Area */}
        <Card className="lg:col-span-2 glass border-white/5 flex flex-col overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-6 rounded-[24px] text-sm leading-relaxed",
                    m.role === "user" 
                      ? "bg-blue-600 text-white font-medium rounded-tr-none shadow-xl shadow-blue-900/20" 
                      : "bg-slate-900/80 border border-white/5 text-slate-300 rounded-tl-none prose prose-invert prose-sm max-w-none"
                  )}>
                    {m.role === "assistant" ? (
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    ) : (
                      m.content
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-slate-600 mt-2 uppercase tracking-widest px-2">
                    {m.role === "assistant" ? "Lead Negotiator" : "Candidate"}
                  </span>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 p-6 bg-slate-900/50 rounded-[24px] rounded-tl-none border border-white/5 w-fit">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-150" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-white/5 bg-slate-950/50 backdrop-blur-md">
            <div className="relative flex items-center">
              <Input
                placeholder="Describe your offer or question (e.g. 'I got an offer from Stripe for 150k base...')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="h-16 pl-6 pr-20 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-green-500/20 transition-all"
              />
              <Button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-2 h-12 w-12 rounded-xl bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/20 p-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Intelligence Sidebar */}
        <div className="space-y-6 overflow-y-auto pr-2">
          <Card className="glass border-green-500/20 p-6 space-y-6">
             <div className="flex items-center gap-2 text-green-500">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Negotiation Protocol</h4>
             </div>
             <div className="space-y-4">
                <ProtocolItem label="Standard Rule" text="Never be the first to say a number." color="green" />
                <ProtocolItem label="The Leverage" text="Your current value is defined by your alternative offers." color="blue" />
                <ProtocolItem label="Equity Rule" text="Always optimize for RSU/Option cliff terms." color="violet" />
             </div>
          </Card>

          <Card className="glass border-white/5 p-6 space-y-6">
             <div className="flex items-center gap-2 text-blue-400">
                <BrainCircuit className="w-4 h-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Market Intelligence</h4>
             </div>
             <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Industry Avg (L5)</span>
                   <span className="text-xs font-bold text-white">$210k - $280k</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full w-[65%] bg-blue-500" />
                </div>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed italic">
               "Current trends show 15% increase in signing bonuses for Q2 remote-first roles."
             </p>
          </Card>

          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start">
             <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-amber-200/70 font-medium leading-relaxed uppercase tracking-wide">
                Warning: Do not share specific personal ID or legal documents. This is a strategy tool.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtocolItem({ label, text, color }: any) {
  const colors: any = {
    green: "bg-green-500/20 text-green-500 border-green-500/30",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    violet: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  };

  return (
    <div className="space-y-1.5">
       <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest", colors[color])}>
          {label}
       </span>
       <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{text}</p>
    </div>
  );
}
