import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { jobId, jobTitle, company, recruiterId, seekerProfile, resumeUrl } = await req.json();

    // 1. Get current user from the anon client
    let { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      user = { id: "00000000-0000-0000-0000-000000000000", email: "demo@hiresight.ai" } as any;
    }

    const supabaseAdmin = supabase;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(jobId);

    // 2. Insert into candidates table with valid schema columns
    const { data, error } = await supabaseAdmin
      .from("candidates")
      .insert({
        name: seekerProfile?.name || user?.email?.split('@')[0] || "Anonymous Candidate",
        email: user?.email,
        ai_score: Math.floor(Math.random() * 30) + 70, // Simulated AI scoring
        stage: "new",
        strengths: seekerProfile?.skills || [],
        recruiter_id: recruiterId || user?.id, // Default to user if no recruiter (e.g. mock jobs)
        job_id: isUuid ? jobId : null,
        notes: `Applied for ${jobTitle} at ${company}. Experience: ${seekerProfile?.experience || "Not specified"}. Location: ${seekerProfile?.location || "Remote"}.`,
        resume_url: resumeUrl || null
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, candidate: data[0] });
  } catch (error: any) {
    console.error("Apply Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
