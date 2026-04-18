import { NextResponse } from "next/server";
import { evaluateStarResponse } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();

    const evaluation = await evaluateStarResponse(question, answer);
    
    // Return structured evaluation
    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error("Evaluation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
