"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, MessageSquare, Copy, RefreshCw, 
  User, Sparkles, Wand2, Mail, Linkedin,
  ChevronRight, Target, Zap, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function OutreachPage() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any>(null);
  const [tone, setTone] = useState("Professional");

  const handleGenerate = () => {
    setLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      setMessages(MOCK_OUTREACH_MSGS);
      setLoading(false);
      toast.success("Outreach messages generated!");
    }, 1500);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-400">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white italic">Outreach Generator</h1>
            <p className="text-slate-400 mt-1">Convert top candidates with personalized, high-response messages.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Input Card */}
        <Card className="glass border-white/5 p-8 space-y-8 h-fit">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate Info / Profile Bio</Label>
              <textarea
                placeholder="Paste candidate's LinkedIn bio or summary here..."
                className="w-full h-48 bg-slate-950/50 border border-white/5 rounded-2xl p-6 text-slate-300 text-sm leading-relaxed focus:outline-none focus:border-violet-500/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Role</Label>
                <Input placeholder="e.g. Senior Frontend Lead" className="glass border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Message Tone</Label>
                <div className="flex gap-2">
                   {["Professional", "Casual", "Direct"].map(t => (
                     <button 
                       key={t}
                       onClick={() => setTone(t)}
                       className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                         tone === t ? "bg-violet-600 border-violet-500 text-white" : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                       }`}
                     >
                       {t}
                     </button>
                   ))}
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="w-full h-14 bg-violet-600 hover:bg-violet-500 text-white gap-2 text-lg shadow-xl shadow-violet-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 shadow-violet-500/50 shadow-sm" />}
            Generate Outreach Pack
          </Button>
        </Card>

        {/* Output Panel */}
        <div className="space-y-6 h-full">
          {!base64ToBlob && !messages && !loading ? (
             <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] p-12 text-center">
                <Mail className="w-12 h-12 text-slate-800 mb-4" />
                <h4 className="text-white font-bold opacity-20">No Messages Yet</h4>
                <p className="text-slate-600 text-xs mt-2">Fill in the candidate details to generate high-conversion templates.</p>
             </div>
          ) : loading ? (
             <div className="h-full flex flex-col items-center justify-center gap-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <p className="text-white font-bold italic animate-pulse">Personalizing for the candidate...</p>
             </div>
          ) : (
            <AnimatePresence>
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {(messages || []).map((m: any, i: number) => (
                    <OutreachTemplate key={i} {...m} />
                  ))}
               </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function OutreachTemplate({ platform, title, content }: any) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Message copied!");
  };

  return (
    <Card className="glass border-white/5 overflow-hidden group">
      <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {platform === "LinkedIn" ? <Linkedin className="w-4 h-4 text-blue-400" /> : <Mail className="w-4 h-4 text-violet-400" />}
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{platform} Outreach</span>
        </div>
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{title}</span>
      </div>
      <div className="p-6">
        <p className="text-sm text-slate-400 leading-relaxed italic">"{content}"</p>
        <div className="mt-6 flex items-center justify-between">
           <div className="flex gap-2">
             <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                <Target className="w-3 h-3" />
                82% Match
             </div>
           </div>
           <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleCopy}
            className="h-8 text-[10px] gap-2 glass border-white/5 hover:bg-white/10"
           >
             {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
             Copy Message
           </Button>
        </div>
      </div>
    </Card>
  );
}

const MOCK_OUTREACH_MSGS = [
  { platform: "LinkedIn", title: "Direct Connection", content: "Hi Alex, I was just reviewing your profile and was incredibly impressed by the work you did at TechCorp with React performance optimization. We're building something similar here at HireSight and would love to chat briefly about your background. Any interest in a 15 min sync this week?" },
  { platform: "Email", title: "Personalized Invite", content: "Subject: React Performance Expert - New Opportunity at HireSight\n\nHi Alex,\n\nI came across your work on high-throughput frontend systems while looking into technical leaders in the Bay Area. Your experience with Next.js and Micro-frontends is exactly what our team is looking for right now.\n\nWe're currently scaling our intelligence engine and I'd love to share some of the technical challenges we're solving. Do you have time for a quick call on Thursday?" }
];

function base64ToBlob() { return null; }
function CheckCircle2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}
