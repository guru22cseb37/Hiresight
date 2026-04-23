"use server";

export async function parsePdfAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file uploaded" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Attempt to load pdf-parse robustly
    let pdfParse: any;
    try {
      // Standard CommonJS require
      pdfParse = require("pdf-parse");
    } catch (e) {
      try {
        // Fallback for some environments
        const mod = await import("pdf-parse");
        pdfParse = mod.default || mod;
      } catch (e2) {
        console.error("Critical: Could not load pdf-parse library", e2);
        throw new Error("PDF parsing engine not found.");
      }
    }

    // Ensure we have a function
    let parse = typeof pdfParse === "function" ? pdfParse : (pdfParse?.default || pdfParse?.parse);
    
    if (typeof parse !== "function") {
      throw new Error("Could not initialize PDF parser structure.");
    }

    const data = await parse(buffer);
    
    return { text: data?.text || "" };
  } catch (error: any) {
    console.error("PDF Parsing Error:", error.message || error);
    return { error: `Failed to parse PDF: ${error.message || 'Unknown error'}` };
  }
}
