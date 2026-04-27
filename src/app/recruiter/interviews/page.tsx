"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mic, BrainCircuit, Sparkles, 
  Loader2, ShieldCheck, Zap, 
  Target, AlertCircle, TrendingUp,
  FileText, ClipboardCheck, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function InterviewIntelligencePage() {
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("Voice Assistant Active: Start Speaking");
    };

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          setTranscript(prev => prev + (prev ? " " : "") + event.results[i][0].transcript);
        }
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleExtract = async () => {
    if (!transcript.trim()) {
      toast.error("Please provide interview notes or a transcript.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/recruiter/interviews/extract", {
        method: "POST",
        body: JSON.stringify({ transcript })
      });
      const data = await res.json();
      setResults(data);
      toast.success("Intelligence scorecard generated!");
    } catch (err) {
      toast.error("Extraction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-500">
          <BrainCircuit className="w-6 -6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white italic tracking-tighter uppercase">Interview Intelligence</h1>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Extract deep truth and technical depth from every conversation.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <Card className="glass border-white/5 p-8 space-y-8 h-fit">
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interview Transcript / Tactical Notes</Label>
                <Badge variant="outline" className="text-[8px] border-white/10 text-slate-500">AI-EXTRACTION READY</Badge>
             </div>
             <Textarea
                placeholder="Paste the transcript or your detailed interview notes here..."
                className="min-h-[400px] bg-slate-950/50 border-white/5 rounded-[24px] p-6 text-slate-300 text-xs leading-relaxed focus:border-violet-500/50 transition-all resize-none"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
             />
          </div>

          <Button 
            onClick={handleExtract}
            disabled={loading}
            className="w-full h-14 bg-violet-600 hover:bg-violet-500 text-white gap-3 text-lg font-black italic shadow-2xl shadow-violet-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "EXTRACTING TRUTH..." : "GENERATE SCORECARD"}
          </Button>
        </Card>

        <div className="space-y-6">
          {results ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              {/* Decision Card */}
              <Card className={cn(
                "p-8 border-2 rounded-[32px] flex items-center justify-between overflow-hidden relative",
                results.decision === "Extract" ? "bg-green-600/5 border-green-500/20" : 
                results.decision === "Watch" ? "bg-blue-600/5 border-blue-500/20" : "bg-red-600/5 border-red-500/20"
              )}>
                 <div className="relative z-10">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Recruiter Verdict</h3>
                    <div className={cn(
                      "text-4xl font-black italic uppercase tracking-tighter",
                      results.decision === "Extract" ? "text-green-500" : 
                      results.decision === "Watch" ? "text-blue-500" : "text-red-500"
                    )}>{results.decision}</div>
                 </div>
                 <div className="relative z-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <ShieldCheck className={cn(
                      "w-10 h-10",
                      results.decision === "Extract" ? "text-green-500" : 
                      results.decision === "Watch" ? "text-blue-500" : "text-red-500"
                    )} />
                 </div>
              </Card>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-6">
                 <MetricCard label="Truth Score" value={results.truthScore} desc={results.truthAnalysis} color="blue" />
                 <MetricCard label="Tech Depth" value={results.techDepth} desc={results.techAnalysis} color="violet" />
              </div>

              {/* Culture & Summary */}
              <Card className="glass border-white/5 p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-400">
                       <Zap className="w-4 h-4" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Culture Alignment</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium italic">"{results.cultureFit}"</p>
                 </div>
                 
                 <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                       <MessageSquare className="w-4 h-4" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Executive Summary</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{results.summary}</p>
                 </div>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01] p-12 text-center group">
              <div className="relative mb-8">
                {isListening && (
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-violet-500 rounded-full blur-3xl"
                  />
                )}
                <Button 
                  onClick={toggleListening}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 relative z-10",
                    isListening ? "bg-red-500 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)]" : "bg-violet-600 hover:bg-violet-500 shadow-xl"
                  )}
                >
                  {isListening ? <Loader2 className="w-10 h-10 animate-spin" /> : <Mic className="w-10 h-10" />}
                </Button>
              </div>
              
              <h3 className="text-white font-bold italic uppercase tracking-tighter text-2xl">
                {isListening ? "LISTENING..." : "VOICE OF TALENT"}
              </h3>
              <p className="text-slate-600 text-xs mt-3 max-w-[280px] font-medium leading-relaxed uppercase tracking-widest">
                {isListening ? "DICTATE YOUR NOTES NOW. THE AI WILL TYPE AUTOMATICALLY." : "TAP THE MIC TO ENABLE VOICE-TO-TEXT ASSISTANT FOR YOUR TRANSCRIPT."}
              </p>

              {!isListening && (
                <Badge variant="outline" className="mt-8 bg-violet-500/5 text-violet-400 border-violet-500/20 px-6 py-2 rounded-full font-black text-[10px] tracking-widest">
                  ELITE RECRUITER MODE
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, desc, color }: any) {
  const colorMap: any = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
    violet: "text-violet-500 bg-violet-500/10 border-violet-500/20 shadow-violet-500/5",
  };

  return (
    <Card className={cn("glass p-6 space-y-4", colorMap[color])}>
       <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
          <span className="text-2xl font-black italic">{value}%</span>
       </div>
       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={cn("h-full", color === "blue" ? "bg-blue-500" : "bg-violet-500")} />
       </div>
       <p className="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-3">{desc}</p>
    </Card>
  );
}
