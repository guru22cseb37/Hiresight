"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, Send, StopCircle, RefreshCw, 
  ChevronRight, Brain, Trophy, AlertTriangle,
  MessageSquare, User, Sparkles, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function MockInterviewPage() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startSession = () => {
    setSessionStarted(true);
    setMessages([{
      role: "assistant",
      content: "Hello! I'm your AI interviewer today. I've reviewed the Senior React Developer role details. Are you ready to begin? We'll start with a brief introduction."
    }]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // API call to mock interviewer logic
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      // Mock fallback for demo
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "That's a solid answer. Can you go deeper into how you managed state in that specific React project you mentioned?" 
        }]);
        setLoading(false);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-8">
      {/* Sidebar: Interview Progress */}
      <Card className="w-80 glass border-white/5 p-6 hidden lg:flex flex-col gap-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Session Progress</h3>
        
        <div className="space-y-4 flex-1">
          <ProgressItem icon={Brain} title="Technical" active done />
          <ProgressItem icon={User} title="Behavioral" active />
          <ProgressItem icon={Trophy} title="Experience" />
          <ProgressItem icon={AlertTriangle} title="Scenario" />
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">AI Tip</p>
          <p className="text-xs text-slate-400">Try using the STAR method for behavioral questions.</p>
        </div>
      </Card>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col gap-4">
        {!sessionStarted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-12 glass border-white/5 rounded-3xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center mb-6">
              <Mic className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Start Mock Interview</h2>
            <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
              Our AI will act as a hiring manager. Practice in a realistic, pressure-free environment and get real-time feedback.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button onClick={startSession} className="h-14 bg-blue-600 hover:bg-blue-500 text-lg gap-2 shadow-xl shadow-blue-500/20">
                Begin Session
              </Button>
              <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Estimated time: 15 mins</p>
            </div>
          </motion.div>
        ) : (
          <Card className="flex-1 glass border-white/5 flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-widest">AI Interviewer Live</span>
              </div>
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/5">End Session</Button>
            </div>

            {/* Chat Messages */}
            <div 
              className="flex-1 p-6 space-y-6 overflow-y-auto"
              ref={scrollRef}
            >
              {messages.map((m, i) => (
                <ChatMessage key={i} {...m} />
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-xs text-slate-400">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-white/[0.02] flex gap-4">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 h-12 bg-slate-950/50 border-white/10"
              />
              <Button type="submit" size="icon" className="h-12 w-12 bg-blue-600 hover:bg-blue-500 disabled:opacity-50" disabled={loading}>
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

function ChatMessage({ role, content }: any) {
  const isAssistant = role === "assistant";
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: isAssistant ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex ${isAssistant ? "justify-start" : "justify-end"} gap-4 outline-none`}
    >
      <div className={`p-4 rounded-2xl max-w-[80%] leading-relaxed ${
        isAssistant 
          ? "bg-slate-900 border border-white/5 text-slate-200" 
          : "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
      }`}>
        {content}
      </div>
    </motion.div>
  );
}

function ProgressItem({ icon: Icon, title, active, done }: any) {
  return (
    <div className={`flex items-center gap-4 group transition-all ${
      active ? "opacity-100" : "opacity-30"
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        done ? "bg-green-500/20 text-green-500" : (active ? "bg-blue-600/10 text-blue-400" : "bg-slate-800 text-slate-500")
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-white uppercase tracking-widest">{title}</h4>
        <p className="text-[10px] text-slate-500 mt-0.5">{done ? "Completed" : (active ? "In Progress" : "Upcoming")}</p>
      </div>
    </div>
  );
}
