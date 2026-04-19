"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, Target, Zap, Sparkles, 
  Loader2, BookOpen, ShieldAlert, Rocket,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SkillTree3D } from "@/components/3d/SkillTree3D";

export default function SkillGapPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    targetCompany: "",
    targetRole: "",
    currentSkills: ""
  });

  const handleAnalyze = async () => {
    if (!formData.targetCompany || !formData.targetRole) {
      toast.error("Company and Role are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/skills/gap", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResults(data);
      toast.success("Skill Gap Radar synced!");
    } catch (err) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-500">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white italic tracking-tighter uppercase">Skill Gap Radar</h1>
          <p className="text-slate-400 mt-1">Map your DNA against world-class engineering standards.</p>
        </div>
      </div>

      {/* 3D Skill Network Visualization */}
      <Card className="glass border-violet-500/20 p-2 overflow-hidden h-[500px]">
        <SkillTree3D />
      </Card>

      <div className="grid lg:grid-cols-3 gap-10">
        <Card className="glass border-white/5 p-8 space-y-8 h-fit">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Company</Label>
              <Input 
                placeholder="e.g. OpenAI, Google, Vercel" 
                className="glass border-white/10"
                value={formData.targetCompany}
                onChange={(e) => setFormData({...formData, targetCompany: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Role</Label>
              <Input 
                placeholder="e.g. Senior Frontend Engineer" 
                className="glass border-white/10"
                value={formData.targetRole}
                onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Primary Skills</Label>
              <textarea
                placeholder="e.g. React, Next.js, Node, AWS, TypeScript"
                className="w-full h-32 bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-slate-300 text-xs leading-relaxed focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                value={formData.currentSkills}
                onChange={(e) => setFormData({...formData, currentSkills: e.target.value})}
              />
            </div>
          </div>

          <Button 
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full h-14 bg-violet-600 hover:bg-violet-500 text-white gap-3 text-lg font-black italic shadow-xl shadow-violet-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
            {loading ? "SCANNING..." : "SYNC RADAR"}
          </Button>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {results ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Match Score Card */}
              <Card className="glass border-violet-500/20 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Target className="w-32 h-32 text-violet-500" />
                </div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                   <div>
                      <h3 className="text-xl font-black text-white italic uppercase">Match Integrity</h3>
                      <p className="text-xs text-slate-500">How you stack up against {formData.targetCompany} standards</p>
                   </div>
                   <div className="text-4xl font-black text-violet-400 italic">{results.score}%</div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${results.score}%` }}
                     className="h-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
                   />
                </div>
              </Card>

              {/* Gaps Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="glass border-white/5 p-6 space-y-6">
                   <div className="flex items-center gap-2 text-amber-500">
                      <ShieldAlert className="w-4 h-4" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Technical Gaps</h4>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {results.technicalGaps.map((gap: string) => (
                        <Badge key={gap} variant="outline" className="bg-amber-500/5 text-amber-400 border-amber-500/20 px-3 py-1 text-[9px] font-bold">
                           {gap.toUpperCase()}
                        </Badge>
                      ))}
                   </div>
                </Card>

                <Card className="glass border-white/5 p-6 space-y-6">
                   <div className="flex items-center gap-2 text-blue-400">
                      <Zap className="w-4 h-4" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Cultural Alignment</h4>
                   </div>
                   <div className="space-y-3">
                      {results.culturalGaps.map((gap: string) => (
                        <div key={gap} className="flex items-start gap-3 text-[11px] text-slate-400 font-medium">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                           {gap}
                        </div>
                      ))}
                   </div>
                </Card>
              </div>

              {/* Bridge Plan */}
              <Card className="glass border-blue-500/10 p-8 space-y-8 bg-blue-500/5">
                 <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Tactical Bridge Plan</h3>
                 </div>
                 <div className="grid md:grid-cols-3 gap-6">
                    {results.bridgePlan.map((step: any, idx: number) => (
                      <div key={idx} className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-blue-500/20 transition-all">
                         <div className="w-6 h-6 rounded-lg bg-blue-600/10 flex items-center justify-center text-[10px] font-black text-blue-500 mb-2">
                            {idx + 1}
                         </div>
                         <h5 className="text-xs font-bold text-white leading-tight">{step.action}</h5>
                         <p className="text-[10px] text-slate-500 leading-relaxed">{step.reason}</p>
                      </div>
                    ))}
                 </div>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01] p-12 text-center">
              <Search className="w-12 h-12 text-slate-800 mb-4" />
              <h3 className="text-white font-bold italic uppercase tracking-tighter">Radar Silent</h3>
              <p className="text-slate-600 text-[11px] mt-2 max-w-[250px] font-medium leading-relaxed">
                Sync your radar to identify the exact technical and cultural requirements for your target company.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
