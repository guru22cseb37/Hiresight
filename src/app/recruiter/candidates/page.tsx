"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, Filter, Mail, Phone, 
  Linkedin, Download, Star, MoreVertical,
  CheckCircle2, Clock, XCircle, SearchCode,
  MapPin, Briefcase, FileText, Loader2, X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewingProfile, setViewingProfile] = useState<any>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const realCandidates = (data || []).map(c => {
        // Extract details from notes if available (e.g. "Applied for AI Developer at HIRESIGHT. Experience: Fresher (0-1 Years). Location: Remote.")
        const notesStr = c.notes || "";
        const expMatch = notesStr.match(/Experience: (.*?)\./);
        const roleMatch = notesStr.match(/Applied for (.*?) at/);

        return {
          id: c.id,
          name: c.name || "Anonymous Candidate",
          email: c.email || "No email",
          targetRole: roleMatch ? roleMatch[1] : "Applied Candidate",
          status: c.stage === 'new' ? 'screening' : c.stage,
          experience: expMatch ? expMatch[1] : "See Resume",
          score: c.ai_score || 0,
          location: "Remote",
          tags: c.strengths || [],
          resumeUrl: c.resume_url,
          notes: notesStr,
          isReal: true
        };
      });

      setCandidates([...realCandidates, ...MOCK_CANDIDATES]);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setCandidates(MOCK_CANDIDATES);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (candidates.length === 0) {
      toast.error("No candidates to export.");
      return;
    }

    const headers = ["Name", "Role", "Status", "Experience", "Score", "Location", "Tags"];
    const rows = candidates.map(c => [
      `"${c.name}"`,
      `"${c.targetRole}"`,
      `"${c.status}"`,
      `"${c.experience}"`,
      c.score,
      `"${c.location}"`,
      `"${(c.tags || []).join(', ')}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `HireSight_Candidates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Candidate database exported to CSV.");
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white italic">Talent CRM</h1>
          <p className="text-slate-400 mt-1">Manage all your active candidates and talent pools in one place.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={exportToCSV}
            variant="outline" 
            className="glass border-white/10 gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-500 text-white gap-2 shadow-lg shadow-violet-500/20">
            <Users className="w-4 h-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search by name, role, or skills..." 
              className="pl-10 glass border-white/10 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="glass border-white/10 h-10 px-3" onClick={fetchCandidates}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
            <button className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-bold transition-all shadow-lg">Grid</button>
            <button className="px-3 py-1.5 rounded-md text-slate-500 text-xs font-bold hover:text-white transition-all">List</button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading && candidates.length === 0 ? (
          <div className="col-span-full h-64 flex items-center justify-center">
             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          candidates.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((candidate, i) => (
            <CandidateCard key={candidate.id} candidate={candidate} index={i} onViewProfile={() => setViewingProfile(candidate)} />
          ))
        )}
      </div>

      {viewingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl max-h-[85vh] bg-slate-950 border border-white/10 rounded-3xl flex flex-col shadow-2xl relative overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 text-white flex items-center justify-center font-bold text-2xl shadow-xl overflow-hidden">
                   {viewingProfile.avatar ? (
                     <img src={viewingProfile.avatar} alt={viewingProfile.name} className="w-full h-full object-cover" />
                   ) : viewingProfile.name[0]}
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold text-white italic">{viewingProfile.name}</h3>
                   <p className="text-slate-400 font-medium text-xs uppercase tracking-widest mt-1">{viewingProfile.targetRole}</p>
                 </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setViewingProfile(null)} className="rounded-full hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">ATS Match</div>
                   <div className="text-lg font-bold text-blue-400">{viewingProfile.score}%</div>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Experience</div>
                   <div className="text-lg font-bold text-white">{viewingProfile.experience}</div>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Location</div>
                   <div className="text-lg font-bold text-white truncate">{viewingProfile.location}</div>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Status</div>
                   <div className="text-lg font-bold text-white capitalize">{viewingProfile.status}</div>
                 </div>
               </div>

               <div>
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Core Skills & Strengths</h4>
                 <div className="flex flex-wrap gap-2">
                   {(viewingProfile.tags || []).length > 0 ? viewingProfile.tags.map((tag: string) => (
                     <Badge key={tag} className="bg-blue-500/10 text-blue-400 border-blue-500/20">{tag}</Badge>
                   )) : <span className="text-sm text-slate-500">No skills explicitly listed.</span>}
                 </div>
               </div>

               <div>
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Application Notes / Bio</h4>
                 <div className="p-4 rounded-xl bg-slate-900 border border-white/5 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                   {viewingProfile.notes || "No additional notes provided by the candidate."}
                 </div>
               </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-slate-900/50 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setViewingProfile(null)} className="hover:bg-white/5 text-white">Close</Button>
              <Button 
                onClick={() => {
                  if (viewingProfile.resumeUrl) window.open(viewingProfile.resumeUrl, "_blank");
                  else toast.error("No resume attached.");
                }} 
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wider px-6 gap-2"
              >
                <Download className="w-4 h-4" /> Download Resume
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function CandidateCard({ candidate, index, onViewProfile }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={cn(
        "glass border-white/5 p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden h-full flex flex-col",
        candidate.isReal && "border-green-500/20 bg-green-500/[0.02]"
      )}>
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none" />
        
        <div className="flex items-start justify-between relative z-10 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-white text-xl group-hover:scale-110 transition-transform shadow-xl overflow-hidden">
              {candidate.avatar ? (
                <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
              ) : candidate.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white leading-none group-hover:text-blue-400 transition-colors uppercase italic">{candidate.name}</h3>
                {candidate.isReal && <Badge className="bg-green-600 text-[8px] h-4">NEW APP</Badge>}
              </div>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest mt-1">{candidate.targetRole}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-slate-600 hover:text-white transition-colors")}>
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-950 border-white/10">
              <DropdownMenuItem className="text-sm" onClick={onViewProfile}>View Full Profile</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-sm"
                onClick={() => {
                  if (candidate.resumeUrl) {
                    window.open(candidate.resumeUrl, "_blank");
                  } else {
                    toast.error("No resume attached for this candidate.");
                  }
                }}
              >
                Download Resume
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm">Schedule Interview</DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-red-400">Remove Candidate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
          <div className="space-y-1">
             <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Experience</div>
             <div className="text-xs text-white font-bold">{candidate.experience}</div>
          </div>
          <div className="space-y-1">
             <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">ATS Match</div>
             <div className="text-xs text-blue-400 font-black">{candidate.score}%</div>
          </div>
          <div className="space-y-1">
             <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Status</div>
             <div className="flex items-center gap-1.5 text-xs text-white font-bold capitalize">
                {candidate.status === 'hired' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : 
                 candidate.status === 'rejected' ? <XCircle className="w-3 h-3 text-red-500" /> : 
                 <Clock className="w-3 h-3 text-amber-500" />}
                {candidate.status}
             </div>
          </div>
          <div className="space-y-1">
             <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Location</div>
             <div className="text-xs text-white font-bold flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-600" />
                {candidate.location}
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {(candidate.tags || []).slice(0, 3).map((tag: string) => (
            <Badge key={tag} className="bg-white/5 border-white/5 text-[9px] text-slate-400 font-bold px-2 py-0.5">
              {tag}
            </Badge>
          ))}
          {candidate.tags?.length > 3 && (
            <Badge className="bg-white/5 border-white/5 text-[9px] text-slate-400 font-bold px-2 py-0.5">
              +{candidate.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 glass border-white/5 text-[10px] font-bold uppercase tracking-wider h-9">
            <Mail className="w-3.5 h-3.5 mr-2" />
            Contact
          </Button>
          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider h-9">
            <SearchCode className="w-3.5 h-3.5 mr-2" />
            Screen
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

const MOCK_CANDIDATES = [
  { id: "mock-1", name: "Sarah Chen", targetRole: "Senior React Engineer", status: "screening", experience: "8 Years", score: 94, location: "SF, California", tags: ["Next.js", "Rust", "Web3"], avatar: "https://i.pravatar.cc/150?u=sarah" },
  { id: "mock-2", name: "Marcus Miller", targetRole: "Frontend Architect", status: "hired", experience: "12 Years", score: 98, location: "Remote", tags: ["Design Systems", "Web Performance"], avatar: "https://i.pravatar.cc/150?u=marcus" },
  { id: "mock-3", name: "Julian Voss", targetRole: "Fullstack Developer", status: "interviewing", experience: "4 Years", score: 81, location: "Berlin, DE", tags: ["PostgreSQL", "React Native"], avatar: "https://i.pravatar.cc/150?u=julian" },
  { id: "mock-4", name: "Elena Rodriguez", targetRole: "Product Designer", status: "rejected", experience: "6 Years", score: 72, location: "Austin, TX", tags: ["Figma", "Interaction Design"], avatar: "https://i.pravatar.cc/150?u=elena" },
  { id: "mock-5", name: "Arjun Gupta", targetRole: "Lead Frontend Engineer", status: "offer", experience: "9 Years", score: 89, location: "Bangalore, IN", tags: ["TailwindCSS", "AWS", "ECommerce"], avatar: "https://i.pravatar.cc/150?u=arjun" },
  { id: "mock-6", name: "Sophie Mueller", targetRole: "React Developer", status: "screening", experience: "2 Years", score: 91, location: "London, UK", tags: ["TypeScript", "Zustand"], avatar: "https://i.pravatar.cc/150?u=sophie" },
];
