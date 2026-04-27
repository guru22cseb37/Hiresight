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

function ConnectionLine({ x1, y1, x2, y2 }: { x1: string, y1: string, x2: string, y2: string }) {
  return (
    <motion.line 
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="url(#flowGradient)"
      strokeWidth="1"
      strokeDasharray="10,10"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.3 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    />
  );
}

function LegendItem({ label, color }: { label: string, color: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-white/5 backdrop-blur-md">
       <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_10px_currentColor]`} />
       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

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
        <div className="w-full max-w-5xl h-[650px] glass border-white/5 rounded-[40px] relative overflow-hidden bg-slate-950/80 shadow-[0_0_50px_rgba(139,92,246,0.1)]">
           {/* CINEMATIC GRID & MAP SILHOUETTE */}
           <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
           
           <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none scale-110">
              <svg viewBox="0 0 1000 500" className="w-full h-full fill-violet-500">
                 <path d="M150,150 Q250,50 350,150 T550,150 T750,250 T950,150" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" />
                 <circle cx="200" cy="150" r="100" fill="currentColor" opacity="0.1" />
                 <circle cx="500" cy="250" r="150" fill="currentColor" opacity="0.1" />
                 <circle cx="800" cy="180" r="120" fill="currentColor" opacity="0.1" />
              </svg>
           </div>

           {/* RADAL SWEEP ANIMATION */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-[1000px] h-[1000px] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(139,92,246,0.1)_90deg,transparent_91deg)] z-10"
              />
           </div>

           {/* NEURAL CONNECTIONS (SVG) */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
              <defs>
                 <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="transparent" />
                 </linearGradient>
              </defs>
              <ConnectionLine x1="20%" y1="30%" x2="45%" y2="60%" />
              <ConnectionLine x1="45%" y1="60%" x2="75%" y2="25%" />
              <ConnectionLine x1="75%" y1="25%" x2="85%" y2="70%" />
              <ConnectionLine x1="15%" y1="80%" x2="45%" y2="60%" />
           </svg>

           <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[800px] h-[400px]">
                 {/* Map Pings with Metadata */}
                 <MapPingPoint x="20%" y="30%" name="Alex Rivera" role="Rust Architect" />
                 <MapPingPoint x="75%" y="25%" name="Sarah Chen" role="AI Research" />
                 <MapPingPoint x="45%" y="60%" name="Jordan Smith" role="UI Lead" />
                 <MapPingPoint x="85%" y="70%" name="Elena Rodriguez" role="Designer" />
                 <MapPingPoint x="15%" y="80%" name="Marcus Miller" role="Systems Expert" />
              </div>
           </div>
           
           <div className="absolute bottom-10 left-10 p-6 glass border-white/5 rounded-2xl max-w-xs space-y-4 z-30 shadow-2xl">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                 <BrainCircuit className="w-4 h-4 text-violet-400" />
                 Global Sourcing Intel
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed italic font-medium">
                 "Neural Radar has identified 5 high-probability 'Elite' pings. These individuals match your 'High Performance' engineering profile with 94%+ accuracy."
              </p>
           </div>

           {/* MAP LEGEND */}
           <div className="absolute top-10 right-10 flex flex-col gap-2 z-30">
              <LegendItem label="Active Ping" color="bg-violet-500" />
              <LegendItem label="Neural Link" color="bg-violet-500/20" />
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
