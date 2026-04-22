import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { latex, audit, customInstruction } = await req.json();

    const prompt = `
      You are an elite LaTeX resume architect and career strategist. 
      You are given a LaTeX resume and optional enhancement instructions.
      
      LATEX CODE:
      ${latex}
      
      ${audit ? `ATS AUDIT REPORT: ${JSON.stringify(audit)}` : ""}
      
      ${customInstruction ? `CUSTOM ENHANCEMENT INSTRUCTION: ${customInstruction}` : "GENERAL TASK: Enhance the resume content to be more professional, expand bullet points using the STAR method, and ensure it fills a full A4 page."}
      
      Requirements:
      1. Expand all project and experience descriptions to be high-impact achievemenets.
      2. If sections are thin, expand them with professional details to ensure the resume fills a full page.
      3. Integrate structured project breakdowns (Frontend, Backend, AI/LLM, API) if applicable.
      4. Fix all formatting and ensure valid, compilable LaTeX.
      5. MAINTAIN ATS COMPATIBILITY. Single column, searchable text.
      
      Output ONLY the corrected LaTeX code. No conversational text.
    `;

    const result = await callAI({
      messages: [{ role: "user", content: prompt }],
      model: "google/gemini-2.0-flash-001"
    });

    return NextResponse.json({ optimizedLatex: result.trim() });
  } catch (error: any) {
    console.error("Optimize Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
