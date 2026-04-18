import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { targetCompany, targetRole, currentSkills } = await req.json();

    const prompt = `
      You are an expert Technical Career Path Architect.
      Analyze the gap between a candidate's current skills and their target role at a specific company.
      
      TARGET COMPANY: ${targetCompany}
      TARGET ROLE: ${targetRole}
      CURRENT SKILLS: ${currentSkills}
      
      Tasks:
      1. Calculate a "Match Score" (0-100).
      2. Identify 3-5 critical "Technical Gaps" (Specific tools, frameworks, or concepts).
      3. Identify 2-3 "Soft Skill / Cultural Gaps" based on ${targetCompany}'s known culture.
      4. Provide a "Bridge Plan" with 3 actionable steps (e.g., Specific project to build, certification to get).
      
      Return ONLY valid JSON:
      {
        "score": number,
        "technicalGaps": ["string"],
        "culturalGaps": ["string"],
        "bridgePlan": [
          { "action": "string", "reason": "string" }
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
