import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { role, company, currentSkills } = await req.json();

    const prompt = `
      You are a world-class Elite Career Architect and Engineering Lead. 
      Generate a COMPLETE, comprehensive, top-to-bottom learning roadmap to help a candidate land a ${role} position at ${company}.
      
      CRITICAL INSTRUCTION: This must be a master-level roadmap covering everything from foundations to elite-level specialization.
      The candidate currently knows: ${currentSkills}.
      If the candidate is a beginner, the first few steps MUST be fundamental (e.g. basic programming, math, logic).
      
      Generate between 6 to 10 logical steps. Each step should be a significant milestone.

      Return ONLY a JSON object in this EXACT format:
      {
        "role": "${role}",
        "company": "${company}",
        "progress": number (initially low, e.g. 0-10),
        "steps": [
          {
            "title": "Clear, professional milestone title",
            "description": "Detailed explanation of what to master in this phase and why it matters for ${company}.",
            "status": "pending",
            "duration": "e.g. 2 weeks",
            "resources": [
              { "type": "Video" | "Paper" | "Docs" | "Repo" | "Course", "title": "High-quality resource name", "url": "URL" }
            ]
          }
        ]
      }
    `;

    const result = await callAI({
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const roadmap = JSON.parse(cleanJSON(result));
    return NextResponse.json(roadmap);
  } catch (error: any) {
    console.error("Roadmap Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
