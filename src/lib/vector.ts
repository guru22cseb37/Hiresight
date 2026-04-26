import { supabase } from './supabase';

/**
 * Generate embedding for a given text
 * Note: You'll need to configure an embedding model (e.g., via OpenAI or OpenRouter)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Example using OpenAI (you'd need an API key in .env)
  // For now, this is a placeholder. In a real app, you'd call an embedding API.
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-3-small",
    }),
  });

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Search for similar resumes in Supabase
 */
export async function searchSimilarResumes(embedding: number[], limit = 5, threshold = 0.5) {
  const { data, error } = await supabase.rpc('match_resumes', {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) throw error;
  return data;
}

/**
 * Store a resume with its embedding
 */
export async function storeResumeWithEmbedding(userId: string, content: string, metadata: any) {
  const embedding = await generateEmbedding(content);
  
  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: userId,
      content,
      metadata,
      embedding,
    });

  if (error) throw error;
  return data;
}
