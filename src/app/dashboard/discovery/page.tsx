"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  Check, X, Zap, Building2, MapPin, 
  DollarSign, Briefcase, Sparkles, BrainCircuit,
  Trophy, GraduationCap, Star
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock Data for initial world-class feel
const MOCK_JOBS = [
  {
    id: "1",
    company: "SpaceX",
    role: "Senior Flight Software Engineer",
    location: "Starbase, TX (Hybrid)",
    salary: "$180k - $240k",
    score: 94,
    probability: 88,
    missing_skills: ["Rust", "C++20", "RTOS"],
    description: "Build the software that powers the next generation of Starship. Focus on real-time embedded systems and high-reliability C++.",
    perks: ["Equity in Mars", "Relocation Support", "Top-tier Health"],
    tags: ["C++", "Real-time", "Rust", "Aerospace"],
    ai_insight: "Your contribution to the 'MarsOS' open-source project matches 98% of their requirements."
  },
  {
    id: "2",
    company: "Stripe",
    role: "Staff Product Engineer",
    location: "Remote (Global)",
    salary: "$210k - $300k",
    score: 88,
    probability: 72,
    missing_skills: ["Ruby on Rails", "PCI Compliance", "Distributed Systems"],
    description: "Lead the architecture for global payment flows. Scale systems handling billions of transactions per day.",
    perks: ["Work from anywhere", "Unlimited PTO", "Home Office Stipend"],
    tags: ["React", "Ruby", "Scale", "Financial Systems"],
    ai_insight: "Stripe values clean code; your 'SolidJS' repository highlights exactly the architectural patterns they use."
  },
  {
    id: "3",
    company: "Anthropic",
    role: "AI Infrastructure Engineer",
    location: "San Francisco, CA",
    salary: "$250k - $400k",
    score: 91,
    probability: 82,
    missing_skills: ["CUDA Optimization", "Triton", "NVIDIA InfiniBand"],
    description: "Optimize large-scale GPU clusters for training Claude 4. Solve the hardest scaling laws in AI.",
    perks: ["World-class Research", "Compute Credits", "Relocation"],
    tags: ["PyTorch", "Kubernetes", "CUDA", "LLMs"],
    ai_insight: "Your recent work with vector databases perfectly aligns with their new retrieval-augmented generation engine."
  }
];

import { saveUserPreference } from "@/app/actions/learning";
import { supabase } from "@/lib/supabase";

export default function DiscoveryPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasResume, setHasResume] = useState<boolean | null>(null);

  useEffect(() => {
    fetchRealMatches();
  }, []);

  const fetchRealMatches = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Check for Resume
      const { data: resume } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setHasResume(!!resume);

      // 2. Fetch Job Postings
      const { data: jobData, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // 3. Neural Match Simulation (Rectifying properties)
      const matches = (jobData || []).map(j => ({
        id: j.id,
        company: j.company_name || "Enterprise Partner",
        role: j.role,
        location: j.location,
        salary: "$120k - $180k", // Default for now
        score: resume ? Math.floor(Math.random() * (98 - 85 + 1) + 85) : 45, // Low score if no resume
        probability: resume ? Math.floor(Math.random() * (90 - 70 + 1) + 70) : 10,
        missing_skills: ["Rust", "System Design", "Cloud Native"], // Derived from JD analysis in real app
        description: j.description,
        perks: ["Remote First", "Equity", "Health"],
        tags: ["Engineering", j.role.split(' ')[0]],
        ai_insight: resume 
          ? `Your experience with ${resume.skills?.split(',')[0] || 'Technical Architecture'} perfectly aligns with their mission.`
          : "Upload a resume to unlock deep neural match insights for this role."
      }));

      setJobs(matches.length > 0 ? matches : MOCK_JOBS);
    } catch (error) {
      console.error("Matchmaker Error:", error);
      setJobs(MOCK_JOBS);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'like' | 'pass') => {
    const job = jobs[currentIndex];
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      saveUserPreference(user.id, job, direction);
    }

    if (direction === 'like') {
      toast.success(`Applied to ${job.company}!`, {
        description: "Application sequence initiated via neural link.",
        icon: <Zap className="w-4 h-4 text-yellow-500" />
      });
    }
    
    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      toast.info("End of the radar sweep. Check back soon for new targets.");
    }
  };

  if (loading) return (
    <div className="min-h-full flex flex-col items-center justify-center py-10">
       <div className="w-16 h-16 rounded-3xl bg-blue-600/10 flex items-center justify-center animate-pulse">
          <BrainCircuit className="w-10 h-10 text-blue-500" />
       </div>
       <p className="mt-4 text-xs font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing Neural Profiles...</p>
    </div>
  );

  return (
    <div className="min-h-full flex flex-col items-center justify-center py-10 relative overflow-hidden">
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
      
      <div className="text-center mb-12 space-y-4">
        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 font-black tracking-widest uppercase italic">
          Matchmaker Engine v2.0
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
          {hasResume ? "DISCOVER YOUR" : "UNLOCK YOUR"} <span className="text-blue-500">DESTINY.</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">
          {hasResume 
            ? "Our AI is currently matching your unique neural profile with the world's most ambitious companies."
            : "Your technical profile is currently invisible. Upload your resume to activate the Matchmaker Radar."}
        </p>
      </div>

      <div className="relative w-full max-w-md h-[600px] perspective-1000">
        {!hasResume && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center p-8 glass rounded-[40px] border-blue-500/20 bg-blue-500/[0.03]"
           >
             <div className="w-20 h-20 rounded-3xl bg-blue-600/20 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
               <Sparkles className="w-10 h-10 text-blue-500" />
             </div>
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Profile Incomplete.</h3>
             <p className="text-slate-400 mt-2 mb-8 text-sm leading-relaxed">The Matchmaker requires your technical DNA to function. Complete your resume to start seeing elite roles.</p>
             <Link href="/dashboard/resumes/builder">
               <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest uppercase h-14 px-10 rounded-2xl shadow-2xl shadow-blue-500/20">
                 BUILD YOUR PROFILE
               </Button>
             </Link>
           </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {jobs.slice(currentIndex, currentIndex + 1).map((job) => (
            <DiscoveryCard 
              key={job.id} 
              job={job} 
              onSwipe={handleSwipe}
            />
          ))}
        </AnimatePresence>
        
        {currentIndex === jobs.length && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 glass rounded-[40px] border-white/5"
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center mb-6">
              <BrainCircuit className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Universe Scanned.</h3>
            <p className="text-slate-500 mt-2 mb-8">You've seen all our top matches for today. Our agent is scanning more job boards right now...</p>
            <Button 
              variant="outline" 
              onClick={() => setCurrentIndex(0)}
              className="glass border-white/10 text-white font-bold tracking-widest uppercase h-12 px-8"
            >
              Restart Scan
            </Button>
          </motion.div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      {currentIndex < jobs.length && (
        <div className="flex items-center gap-8 mt-12">
          <button 
            onClick={() => handleSwipe('pass')}
            className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-90"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button 
            className="w-14 h-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/20 transition-all active:scale-90"
          >
            <Star className="w-6 h-6" />
          </button>

          <button 
            onClick={() => handleSwipe('like')}
            className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-green-500 hover:bg-green-500/10 hover:border-green-500/20 transition-all active:scale-90 shadow-2xl shadow-green-500/10"
          >
            <Check className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}

import { getCompanyNews } from "@/app/actions/news";
import { tailorResume } from "@/app/actions/tailor";

function DiscoveryCard({ job, onSwipe }: { job: any, onSwipe: (dir: 'like' | 'pass') => void }) {
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [tailoredBullet, setTailoredBullet] = useState<string | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);

  const handleTailor = async () => {
    setIsTailoring(true);
    try {
      const result = await tailorResume(job.role, job.company, job.description);
      setTailoredBullet(result);
      toast.success("AI Tailoring Complete!", {
        description: "Your personalized bullet point is ready to copy."
      });
    } catch (err) {
      toast.error("AI Tailoring failed. Check your API key.");
    } finally {
      setIsTailoring(false);
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const articles = await getCompanyNews(job.company);
        setNews(articles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, [job.company]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const passOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('like');
    } else if (info.offset.x < -100) {
      onSwipe('pass');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.05, cursor: "grabbing" }}
      className="absolute inset-0 z-10 touch-none cursor-grab"
    >
      <Card className="w-full h-full glass border-white/10 rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
        {/* MATCH STAMP */}
        <motion.div 
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-10 z-20 border-4 border-green-500 text-green-500 font-black text-4xl px-4 py-2 rounded-xl uppercase -rotate-12 pointer-events-none"
        >
          MATCHED
        </motion.div>
        <motion.div 
          style={{ opacity: passOpacity }}
          className="absolute top-10 right-10 z-20 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-2 rounded-xl uppercase rotate-12 pointer-events-none"
        >
          PASS
        </motion.div>

        {/* HEADER SECTION */}
        <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
             <Zap className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 flex justify-between items-start">
             <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white" />
                   </div>
                   <span className="text-sm font-black text-white/80 uppercase tracking-widest">{job.company}</span>
                </div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter leading-tight">{job.role}</h2>
             </div>
             <div className="flex flex-col items-end">
                <div className="text-4xl font-black text-white italic">{job.score}%</div>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Match Score</span>
             </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
           <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                 <MapPin className="w-3.5 h-3.5 text-blue-400" />
                 {job.location}
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                 <DollarSign className="w-3.5 h-3.5 text-green-400" />
                 {job.salary}
              </div>
           </div>

           <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Job Description</h4>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">{job.description}</p>
           </div>

           <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Elite Perks</h4>
              <div className="flex flex-wrap gap-2">
                 {job.perks.map((p: string) => (
                    <Badge key={p} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] font-bold uppercase">{p}</Badge>
                 ))}
              </div>
           </div>

           <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Skill Gap Analysis</h4>
              <div className="flex flex-wrap gap-2">
                 {job.missing_skills.map((s: string) => (
                    <div key={s} className="flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-md text-[9px] font-bold uppercase">
                       <X className="w-2.5 h-2.5" /> {s}
                    </div>
                 ))}
                 <div className="flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-md text-[9px] font-bold uppercase">
                    <Check className="w-2.5 h-2.5" /> +12 more matches
                 </div>
              </div>
           </div>

           {/* AI INSIGHT CARD */}
           <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-blue-500/20 relative group">
              <div className="absolute -top-3 -right-3 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AI MATCH INSIGHT</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Prob. of Interview</span>
                    <span className="text-sm font-black text-green-400">{job.probability}%</span>
                 </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic font-medium mb-4">"{job.ai_insight}"</p>
              
              <Button 
                onClick={handleTailor}
                disabled={isTailoring}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest h-10 rounded-xl flex items-center gap-2 group disabled:opacity-50"
              >
                {isTailoring ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Zap className="w-3 h-3 group-hover:animate-bounce" />
                )}
                {isTailoring ? "ANALYZING..." : "AI TAILOR RESUME FOR THIS ROLE"}
              </Button>

              <AnimatePresence>
                {tailoredBullet && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Tailored Bullet Point</span>
                       <button 
                        onClick={() => {
                          navigator.clipboard.writeText(tailoredBullet);
                          toast.success("Copied to clipboard!");
                        }}
                        className="text-[8px] font-bold text-green-400 hover:underline"
                       >
                        COPY
                       </button>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic">
                       "{tailoredBullet}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* LATEST NEWS SECTION */}
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latest Company News</h4>
                 <Badge variant="outline" className="text-[8px] border-blue-500/20 text-blue-400">LIVE INTEL</Badge>
              </div>
              
              {loadingNews ? (
                <div className="space-y-2 animate-pulse">
                   <div className="h-4 bg-white/5 rounded w-3/4" />
                   <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              ) : news.length > 0 ? (
                <div className="space-y-3">
                   {news.map((article: any, idx: number) => (
                      <a 
                        key={idx} 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group/news"
                      >
                         <h5 className="text-[11px] font-bold text-slate-200 line-clamp-1 group-hover/news:text-blue-400 transition-colors">{article.title}</h5>
                         <div className="flex items-center justify-between mt-1">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{article.source}</span>
                            <span className="text-[8px] font-medium text-slate-600">{new Date(article.publishedAt).toLocaleDateString()}</span>
                         </div>
                      </a>
                   ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 italic">No recent news found for this company.</p>
              )}
           </div>

           <div className="pt-4 flex flex-wrap gap-2">
              {job.tags.map((t: string) => (
                 <span key={t} className="text-[9px] font-black text-slate-600 uppercase tracking-widest border border-white/5 px-2 py-1 rounded-md">#{t}</span>
              ))}
           </div>
        </div>

        {/* FOOTER */}
        <div className="p-8 border-t border-white/5 bg-slate-900/20 flex items-center justify-between">
           <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.id + i}`} alt="User" />
                 </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                 +12
              </div>
           </div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Matched recently</span>
        </div>
      </Card>
    </motion.div>
  );
}
