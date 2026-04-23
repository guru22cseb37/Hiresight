import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

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
        ],
        "skillNodes": [
          { "id": "string", "label": "string", "status": "acquired" | "missing" }
        ],
        "skillEdges": [
          ["string", "string"]
        ]
      }
      
      For skillNodes: Provide around 8-12 core skills relevant to the target role. Mark the ones the candidate has as "acquired" and the ones they need as "missing".
      For skillEdges: Connect foundational skills to advanced skills (e.g., ["javascript", "react"]). Use the exact "id" from skillNodes.
    `;

    const result = await callAI({
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return NextResponse.json(JSON.parse(cleanJSON(result)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
