import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { rawJD, role, company, location } = await req.json();

    const result = await runJdOptimization(rawJD, role, company, location);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("JD Optimization Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function runJdOptimization(rawJD: string, role: string, company: string, location: string) {
  const systemPrompt = `You are an expert HR consultant and JD writer. Optimize JDs for inclusivity and ATS ranking. Respond only with valid JSON.`;

  const userPrompt = `
    Optimize this JD for ${role} at ${company} in ${location}.
    RAW JD: ${rawJD}
    
    Return JSON: {
      "optimized_jd": "string (full text)",
      "keywords": string[],
      "diversity_score": number (0-100),
      "changes_summary": "string"
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
