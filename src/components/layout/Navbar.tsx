"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-bold text-white">
          H
        </div>
        <span className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors">
          HireSight
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
          Features
        </Link>
        <Link href="#recruiter" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
          For Recruiters
        </Link>
        <Link href="#testimonials" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
          Testimonials
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/auth">
          <Button variant="ghost" className="text-slate-300 hover:text-white">
            Log in
          </Button>
        </Link>
        <Link href="/auth?signup=true">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white border-none transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
            Get Started
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
}
