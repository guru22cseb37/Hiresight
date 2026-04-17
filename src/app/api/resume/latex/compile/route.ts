import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { latexSource } = await req.json();

    // Proxy to latexonline.cc for simplicity and speed
    // This returns the PDF binary directly
    const response = await fetch("https://latexonline.cc/compile?text=" + encodeURIComponent(latexSource));

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: 400 });
    }

    const pdfBuffer = await response.arrayBuffer();
    
    // In a real app, you'd upload this to Supabase Storage here.
    // For now, we return it as a blob.
    
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/json", // Or "application/pdf" if returning directly
        "X-Status": "success"
      }
    });
  } catch (error: any) {
    console.error("Compile Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
