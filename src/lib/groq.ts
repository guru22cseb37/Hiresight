import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY || process.env.HIRESIGHT_GROQ_PRIMARY || "mock-groq-api-key-placeholder";

export const groq = new Groq({
  apiKey: apiKey,
});
