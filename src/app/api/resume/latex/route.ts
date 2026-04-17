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
  const systemPrompt = `You are a LaTeX typesetting expert. Output only valid compilable LaTeX code. No markdown. No headers. Use packages: geometry, hyperref, enumitem, titlesec, xcolor.`;
  
  const userPrompt = `
    Generate a LaTeX resume for:
    NAME: ${data.name}
    ROLE: ${data.targetRole}
    EMAIL: ${data.email}
    
    TEMPLATE STYLE: ${template}
    COLOR SCHEME: ${color}
    
    EXPERIENCE: ${JSON.stringify(data.experience)}
    SKILLS: ${JSON.stringify(data.skills)}
    
    Rules:
    1. Single column if classic, two-column if modern.
    2. Font size 10pt.
    3. Margins 0.6in.
    4. Start with \\documentclass and end with \\end{document}.
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    model: "llama-3.3-70b-versatile",
  });

  let raw = completion.choices[0].message.content || "";
  // Clean up any potential markdown fences
  raw = raw.replace(/```latex/g, "").replace(/```/g, "").trim();
  
  return raw;
}
