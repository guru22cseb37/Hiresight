"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile?.role) {
        router.push("/onboarding");
      } else if (profile.role !== "job_seeker") {
        router.push("/recruiter");
      } else {
        setLoading(false);
      }
    }
    checkRole();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar role="job_seeker" />
      <main className="flex-1 md:ml-64 overflow-y-auto overflow-x-hidden relative h-full">
        {/* Background Subtle Blobs */}
        <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px] -z-10 pointer-events-none" />
        <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-[128px] -z-10 pointer-events-none" />
        
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
