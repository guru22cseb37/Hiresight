"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Send, Mail, Linkedin, Sparkles, 
  Copy, Loader2, MessageSquare, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function OutreachPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    tone: "Professional"
  });

  const handleGenerate = async () => {
    if (!formData.company || !formData.role) {
      toast.error("Company and Role are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || "Generation failed.");
      }
      
      setResults(data);
      toast.success("Outreach messages drafted!");
    } catch (err: any) {
      toast.error(err.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
          <Send className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white italic tracking-tighter uppercase">Networking Pulse</h1>
          <p className="text-slate-400 mt-1">Generate hyper-personalized DMs and emails that get responses.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <Card className="glass border-white/5 p-8 space-y-6 h-fit">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Target Name</Label>
                  <Input 
                    placeholder="e.g. Sarah Jones" 
                    className="glass border-white/10"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Target Company</Label>
                  <Input 
                    placeholder="e.g. Stripe" 
                    className="glass border-white/10"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Target Role</Label>
              <Input 
                placeholder="e.g. Senior Frontend Engineer" 
                className="glass border-white/10"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tone & Style</Label>
              <div className="flex gap-2">
                {["Professional", "Casual", "Bold", "Short"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFormData({...formData, tone: t})}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-xl border transition-all ${
                      formData.tone === t 
                      ? "bg-blue-600/20 border-blue-500/50 text-blue-400" 
                      : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white gap-3 text-lg font-black italic shadow-xl shadow-blue-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "GENERATING..." : "GENERATE PULSE"}
          </Button>
        </Card>

        <div className="space-y-6">
          {results ? (
            <>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="glass border-white/5 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Mail className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Email Draft</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(results.email.body)} className="h-8 text-[9px] font-bold text-slate-500 hover:text-white">
                       <Copy className="w-3 h-3 mr-1" /> COPY
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[11px] font-bold text-white">
                       Subject: {results.email.subject}
                    </div>
                    <div className="p-4 bg-slate-950/50 rounded-xl border border-white/5 text-xs leading-relaxed text-slate-400 whitespace-pre-wrap min-h-[150px]">
                      {results.email.body}
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass border-[#0077B5]/20 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#0077B5]">
                      <Linkedin className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn / DM Draft</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(results.linkedin)} className="h-8 text-[9px] font-bold text-slate-500 hover:text-white">
                       <Copy className="w-3 h-3 mr-1" /> COPY
                    </Button>
                  </div>
                  <div className="p-4 bg-[#0077B5]/5 rounded-xl border border-[#0077B5]/10 text-xs leading-relaxed text-slate-300 italic">
                    "{results.linkedin}"
                  </div>
                </Card>
              </motion.div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01] p-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-800 mb-4" />
              <h3 className="text-white font-bold italic uppercase tracking-tighter">Ready for Outreach</h3>
              <p className="text-slate-600 text-[11px] mt-2 max-w-[200px] font-medium leading-relaxed">
                Enter target details to generate elite-tier networking messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
