"use server";

export async function parsePdfAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file uploaded" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Greedy initialization for pdf-parse
    let parse: any;
    try {
      const pdf = require("pdf-parse");
      parse = typeof pdf === "function" ? pdf : (pdf.default || pdf.parse || pdf);
      
      // Some versions of the fork have a 'pdf' or 'parse' named export
      if (typeof parse !== "function") {
        parse = pdf.pdf || pdf.parse;
      }
    } catch (e) {
      try {
        const mod = await import("pdf-parse");
        const pdf = mod.default || mod;
        parse = typeof pdf === "function" ? pdf : (pdf.default || pdf.parse || pdf);
      } catch (e2) {
        console.error("Critical: Could not load pdf-parse library", e2);
      }
    }

    if (typeof parse !== "function") {
      console.error("PDF Parser structure check failed. Type of loaded object:", typeof parse);
      throw new Error("Could not initialize PDF parser engine. Our engineers are notified.");
    }

    const data = await parse(buffer);
    
    return { text: data?.text || "" };
  } catch (error: any) {
    console.error("PDF Parsing Error:", error.message || error);
    return { error: `Failed to parse PDF: ${error.message || 'Unknown error'}` };
  }
}
