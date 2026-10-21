"use client";

import { PDFDocument } from "pdf-lib";
import { loadPdfDoc, renderPageToCanvas } from "./pdfjsLoader";
import { CompressionOptions } from "@/types";

export interface CompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  ratio: number;
  pageCount: number;
}

export async function compressPdf(
  file: File,
  options: CompressionOptions,
  onProgress?: (progress: number, status: string) => void
): Promise<CompressionResult> {
  const originalSize = file.size;
  onProgress?.(5, "Loading PDF...");

  const arrayBuffer = await file.arrayBuffer();
  const pdfJsDoc = await loadPdfDoc(arrayBuffer);
  const pageCount = pdfJsDoc.numPages;

  // Determine target scale and quality based on options
  let scale = 1.5;
  let quality = 0.75;
  let colorMode = options.colorMode || "color";

  if (options.level === "extreme") {
    scale = 1.0; // ~72-96 DPI
    quality = 0.45;
  } else if (options.level === "recommended") {
    scale = 1.5; // ~144 DPI
    quality = 0.72;
  } else if (options.level === "light") {
    scale = 2.0; // ~190-220 DPI
    quality = 0.88;
  } else if (options.level === "custom") {
    // scale proportional to DPI (72 DPI = 1.0)
    scale = Math.max(0.5, Math.min(3.0, options.dpi / 72));
    quality = Math.max(0.1, Math.min(1.0, options.quality));
  }

  // Create new optimized PDFDocument
  const newPdf = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const progressPct = 10 + Math.round(((pageNum - 1) / pageCount) * 75);
    onProgress?.(progressPct, `Compressing page ${pageNum} of ${pageCount}...`);

    const canvas = await renderPageToCanvas(pdfJsDoc, pageNum, scale);

    // Apply grayscale if requested
    if (colorMode === "grayscale") {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);
      }
    }

    // Convert canvas to compressed JPEG blob/bytes
    const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
    const jpegBase64 = jpegDataUrl.split(",")[1];
    const jpegBytes = Uint8Array.from(atob(jpegBase64), (c) => c.charCodeAt(0));

    // Get original page viewport at 1x to maintain accurate points/dimensions
    const page = await pdfJsDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });

    const embeddedImage = await newPdf.embedJpg(jpegBytes);
    const newPage = newPdf.addPage([viewport.width, viewport.height]);

    newPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });
  }

  onProgress?.(90, "Optimizing PDF structure...");

  // Also strip metadata to minimize file size
  if (options.removeAnnotations) {
    newPdf.setTitle("");
    newPdf.setAuthor("");
    newPdf.setSubject("");
    newPdf.setKeywords([]);
    newPdf.setProducer("pdf.abishek.in");
    newPdf.setCreator("pdf.abishek.in");
  }

  const compressedBytes = await newPdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const compressedSize = blob.size;
  const ratio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

  onProgress?.(100, "Compression complete!");

  return {
    blob,
    originalSize,
    compressedSize,
    ratio,
    pageCount,
  };
}
