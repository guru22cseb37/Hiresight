"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCode2, Layout, Eye, Sparkles, Download, 
  Copy, RefreshCw, AlertCircle, CheckCircle2,
  Trash2, ChevronLeft, ChevronRight, Wand2, Target, Loader2
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
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleGenerate = async () => {
    toast.loading("AI is crafting your LaTeX source...");
    try {
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

  const handleOptimize = async () => {
    setIsOptimizing(true);
    toast.loading("AI is optimizing and expanding your resume...");
    try {
      const response = await fetch("/api/resume/optimize", {
        method: "POST",
        body: JSON.stringify({
          latex: latexSource,
          customInstruction: "Expand all bullet points using STAR method. Ensure it fills exactly one full page. Add structured project breakdowns (Frontend, Backend, AI/LLM, API)."
        })
      });
      const data = await response.json();
      if (data.optimizedLatex) {
        setLatexSource(data.optimizedLatex);
        compileLatex(data.optimizedLatex);
        toast.success("Resume optimized and expanded!");
      }
    } catch (error) {
      toast.error("Optimization failed.");
    } finally {
      setIsOptimizing(false);
      toast.dismiss();
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
            <h1 className="text-2xl font-bold text-white italic tracking-tighter">LaTeX Resume Architect</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">Premium Typesetting & Content Expansion</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="glass border-white/10 gap-2 h-11" onClick={handleGenerate}>
            <Sparkles className="w-4 h-4 text-violet-400" />
            AI Draft
          </Button>
          <Button 
            variant="outline" 
            className="glass border-blue-500/20 text-blue-400 gap-2 h-11" 
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            <Wand2 className={`w-4 h-4 ${isOptimizing ? "animate-spin" : ""}`} />
            AI Optimize & Expand
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 gap-2 h-11 shadow-lg shadow-blue-500/20" onClick={() => compileLatex(latexSource)}>
            <RefreshCw className={`w-4 h-4 ${isCompiling ? "animate-spin" : ""}`} />
            Recompile PDF
          </Button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Panel 1: Templates (2 cols) */}
        <Card className="lg:col-span-2 glass border-white/5 p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center justify-between px-2 mb-2">
             <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Templates</h3>
             <Layout className="w-3 h-3 text-slate-600" />
          </div>
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
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Source Code Editor</span>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => {
                navigator.clipboard.writeText(latexSource);
                toast.success("Source copied!");
              }}><Copy className="w-3 h-3" /></Button>
              <Button size="icon" variant="ghost" className="h-6 w-6"><Download className="w-3 h-3" /></Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-slate-950/50">
            <CodeMirror
              value={latexSource}
              height="100%"
              theme={vscodeDark}
              extensions={[StreamLanguage.define(stex)]}
              onChange={(value) => setLatexSource(value)}
              className="text-sm font-mono"
            />
          </div>
          <div className="p-3 bg-white/[0.02] border-t border-white/5">
             <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">
               Pro Tip: Use 'AI Optimize' to automatically expand project bullets to fill the page.
             </p>
          </div>
        </Card>

        {/* Panel 3: Preview/Check (5 cols) */}
        <Card className="lg:col-span-5 glass border-white/5 flex flex-col overflow-hidden">
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <div className="p-1 border-b border-white/5 bg-white/[0.02]">
              <TabsList className="bg-transparent border-none flex w-full">
                <TabsTrigger value="preview" className="flex-1 rounded-lg data-[state=active]:bg-white/5 text-[10px] uppercase font-black tracking-widest">Live Preview</TabsTrigger>
                <TabsTrigger value="ats" className="flex-1 rounded-lg data-[state=active]:bg-white/5 text-[10px] uppercase font-black tracking-widest">ATS Audit</TabsTrigger>
                <TabsTrigger value="integrity" className="flex-1 rounded-lg data-[state=active]:bg-white/5 text-[10px] uppercase font-black tracking-widest">Integrity</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 p-0 overflow-hidden">
              <TabsContent value="preview" className="h-full m-0 p-0 relative">
                {isCompiling && (
                  <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter italic">Rendering High-Fidelity PDF...</p>
                  </div>
                )}
                {pdfUrl ? (
                  <iframe src={pdfUrl} className="w-full h-full border-none bg-white" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-slate-900/50">
                    <Eye className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-xs uppercase font-black tracking-widest">Compile to see PDF preview</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="ats" className="p-6 space-y-6 overflow-y-auto">
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Target className="w-16 h-16 text-blue-500" />
                  </div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">ATS Compatibility Score</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-black text-blue-400 italic">98%</div>
                    <p className="text-xs text-slate-400 font-medium">This LaTeX source is optimized for Taleo, Workday, and Greenhouse.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <AtsWarning icon={CheckCircle2} color="text-green-500" title="Structured Project Layer" desc="Detected FRONTEND/BACKEND/AI subsections for max keyword density." />
                  <AtsWarning icon={CheckCircle2} color="text-green-500" title="Text Layer Present" desc="PDF contains a searchable text layer." />
                  <AtsWarning icon={AlertCircle} color="text-amber-500" title="Vertical Saturation" desc="The resume fills 95% of the page. Recommended for senior roles." />
                </div>
              </TabsContent>
              <TabsContent value="integrity" className="p-6">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Sparkles className="w-12 h-12 text-violet-500 mb-4 animate-pulse" />
                  <h4 className="text-white font-bold mb-2 uppercase tracking-tighter">Private Integrity Scan</h4>
                  <p className="text-sm text-slate-400 mb-6 max-w-xs font-medium">Scan for timeline gaps and credential inconsistencies before you apply.</p>
                  <Button className="bg-violet-600 hover:bg-violet-500 shadow-xl shadow-violet-500/20 font-bold uppercase text-[10px] tracking-widest h-12 px-8">
                    Run AI Verification
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
          ? "bg-blue-600/10 border border-blue-500/40 shadow-lg shadow-blue-500/5" 
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      <div className="aspect-[3/4] rounded-lg bg-slate-900 border border-white/5 mb-2 overflow-hidden relative group-hover:border-blue-500/50">
         <div className="absolute inset-x-2 top-2 h-0.5 bg-white/10 rounded" />
         <div className="absolute inset-x-2 top-4 h-0.5 bg-white/10 rounded" />
         <div className="absolute inset-x-2 top-6 h-0.5 bg-white/10 rounded" />
         <div className="absolute right-2 top-2 w-3 h-3 rounded bg-blue-500/20" />
      </div>
      <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">{name}</h4>
      <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{desc}</p>
    </button>
  );
}

function AtsWarning({ icon: Icon, color, title, desc }: any) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-colors">
      <Icon className={`w-4 h-4 ${color} shrink-0`} />
      <div>
        <h5 className="text-[10px] font-black text-white uppercase tracking-widest">{title}</h5>
        <p className="text-[10px] text-slate-500 mt-0.5 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const TEMPLATES = [
  { name: "Modern Elite", desc: "Jake's style single-column, max saturation." },
  { name: "Executive Suite", desc: "Premium serif typography for senior roles." },
  { name: "Tech Architect", desc: "Detailed technical breakdown layout." },
  { name: "Minimalist", desc: "Maximum whitespace, highly readable." },
  { name: "Academic CV", desc: "Detailed CV format for research/PhD." },
  { name: "Compact Pro", desc: "Dense layout for 1-page saturation." },
];

const DEFAULT_LATEX = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape John Doe} \\\\ \\vspace{1pt}
    \\small 123-456-7890 $|$ \\href{mailto:x@x.com}{\\underline{john@example.com}} $|$ 
    \\href{https://linkedin.com/in/x}{\\underline{linkedin.com/in/johndoe}} $|$
    \\href{https://github.com/x}{\\underline{github.com/johndoe}}
\\end{center}


%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {State University}{San Francisco, CA}
      {Bachelor of Science in Computer Science}{Aug. 2018 -- May 2022}
  \\resumeSubHeadingListEnd


%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {TechCorp Solutions}{Jan. 2022 -- Present}
      {Senior Full Stack Engineer}{San Francisco, CA}
      \\resumeItemListStart
        \\resumeItem{Architected a scalable microservices infrastructure using Next.js and Go, improving system uptime by 99.9\\% and reducing latency by 40\\% across all global endpoints.}
        \\resumeItem{Led the integration of AI-driven talent matching engines using Gemini Pro, resulting in a 300\\% increase in recruiter efficiency and higher quality candidate placements.}
        \\resumeItem{Optimized database queries and implemented advanced caching strategies with Redis, slashing page load times from 2.5s to 400ms for a user base of 50k+ daily actives.}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd


%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{HireSight AI-Native Platform} $|$ \\emph{React, TypeScript, Groq, Supabase}}{Jan. 2023 -- Present}
          \\resumeItemListStart
            \\resumeItem{\\textbf{Frontend Tools:} Developed a high-performance recruiter HUD using Framer Motion and TailwindCSS, achieving a 98\\% Lighthouse performance score.}
            \\resumeItem{\\textbf{Backend Tools:} Engineered a robust real-time data pipeline with Supabase and Edge Functions, handling 5k+ concurrent WebSocket connections.}
            \\resumeItem{\\textbf{AI/LLM Integration:} Implemented a multi-model fallback network (GPT-4, Llama 3, Gemini) to ensure 100\\% availability for AI market intelligence reports.}
            \\resumeItem{\\textbf{API Infrastructure:} Designed and documented secure RESTful APIs using Next.js Route Handlers, processing over 1M+ candidate scans monthly.}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd


%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: Java, Python, C/C++, SQL (Postgres), JavaScript, TypeScript, HTML/CSS} \\\\
     \\textbf{Frameworks}{: React, Next.js, Node.js, Flask, JUnit, Docker, Kubernetes} \\\\
     \\textbf{Tools}{: Git, Docker, Google Cloud Platform, VS Code, PyCharm, IntelliJ} \\\\
     \\textbf{Libraries}{: pandas, NumPy, Matplotlib, Framer Motion, TailwindCSS}
    }}
 \\end{itemize}


%-------------------------------------------
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

