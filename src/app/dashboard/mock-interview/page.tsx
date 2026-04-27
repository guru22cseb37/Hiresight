"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Sparkles, BrainCircuit, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { speak } from "@/app/actions/voice";
import RobotScene from "@/components/auth/RobotScene";

export default function MockInterviewPage() {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("Hello! I am your HireSight AI Interviewer. Ready to practice?");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startInterview = async () => {
    setIsThinking(true);
    const audioBase64 = await speak("Welcome to HireSight. I am ready to begin your mock interview. Tell me about yourself.");
    if (audioBase64) {
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      audio.play();
      setAiResponse("Welcome to HireSight. I am ready to begin your mock interview. Tell me about yourself.");
    }
    setIsThinking(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[url('/auth-bg.png')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-black" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        
        {/* Left: 3D Robot Interviewer */}
        <div className="relative h-[600px] group">
          <div className="absolute inset-0 bg-blue-500/5 rounded-[40px] blur-3xl group-hover:bg-blue-500/10 transition-all" />
          <RobotScene isPasswordFocused={isListening} />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
             <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 px-4 py-2 backdrop-blur-xl animate-pulse">
                INTERVIEWER LIVE
             </Badge>
          </div>
        </div>

        {/* Right: Interview Controls */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-tight">
              AI VOICE <span className="text-blue-500">AGENT.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium">Powered by Deepgram Aura & Llama 3</p>
          </div>

          <Card className="glass border-white/10 p-8 rounded-[40px] space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 italic text-slate-300 text-lg leading-relaxed relative">
              <div className="absolute -top-3 -left-3">
                 <Sparkles className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
              "{aiResponse}"
              {isThinking && (
                <div className="mt-4 flex gap-1">
                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Button 
                onClick={startInterview}
                className="h-16 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest gap-3"
               >
                 <Zap className="w-5 h-5" /> START SESSION
               </Button>
               
               <Button 
                variant="outline"
                onClick={() => setIsListening(!isListening)}
                className={`h-16 rounded-2xl font-black uppercase tracking-widest gap-3 transition-all ${isListening ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'glass'}`}
               >
                 {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                 {isListening ? 'STOP MIC' : 'ACTIVATE MIC'}
               </Button>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
               <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence Score</span>
                     <span className="text-xs font-bold text-green-400">92%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        className="h-full bg-green-500"
                     />
                  </div>
               </div>
               <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tech Accuracy</span>
                     <span className="text-xs font-bold text-blue-400">88%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "88%" }}
                        className="h-full bg-blue-500"
                     />
                  </div>
               </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
             {[
               { icon: BrainCircuit, label: "Real-time Logic" },
               { icon: ShieldCheck, label: "Aura Voice" },
               { icon: Volume2, label: "Zero Latency" }
             ].map((item, i) => (
               <div key={i} className="glass p-4 rounded-2xl flex flex-col items-center gap-2 text-center">
                  <item.icon className="w-5 h-5 text-blue-500" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
