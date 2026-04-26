"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ShieldAlert, ShieldCheck, History, 
  HelpCircle, Globe, Cpu, AlertTriangle, 
  CheckCircle2, Loader2, SearchCode, Building2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProcessingStepper } from "@/components/ui/ProcessingStepper";
import { Sparkles } from "lucide-react";

export default function CompanyIntelligencePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/company/analyze", {
        method: "POST",
        body: JSON.stringify({ companyName: query })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze company");
      }
      
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze company. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-8 px-4">
      {/* Header & Search */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Company Intelligence Engine</span>
        </div>
        <h1 className="text-5xl font-black text-white italic tracking-tighter">TRUST BUT VERIFY.</h1>
        <p className="text-slate-400 max-w-xl mx-auto font-medium">
          Identify fake company scams, explore deep business history, and predict interview patterns before you apply.
        </p>
        
        <form onSubmit={analyzeCompany} className="max-w-2xl mx-auto relative group">
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter company name (e.g., 'Google', 'Unknown Startup')..."
            className="h-16 bg-slate-900 border-white/5 pl-14 pr-32 rounded-2xl text-lg font-bold italic transition-all focus:border-blue-500/50 shadow-2xl"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <Button 
            type="submit" 
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-6 bg-blue-600 hover:bg-blue-500 font-black italic rounded-xl"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "ANALYZE"}
          </Button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Trust Meter & Verdict */}
            <Card className={cn(
              "glass border-white/5 p-8 flex flex-col items-center text-center gap-6 overflow-hidden relative",
              result.isFake ? "border-red-500/20" : "border-green-500/20"
            )}>
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
              
              <div className="relative">
                 <div className={cn(
                   "w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-1000",
                   result.isFake ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]" : "border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                 )}>
                   <span className="text-4xl font-black text-white">{result.trustScore}%</span>
                 </div>
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-950 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Trust Score
                 </div>
              </div>

              <div>
                <h3 className={cn(
                  "text-2xl font-black italic uppercase mb-2",
                  result.isFake ? "text-red-500" : "text-green-500"
                )}>
                  {result.isFake ? "HIGH RISK DETECTED" : "VERIFIED LEGITIMATE"}
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  {result.verdict}
                </p>
              </div>

              {result.redFlags?.length > 0 && (
                <div className="w-full space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Risk Indicators</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.redFlags.map((flag: string) => (
                      <Badge key={flag} variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px] font-bold">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Deep History & Tech Stack */}
            <Card className="lg:col-span-2 glass border-white/5 p-8 space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xl font-bold text-white italic uppercase tracking-tighter">Deep History & Context</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">
                    {result.history}
                  </p>
               </div>

               <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-violet-500" />
                    <h3 className="text-xl font-bold text-white italic uppercase tracking-tighter">Known Technology Stack</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.techStack?.map((tech: string) => (
                      <Badge key={tech} className="bg-white/5 border-white/5 text-slate-300 font-bold px-3 py-1 text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
               </div>
            </Card>

            {/* Predicted Questions */}
            <Card className="lg:col-span-3 glass border-white/5 p-8 space-y-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <SearchCode className="w-48 h-48 text-white" />
              </div>
              
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-amber-500" />
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Predicted Interview Intel</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {result.predictedQuestions?.map((item: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group"
                  >
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Question {i+1}</div>
                    <p className="text-white font-bold leading-snug mb-3 group-hover:text-blue-400 transition-colors italic">"{item.q}"</p>
                    <div className="text-[10px] text-slate-500 font-medium">
                      <span className="text-amber-500/80 font-bold uppercase tracking-widest mr-1">Why:</span>
                      {item.reason}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ) : loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-10">
             <div className="relative">
                <div className="w-24 h-24 rounded-full border-b-2 border-blue-500 animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 animate-pulse" />
             </div>
             <ProcessingStepper isProcessing={loading} />
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-20">
             <Building2 className="w-20 h-20 mb-4" />
             <p className="text-sm font-bold uppercase tracking-[0.4em]">Ready for Verification</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
