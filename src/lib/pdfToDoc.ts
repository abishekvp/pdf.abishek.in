"use client";

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { loadPdfDoc, extractPageTextContent } from "./pdfjsLoader";
import { PdfToDocOptions } from "@/types";

export interface DocConversionResult {
  blob: Blob;
  format: "docx" | "txt" | "md";
  fileName: string;
  wordCount: number;
  charCount: number;
  pageCount: number;
  previewText: string;
}

export async function convertPdfToDoc(
  file: File,
  options: PdfToDocOptions,
  onProgress?: (progress: number, status: string) => void
): Promise<DocConversionResult> {
  onProgress?.(5, "Reading PDF document...");

  const arrayBuffer = await file.arrayBuffer();
  const pdfJsDoc = await loadPdfDoc(arrayBuffer);
  const totalPages = pdfJsDoc.numPages;

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const docxParagraphs: Paragraph[] = [];
  const textPages: string[] = [];
  let totalWords = 0;
  let totalChars = 0;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const pct = 10 + Math.round(((pageNum - 1) / totalPages) * 75);
    onProgress?.(pct, `Extracting text from page ${pageNum} of ${totalPages}...`);

    const extracted = await extractPageTextContent(pdfJsDoc, pageNum);
    textPages.push(extracted.text);

    // Calculate words & chars
    const words = extracted.text.split(/\s+/).filter(Boolean);
    totalWords += words.length;
    totalChars += extracted.text.length;

    // Build Word paragraphs
    if (options.format === "docx") {
      // Add a page number notice or page header if multi-page
      if (pageNum > 1) {
        docxParagraphs.push(
          new Paragraph({
            pageBreakBefore: true,
            children: [
              new TextRun({
                text: `[Page ${pageNum}]`,
                color: "888888",
                size: 18,
                italics: true,
              }),
            ],
          })
        );
      }

      for (const line of extracted.lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Simple heuristic for headings: short line, capitalized, or no terminal period
        const isHeading =
          options.detectHeadings &&
          trimmed.length < 65 &&
          (trimmed.toUpperCase() === trimmed || !trimmed.endsWith(".")) &&
          trimmed.split(" ").length <= 8;

        if (isHeading) {
          docxParagraphs.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: trimmed,
                  bold: true,
                  size: 26,
                  color: "1e293b",
                }),
              ],
            })
          );
        } else {
          docxParagraphs.push(
            new Paragraph({
              spacing: { after: 120, line: 276 },
              children: [
                new TextRun({
                  text: trimmed,
                  size: 22,
                  font: "Calibri",
                }),
              ],
            })
          );
        }
      }
    }
  }

  onProgress?.(88, "Packaging document...");

  let resultBlob: Blob;
  let resultName: string;

  if (options.format === "docx") {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docxParagraphs.length > 0 ? docxParagraphs : [new Paragraph("No text detected in PDF")],
        },
      ],
    });

    const docxBuffer = await Packer.toBlob(doc);
    resultBlob = docxBuffer;
    resultName = `${baseName}.docx`;
  } else if (options.format === "md") {
    let mdContent = `# ${baseName}\n\n`;
    textPages.forEach((pageText, idx) => {
      mdContent += `\n---\n*Page ${idx + 1}*\n\n${pageText}\n`;
    });
    resultBlob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    resultName = `${baseName}.md`;
  } else {
    // Plain text
    let txtContent = "";
    textPages.forEach((pageText, idx) => {
      txtContent += `=== Page ${idx + 1} ===\n\n${pageText}\n\n`;
    });
    resultBlob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
    resultName = `${baseName}.txt`;
  }

  onProgress?.(100, "Conversion complete!");

  return {
    blob: resultBlob,
    format: options.format,
    fileName: resultName,
    wordCount: totalWords,
    charCount: totalChars,
    pageCount: totalPages,
    previewText: textPages.join("\n\n").substring(0, 3000),
  };
}
