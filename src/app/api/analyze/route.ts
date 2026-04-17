import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { resumeText, jdText, company, role, userId } = await req.json();

    // 1. Parallel AI Calls for maximum speed
    const [atsAnalysis, tailoredResume, coverLetter, interviewPrep] = await Promise.all([
      runAtsAnalysis(resumeText, jdText, company, role),
      runResumeTailoring(resumeText, jdText, company, role),
      runCoverLetterGen(resumeText, jdText, company, role),
      runInterviewPrep(resumeText, jdText, company, role),
    ]);

    // 2. Save to database (Applications table)
    // Note: In production, you'd verify the JWT first.
    /*
    const { data: appData, error: dbError } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        company_name: company,
        role: role,
        job_description: jdText,
        ats_score: atsAnalysis.score,
        tailored_resume: tailoredResume,
        cover_letter: coverLetter,
        keywords_found: atsAnalysis.found_keywords,
        keywords_missing: atsAnalysis.missing_keywords,
        status: 'ready'
      })
      .select()
      .single();
    */

    return NextResponse.json({
      ...atsAnalysis,
      tailoredResume,
      coverLetter,
      interviewPrep,
    });
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function runAtsAnalysis(resume: string, jd: string, company: string, role: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a senior ATS expert. Respond only with valid JSON. No preamble." },
      { role: "user", content: `Analyze this resume against this JD for ${role} at ${company}.\n\nRESUME: ${resume}\n\nJD: ${jd}\n\nReturn JSON: { "score": number, "verdict": string, "summary": string, "found_keywords": string[], "missing_keywords": string[], "hiring_likelihood": string }` }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });
  return JSON.parse(completion.choices[0].message.content || "{}");
}

async function runResumeTailoring(resume: string, jd: string, company: string, role: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are an elite resume writer. Optimize the resume for the JD. Keep facts truthful." },
      { role: "user", content: `Rewrite this resume for ${role} at ${company}.\n\nRESUME: ${resume}\n\nJD: ${jd}\n\nOutput only the rewritten resume text.` }
    ],
    model: "llama-3.3-70b-versatile",
  });
  return completion.choices[0].message.content;
}

async function runCoverLetterGen(resume: string, jd: string, company: string, role: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert cover letter writer. 3 paragraphs max. Specific and human." },
      { role: "user", content: `Write a cover letter for ${role} at ${company} based on this resume.\n\nRESUME: ${resume}\n\nJD: ${jd}` }
    ],
    model: "llama-3.3-70b-versatile",
  });
  return completion.choices[0].message.content;
}

async function runInterviewPrep(resume: string, jd: string, company: string, role: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "Generate 6 interview questions and STAR answers in JSON format." },
      { role: "user", content: `JD: ${jd}\n\nResume: ${resume}\n\nReturn JSON: { "questions": [{ "q": "string", "a": "string" }] }` }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });
  return JSON.parse(completion.choices[0].message.content || "{}");
}
