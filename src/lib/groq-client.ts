import { Groq } from "groq-sdk";

const keys = [
  process.env.HIRESIGHT_GROQ_PRIMARY,
  process.env.HIRESIGHT_GROQ_SECONDARY
].filter(Boolean) as string[];

let currentKeyIndex = 0;

export function getGroqClient() {
  const key = keys[currentKeyIndex];
  return new Groq({ apiKey: key });
}

export function rotateKey() {
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  console.log(`Rotating to Groq Key ${currentKeyIndex + 1}`);
  return getGroqClient();
}
