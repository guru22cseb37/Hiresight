import { NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq-client";

export async function POST(req: Request) {
  try {
    const { text, field } = await req.json();
    const groq = getGroqClient();

    const prompt = `
      You are an elite FAANG Resume Architect and Language Specialist.
      The user may have limited English proficiency. Your mission is to transform their input into high-impact, professional tech resume content.
      
      FIELD: ${field || "Resume Section"}
      INPUT: "${text}"
      
      CRITICAL INSTRUCTIONS:
      1. FIX ALL GRAMMAR AND SPELLING: Even if the input is broken, fragmented, or poorly translated, reconstruct it into perfect, sophisticated professional English.
      2. AMPLIFY IMPACT: Use powerful action verbs (e.g., "Architected," "Orchestrated," "Spearheaded") and ensure the tone is authoritative.
      3. COMPLETE THE THOUGHT: You MUST provide a FULL, cohesive sentence or bullet point. Do NOT cut off mid-sentence.
      4. TOP-TIER STANDARD: The output must sound like it was written by a top-tier career coach.
      5. NO CONVERSATION: Output ONLY the polished text. No preamble, no "Here is your polished text."
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Lower temperature for more consistent, professional output
      max_tokens: 500, // Ensure enough tokens for a full sentence
    });

    const result = completion.choices[0].message.content || "";

    return NextResponse.json({ polished: result.trim() });
  } catch (error: any) {
    console.error("Polish Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
