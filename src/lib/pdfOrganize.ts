"use client";

import { PDFDocument, degrees } from "pdf-lib";
import { PageOrganizeItem } from "@/types";

export async function organizePdf(
  file: File,
  pages: PageOrganizeItem[],
  onProgress?: (progress: number, status: string) => void
): Promise<Blob> {
  onProgress?.(10, "Loading PDF...");
  const fileBytes = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(fileBytes);
  const newPdf = await PDFDocument.create();

  // Filter out deleted pages and sort by currentOrder
  const activePages = pages.filter((p) => !p.deleted).sort((a, b) => a.currentOrder - b.currentOrder);

  if (activePages.length === 0) {
    throw new Error("Cannot create an empty PDF. Please keep at least one page.");
  }

  for (let i = 0; i < activePages.length; i++) {
    const item = activePages[i];
    const pct = 15 + Math.round((i / activePages.length) * 75);
    onProgress?.(pct, `Organizing page ${i + 1} of ${activePages.length}...`);

    const originalIndex = item.pageIndex - 1;
    const [copiedPage] = await newPdf.copyPages(srcPdf, [originalIndex]);

    // Apply rotation
    if (item.rotation) {
      const currentRotation = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((currentRotation + item.rotation) % 360));
    }

    newPdf.addPage(copiedPage);
  }

  onProgress?.(95, "Saving reorganized PDF...");
  const bytes = await newPdf.save({ useObjectStreams: true });
  onProgress?.(100, "Done!");

  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
