export type ToolId =
  | "compress"
  | "image-to-pdf"
  | "pdf-to-image"
  | "pdf-to-doc"
  | "doc-to-pdf"
  | "merge"
  | "split"
  | "organize"
  | "protect"
  | "unlock"
  | "watermark"
  | "sign";

export interface ToolMeta {
  id: ToolId;
  name: string;
  shortDesc: string;
  badge?: string;
  icon: string;
  color: string;
  accentBg: string;
  accept: string;
  multiple: boolean;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  pageCount?: number;
  thumbnailUrls?: string[];
  status: "idle" | "processing" | "success" | "error";
  error?: string;
  progress?: number;
  resultBlob?: Blob;
  resultName?: string;
  resultSize?: number;
  meta?: Record<string, any>;
}

// Compression options
export interface CompressionOptions {
  level: "extreme" | "recommended" | "light" | "custom";
  dpi: number;
  quality: number; // 0.1 to 1.0
  colorMode: "color" | "grayscale";
  removeAnnotations: boolean;
}

// Image to PDF options
export interface ImageToPdfOptions {
  orientation: "auto" | "portrait" | "landscape";
  pageSize: "a4" | "letter" | "fit";
  margin: "none" | "small" | "normal"; // 0mm, 10mm, 20mm
  imageFit: "contain" | "fill" | "original";
  quality: number;
  mergeIntoSingle: boolean;
}

// PDF to Image options
export interface PdfToImageOptions {
  format: "png" | "jpeg" | "webp";
  scale: number; // 1, 1.5, 2, 3
  quality: number; // for jpeg / webp
  pageRange: "all" | "custom";
  customPages: string; // e.g. "1, 3-5"
}

// PDF to Doc options
export interface PdfToDocOptions {
  format: "docx" | "txt" | "md";
  preserveLayout: boolean;
  detectHeadings: boolean;
}

// Doc to PDF options
export interface DocToPdfOptions {
  fontSize: number;
  lineHeight: number;
  margin: number;
  orientation: "portrait" | "landscape";
  pageSize: "a4" | "letter";
  includeHeader: boolean;
  includePageNumbers: boolean;
}

// Merge options
export interface MergeOptions {
  fileName: string;
}

// Split options
export interface SplitOptions {
  mode: "range" | "every" | "selected";
  ranges: string; // e.g. "1-3, 4-6"
  selectedPages: number[];
}

// Organize options
export interface PageOrganizeItem {
  pageIndex: number; // 1-based original index
  currentOrder: number;
  rotation: number; // 0, 90, 180, 270
  deleted: boolean;
  thumbnailUrl?: string;
}

// Protect / Unlock options
export interface ProtectOptions {
  userPassword?: string;
  ownerPassword?: string;
  allowPrinting: boolean;
  allowCopying: boolean;
}

// Watermark options
export interface WatermarkOptions {
  type: "text" | "image";
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  rotation: number; // -45, 0, 45, 90
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile";
}
