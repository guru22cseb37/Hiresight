"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  BarChart3, 
  Zap, 
  BrainCircuit, 
  Globe, 
  DollarSign,
  ArrowUpRight,
  Sparkles,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function MarketIntelligencePage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      const { data, error } = await supabase
        .from("market_insights")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setInsights(data);
      }
      setLoading(false);
    }

    fetchInsights();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* HERO SECTION */}
      <div className="relative p-8 md:p-14 rounded-[40px] bg-slate-900 border border-white/5 overflow-hidden group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-600/10 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Globe className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Global Pulse</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
            MARKET <span className="text-indigo-500">INTELLIGENCE.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
            Real-time insights aggregated from global job boards, optimized by AI to keep your career ahead of the curve.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <Card className="glass border-dashed border-white/10 p-20 flex flex-col items-center justify-center text-center space-y-6">
           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <Zap className="w-8 h-8 text-slate-600" />
           </div>
           <div className="space-y-2">
             <h3 className="text-xl font-bold text-white italic uppercase tracking-tight">Waiting for Data...</h3>
             <p className="text-slate-500 max-w-xs text-sm">Your n8n automation hasn't pushed any market updates yet.</p>
           </div>
           <Button variant="outline" className="border-white/10 hover:bg-white/5 text-xs font-black uppercase tracking-widest">
              Trigger Manual Fetch
           </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LATEST INSIGHT CARD */}
          <div className="lg:col-span-2 space-y-8">
            {insights.map((insight, idx) => (
              <motion.div 
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass border-white/5 p-8 md:p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <TrendingUp className="w-48 h-48 text-indigo-500" />
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-slate-500">
                         <Clock className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase tracking-widest">
                           {new Date(insight.created_at).toLocaleDateString()}
                         </span>
                      </div>
                      <Badge className="bg-indigo-600/10 text-indigo-400 border-indigo-600/20 text-[9px] font-black uppercase tracking-widest">
                        LIVE UPDATE
                      </Badge>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">
                      {insight.title}
                    </h3>

                    <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                      {insight.summary}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {insight.trending_skills?.map((skill: string) => (
                        <Badge key={skill} className="bg-white/5 hover:bg-indigo-500/10 text-white border-white/10 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {insight.salary_data && (
                      <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-indigo-400">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Salary Ceiling</span>
                           </div>
                           <div className="text-3xl font-black text-white italic tracking-tighter">
                              {insight.salary_data.max || "N/A"}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-green-400">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Demand Index</span>
                           </div>
                           <div className="text-3xl font-black text-white italic tracking-tighter">
                              {insight.salary_data.demand || "Elite"}
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* SIDEBAR WIDGETS */}
          <div className="space-y-8">
            <Card className="glass border-indigo-500/20 p-8 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4 text-indigo-500" />
                 </div>
                 <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">AI Pulse Check</h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                "We are seeing a 14% surge in demand for **Rust** and **WebAssembly** across Series B startups. Adjust your Skill Tree accordingly."
              </p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-xl h-12">
                Update My Skills
              </Button>
            </Card>

            <Card className="glass border-white/5 p-8 space-y-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                <Globe className="w-32 h-32 text-white" />
              </div>
              <h4 className="text-lg font-black text-white italic uppercase tracking-tighter relative z-10">Data Sources</h4>
              <div className="space-y-4 relative z-10">
                {["LinkedIn", "Indeed", "Greenhouse", "Lever"].map(source => (
                  <div key={source} className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span>{source}</span>
                    <Badge variant="outline" className="text-[8px] border-white/5">ACTIVE</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
