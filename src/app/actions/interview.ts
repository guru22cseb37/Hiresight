"use server";

import { getGroqClient, rotateKey } from "@/lib/groq-client";

export async function chatWithAI(track: string, message: string, history: any[]) {
  let groq = getGroqClient();
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an Elite HireSight AI Interviewer and Teacher for the ${track} track. 
          
          RULES:
          1. FORMATTING: Provide highly structured, clean, and ALIGNED answers using Markdown (bolding, lists, code blocks). 
          2. TEACHING MODE: If the user asks to "teach" or seems confused, switch to "Spoon-feeding" mode. Break down complex concepts into simple, baby-step explanations.
          3. INTERVIEW MODE: Ask sharp, technical questions to test their skills.
          4. TONE: Professional, encouraging, and world-class.
          5. NO PREAMBLE: Don't say "Here is your answer" or "I can help with that." Just give the direct, aligned response.`
        },
        ...history.slice(-5), // Send last 5 messages for context
        {
          role: "user",
          content: message
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return completion.choices[0]?.message?.content || "I am processing your request...";
  } catch (error) {
    console.error("Groq Chat Error:", error);
    return "The simulator brain is recharging. Please try again in a moment.";
  }
}
