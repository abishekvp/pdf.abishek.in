"use client";

import React from "react";
import { PdfToImageOptions } from "@/types";

interface PdfToImageSettingsProps {
  options: PdfToImageOptions;
  onChange: (options: PdfToImageOptions) => void;
  pageCount?: number;
}

export const PdfToImageSettings: React.FC<PdfToImageSettingsProps> = ({
  options,
  onChange,
  pageCount = 1,
}) => {
  return (
    <div className="space-y-6">
      {/* Format */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Image Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "png", label: "PNG", badge: "Lossless Crisp" },
            { id: "jpeg", label: "JPEG", badge: "Compact Photo" },
            { id: "webp", label: "WebP", badge: "Modern Web" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange({ ...options, format: item.id as any })}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                options.format === item.id
                  ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-md"
                  : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
              }`}
            >
              <div className="font-bold text-sm text-white">{item.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{item.badge}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Resolution Scale */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Rendering Resolution (DPI)
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { scale: 1.0, label: "1x", desc: "72 DPI (Standard)" },
            { scale: 1.5, label: "1.5x", desc: "108 DPI (HD)" },
            { scale: 2.0, label: "2x", desc: "144 DPI (Retina)" },
            { scale: 3.0, label: "3x", desc: "216 DPI (Ultra)" },
          ].map((item) => (
            <button
              key={item.scale}
              type="button"
              onClick={() => onChange({ ...options, scale: item.scale })}
              className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                options.scale === item.scale
                  ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-md"
                  : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
              }`}
            >
              <div className="font-black text-sm text-white">{item.label}</div>
              <div className="text-[9px] text-slate-400">{item.desc.split(" ")[0]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Page Range Selection */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Pages to Convert
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...options, pageRange: "all" })}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              options.pageRange === "all"
                ? "bg-rose-500/20 border-rose-500 text-rose-300"
                : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
            }`}
          >
            All Pages ({pageCount})
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...options, pageRange: "custom" })}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              options.pageRange === "custom"
                ? "bg-rose-500/20 border-rose-500 text-rose-300"
                : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
            }`}
          >
            Custom Range
          </button>
        </div>

        {options.pageRange === "custom" && (
          <div className="pt-2 animate-in fade-in duration-150">
            <input
              type="text"
              placeholder={`e.g. 1-2, 4 (max ${pageCount})`}
              value={options.customPages}
              onChange={(e) => onChange({ ...options, customPages: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-surface-border text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Comma-separated page numbers or ranges, e.g. "1-3, 5"
            </p>
          </div>
        )}
      </div>

      {/* Quality Slider for JPEG/WebP */}
      {options.format !== "png" && (
        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
          <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-300">
            <span>Compression Quality</span>
            <span className="text-rose-400 font-mono">
              {Math.round(options.quality * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.4"
            max="1.0"
            step="0.05"
            value={options.quality}
            onChange={(e) =>
              onChange({ ...options, quality: parseFloat(e.target.value) })
            }
            className="w-full cursor-pointer accent-rose-500"
          />
        </div>
      )}
    </div>
  );
};
