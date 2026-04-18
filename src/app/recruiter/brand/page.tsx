"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Linkedin, Twitter, Send, 
  Copy, Loader2, Megaphone, Share2,
  Rocket, Zap, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function BrandBuilderPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    perks: "",
    tone: "Bold"
  });

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.company) {
      toast.error("Job Title and Company are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/recruiter/brand/generate", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResults(data);
      toast.success("Brand assets generated!");
    } catch (err) {
      toast.error("Generation failed. Check the signal.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-500 shadow-lg shadow-violet-500/10 border border-violet-500/20">
          <Megaphone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white italic tracking-tighter uppercase">Pulse Brand Builder</h1>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Broadcast your mission to the global talent grid with AI hype.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <Card className="glass border-white/5 p-8 space-y-8 h-fit">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Job Title</Label>
                  <Input 
                    placeholder="e.g. Senior React Architect" 
                    className="glass border-white/10"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company</Label>
                  <Input 
                    placeholder="e.g. Vercel" 
                    className="glass border-white/10"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Key Perks & Differentiators</Label>
              <textarea
                placeholder="e.g. $250k Base, Fully Remote, Unlimited PTO, Founding Team access..."
                className="w-full h-32 bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-slate-300 text-xs leading-relaxed focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                value={formData.perks}
                onChange={(e) => setFormData({...formData, perks: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Brand Voice</Label>
              <div className="flex gap-2">
                {["Bold", "Professional", "Hype", "Short"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFormData({...formData, tone: t})}
                    className={`flex-1 py-3 text-[10px] font-black rounded-xl border transition-all uppercase tracking-widest ${
                      formData.tone === t 
                      ? "bg-violet-600/20 border-violet-500/50 text-violet-400 shadow-lg shadow-violet-500/10" 
                      : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-14 bg-violet-600 hover:bg-violet-500 text-white gap-3 text-lg font-black italic shadow-2xl shadow-violet-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "BUILDING BRAND..." : "GENERATE ASSETS"}
          </Button>
        </Card>

        <div className="space-y-8">
          {results ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              {/* LinkedIn Asset */}
              <Card className="glass border-[#0077B5]/20 p-8 space-y-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Linkedin className="w-24 h-24 text-[#0077B5]" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#0077B5]">
                       <Linkedin className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn Hype Draft</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(results.linkedin)} className="h-8 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white">
                       <Copy className="w-3.5 h-3.5 mr-1" /> COPY
                    </Button>
                 </div>
                 <div className="p-6 bg-slate-950/50 rounded-[24px] border border-white/5 text-xs leading-relaxed text-slate-400 whitespace-pre-wrap">
                    {results.linkedin}
                 </div>
              </Card>

              {/* Twitter Asset */}
              <Card className="glass border-white/5 p-8 space-y-6 group">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                       <Twitter className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">X (Twitter) Thread</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(results.twitter.join('\n\n'))} className="h-8 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white">
                       <Copy className="w-3.5 h-3.5 mr-1" /> COPY ALL
                    </Button>
                 </div>
                 <div className="space-y-4">
                    {results.twitter.map((tweet: string, idx: number) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-slate-300 italic relative">
                         <div className="absolute -left-2 top-4 w-5 h-5 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[9px] font-black text-slate-500 shadow-xl">
                            {idx + 1}
                         </div>
                         {tweet}
                      </div>
                    ))}
                 </div>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01] p-12 text-center">
              <Share2 className="w-12 h-12 text-slate-800 mb-4" />
              <h3 className="text-white font-bold italic uppercase tracking-tighter">Signal Offline</h3>
              <p className="text-slate-600 text-[11px] mt-2 max-w-[250px] font-medium leading-relaxed uppercase">
                Input your mission parameters to broadcast elite-tier recruitment branding across the grid.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
