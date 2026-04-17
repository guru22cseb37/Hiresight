"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Linkedin, Sparkles, TrendingUp, Search, 
  MessageSquare, UserPlus, Info, CheckCircle2,
  Zap, Copy, Layout, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function LinkedinOptimizerPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleOptimize = () => {
    setLoading(true);
    // Simulate LinkedIn analysis
    setTimeout(() => {
      setResults(MOCK_LINKEDIN_RESULTS);
      setLoading(false);
      toast.success("Profile optimized! See the recommendations below.");
    }, 2000);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0077B5]/10 flex items-center justify-center text-[#0077B5]">
            <Linkedin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white italic">LinkedIn Optimizer</h1>
            <p className="text-slate-400 mt-1">Boost your visibility and attract 3x more recruiter DMs.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Input Panel */}
        <Card className="glass border-white/5 p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Current Headline</Label>
              <Input 
                placeholder="e.g. Software Engineer at TechCorp | React & Node" 
                className="glass border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">About Section / Summary</Label>
              <textarea
                placeholder="Paste your 'About' section here..."
                className="w-full h-64 bg-slate-950/50 border border-white/5 rounded-2xl p-6 text-slate-300 text-sm leading-relaxed focus:outline-none focus:border-[#0077B5]/50 transition-all resize-none"
              />
            </div>
          </div>

          <Button 
            onClick={handleOptimize}
            disabled={loading}
            className="w-full h-14 bg-[#0077B5] hover:bg-[#0077B5]/80 text-white gap-2 text-lg shadow-xl shadow-[#0077B5]/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Optimize Profile Visibility
          </Button>
        </Card>

        {/* Results Panel */}
        <div className="relative min-h-[500px]">
          {!results && !loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
              <Search className="w-12 h-12 text-slate-800 mb-4" />
              <p className="text-slate-600 text-sm">Optimization results will appear here</p>
            </div>
          ) : loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border-4 border-[#0077B5]/20 border-t-[#0077B5] rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-white font-bold italic">Analyzing LinkedIn SEO Algorithms...</p>
                <p className="text-xs text-slate-500 mt-2">Checking keyphrases and search density</p>
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full space-y-6">
              <Card className="glass border-[#0077B5]/20 p-8 shadow-2xl shadow-[#0077B5]/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-bold text-white">Presence Score</h3>
                  </div>
                  <div className="text-2xl font-black text-white">{results.score}%</div>
                </div>

                <div className="space-y-6">
                  <OptimizeItem title="Headline SEO" desc={results.headline} />
                  <OptimizeItem title="Keyword Density" desc={results.keywords} />
                  <OptimizeItem title="Call to Action" desc={results.cta} />
                </div>
              </Card>

              <Card className="glass border-white/5 p-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Linkedin className="w-24 h-24 text-[#0077B5]" />
                 </div>
                 <h4 className="text-sm font-bold text-[#0077B5] uppercase tracking-widest mb-4">Suggested About Section</h4>
                 <div className="p-4 bg-slate-950/50 rounded-xl font-mono text-xs leading-relaxed text-slate-400 border border-white/5">
                    {results.about}
                 </div>
                 <Button className="mt-6 w-full gap-2 bg-white/5 hover:bg-white/10 text-white text-xs h-10 border-white/5">
                    <Copy className="w-3 h-3" />
                    Copy Optimized About Section
                 </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function OptimizeItem({ title, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex-shrink-0">
        <CheckCircle2 className="w-4 h-4 text-[#0077B5]" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-200">{title}</h4>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const MOCK_LINKEDIN_RESULTS = {
  score: 92,
  headline: "Headline is SEO strong, but consider adding 'Problem Solver' or specific tech stack for niche search.",
  keywords: "Found 12 critical industry keywords. Missing: 'Cloud Architecture', 'Agile Leadership'.",
  cta: "Add a clear instruction like 'DMs open for collaborations' to increase inbound by 25%.",
  about: "🚀 Senior Fullstack Engineer | Specialized in building high-performance React systems for 500k+ users.\n\nOver the last 5 years, I've helped scale infrastructure at Fortune 500 companies and boutique startups alike. I believe in clean code, automated testing, and building products that actually solve human problems.\n\n✨ Expert in: React, Node.js, AWS, Kubernetes, and Technical Leadership.\n\n📬 Open for new challenges. Let's build something great."
};
