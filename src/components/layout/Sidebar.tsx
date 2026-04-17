"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileSearch, ClipboardList, Briefcase, 
  FileCode2, Mic, Linkedin, Settings, LogOut, Menu, X,
  PlusCircle, Users, BarChart3, Send, SearchCode
} from "lucide-react";
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
    { name: "Analyze", href: "/dashboard/analyze", icon: FileSearch },
    { name: "Tracker", href: "/dashboard/applications", icon: ClipboardList },
    { name: "Resumes", href: "/dashboard/resumes", icon: Briefcase },
    { name: "LaTeX Builder", href: "/dashboard/resumes/latex", icon: FileCode2, badge: "NEW" },
    { name: "Mock Interview", href: "/dashboard/mock-interview", icon: Mic },
    { name: "LinkedIn", href: "/dashboard/linkedin", icon: Linkedin },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const recruiterLinks: NavLink[] = [
    { name: "Overview", href: "/recruiter", icon: LayoutDashboard },
    { name: "Job Postings", href: "/recruiter/jobs", icon: SearchCode },
    { name: "New Job", href: "/recruiter/jobs/new", icon: PlusCircle },
    { name: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
    { name: "Candidates", href: "/recruiter/candidates", icon: Users },
    { name: "Outreach", href: "/recruiter/outreach", icon: Send },
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            H
          </div>
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
