import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { userData, referenceImage, referenceText, jobDesc } = await req.json();

    let prompt = `
      Create a professional, ATS-optimized LaTeX resume for the following candidate:
      CANDIDATE DATA: ${JSON.stringify(userData)}
      
      ${jobDesc ? `TARGET JOB DESCRIPTION: ${jobDesc}` : ""}
      
      ${referenceText || referenceImage ? `REFERENCE STYLE/STRUCTURE: Please mimic the style, layout, and structure of the provided reference.` : "Use a modern, clean, single-column LaTeX template similar to the 'Jake's Resume' or 'Deedy Resume' styles found on Overleaf."}
      
      Requirements:
      1. Output ONLY the complete LaTeX code.
      2. Ensure all LaTeX packages used are standard (e.g., geometry, hyperref, enumitem, titlesec).
      3. Optimize content for ATS by using standard section headers (Experience, Education, Skills).
      4. If a Job Description is provided, tailor the bullet points to include relevant keywords and metrics.
      5. Do not include any preamble or postamble text, just the code.
    `;

    const latexCode = await callAI({
      messages: [{ role: "user", content: prompt }],
      image_url: referenceImage, // This will be handled by callAI if present
      model: referenceImage ? "google/gemini-2.0-flash-001" : "openai/gpt-4o-mini"
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
