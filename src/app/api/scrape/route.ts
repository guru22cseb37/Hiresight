import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Could not fetch the URL. Please paste the JD manually." }, { status: 400 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Basic extraction logic
    const title = $("h1").first().text().trim() || $("title").text().trim();
    const description = $("div[class*='description'], section[class*='job'], .job-description").text().trim();
    
    // In production, you'd have site-specific selectors
    
    return NextResponse.json({
      title,
      description: description.substring(0, 5000), // Truncate for AI
      source: new URL(url).hostname
    });
  } catch (error: any) {
    console.error("Scrape Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
