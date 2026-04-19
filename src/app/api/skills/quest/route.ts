import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { targetRole, skillName } = await req.json();

    const prompt = `
      You are an expert Technical Career Coach. 
      The candidate is aiming for the role of "${targetRole}" and needs to quickly learn the skill "${skillName}".
      
      Generate an ultra-fast learning "Quest" for this skill.
      
      Return ONLY valid JSON:
      {
        "description": "string (A 2 sentence explanation of why this skill matters for this role)",
        "resources": [
          { "title": "string", "url": "string (Make up a highly realistic URL like https://youtube.com/results?search_query=... or the official docs)", "type": "Video" | "Docs" | "Course" }
        ],
        "projectIdea": {
          "title": "string",
          "description": "string (A weekend project to prove mastery of this skill)"
        }
      }
      
      Provide 3 high-quality resources.
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
