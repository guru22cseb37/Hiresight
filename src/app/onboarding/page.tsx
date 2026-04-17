"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Check, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase, Role } from "@/lib/supabase";
import { toast } from "sonner";

export const dynamic = 'force-dynamic';

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkExistingRole() {
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

      if (profile?.role) {
        router.push(profile.role === "recruiter" ? "/recruiter" : "/dashboard");
      }
      setChecking(false);
    }
    checkExistingRole();
  }, [router]);

  const handleComplete = async () => {
    if (!selectedRole) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("users")
        .upsert({ 
          id: user.id, 
          email: user.email,
          role: selectedRole,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success(`Welcome to HireSight, ${selectedRole.replace("_", " ")}!`);
      router.push(selectedRole === "recruiter" ? "/recruiter" : "/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[128px]" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl text-center z-10"
      >
        <h1 className="text-4xl font-extrabold text-white mb-4 italic">Tailor Your Experience</h1>
        <p className="text-slate-400 mb-12">Choose how you want to use the HireSight intelligence platform.</p>

        <div className="grid sm:grid-cols-2 gap-6">
          <RoleCard 
            title="I'm a Job Seeker"
            description="I want to analyze resumes, track applications, and practice interviews."
            icon={User}
            selected={selectedRole === "job_seeker"}
            onClick={() => setSelectedRole("job_seeker")}
            color="blue"
          />
          <RoleCard 
            title="I'm a Recruiter"
            description="I want to screen candidates, optimize JDs, and manage my hiring pipeline."
            icon={Building2}
            selected={selectedRole === "recruiter"}
            onClick={() => setSelectedRole("recruiter")}
            color="violet"
          />
        </div>

        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedRole ? 1 : 0 }}
        >
          <Button 
            size="lg" 
            onClick={handleComplete}
            className={`h-14 px-10 gap-2 transition-all shadow-xl ${
              selectedRole === "recruiter" ? "bg-violet-600 hover:bg-violet-500 shadow-violet-500/20" : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
            }`}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Continue to Dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function RoleCard({ title, description, icon: Icon, selected, onClick, color }: any) {
  const activeColor = color === "blue" ? "border-blue-500 bg-blue-500/5" : "border-violet-500 bg-violet-500/5";
  
  return (
    <Card 
      onClick={onClick}
      className={`relative p-8 cursor-pointer glass transition-all duration-300 group border-2 ${
        selected ? activeColor : "border-white/5 hover:border-white/10"
      }`}
    >
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
              color === "blue" ? "bg-blue-500" : "bg-violet-500"
            }`}
          >
            <Check className="w-4 h-4 text-white font-bold" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
        color === "blue" ? "bg-blue-500/10 text-blue-400" : "bg-violet-500/10 text-violet-400"
      }`}>
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </Card>
  );
}
