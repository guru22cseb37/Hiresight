"use server";

import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function tailorResume(jobTitle: string, company: string, jobDescription: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an elite career coach and resume expert. Your goal is to generate a highly impactful, tailored resume bullet point that perfectly matches a user's experience to a specific job description. Use strong action verbs and metrics."
        },
        {
          role: "user",
          content: `Generate a single, world-class resume bullet point for a ${jobTitle} role at ${company}. 
          Job Description: ${jobDescription}
          
          Focus on making it sound elite and highly technical.`
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return completion.choices[0]?.message?.content || "Could not generate tailoring. Please try again.";
  } catch (error) {
    console.error("Groq AI Error:", error);
    return "AI Tailoring is currently unavailable. Please check your API key.";
  }
}
