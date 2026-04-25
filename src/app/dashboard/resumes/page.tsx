"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, FileText, MoreVertical, Star, 
  Trash2, Download, Upload, ShieldCheck, FileSearch,
  Loader2, CheckCircle2, AlertCircle, CloudUpload
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
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Resume {
  id: string;
  name: string;
  updatedAt: string;
  score: number | null;
  isDefault: boolean;
  fileUrl: string | null;
  isReal?: boolean;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResumes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const mapped: Resume[] = (data || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        updatedAt: new Date(r.updated_at).toLocaleDateString(),
        score: r.ats_health_score,
        isDefault: r.is_default,
        fileUrl: r.file_url,
        isReal: true,
      }));

      setResumes(mapped);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Max 10MB.");
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileName = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file, { contentType: "application/pdf", upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(fileName);
      const fileUrl = urlData.publicUrl;

      // Insert record into resumes table
      const { error: insertError } = await supabase.from("resumes").insert({
        user_id: user.id,
        name: file.name.replace(".pdf", ""),
        file_url: fileUrl,
        is_default: resumes.length === 0, // First upload becomes default
      });

      if (insertError) throw insertError;

      toast.success("Resume uploaded successfully!");
      await fetchResumes();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, fileUrl: string | null) => {
    try {
      if (fileUrl) {
        // Extract storage path from URL
        const urlParts = fileUrl.split("/storage/v1/object/public/resumes/");
        if (urlParts[1]) {
          await supabase.storage.from("resumes").remove([urlParts[1]]);
        }
      }
      const { error } = await supabase.from("resumes").delete().eq("id", id);
      if (error) throw error;
      toast.success("Resume deleted.");
      await fetchResumes();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Clear all defaults first
      await supabase.from("resumes").update({ is_default: false }).eq("user_id", user.id);
      // Set new default
      await supabase.from("resumes").update({ is_default: true }).eq("id", id);
      toast.success("Default resume updated.");
      await fetchResumes();
    } catch (err: any) {
      toast.error("Failed to set default.");
    }
  };

  return (
    <div className="space-y-10">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white italic">Resume Vault</h1>
          <p className="text-slate-400 mt-1">Upload and manage your professional resumes.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="w-full glass border-white/10 gap-2 h-11 md:h-10 hover:bg-white/10 transition-all"
            onClick={handleUploadClick}
            disabled={uploading}
            id="upload-resume-btn"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CloudUpload className="w-4 h-4" />
            )}
            {uploading ? "Uploading..." : "Upload PDF"}
          </Button>
          <Link href="/dashboard/resumes/builder" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white gap-2 shadow-lg shadow-blue-500/20 h-11 md:h-10">
              <Plus className="w-5 h-5" />
              Build with AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Upload CTA Banner — shown when vault is empty */}
      {!loading && resumes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 border-dashed border-blue-500/20 bg-blue-500/[0.03] p-12 text-center cursor-pointer hover:border-blue-500/40 transition-all group"
          onClick={handleUploadClick}
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <CloudUpload className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Your vault is empty</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Upload your first resume PDF to get started. We'll store it securely and track your versions.
          </p>
          <Button className="mt-6 bg-blue-600 hover:bg-blue-500 text-white gap-2">
            <Upload className="w-4 h-4" />
            Upload Your Resume
          </Button>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard 
              key={resume.id} 
              resume={resume} 
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}

          {/* Create New Version Token */}
          <Link href="/dashboard/resumes/builder" className="h-[280px]">
            <motion.button 
              whileHover={{ scale: 0.98 }}
              className="w-full h-full rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center gap-4 text-slate-600 hover:text-blue-400 hover:border-blue-500/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 transition-transform group-hover:scale-110">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">Build with AI</span>
            </motion.button>
          </Link>
        </div>
      )}

      {/* AI Tips Section */}
      <Card className="glass border-white/5 p-8 bg-blue-500/5">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Vault Integrity Tip</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Candidates with specific resume variants for different industries see 40% higher callback rates. Use our <strong>AI Resume Tailor</strong> in the Analyze tab to generate role-specific versions instantly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ResumeCard({ resume, onDelete, onSetDefault }: { 
  resume: Resume; 
  onDelete: (id: string, fileUrl: string | null) => void;
  onSetDefault: (id: string) => void;
}) {
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
              {!resume.isDefault && (
                <DropdownMenuItem className="text-xs" onClick={() => onSetDefault(resume.id)}>
                  Set as Default
                </DropdownMenuItem>
              )}
              {resume.fileUrl && (
                <DropdownMenuItem className="text-xs" onClick={() => window.open(resume.fileUrl!, "_blank")}>
                  <Download className="w-3 h-3 mr-2" />
                  Download PDF
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="text-xs text-red-400 focus:text-red-400"
                onClick={() => onDelete(resume.id, resume.fileUrl)}
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">{resume.name}</h3>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Updated {resume.updatedAt}</p>
        
        {resume.score != null && (
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
        )}
      </div>

      <div className="flex gap-2">
        {resume.fileUrl && (
          <Button 
            size="sm" variant="ghost" 
            className="flex-1 text-xs gap-2 glass border-white/5 hover:bg-white/10"
            onClick={() => window.open(resume.fileUrl!, "_blank")}
          >
            <Download className="w-3 h-3" />
            View PDF
          </Button>
        )}
        <Link href="/dashboard/analyze" className="flex-1">
          <Button size="sm" variant="ghost" className="w-full text-xs gap-2 glass border-white/5 hover:bg-white/10">
            <FileSearch className="w-3 h-3" />
            Analyze
          </Button>
        </Link>
      </div>
    </Card>
  );
}
