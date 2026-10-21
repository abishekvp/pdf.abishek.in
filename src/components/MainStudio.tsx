"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ToolId,
  UploadedFileItem,
  CompressionOptions,
  ImageToPdfOptions,
  PdfToImageOptions,
  PdfToDocOptions,
  DocToPdfOptions,
  SplitOptions,
  PageOrganizeItem,
  WatermarkOptions,
} from "@/types";
import { Header } from "./Header";
import { ToolSwitcherBar } from "./ToolSwitcherBar";
import { Dropzone } from "./Dropzone";
import { CompressorSettings } from "./tools/CompressorSettings";
import { ImageToPdfSettings } from "./tools/ImageToPdfSettings";
import { PdfToImageSettings } from "./tools/PdfToImageSettings";
import { PdfToDocSettings } from "./tools/PdfToDocSettings";
import { DocToPdfSettings } from "./tools/DocToPdfSettings";
import { MergeSettings } from "./tools/MergeSettings";
import { SplitSettings } from "./tools/SplitSettings";
import { OrganizeSettings } from "./tools/OrganizeSettings";
import { WatermarkSettings } from "./tools/WatermarkSettings";
import { ProtectSettings } from "./tools/ProtectSettings";
import { FeaturesSection } from "./FeaturesSection";
import { FaqSection } from "./FaqSection";
import { Footer } from "./Footer";
import { getToolMeta, TOOLS } from "@/lib/toolRegistry";
import { formatBytes, formatPercent, downloadBlob } from "@/lib/utils";
import { compressPdf } from "@/lib/pdfCompressor";
import { convertImagesToPdf } from "@/lib/imageToPdf";
import { convertPdfToImages, RenderedPageImage } from "@/lib/pdfToImage";
import { convertPdfToDoc, DocConversionResult } from "@/lib/pdfToDoc";
import { convertDocToPdf } from "@/lib/docToPdf";
import { mergePdfs } from "@/lib/pdfMerge";
import { splitPdf } from "@/lib/pdfSplit";
import { organizePdf } from "@/lib/pdfOrganize";
import { addWatermarkToPdf } from "@/lib/pdfWatermark";
import { protectPdf, unlockPdf } from "@/lib/pdfProtect";
import { loadPdfDoc, renderPageToDataUrl } from "@/lib/pdfjsLoader";
import {
  FileText,
  Download,
  Trash2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Maximize2,
  RotateCw,
  Eye,
  Copy,
  Check,
  Plus,
} from "lucide-react";

export function MainStudio() {
  const [activeTool, setActiveTool] = useState<ToolId>("compress");
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("");
  const [resultSize, setResultSize] = useState<number>(0);
  const [renderedImages, setRenderedImages] = useState<RenderedPageImage[]>([]);
  const [docResult, setDocResult] = useState<DocConversionResult | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Tool-specific options
  const [compressionOpts, setCompressionOpts] = useState<CompressionOptions>({
    level: "recommended",
    dpi: 150,
    quality: 0.72,
    colorMode: "color",
    removeAnnotations: true,
  });

  const [imageToPdfOpts, setImageToPdfOpts] = useState<ImageToPdfOptions>({
    orientation: "auto",
    pageSize: "a4",
    margin: "none",
    imageFit: "contain",
    quality: 0.9,
    mergeIntoSingle: true,
  });

  const [pdfToImageOpts, setPdfToImageOpts] = useState<PdfToImageOptions>({
    format: "png",
    scale: 2.0,
    quality: 0.9,
    pageRange: "all",
    customPages: "",
  });

  const [pdfToDocOpts, setPdfToDocOpts] = useState<PdfToDocOptions>({
    format: "docx",
    preserveLayout: true,
    detectHeadings: true,
  });

  const [docToPdfOpts, setDocToPdfOpts] = useState<DocToPdfOptions>({
    fontSize: 11,
    lineHeight: 1.45,
    margin: 40,
    orientation: "portrait",
    pageSize: "a4",
    includeHeader: true,
    includePageNumbers: true,
  });

  const [splitOpts, setSplitOpts] = useState<SplitOptions>({
    mode: "range",
    ranges: "1",
    selectedPages: [],
  });

  const [organizePages, setOrganizePages] = useState<PageOrganizeItem[]>([]);

  const [watermarkOpts, setWatermarkOpts] = useState<WatermarkOptions>({
    type: "text",
    text: "CONFIDENTIAL",
    fontSize: 48,
    color: "#ef4444",
    opacity: 0.25,
    rotation: -45,
    position: "center",
  });

  const [protectPassword, setProtectPassword] = useState("");

  const currentToolMeta = getToolMeta(activeTool);

  // Handle new files
  const handleFilesSelected = async (newRawFiles: File[]) => {
    setErrorMsg(null);
    setResultBlob(null);
    setRenderedImages([]);
    setDocResult(null);

    const items: UploadedFileItem[] = [];

    for (const file of newRawFiles) {
      const item: UploadedFileItem = {
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "idle",
      };

      // Generate preview for images
      if (file.type.startsWith("image/")) {
        item.previewUrl = URL.createObjectURL(file);
      }

      items.push(item);
    }

    if (currentToolMeta.multiple) {
      setFiles((prev) => [...prev, ...items]);
    } else {
      setFiles(items.slice(0, 1));
    }

    // If PDF file, load thumbnail and page count in background
    const primaryFile = items[0]?.file;
    if (primaryFile && primaryFile.type.includes("pdf")) {
      try {
        const doc = await loadPdfDoc(primaryFile);
        const count = doc.numPages;

        // Generate thumbnails for up to 12 pages
        const thumbs: string[] = [];
        const orgItems: PageOrganizeItem[] = [];

        for (let p = 1; p <= Math.min(count, 12); p++) {
          const thumb = await renderPageToDataUrl(doc, p, 0.4, "jpeg", 0.6);
          thumbs.push(thumb);
          orgItems.push({
            pageIndex: p,
            currentOrder: p,
            rotation: 0,
            deleted: false,
            thumbnailUrl: thumb,
          });
        }

        setOrganizePages(orgItems);
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === 0 ? { ...f, pageCount: count, thumbnailUrls: thumbs } : f
          )
        );
      } catch (err) {
        console.warn("Could not extract PDF thumbnails", err);
      }
    }
  };

  const handleClearFiles = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setFiles([]);
    setResultBlob(null);
    setResultFileName("");
    setRenderedImages([]);
    setDocResult(null);
    setErrorMsg(null);
    setProgress(0);
    setProgressStatus("");
  };

  const handleToolChange = (toolId: ToolId) => {
    setActiveTool(toolId);
    handleClearFiles();
  };

  // Process Action
  const handleProcess = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setProgressStatus("Preparing...");
    setErrorMsg(null);
    setResultBlob(null);
    setRenderedImages([]);
    setDocResult(null);

    try {
      if (activeTool === "compress") {
        const res = await compressPdf(files[0].file, compressionOpts, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setResultBlob(res.blob);
        setResultFileName(`compressed_${files[0].name}`);
        setResultSize(res.compressedSize);
      } else if (activeTool === "image-to-pdf") {
        const rawFiles = files.map((f) => f.file);
        const blob = await convertImagesToPdf(rawFiles, imageToPdfOpts, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setResultBlob(blob);
        setResultFileName("images_combined.pdf");
        setResultSize(blob.size);
      } else if (activeTool === "pdf-to-image") {
        const res = await convertPdfToImages(files[0].file, pdfToImageOpts, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setRenderedImages(res.pages);
        setResultBlob(res.zipBlob);
        setResultFileName(`${files[0].name.replace(/\.[^/.]+$/, "")}_images.zip`);
        setResultSize(res.zipBlob.size);
      } else if (activeTool === "pdf-to-doc") {
        const res = await convertPdfToDoc(files[0].file, pdfToDocOpts, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setDocResult(res);
        setResultBlob(res.blob);
        setResultFileName(res.fileName);
        setResultSize(res.blob.size);
      } else if (activeTool === "doc-to-pdf") {
        const res = await convertDocToPdf(files[0].file, docToPdfOpts, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setResultBlob(res.blob);
        setResultFileName(res.fileName);
        setResultSize(res.blob.size);
      } else if (activeTool === "merge") {
        const rawFiles = files.map((f) => f.file);
        const blob = await mergePdfs(rawFiles, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setResultBlob(blob);
        setResultFileName("merged_document.pdf");
        setResultSize(blob.size);
      } else if (activeTool === "split") {
        const res = await splitPdf(files[0].file, splitOpts, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setResultBlob(res.blob);
        setResultFileName(res.fileName);
        setResultSize(res.blob.size);
      } else if (activeTool === "organize") {
        const blob = await organizePdf(files[0].file, organizePages, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setResultBlob(blob);
        setResultFileName(`organized_${files[0].name}`);
        setResultSize(blob.size);
      } else if (activeTool === "watermark") {
        const blob = await addWatermarkToPdf(files[0].file, watermarkOpts, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setResultBlob(blob);
        setResultFileName(`watermarked_${files[0].name}`);
        setResultSize(blob.size);
      } else if (activeTool === "protect") {
        if (!protectPassword) throw new Error("Please enter a password to protect the document.");
        const blob = await protectPdf(files[0].file, protectPassword, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setResultBlob(blob);
        setResultFileName(`protected_${files[0].name}`);
        setResultSize(blob.size);
      } else if (activeTool === "unlock") {
        if (!protectPassword) throw new Error("Please enter the document password to unlock.");
        const blob = await unlockPdf(files[0].file, protectPassword, (p, s) => {
          setProgress(p);
          setProgressStatus(s);
        });
        setResultBlob(blob);
        setResultFileName(`unlocked_${files[0].name}`);
        setResultSize(blob.size);
      }
    } catch (err: any) {
      console.error("Processing failed", err);
      setErrorMsg(err.message || "An unexpected error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob && resultFileName) {
      downloadBlob(resultBlob, resultFileName);
    }
  };

  const totalInputSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="min-h-screen flex flex-col bg-surface-darkest text-slate-100">
      <Header activeTool={activeTool} onSelectTool={handleToolChange} />
      <ToolSwitcherBar activeTool={activeTool} onSelectTool={handleToolChange} />

      {/* Main Container - Full Screen Width */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {files.length === 0 ? (
          /* Empty / Upload View */
          <div className="space-y-12">
            {/* Tool Title & Tagline */}
            <div className="text-center max-w-3xl mx-auto pt-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentToolMeta.name} Studio</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
                {currentToolMeta.name}
              </h1>
              <p className="text-base sm:text-lg text-slate-400">
                {currentToolMeta.shortDesc}. High speed, client-side, zero cloud uploads.
              </p>
            </div>

            {/* Dropzone */}
            <Dropzone tool={currentToolMeta} onFilesSelected={handleFilesSelected} />

            {/* Other Popular Tools Quick Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Popular PDF Utilities
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {TOOLS.filter((t) => t.id !== activeTool)
                  .slice(0, 8)
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleToolChange(t.id)}
                      className="p-4 rounded-2xl bg-surface-card hover:bg-surface-subtle border border-surface-border hover:border-slate-600 text-left transition-all group flex items-start gap-3.5 cursor-pointer shadow-md"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: `${t.color}20`, color: t.color }}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs sm:text-sm font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {t.shortDesc}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Features & FAQ */}
            <FeaturesSection />
            <FaqSection />
          </div>
        ) : (
          /* High-Visibility Full Screen Studio Workspace */
          <div className="space-y-6">
            {/* Top Workspace Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface-card border border-surface-border">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: `${currentToolMeta.color}20`,
                    color: currentToolMeta.color,
                  }}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">
                      {files.length === 1 ? files[0].name : `${files.length} Files Selected`}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-subtle border border-surface-border text-slate-300 font-mono">
                      {formatBytes(totalInputSize)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Mode: {currentToolMeta.name} • 100% Client-Side
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearFiles}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-subtle hover:bg-surface-hover text-slate-300 hover:text-white border border-surface-border text-xs font-semibold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Clear & Restart</span>
                </button>
              </div>
            </div>

            {/* 2-Column Full Screen Grid: Left Preview Canvas, Right Settings Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Canvas / Thumbnails / Live Viewer) - Takes 7 of 12 columns */}
              <div className="lg:col-span-7 bg-surface-card rounded-3xl border border-surface-border p-5 sm:p-6 min-h-[500px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-rose-400" />
                      <span>Document Canvas & Preview</span>
                    </h3>
                    {files[0]?.pageCount && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-subtle text-slate-300 border border-surface-border">
                        {files[0].pageCount} {files[0].pageCount === 1 ? "Page" : "Pages"}
                      </span>
                    )}
                  </div>

                  {/* PDF to Image Rendered Previews Gallery */}
                  {renderedImages.length > 0 && (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                        <span>Converted Image Pages ({renderedImages.length})</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto p-1">
                        {renderedImages.map((img) => (
                          <div
                            key={img.pageNumber}
                            className="group relative rounded-xl overflow-hidden border border-surface-border bg-surface-darkest p-2"
                          >
                            <img
                              src={img.dataUrl}
                              alt={`Page ${img.pageNumber}`}
                              className="w-full h-auto rounded object-contain max-h-[160px] mx-auto"
                            />
                            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                              <span>Page {img.pageNumber}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  downloadBlob(
                                    img.blob,
                                    `page_${img.pageNumber}.${pdfToImageOpts.format}`
                                  )
                                }
                                className="text-cyan-400 hover:text-cyan-300 font-bold"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PDF to Doc Text Preview */}
                  {docResult && (
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-violet-400">
                          Extracted Text Preview ({docResult.wordCount} words)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(docResult.previewText);
                            setCopiedText(true);
                            setTimeout(() => setCopiedText(false), 2000);
                          }}
                          className="flex items-center gap-1 text-xs text-slate-300 hover:text-white"
                        >
                          {copiedText ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        readOnly
                        value={docResult.previewText}
                        rows={10}
                        className="w-full p-4 rounded-xl bg-surface-darkest border border-surface-border text-xs text-slate-300 font-mono resize-none focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Organize Page Reordering Grid */}
                  {activeTool === "organize" && organizePages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto p-1">
                      {organizePages.map((page) => (
                        <div
                          key={page.pageIndex}
                          className={`relative rounded-xl border p-2 transition-all ${
                            page.deleted
                              ? "opacity-30 border-red-500/50 bg-red-950/20"
                              : "border-surface-border bg-surface-darkest"
                          }`}
                        >
                          {page.thumbnailUrl ? (
                            <img
                              src={page.thumbnailUrl}
                              alt={`Page ${page.pageIndex}`}
                              style={{ transform: `rotate(${page.rotation}deg)` }}
                              className="w-full h-auto rounded max-h-[140px] object-contain mx-auto transition-transform"
                            />
                          ) : (
                            <div className="h-32 flex items-center justify-center text-slate-500 text-xs">
                              Page {page.pageIndex}
                            </div>
                          )}

                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-bold">
                              #{page.pageIndex}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setOrganizePages((prev) =>
                                    prev.map((p) =>
                                      p.pageIndex === page.pageIndex
                                        ? { ...p, rotation: (p.rotation + 90) % 360 }
                                        : p
                                    )
                                  )
                                }
                                className="p-1 rounded hover:bg-surface-subtle text-indigo-400"
                                title="Rotate 90°"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setOrganizePages((prev) =>
                                    prev.map((p) =>
                                      p.pageIndex === page.pageIndex
                                        ? { ...p, deleted: !p.deleted }
                                        : p
                                    )
                                  )
                                }
                                className={`p-1 rounded hover:bg-surface-subtle ${
                                  page.deleted ? "text-emerald-400" : "text-rose-400"
                                }`}
                                title={page.deleted ? "Restore" : "Delete"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Standard Image or Document Preview Cards */}
                  {activeTool !== "organize" &&
                    renderedImages.length === 0 &&
                    !docResult && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {files.map((item, idx) => (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-surface-border bg-surface-darkest/70 p-4 flex flex-col justify-between"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center text-slate-300 text-xs font-bold">
                                {idx + 1}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-white truncate">
                                  {item.name}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {formatBytes(item.size)}
                                </div>
                              </div>
                            </div>

                            {item.previewUrl ? (
                              <img
                                src={item.previewUrl}
                                alt={item.name}
                                className="w-full max-h-48 rounded-lg object-contain bg-surface-base"
                              />
                            ) : item.thumbnailUrls && item.thumbnailUrls[0] ? (
                              <img
                                src={item.thumbnailUrls[0]}
                                alt="Page 1 Preview"
                                className="w-full max-h-48 rounded-lg object-contain bg-white"
                              />
                            ) : (
                              <div className="h-40 rounded-xl bg-surface-card border border-surface-border/50 flex flex-col items-center justify-center text-center p-4">
                                <FileText className="w-8 h-8 text-slate-500 mb-2" />
                                <span className="text-xs font-semibold text-slate-300">
                                  Ready to Process
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {item.type || "Document"}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                {/* Bottom Canvas Stats */}
                <div className="pt-4 mt-4 border-t border-surface-border/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Loaded in browser memory</span>
                  </div>
                  <div>Zero server uploads • 100% Private</div>
                </div>
              </div>

              {/* Right Column: High-Visibility Settings & Processing Panel - Takes 5 of 12 columns */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-surface-card rounded-3xl border border-surface-border p-6 shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 pb-3 border-b border-surface-border flex items-center justify-between">
                    <span>{currentToolMeta.name} Options</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Settings
                    </span>
                  </h3>

                  {/* Tool-specific settings rendering */}
                  {activeTool === "compress" && (
                    <CompressorSettings
                      options={compressionOpts}
                      onChange={setCompressionOpts}
                    />
                  )}

                  {activeTool === "image-to-pdf" && (
                    <ImageToPdfSettings
                      options={imageToPdfOpts}
                      onChange={setImageToPdfOpts}
                      fileCount={files.length}
                    />
                  )}

                  {activeTool === "pdf-to-image" && (
                    <PdfToImageSettings
                      options={pdfToImageOpts}
                      onChange={setPdfToImageOpts}
                      pageCount={files[0]?.pageCount || 1}
                    />
                  )}

                  {activeTool === "pdf-to-doc" && (
                    <PdfToDocSettings
                      options={pdfToDocOpts}
                      onChange={setPdfToDocOpts}
                    />
                  )}

                  {activeTool === "doc-to-pdf" && (
                    <DocToPdfSettings
                      options={docToPdfOpts}
                      onChange={setDocToPdfOpts}
                    />
                  )}

                  {activeTool === "merge" && (
                    <MergeSettings
                      files={files}
                      onReorder={(from, to) => {
                        const updated = [...files];
                        const [moved] = updated.splice(from, 1);
                        updated.splice(to, 0, moved);
                        setFiles(updated);
                      }}
                      onRemove={(id) => setFiles(files.filter((f) => f.id !== id))}
                      onAddMore={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".pdf";
                        input.multiple = true;
                        input.onchange = (e: any) => {
                          if (e.target.files) {
                            handleFilesSelected(Array.from(e.target.files));
                          }
                        };
                        input.click();
                      }}
                    />
                  )}

                  {activeTool === "split" && (
                    <SplitSettings
                      options={splitOpts}
                      onChange={setSplitOpts}
                      pageCount={files[0]?.pageCount || 1}
                    />
                  )}

                  {activeTool === "organize" && (
                    <OrganizeSettings
                      pages={organizePages}
                      onRotatePage={(pageIndex, deltaDeg) =>
                        setOrganizePages((prev) =>
                          prev.map((p) =>
                            p.pageIndex === pageIndex
                              ? { ...p, rotation: (p.rotation + deltaDeg) % 360 }
                              : p
                          )
                        )
                      }
                      onRotateAll={(deltaDeg) =>
                        setOrganizePages((prev) =>
                          prev.map((p) => ({
                            ...p,
                            rotation: (p.rotation + deltaDeg) % 360,
                          }))
                        )
                      }
                      onToggleDelete={(pageIndex) =>
                        setOrganizePages((prev) =>
                          prev.map((p) =>
                            p.pageIndex === pageIndex
                              ? { ...p, deleted: !p.deleted }
                              : p
                          )
                        )
                      }
                      onReset={() =>
                        setOrganizePages((prev) =>
                          prev.map((p) => ({
                            ...p,
                            rotation: 0,
                            deleted: false,
                          }))
                        )
                      }
                    />
                  )}

                  {activeTool === "watermark" && (
                    <WatermarkSettings
                      options={watermarkOpts}
                      onChange={setWatermarkOpts}
                    />
                  )}

                  {(activeTool === "protect" || activeTool === "unlock") && (
                    <ProtectSettings
                      isUnlockMode={activeTool === "unlock"}
                      password={protectPassword}
                      onPasswordChange={setProtectPassword}
                    />
                  )}

                  {/* Progress & Error Notification */}
                  {isProcessing && (
                    <div className="mt-6 p-4 rounded-2xl bg-surface-darkest border border-rose-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                          <span>{progressStatus || "Processing document..."}</span>
                        </span>
                        <span className="text-rose-400 font-mono">{progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-600 to-pink-500 transition-all duration-200"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Success & Download Card */}
                  {resultBlob && (
                    <div className="mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Processed Successfully!</span>
                        </div>
                        {activeTool === "compress" && resultSize > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                            {formatPercent(totalInputSize, resultSize)}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-300 flex items-center justify-between border-y border-surface-border/50 py-2.5">
                        <span className="truncate max-w-[220px] font-semibold">
                          {resultFileName}
                        </span>
                        <span className="font-mono text-emerald-300">
                          {formatBytes(resultSize)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 hover:shadow-emerald-600/30 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Result</span>
                      </button>
                    </div>
                  )}

                  {/* Primary Convert / Process Button */}
                  {!resultBlob && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleProcess}
                      className="mt-6 w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-base shadow-xl shadow-rose-950/60 hover:shadow-rose-600/40 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>{currentToolMeta.name} Now</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
