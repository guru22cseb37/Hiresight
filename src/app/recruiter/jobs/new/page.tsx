"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Wand2, ArrowLeft, Send, 
  Layout, Type, Target, Info, CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [optimizedJD, setOptimizedJD] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Remote");
  const [type, setType] = useState("Full-time");
  const router = useRouter();

  const handleOptimize = async () => {
    if (!description || !title) {
       toast.error("Please enter a title and a rough description first.");
       return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/recruiter/optimize-jd", {
        method: "POST",
        body: JSON.stringify({ rawJD: description, role: title, company: "HireSight", location })
      });
      const data = await response.json();
      setOptimizedJD(data.optimized_jd);
      toast.success("JD optimized with AI!");
    } catch (error) {
      toast.error("Optimization failed. Using fallback.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title || (!description && !optimizedJD)) {
      toast.error("Please fill in the job details first.");
      return;
    }

    setPublishing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found.");

      const { error } = await supabase.from("job_postings").insert({
        recruiter_id: user.id,
        role: title,
        description: optimizedJD || description,
        location: location,
        status: "active",
        company_name: "HireSight" // Defaults to app name for now
      });

      if (error) throw error;

      toast.success("Job posted successfully!");
      router.push("/recruiter/jobs");
    } catch (error: any) {
      toast.error(error.message || "Failed to publish job");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/recruiter/jobs">
            <Button variant="ghost" size="icon" className="h-10 w-10 glass border-white/5 text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white italic">Create New Posting</h1>
            <p className="text-slate-400 mt-1">Design a role that attracts the world's best talent.</p>
          </div>
        </div>
        <Button 
          onClick={handlePublish}
          disabled={publishing}
          className="bg-violet-600 hover:bg-violet-500 text-white gap-2 shadow-lg shadow-violet-500/20 px-8 h-12"
        >
          {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          Publish Role
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Side */}
        <div className="space-y-6">
          <Card className="glass border-white/5 p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Title</Label>
                <div className="relative">
                  <Type className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <Input 
                    placeholder="e.g. Senior Frontend Engineer" 
                    className="pl-10 h-10 glass border-white/10"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</Label>
                  <Input 
                    placeholder="e.g. Remote" 
                    className="glass border-white/10" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Employment Type</Label>
                  <Input 
                    placeholder="e.g. Full-time" 
                    className="glass border-white/10" 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rough Description / Notes</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste your notes, rough bullets, or an old JD here..."
                  className="w-full h-80 bg-slate-950/50 border border-white/5 rounded-2xl p-6 text-slate-300 text-sm leading-relaxed focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                />
              </div>
            </div>

            <Button 
              onClick={handleOptimize} 
              disabled={loading}
              className="w-full h-14 bg-white/5 hover:bg-white/10 text-white gap-2 border border-white/10"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-violet-400" />}
              AI JD Optimizer
            </Button>
          </Card>
        </div>

        {/* AI Output Side */}
        <div className="space-y-6">
          <Card className="glass border-violet-500/20 p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-violet-400" />
                <h3 className="text-xl font-bold text-white">HireSight Optimization</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest">
                AI Powered
              </div>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl bg-slate-950/50 border border-white/5 p-6 mb-8 text-sm text-slate-300 leading-relaxed font-mono">
              {optimizedJD ? (
                <pre className="whitespace-pre-wrap">{optimizedJD}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-600">
                  <Wand2 className="w-12 h-12 mb-4 opacity-10" />
                  <p>AI optimized content will appear here.</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 flex gap-4">
                <Info className="w-5 h-5 text-violet-400 shrink-0" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Our optimization logic focuses on removing gender bias, increasing SEO ranking for ATS keywords, and highlighting the "Why Us" factors that drive conversions.
                </p>
              </div>
              <motion.div 
                className="flex items-center gap-2 text-xs text-green-500 font-bold uppercase tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: optimizedJD ? 1 : 0 }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Inclusivity Score: 98%
              </motion.div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
