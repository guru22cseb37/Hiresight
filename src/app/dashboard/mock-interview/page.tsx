"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, Send, StopCircle, RefreshCw, 
  ChevronRight, Brain, Trophy, AlertTriangle,
  MessageSquare, User, Sparkles, Loader2,
  Code2, Database, Network, Cpu, Lock, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ROLE_CATEGORIES = [
  "Engineering", "Data Science", "Product Management", 
  "Cybersecurity", "DevOps", "AI/ML Engineer"
];

const DOMAINS = [
  "General", "DSA", "System Design", "Spring Boot", 
  "TypeScript", "LLMs & RAG", "Networking", "Operating Systems",
  "React & Frontend", "Database Internals"
];

const LANGUAGES = [
  "Any", "Python", "JavaScript", "TypeScript", 
  "Java", "C++", "Rust", "Go", "SQL"
];

export default function MockInterviewPage() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [starEval, setStarEval] = useState<any>(null);
  
  // Selection State
  const [role, setRole] = useState(ROLE_CATEGORIES[0]);
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        body: JSON.stringify({ 
          messages: [], 
          role, 
          domain, 
          language 
        })
      });
      const data = await response.json();
      setMessages([{
        role: "assistant",
        content: data.reply || `Welcome! I'm ready to interview you for the ${role} position focusing on ${domain}. Let's start.`
      }]);
      setSessionStarted(true);
    } catch (err) {
      toast.error("Failed to start session. Please check your API keys.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        body: JSON.stringify({ 
          messages: [...messages, { role: "user", content: userMessage }],
          role,
          domain,
          language
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      
      // Attempt STAR evaluation for the answer
      // Note: We could make this a separate background call to not block the chat
      evaluateAnswer(userMessage);

    } catch (error) {
      toast.error("Communication error. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async (answer: string) => {
    try {
      const lastQuestion = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
      const response = await fetch("/api/mock-interview/evaluate", {
        method: "POST",
        body: JSON.stringify({ question: lastQuestion, answer })
      });
      const evalData = await response.json();
      setStarEval(evalData);
    } catch (e) {
      // Ignore evaluation errors silently
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-8">
      {/* Sidebar: Interview Progress & STAR Eval */}
      <Card className="w-80 glass border-white/5 p-6 hidden lg:flex flex-col gap-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Interview Intelligence</h3>
        
        {starEval ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">STAR Score</span>
                <span className="text-lg font-black text-white">{starEval.score}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${starEval.score}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <EvalPoint label="Situation" text={starEval.situation} />
              <EvalPoint label="Action" text={starEval.action} />
              <EvalPoint label="Result" text={starEval.result} />
            </div>
            
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
               <div className="flex items-center gap-2 mb-1">
                 <Sparkles className="w-3 h-3 text-amber-500" />
                 <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Coach Advice</span>
               </div>
               <p className="text-[10px] text-slate-400 italic">{starEval.advice}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 flex-1">
            <ProgressItem icon={Brain} title="Current Role" subtitle={role} active />
            <ProgressItem icon={Code2} title="Domain" subtitle={domain} active />
            <ProgressItem icon={Globe} title="Language" subtitle={language} active />
            <div className="pt-6">
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 italic">Real-time STAR Analysis</p>
                <p className="text-[11px] text-slate-600">Your answers will be analyzed for Situation, Task, Action, and Result depth.</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Main Area */}
      <div className="flex-1 flex flex-col gap-4">
        {!sessionStarted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 glass border-white/5 rounded-3xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center mb-8">
              <Brain className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter">ELITE MOCK INTERVIEW</h2>
            <p className="text-slate-400 max-w-md text-center mb-10 leading-relaxed font-medium">
              Experience FAANG-level technical assessment. Select your specialized field and language to begin.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mb-12">
              <SelectionCard label="Target Role" value={role} options={ROLE_CATEGORIES} onChange={setRole} icon={User} />
              <SelectionCard label="Tech Domain" value={domain} options={DOMAINS} onChange={setDomain} icon={Cpu} />
              <SelectionCard label="Programming" value={language} options={LANGUAGES} onChange={setLanguage} icon={Code2} />
            </div>

            <Button 
              onClick={startSession} 
              disabled={loading}
              className="h-16 px-12 bg-blue-600 hover:bg-blue-500 text-xl font-black italic gap-3 shadow-2xl shadow-blue-500/30 rounded-2xl transition-all hover:scale-105"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "LAUNCH INTERVIEW"}
            </Button>
          </motion.div>
        ) : (
          <Card className="flex-1 glass border-white/5 flex flex-col overflow-hidden relative rounded-3xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live Engine</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{domain} // {language}</span>
              </div>
              <Button onClick={() => setSessionStarted(false)} variant="ghost" size="sm" className="text-slate-500 hover:text-red-400 font-bold uppercase text-[10px]">End Session</Button>
            </div>

            {/* Chat Messages */}
            <div 
              className="flex-1 p-6 space-y-8 overflow-y-auto scroll-smooth"
              ref={scrollRef}
            >
              {messages.map((m, i) => (
                <ChatMessage key={i} {...m} />
              ))}
              {loading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI is analyzing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-slate-950/20">
              <form onSubmit={handleSendMessage} className="relative flex gap-4 max-w-4xl mx-auto">
                <div className="relative flex-1 group">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Speak naturally, use specific examples..."
                    className="h-14 bg-slate-950/50 border-white/5 pl-6 pr-12 focus:border-blue-500/50 transition-all rounded-2xl text-white font-medium placeholder:text-slate-600"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !input.trim()}
                  className="h-14 w-14 bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20 rounded-2xl disabled:opacity-30 transition-all"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "p-5 rounded-2xl max-w-[85%] leading-relaxed text-sm transition-all prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-white/5 prose-code:text-blue-400",
        isAssistant 
          ? "bg-slate-900/80 border border-white/5 text-slate-200" 
          : "bg-gradient-to-br from-blue-600 to-blue-700 text-white font-medium shadow-2xl shadow-blue-500/10"
      )}>
        {isAssistant ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        ) : (
          content
        )}
      </div>
    </motion.div>
  );
}

function SelectionCard({ label, value, options, onChange, icon: Icon }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
      </div>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 bg-slate-900 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function ProgressItem({ icon: Icon, title, subtitle, active }: any) {
  return (
    <div className={cn(
      "flex items-center gap-4 transition-all",
      active ? "opacity-100" : "opacity-30"
    )}>
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-blue-400">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h4>
        <p className="text-xs font-bold text-white truncate max-w-[150px]">{subtitle}</p>
      </div>
    </div>
  );
}

function EvalPoint({ label, text }: any) {
  if (!text) return null;
  return (
    <div className="space-y-1">
      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</div>
      <p className="text-[11px] text-slate-400 leading-tight">{text}</p>
    </div>
  );
}
