"use client";

import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { SplitOptions } from "@/types";
import { parsePageRanges } from "./utils";

export async function splitPdf(
  file: File,
  options: SplitOptions,
  onProgress?: (progress: number, status: string) => void
): Promise<{ blob: Blob; fileName: string; isZip: boolean }> {
  onProgress?.(5, "Reading PDF...");
  const fileBytes = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(fileBytes);
  const totalPages = srcPdf.getPageCount();
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  if (options.mode === "every") {
    // Split each page into individual PDF
    const zip = new JSZip();

    for (let i = 0; i < totalPages; i++) {
      const pageNum = i + 1;
      const pct = 10 + Math.round((i / totalPages) * 80);
      onProgress?.(pct, `Splitting page ${pageNum} of ${totalPages}...`);

      const singleDoc = await PDFDocument.create();
      const [copiedPage] = await singleDoc.copyPages(srcPdf, [i]);
      singleDoc.addPage(copiedPage);

      const bytes = await singleDoc.save({ useObjectStreams: true });
      const paddedNum = String(pageNum).padStart(3, "0");
      zip.file(`${baseName}_page_${paddedNum}.pdf`, bytes);
    }

    onProgress?.(95, "Zipping split files...");
    const zipBlob = await zip.generateAsync({ type: "blob" });
    onProgress?.(100, "Done!");
    return {
      blob: zipBlob,
      fileName: `${baseName}_split_pages.zip`,
      isZip: true,
    };
  } else {
    // Mode is range or selected
    let targetPages: number[] = [];
    if (options.mode === "selected" && options.selectedPages.length > 0) {
      targetPages = options.selectedPages;
    } else {
      targetPages = parsePageRanges(options.ranges || "1", totalPages);
    }

    if (targetPages.length === 0) {
      throw new Error("No valid pages specified for extraction.");
    }

    const newDoc = await PDFDocument.create();
    // Convert 1-based page numbers to 0-based page indices
    const pageIndices = targetPages.map((p) => p - 1).filter((idx) => idx >= 0 && idx < totalPages);

    const copiedPages = await newDoc.copyPages(srcPdf, pageIndices);
    copiedPages.forEach((p) => newDoc.addPage(p));

    const bytes = await newDoc.save({ useObjectStreams: true });
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
    onProgress?.(100, "Done!");

    return {
      blob,
      fileName: `${baseName}_extracted.pdf`,
      isZip: false,
    };
  }
}
