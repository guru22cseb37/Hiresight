"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, MoreVertical, 
  MapPin, Calendar, TrendingUp, CheckCircle2, 
  Clock, XCircle, Zap, Crosshair, 
  ChevronRight, Terminal, BarChart3,
  GanttChart, Command, Sparkles
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const COLUMNS = [
  { id: "ready", name: "Strategic Prep", icon: Crosshair, color: "blue" },
  { id: "applied", name: "Active Deployment", icon: Send, color: "violet" },
  { id: "interviewing", name: "In Extraction", icon: TrendingUp, color: "green" },
  { id: "offered", name: "Asset Secured", icon: Sparkles, color: "amber" },
  { id: "rejected", name: "Mission Aborted", icon: XCircle, color: "slate" },
];

function Send({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  );
}

export default function TrackerPage() {
  const [items, setItems] = useState(MOCK_APPLICATIONS);
  const [search, setSearch] = useState("");

  const filteredItems = items.filter(i => 
    i.company.toLowerCase().includes(search.toLowerCase()) ||
    i.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      {/* TACTICAL HEADER */}
      <div className="flex flex-col xl:flex-row gap-10 justify-between items-start xl:items-center">
        <div className="flex flex-col md:flex-row gap-6 w-full xl:w-auto">
          <TacticalStat label="Active Missions" value={items.length} icon={Command} color="blue" />
          <TacticalStat label="Interview Depth" value={items.filter(i => i.status === "interviewing").length} icon={GanttChart} color="green" />
          <TacticalStat label="Victory Points" value={items.filter(i => i.status === "offered").length} icon={Sparkles} color="amber" />
          <TacticalStat label="Avg Readiness" value="84%" icon={BarChart3} color="violet" />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="SEARCH THE GRID..." 
              className="h-14 pl-12 pr-6 glass border-white/5 focus:border-blue-500/50 text-[10px] font-black uppercase tracking-[0.2em] placeholder:text-slate-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 w-14 glass border-white/5 hover:bg-white/10 transition-all">
            <Filter className="w-5 h-5 text-slate-500" />
          </Button>
          <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white gap-3 text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20">
            <Plus className="w-5 h-5" />
            NEW MISSION
          </Button>
        </div>
      </div>

      {/* KANBAN THEATRE */}
      <div className="flex gap-8 overflow-x-auto pb-12 min-h-[700px] -mx-6 px-6 scrollbar-hide">
        {COLUMNS.map((col) => (
          <KanbanColumn 
            key={col.id} 
            column={col} 
            items={filteredItems.filter(i => i.status === col.id)} 
          />
        ))}
      </div>
    </div>
  );
}

function KanbanColumn({ column, items }: any) {
  const colorMap: any = {
    blue: "from-blue-500/10",
    violet: "from-violet-500/10",
    green: "from-green-500/10",
    amber: "from-amber-500/10",
    slate: "from-slate-500/10"
  };

  const textMap: any = {
    blue: "text-blue-400",
    violet: "text-violet-400",
    green: "text-green-400",
    amber: "text-amber-400",
    slate: "text-slate-400"
  };

  return (
    <div className="flex-shrink-0 w-[340px] flex flex-col gap-8 group">
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-white/5 border border-white/5 transition-all group-hover:scale-110", textMap[column.color])}>
            <column.icon className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
             <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{column.name}</h3>
             <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{items.length} ASSETS</p>
          </div>
        </div>
        <div className={cn("h-1 flex-1 mx-6 rounded-full bg-gradient-to-r opacity-20", colorMap[column.color], "to-transparent")} />
      </div>

      <div className="flex-1 space-y-5">
        <AnimatePresence mode="popLayout">
          {items.map((item: any) => (
            <ApplicationCard key={item.id} application={item} color={column.color} />
          ))}
        </AnimatePresence>
        {items.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-40 rounded-[32px] border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center gap-3 text-slate-700"
          >
            <Terminal className="w-6 h-6 opacity-20" />
            <span className="text-[9px] font-black uppercase tracking-widest">Zone Clear</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ application: app, color }: any) {
  const colorMap: any = {
    blue: "border-blue-500/20 group-hover:border-blue-500/40 shadow-blue-500/5",
    violet: "border-violet-500/20 group-hover:border-violet-500/40 shadow-violet-500/5",
    green: "border-green-500/20 group-hover:border-green-500/40 shadow-green-500/5",
    amber: "border-amber-500/20 group-hover:border-amber-500/40 shadow-amber-500/5",
    slate: "border-slate-500/20 group-hover:border-slate-500/40 shadow-slate-500/5",
  };

  const textMap: any = {
    blue: "text-blue-400 bg-blue-500/10",
    green: "text-green-400 bg-green-500/10",
    violet: "text-violet-400 bg-violet-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    slate: "text-slate-400 bg-slate-500/10",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={cn(
        "p-7 rounded-[32px] glass border bg-white/[0.02] flex flex-col gap-6 group cursor-grab active:cursor-grabbing transition-all",
        colorMap[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-white text-xl italic shadow-inner">
            {app.company[0]}
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-white leading-none uppercase tracking-tight">{app.role}</h4>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{app.company}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-slate-600 hover:text-white transition-colors")}>
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-950/90 backdrop-blur-xl border-white/10 p-2 rounded-xl">
            <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest gap-2 py-2.5">
               <MapPin className="w-3.5 h-3.5 text-blue-500" /> MISSION INTEL
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest gap-2 py-2.5">
               <Zap className="w-3.5 h-3.5 text-amber-500" /> FAST TRACK
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest gap-2 py-2.5 text-red-400">
               <XCircle className="w-3.5 h-3.5" /> ABORT MISSION
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-6 text-[9px] text-slate-500 font-black uppercase tracking-[0.1em]">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-700" />
          {app.location}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-700" />
          {app.date}
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
        <div className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black italic uppercase tracking-widest", textMap[color])}>
          {app.score}% READINESS
        </div>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
           </div>
           <ChevronRight className="w-4 h-4 text-slate-800" />
        </div>
      </div>
    </motion.div>
  );
}

function TacticalStat({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    violet: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20"
  };

  return (
    <div className="flex items-center gap-4 px-6 py-4 rounded-3xl glass border-white/5 min-w-[200px] group hover:border-white/10 transition-all">
      <div className={cn("p-3 rounded-2xl border transition-transform group-hover:scale-110", colors[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-black text-white italic tracking-tighter leading-none">{value}</div>
        <div className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] mt-1">{label}</div>
      </div>
    </div>
  );
}

const MOCK_APPLICATIONS = [
  { id: "1", role: "Sr. Frontend Engineer", company: "Meta", location: "Menlo Park", date: "2d ago", status: "applied", score: 94 },
  { id: "2", role: "Software Engineer III", company: "Google", location: "Remote", date: "3d ago", status: "interviewing", score: 87 },
  { id: "3", role: "Product Designer", company: "Stripe", location: "New York", date: "5d ago", status: "ready", score: 76 },
  { id: "4", role: "React Developer", company: "Netflix", location: "Remote", date: "1w ago", status: "offered", score: 89 },
  { id: "5", role: "Frontend Lead", company: "Vercel", location: "Global", date: "2h ago", status: "ready", score: 91 },
  { id: "6", role: "Fullstack Developer", company: "Amazon", location: "Seattle", date: "1d ago", status: "interviewing", score: 62 },
];
