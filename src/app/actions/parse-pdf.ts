"use server";

export async function parsePdfAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file uploaded" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Using a more robust loading strategy for the Mehmet Kozan fork
    let parseFunc: any;
    
    try {
      // 1. Try modern dynamic import
      const mod = await import("pdf-parse/node");
      parseFunc = (mod as any).default || mod;
    } catch (e) {
      try {
        // 2. Try standard require
        const mod = require("pdf-parse/node");
        parseFunc = (mod as any).default || mod;
      } catch (e2) {
        // 3. Last resort: main entry
        const mod = require("pdf-parse");
        parseFunc = (mod as any).default || mod;
      }
    }

    // Safety check: ensure we actually have a function
    if (typeof parseFunc !== 'function') {
      // In some versions of this fork, it's a named export
      if (parseFunc && typeof parseFunc.pdf === 'function') parseFunc = parseFunc.pdf;
      else if (parseFunc && typeof parseFunc.parse === 'function') parseFunc = parseFunc.parse;
      else {
        console.error("PDF Library Object Structure:", JSON.stringify(Object.keys(parseFunc || {})));
        throw new Error("Could not initialize PDF parser. Please try again.");
      }
    }

    const data = await parseFunc(buffer);
    
    return { text: data?.text || "" };
  } catch (error: any) {
    console.error("PDF Parsing Error:", error.message || error);
    return { error: `Failed to parse PDF: ${error.message || 'Unknown error'}` };
  }
}
