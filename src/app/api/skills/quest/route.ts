import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { targetRole, skillName } = await req.json();

    const skillQuery = encodeURIComponent(`${skillName} tutorial for ${targetRole}`);
    const docsQuery = encodeURIComponent(`${skillName} official documentation`);
    const courseQuery = encodeURIComponent(`learn ${skillName} full course`);

    const prompt = `
      You are an expert Technical Career Coach. 
      The candidate is aiming for the role of "${targetRole}" and needs to quickly learn the skill "${skillName}".
      
      Generate an ultra-fast learning "Quest" for this skill.
      
      Return ONLY valid JSON with EXACTLY this structure. For Video resources, you MUST use YouTube search URLs
      in this exact format: https://www.youtube.com/results?search_query=ENCODED_SEARCH_TERMS
      For Docs, use the official documentation URL. For Course, use a real platform like Udemy, Coursera, or freeCodeCamp.
      
      {
        "description": "string (A 2 sentence explanation of why this skill matters for this role)",
        "resources": [
          { 
            "title": "string (descriptive title for the resource)", 
            "url": "https://www.youtube.com/results?search_query=${skillQuery}", 
            "type": "Video" 
          },
          { 
            "title": "string (official docs or guide title)", 
            "url": "string (real official documentation URL for ${skillName})", 
            "type": "Docs" 
          },
          { 
            "title": "string (course title)", 
            "url": "https://www.youtube.com/results?search_query=${courseQuery}", 
            "type": "Course" 
          }
        ],
        "projectIdea": {
          "title": "string",
          "description": "string (A weekend project to prove mastery of this skill)"
        }
      }
      
      CRITICAL: All Video and Course URLs MUST use YouTube search format: https://www.youtube.com/results?search_query=...
      Never use specific YouTube video IDs (like youtube.com/watch?v=...) as they may be unavailable.
    `;

    const result = await callAI({
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      model: "google/gemini-2.0-flash-001"
    });

    return NextResponse.json(JSON.parse(cleanJSON(result)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
