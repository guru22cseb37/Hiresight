import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { dreamCandidate, jobRole } = await req.json();

    const prompt = `
      You are an elite Autonomous Talent Scout with real-time web access.
      TASK: Search the web (LinkedIn, GitHub, X, Portfolios) to find REAL candidates that match the following requirements.
      
      JOB ROLE: ${jobRole}
      DREAM CANDIDATE DESCRIPTION: ${dreamCandidate}
      
      Find 3 real or highly probable elite profiles. For each, provide:
      - Full Name
      - Current Role & Company
      - A match score (percentage)
      - A detailed "Extraction Reason" based on their specific background.
      - Key Skills they possess.
      
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
      model: "perplexity/llama-3.1-sonar-small-128k-online"
    });

    return NextResponse.json(JSON.parse(cleanJSON(result)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
