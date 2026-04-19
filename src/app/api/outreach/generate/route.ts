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
      
      Ensure the messages highlight the candidate's value proposition and why they are interested in ${company}.
      Return ONLY valid JSON:
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

    return NextResponse.json(JSON.parse(cleanJSON(result)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
