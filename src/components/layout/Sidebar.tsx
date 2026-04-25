"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileSearch, ClipboardList, Briefcase, 
  FileCode2, Mic, Linkedin, Settings, LogOut, Menu, X,
  PlusCircle, Users, BarChart3, Send, SearchCode, Globe, Zap, Rocket
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";

import { motion, AnimatePresence } from "framer-motion";
import { supabase, Role } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface SidebarProps {
  role: Role;
}

type NavLink = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const seekerLinks: NavLink[] = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Matchmaker", href: "/dashboard/discovery", icon: Zap, badge: "HOT" },
    { name: "Analyze", href: "/dashboard/analyze", icon: FileSearch },
    { name: "Tracker", href: "/dashboard/applications", icon: ClipboardList },
    { name: "Market Intel", href: "/dashboard/market", icon: Globe, badge: "LIVE" },
    { name: "Company Check", href: "/dashboard/company", icon: SearchCode, badge: "NEW" },
    { name: "Job Board", href: "/dashboard/jobs", icon: Briefcase, badge: "LIVE" },
    { name: "Networking Pulse", href: "/dashboard/outreach", icon: Send, badge: "AI" },
    { name: "Mission Roadmaps", href: "/dashboard/roadmaps", icon: Rocket, badge: "AI" },
    { name: "Skill Gap Radar", href: "/dashboard/skills", icon: BarChart3 },
    { name: "Negotiator", href: "/dashboard/negotiator", icon: Users },
    { name: "Resumes", href: "/dashboard/resumes", icon: FileCode2 },
    { name: "LaTeX Builder", href: "/dashboard/resumes/builder", icon: FileCode2, badge: "PRO" },
    { name: "Mock Interview", href: "/dashboard/mock-interview", icon: Mic },
    { name: "LinkedIn", href: "/dashboard/linkedin", icon: Linkedin },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const recruiterLinks: NavLink[] = [
    { name: "Overview", href: "/recruiter", icon: LayoutDashboard },
    { name: "Candidates", href: "/recruiter/candidates", icon: Users, badge: "CRM" },
    { name: "Job Postings", href: "/recruiter/jobs", icon: Briefcase },
    { name: "New Job", href: "/recruiter/jobs/new", icon: PlusCircle },
    { name: "Matchmaker", href: "/recruiter/discovery", icon: Zap, badge: "HOT" },
    { name: "Interview Intelligence", href: "/recruiter/interviews", icon: Mic, badge: "AI" },
    { name: "Sourcing HUD", href: "/recruiter/sourcing", icon: SearchCode, badge: "PRO" },
    { name: "Rapid Screen", href: "/recruiter/rapid-screen", icon: Users, badge: "FAST" },
    { name: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
    { name: "Outreach", href: "/recruiter/outreach", icon: Send },
    { name: "Brand Builder", href: "/recruiter/brand", icon: Linkedin },
    { name: "Settings", href: "/recruiter/settings", icon: Settings },
  ];

  const links = role === "recruiter" ? recruiterLinks : seekerLinks;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button 
        variant="ghost" 
        className="md:hidden fixed top-4 right-4 z-[60] bg-slate-900/50 backdrop-blur-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </Button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed left-0 top-0 bottom-0 z-50 w-64 bg-slate-950/50 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <Logo variant="icon" size={40} />
          <div>
            <span className="text-lg font-bold text-white tracking-widest block uppercase leading-none">HireSight</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 block">
              {role === "recruiter" ? "Recruiter Suite" : "Intelligence Platform"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl transition-all group relative overflow-hidden
                  ${isActive ? "bg-blue-600/10 text-blue-400" : "text-slate-400 hover:bg-white/5 hover:text-white"}
                `}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <link.icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400"} transition-colors`} />
                  <span className="text-sm font-medium">{link.name}</span>
                </div>
                {link.badge && (
                  <span className="relative z-10 px-1.5 py-0.5 rounded-md bg-violet-600 text-[8px] font-bold text-white">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
