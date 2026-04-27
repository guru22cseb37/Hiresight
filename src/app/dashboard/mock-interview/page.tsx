"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Sparkles, BrainCircuit, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { tailorResume } from "@/app/actions/tailor"; // Re-using Groq logic
import { speak } from "@/app/actions/voice";
import RobotScene from "@/components/auth/RobotScene";

const INTERVIEW_TRACKS = [
  "Software Engineering", "DevOps & Cloud (AWS/Azure)", "Data Science & AI", 
  "Cybersecurity", "Blockchain Development", "Mobile Dev (iOS/Android)",
  "Fullstack Web", "Embedded Systems"
];

export default function MockInterviewPage() {
  const [selectedTrack, setSelectedTrack] = useState(INTERVIEW_TRACKS[0]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [userInput, setUserInput] = useState("");

  const startInterview = async () => {
    setIsThinking(true);
    const welcome = `Welcome to your ${selectedTrack} interview. I am your HireSight AI agent. Let's begin. Describe your experience with ${selectedTrack}.`;
    
    const audioBase64 = await speak(welcome);
    if (audioBase64) {
      new Audio(`data:audio/wav;base64,${audioBase64}`).play();
    }
    
    setChatHistory([{ role: 'ai', content: welcome }]);
    setIsThinking(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: text }]);
    setUserInput("");
    setIsThinking(true);

    try {
      // Use Groq for technical response (reusing logic pattern)
      const response = await tailorResume(
        `Interviewer for ${selectedTrack}`, 
        "HireSight Simulator", 
        `User said: ${text}. Provide a short technical follow-up question or answer.`
      );

      const audioBase64 = await speak(response);
      if (audioBase64) {
        new Audio(`data:audio/wav;base64,${audioBase64}`).play();
      }

      setChatHistory(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      toast.error("AI Response failed.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[url('/auth-bg.png')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-black" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-10">
        
        {/* Left: 3D Robot & Tracks (4 columns) */}
        <div className="lg:col-span-5 space-y-8">
           <div className="relative h-[450px] glass rounded-[40px] overflow-hidden border-white/10">
              <RobotScene isPasswordFocused={isListening || isThinking} />
              <div className="absolute top-6 left-6">
                 <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 px-3 py-1 backdrop-blur-xl">
                    AI AGENT ACTIVE
                 </Badge>
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Select Interview Track</h3>
              <div className="grid grid-cols-2 gap-2">
                 {INTERVIEW_TRACKS.map(track => (
                   <button
                    key={track}
                    onClick={() => setSelectedTrack(track)}
                    className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      selectedTrack === track 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                    }`}
                   >
                     {track}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Chat & Voice Controls (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-tight">
              HIRESIGHT <span className="text-blue-500">SIMULATOR.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium">Technical Training for {selectedTrack}</p>
          </div>

          <Card className="glass border-white/10 p-6 rounded-[40px] h-[500px] flex flex-col shadow-2xl">
            <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar mb-6">
               {chatHistory.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <BrainCircuit className="w-12 h-12 mb-4 text-blue-500" />
                    <p className="text-sm font-medium italic">Select a track and start your session...</p>
                 </div>
               )}
               {chatHistory.map((msg, i) => (
                 <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                 >
                   <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                     msg.role === 'ai' 
                     ? 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none' 
                     : 'bg-blue-600 text-white rounded-tr-none'
                   }`}>
                     {msg.content}
                   </div>
                 </motion.div>
               ))}
               {isThinking && (
                 <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none">
                       <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                       </div>
                    </div>
                 </div>
               )}
            </div>

            <div className="space-y-4">
               <div className="flex gap-2">
                  <input 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(userInput)}
                    placeholder={`Type your response for ${selectedTrack}...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <Button 
                    onClick={() => handleSend(userInput)}
                    disabled={isThinking}
                    className="w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center"
                  >
                    <Zap className="w-5 h-5" />
                  </Button>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <Button 
                  onClick={startInterview}
                  disabled={isThinking}
                  className="h-14 rounded-2xl glass border-white/10 hover:bg-white/5 text-blue-400 font-black uppercase tracking-widest gap-2"
                 >
                   <Sparkles className="w-4 h-4" /> START NEW SESSION
                 </Button>
                 <Button 
                  onClick={() => setIsListening(!isListening)}
                  className={`h-14 rounded-2xl font-black uppercase tracking-widest gap-2 transition-all ${isListening ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                 >
                   {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                   {isListening ? 'VOICE ON' : 'ACTIVATE VOICE'}
                 </Button>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
