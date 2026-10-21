"use client";

import { PDFDocument } from "pdf-lib";
import { ImageToPdfOptions } from "@/types";

const PAGE_SIZES: Record<string, [number, number]> = {
  a4: [595.28, 841.89], // points (72 pt/in)
  letter: [612.0, 792.0],
};

const MARGINS: Record<string, number> = {
  none: 0,
  small: 28.35, // ~10mm
  normal: 56.7, // ~20mm
};

/** Load an image file into an HTMLImageElement */
function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}

/** Convert any image element to JPEG/PNG bytes using canvas */
function convertImageToBytes(
  img: HTMLImageElement,
  format: "jpeg" | "png" = "jpeg",
  quality: number = 0.92
): Promise<Uint8Array> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const mime = format === "png" ? "image/png" : "image/jpeg";
    const dataUrl = canvas.toDataURL(mime, quality);
    const base64 = dataUrl.split(",")[1];
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    resolve(bytes);
  });
}

export async function convertImagesToPdf(
  files: File[],
  options: ImageToPdfOptions,
  onProgress?: (progress: number, status: string) => void
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const pct = Math.round(((i + 0.1) / total) * 90);
    onProgress?.(pct, `Processing image ${i + 1} of ${total} (${file.name})...`);

    const img = await loadImageElement(file);
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const isLandscape = imgWidth > imgHeight;

    // Convert image to bytes
    const isPng = file.type === "image/png";
    const bytes = await convertImageToBytes(img, isPng ? "png" : "jpeg", options.quality);
    const embeddedImage = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);

    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === "fit") {
      pageWidth = imgWidth;
      pageHeight = imgHeight;
    } else {
      const baseSize = PAGE_SIZES[options.pageSize] || PAGE_SIZES.a4;
      if (options.orientation === "landscape" || (options.orientation === "auto" && isLandscape)) {
        pageWidth = Math.max(baseSize[0], baseSize[1]);
        pageHeight = Math.min(baseSize[0], baseSize[1]);
      } else {
        pageWidth = Math.min(baseSize[0], baseSize[1]);
        pageHeight = Math.max(baseSize[0], baseSize[1]);
      }
    }

    const margin = options.pageSize === "fit" ? 0 : MARGINS[options.margin] ?? MARGINS.none;
    const availWidth = Math.max(10, pageWidth - margin * 2);
    const availHeight = Math.max(10, pageHeight - margin * 2);

    let drawWidth = availWidth;
    let drawHeight = availHeight;
    let drawX = margin;
    let drawY = margin;

    if (options.imageFit === "contain") {
      const scaleX = availWidth / imgWidth;
      const scaleY = availHeight / imgHeight;
      const fitScale = Math.min(scaleX, scaleY);

      drawWidth = imgWidth * fitScale;
      drawHeight = imgHeight * fitScale;
      drawX = margin + (availWidth - drawWidth) / 2;
      drawY = margin + (availHeight - drawHeight) / 2;
    } else if (options.imageFit === "original") {
      drawWidth = Math.min(availWidth, imgWidth);
      drawHeight = Math.min(availHeight, imgHeight);
      drawX = margin + (availWidth - drawWidth) / 2;
      drawY = margin + (availHeight - drawHeight) / 2;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });
  }

  onProgress?.(95, "Generating PDF document...");
  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  onProgress?.(100, "Done!");

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
