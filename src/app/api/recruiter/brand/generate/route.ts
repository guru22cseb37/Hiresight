import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { jobTitle, company, perks, tone } = await req.json();

    const prompt = `
      You are an elite Recruitment Branding Specialist.
      Generate high-impact social media posts to promote a new job opening.
      
      JOB: ${jobTitle} at ${company}
      PERKS: ${perks}
      TONE: ${tone} (e.g., Bold, Professional, Hype)
      
      Tasks:
      1. A LinkedIn Post: Professional yet high-energy, using emojis and strong formatting.
      2. A Twitter (X) Thread: A 3-tweet sequence to build hype.
      
      Return ONLY valid JSON:
      {
        "linkedin": "string",
        "twitter": ["string", "string", "string"]
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
