"use server";

export async function parsePdfAction(formData: FormData) {
  try {
    const pdf = require("pdf-parse");
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file uploaded" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const data = await pdf(buffer);
    
    return { text: data.text };
  } catch (error: any) {
    console.error("PDF Parsing Error:", error.message || error);
    return { error: `Failed to parse PDF: ${error.message || 'Unknown error'}` };
  }
}

