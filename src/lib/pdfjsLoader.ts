"use client";

let pdfjsLibInstance: typeof import("pdfjs-dist") | null = null;

export async function getPdfJs() {
  if (typeof window === "undefined") {
    throw new Error("pdfjs can only be loaded in the browser");
  }

  if (!pdfjsLibInstance) {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    pdfjsLibInstance = pdfjs;
  }
  return pdfjsLibInstance;
}

export async function loadPdfDoc(fileOrBuffer: File | ArrayBuffer | Uint8Array) {
  const pdfjs = await getPdfJs();
  let data: ArrayBuffer | Uint8Array;
  if (fileOrBuffer instanceof File) {
    data = await fileOrBuffer.arrayBuffer();
  } else {
    data = fileOrBuffer;
  }
  const loadingTask = pdfjs.getDocument({
    data,
    cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
    cMapPacked: true,
  });
  return await loadingTask.promise;
}

/** Render a single page onto an HTML canvas element */
export async function renderPageToCanvas(
  pdfDoc: any,
  pageNumber: number,
  scale: number = 1.5,
  canvas?: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const targetCanvas = canvas || document.createElement("canvas");
  targetCanvas.width = viewport.width;
  targetCanvas.height = viewport.height;

  const ctx = targetCanvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  // Fill white background (PDFs default to transparent in canvas)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, viewport.width, viewport.height);

  await page.render({
    canvasContext: ctx,
    viewport,
  }).promise;

  return targetCanvas;
}

/** Render a page to Image Data URL (png, jpeg, webp) */
export async function renderPageToDataUrl(
  pdfDoc: any,
  pageNumber: number,
  scale: number = 1.5,
  format: "png" | "jpeg" | "webp" = "jpeg",
  quality: number = 0.85
): Promise<string> {
  const canvas = await renderPageToCanvas(pdfDoc, pageNumber, scale);
  const mimeType = format === "png" ? "image/png" : format === "webp" ? "image/webp" : "image/jpeg";
  return canvas.toDataURL(mimeType, quality);
}

export interface ExtractedTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  hasEOL?: boolean;
}

export interface ExtractedPageText {
  pageNumber: number;
  text: string;
  lines: string[];
  items: ExtractedTextItem[];
}

/** Extract full text content with spatial coordinates */
export async function extractPageTextContent(
  pdfDoc: any,
  pageNumber: number
): Promise<ExtractedPageText> {
  const page = await pdfDoc.getPage(pageNumber);
  const content = await page.getTextContent();

  const items: ExtractedTextItem[] = [];
  const lineMap = new Map<number, string[]>();

  for (const item of content.items as any[]) {
    if (!item.str) continue;
    const y = Math.round(item.transform[5]);
    const x = Math.round(item.transform[4]);
    const height = Math.round(item.height || item.transform[0] || 12);

    items.push({
      str: item.str,
      x,
      y,
      width: Math.round(item.width || 0),
      height,
      fontName: item.fontName || "",
      hasEOL: item.hasEOL,
    });

    // Group text items by line (clustering nearby y coordinates within 4px)
    let foundLineKey: number | null = null;
    for (const key of lineMap.keys()) {
      if (Math.abs(key - y) <= 4) {
        foundLineKey = key;
        break;
      }
    }

    if (foundLineKey !== null) {
      lineMap.get(foundLineKey)!.push(item.str);
    } else {
      lineMap.set(y, [item.str]);
    }
  }

  // Sort lines from top (higher y in PDF coordinates) to bottom
  const sortedYKeys = Array.from(lineMap.keys()).sort((a, b) => b - a);
  const lines = sortedYKeys.map((y) => lineMap.get(y)!.join(" ").trim()).filter(Boolean);
  const text = lines.join("\n");

  return {
    pageNumber,
    text,
    lines,
    items,
  };
}
