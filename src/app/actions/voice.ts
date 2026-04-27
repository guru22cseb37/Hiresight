"use server";

import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function speak(text: string) {
  try {
    const response = await deepgram.speak.request(
      { text },
      {
        model: "aura-asteria-en", // Elite female voice
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();
    if (!stream) throw new Error("No audio stream returned");

    const reader = stream.getReader();
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    return buffer.toString("base64");
  } catch (error) {
    console.error("Deepgram TTS Error:", error);
    return null;
  }
}
