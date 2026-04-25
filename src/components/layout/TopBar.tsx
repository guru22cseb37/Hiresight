"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface TopBarProps {
  name?: string | null;
  email?: string | null;
  role?: "job_seeker" | "recruiter";
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "U";
}

export function TopBar({ name, email, role }: TopBarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const initials = getInitials(name, email);
  const accentColor = role === "recruiter" ? "bg-violet-600" : "bg-blue-600";
  const ringColor = role === "recruiter" ? "ring-violet-500/40" : "ring-blue-500/40";

  return (
    <div className="fixed top-4 right-4 z-[55] md:right-6 md:top-5" ref={ref}>
      <button
        id="profile-avatar-btn"
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-2xl
          bg-slate-900/80 backdrop-blur-xl border border-white/10
          hover:border-white/20 transition-all group
          shadow-lg hover:shadow-xl
        `}
      >
        <div className={`
          w-8 h-8 rounded-xl ${accentColor} ring-2 ${ringColor}
          flex items-center justify-center text-white text-xs font-black
          group-hover:scale-105 transition-transform
        `}>
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-white text-xs font-bold leading-none truncate max-w-[120px]">
            {name || email?.split("@")[0] || "Profile"}
          </p>
          <p className="text-slate-500 text-[10px] mt-0.5 truncate max-w-[120px]">
            {role === "recruiter" ? "Recruiter" : "Job Seeker"}
          </p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="profile-dropdown"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-72 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Profile Header */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className={`
                  w-14 h-14 rounded-2xl ${accentColor} ring-2 ${ringColor}
                  flex items-center justify-center text-white text-xl font-black flex-shrink-0
                `}>
                  {initials}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-white font-bold text-sm truncate">
                    {name || "Your Profile"}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{email || ""}</p>
                  <div className={`
                    mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md
                    ${role === "recruiter" ? "bg-violet-500/10 text-violet-400" : "bg-blue-500/10 text-blue-400"}
                    text-[9px] font-black uppercase tracking-widest
                  `}>
                    <User className="w-2.5 h-2.5" />
                    {role === "recruiter" ? "Recruiter" : "Job Seeker"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                id="profile-logout-btn"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium group"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
