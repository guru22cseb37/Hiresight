import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const prompt = `
      You are an elite Recruitment Analyst at HireSight.
      Generate a "Premium Executive Intelligence Report" based on the following hiring data:
      
      METRICS:
      - Total Reach: ${data.reach}
      - Interview Rate: ${data.interviewRate}
      - Time to Hire: ${data.timeToHire}
      - Cost per Hire: ${data.costPerHire}
      
      FUNNEL:
      - Applications: ${data.funnel.applications}
      - Screened: ${data.funnel.screened}
      - Interviewed: ${data.funnel.interviewed}
      - Offered: ${data.funnel.offered}
      
      The report should be professional, data-driven, and "Beautiful" in its wording. 
      Include sections:
      1. EXECUTIVE SUMMARY
      2. FUNNEL EFFICIENCY ANALYSIS
      3. STRATEGIC RECOMMENDATIONS
      4. MARKET POSITIONING
      
      Make it look like a high-end consulting report from McKinsey or Goldman Sachs.
      Return the report as a clean, well-formatted plain text document.
    `;

    const reportContent = await callAI({
      messages: [{ role: "user", content: prompt }],
      model: "google/gemini-2.0-flash-001"
    });

    return NextResponse.json({ report: reportContent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
