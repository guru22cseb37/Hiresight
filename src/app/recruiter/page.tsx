"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, UserCheck, Timer, 
  TrendingUp, Search, UserPlus, FileText,
  ChevronRight, MoreVertical, Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

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

      // 1. Fetch Stats
      const [jobsRes, candidatesRes] = await Promise.all([
        supabase.from("job_postings").select("id", { count: "exact" }).eq("recruiter_id", user.id),
        supabase.from("candidates").select("id", { count: "exact" }).eq("recruiter_id", user.id)
      ]);

      setStats({
        jobs: jobsRes.count || 0,
        candidates: candidatesRes.count || 0,
        interviews: 0, // Mocked for now
        offers: 0      // Mocked for now
      });

      // 2. Fetch Recent Candidates (Top matches)
      const { data: cands } = await supabase
        .from("candidates")
        .select("*")
        .eq("recruiter_id", user.id)
        .order("ai_score", { ascending: false })
        .limit(4);
      
      if (cands) setRecentCandidates(cands);

      // 3. Fetch Active Job Postings
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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white italic">Recruiter Command Suite</h1>
          <p className="text-slate-400 mt-1">
            {stats.candidates > 0 
              ? `You have ${stats.candidates} total candidates across ${stats.jobs} active roles.`
              : "Welcome back! Start by posting a new job to find top talent."}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/recruiter/screen">
            <Button variant="outline" className="h-12 px-6 glass border-white/10 gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Bulk Screen
            </Button>
          </Link>
          <Link href="/recruiter/jobs/new">
            <Button className="h-12 px-6 bg-violet-600 hover:bg-violet-500 text-white gap-2 shadow-lg shadow-violet-500/20">
              <UserPlus className="w-5 h-5" />
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RecruiterStatCard label="Active Jobs" value={stats.jobs} trend="+0 this month" color="blue" icon={Briefcase} />
        <RecruiterStatCard label="Total Candidates" value={stats.candidates} trend="+0 new" color="indigo" icon={Users} />
        <RecruiterStatCard label="In Interview" value="45" trend="Mock Data" color="violet" icon={Timer} />
        <RecruiterStatCard label="Offers Sent" value="12" trend="Mock Data" color="fuchsia" icon={UserCheck} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Funnel Chart */}
        <Card className="lg:col-span-2 glass border-white/5 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Hiring Funnel</h3>
              <p className="text-sm text-slate-500">Candidate flow across all active job postings</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest">
              Live Pipeline
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="stage" 
                  type="category" 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{ backgroundColor: "#111118", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={32}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recently Scored Talents */}
        <Card className="glass border-white/5 p-8 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Top Matches</h3>
          <div className="flex-1 space-y-6">
            {recentCandidates.length > 0 ? (
              recentCandidates.map((cand) => (
                <CandidateRow 
                  key={cand.id}
                  name={cand.name} 
                  role="Candidate" 
                  score={cand.ai_score || 0} 
                  time={formatDistanceToNow(new Date(cand.created_at)) + " ago"} 
                />
              ))
            ) : (
              <>
                <CandidateRow name="Sarah Chen" role="Sr. Product Designer" score={98} time="Demo" />
                <CandidateRow name="Marcus Miller" role="Frontend Lead" score={94} time="Demo" />
              </>
            )}
          </div>
          <Link href="/recruiter/candidates">
            <Button variant="ghost" className="w-full mt-8 text-slate-400 group border border-white/5 hover:bg-white/5">
              View All Candidates
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Active Postings Table Preview */}
      <Card className="glass border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Active Postings</h3>
          <Link href="/recruiter/jobs">
            <Button variant="outline" size="sm" className="glass h-8 text-xs">View All</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white/[0.01]">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {activeJobs.length > 0 ? (
                activeJobs.map((job) => (
                  <JobRow 
                    key={job.id}
                    title={job.role} 
                    status={job.status.charAt(0).toUpperCase() + job.status.slice(1)} 
                    applicants={0} 
                    date={formatDistanceToNow(new Date(job.created_at)) + " ago"} 
                  />
                ))
              ) : (
                <JobRow title="Sample Job Role" status="Active" applicants={0} date="Now" />
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function RecruiterStatCard({ label, value, trend, color, icon: Icon }: any) {
  const colorMap: any = {
    blue: "text-blue-400 bg-blue-500/10",
    indigo: "text-indigo-400 bg-indigo-500/10",
    violet: "text-violet-400 bg-violet-500/10",
    fuchsia: "text-fuchsia-400 bg-fuchsia-500/10",
  };
  return (
    <motion.div whileHover={{ y: -5 }} className="transition-all">
      <Card className="glass border-white/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{trend}</span>
        </div>
        <div>
          <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-[0.2em]">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function CandidateRow({ name, role, score, time }: any) {
  return (
    <div className="flex items-start justify-between group">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center font-bold text-white text-xs">
          {name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors uppercase italic">{name}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">{role} • {time}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className={`text-xs font-black ${score > 90 ? "text-violet-400" : "text-blue-400"}`}>
          {score}%
        </div>
        <span className="text-[10px] text-slate-700 uppercase font-black">AI Score</span>
      </div>
    </div>
  );
}

function JobRow({ title, status, applicants, date }: any) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] group transition-colors">
      <td className="px-6 py-4">
        <div className="text-slate-200 font-bold group-hover:text-violet-400 transition-colors">{title}</div>
        <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Job Posting</div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
          status === "Active" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
        }`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-400 font-medium">{date}</td>
      <td className="px-6 py-4 text-right">
        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-600 hover:text-white">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}
