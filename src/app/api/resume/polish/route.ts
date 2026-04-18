import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { text, field } = await req.json();

    const prompt = `
      You are an expert resume writer and career coach.
      Polish the following ${field || "resume section"} to be professional, impactful, and grammatically perfect for a top-tier tech resume.
      
      INPUT: "${text}"
      
      Requirements:
      1. Use strong action verbs.
      2. Keep it concise but professional.
      3. Fix all spelling and grammar issues.
      4. Output ONLY the polished text. No conversational filler.
    `;

    const result = await callAI({
      messages: [{ role: "user", content: prompt }],
      model: "google/gemini-2.0-flash-001"
    });

    return NextResponse.json({ polished: result.trim() });
  } catch (error: any) {
    console.error("Polish Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
