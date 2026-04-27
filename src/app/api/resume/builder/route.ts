import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { userData, referenceImage, referenceText, jobDesc } = await req.json();

    let prompt = `
      Create the WORLD'S BEST, SOVEREIGN-LEVEL LaTeX resume for the following candidate:
      CANDIDATE DATA: ${JSON.stringify(userData)}
      TEMPLATE ARCHITECTURE: ${userData.template || "Maverick"}
      
      ${jobDesc ? `ATS REVERSE ENGINEERING: Deeply analyze this Job Description: ${jobDesc}. Identify critical technical keywords, soft skills, and industry terms. INJECT these keywords semantically into the resume bullet points while maintaining a natural, powerful tone.` : ""}
      
      ${referenceText || referenceImage ? `NEURAL TEMPLATE CLONING: Analyze the provided reference image/text. Replicate its structural DNA, including margin ratios, section spacing, and font hierarchy, with pixel-perfect LaTeX accuracy.` : `Use the '${userData.template || "Maverick"}' architecture:
        - Maverick: Modern, dual-column if necessary, bold sans-serif headers, clean impact.
        - Executive: Classic single-column, serif fonts, authoritative spacing, professional elegance.
        - Engineer: High-density technical layout, bold tech stacks per project, monochrome, ultra-precise.`}
      
      CRITICAL PERFORMANCE REQUIREMENTS:
      1. Output ONLY the complete LaTeX code. No meta-talk.
      2. QUANTifiable IMPACT: Every single bullet point MUST contain a hard number (%, $, time saved, users reached). NO EXCEPTIONS.
      3. SEMANTIC KEYWORD INJECTION: If a JD is provided, ensure the resume has 100% keyword coverage for that specific role.
      4. ATS SUPREMACY: Use geometry, hyperref, and enumitem. Ensure headers are standard (Experience, Projects, Education, Skills).
      5. PROFESSIONAL SUMMARY: Create a high-authority 'Executive Profile' that positions the candidate as a leader in their field.
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
