import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { messages, userProfile } = await req.json();

    const systemPrompt = `
      You are the world's most elite Salary Negotiation Coach. 
      You help high-performing job seekers maximize their total compensation.
      
      CANDIDATE PROFILE: ${JSON.stringify(userProfile || "High-performer")}
      
      Style:
      - Strategic, calm, and assertive.
      - Provide specific scripts and psychological leverage points.
      - Focus on Total Compensation (Base, Bonus, Equity, Signing).
      - Use "The Ackman Method" or similar high-stakes negotiation tactics.
      
      Always provide a "Tactical Script" in your responses if the user is asking how to say something.
    `;

    const result = await callAI({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      model: "google/gemini-2.0-flash-001"
    });

    return NextResponse.json({ message: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
