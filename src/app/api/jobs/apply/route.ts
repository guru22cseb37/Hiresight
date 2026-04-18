import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { jobId, jobTitle, company, recruiterId, seekerProfile } = await req.json();

    // 1. Get current user
    let { data: { user } } = await supabase.auth.getUser();
    
    // For demo/dev purposes, if no user, we'll use a mock one
    if (!user) {
      user = { id: "00000000-0000-0000-0000-000000000000", email: "demo@hiresight.ai" } as any;
    }

    // 2. Insert into candidates table
    // We'll map the seeker's profile to the candidate record
    const { data, error } = await supabase
      .from("candidates")
      .insert({
        name: seekerProfile?.name || user?.email?.split('@')[0] || "Anonymous Candidate",
        role: jobTitle,
        company: company,
        ai_score: Math.floor(Math.random() * 30) + 70, // Simulated AI scoring
        stage: "new",
        experience: seekerProfile?.experience || "Not specified",
        location: seekerProfile?.location || "Remote",
        strengths: seekerProfile?.skills || [],
        recruiter_id: recruiterId || user?.id, // Fallback to current user for demo
        job_id: jobId
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, candidate: data[0] });
  } catch (error: any) {
    console.error("Apply Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
