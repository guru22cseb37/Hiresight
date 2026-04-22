"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SearchCode, Target, Zap, Sparkles, 
  Loader2, Rocket, ShieldCheck, Cpu,
  Terminal, Search, UserCheck, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function SourcingHUDPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    dreamCandidate: "",
    jobRole: ""
  });

  const handleScan = async () => {
    if (!formData.dreamCandidate) {
      toast.error("Describe your dream candidate first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/recruiter/sourcing/scan", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResults(data);
      toast.success("Talent grid scanned. Assets extracted.");
    } catch (err) {
      toast.error("Sourcing scan failed. Check the grid.");
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async (candidate: any) => {
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData?.user) {
        toast.error("Please login to extract assets.");
        return;
      }

      // Ensure matchScore is a valid number for the 'int' column
      const score = typeof candidate.matchScore === 'number' 
        ? Math.round(candidate.matchScore) 
        : parseInt(candidate.matchScore) || 0;

      const { error: dbError } = await supabase.from("candidates").insert({
        recruiter_id: userData.user.id,
        name: candidate.name || "Unknown Candidate",
        ai_score: score,
        ai_summary: candidate.extractionReason || "",
        strengths: candidate.skills || [],
        stage: "new",
        notes: `Extracted via Autonomous Sourcing HUD. Current Role: ${candidate.currentRole}`
      });

      if (dbError) {
        console.error("Supabase Database Error:", dbError);
        throw new Error(dbError.message);
      }

      toast.success(`${candidate.name} has been extracted to your pipeline!`);
    } catch (err: any) {
      console.error("Detailed Extraction Error:", err);
      toast.error(`Extraction failed: ${err.message || "Unknown Error"}`);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
          <SearchCode className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white italic tracking-tighter uppercase">Autonomous Sourcing HUD</h1>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Deploy AI agents to extract elite talent from the global grid.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <Card className="glass border-white/5 p-8 space-y-8 h-fit">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Role</Label>
              <Input 
                placeholder="e.g. Lead Distributed Systems Engineer" 
                className="glass border-white/10"
                value={formData.jobRole}
                onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">The Dream Asset (Natural Language)</Label>
              <textarea
                placeholder="e.g. Find me someone who has scaled Go microservices to 500k RPS and understands high-frequency trading latency..."
                className="w-full h-48 bg-slate-950/50 border border-white/5 rounded-2xl p-6 text-slate-300 text-xs leading-relaxed focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                value={formData.dreamCandidate}
                onChange={(e) => setFormData({...formData, dreamCandidate: e.target.value})}
              />
            </div>
          </div>

          <Button 
            onClick={handleScan}
            disabled={loading}
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white gap-3 text-lg font-black italic shadow-xl shadow-blue-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cpu className="w-5 h-5" />}
            {loading ? "SCANNING GRID..." : "DEPLOY SCOUT"}
          </Button>
        </Card>

        <div className="lg:col-span-2 space-y-8">
           <AnimatePresence mode="wait">
              {results ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                   <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                         <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Extracted Leads</h3>
                      </div>
                      <Badge variant="outline" className="border-blue-500/20 text-blue-400 font-black text-[9px]">{results.matches.length} ASSETS FOUND</Badge>
                   </div>

                   <div className="grid md:grid-cols-1 gap-6">
                      {results.matches.map((match: any, idx: number) => (
                        <motion.div 
                          key={match.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Card className="glass border-white/5 p-8 group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <Target className="w-32 h-32 text-white" />
                             </div>
                             
                             <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                                <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-white text-2xl italic group-hover:border-blue-500/50 transition-colors shadow-2xl">
                                   {match.name.split(' ').map((n: any) => n[0]).join('')}
                                </div>
                                
                                <div className="flex-1 space-y-4">
                                   <div className="flex items-center justify-between">
                                      <div>
                                         <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">{match.name}</h4>
                                         <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">{match.currentRole}</p>
                                      </div>
                                      <div className="text-right">
                                         <div className="text-2xl font-black text-white italic">{match.matchScore}%</div>
                                         <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">MATCH QUALITY</div>
                                      </div>
                                   </div>

                                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-slate-400 leading-relaxed font-medium">
                                      <span className="text-blue-500 font-black uppercase tracking-widest mr-2">EXTRACTION REASON:</span>
                                      "{match.extractionReason}"
                                   </div>

                                   <div className="flex flex-wrap gap-2">
                                      {match.skills.map((skill: string) => (
                                        <Badge key={skill} variant="outline" className="bg-blue-600/5 text-blue-400 border-blue-600/20 px-3 py-1 text-[8px] font-black uppercase">
                                           {skill}
                                        </Badge>
                                      ))}
                                   </div>

                                   <div className="flex gap-4 pt-2">
                                      <Button className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest gap-2 rounded-xl border border-white/5">
                                         <ShieldCheck className="w-4 h-4 text-green-500" />
                                         SECURE ASSET
                                      </Button>
                                      <Button 
                                        onClick={() => handleExtract(match)}
                                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest gap-2 rounded-xl shadow-xl shadow-blue-500/20"
                                      >
                                         <UserCheck className="w-4 h-4" />
                                         EXTRACT NOW
                                      </Button>
                                   </div>
                                </div>
                             </div>
                          </Card>
                        </motion.div>
                      ))}
                   </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01] p-12 text-center">
                  <Terminal className="w-12 h-12 text-slate-800 mb-4" />
                  <h3 className="text-white font-bold italic uppercase tracking-tighter">Satellite Uplink Ready</h3>
                  <p className="text-slate-600 text-[11px] mt-2 max-w-[300px] font-medium leading-relaxed uppercase">
                    Describe your dream asset to begin the global talent extraction sequence.
                  </p>
                </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
