"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Sparkles, BrainCircuit, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { chatWithAI } from "@/app/actions/interview";
import { speak } from "@/app/actions/voice";
import RobotScene from "@/components/auth/RobotScene";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const INTERVIEW_TRACKS = [
  "Software Engineering", "DevOps & Cloud (AWS/Azure)", "Data Science & AI", 
  "Cybersecurity", "Blockchain Development", "Mobile Dev (iOS/Android)",
  "Fullstack Web", "Embedded Systems"
];

export default function MockInterviewPage() {
  const [selectedTrack, setSelectedTrack] = useState(INTERVIEW_TRACKS[0]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [userInput, setUserInput] = useState("");
  const [metrics, setMetrics] = useState({ depth: 0, problem: 0, comms: 0 });
  const [knowledgeNugget, setKnowledgeNugget] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  };

  // Speech-to-Text Logic
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const finalTranscript = event.results[i][0].transcript;
            setUserInput(finalTranscript);
            handleSend(finalTranscript); 
          } else {
            interimTranscript += event.results[i][0].transcript;
            setUserInput(interimTranscript);
          }
        }
      };

      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (isListening) {
      stopSpeaking();
      recognitionRef.current?.start();
      toast.info("Robot is listening... Speak clearly!");
    } else {
      recognitionRef.current?.stop();
    }
  }, [isListening]);

  const startInterview = async () => {
    stopSpeaking();
    setIsThinking(true);
    setMetrics({ depth: 0, problem: 0, comms: 0 });
    setKnowledgeNugget("Initializing AI Teacher... Ready for elite technical simulation.");
    
    const welcome = `Welcome to your ELITE ${selectedTrack} interview. I am your HireSight AI agent. Today we will dive deep into architecture and fundamentals. Are you ready to begin?`;
    
    const audioBase64 = await speak(welcome.replace(/[#*`]/g, "")); 
    if (audioBase64) {
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      currentAudioRef.current = audio;
      audio.play();
    }
    
    setChatHistory([{ role: 'assistant', content: welcome }]);
    setIsThinking(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    stopSpeaking();
    const newHistory = [...chatHistory, { role: 'user', content: text }] as any[];
    setChatHistory(prev => [...prev, { role: 'user', content: text }]);
    setUserInput("");
    setIsThinking(true);

    try {
      const response = await chatWithAI(selectedTrack, text, newHistory);

      const audioBase64 = await speak(response.replace(/[#*`]/g, ""));
      if (audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
        currentAudioRef.current = audio;
        audio.play();
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      
      // Dynamic Metric Updates (Simulated based on complexity)
      setMetrics(prev => ({
        depth: Math.min(100, prev.depth + Math.floor(Math.random() * 15)),
        problem: Math.min(100, prev.problem + Math.floor(Math.random() * 10)),
        comms: Math.min(100, prev.comms + Math.floor(Math.random() * 20))
      }));

      // Extract a 'Nugget' if the response is long
      if (response.length > 200) {
        setKnowledgeNugget("💡 TIP: " + response.split('.')[0] + ".");
      }

    } catch (err) {
      toast.error("AI Response failed.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[url('/auth-bg.png')] bg-cover bg-center opacity-30 scale-110" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-black" />

      <div className="relative z-10 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        
        {/* Column 1: Tracks & Robot (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
           <div className="relative h-[380px] glass rounded-[40px] overflow-hidden border-white/10 shadow-2xl">
              <RobotScene isPasswordFocused={isListening || isThinking} isLoggedIn={true} />
              <div className="absolute top-4 left-4">
                 <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 px-3 py-1 backdrop-blur-xl animate-pulse">
                    ELITE AGENT LIVE
                 </Badge>
              </div>
           </div>

           <div className="space-y-4 glass p-6 rounded-[30px] border-white/5">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Sparkles className="w-3 h-3" /> Select Career Track
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {INTERVIEW_TRACKS.map(track => (
                   <button
                    key={track}
                    onClick={() => setSelectedTrack(track)}
                    className={`w-full p-3 rounded-xl text-[9px] font-black uppercase tracking-widest border text-left transition-all ${
                      selectedTrack === track 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                    }`}
                   >
                     {track}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Column 2: Main Interview (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-tight">
                AI <span className="text-blue-500">SIMULATOR.</span>
              </h1>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                 <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{selectedTrack} Protocol</span>
              </div>
            </div>
            <div className="flex gap-2">
               <div className="glass p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Latency</span>
                  <span className="text-xs font-bold text-blue-400">142ms</span>
               </div>
               <div className="glass p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Tokens</span>
                  <span className="text-xs font-bold text-green-400">9.2k</span>
               </div>
            </div>
          </div>

          <Card className="glass border-white/10 p-6 rounded-[40px] h-[600px] flex flex-col shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
            
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar mb-6 relative z-10">
               {chatHistory.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                    <BrainCircuit className="w-16 h-16 mb-6 text-blue-500 animate-pulse" />
                    <p className="text-sm font-black uppercase tracking-widest mb-2">Awaiting Session Start</p>
                    <p className="text-xs font-medium text-slate-500 italic max-w-[300px]">
                       Select your career track and initiate the ELITE protocol to begin technical training.
                    </p>
                 </div>
               )}
               {chatHistory.map((msg, i) => (
                 <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                 >
                   <div className={`max-w-[85%] p-5 rounded-[25px] text-sm leading-relaxed shadow-xl ${
                     msg.role === 'assistant' 
                     ? 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none' 
                     : 'bg-blue-600 text-white rounded-tr-none font-medium'
                   }`}>
                     <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                           {msg.content}
                        </ReactMarkdown>
                     </div>
                   </div>
                 </motion.div>
               ))}
               {isThinking && (
                 <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10">
                       <div className="flex gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                       </div>
                    </div>
                 </div>
               )}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10 relative z-10">
               <div className="flex gap-3">
                  <input 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(userInput)}
                    placeholder={`Identify your solution for ${selectedTrack}...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                  />
                  <Button 
                    onClick={() => handleSend(userInput)}
                    disabled={isThinking}
                    className="w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                  >
                    <Zap className="w-5 h-5" />
                  </Button>
               </div>

               <div className="grid grid-cols-3 gap-3">
                 <Button 
                  onClick={startInterview}
                  disabled={isThinking}
                  className="h-12 rounded-2xl glass border-white/10 hover:bg-white/5 text-blue-400 font-black uppercase tracking-widest gap-2 text-[9px]"
                 >
                   <Sparkles className="w-4 h-4" /> INITIATE PROTOCOL
                 </Button>
                 <Button 
                  onClick={() => setIsListening(!isListening)}
                  className={`h-12 rounded-2xl font-black uppercase tracking-widest gap-2 transition-all text-[9px] ${isListening ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                 >
                   {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                   {isListening ? 'VOICE LIVE' : 'ACTIVATE VOICE'}
                 </Button>
                 <Button 
                  onClick={stopSpeaking}
                  className="h-12 rounded-2xl glass border-white/10 hover:bg-white/5 text-slate-500 font-black uppercase tracking-widest gap-2 text-[9px]"
                 >
                   <Volume2 className="w-4 h-4" /> SILENCE AGENT
                 </Button>
               </div>
            </div>
          </Card>
        </div>

        {/* Column 3: Simulator Intelligence (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
           <div className="glass p-6 rounded-[40px] border-white/10 space-y-8 shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <BrainCircuit className="w-3 h-3 text-blue-500" /> Simulator Intelligence
              </h3>
              
              <div className="space-y-6">
                 {[
                   { label: "Technical Depth", val: metrics.depth, color: "bg-blue-500" },
                   { label: "Problem Solving", val: metrics.problem, color: "bg-green-500" },
                   { label: "Communication", val: metrics.comms, color: "bg-purple-500" }
                 ].map((m, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                         <span className="text-xs font-black text-white">{m.val}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${m.val}%` }}
                           className={`h-full ${m.color} shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                         />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-4 rounded-3xl bg-blue-500/5 border border-blue-500/10 min-h-[150px]">
                 <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Knowledge Nugget</span>
                 </div>
                 <AnimatePresence mode="wait">
                    <motion.p 
                      key={knowledgeNugget}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-xs text-slate-400 font-medium leading-relaxed italic"
                    >
                      {knowledgeNugget || "Awaiting AI insights from your session..."}
                    </motion.p>
                 </AnimatePresence>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                 <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase">FAANG Tier</span>
                    <Badge variant="outline" className="text-[8px] border-blue-500/30 text-blue-400 uppercase font-black px-2">Enabled</Badge>
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Pedagogy</span>
                    <Badge variant="outline" className="text-[8px] border-green-500/30 text-green-400 uppercase font-black px-2">Spoon-feed</Badge>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
