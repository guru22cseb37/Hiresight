import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { companyName } = await req.json();

    const prompt = `
      You are a specialized corporate investigator and recruiter.
      SEARCH THE WEB for the latest information on the following company:
      COMPANY NAME: ${companyName}
      
      Tasks:
      1. Verify if this company exists. Check their website, LinkedIn, and Glassdoor presence.
      2. If it is a scam (e.g., job scams, fake identity), set "isFake" to true and list specific red flags.
      3. Provide a detailed history, their technology stack, and business model.
      4. Predict interview questions based on recent glassdoor reviews or similar industry leaders.
      
      Return ONLY valid JSON:
      {
        "isFake": boolean,
        "trustScore": number (0-100),
        "verdict": "string",
        "redFlags": ["string"],
        "history": "string",
        "techStack": ["string"],
        "predictedQuestions": [
          { "q": "string", "reason": "string" }
        ]
      }
    `;

    const result = await callAI({
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      model: "perplexity/llama-3.1-sonar-small-128k-online"
    });

    const parsed = JSON.parse(cleanJSON(result));
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Company Analyze Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
