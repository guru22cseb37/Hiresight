"use server";

import { getGroqClient, rotateKey } from "@/lib/groq-client";

export async function getTechnicalScore(userData: any) {
  let groq = getGroqClient();
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an elite FAANG recruiter. Analyze the user data and provide a technical readiness score (0-100) and a brief justification."
        },
        {
          role: "user",
          content: JSON.stringify(userData)
        }
      ],
      model: "llama3-70b-8192",
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Intelligence Action Error:", error);
    return { score: 75, justification: "AI Analysis currently unavailable." };
  }
}
