"use client";

import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { WatermarkOptions } from "@/types";

export async function addWatermarkToPdf(
  file: File,
  options: WatermarkOptions,
  onProgress?: (progress: number, status: string) => void
): Promise<Blob> {
  onProgress?.(10, "Loading PDF...");
  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  // Convert hex color to rgb
  const hex = options.color.replace("#", "");
  const r = parseInt(hex.substring(0, 2) || "ff", 16) / 255;
  const g = parseInt(hex.substring(2, 4) || "00", 16) / 255;
  const b = parseInt(hex.substring(4, 6) || "00", 16) / 255;
  const opacity = options.opacity || 0.3;
  const fontSize = options.fontSize || 48;
  const text = options.text || "CONFIDENTIAL";
  const rot = degrees(options.rotation || -45);

  for (let i = 0; i < total; i++) {
    const pct = 15 + Math.round((i / total) * 75);
    onProgress?.(pct, `Applying watermark to page ${i + 1} of ${total}...`);

    const page = pages[i];
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    if (options.position === "tile") {
      // Draw grid of repeated watermarks
      const stepX = textWidth + 120;
      const stepY = textHeight + 100;
      for (let x = -width / 2; x < width * 1.5; x += stepX) {
        for (let y = -height / 2; y < height * 1.5; y += stepY) {
          page.drawText(text, {
            x,
            y,
            size: fontSize * 0.75,
            font,
            color: rgb(r, g, b),
            opacity: opacity * 0.7,
            rotate: rot,
          });
        }
      }
    } else {
      let x = (width - textWidth) / 2;
      let y = (height - textHeight) / 2;

      if (options.position === "top-left") {
        x = 50;
        y = height - 80;
      } else if (options.position === "top-right") {
        x = width - textWidth - 50;
        y = height - 80;
      } else if (options.position === "bottom-left") {
        x = 50;
        y = 50;
      } else if (options.position === "bottom-right") {
        x = width - textWidth - 50;
        y = 50;
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(r, g, b),
        opacity,
        rotate: rot,
      });
    }
  }

  onProgress?.(95, "Saving watermarked PDF...");
  const bytes = await pdfDoc.save({ useObjectStreams: true });
  onProgress?.(100, "Done!");

  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
