import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { candidates, jobContext } = await req.json();

    const prompt = `
      You are an elite Recruitment Screening Engine.
      Generate hyper-concise, 1-sentence "Bullet Summaries" for the following candidates based on the job context.
      
      JOB CONTEXT: ${jobContext}
      CANDIDATES: ${JSON.stringify(candidates)}
      
      Return ONLY valid JSON:
      {
        "summaries": [
          { "id": "string", "summary": "string (max 15 words)", "matchReason": "string (one key skill)" }
        ]
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
