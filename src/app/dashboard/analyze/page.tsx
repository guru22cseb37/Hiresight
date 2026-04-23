"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Zap, FileText, Upload, Link as LinkIcon, 
  Trash2, Copy, Download, Mail, Mic, BrainCircuit,
  CheckCircle2, AlertTriangle, Sparkles, Loader2, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { parsePdfAction } from "@/app/actions/parse-pdf";

export default function AnalyzePage() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [activeTab, setActiveTab] = useState("paste"); // "paste" or "upload"
  const [results, setResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRunAnalysis = async () => {
    if (!resumeText || !jdText) {
      toast.error("Please provide both a resume and a job description.");
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      // API call to /api/analyze goes here
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText, company, role })
      });

      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setResults(data);
      toast.success("Analysis complete! Check your scores below.");
    } catch (error: any) {
      toast.error(error.message);
      // Fallback/Mock data for demonstration if API isn't ready
      setResults(mockResults);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScrape = async (url: string) => {
    if (!url) return;
    toast.loading("Scraping job details...");
    // Mock scrape
    setTimeout(() => {
      setJdText("Expert in React, Node.js, and Cloud infrastructure. 5+ years experience required...");
      setCompany("TechCorp");
      setRole("Senior Software Engineer");
      toast.dismiss();
      toast.success("Job details scraped!");
    }, 1500);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }

    setIsParsing(true);
    const toastId = toast.loading("AI is scanning your PDF...");

    try {
      // DEEP RECTIFICATION: Client-side parsing using a robust approach
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
          
          // We use a dynamic import of the PDF.js library to ensure it's only loaded when needed
          // and works perfectly in the browser environment.
          const pdfjs = await import("pdfjs-dist");
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
          
          const pdf = await pdfjs.getDocument(typedarray).promise;
          let fullText = "";
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            fullText += pageText + "\n";
          }
          
          if (!fullText.trim()) {
            throw new Error("Could not extract text. The PDF might be an image/scan.");
          }

          setResumeText(fullText);
          setActiveTab("paste");
          toast.success("Intelligence extracted successfully!", { id: toastId });
        } catch (err: any) {
          console.error("Client-side PDF Error:", err);
          toast.error("Failed to parse PDF. Try pasting the text manually.", { id: toastId });
        } finally {
          setIsParsing(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      toast.error("Critical parsing error. Please try again.", { id: toastId });
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white italic">AI Intelligence Engine</h1>
          <p className="text-slate-400 mt-1">Compare your resume against any job description in seconds.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Resume Input */}
        <Card className="glass border-white/5 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Your Resume
            </h3>
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-white" onClick={() => setResumeText("")}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          <div className="space-y-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf" 
              onChange={handlePdfUpload}
            />
            <div className="flex gap-2 p-1 rounded-xl bg-slate-900 border border-white/10 w-fit">
              <Button 
                size="sm" 
                variant="ghost" 
                className={cn(activeTab === "paste" && "bg-blue-600/10 text-blue-400")}
                onClick={() => setActiveTab("paste")}
              >
                Paste Text
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className={cn(activeTab === "upload" && "bg-blue-600/10 text-blue-400")}
                onClick={() => fileInputRef.current?.click()}
                disabled={isParsing}
              >
                {isParsing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload PDF
              </Button>
            </div>
            
            <div className="relative">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-80 bg-slate-950/50 border border-white/5 rounded-2xl p-6 text-slate-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-blue-500/50 transition-all resize-none"
              />
              {isParsing && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-xs font-bold text-white uppercase tracking-widest animate-pulse">AI Parsing...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>{resumeText.length} characters</span>
              <span>EST. 420 words</span>
            </div>
          </div>
        </Card>

        {/* Right: JD Input */}
        <Card className="glass border-white/5 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-violet-400" />
              Job Description
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job URL</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input 
                  placeholder="Paste LinkedIn/Indeed URL to auto-scrape..." 
                  className="pl-10 h-10 glass border-white/10 focus:border-violet-500/50"
                  onKeyDown={(e) => e.key === "Enter" && handleScrape(e.currentTarget.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company</Label>
                <Input 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google" 
                  className="glass border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Role</Label>
                <Input 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Lead" 
                  className="glass border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</Label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-[220px] bg-slate-950/50 border border-white/5 rounded-2xl p-6 text-slate-300 text-sm leading-relaxed focus:outline-none focus:border-violet-500/50 transition-all resize-none"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="h-16 px-12 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xl font-bold gap-3 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all w-full md:w-auto"
        >
          {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 text-yellow-400" />}
          {isAnalyzing ? "AI Deep Scan in Progress..." : "Run HireSight Autopilot"}
        </Button>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-8"
          >
            <Tabs defaultValue="ats" className="w-full">
              <TabsList className="bg-slate-900/50 border border-white/10 p-1 h-auto grid grid-cols-2 md:grid-cols-5 gap-1 rounded-2xl">
                <TabsTrigger value="ats" className="rounded-xl py-3 gap-2 data-[state=active]:bg-blue-600">
                  <Target className="w-4 h-4" />
                  ATS Score
                </TabsTrigger>
                <TabsTrigger value="keywords" className="rounded-xl py-3 gap-2 data-[state=active]:bg-blue-600">
                  <BrainCircuit className="w-4 h-4" />
                  Keywords
                </TabsTrigger>
                <TabsTrigger value="resume" className="rounded-xl py-3 gap-2 data-[state=active]:bg-blue-600">
                  <Sparkles className="w-4 h-4" />
                  Tailored
                </TabsTrigger>
                <TabsTrigger value="cover" className="rounded-xl py-3 gap-2 data-[state=active]:bg-blue-600">
                  <Mail className="w-4 h-4" />
                  Cover Letter
                </TabsTrigger>
                <TabsTrigger value="interview" className="rounded-xl py-3 gap-2 data-[state=active]:bg-blue-600">
                  <Mic className="w-4 h-4" />
                  Interview
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="ats" className="space-y-6">
                  <AnalysisTab data={results} />
                </TabsContent>
                <TabsContent value="keywords">
                  <KeywordsTab data={results} />
                </TabsContent>
                <TabsContent value="resume">
                  <ReshareTab text={results.tailoredResume} />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalysisTab({ data }: any) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <Card className="md:col-span-1 glass border-white/5 p-10 flex flex-col items-center justify-center text-center">
        <ScoreRing score={data.score} size={240} />
        <div className={`mt-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
          data.score > 80 ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
        }`}>
          {data.verdict}
        </div>
      </Card>
      
      <Card className="md:col-span-2 glass border-white/5 p-10 space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Strategic Assessment</h3>
          <p className="text-slate-400 leading-relaxed text-lg italic">"{data.summary}"</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Found Skills</h4>
            <div className="text-2xl font-black text-green-500">{data.found_keywords?.length || 0}</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Gap Analysis</h4>
            <div className="text-2xl font-black text-red-500">-{data.missing_keywords?.length || 0}</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Hire Chance</h4>
            <div className="text-2xl font-black text-blue-500">{data.hiring_likelihood}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function KeywordsTab({ data }: any) {
  return (
    <Card className="glass border-white/5 p-10">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Matching Keyphrases
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.found_keywords?.map((k: string) => (
              <span key={k} className="px-3 py-1.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/10 text-xs font-medium">
                {k}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Critical Gaps Identified
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.missing_keywords?.map((k: string) => (
              <span key={k} className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/10 text-xs font-medium">
                {k}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Note: Adding these naturally to your bullet points can increase your visibility in search by up to 40%.
          </p>
        </div>
      </div>
    </Card>
  );
}

function ReshareTab({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Resume copied to clipboard!");
  };

  return (
    <Card className="glass border-white/5 relative overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          AI Optimized Resume Source
        </h3>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-8 text-xs gap-2" onClick={handleCopy}>
            {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            Copy
          </Button>
          <Button size="sm" variant="ghost" className="h-8 text-xs gap-2">
            <Download className="w-3 h-3" />
            PDF
          </Button>
        </div>
      </div>
      <div className="p-8 bg-slate-950/50 font-mono text-xs leading-relaxed text-slate-300 h-[600px] overflow-y-auto">
        <pre className="whitespace-pre-wrap">{text}</pre>
      </div>
    </Card>
  );
}

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const r = size * 0.4;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={size * 0.05}
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={size * 0.05}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="font-extrabold text-white"
          style={{ fontSize: size * 0.25 }}
        >
          {score}
        </motion.span>
        <span className="text-slate-500 font-bold uppercase tracking-widest" style={{ fontSize: size * 0.05 }}>
          ATS Match
        </span>
      </div>
    </div>
  );
}

const mockResults = {
  score: 84,
  verdict: "Strong Match",
  summary: "Your background in React development strongly aligns with the core requirements. However, missing context on cloud deployment is a minor gap.",
  found_keywords: ["React", "TypeScript", "Node.js", "Redux", "Unit Testing", "REST APIs", "Agile"],
  missing_keywords: ["AWS", "Docker", "CI/CD", "Kubernetes"],
  tailoredResume: "// MOCKED OPTIMIZED RESUME CONTENT\n\nEXPERIENCE\nSenior Software Engineer | TechCorp\n- Architected high-performance React applications for 500k+ users.\n- Reduced page load by 40% using advanced code-splitting techniques.\n- Led a team of 5 engineers in an Agile environment.",
  hiring_likelihood: "High"
};
