"use client";

import { motion } from "framer-motion";
import { 
  FileSearch, PenTool, Mail, Layers, Mic, 
  Users, ClipboardList, Target, UserCheck, MessageSquare,
  Sparkles
} from "lucide-react";

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  delay?: number;
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.5)" }}
      className="p-6 rounded-2xl glass border-white/5 bg-white/[0.02] flex flex-col gap-4 group"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

export function FeatureSects() {
  const seekerFeatures = [
    { icon: FileSearch, title: "ATS Score Analyzer", description: "Know exactly why you're getting rejected. Our AI reverse-engineers recruiter filters." },
    { icon: PenTool, title: "AI Resume Tailor", description: "Your resume, rewritten for every single job automatically to hit peak matching score." },
    { icon: Mail, title: "Cover Letter Generator", description: "Professional, non-robotic letters that connect with hiring managers in 10 seconds." },
    { icon: Layers, title: "Bulk Analysis", description: "Analyze 10 job descriptions at once. Save hours of manual copy-pasting." },
    { icon: Mic, title: "Mock Interview Coach", description: "Practice with our AI interviewer and get real-time STAR-format feedback." },
  ];

  const recruiterFeatures = [
    { icon: Users, title: "AI Candidate Screener", description: "Screen 100+ resumes in 2 minutes. AI ranks candidates by objective match score." },
    { icon: Sparkles, title: "JD Optimizer", description: "Write job descriptions that attract top talent while removing biased language." },
    { icon: ClipboardList, title: "Pipeline Manager", description: "A visual Kanban flow that ensures you never lose track of a top candidate." },
    { icon: Target, title: "Candidate Scoring", description: "Objective AI ranking helps you focus on the top 1% of talent immediately." },
    { icon: MessageSquare, title: "Outreach Generator", description: "Generate personalized emails to candidates that actually get responses." },
  ];

  return (
    <div className="space-y-32 py-24" id="features">
      {/* Job Seekers Section */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-blue-500 font-bold tracking-widest text-xs uppercase mb-4">Job Seekers</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 italic">Land Your Dream Job Faster</h2>
          <p className="text-slate-400 max-w-2xl">Stop sending resumes into the void. Use the same technology recruiters use to ensure you stay at the top of the pile.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {seekerFeatures.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* Recruiters Section */}
      <section className="px-6 max-w-7xl mx-auto" id="recruiter">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-violet-500 font-bold tracking-widest text-xs uppercase mb-4">Recruiters</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 italic text-glow-violet">Hire the Best in Record Time</h2>
          <p className="text-slate-400 max-w-2xl">Remove the guesswork from hiring. Our AI screening does the heavy lifting so you can focus on building your team.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {recruiterFeatures.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.1} />
          ))}
        </div>
      </section>
    </div>
  );
}
