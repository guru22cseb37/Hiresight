import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `
      You are an expert technical interviewer. 
      Conduct a mock interview for a Senior React Developer position.
      Rules:
      1. Ask one direct, challenging question at a time.
      2. React briefly to the candidate's last answer (1 sentence) before asking the next question.
      3. Be professional but encouraging.
      4. If the candidate is vague, ask them for specific project examples or deeper technical details.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({ 
      reply: completion.choices[0].message.content 
    });
  } catch (error: any) {
    console.error("Mock Interview Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
