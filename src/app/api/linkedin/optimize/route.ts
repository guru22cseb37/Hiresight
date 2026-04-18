import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { headline, about } = await req.json();

    const prompt = `
      You are an expert LinkedIn Profile Strategist and SEO specialist.
      Optimize the following LinkedIn profile sections to increase recruiter visibility and appeal.
      
      CURRENT HEADLINE: "${headline}"
      CURRENT ABOUT SECTION: "${about}"
      
      Tasks:
      1. Analyze the current SEO strength and provide a score (0-100).
      2. Provide specific advice for Headline SEO improvement.
      3. Identify missing critical industry keywords for their role.
      4. Provide a "Call to Action" suggestion.
      5. Write a completely REWRITTEN, high-impact, SEO-optimized "About" section that sounds professional yet human. Use emojis strategically.
      
      Return ONLY valid JSON:
      {
        "score": number,
        "headline": "string (advice)",
        "keywords": "string (advice)",
        "cta": "string (advice)",
        "about": "string (the full rewritten section)"
      }
    `;

    const result = await callAI({
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      model: "google/gemini-2.0-flash-001"
    });

    return NextResponse.json(JSON.parse(cleanJSON(result)));
  } catch (error: any) {
    console.error("LinkedIn Optimize Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
