import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { messages, role, domain, language } = await req.json();

    const systemPrompt = `
      - You are an elite, senior-level interviewer from a top-tier tech company (FAANG).
      - Maintain a professional, sharp, but encouraging persona.
      - Conduct a technical interview for the role of ${role} with a focus on ${domain} using ${language}.
      - IMPORTANT: Respond naturally to the candidate. If they ask a question or greet you, acknowledge it naturally before pivoting back to the interview.
      - NEVER use placeholder text like "*Candidate provides an answer*" or "[Awaits response]". 
      - FORMATTING: Use clear Markdown. Use bullet points for lists, bold text for key terms, and proper spacing between paragraphs.
      
      CONTEXT:
      - Role: ${role || "Software Engineer"}
      - Technical Domain: ${domain || "General"}
      - Primary Language: ${language || "Any"}

      Your goal is to conduct a rigorous but encouraging interview.
      RULES:
      1. Ask one challenging question at a time.
      2. If the candidate asks a question, has a doubt, or needs an explanation, YOU MUST ANSWER IT COMPLETELY AND COMPREHENSIVELY. Clear every single doubt with 100% accuracy and no errors. Ensure the candidate fully understands the concept before moving on.
      3. React meaningfully to the candidate's last answer. Don't just say "solid overview"—actually comment on a specific detail they mentioned.
      4. Never break character. Be the interviewer they would meet at Google or Meta, but be extremely helpful in clearing doubts.
    `;

    const reply = await callAI({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
    });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Mock Interview Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
