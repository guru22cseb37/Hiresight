import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { transcript, roleRequirements } = await req.json();

    const prompt = `
      You are an elite Recruitment Intelligence Agent.
      Analyze the following interview transcript or notes and generate a detailed "Elite Scorecard".
      
      ROLE REQUIREMENTS: ${roleRequirements || "Standard high-performance engineering role"}
      INTERVIEW TRANSCRIPT/NOTES:
      ${transcript}
      
      Tasks:
      1. TRUTH SCORE (0-100): How authentic and grounded in reality do the candidate's claims seem? Identify any "red flag" vague answers.
      2. TECHNICAL DEPTH (0-100): How much deep, specialized knowledge did the candidate demonstrate?
      3. CULTURE DELTA: How well does their communication style and mindset align with a high-velocity, elite engineering culture?
      4. SUMMARY: A 2-sentence executive summary of the performance.
      5. DECISION: "Extract" (Hire), "Watch" (Next Round), or "Aborted" (Reject).
      
      Return ONLY valid JSON:
      {
        "truthScore": number,
        "truthAnalysis": "string",
        "techDepth": number,
        "techAnalysis": "string",
        "cultureFit": "string",
        "summary": "string",
        "decision": "string (Extract/Watch/Aborted)"
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
