import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { userData, referenceImage, referenceText, jobDesc } = await req.json();

    let prompt = `
      Create a PROFESSIONAL, HIGH-LEGIBILITY LaTeX resume. 
      The goal is a clean, standard, single-column tech resume that is easy to read and perfectly formatted.
      
      CANDIDATE DATA: ${JSON.stringify(userData)}
      
      STRICT DESIGN RULES (CRITICAL):
      1. DOCUMENT SETUP:
         - Class: \\documentclass[10pt, a4paper]{article}
         - Margins: \\usepackage[margin=0.6in]{geometry}
         - Font: \\usepackage[T1]{fontenc} \\usepackage{helvet} \\renewcommand{\\familydefault}{\\sfdefault}
         - No numbering: Use \\usepackage{titlesec} and \\titleformat{\\section}{\\bfseries\\large\\uppercase}{}{0pt}{}[\\titlerule]
      
      2. HEADER:
         - Centered Name: {\\huge \\bfseries Name}
         - Centered Info: Clean line below name with Email | Phone | Location
      
      3. CONTENT LEGIBILITY:
         - DO NOT use \\Huge or \\Large for body text. Use standard 10pt size.
         - ALL sections (Summary, Experience, Projects) must be LEFT-ALIGNED.
         - Bullet Points: Use \\begin{itemize}[leftmargin=*, noitemsep, topsep=2pt, label=\\textbullet].
         - NO LABELS: Do not use "Situation:", "Task:", etc. Just clean, impactful bullets.
      
      4. STRUCTURE:
         - Experience/Project titles in \\textbf{Bold}.
         - Dates and Tech in \\textit{Italics} or \\hfill \\textbf{Dates}.
      
      Output ONLY the complete, compilable LaTeX code. No preamble, no explanation.
    `;

    const latexCode = await callAI({
      messages: [{ role: "user", content: prompt }],
      image_url: referenceImage,
      model: "google/gemini-2.0-flash-001" // Using Gemini for more stable formatting
    });

    // Also get an ATS score and improvements
    const auditPrompt = `
      Analyze this LaTeX resume code for ATS compatibility and alignment with the JD.
      LATEX CODE: ${latexCode}
      JD: ${jobDesc || "General professional standards"}
      
      Return JSON:
      {
        "score": number,
        "alignment": "string",
        "missingKeywords": ["string"],
        "formattingIssues": ["string"],
        "improvements": ["string"]
      }
    `;

    const auditResult = await callAI({
      messages: [{ role: "user", content: auditPrompt }],
      response_format: { type: "json_object" }
    });

    return NextResponse.json({
      latex: latexCode,
      audit: JSON.parse(cleanJSON(auditResult))
    });
  } catch (error: any) {
    console.error("Resume Builder Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
