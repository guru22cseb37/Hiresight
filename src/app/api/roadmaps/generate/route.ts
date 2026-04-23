import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { role, company, currentSkills } = await req.json();

    const prompt = `
      You are a world-class Elite Career Coach and Engineering Lead. 
      Generate a tactical, 3-step learning roadmap to help a candidate land a ${role} position at ${company}.
      The candidate currently knows: ${currentSkills}.

      Return ONLY a JSON object in this EXACT format:
      {
        "role": "${role}",
        "company": "${company}",
        "progress": number (0-100),
        "steps": [
          {
            "title": "Short catchy title",
            "description": "Specific tactical goal",
            "status": "pending",
            "duration": "e.g. 3 days",
            "resources": [
              { "type": "Video" | "Paper" | "Docs" | "Repo", "title": "Real or plausible resource name", "url": "URL" }
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
