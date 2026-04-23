"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, Zap, Loader2, CheckCircle2, 
  Search, FileText, Send, Sparkles,
  ArrowRight, ShieldCheck, Cpu
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const MOCK_TASKS = [
  { id: 1, name: "Scanning global job markets", status: "completed", progress: 100, icon: Search },
  { id: 2, name: "Tailoring Resume for Stripe", status: "running", progress: 65, icon: FileText },
  { id: 3, name: "Drafting Outreach for Google", status: "pending", progress: 0, icon: Send },
];

export function AutonomousAgentHub() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [activeTask, setActiveTask] = useState(tasks[1]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(t => {
        if (t.id === 2 && t.progress < 100) {
          const newProgress = t.progress + 5;
          if (newProgress >= 100) {
            return { ...t, progress: 100, status: "completed" };
          }
          return { ...t, progress: newProgress };
        }
        return t;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass border-blue-500/20 p-8 md:p-10 relative overflow-hidden group">
      {/* Background Tech Accents */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
        <Cpu className="w-64 h-64 text-blue-500" />
      </div>

      <div className="relative z-10 flex flex-col xl:flex-row gap-12">
        {/* Left Side: Status & Core Intelligence */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse rounded-full" />
                <BrainCircuit className="w-7 h-7 text-blue-500 relative z-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Autonomous Agent</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ACTIVE & OPTIMIZING</span>
                </div>
              </div>
            </div>
            <Badge className="bg-blue-600 text-[10px] font-black px-3 py-1 uppercase tracking-widest">LING-2.6 POWERED</Badge>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Active Operation: {activeTask.name}</span>
                <span className="text-sm font-black text-blue-400 italic">{activeTask.progress}%</span>
             </div>
             <Progress value={activeTask.progress} className="h-2 bg-white/5" />
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-green-500" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Connection</span>
                </div>
                <div className="flex items-center gap-2">
                   <Zap className="w-4 h-4 text-amber-500" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ultra Low Latency</span>
                </div>
             </div>
          </div>

      <p className="text-slate-400 text-sm leading-relaxed font-medium bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 italic">
        "Agent is currently analyzing 142 new job postings from Y-Combinator. 3 matches identified with &gt;90% compatibility. Commencing autonomous resume tailoring sequence."
      </p>
        </div>

        {/* Right Side: Task Queue */}
        <div className="w-full xl:w-96 space-y-6">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Operations Log</h3>
           <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-slate-800 ${task.status === 'running' ? 'text-blue-400' : 'text-slate-500'}`}>
                       <task.icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-bold ${task.status === 'running' ? 'text-white' : 'text-slate-500'}`}>{task.name}</span>
                  </div>
                  {task.status === 'running' ? (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  ) : task.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
              ))}
           </div>
           <button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 group transition-all">
              Initialize New Objective
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </Card>
  );
}
