import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { resumeData, templateName, colorScheme } = await req.json();

    const latexSource = await generateLatex(resumeData, templateName, colorScheme);

    return NextResponse.json({ latexSource });
  } catch (error: any) {
    console.error("LaTeX Gen Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function generateLatex(data: any, template: string, color: string) {
  const systemPrompt = `You are an elite LaTeX typesetter and career strategist. Your goal is to produce a high-impact, one-page, ATS-optimized resume. 
  Output ONLY valid, compilable LaTeX code. Do not include any conversational text or markdown code blocks.
  Use professional packages: geometry, hyperref, enumitem, titlesec, xcolor, fontawesome5, etoolbox.`;
  
  const userPrompt = `
    Generate a PREMIER LaTeX resume for:
    NAME: ${data.name}
    ROLE: ${data.targetRole}
    EMAIL: ${data.email}
    
    TEMPLATE STYLE: ${template} (Ensure it fills a full A4 page perfectly. If content is short, expand and embellish professionally).
    COLOR SCHEME: ${color}
    
    EXPERIENCE: ${JSON.stringify(data.experience)}
    SKILLS: ${JSON.stringify(data.skills)}
    
    CRITICAL REQUIREMENTS:
    1. STRUCTURED PROJECTS: For each project, create clear subsections for:
       - Frontend Tools
       - Backend Tools
       - AI/LLM Integration
       - API Infrastructure
    2. CONTENT EXPANSION: Transform simple bullet points into high-impact, STAR-methodology achievement statements. Use strong action verbs.
    3. ATS OPTIMIZATION: Use a single-column layout with clear headings. Ensure the text layer is searchable.
    4. PAGE SATURATION: The LaTeX code must be calibrated to fill exactly one full page. Adjust vertical spacing (\\vspace) and content depth to achieve a "Big" and "Full" look.
    5. PROFESSIONALISM: Use a modern, clean design (like Jake's Resume or Deedy style, but strictly single-column for ATS).
    
    Start with \\documentclass[10pt, a4paper]{article} and end with \\end{document}.
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
  });

  let raw = completion.choices[0].message.content || "";
  // Clean up any potential markdown fences
  raw = raw.replace(/```latex/g, "").replace(/```/g, "").trim();
  
  return raw;
}
