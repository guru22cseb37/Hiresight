"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Supabase handles the code exchange automatically if correctly configured,
      // but we use this page to ensure the session is established and redirect.
      const { data, error } = await supabase.auth.getSession();
      
      if (data?.session) {
        // Check if user has a profile or needs onboarding
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.session.user.id)
          .single();

        if (profile?.role) {
          router.push(profile.role === "recruiter" ? "/recruiter" : "/dashboard");
        } else {
          router.push("/onboarding");
        }
      } else {
        router.push("/auth");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-[10px]">H</div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-white italic">Securing Session...</h2>
        <p className="text-slate-500 text-sm mt-1">Establishing your encrypted intelligence workspace.</p>
      </div>
    </div>
  );
}
