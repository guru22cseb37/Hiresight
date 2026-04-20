import { groq } from "./groq";

const OPENROUTER_KEYS = [
  process.env.OPENROUTER_KEY_1,
  process.env.OPENROUTER_KEY_2,
  process.env.OPENROUTER_KEY_3,
].filter(Boolean) as string[];

const MODELS = [
  "google/gemini-2.0-flash-001",
  "openai/gpt-4o-mini",
  "perplexity/llama-3.1-sonar-small-128k-online", // For real-time search
  "z-ai/glm-4.5-air:free",
  "openai/gpt-oss-120b:free",
];

export async function callAI({
  messages,
  model = MODELS[0],
  response_format,
  image_url,
}: {
  messages: any[];
  model?: string;
  response_format?: { type: "json_object" };
  image_url?: string;
}) {
  // 1. Try OpenRouter Fallback Network
  for (const key of OPENROUTER_KEYS) {
    try {
      const payload: any = {
        model,
        messages: image_url 
          ? [
              ...messages.slice(0, -1),
              {
                role: "user",
                content: [
                  { type: "text", text: messages[messages.length - 1].content },
                  { type: "image_url", image_url: { url: image_url } }
                ]
              }
            ]
          : messages,
      };

      if (response_format) payload.response_format = response_format;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "HireSight AI",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "OpenRouter Error");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.warn(`Model ${model} failed with key ${key.substring(0, 10)}... Trying next key/model.`);
      continue;
    }
  }

  // 2. Local Fallback to Groq (if configured)
  try {
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      response_format: response_format as any,
    });
    return completion.choices[0].message.content;
  } catch (error: any) {
    throw new Error("All AI providers failed: " + error.message);
  }
}

/**
 * Cleans markdown code blocks from AI response string
 */
export function cleanJSON(text: string): string {
  if (!text) return "{}";
  
  // Find the first { and last } to extract the JSON object
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  
  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1);
  }
  
  // Fallback for simple markdown cleaning
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

/**
 * Enhanced STAR Evaluator
 */
export async function evaluateStarResponse(question: string, answer: string) {
  const prompt = `
    Evaluate the following interview response using the STAR method (Situation, Task, Action, Result).
    QUESTION: ${question}
    ANSWER: ${answer}
    
    Provide a score (0-100) and specific feedback for each STAR component.
    Return JSON: { "score": number, "situation": "string", "task": "string", "action": "string", "result": "string", "advice": "string" }
  `;

  const result = await callAI({
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(cleanJSON(result));
}
