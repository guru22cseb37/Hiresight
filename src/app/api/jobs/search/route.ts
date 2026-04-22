import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "Software Engineer";
  const page = searchParams.get("page") || "1";
  
  const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;

  if (!apiKey || !apiHost) {
    return NextResponse.json({ error: "API credentials not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://${apiHost}/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=1`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": apiHost,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || "Failed to fetch jobs" }, { status: response.status });
    }

    const data = await response.json();
    
    // Transform JSearch data to our app's internal format
    const jobs = data.data.map((job: any) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city && job.job_country ? `${job.job_city}, ${job.job_country}` : job.job_location || "Remote",
      salary: job.job_min_salary && job.job_max_salary 
        ? `$${Math.round(job.job_min_salary/1000)}k - $${Math.round(job.job_max_salary/1000)}k`
        : "Competitive",
      type: job.job_employment_type || "Full-time",
      posted: job.job_posted_at_datetime_utc 
        ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString() 
        : "Recently",
      matchScore: Math.floor(Math.random() * (98 - 75 + 1)) + 75, // Simulate AI matching
      tags: job.job_highlights?.Qualifications?.slice(0, 4) || ["Full Stack", "Technology"],
      logo: job.employer_logo || null,
      applyLink: job.job_apply_link
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Job Search Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
