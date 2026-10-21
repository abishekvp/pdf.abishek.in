"use client";

import { PDFDocument } from "pdf-lib";

export async function mergePdfs(
  files: File[],
  onProgress?: (progress: number, status: string) => void
): Promise<Blob> {
  if (files.length < 2) {
    throw new Error("Please select at least 2 PDF files to merge.");
  }

  onProgress?.(5, "Initializing merged document...");
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const pct = 10 + Math.round(((i + 0.1) / files.length) * 80);
    onProgress?.(pct, `Merging ${file.name} (${i + 1} of ${files.length})...`);

    const fileBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(fileBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  onProgress?.(95, "Saving merged PDF...");
  const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
  onProgress?.(100, "Done!");

  return new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
