import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { resumeText, role, company } = await req.json();

    const report = await runIntegrityScan(resumeText, role, company);

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("Integrity Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function runIntegrityScan(resume: string, role: string, company: string) {
  const systemPrompt = `You are an expert in resume verification and HR auditing. Identify timeline gaps, metric plausibility issues, and skill inconsistencies. Be objective and non-accusatory. Respond only with valid JSON.`;

  const userPrompt = `
    Analyze this resume for integrity:
    ROLE: ${role} at ${company}
    RESUME: ${resume}
    
    Return JSON: {
      "overall_integrity_score": number (0-100),
      "risk_level": "Clean" | "Minor Concerns" | "Review Recommended" | "Multiple Red Flags",
      "summary": "string",
      "flags": [
        { "type": "Timeline"|"Metric"|"Skill", "description": "string", "confidence": "high"|"medium"|"low", "suggested_fix": "string" }
      ],
      "positive_signals": ["string"],
      "candidate_advice": "string"
    }
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content || "{}");
}
