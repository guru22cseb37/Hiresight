"use client";

import { motion } from "framer-motion";
import { 
  Plus, Target, Briefcase, FileCheck2, 
  TrendingUp, Calendar, ChevronRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";
import Link from "next/link";

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
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white italic">Job Seeker Command Center</h1>
          <p className="text-slate-400 mt-1">Welcome back. You're 3 interviews away from your goal.</p>
        </div>
        <Link href="/dashboard/analyze">
          <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white gap-2 shadow-lg shadow-blue-500/20">
            <Plus className="w-5 h-5" />
            New AI Analysis
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Applications" 
          value="42" 
          icon={Briefcase} 
          trend="+12% this week" 
          color="blue"
        />
        <StatCard 
          label="Avg ATS Score" 
          value="84" 
          icon={Target} 
          trend="+5pts overall" 
          color="green"
        />
        <StatCard 
          label="Interview Rate" 
          value="24%" 
          icon={Calendar} 
          trend="Top 5% in category" 
          color="violet"
        />
        <StatCard 
          label="Resumes Built" 
          value="12" 
          icon={FileCheck2} 
          trend="5 templates used" 
          color="amber"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 glass border-white/5 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">ATS Score Trend</h3>
              <p className="text-sm text-slate-500">Your average score across all job applications</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              UPWARD TREND
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#16161E", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                  itemStyle={{ color: "#3B82F6" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="glass border-white/5 p-6 md:p-8 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="flex-1 space-y-6">
            <ActivityItem 
              title="Applied to Google" 
              subtitle="Software Engineer III" 
              time="2h ago" 
              status="Applied" 
              score={92}
            />
            <ActivityItem 
              title="Resume Optimized" 
              subtitle="For Netflix Role" 
              time="5h ago" 
              status="Ready" 
              score={87}
            />
            <ActivityItem 
              title="Interview Scheduled" 
              subtitle="At Stripe (Phone Screen)" 
              time="1d ago" 
              status="Interview" 
              score={79}
            />
            <ActivityItem 
              title="New JD Analyzed" 
              subtitle="Amazon SDE II" 
              time="2d ago" 
              status="Analyzed" 
              score={64}
            />
          </div>
          <Button variant="ghost" className="w-full mt-8 text-slate-400 group">
            View All Activity
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color }: any) {
  const colorMap: any = {
    blue: "text-blue-400 bg-blue-500/10",
    green: "text-green-400 bg-green-500/10",
    violet: "text-violet-400 bg-violet-500/10",
    amber: "text-amber-400 bg-amber-500/10",
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="transition-all">
      <Card className="glass border-white/5 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{trend}</span>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function ActivityItem({ title, subtitle, time, status, score }: any) {
  return (
    <div className="flex items-start justify-between group cursor-pointer">
      <div className="flex gap-4">
        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{title}</h4>
          <p className="text-[10px] text-slate-500 mt-1">{subtitle} • {time}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          score > 80 ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
        }`}>
          {score}%
        </div>
        <span className="text-[9px] text-slate-600 uppercase font-bold">{status}</span>
      </div>
    </div>
  );
}
