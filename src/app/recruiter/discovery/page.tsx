"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  Check, X, Zap, User, MapPin, 
  DollarSign, Sparkles, BrainCircuit,
  Trophy, Star, Github, Linkedin, ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock Data for Recruiter
const MOCK_CANDIDATES = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Full Stack Architect",
    location: "Berlin, Germany (Remote)",
    expected_salary: "$160k - $200k",
    score: 96,
    bio: "Ex-Google. Built microservices for YouTube. Expert in Go, Rust, and React. Passionate about distributed systems.",
    experience: "12 Years",
    tags: ["Go", "Rust", "Distributed Systems", "React"],
    ai_insight: "Alex's recent contribution to the Kubernetes core matches your 'Infra Lead' requirements perfectly."
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "AI Research Engineer",
    location: "Toronto, Canada",
    expected_salary: "$190k - $250k",
    score: 92,
    bio: "PhD in Neural Networks. Focused on efficient LLM inference. Published 3 papers at NeurIPS.",
    experience: "5 Years",
    tags: ["Python", "PyTorch", "CUDA", "LLMs"],
    ai_insight: "Sarah's thesis on 'Flash Attention' is cited in the very libraries your team is using."
  },
  {
    id: "3",
    name: "Jordan Smith",
    role: "Frontend Lead",
    location: "London, UK",
    expected_salary: "$140k - $170k",
    score: 89,
    bio: "Obsessed with UI/UX performance. Built the design system for a Series D fintech. Modern React expert.",
    experience: "8 Years",
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    ai_insight: "Jordan's portfolio highlights the exact glassmorphism design language you requested for the new dashboard."
  }
];

function MapPingPoint({ x, y, name, role }: { x: string, y: string, name: string, role: string }) {
  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute group cursor-crosshair"
      style={{ left: x, top: y }}
    >
      <div className="relative">
         <div className="w-3 h-3 bg-violet-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.8)]" />
         <div className="absolute inset-0 w-3 h-3 bg-violet-500 rounded-full animate-ping opacity-75" />
         
         <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30">
            <div className="glass border-white/10 p-3 rounded-xl min-w-[120px] shadow-2xl">
               <div className="text-[10px] font-black text-white italic">{name}</div>
               <div className="text-[8px] text-violet-400 font-bold uppercase tracking-widest">{role}</div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

export default function RecruiterDiscoveryPage() {
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(false);

  const handleSwipe = (direction: 'like' | 'pass') => {
    if (direction === 'like') {
      toast.success(autonomousMode ? "Autonomous Sequence Initiated" : `Invitation sent to ${candidates[currentIndex].name}!`, {
        description: autonomousMode ? "AI Agent will handle follow-ups and scheduling." : "They will be notified of your interest immediately.",
        icon: <Zap className="w-4 h-4 text-violet-500" />
      });
    }
    
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      toast.info("No more candidates matching this JD! Try broadening your search.");
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center py-10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[120px] -z-10" />
      
      <div className="w-full max-w-5xl flex items-center justify-between mb-12">
        <div className="space-y-2">
          <Badge variant="outline" className="bg-violet-600/10 text-violet-400 border-violet-600/20 px-4 py-1 font-black tracking-widest uppercase italic">
            Radar v2.0 Protocol
          </Badge>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            HIRE THE <span className="text-violet-500">ELITE.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
           {/* Autonomous Toggle */}
           <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-xl">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Autonomous</span>
                 <span className="text-[10px] font-bold text-white leading-none">Sovereign Mode</span>
              </div>
              <button 
                onClick={() => setAutonomousMode(!autonomousMode)}
                className={`w-10 h-5 rounded-full transition-all relative ${autonomousMode ? 'bg-violet-600' : 'bg-slate-800'}`}
              >
                 <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${autonomousMode ? 'left-6' : 'left-1'}`} />
              </button>
           </div>

           {/* View Switcher */}
           <div className="flex p-1 rounded-2xl bg-slate-900 border border-white/5">
              <Button 
                onClick={() => setShowMap(false)}
                variant="ghost" 
                className={`h-10 px-4 rounded-xl text-xs font-bold gap-2 ${!showMap ? 'bg-white/5 text-white' : 'text-slate-500'}`}
              >
                <Zap className="w-4 h-4" />
                Radar
              </Button>
              <Button 
                onClick={() => setShowMap(true)}
                variant="ghost" 
                className={`h-10 px-4 rounded-xl text-xs font-bold gap-2 ${showMap ? 'bg-white/5 text-white' : 'text-slate-500'}`}
              >
                <MapPin className="w-4 h-4" />
                Talent Map
              </Button>
           </div>
        </div>
      </div>

      {!showMap ? (
        <div className="relative w-full max-w-md h-[650px] perspective-1000">
          <AnimatePresence mode="popLayout">
            {candidates.slice(currentIndex, currentIndex + 1).map((candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                onSwipe={handleSwipe}
              />
            ))}
          </AnimatePresence>
          
          {currentIndex === candidates.length && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 glass rounded-[40px] border-white/5"
            >
              <div className="w-20 h-20 rounded-3xl bg-violet-600/10 flex items-center justify-center mb-6">
                <Zap className="w-10 h-10 text-violet-500" />
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Radar Silent.</h3>
              <p className="text-slate-500 mt-2 mb-8">All matching candidates have been screened. Our bots are scanning global networks for more talent...</p>
              <Button 
                variant="outline" 
                onClick={() => setCurrentIndex(0)}
                className="glass border-white/10 text-white font-bold tracking-widest uppercase h-12 px-8"
              >
                Refresh Radar
              </Button>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-5xl h-[650px] glass border-white/5 rounded-[40px] relative overflow-hidden bg-slate-950/50">
           {/* Futuristic Map Simulation */}
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[800px] h-[400px]">
                 {/* Map Pings */}
                 <MapPingPoint x="20%" y="30%" name="Alex" role="Rust Expert" />
                 <MapPingPoint x="75%" y="25%" name="Sarah" role="AI Research" />
                 <MapPingPoint x="45%" y="60%" name="Jordan" role="UI Lead" />
                 <MapPingPoint x="85%" y="70%" name="Elena" role="Design" />
                 <MapPingPoint x="15%" y="80%" name="Marcus" role="Architect" />
                 
                 {/* Scanning Lines */}
                 <motion.div 
                   animate={{ x: ['0%', '100%', '0%'] }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className="absolute top-0 bottom-0 w-px bg-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.5)] z-20"
                 />
              </div>
           </div>
           
           <div className="absolute bottom-10 left-10 p-6 glass border-white/5 rounded-2xl max-w-xs space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-violet-400" />
                 Global Intelligence
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                 "Our bots are currently tracking 14,202 elite engineers across 42 countries. 5 high-probability matches identified in your current timezone."
              </p>
           </div>
        </div>
      )}

      {!showMap && currentIndex < candidates.length && (
        <div className="flex items-center gap-8 mt-12">
          <button 
            onClick={() => handleSwipe('pass')}
            className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-90"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button 
            className="w-14 h-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-violet-500 hover:bg-violet-500/10 hover:border-violet-500/20 transition-all active:scale-90"
          >
            <Star className="w-6 h-6" />
          </button>

          <button 
            onClick={() => handleSwipe('like')}
            className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-green-500 hover:bg-green-500/10 hover:border-green-500/20 transition-all active:scale-90 shadow-2xl shadow-green-500/10"
          >
            <Check className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}



function CandidateCard({ candidate, onSwipe }: { candidate: any, onSwipe: (dir: 'like' | 'pass') => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const passOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('like');
    } else if (info.offset.x < -100) {
      onSwipe('pass');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.05, cursor: "grabbing" }}
      className="absolute inset-0 z-10 touch-none cursor-grab"
    >
      <Card className="w-full h-full glass border-white/10 rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
        <motion.div 
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-10 z-20 border-4 border-green-500 text-green-500 font-black text-4xl px-4 py-2 rounded-xl uppercase -rotate-12 pointer-events-none"
        >
          SHORTLIST
        </motion.div>
        <motion.div 
          style={{ opacity: passOpacity }}
          className="absolute top-10 right-10 z-20 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-2 rounded-xl uppercase rotate-12 pointer-events-none"
        >
          NEXT
        </motion.div>

        {/* HEADER SECTION */}
        <div className="p-8 bg-gradient-to-br from-violet-600 to-fuchsia-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
             <User className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 flex justify-between items-start">
             <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-2xl border-2 border-white/20 overflow-hidden bg-white/10">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`} alt={candidate.name} />
                </div>
                <div className="space-y-1">
                   <h2 className="text-3xl font-black text-white italic tracking-tighter leading-tight">{candidate.name}</h2>
                   <span className="text-xs font-black text-white/80 uppercase tracking-widest">{candidate.role}</span>
                </div>
             </div>
             <div className="flex flex-col items-end">
                <div className="text-4xl font-black text-white italic">{candidate.score}%</div>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Match Score</span>
             </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-8 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
           <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                 <MapPin className="w-3.5 h-3.5 text-violet-400" />
                 {candidate.location}
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                 <Trophy className="w-3.5 h-3.5 text-amber-400" />
                 {candidate.experience}
              </div>
           </div>

           <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidate Bio</h4>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">{candidate.bio}</p>
           </div>

           {/* AI INSIGHT CARD */}
           <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-600/10 to-blue-600/10 border border-violet-500/20 relative group">
              <div className="flex items-center gap-3 mb-2">
                 <Sparkles className="w-4 h-4 text-violet-400" />
                 <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">SOURCING INTEL</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic font-medium">"{candidate.ai_insight}"</p>
           </div>

           <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Top Skills</h4>
              <div className="flex flex-wrap gap-2">
                 {candidate.tags.map((t: string) => (
                    <Badge key={t} className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-[9px] font-bold uppercase">{t}</Badge>
                 ))}
              </div>
           </div>
        </div>

        {/* FOOTER */}
        <div className="p-8 border-t border-white/5 bg-slate-900/20 flex items-center justify-between">
           <div className="flex gap-4">
              <Github className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
              <ExternalLink className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
           </div>
           <Button variant="ghost" className="text-[10px] font-black text-violet-500 uppercase tracking-widest">
              View Full Resume
           </Button>
        </div>
      </Card>
    </motion.div>
  );
}
