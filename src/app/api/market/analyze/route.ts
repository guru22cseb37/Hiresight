import { NextResponse } from "next/server";
import { callAI, cleanJSON } from "@/lib/ai";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "Software Engineering";
  
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST;

  if (!apiKey || !apiHost) {
    return NextResponse.json({ error: "API credentials not configured" }, { status: 500 });
  }

  try {
    // 1. Fetch real-time job data from JSearch
    const response = await fetch(
      `https://${apiHost}/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": apiHost,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch job data for analysis");
    }

    const jobData = await response.json();
    const jobSummaries = jobData.data.slice(0, 15).map((j: any) => ({
      title: j.job_title,
      company: j.employer_name,
      description: j.job_description?.substring(0, 300),
      salary: j.job_salary_string || "Not disclosed",
    }));

    // 2. Use AI to analyze the market data
    const prompt = `
      Analyze the following live job market data for "${query}".
      DATA: ${JSON.stringify(jobSummaries)}

      Create a professional "Market Intelligence Report".
      Return ONLY a JSON object with this exact structure:
      {
        "title": "Short descriptive title (e.g. AI Engineering Surge in SF)",
        "summary": "2-3 sentence overview of the current market state.",
        "trending_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
        "salary_data": {
          "max": "Estimated top salary found",
          "demand": "High/Medium/Elite"
        }
      }
    `;

    const aiResult = await callAI({
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const report = JSON.parse(cleanJSON(aiResult));

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("Market Analysis Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
