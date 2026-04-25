"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, MoreVertical, 
  Users, Calendar, Clock, MapPin,
  CheckCircle2, AlertCircle, FileText,
  Trash2, Copy, BarChart3, Settings2,
  Loader2
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
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

export default function JobsManagementPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("job_postings")
        .select(`
          *,
          candidates(id, ai_score)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map real jobs to the UI structure and merge with mocks
      const realJobs = (data || []).map(j => {
        const cands = j.candidates || [];
        return {
          id: j.id,
          title: j.role,
          location: j.location,
          type: "Full-time", // Default
          date: formatDistanceToNow(new Date(j.created_at)) + " ago",
          status: j.status,
          applicants: cands.length,
          matches: cands.filter((c: any) => c.ai_score && c.ai_score >= 85).length,
          isReal: true
        };
      });

      setJobs([...realJobs, ...MOCK_JOBS]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs(MOCK_JOBS); // Fallback to mocks
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white italic">Job Management</h1>
          <p className="text-slate-400 mt-1">Manage your active, draft, and closed job postings.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/recruiter/jobs/new">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white gap-2 shadow-lg shadow-violet-500/20">
              <Plus className="w-5 h-5" />
              Post New Role
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
        <div className="flex gap-4 w-full md:w-auto">
          <DetailStat label="Active" value={jobs.filter(j => j.status === 'active').length} color="green" />
          <DetailStat label="Drafts" value={jobs.filter(j => j.status === 'draft').length} color="slate" />
          <DetailStat label="Closed" value={jobs.filter(j => j.status === 'closed').length} color="red" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search roles..." 
              className="pl-10 h-10 glass border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="glass border-white/10" onClick={fetchJobs}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {loading && jobs.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>
    </div>
  );
}

function JobCard({ job }: any) {
  return (
    <Card className={cn(
      "glass border-white/5 p-6 group hover:border-violet-500/30 transition-all",
      job.isReal && "border-blue-500/20 bg-blue-500/[0.02]"
    )}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center font-bold text-white text-2xl group-hover:text-violet-400 transition-colors">
          {job.title[0]}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">{job.title}</h3>
            <Badge className={`${
              job.status === 'active' ? 'bg-green-500/10 text-green-500' : 
              job.status === 'draft' ? 'bg-slate-500/10 text-slate-500' : 'bg-red-500/10 text-red-500'
            } border-none text-[10px] font-bold uppercase tracking-widest`}>
              {job.status}
            </Badge>
            {job.isReal && <Badge className="bg-blue-600 text-[8px] h-4">LIVE</Badge>}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</div>
            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.type}</div>
            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Posted {job.date}</div>
          </div>
        </div>

        <div className="flex items-center gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{job.applicants}</div>
            <div className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Applicants</div>
          </div>
          <div className="text-center">
             <div className="text-xl font-bold text-violet-400">{job.matches}</div>
             <div className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Top Matches</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 glass border-white/5 text-slate-400 hover:text-white">
               <BarChart3 className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-10 w-10 glass border-white/5 text-slate-400 hover:text-white")}>
                <MoreVertical className="w-5 h-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-950 border-white/10">
                <DropdownMenuItem className="text-xs">Edit Job Post</DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-xs"
                  onClick={() => window.location.href = "/recruiter/candidates"}
                >
                  View Candidates
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Copy External Link</DropdownMenuItem>
                <DropdownMenuItem className="text-xs text-amber-500">Close Posting</DropdownMenuItem>
                <DropdownMenuItem className="text-xs text-red-400">Delete Permanently</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DetailStat({ label, value, color }: any) {
  const colors: any = {
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    slate: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  };
  return (
    <div className={`px-4 py-1.5 rounded-xl border flex items-center gap-3 ${colors[color]}`}>
      <span className="text-lg font-bold">{value}</span>
      <span className="text-[10px] uppercase font-black tracking-widest opacity-60">{label}</span>
    </div>
  );
}

const MOCK_JOBS = [
  { id: "mock-1", title: "Senior React Developer", location: "San Francisco / Remote", type: "Full-time", date: "2d ago", status: "active", applicants: 124, matches: 12 },
  { id: "mock-2", title: "Frontend Team Lead", location: "New York, NY", type: "Full-time", date: "5d ago", status: "active", applicants: 86, matches: 8 },
  { id: "mock-3", title: "Product Designer", location: "Remote", type: "Contract", date: "1w ago", status: "active", applicants: 45, matches: 5 },
  { id: "mock-4", title: "Junior UX Engineer", location: "London, UK", type: "Full-time", date: "2w ago", status: "draft", applicants: 0, matches: 0 },
  { id: "mock-5", title: "Engineering Manager", location: "Stockholm, SE", type: "Full-time", date: "3w ago", status: "closed", applicants: 230, matches: 25 },
];
