import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { latex, audit } = await req.json();

    const prompt = `
      You are an elite LaTeX resume architect. 
      You are given a LaTeX resume and its ATS Audit report.
      
      LATEX CODE:
      ${latex}
      
      ATS AUDIT REPORT:
      ${JSON.stringify(audit)}
      
      Task:
      Rewrite the LaTeX code to implement ALL improvements suggested in the audit report.
      1. Integrate missing keywords naturally into experience or skills.
      2. Fix formatting issues.
      3. Follow all improvement tips.
      4. Ensure the LaTeX remains compilable and professional.
      
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
