"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px] animate-pulse" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10 px-6 max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6"
        >
          <Sparkles className="w-3 h-3" />
          <span>The World's Smartest Hiring Intelligence</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Where Talent Meets <span className="text-blue-500">Opportunity</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          HireSight helps job seekers land interviews 3x faster and helps recruiters find the perfect hire in half the time. Powered by advanced AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth?role=job_seeker" className="w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl gap-2 text-lg shadow-xl shadow-blue-500/20 w-full">
                Analyze My Resume Free <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </Link>
          <Link href="/auth?role=recruiter" className="w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-xl gap-2 text-lg glass border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5 w-full">
                <Building2 className="w-5 h-5 text-violet-400" />
                Start Screening Free
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Hero Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-20 flex flex-wrap justify-center gap-12 md:gap-24 px-6"
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-white">10k+</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Job Seekers</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white">500+</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Companies</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white">85%</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Interview Rate</div>
        </div>
      </motion.div>
    </section>
  );
}
