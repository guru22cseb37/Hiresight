"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Upload, Code, CheckCircle2, 
  Sparkles, Copy, Download, Layout, 
  User, Briefcase, GraduationCap, Wrench,
  Loader2, ChevronRight, ChevronLeft, AlertCircle, AlertTriangle,
  Plus, Trash2, Eye, BrainCircuit,
  Image as ImageIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ResumeBuilderPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedLatex, setGeneratedLatex] = useState<string | null>(null);
  const [audit, setAudit] = useState<AuditReport | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    if (!generatedLatex || !audit) return;
    
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/resume/optimize", {
        method: "POST",
        body: JSON.stringify({ latex: generatedLatex, audit })
      });
      
      const data = await res.json();
      if (data.optimizedLatex) {
        setGeneratedLatex(data.optimizedLatex);
        toast.success("AI Fixes Applied Successfully!");
        
        // Re-audit the new version to show improvement
        toast.info("Re-auditing optimized resume...");
        const auditRes = await fetch("/api/resume/builder", {
          method: "POST",
          body: JSON.stringify({
            userData: { ...formData, summary: data.optimizedLatex }, // Pass raw latex for context
            jobDesc: formData.jobDesc,
            isReaudit: true // Flag to skip latex generation if needed
          })
        });
        const auditData = await auditRes.json();
        setAudit(auditData.audit);
      }
    } catch (err) {
      toast.error("Optimization failed. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
    experience: [{ title: "", company: "", period: "", description: "" }],
    projects: [{ title: "", tech: "", description: "" }],
    education: [{ school: "", degree: "", year: "" }],
    skills: "",
    jobDesc: "",
    template: "Maverick"
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
        toast.success("Reference image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const generateResume = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resume/builder", {
        method: "POST",
        body: JSON.stringify({
          userData: formData,
          referenceImage,
          jobDesc: formData.jobDesc
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedLatex(data.latex);
      setAudit(data.audit);
      setStep(4);
      toast.success("Elite LaTeX Resume Architected!");
    } catch (err) {
      toast.error("Generation failed. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLatex) {
      navigator.clipboard.writeText(generatedLatex);
      toast.success("LaTeX code copied to clipboard!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">LaTeX Resume Architect</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Build elite, ATS-optimized professional documents.</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={cn(
              "h-1.5 w-8 rounded-full transition-all",
              step >= s ? "bg-blue-600" : "bg-white/5"
            )} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="glass border-white/5 p-8 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white italic uppercase tracking-tighter">Style Reference</h3>
                  <p className="text-xs text-slate-500 font-medium">Upload a reference resume (Image/PDF) to mimic its layout.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <label className="relative h-48 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group overflow-hidden">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    {referenceImage ? (
                      <img src={referenceImage} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-slate-600 group-hover:text-blue-500 transition-colors" />
                    )}
                    <div className="relative z-10 text-center px-6">
                      <p className="text-sm font-bold text-white uppercase tracking-widest">{referenceImage ? "Neural Mirror Active" : "Neural Template Clone"}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1">Upload any resume image to clone its layout.</p>
                    </div>
                  </label>

                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Architectural Template</h4>
                     <div className="grid grid-cols-3 gap-2">
                        {['Maverick', 'Executive', 'Engineer'].map(t => (
                          <button 
                            key={t}
                            onClick={() => setFormData({...formData, template: t})}
                            className={cn(
                              "py-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all",
                              formData.template === t ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                     </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                     <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Job Intelligence</h4>
                        <Badge variant="outline" className="text-[8px] border-blue-500/20 text-blue-500 animate-pulse">ATS REVERSE ENGINEERING</Badge>
                     </div>
                     <Textarea 
                       placeholder="Paste the Job Description here. Our AI will reverse-engineer the ATS filters and inject relevant keywords into your LaTeX code..."
                       className="min-h-[200px] bg-slate-950/50 border-white/5 text-xs font-medium leading-relaxed"
                       value={formData.jobDesc}
                       onChange={(e) => setFormData({...formData, jobDesc: e.target.value})}
                     />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} className="h-14 px-8 bg-blue-600 hover:bg-blue-500 font-black italic rounded-2xl gap-2">
                  NEXT: PERSONAL INFO <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="glass border-white/5 p-8 space-y-8">
               <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white italic uppercase tracking-tighter">Personal Details</h3>
                  <p className="text-xs text-slate-500 font-medium">Basic information for your resume header.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormInput label="Full Name" value={formData.fullName} onChange={(v: string) => setFormData({...formData, fullName: v})} />
                 <FormInput label="Email Address" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
                 <FormInput label="Phone Number" value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} />
                 <FormInput label="Location" value={formData.location} onChange={(v: string) => setFormData({...formData, location: v})} />
                 <FormInput label="Website / Portfolio" value={formData.website} onChange={(v: string) => setFormData({...formData, website: v})} />
                 <div className="md:col-span-2">
                    <FormInput label="Professional Summary" value={formData.summary} onChange={(v: string) => setFormData({...formData, summary: v})} isTextArea />
                 </div>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)} className="h-14 px-8 font-black italic rounded-2xl gap-2 text-slate-500">
                  <ChevronLeft className="w-4 h-4" /> BACK
                </Button>
                <Button onClick={() => setStep(3)} className="h-14 px-8 bg-blue-600 hover:bg-blue-500 font-black italic rounded-2xl gap-2">
                  NEXT: EXPERIENCE <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
           <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="glass border-white/5 p-8 space-y-8">
               <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white italic uppercase tracking-tighter">Career & Projects</h3>
                  <p className="text-xs text-slate-500 font-medium">Showcase your professional experience and technical work.</p>
                </div>
              </div>

              <div className="space-y-10">
                  {/* Experience */}
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Experience Block</h4>
                       <Badge variant="outline" className="text-[8px] border-white/10 text-slate-500">ATS PRIMARY</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormInput label="Job Title" value={formData.experience[0].title} onChange={(v: string) => {
                         const n = [...formData.experience]; n[0].title = v; setFormData({...formData, experience: n});
                       }} />
                       <FormInput label="Company" value={formData.experience[0].company} onChange={(v: string) => {
                         const n = [...formData.experience]; n[0].company = v; setFormData({...formData, experience: n});
                       }} />
                    </div>
                    <FormInput label="Impact & Achievements (Use Metrics)" isTextArea value={formData.experience[0].description} onChange={(v: string) => {
                         const n = [...formData.experience]; n[0].description = v; setFormData({...formData, experience: n});
                       }} />
                  </div>

                  {/* Projects */}
                  <div className="p-6 rounded-3xl bg-violet-500/[0.03] border border-violet-500/10 space-y-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest">Technical Project</h4>
                       <Badge variant="outline" className="text-[8px] border-violet-500/20 text-violet-500">ENGINEERING PRIDE</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormInput label="Project Title" value={formData.projects[0].title} onChange={(v: string) => {
                         const n = [...formData.projects]; n[0].title = v; setFormData({...formData, projects: n});
                       }} />
                       <FormInput label="Tech Stack (e.g. Next.js, Rust)" value={formData.projects[0].tech} onChange={(v: string) => {
                         const n = [...formData.projects]; n[0].tech = v; setFormData({...formData, projects: n});
                       }} />
                    </div>
                    <FormInput label="Key Contributions & Architecture" isTextArea value={formData.projects[0].description} onChange={(v: string) => {
                         const n = [...formData.projects]; n[0].description = v; setFormData({...formData, projects: n});
                       }} />
                  </div>

                  <FormInput label="Strategic Core Skills (Comma separated)" value={formData.skills} onChange={(v: string) => setFormData({...formData, skills: v})} isTextArea />
              </div>

              <div className="flex justify-between items-center mt-10">
                <Button variant="ghost" onClick={() => setStep(2)} className="h-14 px-8 font-black italic rounded-2xl gap-2 text-slate-500">
                  <ChevronLeft className="w-4 h-4" /> BACK
                </Button>
                <div className="flex flex-col items-end gap-2">
                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest italic animate-pulse">
                      <BrainCircuit className="w-3 h-3" /> NEURAL SCAN IN PROGRESS...
                    </motion.div>
                  )}
                  <Button 
                    onClick={generateResume} 
                    disabled={loading} 
                    className={cn(
                      "h-16 px-12 bg-blue-600 hover:bg-blue-500 font-black italic rounded-2xl gap-3 shadow-2xl transition-all",
                      loading ? "shadow-blue-500/10 scale-95" : "shadow-blue-500/20 hover:scale-105"
                    )}
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-6 h-6 text-white" /> ARCHITECT ELITE RESUME</>}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 4 && generatedLatex && (
           <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <Card className="lg:col-span-2 glass border-white/5 flex flex-col h-[700px] overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">LaTeX Source Output</span>
                     </div>
                     <Button size="sm" variant="outline" className="glass border-white/10 h-8 gap-2 text-[10px] font-bold" onClick={copyToClipboard}>
                        <Copy className="w-3.5 h-3.5" /> COPY CODE
                     </Button>
                  </div>
                  <div className="flex-1 p-6 bg-slate-950/80 overflow-y-auto font-mono text-[11px] leading-relaxed text-blue-400">
                     <pre className="whitespace-pre-wrap">{generatedLatex}</pre>
                  </div>
               </Card>

               <div className="space-y-6">
                  <Card className="glass border-white/5 p-6 space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">ATS Audit Report</h4>
                          <button 
                            onClick={handleOptimize}
                            disabled={isOptimizing}
                            className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-all disabled:opacity-50"
                          >
                            {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            {isOptimizing ? "Fixing..." : "Auto-Optimize (AI Fix)"}
                          </button>
                        </div>
                        <span className={cn(
                          "text-2xl font-black italic",
                          (audit?.score || 0) > 80 ? "text-green-500" : "text-amber-500"
                        )}>{audit?.score}%</span>
                     </div>
                     
                     <div className="space-y-4">
                        <AuditSection label="Missing Keywords" items={audit?.missingKeywords || []} type="error" />
                        <AuditSection label="Formatting Issues" items={audit?.formattingIssues || []} type="warning" />
                        <AuditSection label="Improvement Tips" items={audit?.improvements || []} type="info" />
                     </div>

                     <Button className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest gap-2">
                        <Download className="w-4 h-4" /> Download .tex file
                     </Button>
                  </Card>

                  <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20">
                     <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Architect's Tip</h4>
                     </div>
                     <p className="text-[11px] text-slate-400 leading-relaxed italic">
                        "Your resume is now optimized for modern ATS systems. Copy this code into **Overleaf** to generate your high-definition PDF."
                     </p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FormInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  isTextArea?: boolean;
}

function FormInput({ label, value, onChange, isTextArea }: FormInputProps) {
  const [isPolishing, setIsPolishing] = useState(false);

  const handlePolish = async () => {
    if (!value.trim()) return;
    setIsPolishing(true);
    try {
      const res = await fetch("/api/resume/polish", {
        method: "POST",
        body: JSON.stringify({ text: value, field: label })
      });
      const data = await res.json();
      if (data.polished) {
        onChange(data.polished);
        toast.success("AI Polished your text!");
      }
    } catch (err) {
      toast.error("Failed to polish text.");
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</label>
        {isTextArea && value.length > 5 && (
          <button 
            onClick={handlePolish}
            disabled={isPolishing}
            className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
          >
            {isPolishing ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
            AI Polish
          </button>
        )}
      </div>
      {isTextArea ? (
        <Textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] bg-slate-950/50 border-white/5 text-sm leading-relaxed"
        />
      ) : (
        <Input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 bg-slate-950/50 border-white/5 text-sm"
        />
      )}
    </div>
  );
}

interface AuditSectionProps {
  label: string;
  items: string[];
  type: 'error' | 'warning' | 'info';
}

function AuditSection({ label, items, type }: AuditSectionProps) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
         {type === 'error' && <AlertCircle className="w-3 h-3 text-red-500" />}
         {type === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
         {type === 'info' && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
         {items.map((it: string) => (
           <Badge key={it} variant="ghost" className="bg-white/5 border-white/5 text-[9px] font-medium text-slate-300">
             {it}
           </Badge>
         ))}
      </div>
    </div>
  );
}

interface AuditReport {
  score: number;
  alignment: string;
  missingKeywords: string[];
  formattingIssues: string[];
  improvements: string[];
}
