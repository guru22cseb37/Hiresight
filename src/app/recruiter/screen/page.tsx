"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, Search, Loader2, CheckCircle2, 
  XCircle, AlertCircle, Sparkles, Filter, ListFilter,
  Download, UserPlus, FileSearch, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ScreeningPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [candidates, setCandidates] = useState<any[]>([]);

  const handleUpload = () => {
    setIsUploading(true);
    setProgress(0);
    
    // Simulate bulk scan
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCandidates(MOCK_SCREENED_CANDIDATES);
          setIsUploading(false);
          toast.success("52 resumes screened successfully!");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-400">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white italic">AI Candidate Screener</h1>
            <p className="text-slate-400 mt-1">Bulk upload resumes to find the best match for your open roles.</p>
          </div>
        </div>
      </div>

      {!candidates.length && !isUploading ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card 
            className="glass border-white/5 p-20 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/[0.02] transition-colors border-dashed border-2"
            onClick={handleUpload}
          >
            <div className="w-20 h-20 rounded-3xl bg-violet-600/10 flex items-center justify-center mb-6 group transition-transform hover:scale-110">
              <Upload className="w-10 h-10 text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 italic">Bulk Upload Resumes</h3>
            <p className="text-slate-500 max-w-sm mb-8">Click to browse or drag and drop up to 50 PDF resumes to screen them in parallel using HireSight AI.</p>
            <Button size="lg" className="h-14 px-10 bg-violet-600 hover:bg-violet-500 shadow-xl shadow-violet-500/20 text-lg">
              Select PDF Files
            </Button>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {isUploading && (
            <Card className="glass border-white/5 p-8 bg-violet-600/5 overflow-hidden relative">
               <motion.div 
                className="absolute top-0 left-0 h-1 bg-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
               />
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                   <span className="text-sm font-bold text-white uppercase tracking-widest">AI Deep Scanning {Math.round(progress/2)} Resumes...</span>
                 </div>
                 <span className="text-xs font-black text-violet-400">{progress}%</span>
               </div>
               <Progress value={progress} className="h-2 bg-white/5" />
            </Card>
          )}

          <AnimatePresence>
            {candidates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                   <div className="flex gap-2">
                     <Button size="sm" variant="ghost" className="glass border-white/5 gap-2 text-xs">
                       <ListFilter className="w-3 h-3" />
                       Filter by Score
                     </Button>
                     <Button size="sm" variant="ghost" className="glass border-white/5 gap-2 text-xs">
                       <Download className="w-3 h-3" />
                       Export Selected
                     </Button>
                   </div>
                   <div className="relative w-full md:w-64">
                     <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                     <Input placeholder="Search candidates..." className="pl-10 h-9 glass border-white/5" />
                   </div>
                </div>

                <Card className="glass border-white/5 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-white/[0.01]">
                        <th className="px-6 py-4">Rank</th>
                        <th className="px-6 py-4">Candidate</th>
                        <th className="px-6 py-4">AI Score</th>
                        <th className="px-6 py-4">Match Verdict</th>
                        <th className="px-6 py-4">Key Strengths</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {candidates.map((c, i) => (
                        <CandidateScreenRow key={c.id} candidate={c} rank={i + 1} />
                      ))}
                    </tbody>
                  </table>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function CandidateScreenRow({ candidate: c, rank }: any) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-violet-400 bg-violet-500/10 border-violet-500/20";
    if (score >= 80) return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  };

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
      <td className="px-6 py-4">
        <span className="text-xs font-black text-slate-700">#{rank.toString().padStart(2, '0')}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-white text-[10px]">
            {c.name.split(' ').map((n: any) => n[0]).join('')}
          </div>
          <div>
            <div className="font-bold text-slate-200 group-hover:text-violet-400 transition-colors">{c.name}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{c.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${getScoreColor(c.score)}`}>
            {c.score}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.verdict}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-1.5 overflow-hidden max-w-[200px]">
           {c.strengths.slice(0, 2).map((s: any) => (
             <Badge key={s} variant="outline" className="text-[8px] border-white/5 bg-white/[0.02] text-slate-500 whitespace-nowrap">
               {s}
             </Badge>
           ))}
           {c.strengths.length > 2 && <span className="text-[8px] text-slate-700">+{c.strengths.length - 2}</span>}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-600 hover:text-white">
            <UserPlus className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-600 hover:text-red-400">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

const MOCK_SCREENED_CANDIDATES = [
  { id: 1, name: "Sarah Chen", email: "sarah@design.io", score: 98, verdict: "Exceptional Match", strengths: ["Design Systems", "Prototyping", "Leadership"] },
  { id: 2, name: "Marcus Miller", email: "marcus.m@tech.com", score: 94, verdict: "Strong Match", strengths: ["React", "Performance", "Team Lead"] },
  { id: 3, name: "Alex Rivera", email: "arivera@dev.net", score: 89, verdict: "Highly Qualified", strengths: ["Fullstack", "API Design", "Architecture"] },
  { id: 4, name: "Priya Sharma", email: "priya.s@ux.com", score: 85, verdict: "Good Match", strengths: ["UX Research", "Figma", "User Testing"] },
  { id: 5, name: "David Kim", email: "d.kim@eng.org", score: 72, verdict: "Moderate Filter", strengths: ["Python", "Backend", "Scalability"] },
];
