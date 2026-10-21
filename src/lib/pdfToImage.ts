"use client";

import JSZip from "jszip";
import { loadPdfDoc, renderPageToCanvas } from "./pdfjsLoader";
import { PdfToImageOptions } from "@/types";
import { parsePageRanges } from "./utils";

export interface RenderedPageImage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export async function convertPdfToImages(
  file: File,
  options: PdfToImageOptions,
  onProgress?: (progress: number, status: string) => void
): Promise<{ pages: RenderedPageImage[]; zipBlob: Blob }> {
  onProgress?.(5, "Loading PDF file...");
  const arrayBuffer = await file.arrayBuffer();
  const pdfJsDoc = await loadPdfDoc(arrayBuffer);
  const totalPages = pdfJsDoc.numPages;

  let pagesToRender: number[] = [];
  if (options.pageRange === "custom" && options.customPages.trim()) {
    pagesToRender = parsePageRanges(options.customPages, totalPages);
    if (pagesToRender.length === 0) {
      pagesToRender = Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  } else {
    pagesToRender = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const mimeType =
    options.format === "png"
      ? "image/png"
      : options.format === "webp"
      ? "image/webp"
      : "image/jpeg";
  const ext = options.format;

  const results: RenderedPageImage[] = [];
  const zip = new JSZip();
  const baseName = file.name.replace(/\.[^/.]+$/, "");

  for (let i = 0; i < pagesToRender.length; i++) {
    const pageNum = pagesToRender[i];
    const pct = 10 + Math.round(((i + 0.1) / pagesToRender.length) * 80);
    onProgress?.(pct, `Rendering page ${pageNum} (${i + 1} of ${pagesToRender.length})...`);

    const canvas = await renderPageToCanvas(pdfJsDoc, pageNum, options.scale);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error(`Failed to convert page ${pageNum} to blob`));
        },
        mimeType,
        options.quality
      );
    });

    const dataUrl = canvas.toDataURL(mimeType, options.quality);

    results.push({
      pageNumber: pageNum,
      dataUrl,
      blob,
      width: canvas.width,
      height: canvas.height,
    });

    // Add to ZIP
    const paddedNum = String(pageNum).padStart(3, "0");
    zip.file(`${baseName}_page_${paddedNum}.${ext}`, blob);
  }

  onProgress?.(95, "Packaging ZIP archive...");
  const zipBlob = await zip.generateAsync({ type: "blob" });
  onProgress?.(100, "Done!");

  return {
    pages: results,
    zipBlob,
  };
}
