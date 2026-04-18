import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { dreamCandidate, jobRole } = await req.json();

    const prompt = `
      You are an elite Autonomous Talent Scout.
      Search through the current "High Value Asset" pool and identify the top 3 candidates that match the "Dream Candidate" description.
      
      JOB ROLE: ${jobRole}
      DREAM CANDIDATE DESCRIPTION: ${dreamCandidate}
      
      Since this is a demo, generate 3 hyper-realistic, high-quality candidate matches with specific "Extraction Reasons".
      
      Return ONLY valid JSON:
      {
        "matches": [
          {
            "name": "string",
            "currentRole": "string",
            "matchScore": number,
            "extractionReason": "string",
            "skills": ["string"]
          }
        ]
      }
    `;

    const result = await callAI({
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      model: "google/gemini-2.0-flash-001"
    });

    return NextResponse.json(JSON.parse(result));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
