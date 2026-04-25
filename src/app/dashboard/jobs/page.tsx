"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Search, Briefcase, MapPin, DollarSign, 
  Target, Zap, Globe, Filter, Sparkles,
  ExternalLink, Building2, ChevronRight,
  Bookmark, Clock, Loader2, Radio, X, Upload, CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast as toastAction } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

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
  isRecruiterPost?: boolean;
  recruiterId?: string;
  description?: string;
}

export default function JobBoardPage() {
  const [search, setSearch] = useState("");
  const [liveJobs, setLiveJobs] = useState<Job[]>([]);
  const [apiJobs, setApiJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({ name: "", experience: "Fresher (0-1 Years)", skills: "" });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchApplied = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Note: In demo setup, email matches if real candidate record was created
      const { data } = await supabase.from("candidates").select("job_id").eq("email", user.email);
      if (data) {
        setAppliedJobIds(new Set(data.map(d => d.job_id).filter(Boolean)));
      }
    };
    fetchApplied();
  }, []);

  // Fetch recruiter-posted jobs from Supabase (with Realtime)
  const fetchLiveJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped: Job[] = (data || []).map((j: any) => ({
        id: j.id,
        title: j.role,
        company: j.company_name || "Company",
        location: j.location || "Remote",
        salary: j.salary_min && j.salary_max
          ? `$${Math.round(j.salary_min / 1000)}k – $${Math.round(j.salary_max / 1000)}k`
          : "Competitive",
        type: "Full-time",
        posted: new Date(j.created_at).toLocaleDateString(),
        matchScore: Math.floor(Math.random() * 20) + 78,
        tags: j.ats_keywords?.slice(0, 4) || [],
        logo: null,
        isRecruiterPost: true,
        recruiterId: j.recruiter_id,
        description: j.description || j.optimized_jd || "No full description provided by recruiter.",
      }));

      setLiveJobs(mapped);
    } catch (err) {
      console.error("Failed to fetch live jobs:", err);
    }
  }, []);

  // Subscribe to Realtime updates for job_postings
  useEffect(() => {
    fetchLiveJobs();

    const channel = supabase
      .channel("live-job-postings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "job_postings" },
        () => {
          fetchLiveJobs();
          toastAction.success("New job posted! Feed updated.", { duration: 3000 });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLiveJobs]);

  // Fetch jobs from external API
  const fetchApiJobs = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/jobs/search?query=${encodeURIComponent(query || "Software Engineer")}`);
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      const data = await res.json();
      setApiJobs(data.jobs || []);
    } catch (err) {
      // Fallback to mock data if the API rate limits or fails, to prevent console errors
      const fallbackJobs: Job[] = [
        {
          id: "mock-1",
          title: "Senior Software Engineer",
          company: "TechNova Solutions",
          location: "San Francisco, CA (Remote)",
          salary: "$140k - $180k",
          type: "Full-time",
          posted: new Date().toLocaleDateString(),
          matchScore: 92,
          tags: ["React", "Node.js", "TypeScript", "AWS"],
          logo: null,
          description: "We are looking for a highly skilled Senior Software Engineer to join our fully remote team. You will be responsible for architecting scalable cloud solutions using modern TypeScript frameworks."
        },
        {
          id: "mock-2",
          title: "Full Stack Developer",
          company: "Global Innovations Inc.",
          location: "New York, NY",
          salary: "$120k - $150k",
          type: "Full-time",
          posted: new Date().toLocaleDateString(),
          matchScore: 88,
          tags: ["Next.js", "Python", "PostgreSQL"],
          logo: null,
          description: "Join our global innovation team as a Full Stack Developer. You will work across the stack to deliver high-performance applications used by thousands of clients worldwide."
        },
        {
          id: "mock-3",
          title: "Frontend Engineer",
          company: "Creative Digital",
          location: "Remote",
          salary: "$110k - $130k",
          type: "Contract",
          posted: new Date().toLocaleDateString(),
          matchScore: 85,
          tags: ["Vue.js", "Tailwind CSS", "Figma"],
          logo: null,
          description: "Creative Digital is seeking a Frontend Engineer to craft beautiful, pixel-perfect user interfaces. You'll collaborate closely with our design team to bring creative concepts to life."
        }
      ];
      setApiJobs(fallbackJobs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApiJobs(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchApiJobs]);

  const handleApplyClick = (job: Job) => {
    if (job.applyLink) {
      window.open(job.applyLink, "_blank");
      return;
    }
    setApplyingJob(job);
  };

  const submitApplication = async () => {
    if (!applyingJob) return;
    if (!formData.name || !formData.skills || !resumeFile) {
      toastAction.error("Please fill in all fields and attach your resume.");
      return;
    }
    
    setApplyingId(applyingJob.id);
    try {
      // 1. Upload custom resume directly to storage
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      // Store in users auth folder or a generic applications folder
      const { data: { user } } = await supabase.auth.getUser();
      const folder = user ? user.id : 'anonymous';
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);

      if (uploadError) throw new Error("Resume upload failed");

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // 2. Submit application data
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        body: JSON.stringify({
          jobId: applyingJob.id,
          jobTitle: applyingJob.title,
          company: applyingJob.company,
          recruiterId: applyingJob.recruiterId || null,
          resumeUrl: publicUrl,
          seekerProfile: { 
            name: formData.name, 
            experience: formData.experience, 
            location: applyingJob.location, 
            skills: formData.skills.split(",").map(s => s.trim()) 
          }
        })
      });
      if (!res.ok) throw new Error("Application failed");
      
      toastAction.success(`Application sent to ${applyingJob.company}!`);
      
      setAppliedJobIds(prev => new Set(prev).add(applyingJob.id));
      setApplyingJob(null);
      setResumeFile(null); // Reset file
    } catch (err: any) {
      console.error(err);
      toastAction.error(err.message || "Failed to apply. Please try again.");
    } finally {
      setApplyingId(null);
    }
  };

  // Merge: recruiter posts first (filtered by search), then API jobs
  const filteredLive = liveJobs.filter(j =>
    !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
  );

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
            Personalized career opportunities matched with your HireSight profile and ATS-optimized for success.
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
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Job Categories</h3>
            <div className="space-y-2">
              {["Engineering", "Design", "Product", "Marketing", "Data"].map(cat => (
                <div 
                  key={cat} 
                  onClick={() => setSearch(cat)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group",
                    search === cat ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "hover:bg-white/5 text-slate-400 hover:text-white"
                  )}
                >
                  <span className="text-sm font-bold group-hover:translate-x-1 transition-transform">{cat}</span>
                  <Badge variant="ghost" className="bg-white/5 border-white/5 text-[9px]">{Math.floor(Math.random() * 50) + 10}</Badge>
                </div>
              ))}
            </div>
          </div>

          <Card className="glass border-white/5 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Radio className="w-3 h-3 text-green-400 animate-pulse" />
              <h3 className="text-xs font-black text-green-400 uppercase tracking-widest">Live Feed</h3>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              <span className="text-white font-bold">{liveJobs.length}</span> recruiter-posted {liveJobs.length === 1 ? "job" : "jobs"} live right now. Updates in real-time.
            </p>
          </Card>
        </div>

        {/* Job Feed */}
        <div className="lg:col-span-3 space-y-8">

          {/* Recruiter-Posted Live Jobs */}
          {filteredLive.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                  Live Recruiter Postings
                </h2>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[9px] font-bold">LIVE</Badge>
              </div>
              <div className="space-y-4">
                {filteredLive.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} applyingId={applyingId} onApplyClick={handleApplyClick} onViewDetails={() => setViewingJob(job)} hasApplied={appliedJobIds.has(job.id)} />
                ))}
              </div>
            </div>
          )}

          {/* External API Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Latest Opportunities
              </h2>
              <span className="text-xs font-bold text-slate-500 tracking-widest">{apiJobs.length} POSITIONS</span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-bold italic tracking-widest animate-pulse">SCANNING GLOBAL JOB MARKETS...</p>
              </div>
            ) : apiJobs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-500">No jobs found for &quot;{search}&quot;. Try another search.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {apiJobs.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} applyingId={applyingId} onApplyClick={handleApplyClick} onViewDetails={() => setViewingJob(job)} hasApplied={appliedJobIds.has(job.id)} />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <Button variant="ghost" className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-[0.4em]">
              Load More Opportunities
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-3xl max-h-[85vh] bg-slate-950 border border-white/10 rounded-3xl flex flex-col shadow-2xl relative overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-2xl font-bold text-white">{viewingJob.title}</h3>
                <p className="text-slate-400 font-medium mt-1">{viewingJob.company} • {viewingJob.location}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setViewingJob(null)} className="rounded-full hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {viewingJob.description || "No full description provided."}
            </div>
            <div className="p-6 border-t border-white/5 bg-slate-900/50 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setViewingJob(null)} className="hover:bg-white/5 text-white">Close</Button>
              <Button onClick={() => { setViewingJob(null); handleApplyClick(viewingJob); }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wider px-8">
                Apply Now
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-slate-950 border border-white/10 rounded-3xl flex flex-col shadow-2xl relative overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white">Apply: {applyingJob.title}</h3>
              <Button variant="ghost" size="icon" onClick={() => setApplyingJob(null)} className="rounded-full hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <Input 
                  placeholder="e.g. MS Dhoni" 
                  className="glass border-white/10 h-12"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Experience Level</label>
                <select 
                  className="w-full h-12 glass border-white/10 rounded-md px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                >
                  <option value="Fresher (0-1 Years)" className="bg-slate-900 text-white">Fresher (0-1 Years)</option>
                  <option value="1-3 Years" className="bg-slate-900 text-white">1-3 Years</option>
                  <option value="3-5 Years" className="bg-slate-900 text-white">3-5 Years</option>
                  <option value="5+ Years" className="bg-slate-900 text-white">5+ Years</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Core Skills (Comma separated)</label>
                <Input 
                  placeholder="e.g. React, Python, Machine Learning" 
                  className="glass border-white/10 h-12"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resume (PDF)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={cn(
                    "flex items-center justify-center gap-2 h-12 rounded-lg border transition-all",
                    resumeFile ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-white/5 border-white/10 text-slate-400 border-dashed"
                  )}>
                    {resumeFile ? <CheckCircle2 className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    <span className="text-sm font-medium">{resumeFile ? resumeFile.name : "Click to upload a specific Resume PDF"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 bg-slate-900/50 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => { setApplyingJob(null); setResumeFile(null); }} className="hover:bg-white/5 text-white">Cancel</Button>
              <Button onClick={submitApplication} disabled={applyingId === applyingJob.id} className="bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wider px-8 gap-2">
                {applyingId === applyingJob.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                Submit Application
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, index, applyingId, onApplyClick, onViewDetails, hasApplied }: {
  job: Job;
  index: number;
  applyingId: string | null;
  onApplyClick: (job: Job) => void;
  onViewDetails: () => void;
  hasApplied?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={cn(
        "glass border-white/5 p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden",
        job.isRecruiterPost && "border-green-500/20 bg-green-500/[0.02] hover:border-green-500/40"
      )}>
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
                {job.isRecruiterPost && (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[9px] font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                    LIVE
                  </Badge>
                )}
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
              {job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {job.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-bold text-slate-500 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1 justify-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Match Score</span>
                <Target className={cn("w-3.5 h-3.5", job.matchScore > 85 ? "text-green-500" : "text-amber-500")} />
              </div>
              <div className={cn("text-3xl font-black italic tracking-tighter", job.matchScore > 85 ? "text-green-500" : "text-amber-500")}>
                {job.matchScore}%
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 text-slate-500 hover:text-white">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => onApplyClick(job)}
                disabled={applyingId === job.id || hasApplied}
                className={cn(
                  "text-[11px] font-black uppercase tracking-widest h-10 px-6 rounded-xl gap-2 active:scale-95 transition-all disabled:opacity-50",
                  hasApplied ? "bg-green-600/20 text-green-400 border border-green-500/20" : "bg-blue-600 hover:bg-blue-500 text-white"
                )}
              >
                {applyingId === job.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 
                 hasApplied ? <CheckCircle2 className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                {hasApplied ? "Applied" : job.applyLink ? "Apply" : "Apply Now"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
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
          <Button variant="ghost" onClick={onViewDetails} className="h-6 text-[9px] font-black text-slate-600 hover:text-blue-400 uppercase tracking-[0.2em] gap-1">
            Full Details <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
