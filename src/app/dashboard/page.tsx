"use client";

import { motion } from "framer-motion";
import { 
  Plus, Target, Briefcase, FileCheck2, 
  TrendingUp, Calendar, ChevronRight,
  Sparkles, BrainCircuit, Zap, ArrowUpRight,
  Clock, CheckCircle2, AlertCircle, BarChart3,
  Bike, CarFront, Rocket
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

import { Magnetic } from "@/components/ui/Magnetic";
import { getTechnicalScore } from "@/app/actions/intelligence";

const AutonomousAgentHub = dynamic(() => import("@/components/dashboard/AutonomousAgentHub").then(mod => mod.AutonomousAgentHub), {
  ssr: false,
  loading: () => <div className="h-96 w-full glass animate-pulse rounded-[32px] border border-white/5" />
});

const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });

import Link from "next/link";
import { Badge } from "../../components/ui/badge";
import { cn } from "@/lib/utils";

const chartData = [
  { name: "Mon", score: 65 },
  { name: "Tue", score: 68 },
  { name: "Wed", score: 75 },
  { name: "Thu", score: 72 },
  { name: "Fri", score: 84 },
  { name: "Sat", score: 84 },
  { name: "Sun", score: 88 },
];

export default function DashboardPage() {
  const [journeyScore, setJourneyScore] = useState(25);
  return (
    <div className="space-y-12 pb-20">
      {/* ELITE HERO SECTION */}
      <div className="relative p-6 md:p-14 rounded-[32px] md:rounded-[40px] bg-slate-950 border border-white/5 overflow-hidden group">
        {/* Elite Command Center Background */}
        <div className="absolute inset-0 bg-[url('/command-bg.png')] bg-cover bg-center opacity-35 group-hover:scale-110 transition-transform duration-[4000ms] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Candidate Commander</span>
            </div>
            <div className="flex flex-col xl:flex-row xl:items-end gap-4 md:gap-6">
              <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">
                COMMAND <span className="text-blue-500">CENTER.</span>
              </h1>
              {/* CAREER JOURNEY ANIMATION */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 pb-1 group/journey relative">
                 <CareerJourney score={journeyScore} />
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => setJourneyScore((prev) => (prev >= 100 ? 0 : prev + 25))}
                   className="h-7 px-2 text-[7px] md:text-[8px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-400 bg-white/5 border border-white/5 rounded-lg"
                 >
                    Simulate
                 </Button>
              </div>
            </div>
            <p className="text-slate-400 text-sm md:text-lg font-medium max-w-md leading-relaxed">
              Your profile is currently <span className="text-white font-bold">top 5%</span> in the engineering category.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link href="/dashboard/analyze" className="w-full">
              <Magnetic strength={0.3}>
                <Button className="w-full h-14 md:h-16 px-8 md:px-10 bg-blue-600 hover:bg-blue-500 text-base md:text-lg font-black italic rounded-xl md:rounded-2xl gap-3 shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
                  <Plus className="w-5 h-5 md:w-6 md:h-6" />
                  NEW ANALYSIS
                </Button>
              </Magnetic>
            </Link>
          </div>
        </div>

        {/* Milestone Indicator */}
        <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
           <Milestone label="Next Milestone" value="FAANG Interview" progress={75} color="blue" />
           <Milestone label="ATS Health" value="Optimized" progress={88} color="green" />
           <Milestone label="Network Power" value="Elite" progress={62} color="violet" />
        </div>
      </div>

      {/* CORE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EliteStatCard 
          label="Active Pipeline" 
          value="42" 
          icon={Briefcase} 
          trend="+12%" 
          description="In-progress applications"
          color="blue"
        />
        <EliteStatCard 
          label="Match Velocity" 
          value="84" 
          icon={Target} 
          trend="+5.2" 
          description="Avg ATS performance"
          color="green"
        />
        <EliteStatCard 
          label="Callback Rate" 
          value="24%" 
          icon={Calendar} 
          trend="+2%" 
          description="Interview conversion"
          color="violet"
        />
        <EliteStatCard 
          label="Asset Library" 
          value="12" 
          icon={FileCheck2} 
          trend="+3" 
          description="Tailored resumes"
          color="amber"
        />
      </div>

      {/* AUTONOMOUS AGENT HUB */}
      <AutonomousAgentHub />

      {/* INTELLIGENCE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TACTICAL MISSIONS */}
        <Card className="glass border-blue-500/20 p-8 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12">
             <Target className="w-48 h-48 text-blue-500" />
          </div>
          <div className="relative z-10 space-y-8 flex-1 flex flex-col">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-500" />
                   </div>
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Daily Missions</h3>
                </div>
                <Badge className="bg-blue-600 text-[9px] font-black uppercase">3 ACTIVE</Badge>
             </div>

             <div className="space-y-6 flex-1">
                <MissionItem 
                  title="Optimize for Stripe" 
                  desc="Inject 5 missing keywords into your Resume v2."
                  reward="+20 XP"
                />
                <MissionItem 
                  title="Network Pulse" 
                  desc="Draft and send 2 DMs to Vercel recruiters."
                  reward="+50 XP"
                />
                <MissionItem 
                  title="Market Research" 
                  desc="Check 3 companies for verified business status."
                  reward="+15 XP"
                />
             </div>

             <div className="pt-6 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                   <span>Daily Progress</span>
                   <span className="text-blue-400">33%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full w-1/3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                </div>
             </div>
          </div>
        </Card>

        {/* PROFORMANCE CHART */}
        <Card className="lg:col-span-2 glass border-white/5 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <BarChart3 className="w-64 h-64 text-white" />
          </div>

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Market Readiness</h3>
              <p className="text-sm text-slate-500 font-medium">Historical performance across 30+ domains</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5" />
              Peak Performance
            </div>
          </div>
          
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false}
                  dy={15}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false}
                  dx={-15}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                  contentStyle={{ 
                    backgroundColor: "rgba(10, 10, 15, 0.95)", 
                    borderColor: "rgba(255,255,255,0.1)", 
                    borderRadius: "16px", 
                    padding: "12px 16px",
                    backdropFilter: "blur(8px)"
                  }}
                  itemStyle={{ color: "#3B82F6", fontWeight: "bold" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* PULSE ACTIVITY */}
        <Card className="glass border-white/5 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          
          <div className="flex items-center gap-3 mb-8">
             <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-500" />
             </div>
             <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Live Pulse</h3>
          </div>

          <div className="flex-1 space-y-8">
            <PulseItem 
              title="Applied @ Google" 
              subtitle="Software Engineer III" 
              time="2h ago" 
              score={92}
              status="Applied"
            />
            <PulseItem 
              title="Resume Optimized" 
              subtitle="Netflix L6 Role" 
              time="5h ago" 
              score={87}
              status="Ready"
            />
            <PulseItem 
              title="Interview Intel" 
              subtitle="Stripe Technical" 
              time="1d ago" 
              score={79}
              status="Active"
            />
            <PulseItem 
              title="JD Analysis" 
              subtitle="Amazon SDE II" 
              time="2d ago" 
              score={64}
              status="Review"
            />
          </div>

          <Button variant="ghost" className="w-full mt-10 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] group">
            Global Activity Logs
            <ChevronRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </div>

      {/* ELITE INTELLIGENCE SCORECARD */}
      <IntelligenceScorecard />
    </div>
  );
}

function IntelligenceScorecard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIntel() {
      try {
        const res = await getTechnicalScore({
           activity: ["Applied Google", "Optimized Resume", "Interview Prep Stripe"],
           market: "High demand for System Design and Rust"
        });
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchIntel();
  }, []);

  return (
    <Card className="glass border-blue-500/10 p-8 md:p-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-all duration-1000">
         <BrainCircuit className="w-64 h-64 text-blue-500" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-10">
         <div className="relative w-24 h-24 shrink-0">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative w-24 h-24 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
               {loading ? (
                 <Sparkles className="w-10 h-10 text-blue-500 animate-spin" />
               ) : (
                 <div className="text-3xl font-black text-blue-500 italic tracking-tighter">{data?.score || 85}</div>
               )}
            </div>
         </div>
         <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
               <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">ELITE INTELLIGENCE ENGINE</h3>
               <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">LLAMA 3 70B ACTIVE</Badge>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              {loading ? "Decrypting market pulse and profiling your technical depth..." : `"${data?.justification || "You are currently outperforming 92% of technical applicants in your category. Strategic aggressive outreach recommended."}"`}
            </p>
            <div className="flex gap-4 pt-2">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">FAANG READINESS</span>
                  <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: loading ? "0%" : `${data?.score || 85}%` }}
                       className="h-full bg-blue-500"
                     />
                  </div>
               </div>
               <Badge className="bg-green-600/10 text-green-400 border-green-600/20 px-3 py-1 font-bold text-[10px] uppercase tracking-widest">CONFIDENCE: {loading ? "CALCULATING..." : "MAX"}</Badge>
            </div>
         </div>
         <div className="hidden xl:flex flex-col gap-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
               <span className="text-[8px] font-black text-slate-500 uppercase">Top Skill</span>
               <span className="text-xs font-bold text-white uppercase italic">System Design</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
               <span className="text-[8px] font-black text-slate-500 uppercase">Growth</span>
               <span className="text-xs font-bold text-green-500">+14%</span>
            </div>
         </div>
      </div>
    </Card>
  );
}

function EliteStatCard({ label, value, icon: Icon, trend, description, color }: any) {
  const colors: any = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} className="transition-all">
      <Card className="glass border-white/5 p-5 md:p-7 flex flex-col gap-4 md:gap-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className={cn("p-2.5 md:p-3.5 rounded-xl md:rounded-2xl border", colors[color])}>
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex items-center gap-1 text-[10px] md:text-[11px] font-black text-green-500">
            {trend}
            <ArrowUpRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
          </div>
        </div>
        <div>
          <div className="text-3xl md:text-4xl font-black text-white italic tracking-tighter leading-none mb-1 md:mb-2">{value}</div>
          <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1">{label}</p>
          <p className="text-[9px] md:text-[10px] text-slate-600 font-medium">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function Milestone({ label, value, progress, color }: any) {
  const colors: any = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    violet: "bg-violet-600"
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
           className={cn("h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]", colors[color])} 
         />
      </div>
    </div>
  );
}

function PulseItem({ title, subtitle, time, score, status }: any) {
  return (
    <div className="flex items-start justify-between group cursor-pointer">
      <div className="flex gap-4">
        <div className="relative mt-2">
           <div className="w-2.5 h-2.5 rounded-full bg-blue-500 relative z-10" />
           <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping opacity-50" />
        </div>
        <div>
          <h4 className="text-sm font-black text-white italic group-hover:text-blue-400 transition-colors">{title}</h4>
          <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className={cn(
          "text-[10px] font-black px-2.5 py-1 rounded-lg border",
          score > 80 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
        )}>
          {score}%
        </div>
        <div className="flex items-center gap-1.5">
           <Clock className="w-2.5 h-2.5 text-slate-600" />
           <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{time}</span>
        </div>
      </div>
    </div>
  );
}

function MissionItem({ title, desc, reward }: any) {
  return (
    <div className="group cursor-pointer">
       <div className="flex items-start gap-4">
          <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center mt-0.5 group-hover:border-blue-500/50 transition-colors">
             <div className="w-2 h-2 rounded-sm bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <h5 className="text-xs font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{title}</h5>
                <span className="text-[8px] font-black text-blue-500/50">{reward}</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-tight font-medium">{desc}</p>
          </div>
       </div>
    </div>
  );
}

function CareerJourney({ score }: { score: number }) {
  const isElite = score >= 90;
  const isGrowing = score >= 70 && score < 90;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  return (
    <div className="flex flex-col items-start gap-2 max-w-full overflow-hidden">
       <div className="flex items-center gap-2 md:gap-3 w-full">
          <div className="flex-1 md:w-48 h-8 md:h-10 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 relative overflow-hidden flex items-center px-3 md:px-4 min-w-[140px]">
             {/* Path Line */}
             <div className="absolute inset-x-3 md:inset-x-4 h-0.5 bg-white/10 rounded-full" />
             
             {/* Progress Vehicle */}
             <motion.div 
               initial={{ x: -10 }}
               animate={{ x: score > 50 ? (score - 20) * (isMobile ? 0.8 : 1.5) : 0 }}
               transition={{ duration: 2, ease: "easeInOut" }}
               className="relative z-10"
             >
                {isElite ? (
                   <div className="relative">
                      <Rocket className="w-5 h-5 text-yellow-400 rotate-45" />
                      <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-2 bg-yellow-500/40 blur-sm rounded-full" />
                   </div>
                ) : isGrowing ? (
                   <div className="relative">
                      <CarFront className="w-5 h-5 text-blue-400" />
                      <motion.div animate={{ x: [-2, 0, -2] }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-1 bg-blue-500/20 blur-xs" />
                   </div>
                ) : (
                   <Bike className="w-5 h-5 text-slate-400" />
                )}
             </motion.div>
          </div>
          <div className="flex flex-col">
             <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">
                {isElite ? "SUPERSONIC GROWTH" : isGrowing ? "HIGH SPEED ASCENT" : "INITIAL TRACTION"}
             </span>
             <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                {isElite ? "EXTRACTING SUCCESS" : isGrowing ? "ACCELERATING CAREER" : "GEARING UP"}
             </span>
          </div>
       </div>
    </div>
  );
}
