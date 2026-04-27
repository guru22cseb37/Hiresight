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
          1. FORMATTING: Provide highly structured, clean, and ALIGNED answers using Markdown. Use clear headings.
          2. PEDAGOGY (SPOON-FEEDING): If teaching, EXPLAIN ONLY ONE CONCEPT AT A TIME. Do not give a wall of text. Use simple, baby-step analogies. 
          3. INTERACTION: After every explanation, ASK ONE SMALL QUESTION to verify if the user understood.
          4. VOICE OPTIMIZED: Keep responses concise (under 150 words) so the robot can speak them naturally.
          5. INTERVIEW MODE: Ask sharp, technical questions to test their skills if they are not in teaching mode.
          6. NO PREAMBLE: Just give the direct, aligned response.`
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
