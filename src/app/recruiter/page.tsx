"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, UserCheck, Timer, 
  TrendingUp, Search, UserPlus, FileText,
  ChevronRight, MoreVertical, Loader2,
  Sparkles, BrainCircuit, Zap, Target,
  ShieldCheck, BarChart3, Rocket, Cpu
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from "recharts";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const funnelData = [
  { stage: "Sourced", count: 420, color: "#3B82F6" },
  { stage: "Screened", count: 180, color: "#6366F1" },
  { stage: "Interview", count: 45, color: "#8B5CF6" },
  { stage: "Offered", count: 12, color: "#A855F7" },
  { stage: "Hired", count: 8, color: "#D946EF" },
];

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({ jobs: 0, candidates: 0, interviews: 0, offers: 0 });
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [jobsRes, candidatesRes] = await Promise.all([
        supabase.from("job_postings").select("id", { count: "exact" }).eq("recruiter_id", user.id),
        supabase.from("candidates").select("id", { count: "exact" }).eq("recruiter_id", user.id)
      ]);

      setStats({
        jobs: jobsRes.count || 0,
        candidates: candidatesRes.count || 0,
        interviews: 45, 
        offers: 12      
      });

      const { data: cands } = await supabase
        .from("candidates")
        .select("*")
        .eq("recruiter_id", user.id)
        .order("ai_score", { ascending: false })
        .limit(4);
      
      if (cands) setRecentCandidates(cands);

      const { data: jobs } = await supabase
        .from("job_postings")
        .select("*")
        .eq("recruiter_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (jobs) setActiveJobs(jobs);

    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* ELITE RECRUITER HERO */}
      <div className="relative p-10 md:p-14 rounded-[40px] bg-slate-900 border border-white/5 overflow-hidden group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-violet-600/10 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/10 blur-[100px] rounded-full group-hover:bg-violet-500/20 transition-all duration-1000" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Chief Talent Architect</span>
            </div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter leading-none uppercase">
              RECRUITER <span className="text-violet-500">TACTICAL.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              You're currently managing <span className="text-white font-bold">{stats.jobs} active missions</span> with an average candidate match of <span className="text-violet-400 font-bold">88%</span>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/recruiter/screen">
               <Button variant="outline" className="h-16 px-8 glass border-white/10 text-sm font-black italic rounded-2xl gap-3 transition-all hover:bg-white/5">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  BULK AI SCREEN
               </Button>
            </Link>
            <Link href="/recruiter/jobs/new">
              <Button className="h-16 px-10 bg-violet-600 hover:bg-violet-500 text-lg font-black italic rounded-2xl gap-3 shadow-2xl shadow-violet-500/30 transition-all hover:scale-105 active:scale-95">
                <UserPlus className="w-6 h-6" />
                POST NEW JOB
              </Button>
            </Link>
          </div>
        </div>

        {/* Talent Indicators */}
        <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
           <TalentMetric label="Sourcing Velocity" value="Elite" progress={92} color="blue" />
           <TalentMetric label="Hire Quality" value="98%" progress={98} color="violet" />
           <TalentMetric label="Time to Fill" value="14 Days" progress={85} color="green" />
        </div>
      </div>

      {/* RECRUITER METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EliteRecruiterStat label="Active Roles" value={stats.jobs} trend="+2" icon={Briefcase} color="blue" />
        <EliteRecruiterStat label="Total Assets" value={stats.candidates} trend="+15" icon={Users} color="violet" />
        <EliteRecruiterStat label="In Protocol" value="45" trend="+4" icon={Timer} color="green" />
        <EliteRecruiterStat label="Success Rate" value="94%" trend="+2%" icon={ShieldCheck} color="amber" />
      </div>

      {/* PIPELINE & TALENT INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FUNNEL RADAR */}
        <Card className="lg:col-span-2 glass border-white/5 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <BarChart3 className="w-64 h-64 text-white" />
          </div>

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Hiring Protocol Funnel</h3>
              <p className="text-sm text-slate-500 font-medium">Global candidate flow across active job cycles</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              Live Feed
            </div>
          </div>
          
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="stage" 
                  type="category" 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{ 
                    backgroundColor: "rgba(10, 10, 15, 0.95)", 
                    borderColor: "rgba(255,255,255,0.1)", 
                    borderRadius: "16px",
                    backdropFilter: "blur(8px)"
                  }}
                />
                <Bar dataKey="count" radius={[0, 12, 12, 0]} barSize={40}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* HIGH VALUE ASSETS */}
        <Card className="glass border-white/5 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
          
          <div className="flex items-center gap-3 mb-8">
             <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-violet-500" />
             </div>
             <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Top Assets</h3>
          </div>

          <div className="flex-1 space-y-8">
            {recentCandidates.length > 0 ? (
              recentCandidates.map((cand) => (
                <EliteCandidateRow 
                  key={cand.id}
                  name={cand.name} 
                  role="Senior Candidate" 
                  score={cand.ai_score || 0} 
                />
              ))
            ) : (
              <>
                <EliteCandidateRow name="Sarah Chen" role="Sr. Product Designer" score={98} />
                <EliteCandidateRow name="Marcus Miller" role="Frontend Lead" score={94} />
                <EliteCandidateRow name="Aria Tanaka" role="Systems Architect" score={91} />
                <EliteCandidateRow name="David Park" role="Backend Engineer" score={89} />
              </>
            )}
          </div>

          <Link href="/recruiter/candidates">
            <Button variant="ghost" className="w-full mt-10 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] group">
              TALENT REPOSITORY
              <ChevronRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* AI RECRUITING STRATEGY */}
      <Card className="glass border-violet-500/10 p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-all duration-1000">
           <BrainCircuit className="w-64 h-64 text-violet-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-10">
           <div className="w-24 h-24 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-12 h-12 text-violet-500" />
           </div>
           <div className="space-y-4">
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">AI HIRING INSIGHT</h3>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                "Based on the current candidate pool for the <span className="text-violet-400">Sr. Product Designer</span> role, the market is favoring candidates with <span className="text-white font-bold">Framer Motion</span> and <span className="text-white font-bold">System Design</span> expertise. I suggest moving Sarah Chen directly to the final round to avoid poaching."
              </p>
              <div className="flex gap-4 pt-2">
                 <Badge className="bg-violet-600/10 text-violet-400 border-violet-600/20 px-3 py-1 font-bold text-[10px] uppercase tracking-widest">URGENCY: CRITICAL</Badge>
                 <Badge className="bg-green-600/10 text-green-400 border-green-600/20 px-3 py-1 font-bold text-[10px] uppercase tracking-widest">RETENTION: 95%</Badge>
              </div>
           </div>
        </div>
      </Card>
    </div>
  );
}

function EliteRecruiterStat({ label, value, trend, icon: Icon, color }: any) {
  const colors: any = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} className="transition-all">
      <Card className="glass border-white/5 p-7 flex flex-col gap-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className={cn("p-3.5 rounded-2xl border", colors[color])}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1 text-[11px] font-black text-green-500">
            {trend}
            <Rocket className="w-3 h-3" />
          </div>
        </div>
        <div>
          <div className="text-4xl font-black text-white italic tracking-tighter leading-none mb-2">{value}</div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function TalentMetric({ label, value, progress, color }: any) {
  const colors: any = {
    blue: "bg-blue-600",
    violet: "bg-violet-600",
    green: "bg-green-600"
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-white italic uppercase tracking-tighter">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${progress}%` }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className={cn("h-full rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]", colors[color])} 
         />
      </div>
    </div>
  );
}

function EliteCandidateRow({ name, role, score }: any) {
  return (
    <div className="flex items-start justify-between group cursor-pointer">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-white text-xs group-hover:border-violet-500/50 transition-colors">
          {name.split(' ').map((n: any) => n[0]).join('')}
        </div>
        <div>
          <h4 className="text-sm font-black text-white italic group-hover:text-violet-400 transition-colors uppercase">{name}</h4>
          <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-widest">{role}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className={cn(
          "text-[10px] font-black px-2.5 py-1 rounded-lg border",
          score > 90 ? "bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
        )}>
          {score}%
        </div>
        <div className="flex items-center gap-1.5">
           <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">AI MATCH</span>
        </div>
      </div>
    </div>
  );
}
