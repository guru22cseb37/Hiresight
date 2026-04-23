"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, BookOpen, CheckCircle2, Circle, 
  ArrowRight, ExternalLink, Zap, Sparkles,
  Trophy, GraduationCap, PlayCircle, FileText,
  Loader2, Target, Plus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RoadmapsPage() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    role: "Senior AI Engineer",
    company: "Anthropic",
    currentSkills: "React, TypeScript, basic Python"
  });

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRoadmap(data);
      setShowForm(false);
      toast.success("Tactical Roadmap Generated!");
    } catch (err: any) {
      toast.error("Failed to generate roadmap: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showForm && !roadmap) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl space-y-10"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              INITIALIZE <span className="text-blue-500">MISSION.</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Define your target destination. Our AI will architect a hyper-fast tactical bridge between your current DNA and your dream role.
            </p>
          </div>

          <Card className="glass border-white/5 p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Role</Label>
                <Input 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  placeholder="e.g. Staff Engineer"
                  className="glass border-white/10 text-white font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Company</Label>
                <Input 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="e.g. Tesla"
                  className="glass border-white/10 text-white font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Primary Skills</Label>
              <textarea
                value={formData.currentSkills}
                onChange={(e) => setFormData({...formData, currentSkills: e.target.value})}
                placeholder="List your core tech stack..."
                className="w-full h-24 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-all resize-none"
              />
            </div>
            <Button 
              onClick={generateRoadmap}
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white gap-3 text-lg font-black italic shadow-xl shadow-blue-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {loading ? "ARCHITECTING..." : "GENERATE MISSION"}
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* HERO SECTION */}
      <div className="relative p-10 md:p-16 rounded-[40px] bg-slate-950 border border-white/5 overflow-hidden group">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
         <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">AI Generated Path</span>
                  </div>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> New Mission
                  </button>
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                  MISSION: <span className="text-blue-500">{roadmap.company.toUpperCase()}</span>
               </h1>
               <p className="text-slate-400 text-lg font-medium max-w-xl">
                  Tactical roadmap for the <span className="text-white font-bold">{roadmap.role}</span> role.
               </p>
               <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=dev${i}`} alt="Dev" />
                        </div>
                     ))}
                  </div>
                  <span className="text-xs font-bold text-slate-500">Join 120+ others on this mission</span>
               </div>
            </div>

            <Card className="w-full md:w-80 glass border-white/10 p-8 flex flex-col items-center text-center gap-6">
               <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - roadmap.progress / 100)} className="text-blue-500" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-black text-white italic leading-none">{roadmap.progress}%</span>
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Ready</span>
                  </div>
               </div>
               <Button className="w-full bg-blue-600 hover:bg-blue-500 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                  Resume Mission
                  <ArrowRight className="w-4 h-4" />
               </Button>
            </Card>
         </div>
      </div>

      {/* ROADMAP STEPS */}
      <div className="max-w-4xl mx-auto space-y-8 relative px-4 md:px-0">
         <div className="absolute left-6 md:left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-blue-500/20 to-transparent -z-10" />

         {roadmap.steps.map((step: any, idx: number) => (
            <motion.div 
               key={idx}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
            >
               <Card className={`glass p-6 md:p-8 ml-12 relative group transition-all duration-500 ${
                  step.status === 'in-progress' ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5'
               }`}>
                  <div className={`absolute -left-[54px] top-8 w-11 h-11 rounded-xl border-4 border-slate-950 flex items-center justify-center z-10 transition-colors ${
                     step.status === 'completed' ? 'bg-green-500 text-white' : 
                     step.status === 'in-progress' ? 'bg-blue-600 text-white animate-pulse' : 
                     'bg-slate-800 text-slate-500'
                  }`}>
                     {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                  </div>

                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                     <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                           <h3 className={`text-xl font-black italic uppercase tracking-tight ${
                              step.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'
                           }`}>{step.title}</h3>
                           <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest">{step.duration}</Badge>
                        </div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">{step.description}</p>
                     </div>

                     <div className="flex flex-col gap-3 min-w-[200px]">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Curated DNA Resources</h4>
                        {step.resources.map((res: any, i: number) => (
                           <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group/res">
                              <div className="flex items-center gap-3">
                                 {res.type === 'Video' ? <PlayCircle className="w-4 h-4 text-red-400" /> : <FileText className="w-4 h-4 text-blue-400" />}
                                 <span className="text-[10px] font-bold text-slate-300 group-hover/res:text-white transition-colors">{res.title}</span>
                              </div>
                              <ExternalLink className="w-3 h-3 text-slate-600 group-hover/res:text-blue-400" />
                           </div>
                        ))}
                     </div>
                  </div>
               </Card>
            </motion.div>
         ))}
      </div>
    </div>
  );
}
