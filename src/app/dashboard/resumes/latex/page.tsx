"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCode2, Layout, Eye, Sparkles, Download, 
  Copy, RefreshCw, AlertCircle, CheckCircle2,
  Trash2, ChevronLeft, ChevronRight, Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export default function LatexBuilderPage() {
  const [activeTab, setActiveTab] = useState("preview");
  const [latexSource, setLatexSource] = useState(DEFAULT_LATEX);
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("Modern Tech");

  const handleGenerate = async () => {
    toast.loading("AI is crafting your LaTeX source...");
    try {
      // Mock API call to /api/resume/latex
      const response = await fetch("/api/resume/latex", {
        method: "POST",
        body: JSON.stringify({
          templateName: selectedTemplate,
          resumeData: MOCK_RESUME_DATA,
          colorScheme: "Blue Professional"
        })
      });
      const data = await response.json();
      setLatexSource(data.latexSource);
      toast.dismiss();
      toast.success("LaTeX generated! Compiling PDF...");
      compileLatex(data.latexSource);
    } catch (error) {
      toast.dismiss();
      toast.error("Generation failed. Please try again.");
    }
  };

  const compileLatex = async (source: string) => {
    setIsCompiling(true);
    try {
      const response = await fetch("/api/resume/latex/compile", {
        method: "POST",
        body: JSON.stringify({ latexSource: source })
      });
      if (!response.ok) throw new Error("Compilation failed");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      toast.error("LaTeX compilation failed. Check your syntax.");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-400">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white italic">LaTeX Resume Builder</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Professional Typesetting Engine</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="glass border-white/10 gap-2" onClick={handleGenerate}>
            <Wand2 className="w-4 h-4 text-violet-400" />
            AI Generate
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 gap-2" onClick={() => compileLatex(latexSource)}>
            <RefreshCw className={`w-4 h-4 ${isCompiling ? "animate-spin" : ""}`} />
            Recompile
          </Button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Panel 1: Templates (2 cols) */}
        <Card className="lg:col-span-2 glass border-white/5 p-4 flex flex-col gap-4 overflow-y-auto">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 px-2">Templates</h3>
          {TEMPLATES.map((t) => (
            <TemplateCard 
              key={t.name}
              {...t}
              active={selectedTemplate === t.name}
              onClick={() => setSelectedTemplate(t.name)}
            />
          ))}
        </Card>

        {/* Panel 2: Editor (5 cols) */}
        <Card className="lg:col-span-5 glass border-white/5 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Source Code (main.tex)</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-6 w-6"><Copy className="w-3 h-3" /></Button>
              <Button size="icon" variant="ghost" className="h-6 w-6"><Download className="w-3 h-3" /></Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <CodeMirror
              value={latexSource}
              height="100%"
              theme={vscodeDark}
              extensions={[StreamLanguage.define(stex)]}
              onChange={(value) => setLatexSource(value)}
              className="text-sm"
            />
          </div>
        </Card>

        {/* Panel 3: Preview/Check (5 cols) */}
        <Card className="lg:col-span-5 glass border-white/5 flex flex-col overflow-hidden">
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <div className="p-1 border-b border-white/5 bg-white/[0.02]">
              <TabsList className="bg-transparent border-none flex w-full">
                <TabsTrigger value="preview" className="flex-1 rounded-lg data-[state=active]:bg-white/5">Preview</TabsTrigger>
                <TabsTrigger value="ats" className="flex-1 rounded-lg data-[state=active]:bg-white/5">ATS Check</TabsTrigger>
                <TabsTrigger value="integrity" className="flex-1 rounded-lg data-[state=active]:bg-white/5">Integrity</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 p-0 overflow-hidden">
              <TabsContent value="preview" className="h-full m-0 p-0 relative">
                {isCompiling && (
                  <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-sm text-slate-400">Compiling on Overleaf Engine...</p>
                  </div>
                )}
                {pdfUrl ? (
                  <iframe src={pdfUrl} className="w-full h-full border-none bg-white" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <Eye className="w-12 h-12 mb-4 opacity-20" />
                    <p>Compile to see PDF preview</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="ats" className="p-6 space-y-6">
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  <h4 className="text-sm font-bold text-white mb-4">ATS Compatibility Score</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black text-blue-400">92/100</div>
                    <p className="text-xs text-slate-400">This LaTeX source is highly compatible with modern parsers.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <AtsWarning icon={CheckCircle2} color="text-green-500" title="Text Layer Present" desc="PDF contains a searchable text layer." />
                  <AtsWarning icon={AlertCircle} color="text-amber-500" title="Tabular Detected" desc="Complex tables can sometimes confuse older ATS systems." />
                  <AtsWarning icon={CheckCircle2} color="text-green-500" title="Safe Fonts" desc="Standard Helvetica/Sans fonts used." />
                </div>
              </TabsContent>
              <TabsContent value="integrity" className="p-6">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Sparkles className="w-12 h-12 text-violet-500 mb-4 animate-pulse" />
                  <h4 className="text-white font-bold mb-2">Private Integrity Scan</h4>
                  <p className="text-sm text-slate-400 mb-6 max-w-xs">Scan for timeline gaps and credential inconsistencies before you apply.</p>
                  <Button className="bg-violet-600 hover:bg-violet-500 shadow-xl shadow-violet-500/20">
                    Run Integrity Audio
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

function TemplateCard({ name, desc, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-xl text-left transition-all ${
        active 
          ? "bg-blue-600/10 border border-blue-500/40" 
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      <div className="aspect-[3/4] rounded-lg bg-slate-900 border border-white/5 mb-2 overflow-hidden relative">
         <div className="absolute inset-x-2 top-2 h-1 bg-white/10 rounded" />
         <div className="absolute inset-x-2 top-4 h-1 bg-white/10 rounded" />
         <div className="absolute inset-x-2 top-6 h-1 bg-white/10 rounded" />
         <div className="absolute right-2 top-2 w-4 h-4 rounded bg-blue-500/20" />
      </div>
      <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">{name}</h4>
      <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{desc}</p>
    </button>
  );
}

function AtsWarning({ icon: Icon, color, title, desc }: any) {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
      <Icon className={`w-4 h-4 ${color} shrink-0`} />
      <div>
        <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">{title}</h5>
        <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

const TEMPLATES = [
  { name: "Modern Tech", desc: "Two-column, clean sans-serif layout." },
  { name: "Executive", desc: "Premium serif typography for senior roles." },
  { name: "Classic", desc: "Single column, ultra-conservative." },
  { name: "Minimalist", desc: "Maximum whitespace, highly readable." },
  { name: "Academic", desc: "Detailed CV format for research/PhD." },
  { name: "Compact", desc: "Dense layout for 1-page saturation." },
];

const DEFAULT_LATEX = `\\documentclass[10pt, a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=0.7in}

\\begin{document}
\\begin{center}
    {\\huge \\textbf{John Doe}} \\\\
    \\vspace{2pt}
    San Francisco, CA | (123) 456-7890 | john@example.com
\\end{center}

\\section*{Summary}
Expert software engineer with 5+ years experience in full-stack development.

\\section*{Experience}
\\textbf{TechCorp} | Senior Engineer \\hfill 2020 -- Present
\\begin{itemize}
    \\item Built AI-powered hiring platform using Next.js and Groq.
    \\item Optimized backend performance by 250\\%.
\\end{itemize}

\\end{document}
`;

const MOCK_RESUME_DATA = {
  name: "John Doe",
  email: "john@example.com",
  targetRole: "Senior React Developer",
  experience: [
    { company: "TechCorp", role: "Senior Engineer", dates: "2020-Present", bullets: ["Built platforms", "Optimized performance"] }
  ],
  skills: ["React", "TypeScript", "Node.js"]
};

function Loader2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
