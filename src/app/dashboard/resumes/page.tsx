"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, FileText, MoreVertical, Star, 
  Trash2, Copy, Download, History,
  Upload, ShieldCheck, Wand2, FileSearch
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ResumesPage() {
  const [resumes, setResumes] = useState(MOCK_RESUMES);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white italic">Resume Vault</h1>
          <p className="text-slate-400 mt-1">Manage and version-control your professional profiles.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/analyze">
            <Button variant="outline" className="glass border-white/10 gap-2">
              <Upload className="w-4 h-4" />
              Upload PDF
            </Button>
          </Link>
          <Link href="/dashboard/resumes/builder">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2 shadow-lg shadow-blue-500/20">
              <Plus className="w-5 h-5" />
              Build with AI
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
        
        {/* Create Token */}
        <Link href="/dashboard/resumes/builder" className="h-[280px]">
          <motion.button 
            whileHover={{ scale: 0.98 }}
            className="w-full h-full rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center gap-4 text-slate-600 hover:text-blue-400 hover:border-blue-500/20 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 transition-transform group-hover:scale-110">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Create New Version</span>
          </motion.button>
        </Link>
      </div>

      {/* AI Tips Section */}
      <Card className="glass border-white/5 p-8 bg-blue-500/5">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Vault Integrity Tip</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Candidates with specific resume variants for different industries see 40% higher callback rates. Use our **AI Resume Tailor** in the Analyze tab to generate role-specific versions instantly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ResumeCard({ resume }: any) {
  return (
    <Card className="glass border-white/5 p-6 space-y-6 group hover:border-white/10 transition-all flex flex-col h-[280px]">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          {resume.isDefault && (
            <Badge className="bg-blue-600/10 text-blue-400 border-blue-500/20 text-[9px] font-bold h-5 px-2">DEFAULT</Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-slate-600 hover:text-white")}>
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-950 border-white/10">
              <DropdownMenuItem className="text-xs">Edit Content</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Set as Default</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-xs text-red-400">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{resume.name}</h3>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Modified {resume.updatedAt}</p>
        
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span className="uppercase tracking-widest">ATS Health</span>
            <span>{resume.score}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${resume.score}%` }}
              className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="ghost" className="flex-1 text-xs gap-2 glass border-white/5 hover:bg-white/10">
          <FileSearch className="w-3 h-3" />
          Analyze
        </Button>
        <Button size="sm" variant="ghost" className="flex-1 text-xs gap-2 glass border-white/5 hover:bg-white/10">
          <Download className="w-3 h-3" />
          PDF
        </Button>
      </div>
    </Card>
  );
}

const MOCK_RESUMES = [
  { id: "1", name: "Fullstack Engineer v2", updatedAt: "2h ago", score: 92, isDefault: true },
  { id: "2", name: "Frontend Lead Variant", updatedAt: "1d ago", score: 87, isDefault: false },
  { id: "3", name: "Product Engineering", updatedAt: "5d ago", score: 79, isDefault: false },
];
