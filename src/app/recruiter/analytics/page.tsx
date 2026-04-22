"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, TrendingUp, Users, Target, 
  ArrowUpRight, ArrowDownRight, Zap, 
  Globe, Linkedin, Search, MousePointer2 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Download } from "lucide-react";

export default function AnalyticsPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const stats = {
        reach: "24.8k",
        interviewRate: "18.2%",
        timeToHire: "14d",
        costPerHire: "$1.2k",
        funnel: {
          applications: "1,240",
          screened: "480",
          interviewed: "124",
          offered: "28"
        }
      };

      const res = await fetch("/api/recruiter/analytics/report", {
        method: "POST",
        body: JSON.stringify(stats)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Create download
      const blob = new Blob([data.report], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `HireSight_Intelligence_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Intelligence Report downloaded successfully.");
    } catch (err: any) {
      toast.error("Failed to generate report: " + err.message);
    } finally {
      setDownloading(false);
    }
  };
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white italic">Intelligence Analytics</h1>
          <p className="text-slate-400 mt-1">Deep insights into your hiring funnel and team performance.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleDownload}
            disabled={downloading}
            variant="outline" 
            className="glass border-white/10 text-xs uppercase tracking-widest font-bold gap-2"
          >
            {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            {downloading ? "GENERATING..." : "Download Report"}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase tracking-widest font-bold shadow-lg shadow-blue-500/20">
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Reach" value="24.8k" trend="+12.5%" icon={Globe} color="blue" />
        <MetricCard label="Interview Rate" value="18.2%" trend="+2.4%" icon={Zap} color="violet" />
        <MetricCard label="Time to Hire" value="14d" trend="-2d" icon={Target} color="green" />
        <MetricCard label="Cost per Hire" value="$1.2k" trend="-15%" icon={TrendingUp} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <Card className="lg:col-span-2 glass border-white/5 p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Application Velocity</h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> New</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-violet-500" /> Processed</div>
            </div>
          </div>
          
          {/* Custom SVG Chart Area */}
          <div className="h-64 relative flex items-end justify-between px-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-t border-white/5" />
              ))}
            </div>
            {CHART_DATA.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ delay: i * 0.05, duration: 0.8 }}
                className="w-full max-w-[12px] bg-gradient-to-t from-blue-600/40 to-blue-400 rounded-t-full relative group"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  {val}%
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between px-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </Card>

        {/* Funnel Card */}
        <Card className="glass border-white/5 p-8 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-white">Hiring Funnel</h3>
          <div className="space-y-6">
            <FunnelStep label="Applications" value="1,240" percent={100} color="blue" />
            <FunnelStep label="Screened" value="480" percent={38} color="violet" />
            <FunnelStep label="Interviewed" value="124" percent={10} color="green" />
            <FunnelStep label="Offered" value="28" percent={2.2} color="amber" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
        <SourceCard name="LinkedIn" icon={Linkedin} count="842" color="#0077B5" />
        <SourceCard name="Referrals" icon={Users} count="214" color="#8B5CF6" />
        <SourceCard name="Indeed" icon={Search} count="156" color="#2557A7" />
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, icon: Icon, color }: any) {
  const colors: any = {
    blue: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20",
    violet: "from-violet-500/20 to-violet-600/5 text-violet-400 border-violet-500/20",
    green: "from-green-500/20 to-green-600/5 text-green-400 border-green-500/20",
    amber: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20",
  };
  
  const isUp = trend[0] === "+";

  return (
    <Card className={`glass border-white/5 p-6 bg-gradient-to-br ${colors[color]} hover:scale-[1.02] transition-transform cursor-pointer`}>
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${isUp ? "text-green-400" : "text-amber-400"}`}>
          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mt-1">{label}</div>
      </div>
    </Card>
  );
}

function FunnelStep({ label, value, percent, color }: any) {
  const colors: any = {
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    green: "bg-green-500",
    amber: "bg-amber-500",
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-slate-300">{label}</span>
        <span className="text-xs font-black text-white">{value}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className={`h-full ${colors[color]} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} 
        />
      </div>
    </div>
  );
}

function SourceCard({ name, icon: Icon, count, color }: any) {
  return (
    <Card className="glass border-white/5 p-6 flex items-center justify-between group hover:border-white/10 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-slate-900 border border-white/5 group-hover:scale-110 transition-transform" style={{ color }}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-white">{name}</h4>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{count} Applicants</p>
        </div>
      </div>
      <Button size="icon" variant="ghost" className="text-slate-600 hover:text-white hover:bg-white/5">
        <ArrowUpRight className="w-4 h-4" />
      </Button>
    </Card>
  );
}

const CHART_DATA = [45, 62, 58, 75, 92, 84, 95, 88, 76, 64, 72, 85, 98, 92, 84, 100, 92, 84, 76, 64];
