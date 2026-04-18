"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Users, Search, Loader2, 
  Check, X, ChevronRight, Filter,
  FileText, Briefcase, UserCheck, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RapidScreenPage() {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<any[]>(MOCK_RAPID_CANDIDATES);
  const [summaries, setSummaries] = useState<any>({});

  const handleRapidScreen = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recruiter/rapid-screen/summary", {
        method: "POST",
        body: JSON.stringify({ 
          candidates: candidates.map(c => ({ id: c.id, name: c.name, role: c.role })),
          jobContext: "Senior React Engineer at Vercel"
        })
      });
      const data = await res.json();
      const summaryMap = data.summaries.reduce((acc: any, s: any) => ({ ...acc, [s.id]: s }), {});
      setSummaries(summaryMap);
      toast.success("Rapid AI Summaries generated.");
    } catch (err) {
      toast.error("Screening engine failed.");
    } finally {
      setLoading(false);
    }
  };

  const removeCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-600/10 flex items-center justify-center text-yellow-500 shadow-lg shadow-yellow-500/10 border border-yellow-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white italic tracking-tighter uppercase">Rapid Screen HUD</h1>
            <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Screen 100+ assets in minutes with AI acceleration.</p>
          </div>
        </div>
        <Button 
          onClick={handleRapidScreen}
          disabled={loading}
          className="h-14 px-8 bg-yellow-600 hover:bg-yellow-500 text-black font-black italic rounded-2xl gap-3 shadow-2xl shadow-yellow-500/20 active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          {loading ? "BOOSTING..." : "ACTIVATE AI BOOST"}
        </Button>
      </div>

      <div className="space-y-4">
         <div className="flex items-center justify-between px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-8">
               <span className="w-[300px]">Candidate Asset</span>
               <span className="w-[150px]">Match Score</span>
               <span className="flex-1">AI Tactical Summary</span>
            </div>
            <span className="w-32 text-right">Extraction</span>
         </div>

         <div className="space-y-3">
            <AnimatePresence mode="popLayout">
               {candidates.map((cand, idx) => (
                 <motion.div
                   key={cand.id}
                   layout
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, x: -50 }}
                   transition={{ delay: idx * 0.05 }}
                 >
                   <Card className="glass border-white/5 p-4 flex items-center justify-between group hover:border-white/10 transition-all bg-white/[0.01]">
                      <div className="flex items-center gap-8 flex-1">
                         {/* Name & Role */}
                         <div className="w-[300px] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center font-black text-white text-xs italic">
                               {cand.name[0]}
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-white uppercase italic tracking-tight">{cand.name}</h4>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{cand.role}</p>
                            </div>
                         </div>

                         {/* Score */}
                         <div className="w-[150px]">
                            <div className="flex items-center gap-2">
                               <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${cand.score}%` }} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                               </div>
                               <span className="text-xs font-black text-white italic">{cand.score}%</span>
                            </div>
                         </div>

                         {/* Summary */}
                         <div className="flex-1 text-xs text-slate-400 font-medium italic">
                            {summaries[cand.id] ? (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                 "{summaries[cand.id].summary}"
                              </motion.div>
                            ) : (
                              <span className="text-slate-800 uppercase text-[9px] font-black tracking-widest">Waiting for AI boost...</span>
                            )}
                         </div>
                      </div>

                      {/* Actions */}
                      <div className="w-32 flex justify-end gap-2">
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           onClick={() => removeCandidate(cand.id)}
                           className="h-10 w-10 rounded-xl bg-red-600/5 hover:bg-red-600/20 text-red-500 border border-red-500/10"
                         >
                            <X className="w-4 h-4" />
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           onClick={() => removeCandidate(cand.id)}
                           className="h-10 w-10 rounded-xl bg-green-600/5 hover:bg-green-600/20 text-green-500 border border-green-500/10"
                         >
                            <Check className="w-4 h-4" />
                         </Button>
                      </div>
                   </Card>
                 </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

const MOCK_RAPID_CANDIDATES = [
  { id: "1", name: "Sarah Chen", role: "Senior Frontend Engineer", score: 98 },
  { id: "2", name: "Marcus Miller", role: "Frontend Lead", score: 94 },
  { id: "3", name: "Julian Voss", role: "Fullstack Developer", score: 81 },
  { id: "4", name: "Elena Rodriguez", role: "Product Designer", score: 89 },
  { id: "5", name: "Arjun Gupta", role: "Lead Frontend Engineer", score: 92 },
  { id: "6", name: "Sophie Mueller", role: "React Developer", score: 78 },
  { id: "7", name: "Liam O'Connor", role: "UI Engineer", score: 85 },
];
