import { NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq-client";

export async function POST(req: Request) {
  try {
    const { name, company, role, tone } = await req.json();
    const groq = getGroqClient();

    const prompt = `
      You are an expert career networking coach specializing in ${tone} outreach. 
      Generate hyper-personalized outreach messages for a job seeker.
      
      TARGET: ${name || "Hiring Manager"} at ${company}
      ROLE: ${role}
      TONE: ${tone} (IMPORTANT: ADHERE TO THIS STYLE)
      
      Generate two options:
      1. A ${tone} Email subject and body.
      2. A concise, high-impact LinkedIn Connection Request or DM.
      
      STRICT JSON FORMAT REQUIRED:
      {
        "email": { "subject": "string", "body": "string" },
        "linkedin": "string"
      }
      
      Return ONLY the JSON. No preamble, no explanation.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      response_format: { type: "json_object" }
    });

    const result = completion.choices[0].message.content || "{}";

    try {
      const parsed = JSON.parse(result);
      return NextResponse.json(parsed);
    } catch (error) {
      console.error("AI Parse Error:", error, "Raw Result:", result);
      return NextResponse.json({
        email: { 
          subject: `Outreach for ${role} position`,
          body: "Draft generation finalized. Please refine manually."
        },
        linkedin: "LinkedIn request ready. Please refine manually."
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
