"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, BookOpen, CheckCircle2, Circle, 
  ArrowRight, ExternalLink, Zap, Sparkles,
  Trophy, GraduationCap, PlayCircle, FileText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const MOCK_ROADMAP = {
  role: "Senior AI Engineer",
  company: "Anthropic",
  progress: 35,
  steps: [
    {
      title: "Mastering Flash Attention",
      description: "Deep dive into the CUDA implementation of memory-efficient attention mechanisms.",
      status: "completed",
      duration: "3 days",
      resources: [
        { type: "Paper", title: "FlashAttention: Fast and Memory-Efficient Exact Attention", url: "#" },
        { type: "Video", title: "CUDA Programming for Deep Learning", url: "#" }
      ]
    },
    {
      title: "Distributed Training with PyTorch FSDP",
      description: "Implementing Fully Sharded Data Parallelism for 10B+ parameter models.",
      status: "in-progress",
      duration: "5 days",
      resources: [
        { type: "Docs", title: "PyTorch FSDP Tutorial", url: "#" },
        { type: "Repo", title: "Scale-AI Open Source Implementation", url: "#" }
      ]
    },
    {
      title: "Vector DB Architecture (RAG)",
      description: "Building high-performance retrieval systems using Pinecone and Weaviate.",
      status: "pending",
      duration: "4 days",
      resources: [
        { type: "Course", title: "Advanced RAG Pipelines", url: "#" }
      ]
    }
  ]
};

export default function RoadmapsPage() {
  const [roadmap, setRoadmap] = useState(MOCK_ROADMAP);

  return (
    <div className="space-y-12 pb-20">
      {/* HERO SECTION */}
      <div className="relative p-10 md:p-16 rounded-[40px] bg-slate-950 border border-white/5 overflow-hidden group">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
         <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">AI Generated Path</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                  MISSION: <span className="text-blue-500">{roadmap.company.toUpperCase()}</span>
               </h1>
               <p className="text-slate-400 text-lg font-medium max-w-xl">
                  We've identified 3 critical skill gaps between your current DNA and the <span className="text-white font-bold">{roadmap.role}</span> role. This is your hyper-fast tactical roadmap.
               </p>
               <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=dev${i}`} alt="Dev" />
                        </div>
                     ))}
                  </div>
                  <span className="text-xs font-bold text-slate-500">Join 120+ others on this mission</span>
               </div>
            </div>

            <Card className="w-full md:w-80 glass border-white/10 p-8 flex flex-col items-center text-center gap-6">
               <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - roadmap.progress / 100)} className="text-blue-500" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-black text-white italic leading-none">{roadmap.progress}%</span>
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Ready</span>
                  </div>
               </div>
               <div className="space-y-1">
                  <h4 className="text-sm font-black text-white uppercase italic">Phase 1: Foundations</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">2 of 6 tasks complete</p>
               </div>
               <Button className="w-full bg-blue-600 hover:bg-blue-500 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                  Resume Mission
                  <ArrowRight className="w-4 h-4" />
               </Button>
            </Card>
         </div>
      </div>

      {/* ROADMAP STEPS */}
      <div className="max-w-4xl mx-auto space-y-8 relative">
         {/* Vertical Connector Line */}
         <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-blue-500/20 to-transparent -z-10" />

         {roadmap.steps.map((step, idx) => (
            <motion.div 
               key={idx}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
            >
               <Card className={`glass p-8 ml-12 relative group transition-all duration-500 ${
                  step.status === 'in-progress' ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5'
               }`}>
                  {/* Step Marker */}
                  <div className={`absolute -left-[54px] top-8 w-11 h-11 rounded-xl border-4 border-slate-950 flex items-center justify-center z-10 transition-colors ${
                     step.status === 'completed' ? 'bg-green-500 text-white' : 
                     step.status === 'in-progress' ? 'bg-blue-600 text-white animate-pulse' : 
                     'bg-slate-800 text-slate-500'
                  }`}>
                     {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                           <h3 className={`text-xl font-black italic uppercase tracking-tight ${
                              step.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'
                           }`}>{step.title}</h3>
                           <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest">{step.duration}</Badge>
                        </div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">{step.description}</p>
                     </div>

                     <div className="flex flex-col gap-3 min-w-[200px]">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Curated DNA Resources</h4>
                        {step.resources.map((res, i) => (
                           <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group/res">
                              <div className="flex items-center gap-3">
                                 {res.type === 'Video' ? <PlayCircle className="w-4 h-4 text-red-400" /> : <FileText className="w-4 h-4 text-blue-400" />}
                                 <span className="text-[10px] font-bold text-slate-300 group-hover/res:text-white transition-colors">{res.title}</span>
                              </div>
                              <ExternalLink className="w-3 h-3 text-slate-600 group-hover/res:text-blue-400" />
                           </div>
                        ))}
                     </div>
                  </div>
               </Card>
            </motion.div>
         ))}

         {/* FINAL MILESTONE */}
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="ml-12 p-8 rounded-[32px] bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/30 flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
               <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Hired at Anthropic</h3>
            <p className="text-slate-400 text-sm font-medium">Complete all tactical steps to unlock your direct referral link.</p>
         </motion.div>
      </div>
    </div>
  );
}
