import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { userData, referenceImage, referenceText, jobDesc } = await req.json();

    let prompt = `
      Create the WORLD'S PREMIER, FAANG-Standard LaTeX resume. 
      This is a HIGH-STAKES task. The result must be PIXEL-PERFECT and visually STUNNING.
      
      CANDIDATE DATA: ${JSON.stringify(userData)}
      TEMPLATE ARCHITECTURE: ${userData.template || "Maverick"}
      
      LATEX DESIGN SPECIFICATIONS (CRITICAL):
      1. DOCUMENT SETUP:
         - Class: \\documentclass[11pt, letterpaper]{article}
         - Margins: Use \\usepackage[margin=0.5in]{geometry}
         - Fonts: Use \\usepackage[default]{inter} or \\usepackage{helvet}. MUST be Sans-Serif and clean.
         - NO SECTION NUMBERS: Use \\usepackage{titlesec} and \\titleformat{\\section}{\\bfseries\\large\\uppercase}{}{0pt}{}[\\titlerule] to create clean, underlined headers WITHOUT numbering.
      
      2. CONTENT STRATEGY:
         - NO LABELS: Never use labels like "Situation:", "Task:", "Action:", or "Result:". Integrate the impact naturally into professional bullet points.
         - STRONG ACTION VERBS: Start every bullet with a powerful verb (e.g., "Orchestrated", "Engineered", "Optimized").
         - QUANTIFIABLE METRICS: Every bullet point MUST have a number (%, $, time, users).
         - HEADER: Center the name in \\Huge \\bfseries. Below it, center a clean contact line separated by symbols (| or •).
      
      3. EXPERIENCE & PROJECTS:
         - Format: \\textbf{Position/Project Title} \\hfill \\textbf{Dates/Tech} \\\\ \\textit{Company/Description}
         - Use \\begin{itemize}[leftmargin=*, nosep, label=\\textbullet] for bullet points to ensure high density and clean alignment.
      
      4. ATS SUPREMACY: Ensure the LaTeX is searchable and uses standard section names.
      
      ${jobDesc ? `ATS REVERSE ENGINEERING: Deeply analyze this Job Description: ${jobDesc}. Inject critical technical keywords into the bullet points.` : ""}
      
      Output ONLY the complete, compilable LaTeX code. No preamble, no explanation.
    `;

    const latexCode = await callAI({
      messages: [{ role: "user", content: prompt }],
      image_url: referenceImage,
      model: "llama-3.3-70b-versatile"
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
