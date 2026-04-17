"use client";

import { useState } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, MoreVertical, 
  MapPin, Calendar, ExternalLink, ArrowRight,
  TrendingUp, CheckCircle2, Clock, XCircle, AlertCircle
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
  { id: "ready", name: "Ready", icon: Clock },
  { id: "applied", name: "Applied", icon: CheckCircle2 },
  { id: "interviewing", name: "Interviewing", icon: TrendingUp },
  { id: "offered", name: "Offer", icon: Plus },
  { id: "rejected", name: "Rejected", icon: XCircle },
];

export default function trackerPage() {
  const [items, setItems] = useState(MOCK_APPLICATIONS);
  const [search, setSearch] = useState("");

  const filteredItems = items.filter(i => 
    i.company.toLowerCase().includes(search.toLowerCase()) ||
    i.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Stats Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
          <DetailStat label="Total" value={items.length} color="blue" />
          <DetailStat label="Interviews" value={items.filter(i => i.status === "interviewing").length} color="violet" />
          <DetailStat label="Offers" value={items.filter(i => i.status === "offered").length} color="green" />
          <DetailStat label="Avg Score" value="84%" color="amber" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search companies..." 
              className="pl-10 glass border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="glass border-white/10">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-10 min-h-[600px] -mx-6 px-6 no-scrollbar">
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

function KanbanColumn({ column: Col, items }: any) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Col.icon className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">{Col.name}</h3>
          <Badge variant="outline" className="text-[10px] h-5 bg-white/5 border-white/5 text-slate-500">{items.length}</Badge>
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-600 hover:text-white">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-4">
        {items.map((item: any) => (
          <ApplicationCard key={item.id} application={item} />
        ))}
        {items.length === 0 && (
          <div className="h-32 rounded-2xl border-2 border-dashed border-white/5 flex items-center justify-center text-slate-700 text-xs italic">
            No items in {Col.name}
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ application: app }: any) {
  return (
    <motion.div
      layoutId={app.id}
      whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.4)" }}
      className="p-5 rounded-2xl glass border-white/5 bg-white/[0.02] flex flex-col gap-4 group cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-white text-lg">
            {app.company[0]}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-none mb-1">{app.role}</h4>
            <p className="text-[10px] text-slate-500 font-medium">{app.company}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity")}>
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-950 border-white/10">
            <DropdownMenuItem className="text-xs">View Details</DropdownMenuItem>
            <DropdownMenuItem className="text-xs">Edit Note</DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-red-400">Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {app.location}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {app.date}
        </div>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
        <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
          app.score > 80 ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
        }`}>
          {app.score}% Match
        </div>
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">AI</div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailStat({ label, value, color }: any) {
  const colors: any = {
    blue: "text-blue-400",
    violet: "text-violet-400",
    green: "text-green-400",
    amber: "text-amber-400"
  };
  return (
    <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
      <div className={`text-xl font-bold ${colors[color]}`}>{value}</div>
      <div className="text-[9px] text-slate-600 uppercase font-black tracking-widest">{label}</div>
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
