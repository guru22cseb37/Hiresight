"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Search, Briefcase, MapPin, DollarSign, 
  Target, Zap, Globe, Filter, Sparkles,
  ExternalLink, Building2, ChevronRight,
  Bookmark, Clock, Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast as toastAction } from "sonner";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  matchScore: number;
  tags: string[];
  logo: string | null;
  applyLink?: string;
}

const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    company: "Vercel",
    location: "Remote (San Francisco)",
    salary: "$180k - $240k",
    type: "Full-time",
    posted: "2 hours ago",
    matchScore: 94,
    tags: ["React", "Next.js", "TypeScript", "Node.js"],
    logo: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png"
  },
  {
    id: 2,
    title: "AI Infrastructure Lead",
    company: "OpenAI",
    location: "San Francisco, CA",
    salary: "$250k - $380k",
    type: "Full-time",
    posted: "5 hours ago",
    matchScore: 88,
    tags: ["Python", "Kubernetes", "PyTorch", "Rust"],
    logo: "https://openai.com/favicon.ico"
  },
  {
    id: 3,
    title: "Frontend Architect",
    company: "Stripe",
    location: "Remote",
    salary: "$160k - $210k",
    type: "Full-time",
    posted: "1 day ago",
    matchScore: 72,
    tags: ["React", "UI/UX", "Design Systems"],
    logo: "https://stripe.com/favicon.ico"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$190k - $260k",
    type: "Full-time",
    posted: "3 hours ago",
    matchScore: 91,
    tags: ["GCP", "Docker", "Go", "Terraform"],
    logo: "https://google.com/favicon.ico"
  }
];

export default function JobBoardPage() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const fetchJobs = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/jobs/search?query=${encodeURIComponent(query || "Software Engineer")}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      toastAction.error("Failed to load real-time jobs. Using demo data.");
      // Fallback to some default if API fails
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchJobs]);

  const handleApply = async (job: Job) => {
    setApplyingId(job.id);
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          recruiterId: null, // In a real app, this would come from the job record
          seekerProfile: {
            name: "Guru Dev", // Demo data
            experience: "8 Years",
            location: "SF, California",
            skills: job.tags
          }
        })
      });

      if (!res.ok) throw new Error("Application failed");
      
      toastAction.success(`Application sent to ${job.company}!`);
    } catch (err) {
      toastAction.error("Failed to apply. Please try again.");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-8 px-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 border border-white/5 p-12">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Briefcase className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Job Discovery</span>
          </div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter leading-none">
            FIND YOUR NEXT <br /> <span className="text-blue-500">ELITE ROLE.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Personalized career opportunities matched with your Hiresight profile and ATS-optimized for success.
          </p>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <Input 
                placeholder="Search by title, skill, or company..."
                className="h-14 pl-14 pr-6 bg-slate-950/50 border-white/10 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:border-blue-500/50 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black italic gap-2 shadow-2xl shadow-blue-500/20">
              <Filter className="w-4 h-4" />
              FILTERS
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Job Categories</h3>
            <div className="space-y-2">
              {["Engineering", "Design", "Product", "Marketing", "Data"].map(cat => (
                <div key={cat} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white">{cat}</span>
                  <Badge variant="ghost" className="bg-white/5 border-white/5 text-[9px]">{Math.floor(Math.random() * 50) + 10}</Badge>
                </div>
              ))}
            </div>
          </div>

          <Card className="glass border-white/5 p-6 space-y-4">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">AI Profile Sync</h3>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Based on your Resume, you are a strong match for <span className="text-white font-bold">Cloud & React</span> roles.
            </p>
            <Button variant="outline" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-blue-600 hover:border-blue-600 transition-all">
              Update Profile
            </Button>
          </Card>
        </div>

        {/* Job Feed */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Latest Opportunities
            </h2>
            <span className="text-xs font-bold text-slate-500 tracking-widest">{jobs.length} POSITIONS FOUND</span>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-bold italic tracking-widest animate-pulse">SCANNING GLOBAL JOB MARKETS...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-500">No jobs found for "{search}". Try another search.</p>
              </div>
            ) : (
              jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass border-white/5 p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Logo & Info */}
                    <div className="flex-1 flex gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden p-2 group-hover:scale-105 transition-transform shrink-0">
                        {job.logo ? (
                          <img src={job.logo} alt={job.company} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                        ) : (
                          <Building2 className="w-8 h-8 text-slate-500" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                          <Badge className="bg-blue-600/10 text-blue-400 border-blue-600/20 text-[9px] font-black uppercase tracking-widest">
                            {job.type}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Building2 className="w-3.5 h-3.5" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-green-500/80">
                            <DollarSign className="w-3.5 h-3.5" />
                            {job.salary}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {job.tags.map((tag: string) => (
                            <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-bold text-slate-500 border border-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1 justify-end">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Match Score</span>
                          <Target className={cn(
                            "w-3.5 h-3.5",
                            job.matchScore > 85 ? "text-green-500" : "text-amber-500"
                          )} />
                        </div>
                        <div className={cn(
                          "text-3xl font-black italic tracking-tighter",
                          job.matchScore > 85 ? "text-green-500" : "text-amber-500"
                        )}>
                          {job.matchScore}%
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 text-slate-500 hover:text-white">
                           <Bookmark className="w-4 h-4" />
                         </Button>
                          <Button 
                            onClick={() => job.applyLink ? window.open(job.applyLink, "_blank") : handleApply(job)}
                            disabled={applyingId === job.id}
                            className="bg-blue-600 hover:bg-blue-500 text-[11px] font-black uppercase tracking-widest h-10 px-6 rounded-xl gap-2 active:scale-95 transition-all disabled:opacity-50"
                          >
                            {applyingId === job.id ? <Loader2 className="w-3 h-3 animate-spin" /> : (job.applyLink ? "External Apply" : "Apply Now")}
                            {applyingId !== job.id && <ExternalLink className="w-3 h-3" />}
                          </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Stats */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        Posted {job.posted}
                      </div>
                      <div className="h-3 w-px bg-white/10" />
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <Globe className="w-3 h-3" />
                        Remote Friendly
                      </div>
                    </div>
                    <Button variant="ghost" className="h-6 text-[9px] font-black text-slate-600 hover:text-blue-400 uppercase tracking-[0.2em] gap-1">
                      Full Details <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )))}
          </div>

          <div className="flex justify-center pt-8">
            <Button variant="ghost" className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-[0.4em]">
              Load More Opportunities
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
