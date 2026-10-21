"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Sparkles,
  Shield,
  Zap,
  Image,
  ArrowRight,
} from "lucide-react";
import { ToolMeta } from "@/types";
import { createSamplePdf, createSampleImage, createSampleDoc } from "@/lib/sampleFiles";

interface DropzoneProps {
  tool: ToolMeta;
  onFilesSelected: (files: File[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ tool, onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (tool.multiple) {
        onFilesSelected(droppedFiles);
      } else {
        onFilesSelected([droppedFiles[0]]);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onFilesSelected(tool.multiple ? selected : [selected[0]]);
      e.target.value = "";
    }
  };

  const handleLoadSample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGeneratingSample(true);
    try {
      if (tool.id === "image-to-pdf") {
        const sampleImg = await createSampleImage("presentation-graphic.jpg", 1400, 900);
        onFilesSelected([sampleImg]);
      } else if (tool.id === "doc-to-pdf") {
        const sampleDoc = createSampleDoc("strategic-plan-2026.txt");
        onFilesSelected([sampleDoc]);
      } else {
        const samplePdf = await createSamplePdf(`${tool.name} Demonstration Report`, 3);
        onFilesSelected([samplePdf]);
      }
    } catch (err) {
      console.error("Failed to generate sample file", err);
    } finally {
      setIsGeneratingSample(false);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group w-full min-h-[380px] lg:min-h-[460px] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 sm:p-12 text-center cursor-pointer select-none overflow-hidden ${
          isDragging
            ? "border-rose-500 bg-rose-500/10 shadow-2xl shadow-rose-950/60 scale-[1.008]"
            : "border-surface-border hover:border-rose-500/60 bg-surface-card/70 hover:bg-surface-card/95 shadow-xl shadow-surface-darkest/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={tool.accept}
          multiple={tool.multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Subtle decorative background ambient glow */}
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 opacity-20 group-hover:opacity-40"
          style={{ backgroundColor: tool.color }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 opacity-15 group-hover:opacity-35"
          style={{ backgroundColor: "#e11d48" }}
        />

        {/* Center icon */}
        <div className="relative mb-6">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center p-0.5 shadow-2xl transition-transform group-hover:scale-110 duration-300"
            style={{
              background: `linear-gradient(135deg, ${tool.color}, #e11d48)`,
            }}
          >
            <div className="w-full h-full bg-surface-card rounded-[22px] flex items-center justify-center">
              <UploadCloud
                className="w-10 h-10 sm:w-12 sm:h-12 transition-colors"
                style={{ color: tool.color }}
              />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface-darkest border-2 border-surface-card flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Headlines */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 max-w-xl">
          {tool.id === "compress" && "Drop PDF here to compress & reduce size"}
          {tool.id === "image-to-pdf" && "Drop images (JPG, PNG, WebP) to combine into PDF"}
          {tool.id === "pdf-to-image" && "Drop PDF here to extract high-res images"}
          {tool.id === "pdf-to-doc" && "Drop PDF to convert to Word (.docx) & text"}
          {tool.id === "doc-to-pdf" && "Drop Word document (.docx, .txt) to convert to PDF"}
          {tool.id === "merge" && "Drop PDF files here to merge into one"}
          {tool.id === "split" && "Drop PDF here to split or extract pages"}
          {tool.id === "organize" && "Drop PDF here to organize, rotate & reorder"}
          {tool.id === "watermark" && "Drop PDF here to stamp custom watermark"}
          {tool.id === "protect" && "Drop PDF here to encrypt with password"}
          {tool.id === "unlock" && "Drop PDF here to remove password protection"}
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-lg mb-4">
          Drag and drop your file{tool.multiple ? "s" : ""} here, or click anywhere to browse from your device
        </p>

        {/* Accepted format badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle/80 border border-surface-border text-slate-300 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span>Accepts: {tool.accept || "PDF"}</span>
          {tool.multiple && <span className="text-rose-400 font-semibold">• Multi-file</span>}
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            type="button"
            className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-950/50 hover:shadow-rose-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <UploadCloud className="w-5 h-5" />
            <span>Select {tool.multiple ? "Files" : "File"}</span>
          </button>

          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isGeneratingSample}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-surface-subtle hover:bg-surface-hover border border-surface-border hover:border-slate-500 text-slate-200 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isGeneratingSample ? "Preparing Sample..." : "Try with Sample File"}</span>
          </button>
        </div>

        {/* Security & format tags */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-surface-border/50 max-w-xl w-full">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>100% Client-Side • Files never leave device</span>
          </div>
          <div className="text-slate-500">•</div>
          <div>No file size limits</div>
          <div className="text-slate-500">•</div>
          <div>Zero wait times</div>
        </div>
      </div>
    </div>
  );
};
