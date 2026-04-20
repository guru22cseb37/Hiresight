import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { name, company, role, tone, resumeData } = await req.json();

    const prompt = `
      You are an expert career networking coach. 
      Generate hyper-personalized outreach messages for a job seeker.
      
      TARGET: ${name} (Recruiter/Hiring Manager) at ${company}
      ROLE: ${role}
      TONE: ${tone}
      CANDIDATE INFO: ${JSON.stringify(resumeData || "Standard high-performer")}
      
      Generate two options:
      1. A professional Email subject and body.
      2. A concise, high-impact LinkedIn Connection Request or DM.
      
      IMPORTANT: Return ONLY valid JSON in this exact structure:
      {
        "email": { "subject": "string", "body": "string" },
        "linkedin": "string"
      }
    `;

    const result = await callAI({
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      model: "google/gemini-2.0-flash-001"
    });

    try {
      const cleaned = cleanJSON(result);
      return NextResponse.json(JSON.parse(cleaned));
    } catch (error) {
      console.error("AI Parse Error:", error, "Raw Result:", result);
      return NextResponse.json({
        email: { 
          subject: `Outreach for ${role} position`,
          body: "The AI returned an unexpected format. This usually happens when the model is overloaded. Please click generate again!"
        },
        linkedin: "Connection request failed to generate. Please try again."
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
