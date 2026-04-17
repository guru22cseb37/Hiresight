"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, CheckCircle2, AlertCircle } from "lucide-react";

export function DemoWidget() {
  const [jd, setJd] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnalyze = () => {
    if (!jd.trim()) return;
    setIsAnalyzing(true);
    setShowResults(false);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      setScore(84); // Hardcoded for demo
    }, 2000);
  };

  return (
    <section className="py-24 px-6 relative max-w-6xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Try HireSight in Seconds</h2>
        <p className="text-slate-400">Paste a job description below to see how our AI evaluates candidacy.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Input Card */}
        <Card className="glass p-6 border-white/10">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste any job description from LinkedIn, Indeed, etc..."
            className="w-full h-64 bg-slate-900/50 border border-white/5 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors resize-none mb-4"
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !jd}
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run HireSight Analysis
              </>
            )}
          </Button>
        </Card>

        {/* Results Card */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {!showResults && !isAnalyzing && (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]"
              >
                <Search className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-500 text-sm">Results will appear here</p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                  <motion.div 
                    className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="text-center font-medium text-slate-300">
                  <motion.p
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Parsing Job Description...
                  </motion.p>
                  <p className="text-xs text-slate-500 mt-2">Checking keywords vs industry standards</p>
                </div>
              </motion.div>
            )}

            {showResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <Card className="glass p-8 border-blue-500/20 shadow-2xl shadow-blue-500/10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white">ATS Analysis</h3>
                      <p className="text-sm text-slate-400">Mock Results based on generic profile</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold">
                      STRONG MATCH
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    <ScoreRing score={score} />
                    
                    <div className="w-full space-y-4 mt-12">
                      <MetricRow label="Keyword Density" value="92%" color="bg-green-500" />
                      <MetricRow label="Role Alignment" value="88%" color="bg-blue-500" />
                      <MetricRow label="Formatting Score" value="75%" color="bg-amber-500" />
                    </div>
                  </div>

                  <p className="text-xs text-center text-slate-500 mt-8 italic">
                    "This candidate shows strong leadership experience and technical proficiency in React/Node.js."
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-48 h-48 transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx="96"
          cy="96"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl font-extrabold text-white"
        >
          {score}
        </motion.span>
        <span className="text-slate-500 text-sm font-medium">/ 100</span>
      </div>
    </div>
  );
}

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: value }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}
