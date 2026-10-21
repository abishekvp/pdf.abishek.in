"use client";

import jsPDF from "jspdf";
import mammoth from "mammoth";
import { DocToPdfOptions } from "@/types";

export interface DocToPdfResult {
  blob: Blob;
  pageCount: number;
  fileName: string;
  wordCount: number;
}

export async function convertDocToPdf(
  file: File,
  options: DocToPdfOptions,
  onProgress?: (progress: number, status: string) => void
): Promise<DocToPdfResult> {
  onProgress?.(10, `Parsing document: ${file.name}...`);

  let textContent = "";
  const isDocx = file.name.endsWith(".docx");

  if (isDocx) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      textContent = result.value;
    } catch (err) {
      console.warn("Mammoth parse failed, falling back to text reader", err);
      textContent = await file.text();
    }
  } else {
    textContent = await file.text();
  }

  onProgress?.(35, "Formatting pages and typography...");

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const doc = new jsPDF({
    orientation: options.orientation || "portrait",
    unit: "pt",
    format: options.pageSize || "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = options.margin || 40;
  const contentWidth = pageWidth - margin * 2;
  const topMargin = options.includeHeader ? margin + 25 : margin;
  const bottomMargin = margin + 25;
  const maxContentHeight = pageHeight - bottomMargin;

  const fontSize = options.fontSize || 11;
  const lineHeight = fontSize * (options.lineHeight || 1.45);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);

  // Split lines and paragraphs
  const rawParagraphs = textContent.split(/\r?\n/);
  const words = textContent.split(/\s+/).filter(Boolean);

  let currentY = topMargin;
  let pageCount = 1;

  const drawHeaderAndFooter = (pageNum: number) => {
    // Header
    if (options.includeHeader) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(baseName, margin, margin - 10);
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, margin - 5, pageWidth - margin, margin - 5);
    }

    // Footer
    if (options.includePageNumbers) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      const footerText = `Page ${pageNum}`;
      const textWidth = doc.getTextWidth(footerText);
      doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - margin + 15);
    }

    // Reset styles for content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(25, 25, 25);
  };

  drawHeaderAndFooter(1);

  for (let p = 0; p < rawParagraphs.length; p++) {
    const paragraph = rawParagraphs[p].trim();

    if (p % 20 === 0) {
      const pct = 35 + Math.round((p / rawParagraphs.length) * 55);
      onProgress?.(pct, `Generating page ${pageCount}...`);
    }

    if (!paragraph) {
      currentY += lineHeight * 0.7;
      continue;
    }

    // Check if paragraph looks like a heading
    const isHeading =
      paragraph.length < 60 &&
      (paragraph.toUpperCase() === paragraph || /^[0-9]+\.\s+[A-Z]/.test(paragraph));

    if (isHeading) {
      currentY += lineHeight * 0.5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize + 3);
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(30, 41, 59);
    }

    const wrappedLines: string[] = doc.splitTextToSize(paragraph, contentWidth);

    for (const line of wrappedLines) {
      if (currentY + lineHeight > maxContentHeight) {
        doc.addPage();
        pageCount++;
        drawHeaderAndFooter(pageCount);
        currentY = topMargin;
      }

      doc.text(line, margin, currentY);
      currentY += lineHeight;
    }

    // Reset heading styles
    if (isHeading) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(30, 41, 59);
    }

    // Space after paragraph
    currentY += lineHeight * 0.4;
  }

  onProgress?.(95, "Finalizing PDF...");
  const pdfBlob = doc.output("blob");
  onProgress?.(100, "Done!");

  return {
    blob: pdfBlob,
    pageCount,
    fileName: `${baseName}.pdf`,
    wordCount: words.length,
  };
}
