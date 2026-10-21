"use client";

import React from "react";
import { ImageToPdfOptions } from "@/types";
import { Layout, Maximize2, Crop, Sliders } from "lucide-react";

interface ImageToPdfSettingsProps {
  options: ImageToPdfOptions;
  onChange: (options: ImageToPdfOptions) => void;
  fileCount: number;
}

export const ImageToPdfSettings: React.FC<ImageToPdfSettingsProps> = ({
  options,
  onChange,
  fileCount,
}) => {
  return (
    <div className="space-y-6">
      {/* Page Orientation */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Page Orientation
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "auto", label: "Auto Detect" },
              { id: "portrait", label: "Portrait" },
              { id: "landscape", label: "Landscape" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange({ ...options, orientation: item.id })}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                options.orientation === item.id
                  ? "bg-rose-500/20 border-rose-500 text-rose-300"
                  : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page Size */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Page Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "a4", label: "A4 (Standard)" },
              { id: "letter", label: "US Letter" },
              { id: "fit", label: "Fit to Image" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange({ ...options, pageSize: item.id })}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                options.pageSize === item.id
                  ? "bg-rose-500/20 border-rose-500 text-rose-300"
                  : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Margins */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Page Margins
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "none", label: "No Margin" },
              { id: "small", label: "Small (10mm)" },
              { id: "normal", label: "Normal (20mm)" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange({ ...options, margin: item.id })}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                options.margin === item.id
                  ? "bg-rose-500/20 border-rose-500 text-rose-300"
                  : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image Fit */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Image Fit
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "contain", label: "Fit to Page" },
              { id: "fill", label: "Fill Page" },
              { id: "original", label: "Original Size" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange({ ...options, imageFit: item.id })}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                options.imageFit === item.id
                  ? "bg-rose-500/20 border-rose-500 text-rose-300"
                  : "bg-surface-subtle border-surface-border text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Slider */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
        <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-300">
          <span>Image Compression Quality</span>
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
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>Compact (60%)</span>
          <span>Crisp (85%)</span>
          <span>Lossless (100%)</span>
        </div>
      </div>
    </div>
  );
};
