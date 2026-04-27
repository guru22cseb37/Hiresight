"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Chrome, Mail, Lock, ArrowLeft, Loader2, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { supabase, Role } from "@/lib/supabase";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2 } from "lucide-react";
import RobotScene from "@/components/auth/RobotScene";

// Inner component that uses useSearchParams - must be wrapped in Suspense
function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("signup") === "true");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("job_seeker");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showErrorImage, setShowErrorImage] = useState(false);

  useEffect(() => {
    if (showErrorImage) {
      const timer = setTimeout(() => setShowErrorImage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorImage]);

  useEffect(() => {
    const clearBrokenSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          // If there's an error (like Refresh Token Not Found), 
          // sign out to clear the corrupted local storage.
          await supabase.auth.signOut();
        }
      } catch (e) {
        await supabase.auth.signOut();
      }
    };
    clearBrokenSession();
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/update-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent to your email!");
        setIsForgotPassword(false);
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { 
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { role, full_name: fullName }
          }
        });
        if (error) throw error;
        toast.success("Account created successfully!");
        router.push("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setIsLoggedIn(true);
        setTimeout(() => {
          router.push("/onboarding");
        }, 2000); // Allow time for robot welcome
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
      setShowErrorImage(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      setShowErrorImage(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Cinematic Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/auth-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) contrast(1.1)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-blue-900/20 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-0" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <AnimatePresence>
        {showErrorImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              className="relative max-w-lg w-full glass border-red-500/50 overflow-hidden rounded-[40px] shadow-[0_0_50px_rgba(239,68,68,0.3)]"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              <div className="p-8 text-center space-y-6">
                <div className="inline-flex w-16 h-16 rounded-full bg-red-500/20 items-center justify-center mb-2">
                   <Lock className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Access Denied.</h2>
                   <p className="text-slate-400 text-sm mt-2">Security protocols engaged. Incorrect credentials detected.</p>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video group">
                   <img 
                     src="/images/WhatsApp Image 2026-04-28 at 1.47.43 AM.jpeg" 
                     alt="Security Alert" 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <Button 
                  onClick={() => setShowErrorImage(false)}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold tracking-widest uppercase h-12"
                >
                  Acknowledge
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-5xl z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
      >
        <div className="w-full md:w-[450px] lg:w-[500px]">
          <RobotScene isPasswordFocused={isPasswordFocused} isLoggedIn={isLoggedIn} />
        </div>
        <div className="w-full max-w-md">
          <Card className="glass border-white/5 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center font-bold text-white mb-4">H</div>
            <h1 className="text-2xl font-bold text-white italic">
              {isForgotPassword ? "Reset Password" : (isSignUp ? "Join HireSight" : "Welcome Back")}
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              {isForgotPassword 
                ? "Enter your email to receive a recovery link." 
                : (isSignUp ? "Start your journey to a better career today." : "Log in to access your intelligence dashboard.")}
            </p>
          </div>

          <div className="space-y-4">
            {!isForgotPassword && (
              <>
                <Button 
                  variant="outline" 
                  className="w-full h-12 glass border-white/10 text-white gap-3 hover:bg-white/5 active:scale-95 transition-all"
                  onClick={handleGoogleAuth}
                >
                  <Chrome className="w-5 h-5" />
                  Continue with Google
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-slate-500">Or email</span></div>
                </div>
              </>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && !isForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input 
                      id="fullName" 
                      type="text" 
                      placeholder="John Doe" 
                      className="pl-10 h-12 glass border-white/10"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 h-12 glass border-white/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {!isForgotPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-300">Password</Label>
                    <button 
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-12 glass border-white/10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      required={!isForgotPassword}
                    />
                  </div>
                </div>
              )}

              {isSignUp && !isForgotPassword && (
                <div className="space-y-3 pt-2">
                  <Label className="text-slate-300">I am a...</Label>
                  <Tabs 
                    value={role} 
                    onValueChange={(v) => setRole(v as Role)} 
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 h-12 bg-white/5 border border-white/10 p-1">
                      <TabsTrigger 
                        value="job_seeker" 
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white gap-2 transition-all"
                      >
                        <User className="w-4 h-4" />
                        Job Seeker
                      </TabsTrigger>
                      <TabsTrigger 
                        value="recruiter" 
                        className="data-[state=active]:bg-violet-600 data-[state=active]:text-white gap-2 transition-all"
                      >
                        <Building2 className="w-4 h-4" />
                        Recruiter
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white mt-4"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isForgotPassword ? "Send Recovery Link" : (isSignUp ? "Sign Up" : "Log In"))}
              </Button>

              {isForgotPassword && (
                <button 
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Back to Log In
                </button>
              )}
            </form>
          </div>

          {!isForgotPassword && (
            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
              </button>
            </div>
          )}
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

// Outer page component wraps AuthForm in Suspense to satisfy Next.js prerender requirements
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
